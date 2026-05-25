import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { landmarks, getLandmarkByLocation, Landmark } from '../data/landmarks';
import { planets, moon } from '../data/planets';
import InfoPanel from './InfoPanel';

interface EarthGlobeProps {
  onLocationSelect?: (landmark: Landmark | null, lat: number, lng: number) => void;
}

const EARTH_RADIUS = 1;
const MIN_ZOOM = 1.5;
const MAX_ZOOM = 10;

export default function EarthGlobe({ onLocationSelect }: EarthGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const earthRef = useRef<THREE.Mesh | null>(null);
  const animationRef = useRef<number>(0);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const planetMeshesRef = useRef<THREE.Mesh[]>([]);
  const moonMeshRef = useRef<THREE.Mesh | null>(null);
  const landmarkMarkersRef = useRef<THREE.Group[]>([]);
  const allClickableObjectsRef = useRef<THREE.Object3D[]>([]);
  
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  const latLngToVector3 = useCallback((lat: number, lng: number, radius: number = EARTH_RADIUS): THREE.Vector3 => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }, []);

  const vector3ToLatLng = useCallback((point: THREE.Vector3): { lat: number; lng: number } => {
    const normalized = point.clone().normalize();
    const lat = 90 - Math.acos(normalized.y) * (180 / Math.PI);
    const lng = Math.atan2(normalized.z, -normalized.x) * (180 / Math.PI) - 180;
    return { lat, lng };
  }, []);

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const createEarthTexture = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a4a6e');
    gradient.addColorStop(0.5, '#0f2847');
    gradient.addColorStop(1, '#1a4a6e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#2d5a3d';
    ctx.beginPath();
    ctx.ellipse(500, 250, 180, 120, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(550, 400, 100, 80, 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#1e4a2e';
    ctx.beginPath();
    ctx.ellipse(1050, 200, 250, 150, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(1100, 400, 120, 100, 0.5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.ellipse(1400, 250, 200, 100, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(1500, 450, 80, 120, 0.2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#2d5a3d';
    ctx.beginPath();
    ctx.ellipse(1700, 550, 100, 80, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#e8e8e8';
    ctx.beginPath();
    ctx.ellipse(500, 100, 300, 80, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(1000, 120, 400, 60, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(1500, 100, 300, 80, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f0f0f0';
    ctx.beginPath();
    ctx.ellipse(1024, 850, 400, 150, 0, 0, Math.PI * 2);
    ctx.fill();

    const noiseCanvas = document.createElement('canvas');
    noiseCanvas.width = canvas.width;
    noiseCanvas.height = canvas.height;
    const noiseCtx = noiseCanvas.getContext('2d')!;
    for (let i = 0; i < 50000; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      noiseCtx.fillStyle = `rgba(255,255,255,${Math.random() * 0.1})`;
      noiseCtx.fillRect(x, y, 1, 1);
    }
    ctx.globalAlpha = 0.3;
    ctx.drawImage(noiseCanvas, 0, 0);
    ctx.globalAlpha = 1;

    return new THREE.CanvasTexture(canvas);
  }, []);

  const createStarField = useCallback((count: number = 5000): THREE.Points => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const radius = 200 + Math.random() * 300;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const color = new THREE.Color();
      color.setHSL(0.55 + Math.random() * 0.1, 0.5, 0.8 + Math.random() * 0.2);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });

    return new THREE.Points(geometry, material);
  }, []);

  const createMarkerSprite = useCallback((landmark: Landmark): THREE.Sprite => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    let color = '#4d96ff';
    if (landmark.type === 'city') color = '#ff6b6b';
    else if (landmark.type === 'mountain') color = '#ffd93d';
    else if (landmark.type === 'ocean') color = '#6bcb77';
    else if (landmark.type === 'landmark') color = '#c084fc';
    else if (landmark.type === 'country') color = '#fb923c';

    ctx.shadowColor = color;
    ctx.shadowBlur = 15;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(64, 64, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(64, 64, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(64, 64, 6, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false
    });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(0.08, 0.08, 1);
    
    return sprite;
  }, []);

  const createLandmarkMarkers = useCallback((earth: THREE.Mesh) => {
    const markers: THREE.Group[] = [];
    const clickable: THREE.Object3D[] = [];
    
    landmarks.forEach((landmark) => {
      const group = new THREE.Group();
      group.userData = { landmark };

      const sprite = createMarkerSprite(landmark);
      sprite.userData = { landmark, isMarker: true };
      group.add(sprite);
      clickable.push(sprite);

      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 64;
      const ctx = canvas.getContext('2d')!;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.roundRect(0, 0, 256, 64, 12);
      ctx.fill();
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.roundRect(0, 0, 256, 64, 12);
      ctx.stroke();
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 24px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(landmark.name, 128, 32);

      const texture = new THREE.CanvasTexture(canvas);
      const labelMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false
      });
      const label = new THREE.Sprite(labelMaterial);
      label.scale.set(0.3, 0.075, 1);
      label.position.y = 0.06;
      label.visible = false;
      label.userData = { landmark, isLabel: true };
      group.add(label);
      clickable.push(label);

      const position = latLngToVector3(landmark.latitude, landmark.longitude, EARTH_RADIUS + 0.01);
      group.position.copy(position);
      
      group.userData.landmark = landmark;
      group.userData.label = label;
      group.userData.clickRadius = 0.15;
      
      earth.add(group);
      markers.push(group);
    });

    allClickableObjectsRef.current = clickable;
    return markers;
  }, [latLngToVector3, createMarkerSprite]);

  const createSolarSystem = useCallback((scene: THREE.Scene) => {
    const meshes: THREE.Mesh[] = [];
    const planetGroup = new THREE.Group();
    planetGroup.name = 'solarSystem';
    scene.add(planetGroup);

    planets.forEach((planet) => {
      if (planet.name === 'Sun') {
        const sunGeometry = new THREE.SphereGeometry(planet.radius * 0.5, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({
          color: planet.color,
          transparent: true,
          opacity: 0.9
        });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        sun.position.set(-60, 10, -40);
        planetGroup.add(sun);
        meshes.push(sun);

        const sunLight = new THREE.PointLight(0xffffff, 2, 500);
        sunLight.position.copy(sun.position);
        scene.add(sunLight);
      } else if (planet.name === 'Earth') {
      } else {
        const geometry = new THREE.SphereGeometry(planet.radius * 0.3, 16, 16);
        const material = new THREE.MeshStandardMaterial({
          color: planet.color,
          roughness: 0.8,
          metalness: 0.2
        });
        const mesh = new THREE.Mesh(geometry, material);
        
        const angle = Math.random() * Math.PI * 2;
        const distance = planet.distance * 2;
        mesh.position.set(
          Math.cos(angle) * distance - 30,
          Math.sin(angle * 0.5) * 5,
          Math.sin(angle) * distance - 20
        );
        mesh.userData = { planet, angle, distance };
        planetGroup.add(mesh);
        meshes.push(mesh);
      }
    });

    const moonGeometry = new THREE.SphereGeometry(moon.radius * 0.5, 16, 16);
    const moonMaterial = new THREE.MeshStandardMaterial({
      color: moon.color,
      roughness: 0.9,
      metalness: 0.1
    });
    const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
    moonMesh.position.set(5, 2, 5);
    moonMesh.userData = { angle: 0 };
    planetGroup.add(moonMesh);

    return { planetMeshes: meshes, moonMesh };
  }, []);

  const animateCameraToPosition = useCallback((target: THREE.Vector3) => {
    if (!cameraRef.current || !controlsRef.current) return;

    const camera = cameraRef.current;
    const controls = controlsRef.current;

    const startPosition = camera.position.clone();
    const endPosition = target.clone().multiplyScalar(2.5);
    const startTarget = controls.target.clone();
    const endTarget = target.clone();

    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      camera.position.lerpVectors(startPosition, endPosition, eased);
      controls.target.lerpVectors(startTarget, endTarget, eased);
      controls.update();

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, []);

  const resetCamera = useCallback(() => {
    if (!cameraRef.current || !controlsRef.current) return;

    const camera = cameraRef.current;
    const controls = controlsRef.current;

    const startPosition = camera.position.clone();
    const endPosition = new THREE.Vector3(0, 0, 4);
    const startTarget = controls.target.clone();
    const endTarget = new THREE.Vector3(0, 0, 0);

    const duration = 1000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      camera.position.lerpVectors(startPosition, endPosition, eased);
      controls.target.lerpVectors(startTarget, endTarget, eased);
      controls.update();

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
    setIsZoomed(false);
    setShowPanel(false);
    setSelectedLandmark(null);
    setSelectedCoords(null);
  }, []);

  const handleClick = useCallback((event: MouseEvent | TouchEvent) => {
    if (!earthRef.current || !cameraRef.current) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    let clientX: number, clientY: number;
    
    if ('touches' in event) {
      if (event.touches.length > 0) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      } else {
        return;
      }
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    mouseRef.current.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);

    let landmark: Landmark | null = null;
    let point: THREE.Vector3 | null = null;

    const markerIntersects = raycasterRef.current.intersectObjects(allClickableObjectsRef.current, false);
    
    if (markerIntersects.length > 0 && markerIntersects[0].object.userData.landmark) {
      landmark = markerIntersects[0].object.userData.landmark as Landmark;
      point = latLngToVector3(landmark.latitude, landmark.longitude, EARTH_RADIUS);
    }

    if (!landmark) {
      const earthIntersects = raycasterRef.current.intersectObject(earthRef.current);
      if (earthIntersects.length > 0) {
        point = earthIntersects[0].point;
        const coords = vector3ToLatLng(point);
        landmark = getLandmarkByLocation(coords.lat, coords.lng, 25);
      }
    }

    if (point) {
      const coords = landmark 
        ? { lat: landmark.latitude, lng: landmark.longitude } 
        : vector3ToLatLng(point);

      setSelectedCoords(coords);
      setSelectedLandmark(landmark);
      setShowPanel(true);
      setIsZoomed(true);

      animateCameraToPosition(point.clone().normalize());

      if (landmark) {
        speak(`${landmark.name}，${landmark.description}`);
        if (onLocationSelect) onLocationSelect(landmark, coords.lat, coords.lng);
      } else {
        const locationText = `纬度 ${coords.lat.toFixed(2)}°，经度 ${coords.lng.toFixed(2)}°`;
        speak(locationText);
        if (onLocationSelect) onLocationSelect(null, coords.lat, coords.lng);
      }
    }
  }, [vector3ToLatLng, animateCameraToPosition, speak, onLocationSelect, latLngToVector3]);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a1a);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 4);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = MIN_ZOOM;
    controls.maxDistance = MAX_ZOOM;
    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 0.8;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI / 2 - 0.5;
    controls.maxPolarAngle = Math.PI / 2 + 0.5;
    controlsRef.current = controls;

    const starField = createStarField();
    scene.add(starField);

    const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: createEarthTexture(),
      bumpScale: 0.05,
      specular: new THREE.Color(0x333333),
      shininess: 5
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);
    earthRef.current = earth;

    const atmosphereGeometry = new THREE.SphereGeometry(EARTH_RADIUS * 1.08, 64, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x4a9eff,
      transparent: true,
      opacity: 0.2,
      side: THREE.BackSide
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    earth.add(atmosphere);

    const markers = createLandmarkMarkers(earth);
    landmarkMarkersRef.current = markers;

    const { planetMeshes, moonMesh } = createSolarSystem(scene);
    planetMeshesRef.current = planetMeshes;
    moonMeshRef.current = moonMesh;

    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    renderer.domElement.addEventListener('click', handleClick);

    let time = 0;
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      time += 0.001;

      if (earthRef.current && !isZoomed) {
        earthRef.current.rotation.y += 0.0005;
      }

      if (moonMeshRef.current) {
        moonMeshRef.current.userData.angle += 0.005;
        const angle = moonMeshRef.current.userData.angle;
        moonMeshRef.current.position.x = Math.cos(angle) * 5;
        moonMeshRef.current.position.z = Math.sin(angle) * 5;
        moonMeshRef.current.position.y = Math.sin(angle * 0.5) * 1;
      }

      planetMeshesRef.current.forEach((mesh) => {
        if (mesh.userData.planet && mesh.userData.planet.name !== 'Sun') {
          mesh.userData.angle += 0.001;
          const angle = mesh.userData.angle;
          const distance = mesh.userData.distance;
          mesh.position.x = Math.cos(angle) * distance - 30;
          mesh.position.z = Math.sin(angle) * distance - 20;
        }
      });

      if (cameraRef.current && controlsRef.current) {
        const distance = cameraRef.current.position.length();
        const showLabels = distance < 3.5;
        
        landmarkMarkersRef.current.forEach((group) => {
          const label = group.userData.label;
          if (label) {
            label.visible = showLabels;
          }
        });
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleClick);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [createStarField, createEarthTexture, createLandmarkMarkers, createSolarSystem, handleClick, isZoomed]);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <button
          onClick={resetCamera}
          className="px-4 py-2 bg-black/50 text-white rounded-lg backdrop-blur-sm hover:bg-black/70 transition-colors text-sm"
        >
          重置视角
        </button>
      </div>

      <div className="absolute top-4 left-4 z-10">
        <div className="px-4 py-2 bg-black/50 text-white rounded-lg backdrop-blur-sm text-sm">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></span>
            <span>城市</span>
            <span className="w-3 h-3 rounded-full bg-yellow-400 ml-2 shadow-lg shadow-yellow-400/50"></span>
            <span>山脉</span>
            <span className="w-3 h-3 rounded-full bg-green-500 ml-2 shadow-lg shadow-green-500/50"></span>
            <span>海洋</span>
            <span className="w-3 h-3 rounded-full bg-purple-500 ml-2 shadow-lg shadow-purple-500/50"></span>
            <span>地标</span>
            <span className="w-3 h-3 rounded-full bg-orange-500 ml-2 shadow-lg shadow-orange-500/50"></span>
            <span>地区</span>
          </div>
        </div>
      </div>

      {showPanel && (
        <InfoPanel
          landmark={selectedLandmark}
          coords={selectedCoords}
          onClose={() => {
            setShowPanel(false);
            window.speechSynthesis?.cancel();
          }}
        />
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
        <div className="px-4 py-2 bg-black/50 text-white/80 rounded-lg backdrop-blur-sm text-xs">
          拖拽旋转地球 | 滚轮缩放 | 点击标记或地名探索
        </div>
      </div>
    </div>
  );
}
