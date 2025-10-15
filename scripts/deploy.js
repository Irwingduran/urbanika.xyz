const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Iniciando deployment de UrbanikaNFT en Scroll...\n");

  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);

  console.log("📋 Información del deployment:");
  console.log("===============================");
  console.log("Deployer address:", deployer.address);
  console.log("Deployer balance:", ethers.formatEther(balance), "ETH");

  const network = await ethers.provider.getNetwork();
  console.log("Network:", network.name);
  console.log("Chain ID:", network.chainId.toString());
  console.log("===============================\n");

  console.log("📝 Desplegando contrato UrbanikaNFT...");

  // Treasury address (multisig)
  const treasuryAddress = "0x128D2A83a8ef740907B221825636A64c67807d93";
  console.log("💰 Treasury address:", treasuryAddress);

  const UrbanikaNFT = await ethers.getContractFactory("UrbanikaNFT");
  const urbanikaNFT = await UrbanikaNFT.deploy(treasuryAddress);
  await urbanikaNFT.waitForDeployment();

  const contractAddress = await urbanikaNFT.getAddress();

  console.log("\n✅ UrbanikaNFT desplegado exitosamente!");
  console.log("===============================");
  console.log("📍 Contract address:", contractAddress);
  const chainId = network.chainId.toString();
  if (chainId === "534351") {
    console.log("🔗 Explorador: https://sepolia.scrollscan.com/address/" + contractAddress);
  }
  console.log("===============================\n");

  console.log("💡 Guarda esta dirección en tu .env:");
  console.log("URBANIKA_NFT_ADDRESS=" + contractAddress);
}

main().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1);
});
