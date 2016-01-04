"use strict";

var React = require('react');
var Parse = require('parse');
var ParseReact = require('parse-react');
var _ = require('lodash');
var Link = require('react-router').Link;
var FacebookButton = require('react-social').FacebookButton;
var TwitterButton = require('react-social').TwitterButton;
var FacebookCount = require('react-social').FacebookCount;

var ItemLink = React.createClass({
  _deleteItem: function (evt) {
    evt.preventDefault();

    ParseReact.Mutation.Destroy(this.props.item).dispatch();
  },

  render: function () {
    var deleteButton = undefined;
    if (this.props.canDelete) {
      deleteButton = (
        <a href='#' onClick={this._deleteItem}><i className="fa fa-times"></i></a>
      );
    }

    return (
      <div className='listItem clearfix' key={this.props.item.objectId} >
        <div className='left'>
          <a target='_blank' href={this.props.item.url}>{this.props.item.url}</a>
        </div>
        <div className='right'>
          {deleteButton}
        </div>
      </div>
    );
  }
});

var InnerList = React.createClass({
  mixins: [ParseReact.Mixin],

  observe: function (props, state) {
    return {
      items: (new Parse.Query('Item')).equalTo('list', props.list),
      currentUser: ParseReact.currentUser
    };
  },

  _createItem: function (evt) {
    evt.preventDefault();

    if (this.refs['addItem'].value == "") {
      return;
    }

    var acl = new Parse.ACL(Parse.User.current());
    acl.setPublicReadAccess(true);

    ParseReact.Mutation.Create('Item', {
      'url': this.refs['addItem'].value,
      'list': this.props.list,
      'ACL': acl
    }).dispatch();

    this.refs['addItem'].value = '';
  },

  render: function () {
    var ownsThisList = (this.data.currentUser && this.props.list.owner.objectId == this.data.currentUser.objectId);

    var createItem = undefined;
    if (ownsThisList) {
      createItem = (
        <div className='listItem'>
          <form onSubmit={this._createItem}>
            <input type='text' ref='addItem' className='addItem' placeholder='Add item...' onBlur={this._createItem} />
          </form>
        </div>
      );
    }

    var items = []
    if (this.data.items.length == 0 && _.isUndefined(createItem)) {
      items = (
        <div className='listItem noItems'>No Items.</div>
      );
    } else {
      items = _.map(this.data.items, function (item) {
        return (
          <ItemLink item={item} canDelete={ownsThisList} />
        );
      });
    }

    return (
      <div className='panel'>
        {items}
        {createItem}
      </div>
    )
  }
});

var List = React.createClass({
  mixins: [ParseReact.Mixin],

  observe: function (props, state) {
    return {
      list: (new Parse.Query('List')).equalTo('objectId', props.params.id).include('owner'),
      currentUser: ParseReact.currentUser
    };
  },

  _changeTitle: function (evt) {
    // TODO [Tomas, 1-3-2016] : This seems hacky to edit parse objects directly, probably should do something else.
    this.data.list[0].title = this.refs['title'].value;
  },

  _changeSummary: function (evt) {
    // TODO [Tomas, 1-3-2016] : This seems hacky to edit parse objects directly, probably should do something else.
    this.data.list[0].summary = this.refs['summary'].value;

  },

  _submitTitle: function (evt) {
    evt.preventDefault();

    ParseReact.Mutation.Set(this.data.list[0], {
      'title': this.refs['title'].value
    }).dispatch();
  },

  _submitSummary: function (evt) {
    evt.preventDefault();

    ParseReact.Mutation.Set(this.data.list[0], {
      'summary': this.refs['summary'].value
    }).dispatch();
  },

  render: function () {
    if (!this.data.list || this.data.list.length != 1) {
      return (
        <div className='mainContentLoading'>
          {/* TODO [Tomas, 1-3-2016] : Make better, possibly animation from font-awesome */}
          Loading...
        </div>
      );
    }

    var isOwner = (this.data.currentUser && this.data.currentUser.objectId == this.data.list[0].owner.objectId);

    return (
      <div>
        <input type='text' disabled={!isOwner} className='listTitle' ref='title' onChange={this._changeTitle} onBlur={this._submitTitle} placeholder='[Untitled]' value={this.data.list[0].title} />
        <input type='text' disabled={!isOwner} className='listSubtitle' ref='summary' onChange={this._changeSummary} onBlur={this._submitSummary} placeholder='[No summary]' value={this.data.list[0].summary} />

        <div className='sidebarContainer'>
          <div className='sidebar'>
            <div className='section'>
              <h2>Author</h2>
              <Link to={'/user/' + this.data.list[0].owner.objectId}>{this.data.list[0].owner.name ? this.data.list[0].owner.name : this.data.list[0].owner.username}</Link>
            </div>
            {/*
            // TODO [Tomas : 1-4-2016] : Add social features
            <div className='section'>
              <h2>Share</h2>
              <div>
                <FacebookButton className='socialButton'><i className="fa fa-facebook-official"></i> Share</FacebookButton>
              </div>
              <div>
                <TwitterButton className='socialButton'><i className="fa fa-twitter"></i> Share</TwitterButton>
              </div>
            </div>
            */}
          </div>
          <div className='main'>
            <InnerList list={this.data.list[0]} />
          </div>
        </div>
      </div>
    );
  }
});


module.exports = List;
