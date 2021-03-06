import React, {Component} from 'react';
import ReactEchartsBar from 'zx-chart/Bar';
import chartConst from 'zx-chart/const';
import handleInclicatorsName from '../misc/handleInclicatorsName'

//默认柱状图的block 参数 text  legends yData xData seriesData
class ChartBarDefault extends Component {
    getOption(text, legends, yData, xData, seriesData) {

        //处理多个y轴
        let yAxisArr = [];
        for (let i = 0; i < yData.length; i++) {
            let obj = {
                type: 'value',
                name: null,
                min: 0,
                max: 100,
                position: null,
                axisLine: {
                    lineStyle: chartConst.AXIS_LINE_STYLE
                },
                splitLine: {
                    show: false
                },
                inverse:false,
                nameLocation:null
            }
            obj.name = yData[i].name;
            obj.min = yData[i].min;
            obj.max = yData[i].max;
            obj.position = yData[i].position;
            obj.inverse = yData[i].inverse;
            obj.nameLocation = yData[i].nameLocation || 'end';

            yAxisArr.push(obj);
        }

        //处理series数据
        let seriesArr = [];
        for (let i = 0; i < seriesData.length; i++) {
            let obj = {
                name: null,
                type: null,
                yAxisIndex: 0,
                data: [],
                barMaxWidth:20,
                itemStyle:{
                    normal:{
                        barBorderRadius:[10,10,0,0]
                    }
                }
            }
            obj.name = seriesData[i].name;
            obj.type = seriesData[i].type || 'bar';
            obj.yAxisIndex = seriesData[i].yIndex || 0;
            obj.data = seriesData[i].data;
            seriesArr.push(obj);
        }
        //检测指标长度
        let xAxisData = handleInclicatorsName(8,xData);

        let option = {
            color: chartConst.COLORS,
            textStyle: chartConst.TEXT_STYLE,
            title: {
                show: false,
                text: text
            },
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                top: '60px',
                left: '40px',
                right: '40px',
                bottom: '100px'
            },
            legend: {
                right: 0,
                data: legends
            },
            xAxis: [
                {
                    type: 'category',
                    name: '',
                    axisLine: {
                        lineStyle: chartConst.AXIS_LINE_STYLE
                    },
                    axisTick: {
                        alignWithLabel: true
                    },
                    data: xAxisData
                }
            ],
            yAxis: yAxisArr,
            series: seriesArr
        };

        return option;
    }

    render() {
        let data = this.props.data;
        let option = this.getOption(data.title, data.legends, data.yData ,data.inclicatorData, data.seriesData);
        let style = {
            height: '500px',
            width: '100%'
        };
        return (
            <div>
                <div className="zx-note-container">
                    <div className="zx-note-icon"><i className="material-icons">info_outline</i></div>
                    <ul className="zx-note-content">
                        <li className="zx-quiz-note">柱状图越高表示该指标表现越好</li>
                        <li className="zx-quiz-note">分化度越靠近上方，均衡性越好</li>
                        <li className="zx-quiz-note">中位数得分率表示了前50%的学生在该指标上的最低水平</li>
                        <li className="zx-quiz-note">中位数得分率高于平均得分率，表示至少有50%的学生在该指标上高于平均水平</li>
                    </ul>
                </div>

                <ReactEchartsBar option={option} style={style} className='echarts-for-echarts'/>
            </div>

        )
    }
}

export default ChartBarDefault;