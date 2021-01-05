const axios = require('axios')
const qs = require('qs')
const {cronValidate} = require('./tools-public-cron')

/**
 * axios方法封装
 * @param {String} config 配置
 * @param {String} contentType Content-Type配置
 */
const ajaxConstructor = (config = {}, contentType) => {
  // 初始化配置
  let baseConfig = {
    timeout: 180000,
    withCredentials: true, // 跨域携带cookies
    headers: {
      'Cache-Control': 'no-cache',
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'brackets' })
    },
    transformResponse: [function (data) {
      return data
    }]
  }
  // 融合自定义配置
  for (let k in (config || {})) {
    if (['headers'].includes(k)) {
      baseConfig.headers = { ...baseConfig.headers, ...config.headers }
    } else {
      baseConfig[k] = config[k]
    }
  }
  // 单独的contentType参数优先级更高
  if (contentType === 'json') {
    baseConfig.headers['Content-Type'] = 'application/json; charset=UTF-8'
  } else if (contentType === 'form') {
    baseConfig.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
  } else {
    baseConfig.headers['Content-Type'] = contentType
  }
  let contentTypeHandler = (headers, type, value) => {
    let name = ''
    if (!(headers instanceof Object)) return ''
    for (let k in (headers || {})) {
      if (String(k).toLocaleLowerCase() === 'content-type') name = k
    }
    if (!name) return ''
    if (type === 'set') {
      headers[name] = value
      return headers
    } else {
      return headers[name] || ''
    }
  }
  let requestPlugin = (config = {}) => {
    config.source = axios.CancelToken.source() // 设置取消函数
    config.cancelToken = config.source.token
    if (!config.params) config.params = {}
    if (config.method === 'post') {
      if (!config.data) config.data = {}
      if (
        (typeof (FormData) !== 'undefined' && config.data instanceof FormData) ||
        contentTypeHandler(config.headers).indexOf('application/json') > -1
      ) {
        // 不执行操作
      } else if (config.qs === undefined || config.qs) {
        config.data = qs.stringify(config.data)
      }
    }
    return config
  }
  let responsePlugin = (response) => {
    response.config.source = null
    if (contentTypeHandler(response.headers).indexOf('application/json') > -1) {
      try {
        response.data = JSON.parse(response.data)
      } catch (e) {
        response.data = { code: 33, msg: '服务端返回数据格式错误！' }
      }
    }
    let errMessageDict = {
      300: '资源已被转移至其他位置',
      301: '请求的资源已被永久移动到新URI',
      302: '请求的资源已被临时移动到新URI',
      305: '请求的资源必须通过代理访问',
      400: '错误资源访问请求',
      401: '资源访问未授权',
      403: '资源禁止访问',
      404: '未找到要访问的资源',
      405: '请更换请求方法',
      406: '无法访问',
      408: '请求超时',
      413: '请求实体过大',
      414: '请求URI过长',
      500: '内部服务器错误',
      501: '未实现',
      503: '服务无法获得',
      504: '接口访问超时'
    }
    let errCode = isNaN(response.status) ? 1 : response.status
    let errMessage = `请求服务过程中发生错误【${errCode}】`
    if (response.status === 200) {
      return response
    } else if ((response.status < 200 || response.status >= 300) && errMessageDict[String(response.status)]) {
      errMessage = `${errMessageDict[String(response.status)]}【${errCode}】`
    }
    response.data = {
      code: 34,
      msg: errMessage || `请求服务过程中发生错误【${errCode}】`
    }
    contentTypeHandler(response.headers, 'set', 'application/json')
    return response
  }
  let instance = axios.create(baseConfig)
  // 并发请求
  instance.all = axios.all
  // 分隔请求
  instance.spread = axios.spread
  // 添加请求拦截器
  instance.interceptors.request.use(requestPlugin, (error) => { return Promise.reject(error) })
  // 添加响应拦截器
  instance.interceptors.response.use(responsePlugin, (error) => { return Promise.reject(error) })
  return instance
}

/**
 * 获得一个axios实例（application/x-www-form-urlencoded）
 */
const ajax = ajaxConstructor()

/**
 * 获得一个axios实例（application/json）
 */
