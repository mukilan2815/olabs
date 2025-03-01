import React, { useState, useEffect } from "react";
import Model3DViewer from "./Model3DViewer";

const Text3DGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [trackId, setTrackId] = useState(null);
  const [modelUrl, setModelUrl] = useState(null);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);
      setModelUrl(null);
      setStatusMessage("Starting generation...");

      const response = await fetch("http://localhost:5000/generate-stability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate 3D model");
      }

      // Handle immediate completion
      if (data.status === "completed" && data.model_url) {
        setModelUrl(data.model_url);
        setIsGenerating(false);
        setStatusMessage("");
        return;
      }
      
      // Handle async generation with tracking ID
      if (data.track_id) {
        setTrackId(data.track_id);
        setStatusMessage("Generation in progress...");
      } else {
        throw new Error("No tracking ID received");
      }
    } catch (err) {
      console.error("Generation error:", err);
      setError(err.message || "Failed to generate 3D model");
      setIsGenerating(false);
      setStatusMessage("");
    }
  };

  // Poll for status if we have a tracking ID
  useEffect(() => {
    let intervalId;

    const checkStatus = async () => {
      if (!trackId) return;

      try {
        const response = await fetch(
          `http://localhost:5000/check-stability-status?track_id=${trackId}`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (data.status === "completed" && data.model_url) {
          // Success - got model URL
          setModelUrl(data.model_url);
          setTrackId(null);
          setIsGenerating(false);
          setStatusMessage("");
          clearInterval(intervalId);
        } else if (data.status === "failed") {
          // Failed generation
          throw new Error(data.error || "Generation failed");
        } else if (data.status === "pending") {
          // Still pending
          if (data.progress) {
            setStatusMessage(
              `Generation in progress: ${Math.round(data.progress)}%`
            );
          }
        }
      } catch (err) {
        console.error("Status check error:", err);
        setError(err.message || "Failed to check generation status");
        setTrackId(null);
        setIsGenerating(false);
        setStatusMessage("");
        clearInterval(intervalId);
      }
    };

    if (trackId) {
      // Check immediately then set up polling
      checkStatus();
      intervalId = setInterval(checkStatus, 3000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [trackId]);

  return (
    <div
      className="text-to-3d-container"
      style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Text-to-3D Model Generator (Stability AI)
      </h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a detailed description of the 3D model you want to generate..."
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              minHeight: "100px",
              fontFamily: "inherit",
              resize: "vertical",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isGenerating || !prompt.trim()}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "12px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: isGenerating ? "not-allowed" : "pointer",
            width: "100%",
            fontSize: "16px",
            opacity: isGenerating ? 0.7 : 1,
          }}
        >
          {isGenerating ? "Generating..." : "Generate"}
        </button>
      </form>

      {statusMessage && (
        <div
          style={{
            textAlign: "center",
            margin: "20px 0",
            padding: "10px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
          }}
        >
          {statusMessage}
        </div>
      )}

      {error && (
        <div
          style={{
            color: "white",
            backgroundColor: "#f44336",
            padding: "12px",
            borderRadius: "8px",
            margin: "20px 0",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

      {modelUrl && (
        <div style={{ marginTop: "20px" }}>
          <h2 style={{ marginBottom: "10px" }}>Generated 3D Model</h2>
          <Model3DViewer modelUrl={modelUrl} />

          <div style={{ marginTop: "10px", textAlign: "center" }}>
            <a
              href={modelUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                padding: "8px 16px",
                backgroundColor: "#2196F3",
                color: "white",
                textDecoration: "none",
                borderRadius: "4px",
                marginTop: "10px",
              }}
            >
              Download 3D Model
            </a>
          </div>
        </div>
      )}

      {!modelUrl && !isGenerating && !error && (
        <div
          style={{
            textAlign: "center",
            margin: "40px 0",
            color: "#666",
            padding: "20px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
          }}
        >
          Enter a prompt above to generate a 3D model.
        </div>
      )}
    </div>
  );
};

export default Text3DGenerator;
