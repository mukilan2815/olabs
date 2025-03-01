import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Labgeneration from "./Pages/Labgeneration";
import Home from "./Pages/Home";
import ModelBuilder from "./Pages/ModelBuilder";
import TextTo3D from "./Pages/TextTo3D";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/labgeneration" element={<Labgeneration />} />
        <Route path="/" element={<Home />} />
        <Route path="/model-builder" element={<ModelBuilder />} />
        <Route path="/text-to-3d" element={<TextTo3D />} />
      </Routes>
    </Router>
  );
}

export default App;
