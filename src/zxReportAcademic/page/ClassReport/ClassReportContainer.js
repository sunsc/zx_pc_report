import React, {Component} from 'react';
import $ from 'jquery';

import 'materialize-css/bin/materialize.css';
import 'materialize-css/bin/materialize.js';

import '../../../style/style-report.css';

import getCookie from 'zx-misc/getCookie';

import ClassReportDetails from './ClassReportDetails';

import handleReportType from '../../misc/handleReportType';
import handlePromiseReport from '../../misc/handlePromiseReport';
import handlePromiseOptional from '../../misc/handlePromiseOptional';
import handlePromiseNav from '../../misc/handlePromiseNav';

import Preloader from '../../component/Preloader';

import {handleReportTitle} from '../../section/SectionReportTitle';
import {handleBlockReportBasicInfo} from '../../section/SectionReportBasicInfo';
import {handleBlockReportScore} from '../../section/SectionReportScore';
import {handleChildBasicTableData, handleChildBasicScatterData} from '../../section/SectionChildBasic';
import {handleChartRadarInclicatorsLv1Data, handleChartBarInclicatorsLv1Data, handleTableInclicatorsLv1Data, handleScatterInclicatorsLvTwoData, handletableInclicatorsLvTwoData} from '../../section/SectionInclicatorsSystem';
import {handleReportStandardLevelBarData, handleReportStandardLevelTableData} from '../../section/SectionReportStandardLevel';
import {handleChildIndicatorsLvOneData} from '../../section/SectionChildIndicatorsLvOne';
import {handleWrongQuizeData, handleOtherWrongQuizeData} from '../../section/SectionWrongQuize';

let config = require('zx-const')[process.env.NODE_ENV];

class ClassReportContainer extends Component {
    constructor() {
        super();
        this.state = {
            loaded: null,
            reportData: null
        };
    }

    componentDidMount() {
        let accessToken = getCookie('selected_access_token');
        //let selectedUserName = getCookie('selected_user_name');
        let reportUrl = getCookie('report_url');

        // 根据报告的url判定报告的类型
        let reportType = handleReportType(reportUrl);/*=>klass*/

        // 报告内容的api数据
        let promiseReport = handlePromiseReport(accessToken, reportType, reportUrl);

        // 报告optional的api数据
        let promiseOptional = handlePromiseOptional(accessToken, reportUrl);

        // 报告nav的数据
        let promiseNav = handlePromiseNav(accessToken, reportUrl);

        // 处理返回的数据
        $.when(promiseReport, promiseNav).done(function (responseReport, responseNav) {
            responseReport = responseReport[0];
            responseNav = JSON.parse(responseNav[0]);
            // @TODO: 添加返回报告的数据为空的异处理
            let paperInfoData = responseReport.paper_info;
            let mainNavData = responseNav[reportType];
            let mainReportData = responseReport[reportType];
            let otherReportData = [];
            for (let property in responseReport) {
                if (responseReport.hasOwnProperty(property) && property !== 'paper_info' && property !== reportType) {
                    let reportItem = {
                        type: property,
                        data: responseReport[property]
                    };
                    if (property === config.REPORT_TYPE_PROJECT) {
                        reportItem.order = 1;
                    }
                    else if (property === config.REPORT_TYPE_PROJECT) {
                        reportItem.order = 2;
                    }
                    else if (property === config.REPORT_TYPE_KLASS) {
                        reportItem.order = 3;
                    }
                    else if (property === config.REPORT_TYPE_PUPIL) {
                        reportItem.order = 4;
                    }
                    otherReportData.push(reportItem);
                }
            }

            // 处理报告的标题信息
            let titleData = handleReportTitle(reportType, paperInfoData, mainReportData);

            // 获取满分
            let fullScore = paperInfoData.score ? parseInt(paperInfoData.score, 10) : -1;

            // 获取学生人数
            let StudentNumber = mainNavData.length ? mainNavData.length : null;

            // 处理报告的基本信息
            let basicData = this.handleReportBasicData(paperInfoData, mainReportData, StudentNumber);

            // 处理报告的分数
            let scoreData = handleBlockReportScore(reportType, 'score', fullScore, mainReportData, otherReportData);

            // 处理报告的分化度
            let diffData = handleBlockReportScore(reportType, 'diff', 200, mainReportData, otherReportData);

            // 处理知识维度数据
            let knowledgeData = this.handleDimension(reportType, mainReportData, 'knowledge',otherReportData);

            // 处理技能维度数据
            let skillData = this.handleDimension(reportType, mainReportData, 'skill' ,otherReportData);

            // 处理能力维度数据
            let abilityData = this.handleDimension(reportType, mainReportData, 'ability' ,otherReportData);

            // 处理错题
            let wrongQuize = this.handleWrongQuize(reportType, mainReportData, otherReportData);

            this.setState({
                loaded: true,
                reportData: {
                    titleData:titleData,
                    basicData: basicData,
                    scoreData: scoreData,
                    diffData: diffData,
                    knowledgeData: knowledgeData,
                    skillData: skillData,
                    abilityData: abilityData,
                    wrongQuize: wrongQuize
                }
            });

            promiseOptional.done(function (responseOptional) {
                responseOptional = JSON.parse(responseOptional);
                let responseOptionalData = responseOptional.children;

                // 处理各分数段表现情况
                let standardLevelData = this.handleReportStandardLevelData(reportType, mainReportData, responseOptionalData);

                // 处理各学生一级指标
                let studentIndicatorsData = this.handleChildIndicatorsInfo(reportType, responseOptionalData);

                this.setState({
                    reportData: {
                        ...this.state.reportData,
                        standardLevelData: standardLevelData,
                        studentIndicatorsData: studentIndicatorsData
                    }
                });
            }.bind(this));
        }.bind(this));
    }

