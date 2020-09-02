
let toolsPublic = require('./tools-public.js')
let polyfill = require('./tools-web-polyfill.js')

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

/**
 * 事件绑定&触发&解除
 * @param {String} eventName 事件名称
 * @param {Function} callback 回调函数
 * @param {Boolean} isBubbling 是否冒泡
 * @param {Boolean} cancelable 是否阻止浏览器的默认行为
 * @param {Object} argument 自定义传参
 * 示例 myEvent.dispatchEvent('召唤兵器', {name: 'jstools-common'})
 */
const myEvent = {
  dispatchEvent: (eventName, argument, isBubbling, cancelable) => {
    let event = document.createEvent('HTMLEvents')
    event.initEvent(eventName, isBubbling, cancelable)
    Object.assign(event, argument)
    document.dispatchEvent(event)
    return event.result
  },
  addEventListener: (eventName, callback) => {
    document.addEventListener(eventName, callback)
  },
  removeEventListener: (eventName, callback) => {
    document.removeEventListener(eventName, callback)
  }
}

/**
 * 网页截图并保存为PDF文件
 * @param {Object} options 参数配置
 * @param {String} options/catalogues 封面对应的dom元素数组
 * @param {String} options/contents 内容页对应的dom元素数组
 * @param {String} options/clipClass 可裁切元素的类名
 * @param {String} options/flipClass 需另起一页绘制的元素的类名
 * @param {String} options/fileName 要保存的截图名称
 * @param {Number} options/paperWidth 有效宽度（默认参考A4纸，取值297）
 * @param {Number} options/paperHeight 有效高度（默认参考A4纸，取值210）
 * @param {Number} options/availWidth 有效宽度（默认参考A4纸，取值287）
 * @param {Number} options/availHeight 有效高度（默认参考A4纸，取值185）
 * @param {Number} options/pageStartTop 页面内容纵向开始位置（默认参考A4纸，取值10）
 * @param {Number} options/pageStartLeft 页面内容横向开始位置（默认参考A4纸，取值5）
 * @param {Number} options/pageNumTop 页码纵向位置（默认参考A4纸，取值280）
 * @param {Number} options/pageNumLeft 页码横向位置（默认参考A4纸，取值205）
 * @param {Number} options/fontSize 文本字号大小（默认12）
 */

