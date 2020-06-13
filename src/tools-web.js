/**
 * JSON字符串格式化
 * @param {string} jsonStr
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
 * @param {string} format
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
 * @param {number} time
 * @param {string} format
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
 * @param {*} fileSize
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
 * HEX转RGB
 * @param {*} hex
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
 * 判断是否微信浏览器
 * @returns {Boolean}
 */
const isWeixinBrowser = () => {
  return /micromessenger/.test(navigator.userAgent.toLowerCase())
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
 * 版本对比函数
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
 * base64解密处理器
 * @param {string} base64Str
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
    jsonParse,
    formatDate,
    formatTime,
    formatFileSize,
    formatNumber,
    HEX2RGB,
    isWeixinBrowser,
    isLeapYear,
    monthDaysCount,
    deepCopy,
    compareVersions,
    base64Decode,
    debounce,
    throttle,
    throttleV2
}
