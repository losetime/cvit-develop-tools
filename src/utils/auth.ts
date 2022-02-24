import store from '@/store'

/**
 * @desc:  获取token
 */
export function getToken(): string {
  return store.state.token
}

/**
 * @desc 获取userName和userId
 */
export function getUserInfo(): { sysUserId: number; sysUsername: string } {
  const userInfo = store.state.userInfo
  return { sysUserId: userInfo.userId, sysUsername: userInfo.userName }
}
