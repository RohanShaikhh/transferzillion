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

const HttpProvider =
  "https://eth-mainnet.g.alchemy.com/v2/3iz35aSwwC5nbTT9SyTmJ0WM916nuv70";
app.use(bodyParser.json({ limit: "100mb", type: "application/json" }));
app.use(
  bodyParser.urlencoded({
    limit: "100mb",
    extended: true,
  })
);
app.use(cors())
// const whitelist = ["https://freeswap.co.in"];

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
// };

// app.use(cors(corsOptions));
//////////////////////////////////////
// app.post("/transfertokenzax", async (req, res) => {
//   var receiptAddress = req.body.walletAddress
//   await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=Zillion-Aakar-XO&vs_currencies=usd')
//   .then(async function (response) {
//     var amount = req.body.token
//   console.log("amount "+amount)
//  var zillionAmount = amount/response.data['zillion-aakar-xo'].usd
//  console.log("amount zillion "+zillionAmount.toFixed(3))
//  var valueInString = zillionAmount.toFixed(3).toString()
//  console.log("valueInString "+valueInString)
//   console.log("wallet address "+receiptAddress)
  
//   var CONTRACT_ADDRESS = "0x9A2478C4036548864d96a97Fbf93f6a3341fedac"
//   var privateKey = process.env.PRIVATE_KEY
//   privateKey = "0x".concat(privateKey)
//   const abi = require("./zaxabi.json")

// const provider = new JsonRpcProvider("https://bsc-dataseed.binance.org/"); // Connect to Ropsten testnet
// const wallet = new ethers.Wallet(privateKey, provider);
// const amountConvert = parseUnits(valueInString,9)
// const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);
// if(isAddress(receiptAddress)){
//   try{
// const tx = await contract.transfer(receiptAddress, amountConvert);
// console.log('Transaction hash:', tx.hash);
// const result = {
//   response : tx.hash
// }
//  return res.status(200).send(result)
// }
// catch(err){
//   console.log("Insufficient Funds")
//   return res.status(401).send("Insufficient Balance")
// }
// }
// else{
//   console.log("Invalid Address")
//   const result = {
//     response : "Invalid Address"
//   }
//   return res.status(400).send(result)
// }
// })
// .catch(function (error) {
//   console.log(error);
// });
// });
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
        response: tx.hash
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

server.listen(PORT, () => console.log(`running on port ${PORT}`));
