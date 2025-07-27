<template>
  <div class="classify-manage-box">
    <div class="classify-box">
      <n-tag size="large" round>
        全部：<span>{{ state.categoryArray.length }}</span>
      </n-tag>
      <n-tag size="large" round> 未分类：<span>0</span> </n-tag>
      <n-tag size="large" round v-for="(item, idx) in state.categoryArray" :key="idx">
        {{ item }}：
        <span>0</span>
      </n-tag>
      <div v-if="isAddInput">
        <n-input v-model:value="state.categoryvalue" :style="{ width: '240px' }"> </n-input>
        <n-button type="primary" ghost @click="closeAddCategory"> 取消 </n-button>
        <n-button type="info" @click="confirmAddCategory"> 确认 </n-button>
      </div>
      <n-button v-else secondary round strong @click="isAddInput = !isAddInput">
        <img src=" @/assets/images/Add.svg" />
        Add
      </n-button>
    </div>
    <div class="manage-option-box">
      <n-button secondary strong @click="showModal = true">
        <img src=" @/assets/images/seting.svg" />
        管理分组
      </n-button>
    </div>
    <n-modal
      style="width: auto"
      v-model:show="showModal"
      preset="dialog"
      title="分类管理"
      negative-text="关闭"
      @positive-click="showModal = false"
      @negative-click="showModal = false"
    >
      <div>
        <n-data-table
          :columns="tableColumns"
          :data="state.categoryData"
          :row-key="rowKey"
          @update:checked-row-keys="handleTableCheck"
        />
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { useUserInfoStore } from '@/stores/userInfo'
import { ref, reactive, onMounted, h, watch } from 'vue'
import { upsertCategoryTags, getCategoryTagsApi } from '@/http/categoryTags'
import type { DataTableColumns, DataTableRowKey } from 'naive-ui'
import { NButton, useMessage } from 'naive-ui'

const isAddInput = ref(false)
const showModal = ref(false)
const userInfoStore = useUserInfoStore()
const emit = defineEmits(['getCategoryTags'])

const props = defineProps({
  isUpdateTag: {
    type: Number,
    default: 0,
  },
  paramsName: {
    type: String,
    default: '',
  },
})

watch(
  () => props.isUpdateTag,
  (newValue) => {
    if (newValue) getCategory()
  },
  { immediate: true },
)

const message = useMessage()
const state = reactive({
  categoryvalue: '',
  categoryArray: [],
  categoryData: [],
  allData: {},
})
interface CategoryTagsType {
  uid: string
  email: string
  type: string
  category: string[]
}
const params: CategoryTagsType = reactive({
  uid: '',
  email: '',
  type: '',
  category: [],
})
const checkedRowKeysRef = ref<DataTableRowKey[]>([])
interface category {
  _id: string
  uid: string
  email: string
  type: string
  category: string[]
  createdAt: string
  updatedAt: string
}
const rowKey = (row: category) => {
  return row._id
}
// 获取选中的行
const handleTableCheck = async (rowKeys: DataTableRowKey[]) => {
  checkedRowKeysRef.value = rowKeys
}
function createColumns({
  operateEdit,
  operateDelete,
}: {
  operateEdit: (row: category) => void
  operateDelete: (row: category) => void
}): DataTableColumns<category> {
  return [
    {
      type: 'selection',
    },
    {
      title: '操作人',
      key: 'email',
    },
    {
      title: '类型',
      key: 'type',
    },
    {
      title: '分类',
      key: 'category',
    },
    {
      title: '创建时间',
      key: 'createdAt',
    },
    {
      title: '更新时间',
      key: 'updatedAt',
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
    message.info(`Edit ${row}`)
  },
  operateDelete: (row) => {
    params.uid = row._id
    params.email = row.email
    params.type = props.paramsName
    const delData = state.categoryArray.filter((item) => {
      if (item !== row.category) {
        return true
      } else {
        return false
      }
    })
    params.category = delData
    upsertCategory(params)
  },
})
// 获取分类标签数据
const getCategory = async () => {
  const params = props.paramsName
  const response = await getCategoryTagsApi(params)
  const res = response.data
  if (res.code == 200) {
    state.allData = res.data
    emit('getCategoryTags', state.allData)
    state.categoryArray = res.data.category
    state.categoryData = res.data.category.map((item: string) => {
      return {
        email: res.data.email,
        type: res.data.type,
        category: item,
        createdAt: res.data.createdAt,
        updatedAt: res.data.updatedAt,
      }
    })
  } else {
    message.error(res.message)
  }
}
// 关闭添加分类input
const closeAddCategory = () => {
  isAddInput.value = false
  state.categoryvalue = ''
}
// 添加或更新分类接口
const upsertCategory = async (params: object) => {
  const response = await upsertCategoryTags(params)
  const res = response.data
  if (res.code === 200) {
    closeAddCategory()
    getCategory()
    showModal.value = false
    message.success(res.message)
  } else {
    message.error(res.message)
  }
}
// 确认添加分类
const confirmAddCategory = () => {
  params.type = props.paramsName
  params.uid = userInfoStore.data.user._id
  params.email = userInfoStore.data.user.email
  params.category = [...state.categoryArray, state.categoryvalue]
  upsertCategory(params)
}

onMounted(() => {
  getCategory()
})
</script>

<style scoped lang="scss">
.classify-manage-box {
  display: flex;
  justify-content: space-between;
  background-color: #2e33380d;
  padding: 10px;
  border-radius: 8px;
  .classify-box {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    img {
      width: 16px;
    }
    span {
      font-size: 16px;
      color: #000;
      font-weight: 600;
    }
  }
  .manage-option-box {
    display: flex;
    height: 100%;
    img {
      width: 16px;
    }
  }
}
</style>
