import * as THREE from "three";
import { Engine, Render, World, Bodies, Body, Constraint } from "matter-js";
import { Chart } from "chart.js";

export const initializePendulumSimulation = (
  mountRef,
  engineRef,
  chartRef,
  length,
  bobMass,
  angle,
  gravity
) => {
  let scene, camera, renderer, engine, render, chart;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight / 2);
  renderer.setClearColor(0x87ceeb, 1); // Light blue background
  mountRef.current.appendChild(renderer.domElement);

  // Add ambient and directional lights to prevent black screen
  const ambientLight = new THREE.AmbientLight(0x404040, 1);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(0, 1, 0);
  scene.add(directionalLight);

  engine = Engine.create();
  engineRef.current = engine;
  engine.gravity.y = gravity;
  render = Render.create({
    element: mountRef.current,
    engine: engine,
    options: {
      width: window.innerWidth,
      height: window.innerHeight / 2,
      wireframes: false,
      background: "transparent", // Transparent background for 3D
    },
  });

  // Use SAM parameters for 3D simulation
  const paramWidth = 20;
  const stringLength = length; // Use normalized length from UI (in meters)

  const pivot = Bodies.rectangle(window.innerWidth / 2, 50, 5, 5, {
    isStatic: true,
  });
  const bob = Bodies.circle(
    window.innerWidth / 2,
    50 + stringLength * 100, // Scale to pixels for Matter.js
    paramWidth * Math.sqrt(bobMass), // Bob size based on width and mass
    { mass: bobMass }
  );
  World.add(engine.world, [pivot, bob]);

  const constraint = Constraint.create({
    bodyA: pivot,
    bodyB: bob,
    length: stringLength * 100, // Scale to pixels
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
  const string = new THREE.Mesh(stringGeometry, stringMaterial);
  string.position.set(
    window.innerWidth / 2,
    50 + (stringLength * 100) / 2,
    0
  );
  string.rotation.x = Math.PI / 2;
  scene.add(string);

  const bobGeometry = new THREE.SphereGeometry(
    paramWidth * Math.sqrt(bobMass),
    32,
    32
  );
  const bobMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const bob3D = new THREE.Mesh(bobGeometry, bobMaterial);
  bob3D.position.set(window.innerWidth / 2, 50 + stringLength * 100, 0);
  scene.add(bob3D);

  const update3D = (bob) => {
    const bobPos = bob.position;
    const string = scene.children.find((child) => child.type === "Mesh" && child.name === "string");
    const bob3D = scene.children.find((child) => child.type === "Mesh" && child.name === "bob");
    if (string && bob3D) {
      bob3D.position.set(bobPos.x, bobPos.y, 0);
      string.position.set(
        window.innerWidth / 2,
        50 + (bobPos.y - 50) / 2,
        0
      );
      string.scale.y = (bobPos.y - 50) / (stringLength * 100);
    }
  };

  const initializeChart = (mountRef) => {
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
    return chart;
  };

  const measureSwing = (bob, setSwingTime, setIsSwinging, setOscillationCount, updateGraph, length) => {
    let startTime = null;
    let oscillationStartY = bob.position.y;
    let oscillationCount = 0;

    return () => {
      if (!isSwinging) return;

      if (
        startTime === null &&
        Math.abs(bob.position.y - oscillationStartY) < 10
      ) {
        startTime = Date.now();
        oscillationCount = 0;
        setOscillationCount(0);
      }
      if (Math.abs(bob.position.y - oscillationStartY) < 10 && startTime) {
        oscillationCount += 1;
        setOscillationCount(oscillationCount);
        if (oscillationCount >= 19) {
          // 20 oscillations as per procedure
          const totalTime = (Date.now() - startTime) / 1000;
          const timePeriod = totalTime / 20; // T = t/n
          setSwingTime(timePeriod);
          setIsSwinging(false);
          updateGraph(length, timePeriod);
          startTime = null;
        }
      }
      requestAnimationFrame(measureSwing(bob, setSwingTime, setIsSwinging, setOscillationCount, updateGraph, length));
    };
  };

  const animate = (engine, renderer, scene, camera, bob, update3D) => {
    return () => {
      requestAnimationFrame(animate(engine, renderer, scene, camera, bob, update3D));
      Engine.update(engine, 1000 / 60);
      update3D(bob);
      renderer.render(scene, camera);
      camera.position.set(window.innerWidth / 2, 150, 300); // Position camera for better view
      camera.lookAt(window.innerWidth / 2, 50 + stringLength * 100, 0);
    };
  };

  return {
    scene,
    camera,
    renderer,
    engine,
    render,
    chart,
    update3D,
    initializeChart,
    measureSwing,
    animate,
  };
};

export default initializePendulumSimulation;