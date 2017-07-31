import React, {Component} from 'react';
import {Map, is} from 'immutable';
// import $ from 'jquery';

import ChartScatterDefault from '../component/ChartScatterDefault';
import TableDefault from '../component/TableDefault';

// let config = require('zx-const')[process.env.NODE_ENV];

//下一级基本信息block
export class SectionChildBasic extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        let propsMap = Map(this.props);
        let nextPropsMap = Map(nextProps);
        return !is(propsMap, nextPropsMap);
    }

    render() {
        let id = this.props.id;
        let title = this.props.title;
        let data = this.props.data;
        let contentSchoolBaseScatterDefault, contentSchoolBaseTableDefault;


        if (data) {
            //散点图
            let chlidBasicScatterData = data.chlidBasicScatterData;
            let chlidScatterData = handleChildBasicScatterData(chlidBasicScatterData);
            console.log('chlidScatterData', chlidScatterData);
            contentSchoolBaseScatterDefault = <BlockChildBasicScatter data={chlidScatterData}/>;

            //表格
            let childBasicTableData = data.childBasicTableData;
            contentSchoolBaseTableDefault = <BlockChildBasicTable data={childBasicTableData}/>;
        }

        return (
            <div id={id} className="zx-section-container scrollspy">
                <div className="col s12">
                    <div className="section">
                        <h2>{title}</h2>
                        {contentSchoolBaseScatterDefault}
                        {contentSchoolBaseTableDefault}
                    </div>
                    <div className="divider"></div>
                </div>
            </div>
        )
    }
}

//下一级基本信息散点图block
class BlockChildBasicScatter extends Component {
    render() {
        let data = this.props.data;
        return (
            <ChartScatterDefault scatterData={data}/>
        )
    }
}

//下一级散点图数据的方法
function handleChildBasicScatterData(data) {
    if (data.length < 0) {
        return false
    }
    let modifiedData = {
        title: '',
        label: {
            x: '分化度',
            y: '平均分'
        },
        isInverse: {
            x: true,
            y: false
        },
        scoreMax: data.scoreMax,
        data: [data.data]
    };

    return modifiedData;
}

//下一级基本信息表格block
class BlockChildBasicTable extends React.Component {
    render() {
        let data = this.props.data;
        return (
            <TableDefault data={data}/>
        )
    }
}