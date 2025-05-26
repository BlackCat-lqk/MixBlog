import Mock from 'mockjs';

// 模拟获取笔记列表接口
Mock.mock('/api/notes/list', 'get', {
  code: 200,
  data: {
    list: Mock.mock({
      'list|8': [
        {
          id: '@id',
          title: '@ctitle(5, 15)',
          content: '@cparagraph(1)',
          date: '@date("yyyy-MM-dd")'
        }
      ]
    }
  }
});
