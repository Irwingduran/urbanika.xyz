'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { scroll } from 'wagmi/chains'
import { parseUnits, formatUnits, type Address } from 'viem'
import {
  ArrowLeft,
  Loader2,
  CheckCircle,
  XCircle,
  Wallet,
  CreditCard,
  Mail,
  User,
  Phone,
  Shield
} from 'lucide-react'

// Hooks
import { useUSDtoMXN } from '@/hooks/useUSDtoMXN'
import { useMintNFT } from '@/hooks/web3/useMintNFT'
import { useERC20Token } from '@/hooks/web3/useERC20'
import { useETHPrice } from '@/hooks/web3/useETHPrice'
import { getContractAddress } from '@/lib/web3/config'
import { TOKENS, type SupportedToken } from '@/lib/web3/tokens'
import { createStripeCheckout } from '@/lib/payment/stripe'

// Types
type FlowStep = 'amount' | 'contact' | 'payment-method' | 'crypto' | 'processing' | 'success' | 'error'

interface NFTPurchaseFlowProps {
  onClose: () => void
  initialAmount?: number
}

interface ContactFormData {
  name: string
  email: string
  whatsapp: string
}

// Constants
const MINIMUM_USD = 10
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^\+?[\d\s-()]{10,}$/

// Validation functions
const validateEmail = (email: string): boolean => EMAIL_REGEX.test(email)
const validatePhone = (phone: string): boolean => !phone || PHONE_REGEX.test(phone)
const validateName = (name: string): boolean => name.trim().length >= 2
const validateAmount = (amount: number): boolean => amount >= MINIMUM_USD

