import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewBlogPage } from './view-blog.page';

const routes: Routes = [
  {
    path: ':id',
    component: ViewBlogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewBlogPageRoutingModule {}
