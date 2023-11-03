import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './style.css'
const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

axios.defaults.baseURL = 'http://localhost:9000'
// 将 axios 挂载为 app 的全局自定义属性
// 每个组件可以通过 this 直接访问到全局挂载的自定义属性
app.config.globalProperties.$http = axios

app.use(ElementPlus)
app.mount('#app')
