const express = require("express");
const app = express();

const fridgesRouter = require("./fridges-router.js");
const fridgesMod = require("./fridges-module.js"); // import the students module

// *** Initialize the students data in the students module ***. This will make the data accessible to all the other functions within the students module.
fridgesMod.initialize();

//Mount the catalogRouter router to the path /users
//All requests starting with /catalog will be forwarded to this router
app.use("/fridges", fridgesRouter);

//Serve static resources from the public directory, if they exist. Think about how the CSS, JavaScript, and other client side resources are being loaded by the client?
app.use(express.static("public"));

//Handle the request for the homepage
app.get("/", function(req, res, next) {
    res.send("Welcome to the students system!")
});

app.listen(8000);
console.log("Server running at http://localhost:8000");