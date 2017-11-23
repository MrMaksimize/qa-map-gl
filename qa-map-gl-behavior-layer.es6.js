(function() {
    "use strict";

    /****************************************************************************
     * BEHAVIORS
     ****************************************************************************/

    /* Ensures the behavior namespace is created */
    window.QaMapGlBehavior = window.QaMapGlBehavior || {};

    /**
     *
     *
     * @polymerBehavior QaMapGlBehavior.Layer
     */
    QaMapGlBehavior.LayerImpl = {
        // When this element is attached to the DOM, fire an event to notify
        // a parent that it is ready

        // Properties defined here are shared across all layer types
        properties: {
            /**
             * Unique id of this layer
             *
             * @type {String}
             */
            id: {
                type: String
            },

            /**
             * Type of layer
             * One of "fill", "line", "symbol", "circle",
             * "heatmap", "fill-extrusion", "raster", "background".
             * "fill": A filled polygon with an optional stroked border.
             *
             * "line": A stroked line.
             *
             * "symbol": An icon or a text label.
             *
             * "circle": A filled circle.
             *
             * "heatmap": A heatmap.
             *
             * "fill-extrusion": An extruded (3D) polygon.
             *
             * "raster": Raster map textures such as satellite imagery.
             *
             * "background": The background color or pattern of the map.
             *
             * @type {String}
             */
            layerType: {
                type: String
            },

            /**
             * Name of a source description to be used for this layer.
             * Required for all layer types except background.
             *
             * @type {String}
             */
            source: {
                type: String
            },

            /**
             * Layer to use from a vector tile source.
             * Required for vector tile sources; prohibited for all other source types,
             * including GeoJSON sources.
             *
             * @type {String}
             */
            sourceLayer: {
                type: String,
                observer: "shouldUpdateInst"
            },

            /**
             * Whether the layer is visible or not.
             * One of "visible" or "none"
             *
             * @type {String}
             */
            visibility: {
                type: String,
                value: "visible",
                observer: "shouldUpdateInst"
            },

            /**
             * Layout properties for the layer
             *
             * @type {Object}
             */
            layout: {
                type: Object,
                value: function() {
                    return {};
                }
            },

            /**
             * Paint properties for the layer
             *
             * @type {Object}
             */
            paint: {
                type: Object,
                value: function() {
                    return {};
                }
            },

            /**
             * The minimum zoom level on which the layer gets parsed and appears on.
             *
             * @type {Number}
             */
            minZoomVisible: {
                type: Number,
                value: 0,
                observer: "shouldUpdateInst"
            },

            /**
             * The maximum zoom level on which the layer gets parsed and appears on.
             *
             * @type {Number}
             */
            maxZoomVisible: {
                type: Number,
                value: 22,
                observer: "shouldUpdateInst"
            },

            /**
             * Paint properties for the layer
             * A expression specifying conditions on source features.
             * Only features that match the filter are displayed.
             * https://www.mapbox.com/mapbox-gl-js/style-spec/#other-filter
             *
             * @type {Array}
             */
            filter: {
                type: Array,
                observer: "shouldUpdateInst"
            },

            /**
             * Events to bind to layer
             */
            events: {
                type: String,
                observer: "shouldUpdateInst"
            },
            /**
             * The ID of an existing layer to insert the new layer before.
             * If this argument is omitted, the layer will be appended to the end of the layers array.
             * if a layer type is inserted, it will be inserted before all layers of that type.
             */
            beforeLayer: {
                type: String
            }
        },
        // Observer to catch sub-property changes on paint and layout.
        observers: ["shouldUpdateInstComplex(paint.*, layout.*)"],
        attached() {
            this.notifyInstReady(this.canAddInst());
            // http://sdgo.io/2vczACj
            this.listen(this.parentNode, "qa-map-gl-root-load", "shouldAddInst");
            this.listen(this.parentNode, "qa-map-gl-root-styledata", "shouldAddInst");
        },

        // When this element is detached from the DOM, its elementInst should be
        // removed from the parent

        detached() {
            this.shouldRemoveInst();
        },

        // Extends the `Element` behavior lifecycle methods to include adding the
        // instance to its parent

        shouldUpdateInstComplex(paint, layout) {
            this.debounce(
                "shouldUpdateInstDebounce",
                function() {
                    QaMapGlBehavior.ElementImpl.shouldUpdateInst.call(this, parent);
                },
                250
            );
        },

        shouldAddInst(evt) {
            // TODO - do we need this evt anymore since _getMapElement would just work?
            const parent = evt.detail;
            QaMapGlBehavior.ElementImpl.shouldAddInst.call(this, parent);

            if (
                this.elementInst &&
                parent &&
                parent.elementInst.getLayer(this.id) == undefined
            ) {
                this.addInst(parent);
            }
        },

        shouldRemoveInst(parent) {
            // In theory - this should remove all bound events to layers.
            QaMapGlBehavior.ElementImpl.shouldRemoveInst.call(this, parent);
            // Update parent call fxn.

            if (this.elementInst) {
                this.removeInst(parent ? parent : undefined);
            }
        },

        createInst(options) {
            const layerInst = options;
            return layerInst;
        },

        // Methods to bind to/unbind from parent

        addInst(parent) {
            // Determine what is the preceding layer;
            var beforeLayer = this.beforeLayer || undefined;
            if (beforeLayer !== undefined && (beforeLayer === 'fill' || beforeLayer === 'symbol' ||
                    beforeLayer === 'circle' || beforeLayer === 'heatmap' ||
                    beforeLayer === 'background' || beforeLayer === 'raster' ||
                    beforeLayer === 'fill-extrusion' || beforeLayer === 'line')) {
                let layers = parent.elementInst.getStyle().layers;
                let labelLayerIdx = layers.findIndex(function(layer) {
                    return layer.type === beforeLayer;
                });
                beforeLayer = labelLayerIdx !== -1 ? layers[labelLayerIdx].id : undefined;
            }

            parent.elementInst.addLayer(this.elementInst, beforeLayer);
            var eventBindings = {};

            // Bind Events
            /* We're going to bind events here necessary for any layer.
             * When an event is triggered, it's going to be broadast out to the children
             * or popups.  It's also going to be broadcast up to any listeners
             */
            if (this.events && this.events !== "") {
                for (let evt of this.events.split(",")) {
                    eventBindings[evt] = this._broadcastEvent.bind(this);
                }
                this.bindEvents(eventBindings, parent);
            }
        },

        removeInst(parent) {
            parent.removeLayer(this.id);
            this.elementInst.remove();
        },

        updateInst(lastOptions, nextOptions, parent) {
            // Set Layout Props.
            for (var lpKey in nextOptions.layout) {
                parent.elementInst.setLayoutProperty(
                    this.id,
                    lpKey,
                    nextOptions.layout[lpKey]
                );
            }

            // Set Paint Props.
            for (var pKey in nextOptions.paint) {
                parent.elementInst.setPaintProperty(
                    this.id,
                    pKey,
                    nextOptions.paint[pKey]
                );
            }

            // Set Zoom Range.
            parent.elementInst.setLayerZoomRange(
                this.id,
                nextOptions.minzoom,
                nextOptions.maxzoom
            );

            // Set Filters
            parent.elementInst.setFilter(this.id, nextOptions.filter);
        },

        /**
         * Bind Events
         */
        bindEvents(evts, parent) {
            if (typeof evts !== "object" || !Object.keys(evts).length) return;

            const mapRoot = parent.elementInst;
            const layerId = this.id;

            const boundEvts = this.__instEvents;
            const boundEvtEls = this.__instEventsElementsMap;

            for (let evtName in evts) {
                let evtReference = {
                    name: evtName,
                    fn: evts[evtName]
                };
                mapRoot.on(evtReference.name, layerId, evtReference.fn);

                boundEvts.push(evtReference);
                boundEvtEls.set(evtReference, mapRoot);
            }
        },

        unbindAllEvents(boundEvts, boundEvtEls) {
            if (!boundEvts || !boundEvts.length || !boundEvtEls) return;

            for (let evt of boundEvts) {
                let el = boundEvtEls.get(evt);

                let {
                    name,
                    fn
                } = evt;
                el.off(name, this.id, fn);

                boundEvtEls.delete(evt);
            }
        },

        _broadcastEvent(e) {
            console.log('broadcasting event from layer' + this.id);
            console.log(e);
            this.fire(e.type);
        },

        _switchPointer(e) {
            if (e.type === "mouseenter") {
                e.target.getCanvas().style.cursor = "pointer";
            } else {
                e.target.getCanvas().style.cursor = "";
            }
        },

        /**
         * Some element instances may require a minimum number of defined options
         * to be able to attach to their parent. If those options are defined via.
         * attributes, they may not be deserialized or even set before the `willAddInst`
         * method is called.
         *
         * Elements that need to defer until some options are set should override
         * the `canAddInst` method and return `false` if the method
         *
         * Elements that may need to defer until some options are ready should
         * override `instReady` and set it to `false` by default.
         *
         * Later, when the `updateInst` function is called, the element should check
         * if all required options are set and call the method `this.notifyInstReady(true)`
         * to trigger an event the parent will catch and use to attach this element.
         */
        canAddInst() {
            return true;
        },

        getInstOptions() {
            const options = {
                id: this.id,
                type: this.layerType,
                source: this.source,
                minzoom: this.minZoomVisible,
                maxzoom: this.maxZoomVisible,
                layout: this.layout,
                paint: this.paint
            };

            options.layout.visibility = this.visibility;

            if (this.sourceLayer) options["source-layer"] = this.sourceLayer;

            if (this.filter && Array.isArray(this.filter))
                options["filter"] = this.filter;

            return options;
        }
    };
    /* Bind Layer behavior */
    /** @polymerBehavior */
    QaMapGlBehavior.Layer = [QaMapGlBehavior.Element, QaMapGlBehavior.LayerImpl];
})();
