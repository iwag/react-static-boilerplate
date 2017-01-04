import React, { PropTypes } from 'react';
import Layout from '../../components/Layout';
import s from './styles.css';
import $ from 'jquery';
import { Card, CardTitle, CardActions, Button, Grid, Icon, Cell  } from 'react-mdl';


class ReviewPage extends React.Component {

  componentDidMount() {
    document.title = "title";
  }

  constructor(props) {
    super(props);
    this.state = {data: []};
    this.load();
  }

  load() {
    $.ajax({
      url: "http://localhost:8080/v1/words.json",
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("", status, err.toString());
      }.bind(this)
    });
  }


  render() {
    var words = this.state.data
    .map(function (t) {
      return (<Word w={t} key={t.id}/>);
    });

    return (
      <Layout className={s.content}>
      <div style={{width: '80%', margin: 'auto'}}>
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
  }

  render() {
      return (
        <Cell col={4}>
        <Card shadow={0} style={{width: '256px', height: '256px', background: '#3E4EB8'}}>
            <CardTitle expand style={{alignItems: 'flex-start', color: '#fff'}}>
                <h4 style={{marginTop: '0'}}>
                    Featured event:<br />
                    {this.props.w.text}<br />
                    {this.props.w.memo}
                </h4>
            </CardTitle>
            <CardActions border style={{borderColor: 'rgba(255, 255, 255, 0.2)', display: 'flex', boxSizing: 'border-box', alignItems: 'center', color: '#fff'}}>
                <Button colored style={{color: '#fff'}}>Add to Calendar</Button>
                <div className="mdl-layout-spacer"></div>
                <Icon name="event" />
            </CardActions>
        </Card>
        </Cell>
      )
  }
}

export default ReviewPage;
