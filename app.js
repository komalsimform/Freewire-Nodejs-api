const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const fs = require("fs"); 
const { clearLine } = require("readline");
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger/api.yaml');
// const WebSocket = require('ws');
// const wss = new WebSocket.Server({ port: 3002 })


var app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// wss.on('connection', ws => {
//     ws.on('message', message => {
//       console.log(`Received message => ${message}`)
//     })
//     ws.send('Hello! Message From Server!!')
// });


app.post('/updatePlug/', (req, res, next) => {
    updatePlug(req.body.plug1, req.body.plug2).then((response) => {
        return res.send(response);
    });
});
app.post('/changeMode/', (req, res, next) => {
    changeMode(req.body.mode).then((response) => {
        // return res.send(response);
        return res.status(200).json({response});
    });
});
app.post('/changeStatus/', (req, res, next) => {
    changeStatus(req.body).then((response) => {
        console.log('response----1',response)
        // res.setHeader('Content-Type', 'application/json');
        return res.json(response);
        // return res.status(200).json({response});
    });
});
app.post('/increaseLeftCharging/', (req, res, next) => {
    increaseLeftCharging().then((response) => {
        return res.send(response);
    });
});
app.post('/increaseRightCharging/', (req, res, next) => {
    increaseRightCharging().then((response) => {
        return res.send(response);
    });
});
app.post('/changeCCStatus/', (req, res, next) => {
    changeCCStatus(req.body.status).then((response) => {
        return res.send(response);
    });
});
app.post('/activateState/', (req, res, next) => {
    activateState(req.body.state).then((response) => {
        return res.send(response);
    });
});
app.post('/initializeState/', (req, res, next) => {
    initializeState(req.body.state).then((response) => {
        return res.send(response);
    });
});
app.post('/insulationCheck/', (req, res, next) => {
    insulationCheck(req.body.state).then((response) => {
        return res.send(response);
    });
});
app.post('/waitForStart/', (req, res, next) => {
    waitForStart(req.body.state).then((response) => {
        return res.send(response);
    });
});
app.post('/stopCharging/', (req, res, next) => {
    stopCharging(req.body.state).then((response) => {
        // return res.send(response);
        return res.sendFile(path.join(__dirname,"services_boost_api_status.json"));
    });
});
app.post('/abortCharging/', (req, res, next) => {
    abortCharging(req.body.state).then((response) => {
        return res.send(response);
    });
});
app.post('/turnOffPlug/', (req, res, next) => {
    turnOffPlug(req.body.state).then((response) => {
        return res.send(response);
    });
});


app.listen(3001, () => {
    console.log("Server running on port 3001");
});

function updatePlug(plug1, plug2)  {
    return new Promise((resolve, reject) => {
        fs.readFile("services_boost_api_status.json", function(err, data) {       
            if (err) {
                reject(err);
            }
            const content = JSON.parse(data);
            content.leftOutputPort = plug1;
            content.rightOutputPort = plug2;
            fs.writeFile("services_boost_api_status.json", JSON.stringify(content), err => { 
                if (err) {
                    reject(err);
                } 
            });
            resolve(content);
        });
    });
}

function changeMode(mode, callback) {
    return new Promise((resolve, reject) => {
        fs.readFile("services_boost_api_status.json", function(err, data) { 
            if (err) {
                reject(err);
            } 
            const content = JSON.parse(data);
            content.mode = mode;
            content.leftState = "AVAILABLE";
            content.rightState = "AVAILABLE";
            fs.writeFile("services_boost_api_status.json", JSON.stringify(content), err => { 
                if (err) {
                    reject(err);
                }
            });
            resolve(content);
        });
    });
}

function changeStatus(data, callback) {
    return new Promise((resolve, reject) => {
        fs.readFile("services_boost_api_status.json", function(err, resdata) { 
            if (err) {
                reject(err);
            } 
            const content = JSON.parse(resdata);
            content.leftState = data.left;
            content.rightState = data.right;
            fs.writeFile("services_boost_api_status.json", JSON.stringify(content), err => { 
                if (err) {
                    reject(err);
                }
            });
            resolve(content);
        });
    });
}

function increaseLeftCharging(callback) {
    return new Promise((resolve, reject) => {
        fs.readFile("services_boost_api_status.json", function(err, resdata) { 
            if (err) {
                reject(err);
            } 
            const content = JSON.parse(resdata);
            content.left.chargePercent += 5;
            content.left.targetRemainingSeconds -= 5;
            content.left.elapsedSeconds += 5;
            content.left.kw = 60;
            content.left.kwh += 5;
            content.left.cost += 1;
            fs.writeFile("services_boost_api_status.json", JSON.stringify(content), err => { 
                if (err) {
                    reject(err);
                }
            });
            resolve(content);
        });
    });
}

function increaseRightCharging() {
    return new Promise((resolve, reject) => {
        fs.readFile("services_boost_api_status.json", function(err, resdata) { 
            if (err) {
                reject(err);
            } 
            const content = JSON.parse(resdata);
            content.right.chargePercent += 5;
            content.right.targetRemainingSeconds -= 5;
            content.right.elapsedSeconds += 5;
            content.right.kw = 60;
            content.right.kwh += 5;
            content.right.cost += 1;
            fs.writeFile("services_boost_api_status.json", JSON.stringify(content), err => { 
                if (err) {
                    reject(err);
                }
            });
            resolve(content);
        });
    });
}

function changeCCStatus(status) {
    return new Promise((resolve, reject) => {
        fs.readFile("services_boost_api_status.json", function(err, resdata) { 
            if (err) {
                reject(err);
            } 
            const content = JSON.parse(resdata);
            content.cardReader.state = status;
            fs.writeFile("services_boost_api_status.json", JSON.stringify(content), err => { 
                if (err) {
                    reject(err);
                }
            });
            resolve(content);
        });
    });
}

