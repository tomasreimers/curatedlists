"use strict";

var React = require('react');
var Parse = require('parse');
var ParseReact = require('parse-react');
var _ = require('lodash');
var Link = require('react-router').Link;
var History = require('react-router').History;

var Forgot = React.createClass({
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

    Parse.User.requestPasswordReset(this.refs['email'].value, {
      success: function() {
        _this.setState({
          errors: undefined
        });
        _this.history.pushState(null, '/login');
      },
      error: function(error) {
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
          <input type='text' placeholder='email' ref='email' />
          <input type='submit' value='Reset Password' />
        </form>
      </div>
    );
  }
});


module.exports = Forgot;
