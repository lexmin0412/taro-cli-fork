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
const helper_1 = require("@tarojs/helper");
const creator_1 = require("./creator");
const init_1 = require("./init");
const fetchTemplate_1 = require("./fetchTemplate");
class Page extends creator_1.default {
    constructor(options) {
        super();
        this.rootPath = this._rootPath;
        this.conf = Object.assign({
            projectDir: '',
            projectName: '',
            template: '',
            description: ''
        }, options);
        this.conf.projectName = path.basename(this.conf.projectDir);
    }
    getPkgPath() {
        const projectDir = this.conf.projectDir;
        const pkgPath = path.join(projectDir, 'package.json');
        if (fs.existsSync(pkgPath)) {
            return pkgPath;
        }
        return path.join(projectDir, 'client', 'package.json');
    }
    getTemplateInfo() {
        const pkg = fs.readJSONSync(this.getPkgPath());
        const templateInfo = pkg.templateInfo || {
            name: 'default',
            css: 'none',
            typescript: false
        };
        templateInfo.template = templateInfo.name;
        delete templateInfo.name;
        this.conf = Object.assign(this.conf, templateInfo);
    }
    fetchTemplates() {
        return __awaiter(this, void 0, void 0, function* () {
            const homedir = helper_1.getUserHomeDir();
            let templateSource = helper_1.DEFAULT_TEMPLATE_SRC;
            if (!homedir)
                helper_1.chalk.yellow('找不到用户根目录，使用默认模版源！');
            const taroConfigPath = path.join(homedir, helper_1.TARO_CONFIG_FLODER);
            const taroConfig = path.join(taroConfigPath, helper_1.TARO_BASE_CONFIG);
            if (fs.existsSync(taroConfig)) {
                const config = yield fs.readJSON(taroConfig);
                templateSource = config && config.templateSource ? config.templateSource : helper_1.DEFAULT_TEMPLATE_SRC;
            }
            else {
                yield fs.createFile(taroConfig);
                yield fs.writeJSON(taroConfig, { templateSource: helper_1.DEFAULT_TEMPLATE_SRC });
                templateSource = helper_1.DEFAULT_TEMPLATE_SRC;
            }
            // 从模板源下载模板
            yield fetchTemplate_1.default(templateSource, this.templatePath(''));
        });
    }
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            const date = new Date();
            this.getTemplateInfo();
            this.conf.date = `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}`;
            if (!fs.existsSync(this.templatePath(this.conf.template))) {
                yield this.fetchTemplates();
            }
            this.write();
        });
    }
    write() {
        init_1.createPage(this, this.conf, () => {
            console.log(`${helper_1.chalk.green('✔ ')}${helper_1.chalk.grey(`创建页面 ${this.conf.pageName} 成功！`)}`);
        })
            .catch(err => console.log(err));
    }
}
exports.default = Page;
