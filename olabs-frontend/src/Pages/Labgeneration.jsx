import React, { useState, useEffect, useRef } from "react";
import AceEditor from "react-ace";
import * as THREE from "three";
import { Engine, Render, World, Bodies, Body, Constraint } from "matter-js";
import { Chart, registerables } from "chart.js";
import Web3 from "web3";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-ruby";
// import "ace-builds/src-noconflict/mode-go";
import "ace-builds/src-noconflict/theme-github";
Chart.register(...registerables);

// Common error boundary
function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);
  useEffect(() => {
    const handleError = () => setHasError(true);
    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);
  if (hasError) return <h1>Something went wrong. Please try again later.</h1>;
  return children;
}

// Tab control component for switching sections
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

/* ---------------------------
   MCQ Evaluation Component
   ---------------------------
   Here we assume that self_evaluation is an array of questions.
   Each question has:
     - question: text of the question
     - options: array of option strings
     - answer: the correct answer string (or correct option index as a number or string)
     - explanation: an explanation (displayed optionally after submission)
   We compare by converting the selected option index and (if needed) the correct answer to numbers.
*/
function MCQEvaluation({ evaluationData, onEvaluationComplete }) {
  // If evaluationData is an array, use it directly; if it's an object with questions, use that.
  const questions = Array.isArray(evaluationData)
    ? evaluationData
    : evaluationData && evaluationData.questions
    ? evaluationData.questions
    : [];

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleOptionChange = (qIndex, optionIndex) =>
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));

  const handleSubmit = () => {
    let count = 0;
    questions.forEach((q, idx) => {
      // Compare as strings so that "print()" and print() match, or use Number() if using numeric indexes
      if (String(selectedAnswers[idx]) === String(q.answer)) {
        count++;
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
        <div key={idx} className="mcq-question">
          <p>
            <strong>Q{idx + 1}:</strong> {q.question || "Question not available"}
          </p>
          <div className="mcq-options">
            {(q.options || []).map((option, optionIdx) => {
              // Compare using string conversion
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
            })}
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


/* ---------------------------
   Blockchain Certification Component
   ---------------------------
   (This component is for demonstration; adjust as needed.)
*/
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

/* ---------------------------
   Leaderboard Chart Component
   ---------------------------
*/
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

/* ---------------------------
   Hackathon Tracks Component
   ---------------------------
*/
function HackathonTracks() {
  return (
    <div className="hackathon-tracks">
      <p>Track details coming soon.</p>
    </div>
  );
}

/* ---------------------------
   Lab Simulator Component
   ---------------------------
   This component displays different tabs for theory, procedure, animation,
   simulator, video, self evaluation, certification, tracks, and resources.
   For computer labs, if isComputerLab is true, it shows a code editor (AceEditor)
   with multiple language modes.
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
  const mountRef = useRef(null);
  const engineRef = useRef(null);
  const chartRef = useRef(null);
  const [bobMass] = useState(parameters?.width ? 1 : 1);
  const [length] = useState(parameters?.length / 100 || 1);
  const [angle] = useState(0.5);
  const [gravity] = useState(9.81);
  const [isSwinging, setIsSwinging] = useState(false);
  const [oscillationCount, setOscillationCount] = useState(0);
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
    { id: "tracks", label: "Tracks" },
    { id: "resources", label: "Resources" },
  ];
  // Determine if this lab is a computer lab
  const isComputerLab =
    labType &&
    (labType.toLowerCase().includes("computer") ||
      labType.toLowerCase().includes("code") ||
      labType.toLowerCase().includes("compiler"));

  // Code compilation handler for the AceEditor
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

  useEffect(() => {
    if (!labType || isComputerLab) return;
    let scene, camera, renderer, engine, renderObj, chart;
    if (labType.toLowerCase().includes("pendulum")) {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / (window.innerHeight / 2),
        0.1,
        1000
      );
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight / 2);
      renderer.setClearColor(0x87ceeb, 1);
      mountRef.current.appendChild(renderer.domElement);
      const ambientLight = new THREE.AmbientLight(0x404040, 1);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(0, 1, 0);
      scene.add(directionalLight);
      engine = Engine.create();
      engineRef.current = engine;
      engine.gravity.y = gravity;
      renderObj = Render.create({
        element: mountRef.current,
        engine: engine,
        options: {
          width: window.innerWidth,
          height: window.innerHeight / 2,
          wireframes: false,
          background: "transparent",
        },
      });
      const paramWidth = parameters?.width || 20;
      const stringLength = length;
      const pivot = Bodies.rectangle(window.innerWidth / 2, 50, 5, 5, {
        isStatic: true,
      });
      const bob = Bodies.circle(
        window.innerWidth / 2,
        50 + stringLength * 100,
        paramWidth * Math.sqrt(bobMass),
        { mass: bobMass }
      );
      World.add(engine.world, [pivot, bob]);
      const constraint = Constraint.create({
        bodyA: pivot,
        bodyB: bob,
        length: stringLength * 100,
        stiffness: 1,
        render: { visible: false },
      });
      World.add(engine.world, constraint);
      Body.setVelocity(bob, { x: Math.sin(angle) * 5, y: 0 });
      Body.setAngularVelocity(bob, Math.sin(angle) * 0.1);
      const stringGeometry = new THREE.CylinderGeometry(
        0.05,
        0.05,
        stringLength * 100,
        32
      );
      const stringMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const stringMesh = new THREE.Mesh(stringGeometry, stringMaterial);
      stringMesh.position.set(
        window.innerWidth / 2,
        50 + (stringLength * 100) / 2,
        0
      );
      stringMesh.rotation.x = Math.PI / 2;
      scene.add(stringMesh);
      const bobGeometry = new THREE.SphereGeometry(
        paramWidth * Math.sqrt(bobMass),
        32,
        32
      );
      const bobMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const bob3D = new THREE.Mesh(bobGeometry, bobMaterial);
      bob3D.position.set(window.innerWidth / 2, 50 + stringLength * 100, 0);
      scene.add(bob3D);
      const update3D = () => {
        const pos = bob.position;
        bob3D.position.set(pos.x, pos.y, 0);
        stringMesh.position.set(
          window.innerWidth / 2,
          50 + (pos.y - 50) / 2,
          0
        );
        stringMesh.scale.y = (pos.y - 50) / (stringLength * 100);
      };
      let startTime = null;
      let oscillationStartY = bob.position.y;
      const measureSwing = () => {
        if (!isSwinging) return;
        if (
          startTime === null &&
          Math.abs(bob.position.y - oscillationStartY) < 10
        ) {
          startTime = Date.now();
          setOscillationCount(0);
        }
        if (Math.abs(bob.position.y - oscillationStartY) < 10 && startTime) {
          setOscillationCount((prev) => prev + 1);
          if (oscillationCount >= 19) {
            const totalTime = (Date.now() - startTime) / 1000;
            const timePeriod = totalTime / 20;
            setIsSwinging(false);
            if (chart) {
              chart.data.labels.push(length);
              chart.data.datasets[0].data.push(Math.pow(timePeriod, 2));
              chart.update();
            }
            startTime = null;
          }
        }
        requestAnimationFrame(measureSwing);
      };
      const initializeChart = () => {
        const ctx =
          mountRef.current.querySelector("canvas.chart") ||
          document.createElement("canvas");
        ctx.className = "chart";
        if (!chartRef.current) {
          mountRef.current.appendChild(ctx);
          chart = new Chart(ctx, {
            type: "scatter",
            data: {
              labels: [],
              datasets: [
                {
                  label: "T² vs. L",
                  data: [],
                  backgroundColor: "rgba(75, 192, 192, 0.2)",
                  borderColor: "rgba(75, 192, 192, 1)",
                  borderWidth: 1,
                },
              ],
            },
            options: {
              scales: {
                x: { title: { display: true, text: "Length (m)" } },
                y: { title: { display: true, text: "T² (s²)" } },
              },
            },
          });
          chartRef.current = chart;
        }
      };
      initializeChart();
      const animate = () => {
        requestAnimationFrame(animate);
        Engine.update(engine, 1000 / 60);
        update3D();
        renderer.render(scene, camera);
        camera.position.set(window.innerWidth / 2, 150, 300);
        camera.lookAt(window.innerWidth / 2, 50 + stringLength * 100, 0);
      };
      animate();
      measureSwing();
    } else if (labType.toLowerCase().includes("titration")) {
      const ctx =
        mountRef.current.querySelector("canvas.chart") ||
        document.createElement("canvas");
      ctx.className = "chart";
      if (!chartRef.current) {
        mountRef.current.appendChild(ctx);
        const chart = new Chart(ctx, {
          type: "line",
          data: {
            labels: [],
            datasets: [
              {
                label: "pH vs. Volume",
                data: [],
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 2,
                fill: false,
              },
            ],
          },
          options: {
            scales: {
              x: { title: { display: true, text: "Volume (mL)" } },
              y: { title: { display: true, text: "pH" } },
            },
          },
        });
        chartRef.current = chart;
      }
    }
    return () => {};
  }, [
    labType,
    parameters,
    bobMass,
    length,
    angle,
    gravity,
    isSwinging,
    simulation_parameters,
    isComputerLab,
  ]);

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
          <TabControl
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabs={tabs}
          />
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
                      <button
                        className="action-button"
                        onClick={handleCompile}
                        disabled={isCompiling}
                      >
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
                  <div ref={mountRef} className="simulator-mount" />
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
            {activeTab === "tracks" && (
              <div className="tab-pane">
                <h3>Hackathon Tracks</h3>
                <HackathonTracks />
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
          <button
            className="search-button"
            onClick={handleSubmit}
            disabled={isLoading}
          >
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
