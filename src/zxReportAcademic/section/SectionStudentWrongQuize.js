import React, {Component} from 'react';
import $ from 'jquery';

import {SectionWrongQuizePopUp} from './SectionWrongQuizePopUp';

//学生报告错题集block
export class SectionStudentWrongQuize extends Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        let wrongData = this.props.data;
        let contentWrongQuizItem = wrongData.map(function (wrongObj, index) {
            return <WrongQuizItem key={index} wrongQuizeData={wrongObj} id={index}/>
        })
        return (
            <div className="row">
                <div className="col s12">
                    <div className="section">
                        <h2>学生错题集</h2>
                        <div className="row">
                            <div className="col s12">
                                {contentWrongQuizItem}
                            </div>
                        </div>
                    </div>
                    <div className="divider"></div>
                </div>
            </div>

        )
    }
}

//学生报告的错题数据处理
export function handleWrongQuizeData(reportType, data) {
    let wrongArr = [];

    for (let i = 0; i < data.length; i++) {
        if (data[i].value) {
            let scoreFull = data[i].value.total_full_score;
            let scoreReal = data[i].value.total_real_score;
            if(scoreReal<scoreFull){
                let wrong = {
                    order: null,
                    full: null,
                    average: null,
                    correct_percent: null,
                    knowledge: null,
                    correct_count: null,
                    pupil_number: null,
                    type: null,
                    qzp_id: null
                };
                if (data[i].qzp_custom_order) {
                    wrong.order = data[i].qzp_custom_order;
                } else {
                    if (data[i].qzp_system_order) {
                        wrong.order = data[i].qzp_system_order;
                    } else {
                        wrong.order = data[i].qzp_order;
                    }
                }
                wrong.full = parseFloat(scoreFull).toFixed(2);
                wrong.real = parseFloat(scoreReal).toFixed(2);
                wrong.correct_percent = parseFloat(data[i].value.score_average_percent*100).toFixed(2);
                wrong.type = data[i].qzp_type;
                wrong.qzp_id = data[i].qzp_id;
                wrong.knowledge = data[i].ckps.knowledge[0].checkpoint;

                wrongArr.push(wrong);
            }
        }
    }
    return wrongArr;
}

//学生报告的单题block
class WrongQuizItem extends Component {
    constructor() {
        super();
        this.state = {
            active: false
        }
    }
    handleModal(e) {
        this.setState({
            active: true
        });
        let target = $(e.target);
        let modalID = '#' + target.attr('data-target');
        $(modalID).modal('open');
    }
    render() {
        let wrongObj = this.props.wrongQuizeData;
        let label_percent;
        if(wrongObj.type === '主观'){
            label_percent = '答对比例';
        }else if(wrongObj.type === '客观') {
            label_percent = '得分率';
        }
        let id = `zx-modal-quiz-${this.props.id}`;
        return (
            <div className="zx-wrong-quiz" data-target={id} onClick={this.handleModal.bind(this)}>
                <div className="zx-wrong-quiz-title">
                    <div className="zx-wrong-quiz-order">
                        {wrongObj.order}题
                    </div>
                    <div className="zx-wrong-quiz-full">
                        {wrongObj.type}题
                    </div>
                </div>

                <div className="zx-wrong-quiz-content">

                    <div className="zx-wrong-quiz-item">
                        <span>学生得分/本题满分:</span>
                        <span>{wrongObj.real}/{wrongObj.full}分</span>
                    </div>

                    <div className="zx-wrong-quiz-item">
                        <span>{label_percent}:</span>
                        <span>{wrongObj.correct_percent}%</span>
                    </div>

                </div>

                <div className="zx-wrong-quiz-bottom">
                    <div className="zx-wrong-quiz-item">
                        <span>考察知识点:</span>
                        <span>{wrongObj.knowledge}</span>
                    </div>
                </div>
                <SectionWrongQuizePopUp id={id} wrongObj={wrongObj} active={this.state.active}/>
            </div>
        )
    }
}