"use strict";

var React = require('react');
var Parse = require('parse');
var ParseReact = require('parse-react');
var _ = require('lodash');

var Splash = React.createClass({
  mixins: [ParseReact.Mixin],

  observe: function () {
    return {};
  },

  render: function () {
    return (
      <div>
        <h1 className='listTitle'>Welcome</h1>
        <h2 className='listSubtitle'>This is ReadingList.Club</h2>
        <div className='sidebarContainer'>
          <div className='sidebar'>
            <div className='section'>
              <h2>Made with	&#10084; by</h2>
              <a href='http://tomasreimers.com'>Tomas Reimers</a>
            </div>
          </div>
          <div className='main'>
            <div className='panel'>
              <div className='listItem'><i className="fa fa-bars"></i> Browse Articles</div>
              <div className='listItem'><i className="fa fa-bookmark"></i> Share Your Favorites</div>
              <div className='listItem'><i className="fa fa-users"></i> See What Your Friends Like</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
});


module.exports = Splash;
