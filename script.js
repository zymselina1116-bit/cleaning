import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ========================
// Scene Setup
// ========================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe8d4b8); // Warm beige background

const container = document.getElementById('canvas-container');
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// Position camera for isometric-like view (slightly top-down)
camera.position.set(8, 6, 8);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

// ========================
// Lighting (Hozy Style)
// ========================
// Ambient light for overall brightness
const ambientLight = new THREE.AmbientLight(0xfff4e6, 0.6);
scene.add(ambientLight);

// Hemisphere light for soft indirect bounce
const hemisphereLight = new THREE.HemisphereLight(
    0xfff4e6, // sky color - warm white
    0xb8956a, // ground color - warm brown
    0.4
);
scene.add(hemisphereLight);

// Directional light with soft shadows
const directionalLight = new THREE.DirectionalLight(0xfff4e6, 0.8);
directionalLight.position.set(5, 8, 3);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;
directionalLight.shadow.camera.left = -10;
directionalLight.shadow.camera.right = 10;
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = -10;
directionalLight.shadow.bias = -0.0001;
scene.add(directionalLight);

// ========================
// Materials (Placeholder)
// ========================
const wallpaperMaterial = new THREE.MeshStandardMaterial({
    color: 0xf5e6d3, // Cream wallpaper
    roughness: 0.9,
    metalness: 0.1
});

const dirtyWallOverlay = new THREE.MeshStandardMaterial({
    color: 0x8b9d6f, // Greenish stains
    roughness: 0.95,
    metalness: 0.0,
    transparent: true,
    opacity: 0.3
});

const woodFloorMaterial = new THREE.MeshStandardMaterial({
    color: 0xc19a6b, // Warm wood color
    roughness: 0.7,
    metalness: 0.1
});

const dirtyFloorMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a3a2a, // Dark mud/grime
    roughness: 0.95,
    metalness: 0.0,
    transparent: true,
    opacity: 0.4
});

const roofWallMaterial = new THREE.MeshStandardMaterial({
    color: 0xe8d5c4, // Light beige for roof
    roughness: 0.85,
    metalness: 0.1
});

const brickMaterial = new THREE.MeshStandardMaterial({
    color: 0xa0826d, // Brick color
    roughness: 0.9,
    metalness: 0.0
});

// ========================
// Room Geometry
// ========================
const roomGroup = new THREE.Group();

// Left Wall (vertical)
const leftWallGeometry = new THREE.BoxGeometry(0.2, 5, 6);
const leftWall = new THREE.Mesh(leftWallGeometry, wallpaperMaterial);
leftWall.position.set(-3, 2.5, 0);
leftWall.castShadow = true;
leftWall.receiveShadow = true;
roomGroup.add(leftWall);

// Dirty overlay on left wall
const leftWallDirtyGeometry = new THREE.PlaneGeometry(5.8, 4.8);
const leftWallDirty = new THREE.Mesh(leftWallDirtyGeometry, dirtyWallOverlay);
leftWallDirty.position.set(-2.9, 2.5, 0);
leftWallDirty.rotation.y = Math.PI / 2;
roomGroup.add(leftWallDirty);

// Angled Roof-Wall (right side, slanted at ~45 degrees)
const roofWallGeometry = new THREE.BoxGeometry(6, 0.2, 6);
const roofWall = new THREE.Mesh(roofWallGeometry, roofWallMaterial);
roofWall.position.set(1, 4, 0);
roofWall.rotation.z = -Math.PI / 4; // 45-degree angle
roofWall.castShadow = true;
roofWall.receiveShadow = true;
roomGroup.add(roofWall);

// Floor Platform with bevel/trim
const floorGeometry = new THREE.BoxGeometry(7, 0.3, 6);
const floor = new THREE.Mesh(floorGeometry, woodFloorMaterial);
floor.position.set(0.5, 0, 0);
floor.receiveShadow = true;
roomGroup.add(floor);

// Floor trim/bevel (rounded edge effect with small boxes)
const trimMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b6f47, // Darker wood for trim
    roughness: 0.8,
    metalness: 0.1
});

