// -------------------------------------- 数据汇聚 -----------------------------------------------
// -------------------------------------- 告警解决方案配置 -----------------------------------------------

// 在线监测告警
export const onlineMonitorColumns = [
  {
    title: '序号',
    key: 'serialNumber',
    width: 100,
  },
  {
    title: '装置名称',
    key: 'userName',
    dataIndex: 'userName',
  },
  {
    title: '描述',
    key: 'nickName',
    dataIndex: 'nickName',
  },
  {
    title: '建议解决方案',
    key: 'phonenumber',
    dataIndex: 'phonenumber',
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 200,
  },
]

// 辅助控制告警
export const assistantControlColumns = [
  {
    title: '序号',
    key: 'serialNumber',
    width: 100,
  },
  {
    title: '通信ID',
    key: 'userName',
    dataIndex: 'userName',
  },
  {
    title: '信号名称',
    key: 'nickName',
    dataIndex: 'nickName',
  },
  {
    title: '通信类型',
    key: 'phonenumber',
    dataIndex: 'phonenumber',
  },
  {
    title: '告警位置&类别',
    key: 'phonenumber',
    dataIndex: 'phonenumber',
  },
  {
    title: '建议解决方案',
    key: 'phonenumber',
    dataIndex: 'phonenumber',
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 200,
  },
]

// -------------------------------------- 拓扑图工具 -----------------------------------------------

// 图列表
export const graphDesignColumns = [
  {
    title: '序号',
    key: 'serialNumber',
    width: 100,
  },
  {
    title: '流程名称',
    key: 'name',
    dataIndex: 'name',
  },
  {
    title: '创建时间',
    key: 'createTime',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]

// -------------------------------------- 系统设置 -----------------------------------------------

// 用户管理
export const userColumns = [
  {
    title: '用户编号',
    dataIndex: 'userId',
    key: 'userId',
  },
  {
    title: '用户名称',
    key: 'userName',
    dataIndex: 'userName',
  },
  {
    title: '用户昵称',
    key: 'nickName',
    dataIndex: 'nickName',
  },
  {
    title: '部门',
    key: 'deptName',
    customRender: ({ record }: { record: any }) => record.dept.deptName,
  },
  {
    title: '手机号码',
    key: 'phonenumber',
    dataIndex: 'phonenumber',
  },
  {
    title: '状态',
    key: 'slotOne',
  },
  {
    title: '创建时间',
    key: 'createTime',
    dataIndex: 'createTime',
    width: 180,
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 200,
  },
]

// 角色管理
export const roleColumns = [
  {
    title: '角色编号',
    dataIndex: 'roleId',
    key: 'roleId',
  },
  {
    title: '角色名称',
    key: 'roleName',
    dataIndex: 'roleName',
  },
  {
    title: '权限字符',
    key: 'roleKey',
    dataIndex: 'roleKey',
  },
  {
    title: '显示顺序',
    key: 'roleSort',
    dataIndex: 'roleSort',
  },
  {
    title: '状态',
    key: 'slotOne',
  },
  {
    title: '创建时间',
    key: 'createTime',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
  },
]

// 菜单管理
export const menuColumns = [
  {
    title: '菜单名称',
    dataIndex: 'menuName',
    key: 'menuName',
  },
  {
    title: '图标',
    key: 'icon',
    dataIndex: 'icon',
    width: 180,
  },
  {
    title: '排序',
    key: 'orderNum',
    dataIndex: 'orderNum',
    width: 80,
  },
  {
    title: '权限标识',
    key: 'perms',
    dataIndex: 'perms',
    width: 100,
  },
  {
    title: '组件路径',
    key: 'component',
    dataIndex: 'component',
  },
  {
    title: '状态',
    key: 'slotOne',
    width: 100,
  },
  {
    title: '创建时间',
    key: 'createTime',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
  },
]

// 部门管理
export const deptColumns = [
  {
    title: '部门名称',
    dataIndex: 'deptName',
    key: 'deptName',
  },
  {
    title: '排序',
    key: 'orderNum',
    dataIndex: 'orderNum',
  },
  {
    title: '状态',
    key: 'slotOne',
  },
  {
    title: '创建时间',
    key: 'createTime',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
  },
]
