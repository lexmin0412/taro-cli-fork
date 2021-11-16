"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function init(kernel, { appPath, projectName, typescript, templateSource, clone, template, css, isHelp }) {
    kernel.run({
        name: 'init',
        opts: {
            appPath,
            projectName,
            typescript,
            templateSource,
            clone,
            template,
            css,
            isHelp
        }
    });
}
exports.default = init;
