import type { EChartsOption } from 'echarts'

// 访问量折线图
const lineOptions: EChartsOption = {
  tooltip: {},
  xAxis: {
    type: 'category',
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  },
  yAxis: {},
  series: [
    {
      type: 'line',
      data: [120, 132, 101, 134, 90, 230, 210],
    },
  ],
}

// 数据监测饼状图
const pieOptions: EChartsOption = {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: '5%',
    left: 'center'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 1048, name: '移动端' },
        { value: 735, name: 'PC端' },
      ]
    }
  ]
}

export{
  lineOptions,
  pieOptions
}
