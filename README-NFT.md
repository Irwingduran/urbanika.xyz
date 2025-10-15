# Urbánika NFT - Guía Completa

## 📋 Resumen

Este proyecto implementa un sistema completo de NFTs de inversión para Urbánika usando:

- **Smart Contract**: Solidity + Hardhat + Scroll zkEVM
- **Frontend Web3**: Next.js + Wagmi + Viem + TanStack Query
- **Storage**: IPFS via Pinata
- **Testnet**: Scroll Sepolia

## 🏗️ Arquitectura

### Smart Contract (UrbanikaNFT.sol)

Contrato desplegado en: `0x263E2E6C8d7a338deBac013143916d9709C18441`

**Características principales:**
- ERC-721 estándar (compatible con todos los wallets y marketplaces)
- Revenue-Based Financing con retorno 1.5x
- Sistema de tiers (Bronze, Silver, Gold, Platinum)
- Distribución de retornos proporcional
- Pausable en emergencias

**Funciones principales:**
```solidity
// Solo owner
function mint(address to, uint256 investmentAmount, string tokenURI, string email) returns (uint256)
function distributeReturn(uint256 tokenId, uint256 amount)
function batchDistributeReturn(uint256[] tokenIds, uint256[] amounts)

// Lectura pública
function getInvestment(uint256 tokenId) returns (Investment)
function getReturnProgress(uint256 tokenId) returns (uint256)
function getInvestorTokens(address investor) returns (uint256[])
function getActiveNFTCount() returns (uint256)
```

### Frontend Web3

**Componentes principales:**

1. **`WalletConnectButton`** - Conectar/desconectar wallet
2. **`ContractStats`** - Estadísticas en tiempo real del contrato
3. **`MyInvestments`** - Ver inversiones NFT del usuario
4. **`NFTPurchaseFlow`** - Flujo de compra de NFTs

**Hooks personalizados:**

- `useUrbanikaNFT()` - Configuración del contrato
- `useInvestment(tokenId)` - Datos de una inversión
- `useReturnProgress(tokenId)` - Progreso de retorno
- `useInvestorTokens(address)` - NFTs de un inversor
- `useContractStats()` - Estadísticas generales

## 🚀 Setup Inicial

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copia `.env` y configura:

```bash
# Blockchain
PRIVATE_KEY=tu_private_key_sin_0x
URBANIKA_NFT_ADDRESS=0x263E2E6C8d7a338deBac013143916d9709C18441

# IPFS (Pinata)
PINATA_JWT=tu_jwt_de_pinata

# Payments (opcional)
STRIPE_SECRET_KEY=sk_test_...
```

#### Obtener Pinata JWT:

1. Ve a https://app.pinata.cloud/
2. Crea cuenta gratuita (1GB gratis)
3. Ve a **API Keys** > **New Key**
4. Selecciona permisos: `pinFileToIPFS` y `pinJSONToIPFS`
5. Copia el JWT y agrégalo a `.env`

### 3. Obtener ETH de testnet

```bash
# 1. Obtén Sepolia ETH
https://sepoliafaucet.com/

# 2. Bridge a Scroll Sepolia
https://sepolia.scroll.io/bridge

# Verifica tu balance
https://sepolia.scrollscan.com/address/TU_ADDRESS
```

## 📝 Flujo de Trabajo Completo

### Paso 1: Preparar metadata NFT

```bash
# 1. Asegúrate de tener una imagen en public/nft-image.png
# 2. Configura PINATA_JWT en .env
# 3. Sube imagen y metadata a IPFS

npx tsx scripts/upload-to-pinata.ts
```

Este script:
- ✅ Sube la imagen a IPFS
- ✅ Genera metadata JSON (estándar ERC-721)
- ✅ Sube metadata a IPFS
- ✅ Te da el Token URI para usar en el mint

**Output esperado:**
```
✅ Imagen subida exitosamente
   CID: QmXXXXXX...

✅ Metadata subida exitosamente
   CID: QmYYYYYY...
   Token URI: ipfs://QmYYYYYY...
```

### Paso 2: Mintear NFT

