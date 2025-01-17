const mongoose = require("mongoose");
const Startup = require("./models/Startup");
const User = require("./models/User");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const dummyStartups = [
  {
    name: "Tech Innovators",
    description: "A revolutionary tech startup.",
    fundingGoal: 1000,
    currentFunding: 500,
    investmentTiers: [
      { tier: "Bronze", amount: 10 },
      { tier: "Silver", amount: 50 },
      { tier: "Gold", amount: 100 },
    ],
  },
  {
    name: "Green Energy Solutions",
    description: "Startup focused on renewable energy solutions.",
    fundingGoal: 2000,
    currentFunding: 1200,
    investmentTiers: [
      { tier: "Bronze", amount: 20 },
      { tier: "Silver", amount: 100 },
      { tier: "Gold", amount: 200 },
    ],
  },
  {
    name: "FinTech Innovators",
    description: "A fintech startup disrupting financial systems.",
    fundingGoal: 5000,
    currentFunding: 2500,
    investmentTiers: [
      { tier: "Bronze", amount: 50 },
      { tier: "Silver", amount: 200 },
      { tier: "Gold", amount: 500 },
    ],
  },
];

const dummyUsers = [
  {
    username: "Alice Johnson",
    email: "alice@example.com",
    password: "password123",
  },
  {
    username: "Bob Smith",
    email: "bob@example.com",
    password: "password456",
  },
  {
    username: "Charlie Brown",
    email: "charlie@example.com",
    password: "password789",
  },
];

const insertDummyData = async () => {
  try {
    await connectDB();
    await Startup.deleteMany(); // Flush the data from the database
    await User.deleteMany(); // Flush users from the database

    for (const startupData of dummyStartups) {
      const startup = new Startup(startupData);
      await startup.save();
    }

    for (const userData of dummyUsers) {
      const user = new User(userData);
      await user.save();
    }

    console.log("Dummy data inserted successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error inserting dummy data:", error);
    mongoose.connection.close();
  }
};

insertDummyData();
