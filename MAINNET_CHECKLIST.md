# 🚀 Checklist para Scroll Mainnet - Urbanika NFT

## 📋 Resumen Ejecutivo

Este documento detalla todos los requisitos y recomendaciones para desplegar el contrato UrbanikaNFT en **Scroll Mainnet** de forma segura y profesional.

**Contrato Actual**: v2.0 Production Ready
**Testnet**: Scroll Sepolia - `0x591D218a9Ac4843FB6f571273166B5d5df99E6c0`
**Estado**: ✅ 24/24 tests pasando, auditoría básica completada

---

## 🔴 CRÍTICO - Requisitos Obligatorios

### 1. Multisig como Owner del Contrato ⚠️

**Estado**: ❌ Pendiente
**Prioridad**: CRÍTICA
**Tiempo estimado**: 1-2 días
**Costo**: ~$50 USD en gas

#### ¿Por qué es crítico?

Actualmente el owner es una wallet simple. Si esa private key se compromete, el atacante puede:
- Cambiar el treasury y redirigir fondos
- Pausar el contrato indefinidamente
- Mintear NFTs gratis sin límite
- Modificar precios arbitrariamente

#### Solución Recomendada: Gnosis Safe

```bash
# Paso 1: Crear Gnosis Safe en Scroll Mainnet
# URL: https://app.safe.global/

# Paso 2: Configurar multisig con 3-5 firmantes
# Recomendación: 3 de 5 firmas requeridas
# Firmantes sugeridos:
# - Founder #1
# - Founder #2
# - CTO/Desarrollador principal
# - Asesor legal
# - Asesor financiero

# Paso 3: Después de desplegar en mainnet, transferir ownership
await urbanikaNFT.transferOwnership(GNOSIS_SAFE_ADDRESS)

# Paso 4: Verificar
const newOwner = await urbanikaNFT.owner()
console.log("Nuevo owner (Safe):", newOwner)
```

#### Recursos
- Gnosis Safe Docs: https://docs.safe.global/
- Tutorial: https://help.safe.global/en/articles/40868-creating-a-safe-on-a-web-browser

---

### 2. Auditoría Profesional del Smart Contract ⚠️

**Estado**: ❌ Pendiente
**Prioridad**: CRÍTICA
**Tiempo estimado**: 2-6 semanas
**Costo**: $5k - $100k

#### ¿Por qué es crítico?

Aunque se realizó una auditoría básica interna, una auditoría profesional es **esencial** antes de manejar fondos reales. Los auditores profesionales:
- Encuentran vulnerabilidades que las pruebas automatizadas no detectan
- Revisan lógica de negocio y casos edge
- Verifican cumplimiento con estándares (ERC-721, etc.)
- Proveen reporte oficial para confianza de inversores

#### Opciones de Auditoría

| Firma | Costo | Tiempo | Nivel | Recomendación |
|-------|-------|--------|-------|---------------|
| **OpenZeppelin** | $50k-100k | 4-6 semanas | Top tier | Mejor reputación |
| **Consensys Diligence** | $40k-80k | 4-6 semanas | Top tier | Muy completo |
| **Certik** | $20k-40k | 3-4 semanas | Mid tier | Buen balance |
| **Hacken** | $15k-30k | 2-4 semanas | Mid tier | Costo-efectivo |
| **Solidity Finance** | $5k-15k | 1-2 semanas | Budget | Para MVPs |

#### Alternativas Económicas

**Code4rena** (Auditoría comunitaria)
- Costo: $10k-20k
- Tiempo: 1-2 semanas
- Pros: Múltiples auditores, competitivo
- Contras: Menos prestigio que top tier
- URL: https://code4rena.com/

**Sherlock** (Auditoría + Seguro)
- Costo: $15k-25k
- Tiempo: 2-3 semanas
- Pros: Incluye seguro contra hacks
- Contras: Más caro que competencia
- URL: https://www.sherlock.xyz/

#### Qué Esperar del Proceso

```markdown
Semana 1-2: Preparación
- Entregar código fuente
- Documentación técnica
- Casos de uso y flujos

Semana 2-4: Auditoría
- Revisión de código
- Testing automatizado
- Revisión manual
- Búsqueda de vulnerabilidades

Semana 4-5: Remediación
- Recibir reporte preliminar
- Implementar fixes
- Re-auditoría de cambios

Semana 5-6: Reporte Final
- Reporte público
- Badge de auditoría
- Certificado
```

---

### 3. Precio Dinámico con Chainlink Price Feed 🟡

**Estado**: ❌ Pendiente
**Prioridad**: ALTA
**Tiempo estimado**: 1-2 días
**Costo**: $0 (solo gas de deploy)

#### ¿Por qué es importante?

Problema actual: El precio está fijo en ETH (`pricePerUnit = 0.0033 ether / 100`)

**Escenario de riesgo**:
- Si ETH = $3,000 USD → Inversión de 1000 MXN = ~$50 USD = 0.0165 ETH ✅
- Si ETH = $6,000 USD → Inversión de 1000 MXN = ~$50 USD = ❌ Sigue siendo 0.0165 ETH = $99 USD
- **Resultado**: Los inversores pagarían el doble en términos reales

#### Solución: Integrar Chainlink Price Feed

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract UrbanikaNFT {
    // ... código existente ...

    AggregatorV3Interface internal ethUsdPriceFeed;
    uint256 public constant MXN_TO_USD = 0.05 * 1e18; // 1 MXN ≈ 0.05 USD

    constructor(address payable _treasury) {
        // ... código existente ...

        // Scroll Mainnet ETH/USD Price Feed
        ethUsdPriceFeed = AggregatorV3Interface(
            0x6bF14CB0A831078629D993FDeBcB182b21A8774C
        );
    }

    function calculatePrice(uint256 investmentAmount)
        public
        view
        returns (uint256)
    {
        // 1. Obtener precio actual ETH/USD de Chainlink
        (, int256 ethUsdPrice, , , ) = ethUsdPriceFeed.latestRoundData();
        require(ethUsdPrice > 0, "Invalid price feed");

        // 2. Convertir investmentAmount (MXN wei) a USD
        // investmentAmount está en wei (1 MXN = 1e18)
        uint256 investmentMXN = investmentAmount / 1e18;
        uint256 priceUSD = (investmentMXN * MXN_TO_USD) / 1e18;

        // 3. Convertir USD a ETH
        // ethUsdPrice tiene 8 decimales ($3000 = 3000_00000000)
        uint256 priceETH = (priceUSD * 1e26) / uint256(ethUsdPrice);

        return priceETH;
    }
}
```

#### Chainlink Price Feeds en Scroll

| Red | ETH/USD Feed | Dirección |
|-----|--------------|-----------|
| Scroll Mainnet | ✅ Disponible | `0x6bF14CB0A831078629D993FDeBcB182b21A8774C` |
| Scroll Sepolia | ✅ Disponible | `0x59F1ec1f10bD7eD9B938431086bC1D9e233ECf41` |

**Documentación**: https://docs.chain.link/data-feeds/price-feeds/addresses?network=scroll

#### Alternativa: Actualización Manual

Si prefieres no usar Chainlink (para ahorrar gas en cada llamada):

```solidity
// Mantener precio fijo pero con función para actualizar
uint256 public pricePerUnit; // No constant

