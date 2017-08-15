import React, {Component} from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

import {createCookie, getCookie, removeCookie} from 'zx-misc/handleCookie';

import {handleAccountBindedUserList} from '../../misc/handleBindedUserList';
import handleUserRoleLabel from '../../misc/handleUserRoleLabel';

import BlockUserAuthorityList from './BlockUserAuthorityList';
import BlockBindPcUserLogin from './BlockBindPcUserLogin';
import BlockBindWxUserLogin from './BlockBindWxUserLogin';

let config = require('zx-const')[process.env.NODE_ENV];

export default class BindUserContainer extends Component {
    constructor() {
        super();
        let mainAccessToken = getCookie(config.COOKIE.MAIN_ACCESS_TOKEN);
        this.state = {
            flag: null,
            mainAccessToken: (mainAccessToken !== '') ? mainAccessToken : null,
            loginMethod: null,
            mainUser: null
        }
    }

    componentDidMount() {
        this.handleBindedUserList();
    }
    //请求用户列表
    handleBindedUserList() {
        let mainAccessToken = this.state.mainAccessToken;
        let loginMethod = getCookie(config.COOKIE.LOGIN_METHOD);
        let bindedUserListData = {
            access_token: mainAccessToken,
        };
        handleAccountBindedUserList(this, loginMethod, bindedUserListData);
    }

    render() {
        let mainUserDisplayName, containerBlock;
        let loginMethod = this.state.loginMethod;
        if (loginMethod === config.LOGIN_ACCOUNT) {
            if (this.state.mainUser.name === '-') {
                mainUserDisplayName = config.VISITOR;
            } else {
                mainUserDisplayName = this.state.mainUser.name;
            }
        } else {
            if (this.state.mainUser && this.state.mainUser.third_party) {
                mainUserDisplayName = this.state.mainUser.third_party[loginMethod].nickname;
            } else {
                mainUserDisplayName = config.VISITOR;
            }
        }

        let mainAccessToken = this.state.mainAccessToken;
        let mainUserRole = this.state.mainUser ? this.state.mainUser.role : null;
        // let mainUserDisplayName = this.state.mainUser ? (this.state.mainUser.name === '-' ? config.VISITOR : this.props.mainUser.name) : null;
        let mainUserRoleLabel = handleUserRoleLabel(mainUserRole);

        let loginMethod = getCookie(config.COOKIE.LOGIN_METHOD);
        let isCustomer = this.state.mainUser ? this.state.mainUser.is_customer : null;

        let containerBlock;
        if(loginMethod === config.LOGIN_WX){
            if(!isCustomer){
                containerBlock = <h3>当前{mainUserRole}账号,您已经成功关联甄学账号!</h3>
            }else {
                containerBlock = <BlockBindPcUserLogin mainAccessToken={mainAccessToken} mainUserRole={mainUserRole}/>;
            }
        }else if(loginMethod === config.LOGIN_ACCOUNT) {
            if(isCustomer){
                containerBlock = <h3>当前{mainUserRole}账号,您已经成功关联微信账号!</h3>
            }else {
                containerBlock = <BlockBindWxUserLogin mainAccessToken={mainAccessToken} mainUserRole={mainUserRole} />;
            }

        }
        // containerBlock = <BlockBindWxUserLogin />;
        return (
            <div className="container">
                <div className="zx-settings-container">
                    <h1 className="zx-settings-heading">
                        <i className="material-icons zx-settings-icon">account_box</i>
                        <span className="zx-settings-name">{mainUserDisplayName}</span>
                        {/*<span className="zx-settings-role">{mainUserRoleLabel}</span>*/}
                    </h1>
                    <div className="divider"></div>
                    <div className="section">
                        {
                            /*
                            <div className="row">
                                <div className="col s12">
                                    <BlockUserAuthorityList
                                        mainAccessToken={mainAccessToken}
                                        data={mainUserRole}
                                    />
                                </div>
                            </div>
                            */
                        }
                        <div className="row">
                            <div className="col s12">
                                {containerBlock}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )

    }
}

BindUserContainer.contextTypes = {
    router: PropTypes.object.isRequired,
    handleUpdata: PropTypes.func,
    handleAddCompeletta: PropTypes.func
};