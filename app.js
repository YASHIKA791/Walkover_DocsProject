//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');

var workspaces=[];

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');


app.use(express.static("public"));




// ================================================


app.get("/login", function(req, res) {
  res.render("login"); 
})
app.get("/", function(req, res) {
  res.render("create");
});
app.get("/sign-up", function(req, res) {
  res.render("signup"); 
})
app.get("/create-workspace", function(req, res) {
  res.render("create"); 
})
app.post("/", function(req, res) {
  
  res.redirect("/");
});

// =================================================




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
