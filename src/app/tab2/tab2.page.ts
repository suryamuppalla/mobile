import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController, ViewWillEnter } from '@ionic/angular';
import { BlogService } from '../services/blog.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit, ViewWillEnter {

  public form: FormGroup;

  constructor(
    public photoService: BlogService,
    public toastController: ToastController,
    private router: Router
  ) {
  }

  ngOnInit() {
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Your Blog has been added successfully.',
      duration: 4000
    });
    toast.present();
  }

  ionViewWillEnter() {
    this.form = new FormGroup({
      title: new FormControl(null, Validators.required),
      subtitle: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      photo: new FormControl(null, Validators.required),
      created_at: new FormControl(null)
    });
  }

  uploadBlogImage() {
    this.photoService.addNewToGallery()
      .then(photo => {
        this.form.patchValue({ photo });
      });
  }

  submit() {
    this.form.patchValue({ created_at: new Date() });

    if (this.form.valid) {
      this.photoService.submitBlog(this.form.value)
        .then((response) => {
          this.presentToast();
          this.router.navigate(['/tabs/tab1']);
        }).catch(error => {
          console.log(error);
        });
    }
  }
}
