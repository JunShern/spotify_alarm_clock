var http = require('http').createServer(handler);
var fs = require('fs');
var io = require('socket.io')(http) //require socket.io module and pass the http object (server)
var exec = require('child_process').exec;

http.listen(8080);

function handler (req, res) { //create server
    fs.readFile(__dirname + '/public/index.html', function(err, data) { //read file index.html in public folder
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error
            return res.end("404 Not Found");
        } 
        res.writeHead(200, {'Content-Type': 'text/html'}); //write HTML
        res.write(data); //write data from index.html
        return res.end();
    });
}

var timevalue = "9:00";
var alarmOn = 0;
io.sockets.on('connection', function (socket) {// WebSocket Connection
    // Load in values from previous session
    socket.emit('alarmOn', alarmOn);
    socket.emit('console', timevalue);

    socket.on('time', function(data) { //get time switch status from client
        timevalue = data;
        console.log(timevalue);
        socket.emit('console', timevalue);
    });
    socket.on('alarmOn', function(data) { //get time switch status from client
        alarmOn = data;
        socket.emit('alarmOn', alarmOn);
        socket.emit('console', timevalue);
    });
    socket.on('button', function(data) { //get time switch status from client
        console.log("Running Spotify script!");
        script = "spotify_alarm_clock " + timevalue;
        exec(script,
        (error, stdout, stderr) => {
            console.log(`${stdout}`);
            console.log(`${stderr}`);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        });
    });
});
