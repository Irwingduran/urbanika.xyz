#!/usr/bin/env node

/**
 * Script de verificación de seguridad para producción
 * Ejecutar antes de cada deploy a producción
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔒 Verificación de Seguridad para Producción\n');
console.log('============================================\n');

let hasErrors = false;
let hasWarnings = false;

// 1. Verificar que no hay console.logs en el código
console.log('1️⃣ Verificando console.logs...');
try {
  const result = execSync(
    'grep -r "console\\." --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" app/ components/ lib/ hooks/ 2>/dev/null | grep -v "node_modules" | grep -v ".next" | wc -l',
    { encoding: 'utf8' }
  ).trim();

  const consoleCount = parseInt(result);
  if (consoleCount > 0) {
    console.error(`   ❌ Encontrados ${consoleCount} console.log statements`);
    hasErrors = true;
  } else {
    console.log('   ✅ No se encontraron console.logs');
  }
} catch (e) {
  console.log('   ✅ No se encontraron console.logs');
}

// 2. Verificar que las variables de entorno críticas están configuradas
console.log('\n2️⃣ Verificando variables de entorno críticas...');
const requiredEnvVars = [
  'API_SECRET_KEY',
  'DATABASE_URL',
  'PINATA_JWT',
  'STRIPE_SECRET_KEY'
];

const envFile = '.env.production.local';
if (!fs.existsSync(envFile)) {
  console.error('   ❌ Archivo .env.production.local no encontrado');
  console.error('   ℹ️  Copia .env.production.example a .env.production.local y configura las variables');
  hasErrors = true;
} else {
  const envContent = fs.readFileSync(envFile, 'utf8');
  requiredEnvVars.forEach(varName => {
    const regex = new RegExp(`^${varName}=.+`, 'm');
    if (!regex.test(envContent)) {
      console.error(`   ❌ Variable ${varName} no configurada o vacía`);
      hasErrors = true;
    } else {
      console.log(`   ✅ ${varName} configurada`);
    }
  });
}

// 3. Verificar que no hay API endpoints sin protección
console.log('\n3️⃣ Verificando protección de API endpoints...');
const apiRoutes = [
  'app/api/ipfs/upload/route.ts',
  'app/api/leads/notify/route.ts',
  'app/api/leads/update-mint/route.ts'
];

apiRoutes.forEach(route => {
  const fullPath = path.join(process.cwd(), route);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    if (!content.includes('protectedApiRoute') && !content.includes('checkRateLimit')) {
      console.error(`   ⚠️  ${route} puede no estar protegido`);
      hasWarnings = true;
    } else {
      console.log(`   ✅ ${route} tiene protección`);
    }
  }
});

// 4. Verificar que no hay archivos sensibles
console.log('\n4️⃣ Verificando archivos sensibles...');
const sensitiveFiles = [
  '.env',
  '.env.local',
  '.env.production',
  'hardhat.config.js',
  'scripts/deploy.js',
  'scripts/test-oracle.js'
];

sensitiveFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const gitIgnoreContent = fs.readFileSync('.gitignore', 'utf8');
    if (!gitIgnoreContent.includes(file)) {
      console.error(`   ❌ ${file} no está en .gitignore`);
      hasErrors = true;
    } else {
      console.log(`   ✅ ${file} está en .gitignore`);
    }
  }
});

// 5. Verificar dependencias vulnerables
console.log('\n5️⃣ Verificando vulnerabilidades en dependencias...');
try {
  execSync('npm audit --audit-level=high', { stdio: 'pipe' });
  console.log('   ✅ No se encontraron vulnerabilidades críticas');
} catch (e) {
  console.error('   ⚠️  Existen vulnerabilidades en las dependencias');
  console.log('   ℹ️  Ejecuta: npm audit fix');
  hasWarnings = true;
}

// 6. Verificar que middleware de autenticación existe
console.log('\n6️⃣ Verificando middleware de autenticación...');
const authMiddleware = 'lib/auth/middleware.ts';
if (!fs.existsSync(authMiddleware)) {
  console.error('   ❌ Middleware de autenticación no encontrado');
  hasErrors = true;
} else {
  console.log('   ✅ Middleware de autenticación presente');
}

// 7. Verificar configuración de CORS
console.log('\n7️⃣ Verificando configuración de CORS...');
const nextConfig = 'next.config.js';
if (fs.existsSync(nextConfig)) {
  const content = fs.readFileSync(nextConfig, 'utf8');
  if (!content.includes('headers') && !content.includes('cors')) {
    console.warn('   ⚠️  CORS no está configurado explícitamente');
    hasWarnings = true;
  } else {
    console.log('   ✅ Configuración de CORS presente');
  }
}

// 8. Verificar que no hay claves hardcodeadas
console.log('\n8️⃣ Verificando claves hardcodeadas...');
try {
  const result = execSync(
    'grep -r "sk_live\\|pk_live\\|0x[a-fA-F0-9]\\{64\\}" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" app/ components/ lib/ hooks/ 2>/dev/null | wc -l',
    { encoding: 'utf8' }
  ).trim();

  const keyCount = parseInt(result);
  if (keyCount > 0) {
    console.error(`   ⚠️  Posibles claves hardcodeadas encontradas`);
    hasWarnings = true;
  } else {
    console.log('   ✅ No se encontraron claves hardcodeadas');
  }
} catch (e) {
  console.log('   ✅ No se encontraron claves hardcodeadas');
}

// Resumen
console.log('\n============================================');
console.log('📊 RESUMEN\n');

if (!hasErrors && !hasWarnings) {
  console.log('✅ ¡Todas las verificaciones pasaron! El proyecto está listo para producción.');
  process.exit(0);
} else {
  if (hasErrors) {
    console.error(`❌ Se encontraron ${hasErrors ? 'errores críticos' : ''} que deben resolverse.`);
  }
  if (hasWarnings) {
    console.warn(`⚠️  Se encontraron advertencias que deberían revisarse.`);
  }
  console.log('\n📝 Ejecuta las correcciones necesarias y vuelve a correr este script.');
  process.exit(hasErrors ? 1 : 0);
}