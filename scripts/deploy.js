// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers, run, network } = require("hardhat");

async function main() {
  // this helps in deploying the contract
  const calculatorFactory = await ethers.getContractFactory("calculator");
  console.log("Deploying contract...");
  const calculator = await calculatorFactory.deploy();
  await calculator.deployed();
  console.log(`Deployed contract to: ${calculator.address}`);
  //-------------------- verifying our contract on etherscan ----------------
  if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
    await calculator.deployTransaction.wait(6);
    await verify(calculator.address, []);
  }
  const Result = await calculator.add(2, 3);
  await Result.wait(1);
  const getRes = await calculator.display();
  console.log(`Numbers added: ${getRes}`);
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
async function verify(contractAddress, args) {
  console.log("Verifying the contract...");

  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified.");
    } else {
      console.log(e);
    }
  }
}
