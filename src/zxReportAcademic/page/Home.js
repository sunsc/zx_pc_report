import React, {Component} from 'react';

import 'materialize-css/bin/materialize.css';
import 'materialize-css/bin/materialize.js';

import '../../style/style-general.css';
import '../../style/style-report.css';

class App extends Component {
    constructor() {
        super();
        this.state = {
        };
    }

    componentDidMount() {

    }

    render() {
        let style = {
            height: '100%'
        };

        return (
            <div style={style} className="zx-body-container">
                <h1>报告系统</h1>
            </div>
        )
    }
}

export default App;
