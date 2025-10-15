# 🌐 IPFS Setup para Urbanika NFTs

Este documento explica cómo configurar IPFS (InterPlanetary File System) para almacenar las imágenes y metadata de tus NFTs de forma descentralizada y permanente.

## ¿Por qué IPFS?

- **Descentralizado**: Tus NFTs no dependen de un servidor centralizado
- **Permanente**: El contenido no se puede borrar ni modificar
- **Estándar**: Compatible con OpenSea, Rarible y todos los marketplaces
- **Inmutable**: Cada archivo tiene un hash único que garantiza su integridad

## 🚀 Setup Rápido (Pinata)

### 1. Crear cuenta en Pinata

Pinata es el servicio más fácil para usar IPFS sin configurar nada.

1. Ve a https://pinata.cloud
2. Crea una cuenta gratuita
3. Plan gratuito incluye:
   - 1 GB de almacenamiento
   - Suficiente para miles de NFTs

### 2. Generar JWT Token

1. Ve a "API Keys" en el dashboard
2. Click en "New Key"
3. Permisos necesarios:
   - ✅ `pinFileToIPFS`
   - ✅ `pinJSONToIPFS`
4. Dale un nombre: "Urbanika Production"
5. Copia el **JWT** (no el API Key ni el Secret)

### 3. Configurar en tu proyecto

Agrega el JWT a tu archivo `.env`:

```bash
PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tu_jwt_completo_aqui
```

## 📤 Subir Imagen Base

Tu imagen del bus Urbánika necesita estar en IPFS. Ejecuta:

```bash
npx tsx scripts/upload-nft-image.ts
```

Este script:
1. ✅ Lee `/public/nft-image.png`
2. ✅ La sube a IPFS vía Pinata
3. ✅ Te da las URLs de IPFS
4. ✅ Guarda el resultado en `ipfs-image-urls.json`

**Resultado esperado:**
```
✅ ¡Imagen subida exitosamente a IPFS!
==========================================
IPFS URL: ipfs://QmXxxx...
IPFS Hash: QmXxxx...
Gateway URL: https://gateway.pinata.cloud/ipfs/QmXxxx...
==========================================
```

## 🎨 Cómo Funciona el Flujo

### Cuando un usuario compra un NFT:

```
1. Usuario completa el pago con crypto
   ↓
2. Frontend llama a /api/ipfs/upload
   ↓
3. API crea metadata con:
   - Inversión del usuario
   - Retorno esperado
   - Wallet address
   - Fecha
   ↓
4. API sube imagen + metadata a IPFS
   ↓
5. IPFS retorna: ipfs://QmXxxx...
   ↓
6. Smart contract recibe el tokenURI
   ↓
7. NFT minteado con metadata permanente en IPFS
```

### Ejemplo de Metadata generada:

```json
{
  "name": "Urbanika Investment NFT #1",
  "description": "Investment certificate for 500 MXN in Urbanika...",
  "image": "ipfs://QmXxxx.../urbanika-nft.png",
  "external_url": "https://urbanika.xyz",
  "background_color": "00BFA6",
  "attributes": [
    {
      "trait_type": "Investment Amount (MXN)",
      "value": 500
    },
    {
      "trait_type": "Expected Return (MXN)",
      "value": 750
    },
    {
      "trait_type": "Investment Tier",
      "value": "Bronze"
    }
    // ... más attributes
  ]
}
```

## 📁 Archivos Creados

### 1. `lib/ipfs/pinata.ts`
Utilidad principal para interactuar con IPFS:
- `uploadFileToIPFS()` - Sube archivo
- `uploadMetadataToIPFS()` - Sube JSON
- `generateUrbanikaNFTMetadata()` - Crea metadata estándar ERC721
- `createNFTOnIPFS()` - Workflow completo

### 2. `app/api/ipfs/upload/route.ts`
API endpoint para subir NFTs:
- `POST /api/ipfs/upload` - Crea NFT completo
- `GET /api/ipfs/upload` - Sube solo imagen base (testing)

### 3. `scripts/upload-nft-image.ts`
Script para pre-subir imagen base

### 4. `components/nft-purchase-flow.tsx`
Flujo de compra actualizado con IPFS

## 🧪 Testing

### 1. Test con cURL:

```bash
# Pre-subir imagen base
curl http://localhost:3000/api/ipfs/upload

# Crear NFT completo
curl -X POST http://localhost:3000/api/ipfs/upload \
  -H "Content-Type: application/json" \
  -d '{
    "tokenId": 1,
    "investmentAmount": 500,
    "expectedReturn": 750,
    "investor": "0x1234...5678",
    "useDefaultImage": true
  }'
```

### 2. Test en navegador:

1. Conecta tu wallet
2. Inicia el flujo de compra
3. Selecciona método crypto
4. Observa la consola del navegador:
   ```
   📤 Subiendo NFT a IPFS...
   ✅ NFT subido a IPFS: ipfs://QmXxxx...
   ```

## 🔧 Troubleshooting

### Error: "PINATA_JWT no está configurado"

**Solución:**
1. Verifica que `.env` tenga `PINATA_JWT=...`
2. Reinicia el servidor: `npm run dev`
3. El JWT debe empezar con `eyJ...`

### Error: "Failed to upload to IPFS"

**Posibles causas:**
1. JWT inválido o expirado → Genera uno nuevo
2. Plan de Pinata lleno → Verifica uso en dashboard
3. Archivo muy grande → Comprime la imagen

### La imagen no se ve en OpenSea

**Solución:**
1. Usa la Gateway URL para verificar: `https://gateway.pinata.cloud/ipfs/QmXxx...`
2. OpenSea cachea metadata, puede tomar 1-24 horas
3. Fuerza refresh en OpenSea: click en "Refresh Metadata"

## 💰 Costos

### Plan Gratuito de Pinata:
- ✅ 1 GB storage (~10,000 NFTs)
- ✅ 100 GB bandwidth mensual
- ✅ Suficiente para empezar

### Planes Pagados:
- **Picnic ($20/mes)**: 100 GB storage
- **Yacht ($200/mes)**: 1 TB storage
- Solo necesitas actualizar si superas el límite

## 🌟 Mejoras Futuras

### 1. Imágenes Dinámicas
Generar imágenes únicas por tier:
- Bronze → Bus amarillo
- Silver → Bus plateado
- Gold → Bus dorado
- Diamond → Bus con diamantes

### 2. Metadata On-Chain
En lugar de IPFS, guardar metadata directamente en el contrato (más caro pero más permanente)

### 3. IPFS Propio
Montar tu propio nodo IPFS para no depender de Pinata:
- Más control
- Sin límites
- Requiere servidor 24/7

## 📚 Recursos

- [Pinata Docs](https://docs.pinata.cloud/)
- [IPFS Docs](https://docs.ipfs.tech/)
- [ERC721 Metadata Standard](https://eips.ethereum.org/EIPS/eip-721)
- [OpenSea Metadata Standards](https://docs.opensea.io/docs/metadata-standards)

## ✅ Checklist para Producción

- [ ] JWT de Pinata configurado en `.env`
- [ ] Imagen base subida a IPFS
- [ ] URLs de IPFS guardadas
- [ ] Testing en testnet completado
- [ ] Verificar metadata en OpenSea testnet
- [ ] Plan de Pinata suficiente para tu volumen esperado

---

**¿Necesitas ayuda?** Revisa los logs en la consola o contacta a soporte de Pinata.
