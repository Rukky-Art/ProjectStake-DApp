import React from 'react'
import WalletCard from './components/WalletCard'
import SendETH from './components/SendETH'
import Vote from './components/Vote'

export default function App(){
  return (
    <div className="app">
      <header className="hero">
        <h1>SendETH DApp</h1>
        <p className="muted">Connect MetaMask, view balance, send ETH — plus optional Sepolia voting.</p>
      </header>

      <main className="card-grid">
        <section className="card">
          <h2>Wallet</h2>
          <WalletCard />
        </section>

        <section className="card">
          <h2>Send ETH</h2>
          <SendETH />
        </section>

        <section className="card">
          <h2>Vote (Sepolia)</h2>
          <p className="muted small">Optional: vote for proposal 1 or 2. Requires Sepolia ETH.</p>
          <Vote />
        </section>
      </main>

      <footer className="footer">
        <small>Built with ❤️ • ethers.js v6 • Vite</small>
      </footer>
    </div>
  )
}
