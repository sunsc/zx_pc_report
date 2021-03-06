import React from 'react';
import PropTypes from 'prop-types'; // ES6
import $ from 'jquery';

import handleAllEchartsResize from 'zx-chart/handleAllEchartsResize';

import {handleBlockReportSubjectStats, BlockReportSubjectStats} from './BlockReportSubjectStats';
import {handleBlockChartPie, BlockReportChartPieStats} from './BlockReportChartPieStats';
import {handleBlockReportNumTotal, BlockReportTotalStats} from './BlockReportTotalStats';


//let config = require('zx-const')[process.env.NODE_ENV];

class DashBoardProject extends React.Component {
    constructor() {
        super();
        this.state = {
            reportList: null
        }
    }
    componentDidMount() {
        $(document).ready(function(){
            $('.tooltipped').tooltip({delay: 50});
        });

        handleAllEchartsResize();

    }

    render() {
        let dataReportSubjectStats,
            contentReportSubjectStats,
            dataReportTotalStats,
            contentReportTotalStats,
            dataReportChartPieStats,
            contentReportChartPieStats;

        let heading = this.props.userDisplayName ? `${this.props.userDisplayName}的测评数据中心` : '测评数据中心';

        let dataUser = {
            userName: this.props.userName,
            userRole: this.props.userRole
        };

        if (this.props.allTestData) {
            dataReportTotalStats = handleBlockReportNumTotal(this.props.allTestData);
            contentReportTotalStats = <BlockReportTotalStats data={dataReportTotalStats}/>;
        }

        if (this.props.subjectTestData) {
            dataReportChartPieStats = handleBlockChartPie(this.props.subjectTestData);
            contentReportChartPieStats = <BlockReportChartPieStats data={dataReportChartPieStats}/>;
        }

        if (this.props.subjectTestData) {
            dataReportSubjectStats = handleBlockReportSubjectStats(this.props.subjectTestData);
            contentReportSubjectStats = <BlockReportSubjectStats
                user={dataUser}
                data={dataReportSubjectStats}
                handleReportIframeShow={this.props.handleReportIframeShow.bind(this)}
            />
        }

        return (
            <div id={'zx-'+ this.props.userName} className="zx-dashboard-content" ref={(div) => {this.div = div}}>

                <div className="zx-dashboard-header-container">
                    <h2 className="zx-dashboard-header">
                        <i className="material-icons">assessment</i>
                        <span>{heading}</span>
                    </h2>
                    <div className="divider"></div>
                </div>
                <div className="zx-dashboard-body">
                    <div className="row">
                        <div className="col s12 m6">{contentReportTotalStats}</div>
                        <div className="col s12 m6">{contentReportChartPieStats}</div>
                    </div>
                    {contentReportSubjectStats}
                </div>
            </div>

        )
    }
}

DashBoardProject.contextTypes = {
    handleReportIframeShow: PropTypes.func
};

export default DashBoardProject;