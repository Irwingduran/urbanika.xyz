# 🚀 Urbanika Web3 Setup Guide

Guía completa para configurar y desplegar los NFTs de Urbanika en la red Scroll.

## 📋 Tabla de Contenidos

- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Desarrollo Local](#desarrollo-local)
- [Testing](#testing)
- [Deployment en Scroll Sepolia](#deployment-en-scroll-sepolia)
- [Deployment en Scroll Mainnet](#deployment-en-scroll-mainnet)
- [Verificación del Contrato](#verificación-del-contrato)
- [Uso del Contrato](#uso-del-contrato)
- [Arquitectura](#arquitectura)
- [FAQ](#faq)

---

## 🔧 Requisitos

- Node.js >= 18.0.0
- npm o yarn
- Una wallet de Ethereum (MetaMask recomendado)
- ETH en Scroll Sepolia (para testnet)

## 📦 Instalación

Las dependencias de Web3 ya están instaladas en el proyecto:

```bash
npm install
```

Esto incluye:
- `hardhat` - Framework de desarrollo
- `@openzeppelin/contracts` - Librería de contratos seguros
- `@nomicfoundation/hardhat-toolbox` - Herramientas para Hardhat
- `dotenv` - Gestión de variables de entorno

## ⚙️ Configuración

### 1. Configurar variables de entorno

Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

### 2. Obtener Private Key

Exporta tu private key desde MetaMask:
1. Abre MetaMask
2. Click en los 3 puntos → Account Details
3. Export Private Key
4. Ingresa tu password
5. Copia la key (SIN el prefijo 0x)

⚠️ **IMPORTANTE**: NUNCA compartas tu private key ni la subas a Git.

### 3. Obtener ETH en Scroll Sepolia

Para hacer deployment en testnet necesitas ETH:

**Opción 1: Usando Sepolia Bridge**
1. Obtén Sepolia ETH del faucet: https://sepoliafaucet.com/
2. Bridgea a Scroll Sepolia: https://sepolia.scroll.io/bridge

**Opción 2: Faucets directos de Scroll**
- https://docs.scroll.io/en/user-guide/faucet/

### 4. Configurar .env

Edita tu `.env` y llena:

```env
PRIVATE_KEY=tu_private_key_aqui
SCROLL_SEPOLIA_RPC_URL=https://sepolia-rpc.scroll.io/
```

---

## 💻 Desarrollo Local

### Compilar contratos

```bash
npx hardhat compile
```

Esto genera:
- `artifacts/` - ABIs y bytecode compilados
- `typechain-types/` - Types de TypeScript para el contrato
- `cache/` - Cache de compilación

### Ejecutar node local

```bash
npx hardhat node
```

Esto inicia una blockchain local en `http://localhost:8545` con 20 cuentas de prueba.

---

## 🧪 Testing

### Ejecutar todos los tests

```bash
npx hardhat test
```

### Ejecutar tests específicos

```bash
npx hardhat test test/UrbanikaNFT.test.ts
```

### Ver cobertura de código

```bash
npx hardhat coverage
```

### Tests con gas reporter

```bash
REPORT_GAS=true npx hardhat test
```

### Estructura de los tests

Los tests cubren:
- ✅ Deployment del contrato
- ✅ Mint de NFTs
- ✅ Cálculo de tiers (Bronze, Silver, Gold, Platinum)
- ✅ Distribución de retornos
- ✅ Batch distributions
- ✅ Pausabilidad
- ✅ Funciones de view
- ✅ Permisos (onlyOwner)

---

## 🚢 Deployment en Scroll Sepolia

### 1. Verificar balance

```bash
npx hardhat run scripts/check-balance.ts --network scrollSepolia
```

### 2. Desplegar contrato

```bash
npx hardhat run scripts/deploy.ts --network scrollSepolia
```

Salida esperada:
```
🚀 Iniciando deployment de UrbanikaNFT en Scroll...

📋 Información del deployment:
===============================
Deployer address: 0x...
Deployer balance: 0.1 ETH
Network: scrollSepolia
Chain ID: 534351
===============================

📝 Desplegando contrato UrbanikaNFT...

✅ UrbanikaNFT desplegado exitosamente!
===============================
📍 Contract address: 0x...
🔗 Explorador: https://sepolia.scrollscan.com/address/0x...
===============================
```

### 3. Guardar dirección del contrato

Copia la dirección del contrato y agrégala a tu `.env`:

```env
URBANIKA_NFT_ADDRESS=0x_tu_contract_address
```

---

## 🌐 Deployment en Scroll Mainnet

⚠️ **IMPORTANTE**: Solo hacer esto cuando estés listo para producción.

### Antes de desplegar en mainnet:

1. ✅ Tests pasando al 100%
2. ✅ Auditado el contrato (recomendado)
3. ✅ Probado extensivamente en Sepolia
4. ✅ ETH suficiente en mainnet (≈0.01 ETH)

### Deployment

```bash
npx hardhat run scripts/deploy.ts --network scroll
```

---

## 🔍 Verificación del Contrato

Verificar el contrato en Scrollscan permite que otros vean tu código fuente:

```bash
npx hardhat verify --network scrollSepolia <CONTRACT_ADDRESS>
```

Ejemplo:
```bash
npx hardhat verify --network scrollSepolia 0x1234567890abcdef...
```

Una vez verificado, aparecerá el código en:
https://sepolia.scrollscan.com/address/0x.../contracts

---

## 🎯 Uso del Contrato

### Mintear un NFT

```bash
npx hardhat run scripts/mint-example.ts --network scrollSepolia
```

Edita `scripts/mint-example.ts` para cambiar:
- Dirección del inversor
- Monto de inversión
- Token URI (metadata en IPFS)
- Email del inversor

### Distribuir retornos

```bash
npx hardhat run scripts/distribute-returns.ts --network scrollSepolia
```

Edita el script para especificar:
- Token IDs a distribuir
- Montos a distribuir

### Interactuar con el contrato (Hardhat Console)

```bash
npx hardhat console --network scrollSepolia
```

```javascript
// Get contract instance
const UrbanikaNFT = await ethers.getContractFactory("UrbanikaNFT");
const contract = UrbanikaNFT.attach("0x_tu_contract_address");

// Get info
const totalSupply = await contract.totalSupply();
console.log("Total NFTs:", totalSupply.toString());

// Get investment
const investment = await contract.getInvestment(1);
console.log("Investment:", investment);

// Get owner tokens
const [owner] = await ethers.getSigners();
const tokens = await contract.getInvestorTokens(owner.address);
console.log("My tokens:", tokens);
```

---

## 🏗️ Arquitectura

### Smart Contract: UrbanikaNFT.sol

**Características:**
- ERC-721 estándar (compatible con OpenSea, MetaMask, etc.)
- Sistema de tiers: Bronze, Silver, Gold, Platinum
- Retorno 1.5x automático
- Distribución de ganancias proporcional
- Metadata en IPFS
- Pausable (emergencias)
- Ownership con OpenZeppelin

**Funciones principales:**

```solidity
// Mintear NFT (solo owner)
function mint(address to, uint256 amount, string memory tokenURI, string memory email)

// Distribuir retorno (solo owner)
function distributeReturn(uint256 tokenId, uint256 amount)

// Batch distribution (solo owner)
function batchDistributeReturn(uint256[] tokenIds, uint256[] amounts)

// Ver inversión
function getInvestment(uint256 tokenId) view returns (Investment)

// Ver progreso de retorno
function getReturnProgress(uint256 tokenId) view returns (uint256)

// Ver NFTs de un inversor
function getInvestorTokens(address investor) view returns (uint256[])

// Actualizar metadata
function updateTokenURI(uint256 tokenId, string memory newURI)
```

### Estructura de datos

```solidity
struct Investment {
    uint256 investmentAmount;      // Monto invertido
    uint256 expectedReturn;        // Retorno esperado (1.5x)
    uint256 currentReturn;         // Retorno recibido
    uint256 mintDate;              // Fecha de creación
    InvestmentTier tier;           // Bronze, Silver, Gold, Platinum
    bool isActive;                 // Estado
    address investor;              // Wallet del inversor
    string email;                  // Email (opcional)
}
```

### Tiers de inversión

| Tier | Monto | Beneficios |
|------|-------|------------|
| 🥉 Bronze | 250 - 999 MXN | Retorno 1.5x |
| 🥈 Silver | 1,000 - 4,999 MXN | Retorno 1.5x + Prioridad media |
| 🥇 Gold | 5,000 - 9,999 MXN | Retorno 1.5x + Alta prioridad |
| 💎 Platinum | 10,000+ MXN | Retorno 1.5x + Máxima prioridad |

---

## 🔗 Integración con Frontend

### 1. Instalar dependencias en frontend

```bash
npm install wagmi viem @tanstack/react-query
```

### 2. Configurar Wagmi

```typescript
// lib/web3/config.ts
import { createConfig, http } from 'wagmi'
import { scrollSepolia, scroll } from 'wagmi/chains'

export const config = createConfig({
  chains: [scrollSepolia, scroll],
  transports: {
    [scrollSepolia.id]: http(),
    [scroll.id]: http(),
  },
})
```

### 3. Usar el contrato

```typescript
// hooks/useUrbanikaNFT.ts
import { useReadContract, useWriteContract } from 'wagmi'
import UrbanikaNFTABI from '@/artifacts/contracts/UrbanikaNFT.sol/UrbanikaNFT.json'

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_URBANIKA_NFT_ADDRESS

export function useUrbanikaNFT() {
  // Read functions
  const { data: totalSupply } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: UrbanikaNFTABI.abi,
    functionName: 'totalSupply',
  })

  // Write functions
  const { writeContract } = useWriteContract()

  const mintNFT = async (to: string, amount: bigint, uri: string, email: string) => {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi: UrbanikaNFTABI.abi,
      functionName: 'mint',
      args: [to, amount, uri, email],
    })
  }

  return { totalSupply, mintNFT }
}
```

---

## ❓ FAQ

### ¿Cómo funciona el retorno 1.5x?

Cada NFT representa una inversión. Cuando Urbanika vende casas, se distribuyen las ganancias proporcionalmente entre todos los NFT holders hasta que cada uno alcance 1.5x su inversión inicial.

### ¿Los NFTs son transferibles?

Sí, son ERC-721 estándar, por lo que se pueden:
- Transferir a otra wallet
- Vender en OpenSea
- Ver en MetaMask
- Usar en cualquier dApp compatible

### ¿Qué pasa si alguien vende su NFT?

El NFT mantiene su progreso de retorno. El nuevo dueño recibe los retornos futuros.

### ¿Cómo se almacena el metadata?

El metadata (imagen, atributos) se almacena en IPFS (descentralizado). El contrato solo guarda la URI (link) al metadata.

### ¿Puedo actualizar el metadata después de mintear?

Sí, el owner puede actualizar el tokenURI con `updateTokenURI()`.

### ¿Cuánto cuesta el gas en Scroll?

Scroll es extremadamente económico:
- Mint: ~$0.10 - $0.50
- Transfer: ~$0.05 - $0.20
- Distribution: ~$0.10 - $0.30

Mucho más barato que Ethereum mainnet.

### ¿Qué pasa si hay un bug?

El contrato tiene función `pause()` que detiene todas las operaciones. Solo el owner puede pausar/unpausar.

### ¿Cómo obtengo el ABI del contrato?

Después de compilar:
```bash
cat artifacts/contracts/UrbanikaNFT.sol/UrbanikaNFT.json | jq .abi
```

O usa los tipos generados en `typechain-types/`.

---

## 📚 Recursos

### Documentación oficial

- **Scroll Docs**: https://docs.scroll.io/
- **Hardhat Docs**: https://hardhat.org/docs
- **OpenZeppelin**: https://docs.openzeppelin.com/

### Exploradores

- **Scroll Sepolia**: https://sepolia.scrollscan.com/
- **Scroll Mainnet**: https://scrollscan.com/

### Herramientas

- **Scroll Bridge**: https://scroll.io/bridge
- **Sepolia Faucet**: https://sepoliafaucet.com/
- **IPFS (Pinata)**: https://pinata.cloud/
- **NFT.Storage**: https://nft.storage/

### Comunidad

- **Scroll Discord**: https://discord.gg/scroll
- **Scroll Twitter**: https://twitter.com/Scroll_ZKP

---

## 🛡️ Seguridad

### Mejores prácticas implementadas

✅ OpenZeppelin contracts (auditados)
✅ ReentrancyGuard en distribuciones
✅ Pausable para emergencias
✅ Ownership management
✅ Input validation
✅ Events para todas las operaciones críticas

### Antes de mainnet

- [ ] Auditoría de seguridad profesional
- [ ] Bug bounty program
- [ ] Testeo extensivo en testnet
- [ ] Documentación completa
- [ ] Plan de respuesta a incidentes

---

## 🤝 Contribuir

Si encuentras bugs o tienes sugerencias, abre un issue en el repositorio.

---

## 📄 Licencia

MIT License - Ver LICENSE file para más detalles.

---

**🎉 ¡Listo! Ahora puedes comenzar a usar Web3 en Urbanika.**

¿Necesitas ayuda? Revisa la sección FAQ o contacta al equipo de desarrollo.
