#!/usr/bin/env node

/**
 * Script para verificar los headers CSP en producción
 * Ejecutar con: node scripts/check-csp.js
 */

const https = require('https');

const url = 'https://urbanika.xyz';

console.log(`🔍 Verificando headers CSP en: ${url}\n`);

https.get(url, (res) => {
  console.log('📊 Status Code:', res.statusCode);
  console.log('\n🔒 Security Headers:\n');

  const csp = res.headers['content-security-policy'];
  const xframe = res.headers['x-frame-options'];
  const xcontent = res.headers['x-content-type-options'];

  if (csp) {
    console.log('✅ Content-Security-Policy encontrado:');
    console.log(csp);
    console.log('\n');

    // Verificar si tiene unsafe-eval
    if (csp.includes("'unsafe-eval'")) {
      console.log('✅ unsafe-eval está presente');
    } else {
      console.log('❌ unsafe-eval NO está presente - Este es el problema!');
    }

    // Verificar si tiene unsafe-inline
    if (csp.includes("'unsafe-inline'")) {
      console.log('✅ unsafe-inline está presente');
    } else {
      console.log('❌ unsafe-inline NO está presente');
    }
  } else {
    console.log('❌ No se encontró Content-Security-Policy header');
  }

  console.log('\n📝 Otros headers de seguridad:');
  console.log('X-Frame-Options:', xframe || 'No presente');
  console.log('X-Content-Type-Options:', xcontent || 'No presente');

}).on('error', (e) => {
  console.error('❌ Error:', e.message);
});