const screenshot2pdf = (options = {}) => {
  options = options || {}
  let html2canvas = options.html2canvas || window.html2canvas
  let jsPDF = options.jsPDF || (window.jspdf || {}).jsPDF
  let catalogues = [...(options.catalogues || [])]
  let contents = [...(options.contents || [])]
  let clipClass = options.clipClass || ''
  let flipClass = options.flipClass || ''
  let fileName = options.fileName || 'screenshot'
  let paperWidth = options.paperWidth || 297
  let paperHeight = options.paperHeight || 210
  let availWidth = options.availWidth || 287
  let availHeight = options.availHeight || 185
  let pageStartTop = options.pageStartTop || 10
  let pageStartLeft = options.pageStartLeft || 5
  let pageNumTop = options.pageNumTop || 280
  let pageNumLeft = options.pageNumLeft || 205
  let fontSize = options.fontSize || 12
  if (!html2canvas) return Promise.reject('need input plugin method: html2canvas')
  if (!jsPDF) return Promise.reject('need input plugin method: jsPDF')
  if (!catalogues.length && !contents.length) return Promise.reject('tasks is empty')
  let _scrollTop = document.querySelector('html').scrollTop // 记录滚动条位置，程序执行完成后恢复
  let _scale = [...catalogues, ...contents][0].getBoundingClientRect().width / availWidth // dom文档和纸张之间的比例
  let _pageMaxHeight = _scale * availHeight // 每一页最大容纳的dom高度
  let _pageUsedHeight = 0 // 当前页面已经绘制的图像高度
  let _offset = 0
  let cataloguesPageList = [[]]
  let contentsPageList = [[]]
  let cataloguesTaskList = []
  let contentsTaskList = []
  function doms2pages (doms) {
    let pageList = [[]]
    let taskList = []
    doms.forEach((v, i) => {
      let vInfo = v.getBoundingClientRect()
      let {width, height} = vInfo
      let canClip = clipClass ? [...v.classList].includes(clipClass) : false
      let needFlip = flipClass ? [...v.classList].includes(flipClass) : false
      if (canClip && height > _pageMaxHeight) {
        let __ht = 0 // 已绘制高度
        let __hb = height // 待绘制高度
        let __s = _pageMaxHeight - _pageUsedHeight // 当前页面富余量
        let __c = 0 // 裁切第几次
        let __h = __s // 裁切高度
        while (__hb > 0) {
          // html2canvas
          if (__c === 0) {
            __h = needFlip ? _pageMaxHeight : __s
          } else {
            __h = Math.min(__hb, _pageMaxHeight)
          }
          taskList.push(
            html2canvas(v, {
              width, height: __h,
              y: (vInfo.y || vInfo.top) + __ht,
              x: vInfo.x || vInfo.left,
              _scale, allowTaint: true
            })
          )
          // page
          if (_pageUsedHeight + __h <= _pageMaxHeight) {
            pageList[pageList.length - 1].push(i + _offset)
            _pageUsedHeight += __h
          } else if (_pageUsedHeight === 0) {
            pageList[pageList.length - 1].push(i + _offset)
            pageList[pageList.length] = []
          } else {
            pageList[pageList.length] = []
            pageList[pageList.length - 1].push(i + _offset)
            _pageUsedHeight = __h
          }
          if (__hb > _pageMaxHeight) {
            __c++
            _offset++
          }
          __ht += __h
          __hb -= __h
        }
      } else {
        // html2canvas
        taskList.push(
          html2canvas(v, {
            width, height,
            y: vInfo.y || vInfo.top,
            x: vInfo.x || vInfo.left,
            _scale, allowTaint: true
          })
        )
        // page
        if (_pageUsedHeight + height <= _pageMaxHeight) {
          pageList[pageList.length - 1].push(i + _offset)
          _pageUsedHeight += height
        } else if (_pageUsedHeight === 0) {
          pageList[pageList.length - 1].push(i + _offset)
          pageList[pageList.length] = []
        } else {
          pageList[pageList.length] = []
          pageList[pageList.length - 1].push(i + _offset)
          _pageUsedHeight = height
        }
      }
    })
    return {pageList, taskList}
  }
  document.querySelector('html').scrollTop = 0 // 截图前需将滚动条重置为0
  let _resultCatalogues = doms2pages(catalogues)
  cataloguesPageList = _resultCatalogues.pageList
  cataloguesTaskList = _resultCatalogues.taskList
  let _resultContents = doms2pages(contents)
  contentsPageList = _resultContents.pageList
  contentsTaskList = _resultContents.taskList
  return Promise.all([...cataloguesTaskList, ...contentsTaskList]).then((canvasArr) => {
    let canvasArrCatalogues = canvasArr.slice(0, cataloguesTaskList.length)
    let canvasArrContents = canvasArr.slice(cataloguesTaskList.length)
    let doc = new jsPDF('landscape')
    let docIndex = 0
    doc.setFontSize(fontSize)
    /**
     * PDF页面组装
     * @param {Array} pageList 散装页面列表
     * @param {Number} _x 页面内容横向开始位置
     * @param {Number} _y 页面内容纵向开始位置
     * @param {Boolean} isCoverPage 是否为封面
     */
    function pagesPack (pageList, canvasList, isCoverPage) {
      pageList.forEach((v, i) => {
        if (v.length === 0) return
        if (docIndex > 0) doc.addPage()
        let _x = pageStartLeft
        let _y = pageStartTop
        let _w = availWidth
        if (isCoverPage) {
          _x = _y = 0
          _w = paperWidth
        }
        v.forEach(val => {
          let canvas = canvasList[val]
          let _r = canvas.width / _w
          let _h = canvas.height / (_r || 1)
          doc.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', _x, _y, _w, _h)
          _y += _h
        })
        if (!isCoverPage) {
          doc.text(`${i + 1} / ${pageList.length}`, pageNumTop, pageNumLeft)
        }
        console.log(docIndex, 'pageList', v, i, pageList.length)
        docIndex++
      })
    }
    pagesPack(cataloguesPageList, canvasArrCatalogues, true)
    pagesPack(contentsPageList, canvasArrContents, false)
    doc.save(`${fileName}.pdf`)
    document.querySelector('html').scrollTop = _scrollTop // 截图后将滚动条恢复
  })
}

let toolsWeb = {
  ...toolsPublic,
  ...polyfill,
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
  getUrlParams,
  myEvent,
  screenshot2pdf
}

module.exports = (jstools) => {
  for (let k in toolsWeb) {
      jstools[k] = toolsWeb[k]
  }
}
