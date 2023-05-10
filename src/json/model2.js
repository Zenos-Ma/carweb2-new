import echarts from 'echarts';
export default {
  op1: {
    backgroundColor: 'transparent',
    series: [
      {
        name: '刻度',
        type: 'gauge',
        center: ['50%', '55%'],
        radius: '90%',
        min: 0,
        max: 220,
        splitNumber: 11,
        startAngle: 225,
        endAngle: -45,
        axisLine: {
          show: true,
          lineStyle: {
            width: 1,
            color: [[1, 'rgba(0,0,0,0)']],
            shadowColor: '#fff', //默认透明
            shadowBlur: 10,
          },
        }, //仪表盘轴线
        axisLabel: {
          show: true,
          color: '#FFF',
          distance: 25,
          shadowColor: '#fff', //默认透明
          shadowBlur: 10,
          formatter (v) {
            return parseInt(v);
          },
        }, //刻度标签。
        axisTick: {
          show: true,
          splitNumber: 7,
          lineStyle: {
            // color: '#fff',
            width: 1,
            shadowColor: '#fff', //默认透明
            shadowBlur: 10,
          },
          length: -8,
        }, //刻度样式
        splitLine: {
          show: true,
          length: -20,
          lineStyle: {
            color: '#fff',
          },
        }, //分隔线样式
        detail: {
          show: false,
        },
        pointer: {
          show: false,
        },
      },
      {
        type: 'gauge',
        radius: '70%',
        center: ['50%', '55%'],
        min: 0,
        max: 220,
        splitNumber: 0, //刻度数量
        startAngle: 225,
        endAngle: -45,
        axisLine: {
          show: true,
          lineStyle: {
            width: 15,
            shadowColor: '#fff', //默认透明
            shadowBlur: 10,
            color: [
              [0.18, '#66FF00'],
              [0.82, '#66CCFF'],
              [1, '#CC0033'],
            ],
          },
        },
        //分隔线样式。
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        pointer: {
          show: true,

        },
        title: {
          show: true,
          offsetCenter: [0, '90%'],  // x, y，单位px
          textStyle: {
            color: '#fff',
            fontSize: 24,
          },
        },
        //仪表盘详情，用于显示数据。
        detail: {
          show: true,
          offsetCenter: [0, '60%'],
          color: '#ffffff',
          formatter (params) {
            return params;
          },
          fontSize: 40,

        },
        data: [
          {
            name: 'km/h',
            value: 0,
          },
        ],
      },
    ],
  },
  op2: {
    backgroundColor: 'transparent',
    series: [
      {
        name: '刻度',
        type: 'gauge',
        center: ['50%', '55%'],
        radius: '90%',
        min: 0,
        max: 220,
        splitNumber: 11,
        startAngle: 225,
        endAngle: -45,
        axisLine: {
          show: true,
          lineStyle: {
            width: 1,
            color: [[1, 'rgba(0,0,0,0)']],
            shadowColor: '#fff', //默认透明
            shadowBlur: 10,
          },
        }, //仪表盘轴线
        axisLabel: {
          show: true,
          color: '#FFF',
          distance: 25,
          shadowColor: '#fff', //默认透明
          shadowBlur: 10,
          formatter (v) {
            return parseInt(v);
          },
        }, //刻度标签。
        axisTick: {
          show: true,
          splitNumber: 7,
          lineStyle: {
            // color: '#fff',
            width: 1,
            shadowColor: '#fff', //默认透明
            shadowBlur: 10,
          },
          length: -8,
        }, //刻度样式
        splitLine: {
          show: true,
          length: -20,
          lineStyle: {
            color: '#fff',
          },
        }, //分隔线样式
        detail: {
          show: false,
        },
        pointer: {
          show: false,
        },
      },
      {
        type: 'gauge',
        radius: '70%',
        center: ['50%', '55%'],
        min: 0,
        max: 220,
        splitNumber: 0, //刻度数量
        startAngle: 225,
        endAngle: -45,
        axisLine: {
          show: true,
          lineStyle: {
            width: 15,
            shadowColor: '#fff', //默认透明
            shadowBlur: 10,
            color: [
              [0.18, '#66FF00'],
              [0.82, '#66CCFF'],
              [1, '#CC0033'],
            ],
          },
        },
        //分隔线样式。
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        pointer: {
          show: true,

        },
        title: {
          show: true,
          offsetCenter: [0, '90%'],  // x, y，单位px
          textStyle: {
            color: '#fff',
            fontSize: 24,
          },
        },
        //仪表盘详情，用于显示数据。
        detail: {
          show: true,
          offsetCenter: [0, '60%'],
          color: '#ffffff',
          formatter (params) {
            return params;
          },
          fontSize: 40,

        },
        data: [
          {
            name: 'km/h',
            value: 0,
          },
        ],
      },
    ],
  },
  op3: {
    backgroundColor: 'transparent',
    series: [
      {
        name: '刻度',
        type: 'gauge',
        center: ['50%', '55%'],
        radius: '90%',
        min: 0, //最小刻度
        max: 100, //最大刻度
        splitNumber: 8, //刻度数量
        startAngle: 225,
        endAngle: -45,
        axisLine: {
          show: true,
          lineStyle: {
            width: 1,
            color: [[1, 'rgba(0,0,0,0)']],
            shadowColor: '#fff', //默认透明
            shadowBlur: 10,
          },
        }, //仪表盘轴线
        axisLabel: {
          show: true,
          color: '#FFF',
          distance: 25,
          shadowColor: '#fff', //默认透明
          shadowBlur: 10,
          formatter (v) {
            return parseInt(v);
          },
        }, //刻度标签。
        axisTick: {
          show: true,
          splitNumber: 7,
          lineStyle: {
            // color: '#fff',
            width: 1,
            shadowColor: '#fff', //默认透明
            shadowBlur: 10,
          },
          length: -8,
        }, //刻度样式
        splitLine: {
          show: true,
          length: -20,
          lineStyle: {
            color: '#fff',
          },
        }, //分隔线样式
        detail: {
          show: false,
        },
        pointer: {
          show: false,
        },
      },
      {
        type: 'gauge',
        radius: '70%',
        center: ['50%', '55%'],
        min: 0, //最小刻度
        max: 100, //最大刻度
        splitNumber: 0, //刻度数量
        startAngle: 225,
        endAngle: -45,
        axisLine: {
          show: true,
          lineStyle: {
            width: 15,
            shadowColor: '#fff', //默认透明
            shadowBlur: 10,
            color: [
              [
                1,
                new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  {
                    offset: 0,
                    color: '#5c53de',
                  },
                  {
                    offset: 1,
                    color: '#18c8ff',
                  },
                ]),
              ]
            ],
          },
        },
        //分隔线样式。
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        pointer: {
          show: false,
        },
        title: {
          show: true,
          offsetCenter: [0, '-26%'], // x, y，单位px
          textStyle: {
            color: '#fff',
            fontSize: 20,
          },
        },
        //仪表盘详情，用于显示数据。
        detail: {
          show: true,
          offsetCenter: [0, '16%'],
          color: '#ffffff',
          formatter (params) {
            return params;
          },
          textStyle: {
            fontSize: 44,
          },
        },
        data: [
          {
            name: 'km',
            value: 0,
          },
        ],
      },
    ],
  },
  op4: {
    backgroundColor: 'transparent',
    tooltip: { show: true },
    xAxis: {
      type: 'category',
      data: [1, 2, 3, 4]
    },
    dataZoom: [{ type: 'inside' }, { type: 'slider', textStyle: { color: '#FFF' } }],
    yAxis: {
      type: 'value',
      //   min: 0,
    },
    visualMap: {
      min: 0,
      max: 110,
      show: false,
    },
    series: [
      {
        data: [1, 2, 3, 4],
        type: 'line',

        name: '轨迹速度',
        markPoint: {
          data: [{ type: 'max', name: '最大速度' }],

        },
        markLine: {
          label: { formatter: '{c}km/h' },
          data: [{ type: 'average', name: '平均速度' }, { type: 'max', name: '最大速度' }],
        },
      },
    ],
  },
};
