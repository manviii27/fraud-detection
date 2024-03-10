const express = require("express");
const path = require("path");
const bcrypt = require("bcryptjs");
const collection = require("./config.js");
const app = express();

// convert data into json format
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(express.static("public"));

//use EJS as the view engine
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("signin");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

// Register User
app.post("/signup", async (req, res) => {

    const data = {
        email: req.body.email,
        password: req.body.password
    }

    // Check if the username already exists in the database
    const existingUser = await collection.findOne({ email: data.email });

    if (existingUser) {
        res.send('User already exists. Please sign in to your account.');
    } else {
        // Hash the password using bcrypt
        const saltRounds = 10; // Number of salt rounds for bcrypt
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword; // Replace the original password with the hashed one

        const userdata = await collection.insertMany(data);
        console.log(userdata);
    }

});

// Login user 
app.post("/signin", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            res.send("User name cannot found");
        }
        // Compare the hashed password from the database with the plaintext password
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (!isPasswordMatch) {
            res.send("wrong Password");
        }
        else {
            res.render("home");
        }
    }
    catch {
        res.send("wrong Details");
    }
});

//Home 
app.get("/home", (req, res) => {
    db.collection('profiles').findOne({}, (err, profile) => {
        if (err) {
            console.error('Error fetching profile data:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Fetch transactions data from MongoDB
        db.collection('transactions').find({}).toArray((err, transactions) => {
            if (err) {
                console.error('Error fetching transactions data:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            // Render the EJS template with fetched data
            res.render('index', { profile, transactions });
        });
    });
});

// Define Port for Application
const port = 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
