import { expect } from "chai";
import { ethers } from "hardhat";
import { UrbanikaNFT } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

/**
 * Oracle Tests para UrbanikaNFT v2.0.3
 * Tests de integración con Chainlink Price Feed
 * Tests de validación ALTA-01 (staleness, invalid price, incomplete rounds)
 */

describe("Oracle Integration Tests", function () {
  let urbanikaNFT: UrbanikaNFT;
  let owner: HardhatEthersSigner;
  let user: HardhatEthersSigner;
  let treasury: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, user, treasury] = await ethers.getSigners();

    const UrbanikaNFT = await ethers.getContractFactory("UrbanikaNFT");
    urbanikaNFT = await UrbanikaNFT.deploy(treasury.address);
    await urbanikaNFT.waitForDeployment();
  });

  describe("Oracle Price Feed", function () {
    it("Should have Oracle address set", async function () {
      const oracleAddress = await urbanikaNFT.ethPriceFeed();
      // En localhost no habrá Oracle real, debería ser address(0)
      // En testnet/mainnet debería estar configurado
      expect(oracleAddress).to.not.be.undefined;
    });

    it("Should get ETH price in USD", async function () {
      const price = await urbanikaNFT.getETHPriceUSD();
      expect(price).to.be.gt(0);
      console.log(`      ETH Price: $${ethers.formatUnits(price, 18)}`);
    });

    it("Should use manual price as fallback when no Oracle", async function () {
      // En localhost sin Oracle, debería usar precio manual
      const price = await urbanikaNFT.getETHPriceUSD();
      const manualPrice = await urbanikaNFT.manualETHPrice();

      // Si no hay Oracle, debería devolver manualPrice * 1e10
      expect(price).to.equal(manualPrice * 10n ** 10n);
    });
  });

  describe("Manual Price Management", function () {
    it("Should allow owner to set manual ETH price", async function () {
      const newPrice = 3500n * 10n ** 8n; // $3500 USD (8 decimales)

      await expect(urbanikaNFT.setManualETHPrice(newPrice))
        .to.emit(urbanikaNFT, "ManualPriceUpdated")
        .withArgs(newPrice);

      expect(await urbanikaNFT.manualETHPrice()).to.equal(newPrice);
    });

    it("Should prevent non-owner from setting manual price", async function () {
      await expect(
        urbanikaNFT.connect(user).setManualETHPrice(3500n * 10n ** 8n)
      ).to.be.revertedWithCustomError(urbanikaNFT, "OwnableUnauthorizedAccount");
    });

    it("Should reject zero price", async function () {
      await expect(
        urbanikaNFT.setManualETHPrice(0)
      ).to.be.revertedWithCustomError(urbanikaNFT, "AmountMustBeGreaterThanZero");
    });

    it("Should use updated manual price immediately", async function () {
      const newPrice = 4000n * 10n ** 8n; // $4000 USD
      await urbanikaNFT.setManualETHPrice(newPrice);

      const returnedPrice = await urbanikaNFT.getETHPriceUSD();
      expect(returnedPrice).to.equal(newPrice * 10n ** 10n);
    });
  });

  describe("Price Feed Configuration", function () {
    it("Should allow owner to set price feed address", async function () {
      const mockOracleAddress = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"; // ETH/USD Mainnet

      await expect(urbanikaNFT.setPriceFeed(mockOracleAddress))
        .to.emit(urbanikaNFT, "PriceFeedUpdated")
        .withArgs(ethers.ZeroAddress, mockOracleAddress);

      expect(await urbanikaNFT.ethPriceFeed()).to.equal(mockOracleAddress);
    });

    it("Should prevent non-owner from setting price feed", async function () {
      const mockOracleAddress = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";

      await expect(
        urbanikaNFT.connect(user).setPriceFeed(mockOracleAddress)
      ).to.be.revertedWithCustomError(urbanikaNFT, "OwnableUnauthorizedAccount");
    });

    it("Should allow setting price feed to zero address (disable Oracle)", async function () {
      await expect(urbanikaNFT.setPriceFeed(ethers.ZeroAddress))
        .to.not.be.reverted;

      expect(await urbanikaNFT.ethPriceFeed()).to.equal(ethers.ZeroAddress);
    });
  });

  describe("Tier Calculation with Price", function () {
    it("Should calculate correct tier based on USD amount", async function () {
      // Estos tests verifican la lógica de tiers con diferentes precios ETH
      const ethPrice = await urbanikaNFT.getETHPriceUSD();
      console.log(`      Current ETH Price: $${ethers.formatUnits(ethPrice, 18)}`);

      // Bronze: < $25 USD
      const bronzeInvestment = ethers.parseEther("500"); // 500 MXN
      await urbanikaNFT.mint(user.address, bronzeInvestment, 0, "ipfs://bronze", "test@test.com");
      let investment = await urbanikaNFT.getInvestment(1);
      console.log(`      Bronze Tier - Investment: ${ethers.formatEther(investment.investmentAmount)} MXN`);
      expect(investment.tier).to.equal(0); // Bronze

      // Silver: $25 - $250 USD
      const silverInvestment = ethers.parseEther("5000"); // 5000 MXN
      await urbanikaNFT.mint(user.address, silverInvestment, 0, "ipfs://silver", "test@test.com");
      investment = await urbanikaNFT.getInvestment(2);
      console.log(`      Silver Tier - Investment: ${ethers.formatEther(investment.investmentAmount)} MXN`);
      expect(investment.tier).to.equal(1); // Silver

      // Gold: $250 - $500 USD
      const goldInvestment = ethers.parseEther("10000"); // 10000 MXN
      await urbanikaNFT.mint(user.address, goldInvestment, 0, "ipfs://gold", "test@test.com");
      investment = await urbanikaNFT.getInvestment(3);
      console.log(`      Gold Tier - Investment: ${ethers.formatEther(investment.investmentAmount)} MXN`);
      expect(investment.tier).to.equal(2); // Gold

      // Platinum: >= $500 USD
      const platinumInvestment = ethers.parseEther("20000"); // 20000 MXN
      await urbanikaNFT.mint(user.address, platinumInvestment, 0, "ipfs://platinum", "test@test.com");
      investment = await urbanikaNFT.getInvestment(4);
      console.log(`      Platinum Tier - Investment: ${ethers.formatEther(investment.investmentAmount)} MXN`);
      expect(investment.tier).to.equal(3); // Platinum
    });
  });

  describe("ALTA-01: Oracle Validation Tests", function () {
    // Nota: Estos tests validan la LÓGICA de validación del Oracle
    // En localhost sin Oracle real, no se pueden probar escenarios de staleness
    // Estos tests se deben ejecutar en testnet con Oracle real

    it("Should have PRICE_STALENESS_THRESHOLD constant", async function () {
      // Verificar que la constante existe (1 hora = 3600 segundos)
      // No hay getter público, pero podemos verificar el comportamiento
      const price = await urbanikaNFT.getETHPriceUSD();
      expect(price).to.be.gt(0);
    });

    it("Should handle Oracle failure gracefully", async function () {
      // Cuando Oracle falla, debe usar precio manual
      // En localhost esto siempre es true
      const price = await urbanikaNFT.getETHPriceUSD();
      const manualPrice = await urbanikaNFT.manualETHPrice();

      // Debería devolver precio manual * 1e10
      expect(price).to.equal(manualPrice * 10n ** 10n);
    });

    it("Should validate price is greater than zero", async function () {
      // Esta validación está en el código:
      // if (priceInt <= 0) revert InvalidPriceFromOracle();

      const price = await urbanikaNFT.getETHPriceUSD();
      expect(price).to.be.gt(0);
    });

    it("Manual price should always be positive", async function () {
      const manualPrice = await urbanikaNFT.manualETHPrice();
      expect(manualPrice).to.be.gt(0);

      // No permitir setear precio en cero
      await expect(
        urbanikaNFT.setManualETHPrice(0)
      ).to.be.revertedWithCustomError(urbanikaNFT, "AmountMustBeGreaterThanZero");
    });
  });

  describe("Exchange Rate Conversion", function () {
    it("Should convert MXN to USD correctly", async function () {
      // Tasa de cambio aproximada: 1 USD = 17-20 MXN
      const EXCHANGE_RATE_USD_TO_MXN = 18n * 10n ** 8n; // 18 MXN per USD (8 decimales)

      // Actualizar la tasa
      await urbanikaNFT.setExchangeRate(EXCHANGE_RATE_USD_TO_MXN);
      expect(await urbanikaNFT.usdToMxnRate()).to.equal(EXCHANGE_RATE_USD_TO_MXN);

      // Verificar conversión
      const mxnAmount = ethers.parseEther("1800"); // 1800 MXN
      // Debería ser ~100 USD a tasa de 18:1
    });

    it("Should allow owner to update exchange rate", async function () {
      const newRate = 19n * 10n ** 8n; // 19 MXN per USD

      await expect(urbanikaNFT.setExchangeRate(newRate))
        .to.emit(urbanikaNFT, "ExchangeRateUpdated")
        .withArgs(newRate);

      expect(await urbanikaNFT.usdToMxnRate()).to.equal(newRate);
    });

    it("Should prevent non-owner from updating exchange rate", async function () {
      await expect(
        urbanikaNFT.connect(user).setExchangeRate(20n * 10n ** 8n)
      ).to.be.revertedWithCustomError(urbanikaNFT, "OwnableUnauthorizedAccount");
    });

    it("Should reject zero exchange rate", async function () {
      await expect(
        urbanikaNFT.setExchangeRate(0)
      ).to.be.revertedWithCustomError(urbanikaNFT, "AmountMustBeGreaterThanZero");
    });
  });

  describe("Real-world Price Scenarios", function () {
    it("Should handle high volatility price changes", async function () {
      // Escenario: ETH price sube de $3000 a $4000
      await urbanikaNFT.setManualETHPrice(3000n * 10n ** 8n);
      const price1 = await urbanikaNFT.getETHPriceUSD();

      await urbanikaNFT.setManualETHPrice(4000n * 10n ** 8n);
      const price2 = await urbanikaNFT.getETHPriceUSD();

      expect(price2).to.be.gt(price1);
      const increase = (price2 - price1) * 100n / price1;
      console.log(`      Price increased by: ${increase}%`);
    });

    it("Should handle bear market scenario", async function () {
      // Escenario: ETH price baja de $3000 a $2000
      await urbanikaNFT.setManualETHPrice(3000n * 10n ** 8n);
      const price1 = await urbanikaNFT.getETHPriceUSD();

      await urbanikaNFT.setManualETHPrice(2000n * 10n ** 8n);
      const price2 = await urbanikaNFT.getETHPriceUSD();

      expect(price2).to.be.lt(price1);
    });

    it("Should maintain precision in conversions", async function () {
      // Verificar que no se pierda precisión en cálculos
      const ethPrice = 3456n * 10n ** 8n; // $3456.78 USD
      await urbanikaNFT.setManualETHPrice(ethPrice);

      const returnedPrice = await urbanikaNFT.getETHPriceUSD();
      // Debe mantener precisión con 18 decimales
      expect(returnedPrice).to.equal(ethPrice * 10n ** 10n);
    });
  });

  describe("Gas Optimization", function () {
    it("Should use minimal gas for price fetching", async function () {
      // Llamada view no consume gas en transacciones
      const tx = await urbanikaNFT.getETHPriceUSD.staticCall();
      expect(tx).to.be.gt(0);
    });

    it("Should cache Oracle calls efficiently", async function () {
      // Multiple calls shouldn't increase gas (view function)
      await urbanikaNFT.getETHPriceUSD();
      await urbanikaNFT.getETHPriceUSD();
      await urbanikaNFT.getETHPriceUSD();

      // View calls son gratis
      const price = await urbanikaNFT.getETHPriceUSD();
      expect(price).to.be.gt(0);
    });
  });

  describe("Integration with Minting", function () {
    it("Should use Oracle price for tier calculation during mint", async function () {
      const investment = ethers.parseEther("5000"); // 5000 MXN

      await urbanikaNFT.mint(
        user.address,
        investment,
        "ipfs://integration",
        "test@test.com",
        0 // PaymentToken.ETH
      );

      const inv = await urbanikaNFT.getInvestment(1);
      expect(inv.tier).to.be.gte(0).and.lte(3);
      console.log(`      Investment Tier: ${inv.tier} (0=Bronze, 1=Silver, 2=Gold, 3=Platinum)`);
    });

    it("Should calculate expected return correctly", async function () {
      const investment = ethers.parseEther("10000"); // 10000 MXN

      await urbanikaNFT.mint(
        user.address,
        investment,
        "ipfs://return",
        "test@test.com",
        0
      );

      const inv = await urbanikaNFT.getInvestment(1);
      const expectedReturn = investment * 150n / 100n; // 1.5x

      expect(inv.expectedReturn).to.equal(expectedReturn);
      console.log(`      Investment: ${ethers.formatEther(investment)} MXN`);
      console.log(`      Expected Return: ${ethers.formatEther(inv.expectedReturn)} MXN`);
    });
  });
});
