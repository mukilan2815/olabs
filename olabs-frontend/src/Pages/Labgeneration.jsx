import React, { useState, useEffect, useRef } from "react";
import AceEditor from "react-ace";
import * as THREE from "three";
import { Engine, Render, World, Bodies, Body, Constraint } from "matter-js";
import { Chart, registerables } from "chart.js";
import Web3 from "web3";

// Import AceEditor modes and theme
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-ruby";
// import "ace-builds/src-noconflict/mode-go";
import "ace-builds/src-noconflict/theme-github";

Chart.register(...registerables);

/* ===========================
   Error Boundary Component
=========================== */
function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);
  useEffect(() => {
    const handleError = () => setHasError(true);
    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);
  if (hasError)
    return <h1>Something went wrong. Please try again later.</h1>;
  return children;
}

/* ===========================
   Tab Control Component
=========================== */
function TabControl({ activeTab, setActiveTab, tabs }) {
  return (
    <div className="tab-control">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

/* ===========================
   MCQ Evaluation Component
=========================== */
function MCQEvaluation({ evaluationData, onEvaluationComplete }) {
  // Support evaluationData as an array or as an object with a questions key.
  const questions = Array.isArray(evaluationData)
    ? evaluationData
    : evaluationData && evaluationData.questions
    ? evaluationData.questions
    : [];

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [shownAnswers, setShownAnswers] = useState({});

  const handleOptionChange = (qIndex, optionValue) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: optionValue }));
  };

  const handleSubmit = () => {
    let count = 0;
    questions.forEach((q, idx) => {
      if (q.options && q.options.length > 0) {
        if (String(selectedAnswers[idx]) === String(q.answer)) {
          count++;
        }
      } else {
        if (shownAnswers[idx]) {
          count++;
        }
      }
    });
    setScore(count);
    setSubmitted(true);
    onEvaluationComplete &&
      onEvaluationComplete({ score: count, total: questions.length });
  };

  if (questions.length === 0) {
    return <div className="mcq-evaluation">No questions available.</div>;
  }

  return (
    <div className="mcq-evaluation">
      {questions.map((q, idx) => (
        <div key={idx} className="mcq-question" style={{ marginBottom: "1em" }}>
          <p>
            <strong>Q{idx + 1}:</strong> {q.question || "Question not available"}
          </p>
          <div className="mcq-options">
            {q.options && q.options.length > 0 ? (
              q.options.map((option, optionIdx) => {
                const isCorrect = String(q.answer) === String(option);
                const isSelected = String(selectedAnswers[idx]) === String(option);
                let optionLabel = option;
                if (submitted) {
                  if (isCorrect) {
                    optionLabel += " (Correct Answer)";
                  } else if (isSelected && !isCorrect) {
                    optionLabel += " (Your Answer - Incorrect)";
                  }
                }
                return (
                  <label
                    key={optionIdx}
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      color: submitted
                        ? isCorrect
                          ? "green"
                          : isSelected && !isCorrect
                          ? "red"
                          : "inherit"
                        : "inherit",
                    }}
                  >
                    <input
                      type="radio"
                      name={`question-${idx}`}
                      value={option}
                      checked={isSelected || false}
                      onChange={() => handleOptionChange(idx, option)}
                      disabled={submitted}
                    />{" "}
                    {optionLabel}
                  </label>
                );
              })
            ) : (
              <div>
                <p style={{ fontStyle: "italic" }}>No options available.</p>
                {!shownAnswers[idx] ? (
                  <button
                    onClick={() =>
                      setShownAnswers((prev) => ({ ...prev, [idx]: true }))
                    }
                    disabled={submitted}
                  >
                    Show Answer
                  </button>
                ) : (
                  <div style={{ color: "green" }}>
                    Answer: {q.answer}
                    {q.explanation && <p>Explanation: {q.explanation}</p>}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
      {!submitted && (
        <button onClick={handleSubmit} className="submit-button">
          Submit Answers
        </button>
      )}
      {submitted && (
        <div className="evaluation-result">
          <h4>
            Your Score: {score} / {questions.length}
          </h4>
        </div>
      )}
    </div>
  );
}

/* ===========================
   Blockchain Certification Component
=========================== */
function BlockchainCertification({ labInfo, evaluationResult, onCertified }) {
  const [certLink, setCertLink] = useState("");
  const [loading, setLoading] = useState(false);
  const isEligible = evaluationResult && evaluationResult.total > 0;

  const handleCertify = async () => {
    if (!isEligible) {
      alert("Please complete the evaluation before certification.");
      return;
    }
    setLoading(true);
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(window.ethereum);
        const contractAddress = "0xYourContractAddress"; // Replace with your contract address
        const contractABI = [ /* Replace with your contract ABI */ ];
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        const accounts = await web3.eth.getAccounts();
        const labResult = {
          labType: labInfo.labType,
          score: evaluationResult.score,
          total: evaluationResult.total,
        };
        const tx = await contract.methods
          .certifyResult(JSON.stringify(labResult))
          .send({ from: accounts[0] });
        const txHash = tx.transactionHash;
        const link = `https://polygonscan.com/tx/${txHash}`;
        setCertLink(link);
        onCertified && onCertified(link);
      } catch (err) {
        console.error("Certification error:", err);
        alert("There was an error certifying your lab result.");
      }
    } else {
      alert("Ethereum wallet not detected.");
    }
    setLoading(false);
  };

  return (
    <div className="blockchain-certification">
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

/* ===========================
   Leaderboard Chart Component
=========================== */
function LeaderboardChart({ leaderboard }) {
  const canvasRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const labels = leaderboard.map((entry) => entry.user);
      const scores = leaderboard.map((entry) => entry.score);
      if (chartInstance.current) {
        chartInstance.current.data.labels = labels;
        chartInstance.current.data.datasets[0].data = scores;
        chartInstance.current.update();
      } else {
        chartInstance.current = new Chart(canvasRef.current, {
          type: "bar",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Score",
                data: scores,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
                title: { display: true, text: "Score" },
              },
            },
          },
        });
      }
    }
  }, [leaderboard]);

  return <canvas ref={canvasRef} />;
}