const ajaxJson = (() => {
  let result = ajaxConstructor({}, 'json')
  result.get = ajax.get
  result.delete = ajax.delete
  return result
})()

/**
 * axios返回错误信息处理
 */
const ajaxError = (error, errorMessage) => {
  let message = ''
  if (errorMessage) {
    message = errorMessage
  } else if (typeof (error) === 'string') {
    message = error
  } else if (typeof (Error) !== 'undefined' && error instanceof Error) {
    message = error.message
  } else {
    message = '请求过程中出现问题，请稍后再试【000】'
  }
  let offLine = message === 'Network Error'
  if (typeof navigator === 'object') {
    offLine = (!navigator.onLine) || message === 'Network Error'
  }
  message = offLine ? '网络已断开连接，请连接网络后重试！' : message
  return message
}

/**
 * 获得一个下载实例
 * @param {Object} config 配置
 */
const downloadInstance = (config = {}) => {
  config = config || {}
  return axios.create({
    responseType: 'arraybuffer',
    timeout: 1000*60*60,
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
    },
    ...config
  })
}

/**
 * 核实URL地址是否可用
 * @param {String} url
 * @param {Number} timeout 请求超时时间
 * @returns {Object} URL的相关信息（无可用信息则返回null）
 */
const checkUrlStatus = (url, timeout = 30000) => {
  let result = null
  if (!url) return Promise.resolve(result)
  return new Promise((resolve, reject) => {
    let source = axios.CancelToken.source()
    setTimeout(() => { source.cancel() }, timeout)
    // 请求url地址如果包含中文将其转码后访问
    axios.head(encodeURI(url), { cancelToken: source.token }).then((res) => {
      result = {url, status: res.status, message: '地址可用', success: true}
    }).catch(err => {
      result = {url, status: (err.response || {}).status, message: err.message, success: false}
    }).finally(() => {
      resolve(result)
    })
  })
}

/**
 * 字符串枚举
 * @param {Object} config 配置
 * @param {Array} config/template 模板字符串数组，变量以{{}}标记
 * @param {Array} config/* 其它参数为模板字符串各个变量的枚举字典
 */
const enumStringByTemplate = (config) => {
  config = config || {}
  let template = config.template || []
  let result = [...template]
  let keys = Object.keys(config).filter(k => k !== 'template')
  keys = [...new Set(keys)]
  function fn (temps, key, values) {
    let result = []
    temps.forEach(s => {
      values.forEach(v => {
        let _s = s.replace(new RegExp(`{{${key}}}`, 'g'), v)
        result.push(_s)
      })
    })
    return result
  }
  keys.forEach(k => {
    let values = config[k] || []
    result = fn(result, k, values)
  })
  return result
}

/**
 * JSON字符串格式化
 * @param {String} jsonStr
 * @param {*} defaultValue
 */
const jsonParse = (jsonStr, defaultValue) => {
  let result = defaultValue || {}
  if (jsonStr) {
    try {
      result = JSON.parse(jsonStr)
    } catch (err) {
      console.log(err)
      result = defaultValue || {}
    }
  }
  return result
}

/**
 * 日期格式化
 * @param {Date | string | number} date
 * @param {String} format
 */
