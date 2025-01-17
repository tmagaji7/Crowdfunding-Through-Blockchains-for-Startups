// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Crowdfunding {
    struct Startup {
        string name;
        string description;
        uint fundingGoal;
        uint currentFunding;
        bool fundingClosed;
    }

    // Mapping from string ID to Startup
    mapping(string => Startup) public startups;
    string[] public startupIds;  // To keep track of startup IDs

    // Create a new startup with a string ID
    function createStartup(string memory id, string memory name, string memory description, uint fundingGoal) public returns (bool) {
        require(bytes(id).length > 0, "ID cannot be empty");

        // Ensure that the startup ID doesn't already exist
        require(startups[id].fundingGoal == 0, "Startup with this ID already exists");

        startups[id] = Startup({
            name: name,
            description: description,
            fundingGoal: fundingGoal,
            currentFunding: 0,
            fundingClosed: false
        });

        // Add the startup ID to the list of startupIds
        startupIds.push(id);

        return true;
    }

    // Get details of a startup by ID
    function getStartupDetails(string memory id) public view returns (string memory, string memory, uint, uint, bool) {
        require(startups[id].fundingGoal > 0, "Startup not found");

        Startup storage s = startups[id];
        return (s.name, s.description, s.fundingGoal, s.currentFunding, s.fundingClosed);
    }

    // Invest in a startup by providing its string ID
    function invest(string memory startupId) public payable {
        require(bytes(startupId).length > 0, "Startup ID is required");
        require(startups[startupId].fundingGoal > 0, "Startup not found");

        Startup storage s = startups[startupId];

        require(!s.fundingClosed, "Funding is closed for this startup");
        require(msg.value > 0, "Investment amount must be greater than 0");

        s.currentFunding += msg.value;

        // Check if funding goal is reached and close the funding if it is
        if (s.currentFunding >= s.fundingGoal) {
            s.fundingClosed = true;
        }
    }

    // Get the number of startups created
    function getStartupCount() public view returns (uint) {
        return startupIds.length;
    }
}