/* ===========================
   Pendulum Simulator Component
=========================== */
function PendulumSimulator() {
  const mountRef = useRef(null);
  const engineRef = useRef(null);
  const [bobMass, setBobMass] = useState(1); // default mass
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Create Matter.js engine
    const engine = Engine.create();
    engineRef.current = engine;

    // Create Three.js scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / 400,
      0.1,
      1000
    );
    camera.position.set(window.innerWidth / 2, 150, 400);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, 400);
    mountRef.current.appendChild(renderer.domElement);

    // Define pendulum using Matter.js
    const pivot = { x: window.innerWidth / 2, y: 50 };
    const bobRadius = 20;
    const bob = Bodies.circle(pivot.x, pivot.y + 200, bobRadius, {
      mass: bobMass,
      restitution: 0.8,
      label: "pendulumBob",
    });
    const constraint = Constraint.create({
      pointA: pivot,
      bodyB: bob,
      length: 200,
      stiffness: 1,
    });
    World.add(engine.world, [bob, constraint]);

    // Create Three.js objects for pendulum bob and rod
    const bobGeometry = new THREE.SphereGeometry(bobRadius, 32, 32);
    const bobMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const bobMesh = new THREE.Mesh(bobGeometry, bobMaterial);
    scene.add(bobMesh);

    const rodMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    const rodGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(pivot.x, pivot.y, 0),
      new THREE.Vector3(bob.position.x, bob.position.y, 0),
    ]);
    const rodLine = new THREE.Line(rodGeometry, rodMaterial);
    scene.add(rodLine);

    // Animation loop to update simulation and render scene
    function animate() {
      requestAnimationFrame(animate);
      Engine.update(engine, 1000 / 60);
      bobMesh.position.x = bob.position.x;
      bobMesh.position.y = bob.position.y;
      rodGeometry.setFromPoints([
        new THREE.Vector3(pivot.x, pivot.y, 0),
        new THREE.Vector3(bob.position.x, bob.position.y, 0),
      ]);
      renderer.render(scene, camera);
    }
    animate();
    setIsInitialized(true);

    return () => {
      renderer.dispose();
      Engine.clear(engine);
    };
  }, []);

  // Update bob mass when bobMass changes
  useEffect(() => {
    if (engineRef.current && isInitialized) {
      const engine = engineRef.current;
      const bob = engine.world.bodies.find((b) => b.label === "pendulumBob");
      if (bob) {
        Body.setMass(bob, bobMass);
      }
    }
  }, [bobMass, isInitialized]);

  return (
    <div>
      <h3>Pendulum Simulator</h3>
      <div ref={mountRef} style={{ border: "1px solid #ccc" }} />
      <div style={{ marginTop: "16px" }}>
        <label>
          Bob Mass:
          <input
            type="range"
            min="0.5"
            max="10"
            step="0.5"
            value={bobMass}
            onChange={(e) => setBobMass(parseFloat(e.target.value))}
          />
          {bobMass} kg
        </label>
      </div>
    </div>
  );
}

