import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Model3DViewer = ({ modelUrl }) => {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!modelUrl) return;
    
    let scene, camera, renderer, controls, model;
    let animationId;
    const loader = new GLTFLoader();

    // Initialize Three.js scene
    const initScene = () => {
      // Create scene
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf0f0f0);
      
      // Add lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(0, 1, 0);
      scene.add(directionalLight);
      
      const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
      backLight.position.set(0, 0, -1);
      scene.add(backLight);
      
      // Create camera
      const container = containerRef.current;
      const aspectRatio = container.clientWidth / container.clientHeight;
      camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 1000);
      camera.position.set(0, 0, 5);
      
      // Create renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.outputEncoding = THREE.sRGBEncoding;
      container.appendChild(renderer.domElement);
      
      // Add orbit controls
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.25;
      
      // Handle window resize
      window.addEventListener('resize', handleResize);
    };
    
    // Load 3D model
    const loadModel = () => {
      setLoading(true);
      setError(null);
      
      loader.load(
        modelUrl,
        (gltf) => {
          // Success callback
          model = gltf.scene;
          
          // Center the model
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          model.position.sub(center);
          
          // Scale model to fit view
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          if (maxDim > 0) {
            const scale = 2 / maxDim;
            model.scale.multiplyScalar(scale);
          }
          
          scene.add(model);
          setLoading(false);
        },
        // Progress callback
        (xhr) => {
          const progress = (xhr.loaded / xhr.total) * 100;
          console.log(`Loading model: ${Math.round(progress)}%`);
        },
        // Error callback
        (error) => {
          console.error('Error loading model:', error);
          setError('Failed to load 3D model');
          setLoading(false);
        }
      );
    };
    
    // Animation loop
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      if (controls) {
        controls.update();
      }
      
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    };
    
    // Handle window resize
    const handleResize = () => {
      if (containerRef.current && camera && renderer) {
        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
    };
    
    // Initialize and start rendering
    try {
      initScene();
      loadModel();
      animate();
    } catch (err) {
      console.error('Error initializing 3D viewer:', err);
      setError('Failed to initialize 3D viewer');
      setLoading(false);
    }
    
    // Cleanup function
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      
      if (renderer && renderer.domElement && containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      if (controls) {
        controls.dispose();
      }
      
      window.removeEventListener('resize', handleResize);
      
      // Dispose of Three.js resources
      if (model) {
        scene.remove(model);
        model.traverse((object) => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      }
    };
  }, [modelUrl]);
  
  return (
    <div className="model-viewer-container" style={{ width: '100%', height: '400px', position: 'relative' }}>
      {loading && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          Loading 3D model...
        </div>
      )}
      
      {error && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'red' }}>
          {error}
        </div>
      )}
      
      <div 
        ref={containerRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: '#f0f0f0'
        }} 
      />
    </div>
  );
};

export default Model3DViewer;