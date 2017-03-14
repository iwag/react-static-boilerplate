
import React, { PropTypes } from 'react';
import Layout from '../../components/Layout';
import s from './styles.css';
import { Switch, Chip, Checkbox, IconButton, Grid, Icon, Cell  } from 'react-mdl';
import config from '../../components/Config';
import 'whatwg-fetch';
import $ from 'jquery';

class HomePage extends React.Component {

  componentDidMount() {
    document.title = "単語一覧";
  }

  render() {
    return (
      <Layout className={s.content}>
      <Detail url={config.host + "/v1/words.json"} interval={8000} />
      </Layout>
    );
  }

}

export default HomePage;

class Detail extends React.Component {

  constructor(props) {
    super(props);
    this.load = this.load.bind(this);
    this.state = {data: []};
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
    fetch(this.props.url, {
      credentials: 'same-origin'
    }).then(this.checkStatus).then(
      r => r.json()
    ).then(
      r => this.setState({data: r})
    ).catch( e =>
      console.log('request failed', e)
    );
  }

  componentDidMount() {
    this.load();
    // setInterval(this.load.bind(this), this.props.interval);
  }

  render() {
    return (
      <div >
          <Grid className="demo-grid-1">
          <Cell col={12}>
            </Cell>
            <Cell col={12}>
            <ContentList data={this.state.data} doLoad={this.load.bind(this)}/>
            </Cell>
        </Grid>
      </div>);
  }
}

class ContentList extends React.Component{
  constructor(props) {
    super(props);
  }

  render() {
    var words = this.props.data
        .map( (t) => {
          return (<Content w={t} key={t.id} doLoad={this.props.doLoad}/>);
        });

    return (
    <table id="words" className="mdl-data-table" cellSpacing="0" width="100%">
      <thead>
        <tr>
          <th>Word</th>
          <th>意味</th>
          <th className="mdl-data-table__cell--non-numeric" style={{width: 320 +"px"}}>Memo</th>
          <th className="mdl-data-table__cell--non-numeric">needs Review</th>
          <th></th>
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

class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      is_review: this.props.w.is_review,
      is_input: this.props.w.is_input,
    };

    this.changeReview = this.changeReview.bind(this);
    this.delete = this.delete.bind(this);
    this.copy = this.copy.bind(this);
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

  changeReview(e) {
    e.preventDefault();

    var url = config.host + "/v1/word/" + this.props.w.id + "/edit.json";
    var new_w = {
      "is_review" : this.state.is_review ? false : true,
      "kind": "is_review"
    };

    fetch(url, {
      method: "POST",
      body: JSON.stringify(new_w),
      headers: {
        "Content-Type": "application/json"
      },
    	credentials: 'same-origin'
    }).then(this.checkStatus)
    .then(
      r => r.json()
    ).then(
      r => {
        this.props.doLoad();
        this.setState({is_review: r.is_review});
      }
    ).catch( e =>
      console.log('request failed', e)
    );
  }

  delete(e) {
    e.preventDefault();

    var url = config.host + "/v1/word/" + this.props.w.id + "/edit.json";
    fetch(url, {
      method: "DELETE",
      body: '',
      headers: {
        "Content-Type": "application/json"
      },
    	credentials: 'same-origin'
    }).then(this.checkStatus).then(
      r => r.json()
    ).then(
      r => this.props.doLoad()
    );
  }

  copy(e) {
    e.preventDefault();

    var url = config.host + "/v1/word/" + this.props.w.id + "/copy.json";

    fetch(url, {
      method: "POST",
      body: '',
      headers: {
        "Content-Type": "application/json"
      },
    	credentials: 'same-origin'
    }).then(this.checkStatus).then(
      r => r.json()
    ).then(
      r => this.props.doLoad()
    );
  }

  to_friendly_date(now, created_at) {
    var s;
    s = (now - new Date(created_at))/1000/3600/24;
    if (s > 1.0) return Math.floor(s).toString() + '日前';
    s = (now - new Date(created_at))/1000/3600;
    if (s > 1.0) return Math.floor(s).toString() + '時間前';
    s = (now - new Date(created_at))/1000/60;
    if (s > 1.0) return Math.floor(s).toString() + '分前';
    s = (now - new Date(created_at))/1000;
    if (s < 0.0) s = 0.0;
    return Math.floor(s).toString() + '秒前';
  }

  render() {
    var now = new Date();
    return (
     <tr>
      <td><strong><Checkbox label={this.props.w.text} checked={true} /></strong></td>
      <td><a href={"https://en.wiktionary.org/wiki/" + this.props.w.text}><Icon name="link" /></a></td>
      <td className="mdl-data-table__cell--non-numeric" style={{fontColor: 'rgba(0, 0, 0, 0.5)'}}>
        <MemoInput memo={this.props.w.memo} kind="memo" id={this.props.w.id} />
      </td>
      <td>
        <Switch id="switch2" checked={this.state.is_review} onChange={this.changeReview}/>
      </td>
      <td>{this.to_friendly_date(now, this.props.w.created_at)}</td>
      <td>
      <IconButton name="delete" onClick={this.delete}/>
      </td>
     </tr>
    );
  }
}

class MemoInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {is_input: false, memo: this.props.memo };
    this.edit = this.edit.bind(this);
    this.changeMode = this.changeMode.bind(this);
  }

  changeMode() {
    if (this.state.is_input) {
      this.setState({is_input: false, memo: this.state.memo });
    } else {
      this.setState({is_input: true, memo: this.state.memo });
    }
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

  edit(e) {
    e.preventDefault();

    if (this.refs.memo.value.trim().length==0 ) return;

    var url = config.host + "/v1/word/" + this.props.id + "/edit.json";
    var new_w = {"kind": this.props.kind};
    new_w[this.props.kind] =  this.refs.memo.value;

    fetch(url, {
      method: "POST",
      body: JSON.stringify(new_w),
      headers: {
        "Content-Type": "application/json"
      },
      credentials: 'same-origin'
    }).then(this.checkStatus).then(
      r => r.json()
    ).then(
      r => this.setState({is_input: false, memo: this.refs.memo.value })
    ).catch( e =>
      console.log('request failed', e)
    );
  }

  render() {
    if(this.state.is_input) {
    return (
      <div>
      <textarea className="mdl-textfield__input" type="text" rows= "3" ref="memo" name="memo" defaultValue={this.state.memo} style={{width: "100%", border:"1px solid rgba(0,0,0,.12)"}} />
      <div className="mdl-layout-spacer" />
      <IconButton name="mode_edit" onClick={this.edit}/>
      </div>
    );
  } else {
    return (<div>
    {this.state.memo}
    <IconButton name="mode_edit" onClick={this.changeMode}/>
    </div>);
  }
  }

}
