var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');

var contentTypes = {
		  'html' : 'text/html',
		  'css'  : 'text/css',
		  'ico'  : 'image/x-icon',
		  'png'  : 'image/png',
		  'svg'  : 'image/svg+xml',
		  'js'   : 'application/javascript',
		  'jpg'	 : 'image/jpg',		
		  'otf'  : 'application/x-font-otf',
		  'ttf'  : 'application/x-font-ttf',
		  'eot'  : 'application/vnd.ms-fontobject',
		  'woff' : 'application/x-font-woff',
		  'woff2': 'application/font-woff2',
		  'zip'  : 'application/zip'
};

// Create a server
http.createServer( function (request, response) {  
   // Parse the request containing file name
   var pathName = url.parse(request.url).pathname;
   
   // Print the name of the file for which request is made.
   console.log("Request for " + pathName + " received.");
   
   // Read the requested file content from file system
   if (pathName.substr(1) == "")
   {
	   pathName="/login.html";
   }
   
   var fileName = pathName.substr(1);

   //console.log("filename: " + fileName);
   //console.log("pathName: " + pathName);
   
   fs.readFile(pathName.substr(1), function (err, data) {
      if (err) {
         console.log(err);
         console.log(err.errno);
         // HTTP Status: 404 : NOT FOUND
         // Content Type: text/plain
         //response.writeHead(404, {'Content-Type': 'text/html'});
         response.writeHead(404, {"Content-Type": "text/plain"});
         response.write("404 Not Found\n");
         response.end();
      }else {	
         //Page found	  
         // HTTP Status: 200 : OK
         // Content Type: text/plain
    	 var extension = path.extname(pathName).substr(1);
    	 console.log(extension)
         response.writeHead(200, {'Content-Type': contentTypes[extension]});
         
         // Write the content of the file to response body
         response.write(data.toString());		
      }
      // Send the response body 
      response.end();
   });
}).listen(8081);

// Console will print the message
console.log('Server running at localhost:8081/');