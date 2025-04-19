# IPFS File Storage Application

A decentralized application (dApp) that allows users to store files on IPFS (InterPlanetary File System) and record the IPFS hash on the Ethereum blockchain. This application provides a secure and permanent way to store and retrieve files using blockchain technology.

![Image](https://github.com/user-attachments/assets/5d066616-a995-40f9-837a-650fac42309f)

## Features

- 🔐 Wallet Connection: Connect your MetaMask wallet to interact with the application
- 📁 File Upload: Upload files to IPFS through Pinata gateway
- 🔗 IPFS Hash Storage: Store the IPFS hash on the Ethereum blockchain
- 🔍 Hash Retrieval: Retrieve stored IPFS hashes from the blockchain
- 🌐 Direct Access: Access uploaded files through IPFS gateway links

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MetaMask](https://metamask.io/) browser extension
- Ethereum wallet with some test ETH (for Goerli testnet)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd StoreIPFSHash
```

2. Install dependencies:
```bash
npm install
```


## Configuration

1. Update the contract address in `src/App.js` with your deployed smart contract address:
```javascript
const contractAddress = "YOUR_CONTRACT_ADDRESS";
```

2. Ensure your MetaMask is connected to the correct network (Goerli testnet recommended for testing)

## Usage

1. Start the development server:
```bash
npm start
```

2. Open your browser and navigate to `http://localhost:3000`

3. Connect your MetaMask wallet using the "Connect Wallet" button

4. Upload a file:
   - Click "Choose File" to select a file
   - Click "Submit" to upload the file to IPFS
   - The IPFS hash will be automatically stored on the blockchain

5. Retrieve stored hash:
   - Click "Retrieve Stored Hash" to get the latest stored IPFS hash
   - Click the hash link to view the file on IPFS gateway

## Smart Contract

The application uses a simple smart contract with two main functions:
- `setIPFSHash`: Stores the IPFS hash on the blockchain
- `getIPFSHash`: Retrieves the stored IPFS hash

## Technologies Used

- React.js
- ethers.js
- IPFS (via Pinata)
- MetaMask
- Ethereum Blockchain
- Web3.js


