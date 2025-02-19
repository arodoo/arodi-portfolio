import { AfterViewInit, Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { gsap } from 'gsap';

@Component({
    selector: 'app-grid',
    imports: [CommonModule],
    templateUrl: './grid.component.html',
    styleUrl: './grid.component.scss'
})
export class GridComponent implements AfterViewInit {

  squares = Array(30).fill(0);
  lastScroll = 0;
  private animations: gsap.core.Tween[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngAfterViewInit(): void {
    this.initWaveAnimation();
    this.initSquareAnimation();
    this.addMouseHoverEffect();
  }

  initWaveAnimation() {
    if (isPlatformBrowser(this.platformId)) {
      //console.log('initWaveAnimation');

      const grid = document.querySelector('.grid');
      const animation = gsap.to(grid, {
        duration: 20,
        backgroundPosition: '200% 0',
        repeat: -1,
        ease: 'sine.inOut'
      });
      this.animations.push(animation);
    }
  }

initSquareAnimation() {
  if (isPlatformBrowser(this.platformId)) {
    //console.log('initSquareAnimations');

    const squares = document.querySelectorAll('.square');
    squares.forEach(square => {
      const animation = gsap.to(square, {
        duration: Math.random() * 3 + 2, // Duración aleatoria entre 2 y 5 segundos
        y: Math.random() * 30 - 10, // Movimiento aleatorio en el eje Y
        x: Math.random() * 30 - 10, // Movimiento aleatorio en el eje X
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 2 // Retraso aleatorio
      });
      this.animations.push(animation);
    });
  }
}

  addMouseHoverEffect(){
    if(isPlatformBrowser(this.platformId)){
      const squares = document.querySelectorAll('.square');
      squares.forEach(square => {
        square.addEventListener('mouseenter', () => {
          square.classList.add('gold');
        });
        square.addEventListener('mouseleave', () => {
          square.classList.remove('gold');
        });
      })
    }
  }



  @HostListener('window:scroll', [])
  onWindowScroll() {
    const direction = window.scrollY > this.lastScroll ? 'down' : 'up';
    this.lastScroll = window.scrollY;
    this.updateScrollAnimation(direction);
  }

  updateScrollAnimation(direction: string) {
    const grid = document.querySelectorAll('.grid');
    gsap.to(grid, {
      duration: 1,
      
    });
  }

}
