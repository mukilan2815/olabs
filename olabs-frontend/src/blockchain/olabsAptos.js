// src/blockchain/olabsAptos.js
import { AptosClient } from "@aptos-labs/ts-sdk";

// Replace with your Aptos fullnode URL (testnet/mainnet)
const APTOS_NODE_URL = "https://fullnode.testnet.aptoslabs.com/v1";
const aptosClient = new AptosClient(APTOS_NODE_URL);

// Replace with your module address (as set in your Move package)
const MODULE_ADDRESS = "0xYourAptosModuleAddress";

// Connect to Aptos wallet (e.g., Petra)
export async function connectAptosWallet() {
  if (window.aptos) {
    try {
      const account = await window.aptos.connect();
      return account.address;
    } catch (error) {
      console.error("Aptos wallet connection failed:", error);
      throw error;
    }
  } else {
    throw new Error("Aptos wallet not found");
  }
}

// Submit an evaluation record on Aptos
export async function recordAptosEvaluation(studentAddr, labId, score, passed) {
  const adminAddr = await connectAptosWallet();
  const payload = {
    type: "entry_function_payload",
    function: `${MODULE_ADDRESS}::OLabsCertificate::record_evaluation`,
    arguments: [studentAddr, labId.toString(), score.toString(), passed],
    type_arguments: [],
  };
  const response = await window.aptos.signAndSubmitTransaction(payload);
  await aptosClient.waitForTransaction(response.hash);
  return response;
}

// Issue a certificate NFT on Aptos
export async function issueAptosCertificate(
  studentAddr,
  labId,
  tokenName,
  tokenUri
) {
  const adminAddr = await connectAptosWallet();
  const payload = {
    type: "entry_function_payload",
    function: `${MODULE_ADDRESS}::OLabsCertificate::issue_certificate`,
    arguments: [studentAddr, labId.toString(), tokenName, tokenUri],
    type_arguments: [],
  };
  const response = await window.aptos.signAndSubmitTransaction(payload);
  await aptosClient.waitForTransaction(response.hash);
  return response;
}
