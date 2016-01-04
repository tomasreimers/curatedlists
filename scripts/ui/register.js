"use strict";

var React = require('react');
var Parse = require('parse');
var ParseReact = require('parse-react');
var _ = require('lodash');
var History = require('react-router').History;

var Register = React.createClass({
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

    var user = new Parse.User();
    user.set("username", this.refs['username'].value);
    user.set("password", this.refs['password'].value);
    user.set("email", this.refs['email'].value);
    user.set("name", this.refs['name'].value);

    user.signUp(null, {
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
          <input type='text' placeholder='name (optional)' ref='name' />
          <input type='text' placeholder='email' ref='email' />
          <input type='password' placeholder='password' ref='password' />
          <input type='submit' value='Register' />
        </form>
      </div>
    )
  }
});


module.exports = Register;
