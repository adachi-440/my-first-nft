// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const test = require("../images");

async function main() {
  // We get the contract to deploy
  const GameItem = await hre.ethers.getContractFactory("GameItem");
  const gameItem = await GameItem.deploy();

  await gameItem.deployed();

  console.log("GameItem deployed to:", gameItem.address);

  // stage, number
  let txn = await gameItem.createGameItem(1, 1, test);
  await txn.wait();
  console.log(txn);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
