const express = require('express');
const fileUpload = require('express-fileupload');
const simpleDetect = require('../model/SimpleAnomalyDetector');
const hybridDetect = require('../model/HybridAnomalyDetector');
const timeSeries = require('../model/timeSeries');
const { createDetector } = require('../model/SimpleAnomalyDetector');

const app = express();
app.use(express.urlencoded({
    extended: true
}));

app.use(express.static('../view'));

app.use(fileUpload());

function detect(req, res) {
    let flightCSV;
    let trainCSV;
    let algorithm;

    flightCSV = req.files.flightCSV;
    trainCSV = req.files.trainCSV;
    //set the algorithm that was chosen 
    if (req.body.chosenAlgorithm === 'Hybrid Algorithm') algorithm = hybridDetect;
    else algorithm = simpleDetect;
    //initialize the anomaly detector
    let detector = algorithm.createDetector();
    //create train timeseries & run learnNormal function
    let trainTS = new timeSeries.Timseries(trainCSV);
    detector.learnNormal(trainTS);
    //create flight timeseries & run the detect function
    const flightTS = new timeSeries.Timseries(flightCSV);
    const result = detector.detect(flightTS);
    return result;
}

app.post('/detect', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {// check if zero files were sent
        res.status(400).send('No files were uploaded.'); // 400 - bad request
        res.end();
        return;
    }
    if (!req.files.flightCSV) {// check if flight file was sent
        res.status(400).send('No flight CSV was uploaded.'); // 400 - bad request
        res.end();
        return;
    }
    if (!req.files.trainCSV) {// check if train file was sent
        res.status(400).send('No train CSV was uploaded.'); // 400 - bad request
        res.end();
        return;
    }
    const result = detect(req, res);
    res.status(200).send(result); // 200 - success    
});

app.post('/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {// check if zero files were sent
        res.status(400).send('No files were uploaded.'); // 400 - bad request
        res.end();
        return;
    }
    if (!req.files.flightCSV) {// check if flight file was sent
        res.status(400).send('No flight CSV was uploaded.'); // 400 - bad request
        res.end();
        return;
    }
    if (!req.files.trainCSV) {// check if train file was sent
        res.status(400).send('No train CSV was uploaded.'); // 400 - bad request
        res.end();
        return;
    }
    const result = detect(req, res);
    let tmpData = JSON.parse(`${result}`);
    let data = [];
    tmpData.forEach(function (element) {
        data.push(`Anomaly found in: ${element.description} at timestep: ${element.timestep} </br>`);
    });
    res.status(200).send(data.join('')); // 200 - success

});

app.get('/', (req, res) => {
    res.sendFile("./index.html");
});

const port = 8080; 
app.listen(port, () => console.log(`Listening on port ${port}...`));