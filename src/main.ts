import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store, { key } from './store'
import 'ant-design-vue/lib/message/style/index.less'
import 'ant-design-vue/lib/modal/style/index.less'

const app = createApp(App)
app.use(store, key)
app.use(router)
app.mount('#app')