function updatePricePerUnit() external onlyOwner {
    // Actualizar manualmente cada semana basado en:
    // - Precio actual de ETH
    // - Tipo de cambio MXN/USD
    // Ejemplo: Si ETH = $3000, y quieres cobrar $10 por 100 MXN
    // pricePerUnit = 10 USD / 3000 USD = 0.00333 ETH
}
```

**Pros**: Ahorra gas en cada mint
**Contras**: Requiere actualizaciones manuales frecuentes

---

### 4. Obtener ETH en Scroll Mainnet 💰

**Estado**: ❌ Pendiente
**Prioridad**: CRÍTICA
**Tiempo estimado**: 1 día
**Costo**: Variable según método

#### ¿Cuánto ETH Necesitas?

| Concepto | Cantidad | Costo (ETH @ $3k) |
|----------|----------|-------------------|
| Deploy del contrato | ~0.05 ETH | ~$150 USD |
| Configuración inicial | ~0.01 ETH | ~$30 USD |
| Testing en mainnet | ~0.02 ETH | ~$60 USD |
| Buffer de seguridad | ~0.02 ETH | ~$60 USD |
| **Total Recomendado** | **0.1 ETH** | **~$300 USD** |

#### Cómo Obtener ETH en Scroll Mainnet

##### Opción 1: Bridge desde Ethereum Mainnet (Recomendado)

```markdown
1. Ir a: https://scroll.io/bridge
2. Conectar wallet con ETH en Ethereum Mainnet
3. Seleccionar cantidad (ej: 0.15 ETH)
4. Aprobar y confirmar bridge
5. Esperar ~15 minutos
6. ETH aparecerá en Scroll Mainnet

Costo de bridge: ~$20-50 USD en gas de Ethereum
Tiempo: 10-20 minutos
```

##### Opción 2: Comprar ETH Directo en Exchange

Exchanges con soporte para **retiros directos a Scroll**:

| Exchange | Soporte Scroll | Fees | KYC |
|----------|----------------|------|-----|
| **OKX** | ✅ Sí | Bajo (~$5) | Requerido |
| **Binance** | ⚠️ Algunos países | Medio (~$10) | Requerido |
| **Gate.io** | ✅ Sí | Bajo (~$5) | Requerido |
| **Coinbase** | ❌ No | N/A | N/A |

**Proceso en OKX**:
```markdown
1. Crear cuenta en OKX
2. Completar KYC
3. Depositar USDT o comprar con tarjeta
4. Comprar ETH
5. Retirar → Seleccionar "Scroll" como red
6. Pegar tu wallet address
7. Confirmar retiro

Tiempo: 5-10 minutos después de confirmación
```

##### Opción 3: Usar Otros Bridges

**Orbiter Finance**: https://www.orbiter.finance/
- Bridge desde Arbitrum, Optimism, etc. a Scroll
- Más barato que Ethereum mainnet
- Fees: ~$2-5 USD

**Stargate Finance**: https://stargate.finance/
- Bridge desde múltiples chains
- Fees: ~$5-10 USD

#### Verificar Balance

```bash
# Una vez que tengas ETH en Scroll
npx hardhat run scripts/check-balance.js --network scrollMainnet
```

---

### 5. Insurance/Seguro del Contrato 🟡

**Estado**: ❌ Pendiente
**Prioridad**: MEDIA-ALTA
**Tiempo estimado**: 1-2 semanas
**Costo**: 2-5% del TVL anual

#### ¿Por qué Considerar Seguro?

Si hay un hack después del deploy, podrías:
- Perder todos los fondos invertidos
- Enfrentar demandas legales de inversores
- Perder reputación permanentemente

El seguro cubre:
- Hacks y exploits del smart contract
- Pérdida de fondos debido a vulnerabilidades
- En algunos casos, errores en el código

#### Opciones de Seguro

##### Nexus Mutual

**Costo**: 2-5% anual del Total Value Locked (TVL)
**Cobertura**: Hasta $5M USD
**URL**: https://nexusmutual.io/

**Ejemplo**:
- Si esperas $100k USD en inversiones
- Costo anual: $2k-5k USD
- Cobertura: $100k USD

**Proceso**:
```markdown
1. Deploy contrato en mainnet
2. Aplicar para cobertura en Nexus Mutual
3. Stakers evalúan tu contrato
4. Si aprobado, comprar cobertura
5. Pagar prima anual
```

##### InsurAce

**Costo**: 2-4% anual del TVL
**Cobertura**: Hasta $10M USD
**URL**: https://www.insurace.io/

Similar a Nexus pero con:
- Proceso más rápido
- Cobertura más flexible
- Ligeramente más barato

##### Sherlock (Recomendado para Inicio)

**Costo**: Incluido en auditoría ($15k-25k)
**Cobertura**: Hasta $1M USD por 6-12 meses
**URL**: https://www.sherlock.xyz/

**Ventaja**: Si Sherlock audita tu contrato, incluye seguro automático.

#### ¿Cuándo Contratar Seguro?

```markdown
✅ Contratar SI:
- Esperas manejar >$100k USD
- Inversores institucionales
- Vas a hacer marketing agresivo
- No tienes auditoría top-tier

