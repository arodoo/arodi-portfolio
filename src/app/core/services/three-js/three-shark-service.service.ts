import { Injectable, ElementRef, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';
import { BehaviorSubject, Subject } from 'rxjs';

interface SharkConfig {
  position: THREE.Vector3;
  rotation?: {
    x: number;
    y: number;
    z: number;
  };
  scale?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ThreeSharkServiceService implements OnDestroy {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private clock = new THREE.Clock();
  private mixers: THREE.AnimationMixer[] = [];
  private animationFrameId?: number;
  private destroy$ = new Subject<void>();
  private isLoading = new BehaviorSubject<boolean>(false);

  private readonly defaultConfig: SharkConfig = {
    position: new THREE.Vector3(-30, -30, 0),
    rotation: { x: Math.PI / 2, y: Math.PI / 2, z: 0 },
    scale: 1
  };

  constructor(@Inject(PLATFORM_ID) private platformID: Object) { }

  init(container: ElementRef<HTMLDivElement>): void {
    if (!isPlatformBrowser(this.platformID)) return;

    this.setupRender(container);
    this.setupScene();
    this.setupCamera();
    this.setupLighting();
    this.addEventListeners();
    this.animate();

    // Load initial sharks with configurations
    this.loadSharkModel(this.defaultConfig);
    setTimeout(() => {
      this.loadSharkModel({
        position: new THREE.Vector3(-50, 80, -280),
        rotation: { x: Math.PI / 2, y: Math.PI / 2, z: 0 }
      });
    }, 1000);
  }

  loadSharkModel(config: SharkConfig) {
    if (!isPlatformBrowser(this.platformID)) return;

    this.isLoading.next(true);
    const loader = new GLTFLoader();
    
    loader.load(
      'models/glb/binary/megalodon.glb',
      (gltf) => {
        const sharkModel = gltf.scene;
        const position = this.getResponsivePosition(config.position);
        
        sharkModel.position.copy(position);
        sharkModel.rotation.set(
          config.rotation?.x ?? Math.PI / 2,
          config.rotation?.y ?? Math.PI / 2,
          config.rotation?.z ?? 0
        );
        
        if (config.scale) {
          sharkModel.scale.setScalar(config.scale);
        }
        
        this.scene.add(sharkModel);
        this.setUpAnimation(gltf.animations, sharkModel);
        this.isLoading.next(false);
      },
      undefined,
      (error) => {
        console.error('Error loading shark model:', error);
        this.isLoading.next(false);
      }
    );
  }

  private getResponsivePosition(position: THREE.Vector3): THREE.Vector3 {
    const pos = position.clone();
    if (window.innerWidth < 600) {
      pos.z -= 160;
    }
    return pos;
  }

  private setUpAnimation(animations: THREE.AnimationClip[], model: THREE.Group): void {
    const mixer = new THREE.AnimationMixer(model);
    animations.forEach(clip => {
      this.adjustAndConfigureAnimation(mixer, clip);
    })
    this.mixers.push(mixer);
  }

  private adjustAndConfigureAnimation(mixer: THREE.AnimationMixer, clip: THREE.AnimationClip): void {
    const adjustedClip = THREE.AnimationClip.parse(THREE.AnimationClip.toJSON(clip));
    adjustedClip.duration -= .05;
    const action = mixer.clipAction(adjustedClip);
    action.loop = THREE.LoopRepeat;
    action.clampWhenFinished = true;
    action.play();
  }

  private animate(): void {
    this.animationFrameId = requestAnimationFrame(() => this.animate());
    const delta = this.clock.getDelta();
    this.mixers.forEach((mixer) => mixer.update(delta));
    this.renderer.render(this.scene, this.camera);
  }

  private setupRender(container: ElementRef<HTMLDivElement>): void {
    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    container.nativeElement.appendChild(this.renderer.domElement);
  }

  private setupScene(): void {
    this.scene = new THREE.Scene();
  }

  private setupCamera(): void {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(-30, -50, 220);
    (window as any).camera = this.camera;
  }

  private setupLighting(): void {
    this.addAmbientLight();
    this.addDirectionalLight();
  }

  private addAmbientLight(): void {
    const ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(ambientLight);
  }

  private addDirectionalLight(): void {
    const dawnColor = 0xffd700;
    const directionalLight = new THREE.DirectionalLight(dawnColor);
    directionalLight.position.set(1, 0.5, 0.5).normalize();
    this.scene.add(directionalLight);
  }

  private addEventListeners(): void {
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private onWindowResize(): void {
    if (isPlatformBrowser(this.platformID)) {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformID)) {
      this.destroy$.next();
      this.destroy$.complete();
      
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }
      
      this.mixers.forEach(mixer => mixer.stopAllAction());
      this.scene.clear();
      this.renderer.dispose();
      
      window.removeEventListener('resize', this.onWindowResize.bind(this));
    }
  }

  public loadSharkModel1(): void {
    this.loadSharkModel(this.defaultConfig);
  }

  public loadSharkModel2(): void {
    this.loadSharkModel({
      position: new THREE.Vector3(-40, 80, -280),
      rotation: { x: Math.PI / 2, y: Math.PI / 2, z: 0 }
    });
  }
}
