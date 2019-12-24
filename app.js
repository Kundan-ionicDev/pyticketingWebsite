const express = require('express');
const http = require('http');
const path = require('path');
const app = express();

app.use("/pyticketingsystem/",express.static(path.join(__dirname,'dist')))

app.get('/pyticketingsystem/ping/',(req,res)=>{
    res.json({
     "ping":"pong",
     "date":new Date()
    });
 });

app.get('/pyticketingsystem/*',(req,res)=>{
    res.sendFile(path.join(__dirname,'dist/index.html'))
});

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/index.html'));
});

app.use("/",express.static(path.join(__dirname,'dist/')))

const port = process.env.PORT || 4200;

app.set('port',port)

const server = http.createServer(app);
server.listen(port,()=> console.log('Running'))