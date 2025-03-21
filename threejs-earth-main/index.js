import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';

import { getFresnelMat } from "./src/getFresnelMat.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 2;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

renderer.domElement.style.position = 'fixed';
renderer.domElement.style.top = '40%';
renderer.domElement.style.zIndex = '-1';
scene.background = new THREE.Color(0xffffff);

renderer.toneMapping = THREE.ACESFilmicToneMapping;


const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180;
scene.add(earthGroup);

// Initialize OrbitControls and disable zoom
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false; // Disable zooming

const detail = 12;
const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, detail);

// Convert Earth texture to grayscale
const earthTexture = loader.load("./textures/8081_earthspec10k.jpg");
earthTexture.colorSpace = THREE.SRGBColorSpace;
const grayscaleEarthTexture = earthTexture.clone();


// Create a grayscale material
const grayscaleMaterial = new THREE.MeshBasicMaterial({
  map: grayscaleEarthTexture,
});

const earthMesh = new THREE.Mesh(geometry, grayscaleMaterial);
earthGroup.add(earthMesh);

const cloudsMat = new THREE.MeshStandardMaterial({
  map: loader.load("./textures/8081_earthspec10k.jpg"),
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
  alphaMap: loader.load('./textures/05_earthcloudmaptrans.jpg'),
});
const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
cloudsMesh.scale.setScalar(1.003);
earthGroup.add(cloudsMesh);

const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geometry, fresnelMat);
glowMesh.scale.setScalar(1.01);
earthGroup.add(glowMesh);


function animate() {
  requestAnimationFrame(animate);

  earthMesh.rotation.y += 0.002;
  cloudsMesh.rotation.y += 0.0023;
  glowMesh.rotation.y += 0.002;
  renderer.render(scene, camera);
}

animate();

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);

// Adjust the position of the Earth when scrolling
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY || window.pageYOffset;
  renderer.domElement.style.bottom = `${-scrollY}px`;
});