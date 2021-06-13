import {Injectable} from '@angular/core';
import {Camera, CameraResultType, CameraSource, Photo} from '@capacitor/camera';
import {Capacitor} from '@capacitor/core';
import {Directory, Filesystem} from '@capacitor/filesystem';
import {Storage} from '@capacitor/storage';
import {Platform} from '@ionic/angular';


@Injectable({
    providedIn: 'root',
})
export class BlogService {
    public blogs: UserBlog[] = [];
    private BLOG_PHOTO_STORAGE = 'photos';

    constructor(private platform: Platform) {
    }

    public async loadSaved() {
        this.blogs = [];
        // Retrieve cached photo array data
        const blogList = await Storage.get({key: this.BLOG_PHOTO_STORAGE});
        this.blogs = JSON.parse(blogList.value) || [];

        // If running on the web...
        if (!this.platform.is('hybrid')) {
            // Display the photo by reading into base64 format
            for (const blog of this.blogs) {
                // Read each saved photo's data from the Filesystem
                const readFile = await Filesystem.readFile({
                    path: blog.filepath,
                    directory: Directory.Data
                });

                // Web platform only: Load the photo as base64 data
                blog.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
            }
        }
        return this.blogs;
    }

    /* Use the device camera to take a photo:
    // https://capacitor.ionicframework.com/docs/apis/camera

    // Store the photo data into permanent file storage:
    // https://capacitor.ionicframework.com/docs/apis/filesystem

    // Store a reference to all photo filepaths using Storage API:
    // https://capacitor.ionicframework.com/docs/apis/storage
    */
    public async addNewToGallery() {
        // Take a photo
        return await Camera.getPhoto({
            resultType: CameraResultType.Uri, // file-based data; provides best performance
            source: CameraSource.Prompt, // automatically take a new photo with the camera
            quality: 100, // highest quality (0 to 100)
        });
    }

    public async submitBlog(blog: BlogItem): Promise<UserBlog> {
        return new Promise(async (resolve) => {
            const savedBlog = await this.saveBlog(blog);

            // Add new photo to Photos array
            this.blogs.unshift(savedBlog);

            // Cache all photo data for future retrieval
            Storage.set({
                key: this.BLOG_PHOTO_STORAGE,
                value: JSON.stringify(this.blogs),
            });
            resolve(savedBlog);
        });
    }

    // Save picture to file on device
    private async saveBlog(blog: BlogItem) {
        // Convert photo to base64 format, required by Filesystem API to save
        const base64Data = await this.readAsBase64(blog.photo);

        // Write the file to the data directory
        const fileName = new Date().getTime() + '.jpeg';
        const savedFile = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Data,
        });

        if (this.platform.is('hybrid')) {
            // Display the new image by rewriting the 'file://' path to HTTP
            // Details: https://ionicframework.com/docs/building/webview#file-protocol
            return {
                filepath: savedFile.uri,
                webviewPath: Capacitor.convertFileSrc(savedFile.uri),
                title: blog.title,
                subtitle: blog.subtitle,
                description: blog.description,
                created_at: blog.created_at,
                id: this.blogs.length ? this.blogs[this.blogs.length - 1].id + 1 : 1
            };
        } else {
            // Use webPath to display the new image instead of base64 since it's
            // already loaded into memory
            return {
                filepath: fileName,
                webviewPath: blog.photo.webPath,
                title: blog.title,
                subtitle: blog.subtitle,
                description: blog.description,
                created_at: blog.created_at,
                id: this.blogs.length ? this.blogs[this.blogs.length - 1].id + 1 : 1
            };
        }
    }

    // Read camera photo into base64 format based on the platform the app is running on
    private async readAsBase64(cameraPhoto: Photo) {
        // "hybrid" will detect Cordova or Capacitor
        if (this.platform.is('hybrid')) {
            // Read the file into base64 format
            const file = await Filesystem.readFile({
                path: cameraPhoto.path,
            });

            return file.data;
        } else {
            // Fetch the photo, read as a blob, then convert to base64 format
            const response = await fetch(cameraPhoto.webPath!);
            const blob = await response.blob();

            return (await this.convertBlobToBase64(blob)) as string;
        }
    }

    public getBlogDetails(id: number) {
        return this.blogs.find(item => item.id === id);
    }

    // Update Blog by updating it from reference data and the filesystem
    public async updateBlog(blog: BlogItem, blogId: number, isNewPhoto: boolean) {

        return new Promise(async (resolve) => {
            const {value} = await Storage.get({key: this.BLOG_PHOTO_STORAGE});
            const blogs: UserBlog[] = JSON.parse(value) || [];
            const position = blogs.findIndex(item => item.id === blogId);

            const existingBlog = blogs[position];
            if (isNewPhoto) {

                // delete photo file from filesystem
                const filename = existingBlog.filepath.substr(existingBlog.filepath.lastIndexOf('/') + 1);
                console.log(filename, existingBlog.filepath.lastIndexOf('/') + 1);
                await Filesystem.deleteFile({
                    path: filename,
                    directory: Directory.Data
                });

                blogs[position] = await this.saveBlog(blog);
                console.log(blogs[position].filepath, blogs[position]);
            } else {
                blogs[position].title = blog.title;
                blogs[position].description = blog.description;
                blogs[position].subtitle = blog.subtitle;
            }

            // Cache all photo data for future retrieval
            Storage.set({
                key: this.BLOG_PHOTO_STORAGE,
                value: JSON.stringify(blogs),
            });
            resolve(blogs[position]);
        });
    }

    // Delete picture by removing it from reference data and the filesystem
    public async deleteBlog(photo: UserBlog, position: number) {
        // Remove this photo from the Photos reference data array
        this.blogs.splice(position, 1);

        // Update photos array cache by overwriting the existing photo array
        Storage.set({
            key: this.BLOG_PHOTO_STORAGE,
            value: JSON.stringify(this.blogs),
        });

        // delete photo file from filesystem
        const filename = photo.filepath.substr(photo.filepath.lastIndexOf('/') + 1);
        await Filesystem.deleteFile({
            path: filename,
            directory: Directory.Data,
        });
    }

    convertBlobToBase64 = (blob: Blob) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsDataURL(blob);
        })
}

export interface UserBlog {
    filepath: string;
    webviewPath: string;
    title: string;
    subtitle: string;
    description: string;
    created_at: Date;
    id: number;
}

export interface BlogItem {
    filepath: string;
    webviewPath: string;
    title: string;
    subtitle: string;
    description: string;
    photo: Photo;
    created_at: Date;
    id: number;
}