/* ===========================
   Lab Simulator Component
   ===========================
   Displays different tabs for lab sections.
   - For computer labs (if lab_type contains "computer" or "code" etc.), shows AceEditor.
   - Otherwise, if lab_type includes "pendulum", renders the PendulumSimulator.
   - Also, if the backend provides a "simulator" object (with instructions and controls),
     those are rendered as well.
   - If no simulation data is available, shows a fallback message.
*/
function LabSimulator({
  labType,
  parameters,
  theory,
  procedure,
  animation,
  simulator,
  video,
  video_script,
  video_url,
  self_evaluation,
  resources,
  simulation_parameters,
}) {
  const [code, setCode] = useState("");
  const [compileOutput, setCompileOutput] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [editorMode, setEditorMode] = useState("javascript");
  const [activeTab, setActiveTab] = useState("theory");
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const tabs = [
    { id: "theory", label: "Theory" },
    { id: "procedure", label: "Procedure" },
    { id: "animation", label: "Animation" },
    { id: "simulator", label: "Simulator" },
    { id: "video", label: "Video" },
    { id: "selfEvaluation", label: "Self Evaluation" },
    { id: "certification", label: "Certification" },
    { id: "resources", label: "Resources" },
  ];

  const isComputerLab =
    labType &&
    (labType.toLowerCase().includes("computer") ||
      labType.toLowerCase().includes("code") ||
      labType.toLowerCase().includes("compiler"));

  const handleCompile = () => {
    setIsCompiling(true);
    setTimeout(() => {
      if (editorMode === "javascript") {
        try {
          new Function(code);
          setCompileOutput("Compilation successful!");
          setSuggestions("Your code looks good. Consider adding comments for clarity.");
        } catch (err) {
          setCompileOutput("Compilation error: " + err.message);
          setSuggestions("Check your syntax near the error.");
        }
      } else {
        setCompileOutput("Simulated compile output:\n" + code);
        setSuggestions("Live compilation is only available for JavaScript.");
      }
      setIsCompiling(false);
    }, 1000);
  };

  const renderContent = (content) => {
    if (content === null || content === undefined) return "No content available.";
    if (typeof content === "object") {
      if (content.content) return renderContent(content.content);
      if (content.description) {
        return (
          <p>
            {content.description}
            {content.steps && Array.isArray(content.steps) && (
              <ol>
                {content.steps.map((step, idx) => (
                  <li key={idx}>{step.action || step}</li>
                ))}
              </ol>
            )}
            {content.components && Array.isArray(content.components) && (
              <ul>
                {content.components.map((comp, idx) => (
                  <li key={idx}>{comp}</li>
                ))}
              </ul>
            )}
          </p>
        );
      }
      if (Array.isArray(content)) {
        return (
          <ol>
            {content.map((item, idx) => (
              <li key={idx}>{renderContent(item)}</li>
            ))}
          </ol>
        );
      }
      return JSON.stringify(content, null, 2);
    }
    return String(content);
  };

  return (
    <div className="lab-container">
      <h2 className="lab-title">
        {labType
          .replace("_", " ")
          .replace("lab", "Lab")
          .replace("ohm", "Ohm's Law")}
      </h2>
      <div className="lab-content">
        <div className="tab-section">
          <TabControl activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
          <div className="tab-content">
            {activeTab === "theory" && (
              <div className="tab-pane">
                <h3>Theory</h3>
                {renderContent(theory)}
              </div>
            )}
            {activeTab === "procedure" && (
              <div className="tab-pane">
                <h3>Procedure</h3>
                {renderContent(procedure)}
              </div>
            )}
            {activeTab === "animation" && (
              <div className="tab-pane">
                <h3>Animation</h3>
                {renderContent(animation)}
              </div>
            )}
            {activeTab === "simulator" && (
              <div className="tab-pane">
                <h3>Simulator</h3>
                {isComputerLab ? (
                  <div className="compiler-lab">
                    <h2>OLabs Replit Compiler</h2>
                    <div className="editor-header">
                      <label htmlFor="mode-select">Language:&nbsp;</label>
                      <select
                        id="mode-select"
                        value={editorMode}
                        onChange={(e) => setEditorMode(e.target.value)}
                      >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="c_cpp">C/C++</option>
                        <option value="ruby">Ruby</option>
                        <option value="go">Go</option>
                      </select>
                    </div>
                    <AceEditor
                      mode={editorMode}
                      theme="github"
                      name="olabs-editor"
                      onChange={(newCode) => setCode(newCode)}
                      value={code}
                      width="100%"
                      height="300px"
                      fontSize={14}
                      setOptions={{
                        useWorker: false,
                        showLineNumbers: true,
                        tabSize: 2,
                      }}
                    />
                    <div className="button-group">
                      <button className="action-button" onClick={handleCompile} disabled={isCompiling}>
                        {isCompiling ? "Compiling..." : "Compile"}
                      </button>
                      <button
                        className="action-button secondary"
                        onClick={() => {
                          setCode("");
                          setCompileOutput("");
                          setSuggestions("");
                        }}
                      >
                        Clear Code
                      </button>
                    </div>
                    <div className="compiler-result">
                      <h3>Output:</h3>
                      <pre className="output-box">{compileOutput}</pre>
                    </div>
                    <div className="compiler-suggestions">
                      <h3>Suggestions:</h3>
                      <pre className="output-box">{suggestions}</pre>
                    </div>
                  </div>
                ) : (
                  <>
                    {labType.toLowerCase().includes("pendulum") && <PendulumSimulator />}
                    {/* Also, if simulator instructions exist from backend, display them */}
                    {simulator ? (
                      <div>
                        <h4>Simulator Instructions</h4>
                        <p>{simulator.instructions}</p>
                        {simulator.controls && Array.isArray(simulator.controls) && (
                          <ul>
                            {simulator.controls.map((control, idx) => (
                              <li key={idx}>{control}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : (
                      !labType.toLowerCase().includes("pendulum") && (
                        <div>No simulation generated.</div>
                      )
                    )}
                  </>
                )}
              </div>
            )}
            {activeTab === "video" && (
              <div className="tab-pane">
                <h3>Video</h3>
                {renderContent(video)}
                {video_script && (
                  <div className="video-script">
                    <h4>Video Script (20s Preview)</h4>
                    <pre>{JSON.stringify(video_script, null, 2)}</pre>
                  </div>
                )}
                {video_url && (
                  <div className="video-player">
                    <h4>Generated Video (20s)</h4>
                    <video controls width="100%" height="200">
                      <source src={video_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
              </div>
            )}
            {activeTab === "selfEvaluation" && (
              <div className="tab-pane">
                <h3>Self Evaluation</h3>
                {self_evaluation &&
                ((Array.isArray(self_evaluation) && self_evaluation.length > 0) ||
                  (self_evaluation.questions && self_evaluation.questions.length > 0)) ? (
                  <MCQEvaluation
                    evaluationData={self_evaluation}
                    onEvaluationComplete={(result) => {
                      setEvaluationResult(result);
                      setLeaderboard((prev) => [
                        ...prev,
                        { user: "User", score: result.score, total: result.total },
                      ]);
                    }}
                  />
                ) : (
                  "No evaluation available."
                )}
              </div>
            )}
            {activeTab === "certification" && (
              <div className="tab-pane">
                <h3>Certification</h3>
                <BlockchainCertification
                  labInfo={{ labType, theory }}
                  evaluationResult={evaluationResult}
                  onCertified={(link) => {}}
                />
              </div>
            )}
           
            {activeTab === "resources" && (
              <div className="tab-pane">
                <h3>Resources</h3>
                {renderContent(resources)}
              </div>
            )}
          </div>
        </div>
      </div>
      {leaderboard.length > 0 && (
        <div className="leaderboard-chart">
          <h4>Leaderboard</h4>
          <LeaderboardChart leaderboard={leaderboard} />
        </div>
      )}
    </div>
  );
}

/* ===========================
   Lab Generation Component
   ===========================
   Fetches lab content from the backend and displays it using LabSimulator.
*/
function Labgeneration() {
  const [prompt, setPrompt] = useState("");
  const [labData, setLabData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "Hindi" },
    { code: "es", label: "Spanish" },
    { code: "fr", label: "French" },
    { code: "de", label: "German" },
    { code: "it", label: "Italian" },
    { code: "pt", label: "Portuguese" },
    { code: "zh", label: "Chinese" },
    { code: "ja", label: "Japanese" },
    { code: "ko", label: "Korean" },
  ];

  useEffect(() => {
    const savedLang = localStorage.getItem("selectedLanguage");
    if (savedLang) setLanguage(savedLang);
  }, []);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    localStorage.setItem("selectedLanguage", e.target.value);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/create_lab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), language }),
      });
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setLabData(data);
      setPrompt("");
      console.log(data);
    } catch (error) {
      console.error("Error creating lab:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="app-container">
        <header className="app-header">
          <h1>OLabs Lab Creator</h1>
        </header>
        <div className="search-container">
          <input
            className="search-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter lab prompt (e.g., 'Create a lab for Python Pattern Printing')"
            disabled={isLoading}
          />
          <select
            className="language-select"
            value={language}
            onChange={handleLanguageChange}
            disabled={isLoading}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
          <button className="search-button" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Creating Lab..." : "Create Lab"}
          </button>
        </div>
        {isLoading && (
          <div className="loader">
            <div className="spinner"></div>
            <p>Loading lab and generating video...</p>
          </div>
        )}
        {labData.lab_type ? (
          <LabSimulator
            labType={labData.lab_type}
            parameters={labData.parameters}
            theory={labData.theory}
            procedure={labData.procedure}
            animation={labData.animation}
            simulator={labData.simulator}
            video={labData.video}
            video_script={labData.video_script}
            video_url={labData.video_url}
            self_evaluation={labData.self_evaluation}
            resources={labData.resources}
            simulation_parameters={labData.simulation_parameters}
          />
        ) : (
          <div className="no-lab-message">
            <p>Enter a lab prompt above to generate a new lab.</p>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default Labgeneration;
