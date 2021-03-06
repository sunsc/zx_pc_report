import React from "react";
import $ from 'jquery';
import { Map, is } from 'immutable';

import 'zx-style/customScrollBar/customScrollBar.css';
require('jquery-mousewheel')($);
require('malihu-custom-scrollbar-plugin')($);
export default class DashbordChildTable extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {
        $('.zx-dashboard-table-scroll tbody').mCustomScrollbar({
            theme: 'inset-3-dark',
            scrollInertia: 400,
            mouseWheel: {scrollAmount: 200}
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        let propsMap = Map(this.props);
        let nextPropsMap = Map(nextProps);
        return !is(propsMap, nextPropsMap);
    }

    render() {
        let data = this.props.data;
        let title = this.props.title;
        let time = this.props.time;
        let areaData = this.props.areaData;
        let tStyle = 'striped zx-dashboard-table-scroll';

        //区域数据
        let areaChineseAverage = areaData.chinese.average ? areaData.chinese.average:'-';
        let areaChineseDiff = areaData.chinese.diff ? areaData.chinese.diff:'-';
        let areaMathAverage = areaData.math.average ? areaData.math.average:'-';
        let areaMathDiff = areaData.math.diff ? areaData.math.diff:'-';
        let areaEnglishAverage = areaData.english.average ? areaData.english.average:'-';
        let areaEnglishDiff = areaData.english.diff ? areaData.english.diff:'-';

        //学校数据
        let chineseAverage,chineseDiff,mathAverage,mathDiff,englishAverage,englishDiff;
        let contentTData = data.map((data, index) => {
            chineseAverage = data.chinese.average ? data.chinese.average:'-';
            chineseDiff = data.chinese.diff ? data.chinese.diff:'-';
            mathAverage = data.math.average ? data.math.average:'-';
            mathDiff = data.math.diff ? data.math.diff:'-';
            englishAverage = data.english.average ? data.english.average:'-';
            englishDiff = data.english.diff ? data.english.diff:'-';
            return <tr key={index}>
                <td>{data.label}</td>
                <td>{data.pupil}</td>
                <td>{chineseAverage}</td>
                <td>{chineseDiff}</td>
                <td>{mathAverage}</td>
                <td>{mathDiff}</td>
                <td>{englishAverage}</td>
                <td>{englishDiff}</td>
            </tr>;
        });
        let styleRight = {
            textAlign: 'right',
            marginBottom: '5px'
        };

        let styleLeft = {
            textAlign: 'left',
            marginBottom: '5px'
        };

        let style1 = 'zx-summary-numb-box ' + this.props.style1;
        // let style2 = 'zx-summary-numb-box ' + dataItem.style2;
        return (
            <div className="card zx-subject-stats-item z-depth-3">
                <div className={style1}>
                    <div className="zx-summary-numb-box-header">
                        {/*<i className="material-icons zx-summary-numb-box-icon">group_work</i>*/}
                        <div className="zx-summary-numb-box-subject">{title}</div>
                        {time}
                    </div>
                </div>
                <div className="striped">

                </div>
                <table className={tStyle}>
                    <thead>
                    <tr>
                        <th className="zx-table-label-word">参测学校名称</th>
                        <th className="zx-table-pupilname-word">参测人数</th>
                        <th className="zx-table-chinese-word">
                            <div style={styleRight}>语</div>
                            <div>平均分</div>
                        </th>
                        <th className="zx-table-chinese-word">
                            <div style={styleLeft}>文</div>
                            <div>分化度</div>
                        </th>
                        <th className="zx-table-math-word">

                            <div style={styleRight}>数</div>
                            <div>平均分</div>
                        </th>
                        <th className="zx-table-math-word">
                            <div style={styleLeft}>学</div>
                            <div>分化度</div>
                        </th>
                        <th className="zx-table-english-word">
                            <div style={styleRight}>英</div>
                            <div>平均分</div>
                        </th>
                        <th className="zx-table-english-word">
                            <div style={styleLeft}>语</div>
                            <div>分化度</div>
                        </th>
                    </tr>
                    <tr>
                        <td>{areaData.label}</td>
                        <td>{areaData.pupil}</td>
                        <td>{areaChineseAverage}</td>
                        <td>{areaChineseDiff}</td>
                        <td>{areaMathAverage}</td>
                        <td>{areaMathDiff}</td>
                        <td>{areaEnglishAverage}</td>
                        <td>{areaEnglishDiff}</td>
                    </tr>
                    </thead>

                    <tbody>
                    {contentTData}
                    </tbody>
                </table>
            </div>
        )
    }
}