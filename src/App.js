import React, { useState, useEffect } from "react";
import { pinata } from "./config";
import { ethers } from "ethers";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [ipfsHash, setIpfsHash] = useState("");
  const [storedHash, setStoredHash] = useState("");
  const [account, setAccount] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  // Replace these with your deployed contract's details
  const contractAddress = "0xdd165047B702b2209a4CF93d8c22662fe0840fae";
  const contractABI = [
    {
      "inputs": [],
      "name": "getIPFSHash",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_ipfsHash",
          "type": "string"
        }
      ],
      "name": "setIPFSHash",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmission = async () => {
    try {
      if (!selectedFile) {
        console.error("No file selected");
        return;
      }

      const response = await pinata.upload.file(selectedFile);
      const ipfsHash = response.IpfsHash;
      setIpfsHash(ipfsHash);

      await storeHashOnBlockchain(ipfsHash);
    } catch (error) {
      console.log("File upload failed:", error);
    }
  };

  const storeHashOnBlockchain = async (hash) => {
    try {
      // Connect to Ethereum provider (MetaMask)
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Create a contract instance
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Send the transaction to store the IPFS hash on the blockchain
      const tx = await contract.setIPFSHash(hash);
      await tx.wait();

      console.log("IPFS hash stored on blockchain:", hash);
    } catch (error) {
      console.log("Failed to store IPFS hash on blockchain:", error);
    }
  };

  const retrieveHashFromBlockchain = async () => {
    try {
      // Connect to Ethereum provider (MetaMask)
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);

      // Retrieve the IPFS hash from the blockchain
      const retrievedHash = await contract.getIPFSHash();
      setStoredHash(retrievedHash);

      console.log("Retrieved IPFS hash from blockchain:", retrievedHash);
    } catch (error) {
      console.log("Failed to retrieve IPFS hash from blockchain:", error);
    }
  };

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setIsConnected(true);
      } else {
        alert("Please install MetaMask!");
      }
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };

  const disconnectWallet = () => {
    setAccount("");
    setIsConnected(false);
  };

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        }
      }
    };

    checkWalletConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(accounts[0]);
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  return (
    <div className="app-container">
      <div className="header">
        <h1>Store File on IPFS</h1>
      </div>

      <div className="wallet-section">
        {!isConnected ? (
          <button onClick={connectWallet} className="connect-button">
            Connect Wallet
          </button>
        ) : (
          <div className="wallet-info">
            <span className="wallet-address">
              {account.slice(0, 6)}...{account.slice(-4)}
            </span>
            <button onClick={disconnectWallet} className="disconnect-button">
              Disconnect
            </button>
          </div>
        )}
      </div>

      <div className="upload-section">
        <label className="form-label">Choose File</label>
        <input type="file" onChange={changeHandler} className="file-input" />
        <button onClick={handleSubmission} className="submit-button">
          Submit
        </button>
      </div>

      {ipfsHash && (
        <div className="result-section">
          <p>
            <strong>IPFS Hash:</strong> {ipfsHash}
          </p>
        </div>
      )}

      <div className="retrieve-section">
        <button onClick={retrieveHashFromBlockchain} className="retrieve-button">
          Retrieve Stored Hash
        </button>
        {storedHash && (
          <p>
            <strong>Stored IPFS Hash:</strong>{" "}
            <a 
              href={`https://gateway.pinata.cloud/ipfs/${storedHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ipfs-link"
            >
              {storedHash}
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

export default App;


//https://gateway.pinata.cloud/ipfs/