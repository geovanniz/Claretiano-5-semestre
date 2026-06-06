import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.easygest.app',
  appName: 'EasyGest',
  webDir: 'www',
  server: {
    // Em desenvolvimento com livereload, troque pelo IP da sua máquina
    // androidScheme: 'https',
  },
};

export default config;
