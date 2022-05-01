import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, ViewWillEnter } from '@ionic/angular';
import { ApplicationService } from '../services/application.service';
import {DomSanitizer} from "@angular/platform-browser";
import { Blogs } from '../interfaces/application.interface';

@Component({
  selector: 'app-blogs-list-page',
  templateUrl: 'blogs-list.page.html',
  styleUrls: ['blogs-list.page.scss']
})
export class BlogsListPage implements OnInit, ViewWillEnter {

  constructor(
    public bService: ApplicationService,
    private navigationRouter: Router,
    public domService: DomSanitizer,
    public actionCtrl: ActionSheetController
  ) {
  }

  ngOnInit(): void {
  }

  ionViewWillEnter() {
    this.bService.getBlogsList();
  }

  public async showMoreDetails(photo: Blogs, position: number) {
    const sheetInstance = await this.actionCtrl.create({
      header: 'Blog Actions',
      buttons: [{
        text: 'Edit Blog Details',
        // role: 'destructive',
        icon: 'pencil',
        handler: () => {
          this.navigationRouter.navigate(['/update-blog', photo.id]);
        }
      }, {
        text: 'Trash Blog',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.bService.deleteBlog(photo, position);
        }
      }, {
        text: 'Cancel Operation',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          // Nothing to do, action sheet is automatically closed
        }
      }]
    });
    await sheetInstance.present();
  }
}