// Front trim
const frontTrimGeometry = new THREE.BoxGeometry(7, 0.15, 0.2);
const frontTrim = new THREE.Mesh(frontTrimGeometry, trimMaterial);
frontTrim.position.set(0.5, -0.075, 3.1);
frontTrim.receiveShadow = true;
roomGroup.add(frontTrim);

// Dirty floor overlay
const dirtyFloorGeometry = new THREE.PlaneGeometry(6.8, 5.8);
const dirtyFloor = new THREE.Mesh(dirtyFloorGeometry, dirtyFloorMaterial);
dirtyFloor.position.set(0.5, 0.16, 0);
dirtyFloor.rotation.x = -Math.PI / 2;
roomGroup.add(dirtyFloor);

// Broken bricks along edges (stylistic, low poly)
function createBrick(x, y, z) {
    const brickGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.4);
    const brick = new THREE.Mesh(brickGeometry, brickMaterial);
    brick.position.set(x, y, z);
    brick.rotation.set(
        Math.random() * 0.3,
        Math.random() * 0.5,
        Math.random() * 0.3
    );
    brick.castShadow = true;
    brick.receiveShadow = true;
    return brick;
}

// Add broken bricks along wall edges
roomGroup.add(createBrick(-2.8, 0.1, -2.5));
roomGroup.add(createBrick(-2.8, 0.1, 2.3));
roomGroup.add(createBrick(-2.7, 4.5, -1.5));
roomGroup.add(createBrick(3.2, 0.1, -2.8));
roomGroup.add(createBrick(2.8, 0.1, 2.5));

scene.add(roomGroup);

// ========================
// Objects in Room (Temp)
// ========================
const objectsGroup = new THREE.Group();

// Trash material
const trashMaterial = new THREE.MeshStandardMaterial({
    color: 0x654321,
    roughness: 0.85,
    metalness: 0.1
});

// Track all trash cubes for interaction
const trashCubes = [];

// Trash cubes scattered on floor
function createTrashCube(x, z, size) {
    const geometry = new THREE.BoxGeometry(size, size, size);
    const cube = new THREE.Mesh(geometry, trashMaterial.clone());
    cube.position.set(x, 0.15 + size / 2, z);
    cube.rotation.set(
        Math.random() * 0.3,
        Math.random() * Math.PI,
        Math.random() * 0.3
    );
    cube.castShadow = true;
    cube.receiveShadow = true;

    // Mark as trash for raycaster
    cube.userData.isTrash = true;
    cube.userData.originalColor = 0x654321;
    cube.userData.size = size;

    // Fake shadow beneath (ambient occlusion effect)
    const shadowGeometry = new THREE.CircleGeometry(size * 0.7, 16);
    const shadowMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.3
    });
    const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
    shadow.position.set(x, 0.16, z);
    shadow.rotation.x = -Math.PI / 2;
    objectsGroup.add(shadow);

    // Link shadow to cube for cleanup
    cube.userData.shadow = shadow;

    return cube;
}

// Create and track trash cubes
trashCubes.push(createTrashCube(-1, 1, 0.3));
trashCubes.push(createTrashCube(1.5, -0.5, 0.25));
trashCubes.push(createTrashCube(0.5, 1.5, 0.35));
trashCubes.push(createTrashCube(-0.5, -1, 0.2));
trashCubes.push(createTrashCube(2, 0.8, 0.28));

trashCubes.forEach(cube => objectsGroup.add(cube));

// Green trash bin in back right corner
const binGeometry = new THREE.CylinderGeometry(0.4, 0.5, 0.8, 8);
const binMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a7c59, // Green
    roughness: 0.7,
    metalness: 0.2
});
const bin = new THREE.Mesh(binGeometry, binMaterial);
bin.position.set(2.5, 0.55, -2);
bin.castShadow = true;
bin.receiveShadow = true;
objectsGroup.add(bin);

// Bin shadow
const binShadowGeometry = new THREE.CircleGeometry(0.5, 16);
const binShadowMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.3
});
const binShadow = new THREE.Mesh(binShadowGeometry, binShadowMaterial);
binShadow.position.set(2.5, 0.16, -2);
binShadow.rotation.x = -Math.PI / 2;
objectsGroup.add(binShadow);

