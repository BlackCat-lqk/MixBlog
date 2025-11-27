// 动态导入工具函数
export const dynamicImportQuillView = () => import('@/components/QuillView.vue')
export const dynamicImportCommentsChat = () => import('@/components/CommentsChat.vue')
export const VueOfficeDocx = () => import('@vue-office/docx')

export const VueOfficeExcel = () => import('@vue-office/excel')

export const VueOfficePdf = () => import('@vue-office/pdf')

export const dynamicImportOGL = () => import('@/views/VueBits/RippleGrid.vue')

export const dynamicImportEpub = () => import('epubjs')
