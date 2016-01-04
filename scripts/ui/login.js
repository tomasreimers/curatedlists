"use strict";

var React = require('react');
var Parse = require('parse');
var ParseReact = require('parse-react');
var _ = require('lodash');
var Link = require('react-router').Link;
var History = require('react-router').History;

var Login = React.createClass({
  mixins: [ParseReact.Mixin, History],

  observe: function () {
    return {};
  },

  getInitialState: function () {
    return {
      errors: undefined
    };
  },

  _handleSubmit: function (evt) {
    evt.preventDefault();

    var _this = this;

    Parse.User.logIn(this.refs['username'].value, this.refs['password'].value, {
      success: function(user) {
        _this.setState({
          errors: undefined
        });
        _this.history.pushState(null, '/');
      },
      error: function(user, error) {
        _this.setState({
          errors: error
        });
      }
    });
  },

  render: function () {
    var errors = "";
    if (!_.isUndefined(this.state.errors)) {
      errors = (
        <div className='errors'>
          {this.state.errors.message}
        </div>
      );
    }

    return (
      <div className='centerPanel'>
        {errors}
        <form onSubmit={this._handleSubmit}>
          <input type='text' placeholder='username' ref='username' />
          <input type='password' placeholder='password' ref='password' />
          <div className='clearfix'>
            <div className='left'>
              <input type='submit' value='Login' />
            </div>
            <div className='right'>
              <Link to='/forgot'>Forgot Password?</Link>
            </div>
          </div>
        </form>
      </div>
    );
  }
});


module.exports = Login;
