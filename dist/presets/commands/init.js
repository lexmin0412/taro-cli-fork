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
    ctx.registerCommand({
        name: 'init',
        optionsMap: {
            '--name [name]': '项目名称',
            '--description [description]': '项目介绍',
            '--typescript': '使用TypeScript',
            '--no-typescript': '使用TypeScript',
            '--template-source [templateSource]': '项目模板源',
            '--clone [clone]': '拉取远程模板时使用git clone',
            '--template [template]': '项目模板',
            '--css [css]': 'CSS预处理器(sass/less/stylus/none)',
            '-h, --help': 'output usage information'
        },
        fn() {
            return __awaiter(this, void 0, void 0, function* () {
                // init project
                const { appPath } = ctx.paths;
                const { projectName, templateSource, clone, template, description, typescript, css } = ctx.runOpts;
                const Project = require('../../create/project').default;
                const project = new Project({
                    projectName,
                    projectDir: appPath,
                    templateSource,
                    clone,
                    template,
                    description,
                    typescript,
                    css
                });
                project.create();
            });
        }
    });
};
