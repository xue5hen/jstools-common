  该类方法在WEB环境和NODE环境均可使用。

## checkUrlStatus

  核实URL地址是否可用。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| url | 要检测的url地址 | true | String |  |
| timeout | 请求超时时间 | false | Number | 30000 |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| Promise | Promise接收一个参数，内容为URL的相关信息，无可用信息则返回null | {url: '', status: 200, message: '地址可用', success: true} |

* 代码示例
```js
$jstools.checkUrlStatus('http://www.baidu.com').then((res) => {
    console.log('网站检测结果：', res)
})
```

## enumStringByTemplate

  字符串枚举。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| config | 参数配置 | true | Object | {} |
| config.template | 模板字符串数组，变量以{{}}标记 | true | String [] | [] |
| config.* | 其它参数为模板字符串各个变量的枚举字典 | true | String [] | [] |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| Array | 根据配置参数枚举的字符串数组 | ['x1', 'x2'] |

* 代码示例
```js
let result = $jstools.enumStringByTemplate({
    template: ['x{{num1}}-y{{num2}}-z{{num1}}'],
    num1: [1, 2, 3],
    num2: ['5']
})
console.log('枚举结果：', result)
```

## formatDate

  日期格式化。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| date | 日期 | true | Date/String/Number |  |
| format | 格式化模板字符串 | false | String | yyyy-MM-dd hh&#58;mm&#58;ss |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| String | 格式化后的日期字符串 | 1970-01-01 08&#58;00&#58;01 |

* 代码示例
```js
let result = $jstools.formatDate(1111)
console.log('日期格式化：', result)
```

## formatTime

  时间格式化。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| time | 毫秒数 | true | Number | 0 |
| format | 格式化模板字符串 | false | String | dd天hh小时mm分ss秒 |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| String | 格式化后的时间字符串 | 00天00小时00分03秒 |

* 代码示例
```js
let result = $jstools.formatTime(3000)
console.log('时间格式化：', result)
```

## formatFileSize

  格式化文件大小。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| fileSize | 文件大小，单位B | true | Number | 0 |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| String | 格式化后的文件大小字符串 | 2.86 MB |

* 代码示例
```js
let result = $jstools.formatFileSize(3000000)
console.log('格式化文件大小：', result)
```

## formatDecimal

  格式化浮点数。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| num | 要格式化的数字 | true | Number |  |
| n | 小数位数 | false | Number | 0 |
| separator | 千分位分隔符 | false | String |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| String | 格式化后的浮点数字符串 | 1,234,567.80 |

* 代码示例
```js
let result = $jstools.formatDecimal(1234567.8, 2, ',')
console.log('格式化浮点数：', result)
```

## getUUID

  随机生成一个UUID。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| 无 |  |  |  |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| String | UUID字符串 | 01cae4cd-9c99-4d3e-8580-fa34ea9eb92e |

* 代码示例
```js
let result = $jstools.getUUID()
console.log('UUID字符串：', result)
```

## HEX2RGB

  HEX转RGB。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| hex | 要解析的字符串 | true | String |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| Array | [R,G,B] | [153, 255, 102] |

* 代码示例
```js
let result = $jstools.HEX2RGB('#99ff66')
console.log('转换结果：', result)
```

## TXT2SVG

  TXT转SVG。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| options.content | 要转换的文本内容 | true | String |  |
| options.width | SVG图片宽度 | false | Number |  |
| options.height | SVG图片高度 | false | Number |  |
| options.fontSize | 字号 | false | Number |  |
| options.fontFamily | 字体 | false | String |  |
| options.color | 文字颜色 | false | String |  |
| options.opacity | 透明度0-1 | false | Number |  |
| options.x | 横轴图片中心百分比数（50代表50%） | false | Number |  |
| options.y | 纵轴图片中心百分比数（50代表50%） | false | Number |  |
| options.rotate | 旋转角度 | false | Number |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| result.origin | 原始SVG字符串，适用于页面DOM |  |
| result.encodeSvg | 编码后的SVG字符串，适用于backgroundImage |  |

* 代码示例
```js
let result = $jstools.TXT2SVG('视频无法打开')
console.log('转换结果：', result)
```

## isCardID

  判断是否是身份证号码。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| code | 身份证号码 | true | String |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| Boolean | 是/否 |  |

* 代码示例
```js
let result = $jstools.isCardID('12345678')
console.log('判断是否是身份证号码：', result)
```

## isRealName

  判断姓名是否合法。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| value | 姓名 | true | String |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| Boolean | 是/否 |  |

* 代码示例
```js
let result = $jstools.isRealName('张三')
console.log('判断姓名是否合法：', result)
```

## isMobileNumber

  判断是否是手机号。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| value | 手机号 | true | String |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| Boolean | 是/否 |  |

* 代码示例
```js
let result = $jstools.isMobileNumber('13812345678')
console.log('判断是否是手机号：', result)
```

## isPhoneNumber

  判断电话号码格式是否正确。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| value | 电话号码 | true | String |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| Boolean | 是/否 |  |

* 代码示例
```js
let result = $jstools.isPhoneNumber('022-23780296')
console.log('判断电话号码格式是否正确：', result)
```

## isAmount

  判断金额格式是否正确。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| value | 金额 | true | String |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| Boolean | 是/否 |  |

* 代码示例
```js
let result = $jstools.isAmount('100.00')
console.log('判断金额格式是否正确：', result)
```

## isEmail

  判断邮箱格式是否正确。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| value | 邮箱 | true | String |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| Boolean | 是/否 |  |

