"use strict";

var React = require('react');
var Parse = require('parse');
var ParseReact = require('parse-react');
var _ = require('lodash');
var Link = require('react-router').Link

var App = React.createClass({
  mixins: [ParseReact.Mixin],

  observe: function () {
    return {
      user: ParseReact.currentUser
    };
  },

  _logOut: function () {
    Parse.User.logOut();
  },

  _loggedInNav: function () {
    return (
      <div>
        Hello, <Link to={"/user/" + this.data.user.objectId}>{this.data.user.username}</Link>! (<Link to="/settings">Settings</Link> &#8226; <a href="#" onClick={this._logOut}>Log Out</a>)
      </div>
    );
  },

  _loggedOutNav: function () {
    return (
      <div>
        <Link to="/login">Log In</Link> &#8226; <Link to="/register">Register</Link>
      </div>
    );
  },

  render: function() {
    return (
      <div className='wrapper'>
        <div className='container'>
          <div className='nav'>
            <div className='clearfix'>
              <div className='left title'><Link to='/'>Reading List <i className="fa fa-book"></i></Link></div>
              <div className='right'>{this.data.user ? this._loggedInNav() : this._loggedOutNav()}</div>
            </div>
            <hr className='navBottomLine' />
          </div>
          <div>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = App;
