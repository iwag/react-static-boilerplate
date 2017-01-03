
import React, { PropTypes } from 'react';
import Layout from '../../components/Layout';
import s from './styles.css';
import $ from 'jquery';
import { ProgressBar, Chip, FABButton, Checkbox, Icon } from 'react-mdl';


class HomePage extends React.Component {

  componentDidMount() {
    document.title = "title";
  }

  render() {
    return (
      <Layout className={s.content}>
      <Register url="http://localhost:8080/v1/word.json" />
      <Detail url="http://localhost:8080/v1/words.json" interval={8000} />
      </Layout>
    );
  }

}

export default HomePage;

class Detail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {data: []};
  }

  load() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  }

  componentDidMount() {
    this.load();
    setInterval(this.load.bind(this), this.props.interval);
  }

  render() {
    return (<WordList data={this.state.data} />);
  }
}

class WordList extends React.Component{
  render() {
    var words = this.props.data
        .sort(function (a, b) {
          return a.priority - b.priority; // いまのところ ID 順
        })
        .map(function (t) {
          return (<Word w={t} key={t.id}/>);
        });

    return (
    <table id="words" className="mdl-data-table" cellSpacing="0" width="100%">
      <thead>
        <tr>
          <th>Word</th>
          <th>Memo</th>
          <th>Count</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {words}
      </tbody>
    </table>
    );
  }
}

class Word extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  changeCheck(e) {
    var url = "v1/words/" + this.props.w.id + "/edit.json";
    var new_w = this.props.w;
    $.ajax({
      type: 'post',
      url: url,
      contentType: 'application/json',
      data: JSON.stringify(new_w),
      success: function(data) {
        this.setState({});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this)
    });
  }

  render() {
    return (
     <tr>
      <td><Checkbox label={this.props.w.text} checked={true}  onChange={this.changeCheck.bind(this)} /></td>
      <td>{this.props.w.memo}</td>
      <td>
      </td>
      <td>
        <FABButton mini>
          <Icon name="add" />
        </FABButton>
        <FABButton mini>
          <Icon name="minus" />
        </FABButton>
      </td>
     </tr>
    );
  }
}

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSubmit(e) {
    var word = {
      text: this.refs.text.value
    };
    $.ajax({
      type: 'post',
      url: this.props.url,
      contentType: 'application/json',
      data: JSON.stringify(word),
      success: function(data) {
        // TODO 強制リロード
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    e.preventDefault(); // ページのリロードをキャンセルする
  }

  render() {
    return (
        <form onSubmit={this.handleSubmit.bind(this)}>
                  <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input className="mdl-textfield__input" ref="text" type="text" name="text" id="text" />
                    <label className="mdl-textfield__label" htmlFor="sample4">Word...</label>
                   </div>
                  <button type="submit" className="mdl-button">Submit</button>
        </form>
    );
  }
}
