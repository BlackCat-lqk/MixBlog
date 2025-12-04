<template>
  <n-modal v-model:show="showModal">
    <n-card
      style="width: 600px"
      title="编辑随记"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
  <div class="edit-release-box">
    <n-form ref="formRef" inline :label-width="80" :model="editForm" :rules="rules">
      <div style="width: 100%">
        <div class="note-title-box">
          <n-form-item path="title">
            <n-input
              v-model:value="editForm.title"
              type="text"
              maxlength="200"
              show-count
              clearable
              placeholder="请输入标题"
            />
          </n-form-item>
        </div>
        <div class="note-content-box">
          <n-form-item path="content">
            <n-input
              v-model:value="editForm.content"
              type="textarea"
              maxlength="9999"
              show-count
              clearable
              placeholder="请输入内容"
              :autosize="{
                minRows: 10,
                maxRows: 30,
              }"
            />
          </n-form-item>
        </div>
      </div>
      <n-divider />
    </n-form>
    <div class="title-box">
      <div class="title-btn-box" style="display: flex; justify-content: flex-end; gap: 20px;">
        <n-button strong secondary @click="cancleModal">取消</n-button>
        <n-button type="info" @click="confirmSave">确定修改</n-button>
      </div>
    </div>
  </div>
  </n-card>
</n-modal>
</template>

<script setup lang="ts">
import type { FormInst, UploadFileInfo } from 'naive-ui'
import { updateNoteApi } from '@/http/notes'
import { useMessage } from 'naive-ui'
const message = useMessage()
const props = defineProps<{
  showEdit: boolean,
  data: any,
}>()

const emits = defineEmits(['update:showEdit'])
const showModal = ref(false)
watch(() => props.showEdit, (val) => {
  showModal.value = val
}, { immediate: true })
// 取消修改
const cancleModal = () => {
  showModal.value = false
  emits('update:showEdit', false)
}


const formRef = ref<FormInst | null>(null)

interface editFormType {
  _id: string
  email: string
  title: string
  content: string
  tempFile: UploadFileInfo | null
  cover: string
  weather: string
}

let editForm: editFormType = reactive({
  _id: '',
  email: '',
  title: '',
  content: '',
  tempFile: null,
  cover: '',
  weather: '',
})
watch(() => props.data, (val) => {
  editForm = val[0]
})
const rules = {
  title: [
    {
      required: true,
      message: '请输入标题',
      trigger: 'blur',
    },
  ],
  content: [
    {
      required: true,
      message: '请输入内容',
      trigger: 'blur',
    },
  ],
}
// 确定修改
const confirmSave = async () => {
  try {
    await formRef.value?.validate()
    const response = await updateNoteApi({
      _id: editForm._id,
      title: editForm.title,
      content: editForm.content,
      cover: editForm.cover,
      weather: editForm.weather,
    })
    const res = response.data
    if (res.code === 200) {
      showModal.value = false
      message.success(res.message)
    }else {
      message.error(res.message)
    }
  }catch(err: any) {
    message.error(err)
  }
}
</script>

<style scoped lang="scss">
.edit-release-box {
  width: 480px;
  min-width: 440px;
  border-radius: 8px;
  box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.1);
  background-color: rgba(22, 117, 211, 0.1);
  padding: 20px;

  .n-form {
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: space-between;
    height: 100%;
    .title-box {
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
    }
    .note-title-box {
      width: 100%;

      img {
        margin-left: 10px;
        cursor: pointer;
      }
    }

    .note-content-box {
      width: 100%;
    }
  }
}
</style>