const formatDate = (date, format = 'yyyy-MM-dd hh:mm:ss') => {
  if (new Date(date).toString() === 'Invalid Date') return date
  let result = format
  date = new Date(date)
  let dict = {
    'y+': date.getFullYear(),
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  Object.keys(dict).forEach(v => {
    if (new RegExp(`(${v})`).test(result)) {
      if (v === 'y+') {
        result = result.replace(new RegExp(v), dict[v].toString().substr(4 - RegExp.$1.length))
      } else {
        result = result.replace(new RegExp(v), RegExp.$1.length > 1 ? `00${dict[v]}`.substr(dict[v].toString().length) : dict[v])
      }
    }
  })
  return result
}

/**
 * 时间格式化
 * @param {Number} time
 * @param {String} format
 */
const formatTime = (time, format = 'dd天hh小时mm分ss秒') => {
  time = parseInt(time) || 0
  let result = format
  let handles = [
    {reg: 'd+', factor: 86400000},
    {reg: 'h+', factor: 3600000},
    {reg: 'm+', factor: 60000},
    {reg: 's+', factor: 1000},
  ]
  handles.forEach(v => {
    if (new RegExp(`(${v.reg})`).test(result)) {
      let val = Math.floor(time / v.factor)
      time = time % v.factor
      result = result.replace(new RegExp(v.reg), val.toString().padStart(2,0))
    }
  })
  return result
}

/**
 * 格式化文件大小
 * @param {Number} fileSize
 * @returns {String}
 */
const formatFileSize = (fileSize) => {
  fileSize = parseFloat(fileSize)
  // 若参数不合法则直接return
  if (isNaN(fileSize)) { return '0 B' }
  let unitArr = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let index = 0
  let result = ''
  index = Math.floor(Math.log(fileSize) / Math.log(1024))
  result = fileSize / Math.pow(1024, index)
  // 保留的小数位数
  let decimals = (index === 0 ? 0 : 2)
  result = result.toFixed(decimals) + ' ' + unitArr[index]
  return result
}

/**
 * 格式化浮点数
 * @param {Number} num 要格式化的数字
 * @param {Number} n 小数位数
 * @param {String} separator 千分位分隔符
 * @returns {String}
 */
const formatDecimal = (num, n = 2, separator = '') => {
  let result = ''
  num = parseFloat(num)
  n = parseInt(n)
  n = n > 0 ? n : 0
  // 若参数不合法则直接return
  if (!isFinite(num)) return result
  result = num.toFixed(n)
  if (separator) {
    let l = result.split('.')[0].split('').reverse()
    let r = result.split('.')[1] || ''
    let t = ''
    for (let i = 0; i < l.length; i++) {
      t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '')
    }
    result = t.split('').reverse().join('') + '.' + r
  }
  return result
}

/**
 * 随机生成一个UUID
 */
const getUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
  })
}

/**
 * HEX转RGB
 * @param {String} hex '#99ff66'
 * @returns {Array} [R,G,B]
 */
const HEX2RGB = (hex) => {
  hex = hex.substr(1)
  let result = []
  for (let i = 0; i < 3; i++) {
    result[i] = parseInt(hex.substr(i * 2, 2), 16)
  }
  return result
}

/**
 * TXT转SVG
 * @param {Object}
 * @param {String} params/content 要转换的文本内容
 * @param {Number} params/width SVG图片宽度
 * @param {Number} params/height SVG图片高度
 * @param {Number} params/fontSize 字号
 * @param {String} params/fontFamily 字体
 * @param {String} params/color 文字颜色
 * @param {Number} params/opacity 透明度0-1
 * @param {Number} params/x 横轴图片中心百分比数（50代表50%）
 * @param {Number} params/y 纵轴图片中心百分比数（50代表50%）
 * @param {Number} params/rotate 旋转角度
 */
const TXT2SVG = (params) => {
  params = params || {}
  let content = params.content || ''
  let width = isNaN(parseFloat(params.width)) ? 300 : parseFloat(params.width)
  let height = isNaN(parseFloat(params.height)) ? 150 : parseFloat(params.height)
  let fontSize = isNaN(parseFloat(params.fontSize)) ? 14 : parseFloat(params.fontSize)
  let fontFamily = params.fontFamily || ''
  let color = params.color || '#a2a9b6'
  let opacity = isNaN(parseFloat(params.opacity)) ? 1 : parseFloat(params.opacity)
  let x = isNaN(parseFloat(params.x)) ? 50 : parseFloat(params.x)
  let y = isNaN(parseFloat(params.y)) ? 50 : parseFloat(params.y)
  let rotate = parseFloat(params.rotate) || 0
  let size = ` width="${width}" height="${height}"`
  let fill = ` fill="${color}"`
  let fillOpacity = ` fill-opacity="${opacity}"`
  let transform = ` transform="rotate(${rotate}, ${width / 2} ${height / 2})"`
  fontFamily = ` font-family="${fontFamily}"`
  if (color === '#000000') { fill = '' }
  if (opacity === 1) { fillOpacity = '' }
  if (rotate === 0) { transform = '' }
  let originSvg = `<svg${size} xmlns="http://www.w3.org/2000/svg"><text x="${x}%" y="${y}%" font-size="${fontSize}"${fill}${fillOpacity}${fontFamily}${transform} text-anchor="middle" dominant-baseline="middle">${content}</text></svg>`
  let encodeSvg = `data:image/svg+xml,${originSvg.replace(/\n/g, '').replace(/"/g,"'").replace(/%/g,'%25').replace(/#/g,'%23').replace(/{/g,'%7B').replace(/}/g,'%7D').replace(/</g,'%3C').replace(/>/g,'%3E')}`
  return {origin: originSvg, encode: encodeSvg}
}

