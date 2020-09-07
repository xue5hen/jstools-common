const fs = require('fs')
const path = require('path')
const net = require('net')
const request = require('request')
const os = require('os')
const crypto = require('crypto')
let toolsPublic = require('./tools-public.js')

/**
 * JSON文件读取
 * @param {String} filePath 源地址
*/
const getJson = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', function (err, data) {
            if (err) {
                reject('文件不存在或读取失败')
            } else {
                resolve(toolsPublic.jsonParse(data))
            }
        })
    })
}

/**
 * 文件拷贝
 * @param {String} from 源地址
 * @param {String} to 目标地址
 * @param {boolean} streammode 是否使用流传输
 */
const copyFile = (from, to, streammode = false) => {
    // 检查源文件是否存在
    if (!fs.existsSync(from)) return
    // 检查目标文件夹是否存在
    let toDir = path.dirname(to)
    if (!fs.existsSync(toDir)) {
        fs.mkdirSync(toDir, {recursive: true})
    }
    // 读取源文件 & 写入新文件
    if (streammode) {
        // 适用于大文件
        fs.createReadStream(from).pipe(fs.createWriteStream(to))
    } else {
        // 适用于小文件
        fs.writeFileSync(to, fs.readFileSync(from))
    }
}

/**
 * 目录拷贝
 * @param {String} from 源地址
 * @param {String} to 目标地址
 * @param {boolean} replace 是否覆盖同名文件
 */
const copyDir = (from, to, replace = true) => {
    // 检查源路径是否存在
    if (!fs.existsSync(from)) return
    // 检查源路径是否是文件夹
    let fromStat = fs.lstatSync(from)
    if (fromStat.isFile()) {
        copyFile(from, to)
        return
    }
    // 检查目标路径是否存在
    let needCreate = true
    if (fs.existsSync(to)) {
        // 检查目标路径是否是文件夹
        let toStat = fs.lstatSync(to)
        if (toStat.isDirectory()) {
            needCreate = false
        }
    }
    if (needCreate) {
        fs.mkdirSync(to, {recursive: true})
    }
    // 开始遍历拷贝
    let files = fs.readdirSync(from)
    files.forEach(v => {
        let fromPath = path.join(from, v)
        let toPath = path.join(to, v)
        let fromStat = fs.lstatSync(fromPath)
        if (fromStat.isFile()) {
            if (!fs.existsSync(toPath) || replace) {
                copyFile(fromPath, toPath)
            }
        } else if (fromStat.isDirectory()) {
            copyDir(fromPath, toPath, replace)
        }
    })
}

/**
 * 创建目录
 * @param {String} filePath 目标路径
 */
const mkDir = (filePath) => {
    // 检查目标路径是否存在
    let needCreate = true
    if (fs.existsSync(filePath)) {
      // 检查目标路径是否是文件夹
      let pathStat = fs.lstatSync(filePath)
      if (pathStat.isDirectory()) {
        needCreate = false
      }
    }
    if (needCreate) {
      fs.mkdirSync(filePath, {recursive: true})
    }
}

/**
 * 删除文件
 * @param {String} filePath 目标路径
 */
const delFile = (filePath) => {
    // 检查源文件是否存在
    if (!fs.existsSync(filePath)) return
    let stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
        let files = fs.readdirSync(filePath)
        if (files.length) {
            files.forEach(file => {
                delFile(path.join(filePath, file))
            })
        }
        fs.rmdirSync(filePath)
    } else {
        fs.unlinkSync(filePath)
    }
}

/**
 * 将数据写入文件
 * @param {String} filePath 目标路径
 * @param {Buffer} bufferData 数据
 */
const writeFileSync = (filePath, bufferData) => {
    // 检查目标文件夹是否存在
    let toDir = path.dirname(filePath)
    if (!fs.existsSync(toDir)) {
        fs.mkdirSync(toDir, {recursive: true})
    }
    fs.writeFileSync(filePath, bufferData)
}

/**
 * 将数据写入文件
 * @param {String} filePath 目标路径
 * @param {Buffer} bufferData 数据
 */
