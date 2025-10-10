import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x35cd167FA931C6c5E07AbB2621846FC35D54baD6";
const ABI = [
  {
    "inputs": [{ "internalType": "uint256", "name": "proposal", "type": "uint256" }],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
];

export default function Vote() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [choice, setChoice] = useState(null);
  const [network, setNetwork] = useState(null);

  async function castVote(num) {
    setStatus(null);

    if (!window.ethereum) {
      alert("Install MetaMask first");
      return;
    }

    try {
      setLoading(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      // Get network
      const net = await provider.getNetwork();
      setNetwork(`${net.name} (${net.chainId})`);

      const tx = await contract.vote(num);
      setStatus({ type: "info", msg: `Tx sent: ${tx.hash}. Waiting for confirmation...` });
      await tx.wait();
      setStatus({ type: "success", msg: `Vote confirmed. Tx: ${tx.hash}` });
      setChoice(num);
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", msg: err?.message ?? String(err) });
    } finally {
      setLoading(false);
    }
  }

  // Auto reload on account or network change
  useEffect(() => {
    if (!window.ethereum) return;
    window.ethereum.on("chainChanged", () => window.location.reload());
    window.ethereum.on("accountsChanged", () => window.location.reload());
  }, []);

  return (
    <div>
      <div className="row" style={{ marginBottom: 8 }}>
        <button onClick={() => castVote(1)} disabled={loading}>
          Vote Proposal 1
        </button>
        <button onClick={() => castVote(2)} disabled={loading}>
          Vote Proposal 2
        </button>
      </div>

      {network && (
        <div style={{ marginBottom: 8 }}>
          <strong>Current Network:</strong> {network}
        </div>
      )}

      {status && (
        <div className="status">
          <strong>
            {status.type === "error"
              ? "Error"
              : status.type === "success"
                ? "Success"
                : "Info"}
            :
          </strong>
          <span style={{ marginLeft: 8 }}>{status.msg}</span>
        </div>
      )}

      {choice && (
        <div style={{ marginTop: 8 }}>
          You voted for proposal <strong>{choice}</strong>
        </div>
      )}
    </div>
  );
}
