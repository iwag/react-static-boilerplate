import React, { PropTypes } from 'react';
import Layout from '../../components/Layout';
import s from './styles.css';
import { Card, CardTitle, CardActions, Button, Grid, Icon, IconButton, Cell  } from 'react-mdl';
import config from '../../components/Config';
import 'whatwg-fetch';

class ReviewPage extends React.Component {

  componentDidMount() {
    document.title = "単語レビュー";
  }

  constructor(props) {
    super(props);
    this.state = {data: []};
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
	var url = config.host + "/v1/words.json?is_review=true&duration=12h";

    fetch(url, {
      credentials: 'same-origin'
    }).then(this.checkStatus).then(
      r => r.json()
    ).then(
      r => this.setState({data: r})
    ).catch( e =>
      console.log('request failed', e)
    );
  }

  render() {
    var words = this.state.data
    .map(function (t) {
      return (<Word w={t} key={t.id}/>);
    });

    return (
      <Layout className={s.content}>
      <div style={{margin: 'auto'}}>
          <Grid className="demo-grid-1">
            {words}
          </Grid>
      </div>
      </Layout>
    );
  }

}

class Word extends React.Component {

  constructor(props) {
    super(props);
    this.updateReview = this.updateReview.bind(this);
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

  updateReview(e) {
    e.preventDefault();

    var url = config.host + "/v1/word/" + this.props.w.id + "/edit.json";
    var new_w = {"kind": "reviewed_at"};
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

  render() {
      return (
        <Cell col={4}>
        <Card shadow={0} style={{width: '256px', height: '128px', background: '#009688'}}>
            <CardTitle expand style={{alignItems: 'flex-start', color: '#fff'}}>
                <h4 style={{marginTop: '0'}}>
                    {this.props.w.text}<br />
                    <small>{this.props.w.memo}</small>
                </h4>
            </CardTitle>
            <CardActions border style={{borderColor: 'rgba(255, 255, 255, 0.2)', display: 'flex', boxSizing: 'border-box', alignItems: 'center', color: '#fff'}}>
                <IconButton colored name="done" onClick={this.updateReview} style={{color: '#fff'}} />
                <div className="mdl-layout-spacer"></div>
            </CardActions>
        </Card>
        </Cell>
      )
  }
}

export default ReviewPage;
