import { CapacitorConfig } from '@capacitor/cli';
const config: CapacitorConfig = {
  appId: 'io.wlv.blog.ac.uk',
  appName: 'Blog',
  bundledWebRuntime: false,
  // @ts-ignore
  npmClient: 'npm',
  webDir: 'www',
};

export default config;
