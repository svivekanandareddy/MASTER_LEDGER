const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: [
    "https://master-ledger-lbpcde.vercel.app",
    "http://localhost:3000"
  ],
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));

app.use(express.json());