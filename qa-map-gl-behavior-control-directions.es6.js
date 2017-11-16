(function() {
  "use strict";

  /****************************************************************************
   * BEHAVIORS
   ****************************************************************************/

  /* Ensures the behavior namespace is created */
  window.QaMapGlBehavior = window.QaMapGlBehavior || {};

  /**
   * @polymerBehavior QaMapGlBehavior.DirectionsControl
   */
  QaMapGlBehavior.DirectionsControlImpl = {
    // TODO - properties.
    properties: {
      /**
       * Set the mapbox-gl token.
       *
       * This property is not dynamic and can only be set once when the map is
       * first initialized.
       *
       * @type {String}
       */
      mglToken: {
        type: String,
        value: ""
      }
    },

    createInst(options) {
      return new MapboxDirections({
        accessToken: this.mglToken
      });
    },
    getInstOptions() {
      return {
        position: this.position
      };
    }
  };

  QaMapGlBehavior.DirectionsControl = [
    QaMapGlBehavior.Control,
    QaMapGlBehavior.DirectionsControlImpl
  ];
})();