// Cans/blocks lying around
function createCan(x, z) {
    const canGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.3, 8);
    const canMaterial = new THREE.MeshStandardMaterial({
        color: 0xc0c0c0, // Silver
        roughness: 0.4,
        metalness: 0.7
    });
    const can = new THREE.Mesh(canGeometry, canMaterial);
    can.position.set(x, 0.15, z);
    can.rotation.set(Math.PI / 2, 0, Math.random() * Math.PI);
    can.castShadow = true;
    can.receiveShadow = true;

    // Can shadow
    const shadowGeometry = new THREE.CircleGeometry(0.15, 16);
    const shadowMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.25
    });
    const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
    shadow.position.set(x, 0.16, z);
    shadow.rotation.x = -Math.PI / 2;
    objectsGroup.add(shadow);

    return can;
}

objectsGroup.add(createCan(-2, 0.5));
objectsGroup.add(createCan(1, -1.5));
objectsGroup.add(createCan(-1.5, -0.8));

scene.add(objectsGroup);

// ========================
// Camera Controls (Limited Orbit)
// ========================
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;

// Limit rotation range for diorama feel
controls.minPolarAngle = Math.PI / 6; // 30 degrees from top
controls.maxPolarAngle = Math.PI / 2.5; // Don't go below 72 degrees

controls.minAzimuthAngle = -Math.PI / 3; // -60 degrees
controls.maxAzimuthAngle = Math.PI / 3; // +60 degrees

// Limit zoom
controls.minDistance = 5;
controls.maxDistance = 15;

// Slow rotation speed
controls.rotateSpeed = 0.3;
controls.zoomSpeed = 0.5;

// Disable panning and keys (no WASD)
controls.enablePan = false;
controls.enableKeys = false;

// Set target to center of room
controls.target.set(0, 1.5, 0);
controls.update();

// ========================
// PHASE 1 - Trash Pickup System
// ========================
let currentPhase = 1;
let remainingTrashCount = trashCubes.length;
let selectedTrash = null;
let isDragging = false;

// Raycaster and mouse tracking
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const intersectionPoint = new THREE.Vector3();

// Update mouse coordinates
function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // If dragging trash, move it along floor plane
    if (isDragging && selectedTrash) {
        raycaster.setFromCamera(mouse, camera);
        raycaster.ray.intersectPlane(floorPlane, intersectionPoint);

        if (intersectionPoint) {
            selectedTrash.position.x = intersectionPoint.x;
            selectedTrash.position.z = intersectionPoint.z;
            selectedTrash.position.y = 0.3; // Keep slightly above floor

            // Update shadow position
            if (selectedTrash.userData.shadow) {
                selectedTrash.userData.shadow.position.x = intersectionPoint.x;
                selectedTrash.userData.shadow.position.z = intersectionPoint.z;
            }
        }
    }

    // If in Phase 2, move active tool
    if (currentPhase === 2 && activeTool) {
        raycaster.setFromCamera(mouse, camera);
        raycaster.ray.intersectPlane(floorPlane, intersectionPoint);

        if (intersectionPoint) {
            activeTool.position.copy(intersectionPoint);
            activeTool.position.y = 0.5; // Keep tool above floor
        }
    }
}

// Handle mouse down (start dragging)
function onMouseDown(event) {
    if (currentPhase !== 1) return;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(trashCubes);

    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;

        if (clickedObject.userData.isTrash) {
            selectedTrash = clickedObject;
            isDragging = true;
            controls.enabled = false; // Disable orbit while dragging

            // Highlight trash (slightly brighter)
            selectedTrash.material.color.setHex(0x8b6239);
        }
    }
}

// Handle mouse up (stop dragging, check bin collision)
function onMouseUp(event) {
    if (currentPhase !== 1 || !selectedTrash) return;

    isDragging = false;
    controls.enabled = true;

    // Check collision with trash bin
    const trashBox = new THREE.Box3().setFromObject(selectedTrash);
    const binBox = new THREE.Box3().setFromObject(bin);

    if (trashBox.intersectsBox(binBox)) {
        // Trash successfully thrown in bin!
        removeTrash(selectedTrash);
        remainingTrashCount--;

        console.log(`Trash removed! Remaining: ${remainingTrashCount}`);

        // Check if all trash is cleaned
        if (remainingTrashCount === 0) {
            transitionToPhase2();
        }
    } else {
        // Reset color if not thrown in bin
        selectedTrash.material.color.setHex(selectedTrash.userData.originalColor);
    }

    selectedTrash = null;
}

