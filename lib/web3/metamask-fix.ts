/**
 * Fix para errores comunes de MetaMask y conflictos con otras wallets
 *
 * Soluciona:
 * 1. "Could not establish connection. Receiving end does not exist"
 * 2. Conflictos con múltiples wallets (Coinbase Wallet, Brave Wallet, etc.)
 * 3. Provider injection issues
 */

// Polyfill para @react-native-async-storage/async-storage
if (typeof window !== 'undefined') {
  // Mock del async storage para browser
  (window as any).AsyncStorage = {
    getItem: () => Promise.resolve(null),
    setItem: () => Promise.resolve(),
    removeItem: () => Promise.resolve(),
    clear: () => Promise.resolve(),
    getAllKeys: () => Promise.resolve([]),
    multiGet: () => Promise.resolve([]),
    multiSet: () => Promise.resolve(),
    multiRemove: () => Promise.resolve(),
    multiMerge: () => Promise.resolve(),
  }

  // Fix para conflicto de múltiples wallets
  // Este código se ejecuta ANTES de que las wallets intenten inyectar su provider
  const originalDefineProperty = Object.defineProperty
  const ethereumProviders: any[] = []
  let hasInjectedProvider = false

  // Interceptar intentos de definir window.ethereum
  Object.defineProperty = function(obj: any, prop: string, descriptor: PropertyDescriptor) {
    if (obj === window && prop === 'ethereum' && descriptor.value) {
      // Guardar el provider pero no lanzar error
      if (!hasInjectedProvider) {
        ethereumProviders.push(descriptor.value)
        hasInjectedProvider = true

        // Usar el primer provider disponible (generalmente MetaMask)
        return originalDefineProperty.call(this, obj, prop, {
          value: descriptor.value,
          writable: true,
          configurable: true,
          enumerable: true
        })
      } else {
        // Si ya hay un provider, guardar el nuevo pero no sobrescribir
        ethereumProviders.push(descriptor.value)
        console.log('⚠️ Múltiples wallets detectadas. Usando la primera disponible.')
        return obj // No hacer nada, mantener el provider actual
      }
    }
    return originalDefineProperty.call(this, obj, prop, descriptor)
  }
}

// Suprimir warnings de MetaMask en desarrollo y producción
if (typeof window !== 'undefined') {
  const originalError = console.error
  const originalWarn = console.warn
  const originalLog = console.log

  // Capturar errores globales de MetaMask
  const originalOnError = window.onerror
  window.onerror = function(message, source, lineno, colno, error) {
    const msgStr = message?.toString() || ''
    if (
      msgStr.includes('MetaMask encountered an error') ||
      msgStr.includes('Cannot set property ethereum') ||
      msgStr.includes('which has only a getter') ||
      source?.includes('inpage.js')
    ) {
      return true // Suprimir error
    }

    if (originalOnError) {
      return originalOnError.call(window, message, source, lineno, colno, error)
    }
    return false
  }

  // Preserve debug logs (emojis)
  console.log = (...args) => {
    originalLog.apply(console, args)
  }

  console.error = (...args) => {
    const message = args[0]?.toString?.() || ''
    if (
      message.includes('Could not establish connection') ||
      message.includes('Receiving end does not exist') ||
      message.includes('setting the global Ethereum provider') ||
      message.includes('which has only a getter') ||
      message.includes('Cannot set property ethereum') ||
      message.includes('MetaMask encountered an error')
    ) {
      return // Ignorar estos errores
    }
    originalError.apply(console, args)
  }

  console.warn = (...args) => {
    const message = args[0]?.toString?.() || ''
    if (
      message.includes('MetaMask encountered an error') ||
      message.includes('setting the global Ethereum provider')
    ) {
      return // Ignorar estos warnings
    }
    originalWarn.apply(console, args)
  }
}

export const suppressMetaMaskErrors = () => {
  // Esta función se puede llamar en _app.tsx o layout.tsx
  console.log('✅ MetaMask error suppression enabled')
  console.log('✅ Multi-wallet conflict protection enabled')
}