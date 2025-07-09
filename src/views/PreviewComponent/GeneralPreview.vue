<template>
  <div class="file-preview">
    <!-- PDF 预览 -->
    <pdf-preview
      v-if="fileType === 'pdf'"
      :pdf-url="fileUrl"
    />

    <!-- 图片预览 -->
    <image-preview
      v-else-if="isImageType"
      :image-url="fileUrl"
      :alt-text="fileName"
    />

    <!-- Office 文件预览 -->
    <office-preview
      v-else-if="isOfficeType"
      :file-url="fileUrl"
    />

    <!-- 文本文件预览 -->
    <text-preview
      v-else-if="isTextType"
      :file-url="fileUrl"
    />

    <!-- 不支持的文件类型 -->
    <div v-else class="unsupported">
      <i class="fas fa-file"></i>
      <p>不支持预览此文件类型</p>
      <a :href="fileUrl" download class="download-btn">
        <i class="fas fa-download"></i> 下载文件
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import PdfPreview from './PdfPreview.vue';
import ImagePreview from './ImagePreview.vue';
import OfficePreview from './OfficePreview.vue';
import TextPreview from './TextPreview.vue';

export default defineComponent({
  name: 'FilePreview',
  components: {
    PdfPreview,
    ImagePreview,
    OfficePreview,
    TextPreview
  },
  props: {
    fileUrl: {
      type: String,
      required: true
    },
    fileName: {
      type: String,
      required: true
    }
  },
  setup(props) {
    // 获取文件扩展名
    const fileType = computed(() => {
      const parts = props.fileName.split('.');
      return parts.length > 1 ? parts.pop()?.toLowerCase() : '';
    });

    // 图片类型
    const isImageType = computed(() => {
      const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
      return fileType.value && imageTypes.includes(fileType.value);
    });

    // Office 文件类型
    const isOfficeType = computed(() => {
      const officeTypes = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
      return fileType.value && officeTypes.includes(fileType.value);
    });

    // 文本文件类型
    const isTextType = computed(() => {
      const textTypes = ['txt', 'csv', 'json', 'xml', 'md'];
      return fileType.value && textTypes.includes(fileType.value);
    });

    return {
      fileType,
      isImageType,
      isOfficeType,
      isTextType
    };
  }
});
</script>

<style scoped>
.file-preview {
  width: 100%;
  min-height: 300px;
  display: flex;
  flex-direction: column;
}

.unsupported {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;

  i {
    font-size: 3rem;
    color: #6c757d;
    margin-bottom: 1rem;
  }

  p {
    color: #6c757d;
    margin-bottom: 1.5rem;
  }
}

.download-btn {
  padding: 0.5rem 1rem;
  background: #4361ee;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  transition: background 0.3s;

  &:hover {
    background: #3a56d4;
  }

  i {
    font-size: 0.9rem;
    margin-right: 0.5rem;
    color: white;
  }
}
</style>
