const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;

const app = express();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dupvj.mongodb.net/ema-john?retryWrites=true&w=majority`;
app.use(cors());
app.use(bodyParser.json());
const port = 5000;

const client = new MongoClient(
  uri,
  { useUnifiedTopology: true },
  { useNewUrlParser: true },
  { connectTimeoutMS: 30000 },
  { keepAlive: 1 }
);

client.connect((err) => {
  const collection = client.db("ema-john").collection("products");
  const orderCollection = client.db("ema-john").collection("orders");
  // perform actions on the collection object
  // console.log("database connected");
  app.post("/addProduct", (req, res) => {
    const products = req.body;
    // console.log(products);
    // console.log("database connected");
    collection.insertOne(products).then((result) => {
      res.send(result.insertedCount);
    });
  });

  app.get("/products", (req, res) => {
    collection
      .find({})

      .toArray((err, documents) => res.send(documents));
  });
  app.get("/product/:key", (req, res) => {
    collection
      .find({ key: req.params.key })

      .toArray((err, documents) => res.send(documents[0]));
  });

  app.post("/addOrder", (req, res) => {
    const order = req.body;
    // console.log(products);
    // console.log("database connected");
    orderCollection.insertOne(order).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/productsByKeys", (req, res) => {
    const productKeys = req.body;
    collection
      .find({ key: { $in: productKeys } })
      .toArray((err, documents) => res.send(documents));
  });
});

app.get("/", (req, res) => {
  res.send("Hello Tazwar!");
});

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
