import React, {Component} from 'react';
import chartConst from 'zx-chart/const';
import ReactEchartsScatter from './../../echarts/Scatter';

export default class ChartScatterForChildBasic extends Component {
    getOption(rawData) {
        let data = rawData.data;
        let options = rawData.options;
        let selfAndParentData, obj, legendName = [];
        let diffDegree, scoreAverage;
        let seriesArr = [];

        //拆分数据(把原始数据拆分成两部分一部分是极值) 临时解决方案
        let optional = [...data[0]];
        optional.sort(function (x, y) {
            let val1 = Number(x.value[1]);
            let val2 = Number(y.value[1]);
            return val2 - val1;
        });
        let max = optional.shift();                 //取数组第一个为最大值
        let min = optional.pop();                   //取数组第二个为最小值
        let markPoint = [max, min];                 //组合成一个极值数组
        let mergeArr = [optional, markPoint];       //再组装成一个二维数组

        //添加本报告自身数据
        if (data.length > 1) {
            selfAndParentData = data[data.length - 1];
            for (let i = 0; i < selfAndParentData.length; i++) {
                if (selfAndParentData[i].name) {
                    diffDegree = selfAndParentData[i].value[0];
                    scoreAverage = selfAndParentData[i].value[1];
                    legendName.push(selfAndParentData[i].name);
                    obj = {
                        name: legendName,
                        type: 'effectScatter',
                        data: [selfAndParentData[i]],
                        symbolSize: 10,
                        z: 2000,
                        symbol: 'triangle',
                        label: {
                            normal: {
                                show: true,
                                formatter: '{b}',
                                position: 'bottom'
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: chartConst.COLORS_GOOD
                            }
                        }
                    };
                    seriesArr.push(obj);
                }
            }
        }

        //组装数据 (把组装好的二维数据再组装成eacher对象)
        for (let i = 0; i < mergeArr.length; i++) {
            let obj;
            if (i === 0) {
                obj = {
                    type: 'scatter',
                    data: mergeArr[i],
                    symbolSize: 10,
                    markArea: {
                        silent: true,
                        label: {
                            normal: {
                                position: 'inside',
                                textStyle: {
                                    color: '#212121',
                                    fontSize: 16
                                }
                            }
                        },
                        data: [
                            [
                                {
                                    //name: '高质量\n\n高均衡',
                                    xAxis: 0,
                                    yAxis: scoreAverage,
                                    itemStyle: {
                                        normal: {
                                            color: '#E5FFFB',
                                            borderColor: '#E5FFFB',
                                            borderWidth: 2,
                                            borderType: 'solid'
                                        }
                                    }
                                },
                                {
                                    xAxis: diffDegree,
                                    yAxis: options.yAxis.max
                                }
                            ],
                            [
                                {
                                    //name: '高质量\n\n低均衡',
                                    xAxis: diffDegree,
                                    yAxis: scoreAverage,
                                    itemStyle: {
                                        normal: {
                                            color: '#fafafa',
                                            borderColor: '#fafafa',
                                            borderWidth: 2,
                                            borderType: 'solid'
                                        }
                                    }
                                },
                                {
                                    xAxis: 200,
                                    yAxis: options.yAxis.max
                                }
                            ],
                            [
                                {
                                    //name: '低质量\n\n高均衡',
                                    xAxis: 0,
                                    yAxis: options.yAxis.min,
                                    itemStyle: {
                                        normal: {
                                            color: '#fafafa',
                                            borderColor: '#fafafa',
                                            borderWidth: 2,
                                            borderType: 'solid'
                                        }
                                    }
                                },
                                {
                                    xAxis: diffDegree,
                                    yAxis: scoreAverage
                                }
                            ],
                            [
                                {
                                    //name: '低质量\n\n低均衡',
                                    xAxis: diffDegree,
                                    yAxis: options.yAxis.min,
                                    itemStyle: {
                                        normal: {
                                            color: '#fce9e9',
                                            borderColor: '#fce9e9',
                                            borderWidth: 2,
                                            borderType: 'solid'
                                        }
                                    }
                                },
                                {
                                    xAxis: 200,
                                    yAxis: scoreAverage
                                }
                            ]

                        ]
                    }
                };
            } else {
                obj = {
                    type: 'effectScatter',
                    data: this.convertData(mergeArr[i]),
                    symbolSize: 10,
                    z: 1000
                };
            }
            seriesArr.push(obj);
        }

        let xAxisName = options.xAxis.name;
        let yAxisName = options.yAxis.name;

        let option = {
            color: chartConst.COLORS,
            textStyle: chartConst.TEXT_STYLE,
            grid: {
                left: '1%',
                right: '1%',
                bottom: '4%',
                containLabel: true
            },
            tooltip: {
                show: true,
                formatter: function (params) {
                    return params.name +
                        `</br>${yAxisName}:` + params.value[1] +
                        `</br>${xAxisName}:` + params.value[0];
                }
            },
            // legend: {
            //     right: 10,
            //     data: legendName
            // },
            xAxis: [
                {
                    name: xAxisName,
                    type: 'value',
                    inverse: options.xAxis.inverse,
                    scale: true,
                    axisLine: {
                        lineStyle: chartConst.AXIS_LINE_STYLE,
                    },
                    axisLabel: {
                        formatter: '{value}'
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            type: 'dashed'
                        }
                    },
                    nameLocation: 'middle',
                    nameGap: 22,
                    min: options.xAxis.min,
                    max: options.xAxis.max,
                    z: 9
                }
            ],
            yAxis: [
                {
                    name: yAxisName,
                    type: 'value',
                    scale: true,                //是否必须从0刻线起
                    inverse: options.yAxis.inverse,
                    axisLine: {
                        lineStyle: chartConst.AXIS_LINE_STYLE,
                        onZero: false
                    },
                    axisLabel: {
                        formatter: '{value}'
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            type: 'dashed'
                        }
                    },
                    nameLocation: 'end',
                    min: options.yAxis.min,
                    max: options.yAxis.max,
                    z: 9
                },
            ],
            series: seriesArr
        };

        return option;
    }

    //处理极值的函数
    convertData(data) {
        let res = [];
        let obj;
        for (let i = 0; i < data.length; i++) {
            if (i === 0) {
                obj = {
                    ...data[i],
                    label: {
                        normal: {
                            show: true,
                            formatter: '{b}',
                            position: 'top',
                            offset: [0, -5]
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: chartConst.COLORS_EXCELLENT
                        }
                    }
                }
            } else {
                obj = {
                    ...data[i],
                    label: {
                        normal: {
                            show: true,
                            formatter: '{b}',
                            position: 'bottom'
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: chartConst.COLORS_FAILED
                        }
                    }

                }
            }
            res.push(obj);
        }
        return res;
    }

    render() {
        let data = this.props.data;
        let option = this.getOption(data);
        let style = {
            height: '400px',
            width: '100%'
        };
        return (
            <ReactEchartsScatter option={option} style={style} className='echarts-for-echarts'/>
        )
    }
}