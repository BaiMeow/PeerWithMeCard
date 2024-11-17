'use client'
 
import dynamic from 'next/dynamic'
import { Data } from '../App'
 
const App = dynamic(() => import('../App'), { ssr: false })
 
export function ClientOnly() {
  return <App />
}