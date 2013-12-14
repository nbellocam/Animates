
window.onload = function (){
	var canvas = new fabric.Canvas('mainCanvas');
	canvas.setHeight(500);
	canvas.setWidth(800);


/*var IdRect = fabric.util.createClass(fabric.Rect, {
  type: 'IdRect',
  initialize: function(options) {
    options || (options = { });
    this.callSuper('initialize', options);
    this.set('id', options.id || '');
  },
  toObject: function() {
    return fabric.util.object.extend(this.callSuper('toObject'), {
      id: this.get('id')
    });
  },
  _render: function(ctx) {
    this.callSuper('_render', ctx);
    ctx.font = '20px Helvetica';
    ctx.fillStyle = '#333';
    ctx.fillText(this.label, -this.width/2, -this.height/2 + 20);
  }
});*/

	var rect = new fabric.Rect({
		 	left: 5, top: 5, fill: 'red', width: 10, height: 20
		});

	rect.id = "Hola mundo";

	canvas.add(rect);

	canvas.on('object:modified', function(options) {
	  if (options.target) {
	    console.log('an object was clicked! ', options.target.type);
	  }
	});

	rect.set('angle', 45);
}