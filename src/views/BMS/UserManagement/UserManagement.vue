<template>
  <div class="bms-main-box">
    <div class="header-box">
      <header-view></header-view>
    </div>
    <div class="content-box">
      <div class="sidebar-box">
        <naviga-menu></naviga-menu>
      </div>
      <div class="main-router-box">
        <div class="header-text">
          <h3>用户管理</h3>
        </div>
        <div class="option-btn-box">
          <n-space>
            <n-button type="info" @click="state.showAddModal = true">新增</n-button>
            <n-button type="error" @click="deleteSelectUsers">删除</n-button>
          </n-space>
        </div>
        <div class="table-box" ref="tableBox">
          <n-config-provider>
            <n-data-table
              :columns="tableColumns"
              :data="tableData"
              :row-key="rowKey"
              @update:checked-row-keys="handleTableCheck"
            />
          </n-config-provider>
          <n-modal
            v-model:show="state.showAddModal"
            :to="$refs.tableBox"
            style="width: 600px; padding: 20px"
            preset="dialog"
            title="新增用户"
          >
            <div class="add-from-box">
              <n-form ref="formRef" inline :model="formValue" :rules="rules">
                <n-grid :cols="24" :x-gap="24">
                  <n-form-item-gi :span="12" label="用户名" path="userName">
                    <n-input v-model:value="formValue.userName" placeholder="输入用户名" />
                  </n-form-item-gi>
                  <n-form-item-gi :span="12" label="邮箱" path="email">
                    <n-input v-model:value="formValue.email" placeholder="输入邮箱" />
                  </n-form-item-gi>
                  <n-form-item-gi :span="12" label="角色" path="role">
                    <n-select
                      v-model:value="formValue.role"
                      placeholder="请选择角色"
                      :options="state.roleOptions"
                    />
                  </n-form-item-gi>
                  <n-form-item-gi :span="12" label="密码" path="password">
                    <n-input v-model:value="formValue.password" placeholder="请输入密码" />
                  </n-form-item-gi>
                  <n-form-item-gi :span="12" label="确认密码" path="confirmPassword">
                    <n-input
                      v-model:value="formValue.confirmPassword"
                      placeholder="请再次输入确认密码"
                    />
                  </n-form-item-gi>
                </n-grid>
              </n-form>
              <div class="add-btn-space">
                <n-button style="margin-right: 5px" @click="cancleAdd"> 取消 </n-button>
                <n-button type="info" @click="handleValidateClick"> 确认 </n-button>
              </div>
            </div>
          </n-modal>
          <n-modal
            v-model:show="state.showEditModal"
            style="width: 600px; padding: 10px"
            preset="dialog"
            title="编辑用户"
          >
            <div class="edit-from-box">
              <n-form ref="editFormRef" inline :model="editFormValue" :rules="rules">
                <n-grid :cols="24" :x-gap="24">
                  <n-form-item-gi :span="12" label="用户名" path="userName">
                    <n-input v-model:value="editFormValue.userName" placeholder="输入用户名" />
                  </n-form-item-gi>
                  <n-form-item-gi :span="12" label="邮箱" path="email">
                    <n-input v-model:value="editFormValue.email" placeholder="输入邮箱" disabled />
                  </n-form-item-gi>
                  <n-form-item-gi :span="12" label="角色" path="role">
                    <n-select
                      v-model:value="editFormValue.role"
                      placeholder="请选择角色"
                      :options="state.roleOptions"
                    />
                  </n-form-item-gi>
                  <n-form-item-gi :span="12" label="状态" path="status">
                    <n-select
                      v-model:value="editFormValue.status"
                      placeholder="状态"
                      :options="state.statusOptions"
                    />
                  </n-form-item-gi>
                </n-grid>
              </n-form>
              <div class="edit-btn-space">
                <n-button style="margin-right: 5px" @click="state.showEditModal = false">
                  取消
                </n-button>
                <n-button type="info" @click="handleEditValidate"> 确认 </n-button>
              </div>
            </div>
          </n-modal>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInst, FormItemRule, DataTableRowKey, DataTableColumns } from 'naive-ui'
import HeaderView from '@/views/BMS/components/HeaderView.vue'
import NavigaMenu from '@/views/BMS/components/NavigaMenu.vue'
import { h, reactive, ref, onMounted } from 'vue'
import { NButton, useMessage, useDialog } from 'naive-ui'
import { validateEmail, validateUsername, validatePassword } from '@/utils/validate'
import { createUser, getAllUsers, deleteUsers, updateUsers } from '@/http/user'
const message = useMessage()
const dialog = useDialog()
const state = reactive({
  showAddModal: false,
  showEditModal: false,
  roleOptions: [
    { label: '管理员', value: 'admin' },
    { label: '普通用户', value: 'user' },
  ],
  statusOptions: [
    { label: '启用', value: 'enable' },
    { label: '禁用', value: 'disable' },
  ],
})
const formRef = ref<FormInst | null>(null)
const editFormRef = ref<FormInst | null>(null)
const checkedRowKeysRef = ref<DataTableRowKey[]>([])
const formValue = ref({
  userName: '',
  email: '',
  password: '',
  role: '',
  confirmPassword: '',
})
const editFormValue = reactive({
  _id: '',
  userName: '',
  email: '',
  role: 'user',
  status: 'enable',
})

