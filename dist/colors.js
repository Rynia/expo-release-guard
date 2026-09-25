"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.colors = void 0;
exports.green = green;
exports.red = red;
exports.yellow = yellow;
exports.cyan = cyan;
exports.bold = bold;
exports.dim = dim;
exports.colors = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
};
function green(text) {
    return `${exports.colors.green}${text}${exports.colors.reset}`;
}
function red(text) {
    return `${exports.colors.red}${text}${exports.colors.reset}`;
}
function yellow(text) {
    return `${exports.colors.yellow}${text}${exports.colors.reset}`;
}
function cyan(text) {
    return `${exports.colors.cyan}${text}${exports.colors.reset}`;
}
function bold(text) {
    return `${exports.colors.bold}${text}${exports.colors.reset}`;
}
function dim(text) {
    return `${exports.colors.dim}${text}${exports.colors.reset}`;
}
//# sourceMappingURL=colors.js.map