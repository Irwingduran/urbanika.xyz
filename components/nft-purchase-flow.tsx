"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  CreditCard,
  Wallet,
  Mail,
  User,
  Phone,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Info,
} from "lucide-react"
import { captureEmail, saveLeadToLocalStorage, isValidEmail } from "@/lib/email-capture"
import { createStripeCheckout } from "@/lib/payment/stripe"
import { SUPPORTED_CRYPTOS, type SupportedCrypto } from "@/lib/payment/crypto"
import { useMintNFT, useCalculatePrice, useCalculatePriceInToken } from "@/hooks/web3/useMintNFT"
import { useAccount, useConnect, useChainId } from "wagmi"
import { scroll, scrollSepolia } from "wagmi/chains"
import { formatEther, formatUnits } from "viem"
import { TOKENS, type SupportedToken, getTokenMetadata } from "@/lib/web3/tokens"
import { useERC20Token } from "@/hooks/web3/useERC20"
import { useETHPrice, useInvestmentTiers } from "@/hooks/web3/useETHPrice"
import { useUSDtoMXN } from "@/hooks/useUSDtoMXN"
import { getContractAddress } from "@/lib/web3/config"
import { NetworkChecker } from "@/components/network-checker"
import { NetworkSwitchButton } from "@/components/network-switch-button"
import { TransactionStatus } from "@/components/transaction-status"
import { parseWeb3Error, logWeb3Error } from "@/lib/web3/errors"
import { parseTransactionError, getTroubleshootingSteps } from "@/lib/web3/transaction-errors"
import {
  trackInvestmentStarted,
  trackInvestmentAmount,
  trackContactInfoSubmitted,
  trackPaymentMethodSelected,
  trackNFTMintInitiated,
  trackNFTMintSuccess,
  trackNFTMintFailed,
} from "@/lib/analytics"

type FlowStep = "amount" | "info" | "payment-method" | "stripe" | "crypto" | "processing" | "success" | "error"

type PurchaseFlowProps = {
  onClose: () => void
  initialAmount?: number
}

