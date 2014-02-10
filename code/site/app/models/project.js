'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


/**
 * Project Schema
 */
var ProjectSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	title: {
		type: String,
		default: '',
		trim: true
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	tags: [{
		name: {
			type: String,
			default: '',
			trim: true
		}
	}],
	workgroup: [{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		permission: {
			type: String,
			default: '',
			trim: true
		}
	}],
	animation : Schema.Types.Mixed,
	history: [{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		change : Schema.Types.Mixed
	}]
});

/**
 * Validations
 */
ProjectSchema.path('title').validate(function(title) {
	return title.length;
}, 'Title cannot be blank');

/**
 * Statics
 */
ProjectSchema.statics.load = function(id, cb) {
	this.findOne({
		_id: id
	}).populate('user', 'name username').exec(cb);
};

mongoose.model('Project', ProjectSchema);
