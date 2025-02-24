import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  team = [
    {
      name: 'Editorial Team',
      description: 'Curating and reviewing poetry submissions',
      icon: 'fa-edit'
    },
    {
      name: 'Community Team',
      description: 'Building and nurturing our poetry community',
      icon: 'fa-users'
    },
    {
      name: 'Technical Team',
      description: 'Maintaining and improving the platform',
      icon: 'fa-cog'
    }
  ];
}
