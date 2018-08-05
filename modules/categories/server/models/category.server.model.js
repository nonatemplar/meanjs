'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Category Schema
 */
var CategorySchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Category name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  id: {
    type: String,
    required: [true, 'id is required.']
  },
  description: {
    type: String
  },
  avatar: {
    type: String
  },
  items: [{
    type: String
  }],
  _createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Blog created by is required.']
  }
});

mongoose.model('Category', CategorySchema);
