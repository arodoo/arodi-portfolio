import { Injectable, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import { PLYLoader } from 'three-stdlib';

@Injectable({
  providedIn: 'root'
})
export class ThreeLucyService {

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private spotLight!: THREE.SpotLight;
  private lightHelper!: THREE.SpotLightHelper;
  private controls!: OrbitControls;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  init(canvas: ElementRef<HTMLCanvasElement>): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setupRenderer(canvas);
      this.setupScene();
      this.setupCamera(canvas);
      this.setupControls();
      this.setupLighting();
      this.loadModels();
      this.addEventListeners();
      this.animate();
    }
  }

  private setupRenderer(canvas: ElementRef<HTMLCanvasElement>): void {
    this.renderer = new THREE.WebGLRenderer({ canvas: canvas.nativeElement, antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
  }

  private setupScene(): void {
    this.scene = new THREE.Scene();
  }

  private setupCamera(canvas: ElementRef<HTMLCanvasElement>): void {
    this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(7, 4, 1);
  }

  private setupControls(): void {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableZoom = false; // Deshabilitar zoom
    this.controls.minDistance = 2;
    this.controls.maxDistance = 10;
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.target.set(0, 1, 0);
    this.controls.update();
  }

  private setupLighting(): void {
    const ambient = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 0.15);
    this.scene.add(ambient);

    const loader = new THREE.TextureLoader().setPath('textures/');
    const textures = {
      'disturb.jpg': loader.load('disturb.jpg'),
      'colors.png': loader.load('colors.png'),
      'uv_grid_opengl.jpg': loader.load('uv_grid_opengl.jpg')
    };

    this.spotLight = new THREE.SpotLight(0xffffff, 100);
    this.spotLight.position.set(2.5, 5, 2.5);
    this.spotLight.angle = Math.PI / 6;
    this.spotLight.penumbra = 1;
    this.spotLight.decay = 2;
    this.spotLight.distance = 0;
    this.spotLight.map = textures['disturb.jpg'];
    this.spotLight.castShadow = true;
    this.spotLight.shadow.mapSize.width = 1024;
    this.spotLight.shadow.mapSize.height = 1024;
    this.spotLight.shadow.camera.near = 1;
    this.spotLight.shadow.camera.far = 10;
    this.spotLight.shadow.focus = 1;
    this.scene.add(this.spotLight);

    this.lightHelper = new THREE.SpotLightHelper(this.spotLight);
    //this.scene.add(this.lightHelper);

    const planeGeometry = new THREE.PlaneGeometry(200, 200);
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xbabcbc });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(0, -1, 0);
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    this.scene.add(plane);
  }

  private loadModels(): void {
    new PLYLoader().load('models/ply/binary/Lucy100k.ply', (geometry) => {
      geometry.scale(0.0024, 0.0024, 0.0024);
      geometry.computeVertexNormals();

      const material = new THREE.MeshLambertMaterial();
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.y = -Math.PI / 2;
      mesh.position.y = 0.8;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.scene.add(mesh);
    });
  }

  private addEventListeners(): void {
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    const time = performance.now() / 3000;
    this.spotLight.position.x = Math.cos(time) * 2.5;
    this.spotLight.position.z = Math.sin(time) * 2.5;
    this.lightHelper.update();
    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }
}
