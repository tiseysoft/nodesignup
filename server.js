var express = require('express');
var path = require('path');
var mongo = require('mongodb');
var bodyParser = require('body-parser');
var crypto = require('crypto');

//initialization
var app = express();
var new_db = "mongodb://localhost:27017/database_name";

app.get('/', function(req,res){
    res.set({
        'Access-Control-Allow-Origin' : '*'

    });
    return res.redirect('/public/index.html');
}).listen(3000);

console.log("server is listening at : 3000");
app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.json() );
app.use(bodyParser.urlencoded({
    extended: true
}));

var getHash = (pass, phone ) => {
    var hmac = crypto.createHmac('sha512', phone);

    //pasing fata to be hashed
    data = hmac.update(pass);
    //creating the hmac in the required format
    gen_hmac = data.digest('hex');
    console.log("hmac : " + gen_hmac);
    return gen_hmac;
}

//signup function process here...
app.post('/sign_up', function(req, res){
    var name = req.body.name;
    var email= req.body.email;
    var pass = req.body.password;
    var phone = req.body.phone
    var password = getHash(pass, phone);

    var data = {
        "name":name,
        "email":email,
        "password":password,
        "phone": phone
    }

    mongo.connect(new_db, function(error, db){
        if(error){
            throw error;
        }
        console.log("connected to database successfully");
        db.collection("datails").insertOne(data, (err, collection) => {
            if(err) throw err;
            console.log("Record inserted Successfully");
            console.log(collection);
        });
    });

    console.log("DATA is " + JSON.stringify(data) );
    res.set({
        'Access-Control-Allow-Origin' : '*'
    });
    return res.redirect('/public/success.html');
});