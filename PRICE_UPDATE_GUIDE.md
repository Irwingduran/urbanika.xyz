# Guía para Actualizar el Precio del NFT

Esta guía te ayudará a actualizar el precio de minteo de los NFTs en tu smart contract de Urbanika.

## 🔍 Problema Detectado

El precio actual del contrato está configurado muy alto para Scroll Mainnet:
- **Precio actual:** `0.000033 ETH por MXN`
- **Costo para 250 MXN:** `~0.008 ETH` ≈ $24 USD
- **Valor real de 250 MXN:** ≈ $13.75 USD

Esto significa que los usuarios están pagando **casi el doble** en fees de lo que deberían.

## ✅ Solución: Script de Actualización

He creado el script `/scripts/update-price.ts` que te permite actualizar el precio fácilmente.

## 📋 Pasos para Actualizar el Precio

### 1. Verificar tu configuración

Asegúrate de tener las siguientes variables en tu archivo `.env`:

```bash
# Dirección del contrato desplegado en Scroll Mainnet
URBANIKA_NFT_ADDRESS=0x...

# Private key del owner (la wallet que desplegó el contrato)
PRIVATE_KEY=0x...

# RPC URL de Scroll Mainnet
SCROLL_MAINNET_RPC=https://rpc.scroll.io
```

### 2. Actualizar tasas de cambio en el script

Abre `/scripts/update-price.ts` y actualiza las líneas 46-48 con las tasas actuales:

```typescript
const MXN_TO_USD = 0.055; // Actualizar con tasa real MXN/USD
const ETH_PRICE_USD = 3000; // Actualizar con precio actual de ETH
const MXN_PER_UNIT = 100; // Mantener en 100
```

**Dónde obtener las tasas:**
- MXN/USD: https://www.xe.com/currency_charts/MXN_USD
- ETH/USD: https://www.coingecko.com/en/coins/ethereum

### 3. Ejecutar el script

```bash
npx hardhat run scripts/update-price.ts --network scrollMainnet
```

### 4. Verificar la actualización

El script te mostrará:
- ✅ Precio anterior vs. nuevo precio
- ✅ Ejemplos de costos para diferentes inversiones
- ✅ Hash de transacción en Scrollscan

## 🔢 Cálculo del Precio Correcto

El script calcula automáticamente el precio correcto usando:

```
Precio en ETH = (100 MXN × tasa_MXN_USD) / precio_ETH_USD
```

**Ejemplo con tasas actuales:**
- 100 MXN × 0.055 = $5.50 USD
- $5.50 / $3,000 = 0.001833 ETH por cada 100 MXN

**Esto significa:**
| Inversión MXN | Costo en ETH | Costo en USD (ETH @ $3,000) |
|--------------|--------------|----------------------------|
| 250 MXN | ~0.00458 ETH | ~$13.75 USD ✅ |
| 500 MXN | ~0.00916 ETH | ~$27.50 USD ✅ |
| 1,000 MXN | ~0.01833 ETH | ~$55.00 USD ✅ |
| 5,000 MXN | ~0.09165 ETH | ~$275.00 USD ✅ |
| 10,000 MXN | ~0.1833 ETH | ~$550.00 USD ✅ |

## ⚙️ Opción Alternativa: Precio Manual

Si prefieres establecer un precio fijo sin cálculo dinámico, puedes descomentar la línea 56 en el script:

```typescript
// Opción 2: Establecer precio manualmente
const newPrice = ethers.parseEther("0.001833"); // ETH por 100 MXN
```

## 🔒 Seguridad

- ✅ Solo el **owner** del contrato puede actualizar el precio
- ✅ El script verifica automáticamente que seas el owner
- ✅ El contrato tiene la función `setPricePerUnit()` implementada (línea 485-490)

## 📊 Verificación Post-Actualización

Después de actualizar el precio, puedes verificarlo:

### En el contrato:
```javascript
const price = await contract.pricePerUnit()
console.log(ethers.formatEther(price)) // Mostrará el nuevo precio
```

### En Scrollscan:
1. Ve a: https://scrollscan.com/address/[TU_CONTRATO]
2. Click en "Read Contract"
3. Busca la función `pricePerUnit`
4. Verifica que muestre el nuevo precio

### En tu frontend:
El precio se actualizará automáticamente porque ya implementamos `useCalculatePrice()` que consulta al contrato en tiempo real.

## 🎯 Resultado Esperado

Después de actualizar el precio correctamente:

- ✅ Los usuarios pagarán el precio justo según las tasas de cambio actuales
- ✅ 250 MXN costará aproximadamente $13-14 USD (no $24 USD)
- ✅ El frontend mostrará el precio correcto automáticamente
- ✅ Los gas fees reales de Scroll seguirán siendo muy bajos (~$0.01-0.05)

## ⚠️ Importante

Recuerda actualizar el precio periódicamente cuando:
- El precio de ETH cambie significativamente (±10%)
- La tasa MXN/USD cambie significativamente

Puedes automatizar esto en el futuro usando Chainlink Price Feeds para precios dinámicos en tiempo real.

## 🆘 Troubleshooting

### Error: "Only the owner can update the price"
- Verifica que estás usando la wallet correcta (la que desplegó el contrato)
- Verifica que `PRIVATE_KEY` en `.env` sea la del owner

### Error: "URBANIKA_NFT_ADDRESS not defined"
- Agrega la dirección del contrato en tu `.env`

### Error: Transaction failed
- Verifica que tengas suficiente ETH en Scroll Mainnet para el gas
- Verifica que estés conectado a la red correcta

## 📞 Soporte

Si necesitas ayuda, revisa:
- El contrato: `/contracts/UrbanikaNFT.sol`
- La implementación frontend: `/hooks/web3/useMintNFT.ts`
- Los logs de transacción en: https://scrollscan.com
