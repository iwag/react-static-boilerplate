
import React, { PropTypes } from 'react';
import Layout from '../../components/Layout';
import s from './styles.css';

class HomePage extends React.Component {

  componentDidMount() {
    document.title = "title";
  }

  render() {
    return (
      <Layout className={s.content}>
      <Detail url="words.json" interval={3000} />
      </Layout>
    );
  }

}

export default HomePage;

class Detail extends React.Component {

  constructor() {
    super();
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
    setInterval(this.load, this.props.interval);
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
          return (<Word id={t.id} body={t.body} numQuota={t.numQuota} />);
        });

    return (
    <table id="words" className="table table-striped table-bordered" cellSpacing="0" width="100%">
      <thead>
        <tr>
          <th>id</th>
          <th>Detail</th>
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
      numQuota: this.props.numQuota
    };
  }

  changeCheck(e) {
    var url = "words/" + this.props.id + "/edit.json";
    var word = {
      body: this.props.body,
      numQuota: (this.state.numQuota==0 ? 1 : 0)
    };
    $.ajax({
      type: 'post',
      url: url,
      contentType: 'application/json',
      data: JSON.stringify(word),
      success: function(data) {
        this.setState({
          numQuota: data.numQuota
        });
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
       <td>{this.props.body}</td>
       <td><input type="checkbox" checked={this.state.numQuota == 0} defaultChecked={this.state.numQuota == 0} onChange={this.changeCheck}/></td>
     </tr>
    );
  }
}

class Register extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  handleSubmit(e) {
    var word = {
      body: this.refs.body.value
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
      }.bind(this)
    });
    e.preventDefault(); // ページのリロードをキャンセルする
  }

  render() {
    return (
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Word detail</label>
            <input type="text" ref="body" name="body" className="form-control" id="body"/>
          </div>
          <button type="submit" className="btn btn-default">Submit</button>
        </form>
    );
  }
}
