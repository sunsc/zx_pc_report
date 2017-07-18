import React, {Component} from 'react';
import { Map, is } from 'immutable';
// import $ from 'jquery';

import TableDefault from '../component/TableDefault';
// let config = require('zx-const')[process.env.NODE_ENV];

//处理一级指标
export function handleChildIndicatorsLvOneData(title, optional, data) {
    let tHead = [], tData = [], tableData = [],SchoolIndicatorsObj={};
    let label = optional;
    tHead.push(`${title}名称`);
    // label=label.replace(/\d+/ig,'');
    // label=label.replace(/[a-z]+[A-Z]+/ig,'');
    // label=label.replace(/\(\)/,'');
    tableData.push(label);
    let dataArr = data.lv_n;
    for (let i = 0; i < dataArr.length; i++) {
        for (let j in dataArr[i]) {
            let name = dataArr[i][j].checkpoint;
            let score_average_percent = dataArr[i][j].score_average_percent;
            let scoreAveragePercent = (parseFloat((`${score_average_percent}`) * 100).toFixed(2));
            tHead.push(name);
            tableData.push(scoreAveragePercent);
        }
    }
    tData.push(tableData);
    SchoolIndicatorsObj.tHead=tHead;
    SchoolIndicatorsObj.tData=tData;
    return SchoolIndicatorsObj;
}

export class SectionChildIndicatorsLvOne extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        let propsMap = Map(this.props);
        let nextPropsMap = Map(nextProps);
        return !is(propsMap, nextPropsMap);
    }

    render() {
        let data = this.props.data;
        let title = data.title;
        let contentTableDefault;
        //学校基本信息表格
        if (data) {
            contentTableDefault = data.data.map((item, index) => {
                let tableData = {
                    tHeader: item.data.tHead,
                    tData: item.data.tData
                };
                return <div key={index} className="zx-school-indicators-margin">
                    <h3>{item.type}</h3>
                    <TableDefault key={index} data={tableData}/>
                </div>;
            })
        }

        return (
        <div className="zx-section-container scrollspy">
            <div className="col s12">
                <div className="section">
                    <h2>各{title}各指标表现情况</h2>
                    {contentTableDefault}
                </div>
                <div className="divider"></div>
            </div>
        </div>

        )
    }
}