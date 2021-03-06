'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Item Schema
 */
var ItemSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Item Name'
  },
  pic: {
    type: String,
    default: '',
    trim: true
  },
  help_pic: {
    type: String,
    default: ''
  },
  desc: {
    type: String,
    default: ''
  },
  direction: {
    type: String,
    default: ''
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Item', ItemSchema);
