
import React, { PropTypes } from 'react';
import Layout from '../../components/Layout';
import $ from 'jquery';
import { Switch, Chip, Checkbox, IconButton, Grid, Icon, Cell, Snackbar  } from 'react-mdl';
import config from '../../components/Config';
import history from 'history';
import 'whatwg-fetch';

class SignupPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleShowSnackbar = this.handleShowSnackbar.bind(this);
    this.handleTimeoutSnackbar = this.handleTimeoutSnackbar.bind(this);
    this.state = { isSnackbarActive: false, input: false };
    this.loadProfile = this.loadProfile.bind(this);
  }

  handleShowSnackbar() {
    this.setState({ isSnackbarActive: true, profile: this.state.profile });
  }
  handleTimeoutSnackbar() {
    this.setState({ isSnackbarActive: false, profile: this.state.profile });
  }

  componentDidMount() {
    document.title = "Sign up...";
    this.loadProfile();
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

  loadProfile() {
    var url = config.host + "/v1/profile.json";
    fetch(url, {
      credentials: 'same-origin'
    }).then(this.checkStatus).then(
      r => history.push("/home")
    ).catch( e => {
      this.setState({input: true});
      console.log('request failed', e);
   });
  }

  handleSubmit(e) {
    e.preventDefault();

    var user = {
      user: this.refs.user.value
    };
    var url = config.host + "/v1/create_user.json";

    fetch(url, {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json"
	  }, 
	  credentials: 'same-origin'
    }).then(this.checkStatus).then(
      r => history.push("/home")
    ).catch( e => {
      this.handleShowSnackbar();
      console.log('request failed', e)
    });
  }

  render() {
    if (this.state.input) {
    return (
      <Layout style={{}}>
      使用したいidを入力
      <form onSubmit={this.handleSubmit.bind(this)}>
        <div className="mdl-textfield mdl-js-textfield" style={{display:"table-cell", padding: "5px 0"}}>
          <textarea className="mdl-textfield__input" type="text" rows= "1" ref="user" name="user" style={{width: 100+"%","font-size": 1+"em", border:"1px solid rgba(0,0,0,.12)"}} ></textarea>
        </div>
        <button type="submit" className="mdl-button mdl-js-button" style={{width: 80+"pt"}}>Submit</button>
      </form>
      <Snackbar active={this.state.isSnackbarActive} onTimeout={this.handleTimeoutSnackbar} timeout={1500}>
        Wrong...
      </Snackbar>
      </Layout>
    );
  } else {
    return (<Layout></Layout>);
  }
}

}

export default SignupPage;
