// カメラシステム - 軌道運動とフォロー機能
import * as THREE from 'three';

export class CameraSystem {
  constructor(camera, scene) {
    this.camera = camera;
    this.scene = scene;
    
    // Camera orbital movement properties
    this.cameraTarget = {
      position: new THREE.Vector3(3, 3, 3),
      smoothness: 0.03, // Reduced from 0.05 for slower, more deliberate movement
      // Orbital parameters
      orbitRadius: 5,  // Increased base distance
      orbitHeight: 8, // Much higher for dramatic vertical movement
      orbitSpeed: 0.008, // Much slower rotation - reduced from 0.015 to 0.008
      orbitAngle: 0,   // Current orbital angle
      // Zoom parameters
      zoomTime: 0,        // Time counter for zoom oscillation
      zoomSpeed: 0.005,   // Much slower zoom - reduced from 0.01 to 0.005
      zoomAmplitude: 8,   // Much larger zoom range for dramatic effects
      minRadius: 0.3,     // Very close minimum radius
      maxRadius: 20,       // Much larger maximum orbit radius
      // Y-axis rotation parameters
      yRotationAngle: 0,  // Current Y-axis rotation angle
      yRotationSpeed: 0.008 // Much more extreme Y-axis rotation speed for dramatic effect
    };
  }

  init() {
    // Initialize camera target to current position to avoid initial jump
    this.cameraTarget.position.copy(this.camera.position);
  }

  updateCameraFollow(guideSphere, ground, directionalLight, deltaTime) {
    if (!guideSphere) return;
    
    // Update orbital angle for continuous rotation (frame-rate independent)
    this.cameraTarget.orbitAngle += this.cameraTarget.orbitSpeed * deltaTime * 60;
    
    // Update Y-axis rotation angle for gentle rolling motion (frame-rate independent)
    this.cameraTarget.yRotationAngle += this.cameraTarget.yRotationSpeed * deltaTime * 60;
    
    // Update zoom time for oscillating radius (frame-rate independent)
    this.cameraTarget.zoomTime += this.cameraTarget.zoomSpeed * deltaTime * 60;
    
    // Calculate dynamic orbit radius with zoom effect
    const zoomOffset = Math.sin(this.cameraTarget.zoomTime) * this.cameraTarget.zoomAmplitude;
    const currentRadius = Math.max(
      this.cameraTarget.minRadius, 
      Math.min(
        this.cameraTarget.maxRadius, 
        this.cameraTarget.orbitRadius + zoomOffset
      )
    );
    
    // Calculate dynamic height with dramatic vertical oscillation
    const heightTime = this.cameraTarget.zoomTime * 1.5; // Different frequency for height
    const heightOffset = Math.sin(heightTime) * (this.cameraTarget.orbitHeight - 0.2); // Oscillate from very low to high
    const currentHeight = Math.max(3.0, this.cameraTarget.orbitHeight * 0.2 + heightOffset); // Base height + oscillation, minimum at house height
    
    // Calculate orbital position around guide sphere with dynamic radius and height
    const spherePos = guideSphere.position;
    const orbitX = spherePos.x + Math.cos(this.cameraTarget.orbitAngle) * currentRadius;
    const orbitZ = spherePos.z + Math.sin(this.cameraTarget.orbitAngle) * currentRadius;
    const orbitY = spherePos.y + currentHeight;
    
    const desiredPosition = new THREE.Vector3(orbitX, orbitY, orbitZ);
    
    // Smoothly interpolate camera target position
    this.cameraTarget.position.lerp(desiredPosition, this.cameraTarget.smoothness);
    
    // Apply smoothed position to actual camera
    this.camera.position.copy(this.cameraTarget.position);
    
    // Always look directly at guide sphere for perfect centering (no smoothing)
    this.camera.lookAt(spherePos);
    
    // Apply gentle Y-axis rotation around the camera's local Y axis
    this.camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), this.cameraTarget.yRotationSpeed * deltaTime * 60);
    
    // Update ground position to follow guide sphere so it never disappears
    if (ground) {
      ground.position.x = spherePos.x;
      ground.position.z = spherePos.z;
    }
    
    // Update directional light to follow guide sphere
    if (directionalLight) {
      // Position light above and slightly ahead of guide sphere
      const lightOffset = {
        x: 5,  // Offset from guide sphere
        y: 12, // Height above guide sphere
        z: 5   // Slightly ahead
      };
      
      directionalLight.position.set(
        spherePos.x + lightOffset.x,
        spherePos.y + lightOffset.y,
        spherePos.z + lightOffset.z
      );
      
      // Make light point towards guide sphere for better illumination
      directionalLight.target.position.copy(spherePos);
      directionalLight.target.updateMatrixWorld();
    }
    
    // Update the camera matrix
    this.camera.updateMatrixWorld();
  }

  handleResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }
}

export default CameraSystem;