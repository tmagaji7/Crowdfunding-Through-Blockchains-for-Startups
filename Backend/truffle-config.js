module.exports = {
  networks: {
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777", // Match Ganache's network ID
      gas: 6721975, // Maximum gas allowed
      gasPrice: 20000000000, // 20 Gwei
    },
  },
  compilers: {
    solc: {
      version: "0.8.0", // Use this exact version to avoid conflicts
    },
  },
};
