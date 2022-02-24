export interface StateInterface {
  token: string
  userInfo: UserInfoInterface
  sidebarStatus: boolean
}

export interface UserInfoInterface {
  userName: string
  userId: number
}
