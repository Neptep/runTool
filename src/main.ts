import { createApp } from 'vue';

import App from './App.vue';
import 'ant-design-vue/dist/antd.css';
import './assets/main.css';
import './assets/layout.scss';
import dayjs from 'dayjs'
const app = createApp(App);
app.config.globalProperties.dayjs=dayjs//全局挂载
app.mount('#app');
