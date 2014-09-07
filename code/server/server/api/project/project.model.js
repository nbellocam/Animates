'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Model = require('animates-model');

var ProjectSchema = new Schema({
    name: String,
	created: {
		type: Date,
		default: Date.now
	},
	modified: {
		type: Date,
		default: Date.now
	},
    info: String,
    active: Boolean,
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
  animation : {
		type: Schema.Types.Mixed,
		default: Model.JsonSerializer.serializeObject(new Model.Animation())
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
			trim: true,
      validate : function(permission) {
                  	return /play|edit/i.test(permission);
                  }
		}
	}],
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
ProjectSchema.path('name').validate(function(name) {
	return name.length;
}, 'Name cannot be blank');

/**
 * Statics
 */
ProjectSchema.statics.load = function(id, cb) {
	this.findOne({
		_id: id
	}).populate('user', 'name').exec(cb);
};

/**
 * Statics
 */
ProjectSchema.statics.list = function(userId, cb) {
  this
    .find()
      .or([{ 'user' : userId }, { 'workgroup.user' : userId }])
    .populate('user', 'name').exec(cb);
};

ProjectSchema.pre('save', function (next) {
  //console.log(this._id);
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
	canOpBeAppliedBy : function(op, userId) {
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
	applyDiff : function(target, operation, opParams, userId) {
		if (!this.canOpBeAppliedBy('update', userId)) {
			return null;
		}

		this.history.push({
			user: mongoose.Types.ObjectId(userId),
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
	},

  addCollaborator : function (userId, permission, cb) {
    var exists = false;

    this.workgroup.forEach(function (item){
      if (item.user.toString() == userId.toString()) {
        exists = true;
        item.permission = permission;
      }
    });

    if (!exists) {
      var newcolab = {
        user :  mongoose.Types.ObjectId(userId),
        permission : permission
      };

      this.workgroup.push(newcolab);
    }

    this.save(cb);
  },

  removeCollaborator : function (userId, cb) {
    var exists = false;

    for (var x=0; x < this.workgroup.length; x++) {
      if (this.workgroup[x].user.toString() == userId.toString()) {
        this.workgroup.splice(x, 1);
        exists = true;
        this.save(cb);
      }
    }

    if (!exists) {
      cb(null, null);
    }
  }
};


module.exports = mongoose.model('Project', ProjectSchema);
