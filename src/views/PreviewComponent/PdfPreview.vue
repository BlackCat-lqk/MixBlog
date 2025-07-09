<template>
  <div class="pdf-preview">
    <div class="toolbar">
      <button @click="prevPage">上一页</button>
      <span>第 {{ pageNum }} 页 / 共 {{ pageCount }} 页</span>
      <button @click="nextPage">下一页</button>
    </div>
    <canvas ref="pdfCanvas"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import * as pdfjsLib from 'pdfjs-dist';

export default defineComponent({
  name: 'PdfPreview',
  props: {
    pdfUrl: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const pdfCanvas = ref<HTMLCanvasElement | null>(null);
    const pageNum = ref(1);
    const pageCount = ref(0);
    let pdfDoc: pdfjsLib.PDFDocumentProxy | null = null;

    // 设置PDF.js worker路径
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

    const renderPage = async (num: number) => {
      if (!pdfDoc || !pdfCanvas.value) return;

      const page = await pdfDoc.getPage(num);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = pdfCanvas.value;
      const context = canvas.getContext('2d');

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      if (context) {
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        await page.render(renderContext).promise;
      }

      pageNum.value = num;
    };

    const loadPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(props.pdfUrl);
        pdfDoc = await loadingTask.promise;
        pageCount.value = pdfDoc.numPages;
        await renderPage(1);
      } catch (err) {
        console.error('PDF加载失败:', err);
      }
    };

    const prevPage = () => {
      if (pageNum.value <= 1) return;
      renderPage(pageNum.value - 1);
    };

    const nextPage = () => {
      if (!pdfDoc || pageNum.value >= pdfDoc.numPages) return;
      renderPage(pageNum.value + 1);
    };

    onMounted(() => {
      loadPdf();
    });

    return {
      pdfCanvas,
      pageNum,
      pageCount,
      prevPage,
      nextPage
    };
  }
});
</script>

<style scoped>
.pdf-preview {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.toolbar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

canvas {
  width: 100%;
  border: 1px solid #eee;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