❌ Puedes esperar SI:
- Fase de MVP/testing
- <$50k USD en inversiones
- Ya tienes auditoría de OpenZeppelin/Consensys
- Tienes multisig configurado correctamente
```

---

## 🟡 IMPORTANTE - Mejoras Recomendadas

### 6. Legal y Compliance ⚠️

**Estado**: ❌ Pendiente
**Prioridad**: ALTA
**Tiempo estimado**: 2-4 semanas
**Costo**: $2k-10k USD

#### ¿Qué Necesitas Legalmente?

##### A. Términos y Condiciones

Debe incluir:
- Descripción clara del producto de inversión
- Riesgos asociados (volatilidad crypto, smart contract risk, etc.)
- Disclaimer: "No es asesoría financiera"
- Proceso de dispute resolution
- Jurisdicción aplicable

**Template básico**: Buscar "Investment NFT Terms of Service"

##### B. Política de Privacidad

Debe cumplir:
- GDPR (si tienes usuarios europeos)
- CCPA (California)
- Ley Federal de Protección de Datos Personales (México)

**Qué datos recopilas**:
- Email (hasheado en blockchain, pero tienes el original)
- Wallet address (público)
- Monto de inversión (público en blockchain)
- Transaction history

##### C. KYC/AML Compliance

**¿Cuándo es necesario?**

| Escenario | KYC Requerido |
|-----------|---------------|
| Inversión individual <$10k USD | ❌ No (usualmente) |
| Inversión individual >$10k USD | ✅ Sí |
| Inversión total >$100k USD | ✅ Sí |
| Usuarios de USA | ✅ Probablemente |
| Usuarios de EU | ✅ Probablemente |

**Proveedores de KYC**:
- **Persona**: https://withpersona.com/ (~$1-3 por verificación)
- **Onfido**: https://onfido.com/ (~$2-5 por verificación)
- **Sumsub**: https://sumsub.com/ (~$1-4 por verificación)

##### D. Estructura Legal

**Opciones en México**:

1. **LLC (Sociedad de Responsabilidad Limitada)**
   - Costo: ~$2k-5k USD setup
   - Protección de responsabilidad personal
   - Más fácil para operar

2. **Fideicomiso**
   - Para manejar fondos de inversores
   - Banco como fiduciario
   - Mayor confianza de inversores
   - Costo: ~$5k-10k USD setup + fees anuales

3. **DAO (Organización Autónoma Descentralizada)**
   - Más complejo legalmente
   - Gobernanza descentralizada
   - Considerar Wyoming DAO LLC (USA)
   - Costo: ~$10k-20k USD

**Opción en USA** (si apuntas a mercado USA):

**Wyoming DAO LLC**
- Estado más crypto-friendly de USA
- LLC con gobernanza DAO
- Protección legal clara
- Costo: ~$500-1k USD + registered agent ($100/año)
- Servicio: https://www.doola.com/

#### Abogados Crypto Recomendados

**En México**:
- **Crypto Consult MX**: Especialistas en blockchain
- **Santamarina y Steta**: Bufete grande con práctica crypto
- **Hogan Lovells**: Oficina en CDMX, práctica global de blockchain

**En USA** (para clientes USA):
- **LexDAO**: https://www.lexdao.coop/ (Community de abogados crypto)
- **Anderson Kill**: Especialistas en securities crypto
- **Morrison & Foerster**: Práctica blockchain robusta

**Presupuesto**:
- Consulta inicial: $0-500 USD
- Setup básico (T&C, Privacy): $2k-5k USD
- Setup completo (estructura legal + compliance): $10k-20k USD

---

### 7. Sistema de Respaldo (Backup) 🔧

**Estado**: ❌ Pendiente
**Prioridad**: ALTA
**Tiempo estimado**: 1 semana
**Costo**: $0-50/mes

#### ¿Por qué es Importante?

Si tu frontend cae o hay problemas con RPC, necesitas:
- Acceso a datos históricos de inversiones
- Lista de todos los inversores
- Historial de distribuciones
- Metadata de NFTs

#### Componentes del Sistema de Backup

##### A. Listener de Eventos

```typescript
// scripts/event-listener.ts
import { ethers } from 'ethers'
import { URBANIKA_NFT_ABI } from './lib/web3/abi'

const provider = new ethers.JsonRpcProvider('https://rpc.scroll.io')
const contract = new ethers.Contract(CONTRACT_ADDRESS, URBANIKA_NFT_ABI, provider)

// Escuchar eventos en tiempo real
contract.on('NFTMinted', async (tokenId, investor, amount, tier, expectedReturn) => {
  console.log('Nuevo NFT minteado:', {
    tokenId: tokenId.toString(),
    investor,
    amount: ethers.formatEther(amount),
    tier,
    expectedReturn: ethers.formatEther(expectedReturn),
  })

  // Guardar en database
  await saveToDatabase({
    event: 'NFTMinted',
    tokenId: tokenId.toString(),
    investor,
    amount: amount.toString(),
    tier,
    expectedReturn: expectedReturn.toString(),
    timestamp: new Date(),
  })
})

// Similar para otros eventos:
// - ReturnDistributed
// - InvestmentCompleted
// - TreasuryUpdated
// - etc.
```

##### B. The Graph Subgraph (Recomendado)

**¿Qué es The Graph?**
Protocolo de indexación descentralizado que indexa datos de blockchain.

**Ventajas**:
- Queries rápidas tipo GraphQL
- No necesitas mantener servidor
- Datos siempre disponibles
- Usado por Uniswap, Aave, etc.

**Setup**:
```bash
# 1. Instalar Graph CLI
npm install -g @graphprotocol/graph-cli

# 2. Inicializar subgraph
graph init urbanika-nft

# 3. Definir schema (schema.graphql)
type Investment @entity {
  id: ID!
  tokenId: BigInt!
  investor: Bytes!
  investmentAmount: BigInt!
  expectedReturn: BigInt!
  currentReturn: BigInt!
  tier: Int!
  isActive: Boolean!
  mintDate: BigInt!
  distributions: [Distribution!]! @derivedFrom(field: "investment")
}

type Distribution @entity {
  id: ID!
  investment: Investment!
  amount: BigInt!
  timestamp: BigInt!
  txHash: Bytes!
}

# 4. Deploy subgraph
graph deploy urbanika-nft \
  --ipfs https://api.thegraph.com/ipfs/ \
  --node https://api.thegraph.com/deploy/
```

**Query ejemplo**:
```graphql
{
  investments(where: { isActive: true }, orderBy: mintDate, orderDirection: desc) {
    id
    tokenId
    investor
    investmentAmount
    currentReturn
    expectedReturn
    tier
    distributions {
      amount
      timestamp
    }
  }
}
```

**Costo**:
- Hosted Service: GRATIS
- Decentralized Network: ~$0.0001 por query

**Documentación**: https://thegraph.com/docs/

##### C. Database Off-Chain

Para datos que NO van en blockchain:

```typescript
// Prisma Schema (ejemplo)
model Investor {
  id            String   @id @default(cuid())
  walletAddress String   @unique
  email         String   // Email SIN hashear
  emailHash     String   // Para verificar contra blockchain
  name          String?
  createdAt     DateTime @default(now())
  investments   Investment[]
}

model Investment {
  id                String   @id @default(cuid())
  tokenId           String   @unique
  investor          Investor @relation(fields: [investorId], references: [id])
  investorId        String
  investmentAmount  String   // BigInt como string
  txHash            String
  blockNumber       Int
  timestamp         DateTime
  status            String   // 'active' | 'completed'
}

model Distribution {
  id             String   @id @default(cuid())
  tokenId        String
  amount         String
  txHash         String
  timestamp      DateTime
}
```

**Stack recomendado**:
- **Database**: PostgreSQL (Supabase gratis hasta 500MB)
- **ORM**: Prisma
- **Hosting**: Vercel (gratis) o Railway ($5/mes)

##### D. Script de Backup Periódico

```typescript
// scripts/backup.ts
async function backupAllData() {
  // 1. Obtener todos los NFTs del contrato
  const totalSupply = await contract.totalSupply()

  // 2. Para cada NFT, obtener datos
  const allInvestments = []
  for (let i = 1; i <= totalSupply; i++) {
    const investment = await contract.getInvestment(i)
    const owner = await contract.ownerOf(i)
    const tokenURI = await contract.tokenURI(i)

    allInvestments.push({
      tokenId: i,
      investment,
      owner,
      tokenURI,
    })
  }

  // 3. Guardar en archivo JSON
  fs.writeFileSync(
    `backups/backup-${Date.now()}.json`,
    JSON.stringify(allInvestments, null, 2)
  )

  // 4. Subir a S3 o similar (opcional)
  await uploadToS3(`backup-${Date.now()}.json`, allInvestments)
}

