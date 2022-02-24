<template>
  <div class="role-wrapper">
    <div class="handle-wrap">
      <a-space>
        <a-button type="primary" @click="handleAdd">新增</a-button>
      </a-space>
      <a-space />
    </div>
    <div class="table-wrap">
      <ym-table
        rowKey="roleId"
        :columns="roleColumns"
        :getTableList="getRoleList"
        :rowSelection="false"
        ref="tableInstance"
      >
        <template #slotOne="{ record }">
          <a-switch
            :checked="record.status"
            checked-children="启用"
            un-checked-children="停用"
            checkedValue="0"
            unCheckedValue="1"
            :disabled="record.admin"
            @change="(checked: string) => changeUserStatus(checked, record)"
          />
        </template>
        <template #action="{ record }">
          <a-space v-if="!record.admin">
            <a-button type="link" size="small" @click="handleEdit(record)">修改</a-button>
            <a-button type="link" size="small" danger @click="handleDel(record.roleId)">删除</a-button>
          </a-space>
        </template>
      </ym-table>
    </div>
    <role-detail ref="detailInstance" :getSourceData="getSourceData" :handleRefresh="handleRefresh" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import YmTable from '@/components/common/YmTable.vue'
import RoleDetail from '@/components/setting/RoleDetail.vue'
import { apiGetRoleList, apiDeleteRole, apiModifyRoleStatus } from '@/service/api/setting'
import { roleColumns } from '@/enums/tableHeadEnum'
import { actionTypeEnum } from '@/enums/commonEnum'
import { message } from 'ant-design-vue'
import { YmModal } from '@/utils/antd'

/**
 ********************************* 表格逻辑 ******************************************
 */

// 表格实例
const tableInstance = ref()

/**
 * @desc 重新获取当前页列表
 */
const getSourceData = () => {
  tableInstance.value.getSourceData()
}

/**
 * @desc 列表刷新
 */
const handleRefresh = () => {
  tableInstance.value.handleRefresh()
}

/**
 * @desc 获取用户列表
 */
const getRoleList = async () => {
  const { current, size } = tableInstance.value.reqParams
  const { code, rows, total } = await apiGetRoleList({
    pageSize: size,
    pageNum: current,
  })
  return Promise.resolve({
    code,
    data: {
      records: rows,
      total,
    },
  })
}

/**
 * @desc 列表删除
 */
const handleDel = (roleId: number) => {
  YmModal.delete(async () => {
    const { code } = await apiDeleteRole({ roleId })
    if (code === 20000) {
      message.success('删除成功')
      getSourceData()
    }
  })
}

/**
 * @desc 修改用户状态
 */
const changeUserStatus = async (checked: string, record: any) => {
  const { roleId } = record
  const { code } = await apiModifyRoleStatus({ status: checked, roleId })
  if (code === 20000) {
    message.success(checked === '0' ? '已启用' : '已停用')
    getSourceData()
  }
}

const detailInstance = ref()

/**
 * @desc 新增
 */
const handleAdd = () => {
  detailInstance.value.initModal(actionTypeEnum.ADD)
}

/**
 * @desc 编辑
 */
const handleEdit = (record: any) => {
  detailInstance.value.initModal(actionTypeEnum.EDIT, { roleId: record.roleId })
}
</script>

<style lang="less" scoped>
.role-wrapper {
  .handle-wrap {
    display: flex;
    justify-content: space-between;
    margin-bottom: 14px;
  }
}
</style>
