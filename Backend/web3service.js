const { Web3 } = require("web3");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Initialize Web3 and connect to Ganache
const web3 = new Web3("http://127.0.0.1:7545");

// Load contract ABI and address
const contractPath = path.resolve(__dirname, "../truffleProj/build/contracts/Crowdfunding.json");
const contractJSON = JSON.parse(fs.readFileSync(contractPath, "utf8"));
const { abi } = contractJSON;

// Load environment variables
const accountAddress = process.env.GANACHE_ACCOUNT;
const privateKey = process.env.GANACHE_PRIVATE_KEY;
const contractAddress = process.env.CONTRACT_ADDRESS;

// Validate required environment variables
if (!accountAddress || !privateKey || !contractAddress) {
  throw new Error("Missing environment variables for blockchain configuration");
}

// Initialize contract instance
const contract = new web3.eth.Contract(abi, contractAddress);

module.exports = {
  /**
   * Creates a new startup on the blockchain.
   * @param {string} name - The name of the startup.
   * @param {string} description - The description of the startup.
   * @param {number} fundingGoal - The funding goal for the startup.
   * @returns {string} Transaction hash of the blockchain transaction.
   */
  createStartup: async (name, description, fundingGoal) => {
    try {
      // Prepare transaction
      const tx = contract.methods.createStartup(name, description, fundingGoal);

      // Estimate gas
      const gas = await tx.estimateGas({ from: accountAddress });

      // Fetch current gas price
      const gasPrice = await web3.eth.getGasPrice();

      // Encode transaction data
      const data = tx.encodeABI();

      // Sign the transaction
      const signedTx = await web3.eth.accounts.signTransaction(
        {
          to: contractAddress,
          data,
          gas,
          gasPrice,
          from: accountAddress,
        },
        privateKey
      );

      // Send the signed transaction
      const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      return receipt.transactionHash;
    } catch (err) {
      console.error("Error in createStartup:", err.message);
      throw new Error(`Failed to create startup on blockchain: ${err.message}`);
    }
  },

  /**
   * Fetches details of a startup from the blockchain.
   * @param {number} id - The ID of the startup.
   * @returns {Object} Details of the startup.
   */
  getStartupDetails: async (id) => {
    try {
      const details = await contract.methods.getStartupDetails(id).call();
      return details;
    } catch (err) {
      console.error("Error in getStartupDetails:", err.message);
      throw new Error(`Failed to fetch startup details: ${err.message}`);
    }
  },

  /**
   * Fetches all startups from the blockchain.
   * @returns {Array} List of all startups.
   */
  getAllStartups: async () => {
    try {
      const totalStartups = await contract.methods.totalStartups().call();
      const startups = [];
      for (let i = 0; i < totalStartups; i++) {
        const startup = await contract.methods.getStartup(i).call();
        startups.push(startup);
      }
      return startups;
    } catch (err) {
      console.error("Error in getAllStartups:", err.message);
      throw new Error(`Failed to fetch all startups: ${err.message}`);
    }
  },

  /**
   * Fetches investment history for a specific startup.
   * @param {number} startupId - The ID of the startup.
   * @returns {Array} List of investments for the startup.
   */
  getInvestments: async (startupId) => {
    try {
      const investments = await contract.methods.getInvestments(startupId).call();
      return investments;
    } catch (err) {
      console.error("Error in getInvestments:", err.message);
      throw new Error(`Failed to fetch investments: ${err.message}`);
    }
  },

  /**
   * Invests in a specific startup on the blockchain.
   * @param {number} startupId - The ID of the startup.
   * @param {number} amount - The amount to invest.
   * @returns {string} Transaction hash of the investment transaction.
   */
  investInStartup: async (startupId, amount) => {
    try {
      // Ensure the amount is properly converted to Wei (Web3 expects value in Wei)
      const amountInWei = web3.utils.toWei(amount.toString(), 'ether'); // Convert the amount to Wei
  
      // Create the transaction to call the 'invest' method on the contract
      const tx = contract.methods.invest(startupId);
  
      // Estimate gas
      const gas = await tx.estimateGas({ from: accountAddress, value: amountInWei });
  
      // Fetch current gas price
      const gasPrice = await web3.eth.getGasPrice();
  
      // Encode the transaction data
      const data = tx.encodeABI();
  
      // Sign the transaction
      const signedTx = await web3.eth.accounts.signTransaction(
        {
          to: contractAddress,
          data,
          gas,
          gasPrice,
          from: accountAddress,
          value: amountInWei, // Send Ether (in Wei) with the transaction
        },
        privateKey
      );
  
      // Send the signed transaction
      const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      return receipt.transactionHash;
    } catch (err) {
      console.error("Error in investInStartup:", err.message);
      throw new Error(`Failed to invest in startup: ${err.message}`);
    }
  },
};
