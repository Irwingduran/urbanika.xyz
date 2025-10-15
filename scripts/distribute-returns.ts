import { ethers } from "hardhat";

/**
 * Script para distribuir retornos a los holders de NFTs
 *
 * Uso:
 * npx hardhat run scripts/distribute-returns.ts --network scrollSepolia
 */

async function main() {
  const CONTRACT_ADDRESS = process.env.URBANIKA_NFT_ADDRESS || "";

  if (!CONTRACT_ADDRESS) {
    console.error("❌ Error: Define URBANIKA_NFT_ADDRESS en tu .env");
    process.exit(1);
  }

  console.log("💰 Distribuyendo retornos a NFT holders...\n");

  const [signer] = await ethers.getSigners();
  console.log("Admin wallet:", signer.address);

  // Get contract instance
  const UrbanikaNFT = await ethers.getContractFactory("UrbanikaNFT");
  const contract = UrbanikaNFT.attach(CONTRACT_ADDRESS);

  // Verificar que el caller es el owner
  const owner = await contract.owner();
  if (owner.toLowerCase() !== signer.address.toLowerCase()) {
    console.error("❌ Error: Solo el owner puede distribuir retornos");
    console.error("Owner:", owner);
    console.error("Tu address:", signer.address);
    process.exit(1);
  }

  // Ejemplo: Distribuir retornos a varios NFTs
  // Ajusta estos valores según tus necesidades
  const distributions = [
    { tokenId: 1, amount: ethers.parseEther("50") },  // 50 MXN al token #1
    { tokenId: 2, amount: ethers.parseEther("100") }, // 100 MXN al token #2
    // Agrega más según necesites
  ];

  console.log("📋 Distribuciones a realizar:");
  distributions.forEach(d => {
    console.log(`- Token #${d.tokenId}: ${ethers.formatEther(d.amount)} MXN`);
  });
  console.log();

  // Opción 1: Distribuir individualmente
  console.log("⏳ Distribuyendo retornos...");
  for (const dist of distributions) {
    try {
      // Verificar que el token existe y está activo
      const investment = await contract.getInvestment(dist.tokenId);

      if (!investment.isActive) {
        console.log(`⚠️  Token #${dist.tokenId} ya está completado, saltando...`);
        continue;
      }

      const remaining = investment.expectedReturn - investment.currentReturn;
      console.log(`\n📊 Token #${dist.tokenId}:`);
      console.log(`   Restante: ${ethers.formatEther(remaining)} MXN`);
      console.log(`   A distribuir: ${ethers.formatEther(dist.amount)} MXN`);

      const tx = await contract.distributeReturn(dist.tokenId, dist.amount);
      console.log(`   📤 Tx hash: ${tx.hash}`);

      const receipt = await tx.wait();
      console.log(`   ✅ Distribuido en bloque: ${receipt?.blockNumber}`);

      // Verificar nuevo estado
      const updatedInvestment = await contract.getInvestment(dist.tokenId);
      const progress = await contract.getReturnProgress(dist.tokenId);
      console.log(`   📈 Progreso: ${progress}%`);
      console.log(`   💰 Total recibido: ${ethers.formatEther(updatedInvestment.currentReturn)} MXN`);

      if (!updatedInvestment.isActive) {
        console.log(`   🎉 ¡Inversión completada!`);
      }
    } catch (error: any) {
      console.error(`   ❌ Error distribuyendo a token #${dist.tokenId}:`, error.message);
    }
  }

  // Opción 2: Distribución batch (más eficiente en gas)
  // Descomenta si prefieres usar batch
  /*
  console.log("\n⏳ Distribuyendo en batch...");
  const tokenIds = distributions.map(d => d.tokenId);
  const amounts = distributions.map(d => d.amount);

  const tx = await contract.batchDistributeReturn(tokenIds, amounts);
  console.log("📤 Tx hash:", tx.hash);

  const receipt = await tx.wait();
  console.log("✅ Batch distribuido en bloque:", receipt?.blockNumber);
  */

  console.log("\n🎉 Distribución completada!");

  // Mostrar stats totales
  const totalInvestment = await contract.totalInvestmentAmount();
  const totalDistributed = await contract.totalDistributed();
  const activeNFTs = await contract.getActiveNFTCount();

  console.log("\n📊 Estadísticas totales:");
  console.log("- Total invertido:", ethers.formatEther(totalInvestment), "MXN");
  console.log("- Total distribuido:", ethers.formatEther(totalDistributed), "MXN");
  console.log("- NFTs activos:", activeNFTs.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
