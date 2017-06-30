import React, {Component} from 'react';
import $ from 'jquery';

import 'materialize-css/bin/materialize.css';
import 'materialize-css/bin/materialize.js';
import 'materialize-css/js/init';

import '../../App.css';

import getCookie from 'zx-misc/getCookie';

import ProjectReportDetails from './ProjectReportDetails';

import handleReportType from '../../misc/handleReportType';
import handlePromiseReport from '../../misc/handlePromiseReport';
import handlePromiseOptional from '../../misc/handlePromiseOptional';
import handlePromiseNav from '../../misc/handlePromiseNav';

import {handleBlockReportBasicInfo} from '../../section/SectionReportBasicInfo';
import {handleBlockReportScore} from '../../section/SectionReportScore';
import {handleChildrenBasicTableData, handleChildrenBasicScatterData} from '../../section/SectionChildrenBasic';
import {handleChartRadarInclicatorsLv1Data, handleChartBarInclicatorsLv1Data} from '../../section/SectionInclicatorsSystem';
import {handleReportStandardLevelBarData, handleReportStandardLevelTableData} from '../../section/SectionReportStandardLevel';
//let config = require('zx-const')[process.env.NODE_ENV];

class ProjectReportContainer extends Component {
    constructor() {
        super();
        this.state = {
            reportData: null
        };
    }

