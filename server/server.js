const express = require('express');
const app = express();
const port = 5000;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('server/public'));

const calculations = [];

const calculate = require('./modules/calculator');
const truncate = require('./modules/truncate')

app.post('/calculate', (req, res) => {
    console.log('receiving an operation: ', req.body)
    const request = req.body;
    const newCalc = {
        num1: request.num1,
        num2: request.num2,
        operator: request.operator,
        result: truncate(calculate(request.num1, request.num2, request.operator))
    };
    calculations.push(newCalc);
    console.log(calculations);
    res.sendStatus(200)
});

app.get('/calculate', (req, res) => {
    console.log('GET request at /calculate');
    res.send(calculations);
})


app.delete('/calculate', (req, res) => {
    console.log('DELETE request at /calculate');
    calculations.splice(0, calculations.length);
    res.sendStatus(200);
})










app.listen(port, () => {
    console.log(`listening at port `, port)
})