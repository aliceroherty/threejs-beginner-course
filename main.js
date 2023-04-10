import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let scene, camera, renderer, torus, controls, moon, jeff;

const init = () => {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	renderer = new THREE.WebGLRenderer({
		canvas: document.querySelector('#bg'),
	});

	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	// Move camera from center of workspace
	camera.position.setZ(30);
	camera.position.setX(-1);

	// Create ring object
	const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
	const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
	torus = new THREE.Mesh(geometry, material);
	scene.add(torus);

	// Add lighting
	const pointLight = new THREE.PointLight(0xffffff);
	pointLight.position.set(5, 5, 5);

	const ambientLight = new THREE.AmbientLight(0xffffff);

	scene.add(pointLight, ambientLight);

	// Setup light helper to show where lights are in scene
	const lightHelper = new THREE.PointLightHelper(pointLight);
	scene.add(lightHelper);

	// Setup grid helper to display grid in scene
	const gridHelper = new THREE.GridHelper(200, 50);
	scene.add(gridHelper);

	// Add orbit controls to allow the camera to be moved with the mouse
	controls = new OrbitControls(camera, renderer.domElement);

	// Add 200 stars to scene
	Array(200).fill().forEach(addStar);

	// Add space texture
	const spaceTexture = new THREE.TextureLoader().load('space.jpg');
	scene.background = spaceTexture;

	// Create cube with image on faces
	const jeffTexture = new THREE.TextureLoader().load('jeff.png');
	jeff = new THREE.Mesh(
		new THREE.BoxGeometry(3, 3, 3),
		new THREE.MeshBasicMaterial({ map: jeffTexture })
	);
	scene.add(jeff);

	// Create moon
	const moonTexture = new THREE.TextureLoader().load('moon.jpg');
	const normalTexture = new THREE.TextureLoader().load('normal.jpg');
	moon = new THREE.Mesh(
		new THREE.SphereGeometry(3, 32, 32),
		new THREE.MeshStandardMaterial({
			map: moonTexture,
			normalMap: normalTexture,
		})
	);
	moon.position.z = 30;
	moon.position.setX(-10);
	scene.add(moon);
};

const animate = () => {
	requestAnimationFrame(animate);

	torus.rotation.x += 0.01;
	torus.rotation.y += 0.005;
	torus.rotation.z += 0.01;

	controls.update();

	renderer.render(scene, camera);
};

const addStar = () => {
	const geometry = new THREE.SphereGeometry(0.25, 24, 24);
	const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
	const star = new THREE.Mesh(geometry, material);

	const [x, y, z] = Array(3)
		.fill()
		.map(() => THREE.MathUtils.randFloatSpread(100));

	star.position.set(x, y, z);
	scene.add(star);
};

const moveCamera = () => {
	const t = document.body.getBoundingClientRect().top;

	moon.rotation.x += 0.05;
	moon.rotation.y += 0.075;
	moon.rotation.z += 0.05;

	jeff.rotation.y += 0.01;
	jeff.rotation.z += 0.01;

	camera.position.z = t * -0.01;
	camera.position.x = t * -0.001;
	camera.position.y = t * -0.0002;
};

document.body.onscroll = moveCamera;

init();
animate();