// Ejecutar cada 6 horas
setInterval(backupAllData, 6 * 60 * 60 * 1000)
```

---

### 8. Testing con Usuarios Reales en Testnet 📱

**Estado**: ⚠️ Contrato desplegado pero sin testers
**Prioridad**: ALTA
**Tiempo estimado**: 2-3 semanas
**Costo**: $0 (dar Sepolia ETH a testers)

#### Plan de Testing Completo

##### Fase 1: Testing Interno (1 semana)

```markdown
Objetivo: Verificar funcionalidad básica

Testers: Equipo interno (3-5 personas)

Tests a realizar:
✅ Conectar wallet (MetaMask, WalletConnect)
✅ Cambiar a red Scroll Sepolia
✅ Ver página de inversión
✅ Calcular precio de NFT
✅ Mintear NFT con diferentes montos
  - 250 MXN (Bronze)
  - 1000 MXN (Silver)
  - 5000 MXN (Gold)
  - 10000 MXN (Platinum)
✅ Ver NFT en wallet
✅ Ver metadata en OpenSea testnet
✅ Transferir NFT a otra wallet
✅ Ver dashboard de inversión
```

##### Fase 2: Beta Testing Privado (1 semana)

```markdown
Objetivo: Testing con usuarios reales

Testers: 10-15 early adopters

Cómo reclutar:
1. Amigos/familia con interés en crypto
2. Comunidad crypto local (meetups en CDMX)
3. Discord/Telegram de crypto en español
4. Twitter/X con hashtag #CryptoMéxico

Incentivos para testers:
- Primeros 10: NFT gratis en mainnet ($50 USD valor)
- Feedback > 500 palabras: $20 USD en USDT
- Referir más testers: $10 USD por referido

Setup para testers:
1. Enviar guía paso a paso
2. Dar 0.001 ETH en Sepolia (suficiente para mint)
3. Video tutorial de 5 min
4. Canal de soporte en Discord/Telegram
```

**Guía para Beta Testers**:
```markdown
# Guía de Testing - Urbanika NFT Beta

## Requisitos
- Navegador Chrome/Brave
- Extensión MetaMask instalada
- 10 minutos de tiempo

## Pasos

### 1. Configurar Red Scroll Sepolia
1. Abrir MetaMask
2. Click en red (arriba)
3. "Agregar red" > "Agregar red manualmente"
4. Completar:
   - Nombre: Scroll Sepolia
   - RPC: https://sepolia-rpc.scroll.io/
   - Chain ID: 534351
   - Símbolo: ETH
   - Explorer: https://sepolia.scrollscan.com/

### 2. Obtener ETH de Testnet
- Te enviaremos 0.001 ETH
- O usa faucet: [enlace al faucet]

### 3. Mintear Tu NFT
1. Ir a: https://urbanika.xyz/nft
2. Conectar wallet
3. Elegir monto de inversión
4. Completar compra
5. Esperar confirmación (~30 segundos)

### 4. Verificar NFT
1. Ir a OpenSea testnet: https://testnets.opensea.io/
2. Conectar wallet
3. Ver tu NFT en "Profile"

### 5. Dar Feedback
Responder:
1. ¿Fue fácil el proceso? (1-10)
2. ¿Algo confuso o roto?
3. ¿Qué mejorarías?
4. ¿Invertirías dinero real? ¿Por qué?

Enviar a: feedback@urbanika.xyz
```

##### Fase 3: Beta Testing Público (1 semana)

```markdown
Objetivo: Stress testing y marketing

Testers: 50-100 usuarios

Canales de distribución:
1. Post en Reddit r/CryptoMexico
2. Tweet/X con contest
3. Post en LinkedIn
4. Email a lista (si tienes)
5. Communities de crypto en Discord

Contest idea:
"Los primeros 50 en mintear un NFT en testnet
entran en sorteo de 5 NFTs reales en mainnet ($250 USD valor)"

Métricas a medir:
- Tasa de conversión (visitantes → mint)
- Tiempo promedio para completar mint
- Tasa de errores
- Feedback score promedio
- % que completaría compra real
```

#### Herramientas de Feedback

##### Google Forms
```markdown
Crear form con:
1. Email (requerido)
2. Wallet address (requerido)
3. ¿Completaste el mint? (sí/no)
4. Dificultad del proceso (1-10)
5. ¿Qué fue confuso?
6. ¿Qué mejorarías?
7. ¿Invertirías dinero real? ¿Cuánto?
8. Screenshots de problemas (opcional)
```

##### Hotjar / Clarity
- Grabar sesiones de usuarios
- Ver donde se atascan
- Heatmaps de clicks
- **Costo**: Gratis hasta 35 sesiones/día

#### Checklist de Bugs Comunes

```markdown
Revisar:
[ ] Wallet no conecta
[ ] Red incorrecta no detectada
[ ] Precio calculado mal
[ ] Transaction falla sin mensaje claro
[ ] NFT no aparece en wallet
[ ] Metadata no carga
[ ] Imágenes rotas
[ ] Mobile no funciona
[ ] Safari no compatible
[ ] Slow loading (>3 segundos)
```

---

### 9. Metadata e Imágenes en IPFS 📸

**Estado**: ⚠️ Usando base64 inline
**Prioridad**: MEDIA
**Tiempo estimado**: 2-3 días
**Costo**: $0-20/mes (Pinata)

#### Problema Actual

```typescript
// Actualmente en nft-purchase-flow.tsx:
const tokenURI = `data:application/json;base64,${btoa(JSON.stringify({
  name: `Urbanika Investment NFT #${Date.now()}`,
  description: `Investment of ${investmentAmount} MXN`,
  image: "https://urbanika.xyz/nft-image.png",
  // ...
}))}`
```

**Problemas**:
- Metadata está hardcoded en base64
- Imagen apunta a servidor centralizado
- Si urbanika.xyz cae, imágenes se pierden
- No es el estándar de la industria

#### Solución: IPFS + Pinata

##### Paso 1: Setup de Pinata

```bash
# 1. Crear cuenta en Pinata
# https://app.pinata.cloud/

# 2. Obtener API JWT
# Dashboard > API Keys > New Key

# 3. Instalar SDK
npm install pinata-web3

# 4. Configurar
export PINATA_JWT="your_jwt_here"
```

##### Paso 2: Crear Sistema de Metadata

