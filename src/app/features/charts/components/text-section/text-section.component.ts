import { Component } from '@angular/core';

import { statistical_title, statistical_description } from '../../../../shared/utils/statistical-section-text';

@Component({
    selector: 'app-text-section',
    imports: [],
    templateUrl: './text-section.component.html',
    styleUrl: './text-section.component.scss'
})
export class TextSectionComponent {

  title = statistical_title;
  description = statistical_description;

  constructor() { }
}
