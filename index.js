var http = require('http');
var fs = require('fs');

const path = process.argv[3];
const port = parseInt(process.argv[2]);

http.createServer((request, response) => {
	fs.readdir(path, (err, files) => { 
		if (err) { 
			const status_code = 400;
			const ret = "Read error.";
			console.log(request.connection.remoteAddress, status_code, ret);
			response.writeHead(status_code);
			response.end(ret);
			return;
		}
		var found = 0, found_full;
		for (var file of files) { 
			const file_ = file.split(".");
			const number = parseInt(file_[0]);
			if (number && number > found) { 
				found = number;
				found_full = file;
			}
		}
		if (!found) { 
			const status_code = 404;
			const ret = "Not found.";
			console.log(request.connection.remoteAddress, status_code, ret);
			response.writeHead(status_code);
			response.end(ret);
			return;
		}
		fs.readFile(path + "/" + found_full, (error, buffer) => { 
			if (error) { 
				const status_code = 400;
				const ret = "Invalid file.";
				console.log(request.connection.remoteAddress, status_code, ret, path + "/" + found_full);
				response.writeHead(status_code);
				response.end(ret);
				return;
			}
			console.log(request.connection.remoteAddress, 200, path + "/" + found_full);
			response.writeHead(200, { "Content-Type": process.argv[4] || "application/octet-stream" });
			response.end(buffer);
		});
	});
}).listen(port);