    // 处理报告的基本信息
    handleReportBasicData(paperInfoData, reportData, StudentNumber) {
        let reportDataBasic = reportData.basic;
        let schoolName = reportDataBasic.school;
        let modifiedData = [
            {
                type: 'testDistrict',
                order: 1,
                value: (paperInfoData.province && paperInfoData.city && paperInfoData.district) ? (paperInfoData.province + paperInfoData.city + paperInfoData.district) : '无'
            },
            {
                type: 'testDuration',
                order: 2,
                value: paperInfoData.quiz_duration ? paperInfoData.quiz_duration : '无'
            },
            {
                type: 'testFullScore',
                order: 3,
                value: paperInfoData.score ? paperInfoData.score : '无'
            },
            {
                type: 'schoolName',
                order: 7,
                value: schoolName ? schoolName : '无'
            },
            {
                type: 'testGrade',
                order: 5,
                value: reportDataBasic.grade ? reportDataBasic.grade : '无'
            },
            {
                type: 'testType',
                order: 6,
                value: reportDataBasic.quiz_type ? reportDataBasic.quiz_type : '无'
            },
            {
                type: 'testSubject',
                order: 4,
                value: reportDataBasic.subject ? reportDataBasic.subject : '无'
            },
            {
                type: 'studentNumber',
                order: 8,
                value: StudentNumber ? StudentNumber : '无'
            },
            {
                type: 'testDate',
                order: 9,
                value: reportDataBasic.quiz_date ? reportDataBasic.quiz_date : '无'
            }
        ];

        modifiedData = handleBlockReportBasicInfo(modifiedData);
        // modifiedData.heading = '班级基本信息';

        return modifiedData;

    }

    // 处理子群体基本信息
    handleChlidBasicData(reportType, data) {
        let modifiedData = {
            childrenBasicTableData: null,
            chlidrenBasicScatterData: null
        };

        //处理各班级基本信息表格数据
        let tHeader = ['学校', '班级', '参考人数', '平均分', '分化度'];
        let childrenBasicTableData;
        childrenBasicTableData = handleChildBasicTableData(reportType, tHeader, data);
        modifiedData.childrenBasicTableData = childrenBasicTableData;

        //处理各班级基本信息散点图的数据
        let title = '各学校平均分与分化度';
        let childrenBasicScatterData;
        childrenBasicScatterData = handleChildBasicScatterData(reportType, title, data);
        modifiedData.chlidrenBasicScatterData = childrenBasicScatterData;

        return modifiedData;
    }

    // 处理各分数段表现情况
    handleReportStandardLevelData(reportType, mainData, optionalData) {
        let modifiedData = {
            standardLevelBarData: null,
            standardLevelTableData: null,
            reportType
        };

        // 处理各分数段柱状图
        modifiedData.standardLevelBarData = handleReportStandardLevelBarData(mainData);

        // 处理子群体各分数段数据表
        let tHeader = ['学校', '优秀人数', '优生占比', '良好人数', '良好占比', '不及格人数', '不及格占比'];
        modifiedData.standardLevelTableData = handleReportStandardLevelTableData(tHeader, optionalData);

        return modifiedData;
    }

