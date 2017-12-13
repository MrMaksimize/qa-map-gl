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
            },

            /**
             * On geocoded result what zoom level should the map animate to when a
             * bbox isn't found in the response. If a bbox is found the map will fit
             * to the bbox.
             * @type {Number}
             */
            zoom: {
                type: Number,
                value: 16
            },
            /**
             * Animating the map to a selected result will be enabled if `flyTo` is
             * set.
             * @type {Boolean}
             */
            flyTo: {
                type: Boolean,
                value: false
            },
            /**
             * Placeholder attribute value for the input element.
             * @type {String}
             */
            placeholder: {
                type: String,
                value: 'Search'
            },
            /**
             * This is a geographical point given as an object with latitude and
             * longitude properties. Search results closer to this point will be given
             * higher priority.
             * @type {{latitude: Number, longitude: Number}}
             */
            proximity: {
                type: Object,
                value: null
            },
            /**
             * This is a bounding box given as an array in the format
             * `[minX, minY, maxX, maxY]`.
             * Search results will be limited to the bounding box.
             * @type {Array}
             */
            bbox: {
                type: Array,
                value: function() {
                    return null;
                }
            },
            /**
             * A comma separated list of
             * [types](https://www.mapbox.com/developers/api/geocoding/#filter-type)
             * that filter results to match those specified.
             * @type {String}
             */
            types: {
                type: String,
                value: null
            },
            /**
             * A comma separated list of country codes to limit results to specified
             * country or countries.
             * @type {String}
             */
            country: {
                type: String,
                value: null
            },
            /**
             * Minimum number of characters to enter before results are shown.
             * @type {Number}
             */
            minLength: {
                type: Number,
                value: 2
            },
            /**
             * Maximum number of results to show.
             * @type {Number}
             */
            limit: {
                type: Number,
                value: 5
            },
            /**
             * Specify the language to use for response text and query result
             * weighting.
             * Options are IETF language tags comprised of a mandatory ISO 639-1
             * language code and optionally one or more IETF subtags for country or
             * script. More than one value can also be specified, separated by commas.
             * @type {String}
             */
            language: {
                type: String,
                value: null
            },
            /**
             * The latest results returned by the query.
             * @type {{features: Array}}
             */
            lastResults: {
                type: Object,
                readOnly: true,
                notify: true,
                value: function() {
                    return null;
                }
            },
            /**
             * The result picked by the user from the suggestion
             */
            selectedResult: {
                type: Object,
                readOnly: true,
                notify: true,
                value: function() {
                    return null;
                }
            }
        },

        createInst(options) {
            return new MapboxGeocoder({
                accessToken: this.mglToken,
                zoom: this.zoom,
                flyTo: this.flyTo || false,
                placeholder: this.placeholder,
                proximity: this.proximity,
                bbox: this.bbox,
                types: this.types,
                country: this.country,
                minLength: this.minLength,
                limit: this.limit,
                language: this.language
            });
        },

        addInst(parent) {
            this._retargetKeyDown();
            parent.elementInst.addControl(this.elementInst, this.position);
            const onClearFn = this._handleClear.bind(this);
            const onLoadingFn = this._handleLoading.bind(this);
            const onResultsFn = this._handleResults.bind(this);
            const onResultSelectedFn = this._handleResultSelected.bind(this);
            const onErrorFn = this._handleError.bind(this);
            this.bindEvents({
                clear: onClearFn,
                loading: onLoadingFn,
                results: onResultsFn,
                result: onResultSelectedFn,
                error: onErrorFn
            });
        },
        _handleClear(e) {
            console.log('clear');
            console.log(e);
            this._setLastResults(null);
            this._setSelectedResult(null);
        },
        _handleLoading(e) {
            console.log('loading');
            console.log(e);
        },
        _handleResults(e) {
            console.log('results');
            console.log(e);
            this.debounce("set-geocoder-results", function() {
                this._setLastResults(e);
            }, 500);
        },
        _handleResultSelected(e) {
            console.log('resultSet');
            console.log(e);
            this._setSelectedResult(e.result);
        },
        _handleError(e) {
            console.log('Geocoder Error');
            console.log(e);
        },
        _retargetKeyDown() {
            var _keydown = MapboxGeocoder.prototype._onKeyDown;
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
