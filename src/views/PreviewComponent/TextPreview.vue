<template>
  <div class="text-preview">
    <pre v-if="content">{{ content }}</pre>
    <div v-else-if="loading" class="loading">加载中...</div>
    <div v-else class="error">无法加载文件</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  name: 'TextPreview',
  props: {
    fileUrl: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const content = ref('');
    const loading = ref(true);

    const fetchTextFile = async () => {
      try {
        const response = await fetch(props.fileUrl);
        if (response.ok) {
          content.value = await response.text();
        }
      } catch (err) {
        console.error('加载文本文件失败:', err);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchTextFile();
    });

    return {
      content,
      loading
    };
  }
});
</script>

<style scoped>
.text-preview {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 1rem;
  max-height: 500px;
  overflow: auto;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
}

.loading, .error {
  padding: 1rem;
  text-align: center;
  color: #6c757d;
}
</style>
