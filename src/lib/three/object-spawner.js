// オブジェクトスポーンシステム - 3Dモデルの生成と管理
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class ObjectSpawner {
  constructor(scene) {
    this.scene = scene;
    
    // Generic object spawning system
    this.spawnSystem = {
      loader: new GLTFLoader(),
      models: {}, // Will store loaded models by name
      spawnedObjects: [], // All spawned objects
      maxObjects: 100, // Reduced from 100 for better performance
      emergingSpeed: 1.0, // Default emergence speed
      // Angle sector system to prevent overlap
      sectorCount: 8, // Divide around guide sphere into 8 sectors (45 degrees each)
      currentSector: 0, // Track current sector for sequential placement
      sectorAngleStep: (Math.PI * 2) / 8, // 45 degrees in radians
      // Configuration for different object types
      objectConfigs: {
        tree: {
          path: '/assets/glb/tree.glb',
          scale: [1.5, 1.5, 1.5],
          startY: -2,
          targetY: 0,
          emergingSpeed: 1.5 // Increased for faster emergence
        },
        house: {
          path: '/assets/glb/two-story_house.glb',
          scale: [0.25, 0.25, 0.25], // Reduced to 1/4 scale
          startY: -3,
          targetY: 0,
          emergingSpeed: 1.8 // Increased for faster emergence
        },
        street_light: {
          path: '/assets/glb/street_light.glb',
          scale: [1.0, 0.5, 1.0], // Height reduced to 1/2
          startY: -4,
          targetY: 0,
          emergingSpeed: 2.0 // Increased for faster emergence
        },
        utility_pole: {
          path: '/assets/glb/utility_pole.glb',
          scale: [0.5, 0.33, 0.5], // Height reduced to 2/3 of 1/2 size (0.5 * 2/3 = 0.33)
          startY: -5,
          targetY: 0,
          emergingSpeed: 0.8,
          offsetDistance: 6 // Increased to 6 units to avoid overlap with house/tree
        },
        post: {
          path: '/assets/glb/post.glb',
          scale: [0.2, 0.2, 0.2], // 2x of 0.1 = 0.2
          startY: -2,
          targetY: 0,
          emergingSpeed: 2.5, // Increased for faster emergence
          offsetDistance: 4 // Spawn 4 units away from guide sphere
        },
        vending_machine: {
          path: '/assets/glb/vending_machine.glb',
          scale: [0.25, 0.25, 0.25], // Slightly larger than post (0.2)
          startY: -3,
          targetY: 0,
          emergingSpeed: 2.2, // Increased for faster emergence
          offsetDistance: 3 // Spawn 3 units away from guide sphere
        },
        crosswalk_stripes: {
          path: '/assets/glb/crosswalk_stripes.glb',
          scale: [0.33, 0.33, 0.33], // Reduced to 1/3 size
          startY: -1,
          targetY: 0,
          emergingSpeed: 2.8, // Increased for faster emergence
          offsetDistance: 5 // Spawn 5 units away from guide sphere
        },
        guardrail: {
          path: '/assets/glb/guardrail.glb',
          scale: [0.2, 0.2, 0.2], // Reduced to 1/5 scale
          startY: -2,
          targetY: 0,
          emergingSpeed: 2.0, // Increased for faster emergence
          offsetDistance: 3 // Spawn 3 units away from guide sphere
        },
        bench: {
          path: '/assets/glb/bench.glb',
          scale: [0.4, 0.4, 0.4], // 2x of 0.2 = 0.4
          startY: -2,
          targetY: 0,
          emergingSpeed: 2.5, // Increased for faster emergence
          offsetDistance: 4 // Spawn 4 units away from guide sphere
        },
        fence: {
          path: '/assets/glb/fence.glb',
          scale: [0.5, 0.5, 0.5], // Reduced to 1/2 scale
          startY: -2,
          targetY: 0,
          emergingSpeed: 2.2, // Increased for faster emergence
          offsetDistance: 3 // Spawn 3 units away from guide sphere
        },
        stop: {
          path: '/assets/glb/stop.glb',
          scale: [0.5, 0.5, 0.5], // Reduced to 1/2 scale
          startY: 0, // Start at ground level for immediate display
          targetY: 0,
          emergingSpeed: 0, // No emergence animation
          offsetDistance: 4 // Spawn 4 units away from guide sphere
        },
        bollard: {
          path: '/assets/glb/bollard.glb',
          scale: [0.5, 0.5, 0.5], // Reduced to 1/2 scale
          startY: -2,
          targetY: 0,
          emergingSpeed: 2.5, // Increased for faster emergence
          offsetDistance: 3 // Spawn 3 units away from guide sphere
        },
        hydrant: {
          path: '/assets/glb/hydrant.glb',
          scale: [0.2, 0.2, 0.2], // Reduced to 1/5 scale
          startY: -2,
          targetY: 0,
          emergingSpeed: 2.0, // Increased for faster emergence
          offsetDistance: 3 // Spawn 3 units away from guide sphere
        },
        traffic_cone: {
          path: '/assets/glb/traffic_cone.glb',
          scale: [0.2, 0.2, 0.2], // Reduced to 1/5 scale
          startY: -2,
          targetY: 0,
          emergingSpeed: 2.5, // Increased for faster emergence
          offsetDistance: 3 // Spawn 3 units away from guide sphere
        },
        bus_stop_pole: {
          path: '/assets/glb/bus_stop_pole.glb',
          scale: [0.25, 0.25, 0.25], // Reduced to 1/4 scale
          startY: -3,
          targetY: 0,
          emergingSpeed: 2.0, // Increased for faster emergence
          offsetDistance: 4 // Spawn 4 units away from guide sphere
        },
        road_diamond: {
          path: '/assets/glb/road_diamond.glb',
          scale: [1.0, 1.0, 1.0], // Default scale
          startY: -2,
          targetY: 0,
          emergingSpeed: 2.5, // Fast emergence
          offsetDistance: 3 // Spawn 3 units away from guide sphere
        }
      },
      // Sound to object mapping
      soundMapping: {
        'kick': 'tree',
        'snare': 'house',
        'hihat': 'street_light',
        'openHihat': 'road_diamond',
        'synthbass': 'utility_pole',
        'synthlead': 'post',
        'synthpad': 'crosswalk_stripes',
        '808kick': 'vending_machine',
        'glitch': 'guardrail',
        'static': 'bench',
        'distortionblast': 'fence',
        'vocalchop': 'stop',
        'click': 'bollard',
        'sequencer': 'hydrant',
        'metalclick': 'traffic_cone',
        'minimalbass': 'bus_stop_pole'
      }
    };
  }

  async loadAllModels() {
    const loadPromises = [];
    
    for (const [modelName, config] of Object.entries(this.spawnSystem.objectConfigs)) {
      const loadPromise = new Promise((resolve, reject) => {
        this.spawnSystem.loader.load(config.path, 
          (gltf) => {
            this.spawnSystem.models[modelName] = gltf.scene;
            console.log(`${modelName} model loaded successfully`);
            resolve();
          },
          undefined,
          (error) => {
            console.error(`Failed to load ${modelName} model:`, error);
            reject(error);
          }
        );
      });
      loadPromises.push(loadPromise);
    }
    
    try {
      await Promise.all(loadPromises);
      console.log('All models loaded successfully');
    } catch (error) {
      console.error('Some models failed to load:', error);
    }
  }

  spawnObjectAtGuideSphere(objectType, guideSphere) {
    const config = this.spawnSystem.objectConfigs[objectType];
    const model = this.spawnSystem.models[objectType];
    
    if (!config || !model || !guideSphere) {
      console.warn(`Cannot spawn ${objectType}: missing config, model, or guide sphere`);
      return;
    }

    // Clone the model
    const object = model.clone();
    
    // Position using sector-based system to prevent overlap
    if (config.offsetDistance) {
      // Use sector-based placement to avoid overlap
      const sectorAngle = this.spawnSystem.currentSector * this.spawnSystem.sectorAngleStep;
      // Add small random variation within the sector (±10 degrees)
      const randomVariation = (Math.random() - 0.5) * (Math.PI / 9); // ±20 degrees
      const finalAngle = sectorAngle + randomVariation;
      
      object.position.x = guideSphere.position.x + Math.cos(finalAngle) * config.offsetDistance;
      object.position.z = guideSphere.position.z + Math.sin(finalAngle) * config.offsetDistance;
      
      // Advance to next sector for next spawn
      this.spawnSystem.currentSector = (this.spawnSystem.currentSector + 1) % this.spawnSystem.sectorCount;
    } else {
      // Default: spawn at guide sphere location (for objects without offset)
      object.position.x = guideSphere.position.x;
      object.position.z = guideSphere.position.z;
    }
    object.position.y = config.startY; // Start underground
    
    // Scale and setup
    object.scale.set(...config.scale);
    object.castShadow = true;
    
    // Random Z-axis rotation for variety
    object.rotation.y = Math.random() * Math.PI * 2; // Random rotation from 0 to 360 degrees
    
    object.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // Add emerging animation properties
    object.userData = {
      isEmerging: true,
      targetY: config.targetY,
      emergingSpeed: config.emergingSpeed,
      spawnTime: Date.now(),
      objectType: objectType
    };

    // Add to scene and tracking array
    this.scene.add(object);
    this.spawnSystem.spawnedObjects.push(object);

    // Remove oldest objects if we exceed max
    if (this.spawnSystem.spawnedObjects.length > this.spawnSystem.maxObjects) {
      const oldObject = this.spawnSystem.spawnedObjects.shift();
      this.scene.remove(oldObject);
    }

    // console.log(`${objectType} spawned at (${object.position.x.toFixed(1)}, ${object.position.z.toFixed(1)})`);
  }

  updateObjectAnimations(deltaTime) {
    this.spawnSystem.spawnedObjects.forEach((object) => {
      if (object.userData.isEmerging) {
        // Move object up from underground (frame-rate independent)
        if (object.position.y < object.userData.targetY) {
          object.position.y += object.userData.emergingSpeed * deltaTime * 60;
          
          // Stop emerging when reaching target level
          if (object.position.y >= object.userData.targetY) {
            object.position.y = object.userData.targetY;
            object.userData.isEmerging = false;
          }
        }
      }
    });
  }

  triggerSpawn(soundType, guideSphere) {
    const objectType = this.spawnSystem.soundMapping[soundType];
    if (objectType) {
      this.spawnObjectAtGuideSphere(objectType, guideSphere);
    }
  }

  // 全てのオブジェクトをクリア（インタラクティブモード切り替え時に使用）
  clearAllObjects() {
    console.log(`ObjectSpawner: ${this.spawnSystem.spawnedObjects.length}個のオブジェクトをクリアします`);
    
    // 各オブジェクトを個別に削除
    this.spawnSystem.spawnedObjects.forEach((object, index) => {
      if (object && this.scene) {
        console.log(`ObjectSpawner: オブジェクト${index + 1}を削除`);
        this.scene.remove(object);
        
        // ジオメトリとマテリアルのメモリ解放
        if (object.geometry) {
          object.geometry.dispose();
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      }
    });
    
    // 配列をクリア
    this.spawnSystem.spawnedObjects.length = 0;
    
    console.log('ObjectSpawner: 全てのオブジェクトをクリアしました');
  }

  dispose() {
    // Clean up spawned objects
    this.spawnSystem.spawnedObjects.forEach(object => {
      this.scene.remove(object);
    });
    this.spawnSystem.spawnedObjects = [];
  }
}

export default ObjectSpawner;