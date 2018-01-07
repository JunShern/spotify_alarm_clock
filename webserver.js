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

function makeDateTimeString(datetime) {
    // Returns datetime string in form yyyy-MM-ddThh:mm:ss
    yyyy = datetime.getFullYear();
    mm = datetime.getMonth() + 1;
    dd = datetime.getDate();
    return yyyy + "-" + 
        (mm > 9 ? "" : "0") + mm + "-" +
        (dd > 9 ? "" : "0") + dd + "T" +
        datetime.toTimeString().split(' ')[0];
}

var timevalue = makeDateTimeString(new Date());
var alarmOn = 0;
io.sockets.on('connection', function (socket) {// WebSocket Connection
    // Load in values from previous session
    socket.emit('alarmOn', alarmOn);
    socket.emit('console', timevalue);

    socket.on('time', function(data) {
        timevalue = data;
        socket.emit('console', timevalue);
    });
    socket.on('alarmOn', function(data) {
        alarmOn = data;
        socket.emit('alarmOn', alarmOn);
        socket.emit('console', timevalue);
    });
    socket.on('button', function(data) { 
        var dt = new Date(timevalue);
        if (dt < new Date()){
            socket.emit('console', -1);
            return;
        }
        console.log("Sleep! button pressed, now running Spotify script...");
        var unixtime = dt.getTime() / 1000;
        script = "./spotify_alarm_clock.sh " + unixtime;
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
