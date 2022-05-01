import { Component, OnInit } from '@angular/core';
import { ApplicationService } from "../services/application.service";
import { AlertController, ToastController, ViewWillEnter } from "@ionic/angular";
import { ActivatedRoute, Router } from "@angular/router";
import { DomSanitizer } from '@angular/platform-browser';
import { Blogs } from '../interfaces/application.interface';

@Component({
  selector: 'app-view-blog',
  templateUrl: './view-blog.page.html',
  styleUrls: ['./view-blog.page.scss'],
})
export class ViewBlogPage implements OnInit, ViewWillEnter {

  public blogDetails: Blogs;
  constructor(
    public blogInstance: ApplicationService,
    private activatedRoute: ActivatedRoute,
    public domService: DomSanitizer,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private router: Router
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.activatedRoute
      .params
      .subscribe(params => this.blogDetails = this.blogInstance.blogsList.find(item => item.id === Number(params.id)));
  }

  async showAlert() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Want to Remove Blog?',
      message: `<strong>Blog Title: </strong>${this.blogDetails.title}`,
      buttons: [
        {
          text: 'Cancel Operation',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Remove Blog',
          cssClass: `danger`,
          handler: () => {
            const _index = this.blogInstance.blogsList.findIndex(item => item.id === this.blogDetails.id);
            if (_index > -1) {
              this.blogInstance.deleteBlog(this.blogDetails, _index);
              this.showToastContainer();
              this.router.navigate(['/']);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async showToastContainer() {
    const toast = await this.toastCtrl.create({
      message: 'Your Blog has been deleted successfully.',
      duration: 4000
    });
    toast.present();
  }
}
