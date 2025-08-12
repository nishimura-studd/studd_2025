// ガイド球体システム - 移動する球体の管理
import * as THREE from 'three';

export class GuideSphere {
  constructor(scene) {
    this.scene = scene;
    this.guideSphere = null;
    
    // Movement properties
    this.sphereMovement = {
      time: 0,
      speed: 0.03, // Increased by 1.5x from 0.02 to 0.03
      forwardSpeed: 3.75, // Increased by 1.5x from 2.5 to 3.75
      currentX: 0, // Current X position (left-right wandering)
      targetX: 0,  // Target X position to wander towards
      nextRandomTime: 0,
      offsetSmoothness: 0.08, // Keep smoothness the same
      currentZ: 0 // Current forward progress
    };
  }

  create() {
    const geometry = new THREE.SphereGeometry(0.025, 16, 16); // Sphere with radius 0.025
    const material = new THREE.MeshLambertMaterial({ color: 0xff0000 }); // Red color
    this.guideSphere = new THREE.Mesh(geometry, material);
    this.guideSphere.position.y = 0.1; // Position higher above the ground for better visibility
    this.guideSphere.castShadow = true;
    this.guideSphere.visible = false; // Hide the guide sphere
    this.scene.add(this.guideSphere);
    
    return this.guideSphere;
  }

  updateMovement(deltaTime) {
    if (!this.guideSphere) return;
    
    // Frame-rate independent time progression
    this.sphereMovement.time += this.sphereMovement.speed * deltaTime * 60;
    
    // Always move forward (never return to previous Z positions) - frame-rate independent
    this.sphereMovement.currentZ += this.sphereMovement.forwardSpeed * this.sphereMovement.speed * deltaTime * 60;
    
    // Update target X position periodically for left-right wandering
    if (this.sphereMovement.time > this.sphereMovement.nextRandomTime) {
      this.sphereMovement.targetX = (Math.random() - 0.5) * 40; // Wider range for X wandering
      this.sphereMovement.nextRandomTime = this.sphereMovement.time + Math.random() * 3 + 1; // 1-4 seconds
    }
    
    // Smoothly interpolate current X towards target X (frame-rate independent)
    const lerpAmount = this.sphereMovement.offsetSmoothness * deltaTime * 60;
    this.sphereMovement.currentX += (this.sphereMovement.targetX - this.sphereMovement.currentX) * lerpAmount;
    
    // Set sphere position - always progressing forward in Z, wandering in X
    this.guideSphere.position.x = this.sphereMovement.currentX;
    this.guideSphere.position.z = this.sphereMovement.currentZ;
    this.guideSphere.position.y = 0.1; // Keep higher above ground for better visibility
    
    // Frame-rate independent rotation
    this.guideSphere.rotation.x += 0.01 * deltaTime * 60;
    this.guideSphere.rotation.y += 0.016 * deltaTime * 60;
    this.guideSphere.rotation.z += 0.006 * deltaTime * 60;
  }

  triggerAnimation() {
    if (!this.guideSphere) return;
    
    // Simple animation: scale up briefly when sound is triggered
    const originalScale = this.guideSphere.scale.clone();
    this.guideSphere.scale.set(1.5, 1.5, 1.5);
    
    // Return to original scale after 200ms
    setTimeout(() => {
      if (this.guideSphere) {
        this.guideSphere.scale.copy(originalScale);
      }
    }, 200);
  }

  onLoopChange() {
    if (!this.guideSphere) return;
    
    // Rotate the sphere when loop changes
    this.guideSphere.rotation.y += Math.PI / 4;
  }

  getSphere() {
    return this.guideSphere;
  }

  // インタラクティブモードに設定
  setInteractiveMode() {
    // インタラクティブモードでもオートモードと同じ動きを継続
    console.log('GuideSphere: インタラクティブモード - オートモードと同じ動きを継続します');
  }

  // オートモードに設定
  setAutoMode() {
    // 移動システムをリセット
    this.sphereMovement.time = 0;
    this.sphereMovement.currentX = 0;
    this.sphereMovement.targetX = 0;
    this.sphereMovement.currentZ = 0;
    this.sphereMovement.nextRandomTime = 0;
  }

  dispose() {
    if (this.guideSphere && this.scene) {
      this.scene.remove(this.guideSphere);
      this.guideSphere = null;
    }
  }
}

export default GuideSphere;