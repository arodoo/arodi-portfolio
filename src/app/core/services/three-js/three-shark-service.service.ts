import { Injectable, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';

@Injectable({
  providedIn: 'root'
})
export class ThreeSharkServiceService {

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private clock = new THREE.Clock();
  private mixers: THREE.AnimationMixer[] = [];
  private sharkModel!: THREE.Group;

  constructor(@Inject(PLATFORM_ID) private platformID: Object) { }

  init(container: ElementRef<HTMLDivElement>): void {
    if (isPlatformBrowser(this.platformID)) {
      this.setupRender(container);
      this.setupScene();
      this.setupCamera();
      this.setupLighting();
      this.addEventListeners();
      this.animate();
      this.loadSharkModel(new THREE.Vector3(-30, -30, 0));
      setTimeout(() => {
        this.loadSharkModel(new THREE.Vector3(-50, 80, -280));
      }, 1000);
    }
  }

  loadSharkModel(position: THREE.Vector3) {
    const loader = new GLTFLoader();
    loader.load('models/glb/binary/megalodon.glb', (gltf) => {
      const sharkModel = gltf.scene;

      //adjust position depending on window size
      if(window.innerWidth < 600) {
        sharkModel.position.set(position.x, position.y, position.z - 160)
      }else{      
      sharkModel.position.set(position.x, position.y, position.z)
      }
      sharkModel.rotation.y = Math.PI / 2;
      sharkModel.rotation.x = (Math.PI / 2);
      this.scene.add(sharkModel);


      // Exponer el modelo globalmente
      /*       (window as any).sharkModel = this.sharkModel; */

      this.setUpAnimation(gltf.animations, sharkModel);
    }, undefined, (error) => {
      console.error(error);
    });
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
    requestAnimationFrame(() => this.animate());
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

  public loadSharkModel1(): void {
    this.loadSharkModel(new THREE.Vector3(-30, -30, 0));
  }

  public loadSharkModel2(): void {
    this.loadSharkModel(new THREE.Vector3(-40, 80, -280));
  }
}
