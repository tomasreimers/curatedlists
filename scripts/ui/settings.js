"use strict";

var React = require('react');
var Parse = require('parse');
var ParseReact = require('parse-react');
var _ = require('lodash');
var Link = require('react-router').Link;
var History = require('react-router').History;

var Settings = React.createClass({
  mixins: [ParseReact.Mixin, History],

  observe: function () {
    return {
      user: ParseReact.currentUser
    };
  },

  getInitialState: function () {
    return {
      errors: undefined,
      partialEmail: undefined,
      partialName: undefined
    };
  },

  // TODO [Tomas, 1-4-2016] : These are really common patterns, probably should extract into higher order functions
  _changeEmail: function (evt) {
    this.setState({
      partialEmail: this.refs['email'].value
    });
  },

  _changeName: function (evt) {
    this.setState({
      partialName: this.refs['name'].value
    });
  },

  _handleSubmit: function (evt) {
    evt.preventDefault();

    var _this = this;

    if (!_.isUndefined(this.state.partialEmail)) {
      ParseReact.Mutation.Set(this.data.user, {
          'email': _this.state.partialEmail
        })
        .dispatch()
        .then(function () {
          _this.setState({
            partialEmail: undefined
          });
        });
    }

    if (!_.isUndefined(this.state.partialName)) {
      ParseReact.Mutation.Set(this.data.user, {
          'name': _this.state.partialName
        })
        .dispatch()
        .then(function () {
          _this.setState({
            partialName: undefined
          });
        });
    }

  },

  render: function () {
    if (!this.data.user) {
      return (
        <div className='mainContentLoading'>
          {/* TODO [Tomas, 1-3-2016] : Make better, possibly animation from font-awesome */}
          Loading...
        </div>
      );
    }

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
          <input type='text' placeholder='name' onChange={this._changeName} value={_.isUndefined(this.state.partialName) ? this.data.user.name : this.state.partialName} ref='name' />
          <input type='text' placeholder='email' onChange={this._changeEmail} value={_.isUndefined(this.state.partialEmail) ? this.data.user.email : this.state.partialEmail} ref='email' />
          <p>
            <Link to='/forgot'>Reset Password</Link>
          </p>
          <input type='submit' value='Save' />
        </form>
      </div>
    );
  }
});


module.exports = Settings;
