import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import { isDevMode } from '@/enums/envEnum'
import { StateInterface, UserInfoInterface } from './types'
import { apiGetUserInfo } from '@/service/api/login'

export const key: InjectionKey<Store<StateInterface>> = Symbol()

/**
 * @desc 包装useStore，避免组件每次都需要导入key值
 */
export function useStore() {
  return baseUseStore(key)
}

const store = createStore({
  state() {
    return <StateInterface>{
      token: '',
      userInfo: { userName: '', userId: 0 },
      sidebarStatus: false,
    }
  },
  mutations: {
    SET_TOKEN(state: StateInterface, payload: string) {
      state.token = payload
    },
    SET_USER_INFO(state: StateInterface, payload: UserInfoInterface): void {
      state.userInfo = payload
    },
    SET_SIDEBAR_STATUS(state: StateInterface, payload: StateInterface['sidebarStatus']) {
      state.sidebarStatus = payload
    },
  },
  actions: {
    /**
     * @desc 获取用户信息
     */
    async GetUserInfo({ commit }) {
      const { code, data } = await apiGetUserInfo()
      if (code === 20000) {
        const userInfo = {
          userName: data.user.userName,
          userId: data.user.userId,
        }
        commit('SET_USER_INFO', userInfo)
        return Promise.resolve()
      } else {
        return Promise.reject()
      }
    },
  },
  strict: isDevMode(),
})

export default store
