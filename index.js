var http = require('http');
var fs = require('fs');

const path = process.argv[3];
const port = parseInt(process.argv[2]);

http.createServer((request, response) => {
	fs.readdir(path, (err, files) => { 
		if (err) { 
			response.writeHead(400);
			response.end("Read error.");
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
			response.writeHead(404);
			response.end("Not found.");
			return;
		}
		fs.readFile(path + "/" + found_full, (error, buffer) => { 
			if (error) { 
				response.writeHead(400);
				response.end("Invalid file.");
				return;
			}
			response.writeHead(200, { "Content-Type": "application/octet-stream", "Content-Disposition": "attachment" });
			response.end(buffer);
		});
	});
}).listen(port);
