require("@nomicfoundation/hardhat-toolbox");
require("dotenv/config");

// Register ts-node with correct config
require("ts-node").register({
  transpileOnly: true,
  project: "./tsconfig-hardhat.json",
});

/**
 * Configuración de Hardhat para Urbanika
 * Red principal: Scroll (zkEVM)
 *
 * Redes disponibles:
 * - scroll: Scroll Mainnet (producción)
 * - scrollSepolia: Scroll Sepolia Testnet (desarrollo) ✅ Recomendado para testing
 * - localhost: Red local de Hardhat
 *
 * Información oficial de Scroll Sepolia:
 * - RPC URL: https://sepolia-rpc.scroll.io/
 * - Chain ID: 534351
 * - Currency: ETH
 * - Explorer: https://sepolia.scrollscan.com/
 *
 * Versión estable:
 * - Hardhat 2.26.3 (compatible con Node.js 20)
 * - @nomicfoundation/hardhat-toolbox 5.0.0
 */

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true, // Importante para contratos grandes
    },
  },

  networks: {
    // Red local de Hardhat (para desarrollo y testing)
    hardhat: {
      chainId: 31337,
      gas: "auto",
      gasPrice: "auto",
    },

    // Scroll Sepolia Testnet (para testing en red de prueba) 🎯 RECOMENDADO
    scrollSepolia: {
      url: process.env.SCROLL_SEPOLIA_RPC_URL || "https://sepolia-rpc.scroll.io/",
      chainId: 534351,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: "auto",
    },

    // Scroll Mainnet (producción)
    scroll: {
      url: process.env.SCROLL_RPC_URL || "https://rpc.scroll.io/",
      chainId: 534352,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: "auto",
    },

    // Ethereum Sepolia (para obtener ETH de faucet y bridgear a Scroll Sepolia)
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://rpc2.sepolia.org",
      chainId: 11155111,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: "auto",
    },
  },

  // Etherscan verification (Scroll usa Scrollscan)
  etherscan: {
    apiKey: {
      scroll: process.env.SCROLLSCAN_API_KEY || "abc",
      scrollSepolia: process.env.SCROLLSCAN_API_KEY || "abc",
      sepolia: process.env.ETHERSCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "scroll",
        chainId: 534352,
        urls: {
          apiURL: "https://api.scrollscan.com/api",
          browserURL: "https://scrollscan.com/",
        },
      },
      {
        network: "scrollSepolia",
        chainId: 534351,
        urls: {
          apiURL: "https://api-sepolia.scrollscan.com/api",
          browserURL: "https://sepolia.scrollscan.com/",
        },
      },
    ],
  },

  // Gas reporter para optimización
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },

  // Paths personalizados
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
