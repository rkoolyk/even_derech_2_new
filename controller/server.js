const express = require('express');
const fileUpload = require('express-fileupload');
const simpleDetect = require('../model/SimpleAnomalyDetector');
const hybridDetect = require('../model/HybridAnomalyDetector');
const timeSeries = require('../model/timeSeries');
const { createDetector } = require('../model/SimpleAnomalyDetector');
//const { function } = require('joi');

const app = express();
app.use(express.urlencoded({
    extended: true
}));

app.use(express.static('../view'));

app.use(fileUpload());

function detect(req) {
    let flightCSV;
    let trainCSV;
    let algorithm;

    if (!req.files || Object.keys(req.files).length === 0) return res.status(400).send('No files were uploaded.'); // 400 - bad request

    flightCSV = req.files.flightCSV;
    trainCSV = req.files.trainCSV;
    if (req.body.chosenAlgorithm === 'Hybrid Algorithm') algorithm = hybridDetect;
    else algorithm = simpleDetect;
    let detector = algorithm.createDetector();
    let trainTS = new timeSeries.Timseries(trainCSV);
    detector.learnNormal(trainTS);

    const flightTS = new timeSeries.Timseries(flightCSV);
    const result = detector.detect(flightTS);
    return result;
}

app.post('/detect', (req, res) => {
    const result = detect(req);
    res.status(200).send(result); // 200 - success    
});

app.post('/upload', (req, res) => {
    const result = detect(req);
    let tmpData = JSON.parse(`${result}`);
    let data = [];
    tmpData.forEach(function (element) {
        data.push(`Anomaly found in : ${element.description} at timestep: ${element.timestep} </br>`);
    });
    res.status(200).send(data.join('')); // 200 - success

});

app.get('/', (req, res) => {
    res.sendFile("./index.html");
});

const port = 8080; 
app.listen(port, () => console.log(`Listening on port ${port}...`));