const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.huwqv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(bodyParser.json());
app.use(cors())
const port = 5000


const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
client.connect(err => {
  const valunteerCollection = client.db("valunteerStore").collection("valunteerAll");
  const registerCollection = client.db("valunteerStore").collection("register");


app.post('/addValunteer',(req,res)=>{
  const valunteer = req.body;
  console.log(valunteer);
  valunteerCollection.insertOne(valunteer)
  .then(result=>{
    console.log(result.insertedCount);
    res.send(result.insertedCount)
  })
})

app.get('/valunteers', (req, res) => {
  valunteerCollection.find({})
  .toArray( (err, documents) => {
      res.send(documents);
  })
})


app.get('/tasks', (req, res) => {
  const filter = req.query.filter
  valunteerCollection.find({valunteers:{$regex: filter}})
  .toArray( (err, documents) => {
      res.send(documents);
  })
})


app.post('/addRegister', (req, res) => {
  const register = req.body;
  
  registerCollection.insertOne(register)
  .then(result => {
      console.log(result.insertedCount);
      res.send(result.insertedCount>0)
       .toArray( (err, documents) => {
      res.send(documents);
  })
  })
})

app.get('/register', (req, res) => {
  registerCollection.find({email:req.query.email})
  .toArray( (err, documents) => {
      res.send(documents);
  })
})

app.delete('/delete/:id',(req,res)=>{
  console.log(req.params.id)
  registerCollection.deleteOne({_id:ObjectId(req.params.id)})
  .then((result)=>{
     res.send(result.deletedCount > 0);
  })
  
})


})

app.get('/', function (req, res) {
  res.send('hello world')

});


app.listen(process.env.PORT || port)