// シーン管理システム - 基本的なシーン、地面、ライティング
import * as THREE from 'three';
import Stats from 'stats.js';

export class SceneManager {
  constructor(container = document.body) {
    this.container = container;
    this.scene = null;
    this.renderer = null;
    this.ground = null;
    this.directionalLight = null;
    this.stats = null;
  }

  init() {
    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf5f5f5); // Very light gray, almost white background

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio to 2 for performance
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Use soft shadows for better quality
    this.container.appendChild(this.renderer.domElement);

    // Initialize Stats.js for FPS display
    this.stats = new Stats();
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    this.stats.dom.style.position = 'absolute';
    this.stats.dom.style.top = '0px';
    this.stats.dom.style.left = '0px';
    this.container.appendChild(this.stats.dom);

    // Create components
    this.createGround();
    this.setupLighting();

    return {
      scene: this.scene,
      renderer: this.renderer,
      ground: this.ground,
      directionalLight: this.directionalLight,
      stats: this.stats
    };
  }

  createGround() {
    const geometry = new THREE.PlaneGeometry(1000, 1000, 32, 32); // Add segments for better lighting
    const material = new THREE.MeshPhongMaterial({ 
      color: 0xffffff,
      shininess: 10
    }); // Use Phong material for better shading
    this.ground = new THREE.Mesh(geometry, material);
    this.ground.rotation.x = -Math.PI / 2; // Rotate to be horizontal
    this.ground.position.y = 0; // At ground level
    this.ground.receiveShadow = true;
    this.scene.add(this.ground);
  }

  setupLighting() {
    // Much brighter ambient lighting for whitish appearance
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2); // Increased from 0.8 to 1.2
    this.scene.add(ambientLight);
    
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // Reduced from 1.2 to 0.8 to soften shadows
    this.directionalLight.position.set(5, 10, 5);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.width = 2048; // Increased back to 2048 for better shadow quality
    this.directionalLight.shadow.mapSize.height = 2048;
    this.directionalLight.shadow.camera.near = 0.5;
    this.directionalLight.shadow.camera.far = 100;
    this.directionalLight.shadow.camera.left = -50;
    this.directionalLight.shadow.camera.right = 50;
    this.directionalLight.shadow.camera.top = 50;
    this.directionalLight.shadow.camera.bottom = -50;
    this.scene.add(this.directionalLight);
    
    // Add a secondary light to brighten the ground from another angle
    const secondaryLight = new THREE.DirectionalLight(0xffffff, 0.8); // Increased from 0.5 to 0.8
    secondaryLight.position.set(-5, 8, -5);
    this.scene.add(secondaryLight);
  }

  handleResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render(camera) {
    this.renderer.render(this.scene, camera);
  }

  beginStats() {
    if (this.stats) this.stats.begin();
  }

  endStats() {
    if (this.stats) this.stats.end();
  }

  dispose() {
    if (this.renderer && this.container) {
      this.container.removeChild(this.renderer.domElement);
      if (this.stats) {
        this.container.removeChild(this.stats.dom);
      }
      this.renderer.dispose();
    }
  }
}

export default SceneManager;