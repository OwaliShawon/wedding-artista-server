const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors');
require('dotenv').config()


app.use(bodyParser.json());
app.use(cors());

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z1say.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const port = process.env.PORT || 5005


app.get('/', (req, res) => {
    res.send('Hello Assignment Eleven! Start late for final Exam');
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const servicesCollection = client.db("weddingArtista").collection("services");
    const ordersCollection = client.db("weddingArtista").collection("orders");

    console.log('db is connected');

    app.post("/addService", (req, res) => {
        const service = req.body;
        console.log(service);
        servicesCollection.insertOne(service)
            .then(result => {
                console.log('one added successfully');
            })
    })

    app.get('/services', (req, res) => {
        servicesCollection.find()
            .toArray()
            .then(services => {
                res.send(services);
            })
    })

    app.delete('/deleteService/:id', (req, res) => {
        const id = ObjectID(req.params.id);
        console.log('delete', id);
        servicesCollection.findOneAndDelete({ _id: id })
            .then(documents => res.send(!!documents.value))
    })

    app.post("/addOrder", (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
            .then(result => {
                console.log(result);
                res.send(result.insertedCount);
            })
    })

    app.get('/orders', (req, res) => {
        ordersCollection.find()
            .toArray()
            .then(orders => {
                res.send(orders);
            })
    })


});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})