/*global window, fabric, $ */

var Animates = Animates || {};

(function (ns){

	/**
	 *	Creates a new ClassName and i'm documenting it with jsdoc.
	 *  @class Represents a ClassName . 
	 */ 
	var TimeManager = function (options) 
	{
		var $this = this,		// Save the this reference for later use
			privateAttribute = 'Yeah baby im private';


		/**
		 * A public function asigned to the  current instance this.
		 * @param {integer} param1 The description of the param1.
		 * @param {string} [param2] The description of the optional param2.
		 */
		this.publicMethodPrint = function publicMethodSample(param1, param2) 
		{
			console.log('this a public function accessing a private attribute value "' + privateAttribute + '"');
		};

		/**
		 * a private function in the closure of the current instace this.
		 * @param {integer} param1 The description of the param1.
		 */
		function privateMethodPrint (param1)
		{
			console.log('you cannot call me from the outside');
		}

		(function init() {
			console.log('im kinda constructor');
			privateMethodPrint();
		})();

	};	
	ns.TimeManager = TimeManager;

})(Animates);