```typescript
// lib/nft-metadata.ts
import { PinataSDK } from "pinata-web3";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
});

export async function createNFTMetadata(params: {
  tokenId: number
  investmentAmount: number
  expectedReturn: number
  tier: string
  investor: string
}) {
  // 1. Generar imagen única para este NFT
  // Opción A: Usar imagen template + overlay con datos
  // Opción B: Usar servicio de generación de imágenes
  const imageFile = await generateNFTImage({
    tokenId: params.tokenId,
    tier: params.tier,
    amount: params.investmentAmount,
  })

  // 2. Subir imagen a IPFS
  const imageUpload = await pinata.upload.file(imageFile)
  const imageCID = imageUpload.IpfsHash

  // 3. Crear metadata JSON
  const metadata = {
    name: `Urbanika Investment #${params.tokenId}`,
    description: `Investment certificate for ${params.investmentAmount} MXN in Urbanika's regenerative housing ecosystem. Expected return: ${params.expectedReturn} MXN (1.5x)`,
    image: `ipfs://${imageCID}`,
    external_url: `https://urbanika.xyz/investment/${params.tokenId}`,
    attributes: [
      {
        trait_type: "Investment Amount",
        value: params.investmentAmount,
        display_type: "number"
      },
      {
        trait_type: "Expected Return",
        value: params.expectedReturn,
        display_type: "number"
      },
      {
        trait_type: "Tier",
        value: params.tier
      },
      {
        trait_type: "Investor",
        value: params.investor
      },
      {
        trait_type: "Mint Date",
        value: new Date().toISOString(),
        display_type: "date"
      },
      {
        trait_type: "Status",
        value: "Active"
      }
    ]
  }

  // 4. Subir metadata a IPFS
  const metadataUpload = await pinata.upload.json(metadata)
  const metadataCID = metadataUpload.IpfsHash

  // 5. Retornar IPFS URI
  return {
    tokenURI: `ipfs://${metadataCID}`,
    metadataCID,
    imageCID,
  }
}
```

##### Paso 3: Generar Imágenes Únicas

**Opción A: Usar Canvas (Node.js)**

```typescript
// lib/generate-nft-image.ts
import { createCanvas, loadImage } from 'canvas'

export async function generateNFTImage(params: {
  tokenId: number
  tier: string
  amount: number
}) {
  // 1. Crear canvas
  const canvas = createCanvas(1000, 1000)
  const ctx = canvas.getContext('2d')

  // 2. Cargar imagen base
  const baseImage = await loadImage('/templates/nft-base.png')
  ctx.drawImage(baseImage, 0, 0, 1000, 1000)

  // 3. Agregar tier badge
  const tierColors = {
    Bronze: '#CD7F32',
    Silver: '#C0C0C0',
    Gold: '#FFD700',
    Platinum: '#E5E4E2'
  }
  ctx.fillStyle = tierColors[params.tier as keyof typeof tierColors]
  ctx.fillRect(50, 50, 200, 80)

  // 4. Agregar texto
  ctx.font = 'bold 48px Arial'
  ctx.fillStyle = '#FFFFFF'
  ctx.fillText(`#${params.tokenId}`, 70, 110)

  ctx.font = '36px Arial'
  ctx.fillText(`${params.amount} MXN`, 500, 500)

  // 5. Convertir a buffer
  return canvas.toBuffer('image/png')
}
```

**Opción B: Usar Servicio Externo**

```typescript
// Usar API de generación de imágenes
// Ejemplo: https://imgix.com/ o https://cloudinary.com/

const imageUrl = `https://urbanika.imgix.net/nft-template.png?` +
  `txt=${params.tokenId}&` +
  `txt-size=48&` +
  `txt-color=FFFFFF&` +
  `tier=${params.tier}&` +
  `amount=${params.amount}`

const response = await fetch(imageUrl)
const imageBuffer = await response.arrayBuffer()
```

##### Paso 4: Integrar en Mint Flow

```typescript
// components/nft-purchase-flow.tsx
const handleCryptoPayment = async () => {
  // ... validaciones ...

  setProcessing(true)
  setStep("processing")

  try {
    // 1. Crear metadata en IPFS
    const { tokenURI, metadataCID } = await createNFTMetadata({
      tokenId: Date.now(), // Temporal, el contrato asignará el real
      investmentAmount,
      expectedReturn,
      tier: getTierName(calculateTier(investmentAmount)),
      investor: address!,
    })

    // 2. Mintear NFT con tokenURI de IPFS
    await mintNFT({
      investmentAmount,
      tokenURI, // ipfs://Qm...
    })

    // 3. Guardar CIDs en database para referencia
    await fetch('/api/metadata/save', {
      method: 'POST',
      body: JSON.stringify({
        investor: address,
        metadataCID,
        imageCID,
        investmentAmount,
      })
    })
  } catch (err) {
    // ...
  }
}
```

#### Costos de IPFS/Pinata

| Plan | Storage | Bandwidth | Costo |
|------|---------|-----------|-------|
| **Free** | 1 GB | 100 GB/mes | $0 |
| **Picnic** | 100 GB | Ilimitado | $20/mes |
| **Fiesta** | 1 TB | Ilimitado | $100/mes |

**Estimación para Urbanika**:
- 10,000 NFTs
- Imagen: ~500 KB cada una = 5 GB
- Metadata: ~10 KB cada uno = 100 MB
- **Total**: ~5.1 GB
- **Plan necesario**: Picnic ($20/mes) ✅

#### IPFS Gateways

Para que las imágenes carguen rápido:

```typescript
// lib/ipfs.ts
export function getIPFSUrl(ipfsUri: string): string {
  const cid = ipfsUri.replace('ipfs://', '')

  // Usar gateway dedicado de Pinata (más rápido)
  return `https://gateway.pinata.cloud/ipfs/${cid}`

  // Alternativas:
  // return `https://ipfs.io/ipfs/${cid}` // Público pero más lento
  // return `https://cloudflare-ipfs.com/ipfs/${cid}` // Cloudflare
}
```

---

### 10. Monitoreo y Alertas 📊

**Estado**: ❌ Pendiente
**Prioridad**: MEDIA
**Tiempo estimado**: 1 semana
**Costo**: $0-50/mes

#### ¿Por Qué Monitorear?

Sin monitoreo, no sabrás si:
- Hay un ataque en progreso
- Transacciones están fallando
- Usuarios tienen problemas
- Cambios sospechosos en el contrato

#### Herramientas de Monitoreo

##### Opción 1: OpenZeppelin Defender (Recomendado)

**¿Qué es?**
Plataforma completa de gestión y monitoreo de smart contracts.

**Features**:
- ✅ Monitor de transacciones en tiempo real
- ✅ Alertas por email/Telegram/Discord
- ✅ Automatic actions (pausar contrato si detect algo raro)
- ✅ Gas price monitoring
- ✅ Admin actions logging

**Setup**:
```typescript
// 1. Ir a https://defender.openzeppelin.com/
// 2. Conectar wallet
// 3. Importar contrato (pegar address)

// 4. Crear Monitor para eventos críticos
{
  name: "Treasury Change Proposed",
  addresses: ["0x591D218a9Ac4843FB6f571273166B5d5df99E6c0"],
  abi: URBANIKA_NFT_ABI,
  eventConditions: [
    {
      eventSignature: "TreasuryChangeProposed(address,address,uint256)",
      expression: "true" // Alertar siempre
    }
  ],
  alertNotifications: [
    { type: "email", value: "admin@urbanika.xyz" },
    { type: "telegram", chatId: "..." }
  ]
}
```

**Alertas Recomendadas**:

```typescript
// Monitor 1: Mints Sospechosos
{
  name: "Large Mint Alert",
  condition: "NFTMinted event where investmentAmount > 50000 * 1e18",
  action: "Alert admin + pause minting"
}

