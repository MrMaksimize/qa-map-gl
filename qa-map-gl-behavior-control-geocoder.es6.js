(function() {
    "use strict";

    /****************************************************************************
     * BEHAVIORS
     ****************************************************************************/

    /* Ensures the behavior namespace is created */
    window.QaMapGlBehavior = window.QaMapGlBehavior || {};

    /**
     * @polymerBehavior QaMapGlBehavior.GeocoderControl
     */
    QaMapGlBehavior.GeocoderControlImpl = {
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
            var _keydown = MapboxGeocoder.prototype._onKeyDown;
            MapboxGeocoder.prototype._onKeyDown = function(e) {
                _keydown.call(this, {
                    target: {
                        value: e.target.value
                    }
                });
            };

            return new MapboxGeocoder({
                accessToken: this.mglToken
            });
        },

        addInst(parent) {
            console.log(parent)
            console.log(this.elementInst)
            parent.elementInst.addControl(this.elementInst, this.position);
            MapboxGeocoder.prototype._onKeyDown = function(e) {
                _keydown.call(this, {
                    target: {
                        value: e.target.value
                    }
                });
            };
        },
        getInstOptions() {
            return {
                position: this.position
            };
        }
    };

    QaMapGlBehavior.GeocoderControl = [
        QaMapGlBehavior.Control,
        QaMapGlBehavior.GeocoderControlImpl
    ];
})();
