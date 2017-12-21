(function() {
    "use strict";

    /****************************************************************************
     * BEHAVIORS
     ****************************************************************************/

    /* Ensures the behavior namespace is created */
    window.QaMapGlBehavior = window.QaMapGlBehavior || {};

    /**
     *
     * @polymerBehavior QaMapGlBehavior.Element
     */
    QaMapGlBehavior.ElementImpl = {
        properties: {},
        beforeRegister() {
            /**
             * A reference to this element's instance. The instance can be configured and
             * attached to the map or to another instance. Events emitted by this instance
             * will be intercepted and retargeted so they appear to come from directly from
             * this custom element.
             *
             * @property elementInst
             * @type {Object|null}
             */
            this.elementInst = null;
        },

        attached() {
            this.__elAttached = true;
        },

        detached() {
            this.__elAttached = false;
        },

        /**
         * If this element's instance is ready to create and add to its parent,
         * fires an event the parent will catch.
         *
         * @param {Boolean} isReady - If `true` instance parent will be notified
         * @return {Boolean} - If `true` the parent was notified
         */
        notifyInstReady(isReady = true) {
            if (!isReady) return false;
            this.fire("qa-map-gl-element-ready-to-add");
            return true;
        },

        shouldAddInst() {
            // Create the instance, if it doesn't already exist
            if (!this.elementInst) {
                const options = (this.__initialOptions = this.getInstOptions());
                this.elementInst = this.createInst(options);
                this.fire("qa-map-gl-element-instance-created");
            }

            this.__instEvents = this.__instEvents || [];
            this.__instEventsElementsMap =
                this.__instEventsElementsMap || new WeakMap();
        },

        shouldRemoveInst() {
            this.unbindAllEvents(this.__instEvents, this.__instEventsElementsMap);
            this.__instEvents = null;
            this.__instEventsElementsMap = null;
        },

        // Simple observer trigger for dynamic properties that should be synced
        // to the instance
        shouldUpdateInst() {
            if (!this.elementInst && this.__elAttached && this.canAddInst()) {
                this.notifyInstReady(this.canAddInst());
            }
            if (!this.elementInst) return;

            const lastOptions = this.__lastOptions || this.__initialOptions;
            const nextOptions = this.getInstOptions();

            // Only root element doesn't pass parent
            if (this.is !== "qa-map-gl") {
                this.updateInst(lastOptions, nextOptions, this.parentNode);
            } else {
                this.updateInst(lastOptions, nextOptions);
            }

            // Set `lastOptions` to `nextOptions` so the next time this method is called
            // it will have access to the last options
            this.__lastOptions = nextOptions;
        },

        // Should be implemented by behaviors/components that extend...

        createInst() {
            throw new Error("The `createInst` method must be implemented.");
        },

        updateInst() {
            throw new Error("The `updateInst` method must be implemented.");
        },

        getInstOptions() {
            throw new Error("The `getInstOptions` method must be implemented.");
        },

        addInst() {
            throw new Error("The `bindInst` method must be implemented.");
        },

        removeInst() {
            throw new Error("The `unbindInst` method must be implemented.");
        },

        // Helper methods

        extendObj(obj, ...properties) {
            if (!obj || !(obj instanceof Object))
                throw new Error(
                    "The first parameter of `extendObj` must be an object to be mutated."
                );
            if (properties.length) {
                Object.assign(obj, ...properties);
            }
            return obj;
        },

        addProperties(...properties) {
            this.properties = this.properties || {};
            if (properties.length) {
                this.extend(this.properties, ...properties);
            }
            return this.properties;
        },

        // Bind Events
        bindEvents(evts, target) {
            if (typeof evts !== "object" || !Object.keys(evts).length) return;

            const el = target || this.elementInst;
            if (!el || !el.on) return;

            const boundEvts = this.__instEvents;
            const boundEvtEls = this.__instEventsElementsMap;

            for (let evtName in evts) {
                let evtReference = {
                    name: evtName,
                    fn: evts[evtName]
                };
                el.on(evtReference.name, evtReference.fn);

                boundEvts.push(evtReference);
                boundEvtEls.set(evtReference, el);
            }
        },

        unbindAllEvents(boundEvts, boundEvtEls) {
            // Unbinding not really needed for layer objects.
            if (!boundEvts || !boundEvts.length || !boundEvtEls) return;

            for (let evt of boundEvts) {
                let el = boundEvtEls.get(evt);
                if (!el || !el.off) continue;

                let {
                    name,
                    fn
                } = evt;
                el.off(name, fn);

                boundEvtEls.delete(evt);
            }
        },

        /**
         * If this component is being drawn in Shady DOM, returns true. Used to
         * ensure the shady DOM scope classes are applied when we make DOM
         * transactions that can't be reviewed by the scopeSubtree observer
         * in the root `qa-map-gl` component that is the parent of all elements.
         *
         * @return {Boolean}
         */
        isShadyScoped() {
            return !Polymer.Settings.useNativeShadow;
        },

        /**
         * Returns the stringified shady DOM scope classes. Useful for ensuring they're
         * applied during DOM transactions that can't be reviewed by the scopeSubtree
         * observer in the root `qa-map-gl` component that is the parent of all elements.
         *
         * @return {String} A list of CSS classes separated by spaces
         */
        getShadyScope() {
            return "style-scope qa-map-gl";
        }
    };
    /* Bind Element behavior */
    QaMapGlBehavior.Element = [QaMapGlBehavior.ElementImpl];
})();
