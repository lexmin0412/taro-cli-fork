"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const envinfo = require("envinfo");
const util_1 = require("../../util");
exports.default = (ctx) => {
    ctx.registerCommand({
        name: 'info',
        fn() {
            return __awaiter(this, void 0, void 0, function* () {
                const { rn } = ctx.runOpts;
                const { fs, chalk, PROJECT_CONFIG } = ctx.helper;
                const { appPath, configPath } = ctx.paths;
                if (!configPath || !fs.existsSync(configPath)) {
                    console.log(chalk.red(`找不到项目配置文件${PROJECT_CONFIG}，请确定当前目录是 Taro 项目根目录!`));
                    process.exit(1);
                }
                if (rn) {
                    const tempPath = path.join(appPath, '.rn_temp');
                    if (fs.lstatSync(tempPath).isDirectory()) {
                        process.chdir('.rn_temp');
                    }
                }
                yield info({}, ctx);
            });
        }
    });
};
function info(options, ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const npmPackages = ctx.helper.UPDATE_PACKAGE_LIST.concat(['react', 'react-native', 'nervjs', 'expo', 'taro-ui']);
        const info = yield envinfo.run(Object.assign({}, {
            System: ['OS', 'Shell'],
            Binaries: ['Node', 'Yarn', 'npm'],
            npmPackages,
            npmGlobalPackages: ['typescript']
        }, options), {
            title: `Taro CLI ${util_1.getPkgVersion()} environment info`
        });
        console.log(info);
    });
}
