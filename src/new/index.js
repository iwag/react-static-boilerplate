
import React, { PropTypes } from 'react';
import Layout from '../../components/Layout';
import { Switch, Chip, Checkbox, IconButton, Grid, Icon, Cell, Snackbar  } from 'react-mdl';
import config from '../../components/Config';
import 'whatwg-fetch';

class NewPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleShowSnackbar = this.handleShowSnackbar.bind(this);
    this.handleTimeoutSnackbar = this.handleTimeoutSnackbar.bind(this);
    this.state = { isSnackbarActive: false };
    this.url=config.host + "/v1/word.json";
  }

  handleShowSnackbar() {
    this.setState({ isSnackbarActive: true });
  }
  handleTimeoutSnackbar() {
    this.setState({ isSnackbarActive: false });
  }

  componentDidMount() {
    document.title = "単語を登録";
    this.refs.text.focus();
  }

  // TODO move source like util.js
 checkStatus(r) {
    if (r.status >= 200 && r.status < 300) {
      return r
    } else {
      var error = new Error(r.statusText)
      error.response = r
      throw error
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    var v = {
      text: this.refs.text.value
    };
    fetch(this.url, {
      method: "POST",
      body: JSON.stringify(v),
      headers: {
        "Content-Type": "application/json"
      },
    	credentials: 'same-origin'
    }).then(this.checkStatus)
    .then(
      r => r.json()
    ).then(r => {
        this.refs.text.value = "";
        this.refs.text.focus();
        this.handleShowSnackbar();
	}).catch( e =>
      console.log('request failed', e)
    );
  }

  render() {
    return (
      <Layout style={{}}>
      単語を入力
      <form onSubmit={this.handleSubmit.bind(this)}>
        <div className="mdl-textfield mdl-js-textfield" style={{display:"table-cell", padding: "5px 0px"}}>
          <textarea className="mdl-textfield__input" type="text" rows= "3" ref="text" name="text" style={{width: "420pt","font-size": 3+"em", border:"1px solid rgba(0,0,0,.12)"}} ></textarea>
        </div>
        <button type="submit" className="mdl-button mdl-js-button" style={{width: 100+"pt"}}>登録</button>
      </form>
      <Snackbar active={this.state.isSnackbarActive} onTimeout={this.handleTimeoutSnackbar} timeout={1500}>
        Done...
      </Snackbar>
      </Layout>
    );
  }

}

export default NewPage;
