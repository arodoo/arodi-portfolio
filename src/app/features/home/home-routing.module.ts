import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HOME_ROUTES } from './components/home/home.routes';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(
      HOME_ROUTES
    )
  ],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
