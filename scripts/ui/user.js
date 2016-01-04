"use strict";

var React = require('react');
var Parse = require('parse');
var ParseReact = require('parse-react');
var _ = require('lodash');
var Link = require('react-router').Link;
var History = require('react-router').History;

var ListLink = React.createClass({
  _deleteList: function (evt) {
    evt.preventDefault();
    var _this = this;

    var Item = Parse.Object.extend("Item");
    var query = new Parse.Query(Item);
    query.equalTo("list", this.props.list);
    query.find({
      success: function(results) {
        for (var i = 0; i < results.length; i++) {
          // TODO [Tomas, 1-4-2016] : Almost certainly a hack, fix this.
          results[i].objectId = results[i].id;
          ParseReact.Mutation.Destroy(results[i]).dispatch();
        }
        ParseReact.Mutation.Destroy(_this.props.list).dispatch();
      },
      error: function(error) {
        // TODO [Tomas, 1-4-2015] : Do something with errors
      }
    });
  },

  render: function () {
    var deleteButton = undefined;
    if (this.props.canDelete) {
      deleteButton = (
        <a href='#' onClick={this._deleteList}><i className="fa fa-times"></i></a>
      );
    }

    return (
      <div className='listItem clearfix' key={this.props.list.objectId}>
        <div className='left'>
          <Link to={'/list/' + this.props.list.objectId}>{this.props.list.title ? this.props.list.title : "[Unnamed]"}</Link>
        </div>
        <div className='right'>
          {deleteButton}
        </div>
      </div>
    );
  }
});

var InnerUser = React.createClass({
  mixins: [ParseReact.Mixin, History],

  observe: function (props, state) {
    return {
      lists: (new Parse.Query('List')).equalTo('owner', props.user),
      currentUser: ParseReact.currentUser
    };
  },

  _createList: function (evt) {
    evt.preventDefault();
    var _this = this;

    var acl = new Parse.ACL(Parse.User.current());
    acl.setPublicReadAccess(true);

    ParseReact.Mutation.Create('List', {
        'owner': this.data.currentUser,
        'summary': '',
        'title': '',
        'ACL': acl
      })
      .dispatch()
      .then(function (newList) {
        _this.history.pushState(null, '/list/' + newList.objectId);
      });
  },

  render: function () {
    var isCurrentUser = (this.data.currentUser && this.props.user.objectId == this.data.currentUser.objectId);

    var createList = undefined;
    if (isCurrentUser) {
      createList = (
        <div className='listItem'>
          <a href='#' onClick={this._createList}>Create List</a>
        </div>
      );
    }

    var lists = []
    if (this.data.lists.length == 0 && _.isUndefined(createList)) {
      lists = (
        <div className='listItem noItems'>No Lists.</div>
      );
    } else {
      lists = _.map(this.data.lists, function (list) {
        return (
          <ListLink list={list} canDelete={isCurrentUser} />
        );
      });
    }

    return (
      <div>
        <div className='panel'>
          {lists}
          {createList}
        </div>
      </div>
    )
  }
});

var User = React.createClass({
  mixins: [ParseReact.Mixin],

  observe: function (props, state) {
    return {
      user: (new Parse.Query('_User')).equalTo('objectId', props.params.id)
    };
  },

  render: function () {
    if (!this.data.user || this.data.user.length != 1) {
      return (
        <div className='mainContentLoading'>
          {/* TODO [Tomas, 1-3-2016] : Make better, possibly animation from font-awesome */}
          Loading...
        </div>
      );
    }

    return (
      <div>
        <h1 className='listTitle'>{this.data.user[0].name ? this.data.user[0].name : "[Unnamed]"}</h1>
        <h2 className='listSubtitle'>{this.data.user[0].username}</h2>
        <InnerUser user={this.data.user[0]} />
      </div>
    );
  }
});


module.exports = User;