```bash
# Sintaxis:
node scripts/mint-nft.js <wallet> <monto> <token_uri> <email>

# Ejemplo:
node scripts/mint-nft.js \
  0x62b02BF04825d73FA911cbb8A8FCD22f3C046933 \
  500 \
  ipfs://QmYYYYYY... \
  investor@example.com
```

Este script:
- ✅ Conecta al contrato en Scroll Sepolia
- ✅ Mintea el NFT al wallet especificado
- ✅ Calcula el tier automáticamente según el monto
- ✅ Te da el Transaction Hash y Token ID

**Output esperado:**
```
✅ NFT minteado exitosamente
   Token ID: 1
   TX: 0xAAAAAAA...

🔗 Ver en Scrollscan:
   https://sepolia.scrollscan.com/tx/0xAAA...

🖼️ Ver NFT en OpenSea:
   https://testnets.opensea.io/assets/scroll-sepolia/0x263.../1
```

### Paso 3: Distribuir retornos

Cuando vendas una casa, distribuye retornos:

```javascript
// En Hardhat console o script
const contract = await ethers.getContractAt(
  "UrbanikaNFT",
  "0x263E2E6C8d7a338deBac013143916d9709C18441"
)

// Distribuir a un NFT
await contract.distributeReturn(
  1,                           // tokenId
  ethers.parseEther("50")      // 50 MXN
)

// Distribuir a múltiples NFTs
await contract.batchDistributeReturn(
  [1, 2, 3],                   // tokenIds
  [
    ethers.parseEther("50"),
    ethers.parseEther("75"),
    ethers.parseEther("100")
  ]
)
```

### Paso 4: Ver en el frontend

```bash
# Iniciar servidor de desarrollo
npm run dev

# Abrir en navegador
http://localhost:3001/nft
```

Funcionalidades disponibles:
- ✅ Ver estadísticas del contrato en tiempo real
- ✅ Conectar wallet (MetaMask, WalletConnect, etc)
- ✅ Ver tus inversiones NFT
- ✅ Ver progreso de retornos
- ✅ Comprar nuevos NFTs (requiere integración con Stripe)

## 🧪 Testing

```bash
# Ejecutar todos los tests
npx hardhat test

# Con gas reporter
REPORT_GAS=true npx hardhat test

# Test específico
npx hardhat test test/UrbanikaNFT.test.ts
```

**Tests incluidos:** 24/24 passing ✅
- Deployment
- Minting
- Tier calculation
- Return distribution
- Batch operations
- Access control
- Edge cases

## 📊 Metadata NFT

La metadata sigue el estándar ERC-721 y incluye:

```json
{
  "name": "Urbánika Investment #1",
  "description": "NFT de inversión en Urbánika...",
  "image": "ipfs://QmXXX...",
  "external_url": "https://urbanika.xyz/nft",
  "attributes": [
    {
      "trait_type": "Tier",
      "value": "Bronze"
    },
    {
      "trait_type": "Investment Amount",
      "value": "500 MXN"
    },
    {
      "trait_type": "Expected Return",
      "value": "750 MXN"
    },
    {
      "trait_type": "ROI Multiplier",
      "value": "1.5x"
    },
    {
      "trait_type": "Mint Date",
      "value": 1705147200,
      "display_type": "date"
    }
  ]
}
```

## 🎨 Tiers de Inversión

| Tier     | Rango (MXN)          | Color    |
|----------|---------------------|----------|
| Bronze   | < 1,000             | #CD7F32  |
| Silver   | 1,000 - 4,999       | #C0C0C0  |
| Gold     | 5,000 - 9,999       | #FFD700  |
| Platinum | ≥ 10,000            | #E5E4E2  |

## 🔗 Enlaces Útiles

### Testnet
- **Faucet Sepolia**: https://sepoliafaucet.com/
- **Bridge Scroll**: https://sepolia.scroll.io/bridge
- **Scrollscan**: https://sepolia.scrollscan.com/

### Contrato
- **Address**: `0x263E2E6C8d7a338deBac013143916d9709C18441`
- **Scrollscan**: https://sepolia.scrollscan.com/address/0x263E2E6C8d7a338deBac013143916d9709C18441
- **Network**: Scroll Sepolia (Chain ID: 534351)

### IPFS
- **Pinata**: https://app.pinata.cloud/
- **Gateway**: https://gateway.pinata.cloud/ipfs/

