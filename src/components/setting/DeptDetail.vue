<template>
  <a-modal
    v-model:visible="visible"
    :title="title"
    :destroyOnClose="true"
    :afterClose="handleCancel"
    @ok="handleConfirm"
    width="600px"
  >
    <a-form :label-col="labelCol" labelAlign="left">
      <a-form-item label="上级部门" v-bind="validateInfos.parentId">
        <a-cascader
          v-model:value="detailInfo.parentId"
          :field-names="{ value: 'id' }"
          :options="deptOptions"
          placeholder="请选择上级部门"
          change-on-select
        />
      </a-form-item>
      <a-form-item label="部门名称" v-bind="validateInfos.deptName">
        <a-input v-model:value="detailInfo.deptName" placeholder="请输入部门名称" />
      </a-form-item>
      <a-form-item label="显示排序" v-bind="validateInfos.orderNum">
        <a-input-number v-model:value="detailInfo.orderNum" :min="0" />
      </a-form-item>
      <a-form-item label="负责人" v-bind="validateInfos.leader">
        <a-input v-model:value="detailInfo.leader" placeholder="请输入邮箱" />
      </a-form-item>
      <a-form-item label="联系电话" v-bind="validateInfos.phone">
        <a-input v-model:value="detailInfo.phone" placeholder="请输入用户名称" />
      </a-form-item>
      <a-form-item label="邮箱" v-bind="validateInfos.email">
        <a-input v-model:value="detailInfo.email" placeholder="请输入用户密码" />
      </a-form-item>
      <a-form-item label="部门状态" v-bind="validateInfos.status">
        <a-radio-group v-model:value="detailInfo.status">
          <a-radio value="0">启用</a-radio>
          <a-radio value="1">停用</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Form, message } from 'ant-design-vue'
import { deptDetailRules } from '@/validator/setting'
import { actionTypeEnum } from '@/enums/commonEnum'
import { apiGetDeptDetail, apiGetDepartmentList, apiAddDept, apiUpdateDept } from '@/service/api/setting'
import { findTreePath } from '@/utils'

const props = defineProps<{
  handleRefresh: Function
  getSourceData: Function
}>()

const labelCol = { span: 4 }

const visible = ref<boolean>(false)

const title = ref<string>('添加用户')

const handleType = ref(actionTypeEnum.ADD)

const deptId = ref()

const detailInfo = reactive({
  parentId: [],
  deptName: '',
  orderNum: 0,
  leader: '',
  phone: '',
  email: '',
  status: '0',
})

const deptOptions = ref()

const useForm = Form.useForm

const { validate, validateInfos, resetFields } = useForm(detailInfo, deptDetailRules)

/**
 * @desc 初始化对话框
 */
const initModal = async (type: number, initInfo: any) => {
  handleType.value = type
  await getDepartmentList()
  if (type === actionTypeEnum.EDIT) {
    title.value = '编辑用户'
    deptId.value = initInfo.deptId
    await getDeptDetail(initInfo.deptId)
  }
  visible.value = true
}

/**
 * @desc 获取部门详情
 */
const getDeptDetail = async (deptId: number) => {
  const { code, data } = await apiGetDeptDetail({ deptId })
  if (code === 20000) {
    const { deptName, orderNum, leader, phone, email, status } = data
    // 根据最后一个节点找到各级父节点
    const parentIdArr = findTreePath(deptOptions.value, (val: any) => val.id === data.parentId, [])
    Object.assign(detailInfo, {
      parentId: parentIdArr,
      deptName,
      orderNum: parseInt(orderNum),
      leader,
      phone,
      email,
      status,
    })
  }
}

/**
 * @desc 获取部门
 */
const getDepartmentList = async () => {
  const { code, data } = await apiGetDepartmentList()
  if (code === 20000) {
    deptOptions.value = data
  }
}

/**
 * @desc 确认
 */
const handleConfirm = () => {
  let validateField = ['parentId', 'deptName', 'orderNum']
  validate(validateField).then(async () => {
    const len = detailInfo.parentId.length
    const params = { ...detailInfo, parentId: detailInfo.parentId[len - 1] }
    if (handleType.value === actionTypeEnum.ADD) {
      const { code } = await apiAddDept(params)
      if (code === 20000) {
        message.success('添加部门成功')
        props.handleRefresh()
      }
    } else {
      const { code } = await apiUpdateDept({ ...params, deptId: deptId.value })
      if (code === 20000) {
        message.success('更新部门成功')
        props.getSourceData()
      }
    }
    handleCancel()
  })
}

/**
 * @desc 关闭
 */
const handleCancel = () => {
  resetFields()
  visible.value = false
}

defineExpose({
  initModal,
})
</script>

<style lang="less" scoped>
.ant-form {
  .ant-form-item {
    .ant-input-number {
      width: 100%;
    }
  }
}
</style>
