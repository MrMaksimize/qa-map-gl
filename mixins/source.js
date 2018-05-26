export const QaSourceMixin = superClass => class extends superClass {
  connectedCallback() {
    super.connectedCallback();
    this.notifyInstReady(this.canAddInst());
    // http://sdgo.io/2vczACj
    this.parentNode.addEventListener("qa-map-gl-root-load", this.shouldAddInst.bind(this), false);
    this.parentNode.addEventListener("qa-map-gl-root-styledata", this.shouldAddInst.bind(this), false);
  }

  // When this element is detached from the DOM, its elementInst should be
  // removed from the parent

  disconnectedCallback() {
    super.disconnectedCallback();
    this.shouldRemoveInst();
  }

  // Extends the `Element` behavior lifecycle methods to include adding the
  // instance to its parent

  shouldAddInst(evt) {
    const parent = evt.detail;
    super.shouldAddInst(parent);

    if (
      this.elementInst &&
      parent &&
      parent.elementInst.getSource(this.id) == undefined
    ) {
      this.addInst(parent);
    }
  }

  shouldRemoveInst(parent) {
    super.shouldRemoveInst(parent);

    if (this.elementInst) {
      this.removeInst(parent ? parent : undefined);
    }
  }

  getInstOptions() {
    return {
      id: this.id
    };
  }

  // Methods to bind to/unbind from parent

  addInst(parent) {
    const sourceInfo = { type: this.elementInst.type };
    // TODO fix this.
    if (this.elementInst.data) sourceInfo.data = this.elementInst.data;

    if (this.elementInst.tiles) sourceInfo.tiles = this.elementInst.tiles;

    if (this.elementInst.url) sourceInfo.url = this.elementInst.url;

    // TODO - timing issue here with style loading.
    parent.elementInst.addSource(this.elementInst.id, sourceInfo);
    // TODO follow this pattern for layers.
    this.elementInst = parent.elementInst.getSource(this.elementInst.id);
  }

  removeInst(parent) {
    parent.removeSource(this.elementInst);
    this.elementInst.remove();
  }

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
  }
};