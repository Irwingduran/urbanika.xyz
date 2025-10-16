import { ethers } from "hardhat";

/**
 * Script para actualizar el precio por unidad (pricePerUnit) en el contrato
 *
 * Este script te permite ajustar el precio de minteo de NFTs según las tasas
 * de cambio actuales de ETH/USD y MXN/USD
 *
 * Uso:
 * npx hardhat run scripts/update-price.ts --network scrollMainnet
 */

async function main() {
  // Dirección del contrato desplegado
  const CONTRACT_ADDRESS = process.env.URBANIKA_NFT_ADDRESS || "";

  if (!CONTRACT_ADDRESS) {
    console.error("❌ Error: Define URBANIKA_NFT_ADDRESS en tu .env");
    process.exit(1);
  }

  console.log("💰 Actualizando precio del NFT de Urbanika...\n");

  const [signer] = await ethers.getSigners();
  console.log("🔑 Wallet (owner):", signer.address);
  console.log("📍 Contrato:", CONTRACT_ADDRESS);
  console.log();

  // Obtener instancia del contrato
  const UrbanikaNFT = await ethers.getContractFactory("UrbanikaNFT");
  const contract = UrbanikaNFT.attach(CONTRACT_ADDRESS);

  // Verificar que el caller es el owner
  const owner = await contract.owner();
  if (owner.toLowerCase() !== signer.address.toLowerCase()) {
    console.error("❌ Error: Solo el owner puede actualizar el precio");
    console.error("Owner esperado:", owner);
    console.error("Tu wallet:", signer.address);
    process.exit(1);
  }

  // Obtener precio actual
  const currentPrice = await contract.pricePerUnit();
  console.log("📊 Precio actual por 100 MXN:", ethers.formatEther(currentPrice), "ETH");
  console.log();

  // ============ CONFIGURACIÓN DEL NUEVO PRECIO ============

  // Opción 1: Calcular precio dinámicamente
  // Tasas actualizadas: 16 de Octubre 2025
  const MXN_TO_USD = 0.054283; // 1 MXN = 0.054283 USD (Fuente: exchange-rates.org)
  const ETH_PRICE_USD = 4027; // Precio de ETH en USD (Fuente: CoinMarketCap)
  const MXN_PER_UNIT = 100; // Unidad base: 100 MXN

  const usdPerUnit = MXN_PER_UNIT * MXN_TO_USD; // 100 MXN en USD
  const ethPerUnit = usdPerUnit / ETH_PRICE_USD; // Convertir USD a ETH

  const newPrice = ethers.parseEther(ethPerUnit.toString());

  console.log("🔢 Cálculo del nuevo precio:");
  console.log(`- 100 MXN = $${usdPerUnit.toFixed(2)} USD`);
  console.log(`- ETH/USD = $${ETH_PRICE_USD}`);
  console.log(`- Nuevo precio = ${ethers.formatEther(newPrice)} ETH por 100 MXN`);
  console.log();

  // Opción 2: Establecer precio manualmente (descomenta para usar)
  // const newPrice = ethers.parseEther("0.001833"); // ETH por 100 MXN

  console.log("💡 Ejemplo: Inversión de 250 MXN costaría:", ethers.formatEther(newPrice.valueOf() * 250n / 100n), "ETH");
  console.log("💡 Ejemplo: Inversión de 1000 MXN costaría:", ethers.formatEther(newPrice.valueOf() * 1000n / 100n), "ETH");
  console.log();

  // Confirmar cambio
  console.log("⚠️  ¿Deseas actualizar el precio?");
  console.log(`   De: ${ethers.formatEther(currentPrice)} ETH`);
  console.log(`   A:  ${ethers.formatEther(newPrice)} ETH`);
  console.log();
  console.log("⏳ Enviando transacción...");

  // Actualizar precio
  const tx = await contract.setPricePerUnit(newPrice);
  console.log("📤 Transaction hash:", tx.hash);
  console.log("⏳ Esperando confirmación...");

  const receipt = await tx.wait();
  console.log("✅ Precio actualizado en el bloque:", receipt?.blockNumber);

  // Verificar nuevo precio
  const updatedPrice = await contract.pricePerUnit();
  console.log();
  console.log("🎉 Precio actualizado exitosamente!");
  console.log("📊 Nuevo precio por 100 MXN:", ethers.formatEther(updatedPrice), "ETH");

  // Calcular ejemplos de costos
  console.log();
  console.log("📋 Costos de inversión actualizados:");
  console.log("- 250 MXN:", ethers.formatEther(updatedPrice.valueOf() * 250n / 100n), "ETH");
  console.log("- 500 MXN:", ethers.formatEther(updatedPrice.valueOf() * 500n / 100n), "ETH");
  console.log("- 1000 MXN:", ethers.formatEther(updatedPrice.valueOf() * 1000n / 100n), "ETH");
  console.log("- 5000 MXN:", ethers.formatEther(updatedPrice.valueOf() * 5000n / 100n), "ETH");
  console.log("- 10000 MXN:", ethers.formatEther(updatedPrice.valueOf() * 10000n / 100n), "ETH");
  console.log();
  console.log("✅ Listo! Los usuarios ahora pagarán el nuevo precio al mintear NFTs.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