// 再次输入密码验证
const confirmPassword = (rule: FormItemRule, value: string): boolean | Error => {
  return value === formValue.value.password ? true : new Error('密码不一致')
}
// 表单验证规则
const rules = {
  userName: {
    required: true,
    trigger: ['input', 'blur'],
    validator: validateUsername,
  },
  email: {
    required: true,
    trigger: ['input', 'blur'],
    validator: validateEmail,
  },
  password: {
    required: true,
    trigger: ['input', 'blur'],
    validator: validatePassword,
  },
  confirmPassword: {
    required: true,
    trigger: ['input', 'blur'],
    validator: confirmPassword,
  },
}
// 确认新增用户
const handleValidateClick = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const response = await createUser(formValue.value)
      const res = response.data
      if (res.code === 200) {
        message.success(res.message)
        state.showAddModal = false
        formValue.value = {
          userName: '',
          email: '',
          password: '',
          role: '',
          confirmPassword: '',
        }
        getUsersList()
      } else {
        message.error(res.message)
      }
    } else {
      console.log(errors)
      message.error('Invalid')
    }
  })
}
// 编辑提交
const handleEditValidate = (e: MouseEvent) => {
  e.preventDefault()
  editFormRef.value?.validate(async (errors) => {
    if (!errors) {
      const res = await updateUsers(editFormValue.email, editFormValue)
      message.success(res.data.message)
      state.showEditModal = false
      getUsersList()
    } else {
      console.log(errors)
      message.error('Invalid')
    }
  })
}
interface User {
  _id: string
  userName: string
  email: string
  role: string
  status: string
  createdAt: string
}
function createColumns({
  operateEdit,
  operateDelete,
}: {
  operateEdit: (row: User) => void
  operateDelete: (row: User) => void
}): DataTableColumns<User> {
  return [
    {
      type: 'selection',
    },
    // {
    //   title: 'No',
    //   key: 'no',
    // },
    {
      title: 'ID',
      key: '_id',
    },
    {
      title: 'User Name',
      key: 'userName',
    },
    {
      title: 'Email',
      key: 'email',
    },
    {
      title: 'Role',
      key: 'role',
    },
    {
      title: 'Status',
      key: 'status',
    },
    {
      title: 'Created Date',
      key: 'createdAt',
    },
    {
      title: 'Operate',
      key: 'operate',
      render(row) {
        return [
          h(
            NButton,
            {
              strong: true,
              type: 'info',
              size: 'small',
              onClick: () => {
                operateEdit(row)
              },
            },
            { default: () => 'Edit' },
          ),
          h(
            NButton,
            {
              strong: true,
              type: 'error',
              size: 'small',
              style: { marginLeft: '5px' },
              onClick: () => {
                operateDelete(row)
              },
            },
            { default: () => 'Delete' },
          ),
        ]
      },
    },
  ]
}
const tableColumns = createColumns({
  operateEdit: (row) => {
    editFormValue._id = row._id
    editFormValue.userName = row.userName
    editFormValue.email = row.email
    editFormValue.role = row.role
    editFormValue.status = row.status
    state.showEditModal = true
  },
  operateDelete: (row) => {
    dialog.warning({
      title: '警告',
      content: `确定删除${row.email}?`,
      positiveText: '删除',
      negativeText: '取消',
      draggable: true,
      onPositiveClick: async () => {
        const res = await deleteUsers({ ids: [row._id] })
        message.success(res.data.message)
        getUsersList()
      },
      onNegativeClick: () => {},
    })
  },
})
const tableData = ref<User[]>([])

// 获取用户列表数据
const getUsersList = async () => {
  const response = await getAllUsers()
  const res = response.data
  if (res.code === 200) {
    tableData.value = res.data
  }
}
const handleTableCheck = async (rowKeys: DataTableRowKey[]) => {
  checkedRowKeysRef.value = rowKeys
  console.log(checkedRowKeysRef.value)
}
// 删除选择的用户
const deleteSelectUsers = async () => {
  const ids = checkedRowKeysRef.value
  const res = await deleteUsers({ ids })
  message.success(res.data.message)
  getUsersList()
}
const rowKey = (row: User) => {
  return row._id
}
const cancleAdd = () => {
  state.showAddModal = false
  formValue.value = {
    userName: '',
    email: '',
    password: '',
    role: '',
    confirmPassword: '',
  }
}
onMounted(() => {
  getUsersList()
})
</script>

<style scoped lang="scss">
@include g.bms;

.main-router-box {
  padding: 10px;

  .header-text {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    h3 {
      font-size: 18px;
      line-height: 1.34;
      font-weight: 600;
      color: #1e2025;
    }
  }

  .option-btn-box {
    padding: 10px;
    background-color: #2e33380d;
    border-radius: 8px;
  }

  .table-box {
    padding: 10px;
    margin-top: 20px;
    background-color: #2e33380d;
    border-radius: 8px;
    height: calc(100% - 130px);
  }

  .add-from-box,
  .edit-from-box {
    .add-btn-space,
    .edit-btn-space {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
