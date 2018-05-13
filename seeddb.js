var mongoose = require("mongoose")
var User = require("./models/user-model");
var Note = require("./models/note-model");

var data = [{
        username: "test01",
        password: "password"
    },
    {
        username: "test02",
        password: "password"
    },
    {
        username: "test03",
        password: "password"
    },
]

function seedDB() {
    //Remove all Users
    User.remove({}, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("users removed");
            //Remove all notes
            Note.remove({}, (err) => {
                if (err) {
                    console.log("err");
                } else {
                    console.log("notes removed")
                    //Add a few users
                    data.forEach((user) => {
                        User.create(user, (err, newUser) => {
                            if (err) {
                                console.log(err)
                            } else {
                                console.log("Added User");
                                //create a Note
                                Note.create({
                                    title: "Math Notes 1",
                                    body: "Lorem ipsum dirum"
                                }, (err, newNote) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        newUser.notes.push(newNote);
                                        newUser.save();
                                    }
                                })
                            }
                        })
                    })
                }
            });
        }
    })






    //add some comments
}

module.exports = seedDB;