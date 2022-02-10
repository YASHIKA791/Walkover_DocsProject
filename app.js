

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");


var workspaces = [];
var files = [];
var userEmail;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
//app.use(bodyParser.json());

app.use(express.static("public"));




// ================================================


app.get("/login", function (req, res) {
  res.render("login");
})
app.get("/", function (req, res) {
  res.render("create");
});
app.get("/sign-up", function (req, res) {
  res.render("signup");
})
app.get("/create-workspace", function (req, res) {
  res.render("create");
})

app.get("/workspace", function (req, res) {
  res.render("workspace", { files: files });
})
app.get("/dashboard", function (req, res) {
  // console.log(userName);
  res.render("dashboard", { username: userEmail, workspaces_list: workspaces });
})
app.get("/workspace/:file", function (req, res) {
  const requestedFile = req.params.file;
  for (let i = 0; i < files.length; i++) {
    if (files[i].name === requestedFile) {
      res.render("showFile", { files: files, name: files[i].name, content: files[i].content })
    }
  }
  // res.render("")
})
app.post("/dashboard", function (req, res) {
  workspaces.push(req.body.new_workspace);
  res.redirect("/dashboard");
});

app.post("/", function (req, res) {

  res.redirect("/");
});
app.post("/api/register", function (req, res) {
  console.log(req.body);
  res.json({ status: 'ok' })
})
app.post("/api/login", function (req, res) {
  // console.log(req.body.email);
  userEmail = req.body.email;
  res.json({ status: 'ok' })
 
})
app.post("/api/saveFileAndContent", function (req, res) {
  let filename = req.body.filename;
  let filecontent = req.body.filecontent;
  let obj = {
    name: filename,
    content: filecontent
  };
  files.push(obj);
  res.redirect("/workspace");
})
// =================================================





app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});