import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { Platform } from '@ionic/angular';
import { BlogItem, Blogs } from '../interfaces/application.interface';


@Injectable({
    providedIn: 'root',
})
export class ApplicationService {
    public blogsList: Blogs[] = [];
    private IMAGES_STORE = 'photos';

    constructor(private platform: Platform) {
    }

    public async getBlogsList() {
        this.blogsList = [];
        // Retrieve cached photo array data
        const listItems = await Storage.get({ key: this.IMAGES_STORE });
        this.blogsList = JSON.parse(listItems.value) || [];

        // If running on the web...
        if (!this.platform.is('hybrid')) {
            // Display the photo by reading into base64 format
            for (const blog of this.blogsList) {
                // Read each saved photo's data from the Filesystem
                const readFile = await Filesystem.readFile({
                    path: blog.filepath,
                    directory: Directory.Data
                });

                // Web platform only: Load the photo as base64 data
                blog.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
            }
        }
        return this.blogsList;
    }

    public async insertImageToGallery() {
        return await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Prompt,
            quality: 100
        });
    }

    public async submitBlog(blog: BlogItem): Promise<Blogs> {
        return new Promise(async (resolve) => {
            const savedBlog = await this.createNewBlog(blog);
            this.blogsList.unshift(savedBlog);
            Storage.set({
                key: this.IMAGES_STORE,
                value: JSON.stringify(this.blogsList),
            });
            resolve(savedBlog);
        });
    }

    private async createNewBlog(item: BlogItem) {
        const convertedBase64Image = await this.convertPhotoAsBase64Image(item.photo);

        const fileName = new Date().getTime() + '.jpeg';
        const savedFile = await Filesystem.writeFile({
            path: fileName,
            data: convertedBase64Image,
            directory: Directory.Data,
        });
        const filepath = this.platform.is('hybrid') ? savedFile.uri : fileName;
        const webviewPath = this.platform.is('hybrid') ? Capacitor.convertFileSrc(savedFile.uri) : item.photo.webPath;

        return {
            filepath,
            webviewPath,
            title: item.title,
            subtitle: item.subtitle,
            description: item.description,
            created_at: item.created_at,
            id: this.blogsList.length ? this.blogsList[this.blogsList.length - 1].id + 1 : 1
        };
    }

    private async convertPhotoAsBase64Image(photo: Photo) {
        if (this.platform.is('hybrid')) {
            const file = await Filesystem.readFile({
                path: photo.path,
            });

            return file.data;
        }

        const response = await fetch(photo.webPath!);
        const blob = await response.blob();
        return (await this.processBlobToBase64Content(blob)) as string;
    }

    public getBlogDetails(id: number) {
        return this.blogsList.find(item => item.id === id);
    }

    public async updateBlog(blog: BlogItem, blogId: number, isNewPhoto: boolean) {

        return new Promise(async (resolve) => {
            const { value } = await Storage.get({ key: this.IMAGES_STORE });
            const blogs: Blogs[] = JSON.parse(value) || [];
            const position = blogs.findIndex(item => item.id === blogId);

            const existingBlog = blogs[position];
            if (isNewPhoto) {

                const filename = existingBlog.filepath.substr(existingBlog.filepath.lastIndexOf('/') + 1);
                console.log(filename, existingBlog.filepath.lastIndexOf('/') + 1);
                await Filesystem.deleteFile({
                    path: filename,
                    directory: Directory.Data
                });

                blogs[position] = await this.createNewBlog(blog);
                console.log(blogs[position].filepath, blogs[position]);
            } else {
                blogs[position].title = blog.title;
                blogs[position].description = blog.description;
                blogs[position].subtitle = blog.subtitle;
            }

            Storage.set({
                key: this.IMAGES_STORE,
                value: JSON.stringify(blogs),
            });
            resolve(blogs[position]);
        });
    }

    public async deleteBlog(photo: Blogs, position: number) {
        this.blogsList.splice(position, 1);

        Storage.set({
            key: this.IMAGES_STORE,
            value: JSON.stringify(this.blogsList),
        });

        const filename = photo.filepath.substr(photo.filepath.lastIndexOf('/') + 1);
        await Filesystem.deleteFile({
            path: filename,
            directory: Directory.Data,
        });
    }

    processBlobToBase64Content = (blob: Blob) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsDataURL(blob);
        })
}