* 代码示例
```js
let result = $jstools.isEmail('yuanbiao123456@126.com')
console.log('判断邮箱格式是否正确：', result)
```

## isURL

  校验URL是否正确。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| value | URL | true | String |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| Boolean | 是/否 |  |

* 代码示例
```js
let result = $jstools.isURL('http://localhost:3000/')
console.log('校验URL是否正确：', result)
```

## isLeapYear

  判断某年是否是闰年。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| year | 年份 | true | Number |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| Boolean | 是/否 |  |

* 代码示例
```js
let result = $jstools.isLeapYear(2021)
console.log('判断某年是否是闰年：', result)
```

## cronValidate

  校验cron表达式是否合法。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| value | cron表达式 | true | String |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| Boolean | 是/否 |  |

* 代码示例
```js
let result = $jstools.cronValidate('0 0 10,14,16 * * ?')
console.log('校验cron表达式：', result)
```

## monthDaysCount

  判断某月有多少天。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| month | 月份 | true | Number |  |
| isLeapYear | 是否是闰年 | true | Boolean |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| Number | 天数 |  |

* 代码示例
```js
let result = $jstools.monthDaysCount(2, false)
console.log('判断某月有多少天：', result)
```

## typeOf

  判断数据类型。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| param | 数据 | true | * |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| String | 数据类型 |  |

* 代码示例
```js
let result = $jstools.typeOf({a: 1})
console.log('判断数据类型：', result)
```

## deepCopy

  简单深拷贝。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| data | 数据 | true | * |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| * | 数据副本 |  |

* 代码示例
```js
let result = $jstools.deepCopy({a: 1})
console.log('简单深拷贝：', result)
```

## deepCopyV2

  深拷贝。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| data | 数据 | true | * |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| * | 数据副本 |  |

* 代码示例
```js
let result = $jstools.deepCopyV2({a: 1})
console.log('深拷贝：', result)
```

## clone

  deepCopyV2的别名。

## swapArray

  数组元素交换位置。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| arr | 数组 | true | Array |  |
| index1 | 位置1序号 | true | Number | 1 |
| index2 | 位置2序号 | true | Number | 2 |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| Array | 换位后的数组 |  |

* 代码示例
```js
let result = $jstools.swapArray([0,1,2,3], 1, 2)
console.log('数组元素交换位置：', result)
```

## compareVersions

  版本号比较。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| versionArr1 | 版本1 | true | Array |  |
| versionArr2 | 版本2 | true | Array |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| String | 版本1比版本2的结果，可能的值equal,biggest,bigger,big,small |  |

* 代码示例
```js
let result = $jstools.compareVersions([0,1,3], [0, 0, 12])
console.log('版本号比较：', result)
```

## random

  生成指定范围内的随机数。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| min | 下限 | true | Number |  |
| max | 上限 | true | Number |  |
| decimal | 是否为浮点数 | false | Boolean |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| Number | 指定范围内的随机数 |  |

* 代码示例
```js
let result = $jstools.random(100, 200, true)
console.log('生成指定范围内的随机数：', result)
```

## randomString

  生成随机数字字母字符串。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| len | 字符串长度 | true | Number |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| String | 随机数字字母字符串 |  |

* 代码示例
```js
let result = $jstools.randomString(6)
console.log('生成随机数字字母字符串：', result)
```

## jsonParse

  JSON字符串格式化。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| jsonStr | 要解析的字符串 | true | String |  |
| defaultValue | 格式化后的缺省值 | false | * | {} |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| * | 格式化后的数据 |  |

* 代码示例
```js
let result = $jstools.jsonParse('{"a":1,"b":2}')
console.log('JSON字符串格式化：', result)
```

## debounce

  函数防抖 (只执行最后一次点击)。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| fn | 函数 | true | Function |  |
| delay | 延迟时间 | false | Number | 500 |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| Function | 处理后的函数 |  |

* 代码示例
```js
let result = $jstools.debounce(() => {
    // 函数体
})
```

## throttle

  函数节流 (在interval时间段内只执行一次&多次触发延迟)。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| fn | 函数 | true | Function |  |
| interval | 间隔时间 | false | Number | 1000 |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| Function | 处理后的函数 |  |

* 代码示例
```js
let result = $jstools.throttle(() => {
    // 函数体
})
```

## throttleV2

  函数节流 (在interval时间段内只执行一次&多次触发丢弃)。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| fn | 函数 | true | Function |  |
| interval | 间隔时间 | false | Number | 1000 |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| Function | 处理后的函数 |  |

* 代码示例
```js
let result = $jstools.throttleV2(() => {
    // 函数体
})
```

## ajaxConstructor

  axios方法封装。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| config | 配置 | false | Object |  |
| contentType | Content-Type配置，可能的值json,form,* | false | String |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| Promise | 一个axios实例 |  |

* 代码示例
```js
$jstools.ajaxConstructor()
```

## ajax

  一个axios实例，contentType为application/x-www-form-urlencoded。

## ajaxJson

  一个axios实例，contentType为application/json。

## ajaxError

  axios返回错误信息处理。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| error | 错误对象，优先级低 | false | Error |  |
| errorMessage | 自定义错误信息，优先级高 | false | String |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| String | 错误信息 |

* 代码示例
```js
$jstools.ajaxError(new Error('网络已断开连接，请连接网络后重试！'))
```

## downloadInstance

  获得一个下载实例。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| config | 配置 | false | Object |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| Promise | 一个axios实例 |  |

* 代码示例
```js
$jstools.downloadInstance({url: ''})
```
