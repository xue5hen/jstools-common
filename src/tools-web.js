
let toolsPublic = require('./tools-public.js')

/**
 * 下载文件 - a标签
 * @param {String} from 源地址
 * @param {String} to 目标地址/文件名
 */
const downloadFileByA = (options) => {
  let from = ''
  let to = ''
  if (toolsPublic.typeOf(options).toLowerCase() === 'string') {
    from = options
  } else{
    from = (options || {}).from
    to = ((options || {}).to || '').split(/[\\|\/]/g).pop()
  }
  let ele = document.createElement('a')
  ele.download = to
  ele.style.display = 'none'
  ele.href = from
  document.body.appendChild(ele)
  ele.click()
  document.body.removeChild(ele)
}

/**
 * 下载文件 - iframe标签
 * @param {String} from 源地址
 */
const downloadFileByIframe = (options) => {
  let from = ''
  if (toolsPublic.typeOf(options).toLowerCase() === 'string') {
    from = options
  } else{
    from = (options || {}).from
  }
  let ele = document.createElement('iframe')
  ele.style.display = 'none'
  ele.src = from
  document.body.appendChild(ele)
}

/**
 * 下载文件 - form标签
 * @param {String} from 源地址
 */
const downloadFileByForm = (options) => {
  let from = ''
  if (toolsPublic.typeOf(options).toLowerCase() === 'string') {
    from = options
  } else{
    from = (options || {}).from || ''
  }
  let ele = document.createElement('form')
  ele.style.display = 'none'
  ele.setAttribute ? ele.setAttribute('method', 'get') : (ele.method = 'get')
  ele.setAttribute ? ele.setAttribute('target', '_blank') : (ele.target = '_blank')
  ele.setAttribute ? ele.setAttribute('action', from) : (ele.action = from)
  document.body.appendChild(ele)
  ele.submit()
}

/**
 * 保存数据流到文件 - blob
 * @param {Blob} data 数据
 * @param {String} fileName 文件名
 */
const saveFileByBlob = (options) => {
  let {data, fileName} = options || {}
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(data, fileName)
  } else {
    window.URL = window.URL || window.webkitURL
    let ele = document.createElement('a')
    ele.href = window.URL.createObjectURL(data)
    ele.download = fileName
    ele.click()
    window.URL.revokeObjectURL(ele.href)
  }
}

/**
 * 下载文件
 * @param {String} from 源地址
 * @param {String} to 目标地址/文件名
 * @param {Function} progressCallback 进度回调函数
 * @param {Object} config 其它配置
 */
const downloadFile = (options) => {
  let {from, to, progressCallback, config} = options || {}
  let responseType = (config || {}).responseType || 'blob'
  let fileName = (to || '').split(/[\\|\/]/g).pop()
  return new Promise((resolve, reject) => {
      toolsPublic.downloadInstance({
        url: from,
        responseType,
        onDownloadProgress: progressCallback
      }).request(config || {}).then((res) => {
        let data = res.data
        // if (responseType === 'arraybuffer') {
        //   data = String.fromCharCode.apply(null, new Uint8Array(data))
        // }
        let blob = new Blob([data], {type: 'application/octet-stream'})
        saveFileByBlob({data: blob, fileName})
        resolve()
      }).catch((err) => {
        console.log(err)
        reject('error')
      })
  }).catch((err) => {
      console.log(err)
      return 'error'
  })
}

/**
 * Number转千位分隔符字符串
 * @param {Number} num
 * @returns {String}
 */
const formatNumber = (num) => {
  if (isNaN(parseFloat(num)) || !isFinite(num)) {
    return num
  }
  let result = ''
  if (window.Intl && Intl.NumberFormat) {
    result = new Intl.NumberFormat('en-US', {}).format(num)
  } else if (Number.toLocaleString) {
    result = num.toLocaleString('en-US')
  } else {
    let temp = String(num).split('.')
    result = temp[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,')
    result += temp[1] ? ('.' + temp[1]) : ''
  }
  return result
}

/**
 * 判断是否微信浏览器
 * @returns {Boolean}
 */
const isWeixinBrowser = () => {
  return /micromessenger/.test(navigator.userAgent.toLowerCase())
}

/**
 * base64解密处理器
 * @param {String} base64Str
 */
const base64Decode = (base64Str) => {
  let result = ''
  if (base64Str) {
    try {
      result = atob(base64Str)
    } catch (err) {
      console.log(err)
      result = ''
    }
  }
  return result
}

let toolsWeb = {
  ...toolsPublic,
  downloadFileByA,
  downloadFileByIframe,
  downloadFileByForm,
  downloadFile,
  saveFileByBlob,
  formatNumber,
  isWeixinBrowser,
  base64Decode
}

module.exports = (jstools) => {
  for (let k in toolsWeb) {
      jstools[k] = toolsWeb[k]
  }
}
