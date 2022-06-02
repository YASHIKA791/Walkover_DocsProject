require('dotenv').config()

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const alert = require("alert");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const saltRounds = 10;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
//app.use(bodyParser.json());

// app.use(express.static("public"));
app.use(express.static(__dirname + '/public'));
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true });
const fileSchema = new mongoose.Schema({
  filename: String,
  filecontent: String
});

const workspaceSchema = new mongoose.Schema({
  name: String,
  files: { type: [fileSchema], sparse: true }
});
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,

  workspaces: { type: [workspaceSchema], sparse: true }
});
const User = mongoose.model("User", userSchema);
const File = mongoose.model("File", fileSchema);
const Workspace = mongoose.model("Workspace", workspaceSchema);

// ================================================GET METHODS================== //


app.get("/login", function (req, res) {
  res.render("login");
})
app.get("/", function (req, res) {
  res.render("create");
});
app.get("/sign-up", function (req, res) {
  res.render("signup");
})

app.get("/user/:U_ID/workspace/:W_ID", function (req, res) {
  const requestedWorkspaceID = req.params.W_ID;
  const u_id = req.params.U_ID;
  Workspace.find({ _id: requestedWorkspaceID }, function (err, foundList) {
    if (!err) {
      if (foundList) {
        res.render("workspace.ejs", {
          w_id: foundList[0]._id,
          w_name: foundList[0].name,
          files: foundList[0].files,
          content: "",
          u_id: u_id,
          file_name: "---"
        });
      } else {
        alert("Something went wrong");
        res.redirect("/" + req.params.U_ID);
      }
    } else {
      alert("Something went wrong");
      res.redirect("/" + req.params.U_ID);
    }
  })
});

app.get("/userd/:U_ID/workspaced/:W_ID", function (req, res) {
  const wid = req.params.W_ID;
  const uid = req.params.U_ID;

  User.findOneAndUpdate({ _id: uid }, { $pull: { workspaces: { _id: wid } } }, function (err, foundList) {
    if (!err) {
      Workspace.findByIdAndDelete({ _id: wid }, function (err, doc) {
        for (let i = 0; i < doc.files.length; i++) {
          File.findByIdAndDelete({ _id: doc.files[i]._id }, function (err, founcdList) {
            if (err) {
              alert("Some error occured");
              res.redirect("/user/" + uid);
            }
          })
        }
        res.redirect("/user/" + uid);

      })
    }
  })
})
app.get("/user/:U_ID", function (req, res) {
  User.find({ _id: req.params.U_ID }, function (err, foundList) {
    if (!err) {
      if (foundList) {
        res.render("dashboard.ejs", { user: foundList[0] });
      }
    } else {
      res.redirect("/");
    }
  });
});

app.get("/user/:U_ID/workspace/:W_ID/file/:F_ID", function (req, res) {
  const req_file_ID = req.params.F_ID;
  const req_workspace_ID = req.params.W_ID;

  Workspace.find({ _id: req_workspace_ID }, function (err, wrkspcdoc) {
    if (!err) {
      File.find({ _id: req_file_ID }, function (err, filedoc) {
        if (!err) {
          res.render("workspace.ejs", {
            content: filedoc[0].filecontent,
            w_id: req_workspace_ID, files: wrkspcdoc[0].files,
            u_id: req.params.U_ID,
            w_name: wrkspcdoc[0].name,
            file_name: filedoc[0].filename
          });
        }
      });
    } else {
      alert("Error in showing file!");
      res.redirect("/user/" + req.params.U_ID + "/workspace/" + req.params.W_ID);
    }
  });
});


app.get("/userd/:U_ID/workspaced/:W_ID/filed/:F_ID", function (req, res) {
  const uid = req.params.U_ID;
  const wid = req.params.W_ID;
  const fid = req.params.F_ID;

  Workspace.findOneAndUpdate({ _id: wid }, { $pull: { files: { _id: fid } } }, function (err, userList) {
    if (!err) {
      File.findByIdAndDelete({ _id: fid }, function (err, foundList) {
        if (!err) {
          res.redirect("/user/" + uid + "/workspace/" + wid);
        }
      })
    }
  })
});

app.get("/forgot", function (req, res) {
  res.render("forgetPass");
});
// // =================================================

app.post("/signup", function (req, res) {
  User.findOne({ email: req.body.useremail }, function (err, foundList) {
    if (!err) {
      if (!foundList) {

        bcrypt.hash(req.body.userpassword, saltRounds, function (err, hash) {
          const newuser = new User({
            name: req.body.username,
            email: req.body.useremail,
            password: hash,
            workspaces: []
          });
          newuser.save(function (err) {
            if (err) { console.log(err); }
            else {
              res.render("dashboard.ejs", { user: newuser });
            }
          });
        })
      } else {
        alert("This email id was already registered");
        res.redirect("/login");
      }
    }
  })
});


app.post("/login", function (req, res) {
  User.findOne({ email: req.body.useremail }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        alert("Seems like account has not been created using this email id");
        res.redirect("/sign-up");
      } else {
        bcrypt.compare(req.body.userpassword, foundList.password, function (err, result) {
          if (result === true) {
            res.redirect("/user/" + foundList._id);
          } else {
            alert("Password Incorrect");
            res.render("login");
          }
        });
      }
    }
  })
});

app.post("/forgot", function (req, res) {
  const user_email = req.body.useremail;
  const user_password = req.body.userpassword;
  User.findOne({ email: user_email }, function (err, foundList) {
    if (!err) {
      if (foundList) {

        bcrypt.hash(user_password, saltRounds, function (err, hash) {
          foundList.password = hash;
          foundList.save(function (err) {
            if (err) { console.log(err); }
            else {
              res.render("dashboard.ejs", { user: foundList });
            }
          });
        })
      } else {
        alert("This email id was not registered");
        res.redirect("/forgot");
      }
    }
  })

});

app.post("/dashboard", function (req, res) {
  const user_id = req.body.user_id;
  const req_workspace = req.body.new_workspace;
  const new_workspace = new Workspace({
    name: req_workspace,
    files: []
  });
  new_workspace.save();

  User.find({ _id: user_id }, function (err, foundList) {
    if (!err) {
      foundList[0].workspaces.push(new_workspace);
      foundList[0].save();
      res.render("dashboard.ejs", { user: foundList[0] });
    }
  });
});

app.post("/api/saveFileAndContent", function (req, res) {
  const wid = req.body.workspace_id;
  const uid = req.body.user_id;

  const newfile = new File({
    filename: req.body.filename,
    filecontent: req.body.filecontent
  });

  newfile.save();

  Workspace.find({ _id: wid }, function (err, foundList) {
    if (!err) {
      foundList[0].files.push(newfile);
      foundList[0].save();
      res.redirect("/user/" + uid + "/workspace/" + wid);
    }
  })
});
app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});