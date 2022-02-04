//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');



const app = express();

app.set('view engine', 'ejs');


app.use(express.static("public"));




// ================================================


app.get("/", function(req, res) {
  res.render("login"); 
})

app.get("/sign-up", function(req, res) {
  res.render("signup"); 
})


// =================================================




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
