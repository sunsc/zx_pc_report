import React, {Component} from 'react';
import { Map, is } from 'immutable';

import ReactEchartsPictorialBar from 'zx-chart/PictorialBar';

//成绩block
export class SectionReportScore extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        let propsMap = Map(this.props);
        let nextPropsMap = Map(nextProps);
        return !is(propsMap, nextPropsMap);
    }

    render() {
        // 区块标题
        let title = this.props.title;

        // 区块数据
        let data = this.props.data;
        let fullValue = data.fullValue;
        let selfValue = data.selfValue;
        let parentValues = data.parentValues;

        // 柱状图
        let chartBar = <ChartBarScore data={data}/>;

        return (
            <div className="zx-section-container">
                <div className="section">
                    <h2>{title}</h2>
                    <div className="row">
                        <div className="col s4">
                            <div className="zx-score-container">
                                <div className="zx-score-item">
                                    <div className="zx-score-header">
                                        <div className="zx-score-title">{selfValue.label}</div>
                                        <i className="material-icons">{selfValue.icon}</i>
                                    </div>
                                    <div className="zx-score-body">
                                        <div className="zx-score-content">{selfValue.value}</div>
                                        <div className="zx-score-subcontent">满分{fullValue}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col s8">
                            {chartBar}
                        </div>
                    </div>
                </div>
                <div className="divider"></div>
            </div>

        )
    }
}

