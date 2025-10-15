import { expect } from "chai";
import { ethers } from "hardhat";
import { UrbanikaNFT } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

/**
 * Tests para UrbanikaNFT
 * Ejecutar: npx hardhat test
 */

describe("UrbanikaNFT", function () {
  let urbanikaNFT: UrbanikaNFT;
  let owner: HardhatEthersSigner;
  let investor1: HardhatEthersSigner;
  let investor2: HardhatEthersSigner;
  let treasury: HardhatEthersSigner;

  const INVESTMENT_AMOUNT = ethers.parseEther("500"); // 500 MXN
  const TOKEN_URI = "ipfs://QmExample/1.json";
  const EMAIL = "investor@urbanika.xyz";

  beforeEach(async function () {
    // Get signers
    [owner, investor1, investor2, treasury] = await ethers.getSigners();

    // Deploy contract with treasury address
    const UrbanikaNFT = await ethers.getContractFactory("UrbanikaNFT");
    urbanikaNFT = await UrbanikaNFT.deploy(treasury.address);
    await urbanikaNFT.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      expect(await urbanikaNFT.name()).to.equal("Urbanika Investment NFT");
      expect(await urbanikaNFT.symbol()).to.equal("URBINV");
    });

    it("Should set the correct owner", async function () {
      expect(await urbanikaNFT.owner()).to.equal(owner.address);
    });

    it("Should start with token counter at 0", async function () {
      expect(await urbanikaNFT.totalSupply()).to.equal(0);
    });
  });

  describe("Minting", function () {
    it("Should mint NFT successfully", async function () {
      await expect(
        urbanikaNFT.mint(investor1.address, INVESTMENT_AMOUNT, TOKEN_URI, EMAIL)
      )
        .to.emit(urbanikaNFT, "NFTMinted")
        .withArgs(
          1, // tokenId
          investor1.address,
          INVESTMENT_AMOUNT,
          0, // Bronze tier
          INVESTMENT_AMOUNT * 150n / 100n // Expected return (1.5x)
        );

      expect(await urbanikaNFT.ownerOf(1)).to.equal(investor1.address);
      expect(await urbanikaNFT.totalSupply()).to.equal(1);
    });

    it("Should fail if amount is below minimum", async function () {
      const tooLow = ethers.parseEther("100"); // < 250 MXN
      await expect(
        urbanikaNFT.mint(investor1.address, tooLow, TOKEN_URI, EMAIL)
      ).to.be.revertedWith("Amount below minimum");
    });

    it("Should fail if not owner", async function () {
      await expect(
        urbanikaNFT.connect(investor1).mint(investor2.address, INVESTMENT_AMOUNT, TOKEN_URI, EMAIL)
      ).to.be.revertedWithCustomError(urbanikaNFT, "OwnableUnauthorizedAccount");
    });

    it("Should calculate correct tier", async function () {
      // Bronze (< 1000)
      await urbanikaNFT.mint(investor1.address, ethers.parseEther("500"), "ipfs://1", EMAIL);
      let investment = await urbanikaNFT.getInvestment(1);
      expect(investment.tier).to.equal(0); // Bronze

      // Silver (1000 - 4999)
      await urbanikaNFT.mint(investor1.address, ethers.parseEther("2000"), "ipfs://2", EMAIL);
      investment = await urbanikaNFT.getInvestment(2);
      expect(investment.tier).to.equal(1); // Silver

      // Gold (5000 - 9999)
      await urbanikaNFT.mint(investor1.address, ethers.parseEther("7000"), "ipfs://3", EMAIL);
      investment = await urbanikaNFT.getInvestment(3);
      expect(investment.tier).to.equal(2); // Gold

      // Platinum (>= 10000)
      await urbanikaNFT.mint(investor1.address, ethers.parseEther("15000"), "ipfs://4", EMAIL);
      investment = await urbanikaNFT.getInvestment(4);
      expect(investment.tier).to.equal(3); // Platinum
    });

    it("Should store correct investment data", async function () {
      await urbanikaNFT.mint(investor1.address, INVESTMENT_AMOUNT, TOKEN_URI, EMAIL);

      const investment = await urbanikaNFT.getInvestment(1);
      expect(investment.investmentAmount).to.equal(INVESTMENT_AMOUNT);
      expect(investment.expectedReturn).to.equal(INVESTMENT_AMOUNT * 150n / 100n);
      expect(investment.currentReturn).to.equal(0);
      expect(investment.isActive).to.equal(true);
      expect(investment.investor).to.equal(investor1.address);
      // Email ahora es hash - verificamos con verifyEmail
      expect(await urbanikaNFT.verifyEmail(EMAIL, 1)).to.equal(true);
    });

    it("Should increment token ID correctly", async function () {
      await urbanikaNFT.mint(investor1.address, INVESTMENT_AMOUNT, "ipfs://token1", EMAIL);
      await urbanikaNFT.mint(investor2.address, INVESTMENT_AMOUNT, "ipfs://token2", EMAIL);

      expect(await urbanikaNFT.totalSupply()).to.equal(2);
      expect(await urbanikaNFT.ownerOf(1)).to.equal(investor1.address);
      expect(await urbanikaNFT.ownerOf(2)).to.equal(investor2.address);
    });
  });

  describe("Return Distribution", function () {
    beforeEach(async function () {
      // Mint an NFT before each test
      await urbanikaNFT.mint(investor1.address, INVESTMENT_AMOUNT, TOKEN_URI, EMAIL);
    });

    it("Should distribute return successfully", async function () {
      const returnAmount = ethers.parseEther("100");

      await expect(urbanikaNFT.distributeReturn(1, returnAmount))
        .to.emit(urbanikaNFT, "ReturnDistributed")
        .withArgs(1, returnAmount, returnAmount);

      const investment = await urbanikaNFT.getInvestment(1);
      expect(investment.currentReturn).to.equal(returnAmount);
      expect(investment.isActive).to.equal(true);
    });

    it("Should complete investment when reaching expected return", async function () {
      const expectedReturn = INVESTMENT_AMOUNT * 150n / 100n; // 750 MXN

      await expect(urbanikaNFT.distributeReturn(1, expectedReturn))
        .to.emit(urbanikaNFT, "InvestmentCompleted")
        .withArgs(1, investor1.address, expectedReturn);

      const investment = await urbanikaNFT.getInvestment(1);
      expect(investment.currentReturn).to.equal(expectedReturn);
      expect(investment.isActive).to.equal(false);
    });

    it("Should not distribute more than expected return", async function () {
      const expectedReturn = INVESTMENT_AMOUNT * 150n / 100n;
      const tooMuch = expectedReturn + ethers.parseEther("100");

      await urbanikaNFT.distributeReturn(1, tooMuch);

      const investment = await urbanikaNFT.getInvestment(1);
      expect(investment.currentReturn).to.equal(expectedReturn); // Should cap at expected
      expect(investment.isActive).to.equal(false);
    });

    it("Should fail if not owner", async function () {
      await expect(
        urbanikaNFT.connect(investor1).distributeReturn(1, ethers.parseEther("100"))
      ).to.be.revertedWithCustomError(urbanikaNFT, "OwnableUnauthorizedAccount");
    });

    it("Should fail if token doesn't exist", async function () {
      await expect(
        urbanikaNFT.distributeReturn(999, ethers.parseEther("100"))
      ).to.be.revertedWith("Token does not exist");
    });

    it("Should fail if investment already completed", async function () {
      const expectedReturn = INVESTMENT_AMOUNT * 150n / 100n;
      await urbanikaNFT.distributeReturn(1, expectedReturn);

      await expect(
        urbanikaNFT.distributeReturn(1, ethers.parseEther("100"))
      ).to.be.revertedWith("Investment not active");
    });
  });

  describe("Batch Distribution", function () {
    beforeEach(async function () {
      // Mint multiple NFTs con URIs únicos
      await urbanikaNFT.mint(investor1.address, INVESTMENT_AMOUNT, "ipfs://batch1", EMAIL);
      await urbanikaNFT.mint(investor2.address, INVESTMENT_AMOUNT, "ipfs://batch2", EMAIL);
    });

    it("Should batch distribute successfully", async function () {
      const tokenIds = [1, 2];
      const amounts = [ethers.parseEther("50"), ethers.parseEther("100")];

      await urbanikaNFT.batchDistributeReturn(tokenIds, amounts);

      const investment1 = await urbanikaNFT.getInvestment(1);
      const investment2 = await urbanikaNFT.getInvestment(2);

      expect(investment1.currentReturn).to.equal(amounts[0]);
      expect(investment2.currentReturn).to.equal(amounts[1]);
    });

    it("Should fail if arrays length mismatch", async function () {
      const tokenIds = [1, 2];
      const amounts = [ethers.parseEther("50")];

      await expect(
        urbanikaNFT.batchDistributeReturn(tokenIds, amounts)
      ).to.be.revertedWith("Arrays length mismatch");
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      await urbanikaNFT.mint(investor1.address, INVESTMENT_AMOUNT, TOKEN_URI, EMAIL);
    });

    it("Should get return progress correctly", async function () {
      const returnAmount = ethers.parseEther("375"); // 50% of 750
      await urbanikaNFT.distributeReturn(1, returnAmount);

      const progress = await urbanikaNFT.getReturnProgress(1);
      expect(progress).to.equal(50); // 50%
    });

    it("Should get investor tokens", async function () {
      await urbanikaNFT.mint(investor1.address, INVESTMENT_AMOUNT, "ipfs://view2", EMAIL);

      const tokens = await urbanikaNFT.getInvestorTokens(investor1.address);
      expect(tokens.length).to.equal(2);
      expect(tokens[0]).to.equal(1);
      expect(tokens[1]).to.equal(2);
    });

    it("Should count active NFTs correctly", async function () {
      await urbanikaNFT.mint(investor2.address, INVESTMENT_AMOUNT, "ipfs://view3", EMAIL);

      let activeCount = await urbanikaNFT.getActiveNFTCount();
      expect(activeCount).to.equal(2);

      // Complete one investment
      const expectedReturn = INVESTMENT_AMOUNT * 150n / 100n;
      await urbanikaNFT.distributeReturn(1, expectedReturn);

      activeCount = await urbanikaNFT.getActiveNFTCount();
      expect(activeCount).to.equal(1);
    });
  });

  describe("Token URI", function () {
    it("Should update token URI successfully", async function () {
      await urbanikaNFT.mint(investor1.address, INVESTMENT_AMOUNT, TOKEN_URI, EMAIL);

      const newURI = "ipfs://QmNewHash/1.json";
      await expect(urbanikaNFT.updateTokenURI(1, newURI))
        .to.emit(urbanikaNFT, "MetadataUpdated")
        .withArgs(1, newURI);

      expect(await urbanikaNFT.tokenURI(1)).to.equal(newURI);
    });

    it("Should fail to update if not owner", async function () {
      await urbanikaNFT.mint(investor1.address, INVESTMENT_AMOUNT, TOKEN_URI, EMAIL);

      await expect(
        urbanikaNFT.connect(investor1).updateTokenURI(1, "ipfs://new")
      ).to.be.revertedWithCustomError(urbanikaNFT, "OwnableUnauthorizedAccount");
    });
  });

  describe("Pausable", function () {
    it("Should pause and unpause", async function () {
      await urbanikaNFT.pause();

      await expect(
        urbanikaNFT.mint(investor1.address, INVESTMENT_AMOUNT, TOKEN_URI, EMAIL)
      ).to.be.revertedWithCustomError(urbanikaNFT, "EnforcedPause");

      await urbanikaNFT.unpause();

      await expect(
        urbanikaNFT.mint(investor1.address, INVESTMENT_AMOUNT, TOKEN_URI, EMAIL)
      ).to.not.be.reverted;
    });
  });

  describe("Stats", function () {
    it("Should track total investment and distributions", async function () {
      await urbanikaNFT.mint(investor1.address, INVESTMENT_AMOUNT, "ipfs://stats1", EMAIL);
      await urbanikaNFT.mint(investor2.address, INVESTMENT_AMOUNT, "ipfs://stats2", EMAIL);

      expect(await urbanikaNFT.totalInvestmentAmount()).to.equal(INVESTMENT_AMOUNT * 2n);

      const returnAmount = ethers.parseEther("100");
      await urbanikaNFT.distributeReturn(1, returnAmount);

      expect(await urbanikaNFT.totalDistributed()).to.equal(returnAmount);
    });
  });
});
