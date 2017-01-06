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

class Navigation extends React.Component {

  constructor() {
    super();
    this.state = {};
    this.load = this.load.bind(this);
  }

  componentDidMount() {
//    this.load();
    window.componentHandler.upgradeElement(this.root);
  }

  load() {
    $.ajax({
      url: "http://localhost:8080/v1/profile.json",
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({profile: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  }

  componentWillUnmount() {
    window.componentHandler.downgradeElements(this.root);
  }

  render() {
    var icon = this.state.profile ? <img src={this.state.profile.image_url} /> `${this.state.screen_name}` : (
        <a className="mdl-navigation__link" href="http://localhost:8080/v1/login">
        <Icon name="account_box" /> Login</a>);
    var logout = this.state.profile ? (<a className="mdl-navigation__link" href="http://localhost:8080/v1/logout">
        <Icon name="account_box" />  Logout</a>) : (<div></div>);


    return (
      <nav className="mdl-navigation" ref={node => (this.root = node)}>
        <Link className="mdl-navigation__link" to="/">Home</Link>
        <Link className="mdl-navigation__link" to="/review">Review</Link>
        <Link className="mdl-navigation__link" to="/edit">Edit</Link>
        <Link className="mdl-navigation__link" to="/about">About</Link>
          {icon}
          {logout}
      </nav>
    );
  }

}

export default Navigation;
