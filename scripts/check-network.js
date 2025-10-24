const { ethers } = require("hardhat");

async function main() {
  const [signer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  const balance = await ethers.provider.getBalance(signer.address);

  console.log("Network Name:", network.name || "unknown");
  console.log("Chain ID:", network.chainId.toString());
  console.log("Signer Address:", signer.address);
  console.log("Balance:", ethers.formatEther(balance), "ETH");

  if (network.chainId.toString() === "534352") {
    console.log("✅ Connected to Scroll Mainnet");
  } else if (network.chainId.toString() === "534351") {
    console.log("⚠️  Connected to Scroll Sepolia Testnet");
  } else {
    console.log("❌ Not connected to Scroll network");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });