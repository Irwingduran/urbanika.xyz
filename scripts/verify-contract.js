#!/usr/bin/env node

/**
 * Script para verificar el contrato UrbanikaNFT en Scroll Mainnet
 */

const { ethers } = require('ethers');

const CONTRACT_ADDRESS = '0x263E2E6C8d7a338deBac013143916d9709C18441';
const RPC_URL = 'https://rpc.scroll.io';

// ABI mínimo para verificar funciones
const ABI = [
  'function calculatePrice(uint256 investmentAmount) view returns (uint256)',
  'function calculatePriceInToken(uint256 investmentAmount, address tokenAddress) view returns (uint256)',
  'function pricePerUnit() view returns (uint256)',
  'function tokenPricePerUnit(address tokenAddress) view returns (uint256)',
];

async function main() {
  console.log('🔍 Verificando contrato UrbanikaNFT en Scroll Mainnet\n');
  console.log('📍 Dirección:', CONTRACT_ADDRESS);
  console.log('🌐 RPC:', RPC_URL);
  console.log('');

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

  try {
    // Test 1: pricePerUnit
    console.log('📊 Test 1: pricePerUnit()');
    const pricePerUnit = await contract.pricePerUnit();
    console.log('✅ pricePerUnit:', ethers.formatEther(pricePerUnit), 'ETH');
    console.log('');

    // Test 2: calculatePrice para 500 MXN
    console.log('📊 Test 2: calculatePrice(500)');
    const investmentAmount = ethers.parseEther('500'); // 500 MXN
    const price = await contract.calculatePrice(investmentAmount);
    console.log('✅ calculatePrice(500):', ethers.formatEther(price), 'ETH');
    console.log('');

    // Test 3: tokenPricePerUnit para USDC
    console.log('📊 Test 3: tokenPricePerUnit(USDC)');
    const USDC_ADDRESS = '0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4';
    try {
      const tokenPrice = await contract.tokenPricePerUnit(USDC_ADDRESS);
      console.log('✅ tokenPricePerUnit(USDC):', ethers.formatUnits(tokenPrice, 6), 'USDC');
    } catch (err) {
      console.log('❌ tokenPricePerUnit no existe o falló:', err.message);
    }
    console.log('');

    // Test 4: calculatePriceInToken para USDC
    console.log('📊 Test 4: calculatePriceInToken(500, USDC)');
    try {
      const tokenPriceForAmount = await contract.calculatePriceInToken(investmentAmount, USDC_ADDRESS);
      console.log('✅ calculatePriceInToken(500, USDC):', ethers.formatUnits(tokenPriceForAmount, 6), 'USDC');
    } catch (err) {
      console.log('❌ calculatePriceInToken no existe o falló:', err.message);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main().catch(console.error);
