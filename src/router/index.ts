import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'
import Layout from '@/layout/Layout.vue'
import Header from '@/layout/Header.vue'
import Sidebar from '@/layout/Sidebar.vue'
import Breadcrumb from '@/layout/Breadcrumb.vue'
// import { apiGetRoutersInfo } from '@/service/api/login'

//Vite 支持使用特殊的 import.meta.glob 函数从文件系统导入多个模块
// const views = import.meta.glob('../views/**/**.vue')
// const components = import.meta.glob('../components/**/**.vue')
// const modules = Object.assign(views, components)
// // const getComponent = (key: string) => {
// //   // 如果找不到该页面则赋值404
// //   return modules[key] || modules['../views/error/NotFound.vue']
// // }

/**
 * @desc 命名规范
 * path: '/personal-center',
 * name: PersonalCenter,
 * component: PersonalCenter
 */
const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/index.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/index.vue'),
  },
  {
    path: '/tool',
    name: 'Tool',
    component: Layout,
    redirect: '/tool/graph-list',
    meta: {
      title: '开发工具',
      level: 1,
    },
    children: [
      {
        path: 'graph-list',
        name: 'GraphList',
        components: {
          default: Header,
          sidebar: Sidebar,
          breadcrumb: Breadcrumb,
          main: () => import('../views/graphDesign/GraphList.vue'),
        },
        meta: {
          title: '图列表',
          level: 2,
          icon: 'icon-shujuzhongxin',
        },
      },
    ],
  },
  {
    path: '/graph-design',
    name: 'GraphDesign',
    component: () => import('../views/graphDesign/GraphDesign.vue'),
  },
]

// const specialRoute = ['Overview', 'graphDesign']

/**
 * @desc 获取并添加路由信息
 */
// export const getRouters = async () => {
//   const { code, data } = await apiGetRoutersInfo()
//   if (code === 20000) {
//     const routesInfo = formattRouter(data, [])
//     routesInfo.forEach((item) => {
//       router.addRoute(item)
//     })
//   }
// }

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

/**
 * @desc 路由守卫
 */
router.beforeEach((to, _from, next) => {
  const storeToken = store.state.token
  const cacheToken = localStorage.getItem('ymToken')
  if (to.name === 'Login') {
    if (cacheToken) {
      store.commit('SET_TOKEN', cacheToken)
      store
        .dispatch('GetUserInfo')
        .then(async () => {
          // await getRouters()
          next({ name: 'GraphList' })
        })
        .catch(() => {
          localStorage.removeItem('ymToken')
          next()
        })
    } else {
      next()
    }
  } else {
    if (cacheToken) {
      if (storeToken) {
        next()
      } else {
        store.commit('SET_TOKEN', cacheToken)
        store
          .dispatch('GetUserInfo')
          .then(async () => {
            // await getRouters()
            next({ path: to.path, query: to.query })
          })
          .catch(() => {
            localStorage.removeItem('ymToken')
            next({ name: 'Login' })
          })
      }
    } else {
      next({ name: 'Login' })
    }
  }
})

/**
 * @desc 格式化后端返回的路由信息
 */
// const formattRouter = (data: any[], routerArr: any[]): any[] => {
//   for (const [index, item] of data.entries()) {
//     switch (item.level) {
//       case 1:
//         if (specialRoute.includes(item.routerName)) {
//           routerArr.push({
//             path: item.path,
//             name: item.routerName,
//             component: getComponent(`../${item.component}.vue`),
//             meta: {
//               title: item.menuName,
//               level: item.level,
//               visible: item.visible === '0',
//             },
//             children: [],
//           })
//         } else {
//           routerArr.push({
//             path: item.path,
//             name: item.routerName,
//             component: Layout,
//             redirect: item.children.length > 0 ? `${item.path}/${item.children[0].path}` : item.path,
//             meta: {
//               title: item.menuName,
//               level: item.level,
//               visible: item.visible === '0',
//             },
//             children: [],
//           })
//         }
//         break
//       case 2:
//         routerArr.push({
//           path: item.path,
//           name: item.routerName,
//           components: {
//             default: Header,
//             sidebar: Sidebar,
//             breadcrumb: Breadcrumb,
//             main: getComponent(`../${item.component}.vue`),
//           },
//           meta: {
//             title: item.menuName,
//             level: item.level,
//             icon: item.icon,
//             visible: item.visible === '0',
//           },
//           children: [],
//         })
//         break
//       case 3:
//         routerArr.push({
//           path: item.path,
//           name: item.routerName,
//           components: {
//             mainSub: getComponent(`../${item.component}.vue`),
//           },
//           meta: {
//             title: item.menuName,
//             level: item.level,
//             visible: item.visible === '0',
//           },
//           children: [],
//         })
//         break
//     }
//     if (item.children.length > 0) {
//       formattRouter(item.children, routerArr[index].children)
//     }
//   }
//   return routerArr
// }

export default router
