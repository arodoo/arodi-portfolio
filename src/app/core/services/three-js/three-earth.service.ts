import { Injectable, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class ThreeEarthService {
  onResize() {
    throw new Error('Method not implemented.');
  }

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private spotLight!: THREE.SpotLight;
  private clock = new THREE.Clock();
  private meshPlanet!: THREE.Mesh;
  private meshClouds!: THREE.Mesh;
  private rotationSpeed = 0.1;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  init(canvas: ElementRef<HTMLCanvasElement>): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setupRenderer(canvas);
      this.setupScene();
      this.setupCamera(canvas);
      this.setupLighting();
      this.loadModels();
      this.addEventListeners();
      this.animate();
    }
  }

  private setupRenderer(canvas: ElementRef<HTMLCanvasElement>): void {
    this.renderer = new THREE.WebGLRenderer(
      {
        canvas: canvas.nativeElement,
        antialias: true,
        alpha: true
      });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(80, 80);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.renderer.setClearColor(0x000000, 0);
  }

  private setupScene(): void {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x000000, 0.0000025);
  }

  private setupCamera(canvas: ElementRef<HTMLCanvasElement>): void {
    this.camera = new THREE.PerspectiveCamera(25, 1, 50, 1e7);
    this.camera.position.z = 6371 * 5;
  }

  private setupLighting(): void {
    const ambient = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 2.5);
    this.scene.add(ambient);

    const loader = new THREE.TextureLoader().setPath('textures/planets/');
    const textures = {
      'earth_atmos_2048.jpg': loader.load('earth_atmos_2048.jpg'),
      'earth_specular_2048.jpg': loader.load('earth_specular_2048.jpg'),
      'earth_normal_2048.jpg': loader.load('earth_normal_2048.jpg'),
      'earth_clouds_1024.png': loader.load('earth_clouds_1024.png'),
      'moon_1024.jpg': loader.load('moon_1024.jpg') // Cargar la textura de la luna
    };

    this.spotLight = new THREE.SpotLight(0xffffff, 100);
    this.spotLight.position.set(2.5, 5, 2.5);
    this.spotLight.angle = Math.PI / 6;
    this.spotLight.penumbra = 1;
    this.spotLight.decay = 2;
    this.spotLight.distance = 5;
    this.spotLight.map = textures['earth_atmos_2048.jpg'];
    this.spotLight.castShadow = true;
    this.spotLight.shadow.mapSize.width = 1024;
    this.spotLight.shadow.mapSize.height = 1024;
    this.spotLight.shadow.camera.near = 1;
    this.spotLight.shadow.camera.far = 10;
    this.spotLight.shadow.focus = 1;
    this.scene.add(this.spotLight);

    const planeGeometry = new THREE.PlaneGeometry(200, 200);
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xbabcbc });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(0, -1, 0);
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    this.scene.add(plane);
  }

  private loadModels(): void {
    const loader = new THREE.TextureLoader().setPath('textures/planets/');
    const textures = {
      'earth_atmos_2048.jpg': loader.load('earth_atmos_2048.jpg'),
      'earth_specular_2048.jpg': loader.load('earth_specular_2048.jpg'),
      'earth_normal_2048.jpg': loader.load('earth_normal_2048.jpg'),
      'earth_clouds_1024.png': loader.load('earth_clouds_1024.png'),
      'moon_1024.jpg': loader.load('moon_1024.jpg') // Cargar la textura de la luna
    };

    const materialNormalMap = new THREE.MeshPhongMaterial({
      specular: 0x7c7c7c,
      shininess: 15,
      map: textures['earth_atmos_2048.jpg'],
      specularMap: textures['earth_specular_2048.jpg'],
      normalMap: textures['earth_normal_2048.jpg'],
      normalScale: new THREE.Vector2(0.85, -0.85)
    });
    if (materialNormalMap.map) {
      materialNormalMap.map.colorSpace = THREE.SRGBColorSpace;
    }

    const geometry = new THREE.SphereGeometry(6371, 100, 50);
    this.meshPlanet = new THREE.Mesh(geometry, materialNormalMap);
    this.meshPlanet.rotation.y = 0;
    this.meshPlanet.rotation.z = 0.41;
    this.scene.add(this.meshPlanet);

    const materialClouds = new THREE.MeshLambertMaterial({
      map: textures['earth_clouds_1024.png'],
      transparent: true
    });
    if (materialClouds.map) {
      materialClouds.map.colorSpace = THREE.SRGBColorSpace;
    }

    this.meshClouds = new THREE.Mesh(geometry, materialClouds);
    this.meshClouds.scale.set(1.005, 1.005, 1.005);
    this.meshClouds.rotation.z = 0.41;
    this.scene.add(this.meshClouds);
  }

  private addEventListeners(): void {
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    const delta = this.clock.getDelta();
    this.meshPlanet.rotation.y += this.rotationSpeed * delta;
    this.meshClouds.rotation.y += 1.25 * this.rotationSpeed * delta;
    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.camera.aspect = 1;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(80, 80);
    }
  }
}
