'use strict';

angular.module('animatesApp')
  .factory('Modal', function ($rootScope, $modal) {
    /**
     * Opens a modal
     * @param  {Object} scope      - an object to be merged with modal's scope
     * @param  {String} modalClass - (optional) class(es) to be applied to the modal
     * @return {Object}            - the instance $modal.open() returns
     */
    function openModal(scope, modalClass, template) {
      var modalScope = $rootScope.$new();
      scope = scope || {};
      modalClass = modalClass || 'modal-default';

      angular.extend(modalScope, scope);

      return $modal.open({
        templateUrl: template || 'components/modal/modal.html',
        windowClass: modalClass,
        scope: modalScope
      });
    }

    // Public API here
    return {

      form: {
        /**
         * Create a function to open a share modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
         * @param  {Function} share - callback, run when share is saved
         * @return {Function}     - the function to open the modal (ex. myModalFn)
         */
        share: function(share) {
          share = share || angular.noop;

          /**
           * Open a delete confirmation modal
           * @param  {String} name   - name or info to show on modal
           * @param  {All}           - any additional args are passed staight to del callback
           */
          return function () {
            var args = Array.prototype.slice.call(arguments),
                name = args.shift(),
                shareModal;

            shareModal = openModal({
              modal: {
                dismissable: true,
                title: 'Sharing options',
                buttons: [{
                  classes: 'btn-submit',
                  text: 'Close',
                  click: function(e) {
                    shareModal.close(e);
                  }
                }]
              }
            }, 'modal-info', 'components/modal/share/share.html');

            shareModal.result.then(function(event) {
              del.apply(event, args);
            });
          }
        }
      },

      alerts: {
        error : function () {
          /**
           * Open a delete confirmation modal
           * @param  {String} message - message to show on modal
           * @param  {All}            - any additional args are passed staight to del callback
           */
          return function(message) {
            var errorModal;

            errorModal = openModal({
              modal: {
                dismissable: true,
                title: 'Oops!',
                html: '<p>Some error has occurred. We are sorry.</p>'
                      + (message ? '<p>' + message + '</p>' : ''),
                buttons: [{
                  classes: 'btn-default',
                  text: 'I forgive you',
                  click: function(e) {
                    errorModal.dismiss(e);
                  }
                }]
              }
            }, 'modal-danger');

            errorModal.result.then(function() { });
          };
        }
      },

      /* Confirmation modals */
      confirm: {

        /**
         * Create a function to open a delete confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
         * @param  {Function} del - callback, ran when delete is confirmed
         * @return {Function}     - the function to open the modal (ex. myModalFn)
         */
        delete: function(del) {
          del = del || angular.noop;

          /**
           * Open a delete confirmation modal
           * @param  {String} name   - name or info to show on modal
           * @param  {All}           - any additional args are passed staight to del callback
           */
          return function() {
            var args = Array.prototype.slice.call(arguments),
                name = args.shift(),
                deleteModal;

            deleteModal = openModal({
              modal: {
                dismissable: true,
                title: 'Confirm Delete',
                html: '<p>Are you sure you want to delete <strong>' + name + '</strong> ?</p>',
                buttons: [{
                  classes: 'btn-danger',
                  text: 'Delete',
                  click: function(e) {
                    deleteModal.close(e);
                  }
                }, {
                  classes: 'btn-default',
                  text: 'Cancel',
                  click: function(e) {
                    deleteModal.dismiss(e);
                  }
                }]
              }
            }, 'modal-danger');

            deleteModal.result.then(function(event) {
              del.apply(event, args);
            });
          };
        }
      }
    };
  });
