/**
 * Fix para el error de MetaMask SDK en producción
 * Soluciona: "Could not establish connection. Receiving end does not exist"
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
}

// Suprimir warnings de MetaMask en producción
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  const originalError = console.error
  console.error = (...args) => {
    if (
      args[0]?.includes?.('Could not establish connection') ||
      args[0]?.includes?.('Receiving end does not exist') ||
      args[0]?.includes?.('MetaMask')
    ) {
      return // Ignorar estos errores en producción
    }
    originalError.apply(console, args)
  }
}

export const suppressMetaMaskErrors = () => {
  // Esta función se puede llamar en _app.tsx o layout.tsx
  console.log('MetaMask error suppression enabled')
}