export default function NFTPurchaseFlow({ onClose, initialAmount = 500 }: PurchaseFlowProps) {
  // Flow state - debe declararse ANTES de los hooks de Web3
  const [step, setStep] = useState<FlowStep>("amount")
  const [investmentAmount, setInvestmentAmount] = useState(initialAmount)

  // Payment state - debe declararse ANTES de usar en hooks
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "crypto" | null>(null)
  const [selectedCrypto, setSelectedCrypto] = useState<SupportedCrypto>("USDC")
  const [selectedToken, setSelectedToken] = useState<SupportedToken>('USDC')
  const [needsApproval, setNeedsApproval] = useState(false)

  // Track flow started
  useEffect(() => {
    trackInvestmentStarted()
  }, [])

  // Web3 hooks - usan investmentAmount y selectedToken declarados arriba
  const { address, isConnected, chain } = useAccount()
  const chainId = useChainId()

  // Get chain info from chainId (más confiable que chain.name)
  const currentChain = chainId === scroll.id ? scroll : chainId === scrollSepolia.id ? scrollSepolia : null
  const chainName = currentChain?.name || `Chain ID ${chainId || 'desconocido'}`
  const {
    mintNFT,
    mintNFTWithToken,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    isTransactionError,
    transactionError,
    transactionStatus,
    error: mintError
  } = useMintNFT(chainId)
  const { data: priceData, isError: isPriceError, error: priceError } = useCalculatePrice(investmentAmount, chainId)

  // Debug: Log price data (immediate, not in useEffect)
  if (typeof window !== 'undefined') {
    const debugData = {
      investmentAmount,
      chainId,
      priceData: priceData?.toString(),
      isPriceError,
      priceError: priceError?.message,
      contractAddress,
    }
    console.log('💰 Price Debug:', debugData)
    // @ts-ignore - Store in window for debugging
    window.URBANIKA_PRICE_DEBUG = debugData
  }

  // Oracle price hooks
  const { priceInUSD, getETHAmount, formattedPrice } = useETHPrice(chainId)
  const { getTierForAmount } = useInvestmentTiers()

  // USD to MXN exchange rate hook
  const { usdToMxn, isLoading: isLoadingExchangeRate, lastUpdate } = useUSDtoMXN()

  // Get contract address for ERC20 approvals
  const contractAddress = getContractAddress(chainId)

  // Token-specific metadata and address based on current chain
  const currentTokenMetadata = getTokenMetadata(selectedToken, chainId)
  const selectedTokenAddress = currentTokenMetadata.address || ''

  const { data: tokenPriceData, isError: isTokenPriceError, error: tokenPriceError } = useCalculatePriceInToken(
    investmentAmount,
    selectedTokenAddress,
    chainId
  )

  // Debug: Log token price data (immediate, not in useEffect)
  if (typeof window !== 'undefined' && selectedToken !== 'ETH') {
    const debugData = {
      selectedToken,
      selectedTokenAddress,
      investmentAmount,
      chainId,
      tokenPriceData: tokenPriceData?.toString(),
      isTokenPriceError,
      tokenPriceError: tokenPriceError?.message,
    }
    console.log('💵 Token Price Debug:', debugData)
    // @ts-ignore - Store in window for debugging
    window.URBANIKA_TOKEN_PRICE_DEBUG = debugData
  }

  // ERC20 token hook (for USDC/USDT)
  const {
    balance: tokenBalance,
    allowance: tokenAllowance,
    approve,
    isApproving,
    isConfirmingApproval,
    isApproveSuccess,
  } = useERC20Token(selectedTokenAddress, contractAddress)

  // User info
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [whatsapp, setWhatsapp] = useState("")

  // Status
  const [error, setError] = useState("")
  const [processing, setProcessing] = useState(false)
  const [leadId, setLeadId] = useState("")
  const [txHash, setTxHash] = useState<string>("")

  // Calculations
  const expectedReturn = investmentAmount * 1.5
  // Ahora trabajamos directamente en USD
  const amountUSD = investmentAmount // El monto ya está en USD

  // Conversión USD a MXN (usando tipo de cambio real de API)
  const amountMXN = investmentAmount * usdToMxn
  const expectedReturnMXN = expectedReturn * usdToMxn

  // Preset amounts in USD based on new tiers
  const presetAmounts = [10, 25, 50, 100, 250, 500, 1000]

  useEffect(() => {
    // Save progress to localStorage
    saveLeadToLocalStorage({
      email,
      name,
      investmentAmount,
      paymentMethod: paymentMethod || undefined,
      status: "interested",
      timestamp: new Date().toISOString(),
      metadata: { whatsapp },
    })
  }, [email, name, whatsapp, investmentAmount, paymentMethod])

  // Handle successful mint
  useEffect(() => {
    if (isSuccess && hash) {
      trackNFTMintSuccess(investmentAmount, hash, chainId)
      setTxHash(hash)
      setStep("success")
      setProcessing(false)

      // Actualizar lead en base de datos
      if (leadId && hash) {
        fetch('/api/leads/update-mint', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            leadId,
            mintTxHash: hash,
            tokenId: null, // Se puede obtener del evento del contrato si es necesario
          }),
        }).catch(() => {})
      }
    }
  }, [isSuccess, hash, isPending, isConfirming, isTransactionError, transactionStatus, investmentAmount, chainId, leadId, step])

  // Handle mint errors with better parsing
  useEffect(() => {
    if (mintError) {
      logWeb3Error(mintError, 'NFT Mint')
      const parsed = parseWeb3Error(mintError)
      trackNFTMintFailed(investmentAmount, parsed.type, parsed.message)
      setError(parsed.message)
      setStep("error")
      setProcessing(false)
    }
  }, [mintError, investmentAmount])

  // Handle transaction failures (when transaction is mined but reverted)
  useEffect(() => {
    if (isTransactionError && hash) {
      const parsed = parseTransactionError(transactionError)
      const steps = getTroubleshootingSteps(parsed.type)

      let errorMessage = parsed.userMessage

      // Agregar link al explorer para que el usuario pueda ver la transacción
      if (hash) {
        errorMessage += `\n\nVer transacción: https://scrollscan.com/tx/${hash}`
      }

      // Agregar pasos de troubleshooting
      if (steps.length > 0) {
        errorMessage += '\n\nQué hacer:\n' + steps.map((step, i) => `${i + 1}. ${step}`).join('\n')
      }

      trackNFTMintFailed(investmentAmount, parsed.type, parsed.userMessage)
      setError(errorMessage)
      setStep("error")
      setProcessing(false)
    }
  }, [isTransactionError, hash, transactionError, transactionStatus, investmentAmount])

  const validateAmount = () => {
    if (investmentAmount < 10) {
      setError("El monto mínimo de inversión es $10 USD")
      return false
    }
    setError("")
    return true
  }

  const validateInfo = () => {
    if (!name.trim()) {
      setError("Por favor ingresa tu nombre")
      return false
    }
    if (!isValidEmail(email)) {
      setError("Por favor ingresa un email válido")
      return false
    }
    if (!whatsapp.trim()) {
      setError("Por favor ingresa tu número de WhatsApp")
      return false
    }
    setError("")
    return true
  }

  const handleCaptureEmail = async () => {
    if (!validateInfo()) return

    trackContactInfoSubmitted(investmentAmount)
    setProcessing(true)
    const result = await captureEmail({
      email,
      name,
      investmentAmount,
      status: "interested",
      timestamp: new Date().toISOString(),
      metadata: { whatsapp },
    })

    if (result.success && result.leadId) {
      setLeadId(result.leadId)
      setStep("payment-method")
    } else {
      setError(result.error || "Error al capturar información")
    }
    setProcessing(false)
  }

  const handleStripePayment = async () => {
    setProcessing(true)
    setStep("processing")

    const result = await createStripeCheckout({
      amount: investmentAmount,
      email,
      name,
      nftMetadata: {
        investmentAmount,
        expectedReturn,
        timestamp: new Date().toISOString(),
      },
    })

    if (result.success && result.checkoutUrl) {
      // Redirect to Stripe checkout
      window.location.href = result.checkoutUrl
    } else {
      setError(result.error || "Error al crear sesión de pago")
      setStep("error")
    }
    setProcessing(false)
  }

  // Check if approval is needed for ERC20 tokens
  useEffect(() => {
    if (selectedToken !== 'ETH' && tokenPriceData && tokenAllowance !== undefined) {
      const needsApprovalCheck = tokenAllowance < tokenPriceData
      // //   tokenPriceData: tokenPriceData.toString(),
      //   needsApproval: needsApprovalCheck
      // })
      setNeedsApproval(needsApprovalCheck)
    } else {
      setNeedsApproval(false)
    }
  }, [selectedToken, tokenPriceData, tokenAllowance])

  // Handle ERC20 approval
  const handleApproveToken = async () => {
    if (!tokenPriceData) {
      setError("Error calculando el precio del token")
      return
    }

    try {
      const tokenDecimals = TOKENS[selectedToken].decimals
      const amountToApprove = formatUnits(tokenPriceData, tokenDecimals)

      await approve(amountToApprove, tokenDecimals)
    } catch (err: any) {
      logWeb3Error(err, 'Token Approval')
      const parsed = parseWeb3Error(err)
      setError(parsed.message)
    }
  }

  const handleCryptoPayment = async () => {
    // + '...',
    //   chainId: chain?.id,
    //   needsApproval
    // })

    // Verificar que la wallet esté conectada
    if (!isConnected || !address) {
      setError("Por favor conecta tu wallet primero")
      setStep("error")
      return
    }

    // Verificar que esté en la red correcta (Scroll Mainnet)
    if (chainId !== scroll.id) {
      setError(`Por favor cambia a Scroll Mainnet en tu wallet. Red actual: ${chainName}`)
      setStep("error")
      return
    }

    // Verificar precio según el token seleccionado
    const currentPrice = selectedToken === 'ETH' ? priceData : tokenPriceData

    console.log('🔍 Payment Debug:', {
      selectedToken,
      priceData: priceData?.toString(),
      tokenPriceData: tokenPriceData?.toString(),
      currentPrice: currentPrice?.toString(),
      isPriceError,
      isTokenPriceError,
    })

    if (!currentPrice) {
      const errorMsg = selectedToken === 'ETH'
        ? `Error calculando precio en ETH. ${priceError?.message || 'Precio no disponible'}`
        : `Error calculando precio en ${selectedToken}. ${tokenPriceError?.message || 'Precio no disponible'}`
      setError(errorMsg)
      setStep("error")
      return
    }

    // Para tokens ERC20, verificar que haya suficiente allowance
    if (selectedToken !== 'ETH' && needsApproval) {
      setError("Por favor aprueba el gasto del token primero")
      return
    }

    // trackNFTMintInitiated(investmentAmount, 'crypto')
    setProcessing(true)
    setStep("processing")
    setError("")

    try {
      // 1. Generar tokenID temporal para IPFS
      const tempTokenId = Date.now()

      // 2. Subir imagen + metadata a IPFS
      const ipfsResponse = await fetch('/api/ipfs/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenId: tempTokenId,
          investmentAmount,
          expectedReturn,
          investor: address,
          useDefaultImage: true,
        }),
      })

      const ipfsData = await ipfsResponse.json()

      if (!ipfsData.success || !ipfsData.tokenURI) {
        throw new Error(ipfsData.error || 'Error subiendo a IPFS')
      }

      // 3. Mintear NFT según el token seleccionado
      if (selectedToken === 'ETH') {
        // Pago en ETH (nativo)
        await mintNFT({
          investmentAmount,
          tokenURI: ipfsData.tokenURI,
          priceInWei: priceData!, // Usar precio en ETH
        })
      } else {
        // CRITICAL: Verificar balance y allowance ANTES de mintear
        const tokenDecimals = TOKENS[selectedToken].decimals
        const priceRequired = tokenPriceData!
        const balanceFormatted = tokenBalance ? formatUnits(tokenBalance, tokenDecimals) : '0'
        const allowanceFormatted = tokenAllowance ? formatUnits(tokenAllowance, tokenDecimals) : '0'
        const priceFormatted = formatUnits(priceRequired, tokenDecimals)

        const balanceNum = parseFloat(balanceFormatted)
        const allowanceNum = parseFloat(allowanceFormatted)
        const priceNum = parseFloat(priceFormatted)

        if (balanceNum < priceNum) {
          throw new Error(`Balance insuficiente. Necesitas ${priceFormatted} ${selectedToken} pero solo tienes ${balanceFormatted}`)
        }

        if (allowanceNum < priceNum) {
          throw new Error(`Allowance insuficiente. Por favor aprueba ${priceFormatted} ${selectedToken} o más.`)
        }

        // Pago en ERC20 (USDC/USDT)
        await mintNFTWithToken({
          investmentAmount,
          tokenURI: ipfsData.tokenURI,
          tokenAddress: selectedTokenAddress,
        })
      }

      // El éxito se maneja en el useEffect
    } catch (err: any) {
      logWeb3Error(err, 'Crypto Payment')
      const parsed = parseWeb3Error(err)
      setError(parsed.message)
      setStep("error")
      setProcessing(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case "amount":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-brand-dark mb-2">¿Cuánto quieres invertir?</h3>
              <p className="text-gray-600">Elige un monto o ingresa tu propia cantidad</p>
            </div>

            {/* Monto seleccionado en MXN (destacado) */}
            <Card className="bg-gradient-to-r from-brand-aqua/10 to-blue-50 border-brand-aqua/30">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Inversión aproximada</p>
                  {isLoadingExchangeRate ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin text-brand-aqua" />
                      <p className="text-lg text-gray-500">Obteniendo tipo de cambio...</p>
                    </div>
                  ) : (
                    <>
                      <p className="text-4xl font-bold text-brand-dark mb-2">
                        ${amountMXN.toLocaleString()} <span className="text-2xl">MXN</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        (${investmentAmount} USD)
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Tipo de cambio: ${usdToMxn.toFixed(2)} MXN/USD
                        {lastUpdate && (
                          <span className="ml-2">
                            • Actualizado: {lastUpdate.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </p>
                      {priceInUSD > 0 && (
                        <p className="text-xs text-brand-aqua mt-1">
                          Precio ETH: {formattedPrice} (Oracle de Chainlink)
                        </p>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Preset amounts en USD */}
            <div>
              <Label className="text-sm text-gray-600 mb-3 block">Montos rápidos (USD)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {presetAmounts.map((amount) => (
                  <Button
                    key={amount}
                    variant={investmentAmount === amount ? "default" : "outline"}
                    onClick={() => setInvestmentAmount(amount)}
                    className={`h-20 ${
                      investmentAmount === amount
                        ? "bg-brand-aqua text-white"
                        : "border-brand-aqua/30 hover:border-brand-aqua"
                    }`}
                    disabled={isLoadingExchangeRate}
                  >
                    <div className="text-center">
                      <div className="font-bold text-lg">${amount >= 1000 ? `${(amount / 1000).toFixed(1)}k` : amount}</div>
                      <div className="text-xs opacity-75">USD</div>
                      {!isLoadingExchangeRate && (
                        <div className="text-xs opacity-60 mt-1">≈ ${(amount * usdToMxn).toLocaleString()} MXN</div>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom amount */}
            <div className="space-y-2">
              <Label htmlFor="custom-amount">Monto personalizado (USD)</Label>
              <Input
                id="custom-amount"
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                min="10"
                step="5"
                className="text-lg font-semibold"
                disabled={isLoadingExchangeRate}
              />
              <p className="text-sm text-gray-500">
                Mínimo: $10 USD {!isLoadingExchangeRate && `(≈ $${(10 * usdToMxn).toFixed(0)} MXN)`}
              </p>
            </div>

            {/* Expected return */}
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Retorno esperado (1.5x)</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${expectedReturnMXN.toLocaleString()} MXN
                    </p>
                    <p className="text-sm text-gray-500">
                      (${expectedReturn.toFixed(2)} USD)
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-gray-500">
                        Tier: {getTierForAmount(investmentAmount).emoji} {getTierForAmount(investmentAmount).name}
                      </p>
                      {priceInUSD > 0 && (
                        <p className="text-xs text-gray-400">
                          ({getETHAmount(investmentAmount).toFixed(4)} ETH)
                        </p>
                      )}
                    </div>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button
              onClick={() => validateAmount() && setStep("info")}
              className="w-full h-12 bg-brand-aqua hover:bg-brand-aqua/90 text-white font-semibold"
            >
              Continuar
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )

      case "info":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-brand-dark mb-2">Información de contacto</h3>
              <p className="text-gray-600">Para enviarte tu NFT y mantenerte informado</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nombre completo
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Juan Pérez"
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="text-lg"
                />
                <p className="text-xs text-gray-500">Tu NFT será entregado a este email</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  WhatsApp
                </Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+52 123 456 7890"
                  className="text-lg"
                />
                <p className="text-xs text-gray-500">Para enviarte actualizaciones sobre tu inversión</p>
              </div>

              {/* Investment summary */}
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Inversión</span>
                    <span className="font-bold">${investmentAmount.toLocaleString()} MXM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Retorno esperado</span>
                    <span className="font-bold text-green-600">${expectedReturn.toLocaleString()} MXM</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("amount")} className="flex-1">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atrás
              </Button>
              <Button
                onClick={handleCaptureEmail}
                disabled={processing}
                className="flex-1 bg-brand-aqua hover:bg-brand-aqua/90 text-white font-semibold"
              >
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    Continuar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )

      case "payment-method":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-brand-dark mb-2">Elige tu método de pago</h3>
              <p className="text-gray-600">Paga con tarjeta o criptomonedas</p>
            </div>

            <div className="space-y-4">
              {/* Stripe option */}
              <Card
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  paymentMethod === "stripe"
                    ? "border-2 border-brand-aqua bg-brand-aqua/5"
                    : "border border-gray-200"
                }`}
                onClick={() => setPaymentMethod("stripe")}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <CreditCard className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg mb-1">Tarjeta de crédito/débito</h4>
                      <p className="text-sm text-gray-600 mb-2">Pago seguro con Stripe</p>
                      <div className="flex gap-2 text-xs text-gray-500">
                        <span>✓ Visa</span>
                        <span>✓ Mastercard</span>
                        <span>✓ AMEX</span>
                      </div>
                      <div className="mt-2 text-sm font-semibold text-brand-dark">
                        ${investmentAmount.toLocaleString()} MXM (≈ ${amountUSD.toFixed(2)} USD)
                      </div>
                    </div>
                    {paymentMethod === "stripe" && <CheckCircle className="h-6 w-6 text-brand-aqua" />}
                  </div>
                </CardContent>
              </Card>

              {/* Crypto option */}
              <Card
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  paymentMethod === "crypto"
                    ? "border-2 border-brand-yellow bg-brand-yellow/5"
                    : "border border-gray-200"
                }`}
                onClick={() => setPaymentMethod("crypto")}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Wallet className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg mb-1">Criptomonedas</h4>
                      <p className="text-sm text-gray-600 mb-2">Paga con ETH, USDC o USDT en Scroll Mainnet</p>
                      <div className="flex gap-2 text-xs text-gray-500">
                        <span>✓ ETH</span>
                        <span>✓ USDC</span>
                        <span>✓ USDT</span>
                      </div>
                      <div className="mt-2 text-sm font-semibold text-brand-dark">
                        ≈ ${amountUSD.toFixed(2)} USD en crypto
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        Red: Scroll Mainnet
                      </div>
                    </div>
                    {paymentMethod === "crypto" && <CheckCircle className="h-6 w-6 text-brand-yellow" />}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("info")} className="flex-1">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atrás
              </Button>
              <Button
                onClick={() => {
                  if (paymentMethod === "stripe") {
                    trackPaymentMethodSelected('stripe')
                    handleStripePayment()
                  } else if (paymentMethod === "crypto") {
                    trackPaymentMethodSelected('crypto')
                    setStep("crypto")
                  }
                }}
                disabled={!paymentMethod || processing}
                className="flex-1 bg-gradient-to-r from-brand-aqua to-brand-yellow text-white font-semibold"
              >
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    Proceder al pago
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 flex gap-3">
                <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="font-semibold mb-1">Información importante:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Tu NFT será acuñado después de confirmar el pago</li>
                    <li>• Podrás ver tu NFT en tu wallet inmediatamente</li>
                    <li>• El proceso puede tomar 5-10 minutos</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "crypto":
        // Calcular precio según el token seleccionado
        const currentPrice = selectedToken === 'ETH' ? priceData : tokenPriceData
        const currentDecimals = TOKENS[selectedToken].decimals
        const formattedPrice = currentPrice
          ? formatUnits(currentPrice, currentDecimals)
          : "Calculando..."

        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-brand-dark mb-2">Pago con criptomonedas</h3>
              <p className="text-gray-600">Elige tu moneda y conecta tu wallet</p>
            </div>

            {/* Token Selector */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Selecciona tu moneda de pago:</Label>
              <div className="grid grid-cols-3 gap-3">
                {(['ETH', 'USDC', 'USDT'] as SupportedToken[]).map((token) => {
                  const tokenInfo = TOKENS[token]
                  const isSelected = selectedToken === token
                  const isRecommended = token === 'USDC'

                  return (
                    <Card
                      key={token}
                      className={`cursor-pointer transition-all hover:shadow-md relative ${
                        isSelected
                          ? "border-2 border-brand-aqua bg-brand-aqua/5"
                          : "border border-gray-200 hover:border-brand-aqua/50"
                      }`}
                      onClick={() => setSelectedToken(token)}
                    >
                      {isRecommended && (
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                          Recomendado
                        </div>
                      )}
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl mb-2">{tokenInfo.logo}</div>
                        <div className="font-bold text-sm">{tokenInfo.symbol}</div>
                        <div className="text-xs text-gray-500 mt-1">{tokenInfo.name}</div>
                        {isSelected && <CheckCircle className="h-5 w-5 text-brand-aqua mx-auto mt-2" />}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Educational info about tokens */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-3">
                  <div className="flex gap-2 text-xs text-gray-700">
                    <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      {selectedToken === 'ETH' && (
                        <p><strong>ETH</strong> es la moneda nativa de Ethereum y Scroll. Ideal si ya tienes ETH en tu wallet.</p>
                      )}
                      {selectedToken === 'USDC' && (
                        <p><strong>USDC</strong> es una stablecoin (1 USDC = $1 USD). Recomendado por su estabilidad de precio.</p>
                      )}
                      {selectedToken === 'USDT' && (
                        <p><strong>USDT</strong> es otra stablecoin popular (1 USDT = $1 USD). Ampliamente aceptada en exchanges.</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Botón para cambiar de red */}
            <div className="flex justify-center">
              <NetworkSwitchButton size="lg" className="w-full max-w-md" />
            </div>

            {/* Network checker */}
            <NetworkChecker />

            {/* Transaction status */}
            <TransactionStatus
              hash={hash}
              onSuccess={() => {
                setTxHash(hash || "")
                setStep("success")
              }}
              onError={(error) => {
                logWeb3Error(error, 'Transaction Failed')
                const parsed = parseWeb3Error(error)
                setError(parsed.message)
                setStep("error")
              }}
            />

            {/* Wallet status */}
            {isConnected ? (
              <div className="space-y-3">
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div className="flex-1">
                        <p className="font-semibold text-green-900">Wallet conectada</p>
                        <p className="text-sm text-green-700">{address?.slice(0, 6)}...{address?.slice(-4)}</p>
                        <p className="text-xs text-green-600 mt-1">
                          Red: {chainName}
                        </p>
                      </div>
                    {selectedToken !== 'ETH' && tokenBalance !== undefined && (
                      <div className="text-right">
                        <p className="text-xs text-gray-600">Balance {selectedToken}:</p>
                        <p className="text-sm font-semibold text-green-900">
                          {formatUnits(tokenBalance, currentDecimals)} {selectedToken}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Botón adicional para cambiar de red si no está en Scroll Mainnet */}
              {chainId !== scroll.id && (
                <NetworkSwitchButton size="default" className="w-full" />
              )}
            </div>
            ) : (
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-4 flex gap-3">
                  <Info className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-900">
                    <p className="font-semibold mb-1">Wallet no conectada</p>
                    <p>Por favor conecta tu wallet (MetaMask, WalletConnect, etc.) en la barra superior para continuar.</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Network check */}
            {isConnected && chainId !== scroll.id && (
              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-4 flex gap-3">
                  <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-900">
                    <p className="font-semibold mb-1">Red incorrecta</p>
                    <p>Por favor cambia a <strong>Scroll Mainnet</strong> en tu wallet para continuar.</p>
                    <p className="text-xs mt-1">Red actual: {chainName}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ERC20 Approval Step */}
            {selectedToken !== 'ETH' && isConnected && chainId === scroll.id && needsApproval && (
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Info className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-yellow-900 mb-2">Paso 1: Aprobar gasto de {selectedToken}</p>
                      <p className="text-sm text-yellow-900 mb-3">
                        Para pagar con {selectedToken}, primero debes aprobar que el contrato pueda gastar tus tokens.
                        Esto es un proceso estándar de seguridad en blockchain.
                      </p>
                      <Button
                        onClick={handleApproveToken}
                        disabled={isApproving || isConfirmingApproval}
                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                      >
                        {isApproving || isConfirmingApproval ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {isApproving ? "Esperando confirmación..." : "Confirmando aprobación..."}
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Aprobar {formattedPrice} {selectedToken}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Info */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 flex gap-3">
                <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="font-semibold mb-1">Resumen de pago:</p>
                  <p>• Inversión: <strong>${investmentAmount.toLocaleString()} MXN</strong></p>
                  <p>• Precio a pagar: <strong>{formattedPrice} {selectedToken}</strong></p>
                  <p>• Red: <strong>Scroll Mainnet</strong></p>
                  <p className="text-xs mt-2 text-gray-600">
                    {selectedToken === 'ETH'
                      ? "Tu NFT será minteado instantáneamente después del pago."
                      : "Después de aprobar, podrás completar el pago y mintear tu NFT."
                    }
                  </p>
                </div>
              </CardContent>
            </Card>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("payment-method")} className="flex-1">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atrás
              </Button>
              <Button
                onClick={handleCryptoPayment}
                disabled={
                  !isConnected ||
                  chainId !== scroll.id ||
                  processing ||
                  isPending ||
                  isConfirming ||
                  (selectedToken !== 'ETH' && needsApproval)
                }
                className="flex-1 bg-brand-yellow hover:bg-brand-yellow/90 text-brand-dark font-semibold"
              >
                {isPending || isConfirming ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isPending ? "Esperando confirmación..." : "Minteando NFT..."}
                  </>
                ) : (
                  <>
                    <Wallet className="mr-2 h-4 w-4" />
                    {selectedToken === 'ETH' ? 'Pagar y Mintear NFT' : `Paso 2: Pagar y Mintear NFT`}
                  </>
                )}
              </Button>
            </div>
          </div>
        )

      case "processing":
        return (
          <div className="text-center py-12">
            <Loader2 className="h-16 w-16 animate-spin text-brand-aqua mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-brand-dark mb-2">Procesando tu pago...</h3>
            <p className="text-gray-600">Por favor espera un momento</p>
          </div>
        )

      case "success":
        return (
          <div className="text-center py-8">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-brand-dark mb-4">¡NFT Minteado Exitosamente!</h3>
            <p className="text-gray-600 mb-6">
              Tu NFT de inversión ha sido creado en la blockchain
            </p>

            {/* Transaction info */}
            {(txHash || hash) && (
              <Card className="bg-blue-50 border-blue-200 mb-6">
                <CardContent className="p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Hash de transacción:</p>
                  <div className="flex items-center gap-2 justify-center">
                    <code className="text-xs bg-white px-3 py-2 rounded border border-blue-200 font-mono">
                      {(txHash || hash)?.slice(0, 10)}...{(txHash || hash)?.slice(-8)}
                    </code>
                    <a
                      href={`https://scrollscan.com/tx/${txHash || hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-brand-aqua hover:underline"
                    >
                      Ver en Scrollscan ↗
                    </a>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 mb-6">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-sm text-gray-600">Inversión</p>
                    <p className="text-xl font-bold text-brand-dark">${investmentAmount.toLocaleString()} MXM</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Retorno esperado</p>
                    <p className="text-xl font-bold text-green-600">${expectedReturn.toLocaleString()} MXM</p>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-green-200">
                    <p className="text-sm text-gray-600">Wallet</p>
                    <p className="text-sm font-mono text-brand-dark">{address?.slice(0, 6)}...{address?.slice(-4)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-yellow-50 border-yellow-200 mb-6">
              <CardContent className="p-4 flex gap-3">
                <Info className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700 text-left">
                  <p className="font-semibold mb-1">Próximos pasos:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Tu NFT está ahora en tu wallet: {address?.slice(0, 6)}...{address?.slice(-4)}</li>
                    <li>• Puedes verlo en tu wallet de MetaMask o WalletConnect</li>
                    <li>• Recibirás actualizaciones sobre los retornos de tu inversión</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Button onClick={onClose} className="bg-brand-aqua hover:bg-brand-aqua/90 text-white">
              Volver al inicio
            </Button>
          </div>
        )

      case "error":
        // Detectar si es un error de "próximamente"
        const isComingSoon = error?.toLowerCase().includes('próximamente') || error?.toLowerCase().includes('proximamente')

        return (
          <div className="text-center py-8">
            {isComingSoon ? (
              <>
                <Info className="h-20 w-20 text-brand-yellow mx-auto mb-6" />
                <h3 className="text-3xl font-bold text-brand-dark mb-4">Próximamente</h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <Card className="bg-blue-50 border-blue-200 mb-6 mx-8">
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-700 mb-3">
                      <strong>Estamos trabajando en activar los pagos.</strong>
                    </p>
                    <p className="text-sm text-gray-600">
                      Mientras tanto, puedes contactarnos directamente para procesar tu inversión:
                    </p>
                    <p className="text-sm font-semibold text-brand-aqua mt-2">
                      contacto@urbanika.xyz
                    </p>
                  </CardContent>
                </Card>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={onClose}>
                    Cerrar
                  </Button>
                  <Button onClick={() => setStep("payment-method")} className="bg-brand-aqua text-white">
                    Elegir otro método
                  </Button>
                </div>
              </>
            ) : (
              <>
                <XCircle className="h-20 w-20 text-red-500 mx-auto mb-6" />
                <h3 className="text-3xl font-bold text-red-500 mb-4">Error en el proceso</h3>
                <p className="text-gray-600 mb-6">{error || "Ocurrió un error inesperado"}</p>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={onClose}>
                    Cerrar
                  </Button>
                  <Button onClick={() => setStep("payment-method")} className="bg-brand-aqua text-white">
                    Intentar de nuevo
                  </Button>
                </div>
              </>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <Card className="bg-white max-w-2xl w-full my-4 max-h-[calc(100vh-2rem)] flex flex-col">
        <CardContent className="p-8 overflow-y-auto flex-1">
          {/* Progress indicator */}
          {!["processing", "success", "error"].includes(step) && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm ${step === "amount" ? "text-brand-aqua font-semibold" : "text-gray-400"}`}>
                  Monto
                </span>
                <span className={`text-sm ${step === "info" ? "text-brand-aqua font-semibold" : "text-gray-400"}`}>
                  Información
                </span>
                <span
                  className={`text-sm ${["payment-method", "stripe", "crypto"].includes(step) ? "text-brand-aqua font-semibold" : "text-gray-400"}`}
                >
                  Pago
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-brand-aqua to-brand-yellow h-2 rounded-full transition-all duration-300"
                  style={{
                    width:
                      step === "amount"
                        ? "33%"
                        : step === "info"
                          ? "66%"
                          : ["payment-method", "stripe", "crypto"].includes(step)
                            ? "100%"
                            : "0%",
                  }}
                />
              </div>
            </div>
          )}

          {renderStep()}

          {/* Close button */}
          {!["processing"].includes(step) && (
            <Button
              variant="ghost"
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
