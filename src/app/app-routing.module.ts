import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'update-blog',
    loadChildren: () => import('./update-blog/update-blog.module').then( m => m.UpdateBlogPageModule)
  },
  {
    path: 'view-blog',
    loadChildren: () => import('./view-blog/view-blog.module').then( m => m.ViewBlogPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
