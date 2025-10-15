import { ethers } from "hardhat";

/**
 * Script de ejemplo para mintear un NFT
 *
 * Uso:
 * npx hardhat run scripts/mint-example.ts --network scrollSepolia
 */

async function main() {
  // IMPORTANTE: Reemplaza con la dirección del contrato desplegado
  const CONTRACT_ADDRESS = process.env.URBANIKA_NFT_ADDRESS || "";

  if (!CONTRACT_ADDRESS) {
    console.error("❌ Error: Define URBANIKA_NFT_ADDRESS en tu .env");
    process.exit(1);
  }

  console.log("🎨 Minteando NFT de Urbanika...\n");

  const [signer] = await ethers.getSigners();
  console.log("Wallet:", signer.address);

  // Get contract instance
  const UrbanikaNFT = await ethers.getContractFactory("UrbanikaNFT");
  const contract = UrbanikaNFT.attach(CONTRACT_ADDRESS);

  // Datos de ejemplo
  const investorAddress = signer.address; // O cambia por otra dirección
  const investmentAmount = ethers.parseEther("500"); // 500 MXN en wei
  const tokenURI = "ipfs://QmExample.../metadata.json"; // Reemplaza con tu URI de IPFS
  const investorEmail = "investor@example.com";

  console.log("📋 Datos del mint:");
  console.log("- Investor:", investorAddress);
  console.log("- Amount:", ethers.formatEther(investmentAmount), "MXN");
  console.log("- Token URI:", tokenURI);
  console.log("- Email:", investorEmail);
  console.log();

  // Mint NFT
  console.log("⏳ Minteando NFT...");
  const tx = await contract.mint(
    investorAddress,
    investmentAmount,
    tokenURI,
    investorEmail
  );

  console.log("📤 Transaction hash:", tx.hash);
  console.log("⏳ Esperando confirmación...");

  const receipt = await tx.wait();
  console.log("✅ NFT minteado en el bloque:", receipt?.blockNumber);

  // Get token ID from event
  const mintEvent = receipt?.logs.find(
    (log: any) => log.fragment?.name === "NFTMinted"
  );

  if (mintEvent) {
    console.log("\n🎉 NFT creado exitosamente!");
    console.log("Token ID:", mintEvent.args?.tokenId.toString());
    console.log("Investment Amount:", ethers.formatEther(mintEvent.args?.investmentAmount), "MXN");
    console.log("Expected Return:", ethers.formatEther(mintEvent.args?.expectedReturn), "MXN");
    console.log("Tier:", getTierName(mintEvent.args?.tier));
  }

  // Get investment details
  const tokenId = 1; // Ajusta según corresponda
  const investment = await contract.getInvestment(tokenId);

  console.log("\n📊 Detalles de la inversión:");
  console.log("- Investment Amount:", ethers.formatEther(investment.investmentAmount), "MXN");
  console.log("- Expected Return:", ethers.formatEther(investment.expectedReturn), "MXN");
  console.log("- Current Return:", ethers.formatEther(investment.currentReturn), "MXN");
  console.log("- Tier:", getTierName(investment.tier));
  console.log("- Active:", investment.isActive);
  console.log("- Mint Date:", new Date(Number(investment.mintDate) * 1000).toLocaleString());
}

function getTierName(tier: number): string {
  const tiers = ["Bronze", "Silver", "Gold", "Platinum"];
  return tiers[tier] || "Unknown";
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
