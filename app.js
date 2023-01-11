const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
// const mongoose = require("mongoose");
const ejs = require("ejs");
const { response } = require("express");
const app = express();
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

let db;
let quotesCollection;

// DB connection
const connectionString = "mongodb://127.0.0.1:27017";
MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then((client) => {
    console.log("Connected to Database");
    db = client.db("quotes");
    quotesCollection = db.collection("quotes");
  })
  .catch((error) => console.error(error));

// Rendering the ejs data
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  console.log("/ => index.ejs called.");
  

  db.collection("quotes")
    .find()
    .toArray()
    .then((results) => {
      res.render("index.ejs", { quotes: results });
    })
    .catch(error=>console.log(error));
});

// app.get("/quotes", (req, res) => {
//   console.log("called GET /quotes");

//   db.collection("quotes")
//     .find()
//     .toArray()
//     .then((results) => {
//       console.log("All Quoats: ", results);
//       res.send(results);
//     })
//     .catch((error) => console.error(error));
//   // ...
// });

app.post("/quotes", (req, res) => {
  console.log("called POST /quotes");
  console.log("req.param: ", req.params);
  console.log("req.query: ", req.query);
  console.log("req.body: ", req.body);

  quotesCollection
    .insertOne(req.body)
    .then((result) => {
      console.log(result);
      res.send(result);
    })
    .catch((error) => {
      console.log("error POST /quotes");
      console.error(error);
    })
});

app.put("/quotes", (req, res) => {
  console.log("called PUT /quotes");

  quotesCollection
    .findOneAndUpdate(
      { name: "Yoda" },
      {
        $set: {
          name: req.body.name,
          quote: req.body.quote,
        },
      },
      {
        upsert: true,
      }
    )
    .then((result) => {
      console.log("one PUT /quotes");

      res.json("success");
    })
    .catch((error) => {
      console.log("error PUT /quotes");

      console.error(error);
    })
});

// DELECT operation

app.delete("/quotes", (req, res) => {
  console.log("called DEL /quotes");

  quotesCollection
    .deleteOne({ name: req.body.name })
    .then((result) => {
      console.log("executed DEL /quotes");

      if (result.deletedCount === 0) {
        console.log("ZERO DEL /quotes");

        return res.json("No quote to delete");
      }
      res.json(`Deleted Darth Vader's quote`);
    })
    .catch((error) => {
      console.log("error DEL /quotes");
      console.error(error);
})
});

app.listen(3000, function () {
  console.log("listening on 3000");
});
