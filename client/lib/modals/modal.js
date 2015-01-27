Modal = function() {
  if (! (this instanceof Modal)) {
    return new Modal(options);
  }

  this.modalTemp = null;
  this.clearTimeout = null;
  this.inserted = false;
  this.fixScrollPosition = true;
  this._lastScrollTop = 0;

  this._inView = false;

  this._onClose = [];

  this._template = new ReactiveVar(null);
  this._data = new ReactiveVar({});

  this._open = new ReactiveVar(false);
  this._hiding = new ReactiveVar(false);
}

Modal.prototype.template = function(template) {
  if ( template !== undefined ) {
    return this._template.set(template);
  } else {
    return this._template.get();
  }
}

Modal.prototype.data = function(data) {
  if ( data !== undefined && typeof data === 'object' ) {
    return this._data.set(data);
  } else {
    return this._data.get();
  }
}

Modal.prototype.open = function(open) {
  if ( open !== undefined && typeof open === 'boolean' ) {
    return this._open.set(open);
  } else {
    return this._open.get();
  }
}

Modal.prototype.hiding = function(hide) {
  if ( hide !== undefined && typeof hide === 'boolean' ) {
    return this._hiding.set(hide);
  } else {
    return this._hiding.get();
  }
}

Modal.prototype.onClose = function(onCloseFunc) {
  if ( onCloseFunc && typeof onCloseFunc === 'function' ) {
    this._onClose.push(onCloseFunc);
  } else {
    return this._onClose;
  }
}

Modal.prototype.show = function(template, data) {
  if ( !this.inserted || this.removed ) {
    return false;
  }

  if ( this._inView ) {
    this.close();
  }

  if ( this.clearTimeout ) {
    Meteor.clearTimeout(this.clearTimeout);
    this.clearTimeout = null;
  }

  this.template(template);
  this.data(data);
  this.open(true);
}

Modal.prototype.close = function() {
  this.hideModal();

  this.onClose().forEach(function(func) {
    Tracker.afterFlush(func);
  });
  this._onClose = [];

  this.clearTimeout = Meteor.setTimeout(function() {
    this.template(null);
    this.data(null);
    this.open(false);
    this.hiding(false);
  }.bind(this), 500);
}

Modal.prototype.hideModal = function() {
  this.hiding(true);
}