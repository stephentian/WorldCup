/**
 * author: stephentian
 * email: stephentian@foxmail.com
 * day: 2019/1/6
 **/

// http

// 1. http 协议



// 2. http 服务器
// const http = require('http')

// const server = http.createServer(function (req, res) {
//   // 回调函数接收 requst 和 response 对象
//   // 获取 http 请求的 method 和 url
//   console.log(req.method + ':' + req.url)
//   // 将 http 响应 200 写入 reponse, 同时设置 Content-type: text/html
//   res.writeHead(200, {
//     'Content-Type': 'text/html'
//   })
//   // 将 http 响应的 html 写入 response
//   res.end('<h1>Hello Node, http!</h1>')
// })
// server.listen(8000)
// console.log('Server is runnig at http://localhost:8000')


// 3. 文件服务器
// 让 web 程序变为文件服务器，需要解析 request.url 中的路径
// 然后本地找到对应的文件，把文件内容发送出去

// const url = require('url')
// console.log(url.parse('http://user:pass@host.com:8080/path/to/file?query=string#hash'))

// // 处理本地文件目录需要用到 path 模块，可以方便地构造目录
// const path = require('path')
// // 解析上级目录
// const workDir = path.resolve('.')
// console.log(workDir)
// // 组合完整的文件路径， 当前目录 + 'http' + 'http.js'
// const filePath = path.join(workDir, 'pub', 'index.html')
// console.log(filePath)


// 4. 实现一个文件服务器
const fs = require('fs'),
  url = require('url'),
  path = require('path'),
  http = require('http');

// 从命令行参数获取 root 目录，默认是当前目录
const root = path.resolve(process.argv[2] || '.')

console.log('Static root dir: ', root)

const server = http.createServer(function (req, res) {
    if (path.normalize(decodeURI(req.url)) !== decodeURI(req.url)) {
        res.writeHead(403);
        res.end();
        return;
    }
  // 获取 url 的 path, 类似 '/css/asset.css'
  const pathname = url.parse(req.url).pathname
  // 获取对应的本地文件路径， 类似 'srv/www/css/asset.css'
  const filepath = path.join(root, pathname)
  // 获取文件状态
  fs.stat(filepath, function (err, stats) {
    if (!err && stats.isFile()) {
      // 若没报错并且文件存在
      console.log('200', req.url)
      // 发送 200 响应
      res.writeHead(200)
      // 将文件导向 response
      fs.createReadStream(filepath).pipe(res)
    } else {
      // 出错或文件不存在
      console.log('404', req.url)
      // 发送 404 响应
      res.writeHead(404)
      res.end('404 NOT Found !')
    }
  })
})

server.listen(8000)
console.log('Server is running at http://localhost:8000')