const writeFile = (filePath, bufferData) => {
    return new Promise((resolve, reject) => {
        // 检查目标文件夹是否存在
        let toDir = path.dirname(filePath)
        if (!fs.existsSync(toDir)) {
            fs.mkdirSync(toDir, {recursive: true})
        }
        fs.writeFile(filePath, bufferData, (err) => {
            if (err) {
                reject()
            } else {
                resolve()
            }
        })
    })
}

/**
 * 读取目录
 * @param {String} filePath 目标路径
 */
const readDir = (filePath) => {
    return new Promise((resolve, reject) => {
        if (!filePath || !fs.existsSync(filePath)) {
            reject('')
        } else {
            fs.readdir(filePath, (err, files) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(files)
                }
            })
        }
    })
}

/**
 * 获取文件MD5值
 * @param {String} filePath 目标路径
 */
const getFileMd5 = (filePath) => {
    if (!filePath || !fs.existsSync(filePath)) return ''
    try {
        let buffer = fs.readFileSync(filePath)
        let fsHash = crypto.createHash('md5')
        fsHash.update(buffer)
        return fsHash.digest('hex')
    } catch(err) {
        return ''
    }
}

/**
 * 上传文件到服务器
 * @param {String} from 源地址
 * @param {String} to 目标地址
 * @param {String} contentType 数据类型
 */
const uploadFile = ({from, to, contentType}) => {
    return new Promise((resolve, reject) => {
        request.put({
            url: to,
            headers: {
                'Content-Type': contentType || 'application/octet-stream'
            },
            body: fs.readFileSync(from)
        }, (error, response, body) => {
            if (error) reject(error)
            if (response.statusCode === 200) {
                resolve(response)
            } else {
                reject(response)
            }
        })
    })
}

/**
 * 下载文件到本地
 * @param {String} from 源地址
 * @param {String} to 目标地址
 * @param {Function} progressCallback 进度回调函数
 * @param {Object} config 其它配置
 */