// Remove trash from scene
function removeTrash(trash) {
    // Small scale animation
    const startScale = trash.scale.clone();
    const animationDuration = 300; // ms
    const startTime = Date.now();

    function animateRemoval() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / animationDuration, 1);
        const scale = 1 - progress;

        trash.scale.copy(startScale).multiplyScalar(scale);

        if (progress < 1) {
            requestAnimationFrame(animateRemoval);
        } else {
            // Remove from scene
            scene.remove(trash);
            if (trash.userData.shadow) {
                scene.remove(trash.userData.shadow);
            }

            // Remove from array
            const index = trashCubes.indexOf(trash);
            if (index > -1) {
                trashCubes.splice(index, 1);
            }
        }
    }

    animateRemoval();
}

// Transition to Phase 2
function transitionToPhase2() {
    console.log('All trash cleaned! Transitioning to Phase 2...');
    currentPhase = 2;

    // Remove bin and its shadow
    scene.remove(bin);
    scene.remove(binShadow);

    // Show tool selection UI
    document.getElementById('tool-ui').style.display = 'flex';
}

// Add event listeners for Phase 1
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('mousedown', onMouseDown);
window.addEventListener('mouseup', onMouseUp);

// ========================
// PHASE 2 - Tool Selection System
// ========================
let currentTool = null;
let activeTool = null; // The 3D tool mesh

// Tool selection handler
function selectTool(toolName) {
    currentTool = toolName;
    console.log(`Selected tool: ${toolName}`);

    // Update UI highlights
    document.querySelectorAll('.tool-button').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Remove previous tool mesh if exists
    if (activeTool) {
        scene.remove(activeTool);
    }

    // Spawn new tool mesh
    activeTool = createToolMesh(toolName);
    scene.add(activeTool);
}

// Create 3D tool mesh based on type
function createToolMesh(toolName) {
    let toolMesh;

    if (toolName === 'Mop') {
        // Create a simple mop (stick + flat head)
        const group = new THREE.Group();

        // Stick
        const stickGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8);
        const stickMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b4513,
            roughness: 0.8
        });
        const stick = new THREE.Mesh(stickGeometry, stickMaterial);
        stick.position.y = 0.75;
        group.add(stick);

        // Mop head
        const headGeometry = new THREE.BoxGeometry(0.3, 0.1, 0.3);
        const headMaterial = new THREE.MeshStandardMaterial({
            color: 0xf0f0f0,
            roughness: 0.9
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 0;
        group.add(head);

        toolMesh = group;

    } else if (toolName === 'Sponge') {
        // Create a sponge (rounded box)
        const geometry = new THREE.BoxGeometry(0.3, 0.2, 0.4);
        const material = new THREE.MeshStandardMaterial({
            color: 0xffeb3b,
            roughness: 0.9
        });
        toolMesh = new THREE.Mesh(geometry, material);

    } else if (toolName === 'Brush') {
        // Create a brush (handle + bristles)
        const group = new THREE.Group();

        // Handle
        const handleGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.6, 8);
        const handleMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b4513,
            roughness: 0.8
        });
        const handle = new THREE.Mesh(handleGeometry, handleMaterial);
        handle.position.y = 0.3;
        group.add(handle);

        // Bristles
        const bristlesGeometry = new THREE.BoxGeometry(0.2, 0.15, 0.2);
        const bristlesMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a4a4a,
            roughness: 0.95
        });
        const bristles = new THREE.Mesh(bristlesGeometry, bristlesMaterial);
        bristles.position.y = 0;
        group.add(bristles);

        toolMesh = group;
    }

    toolMesh.castShadow = true;
    toolMesh.position.set(0, 0.5, 0);

    return toolMesh;
}

// Make selectTool globally accessible
window.selectTool = selectTool;

// ========================
// Animation Loop
// ========================
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// ========================
// Window Resize Handler
// ========================
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate();

console.log('Hozy-style 3D room loaded successfully!');
