import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
// 按需加载组件，不用显示手动导入
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'

// 构建生产版本时需要去掉这个
// 暂时解决 https://github.com/vitejs/vite/issues/3413 错误
// TODO vite 2.7.0正式版发布后再升级试试
const getX6 = (mode: string) => {
  const envMode = loadEnv(mode, process.cwd()).VITE_APT_MODE
  return envMode !== 'production'
    ? [
        {
          find: '@antv/x6',
          replacement: '@antv/x6/lib',
        },
        {
          find: '@antv/x6-vue-shape',
          replacement: '@antv/x6-vue-shape/lib',
        },
      ]
    : []
}

export default ({ mode }) => {
  console.log(`当前环境：${mode}`)
  return defineConfig({
    resolve: {
      alias: [
        ...getX6(mode),
        {
          find: '@',
          replacement: resolve(__dirname, 'src'),
        },
      ],
    },
    plugins: [
      vue(),
      Components({
        resolvers: [
          AntDesignVueResolver({
            // 相当于不用插件时在main.ts里引入的less文件
            importStyle: 'less',
          }),
        ],
      }),
    ],
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            'primary-color': '#015C61',
          },
          javascriptEnabled: true,
        },
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3001,
    },
  })
}
