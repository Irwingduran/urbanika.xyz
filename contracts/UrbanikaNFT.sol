// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title UrbanikaNFT - Production Ready Version
 * @dev NFT de inversión para Urbanika - Red Scroll
 * @notice Cada NFT representa una inversión en el ecosistema de casas regenerativas
 *
 * Características de Seguridad v2.0:
 * - ERC-721 estándar compatible con todas las wallets y marketplaces
 * - Sistema de retorno 1.5x basado en ventas de casas
 * - Tiers de inversión (Bronze, Silver, Gold, Platinum)
 * - Distribución de ganancias proporcional
 * - MAX_SUPPLY para evitar dilución
 * - Treasury con timelock para cambios
 * - Contador de NFTs activos optimizado
 * - Email hasheado para privacidad
 * - Pausa independiente de minting
 * - Metadata almacenado en IPFS
 */
contract UrbanikaNFT is
    ERC721,
    ERC721URIStorage,
    ERC721Enumerable,
    Ownable,
    Pausable,
    ReentrancyGuard
{
    // ============ State Variables ============

    uint256 private _tokenIdCounter;

    // Tiers de inversión
    enum InvestmentTier {
        Bronze,    // < 1000 MXN
        Silver,    // 1000 - 4999 MXN
        Gold,      // 5000 - 9999 MXN
        Platinum   // >= 10000 MXN
    }

    // Estructura de inversión (con emailHash en lugar de email)
    struct Investment {
        uint256 investmentAmount;      // Monto invertido (en wei equivalente MXN)
        uint256 expectedReturn;        // Retorno esperado (1.5x)
        uint256 currentReturn;         // Retorno acumulado recibido
        uint256 mintDate;              // Timestamp de creación
        InvestmentTier tier;           // Nivel de inversión
        bool isActive;                 // Estado del NFT
        address investor;              // Wallet del inversor
        bytes32 emailHash;             // Hash del email (para privacidad)
    }

    // Mappings
    mapping(uint256 => Investment) public investments;
    mapping(address => uint256[]) private _investorTokens;
    mapping(bytes32 => bool) private _usedURIs; // Prevenir URIs duplicados

    // Constants
    uint256 public constant RETURN_MULTIPLIER = 150; // 1.5x = 150%
    uint256 public constant MULTIPLIER_BASE = 100;
    uint256 public constant MAX_SUPPLY = 10000; // Límite máximo de NFTs

    // Minimums por tier (en MXN como wei - 1 MXN = 1e18 wei)
    uint256 public constant MIN_BRONZE = 250 * 1e18;
    uint256 public constant MIN_SILVER = 1000 * 1e18;
    uint256 public constant MIN_GOLD = 5000 * 1e18;
    uint256 public constant MIN_PLATINUM = 10000 * 1e18;

    // Total stats (optimizado)
    uint256 public totalInvestmentAmount;
    uint256 public totalDistributed;
    uint256 public activeNFTCount; // Contador optimizado en lugar de loop

    // Precio de mint público (en wei de ETH)
    uint256 public pricePerUnit = 0.0033 ether / 100; // ~$10 USD por 100 MXN

    // Treasury con timelock
    address payable public treasury;
    address payable public pendingTreasury;
    uint256 public treasuryChangeTimestamp;
    uint256 public constant TREASURY_TIMELOCK = 7 days;

    // Pausa independiente de minting
    bool public mintPaused = false;

    // ============ Events ============

    event NFTMinted(
        uint256 indexed tokenId,
        address indexed investor,
        uint256 investmentAmount,
        InvestmentTier tier,
        uint256 expectedReturn
    );

    event ReturnDistributed(
        uint256 indexed tokenId,
        uint256 amount,
        uint256 totalReceived
    );

    event InvestmentCompleted(
        uint256 indexed tokenId,
        address indexed investor,
        uint256 totalReturn
    );

    event MetadataUpdated(
        uint256 indexed tokenId,
        string newTokenURI
    );

    event TreasuryChangeProposed(
        address indexed oldTreasury,
        address indexed newTreasury,
        uint256 unlockTime
    );

    event TreasuryUpdated(
        address indexed oldTreasury,
        address indexed newTreasury
    );

    event PricePerUnitUpdated(
        uint256 oldPrice,
        uint256 newPrice
    );

    event MintPauseToggled(bool isPaused);

    // ============ Modifiers ============

    modifier whenMintNotPaused() {
        require(!mintPaused, "Minting is paused");
        _;
    }

    // ============ Constructor ============

    constructor(address payable _treasury)
        ERC721("Urbanika Investment NFT", "URBINV")
        Ownable(msg.sender)
    {
        require(_treasury != address(0), "Invalid treasury address");
        treasury = _treasury;
        _tokenIdCounter = 0;
        activeNFTCount = 0;
    }

    // ============ Public Functions ============

    /**
     * @dev Acuña un nuevo NFT de inversión (solo owner - para pagos off-chain)
     * @param to Dirección del inversor
     * @param investmentAmount Monto invertido (en wei MXN)
     * @param tokenURI URI del metadata en IPFS
     * @param investorEmail Email del inversor (se hasheará)
     * @return tokenId ID del NFT creado
     */
    function mint(
        address to,
        uint256 investmentAmount,
        string memory tokenURI,
        string memory investorEmail
    ) public onlyOwner whenNotPaused whenMintNotPaused returns (uint256) {
        require(to != address(0), "Invalid address");
        require(_tokenIdCounter < MAX_SUPPLY, "Max supply reached");
        require(investmentAmount >= MIN_BRONZE, "Amount below minimum");
        require(bytes(tokenURI).length > 0, "Invalid token URI");

        // Verificar URI único
        bytes32 uriHash = keccak256(bytes(tokenURI));
        require(!_usedURIs[uriHash], "URI already used");
        _usedURIs[uriHash] = true;

        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;

        // Calcular tier
        InvestmentTier tier = _calculateTier(investmentAmount);

        // Calcular retorno esperado (1.5x)
        uint256 expectedReturn = (investmentAmount * RETURN_MULTIPLIER) / MULTIPLIER_BASE;

        // Hash del email para privacidad
        bytes32 emailHash = keccak256(bytes(investorEmail));

        // Crear investment
        investments[tokenId] = Investment({
            investmentAmount: investmentAmount,
            expectedReturn: expectedReturn,
            currentReturn: 0,
            mintDate: block.timestamp,
            tier: tier,
            isActive: true,
            investor: to,
            emailHash: emailHash
        });

        // Actualizar stats
        totalInvestmentAmount += investmentAmount;
        activeNFTCount++;

        // Guardar relación inversor-token
        _investorTokens[to].push(tokenId);

        // Mint NFT
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);

        emit NFTMinted(tokenId, to, investmentAmount, tier, expectedReturn);

        return tokenId;
    }

    /**
     * @dev Distribuye retornos a un NFT específico
     * @param tokenId ID del NFT
     * @param amount Monto a distribuir
     */
    function distributeReturn(uint256 tokenId, uint256 amount)
        public
        onlyOwner
        nonReentrant
    {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");

        Investment storage investment = investments[tokenId];
        require(investment.isActive, "Investment not active");
        require(investment.currentReturn < investment.expectedReturn, "Investment already completed");

        // Calcular cuánto se puede distribuir
        uint256 remaining = investment.expectedReturn - investment.currentReturn;
        uint256 toDistribute = amount > remaining ? remaining : amount;

        investment.currentReturn += toDistribute;
        totalDistributed += toDistribute;

        emit ReturnDistributed(tokenId, toDistribute, investment.currentReturn);

        // Si alcanzó el objetivo, marcar como completado
        if (investment.currentReturn >= investment.expectedReturn) {
            investment.isActive = false;
            activeNFTCount--;
            emit InvestmentCompleted(tokenId, investment.investor, investment.currentReturn);
        }
    }

    /**
     * @dev Distribuye retornos a múltiples NFTs (batch)
     * @param tokenIds Array de IDs de NFTs
     * @param amounts Array de montos a distribuir
     */
    function batchDistributeReturn(
        uint256[] calldata tokenIds,
        uint256[] calldata amounts
    ) external onlyOwner {
        require(tokenIds.length == amounts.length, "Arrays length mismatch");

        for (uint256 i = 0; i < tokenIds.length; i++) {
            distributeReturn(tokenIds[i], amounts[i]);
        }
    }

    /**
     * @dev Actualiza el metadata URI de un NFT
     * @param tokenId ID del NFT
     * @param newTokenURI Nuevo URI del metadata
     */
    function updateTokenURI(uint256 tokenId, string memory newTokenURI)
        public
        onlyOwner
    {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");

        // Verificar que el nuevo URI no esté en uso
        bytes32 uriHash = keccak256(bytes(newTokenURI));
        require(!_usedURIs[uriHash], "URI already used");
        _usedURIs[uriHash] = true;

        _setTokenURI(tokenId, newTokenURI);
        emit MetadataUpdated(tokenId, newTokenURI);
    }

    // ============ View Functions ============

    /**
     * @dev Obtiene información completa de una inversión
     * @param tokenId ID del NFT
     * @return investment Estructura de Investment
     */
    function getInvestment(uint256 tokenId)
        public
        view
        returns (Investment memory)
    {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return investments[tokenId];
    }

    /**
     * @dev Obtiene el progreso de retorno de un NFT
     * @param tokenId ID del NFT
     * @return percentage Porcentaje de retorno recibido (0-100)
     */
    function getReturnProgress(uint256 tokenId)
        public
        view
        returns (uint256 percentage)
    {
        Investment memory investment = investments[tokenId];
        if (investment.expectedReturn == 0) return 0;
        return (investment.currentReturn * 100) / investment.expectedReturn;
    }

    /**
     * @dev Obtiene todos los NFTs de un inversor
     * @param investor Dirección del inversor
     * @return tokenIds Array de IDs de NFTs
     */
    function getInvestorTokens(address investor)
        public
        view
        returns (uint256[] memory)
    {
        return _investorTokens[investor];
    }

    /**
     * @dev Obtiene cuántos NFTs activos existen (optimizado)
     * @return count Cantidad de NFTs activos
     */
    function getActiveNFTCount() public view returns (uint256) {
        return activeNFTCount;
    }

    /**
     * @dev Verifica si un email está registrado (compara hashes)
     * @param email Email a verificar
     * @param tokenId Token ID a comparar
     * @return bool True si el hash coincide
     */
    function verifyEmail(string memory email, uint256 tokenId)
        public
        view
        returns (bool)
    {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return investments[tokenId].emailHash == keccak256(bytes(email));
    }

    /**
     * @dev Calcula el tier de inversión según el monto
     * @param amount Monto de inversión
     * @return tier Tier calculado
     */
    function _calculateTier(uint256 amount)
        internal
        pure
        returns (InvestmentTier)
    {
        if (amount >= MIN_PLATINUM) return InvestmentTier.Platinum;
        if (amount >= MIN_GOLD) return InvestmentTier.Gold;
        if (amount >= MIN_SILVER) return InvestmentTier.Silver;
        return InvestmentTier.Bronze;
    }

    // ============ Admin Functions ============

    /**
     * @dev Pausa todas las operaciones del contrato
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @dev Reanuda las operaciones del contrato
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Pausa/despausa solo el minting
     */
    function toggleMintPause() public onlyOwner {
        mintPaused = !mintPaused;
        emit MintPauseToggled(mintPaused);
    }

    /**
     * @dev Mintea NFT con pago directo en ETH (público)
     * @param investmentAmount Monto de inversión deseado (en wei MXN)
     * @param tokenURI URI del metadata en IPFS
     * @return tokenId ID del NFT creado
     */
    function publicMint(
        uint256 investmentAmount,
        string memory tokenURI
    ) public payable whenNotPaused whenMintNotPaused nonReentrant returns (uint256) {
        require(_tokenIdCounter < MAX_SUPPLY, "Max supply reached");
        require(investmentAmount >= MIN_BRONZE, "Amount below minimum");
        require(bytes(tokenURI).length > 0, "Invalid token URI");

        // Verificar URI único
        bytes32 uriHash = keccak256(bytes(tokenURI));
        require(!_usedURIs[uriHash], "URI already used");
        _usedURIs[uriHash] = true;

        // Calcular precio requerido en ETH
        uint256 requiredPayment = calculatePrice(investmentAmount);
        require(msg.value >= requiredPayment, "Insufficient payment");

        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;

        // Calcular tier
        InvestmentTier tier = _calculateTier(investmentAmount);

        // Calcular retorno esperado (1.5x)
        uint256 expectedReturn = (investmentAmount * RETURN_MULTIPLIER) / MULTIPLIER_BASE;

        // Crear investment (sin email en public mint)
        investments[tokenId] = Investment({
            investmentAmount: investmentAmount,
            expectedReturn: expectedReturn,
            currentReturn: 0,
            mintDate: block.timestamp,
            tier: tier,
            isActive: true,
            investor: msg.sender,
            emailHash: bytes32(0) // Sin email hash en public mint
        });

        // Actualizar stats
        totalInvestmentAmount += investmentAmount;
        activeNFTCount++;

        // Guardar relación inversor-token
        _investorTokens[msg.sender].push(tokenId);

        // Mint NFT
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);

        emit NFTMinted(tokenId, msg.sender, investmentAmount, tier, expectedReturn);

        // Enviar fondos a treasury (multisig)
        (bool sent, ) = treasury.call{value: requiredPayment}("");
        require(sent, "Failed to send ETH to treasury");

        // Devolver exceso de pago
        if (msg.value > requiredPayment) {
            (bool refunded, ) = payable(msg.sender).call{value: msg.value - requiredPayment}("");
            require(refunded, "Failed to refund excess");
        }

        return tokenId;
    }

    /**
     * @dev Calcula el precio en ETH para un monto de inversión
     * @param investmentAmount Monto de inversión en wei MXN
     * @return price Precio en wei ETH
     */
    function calculatePrice(uint256 investmentAmount) public view returns (uint256) {
        // investmentAmount está en wei (1 MXN = 1e18)
        // Convertir a unidades de 100 MXN
        uint256 units = investmentAmount / (100 * 1e18);
        return units * pricePerUnit;
    }

    /**
     * @dev Actualiza el precio por unidad (solo owner)
     * @param newPrice Nuevo precio en wei ETH por 100 MXN
     */
    function setPricePerUnit(uint256 newPrice) public onlyOwner {
        require(newPrice > 0, "Price must be greater than 0");
        uint256 oldPrice = pricePerUnit;
        pricePerUnit = newPrice;
        emit PricePerUnitUpdated(oldPrice, newPrice);
    }

    /**
     * @dev Propone cambio de treasury (paso 1 - con timelock)
     * @param newTreasury Nueva dirección del treasury
     */
    function proposeTreasuryChange(address payable newTreasury) public onlyOwner {
        require(newTreasury != address(0), "Invalid treasury address");
        require(newTreasury != treasury, "Same as current treasury");

        pendingTreasury = newTreasury;
        treasuryChangeTimestamp = block.timestamp + TREASURY_TIMELOCK;

        emit TreasuryChangeProposed(treasury, newTreasury, treasuryChangeTimestamp);
    }

    /**
     * @dev Ejecuta cambio de treasury (paso 2 - después del timelock)
     */
    function executeTreasuryChange() public onlyOwner {
        require(pendingTreasury != address(0), "No pending treasury change");
        require(block.timestamp >= treasuryChangeTimestamp, "Timelock not expired");

        address payable oldTreasury = treasury;
        treasury = pendingTreasury;
        pendingTreasury = payable(address(0));
        treasuryChangeTimestamp = 0;

        emit TreasuryUpdated(oldTreasury, treasury);
    }

    /**
     * @dev Cancela cambio de treasury pendiente
     */
    function cancelTreasuryChange() public onlyOwner {
        require(pendingTreasury != address(0), "No pending treasury change");

        pendingTreasury = payable(address(0));
        treasuryChangeTimestamp = 0;
    }

    /**
     * @dev Retira fondos del contrato (solo si hay balance residual)
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        (bool sent, ) = treasury.call{value: balance}("");
        require(sent, "Failed to send ETH");
    }

    /**
     * @dev Permite recibir ETH en el contrato
     */
    receive() external payable {}

    // ============ Required Overrides ============

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
