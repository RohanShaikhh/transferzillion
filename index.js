const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const PORT = 8000;
const http = require("http");
const axios = require('axios')
require('dotenv').config();
const server = http.createServer(app);
const {ethers,JsonRpcProvider , formatEther, parseUnits, isAddress, ContractTransactionResponse, InfuraProvider} = require("ethers");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

const HttpProvider =
  "https://eth-mainnet.g.alchemy.com/v2/3iz35aSwwC5nbTT9SyTmJ0WM916nuv70";
app.use(bodyParser.json({ limit: "100mb", type: "application/json" }));
app.use(
  bodyParser.urlencoded({
    limit: "100mb",
    extended: true,
  })
);
// app.use(cors())
const whitelist = ["http://104.248.130.142:3000"];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

if (cluster.isMaster) {
  console.log(`Master  is running`+process.pid);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  //////////////////////////////////////
  app.post("/transfertokenzax", async (req, res) => {
    try {
      const receiptAddress = req.body.walletAddress;
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=Zillion-Aakar-XO&vs_currencies=usd');
      const amount = req.body.token;
      console.log("amount " + amount);
      const zillionAmount = amount / response.data['zillion-aakar-xo'].usd;
      console.log("amount zillion " + zillionAmount.toFixed(3));
      const valueInString = zillionAmount.toFixed(3).toString();
      console.log("valueInString " + valueInString);
      console.log("wallet address " + receiptAddress);

      const CONTRACT_ADDRESS = "0x9A2478C4036548864d96a97Fbf93f6a3341fedac";
      let privateKey = process.env.PRIVATE_KEY;
      privateKey = "0x" + privateKey;
      const abi = require("./zaxabi.json");

      const provider = new JsonRpcProvider("https://bsc-dataseed.binance.org/");
      const wallet = new ethers.Wallet(privateKey, provider);
      const amountConvert = parseUnits(valueInString, 9);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

      if (isAddress(receiptAddress)) {
        const tx = await contract.transfer(receiptAddress, amountConvert);
        console.log('Transaction hash:', tx.hash);
        const result = {
          response:tx.hash
        };
        return res.status(200).send(result);
        } else {
        console.log("Invalid Address");
        const result = {
        response: "Invalid Address"
        };
        return res.status(400).send(result);
        }
        } catch (err) {
        console.log("Insufficient Funds");
        return res.status(401).send("Insufficient Balance");
        }
        });
        //////////////////////////////////////
        
        console.log("Worker ${process.pid} started");
        }
        
        server.listen(PORT, () => console.log("running on port"+PORT));
