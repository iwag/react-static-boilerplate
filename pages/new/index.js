
import React, { PropTypes } from 'react';
import Layout from '../../components/Layout';
import $ from 'jquery';
import { Switch, Chip, Checkbox, IconButton, Grid, Icon, Cell  } from 'react-mdl';
import config from '../../components/Config';

class NewPage extends React.Component {

  componentDidMount() {
    document.title = "title";
  }

  render() {
    return (
      <Layout style={{}}>
      単語を入力
      <Register url={config.host + "/v1/word.json"} />
      </Layout>
    );
  }

}

export default NewPage;

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSubmit(e) {
    e.preventDefault();
    var word = {
      text: this.refs.text.value
    };
    $.ajax({
      type: 'post',
      url: this.props.url,
      contentType: 'application/json',
      data: JSON.stringify(word),
      success: function(data) {
        this.refs.text.value = "";
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <div className="mdl-textfield mdl-js-textfield" style={{display:"table-cell", padding: "5px 0"}}>
          <textarea className="mdl-textfield__input" type="text" rows= "3" ref="text" name="text" style={{"font-size": 3+"em", width: 725+"pt", border:"1px solid rgba(0,0,0,.12)"}} ></textarea>
        </div>
        <button type="submit" className="mdl-button mdl-js-button" style={{width: 100+"pt"}}>Submit</button>
      </form>
    );
  }
}
