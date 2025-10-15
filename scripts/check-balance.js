const { ethers } = require("ethers");
require("dotenv/config");

/**
 * Script para verificar el balance de tu wallet en Scroll Sepolia
 *
 * Uso:
 * node scripts/check-balance.js
 * node scripts/check-balance.js --watch (monitorear continuamente)
 */

const SCROLL_SEPOLIA_RPC = process.env.SCROLL_SEPOLIA_RPC_URL || "https://sepolia-rpc.scroll.io/";
const PRIVATE_KEY = process.env.PRIVATE_KEY;

async function checkBalance() {
  if (!PRIVATE_KEY || PRIVATE_KEY === "your_private_key_here") {
    console.error("❌ Error: PRIVATE_KEY no configurada en .env");
    process.exit(1);
  }

  try {
    // Connect to Scroll Sepolia
    const provider = new ethers.JsonRpcProvider(SCROLL_SEPOLIA_RPC);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    // Get balance
    const balance = await provider.getBalance(wallet.address);
    const balanceInEth = ethers.formatEther(balance);

    // Get network info
    const network = await provider.getNetwork();
    const blockNumber = await provider.getBlockNumber();

    console.log("\n💰 Balance de tu Wallet");
    console.log("================================================");
    console.log("📍 Address:", wallet.address);
    console.log("🌐 Network:", network.name, `(Chain ID: ${network.chainId})`);
    console.log("📦 Block:", blockNumber);
    console.log("💵 Balance:", balanceInEth, "ETH");
    console.log("================================================\n");

    const MIN_BALANCE = "0.001"; // 0.001 ETH mínimo

    if (parseFloat(balanceInEth) === 0) {
      console.log("❌ No tienes ETH en tu wallet\n");
      console.log("📋 Para obtener ETH en Scroll Sepolia:");
      console.log("1. Ve a: https://sepoliafaucet.com/");
      console.log("2. Obtén Sepolia ETH");
      console.log("3. Bridge a Scroll Sepolia: https://sepolia.scroll.io/bridge");
      console.log("4. Usa tu address:", wallet.address);
      console.log("\nO usa faucets directos: https://docs.scroll.io/en/user-guide/faucet/\n");
      return false;
    } else if (parseFloat(balanceInEth) < parseFloat(MIN_BALANCE)) {
      console.log(`⚠️  Tu balance es bajo (< ${MIN_BALANCE} ETH)`);
      console.log("   Recomendado: al menos 0.01 ETH para deployments\n");
      return false;
    } else {
      console.log("✅ Tienes suficiente ETH para deployment!");
      console.log(`   Balance actual: ${balanceInEth} ETH\n`);
      return true;
    }
  } catch (error) {
    console.error("❌ Error al verificar balance:", error.message);
    return false;
  }
}

async function watchBalance() {
  console.log("👀 Monitoreando balance cada 10 segundos...");
  console.log("   Presiona Ctrl+C para detener\n");

  while (true) {
    const hasBalance = await checkBalance();

    if (hasBalance) {
      console.log("🎉 ¡Balance detectado! Puedes continuar con el deployment.\n");
      process.exit(0);
    }

    // Wait 10 seconds
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }
}

// Main
const args = process.argv.slice(2);
const watchMode = args.includes("--watch") || args.includes("-w");

if (watchMode) {
  watchBalance();
} else {
  checkBalance().then(() => process.exit(0));
}
