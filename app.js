const express = require('express');
const http = require('http');
const path = require('path');
const app = express();

app.use("/",express.static(path.join(__dirname,'dist/pyticketingsystem')))


const port = process.env.PORT || 8001;

app.set('port',port)

const server = http.createServer(app);
server.listen(port,()=> console.log('Running'))