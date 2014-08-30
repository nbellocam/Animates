'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Model = require('animates-model'),
	Schema = mongoose.Schema;


/**
 * Project Schema
 */
var ProjectSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	modified: {
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
	animation : {
		type: Schema.Types.Mixed,
		default: Model.JsonSerializer.serializeObject(new Model.Animation())
	},
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


ProjectSchema.pre('save', function (next) {
  var now = Date.now();
  this.modified = now;
  if ( !this.created ) {
    this.created = now;
  }
  next();
});

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
		if (this.user.id === userId || this.user._id === userId || 
			this.user._id.equals && this.user._id.equals(userId)) {
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
     * getAnimation - return the deserialized Animation model object
     *
     * @return {Animation}
     * @api public
     */
	getAnimation : function(){
		return Model.JsonSerializer.deserializeObject(this.animation);
	},

	/**
     * setAnimation - serialize Animation model object and set it to animation member
     *
     * @param {Animation} Animation model object
     * @api public
     */
	setAnimation : function(animation){
		this.animation = Model.JsonSerializer.serializeObject(animation);
		this.markModified('animation');
	},

	/**
     * CanOpBeAppliedBy - check if the user can perform the operation in this project
     *
     * @param {String} plainText
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
	applyDiff : function(target, operation, opParams, user){
		if (!this.canOpBeAppliedBy('update', user.id)) {
			return null;
		}

		this.history.push({
			user: user,
			change: { 
				target: target,
				operation: operation,
				opParams: Model.JsonSerializer.serializeDictionary(opParams)
			}
		});

		var animation = this.getAnimation();

		animation.applyOperation(target, operation, opParams);

		this.setAnimation(animation);

		return this;
	}
};

mongoose.model('Project', ProjectSchema);
