'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Record Schema
 */
var RecordSchema = new Schema({
  time: {
    type: Date,
    required: 'Record Time is missing'
  },
  MEASURE_CATEGORY_ID: {
    type: String,
    required: 'Measure Category ID is missing'
  },
  MEASURE_ITEM_ID: {
    type: String,
    required: 'Measure Item ID is missing'
  },
  USER_ID: {
    type: String,
    required: 'User ID is missing'
  },
  TYPE: {
    type: String,
    default: ''
  },
  NOTE: {
    type: String,
    default: ''
  },
  MIN_RECORD_LIST: {
    type: String,
    default: ''
  },
  MAX_RECORD_LIST: {
    type: String,
    default: ''
  },
  LS_MARK_A: {
    type: Number,
    default: 0.0
  },
  LP_MARK_A: {
    type: Number,
    default: 0.0
  },
  RS_MARK_A: {
    type: Number,
    default: 0.0
  },
  RP_MARK_A: {
    type: Number,
    default: 0.0
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Record', RecordSchema);
