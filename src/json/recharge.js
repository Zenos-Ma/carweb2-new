import themeJSON from './roma.json';
export default {
  op1: {
    backgroundColor: 'transparent',
    calculable: true,
    title: {
      show: false,
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b} : {c} 辆({d}%)',
    },
    grid: {
      left: '3%',
      right: '3%',
      bottom: '3%',
      top: '3%',
      containLabel: true,
    },
    series: [{
      name: '支付方式',
      type: 'pie',
      startAngle: 90,
      radius: '60%',

      center: ['50%', '50%'],
      label: {
        show: true,
        formatter: '{b}-{c}次\n{d}%',
        position: 'inside',
        fontSize: 16,
        textShadowColor: "white",
        textShadowBlur: 4

      },
      emphasis: {
        itemStyle: {
          shadowColor: 'white',
          shadowBlur: 10,
        },
      },
      data: [{
        value: 345,
        name: '支付宝',
      },
      {
        value: 123,
        name: '微信',
      },

      {
        value: 246,
        name: '其他',
      },

      ],
    },],
  },

  op2: {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },

    grid: {
      left: '3%',
      right: '5%',
      bottom: '3%',
      top: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      axisTick: {
        show: false
      },
      axisLabel: {
        fontSize: 12,
        color: "gray",
        rotate: 45
      },

      axisLine: {
        show: false,
      },
      data: [
        'test1',
        'test2',
        'test3',
        'test4',
        'test5',
      ],
    },
    yAxis: {
      type: 'value',
      show: false,

    },
    series: [{
      name: '充值次数',
      type: 'bar',
      label: {
        normal: {
          show: true,
          position: 'inside',
          color: '#FFF',
          formatter: '{c}',
          fontSize: 16,
          textShadowColor: "gray",
          textShadowBlur: 4
        },
      },
      itemStyle: {
        color () {
          var colors = themeJSON.color;
          return colors[parseInt(Math.random() * colors.length)];
        },
      },

      data: [816, 592, 302, 202, 189],
    },],
  },
  op3: {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c}次',
    },
    grid: {
      top: '3%',
      left: '3%',
      bottom: '3%',
      right: '3%',
    },
    series: [{
      name: '套餐类型',
      type: 'wordCloud',
      shape: 'diamond',
      size: ['100%', '100%'],
      textRotation: [0, 0],
      // rotationStep:'360',
      textPadding: 0,
      autoSize: {
        enable: true,
        minSize: 14,
      },
      textStyle: {
        normal: {
          color () {
            var colors = themeJSON.color;
            return colors[parseInt(Math.random() * colors.length)];
          },
        },
        emphasis: {
          shadowColor: 'white',
          shadowBlur: 10,
        },
      },
      data: [{
        value: 400,
        name: 'E02L-B'
      },
      {
        value: 375,
        name: 'E02L'
      },
      {
        value: 348,
        name: 'LX_ZT19C'
      },
      {
        value: 207,
        name: 'C20'
      },
      {
        value: 300,
        name: 'ZT01'
      },
      {
        value: 250,
        name: 'ZT02'
      },
      {
        value: 167,
        name: 'ZT03'
      },
      {
        value: 112,
        name: 'C02'
      },
      ],
    },],
  },
  op4: {
    backgroundColor: 'transparent',
    grid: {
      top: '20%',
      left: '5%',
      right: '5%'
    },
    yAxis: {
      type: "value",
      axisLabel: {
        fontSize: 12,
        color: "gray"
      },

      name: "单位:次"
    },
    xAxis: {
      type: 'category',
      axisLabel: {
        fontSize: 12,
        color: "gray"
      },
      data: ['2018/12/28', '2018/12/29', '2018/12/30', '2018/12/31', '2019/1/4', '2019/1/5', '2019/1/6', '2019/1/7', '2019/1/8', '2019/1/9', '2019/1/10', '2019/1/11', '2019/1/12', '2019/1/13', '2019/1/14', '2019/1/15', '2019/1/16', '2019/1/17', '2019/1/18', '2019/1/19', '2019/1/20', '2019/1/21', '2019/1/22', '2019/1/23', '2019/1/24', '2019/1/25', '2019/1/28', '2019/1/29', '2019/1/30', '2019/2/1', '2019/2/2', '2019/2/3', '2019/2/4', '2019/2/5', '2019/2/6', '2019/2/7', '2019/2/9', '2019/2/10', '2019/2/11', '2019/2/12', '2019/2/13', '2019/2/14', '2019/2/15', '2019/2/16', '2019/2/17', '2019/2/18', '2019/2/19', '2019/2/20', '2019/2/21', '2019/2/22', '2019/2/23', '2019/2/24', '2019/2/25', '2019/2/26', '2019/2/27', '2019/2/28', '2019/3/1', '2019/3/2', '2019/3/3', '2019/3/4', '2019/3/5', '2019/3/6', '2019/3/7', '2019/3/8', '2019/3/9', '2019/3/10', '2019/3/11', '2019/3/12', '2019/3/13', '2019/3/14', '2019/3/15', '2019/3/16', '2019/3/17', '2019/3/18', '2019/3/19', '2019/3/20', '2019/3/21', '2019/3/22', '2019/3/23', '2019/3/24', '2019/3/25', '2019/3/26', '2019/3/27', '2019/3/28', '2019/3/29', '2019/3/30', '2019/3/31', '2019/4/1', '2019/4/2', '2019/4/3', '2019/4/4', '2019/4/5', '2019/4/6', '2019/4/7', '2019/4/8', '2019/4/9', '2019/4/10', '2019/4/11', '2019/4/12', '2019/4/13', '2019/4/14', '2019/4/15', '2019/4/16', '2019/4/17', '2019/4/18', '2019/4/19', '2019/4/20', '2019/4/21', '2019/4/22', '2019/4/23', '2019/4/24', '2019/4/25', '2019/4/26', '2019/4/27', '2019/4/28', '2019/4/29', '2019/4/30', '2019/5/1', '2019/5/2', '2019/5/3', '2019/5/4', '2019/5/5', '2019/5/6', '2019/5/7', '2019/5/8', '2019/5/9', '2019/5/10', '2019/5/11', '2019/5/12', '2019/5/13', '2019/5/14', '2019/5/15', '2019/5/16', '2019/5/17', '2019/5/18', '2019/5/19', '2019/5/20', '2019/5/21', '2019/5/22', '2019/5/23', '2019/5/24', '2019/5/25', '2019/5/26', '2019/5/27', '2019/5/28', '2019/5/29', '2019/5/30', '2019/5/31', '2019/6/1', '2019/6/2', '2019/6/3', '2019/6/4', '2019/6/5', '2019/6/6', '2019/6/7', '2019/6/8', '2019/6/9', '2019/6/10', '2019/6/11', '2019/6/12', '2019/6/13', '2019/6/14', '2019/6/15', '2019/6/16', '2019/6/17', '2019/6/18', '2019/6/19', '2019/6/20', '2019/6/21', '2019/6/22', '2019/6/23', '2019/6/24', '2019/6/25', '2019/6/26']
    },
    visualMap: {
      min: 0,
      max: 1100,
      show: false,
      inRange: {
        color: [themeJSON.color[0], themeJSON.color[1], themeJSON.color[2]],
      }
    },
    dataZoom: [{
      type: 'slider'
    }, {
      type: 'inside'
    }],
    tooltip: {
      show: true
    },

    series: [{
      name: '下单次数日期统计',
      type: 'line',
      areaStyle: {},
      data: [700, 5, 534, 64, 2, 3, 4, 1, 8, 8, 24, 45, 57, 22, 138, 1011, 709, 412, 20, 34, 17, 9, 19, 34, 24, 4, 3, 6, 7, 6, 7, 15, 4, 7, 1, 8, 30, 5, 4, 11, 33, 54, 76, 78, 128, 112, 56, 64, 59, 86, 119, 191, 211, 178, 98, 95, 103, 56, 65, 69, 73, 80, 62, 63, 58, 11, 63, 42, 19, 15, 7, 9, 4, 8, 37, 33, 13, 25, 11, 18, 42, 13, 9, 34, 55, 14, 18, 8, 46, 85, 23, 21, 19, 47, 62, 51, 17, 79, 73, 22, 33, 25, 34, 46, 27, 15, 15, 19, 47, 50, 15, 14, 11, 10, 37, 13, 22, 25, 10, 41, 46, 23, 105, 24, 43, 17, 18, 14, 12, 20, 21, 41, 30, 46, 18, 14, 79, 10, 32, 103, 30, 9, 15, 25, 30, 72, 70, 20, 15, 2, 21, 13, 37, 50, 34, 5, 19, 73, 91, 5, 52, 30, 24, 3, 30, 64, 7, 48, 33, 12, 4, 9, 17, 59]

      ,
      markPoint: {
        data: [{
          type: 'max',
          name: '当天最多充值'
        }]
      },
      markLine: {
        data: [{
          type: "average",
          name: "平均"
        }]
      }
    }]
  }

};
