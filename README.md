# SendETH DApp (React + Vite) — Styled, ready-to-run

This project is a React + Vite decentralized application that:
- Connects to MetaMask (or any injected EIP-1193 wallet)
- Shows connected wallet address and ETH balance
- Sends ETH to any address
- **Optional**: Cast a vote on a Sepolia voting contract

## Files included
- `src/` React source files
- `package.json` with scripts
- `vite.config.js`

## Requirements
- Node.js (you have v20 — good)
- npm
- MetaMask browser extension

## Setup (step-by-step)
1. Extract the ZIP and `cd` into the folder:
   ```bash
   cd sendeth-dapp
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```
   Open the URL Vite shows (usually http://localhost:5173).

## How to use
1. Open the app in your browser.
2. Click **Connect Wallet** and approve in MetaMask.
3. You’ll see your address and balance.
4. To send ETH:
   - Enter a recipient address and amount (ETH)
   - Click **Send** and confirm in MetaMask
5. Optional voting:
   - Switch MetaMask to **Sepolia** network
   - Click **Vote Proposal 1** or **Vote Proposal 2**
   - Confirm transaction in MetaMask

**Voting contract address:** `0x35cd167FA931C6c5E07AbB2621846FC35D54baD6` (Sepolia)

## Notes
- This project uses `ethers` v6 APIs (BrowserProvider, parseEther, formatEther).
- Always test with testnet ETH (Sepolia) before using mainnet.
- Keep your seed phrase secret.

## Troubleshooting
- `window.ethereum` undefined — install MetaMask.
- "Insufficient funds" — get test ETH from a faucet.
- Ethers version mismatch — ensure `ethers` is ^6.x.

If you want, I can also:
- Walk you through running the app step-by-step
- Provide screenshots or GIF of the workflow
