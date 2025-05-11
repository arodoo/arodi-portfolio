import { Injectable, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';

@Injectable({
  providedIn: 'root'
})
export class ThreeAnimatedFishesService {

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private clock = new THREE.Clock();
  private mixers: THREE.AnimationMixer[] = [];
  private fishesModel!: THREE.Group;
  private initialized = false;

  constructor(@Inject(PLATFORM_ID) private platformID: Object) { }

  init(container: ElementRef<HTMLDivElement>): void {

    if (this.initialized) return; // Prevent re-initialization
    
    if (isPlatformBrowser(this.platformID)) {
      this.setUpRender(container);
      this.setUpScene();
      this.setUpCamera();
      this.setUpLighting();
      this.addEventListeners();
      this.animate();
      this.loadFishModel(new THREE.Vector3(0, 0, 0));
    }
    this.initialized = true;
  }

  loadFishModel(position: THREE.Vector3) {
    const loader = new GLTFLoader();
    loader.load('models/glb/binary/animated-fishes.glb', (gltf) => {
      const fishesModel = gltf.scene;

      //adjust position depending on window size
      if(window.innerWidth < 600) {
        fishesModel.position.set(position.x, position.y, position.z - .8)
      }else{
      fishesModel.position.set(position.x, position.y, position.z);
      }
      fishesModel.rotation.y = Math.PI / 2;
      fishesModel.rotation.x = (Math.PI / 2);
      this.scene.add(fishesModel);

      this.setUpAnimation(gltf.animations, fishesModel);
    }, undefined, (error) => {
      console.error(error);
    });
  }

  private setUpAnimation(animations: THREE.AnimationClip[], model: THREE.Group): void {
    const mixer = new THREE.AnimationMixer(model);
    animations.forEach(clip => this.configureAnimation(mixer, clip));
    this.mixers.push(mixer);
  }

  private configureAnimation(mixer: THREE.AnimationMixer, clip: THREE.AnimationClip): void {
    const action = mixer.clipAction(clip);
    action.loop = THREE.LoopRepeat;
    action.clampWhenFinished = true;
    action.play();
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    const delta = this.clock.getDelta();
    this.mixers.forEach((mixer) => mixer.update(delta));
    this.renderer.render(this.scene, this.camera);
  }

  private setUpRender(container: ElementRef<HTMLDivElement>): void {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    container.nativeElement.appendChild(this.renderer.domElement);
  }

  private setUpScene(): void {
    this.scene = new THREE.Scene();
  }

  private setUpCamera(): void {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 0, 5);
  }

  private setUpLighting(): void {
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

}
