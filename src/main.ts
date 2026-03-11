import "reset.css"
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2' // 命名导入
import router from './router'
import 'vant/lib/index.css'
import Vant from 'vant'

const pinia = createPinia()
pinia.use(createPersistedStatePlugin())

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(Vant)
app.mount('#app')