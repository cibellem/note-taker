
// NODE MODULES
const fs = require("fs");
const util = require("util");

// Promisify Modules
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

// NPM MODULES
const express = require("express");
const uuid = require("uuid/v4");

// ==============================================================================
// EXPRESS CONFIGURATION

// Tells node that we are creating an "express" server
const app = express();

// Sets an initial port. We"ll use this later in our listener
var PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
//middleware functions 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


//ROUTES 


//GET ROUTE
app.get("/api/notes", async function (req, res) {

    try {
        const notes = await readFile("./db/db.json", "utf8");
        res.json(JSON.parse(notes));
    } catch (err) {
        res.status(500).end();
    }

});
// POST ROUTE 
app.post("/api/notes", async function (req, res) {
    try {
        const notes = JSON.parse(
            await readFile("./db/db.json", "utf8")
        );
        const note = { ...req.body, id: uuid() };
        notes.push(note);
        await writeFile("./db/db.json", JSON.stringify(notes, null, 2));

        res.json(note);
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
});


app.delete("/api/notes/:id", async function (req, res) {

    try {
        const id = req.params.id

        const notes = JSON.parse(
            await readFile("./db/db.json", "utf8")
        );
        //creates a new array only with the objects which ID dont's match the id that is being deleted. 
        let note = notes.filter(note => note.id != id);



        //creates a new file with the new array of objects and display in the screen
        await writeFile("./db/db.json", JSON.stringify(note, null, 2));

        res.json(note)
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }

});



app.get("*", function (res, req) {

    res.redirect("/api/notes")
});


// =============================================================================
// LISTENER
// The below code effectively "starts" our server
// =============================================================================

app.listen(PORT, function () {
    console.log("App listening on PORT: http://localhost:" + PORT);
});

