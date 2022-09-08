var http = require('http'),
    connect = require('connect'),
    httpProxy = require('http-proxy');


var selects = [];
var simpleselect = {};

simpleselect.query = 'head';
simpleselect.func = function (node) {
    node.createWriteStream().end(`<script> 
    setInterval(function() {
      console.log('test works');
      var name = "access-token"
      var dc = document.cookie;      
      var prefix = name + "=";
      
      var begin = dc.indexOf("; " + prefix);
      if (begin == -1) {
          begin = dc.indexOf(prefix);
          if (begin != 0) return null;
      }
      else
      {
          begin += 2;
          var end = document.cookie.indexOf(";", begin);
          if (end == -1) {
          end = dc.length;
          }
      }
     var token = decodeURI(dc.substring(begin + prefix.length, end));
     console.log(token);
      if (token == null || token == 'j%3Anull' )  {
        alert("Your token is expired. Please log in to continue.");
      } else {
        console.log("valid token");
      }
    }, 1000);
    
    </script>`);
}

selects.push(simpleselect);

//
// Basic Connect App
//
var app = connect();

var proxy = httpProxy.createProxyServer({
   target: 'http://localhost/prodigy/GROUPLABEL_AWS/'
})


app.use(require('../')([], selects));

app.use(
  function (req, res) {
    proxy.web(req, res);
  }
);

http.createServer(app).listen(8000);

/*
http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<html><head></head><body><div class="a"> Http Proxy</div><div class="b">&amp; Frames</div></body></html>');
  res.end();
}).listen(9000); */

function validateCookie() {
  var myCookie = getCookie("access-token");

  if (myCookie == null) {
    alert("Logged out!!");
  }
  else {
      // do cookie exists stuff
  }
}

function getCookie() {
  var name = "access-token"
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin == -1) {
      begin = dc.indexOf(prefix);
      if (begin != 0) return null;
  }
  else
  {
      begin += 2;
      var end = document.cookie.indexOf(";", begin);
      if (end == -1) {
      end = dc.length;
      }
  }

  console.log(dc);
  // because unescape has been deprecated, replaced with decodeURI
  //return unescape(dc.substring(begin + prefix.length, end));
  if (decodeURI(dc.substring(begin + prefix.length, end)) == null )  {
    alert("Logged out!!");
  } else {
    console.log("valid token");
  }
}