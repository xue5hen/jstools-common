  该类方法仅能在Node环境下使用。

## getJson

  JSON文件读取。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| filePath | 源地址 | true | String |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| Promise | Promise接收一个参数（解析后的JSON数据） |  |

* 代码示例
```js
getJson('D:\\1.json')
```

## copyFile

  文件拷贝。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| from | 源地址 | true | String |  |
| to | 目标地址 | true | String |  |
| streammode | 是否使用流传输 | false | Boolean | false |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| 无 |  |  |

* 代码示例
```js
copyFile('D:\\1.json', 'D:\\2.json')
```

## copyDir

  目录拷贝。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| from | 源地址 | true | String |  |
| to | 目标地址 | true | String |  |
| replace | 是否覆盖同名文件 | false | Boolean | true |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| 无 |  |  |

* 代码示例
```js
copyDir('D:\\1', 'D:\\2')
```

## mkDir

  创建目录。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| filePath | 目标路径 | true | String |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| 无 |  |  |

* 代码示例
```js
mkDir('D:\\1')
```

## delFile

  删除文件/文件夹。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| filePath | 目标路径 | true | String |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| 无 |  |  |

* 代码示例
```js
delFile('D:\\1')
```

## writeFileSync

  将数据写入文件（同步）。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| filePath | 目标路径 | true | String |  |
| bufferData | 数据 | true | Buffer |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| 无 |  |  |

* 代码示例
```js
writeFileSync('D:\\1\\1.txt', '123')
```

## writeFile

  将数据写入文件（异步）。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| filePath | 目标路径 | true | String |  |
| bufferData | 数据 | true | Buffer |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| Promise | 一个Promise对象 |  |

* 代码示例
```js
writeFile('D:\\1\\1.txt', '123')
```

## readDir

  读取目录。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| filePath | 目标路径 | true | String |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| Promise | 一个Promise对象，接收参数为文件列表 |  |

* 代码示例
```js
readDir('D:\\1')
```

## getFileMd5

  获取文件MD5值。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| filePath | 目标路径 | true | String |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| String | 文件MD5值 |

* 代码示例
```js
console.log('文件MD5值：', getFileMd5('D:\\1.json'))
```

## uploadFile

  上传文件到服务器。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| options.from | 源地址 | true | String |  |
| options.to | 目标地址 | true | String |  |
| options.contentType | 数据类型 | false | String | application/octet-stream |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| Promise | 一个Promise对象，接收参数为接口返回值 |  |

* 代码示例
```js
uploadFile({
    from: 'D:\\1.json',
    to: 'x.com/upload'
})
```

## downloadFile

  下载文件到本地，基于axios，responseType为blob。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| options.from | 源地址 | true | String |  |
| options.to | 目标地址 | true | String |  |
| options.progressCallback | 进度回调函数 | false | Function |  |
| options.config | 其它配置 | false | Object |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| Promise | 一个Promise对象 |  |

* 代码示例
```js
downloadFile({
    from: 'x.com/1.pdf',
    to: 'D:\\new.pdf'
})
```

## downloadFileV2

  下载文件到本地，基于axios，与downloadFile仅在responseType上有所不同。

## downloadFileV3

  下载文件到本地，基于request模块。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| options.from | 源地址 | true | String |  |
| options.to | 目标地址 | true | String |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| Promise | 一个Promise对象 |  |

* 代码示例
```js
downloadFileV3({
    from: 'x.com/1.pdf',
    to: 'D:\\new.pdf'
})
```

## encrypt

  加密数据。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| key | 密钥 | true | String |  |
| bufferData | 数据 | true | Buffer |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| Buffer | 加密后的数据 |  |

* 代码示例
```js
encrypt(Buffer.from('l6fwZHdJbU2Y4jxPDwjoI6P9vltHhc8bvDlExm4vRRg=', 'base64'), fs.readFileSync('D:\\1.json'))
```

## unzipFile

  解压（加密）课件资源包。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| options.from | 源地址 | true | String |  |
| options.to | 目标地址 | true | String |  |
| options.JSZip | JSZip第三方库方法 | true | Function | window.JSZip |
| options.encryptKey | 解密密钥 | false | Buffer |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| Promise | 一个Promise对象 |  |

* 代码示例
```js
unzipFile({
    from: 'D:\\1.zip',
    to: 'D:\\2'
})
```

## getIpAddress

  获取本机IP地址。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| 无 |  |  |  |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| Array | IP地址数组 |  |

* 代码示例
```js
getIpAddress()
```

## portIsOccupied

  检测端口是否被占用。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| port | 端口号 | true | Number |  |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| Promise | 一个Promise对象，接收参数为Boolean值 |  |

* 代码示例
```js
portIsOccupied(8080).then((res) => {console.log(res)})
```

## getAvailablePorts

  获取可使用的端口号。

* 参数
| 名称 | 说明 | 必须 | 类型 | 默认值 |
| :-----| :-----| :----: | :----: | :----: |
| s_port | 起始端口号 | false | Number | 1 |
| count | 需要获取的端口数量 | false | Number | 1 |

* 返回值
| 类型 | 说明 | 示例 |
| :----: | :-----| :-----|
| Promise | 一个Promise对象，接收参数为端口数组 |  |

* 代码示例
```js
getAvailablePorts().then((res) => {console.log(res)})
```
