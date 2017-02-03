import React, { PropTypes } from 'react';
import $ from 'jquery';
import { Card, CardTitle, CardActions, Button, Grid, Icon, IconButton, Cell  } from 'react-mdl';
import config from '../../components/Config';

class UserWordPage extends React.Component {

  componentDidMount() {
    document.title = "title";
  }

  constructor(props) {
    super(props);
  }

  render() {
    var words = this.props.words
    .map(function (t) {
      return (<Word w={t} key={t.id}/>);
    });

    return (
      <Layout name={this.props.route.params.id} style={{paddingBottom: '80px'}}>
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
  }

  render() {
      return (
        <Cell col={4}>
        <Card shadow={0} style={{width: '256px', height: '48px', background: '#009688'}}>
            <CardTitle expand style={{alignItems: 'flex-start', color: '#fff'}}>
                <h4 style={{marginTop: '5px'}}>
                    {this.props.w.text}
                </h4>
            </CardTitle>
        </Card>
        </Cell>
      )
  }
}

export default UserWordPage;

class Layout extends React.Component {

  static propTypes = {
    name: PropTypes.string,
  };

  componentDidMount() {
    window.componentHandler.upgradeElement(this.root);
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <div className="mdl-layout mdl-js-layout" ref={node => (this.root = node)}>
        <div className="mdl-layout__inner-container">
        <header className="mdl-layout__header">
          <div className="mdl-layout__header-row">
            <Navigation name={this.props.name}/>
            <div className="mdl-layout-spacer"></div>
          </div>
        </header>
          <main className="mdl-layout__content">
            <div {...this.props} />
          </main>
        </div>
      </div>
    );
  }
}

class Navigation extends React.Component {
  static propTypes = {
    name: PropTypes.string,
  };

  constructor() {
    super();
  }

  componentDidMount() {
    window.componentHandler.upgradeElement(this.root);
  }

  componentWillUnmount() {
    window.componentHandler.downgradeElements(this.root);
  }

  render() {
      return (
        <nav className="mdl-navigation" style={{margin: 'auto'}}>
          <h4>{this.props.name}</h4>
        </nav>
      );
    }
}
