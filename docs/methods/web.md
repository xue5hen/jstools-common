  该类方法仅能在WEB环境下使用。

## downloadFileByA

  使用a标签下载文件。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| options.from | 源地址 | true | String |  |
| options.to | 目标地址/文件名 | false | String |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| 无 |  |  |

* 代码示例
```js
$jstools.downloadFileByA({from: 'http://www.x.com/1.pdf', to: '1.pdf'})
```

## downloadFileByIframe

  使用iframe标签下载文件。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| options.from | 源地址 | true | String |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| 无 |  |  |

* 代码示例
```js
$jstools.downloadFileByIframe({from: 'http://www.x.com/1.pdf'})
$jstools.downloadFileByIframe('http://www.x.com/1.pdf')
```

## downloadFileByForm

  使用Form标签下载文件。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| options.from | 源地址 | true | String |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| 无 |  |  |

* 代码示例
```js
$jstools.downloadFileByForm({from: 'http://www.x.com/1.pdf'})
```

## saveFileByBlob

  保存Blob数据流到文件。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| options.data | Blob数据流 | true | Blob |  |
| options.fileName | 文件名 | true | String | |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| 无 |  |  |

* 代码示例
```js
$jstools.saveFileByBlob({
    data: new Blob(),
    fileName: 'file'
})
```

## downloadFile

  axios下载文件。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| options.from | 源地址 | true | String |  |
| options.to | 目标地址/文件名 | false | String |  |
| progressCallback | 进度回调函数 | false | Function |  |
| config | 其它配置 | false | Object |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| Promise | 一个axios实例 |  |

* 代码示例
```js
$jstools.downloadFile({from: ''})
```

## formatNumber

  Number转千位分隔符字符串。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| num | 数字 | true | Number |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| String | 千位分隔符字符串 |

* 代码示例
```js
let result = $jstools.formatNumber(123456.7)
console.log('千位分隔符字符串：', result)
```

## runPrefixMethod

  执行带浏览器前缀的方法。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| element | DOM元素 | true | Object |  |
| method | 方法名 | true | String |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| * | 函数返回值 |  |

* 代码示例
```js
$jstools.runPrefixMethod(window, 'getSelection')
```

## onPrefixEvent

  绑定带浏览器前缀的事件。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| element | DOM元素 | true | Object |  |
| eventName | 事件名称 | true | String |  |
| callback | 事件回调函数 | true | Function |  |
| capture | 是否在捕获阶段触发 | false | Boolean |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| String | 实际绑定的可能带前缀的事件名称 |  |

* 代码示例
```js
let fn = () => {}
$jstools.onPrefixEvent(document, 'fullscreenchange', fn)
```

## offPrefixEvent

  解绑带浏览器前缀的事件。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| element | DOM元素 | true | Object |  |
| eventName | 事件名称 | true | String |  |
| callback | 事件回调函数 | true | Function |  |
| capture | 是否在捕获阶段触发 | false | Boolean |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| 无 |  |  |

* 代码示例
```js
let fn = () => {}
$jstools.offPrefixEvent(document, 'fullscreenchange', fn)
```

## scrollTop

  滚动条垂直滚动。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| element | DOM元素 | true | Object |  |
| from | 起点 | true | Number | 0 |
| to | 终点 | true | Number |  |
| duration | 滚动时长 | false | Number | 500 |
| endCallback | 滚动结束后的回调函数 | false | Function |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| 无 |  |  |

* 代码示例
```js
$jstools.scrollTop(document.documentElement, 0, 300)
```

## isFullscreen

  判断是否处在全屏状态。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| 无 |  |  |  |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| Boolean | 是/否 |  |

* 代码示例
```js
console.log($jstools.isFullscreen())
```

## isFullscreenEnabled

  判断是否支持全屏方法。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| 无 |  |  |  |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| Boolean | 是/否 |  |

* 代码示例
```js
console.log($jstools.isFullscreenEnabled())
```

## isWeixinBrowser

  判断是否微信浏览器。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| 无 |  |  |  |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| Boolean | 是/否 |  |

* 代码示例
```js
console.log($jstools.isWeixinBrowser())
```

## isMobileBrowser

  判断是否是移动端浏览器。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| 无 |  |  |  |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| Boolean | 是/否 |  |

* 代码示例
```js
console.log($jstools.isMobileBrowser())
```

## base64Decode

  base64解密处理器。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| base64Str | base64字符串 | true | String |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| String | 解密后的字符串 |  |

* 代码示例
```js
console.log($jstools.base64Decode('aGk='))
```

## dataUrl2File

  将数据字符串转换为文件对象。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| dataUrl | 数据字符串 | true | String |  |
| type | 要转换的目标类型，可选值1(file),2(blob) | false | Number | 2 |
| fileName | 转换后的文件名称，仅当type为1时生效 | false | String |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| File/Blob | 转换后的文件对象 |  |

* 代码示例
```js
console.log($jstools.dataUrl2File('data:image/ico;base64,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'))
```

## zoomScreenByBaseSize

  按基准大小缩放文档视口。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| baseSize | 基准大小 | true | Number |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| 无 |  |  |

