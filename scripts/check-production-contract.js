#!/usr/bin/env node

const https = require('https');

console.log('🔍 Verificando qué contrato está usando producción...\n');

https.get('https://www.urbanika.xyz/nft', (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    // Buscar direcciones de contrato en el HTML
    const addresses = data.match(/0x[a-fA-F0-9]{40}/g);

    if (addresses) {
      const uniqueAddresses = [...new Set(addresses)];
      console.log('📍 Direcciones encontradas en producción:');
      uniqueAddresses.forEach(addr => {
        if (addr === '0xC099aC09eE9bc5dFB6d24B932E2E01aE59593b88') {
          console.log('  ✅', addr, '(NUEVO - Multi-token)');
        } else if (addr === '0x263E2E6C8d7a338deBac013143916d9709C18441') {
          console.log('  ❌', addr, '(VIEJO - Solo ETH)');
        } else {
          console.log('  ℹ️ ', addr);
        }
      });

      if (uniqueAddresses.includes('0x263E2E6C8d7a338deBac013143916d9709C18441')) {
        console.log('\n❌ PROBLEMA: Producción sigue usando el contrato viejo!');
        console.log('Posibles causas:');
        console.log('  1. Vercel no desplegó correctamente');
        console.log('  2. Hay un archivo .env en Vercel con el valor viejo');
        console.log('  3. El código no se actualizó');
      } else if (uniqueAddresses.includes('0xC099aC09eE9bc5dFB6d24B932E2E01aE59593b88')) {
        console.log('\n✅ Producción está usando el contrato nuevo!');
      } else {
        console.log('\n⚠️  No se encontró ninguna dirección de contrato conocida');
      }
    } else {
      console.log('❌ No se encontraron direcciones de contrato');
    }
  });
}).on('error', (e) => {
  console.error('❌ Error:', e.message);
});
