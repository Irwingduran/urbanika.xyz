// Crypto payment integration for NFT purchases

export type CryptoPaymentParams = {
  amount: number; // Amount in MXN
  email: string;
  walletAddress?: string;
  nftMetadata: {
    investmentAmount: number;
    expectedReturn: number;
    timestamp: string;
  };
};

export type CryptoPaymentResult = {
  success: boolean;
  paymentAddress?: string;
  amountCrypto?: number;
  currency?: string;
  qrCodeUrl?: string;
  paymentId?: string;
  error?: string;
};

/**
 * Supported cryptocurrencies
 * Los NFTs se mintean en Scroll Sepolia, así que el pago debe ser en la red Scroll
 */
export const SUPPORTED_CRYPTOS = {
  ETH: { symbol: "ETH", name: "Ethereum", network: "Scroll Sepolia" },
  USDC: { symbol: "USDC", name: "USD Coin", network: "Scroll Sepolia" },
  USDT: { symbol: "USDT", name: "Tether", network: "Scroll Sepolia" },
} as const;

export type SupportedCrypto = keyof typeof SUPPORTED_CRYPTOS;

/**
 * Creates a crypto payment request
 * @param params Payment parameters
 * @param crypto Selected cryptocurrency
 * @returns Payment details including address and amount
 */
export async function createCryptoPayment(
  params: CryptoPaymentParams,
  crypto: SupportedCrypto = "USDC"
): Promise<CryptoPaymentResult> {
  try {
    // TODO: Replace with actual payment processor API (e.g., Coinbase Commerce, NOWPayments)
    const response = await fetch("/api/payment/crypto/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amountMXN: params.amount,
        email: params.email,
        walletAddress: params.walletAddress,
        cryptocurrency: crypto,
        metadata: params.nftMetadata,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to create crypto payment");
    }

    return {
      success: true,
      paymentAddress: data.paymentAddress,
      amountCrypto: data.amountCrypto,
      currency: crypto,
      qrCodeUrl: data.qrCodeUrl,
      paymentId: data.paymentId,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Verifies a crypto payment was received
 * @param paymentId Payment ID to verify
 */
export async function verifyCryptoPayment(paymentId: string): Promise<{
  success: boolean;
  paid: boolean;
  txHash?: string;
  error?: string;
}> {
  try {
    const response = await fetch(`/api/payment/crypto/verify?paymentId=${paymentId}`);
    const data = await response.json();

    return {
      success: true,
      paid: data.paid,
      txHash: data.txHash,
    };
  } catch (error) {
    return {
      success: false,
      paid: false,
      error: error instanceof Error ? error.message : "Verification failed",
    };
  }
}

/**
 * Converts MXN to crypto amount using current exchange rates
 */
export async function convertMXNToCrypto(
  amountMXN: number,
  crypto: SupportedCrypto
): Promise<number> {
  try {
    // TODO: Implement actual conversion using live rates
    const response = await fetch(`/api/payment/crypto/convert?amount=${amountMXN}&currency=${crypto}`);
    const data = await response.json();
    return data.amountCrypto;
  } catch {
    // Fallback approximate rates (should use live rates in production)
    const MXN_TO_USD = 0.055; // Approximate
    const amountUSD = amountMXN * MXN_TO_USD;

    switch (crypto) {
      case "USDC":
      case "USDT":
        return amountUSD;
      case "ETH":
        return amountUSD / 3000; // Approximate, use live rate
      case "MATIC":
        return amountUSD / 0.8; // Approximate, use live rate
      default:
        return amountUSD;
    }
  }
}
