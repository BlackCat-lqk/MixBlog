import type { EChartsOption } from 'echarts'

// 访问量折线图
const lineOptions: EChartsOption = {
  title: {
    text: '访问量',
    show: true,
    top: '2%',
    left: '3%',
    textStyle: {
      color: '#fff',
    },
  },
  grid: {
    left: '8%',
    bottom: '8%',
  },
  tooltip: {},
  xAxis: {
    type: 'category',
    data: [],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      type: 'line',
      data: [],
    },
  ],
}

// 数据监测饼状图
const pieOptions: EChartsOption = {
  title: {
    text: '数据监测',
    show: true,
    top: '2%',
    left: '3%',
    textStyle: {
      color: '#fff',
    },
  },
  tooltip: {
    trigger: 'item',
  },
  legend: {
    top: '15%',
    left: 'center',
  },
  series: [
    {
      name: '使用设备',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '60%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center',
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 24,
          fontWeight: 'bold',
        },
      },
      labelLine: {
        show: false,
      },
      data: [],
    },
  ],
}

export { lineOptions, pieOptions }
