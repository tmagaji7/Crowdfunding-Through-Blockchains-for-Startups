const Startup = require("../models/Startup");
const blockchainService = require("../services/web3service");

exports.createStartup = async (req, res) => {
  try {
    const { name, description, fundingGoal, investmentTiers } = req.body;

    console.log("Creating startup with params:", { name, description, fundingGoal, investmentTiers });

    // Validate the input data
    if (!name || !description || !fundingGoal || !investmentTiers) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new startup in the database
    const startup = new Startup({
      name,
      description,
      fundingGoal,
      investmentTiers,
      currentFunding: 0, // Initialize current funding as 0
      investors: [] // Initialize investors as an empty array
    });

    // Save the startup to the database
    await startup.save();


    res.status(201).json({
      message: "Startup created successfully",
      startup,
    });
  } catch (error) {
    console.error("Error creating startup:", error);
    res.status(500).json({ message: "Error creating startup", error: error.message });
  }
};



exports.getAllStartups = async (req, res) => {
  try {
    // Fetch all startups from the database
    const startups = await Startup.find();

    if (!startups || startups.length === 0) {
      return res.status(404).json({ message: "No startups found" });
    }

    res.status(200).json(startups);
  } catch (error) {
    console.error("Error fetching startups:", error);
    res.status(500).json({ message: "Error fetching startups", error: error.message });
  }
};

exports.getStartupById = async (req, res) => {
  try {
    const startupId = req.params.id;

    // Fetch the startup from the database by ID
    const startup = await Startup.findById(startupId);

    if (!startup) {
      return res.status(404).json({ message: "Startup not found" });
    }

    res.status(200).json(startup);
  } catch (error) {
    console.error("Error fetching startup:", error);
    res.status(500).json({ message: "Error fetching startup", error: error.message });
  }
};

exports.investInStartup = async (req, res) => {
  try {
    const { amount } = req.body;
    const startupId = req.params.id;

    // Validate the investment amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Investment amount must be greater than 0" });
    }

    // Fetch the startup from the database by ID
    const startup = await Startup.findById(startupId);
    if (!startup) {
      return res.status(404).json({ message: "Startup not found" });
    }

    const investorIndex = startup.investors.findIndex(investor => investor.userId === req.user.id);
    
    if (investorIndex !== -1) {
      startup.investors[investorIndex].investments.push({ amount });
    } else {
      startup.investors.push({
        userId: req.user.id,
        investments: [{ amount }]
      });
    }

    // Update the current funding of the startup
    startup.currentFunding += amount;

    // Save the updated startup to the database
    await startup.save();

    // Interact with the blockchain to process the investment
    const blockchainTxHash = await blockchainService.investInStartup(startupId, amount);

    res.status(200).json({
      message: "Investment successful",
      startup,
      blockchainTxHash,
    });
  } catch (err) {
    console.error("Error investing in startup:", err);
    res.status(500).json({ message: "Error investing in startup", error: err.message });
  }
};