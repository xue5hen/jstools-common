let toolsPublic = require('./tools-public')
let jstools = module.exports

// 挂载public环境中的相关函数
for (let k in toolsPublic) {
    jstools[k] = toolsPublic[k]
}

// 如果是node环境，则追加node相关工具函数
let nodeVer = typeof process !== 'undefined' && process.versions && process.versions.node
if (nodeVer) {
    require('./tools-node.js')(jstools)
}
// 如果是web环境，则追加web相关工具函数
if (typeof window !== 'undefined' && window.navigator) {
    require('./tools-web.js')(jstools)
}

// 挂载到全局对象（该操作已交由webpack完成）
// if (typeof global !== 'undefined') {
//     global.$jstools = jstools
// } else if (typeof window !== 'undefined') {
//     window.$jstools = jstools
// }
