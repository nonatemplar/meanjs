'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Categoryinfo Schema
 */
var CategoryinfoSchema = new Schema({
  name: {
    type: String,
    required: 'Please fill Category Name'
  },
  desc: {
    type: String,
    default: ''
  },
  pic: {
    type: String,
    default: ''
  },
  item_ids: {
    type: String,
    default: ''
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Categoryinfo', CategoryinfoSchema);
