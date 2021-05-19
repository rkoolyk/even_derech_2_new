const Joi = require('joi');
const express = require('express');
const fileUpload = require('express-fileupload');
const simpleDetect = require('../model/SimpleAnomalyDetector');
const circleDetect = require('../model/CircleAnomalyDetector');
const timeSeries = require('../model/timeSeries');
//const fileUpload = require('../view/index');


const app = express();
app.use(express.urlencoded({
    extended: false
}));
app.use(express.static('../view'));

app.use(fileUpload());

app.use(express.json());

const current = new Date();
//let num = 0;

/*const models = [
    { model_id: 1, upload_time: '8:00', status: 'ready' },
    { model_id: 2, upload_time: '10:00', status: 'pending' }
];*/

app.post('/upload', (req, res) => {
    console.log('Uploading...');
    let flightCSV;
    let trainCSV;
    let pathFlight;
    let pathTrain;

    if (!req.files || Object.keys(req.files).length === 0) return res.status(400).send('No files were uploaded.'); // 400 - bad request

    flightCSV = req.files.flightCSV;
    trainCSV = req.files.trainCSV;
    pathFlight = __dirname + '/uploads/' + flightCSV.name;
    pathTrain = __dirname + '/uploads/' + trainCSV.name;

    trainCSV.mv(pathTrain, function (err) {
        if (err) return res.status(500).send(err); // 500 - upload error
        console.log('Training file uploaded!');
        /*const trainTS = timeSeries.Timseries(pathTrain);
        console.log('Training time series uploaded!');
        simpleDetect.learnNormal(trainTS);
        console.log('Learning normal completed!');*/
    });

    flightCSV.mv(pathFlight, function (err) {
        if (err) return res.status(500).send(err); // 500 - upload error
        res.send('Flight file uploaded!');
    });

    
});


app.get('/', (req, res) => {
    res.sendFile("./index.html")
});

/*app.post('/api/model/:model_type', (req, res) => {
    const schema = {
        train_data: Joi.required()
    };

    const result = Joi.validate(req.body, schema);

    if (result.error) return res.status(400).send(result.error.details[0].message); // 400 - bad request

    const model = {
        model_id: this.num + 1,
        upload_time: current.getTime(),
        status: 'pending'
    };

    models.push(model);
    num = num + 1;
    res.status(200); // 200 - success
    res.send(model);
});

app.get('/api/model/:model_id', (req, res) => {
    //check if model exists
    const modelRequested = models.find(c => c.model_id === parseInt(req.params.model_id));
    if (!modelRequested) return res.status(404).send(`Model with ID: ${req.params.model_id} was not found.`); // 404 - not found
    //return the model
    res.send(modelRequested);
});

app.delete('/api/model/:model_id', (req, res) => {
    //check if model exists
    const modelRequested = models.find(c => c.model_id === parseInt(req.params.model_id));
    if (!modelRequested) return res.status(404).send(`Model with ID: ${req.params.model_id} was not found.`); // 404 - not found

    // delete the course
    const index = models.indexOf(modelRequested);
    models.splice(index, 1);

    // return the model that was deleted
    res.send(modelRequested);
});

app.get('/api/models', (req, res) => {
    res.send(models);
});

app.post('/api/anomaly/:model_id', (req, res) => {
    const modelRequested = models.find(c => c.model_id === parseInt(req.params.model_id));
    if (!modelRequested) return res.status(404).send(`Model with ID: ${req.params.model_id} was not found.`); // 404 - not found
    res.send(modelRequested);
});*/





const port = 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));