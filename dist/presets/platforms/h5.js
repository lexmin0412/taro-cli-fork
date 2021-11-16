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
exports.default = (ctx) => {
    ctx.registerPlatform({
        name: 'h5',
        useConfigName: 'h5',
        fn({ config }) {
            return __awaiter(this, void 0, void 0, function* () {
                const { build } = require('../../h5');
                const { appPath, outputPath } = ctx.paths;
                const { isWatch, port } = ctx.runOpts;
                const { emptyDirectory } = ctx.helper;
                const { modifyWebpackChain, modifyBuildAssets, onBuildFinish } = config;
                emptyDirectory(outputPath);
                build(appPath, {
                    watch: isWatch,
                    port
                }, {
                    modifyWebpackChain,
                    modifyBuildAssets,
                    onBuildFinish
                });
            });
        }
    });
};
