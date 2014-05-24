/**
 * SmartClick
 * simulate native app list click in mobile device 
 *
 * @version
 * 1.0.00 (August 1 2012)
 * 
 * @copyright
 * Copyright (C) 2012- SuperZheng.
 *
 * @license
 * Dual licensed under the MIT and GPL licenses.
 * 
 */
 /**
 * Usage
 * 
 * var sc = new SmartClick(el, options);
 * 	el is list wrapper id or wrapper Element
 * 	options is Object = {
 * 		className : default is 'ui-selected', list item selected className
 *		layoutDir : default is 'vertical', list view layout mode : 'horizontal', 'vertical', 'both'
 *		sensTime : default is 80, time of sensitivity in ms
 *		sensDist : default is 0.4, distance of sensitivity, if value less than 1 for wrapper size percentage, more then 1 is the absolute pixel
 *		onSel : when user select item, will be exec in selected item context
 *		onUnSel : when user unselect item, will be exec in unselect item context
 * 	}
 *
 * 	destory
 * 	
 * 	sc.destory();
 * 	sc = null;
 */
(function(win, doc) {
	var hasTouch = 'ontouchstart' in win && !(/hp-tablet/gi).test(navigator.appVersion),

		//Browser capabilities
		START_EV = hasTouch ? 'touchstart' : 'mousedown',
		MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
		END_EV = hasTouch ? 'touchend' : 'mouseup',
		CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup',

		//Events
		on = function(el, type, fn) {
			el.addEventListener(type, fn, false);
		},
		off = function(el, type, fn) {
			el.removeEventListener(type, fn, false);
		},

		//Style
		hasClassListProperty = 'classList' in doc.documentElement,
		hasClass = (function() {
			if (hasClassListProperty) {
				return function (el, className) {
					if (!el || !className) {
						return false;
					}
					return el.classList.contains(className);
				};
			} else {
				return function (el, className) {
					if (!el || !className) {
						return false;
					}
					return -1 < (' ' + el.className + ' ').indexOf(' ' + className + ' ');
				};
			}
	    }()),
	    addClass = (function() {
			if (hasClassListProperty) {
				return function (el, className) {
					if (!el || !className || hasClass(el, className)) {
						return;
					}
					el.classList.add(className);
				};
			} else {
				return function (el, className) {
					if (!el || !className || hasClass(el, className)) {
						return;
					}
					el.className += ' ' + className;
				};
			}
	    }()),
		removeClass = (function(){
			if (hasClassListProperty) {
				return function (el, className) {
					if (!el || !className || !hasClass(el, className)) {
						return;
					}
					el.classList.remove(className);
				};
			} else {
				return function (el, className) {
					if (!el || !className || !hasClass(el, className)) {
						return;
					}
					el.className = el.className.replace(new RegExp('(?:^|\\s)' + className + '(?:\\s|$)'), ' ');
				};
			}
	    }()),
 
 		//Constructor
		SmartClick = function(el, options) {
			var p;
			this.el = typeof el == 'object' ? el : doc.getElementById(el);
			this.options = {
				className : 'ui-selected',
				layoutDir : 'vertical',
				multiSel : false,
				sensTime : 120,
				sensDist : 0.4,

				//Events
				onSel : null,
				onUnSel : null,
			};
			for (p in options) {
				if (options.hasOwnProperty(p)) {
					this.options[p] = options[p];
				}
			}
			on(this.el, START_EV, this);
		};

		//Prototype
		SmartClick.prototype = {
			startPoint : [],
			selEl : null,
			currEl : null,
			timerId : -1,
			isMoved : false,
			handleEvent: function (e) {
				switch (e.type) {
					case START_EV : {
						this.clickStart(e);
						break;
					}
					case MOVE_EV : {
						this.clickMove(e);
						break;
					}
					case END_EV:
					case CANCEL_EV: {
						this.clickEnd(e);
						break;
					}
				}
			},
			clickStart : function(e) {
				var target, cb = this;

				e = hasTouch ? e.changedTouches[0] : e;

				target = e.target;
				while (target !== this.el && (!target.getAttribute || target.getAttribute('ui-smartclick') === null)) {
					target = target.parentNode;
				}
				if (!target) {
					return;
				}
				if (this.options.multiSel === false) {
					this.selEl = this.el.querySelector('*[ui-smartclick].' + this.options.className);
				}
				if (target === this.el || (this.options.multiSel === false && target === this.selEl)) {
					return;
				}
				this.startPoint = [e.pageX, e.pageY];
				this.currEl = target;

				on(doc, MOVE_EV, this);
				on(doc, END_EV, this);
				on(doc, CANCEL_EV, this);

				if (this.options.multiSel === false) {
					this.timerId = setTimeout(function() {
						cb.clickTimeout();
					}, this.options.sensTime);
				}
			},
			clickTimeout : function() {
				if (this.isMoved === false) {
					if (this.selEl) {
						removeClass(this.selEl, this.options.className);
					}
					if (this.options.multiSel === true && hasClass(this.currEl, this.options.className)) {
						removeClass(this.currEl, this.options.className);
					} else {
						addClass(this.currEl, this.options.className);
					}
				}
				this.timerId = -1;
			},
			clickMove : function(e) {
				var offset, region, sensDist;

				e = hasTouch ? e.changedTouches[0] : e;

				offset = [Math.abs(e.pageX - this.startPoint[0]), Math.abs(e.pageY - this.startPoint[1])];
				region = [this.currEl.clientWidth, this.currEl.clientHeight];
				sensDist = this.options.sensDist <= 1 ? [region[0] * this.options.sensDist, region[1] * this.options.sensDist] : [this.options.sensDist, this.options.sensDist];

				if (this.isMoved === false && (((this.options.layoutDir === 'horizontal' || this.options.layoutDir === 'both') && offset[0] > sensDist[0]) || ((this.options.layoutDir === 'vertical' || this.options.layoutDir === 'both') && offset[1] > sensDist[1]))) {
					this.isMoved = true;
					if (this.options.multiSel === false) {
						removeClass(this.currEl, this.options.className);
					}
				}
			},
			clickEnd : function(e) {
				var cb;

				e.preventDefault();

				off(doc, MOVE_EV, this);
				off(doc, END_EV, this);
				off(doc, CANCEL_EV, this);

				if (this.isMoved === true && this.selEl !== null) {
					addClass(this.selEl, this.options.className);
				} else if (this.isMoved === false) {
					if (this.options.multiSel === true && hasClass(this.currEl, this.options.className)) {
						cb = this.options.onUnSel;
					} else {
						cb = this.options.onSel;
					}
				}

				if (this.timerId !== -1) {
					clearTimeout(this.timerId);
				}
				if (this.timerId !== -1 || this.options.multiSel === true) {
					this.clickTimeout();
				}

				if (typeof(cb) === 'function') {
					cb.call(this.currEl);
				}

				this.isMoved = false;
				this.currEl = null;
				this.selEl = null;
				this.startPoint = [];
				this.timerId = -1;
			}
		};

		//Exports
		(win.exports || win).SmartClick = function(el, options) {
			var sc = new SmartClick(el, options);
			return {
				destory : function() {
					if (sc) {
						off(sc.el, START_EV, sc);
						off(doc, MOVE_EV, sc);
						off(doc, END_EV, sc);
						off(doc, CANCEL_EV, sc);
						sc = null;
					}
				}
			};
		};
}(this, document));
