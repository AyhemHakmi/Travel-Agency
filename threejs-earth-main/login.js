import * as THREE from 'three';

// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 2;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Position renderer's canvas at the bottom left
renderer.domElement.style.position = 'fixed';
renderer.domElement.style.bottom = '0';
renderer.domElement.style.left = '0';
renderer.domElement.style.zIndex = '1';

// Load textures
const loader = new THREE.TextureLoader();
const earthTexture = loader.load("textures/8081_earthspec10k.jpg");
earthTexture.colorSpace = THREE.SRGBColorSpace;

// Create Earth mesh
const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
// Position Earth at the bottom left of the scene
earthMesh.position.set(3, -2.0, -0.5);
scene.add(earthMesh);

// --- Create flying planes with smoke trails ---

// Simple plane geometry (a small box as a placeholder for a plane)
const planeGeometry = new THREE.BoxGeometry(0.2, 0.1, 0.05);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });

// First plane
const plane1 = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane1);
plane1.position.set(3, 0.5, 0);

// Second plane
const plane2 = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane2);
plane2.position.set(3, -0.5, 0);

// Create smoke trails using sprites
// (Ensure you have a smoke texture at the specified path or replace with your own)
const smokeTexture = loader.load("textures/smoke.png");
const smokeMaterial = new THREE.SpriteMaterial({
  map: smokeTexture,
  transparent: true,
  opacity: 0.5,
});

// Smoke for plane1
const smoke1 = new THREE.Sprite(smokeMaterial);
scene.add(smoke1);
smoke1.scale.set(0.5, 0.5, 0.5);
smoke1.position.copy(plane1.position);

// Smoke for plane2
const smoke2 = new THREE.Sprite(smokeMaterial);
scene.add(smoke2);
smoke2.scale.set(0.5, 0.5, 0.5);
smoke2.position.copy(plane2.position);

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate Earth slowly
  earthMesh.rotation.y += 0.001;

  // Animate plane1: move left and loop back to the right
  plane1.position.x -= 0.01;
  if (plane1.position.x < -3) {
    plane1.position.x = 3;
  }
  // Update smoke to follow plane1 with a slight offset
  smoke1.position.lerp(plane1.position.clone().add(new THREE.Vector3(-0.3, 0, 0)), 0.05);

  // Animate plane2 similarly with a slightly slower speed
  plane2.position.x -= 0.008;
  if (plane2.position.x < -3) {
    plane2.position.x = 3;
  }
  smoke2.position.lerp(plane2.position.clone().add(new THREE.Vector3(-0.3, 0, 0)), 0.05);

  renderer.render(scene, camera);
}
animate();

// Update renderer on window resize
window.addEventListener('resize', () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
});
<script type="importmap">
    {"imports"}: {"three"}: "https://cdn.jsdelivr.net/npm/three@0.161/build/three.module.js",
    "jsm/": "https://cdn.jsdelivr.net/npm/three@0.161/examples/jsm/"
    }
    }
</script>;
