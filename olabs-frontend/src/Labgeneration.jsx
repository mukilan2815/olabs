import { issueCertificate as issueEthCertificate } from "./blockchain/olabsEthereum";
import { issueAptosCertificate } from "./blockchain/olabsAptos";
function BlockchainCertification({ labInfo, evaluationResult, onCertified }) {
    const [certLink, setCertLink] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedChain, setSelectedChain] = useState("ethereum"); // or "aptos"
    const isEligible = evaluationResult && evaluationResult.total > 0;
  
    const handleCertify = async () => {
      if (!isEligible) {
        alert("Please complete the evaluation before certification.");
        return;
      }
      setLoading(true);
      try {
        let response;
        if (selectedChain === "ethereum") {
          response = await issueEthCertificate(/* student address */, /* labId */);
          // Example: derive certificate link using Polygonscan URL
          const txHash = response.transactionHash;
          setCertLink(`https://polygonscan.com/tx/${txHash}`);
        } else if (selectedChain === "aptos") {
          response = await issueAptosCertificate(/* student address */, /* labId */, "OLabs Certificate", "https://olabs.example/cert-metadata.json");
          // Use Aptos explorer URL; response.hash holds the transaction hash.
          setCertLink(`https://explorer.aptoslabs.com/txn/${response.hash}`);
        }
        onCertified && onCertified(certLink);
      } catch (err) {
        console.error("Certification error:", err);
        alert("There was an error certifying your lab result.");
      }
      setLoading(false);
    };
  
    return (
      <div className="blockchain-certification">
        <div style={{ marginBottom: "8px" }}>
          <label>
            Select Blockchain:{" "}
            <select value={selectedChain} onChange={(e) => setSelectedChain(e.target.value)}>
              <option value="ethereum">Ethereum/Polygon</option>
              <option value="aptos">Aptos</option>
            </select>
          </label>
        </div>
        <button onClick={handleCertify} disabled={loading}>
          {loading ? "Saving to blockchain..." : "Certify Lab Result"}
        </button>
        {certLink && (
          <div className="certificate-link">
            <p>
              Certificate:{" "}
              <a href={certLink} target="_blank" rel="noopener noreferrer">
                {certLink}
              </a>
            </p>
          </div>
        )}
      </div>
    );
  }
  