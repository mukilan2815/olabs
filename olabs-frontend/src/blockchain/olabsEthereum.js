// src/blockchain/olabsEthereum.js
import Web3 from "web3";

// Replace with your deployed contract’s ABI and address.
const CONTRACT_ABI = [ /* ... Your Contract ABI ... */ ];
const CONTRACT_ADDRESS = "0xYourContractAddress"; 

export async function connectMetaMask() {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      return { web3, userAddress: accounts[0] };
    } catch (error) {
      console.error("MetaMask connection error:", error);
      throw error;
    }
  } else {
    throw new Error("MetaMask not found");
  }
}

export async function recordEvaluation(studentAddr, labId, score, passed) {
  const { web3, userAddress } = await connectMetaMask();
  const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
  return contract.methods
    .recordEvaluation(studentAddr, labId, score, passed)
    .send({ from: userAddress });
}

export async function issueCertificate(studentAddr, labId) {
  const { web3, userAddress } = await connectMetaMask();
  const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
  return contract.methods
    .issueCertificate(studentAddr, labId)
    .send({ from: userAddress });
}