function activateState(state) {
    return new Promise((resolve, reject) => {
        fs.readFile("services_boost_api_status.json", function(err, resdata) { 
            if (err) {
                reject(err);
            } 
            const content = JSON.parse(resdata);
            if(state === 'left') {
                content.leftState = "AUTHORIZING";
            } else if (state === 'right') {
                content.rightState = "AUTHORIZING";
            }
            fs.writeFile("services_boost_api_status.json", JSON.stringify(content), err => { 
                if (err) {
                    reject(err);
                }
            });
            resolve(content);
        });
    });
}
function initializeState(state) {
    return new Promise((resolve, reject) => {
        fs.readFile("services_boost_api_status.json", function(err, resdata) { 
            if (err) {
                reject(err);
            } 
            const content = JSON.parse(resdata);
            if(state === 'left') {
                content.leftState = "INITIALIZING";
                content.left.chargePercent = 40;
                content.left.targetChargePercent = 80;
            } else if (state === 'right') {
                content.rightState = "INITIALIZING";
                content.right.chargePercent = 40;
                content.right.targetChargePercent = 80;
            }
            fs.writeFile("services_boost_api_status.json", JSON.stringify(content), err => { 
                if (err) {
                    reject(err);
                }
            });
            resolve(content);
        });
    });
}

function insulationCheck(state) {
    return new Promise((resolve, reject) => {
        fs.readFile("services_boost_api_status.json", function(err, resdata) { 
            if (err) {
                reject(err);
            } 
            const content = JSON.parse(resdata);
            if(state === 'left') {
                content.leftState = "SAFETY_TEST";
                content.left.chargePercent = 40;
                content.left.targetChargePercent = 80;
            } else if (state === 'right') {
                content.rightState = "SAFETY_TEST";
                content.right.chargePercent = 40;
                content.right.targetChargePercent = 80;
            }
            fs.writeFile("services_boost_api_status.json", JSON.stringify(content), err => { 
                if (err) {
                    reject(err);
                }
            });
            resolve(content);
        });
    });
}

function waitForStart(state) {
    return new Promise((resolve, reject) => {
        fs.readFile("services_boost_api_status.json", function(err, resdata) { 
            if (err) {
                reject(err);
            } 
            const content = JSON.parse(resdata);
            if(state === 'left') {
                content.leftState = "WAIT_FOR_START";
            } else if (state === 'right') {
                content.rightState = "WAIT_FOR_START";
            }
            fs.writeFile("services_boost_api_status.json", JSON.stringify(content), err => { 
                if (err) {
                    reject(err);
                }
            });
            resolve(content);
        });
    });
}

function stopCharging(state) {
    return new Promise((resolve, reject) => {
        fs.readFile("services_boost_api_status.json", function(err, resdata) { 
            if (err) {
                reject(err);
            } 
            const content = JSON.parse(resdata);
            if(state === 'left') {
                content.leftState = "FINISHING";
                content.left.chargePercent = 80;
                content.left.targetChargePercent = 80;
                content.left.targetRemainingSeconds = 0;
                content.left.elapsedSeconds = 300;
                content.left.kwh = 10;
                content.left.kw = 60;
                content.left.cost = 10;
            } else if (state === 'right') {
                content.rightState = "FINISHING";
                content.right.chargePercent = 80;
                content.right.targetChargePercent = 80;
                content.right.targetRemainingSeconds = 0;
                content.right.elapsedSeconds = 300;
                content.right.kwh = 10;
                content.right.kw = 60;
                content.right.cost = 10;
            }
            fs.writeFile("services_boost_api_status.json", JSON.stringify(content), err => { 
                if (err) {
                    reject(err);
                }
            });
            resolve(content);
        });
    });
}

function abortCharging(state) {
    new Promise((resolve, reject) => {
        fs.readFile("services_boost_api_status.json", function(err, resdata) { 
            if (err) {
                reject(err);
            } 
            const content = JSON.parse(resdata);
            if(state === 'left') {
                content.leftState = "ABORTING";
                content.left.chargePercent = 80;
                content.left.targetChargePercent = 80;
                content.left.targetRemainingSeconds = 0;
                content.left.elapsedSeconds = 300;
                content.left.kwh = 10;
                content.left.kw = 60;
                content.left.cost = 10;
            } else if (state === 'right') {
                content.rightState = "ABORTING";
                content.right.chargePercent = 80;
                content.right.targetChargePercent = 80;
                content.right.targetRemainingSeconds = 0;
                content.right.elapsedSeconds = 300;
                content.right.kwh = 10;
                content.right.kw = 60;
                content.right.cost = 10;
            }
            fs.writeFile("services_boost_api_status.json", JSON.stringify(content), err => { 
                if (err) {
                    reject(err);
                }
            });
            resolve(content);
        });
    });
}

function turnOffPlug(state) {
    new Promise((resolve, reject) => {
        fs.readFile("services_boost_api_status.json", function(err, resdata) { 
            if (err) {
                reject(err);
            } 
            const content = JSON.parse(resdata);
            if(state === 'left') {
                content.leftState = "UNAVAILABLE";
            } else if (state === 'right') {
                content.rightState = "UNAVAILABLE";
            }
            fs.writeFile("services_boost_api_status.json", JSON.stringify(content), err => { 
                if (err) {
                    reject(err);
                }
            });
            resolve(content);
        });
    });
}


app.get('/services/boost/api/status/', function (req, res) {
    res.sendFile(path.join(__dirname,"services_boost_api_status.json"));
});

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname,"index.html"));
});

module.exports = router;