/**
 * 判断是否是身份证号码
 * @param {String} code 身份证号码
 * @returns {Boolean}
 */
const isCardID = (code) => {
  let result = true
  let tip = ''
  // 18位身份证需要验证最后一位校验位
  if (code.length === 18) {
    code = code.split('')
    //∑(ai×Wi)(mod 11)
    //加权因子
    let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
    //校验位
    let parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]
    let sum = 0
    let ai = 0
    let wi = 0
    for (let i = 0; i < 17; i++) {
      ai = code[i]
      wi = factor[i]
      sum += ai * wi
    }
    let last = parity[sum % 11]
    if (parity[sum % 11] != code[17]) {
      tip = '校验位错误'
      result = false
    }
  }else{
    result = false
  }
  return result
}

/**
 * 判断姓名是否合法
 * @param {String} value 姓名
 * @returns {Boolean}
 */
const isRealName = (value) => {
  return /^[\u4e00-\u9fa5a-zA-Z0-9·]+$/.test(value)
}

/**
 * 判断是否是手机号
 * @param {*} value 手机号
 * @returns {Boolean}
 */
const isMobileNumber = (value) => {
  return /^1[0-9]{10}$/.test(value)
}

/**
 * 判断金额格式是否正确
 * @param {*} value 金额
 * @returns {Boolean}
 */
const isAmount = (value) => {
  return /^[0-9]+([.]{1}[0-9]{1,2})?$/.test(value)
}

/**
 * 判断邮箱格式是否正确
 * @param {*} value 邮箱
 * @returns {Boolean}
 */
const isEmail = (value) => {
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(value)
}

/**
 * 判断电话号码格式是否正确
 * @param {*} value 电话号码
 * @returns {Boolean}
 */
const isPhoneNumber = (value) => {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(value)
}

/**
 * 校验URL是否正确
 * @param {*} value URL
 * @returns {Boolean}
 */
const isURL = (value) => {
  return /^http[s]?:\/\/.*/.test(value)
}

/**
 * 判断某年是否是闰年
 * @param {*} year 年份
 * @returns {Boolean}
 */
const isLeapYear = (year) => {
  year = parseInt(year)
  // 若参数不合法则直接return
  if (isNaN(year)) { return '' }
  /**
   * 判断闰年条件:
   * 1.普通年能被4整除且不能被100整除的为闰年。如2004年就是闰年,1900年不是闰年
   * 2.世纪年能被400整除的是闰年。如2000年是闰年，1900年不是闰年
   */
  return !(year % (year % 100 ? 4 : 400))
}

/**
 * 判断某月有多少天
 * @param {*} month 月份
 * @param {*} isLeapYear 是否是闰年
 * @returns {Number} 天数
 */
const monthDaysCount = (month, isLeapYear) => {
  month = parseInt(month)
  // 若参数不合法则直接return
  if (isNaN(month)) { return '' }
  let result = 30
  if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
    result = 31
  } else if (month === 2) {
    result = isLeapYear ? 29 : 28
  }
  return result
}

/**
* 判断数据类型
* @param {*} param
*/
const typeOf = (param) => {
  return Object.prototype.toString.call(param).slice(8,-1)
}

/**
 * 简单深拷贝
 * @param {*} data
 */
const deepCopy = (data) => {
    let result = data
    try {
        result = JSON.parse(JSON.stringify(data))
    } catch (err) {
        console.log(err)
    }
    return result
}

/**
 * 深拷贝
 * @param {*} data
 */
