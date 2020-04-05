var express = require('express');
var app = express();
var errorStack = [];
const port = process.env.PORT || 3000;
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://ritik:72GR3YwAWcgyiI4T@abw-nxg34.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

// Do some configurations in the app
app = require('./config')(app);

// Connect to Mongodb and then start the server
client.connect().then(()=>{
    app.locals.db = client.db("ABW");
    app.listen(port,()=>{console.log('Server Started');});
}).catch(err=>{
errorStack.push(err);
if(errorStack.length>0){
    console.log(errorStack);
}
});

// Route
app.get('/', (req,res)=>{
res.render('index');
});

