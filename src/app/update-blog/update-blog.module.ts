import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateBlogPageRoutingModule } from './update-blog-routing.module';

import { UpdateBlogPage } from './update-blog.page';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule,
    UpdateBlogPageRoutingModule
  ],
  declarations: [UpdateBlogPage]
})
export class UpdateBlogPageModule {}
