'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Userinfo Schema
 */
var UserinfoSchema = new Schema({
  FISRT_NAME: {
    type: String,
    default: '',
    required: 'Please fill first name',
    trim: true
  },
  LAST_NAME: {
    type: String,
    default: '',
    required: 'Please fill last name',
    trim: true
  },
  EMAIL: {
    type: String,
    default: '',
    trim: true
  },
  PHONE: {
    type: String,
    default: ''
  },
  BIRTH: {
    type: Date,
    required: 'Please fill birth date'
  },
  SEX: {
    type: String,
    default: ''
  },
  WEIGHT: {
    type: Number,
    default: 0.0
  },
  HEIGHT: {
    type: Number,
    default: 0.0
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Userinfo', UserinfoSchema);
