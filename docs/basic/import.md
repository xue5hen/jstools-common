### 快速上手

* 引入 jstools-common

  该方法库支持多环境多方式的引入，以满足不同开发场景的需求：
```
1、WEB网页环境
    1）script标签引入
    <script src="path/to/jstools.web.js"></script>
    2）import或require引入
    import jstools from 'jstools-common/dist/jstools.web'
    let jstools = require('jstools-common/dist/jstools.web')
2、纯NODE环境
    let jstools = require('jstools-common/dist/jstools.node')
3、lectron-main环境
    let jstools = require('jstools-common/dist/jstools.electron-main')
4、Electron-renderer环境
    import jstools from 'jstools-common/dist/jstools.electron-renderer'
    let jstools = require('jstools-common/dist/jstools.electron-renderer')
```
