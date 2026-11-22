import * as THREE from 'three';
import './..//styles.css';

const app = document.querySelector('#app');

app.innerHTML = `
  <canvas id="game-canvas" aria-label="VANGUARD: Tactical Ops"></canvas>
  <main class="menu-shell" id="main-menu">
    <section class="brand-panel">
      <div>
        <div class="brand-mark" aria-hidden="true"></div>
        <h1 class="brand-name">VANGUARD</h1>
        <div class="brand-subtitle">TACTICAL OPS</div>
      </div>

      <nav class="menu-actions" aria-label="Menu principal">
        <button class="menu-button primary" id="play-button">INICIAR OPERAÇÃO</button>
        <button class="menu-button" id="map-button">SELEÇÃO DE MAPA</button>
        <button class="menu-button" id="operator-button">OPERADOR</button>
        <button class="menu-button" id="settings-button">CONFIGURAÇÕES</button>
      </nav>

      <div class="status-card">
        <div><strong>PORTO NÔMADA</strong></div>
        <div>PROTOCOLO LOCAL • 5 CONTRA 5</div>
        <div>JOGADORES: BOTS HUMANIZADOS</div>
      </div>
    </section>

    <section class="viewport-panel" aria-label="Mapa em destaque">
      <article class="selection-card">
        <h2>Porto Nômada</h2>
        <p>Plataformas industriais, terminais marítimos e rotas controladas para combate tático.</p>
      </article>
    </section>
  </main>
  <div id="hud" aria-live="polite"></div>
`;

const canvas = document.querySelector('#game-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x091522);
scene.fog = new THREE.FogExp2(0x091522, 0.006);

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.set(18, 7, 24);
camera.lookAt(0, 2, 0);

const hemi = new THREE.HemisphereLight(0x8bb9d8, 0x18202a, 1.8);
scene.add(hemi);

const sun = new THREE.DirectionalLight(0xcbe6ff, 2.2);
sun.position.set(-20, 35, 18);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
scene.add(sun);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(140, 140),
  new THREE.MeshStandardMaterial({ color: 0x263746, roughness: 0.82, metalness: 0.12 })
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

const clock = new THREE.Clock();
let menuActive = true;

function animate() {
  const elapsed = clock.getElapsedTime();
  if (menuActive) {
    camera.position.x = 18 + Math.sin(elapsed * 0.12) * 4;
    camera.lookAt(0, 2, 0);
  }
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

document.querySelector('#play-button').addEventListener('click', () => {
  menuActive = false;
  document.querySelector('#main-menu').remove();
  document.querySelector('#hud').classList.add('active');
  document.querySelector('#hud').textContent = 'Operação iniciando...';
});

animate();
