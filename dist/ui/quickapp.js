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
const fs = require("fs-extra");
const path = require("path");
const helper_1 = require("@tarojs/helper");
const wxTransformer = require("@tarojs/transformer-wx");
const common_1 = require("./common");
const buildType = 'quickapp';
function buildForQuickapp(buildData) {
    return __awaiter(this, void 0, void 0, function* () {
        const { appPath, entryFilePath, outputDirName, entryFileName, sourceDir } = buildData;
        console.log();
        console.log(helper_1.chalk.green('开始编译快应用端组件库！'));
        if (!fs.existsSync(entryFilePath)) {
            console.log(helper_1.chalk.red('入口文件不存在，请检查！'));
            return;
        }
        try {
            const outputDir = path.join(appPath, outputDirName, common_1.QUICKAPP_OUTPUT_NAME);
            const outputEntryFilePath = path.join(outputDir, entryFileName);
            const code = fs.readFileSync(entryFilePath).toString();
            const transformResult = wxTransformer({
                code,
                sourcePath: entryFilePath,
                outputPath: outputEntryFilePath,
                isNormal: true,
                isTyped: helper_1.REG_TYPESCRIPT.test(entryFilePath)
            });
            const { components } = common_1.parseEntryAst(transformResult.ast, entryFilePath, buildType);
            const relativePath = path.relative(appPath, entryFilePath);
            helper_1.printLog("copy" /* COPY */, '发现文件', relativePath);
            fs.ensureDirSync(path.dirname(outputEntryFilePath));
            fs.copyFileSync(entryFilePath, path.format({
                dir: path.dirname(outputEntryFilePath),
                base: path.basename(outputEntryFilePath)
            }));
            if (components.length) {
                components.forEach(item => {
                    common_1.copyFileToDist(item.path, sourceDir, outputDir, buildData);
                });
                common_1.analyzeFiles(components.map(item => item.path), sourceDir, outputDir, buildData, buildType);
            }
            common_1.copyAllInterfaceFiles(sourceDir, outputDir, buildData);
        }
        catch (err) {
            console.log(err);
        }
    });
}
exports.buildForQuickapp = buildForQuickapp;
