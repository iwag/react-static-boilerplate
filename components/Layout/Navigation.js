/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Link from '../Link';
import {Icon, Cell  } from 'react-mdl';
import 'react-mdl/extra/material.css';
import 'react-mdl/extra/material.js';
import $ from 'jquery';
import config from '../Config';
import 'whatwg-fetch';

class Navigation extends React.Component {

  constructor() {
    super();
    this.state = {profile:null};
    this.load = this.load.bind(this);
  }

  componentDidMount() {
    window.componentHandler.upgradeElement(this.root);
    this.load();
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

  load() {
    var url = config.host + "/v1/profile.json";
    fetch(url, {
      credentials: 'same-origin'
    }).then(this.checkStatus).then(
      r => r.json()
    ).then(
      r => this.setState({profile: r})
    ).catch( e => {
      console.log('request failed', e)
   });
  }

  componentWillUnmount() {
    window.componentHandler.downgradeElements(this.root);
  }

  render() {
    var icon, name;
    if (this.state.profile) {
      icon = <a className="mdl-navigation__link" href={config.host +"/v1/logout"}><Icon name="exit_to_app"/>Logout</a>;
      name = <a className="mdl-navigation__link" href={"/user/" + this.state.profile.user_name}>
      <Icon name="account_box" />{this.state.profile.screen_name} ({this.state.profile.user_name})
      </a>;
      return (
        <nav className="mdl-navigation" ref={node => (this.root = node)}>
          <Link className="mdl-navigation__link" to="/home">Home</Link>
          <Link className="mdl-navigation__link" to="/review">Review</Link>
          <Link className="mdl-navigation__link" to="/new">New</Link>
            {name}
            {icon}
        </nav>
      );
    } else {
      return (
        <nav className="mdl-navigation" ref={node => (this.root = node)}>
          <Link className="mdl-navigation__link" to="/">Home</Link>
        </nav>
      );
    }
  }

}

export default Navigation;
