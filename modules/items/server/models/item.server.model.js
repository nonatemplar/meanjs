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
    required: 'Please fill Item name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  _createdBy: {
    type: Schema.ObjectId,
    ref: 'User',
    required: 'User name of an item is required'
  },
  id: {
    type: String
  },
  typeName: {
    type: String
  },
  typeImage: {
    type: String
  },
  helpImage: {
    type: String
  },
  description: {
    type: String
  }
});

mongoose.model('Item', ItemSchema);
