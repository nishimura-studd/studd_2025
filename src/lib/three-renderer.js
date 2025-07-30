// モジュラー Three.js レンダラー - 統合クラス
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import SceneManager from './three/scene-manager.js';
import CameraSystem from './three/camera-system.js';
import GuideSphere from './three/guide-sphere.js';
import ObjectSpawner from './three/object-spawner.js';

class ThreeRenderer {
  constructor(container = document.body) {
    this.container = container;
    this.camera = null;
    this.controls = null;
    this.animationId = null;
    this.handleResize = null;
    this.isInitialized = false;
    this.isCameraAnimationActive = false; // Camera animation starts only after audio initialization
    
    // Delta time for frame-rate independent animation
    this.clock = new THREE.Clock();
    
    // モジュラーシステム
    this.sceneManager = null;
    this.cameraSystem = null;
    this.guideSphere = null;
    this.objectSpawner = null;
    
    // システム参照
    this.scene = null;
    this.renderer = null;
    this.stats = null;
    this.ground = null;
    this.directionalLight = null;
  }

  async init() {
    if (this.isInitialized) return;

    try {
      // シーン管理システム初期化
      this.sceneManager = new SceneManager(this.container);
      const sceneComponents = this.sceneManager.init();
      
      this.scene = sceneComponents.scene;
      this.renderer = sceneComponents.renderer;
      this.ground = sceneComponents.ground;
      this.directionalLight = sceneComponents.directionalLight;
      this.stats = sceneComponents.stats;

      // カメラセットアップ
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
      this.camera.position.set(0, 20, 0); // Start high above looking down
      this.camera.lookAt(0, 0, 0); // Look at center/ground
      
      // カメラシステム初期化
      this.cameraSystem = new CameraSystem(this.camera, this.scene);
      this.cameraSystem.init();

      // ガイド球体システム初期化
      this.guideSphere = new GuideSphere(this.scene);
      this.guideSphere.create();

      // オブジェクトスポーンシステム初期化
      this.objectSpawner = new ObjectSpawner(this.scene);

      // コントロール設定（無効化）
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enabled = false; // Disable manual controls
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;

      // ウィンドウリサイズ処理
      this.handleResize = () => {
        this.cameraSystem.handleResize();
        this.sceneManager.handleResize();
      };
      window.addEventListener('resize', this.handleResize);

      // 全モデルをロード
      await this.objectSpawner.loadAllModels();

      // アニメーションループ開始
      this.animate();

      this.isInitialized = true;
      console.log('Three.js renderer initialized with guide sphere and all models');

    } catch (error) {
      console.error('ThreeRenderer initialization failed:', error);
      throw error;
    }
  }

  triggerAnimation(soundType) {
    if (!this.isInitialized) return;
    
    // ガイド球体のアニメーション
    this.guideSphere.triggerAnimation(soundType);
    
    // オブジェクトのスポーン
    this.objectSpawner.triggerSpawn(soundType, this.guideSphere.getSphere());
  }

  setMusicStartTime() {
    console.log('Music started - enabling camera animation');
    this.isCameraAnimationActive = true;
  }

  onLoopChange() {
    if (!this.isInitialized) return;
    this.guideSphere.onLoopChange();
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    if (!this.isInitialized) return;
    
    // Get delta time for frame-rate independent animation
    const deltaTime = this.clock.getDelta();
    
    // Begin stats monitoring
    this.sceneManager.beginStats();
    
    // Update sphere movement and rotation
    this.guideSphere.updateMovement(deltaTime);
    
    // Update object animations
    this.objectSpawner.updateObjectAnimations(deltaTime);
    
    // Update controls (even though disabled, for potential future use)
    this.controls.update();
    
    // Update camera only if animation is active
    if (this.isCameraAnimationActive) {
      this.cameraSystem.updateCameraFollow(
        this.guideSphere.getSphere(), 
        this.ground, 
        this.directionalLight,
        deltaTime
      );
    }
    
    // Render the scene
    this.sceneManager.render(this.camera);
    
    // End stats monitoring
    this.sceneManager.endStats();
  }

  dispose() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    if (this.handleResize) {
      window.removeEventListener('resize', this.handleResize);
    }
    
    // Dispose modular systems
    if (this.objectSpawner) {
      this.objectSpawner.dispose();
    }
    
    if (this.guideSphere) {
      this.guideSphere.dispose();
    }
    
    if (this.sceneManager) {
      this.sceneManager.dispose();
    }
    
    this.isInitialized = false;
    console.log('Three.js renderer disposed');
  }
}

export default ThreeRenderer;