const deepCopyV2 = (data) => {
  let dataType = typeOf(data)
  let result
  if (dataType ==='Array') {
    result = []
    for(let i = 0, len = data.length; i < len; i++){
      result.push(deepCopyV2(data[i]))
    }
  } else if (dataType ==='Object') {
    result = {}
    for(let key in data){
      result[key] = deepCopyV2(data[key])
    }
  } else {
    result = data
  }
  return result
}

/**
 * 克隆
 * @param {*} data
 */
const clone = deepCopyV2

/**
* 数组元素交换位置
* @param {Array} arr 数组
* @param {Number} index1 添加项目的位置
* @param {Number} index2 删除项目的位置
*/
const swapArray = (arr, index1, index2) => {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0]
  return arr
}

/**
 * 版本号比较
 * @param {Array} versionArr1 版本1
 * @param {Array} versionArr2 版本2
 */
const compareVersions = (versionArr1, versionArr2) => {
  if (!(versionArr1 instanceof Array && versionArr2 instanceof Array)) return ''
  if (versionArr1.join('.') === versionArr2.join('.')) return 'equal'
  for(let index = 0; index < versionArr1.length; index++) {
    let versionItemA = Number(versionArr1[index]),
        versionItemB = Number(versionArr2[index])
    if (versionItemA > versionItemB) {
        return ['biggest','bigger','big','big'][index]
    } else if (versionItemA < versionItemB) {
        return 'small'
    }
  }
  return ''
}

/**
 * 生成指定范围内的随机数
 * @param {Number} min 下限
 * @param {Number} max 上限
 * @param {Boolean} decimal 是否为浮点数
 */
const random = (min, max, decimal) => {
  let result = Math.random() * (max - min) + min
  result = decimal ? result : parseInt(result)
  return result
}

/**
 * 生成随机数字字母字符串
 * @param {Number} len 字符串长度
 */
const randomString = (len) => {
  let result = ''
  while(result.length < len){
    result += Math.random().toString(36).substr(2)
  }
  return result.substr(result.length - len)
}

/**
 * 函数防抖 (只执行最后一次点击)
 * @param fn
 * @param delay
 * @returns {Function}
 * @constructor
 */
const debounce = (fn, t) => {
  let timer = null
  let delay = t || 500
  return function () {
    let context = this, args = arguments
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(context, args)
    }, delay)
  }
}

/**
 * 函数节流 (在interval时间段内只执行一次&多次触发延迟)
 * @param fn
 * @param interval
 * @returns {Function}
 * @constructor
 */
const throttle = (fn, t) => {
  let timer = null
  let t_start
  let interval = t || 1000
  return function () {
    let context = this, args = arguments, t_curr = +new Date()
    clearTimeout(timer)
    if (!t_start) { t_start = t_curr }
    if (t_curr - t_start >= interval) {
      fn.apply(context, args)
      t_start = t_curr
    } else {
      timer = setTimeout(function () {
        fn.apply(context, args)
      }, interval)
    }
  }
}

/**
 * 函数节流 (在interval时间段内只执行一次&多次触发丢弃)
 * @param fn
 * @param interval
 * @returns {Function}
 * @constructor
 */
const throttleV2 = (fn, t) => {
  let t_start
  let interval = t || 1000
  return function () {
    let context = this, args = arguments, t_curr = +new Date()
    if (!t_start || (t_curr - t_start >= interval)) {
      fn.apply(context, args)
      t_start = t_curr
    }
  }
}

export default module.exports = {
  ajaxConstructor,
  ajax,
  ajaxJson,
  ajaxError,
  downloadInstance,
  checkUrlStatus,
  enumStringByTemplate,
  jsonParse,
  formatDate,
  formatTime,
  formatFileSize,
  formatDecimal,
  getUUID,
  HEX2RGB,
  TXT2SVG,
  isCardID,
  isRealName,
  isMobileNumber,
  isAmount,
  isEmail,
  isPhoneNumber,
  isURL,
  isLeapYear,
  monthDaysCount,
  cronValidate,
  typeOf,
  deepCopy,
  deepCopyV2,
  clone,
  swapArray,
  compareVersions,
  random,
  randomString,
  debounce,
  throttle,
  throttleV2
}
