var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var fs = require('fs');
var path = require('path');
var readline = require('readline');
var stream = require('stream');

server.listen(3030,()=>{
    console.log('Server listening on port 80')
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    // socket.emit('news', { hello: 'world' });
    socket.on('readFile', function (data) {
        var extension = data.filename.split(".").pop();
        if(extension != 'txt') return socket.emit('errorReading', { err: "Can read only .txt files" });

        var filePath = path.join(__dirname, data.filename)
        var instream = fs.createReadStream(filePath);
        var outstream = new stream;
        var rl = readline.createInterface(instream, outstream);

        var totalCount = 0;
        var perCount = 100;
        var resultData = {};
        var wordCount = 0;

        rl.on('line', function(line) {
            var words = line.split(" ");
            for(var i = 0; i < words.length ; i++){
                totalCount++;
                
                if(words[i] == data.searchString) wordCount++;
                if(totalCount % perCount==0){
                    resultData = Object.assign(resultData,{
                        [totalCount]: wordCount
                    });
                    socket.emit('searchResult', { 
                        [totalCount]: wordCount 
                    });
                    wordCount=0;
                }
            }

            // socket.emit('searchResult', { searchResult: resultData });
        });
                
        rl.on('close', function() {
            console.log(resultData)
            socket.emit('finishedReading', { readingFinished: true });
        });
        
        instream.on('error',function(err){
            console.error(err)
            socket.emit('errorReading', { err: err });
        });
    });
});