    // 处理维度数据
    handleDimension(reportType, minData, dimension, otherReportData) {
        let modifiedDimensionData = {
            chartRadarInclicatorsLvOneData: null,
            chartBarInclicatorsLvOneData: null,
            tableInclicatorsLvOneData: null,
            chartScatterInclicatorsLvTwoData: null,
            tableInclicatorsLvTwoData: null,
            dimensionTitle:null
        };
        let data = minData.data[dimension];
        let legend = ['班级','区域','年级'];
        let chartRadarInclicatorsLvOneData = handleChartRadarInclicatorsLv1Data(reportType, legend, minData , dimension, otherReportData);
        let title = '一级指标平均分、中位数、分化度';
        let chartBarInclicatorsLvOneData = handleChartBarInclicatorsLv1Data(reportType, title, data);
        let header = ['指标','平均得分率', '中位数得分率', '分化度'];
        let tableInclicatorsLvOneData = handleTableInclicatorsLv1Data(reportType, header, data);
        let titleScatter = '二级指标分型图';
        let chartScatterInclicatorsLvTwoData = handleScatterInclicatorsLvTwoData(reportType, titleScatter,data);
        // let headerTwo = ['指标','平均得分率','分化度'];
        let tableInclicatorsLvTwoData = handletableInclicatorsLvTwoData(reportType, header, data);

        if(dimension === 'knowledge'){
            modifiedDimensionData.dimensionTitle = '知识';
        }else if(dimension === 'skill'){
            modifiedDimensionData.dimensionTitle = '技能';
        }else if(dimension === 'ability'){
            modifiedDimensionData.dimensionTitle = '能力';
        }

        modifiedDimensionData.chartRadarInclicatorsLvOneData = chartRadarInclicatorsLvOneData;
        modifiedDimensionData.chartBarInclicatorsLvOneData = chartBarInclicatorsLvOneData;
        modifiedDimensionData.tableInclicatorsLvOneData = tableInclicatorsLvOneData;
        modifiedDimensionData.chartScatterInclicatorsLvTwoData = chartScatterInclicatorsLvTwoData;
        modifiedDimensionData.tableInclicatorsLvTwoData = tableInclicatorsLvTwoData;

        return modifiedDimensionData;
    }

    // 处理各学校一级指标的数据
    handleChildIndicatorsInfo(reportType, data) {
        let modifiedData = {
            title: null,
            data: null
        };
        let tableSkill={};
        let tableAbility={};
        let tableKnowledge={};
        let tHeadSkill=[];
        let tDataSkill=[];
        let tHeadAbility=[];
        let tDataAbility=[];
        let tHeadKnowledge=[];
        let tDataKnowledge=[];
        let schoolIndicatorsData = [],
            responseSkill,
            responseAbility,
            responseKnowledge,
            label;
        let name = '学生';
        let inclicatorsArr = ['知识','能力','技能'];
        if (data.length < 0) {
            return false;
        }
        for (let i = 0; i < data.length; i++) {
            if (data[i][1].report_data !== undefined) {
                label = data[i][1].label;
                let skill = data[i][1].report_data.data.skill;
                let ability = data[i][1].report_data.data.ability;
                let knowledge = data[i][1].report_data.data.knowledge;
                responseSkill = handleChildIndicatorsLvOneData(name, label, skill);
                responseAbility = handleChildIndicatorsLvOneData(name, label, ability);
                responseKnowledge = handleChildIndicatorsLvOneData(name, label, knowledge);
                tHeadSkill.push(responseSkill.tHead);
                tDataSkill.push(...responseSkill.tData);
                tHeadAbility.push(responseAbility.tHead);
                tDataAbility.push(...responseAbility.tData);
                tHeadKnowledge.push(responseKnowledge.tHead);
                tDataKnowledge.push(...responseKnowledge.tData);
            }

        }

        tableSkill.tHead = tHeadSkill[0];
        tableSkill.tData = tDataSkill;
        tableAbility.tHead = tHeadAbility[0];
        tableAbility.tData = tDataAbility;
        tableKnowledge.tHead = tHeadKnowledge[0];
        tableKnowledge.tData = tDataKnowledge;

        let knowledgeObj={
            type:inclicatorsArr[0],
            data:tableKnowledge,
        };
        let abilityObj = {
            type:inclicatorsArr[1],
            data:tableAbility,
        };
        let skillObj = {
            type:inclicatorsArr[2],
            data:tableSkill
        };

        schoolIndicatorsData.push(knowledgeObj);
        schoolIndicatorsData.push(abilityObj);
        schoolIndicatorsData.push(skillObj);

        modifiedData.title = name;
        modifiedData.data = schoolIndicatorsData;

        return modifiedData;

    }

    handleWrongQuize(reportType, datas, otherReportData) {
        let wrongQuizeData = {
            wrongQuize:null,
            otherWrongQuize:null,
        };
        let data = datas.paper_qzps;
        let wrongQuize,otherWrongQuize;
        wrongQuize = handleWrongQuizeData(reportType, data, otherReportData);
        otherWrongQuize = handleOtherWrongQuizeData(reportType, data, otherReportData);
        wrongQuizeData.wrongQuize=wrongQuize;
        wrongQuizeData.otherWrongQuize=otherWrongQuize;

        return wrongQuizeData;
    }
    render() {
        return (
            <div className="zx-report-holder">
                {
                    this.state.loaded ||
                    <Preloader />
                }
                {
                    this.state.loaded &&
                    <ClassReportDetails reportData={this.state.reportData}/>

                }
            </div>
        )
    }
}

export default ClassReportContainer;