* 代码示例
```js
$jstools.zoomScreenByBaseSize(720)
```

## getUrlParams

  获取Url地址中参数。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| url | Url地址 | false | String | 当前页面地址 |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| Object | 参数键值对 |  |

* 代码示例
```js
console.log($jstools.getUrlParams())
```

## myEvent

  事件方法集：事件绑定&触发&解除。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| eventName | 事件名称 | true | String |  |
| callback | 回调函数 | true | Function |  |
| isBubbling | 是否冒泡 | false | Boolean |  |
| cancelable | 是否阻止浏览器的默认行为 | false | Boolean |  |
| argument | 自定义传参 | false | Object |  |

* 方法
| 名称 | 说明 | 传参 | 返回值 |
| :----: | :-----| :-----| :-----|
| addEventListener | 事件绑定 | eventName, callback |  |
| removeEventListener | 事件解绑 | eventName, callback |  |
| dispatchEvent | 事件触发 | eventName, argument, isBubbling, cancelable |  |

* 代码示例
```js
let fn = (e) => {console.log(e.name)}
$jstools.myEvent.addEventListener('召唤兵器', fn)
$jstools.myEvent.dispatchEvent('召唤兵器', {name: 'jstools-common'})
$jstools.myEvent.removeEventListener('召唤兵器', fn)
```

## myCamera

  摄像头事件方法集：获取摄像头列表&获取摄像头视频流&获取视频流错误处理&关闭视频流。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| options.constraints | getCameraStream/媒体参数配置 | true | Object |  |
| options.deviceId | getCameraStream/媒体设备ID | true | String |  |
| options.videoDom | getCameraStream/video标签DOM元素 | false | Object |  |
| options.success | getCameraStream/成功回调函数 | false | Function |  |
| options.fail | getCameraStream/失败回调函数 | false | Function |  |
| options.oninactive/onended | getCameraStream/数据流结束回调函数 | false | Function |  |
| err | getCameraStreamError/错误对象 | false | Object |  |
| callback | getCameraStreamError/回调函数 | false | Function |  |
| mediaStream | closeCameraStream/视频流对象 | false | Object |  |

* 方法
| 名称 | 说明 | 传参 | 返回值 |
| :----: | :-----| :-----| :-----|
| getCameraList | 获取摄像头列表 |  | Promise对象，接收一个数组参数 |
| getCameraStreamError | 调用摄像头失败的错误信息处理 | err, callback |  |
| getCameraStream | 获取摄像头视频流 | {constraints,deviceId,videoDom,success,fail,oninactive/onended} | Promise对象 |
| closeCameraStream | 关闭摄像头 | mediaStream |  |

* 代码示例
```js
$jstools.myCamera.getCameraList().then((res) => {console.log(res)})
```

## screenshot2pdf

  网页截图并保存为PDF文件。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| options.catalogues | 封面对应的dom元素数组 | false | Array |  |
| options.contents | 内容页对应的dom元素数组 | false | Array |  |
| options.clipClass | 可裁切元素的类名 | false | String |  |
| options.flipClass | 需另起一页绘制的元素的类名 | false | String |  |
| options.fileName | 要保存的截图名称 | false | String |  |
| options.paperWidth | 页面宽度（默认参考A4纸） | false | Number | 297 |
| options.paperHeight | 页面高度（默认参考A4纸） | false | Number | 210 |
| options.availWidth | 有效宽度（默认参考A4纸） | false | Number | 287 |
| options.availHeight | 有效高度（默认参考A4纸） | false | Number | 185 |
| options.pageStartTop | 页面内容纵向开始位置（默认参考A4纸） | false | Number | 10 |
| options.pageStartLeft | 页面内容横向开始位置（默认参考A4纸） | false | Number | 5 |
| options.pageNumTop | 页码纵向位置（默认参考A4纸） | false | Number | 280 |
| options.pageNumLeft | 页码横向位置（默认参考A4纸） | false | Number | 205 |
| options.fontSize | 文本字号大小 | false | Number | 12 |
| options.html2canvas | html2canvas第三方库方法 | true | Function | window.html2canvas |
| options.jsPDF | jsPDF第三方库方法 | true | Function | window.jspdf.jsPDF |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| Promise | 一个Promise对象 |  |

* 代码示例
```js
$jstools.screenshot2pdf({contents: document.querySelectorAll('.page')})
```

## polyfillCustomEvent

  CustomEvent构造器Polyfill。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| 无 |  |  |  |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| 无 |  |  |

* 代码示例
```js
$jstools.polyfillCustomEvent()
```

## polyfillRequestAnimationFrame

  requestAnimationFrame方法的Polyfill。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| 无 |  |  |  |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| 无 |  |  |

* 代码示例
```js
$jstools.polyfillRequestAnimationFrame()
```

## polyfillCancelAnimationFrame

  cancelAnimationFrame方法的Polyfill。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| 无 |  |  |  |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| 无 |  |  |

* 代码示例
```js
$jstools.polyfillCancelAnimationFrame()
```
