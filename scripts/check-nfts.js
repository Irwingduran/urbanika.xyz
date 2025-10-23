#!/usr/bin/env node

const { ethers } = require('ethers');

const CONTRACT_ADDRESS = '0x263E2E6C8d7a338deBac013143916d9709C18441';
const RPC_URL = 'https://rpc.scroll.io';

const ABI = [
  'function totalSupply() view returns (uint256)',
  'function activeNFTCount() view returns (uint256)',
  'function totalInvestmentAmount() view returns (uint256)',
  'function totalDistributed() view returns (uint256)',
];

async function main() {
  console.log('🔍 Verificando NFTs existentes en el contrato actual\n');

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

  try {
    const totalSupply = await contract.totalSupply();
    const activeNFTs = await contract.activeNFTCount();
    const totalInvestment = await contract.totalInvestmentAmount();
    const totalDistributed = await contract.totalDistributed();

    console.log('📊 Estado del Contrato Actual:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎫 Total NFTs minteados:', totalSupply.toString());
    console.log('✅ NFTs activos:', activeNFTs.toString());
    console.log('💰 Inversión total:', ethers.formatEther(totalInvestment), 'MXN');
    console.log('📤 Total distribuido:', ethers.formatEther(totalDistributed), 'MXN');
    console.log('');

    if (totalSupply > 0) {
      console.log('⚠️  ADVERTENCIA: Hay', totalSupply.toString(), 'NFTs existentes');
      console.log('⚠️  Estos NFTs NO serán transferidos al nuevo contrato');
      console.log('⚠️  Los holders perderán acceso a estos NFTs');
      console.log('');
    } else {
      console.log('✅ No hay NFTs existentes. Seguro para desplegar nuevo contrato.');
      console.log('');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main().catch(console.error);
