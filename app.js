const { log } = require("console");
const express = require("express");
const request = require("request");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

//This is a static folder so express can access more than one static file e.g. the css file that is used for your signup page
app.use(express.static("public"));



app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us10.api.mailchimp.com/3.0/lists/1611a85540";

    const options = {
        method: "POST",
        auth: "miguel1:4bbcf3056d207ccc201855b015900faf-us10"
    }

    const request = https.request(url, options, function(response) {

            if(response.statusCode === 200) {
                res.sendFile(__dirname + "/success.html");
            }else {
                res.sendFile(__dirname + "/failure.html");
            }

            response.on("data", function(data) {
                console.log(JSON.parse(data));
            });
    })

    request.write(jsonData);
    request.end();

});

app.post("/failure", function(req, res) {
    res.redirect("/");
});

//Checks if server is up and running
app.listen(process.env.PORT || 3000, function(req, res) {
    console.log("Server is running on port 3000.");
});

// API Key
// 4bbcf3056d207ccc201855b015900faf-us10

//Audience ID
// 1611a85540