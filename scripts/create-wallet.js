const { ethers } = require("ethers");

/**
 * Script para generar una nueva wallet de desarrollo
 *
 * ⚠️ SOLO PARA DESARROLLO/TESTNET
 * NO uses estas wallets para mainnet con fondos reales
 *
 * Uso:
 * node scripts/create-wallet.js
 */

async function main() {
  console.log("🔐 Generando nueva wallet de desarrollo...\n");

  // Create random wallet
  const wallet = ethers.Wallet.createRandom();

  console.log("✅ Wallet generada exitosamente!\n");
  console.log("================================================");
  console.log("📍 Address:", wallet.address);
  console.log("🔑 Private Key:", wallet.privateKey);
  console.log("📝 Mnemonic:", wallet.mnemonic.phrase);
  console.log("================================================\n");

  console.log("⚠️  IMPORTANTE - Seguridad:");
  console.log("1. Esta wallet es NUEVA y NO tiene fondos");
  console.log("2. Guarda la private key en tu .env");
  console.log("3. NUNCA compartas tu private key");
  console.log("4. Esta wallet es SOLO para testnet/desarrollo");
  console.log("5. NO uses esta wallet en mainnet con fondos reales\n");

  console.log("📋 Próximos pasos:");
  console.log("1. Copia tu Private Key (sin el prefijo 0x):");
  console.log(`   ${wallet.privateKey.substring(2)}`);
  console.log("\n2. Agrégala a tu archivo .env:");
  console.log(`   PRIVATE_KEY=${wallet.privateKey.substring(2)}`);
  console.log("\n3. Guarda tu Address para recibir ETH:");
  console.log(`   ${wallet.address}`);
  console.log("\n4. Ve al paso 2 para obtener ETH en Scroll Sepolia\n");

  console.log("💡 Tip: Guarda el mnemonic en un lugar seguro.");
  console.log("   Puedes recuperar tu wallet con estas 12 palabras.\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
