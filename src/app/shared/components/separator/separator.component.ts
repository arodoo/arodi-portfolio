import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntryLeaveAnimationDirective } from '../../directives/entry-leave-animation.directive';

@Component({
  selector: 'app-separator',
  standalone: true,
  imports: [CommonModule, EntryLeaveAnimationDirective],
  templateUrl: './separator.component.html',
  styleUrl: './separator.component.scss'
})
export class SeparatorComponent {

}
