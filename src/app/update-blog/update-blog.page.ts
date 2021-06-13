import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {NavController, ToastController, ViewWillEnter} from '@ionic/angular';
import {BlogService, UserBlog} from '../services/blog.service';

@Component({
    selector: 'app-view-blog',
    templateUrl: './update-blog.page.html',
    styleUrls: ['./update-blog.page.scss'],
})
export class UpdateBlogPage implements OnInit, ViewWillEnter {

    public form: FormGroup;
    public blog: UserBlog;
    public isNewPhoto: boolean;

    constructor(
        public blogService: BlogService,
        public toastController: ToastController,
        private router: Router,
        private navCtrl: NavController,
        private activatedRoute: ActivatedRoute
    ) {
    }

    ngOnInit() {
    }

    async presentToast() {
        const toast = await this.toastController.create({
            message: 'Your Blog has been updated successfully.',
            duration: 4000
        });
        toast.present();
    }

    ionViewWillEnter() {
        this.form = new FormGroup({
            title: new FormControl(null, Validators.required),
            subtitle: new FormControl(null, Validators.required),
            description: new FormControl(null, Validators.required),
            photo: new FormControl(null),
            created_at: new FormControl(null)
        });

        this.activatedRoute.params.subscribe(params => {
            const id = Number(params.id);
            this.blog = this.blogService.getBlogDetails(id);
            this.form.patchValue(this.blog);
        });
    }

    uploadBlogImage() {
        this.blogService.addNewToGallery()
            .then(photo => {
                this.isNewPhoto = true;
                this.form.patchValue({photo});
            });
    }

    submit() {
        if (this.form.valid) {
            this.blogService.updateBlog(this.form.value, this.blog.id, this.isNewPhoto)
                .then(async (response) => {
                    await this.presentToast();
                    await this.blogService.loadSaved();
                    // await this.router.navigate(['/tabs/tab1']);
                    this.navCtrl.back();
                }).catch(error => {
                console.log(error);
            });
        }
    }
}
