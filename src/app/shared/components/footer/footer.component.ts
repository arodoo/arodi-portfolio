import { Component } from '@angular/core';
import { DateTimeUtil } from '../../utils/date-time.util';

@Component({
    selector: 'app-footer',
    imports: [],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear: number = DateTimeUtil.getCurrentYear();
}