### NFT Marketplaces
- **OpenSea Testnet**: https://testnets.opensea.io/
- **Rarible Testnet**: https://testnet.rarible.com/

## 🛠️ Scripts Disponibles

### Hardhat

```bash
# Compilar contratos
npx hardhat compile

# Tests
npx hardhat test

# Deploy
npx hardhat run scripts/deploy.js --network scrollSepolia

# Console
npx hardhat console --network scrollSepolia

# Verificar contrato
npx hardhat verify --network scrollSepolia DEPLOYED_ADDRESS
```

### IPFS

```bash
# Subir imagen y metadata a IPFS
npx tsx scripts/upload-to-pinata.ts

# Esto genera Token URIs que usarás al mintear
```

### NFT Operations

```bash
# Mintear NFT
node scripts/mint-nft.js <wallet> <amount> <uri> <email>

# Ejemplo
node scripts/mint-nft.js 0x123... 500 ipfs://Qm... test@example.com
```

### Frontend

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Start producción
npm start
```

## 🔐 Seguridad

**IMPORTANTE:**

1. ✅ Nunca subas `.env` a Git (ya está en `.gitignore`)
2. ✅ La private key tiene control total del contrato
3. ✅ Solo el owner puede mintear y distribuir retornos
4. ✅ El contrato es pausable en caso de emergencia
5. ✅ Tests cubren casos edge y ataques comunes

**Mainnet checklist:**

- [ ] Auditar contrato con profesionales
- [ ] Configurar Multisig para owner
- [ ] Configurar monitoring (Tenderly, Defender)
- [ ] Agregar rate limiting
- [ ] Configurar Pinning service backup
- [ ] Implementar circuit breakers

## 📚 Estructura del Proyecto

```
urbanika.xyz/
├── contracts/
│   └── UrbanikaNFT.sol          # Smart contract principal
├── scripts/
│   ├── deploy.js                # Deploy a testnet/mainnet
│   ├── mint-nft.js              # Mintear NFTs
│   └── upload-to-pinata.ts      # Subir a IPFS
├── test/
│   └── UrbanikaNFT.test.ts      # Tests del contrato
├── lib/
│   ├── web3/
│   │   ├── config.ts            # Wagmi config
│   │   ├── abi.ts               # ABI del contrato
│   │   └── providers.tsx        # Web3Provider
│   └── ipfs/
│       └── metadata.ts          # Generador de metadata
├── hooks/
│   └── web3/
│       └── useUrbanikaNFT.ts    # Hooks personalizados
├── components/
│   ├── wallet-connect-button.tsx
│   ├── contract-stats.tsx
│   ├── my-investments.tsx
│   └── nft-purchase-flow.tsx
└── app/
    └── nft/
        └── page.tsx             # Página principal NFT
```

## 🐛 Troubleshooting

### Error: "Module not found: @react-native-async-storage"

Es un warning de dependencias de MetaMask SDK. La app funciona correctamente, puedes ignorarlo.

### Error: "insufficient funds"

Necesitas más ETH en Scroll Sepolia. Usa el faucet y bridge.

### NFT no aparece en OpenSea

- Espera 5-10 minutos para indexación
- Verifica que el Token URI sea accesible
- Asegúrate de usar `ipfs://` (no `https://gateway...`)

### Metadata no carga

- Verifica que PINATA_JWT sea correcto
- Usa `https://gateway.pinata.cloud/ipfs/YOUR_CID` para probar
- Revisa que la metadata tenga formato JSON válido

## 🎯 Próximos Pasos

1. **Integración Stripe**: Implementar flujo de pago completo
2. **Email notifications**: Notificar distribuciones de retorno
3. **Dashboard admin**: Panel para gestionar NFTs y distribuciones
4. **Mobile app**: React Native con WalletConnect
5. **Mainnet deployment**: Deploy a Scroll mainnet
6. **Auditoría**: Contratar auditoría profesional

## 📞 Soporte

Si tienes problemas:

1. Revisa esta documentación
2. Verifica `.env` tenga todas las variables
3. Comprueba que tengas ETH en Scroll Sepolia
4. Revisa los logs en la consola del navegador

---

**Hecho con 💚 por el equipo de Urbánika**

*Hogares regenerativos para un futuro sostenible*