//成绩的echarts图
class ChartBarScore extends React.Component {
    getOption(data) {
        let fullValue= data.fullValue;
        let scoreData= [data.selfValue];
        let key = [];

        let config = {
            baseColor: '#eee',
            barMaxWidth: 25,
            barSymbol: 'path://M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z',
            project: 'path://M-550.7,819.1h-14c-1.1,0-2,0.9-2,2v14c0,1.1,0.9,2,2,2h4l3,3l3-3h4c1.1,0,2-0.9,2-2v-14C-548.7,820-549.6,819.1-550.7,819.1z M-559.7,823.3c0.6-0.6,1.3-0.9,2.1-0.9c0.8,0,1.6,0.4,2.1,0.9c0.8,0.8,1.1,2.1,0.6,3.2c-0.1,0.1-0.1,0.2-0.2,0.3l-2.4,3.5c-0.1,0.1-0.2,0.1-0.2,0c0,0-2.5-3.5-2.5-3.4c-0.3-0.5-0.4-1-0.4-1.5C-560.6,824.6-560.2,823.9-559.7,823.3z M-552.2,831.4c0,0.2-0.1,0.3-0.2,0.4l-3.2,1.9c-0.1,0.1-0.1,0.1-0.2,0.1s-0.1,0-0.2,0l-3.1-1.5l-3,1.5c-0.1,0.1-0.3,0.1-0.4,0c-0.1-0.1-0.2-0.3-0.2-0.4v-4.3c0-0.2,0.1-0.3,0.2-0.4l1.3-0.7v1l-0.7,0.4v3.4l2.6-1.3c0.1-0.1,0.3-0.1,0.4,0l3.1,1.5l2.8-1.6v-2.9l-0.7,0.4v-1l0.9-0.5c0.1-0.1,0.3-0.1,0.4,0c0.1,0.1,0.2,0.3,0.2,0.2L-552.2,831.4L-552.2,831.4z M-558.5,826.4c0.3,0.2,0.6,0.3,0.9,0.3c0.4,0,0.7-0.1,0.9-0.3l0.1-0.1c0.3-0.3,0.4-0.6,0.4-1c0-0.4-0.1-0.7-0.4-1c-0.3-0.3-0.6-0.4-1-0.4c-0.4,0-0.7,0.1-1,0.4c-0.3,0.3-0.4,0.6-0.4,1c0,0.4,0.1,0.7,0.4,1L-558.5,826.4z',
            grade: 'path://M-557.9,828c-0.5,0-1,0.4-1,1c0,0.5,0.4,1,1,1c0.5,0,1-0.5,1-1S-557.3,828-557.9,828z M-551,820.8h-14c-1.1,0-2,0.9-2,2v14c0,1.1,0.9,2,2,2h4l3,3l3-3h4c1.1,0,2-0.9,2-2v-14C-549,821.7-549.9,820.8-551,820.8z M-552.6,835.6h-4.2v-1.9c0-0.5-0.5-1-1.1-1c-0.5,0-1,0.4-1,1v1.9h-4.2v-4.9h2.9v-2.9l2.3-1.8v-2h2.3v1.1h-2.1v0.9l2.3,1.7v3h2.8L-552.6,835.6L-552.6,835.6z',
            klass: 'path://M-265.7,411.2h-14c-1.1,0-2,0.9-2,2v14c0,1.1,0.9,2,2,2h4l3,3l3-3h4c1.1,0,2-0.9,2-2v-14C-263.7,412.1-264.6,411.2-265.7,411.2z M-270.4,416.1c1,0,1.8,0.8,1.8,1.8s-0.8,1.8-1.8,1.8c-0.9,0-1.8-0.8-1.8-1.8S-271.4,416.1-270.4,416.1z M-275,416.1c1,0,1.8,0.8,1.8,1.8s-0.8,1.8-1.8,1.8s-1.8-0.8-1.8-1.8S-276,416.1-275,416.1zM-270.9,424.4h-8.2v-1.5c0-1.4,2.7-2.1,4.1-2.1c1.3,0,4.1,0.7,4.1,2.1V424.4z M-266.3,424.3h-3.5v-1.5c0-0.8-0.5-1.5-1.2-2c0.2,0,0.4,0,0.6,0c1.4,0,4.2,0.7,4.1,2V424.3z',
            pupil: 'path://M-265.7,410.2h-14c-1.1,0-2,0.9-2,2v14c0,1.1,0.9,2,2,2h4l3,3l3-3h4c1.1,0,2-0.9,2-2v-14C-263.7,411.1-264.6,410.2-265.7,410.2z M-272.7,414.3c1.4,0,2.5,1.1,2.5,2.5c0,1.4-1.1,2.5-2.5,2.5c-1.4,0-2.5-1.2-2.5-2.5C-275.2,415.4-274.1,414.3-272.7,414.3z M-267.6,424.3h-10.2V423c0-1.6,3.4-2.5,5.1-2.5s5.1,0.9,5.1,2.5V424.3z',
        };

        let baseBarColor = {
            type: 'linear',
            x: 0,
            y: 1,
            x2: 1,
            y2: 1,
            colorStops: [
                {
                    offset: 0, color: '#e57373' // 0% 处的颜色
                },
                {
                    offset: 0.6, color: '#ffeb3b' // 60% 处的颜色
                },
                {
                    offset: 0.8, color: '#4fc3f7' // 80% 处的颜色
                }
            ],
            globalCoord: false // 缺省为 false
        };

        let series = scoreData.map((scoreItem, index) => {
            let zIndex = index + 3;
            let color = '#757575';
            if (index === 0) {
                color = '#4db6ac';
            }

            let markSymbol;
            if (config.hasOwnProperty(scoreItem.type)) {
                markSymbol = config[scoreItem.type];
            }

            return (
                {
                    name:'排名',
                    type:'bar',
                    yAxisIndex: index,
                    barMaxWidth: 15,
                    silent: true,
                    itemStyle: {
                        normal: {
                            opacity: 0
                        }
                    },
                    markPoint: {
                        symbol: markSymbol,
                        symbolSize: 44,
                        symbolOffset: [0, -40],
                        label: {
                            normal: {
                                show: false
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: color
                            }
                        },
                        data : [
                            {type : 'min', name: '最大值'}
                        ]
                    },
                    data: [scoreItem.value],
                    z: zIndex
                }
            );
        });



        let option = {
            grid: {
                top:15,
                left:15,
                right:15,
                bottom:20
            },
            xAxis: {
                type : 'value',
                nameLocation:'start',
                min:0,
                max:fullValue,
                interval: parseInt(fullValue/5,10),
                //position: 'top',
                offset: -40,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#b6b6b6',
                        opacity: 0.5
                    }
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#b6b6b6'
                    }
                },
                axisTick: {
                    show: true
                },
                splitLine: {
                    show: false,
                    lineStyle: {
                        type: 'dashed',
                        color: ['#ddd']
                    }
                },
                inverse:false
            },
            yAxis: [
                {
                    type : 'category',
                    axisLine: {
                        show: false
                    },
                    axisTick:{show: false},
                    data:key
                },
                {
                    show: false,
                    data: key
                },
                {
                    show: false,
                    data: key
                },
                {
                    show: false,
                    data: key
                }
            ],
            series : [
                {
                    name:'base',
                    type:'bar',
                    barMaxWidth: 15,
                    yAxisIndex: 1,
                    silent: true,
                    itemStyle: {
                        normal: {
                            barBorderRadius: 8,
                            color: baseBarColor
                        }
                    },
                    data: [fullValue],
                    z:10
                }
            ],
            animation:false
        };
        option.series.push(...series);

        return option;
    }
    render(){
        let data = this.props.data ? this.props.data : null;
        let option =this.getOption(data);
        let style = {
            height: '150px',
            width: '100%'
        };
        return (
            <ReactEchartsPictorialBar
                option={option}
                style={style}
                className='echarts-for-echarts'
            />
        )
    }
}