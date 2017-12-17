(function() {
    "use strict";

    /****************************************************************************
     * BEHAVIORS
     ****************************************************************************/

    /* Ensures the behavior namespace is created */
    window.QaMapGlBehavior = window.QaMapGlBehavior || {};

    /**
     *
     * @polymerBehavior QaMapGlBehavior.GeoJSONLayer
     */
    QaMapGlBehavior.VectorSourceImpl = {
        properties: {
            /**
             * A URL to a TileJSON resource.
             * Supported protocols are http:, https:, and mapbox://<mapid>.
             *
             * @type {String}
             */
            url: {
                type: String
            },

            /**
             * An array of one or more tile source URLs, as in the TileJSON spec.
             *
             * @type {Array}
             */
            tiles: {
                type: Array
            }

            // Bounds, minzoom, maxzoom @todo
        },

        // extends the layer `addInst` method to harvest and fire events
        addInst(parent) {
            QaMapGlBehavior.SourceImpl.addInst.call(this, parent);
        },

        createInst(options) {
            return {
                url: options.url,
                tiles: options.tiles,
                id: options.id,
                type: options.type
            };
        },

        /*
         * Update the instance if the new data is not the same as the old OR if the
         * new style is not the same as the old. (Stringifying is needed here to be
         * able to do a deep equality check).
         */
        updateInst(lastOptions, nextOptions) {
            // Run Get Options to account for empty object and inject nullIsland:
            const options = this.getInstOptions();
            this.elementInst.setData(options.data);
        },

        getInstOptions() {
            const options = QaMapGlBehavior.SourceImpl.getInstOptions.call(this);
            options.url = this.url;
            options.tiles = this.tiles;
            options.type = "vector";
            return options;
        }
    };
    /* Bind GeoJSONSource behavior */
    /** @polymerBehavior */
    QaMapGlBehavior.VectorSource = [
        QaMapGlBehavior.Source,
        QaMapGlBehavior.VectorSourceImpl
    ];
})();
