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
import news_top from './news_dump.js';
import video_tag_recent from './video_tag_recent.js';
import video_tag_top from './video_tag_top.js';


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
      title: "tags",
      header: "タグ",
      type: "tag"
    },
    {
      title: "channels",
      header: "ニコニコチャンネル",
      type: "channel"
    },
    {
      title: "lives",
      header: "ニコニコ生放送",
      type: "live"
    },
    {
      title: "videos(人気)",
      header: "人気の動画",
      type: "video"
    },
    {
      title: "videos(新着)",
      header: "新着動画"
    },
    {
      title: "news",
      header: "ニコニコニュース",
      type: "news"
    },
  ];
  const escapedValueLong = escapedValue.toLowerCase();
  const isTag = escapedValueLong.length > 2;
  if (escapedValueLong.length == 1 ) {
    ;
  } else {
    escapedValue = (escapedValueLong[0] + escapedValueLong[1]);
  }

  targets[0]["suggests"] = tag_top[escapedValue].map(i=>{
      return {"type": "tag",    "name": i.tag, "count" :i.tag_counter, "thumbnailUrl": i.thumbnail_url  };
  });


  // channel
  targets[1]["count"] = channel_top[escapedValue].meta.totalCount;
  targets[1]["suggests"] = channel_top[escapedValue].data.map(i=>{
      return {"type": "channel",    "name": i.title, "id":i.contentId,  "thumbnailUrl": i.thumbnailUrl  };
  });

  // live
  targets[2]["count"] =live_top[escapedValue].meta.totalCount;
  targets[2]["suggests"] = live_top[escapedValue].data.map(i=>{
      return {"type": "live",    "name": i.title, "id":i.contentId, "thumbnailUrl": i.communityIcon || i.thumbnailUrl  };
  });

  // video top
  const videoEscapedValue = (video_tag_top[escapedValueLong]) ? escapedValueLong : tag_top[escapedValue][0].tag.toUpperCase();
  if (isTag && video_tag_top[videoEscapedValue]) {
    targets[3]["suggests"] = video_tag_top[videoEscapedValue].data.map(i=>{
        return {"type": "video",    "name": i.title, "id":i.contentId, "thumbnailUrl": i.thumbnailUrl };
    });
  } else {
    targets[3]["suggests"] = video_top[escapedValue].data.map(i=>{
        return {"type": "video",    "name": i.title, "id":i.contentId, "thumbnailUrl": i.thumbnailUrl };
    });
  }

  // video recent
  if (isTag && video_tag_recent[videoEscapedValue]) {
    targets[4]["count"] = video_tag_recent[videoEscapedValue].meta.totalCount;
    targets[4]["suggests"] = video_tag_recent[videoEscapedValue].data.map(i=>{
        return {"type": "video",    "name": i.title, "id":i.contentId, "thumbnailUrl": i.thumbnailUrl };
    });
  } else {
    targets[4]["count"] = video_recent[escapedValue].meta.totalCount;
    targets[4]["suggests"] = video_recent[escapedValue].data.map(i=>{
        return {"type": "video",    "name": i.title, "id":i.contentId, "thumbnailUrl": i.thumbnailUrl };
    });
  }

  // news
  targets[5]["count"] = news_top[escapedValue].meta.totalCount;
  targets[5]["suggests"] = news_top[escapedValue].data.map(i=>{
      return {"type": "news",    "name": i.title, "id":i.contentId, "thumbnailUrl": "http://p.news.nimg.jp/photo/" + i.thumbnailKey + "p.jpg" };
  });


  const regex = new RegExp('\\b' + escapedValue, 'i');

  targets[0]["suggests"] = targets[0]["suggests"].filter(person => regex.test(getSuggestionValue(person))).slice(0,5);

  return targets.filter(section => section.suggests.length > 0);
}

const getSuggestionValue = suggestion => suggestion.name;

const getSectionSuggestions = section => section.suggests;

const renderSectionTitle = section => (
  <h3 className={styles.sectionHeader}>{section.header}</h3>
);

function renderSuggestion(suggestion, { query }) {
  const suggestionText = suggestion.type=="tag" ? `${suggestion.name} (${suggestion.count}+)` : suggestion.name;
  const matches = AutosuggestHighlightMatch(suggestionText, query);
  const parts = AutosuggestHighlightParse(suggestionText, matches);

  return (
    <span className={styles.suggestionContent}>
      <a className={styles.title} href={suggestion.type=="tag" ? "http://search.nicovideo.jp/video/tag/" + suggestion.name :  "https://nico.ms/" + suggestion.id}>
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
  componentDidMount() {
    document.title = 'rich kensaku';
  }

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
      placeholder: "",
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
        alwaysRenderSuggestions={true}
        focusInputOnSuggestionClick={false}
        inputProps={inputProps} />
        </Layout>
    );
  }
}

//ReactDOM.render(<App />, document.getElementById('app'));
