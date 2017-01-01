
import React, { PropTypes } from 'react';
import Layout from '../../components/Layout';
import s from './styles.css';
import $ from 'jquery';

class HomePage extends React.Component {

  componentDidMount() {
    document.title = "title";
  }

  render() {
    return (
      <Layout className={s.content}>
      <Detail url="/v1/words.json" interval={3000} />
      <Register />
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
      }
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
          return a.id - b.id; // いまのところ ID 順
        })
        .map(function (t) {
          return (<Word id={t.id} text={t.text}/>);
        });

    return (
    <table id="words" className="table table-striped table-bordered" cellSpacing="0" width="100%">
      <thead>
        <tr>
          <th>Id</th>
          <th>Word</th>
          <th>Complete</th>
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
    this.state = {
    };
  }

  changeCheck(e) {
    var url = "v1/words/" + this.props.id + "/edit.json";
    var word = {
      text: this.props.text
    };
    $.ajax({
      type: 'post',
      url: url,
      contentType: 'application/json',
      data: JSON.stringify(word),
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
       <td>{this.props.id}</td>
       <td>{this.props.text}</td>
       <td><input type="checkbox" checked={true} defaultChecked={true} onChange={this.changeCheck.bind(this)}/></td>
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
      url: "words",
      contentType: 'application/json',
      data: JSON.stringify(word),
      success: function(data) {
        // TODO 強制リロード
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }
    });
    e.preventDefault(); // ページのリロードをキャンセルする
  }

  render() {
    return (
        <form onSubmit={this.handleSubmit.bind(this)}>
          <div className="form-group">
            <label>Word detail</label>
            <input type="text" ref="text" name="text" className="form-control" id="text"/>
          </div>
          <button type="submit" className="btn btn-default">Submit</button>
        </form>
    );
  }
}
