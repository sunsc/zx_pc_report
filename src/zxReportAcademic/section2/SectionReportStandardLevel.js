import React, {Component} from 'react';
import { Map, is } from 'immutable';
// import $ from 'jquery';

// import handleAllEchartsResize from 'zx-chart/handleAllEchartsResize';
import ReactEchartsPictorialBar from 'zx-chart/PictorialBar';

import TableDefault from '../component/TableDefault';
// import Note from '../component/Note';

let config = require('zx-const')[process.env.NODE_ENV];

//分段图
class ChartReportStandardLevel extends React.Component {
    getOption(data) {
        let keys = [], series = [];
        let fullValue= data.fullValue;
        let values= data.values;
        for (let i in values) {
            let value = values[i];
            let color, barBorderRadius;
            if (value.type === 'failed') {
                color = '#e57373';
                barBorderRadius = [15, 0, 0, 15]
            }
            else if (value.type === 'good') {
                color = '#ffc107';
                barBorderRadius = 0
            }
            else if (value.type === 'excellent') {
                color = '#4fc3f7';
                barBorderRadius = [0, 15, 15, 0]
            }
            let seriesItem = {
                name: value.label,
                type: 'bar',
                barMaxWidth: 30,
                itemStyle: {
                    normal: {
                        barBorderRadius: barBorderRadius,
                        color: color
                    }
                },
                stack: '总人数',
                label: {
                    normal: {
                        show: false
                    }
                },
                data: value.value
            };
            keys.push(value.label);
            series.push(seriesItem);
        }


        let option = {
            legend: {
                show: false,
                data: keys
            },
            tooltip: {
            },
            grid: {
                top:15,
                left:15,
                right:15,
                bottom:20
            },
            xAxis:  {
                type: 'value',
                min: 0,
                max: fullValue,
                show: false
            },
            yAxis: {
                show: false,
                type: 'category',
                data: []
            },
            series: series
        };

        return option;
    }
    render(){
        let data = this.props.data ? this.props.data : null;
        let option =this.getOption(data);
        let style = {
            height: '80px',
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

//处理下一级分段表格的数据
export function handleReportStandardLevelTableData(reportType, tHeader, data) {
    let modifiedData = {
        tHeader: tHeader,
        tData: []
    };

    for (let i in data) {
        let dataItem = data[i][1].report_data;
        if (dataItem) {
            let label = '';
            if (reportType === config.REPORT_TYPE_PROJECT) {
                label = dataItem.basic.school;
            }
            else if (reportType === config.REPORT_TYPE_GRADE) {
                label = dataItem.basic.classroom;
            }
            let dataItemBase = dataItem.data.knowledge.base;
            let tmp = [
                label,
                dataItemBase.excellent_pupil_number,
                parseFloat(dataItemBase.excellent_percent*100).toFixed(1) + '%',
                dataItemBase.good_pupil_number,
                parseFloat(dataItemBase.good_percent*100).toFixed(1) + '%',
                dataItemBase.failed_pupil_number,
                parseFloat(dataItemBase.failed_percent*100).toFixed(1) + '%'
            ];
            modifiedData.tData.push(tmp);
        }
    }

    return modifiedData;
}

//处理下一级分段柱状图的数据
export function handleReportStandardLevelBarData(data) {
    let modifiedData = {
        fullValue: null,
        values: []
    };

    let dataBase = data.data.knowledge.base;
    modifiedData.fullValue = dataBase.pupil_number || -1;
    modifiedData.values = [
        {
            type: 'failed',
            label: '不及格',
            value: [dataBase.failed_pupil_number]
        },
        {
            type: 'good',
            label: '良好',
            value: [dataBase.good_pupil_number]
        },
        {
            type: 'excellent',
            label: '优秀',
            value: [dataBase.excellent_pupil_number]
        },
    ];

    return modifiedData;
}

//下一级分段的Block
export class SectionReportStandardLevel extends Component {
    constructor() {
        super();
        this.state = {
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        let propsMap = Map(this.props);
        let nextPropsMap = Map(nextProps);
        return !is(propsMap, nextPropsMap);
    }

    render() {
        let data = this.props.data;
        let heading = data.heading;
        let contentInfo, contentBar, contentTable;
        if (data.standardLevelBarData) {
            contentInfo = data.standardLevelBarData.values.map((value, index) => {
                let color = 'zx-standard-level-color-box ';
                if (value.type === 'failed') {
                    color += 'red lighten-2';
                }
                else if (value.type === 'good') {
                    color += 'amber';
                }
                else if (value.type === 'excellent') {
                    color += 'light-blue lighten-2';
                }
                return (
                    <div key={index} className="zx-standard-level-item">
                        <span className={color}></span>
                        <span className="zx-standard-level-label">{value.label}:</span>
                        <span className="zx-standard-level-content">{value.value}人</span>
                    </div>
                );
            });
            contentInfo = <div className="zx-standard-level-container">{contentInfo}</div>;
            contentBar = <ChartReportStandardLevel data={data.standardLevelBarData} />;
        }

        if (data.standardLevelTableData&&data.reportType!=='klass') {
            contentTable = <TableDefault data={data.standardLevelTableData} />
        }

        return (
            <div id="zx-report-standard-level" className="zx-section-container scrollspy">
                <div className="section">
                    <h2>{heading}各分数段的表现情况</h2>
                    <div className="row">
                        <div className="col s12">{contentInfo}</div>
                        <div className="col s12">{contentBar}</div>
                        <div className="col s12">{contentTable}</div>
                    </div>
                </div>
                <div className="divider"></div>
            </div>

        )
    }
}