export default function NFTPurchaseFlow({ onClose, initialAmount = 250 }: NFTPurchaseFlowProps) {
  // ============ Estado del Flujo ============
  const [step, setStep] = useState<FlowStep>('amount')
  const [amountUSD, setAmountUSD] = useState(initialAmount)
  const [contactData, setContactData] = useState<ContactFormData>({
    name: '',
    email: '',
    whatsapp: ''
  })
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'crypto' | null>(null)
  const [selectedToken, setSelectedToken] = useState<SupportedToken>('USDC')
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)
  const [txHash, setTxHash] = useState('')
  const [leadId, setLeadId] = useState('')

  // ============ Hooks de Conversión ============
  const { usdToMxn, isLoading: isLoadingExchangeRate } = useUSDtoMXN()
  
  // Memoized calculations
  const amountMXN = useMemo(() => amountUSD * usdToMxn, [amountUSD, usdToMxn])
  const MINIMUM_MXN = useMemo(() => MINIMUM_USD * usdToMxn, [usdToMxn])

  // ============ Web3 Hooks ============
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const contractAddress = getContractAddress(chainId)

  const {
    mintNFT,
    mintNFTWithToken,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    isTransactionError,
    error: mintError
  } = useMintNFT(chainId)

  const { priceInUSD, getETHAmount } = useETHPrice(chainId)

  // ERC20 token hook para USDC/USDT
  const tokenAddress = selectedToken !== 'ETH' ? TOKENS[selectedToken]?.address : ''
  const {
    balance: tokenBalance,
    allowance: tokenAllowance,
    approve,
    isApproving,
  } = useERC20Token(tokenAddress as Address, contractAddress)

  // ============ Calcular cantidad de crypto a enviar ============
  const cryptoAmountToSend = useMemo(() => {
    try {
      if (selectedToken === 'ETH') {
        return getETHAmount(amountUSD)
      } else {
        const tokenConfig = TOKENS[selectedToken]
        if (!tokenConfig) {
          console.error(`Token configuration not found for: ${selectedToken}`)
          return 0
        }
        return parseUnits(amountUSD.toString(), tokenConfig.decimals)
      }
    } catch (error) {
      console.error('Error calculating crypto amount:', error)
      return 0
    }
  }, [selectedToken, amountUSD, getETHAmount])

  // ============ Validaciones ============
  const isValidAmount = validateAmount(amountUSD)
  const isValidEmail = validateEmail(contactData.email)
  const isValidPhone = validatePhone(contactData.whatsapp)
  const isValidName = validateName(contactData.name)
  const isValidContact = isValidName && isValidEmail && isValidPhone

  // Verificar si necesita approval para ERC20
  const needsApproval = useMemo(() => 
    selectedToken !== 'ETH' &&
    tokenAllowance !== undefined &&
    cryptoAmountToSend > 0 &&
    cryptoAmountToSend > tokenAllowance,
    [selectedToken, tokenAllowance, cryptoAmountToSend]
  )

  // ============ Handlers ============
  const updateContactData = useCallback((field: keyof ContactFormData, value: string) => {
    setContactData(prev => ({
      ...prev,
      [field]: value
    }))
  }, [])

  const handleNextStep = useCallback(async () => {
    setError('') // Clear previous errors

    try {
      if (step === 'amount') {
        if (!isValidAmount) {
          setError(`El monto mínimo es $${MINIMUM_USD} USD (~${MINIMUM_MXN.toFixed(0)} MXN)`)
          return
        }
        setStep('contact')
      } else if (step === 'contact') {
        if (!isValidContact) {
          const errors = []
          if (!isValidName) errors.push('nombre completo (mínimo 2 caracteres)')
          if (!isValidEmail) errors.push('correo electrónico válido')
          if (!isValidPhone) errors.push('número de WhatsApp válido (opcional)')
          setError(`Por favor completa: ${errors.join(', ')}`)
          return
        }
        
        await saveLeadToDatabase()
        setStep('payment-method')
      } else if (step === 'payment-method') {
        if (!paymentMethod) {
          setError('Selecciona un método de pago')
          return
        }
        if (paymentMethod === 'stripe') {
          await handleStripePayment()
        } else {
          setStep('crypto')
        }
      }
    } catch (err) {
      console.error('Error in handleNextStep:', err)
      setError('Ha ocurrido un error inesperado. Por favor intenta de nuevo.')
    }
  }, [step, isValidAmount, isValidContact, paymentMethod, amountUSD, MINIMUM_MXN, contactData])

  const saveLeadToDatabase = useCallback(async () => {
    try {
      const response = await fetch('/api/leads/capture', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          email: contactData.email,
          name: contactData.name,
          investmentAmount: amountUSD,
          status: 'interested',
          metadata: { 
            whatsapp: contactData.whatsapp,
            timestamp: new Date().toISOString()
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (data.id) {
        setLeadId(data.id)
      }
    } catch (err) {
      console.error('Error saving lead:', err)
      // No throw error here to not block user flow
    }
  }, [contactData, amountUSD])

  const handleStripePayment = useCallback(async () => {
    setProcessing(true)
    try {
      const { url, error: stripeError } = await createStripeCheckout({
        amount: amountUSD,
        customerEmail: contactData.email,
        customerName: contactData.name,
      })

      if (stripeError) throw new Error(stripeError)
      if (url) {
        // Safe redirect
        window.location.assign(url)
      }
    } catch (err: any) {
      console.error('Stripe payment error:', err)
      setError(err.message || 'Error al crear sesión de pago')
      setStep('error')
    } finally {
      setProcessing(false)
    }
  }, [amountUSD, contactData])

  const handleApproveToken = useCallback(async () => {
    if (!cryptoAmountToSend || cryptoAmountToSend === 0) return

    setProcessing(true)
    setError('')
    
    try {
      const tokenConfig = TOKENS[selectedToken]
      if (!tokenConfig) {
        throw new Error(`Configuración del token ${selectedToken} no encontrada`)
      }

      const amountFormatted = formatUnits(cryptoAmountToSend, tokenConfig.decimals)
      await approve(amountFormatted, tokenConfig.decimals)
    } catch (err: any) {
      console.error('Token approval error:', err)
      setError(err.message || 'Error al aprobar token')
    } finally {
      setProcessing(false)
    }
  }, [cryptoAmountToSend, selectedToken, approve])

  const handleCryptoPayment = useCallback(async () => {
    // Validaciones exhaustivas
    if (!isConnected || !address) {
      setError('Por favor conecta tu wallet')
      return
    }

    if (chainId !== scroll.id) {
      try {
        await switchChain({ chainId: scroll.id })
        // Esperar un momento para que la red cambie
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (err) {
        setError('Por favor cambia manualmente a Scroll Mainnet')
        return
      }
    }

    if (!cryptoAmountToSend || cryptoAmountToSend === 0) {
      setError('Error calculando cantidad de crypto. Por favor verifica el monto.')
      return
    }

    if (needsApproval) {
      setError('Por favor aprueba el gasto del token primero')
      return
    }

    setProcessing(true)
    setStep('processing')
    setError('')

    try {
      // 1. Subir metadata a IPFS
      const ipfsResponse = await fetch('/api/ipfs/upload', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          tokenId: Date.now(),
          investmentAmount: amountUSD,
          expectedReturn: amountUSD * 1.5,
          investor: address,
          useDefaultImage: true,
          timestamp: new Date().toISOString()
        }),
      })

      if (!ipfsResponse.ok) {
        throw new Error(`Error en upload IPFS: ${ipfsResponse.status}`)
      }

      const ipfsData = await ipfsResponse.json()
      if (!ipfsData.success || !ipfsData.tokenURI) {
        throw new Error('Error subiendo metadata a IPFS')
      }

      // 2. Mintear NFT
      if (selectedToken === 'ETH') {
        await mintNFT({
          tokenURI: ipfsData.tokenURI,
          ethAmount: cryptoAmountToSend,
        })
      } else {
        const tokenConfig = TOKENS[selectedToken]
        if (!tokenConfig) {
          throw new Error(`Token ${selectedToken} no soportado`)
        }

        await mintNFTWithToken({
          tokenAmount: cryptoAmountToSend,
          tokenURI: ipfsData.tokenURI,
          tokenAddress: tokenConfig.address,
        })
      }

    } catch (err: any) {
      console.error('Crypto payment error:', err)
      setError(err.message || 'Error en el proceso de pago')
      setStep('error')
      setProcessing(false)
    }
  }, [
    isConnected, 
    address, 
    chainId, 
    switchChain, 
    cryptoAmountToSend, 
    needsApproval, 
    amountUSD, 
    selectedToken, 
    mintNFT, 
    mintNFTWithToken
  ])

  // ============ Effects ============
  // Manejar éxito de transacción
  useEffect(() => {
    if (isSuccess && hash) {
      setTxHash(hash)
      setStep('success')
      setProcessing(false)

      // Actualizar lead con tx hash (no bloqueante)
      if (leadId) {
        fetch('/api/leads/update-mint', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: JSON.stringify({ 
            leadId, 
            mintTxHash: hash,
            status: 'completed'
          }),
        }).catch(console.error)
      }
    }
  }, [isSuccess, hash, leadId])

  // Manejar errores de mint
  useEffect(() => {
    if (mintError && step === 'processing') {
      console.error('Mint error:', mintError)
      setError(mintError.message || 'Error al mintear NFT')
      setStep('error')
      setProcessing(false)
    }
  }, [mintError, step])

  // Prevenir navegación accidental durante procesamiento
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (processing || step === 'processing') {
        e.preventDefault()
        e.returnValue = 'Tienes una transacción en proceso. ¿Estás seguro de que quieres salir?'
        return e.returnValue
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [processing, step])

  // ============ Render ============
  const renderStep = () => {
    switch (step) {
      case 'amount':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">¿Cuánto quieres invertir?</h3>
              <p className="text-gray-600">Inversión mínima: ${MINIMUM_USD} USD</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="investment-amount">Monto en USD</Label>
                <Input
                  id="investment-amount"
                  type="number"
                  value={amountUSD}
                  onChange={(e) => {
                    const value = Number(e.target.value)
                    if (!isNaN(value) && value >= 0) {
                      setAmountUSD(value)
                    }
                  }}
                  min={MINIMUM_USD}
                  step={10}
                  aria-describedby="amount-error"
                />
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>${amountUSD} USD</strong> ≈{' '}
                  <strong>
                    {isLoadingExchangeRate ? 'Calculando...' : `${amountMXN.toFixed(2)} MXN`}
                  </strong>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Retorno esperado: {(amountMXN * 1.5).toFixed(2)} MXN
                </p>
              </div>

              {error && (
                <p id="amount-error" className="text-red-600 text-sm" role="alert">
                  {error}
                </p>
              )}

              <Button 
                onClick={handleNextStep} 
                className="w-full"
                disabled={isLoadingExchangeRate}
              >
                {isLoadingExchangeRate ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Calculando...
                  </>
                ) : (
                  'Continuar'
                )}
              </Button>
            </div>
          </div>
        )

      case 'contact':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Tus datos de contacto</h3>
              <p className="text-gray-600">Para enviarte el recibo y actualizaciones</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="contact-name">Nombre completo</Label>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-400" />
                  <Input
                    id="contact-name"
                    value={contactData.name}
                    onChange={(e) => updateContactData('name', e.target.value)}
                    placeholder="Juan Pérez"
                    aria-invalid={!isValidName && contactData.name !== ''}
                  />
                </div>
                {!isValidName && contactData.name !== '' && (
                  <p className="text-red-500 text-xs mt-1">Mínimo 2 caracteres</p>
                )}
              </div>

              <div>
                <Label htmlFor="contact-email">Correo electrónico</Label>
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <Input
                    id="contact-email"
                    type="email"
                    value={contactData.email}
                    onChange={(e) => updateContactData('email', e.target.value)}
                    placeholder="tu@email.com"
                    aria-invalid={!isValidEmail && contactData.email !== ''}
                  />
                </div>
                {!isValidEmail && contactData.email !== '' && (
                  <p className="text-red-500 text-xs mt-1">Formato de email inválido</p>
                )}
              </div>

              <div>
                <Label htmlFor="contact-whatsapp">WhatsApp (opcional)</Label>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <Input
                    id="contact-whatsapp"
                    value={contactData.whatsapp}
                    onChange={(e) => updateContactData('whatsapp', e.target.value)}
                    placeholder="+52 123 456 7890"
                    aria-invalid={!isValidPhone && contactData.whatsapp !== ''}
                  />
                </div>
                {!isValidPhone && contactData.whatsapp !== '' && (
                  <p className="text-red-500 text-xs mt-1">Formato de teléfono inválido</p>
                )}
              </div>

              {error && (
                <p className="text-red-600 text-sm" role="alert">
                  {error}
                </p>
              )}

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep('amount')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Atrás
                </Button>
                <Button 
                  onClick={handleNextStep} 
                  className="flex-1"
                  disabled={!isValidContact}
                >
                  Continuar
                </Button>
              </div>
            </div>
          </div>
        )

      case 'payment-method':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Método de pago</h3>
              <p className="text-gray-600">Elige cómo quieres pagar</p>
            </div>

            <div className="space-y-4">
              <Card
                className={`cursor-pointer transition-all ${
                  paymentMethod === 'stripe' 
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-opacity-50' 
                    : 'hover:border-blue-300'
                }`}
                onClick={() => setPaymentMethod('stripe')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setPaymentMethod('stripe')
                  }
                }}
                aria-pressed={paymentMethod === 'stripe'}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <CreditCard className="w-6 h-6" />
                    <div>
                      <p className="font-semibold">Tarjeta de crédito/débito</p>
                      <p className="text-sm text-gray-600">Pago seguro con Stripe</p>
                    </div>
                  </div>
                  <Shield className="w-5 h-5 text-green-600" />
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-all ${
                  paymentMethod === 'crypto'
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-opacity-50'
                    : 'hover:border-blue-300'
                }`}
                onClick={() => setPaymentMethod('crypto')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setPaymentMethod('crypto')
                  }
                }}
                aria-pressed={paymentMethod === 'crypto'}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <Wallet className="w-6 h-6" />
                  <div>
                    <p className="font-semibold">Criptomonedas</p>
                    <p className="text-sm text-gray-600">ETH, USDC o USDT en Scroll</p>
                  </div>
                </CardContent>
              </Card>

              {error && (
                <p className="text-red-600 text-sm" role="alert">
                  {error}
                </p>
              )}

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep('contact')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Atrás
                </Button>
                <Button 
                  onClick={handleNextStep} 
                  className="flex-1" 
                  disabled={!paymentMethod || processing}
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    'Continuar'
                  )}
                </Button>
              </div>
            </div>
          </div>
        )

      case 'crypto':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Pago con criptomonedas</h3>
              <p className="text-gray-600">Conecta tu wallet y completa el pago</p>
            </div>

            <div className="space-y-4">
              {/* Token selector */}
              <div>
                <Label>Selecciona tu moneda</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(['ETH', 'USDC', 'USDT'] as SupportedToken[]).map((token) => (
                    <Button
                      key={token}
                      variant={selectedToken === token ? 'default' : 'outline'}
                      onClick={() => setSelectedToken(token)}
                      disabled={processing}
                    >
                      {token}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Mostrar cantidad a pagar */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Pagarás aproximadamente:</p>
                <p className="text-2xl font-bold">
                  {cryptoAmountToSend && cryptoAmountToSend > 0
                    ? formatUnits(cryptoAmountToSend, TOKENS[selectedToken]?.decimals || 18)
                    : '0'}{' '}
                  {selectedToken}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  ≈ ${amountUSD} USD
                </p>
              </div>

              {/* Estado de conexión */}
              {!isConnected ? (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">Conecta tu wallet para continuar</p>
                </div>
              ) : chainId !== scroll.id ? (
                <Button
                  onClick={() => switchChain({ chainId: scroll.id })}
                  variant="destructive"
                  className="w-full"
                  disabled={processing}
                >
                  Cambiar a Scroll Mainnet
                </Button>
              ) : needsApproval ? (
                <Button
                  onClick={handleApproveToken}
                  disabled={isApproving || processing}
                  className="w-full"
                >
                  {isApproving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Aprobando...
                    </>
                  ) : (
                    `Aprobar ${selectedToken}`
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleCryptoPayment}
                  disabled={processing || !cryptoAmountToSend || cryptoAmountToSend === 0}
                  className="w-full"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    'Pagar y Mintear NFT'
                  )}
                </Button>
              )}

              {error && (
                <p className="text-red-600 text-sm" role="alert">
                  {error}
                </p>
              )}

              <Button 
                variant="outline" 
                onClick={() => setStep('payment-method')} 
                className="w-full"
                disabled={processing}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Cambiar método de pago
              </Button>
            </div>
          </div>
        )

      case 'processing':
        return (
          <div className="text-center space-y-4 py-8">
            <Loader2 className="w-16 h-16 mx-auto animate-spin text-blue-600" />
            <h3 className="text-xl font-bold">Procesando tu inversión...</h3>
            <p className="text-gray-600">
              {isPending && 'Esperando confirmación de tu wallet...'}
              {isConfirming && 'Confirmando transacción en la blockchain...'}
              {!isPending && !isConfirming && 'Procesando tu solicitud...'}
            </p>
            <p className="text-xs text-gray-500">
              No cierres esta ventana hasta que se complete la transacción
            </p>
          </div>
        )

      case 'success':
        return (
          <div className="text-center space-y-4 py-8">
            <CheckCircle className="w-16 h-16 mx-auto text-green-600" />
            <h3 className="text-xl font-bold">¡Inversión exitosa!</h3>
            <p className="text-gray-600">
              Tu NFT ha sido minteado exitosamente
            </p>
            {txHash && (
              <a
                href={`https://scrollscan.com/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-blue-600 hover:underline text-sm inline-flex items-center gap-1"
              >
                Ver transacción en Scrollscan
              </a>
            )}
            <Button onClick={onClose} className="w-full">
              Cerrar
            </Button>
          </div>
        )

      case 'error':
        return (
          <div className="text-center space-y-4 py-8">
            <XCircle className="w-16 h-16 mx-auto text-red-600" />
            <h3 className="text-xl font-bold">Error en el proceso</h3>
            <p className="text-red-600 text-sm max-w-sm mx-auto" role="alert">
              {error}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cerrar
              </Button>
              <Button 
                onClick={() => {
                  setError('')
                  setStep('crypto')
                }} 
                className="flex-1"
              >
                Intentar de nuevo
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // Función helper para obtener el número del paso actual
  const getStepNumber = (): number => {
    const stepMap: Record<FlowStep, number> = {
      'amount': 1,
      'contact': 2,
      'payment-method': 3,
      'crypto': 4,
      'processing': 4,
      'success': 5,
      'error': 4
    }
    return stepMap[step] || 1
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-md w-full mx-auto my-8">
        <Card className="shadow-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <div className="text-sm text-gray-500">Paso {getStepNumber()}/5</div>
            </div>
            {renderStep()}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}