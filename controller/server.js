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

app.post('/detect', (req, res) => {
    console.log('Uploading...');
    let flightCSV;
    let trainCSV;
    let algorithm;

    if (!req.files || Object.keys(req.files).length === 0) return res.status(400).send('No files were uploaded.'); // 400 - bad request

    flightCSV = req.files.flightCSV;
    trainCSV = req.files.trainCSV;
    if (req.body.chosenAlgorithm === 'Hybrid Algorithm') algorithm = hybridDetect;
    else algorithm = simpleDetect;
    let detector = algorithm.createDetector();
    console.log('Training file uploaded!');
    let trainTS = new timeSeries.Timseries(trainCSV);
    console.log('Training time series uploaded!');
    detector.learnNormal(trainTS);
    console.log('Learning normal completed!');

    console.log('Flight file uploaded!');
    const flightTS = new timeSeries.Timseries(flightCSV);
    console.log('Flight time series uploaded!');
    const result = detector.detect(flightTS);
    console.log('Detection completed!');
    res.status(200).send(result); // 200 - success
    
});

app.get('/', (req, res) => {
    res.sendFile("./index.html");
});

const port = 8080; 
app.listen(port, () => console.log(`Listening on port ${port}...`));