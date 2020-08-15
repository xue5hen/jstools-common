
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
 * 判断是否是移动端浏览器
 * @returns {Boolean}
 */
const isMobileBrowser = () => {
  let result = false
  let mbModels = 'Android;webOS;iPhone;iPad;iPod;SymbianOS;BlackBerry;Windows Phone'.split(';')
  let ua = navigator.userAgent
  for (let i = 0; i < mbModels.length; i++) {
    if (ua.indexOf(mbModels[i]) > -1) {
      result = true
      break
    }
  }
  return result
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

/**
 * 将数据字符串转换为文件对象
 * @param {String} dataUrl
 * @param {String} type 1(file对象)/2(blob对象)
 * @param {String} fileName
 * @returns {File/Blob}
 */
const dataUrl2File = (dataUrl, type, fileName) => {
  let arr = dataUrl.split(',')
  let mime = arr[0].match(/:(.*?);/)[1]
  let bstr = atob(arr[1])
  let n = bstr.length
  let u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  if (type === 1) {
    // 转换成file对象
    return new File([u8arr], fileName, { type: mime })
  } else {
    // 转换成成blob对象
    return new Blob([u8arr], { type: mime })
  }
}

/**
 * 获取Url地址中参数
 * @param {String} url 可有可无
 */
const getUrlParams = (url) => {
  url = url || location.href
  let result = {}
  let search = url.split('?')[1] || ''
  let params = search.split('&')
  params.forEach(v => {
    let [key, val] = v.split('=')
    key && (result[key] = val || '')
  })
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
  isMobileBrowser,
  base64Decode,
  dataUrl2File,
  getUrlParams
}

module.exports = (jstools) => {
  for (let k in toolsWeb) {
      jstools[k] = toolsWeb[k]
  }
}
