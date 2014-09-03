'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Model = require('animates-model');

var ProjectSchema = new Schema({
  name: String,
  info: String,
  active: Boolean,
  animation : {
		type: Schema.Types.Mixed,
		default: Model.JsonSerializer.serializeObject(new Model.Animation())
	},
});

module.exports = mongoose.model('Project', ProjectSchema);
