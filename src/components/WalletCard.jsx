import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function WalletCard() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [network, setNetwork] = useState("");

  // 🔌 Connect to MetaMask
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);

      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      const bal = await provider.getBalance(addr);
      const net = await provider.getNetwork();

      setConnected(true);
      setAddress(addr);
      setBalance(ethers.formatEther(bal));
      setNetwork(`${net.name} (chainId: ${net.chainId})`);
    } catch (err) {
      console.error("Connection failed:", err);
      alert("Failed to connect: " + err.message);
    }
  };

  // 🔄 Listen for network/account change
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        setConnected(false);
        setAddress("");
        setBalance("");
        setNetwork("");
      } else {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const addr = accounts[0];
        const bal = await provider.getBalance(addr);
        const net = await provider.getNetwork();
        setConnected(true);
        setAddress(addr);
        setBalance(ethers.formatEther(bal));
        setNetwork(`${net.name} (chainId: ${net.chainId})`);
      }
    };

    const handleChainChanged = async (chainId) => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const net = await provider.getNetwork();
      setNetwork(`${net.name} (chainId: ${net.chainId})`);
      if (address) {
        const bal = await provider.getBalance(address);
        setBalance(ethers.formatEther(bal));
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [address]);

  return (
    <div>
      <h3>Wallet Info</h3>
      <button onClick={connectWallet}>
        {connected ? "Connected" : "Connect Wallet"}
      </button>

      <div style={{ marginTop: "10px" }}>
        <p><strong>Address:</strong> {address || "Not connected"}</p>
        <p><strong>Balance:</strong> {balance ? `${balance} ETH` : "—"}</p>
        <p><strong>Network:</strong> {network || "—"}</p>
      </div>
    </div>
  );
}
