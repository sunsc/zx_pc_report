import React, {Component} from 'react';
import TableDefault from '../component/TableDefault';
// let config = require('zx-const')[process.env.NODE_ENV];

//处理一级指标
export function handleSchoolIndicatorsLvOneData(optional, data) {
    let tHead = [], tData = [], tableData = [],SchoolIndicatorsObj={};
    let label = optional;
    let schoolName = '学校名称';
    tHead.push(schoolName);
    tableData.push(label);
    data.lv_n.map((item, index) => {
        for (let j in item) {
            let name = item[j].checkpoint;
            let score_average_percent = item[j].score_average_percent;
            let scoreAveragePercent = (parseFloat((`${score_average_percent}`) * 100).toFixed(2));
            tHead.push(name);
            tableData.push(scoreAveragePercent);
        }
    });
    tData.push(tableData);
    SchoolIndicatorsObj.tHead=tHead;
    SchoolIndicatorsObj.tData=tData;
    return SchoolIndicatorsObj;
}

export class SectionSchoolIndicatorsLvOne extends Component {

    render() {
        let data = this.props.data;
        let contentTableDefault;
        //学校基本信息表格
        if (data) {
            contentTableDefault = data.map((item, index) => {
                console.log('1', data);
                console.log('1', item.tHead);
                console.log('2', item.tData);
                let tableData = {
                    tHeader: item.tHead,
                    tData: item.tData
                };
                return <div className="zx-school-indicators-margin">
                    <TableDefault data={tableData}/>
                </div>;
            })
        }

        return (
            <div className="section">
                <h2 className="zx-header-highlight zx-header-highlight-teal">各学校各指标表现水平图</h2>
                {contentTableDefault}
            </div>
        )
    }
}
