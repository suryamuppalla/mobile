import { Photo } from "@capacitor/camera";

export interface Blogs {
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