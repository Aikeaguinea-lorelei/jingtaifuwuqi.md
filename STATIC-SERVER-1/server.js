var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if(!port){
  console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
  process.exit(1)
}

var server = http.createServer(function(request, response){
  var parsedUrl = url.parse(request.url, true)
  var pathWithQuery = request.url 
  var queryString = ''
  if(pathWithQuery.indexOf('?') >= 0){ queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
  var path = parsedUrl.pathname
  var query = parsedUrl.query
  var method = request.method

  /******** 从这里开始看，上面不要看 ************/

  console.log('有个傻子发请求过来啦！路径（带查询参数）为：' + pathWithQuery)
  
  response.statusCode = 200


  response.setHeader('Content-Type','text/html;charset=utf-8')
  // 为了避免重复写,就把路由精简一下.统一用 filepath 代替路径   
  const filePath=path  ==='/'?'/index.html':path   // 如果路径是'/'的话,就默认路径是'/index.html'.否则就还是path
  // 将filepath(8888/style.css)里最后一个字符是'.'的部分声明为index  (style)
  const index=filePath.lastIndexOf('.')
  // 拿到index的子字符串并打印出后缀suffix    (.css)
  const suffix=filePath.substring(index)
  console.log(suffix)
  // 为了避免报错,需要先声明再try一下. filepath 的位置有内容就读取文件
  let content
  try{
    content=fs.readFileSync(`./public${filePath}`)
  // 没有内容的话,就抓住错误error,并打印出 文件不存在
  }catch(error){
      content='文件不存在'
      response.statusCode = 404
  }
  response.write(content)
  response.end()


  // 默认首页
  const filePath = path === '/' ? '/index.html' : path
  const index = filePath.lastIndexOf('.')
  // suffix 是后缀
  const suffix = filePath.substring(index)  
  const fileTypes = {
    // 将拿到的后缀名改为对应的格式,得到filetypes.并且在setheader里面对应引入
    '.html':'text/html',
    '.css':'text/css',
    '.js':'text/javascript',
    '.png':'image/png',
    '.jpg':'image/jpeg'
  }
  response.setHeader('Content-Type', 
    // 不是cs,js,html任意一个时,默认兜底值为html
    `${fileTypes[suffix] || 'text/html'};charset=utf-8`)
  let content
  try{
    content = fs.readFileSync(`./public${filePath}`)
  }catch(error){
    content = '文件不存在'
    response.statusCode = 404
  }
  response.write(content)
  response.end()

  /******** 代码结束，下面不要看 ************/
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)

