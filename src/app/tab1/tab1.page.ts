import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, ViewWillEnter } from '@ionic/angular';
import { BlogService, UserBlog } from '../services/blog.service';
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, ViewWillEnter {

  constructor(
    public blogService: BlogService,
    private router: Router,
    public _DomSanitizationService: DomSanitizer,
    public actionSheetController: ActionSheetController
  ) {
  }

  ngOnInit(): void {
  }

  ionViewWillEnter() {
    this.blogService.loadSaved();
  }

  public async showActionSheet(photo: UserBlog, position: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Blog Actions',
      buttons: [{
        text: 'Update',
        // role: 'destructive',
        icon: 'pencil',
        handler: () => {
          this.router.navigate(['/update-blog', photo.id]);
        }
      }, {
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.blogService.deleteBlog(photo, position);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          // Nothing to do, action sheet is automatically closed
        }
      }]
    });
    await actionSheet.present();
  }
}