const downloadFile = (options) => {
    let {from, to, progressCallback, config} = options || {}
    config = config || {}
    return new Promise((resolve, reject) => {
        // 检查目标文件夹是否存在
        let toDir = path.dirname(to)
        if (!fs.existsSync(toDir)) {
            fs.mkdirSync(toDir, {recursive: true})
        }
        toolsPublic.downloadInstance({
            url: from,
            responseType: 'blob',
            onDownloadProgress: progressCallback
        }).request(config).then((response) => {
            response.data.arrayBuffer().then((res) => {
                writeFileSync(to, Buffer.from(res))
                resolve('success')
            }).catch((err) => {
                console.log(err)
                reject('error')
            })
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
 * 下载文件到本地
 * @param {String} from 源地址
 * @param {String} to 目标地址
 * @param {Function} progressCallback 进度回调函数
 * @param {Object} config 其它配置
 */
const downloadFileV2 = (options) => {
    let {from, to, progressCallback, config} = options || {}
    config = config || {}
    return new Promise((resolve, reject) => {
        // 检查目标文件夹是否存在
        let toDir = path.dirname(to)
        if (!fs.existsSync(toDir)) {
            fs.mkdirSync(toDir, {recursive: true})
        }
        toolsPublic.downloadInstance({
            url: from,
            onDownloadProgress: progressCallback
        }).request(config).then((res) => {
            fs.writeFileSync(to, Buffer.from(res.data))
            resolve('success')
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
 * 下载文件到本地
 * @param {String} from 源地址
 * @param {String} to 目标地址
 */
const downloadFileV3 = (options) => {
    let {from, to} = options || {}
    return new Promise((resolve, reject) => {
        // 检查目标文件夹是否存在
        let toDir = path.dirname(to)
        if (!fs.existsSync(toDir)) {
            fs.mkdirSync(toDir, {recursive: true})
        }
        // 声明临时文件
        let toTemp = `${to}_temp`
        let stream = fs.createWriteStream(toTemp)
        request(from).on('error', (err) => {
            console.log(err)
            reject('error')
        }).pipe(stream).on('close',() => {
            fs.rename(toTemp, to, function (err) {
                if (err) { reject('error') }
                else { resolve('success') }
            })
        })
    }).catch((err) => {
        console.log(err)
        return 'error'
    })
}

/**
 * 加密数据（解密同）
 * @param {String} key 密钥
 * @param {Buffer} bufferData 数据
 */
const encrypt = (key, buffer) => {
    let cipher = crypto.createCipher('aes-256-ctr', key)
    let encryptedBytes = cipher.update(buffer)
    encryptedBytes = Buffer.concat([encryptedBytes, cipher.final()])
    return encryptedBytes
}
/**
 * 解压加密课件资源包
 * @param {String} from 压缩包路径
 * @param {String} to 解压后文件存放路径
 * @param {} JSZip 解压后文件存放路径
 */
const unzipFile = (options = {}) => {
    options = options || {}
    let zipFilePath = options.from || ''
    let unzipFileDir = options.to || ''
    let JSZip = options.JSZip || (typeof window !== 'undefined' ? window.JSZip : null)
    if (!zipFilePath) return Promise.reject('压缩包路径不能为空')
    if (!JSZip) return Promise.reject('need input plugin method: JSZip')
    const encryptKey = Buffer.from('l6fwZHdJbU2Y4jxPDwjoI6P9vltHhc8bvDlExm4vRRg=', 'base64')
    let zip = new JSZip()
    let bytes = fs.readFileSync(zipFilePath)
    bytes = encrypt(encryptKey, bytes)
    return zip.loadAsync(bytes).then(({files}) => {
        // 将数据写入本地文件
        let arr = []
        zip.forEach((relativePath, file) => {
            arr.push(file.async('nodebuffer').then((content) => {
                if (file.dir) {
                    let filepath = path.resolve(unzipFileDir, relativePath)
                    if (!fs.existsSync(filepath)) {
                        fs.mkdirSync(filepath, {recursive: true})
                    }
                } else {
                    let filepath = path.resolve(unzipFileDir, relativePath)
                    fs.writeFileSync(filepath, content)
                }
            }))
        })
        return Promise.all(arr)
    })
}

/**
 * 获取本机IP地址
 */
const getIpAddress = () => {
    let result = []
    let interfaces = os.networkInterfaces() || []
    for (let devName in interfaces) {
        let iface = interfaces[devName]
        for (let i = 0; i < iface.length; i++) {
            let item = iface[i]
            if (item.family === 'IPv4' && item.address !== '127.0.0.1' && !item.internal) {
                // return item.address
                result.push(item.address)
            }
        }
    }
    return result
}

/**
 * 检测端口是否被占用
 * @param {Number} port 端口号
 */
const portIsOccupied = (port) => {
    return new Promise((resolve, reject) => {
        let server = net.createServer().listen(port)
        server.on('listening', () => {
            server.close()
            console.log(`The port【${port}】 is available.`)
            resolve(true)
        })
        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`The port【${port}】 is occupied, please change other port.`)
            } else {
                console.log(`The port【${port}】 is inadvisable.`, err)
            }
            reject(false)
        })
    })
}

/**
 * 获取可使用的端口号
 * @param {Number} s_port 起始端口号
 * @param {Number} count 需要获取的端口数量
 */
const getAvailablePorts = (s_port = 1, count = 1) => {
    s_port = Math.abs(parseInt(s_port) || 1)
    count = Math.abs(parseInt(count) || 1)
    let result = []
    return new Promise( async (resolve, reject) => {
        while ((s_port < 65535) && result.length < count) {
            let isOk = await portIsOccupied(s_port)
            if (isOk) { result.push(s_port) }
            s_port++
        }
        resolve(result)
    })
}

let toolsNode = {
    ...toolsPublic,
    getJson,
    copyFile,
    copyDir,
    mkDir,
    delFile,
    writeFileSync,
    writeFile,
    readDir,
    getFileMd5,
    uploadFile,
    downloadFile,
    downloadFileV2,
    downloadFileV3,
    encrypt,
    unzipFile,
    getIpAddress,
    portIsOccupied,
    getAvailablePorts
}

module.exports = (jstools) => {
    for (let k in toolsNode) {
        jstools[k] = toolsNode[k]
    }
}
