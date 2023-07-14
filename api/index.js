const express = require('express');
const cors = require('cors');
require('dotenv').config();
const Transaction = require('./models/Transaction.js');
const { default: mongoose } = require('mongoose');
const app = express();

//inside api folder => npx nodemon index.js
app.use(cors());
app.use(express.json())

app.get("/api/test", (req, res) => {
    res.json('test ok2');
});

app.post("/api/transaction", async (req, res) => {
    const DBCONN = process.env.MONGO_URL;
    await mongoose.connect(DBCONN);
    const {name, description, datetime, price} = req.body;
    const transaction = await Transaction.create({name, description, datetime, price});

    res.json(transaction);
});

app.get("/api/transactions/", async (req, res) => {
    const DBCONN = process.env.MONGO_URL;
    await mongoose.connect(DBCONN);
    const transactions = await Transaction.find();
    res.json(transactions);
})

app.listen("4000");
