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

/**
 * Methods
 */
ProjectSchema.methods = {

	/**
     * CanOpBeAppliedBy - check if the user can perform the operation in this project
     *
     * @param {String} plainText
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
	canOpBeAppliedBy : function(op, userId){
		if (this.user.id === userId) {
			return true;
		}

		var workgroupMember;
		for (var i = this.workgroup.length - 1; i >= 0; i--) {
			workgroupMember = this.workgroup[i];

			if (workgroupMember.user.id  === userId && 
				workgroupMember.permission === op){
				return true;
			}
		}

		return false;
	},

	/**
     * CanOpBeAppliedBy - check if the user can perform the operation in this project
     *
     * @param {String} plainText
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
	applyDiff : function(diff, user){
		if (!this.canOpBeAppliedBy('update', user.id)) {
			return null;
		}

		this.history.push({
			user: user,
			change: diff
		});

		//TODO update animation with diff

		return this;
	}
};

mongoose.model('Project', ProjectSchema);
