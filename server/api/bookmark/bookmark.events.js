/**
 * Bookmark model events
 */

'use strict';

import {EventEmitter} from 'events';
var Bookmark = require('../../sqldb').Bookmark;
var BookmarkEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
BookmarkEvents.setMaxListeners(0);

// Model events
var events = {
  afterCreate: 'save',
  afterUpdate: 'save',
  afterDestroy: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Bookmark) {
  for(var e in events) {
    let event = events[e];
    Bookmark.hook(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc, options, done) {
    BookmarkEvents.emit(event + ':' + doc._id, doc);
    BookmarkEvents.emit(event, doc);
    done(null);
  };
}

registerEvents(Bookmark);
export default BookmarkEvents;
