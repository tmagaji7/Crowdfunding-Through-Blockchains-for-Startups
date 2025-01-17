const web3Service = require("../services/web3service");

exports.createStartupOnBlockchain = async (req, res) => {
  const { name, description, fundingGoal } = req.body;

  try {
    const transactionHash = await web3Service.createStartup(name, description, fundingGoal);
    res.status(201).json({ message: "Startup added to blockchain", transactionHash });
  } catch (err) {
    res.status(500).json({ message: "Blockchain error", error: err.message });
  }
};

exports.getStartupBlockchain = async (req, res) => {
  const { startupId } = req.params;

  try {
    const details = await web3Service.getStartupDetails(startupId);
    res.json({ startupDetails: details });
  } catch (err) {
    res.status(500).json({ message: "Error fetching blockchain data", error: err.message });
  }
};

exports.getAllStartupsBlockchain = async (req, res) => {
  try {
    const startups = await web3Service.getAllStartups();
    res.json({ startups });
  } catch (err) {
    res.status(500).json({ message: "Error fetching blockchain data", error: err.message });
  }
};

exports.getInvestmentsForStartup = async (req, res) => {
  const { startupId } = req.params;

  try {
    const investments = await web3Service.getInvestments(startupId);
    res.json({ investments });
  } catch (err) {
    res.status(500).json({ message: "Error fetching investment data", error: err.message });
  }
};

exports.investInStartupOnBlockchain = async (req, res) => {
  const { amount } = req.body;
  const { startupId } = req.params;

  try {
    const transactionHash = await web3Service.investInStartup(startupId, amount);
    res.json({ message: "Investment successful", transactionHash });
  } catch (err) {
    res.status(500).json({ message: "Blockchain error", error: err.message });
  }
};
