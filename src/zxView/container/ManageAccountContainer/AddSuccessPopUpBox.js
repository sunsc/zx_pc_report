import React,{Component} from 'react'
import PropTypes from 'prop-types'; // ES6
import $ from 'jquery';

class AddSuccessPopUpBox extends Component{
    backHome(){
        this.context.router.push('/');
    }

    render(){
        return(
            <div id="zx-add-user-success-box" className="modal">
                <div className="modal-content">
                    <h4>甄学</h4>
                    <p>绑定用户成功！！！</p>
                </div>
                <div className="modal-footer">
                    <a href="javascript:;" className="modal-action modal-close waves-effect waves-green btn-flat" onClick={this.backHome.bind(this)} >返回首页</a>
                    <a href="javascript:;" className="modal-action modal-close waves-effect waves-green btn-flat" onClick={this.props.handleUpdateBindedUserList.bind(this)} >继续添加</a>
                </div>
            </div>
        )
    }
}
AddSuccessPopUpBox.contextTypes = {
    router: PropTypes.object.isRequired
};
export default AddSuccessPopUpBox;