import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Photo } from '@capacitor/camera';
import { NavController, ToastController, ViewWillEnter } from '@ionic/angular';
import { Blogs } from '../interfaces/application.interface';
import { ApplicationService } from '../services/application.service';

@Component({
    selector: 'app-view-blog',
    templateUrl: './update-blog.page.html',
    styleUrls: ['./update-blog.page.scss'],
})
export class UpdateBlogPage implements OnInit, ViewWillEnter {

    public updateBlogFormInstance: FormGroup;
    public userBlog: Blogs;
    public newImage: Photo;
    public newImageUploaded: boolean;

    constructor(
        public blogInstance: ApplicationService,
        public toastCtrl: ToastController,
        private navigationCtrl: NavController,
        private activeRoute: ActivatedRoute,
        public domService: DomSanitizer
    ) {
    }

    ngOnInit() {
    }

    async showToastMessage() {
        const toast = await this.toastCtrl.create({
            message: 'Your Blog Details has been updated successfully!',
            duration: 3000
        });
        toast.present();
    }

    ionViewWillEnter() {
        this.updateBlogFormInstance = new FormGroup({
            title: new FormControl(null, Validators.required),
            subtitle: new FormControl(null, Validators.required),
            description: new FormControl(null, Validators.required),
            photo: new FormControl(null),
            created_at: new FormControl(null)
        });

        this.activeRoute.params.subscribe(params => {
            const id = Number(params.id);
            this.userBlog = this.blogInstance.getBlogDetails(id);
            this.updateBlogFormInstance.patchValue(this.userBlog);
        });
    }

    uploadImage() {
        this.blogInstance.insertImageToGallery()
            .then(photo => {
                this.newImageUploaded = true;
                this.newImage = photo;
                this.updateBlogFormInstance.patchValue({ photo });
            });
    }

    submit() {
        if (this.updateBlogFormInstance.valid) {
            this.blogInstance.updateBlog(this.updateBlogFormInstance.value, this.userBlog.id, this.newImageUploaded)
                .then(async (response) => {
                    await this.showToastMessage();
                    await this.blogInstance.getBlogsList();
                    // await this.router.navigate(['/blogs/homepage']);
                    this.navigationCtrl.back();
                }).catch(error => {
                    console.log(error);
                });
        }
    }
}
