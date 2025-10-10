import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

export default function SendETH() {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [network, setNetwork] = useState(null);

  async function handleSend(e) {
    e.preventDefault();
    setStatus(null);

    if (!window.ethereum) {
      alert("Install MetaMask first");
      return;
    }

    if (!ethers.isAddress(to)) {
      alert("Invalid recipient address");
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert("Invalid amount");
      return;
    }

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();

      const net = await provider.getNetwork();
      setNetwork(`${net.name} (${net.chainId})`);

      const tx = await signer.sendTransaction({
        to,
        value: ethers.parseEther(amount),
      });

      setStatus({ type: "info", msg: `Tx sent: ${tx.hash}. Waiting for confirmation...` });
      const receipt = await tx.wait();
      setStatus({
        type: "success",
        msg: `Confirmed in block ${receipt.blockNumber}. Hash: ${tx.hash}`,
      });

      setTo("");
      setAmount("");
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", msg: err?.message ?? String(err) });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!window.ethereum) return;
    window.ethereum.on("chainChanged", () => window.location.reload());
    window.ethereum.on("accountsChanged", () => window.location.reload());
  }, []);

  return (
    <div>
      <form onSubmit={handleSend}>
        <div className="field">
          <label>Recipient address</label>
          <input
            type="text"
            placeholder="0x..."
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Amount (ETH)</label>
          <input
            type="number"
            step="any"
            placeholder="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="row" style={{ marginTop: 8 }}>
          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send ETH"}
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() => {
              setTo("");
              setAmount("");
              setStatus(null);
            }}
          >
            Clear
          </button>
        </div>
      </form>

      {network && (
        <div style={{ marginTop: 8 }}>
          <strong>Current Network:</strong> {network}
        </div>
      )}

      {status && (
        <div
          className="status"
          style={{
            borderColor: status.type === "error" ? "rgba(220,38,38,0.12)" : undefined,
          }}
        >
          <strong>
            {status.type === "error"
              ? "Error"
              : status.type === "success"
                ? "Success"
                : "Info"}
            :
          </strong>{" "}
          <span style={{ marginLeft: 8 }}>{status.msg}</span>
        </div>
      )}
    </div>
  );
}
