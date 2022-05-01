import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePagePage } from './homepage.page';

const routes: Routes = [
  {
    path: 'blogs',
    component: HomePagePage,
    children: [
      {
        path: 'homepage',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../blogs-list/blogs-list.module').then(m => m.BlogsListPageModule)
          }
        ]
      },
      {
        path: 'add-new-blog',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../add-new-blog/add-new-blog.module').then(m => m.AddNewBlogModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/blogs/homepage',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/blogs/homepage',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
