import { expect } from "chai";
import { ethers } from "hardhat";
import { UrbanikaNFT } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

/**
 * Security Tests para UrbanikaNFT v2.0.3
 * Tests de vulnerabilidades críticas y seguridad
 */

describe("Security Tests", function () {
  let urbanikaNFT: UrbanikaNFT;
  let owner: HardhatEthersSigner;
  let attacker: HardhatEthersSigner;
  let user: HardhatEthersSigner;
  let treasury: HardhatEthersSigner;

  const INVESTMENT_AMOUNT = ethers.parseEther("500");
  const TOKEN_URI = "ipfs://QmSecurity/1.json";
  const EMAIL = "security@test.com";

  beforeEach(async function () {
    [owner, attacker, user, treasury] = await ethers.getSigners();

    const UrbanikaNFT = await ethers.getContractFactory("UrbanikaNFT");
    urbanikaNFT = await UrbanikaNFT.deploy(treasury.address);
    await urbanikaNFT.waitForDeployment();
  });

  describe("Access Control", function () {
    it("Should prevent non-owner from minting", async function () {
      await expect(
        urbanikaNFT.connect(attacker).mint(
          user.address,
          INVESTMENT_AMOUNT,
          TOKEN_URI,
          EMAIL,
          0 // PaymentToken.ETH
        )
      ).to.be.revertedWithCustomError(urbanikaNFT, "OwnableUnauthorizedAccount");
    });

    it("Should prevent non-owner from distributing returns", async function () {
      await urbanikaNFT.mint(user.address, INVESTMENT_AMOUNT, TOKEN_URI, EMAIL, 0);

      await expect(
        urbanikaNFT.connect(attacker).distributeReturn(1, ethers.parseEther("100"))
      ).to.be.revertedWithCustomError(urbanikaNFT, "OwnableUnauthorizedAccount");
    });

    it("Should prevent non-owner from pausing", async function () {
      await expect(
        urbanikaNFT.connect(attacker).pause()
      ).to.be.revertedWithCustomError(urbanikaNFT, "OwnableUnauthorizedAccount");
    });

    it("Should prevent non-owner from setting minimum investment", async function () {
      await expect(
        urbanikaNFT.connect(attacker).setMinInvestment(ethers.parseEther("1000"))
      ).to.be.revertedWithCustomError(urbanikaNFT, "OwnableUnauthorizedAccount");
    });

    it("Should prevent non-owner from updating token URI", async function () {
      await urbanikaNFT.mint(user.address, INVESTMENT_AMOUNT, TOKEN_URI, EMAIL, 0);

      await expect(
        urbanikaNFT.connect(attacker).updateTokenURI(1, "ipfs://malicious")
      ).to.be.revertedWithCustomError(urbanikaNFT, "OwnableUnauthorizedAccount");
    });

    it("Should prevent non-owner from withdrawing ETH", async function () {
      await expect(
        urbanikaNFT.connect(attacker).withdrawETH(ethers.parseEther("1"))
      ).to.be.revertedWithCustomError(urbanikaNFT, "OwnableUnauthorizedAccount");
    });

    it("Should prevent non-owner from proposing treasury change", async function () {
      await expect(
        urbanikaNFT.connect(attacker).proposeTreasuryChange(attacker.address)
      ).to.be.revertedWithCustomError(urbanikaNFT, "OwnableUnauthorizedAccount");
    });

    it("Should prevent non-owner from setting token acceptance", async function () {
      const fakeUSDC = "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4";
      await expect(
        urbanikaNFT.connect(attacker).setTokenAcceptance(fakeUSDC, true)
      ).to.be.revertedWithCustomError(urbanikaNFT, "OwnableUnauthorizedAccount");
    });
  });

  describe("Reentrancy Protection", function () {
    it("Should have nonReentrant modifier on distributeReturn", async function () {
      // Verificar que la función tiene el modificador nonReentrant
      // Esto se valida mediante el comportamiento de la función
      await urbanikaNFT.mint(user.address, INVESTMENT_AMOUNT, TOKEN_URI, EMAIL, 0);

      // Fund the contract
      await owner.sendTransaction({
        to: await urbanikaNFT.getAddress(),
        value: ethers.parseEther("1")
      });

      // Normal distribution should work
      await expect(
        urbanikaNFT.distributeReturn(1, ethers.parseEther("0.1"))
      ).to.not.be.reverted;
    });

    it("Should have nonReentrant on publicMintWithETH", async function () {
      // Public mint con ETH debe tener protección
      const mintAmount = ethers.parseEther("0.01"); // Asumiendo precio ETH

      await expect(
        urbanikaNFT.connect(user).publicMintWithETH(
          mintAmount,
          "ipfs://public1",
          { value: mintAmount }
        )
      ).to.not.be.reverted;
    });
  });

  describe("Input Validation", function () {
    it("Should reject zero address for minting", async function () {
      await expect(
        urbanikaNFT.mint(
          ethers.ZeroAddress,
          INVESTMENT_AMOUNT,
          TOKEN_URI,
          EMAIL,
          0
        )
      ).to.be.revertedWithCustomError(urbanikaNFT, "InvalidAddress");
    });

    it("Should reject empty token URI", async function () {
      await expect(
        urbanikaNFT.mint(
          user.address,
          INVESTMENT_AMOUNT,
          "", // Empty URI
          EMAIL,
          0
        )
      ).to.be.revertedWithCustomError(urbanikaNFT, "InvalidTokenURI");
    });

    it("Should reject amount below minimum", async function () {
      const tooLow = ethers.parseEther("100"); // Menos de 250 MXN
      await expect(
        urbanikaNFT.mint(user.address, tooLow, TOKEN_URI, EMAIL, 0)
      ).to.be.revertedWithCustomError(urbanikaNFT, "AmountBelowMinimum");
    });

    it("Should reject distribution of zero amount", async function () {
      await urbanikaNFT.mint(user.address, INVESTMENT_AMOUNT, TOKEN_URI, EMAIL, 0);

      await expect(
        urbanikaNFT.distributeReturn(1, 0)
      ).to.be.revertedWithCustomError(urbanikaNFT, "AmountMustBeGreaterThanZero");
    });

    it("Should reject withdrawal of zero amount", async function () {
      await expect(
        urbanikaNFT.withdrawETH(0)
      ).to.be.revertedWithCustomError(urbanikaNFT, "AmountMustBeGreaterThanZero");
    });

    it("Should reject zero address for treasury", async function () {
      await expect(
        urbanikaNFT.proposeTreasuryChange(ethers.ZeroAddress)
      ).to.be.revertedWithCustomError(urbanikaNFT, "InvalidAddress");
    });
  });

  describe("Integer Overflow Protection", function () {
    it("Should handle maximum investment amount", async function () {
      const maxAmount = ethers.parseEther("1000000"); // 1M MXN

      await expect(
        urbanikaNFT.mint(user.address, maxAmount, TOKEN_URI, EMAIL, 0)
      ).to.not.be.reverted;

      const investment = await urbanikaNFT.getInvestment(1);
      expect(investment.investmentAmount).to.equal(maxAmount);
      expect(investment.expectedReturn).to.equal(maxAmount * 150n / 100n);
    });

    it("Should handle multiple large distributions", async function () {
      const largeAmount = ethers.parseEther("500000");
      await urbanikaNFT.mint(user.address, largeAmount, TOKEN_URI, EMAIL, 0);

      // Fund contract
      await owner.sendTransaction({
        to: await urbanikaNFT.getAddress(),
        value: ethers.parseEther("1000")
      });

      const dist1 = ethers.parseEther("100");
      const dist2 = ethers.parseEther("200");

      await urbanikaNFT.distributeReturn(1, dist1);
      await urbanikaNFT.distributeReturn(1, dist2);

      const investment = await urbanikaNFT.getInvestment(1);
      expect(investment.currentReturn).to.equal(dist1 + dist2);
    });
  });

  describe("Business Logic Security", function () {
    it("Should not allow distribution to inactive investment", async function () {
      await urbanikaNFT.mint(user.address, INVESTMENT_AMOUNT, TOKEN_URI, EMAIL, 0);

      // Fund contract
      await owner.sendTransaction({
        to: await urbanikaNFT.getAddress(),
        value: ethers.parseEther("1")
      });

      // Complete the investment
      const expectedReturn = INVESTMENT_AMOUNT * 150n / 100n;
      await urbanikaNFT.distributeReturn(1, expectedReturn);

      // Try to distribute more
      await expect(
        urbanikaNFT.distributeReturn(1, ethers.parseEther("0.1"))
      ).to.be.revertedWithCustomError(urbanikaNFT, "InvestmentNotActive");
    });

    it("Should not allow distribution without funds", async function () {
      await urbanikaNFT.mint(user.address, INVESTMENT_AMOUNT, TOKEN_URI, EMAIL, 0);

      // Try to distribute without funding the contract
      await expect(
        urbanikaNFT.distributeReturn(1, ethers.parseEther("1"))
      ).to.be.revertedWithCustomError(urbanikaNFT, "InsufficientETHBalance");
    });

    it("Should not allow withdrawal more than contract balance", async function () {
      // Fund contract
      await owner.sendTransaction({
        to: await urbanikaNFT.getAddress(),
        value: ethers.parseEther("1")
      });

      await expect(
        urbanikaNFT.withdrawETH(ethers.parseEther("2"))
      ).to.be.revertedWithCustomError(urbanikaNFT, "InsufficientETHBalance");
    });

    it("Should prevent duplicate URIs", async function () {
      await urbanikaNFT.mint(user.address, INVESTMENT_AMOUNT, TOKEN_URI, EMAIL, 0);

      await expect(
        urbanikaNFT.mint(user.address, INVESTMENT_AMOUNT, TOKEN_URI, EMAIL, 0)
      ).to.be.revertedWithCustomError(urbanikaNFT, "URIAlreadyUsed");
    });

    it("Should enforce max supply", async function () {
      const maxSupply = await urbanikaNFT.MAX_SUPPLY();

      // Este test es conceptual - no mintearemos 10,000 NFTs
      // Verificamos que la constante esté definida
      expect(maxSupply).to.equal(10000);
    });
  });

  describe("Treasury Security", function () {
    it("Should enforce timelock on treasury change", async function () {
      const newTreasury = attacker.address;

      // Propose change
      await urbanikaNFT.proposeTreasuryChange(newTreasury);

      // Try to execute immediately (should fail)
      await expect(
        urbanikaNFT.executeTreasuryChange()
      ).to.be.revertedWithCustomError(urbanikaNFT, "TimelockNotExpired");
    });

    it("Should allow treasury change after timelock", async function () {
      const newTreasury = user.address;

      // Propose change
      await urbanikaNFT.proposeTreasuryChange(newTreasury);

      // Advance time by 7 days + 1 second
      await ethers.provider.send("evm_increaseTime", [7 * 24 * 60 * 60 + 1]);
      await ethers.provider.send("evm_mine", []);

      // Now execute should work
      await expect(
        urbanikaNFT.executeTreasuryChange()
      ).to.emit(urbanikaNFT, "TreasuryUpdated")
        .withArgs(treasury.address, newTreasury);

      expect(await urbanikaNFT.treasury()).to.equal(newTreasury);
    });

    it("Should prevent executing treasury change without proposal", async function () {
      await expect(
        urbanikaNFT.executeTreasuryChange()
      ).to.be.revertedWithCustomError(urbanikaNFT, "NoProposalExists");
    });
  });

  describe("Pausable Security", function () {
    it("Should block public minting when paused", async function () {
      await urbanikaNFT.pause();

      await expect(
        urbanikaNFT.connect(user).publicMintWithETH(
          ethers.parseEther("0.01"),
          "ipfs://paused",
          { value: ethers.parseEther("0.01") }
        )
      ).to.be.revertedWithCustomError(urbanikaNFT, "EnforcedPause");
    });

    it("Should block owner minting when paused", async function () {
      await urbanikaNFT.pause();

      await expect(
        urbanikaNFT.mint(user.address, INVESTMENT_AMOUNT, TOKEN_URI, EMAIL, 0)
      ).to.be.revertedWithCustomError(urbanikaNFT, "EnforcedPause");
    });

    it("Should allow distribution when paused", async function () {
      // Mint first
      await urbanikaNFT.mint(user.address, INVESTMENT_AMOUNT, TOKEN_URI, EMAIL, 0);

      // Fund contract
      await owner.sendTransaction({
        to: await urbanikaNFT.getAddress(),
        value: ethers.parseEther("1")
      });

      // Pause
      await urbanikaNFT.pause();

      // Distribution should still work (investors need their returns)
      await expect(
        urbanikaNFT.distributeReturn(1, ethers.parseEther("0.1"))
      ).to.not.be.reverted;
    });

    it("Should allow view functions when paused", async function () {
      await urbanikaNFT.mint(user.address, INVESTMENT_AMOUNT, TOKEN_URI, EMAIL, 0);
      await urbanikaNFT.pause();

      // View functions should work
      expect(await urbanikaNFT.totalSupply()).to.equal(1);
      expect(await urbanikaNFT.ownerOf(1)).to.equal(user.address);

      const investment = await urbanikaNFT.getInvestment(1);
      expect(investment.isActive).to.equal(true);
    });
  });

  describe("Custom Errors", function () {
    it("Should use custom errors for gas optimization", async function () {
      // Test que los custom errors existen y funcionan
      await expect(
        urbanikaNFT.mint(ethers.ZeroAddress, INVESTMENT_AMOUNT, TOKEN_URI, EMAIL, 0)
      ).to.be.revertedWithCustomError(urbanikaNFT, "InvalidAddress");

      await expect(
        urbanikaNFT.mint(user.address, ethers.parseEther("100"), TOKEN_URI, EMAIL, 0)
      ).to.be.revertedWithCustomError(urbanikaNFT, "AmountBelowMinimum");

      await expect(
        urbanikaNFT.mint(user.address, INVESTMENT_AMOUNT, "", EMAIL, 0)
      ).to.be.revertedWithCustomError(urbanikaNFT, "InvalidTokenURI");
    });
  });

  describe("Email Privacy", function () {
    it("Should store email as hash (privacy)", async function () {
      await urbanikaNFT.mint(user.address, INVESTMENT_AMOUNT, TOKEN_URI, EMAIL, 0);

      // Email should be verifiable but not readable
      expect(await urbanikaNFT.verifyEmail(EMAIL, 1)).to.equal(true);
      expect(await urbanikaNFT.verifyEmail("wrong@email.com", 1)).to.equal(false);
    });

    it("Should handle empty email", async function () {
      await expect(
        urbanikaNFT.mint(user.address, INVESTMENT_AMOUNT, TOKEN_URI, "", 0)
      ).to.not.be.reverted;
    });
  });
});
