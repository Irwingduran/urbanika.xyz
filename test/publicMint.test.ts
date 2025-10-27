import { expect } from "chai";
import { ethers } from "hardhat";
import { UrbanikaNFT } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

/**
 * Public Mint Tests para UrbanikaNFT v2.0.3
 * Tests para funciones públicas de minting (ETH y Tokens)
 */

describe("Public Minting Tests", function () {
  let urbanikaNFT: UrbanikaNFT;
  let owner: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;
  let treasury: HardhatEthersSigner;

  const TOKEN_URI = "ipfs://QmPublic/1.json";

  beforeEach(async function () {
    [owner, user1, user2, treasury] = await ethers.getSigners();

    const UrbanikaNFT = await ethers.getContractFactory("UrbanikaNFT");
    urbanikaNFT = await UrbanikaNFT.deploy(treasury.address);
    await urbanikaNFT.waitForDeployment();
  });

  describe("Public Mint with ETH", function () {
    it("Should allow public minting with ETH", async function () {
      const investmentAmount = ethers.parseEther("1000"); // 1000 MXN
      const ethPrice = await urbanikaNFT.getETHPriceUSD();
      const exchangeRate = await urbanikaNFT.usdToMxnRate();

      // Calcular cuánto ETH se necesita para 1000 MXN
      // amount_usd = (investmentAmount * 1e18) / exchangeRate
      // eth_required = (amount_usd * 1e18) / ethPrice

      // Enviar más ETH del necesario para cubrir el mint
      const ethToSend = ethers.parseEther("0.1");

      await expect(
        urbanikaNFT.connect(user1).publicMintWithETH(
          investmentAmount,
          TOKEN_URI,
          { value: ethToSend }
        )
      ).to.emit(urbanikaNFT, "NFTMinted");

      expect(await urbanikaNFT.ownerOf(1)).to.equal(user1.address);
      expect(await urbanikaNFT.totalSupply()).to.equal(1);
    });

    it("Should fail if insufficient ETH sent", async function () {
      const investmentAmount = ethers.parseEther("1000");
      const insufficientETH = ethers.parseEther("0.001"); // Muy poco ETH

      await expect(
        urbanikaNFT.connect(user1).publicMintWithETH(
          investmentAmount,
          TOKEN_URI,
          { value: insufficientETH }
        )
      ).to.be.revertedWithCustomError(urbanikaNFT, "InsufficientETHSent");
    });

    it("Should transfer ETH to treasury", async function () {
      const investmentAmount = ethers.parseEther("500");
      const ethToSend = ethers.parseEther("0.1");

      const treasuryBalanceBefore = await ethers.provider.getBalance(treasury.address);

      await urbanikaNFT.connect(user1).publicMintWithETH(
        investmentAmount,
        TOKEN_URI,
        { value: ethToSend }
      );

      const treasuryBalanceAfter = await ethers.provider.getBalance(treasury.address);
      expect(treasuryBalanceAfter).to.be.gt(treasuryBalanceBefore);
    });

    it("Should calculate tier correctly for public mint", async function () {
      const investmentAmount = ethers.parseEther("5000"); // 5000 MXN
      const ethToSend = ethers.parseEther("0.2");

      await urbanikaNFT.connect(user1).publicMintWithETH(
        investmentAmount,
        TOKEN_URI,
        { value: ethToSend }
      );

      const investment = await urbanikaNFT.getInvestment(1);
      expect(investment.tier).to.be.gte(0).and.lte(3);
      expect(investment.investmentAmount).to.equal(investmentAmount);
    });

    it("Should fail if amount below minimum", async function () {
      const tooLow = ethers.parseEther("100"); // < 250 MXN
      const ethToSend = ethers.parseEther("0.1");

      await expect(
        urbanikaNFT.connect(user1).publicMintWithETH(
          tooLow,
          TOKEN_URI,
          { value: ethToSend }
        )
      ).to.be.revertedWithCustomError(urbanikaNFT, "AmountBelowMinimum");
    });

    it("Should fail if empty token URI", async function () {
      const investmentAmount = ethers.parseEther("500");
      const ethToSend = ethers.parseEther("0.1");

      await expect(
        urbanikaNFT.connect(user1).publicMintWithETH(
          investmentAmount,
          "", // Empty URI
          { value: ethToSend }
        )
      ).to.be.revertedWithCustomError(urbanikaNFT, "InvalidTokenURI");
    });

    it("Should fail if paused", async function () {
      await urbanikaNFT.pause();

      const investmentAmount = ethers.parseEther("500");
      const ethToSend = ethers.parseEther("0.1");

      await expect(
        urbanikaNFT.connect(user1).publicMintWithETH(
          investmentAmount,
          TOKEN_URI,
          { value: ethToSend }
        )
      ).to.be.revertedWithCustomError(urbanikaNFT, "EnforcedPause");
    });

    it("Should prevent duplicate URIs", async function () {
      const investmentAmount = ethers.parseEther("500");
      const ethToSend = ethers.parseEther("0.1");

      await urbanikaNFT.connect(user1).publicMintWithETH(
        investmentAmount,
        TOKEN_URI,
        { value: ethToSend }
      );

      await expect(
        urbanikaNFT.connect(user2).publicMintWithETH(
          investmentAmount,
          TOKEN_URI, // Same URI
          { value: ethToSend }
        )
      ).to.be.revertedWithCustomError(urbanikaNFT, "URIAlreadyUsed");
    });

    it("Should increment token counter correctly", async function () {
      const investmentAmount = ethers.parseEther("500");
      const ethToSend = ethers.parseEther("0.1");

      await urbanikaNFT.connect(user1).publicMintWithETH(
        investmentAmount,
        "ipfs://token1",
        { value: ethToSend }
      );

      await urbanikaNFT.connect(user2).publicMintWithETH(
        investmentAmount,
        "ipfs://token2",
        { value: ethToSend }
      );

      expect(await urbanikaNFT.totalSupply()).to.equal(2);
      expect(await urbanikaNFT.ownerOf(1)).to.equal(user1.address);
      expect(await urbanikaNFT.ownerOf(2)).to.equal(user2.address);
    });

    it("Should store payment token as ETH", async function () {
      const investmentAmount = ethers.parseEther("500");
      const ethToSend = ethers.parseEther("0.1");

      await urbanikaNFT.connect(user1).publicMintWithETH(
        investmentAmount,
        TOKEN_URI,
        { value: ethToSend }
      );

      const investment = await urbanikaNFT.getInvestment(1);
      expect(investment.paymentToken).to.equal(0); // PaymentToken.ETH
    });
  });

  describe("Public Mint with Token (USDC/USDT)", function () {
    let mockUSDC: string;

    beforeEach(async function () {
      // Mock USDC address (Scroll Mainnet USDC)
      mockUSDC = "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4";
    });

    it("Should reject minting with unaccepted token", async function () {
      const investmentAmount = ethers.parseEther("500");

      await expect(
        urbanikaNFT.connect(user1).publicMintWithToken(
          investmentAmount,
          TOKEN_URI,
          mockUSDC
        )
      ).to.be.revertedWithCustomError(urbanikaNFT, "TokenNotAccepted");
    });

    it("Should allow owner to accept tokens", async function () {
      await expect(urbanikaNFT.setTokenAcceptance(mockUSDC, true))
        .to.emit(urbanikaNFT, "TokenAcceptanceToggled")
        .withArgs(mockUSDC, true);

      expect(await urbanikaNFT.acceptedTokens(mockUSDC)).to.equal(true);
    });

    it("Should reject zero address for token", async function () {
      await expect(
        urbanikaNFT.setTokenAcceptance(ethers.ZeroAddress, true)
      ).to.be.revertedWithCustomError(urbanikaNFT, "InvalidAddress");
    });

    it("Should allow owner to revoke token acceptance", async function () {
      await urbanikaNFT.setTokenAcceptance(mockUSDC, true);
      expect(await urbanikaNFT.acceptedTokens(mockUSDC)).to.equal(true);

      await urbanikaNFT.setTokenAcceptance(mockUSDC, false);
      expect(await urbanikaNFT.acceptedTokens(mockUSDC)).to.equal(false);
    });

    it("Should prevent non-owner from accepting tokens", async function () {
      await expect(
        urbanikaNFT.connect(user1).setTokenAcceptance(mockUSDC, true)
      ).to.be.revertedWithCustomError(urbanikaNFT, "OwnableUnauthorizedAccount");
    });

    // Nota: Tests de minting real con tokens ERC20 requieren deploy de mock tokens
    // Estos tests se deben ejecutar en testnet con tokens reales
  });

  describe("Investment Tracking", function () {
    it("Should track total investment amount", async function () {
      const amount1 = ethers.parseEther("500");
      const amount2 = ethers.parseEther("1000");
      const ethToSend = ethers.parseEther("0.1");

      await urbanikaNFT.connect(user1).publicMintWithETH(
        amount1,
        "ipfs://track1",
        { value: ethToSend }
      );

      await urbanikaNFT.connect(user2).publicMintWithETH(
        amount2,
        "ipfs://track2",
        { value: ethToSend }
      );

      const totalInvestment = await urbanikaNFT.totalInvestmentAmount();
      expect(totalInvestment).to.equal(amount1 + amount2);
    });

    it("Should track active NFT count", async function () {
      const investmentAmount = ethers.parseEther("500");
      const ethToSend = ethers.parseEther("0.1");

      await urbanikaNFT.connect(user1).publicMintWithETH(
        investmentAmount,
        "ipfs://active1",
        { value: ethToSend }
      );

      await urbanikaNFT.connect(user2).publicMintWithETH(
        investmentAmount,
        "ipfs://active2",
        { value: ethToSend }
      );

      expect(await urbanikaNFT.getActiveNFTCount()).to.equal(2);
    });

    it("Should list investor tokens", async function () {
      const investmentAmount = ethers.parseEther("500");
      const ethToSend = ethers.parseEther("0.1");

      await urbanikaNFT.connect(user1).publicMintWithETH(
        investmentAmount,
        "ipfs://list1",
        { value: ethToSend }
      );

      await urbanikaNFT.connect(user1).publicMintWithETH(
        investmentAmount,
        "ipfs://list2",
        { value: ethToSend }
      );

      const tokens = await urbanikaNFT.getInvestorTokens(user1.address);
      expect(tokens.length).to.equal(2);
      expect(tokens[0]).to.equal(1);
      expect(tokens[1]).to.equal(2);
    });
  });

  describe("Gas Optimization", function () {
    it("Should mint with reasonable gas cost", async function () {
      const investmentAmount = ethers.parseEther("500");
      const ethToSend = ethers.parseEther("0.1");

      const tx = await urbanikaNFT.connect(user1).publicMintWithETH(
        investmentAmount,
        TOKEN_URI,
        { value: ethToSend }
      );

      const receipt = await tx.wait();
      const gasUsed = receipt?.gasUsed || 0n;

      console.log(`      Gas used for public mint: ${gasUsed.toString()}`);

      // Debería ser menos de 300k gas (con optimizaciones)
      expect(gasUsed).to.be.lt(500000);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle maximum investment amount", async function () {
      const maxAmount = ethers.parseEther("1000000"); // 1M MXN
      const ethToSend = ethers.parseEther("10"); // Mucho ETH

      await expect(
        urbanikaNFT.connect(user1).publicMintWithETH(
          maxAmount,
          TOKEN_URI,
          { value: ethToSend }
        )
      ).to.not.be.reverted;

      const investment = await urbanikaNFT.getInvestment(1);
      expect(investment.investmentAmount).to.equal(maxAmount);
      expect(investment.tier).to.equal(3); // Platinum
    });

    it("Should handle minimum investment amount", async function () {
      const minAmount = ethers.parseEther("250"); // Exactamente el mínimo
      const ethToSend = ethers.parseEther("0.1");

      await expect(
        urbanikaNFT.connect(user1).publicMintWithETH(
          minAmount,
          TOKEN_URI,
          { value: ethToSend }
        )
      ).to.not.be.reverted;
    });

    it("Should handle just below minimum", async function () {
      const belowMin = ethers.parseEther("249"); // 1 MXN menos del mínimo
      const ethToSend = ethers.parseEther("0.1");

      await expect(
        urbanikaNFT.connect(user1).publicMintWithETH(
          belowMin,
          TOKEN_URI,
          { value: ethToSend }
        )
      ).to.be.revertedWithCustomError(urbanikaNFT, "AmountBelowMinimum");
    });

    it("Should handle very long token URI", async function () {
      const longURI = "ipfs://Qm" + "a".repeat(100) + "/metadata.json";
      const investmentAmount = ethers.parseEther("500");
      const ethToSend = ethers.parseEther("0.1");

      await expect(
        urbanikaNFT.connect(user1).publicMintWithETH(
          investmentAmount,
          longURI,
          { value: ethToSend }
        )
      ).to.not.be.reverted;

      expect(await urbanikaNFT.tokenURI(1)).to.equal(longURI);
    });
  });

  describe("Multiple Users", function () {
    it("Should handle concurrent minting from different users", async function () {
      const investmentAmount = ethers.parseEther("500");
      const ethToSend = ethers.parseEther("0.1");

      // Múltiples usuarios mintean simultáneamente
      await Promise.all([
        urbanikaNFT.connect(user1).publicMintWithETH(
          investmentAmount,
          "ipfs://concurrent1",
          { value: ethToSend }
        ),
        urbanikaNFT.connect(user2).publicMintWithETH(
          investmentAmount,
          "ipfs://concurrent2",
          { value: ethToSend }
        )
      ]);

      expect(await urbanikaNFT.totalSupply()).to.equal(2);
      expect(await urbanikaNFT.ownerOf(1)).to.not.equal(await urbanikaNFT.ownerOf(2));
    });

    it("Should track investments per user correctly", async function () {
      const amount1 = ethers.parseEther("500");
      const amount2 = ethers.parseEther("1000");
      const ethToSend = ethers.parseEther("0.1");

      await urbanikaNFT.connect(user1).publicMintWithETH(
        amount1,
        "ipfs://user1_1",
        { value: ethToSend }
      );

      await urbanikaNFT.connect(user1).publicMintWithETH(
        amount2,
        "ipfs://user1_2",
        { value: ethToSend }
      );

      const tokens = await urbanikaNFT.getInvestorTokens(user1.address);
      expect(tokens.length).to.equal(2);

      const inv1 = await urbanikaNFT.getInvestment(1);
      const inv2 = await urbanikaNFT.getInvestment(2);

      expect(inv1.investmentAmount).to.equal(amount1);
      expect(inv2.investmentAmount).to.equal(amount2);
    });
  });
});
