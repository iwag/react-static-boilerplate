/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */


 import styles from './styles.css';

import React, { Component, PropTypes } from 'react';

import Autosuggest from 'react-autosuggest';
import AutosuggestHighlightMatch from 'autosuggest-highlight/match';
import AutosuggestHighlightParse from 'autosuggest-highlight/parse';

import Layout from '../../components/Layout';
import tag_top from './tags.js';
import channel_top from './channel_dump.js';
import video_recent from './video_dump.js';
import video_top from './video_mylist_dump.js';
import live_top from './live_dump.js';

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestions(value) {
  var escapedValue = escapeRegexCharacters(value.trim());

  if (escapedValue === '') {
    return [];
  }

  var targets = [
    {
      title: "tags"
    },
    {
      "title": "channels"
    },
    {
      "title": "lives"
    },
    {
      "title": "videos(人気)"
    },
    {
      "title": "videos(新着)"
    }
  ];
  if (escapedValue.length == 1 ) {
    ;
  } else {
    escapedValue = escapedValue[0] + escapedValue[1];
  }
  targets[0]["suggests"] = tag_top[escapedValue].map(i=>{
      return {"type": "tag",    "name": i.tag, "thumbnailUrl": ""  };
  });

  // channel
  targets[1]["title"] += " (" + channel_top[escapedValue].meta.totalCount + ")";
  targets[1]["suggests"] = channel_top[escapedValue].data.map(i=>{
      return {"type": "channel",    "name": i.title, "id":i.contentId,  "thumbnailUrl": i.communityIcon || i.thumbnailUrl  };
  });

  // live
  targets[2]["title"] += " (" + live_top[escapedValue].meta.totalCount + ")";
  targets[2]["suggests"] = live_top[escapedValue].data.map(i=>{
      return {"type": "live",    "name": i.title, "id":i.contentId, "thumbnailUrl": i.communityIcon || i.thumbnailUrl  };
  });

  // video top
  targets[3]["title"] += " (" + video_top[escapedValue].meta.totalCount + ")";
  targets[3]["suggests"] = video_top[escapedValue].data.map(i=>{
      return {"type": "video",    "name": i.title, "id":i.contentId, "thumbnailUrl": i.thumbnailUrl };
  });

  // video recent
  targets[4]["title"] += " (" + video_recent[escapedValue].meta.totalCount + ")";
  targets[4]["suggests"] = video_recent[escapedValue].data.map(i=>{
      return {"type": "video",    "name": i.title, "id":i.contentId, "thumbnailUrl": i.thumbnailUrl };
  });

  const regex = new RegExp('\\b' + escapedValue, 'i');

  targets[0]["suggests"] = targets[0]["suggests"].filter(person => regex.test(getSuggestionValue(person))).slice(0,3);

  return targets.filter(section => section.suggests.length > 0);
}

const getSuggestionValue = suggestion => suggestion.name;

const getSectionSuggestions = section => section.suggests;

const renderSectionTitle = section => (
  <strong>{section.title}</strong>
);

function renderSuggestion(suggestion, { query }) {
  const suggestionText = `${suggestion.name}`;
  const matches = AutosuggestHighlightMatch(suggestionText, query);
  const parts = AutosuggestHighlightParse(suggestionText, matches);

  return (
    <span className={styles.suggestionContent}>
      <a href={suggestion.type=="tag" ? "./" :  "https://nico.ms/" + suggestion.id}>
      <img className={styles.thumbnail} src={suggestion.thumbnailUrl}/>
      <span className={styles.name}>
        {
          parts.map((part, index) => {
            const className = part.highlight ? styles.highlight : null;

            return (
              <span className={className} key={index}>{part.text}</span>
            );
          })
        }
      </span>
      </a>
    </span>
  );
}

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: []
    };
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: "Type 'c'",
      value,
      onChange: this.onChange
    };

    return (
      <Layout>
      <Autosuggest
      multiSection={true}
        theme={styles}
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        renderSectionTitle={renderSectionTitle}
        getSectionSuggestions={getSectionSuggestions}
        inputProps={inputProps} />
        </Layout>
    );
  }
}

//ReactDOM.render(<App />, document.getElementById('app'));