// Monitor 2: Cambios de Treasury
{
  name: "Treasury Change Monitor",
  condition: "TreasuryChangeProposed event",
  action: "Alert all admins immediately"
}

// Monitor 3: Contrato Pausado
{
  name: "Contract Paused",
  condition: "Paused event",
  action: "Alert + check if legítimo"
}

// Monitor 4: Precio Cambiado
{
  name: "Price Update",
  condition: "PricePerUnitUpdated event",
  action: "Log + alert if change > 20%"
}

// Monitor 5: Distribución de Retornos
{
  name: "Return Distribution",
  condition: "ReturnDistributed event",
  action: "Log + update investor via email"
}
```

**Costo**:
- Plan Free: 5 monitors, básico
- Plan Team: $50/mes, ilimitado

##### Opción 2: Tenderly

**¿Qué es?**
Plataforma de debugging y monitoring para smart contracts.

**Features**:
- ✅ Transaction simulator (probar sin gastar gas)
- ✅ Debugger visual
- ✅ Alerting system
- ✅ Analytics dashboard

**Setup**:
```bash
# 1. Crear cuenta en https://tenderly.co/

# 2. Instalar CLI
npm install -g @tenderly/cli

# 3. Login
tenderly login

# 4. Agregar proyecto
tenderly project create urbanika-nft

# 5. Agregar contrato
tenderly contract add 0x591D218a9Ac4843FB6f571273166B5d5df99E6c0 \
  --network scroll-mainnet

# 6. Crear alertas en dashboard
```

**Ventaja sobre Defender**: Mejor para debugging transacciones fallidas.

**Costo**:
- Free: 3 contratos, básico
- Developer: $50/mes, 10 contratos

##### Opción 3: Custom Monitoring con Script

Si quieres algo gratis y personalizado:

```typescript
// scripts/monitor.ts
import { ethers } from 'ethers'
import { URBANIKA_NFT_ABI } from './lib/web3/abi'
import nodemailer from 'nodemailer'

const provider = new ethers.JsonRpcProvider('https://rpc.scroll.io')
const contract = new ethers.Contract(CONTRACT_ADDRESS, URBANIKA_NFT_ABI, provider)

// Setup email alerts
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'alerts@urbanika.xyz',
    pass: process.env.EMAIL_PASSWORD
  }
})

async function sendAlert(subject: string, message: string) {
  await transporter.sendMail({
    from: 'alerts@urbanika.xyz',
    to: 'admin@urbanika.xyz',
    subject: `🚨 ALERT: ${subject}`,
    text: message,
    html: `<h2>${subject}</h2><p>${message}</p>`
  })
}

// Monitor eventos críticos
contract.on('TreasuryChangeProposed', async (oldTreasury, newTreasury, unlockTime) => {
  await sendAlert(
    'Treasury Change Proposed!',
    `Someone proposed changing treasury from ${oldTreasury} to ${newTreasury}.
     Unlock time: ${new Date(unlockTime * 1000).toISOString()}`
  )
})

contract.on('NFTMinted', async (tokenId, investor, amount, tier, expectedReturn) => {
  const amountMXN = parseFloat(ethers.formatEther(amount))

  // Alert si es mint muy grande
  if (amountMXN > 50000) {
    await sendAlert(
      'Large Mint Detected!',
      `Token #${tokenId} minted for ${amountMXN} MXN by ${investor}`
    )
  }
})

// Monitor balance del treasury
setInterval(async () => {
  const treasuryAddress = await contract.treasury()
  const balance = await provider.getBalance(treasuryAddress)
  const balanceETH = parseFloat(ethers.formatEther(balance))

  // Alert si balance es muy bajo
  if (balanceETH < 0.1) {
    await sendAlert(
      'Low Treasury Balance',
      `Treasury balance is only ${balanceETH} ETH`
    )
  }
}, 60 * 60 * 1000) // Cada hora

console.log('🔍 Monitoring started...')
```

**Ejecutar como servicio**:
```bash
# Opción 1: PM2
npm install -g pm2
pm2 start scripts/monitor.ts --name urbanika-monitor

# Opción 2: Docker + restart always
docker run -d --restart always \
  -e PRIVATE_KEY=$PRIVATE_KEY \
  urbanika-monitor

# Opción 3: Systemd service (Linux)
sudo systemctl enable urbanika-monitor
sudo systemctl start urbanika-monitor
```

#### Dashboard de Analytics

**Dune Analytics** (Recomendado):

Crear dashboard público con:
- Total NFTs minteados
- Total investido (en MXN y USD)
- Distribución por tier
- Top inversores
- Retornos distribuidos
- Gráfico de crecimiento

**Ejemplo**: https://dune.com/

```sql
-- Query ejemplo para Dune
SELECT
  DATE_TRUNC('day', block_time) as date,
  COUNT(*) as nfts_minted,
  SUM(investmentAmount / 1e18) as total_invested_mxn
FROM scroll.logs
WHERE contract_address = '0x591D218a9Ac4843FB6f571273166B5d5df99E6c0'
  AND topic0 = 'NFTMinted' -- Event signature
