import { NextResponse } from 'next/server'
import { CONTRACT_ADDRESS, getContractAddress } from '@/lib/web3/config'

export async function GET() {
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    contract: {
      hardcoded: CONTRACT_ADDRESS,
      function: getContractAddress(),
      env_mainnet: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MAINNET,
      env_general: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    },
    expected: '0xC099aC09eE9bc5dFB6d24B932E2E01aE59593b88',
    env: process.env.NODE_ENV,
  })
}
