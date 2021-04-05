const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));  // extra add node body parser submit form middleware


const uri = "mongodb+srv://organicUser:ckWhLRYkGSdqXD4X@cluster0.msfnz.mongodb.net/Organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
    const collection = client.db("Organicdb").collection("products");
    console.log(`Database Connected`);
    // Post data CREATE,, client to server to database 
    app.post('/addProduct', (req, res) => {
        const product = req.body;
        // console.log(product);
        collection.insertOne(product)
            .then(result => {
                console.log('data addeded successfully')
                // res.send('Success') it's not a smoothly
                res.redirect('/');
            })
            .catch(err => {
                console.log(err);
            })
    });


    // Get READ calling API from database 
    app.get('/products', (req, res) => {
        collection.find({})     //.limit(4)    // if your need limited data , follow this code
            .toArray((error, documents) => {
                res.send(documents)
            })
    })


    // Update client
    app.get('/product/:id', (req, res) => {
        collection.find({_id:ObjectId(req.params.id)})
            .toArray((error, documents) => {
                res.send(documents[0])
            })
    })


    // update method
    app.patch('/update/:id', (req, res) => {
        collection.updateOne({_id:ObjectId(req.params.id)},
        {
            $set:{price:req.body.price,quantity:req.body.quantity}
        })
        .then(documents =>{
            // console.log(documents);
            res.send(documents.modifiedCount > 0)
        })
    })


    // Delete  method DELETE
    app.delete('/delete/:id', (req, res) => {
        // console.log(req.params.id);
        collection.deleteOne({_id:ObjectId(req.params.id)})
            .then(( documents)=>{
                // console.log(documents)
                res.send(documents.deletedCount > 0)
            })
    })

});


// calling server to show UI
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.htm');
})


app.listen(3000)
