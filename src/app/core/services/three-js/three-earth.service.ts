import { Injectable, ElementRef, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';
import { BehaviorSubject, Subject } from 'rxjs';

interface EarthConfig {
  size: number;
  rotationSpeed: number;
  cloudsScale: number;
  texturePath: string;
}

interface TextureSet {
  atmosphere: THREE.Texture;
  specular: THREE.Texture;
  normal: THREE.Texture;
  clouds: THREE.Texture;
}

@Injectable({
  providedIn: 'root'
})
export class ThreeEarthService implements OnDestroy {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private spotLight!: THREE.SpotLight;
  private clock = new THREE.Clock();
  private meshPlanet!: THREE.Mesh;
  private meshClouds!: THREE.Mesh;
  private animationFrameId?: number;
  private destroy$ = new Subject<void>();
  private isLoading = new BehaviorSubject<boolean>(false);

  private readonly defaultConfig: EarthConfig = {
    size: 6371,
    rotationSpeed: 0.1,
    cloudsScale: 1.005,
    texturePath: 'textures/planets/'
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  init(canvas: ElementRef<HTMLCanvasElement>, config?: Partial<EarthConfig>): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const finalConfig = { ...this.defaultConfig, ...config };
    this.isLoading.next(true);

    this.setupRenderer(canvas);
    this.setupScene();
    this.setupCamera(canvas);
    this.setupLighting();
    this.loadModels(finalConfig).then(() => {
      this.isLoading.next(false);
    }).catch(error => {
      console.error('Error loading Earth models:', error);
      this.isLoading.next(false);
    });
    this.addEventListeners();
    this.animate();
  }

  private async loadTextures(path: string): Promise<TextureSet> {
    const loader = new THREE.TextureLoader();
    const loadTexture = (filename: string): Promise<THREE.Texture> => {
      return new Promise((resolve, reject) => {
        loader.load(
          `${path}${filename}`,
          texture => {
            texture.colorSpace = THREE.SRGBColorSpace;
            resolve(texture);
          },
          undefined,
          reject
        );
      });
    };

    const [atmosphere, specular, normal, clouds] = await Promise.all([
      loadTexture('earth_atmos_2048.jpg'),
      loadTexture('earth_specular_2048.jpg'),
      loadTexture('earth_normal_2048.jpg'),
      loadTexture('earth_clouds_1024.png')
    ]);

    return { atmosphere, specular, normal, clouds };
  }

  private setupRenderer(canvas: ElementRef<HTMLCanvasElement>): void {
    this.renderer = new THREE.WebGLRenderer({
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

  private async loadModels(config: EarthConfig): Promise<void> {
    try {
      const textures = await this.loadTextures(config.texturePath);
      
      const materialNormalMap = new THREE.MeshPhongMaterial({
        specular: 0x7c7c7c,
        shininess: 15,
        map: textures.atmosphere,
        specularMap: textures.specular,
        normalMap: textures.normal,
        normalScale: new THREE.Vector2(0.85, -0.85)
      });

      const geometry = new THREE.SphereGeometry(config.size, 100, 50);
      this.meshPlanet = new THREE.Mesh(geometry, materialNormalMap);
      this.meshPlanet.rotation.z = 0.41;
      this.scene.add(this.meshPlanet);

      const materialClouds = new THREE.MeshLambertMaterial({
        map: textures.clouds,
        transparent: true
      });

      this.meshClouds = new THREE.Mesh(geometry, materialClouds);
      this.meshClouds.scale.setScalar(config.cloudsScale);
      this.meshClouds.rotation.z = 0.41;
      this.scene.add(this.meshClouds);
    } catch (error) {
      console.error('Error in loadModels:', error);
      throw error;
    }
  }

  private addEventListeners(): void {
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private animate(): void {
    this.animationFrameId = requestAnimationFrame(() => this.animate());
    const delta = this.clock.getDelta();
    
    if (this.meshPlanet && this.meshClouds) {
      this.meshPlanet.rotation.y += this.defaultConfig.rotationSpeed * delta;
      this.meshClouds.rotation.y += 1.25 * this.defaultConfig.rotationSpeed * delta;
    }
    
    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.camera.aspect = 1;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(80, 80);
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.destroy$.next();
      this.destroy$.complete();
      
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }
      
      // Cleanup resources
      this.meshPlanet?.geometry.dispose();
      this.meshClouds?.geometry.dispose();
      (this.meshPlanet?.material as THREE.Material)?.dispose();
      (this.meshClouds?.material as THREE.Material)?.dispose();
      this.scene.clear();
      this.renderer.dispose();
      
      window.removeEventListener('resize', this.onWindowResize.bind(this));
    }
  }

  // Public methods for external control
  public setRotationSpeed(speed: number): void {
    this.defaultConfig.rotationSpeed = speed;
  }

  public toggleAnimation(paused: boolean): void {
    if (paused) {
      cancelAnimationFrame(this.animationFrameId!);
    } else {
      this.animate();
    }
  }
}