    componentDidMount() {
        let wxOpenid = getCookie('wx_openid');
        let userName = getCookie('user_name');
        let reportUrl = getCookie('report_url');

        // 根据报告的url判定报告的类型
        let reportType = handleReportType(reportUrl);

        // 报告内容的数据
        let promiseReport = handlePromiseReport(userName, wxOpenid, reportType, reportUrl);

        // 报告optional的数据
        let promiseOptional = handlePromiseOptional(userName, wxOpenid, reportUrl);


        // 报告nav的数据
        let promiseNav = handlePromiseNav(userName, wxOpenid, reportUrl);

        // 处理返回的数据
        $.when(promiseReport, promiseNav).done(function (responseReport, responseNav) {
            responseReport = responseReport[0];
            responseNav = JSON.parse(responseNav[0]);

            // @TODO: 添加返回报告的数据为空的异处理
            console.log(responseReport);
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
                    if (property === 'project') {
                        reportItem.order = 1;
                    }
                    else if (property === 'grade') {
                        reportItem.order = 2;
                    }
                    else if (property === 'klass') {
                        reportItem.order = 3;
                    }
                    else if (property === 'pupil') {
                        reportItem.order = 4;
                    }
                    otherReportData.push(reportItem);
                }
            }

            // 处理报告的标题信息
            //let titleData = this.handleReportTitle(reportType, paperInfoData);

            // 获取满分
            let fullScore = paperInfoData.score ? parseInt(paperInfoData.score) : -1;

            // 获取学校数目
            let schoolNumber = mainNavData.length ? mainNavData.length : null;

            // 处理报告的基本信息
            let basicData = this.handleReportBasicData(paperInfoData, mainReportData, schoolNumber);

            // 处理报告的分数
            let scoreData = handleBlockReportScore(reportType, 'score', fullScore, mainReportData, otherReportData);

            // 处理报告的分化度
            let diffData = handleBlockReportScore(reportType, 'diff', 200, mainReportData, otherReportData);

            //处理指标体系
            let inclicatorsSystemData = this.handleInclicatorsSystemData(reportType, mainReportData);

            this.setState({
                reportData: {
                    basicData: basicData,
                    scoreData: scoreData,
                    diffData: diffData,
                    inclicatorsSystemData:inclicatorsSystemData
                }
            });


            promiseOptional.done(function (responseOptional) {
                responseOptional = JSON.parse(responseOptional);
                let responseOptionalData = responseOptional.children;

                //处理各学校基本信息
                let childrenBasicData = this.handleChlidrenBasicData(reportType, responseOptionalData);

                // 处理各分数段表现情况
                let standardLevelData = this.handleReportStandardLevelData(reportType, mainReportData, responseOptionalData);

                this.setState({
                    reportData: {
                        ...this.state.reportData,
                        chlidrenBasicData: childrenBasicData,
                        standardLevelData: standardLevelData
                    }
                });
            }.bind(this));
        }.bind(this));

    }

    // 处理报告的基本信息
    handleReportBasicData(paperInfoData, reportData, schoolNumber) {
        let reportDataBasic = reportData.basic;
        let studentNumber = reportData.data.knowledge.base.pupil_number;
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
                type: 'testSubject',
                order: 4,
                value: reportDataBasic.subject ? reportDataBasic.subject : '无'
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
                type: 'schoolNumber',
                order: 7,
                value: schoolNumber ? schoolNumber : '无'
            },
            {
                type: 'studentNumber',
                order: 8,
                value: studentNumber ? studentNumber : '无'
            },
            {
                type: 'testDate',
                order: 9,
                value: reportDataBasic.quiz_date ? reportDataBasic.quiz_date : '无'
            }
        ];

        modifiedData = handleBlockReportBasicInfo(modifiedData);

        return modifiedData;

    }

    // 处理报告的分数
    handleReportScore(reportType, fullScore, mainReportData, otherReportData) {
        let modifiedData = {
            main: [
                {
                    type: reportType,
                    fullScore: fullScore,
                    data: mainReportData
                }
            ],
            other: otherReportData
        };

        return modifiedData;
    }

    //处理指标体系的基本信息
    handleInclicatorsSystemData(reportType, datas) {
        let modifiedData = {
            knowledgeInclicatorsData: {},
            skillInclicatorsData:{},
            abilityInclicatorsData:{}
        };
        let knowledgeDataArr = [], skillDataArr = [], abilityDataArr = [];
        let legend = ['区域'];
        //知识的数据
        let knowledgeData = datas.data.knowledge;
        knowledgeDataArr.push(knowledgeData);
        //技能的数据
        let skillData = datas.data.skill;
        skillDataArr.push(skillData);
        //能力的数据
        let abilityData = datas.data.ability;
        abilityDataArr.push(abilityData);

        let knowledgChartRadarInclicatorsLv1Data = handleChartRadarInclicatorsLv1Data(reportType, legend, knowledgeDataArr);
        let skillChartRadarInclicatorsLv1Data = handleChartRadarInclicatorsLv1Data(reportType, legend, skillDataArr);
        let abilityChartRadarInclicatorsLv1Data = handleChartRadarInclicatorsLv1Data(reportType, legend, abilityDataArr);

        let title = '一级指标平均分、中位数、分化度'
        let knowledgChartBarInclicatorsLv1Data = handleChartBarInclicatorsLv1Data(reportType, title, knowledgeData);

        modifiedData.knowledgeInclicatorsData.chartRadarInclicatorsLv1Data = knowledgChartRadarInclicatorsLv1Data;
        modifiedData.skillInclicatorsData.chartRadarInclicatorsLv1Data = skillChartRadarInclicatorsLv1Data;
        modifiedData.abilityInclicatorsData.chartRadarInclicatorsLv1Data = abilityChartRadarInclicatorsLv1Data;

        modifiedData.knowledgeInclicatorsData.chartBarInclicatorsLv1Data = knowledgChartBarInclicatorsLv1Data;

        return modifiedData;
    }

    //处理子群体基本信息
    handleChlidrenBasicData(reportType, data) {
        let modifiedData = {
            childrenBasicTableData: null,
            chlidrenBasicScatterData: null
        };

        //处理各学校基本信息表格数据
        let tHeader = ['学校', '班级数', '参考人数', '平均分', '分化度'];
        let childrenBasicTableData = handleChildrenBasicTableData(reportType, tHeader, data);
        modifiedData.childrenBasicTableData = childrenBasicTableData;

        //处理各学校基本信息散点图的数据
        let title = '各学校平均分与分化度';
        let childrenBasicScatterData = handleChildrenBasicScatterData(reportType, title, data);
        modifiedData.chlidrenBasicScatterData = childrenBasicScatterData;

        return modifiedData;
    }

    // 处理各分数段表现情况
    handleReportStandardLevelData(reportType, mainData, optionalData) {
        let modifiedData = {
            standardLevelBarData: null,
            standardLevelTableData: null
        };

        // 处理各分数段柱状图
        modifiedData.standardLevelBarData = handleReportStandardLevelBarData(mainData);

        // 处理子群体各分数段数据表
        let tHeader = ['学校', '优秀人数', '优生占比', '良好人数', '良好占比', '不及格人数', '不及格占比'];
        modifiedData.standardLevelTableData = handleReportStandardLevelTableData(tHeader, optionalData);

        return modifiedData;
    }

    render() {
        return (
            <div>
                <ProjectReportDetails reportData={this.state.reportData}/>
            </div>
        )
    }
}

export default ProjectReportContainer;
