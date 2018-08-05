'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Measure item Schema
 */
var MeasureItemSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Measure item name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  _createdBy: {
    type: Schema.ObjectId,
    ref: 'User',
    required: [true, 'Info created by is required.'],
  },
  id: {
    type: String,
    //required: [true, 'id is required.'],
  },
  typeName: {
    type: String,
  },
  typeImage: {
    type: String,
  },
  helpImage: {
    type: String,
  },
  description: {
    type: String,
  },
});

mongoose.model('MeasureItem', MeasureItemSchema);