GROUP BY 1
ORDER BY 1
```

**Costo**: Gratis

---

## 🟢 OPCIONAL - Nice to Have

### 11. Frontend Mejorado para Inversores 💎

**Tiempo estimado**: 2-3 semanas
**Costo**: $0 (desarrollo interno)

#### Dashboard Personal

```typescript
// app/dashboard/page.tsx
export default function InvestorDashboard() {
  const { address } = useAccount()
  const { data: myNFTs } = useInvestorNFTs(address)

  return (
    <div className="dashboard">
      <h1>Mi Portfolio</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <h3>Total Invertido</h3>
          <p className="text-3xl">{totalInvested} MXN</p>
        </Card>

        <Card>
          <h3>Retorno Recibido</h3>
          <p className="text-3xl">{totalReturn} MXN</p>
          <Progress value={returnPercentage} />
        </Card>

        <Card>
          <h3>Retorno Esperado</h3>
          <p className="text-3xl">{expectedReturn} MXN</p>
        </Card>
      </div>

      {/* NFT List */}
      <div className="nft-list">
        {myNFTs.map(nft => (
          <NFTCard
            key={nft.tokenId}
            tokenId={nft.tokenId}
            amount={nft.investmentAmount}
            tier={nft.tier}
            progress={nft.returnProgress}
            isActive={nft.isActive}
          />
        ))}
      </div>

      {/* Distribution History */}
      <div className="history">
        <h2>Historial de Distribuciones</h2>
        <Table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Token ID</th>
              <th>Monto</th>
              <th>TX Hash</th>
            </tr>
          </thead>
          <tbody>
            {distributions.map(d => (
              <tr key={d.id}>
                <td>{formatDate(d.timestamp)}</td>
                <td>#{d.tokenId}</td>
                <td>{d.amount} MXN</td>
                <td>
                  <a href={`https://scrollscan.com/tx/${d.txHash}`}>
                    {d.txHash.slice(0, 10)}...
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  )
}
```

#### Calculadora de ROI

```typescript
// components/roi-calculator.tsx
export function ROICalculator() {
  const [investment, setInvestment] = useState(1000)
  const [months, setMonths] = useState(12)

  const expectedReturn = investment * 1.5
  const monthlyReturn = expectedReturn / months
  const roi = ((expectedReturn - investment) / investment) * 100

  return (
    <div className="calculator">
      <h3>Calculadora de Retorno</h3>

      <label>
        Inversión (MXN)
        <input
          type="number"
          value={investment}
          onChange={e => setInvestment(Number(e.target.value))}
        />
      </label>

      <label>
        Plazo estimado (meses)
        <input
          type="range"
          min="6"
          max="36"
          value={months}
          onChange={e => setMonths(Number(e.target.value))}
        />
        <span>{months} meses</span>
      </label>

      <div className="results">
        <div>
          <strong>Retorno Total:</strong>
          <span>{expectedReturn.toFixed(2)} MXN</span>
        </div>
        <div>
          <strong>Retorno Mensual Estimado:</strong>
          <span>{monthlyReturn.toFixed(2)} MXN/mes</span>
        </div>
        <div>
          <strong>ROI:</strong>
          <span>{roi.toFixed(2)}%</span>
        </div>
      </div>
    </div>
  )
}
```

---

### 12. API Backend para Emails 📧

**Tiempo estimado**: 1 semana
**Costo**: $10-20/mes (SendGrid/Resend)

#### Email Templates

##### A. Confirmación de Compra

```typescript
// emails/purchase-confirmation.tsx
export function PurchaseConfirmationEmail({
  investorName,
  tokenId,
  investmentAmount,
  expectedReturn,
  tier,
  txHash
}) {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Heading>¡Gracias por tu inversión en Urbanika!</Heading>

          <Text>
            Hola {investorName},
          </Text>

          <Text>
            Tu inversión ha sido confirmada exitosamente.
          </Text>

          <Section>
            <h2>Detalles de tu NFT</h2>
            <Row>
              <Column>Token ID:</Column>
              <Column>#{tokenId}</Column>
            </Row>
            <Row>
              <Column>Inversión:</Column>
              <Column>{investmentAmount} MXN</Column>
            </Row>
            <Row>
              <Column>Tier:</Column>
              <Column>{tier}</Column>
            </Row>
            <Row>
              <Column>Retorno Esperado:</Column>
              <Column>{expectedReturn} MXN (1.5x)</Column>
            </Row>
          </Section>

          <Button href={`https://sepolia.scrollscan.com/tx/${txHash}`}>
            Ver Transacción
          </Button>

          <Button href={`https://urbanika.xyz/dashboard`}>
            Ver Mi Dashboard
          </Button>
        </Container>
      </Body>
    </Html>
  )
}
```

##### B. Notificación de Distribución

```typescript
// emails/distribution-notification.tsx
export function DistributionEmail({
  investorName,
  tokenId,
  distributedAmount,
  totalReceived,
  expectedReturn,
  progress
}) {
  return (
    <Html>
      <Body>
        <Container>
          <Heading>💰 Retorno Distribuido</Heading>

          <Text>
            Hola {investorName},
          </Text>

          <Text>
            Tenemos buenas noticias! Se ha distribuido un retorno
            para tu inversión NFT #{tokenId}.
          </Text>

          <Section className="highlight">
            <h2>{distributedAmount} MXN</h2>
            <p>Retorno distribuido</p>
          </Section>

          <Section>
            <Progress value={progress} />
            <p>
              Has recibido {totalReceived} MXN de {expectedReturn} MXN
              ({progress}%)
            </p>
          </Section>

          <Button href="https://urbanika.xyz/dashboard">
            Ver Detalles
          </Button>
        </Container>
      </Body>
    </Html>
  )
}
```

#### Servicio de Email

**Opción 1: Resend (Recomendado)**

```typescript
// lib/email.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendPurchaseConfirmation(params: {
  to: string
  investorName: string
  tokenId: number
  // ...
}) {
  await resend.emails.send({
    from: 'Urbanika <no-reply@urbanika.xyz>',
    to: params.to,
    subject: '✅ Confirmación de Inversión - Urbanika NFT',
    react: PurchaseConfirmationEmail(params)
  })
}
```

**Costo**: $20/mes (50k emails)

**Opción 2: SendGrid**

Similar API, más caro: $15/mes (40k emails)

#### Trigger Emails desde Eventos

```typescript
// scripts/email-listener.ts
contract.on('NFTMinted', async (tokenId, investor, amount, tier, expectedReturn) => {
  // 1. Obtener email del inversor de database
  const investorData = await db.investor.findUnique({
    where: { walletAddress: investor }
  })

  // 2. Enviar email de confirmación
  if (investorData?.email) {
    await sendPurchaseConfirmation({
      to: investorData.email,
      investorName: investorData.name || 'Inversor',
      tokenId: Number(tokenId),
      investmentAmount: parseFloat(ethers.formatEther(amount)),
      expectedReturn: parseFloat(ethers.formatEther(expectedReturn)),
      tier: getTierName(tier),
      txHash: '...' // Obtener del event log
    })
  }
})

contract.on('ReturnDistributed', async (tokenId, amount, totalReceived) => {
  // Similar para distribuciones
  await sendDistributionNotification({ ... })
})
```

---

### 13. NFT Marketplace Integration 🏪

**Tiempo estimado**: 1-2 semanas
**Costo**: $0

#### OpenSea

**Auto-listing**: Los NFTs ERC-721 aparecen automáticamente en OpenSea.

**Verificar colección**:
```bash
# 1. Ir a OpenSea
# https://opensea.io/ (mainnet)
# https://testnets.opensea.io/ (testnet)

# 2. Buscar tu contrato
# Pegar address: 0x591D218a9Ac4843FB6f571273166B5d5df99E6c0

# 3. Request verificación
# Dashboard > Edit Collection > Verification
```

**Custom storefront**:
```typescript
// Usar OpenSea Seaport SDK
import { Seaport } from "@opensea/seaport-js"

const seaport = new Seaport(provider)

// Crear listing
const { executeAllActions } = await seaport.createOrder({
  offer: [{
    itemType: ItemType.ERC721,
    token: CONTRACT_ADDRESS,
    identifier: tokenId,
  }],
  consideration: [{
    amount: ethers.parseEther("0.1").toString(),
    recipient: address,
  }],
})

await executeAllActions()
```

#### Rarible

Similar a OpenSea, auto-listing.

**SDK**:
```typescript
import { createRaribleSdk } from "@rarible/sdk"

const sdk = createRaribleSdk(provider, "prod")

// Vender NFT
await sdk.order.sell({
  itemId: `SCROLL:${CONTRACT_ADDRESS}:${tokenId}`,
  price: "0.1",
  currency: "ETH"
})
```

---

### 14. Programa de Referidos 🎁

**Tiempo estimado**: 1 semana
**Costo**: Variable (depende de rewards)

#### Sistema On-Chain

```solidity
// Agregar al contrato
mapping(address => address) public referrers; // investor => referrer
mapping(address => uint256) public referralCount;
mapping(address => uint256) public referralRewards;

