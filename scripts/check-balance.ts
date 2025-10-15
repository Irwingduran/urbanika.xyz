import { ethers } from "hardhat";

/**
 * Script para verificar el balance de la wallet
 * Útil antes de hacer deployment
 *
 * Uso:
 * npx hardhat run scripts/check-balance.ts --network scrollSepolia
 */

async function main() {
  console.log("💰 Verificando balance de la wallet...\n");

  const [signer] = await ethers.getSigners();
  const address = signer.address;
  const balance = await ethers.provider.getBalance(address);

  const network = await ethers.provider.getNetwork();

  console.log("📋 Información de la wallet:");
  console.log("===============================");
  console.log("Address:", address);
  console.log("Network:", network.name);
  console.log("Chain ID:", network.chainId.toString());
  console.log("Balance:", ethers.formatEther(balance), "ETH");
  console.log("===============================\n");

  // Check if balance is sufficient
  const minBalance = ethers.parseEther("0.001"); // 0.001 ETH mínimo

  if (balance === 0n) {
    console.error("❌ No tienes ETH en esta wallet!");
    console.log("\n💡 Para obtener ETH en Scroll Sepolia:");
    console.log("1. Visita: https://sepoliafaucet.com/");
    console.log("2. Obtén Sepolia ETH");
    console.log("3. Bridge a Scroll Sepolia: https://sepolia.scroll.io/bridge");
  } else if (balance < minBalance) {
    console.warn("⚠️  Tu balance es muy bajo. Considera agregar más ETH.");
    console.log("Recomendado: al menos 0.01 ETH para deployments");
  } else {
    console.log("✅ Tienes suficiente ETH para hacer deployment!");
  }

  // Get block number
  const blockNumber = await ethers.provider.getBlockNumber();
  console.log("\n📊 Block actual:", blockNumber);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
