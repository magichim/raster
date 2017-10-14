var http = require('http');
var fs = require('fs');
const PORT = 6000;

const default_header = [
	['Content-Type', 'text/html']
];
http.createServer(function (req, res) {
	fs.readFile('index.html', function(error, page) {
		res.writeHead(200, default_header);
		res.write(page);
		res.end();
	});
}).listen(PORT, '127.0.0.1');

console.log('Server running at http://127.0.0.1:6000');