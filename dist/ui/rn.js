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
const fs = require("fs-extra");
const wxTransformer = require("@tarojs/transformer-wx");
const helper_1 = require("@tarojs/helper");
const rn_bak_1 = require("../rn_bak");
const common_1 = require("./common");
const buildType = 'rn';
function buildForRN(uiIndex = 'index', buildData) {
    return __awaiter(this, void 0, void 0, function* () {
        const { appPath } = buildData;
        const compiler = new rn_bak_1.Compiler(appPath);
        console.log();
        console.log(helper_1.chalk.green('开始编译 RN 端组件库！'));
        yield compiler.buildTemp(); // complie to rn_temp
        yield buildRNLib(uiIndex, buildData);
    });
}
exports.buildForRN = buildForRN;
function buildRNLib(uiIndex, buildData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { appPath, outputDirName, sourceDir, rnTempPath } = buildData;
            const outputDir = path.join(appPath, outputDirName, common_1.RN_OUTPUT_NAME);
            const tempEntryFilePath = helper_1.resolveScriptPath(path.join(sourceDir, uiIndex), buildType);
            const baseEntryFilePath = helper_1.resolveScriptPath(path.join(rnTempPath, uiIndex), buildType); // base by rn_temp
            const outputEntryFilePath = path.join(outputDir, path.basename(tempEntryFilePath));
            const code = fs.readFileSync(tempEntryFilePath).toString();
            const transformResult = wxTransformer({
                code,
                sourcePath: tempEntryFilePath,
                outputPath: outputEntryFilePath,
                isNormal: true,
                isTyped: helper_1.REG_TYPESCRIPT.test(tempEntryFilePath)
            });
            const { styleFiles, components, code: generateCode } = common_1.parseEntryAst(transformResult.ast, baseEntryFilePath, buildType);
            const relativePath = path.relative(appPath, tempEntryFilePath);
            tempEntryFilePath.replace(path.extname(tempEntryFilePath), '.js');
            helper_1.printLog("copy" /* COPY */, '发现文件', relativePath);
            fs.ensureDirSync(path.dirname(outputEntryFilePath));
            fs.writeFileSync(outputEntryFilePath, generateCode);
            if (components.length) {
                components.forEach(item => {
                    common_1.copyFileToDist(item.path, rnTempPath, outputDir, buildData);
                });
                common_1.analyzeFiles(components.map(item => item.path), rnTempPath, outputDir, buildData, buildType);
            }
            if (styleFiles.length) {
                styleFiles.forEach(item => {
                    common_1.copyFileToDist(item, rnTempPath, path.join(appPath, outputDirName), buildData);
                });
                common_1.analyzeStyleFilesImport(styleFiles, rnTempPath, path.join(appPath, outputDirName), buildData, buildType);
            }
        }
        catch (err) {
            console.log(err);
        }
    });
}
exports.buildRNLib = buildRNLib;
