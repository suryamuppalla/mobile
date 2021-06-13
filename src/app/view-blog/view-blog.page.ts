import { Component, OnInit } from '@angular/core';
import {BlogService, UserBlog} from "../services/blog.service";
import {AlertController, ToastController, ViewWillEnter} from "@ionic/angular";
import {ActivatedRoute, Router} from "@angular/router";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-view-blog',
  templateUrl: './view-blog.page.html',
  styleUrls: ['./view-blog.page.scss'],
})
export class ViewBlogPage implements OnInit, ViewWillEnter {

  public blog: UserBlog;
  constructor(
      public blogService: BlogService,
      private activatedRoute: ActivatedRoute,
      public _DomSanitizationService: DomSanitizer,
      public alertController: AlertController,
      private toastController: ToastController,
      private router: Router
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.activatedRoute.params.subscribe(params => {
      const id = Number(params.id);

      this.blog = this.blogService.blogs.find(item => item.id === id);
    });
  }

  async showAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Want to delete?',
      message: `<strong>Blog Title: </strong>${this.blog.title}`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Delete',
          cssClass: `danger`,
          handler: () => {
            const _index = this.blogService.blogs.findIndex(item => item.id === this.blog.id);
            if (_index > -1) {
              this.blogService.deleteBlog(this.blog, _index);
              this.presentToast();
              this.router.navigate(['/']);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Your Blog has been deleted successfully.',
      duration: 4000
    });
    toast.present();
  }
}
