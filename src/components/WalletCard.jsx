import React, {useEffect, useState} from 'react'
import { ethers } from 'ethers'

export default function WalletCard(){
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState(null)
  const [balance, setBalance] = useState(null)
  const [network, setNetwork] = useState(null)

  async function connect(){
    if(!window.ethereum){
      alert('MetaMask not detected. Please install MetaMask.')
      return
    }
    try{
      const provider = new ethers.BrowserProvider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = await provider.getSigner()
      const addr = await signer.getAddress()
      setAddress(addr)
      setConnected(true)
      const bal = await provider.getBalance(addr)
      setBalance(ethers.formatEther(bal))
      const net = await provider.getNetwork()
      setNetwork(net.name + ' ('+ net.chainId +')')

      // listeners
      window.ethereum.on?.('accountsChanged', (accounts) => {
        if(accounts.length === 0){
          setConnected(false)
          setAddress(null)
          setBalance(null)
        } else {
          setAddress(accounts[0])
          provider.getBalance(accounts[0]).then(b => setBalance(ethers.formatEther(b)))
        }
      })
      window.ethereum.on?.('chainChanged', async () => {
        const n = await provider.getNetwork()
        setNetwork(n.name + ' ('+ n.chainId +')')
        if(address) provider.getBalance(address).then(b => setBalance(ethers.formatEther(b)))
      })

    }catch(err){
      console.error(err)
      alert('Connection failed: ' + (err?.message ?? err))
    }
  }

  async function refresh(){
    if(!address || !window.ethereum) return
    const provider = new ethers.BrowserProvider(window.ethereum)
    const bal = await provider.getBalance(address)
    setBalance(ethers.formatEther(bal))
  }

  useEffect(()=>{
    (async ()=>{
      if(!window.ethereum) return
      const provider = new ethers.BrowserProvider(window.ethereum)
      try{
        const accounts = await provider.send('eth_accounts', [])
        if(accounts?.length){
          const signer = await provider.getSigner()
          const addr = await signer.getAddress()
          setAddress(addr)
          setConnected(true)
          const bal = await provider.getBalance(addr)
          setBalance(ethers.formatEther(bal))
          const net = await provider.getNetwork()
          setNetwork(net.name + ' ('+ net.chainId +')')
        }
      }catch(e){}
    })()
  },[])

  return (
    <div>
      <div className="row" style={{marginBottom:12}}>
        <button onClick={connect}>{connected ? 'Connected' : 'Connect Wallet'}</button>
        <button className="secondary" onClick={refresh}>Refresh Balance</button>
      </div>

      <div style={{display:'grid', gap:8}}>
        <div><strong>Address:</strong> {address ? <span className="addr">{address}</span> : 'Not connected'}</div>
        <div><strong>Balance:</strong> {balance ? balance + ' ETH' : '—'}</div>
        <div><strong>Network:</strong> {network ?? '—'}</div>
      </div>
    </div>
  )
}