event ReferralRegistered(address indexed investor, address indexed referrer);
event ReferralRewardPaid(address indexed referrer, uint256 amount);

function publicMintWithReferral(
    uint256 investmentAmount,
    string memory tokenURI,
    address referrer
) public payable whenNotPaused whenMintNotPaused nonReentrant returns (uint256) {
    // ... mint normal ...

    // Si hay referrer válido
    if (referrer != address(0) && referrer != msg.sender) {
        referrers[msg.sender] = referrer;
        referralCount[referrer]++;

        // Pagar 5% del monto como reward al referrer
        uint256 reward = requiredPayment * 5 / 100;
        referralRewards[referrer] += reward;

        // Transferir reward
        (bool sent, ) = payable(referrer).call{value: reward}("");
        require(sent, "Referral reward transfer failed");

        emit ReferralRegistered(msg.sender, referrer);
        emit ReferralRewardPaid(referrer, reward);
    }

    return tokenId;
}

function claimReferralRewards() external nonReentrant {
    uint256 rewards = referralRewards[msg.sender];
    require(rewards > 0, "No rewards to claim");

    referralRewards[msg.sender] = 0;

    (bool sent, ) = payable(msg.sender).call{value: rewards}("");
    require(sent, "Reward claim failed");
}
```

#### Frontend de Referidos

```typescript
// app/referral/page.tsx
export default function ReferralPage() {
  const { address } = useAccount()
  const referralCode = address ? btoa(address) : ''
  const referralLink = `https://urbanika.xyz/nft?ref=${referralCode}`

  const { data: stats } = useReferralStats(address)

  return (
    <div>
      <h1>Programa de Referidos</h1>

      <Card>
        <h2>Tu Link de Referido</h2>
        <input value={referralLink} readOnly />
        <Button onClick={() => navigator.clipboard.writeText(referralLink)}>
          Copiar
        </Button>
      </Card>

      <div className="stats">
        <Card>
          <h3>Referidos</h3>
          <p>{stats?.count || 0}</p>
        </Card>

        <Card>
          <h3>Rewards Ganados</h3>
          <p>{stats?.rewards || 0} ETH</p>
        </Card>

        <Button onClick={handleClaim}>
          Reclamar Rewards
        </Button>
      </div>
    </div>
  )
}
```

---

## 📊 Checklist Resumida

### Antes de Mainnet:

#### 🔴 CRÍTICO
- [ ] 1. Crear multisig y transferir ownership
- [ ] 2. Auditoría profesional del contrato
- [ ] 3. Obtener 0.1+ ETH en Scroll Mainnet
- [ ] 4. Implementar Chainlink Price Feed (o plan manual)

#### 🟡 IMPORTANTE
- [ ] 5. Consultar abogado crypto (T&C, legal structure)
- [ ] 6. Testing con 10-20 beta users en testnet
- [ ] 7. Sistema de backup (events, database)
- [ ] 8. Metadata/imágenes en IPFS
- [ ] 9. Configurar monitoreo (Tenderly/Defender)

#### 🟢 OPCIONAL
- [ ] 10. Dashboard mejorado para inversores
- [ ] 11. Email notifications
- [ ] 12. Integración con marketplaces
- [ ] 13. Seguro del contrato (Nexus Mutual)
- [ ] 14. Programa de referidos

---

## ⏱️ Timeline Estimado

| Fase | Duración | Costo Estimado |
|------|----------|----------------|
| **Auditoría** | 2-4 semanas | $10k-50k |
| **Legal/Compliance** | 1-2 semanas | $2k-10k |
| **Testing Beta** | 1-2 semanas | $0 |
| **Implementar mejoras** | 1-2 semanas | $0-500 |
| **Deploy Mainnet** | 1 día | $300 |
| **Total** | **6-11 semanas** | **$12k-60k** |

---

## 💰 Presupuestos por Escenario

### Opción Mínima ($500-1,000) ⚠️

**Incluye**:
- Deploy sin auditoría (ALTO RIESGO)
- Multisig básico
- Sin seguro
- Sin price feed dinámico
- Testing manual limitado

**Recomendado para**:
- MVP/prueba de concepto
- Capital <$10k USD
- Inversores que conoces personalmente

---

### Opción Recomendada ($15k-25k) ✅

**Incluye**:
- ✅ Auditoría mid-tier (Hacken/Solidity Finance)
- ✅ Multisig + timelock configurado
- ✅ Chainlink Price Feed
- ✅ Consultoría legal básica (T&C, Privacy)
- ✅ Sistema de monitoring (Defender)
- ✅ Testing beta con 20+ usuarios
- ✅ Metadata en IPFS
- ✅ Dashboard básico

**Recomendado para**:
- Capital $50k-500k USD
- Lanzamiento público
- Inversores no conocidos

---

### Opción Premium ($60k-100k) 🌟

**Incluye**:
- ✅ Auditoría top-tier (OpenZeppelin/Consensys)
- ✅ Legal completo + estructura DAO/LLC
- ✅ Seguro de Nexus Mutual (6 meses)
- ✅ Backend completo + API
- ✅ Email notifications automatizadas
- ✅ Dashboard avanzado con analytics
- ✅ Marketing y growth strategy
- ✅ Soporte 24/7

**Recomendado para**:
- Capital >$500k USD
- Lanzamiento con marketing agresivo
- Buscar inversión institucional

---

## 📞 Próximos Pasos

1. **Decidir presupuesto y timeline**
   - ¿Cuánto capital esperas manejar?
   - ¿Cuándo quieres lanzar en mainnet?

2. **Priorizar mejoras críticas**
   - Multisig es **obligatorio**
   - Auditoría es **muy recomendada**

3. **Comenzar testing en testnet**
   - Invitar beta testers
   - Recopilar feedback
   - Iterar

4. **Preparar legal**
   - Consultar abogado
   - Preparar T&C

5. **Deploy a mainnet**
   - Cuando todo esté listo
   - Empezar con límites bajos
   - Escalar gradualmente

---

## 📚 Recursos Útiles

### Documentación
- Scroll Docs: https://docs.scroll.io/
- OpenZeppelin: https://docs.openzeppelin.com/
- Chainlink: https://docs.chain.link/

### Herramientas
- Gnosis Safe: https://app.safe.global/
- OpenZeppelin Defender: https://defender.openzeppelin.com/
- Tenderly: https://tenderly.co/
- The Graph: https://thegraph.com/

### Auditorías
- OpenZeppelin: https://openzeppelin.com/security-audits
- Consensys: https://consensys.io/diligence/
- Code4rena: https://code4rena.com/
- Sherlock: https://www.sherlock.xyz/

### Legal
- LexDAO: https://www.lexdao.coop/
- Wyoming DAO LLC: https://www.doola.com/

---

**Última actualización**: 2025-10-14
**Versión del contrato**: v2.0 Production Ready
**Testnet**: Scroll Sepolia - `0x591D218a9Ac4843FB6f571273166B5d5df99E6c0`
