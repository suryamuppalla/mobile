import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Photo } from '@capacitor/camera';
import { ToastController, ViewWillEnter } from '@ionic/angular';
import { ApplicationService } from '../services/application.service';

@Component({
  selector: 'app-add-new-blog-page',
  templateUrl: 'add-new-blog.page.html',
  styleUrls: ['add-new-blog.page.scss']
})
export class AddNewBlogPage implements OnInit, ViewWillEnter {

  public blogForm: FormGroup;
  public newImage: Photo;

  constructor(
    public photoInstance: ApplicationService,
    public toastCtrl: ToastController,
    private router: Router,
    public domService: DomSanitizer
  ) {
  }

  ngOnInit() {
  }

  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: 'Your Blog has been added successfully.',
      duration: 4000
    });
    toast.present();
  }

  ionViewWillEnter() {
    this.blogForm = new FormGroup({
      title: new FormControl(null, Validators.required),
      subtitle: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      photo: new FormControl(null, Validators.required),
      created_at: new FormControl(null)
    });
  }

  uploadImage() {
    this.photoInstance.insertImageToGallery()
      .then(photo => {
        this.newImage = photo;
        this.blogForm.patchValue({ photo });
      });
  }

  submit() {
    this.blogForm.patchValue({ created_at: new Date() });

    if (this.blogForm.valid) {
      this.photoInstance.submitBlog(this.blogForm.value)
        .then((response) => {
          this.presentToast();
          this.router.navigate(['/blogs/homepage']);
        }).catch(error => {
          console.log(error);
        });
    }
  }
}
