/*!
 * Readmore.js jQuery plugin
 * Author: @jed_foster
 * Project home: jedfoster.github.io/Readmore.js
 * Licensed under the MIT license
 */

;(function($) {

  var readmore = 'readmore',
      defaults = {
        speed: 100,
        maxHeight: 200,
        heightMargin: 16,
        moreLink: '<div class="readMore"></div>',
        lessLink: '<div class="closeMore"></div>',
        embedCSS: true,
        sectionCSS: 'display: block; width: 100%;',
        startOpen: false,
        expandedClass: 'readmore-js-expanded',
        collapsedClass: 'readmore-js-collapsed',

        // callbacks
        beforeToggle: function(){},
        afterToggle: function(){}
      },
      cssEmbedded = false;

  function Readmore( element, options ) {
    this.element = element;

    this.options = $.extend( {}, defaults, options);

    $(this.element).data('max-height', this.options.maxHeight);
    $(this.element).data('height-margin', this.options.heightMargin);

    delete(this.options.maxHeight);

    if(this.options.embedCSS && ! cssEmbedded) {
      var styles = '.readmore-js-toggle, .readmore-js-section { ' + this.options.sectionCSS + ' } .readmore-js-section { overflow: hidden; }';

      (function(d,u) {
        var css=d.createElement('style');
        css.type = 'text/css';
        if(css.styleSheet) {
            css.styleSheet.cssText = u;
        }
        else {
            css.appendChild(d.createTextNode(u));
        }
        d.getElementsByTagName('head')[0].appendChild(css);
      }(document, styles));

      cssEmbedded = true;
    }

    this._defaults = defaults;
    this._name = readmore;

    this.init();
  }

  Readmore.prototype = {

    init: function() {
      var $this = this;

      $(this.element).each(function() {
        var current = $(this),
            maxHeight = (current.css('max-height').replace(/[^-\d\.]/g, '') > current.data('max-height')) ?
                current.css('max-height').replace(/[^-\d\.]/g, '') : current.data('max-height'),
            heightMargin = current.data('height-margin');

        if(current.css('max-height') != 'none') {
          current.css('max-height', 'none');
        }

        $this.setBoxHeight(current);

        if(current.height() <= maxHeight + heightMargin) {
          // The block is shorter than the limit, so there's no need to truncate it.
          return true;
        }
        else {
          current.addClass('readmore-js-section ' + $this.options.collapsedClass).data('collapsedHeight', maxHeight);

          var useLink = $this.options.startOpen ? $this.options.lessLink : $this.options.moreLink;
          current.after($(useLink).on('tap', function(event)
          {
              $this.toggleSlider(this, current, event);
              return false;
          }).addClass('readmore-js-toggle'));

          if(!$this.options.startOpen) {
            current.css({height: maxHeight});
          }
        }
      });

      $(window).on('resize', function(event) {
        $this.resizeBoxes();
      });
    },

    toggleSlider: function(trigger, element, event)
    {
      event.preventDefault();

      var $this = this,
          newHeight = newLink = sectionClass = '',
          expanded = false,
          collapsedHeight = $(element).data('collapsedHeight');

      if ($(element).height() <= collapsedHeight) {
        newHeight = $(element).data('expandedHeight') + 'px';
        newLink = 'lessLink';
        expanded = true;
        sectionClass = $this.options.expandedClass;
      }

      else {
        newHeight = collapsedHeight;
        newLink = 'moreLink';
        sectionClass = $this.options.collapsedClass;
      }

      // Fire beforeToggle callback
      $this.options.beforeToggle(trigger, element, expanded);

      $(element).animate({'height': newHeight}, {duration: $this.options.speed, complete: function() {
          // Fire afterToggle callback
          $this.options.afterToggle(trigger, element, expanded);

          $(trigger).replaceWith($($this.options[newLink]).on('tap', function(event)
          {
              $this.toggleSlider(this, element, event);
              return false;
          }).addClass('readmore-js-toggle'));

          $(this).removeClass($this.options.collapsedClass + ' ' + $this.options.expandedClass).addClass(sectionClass);
        }
      });
    },

    setBoxHeight: function(element) {
      var el = element.clone().css({'height': 'auto', 'width': element.width(), 'overflow': 'hidden'}).insertAfter(element);
      var height = el.height();

      el.remove();

      element.data('expandedHeight', height);
    },

    resizeBoxes: function() {
      var $this = this;

      $('.readmore-js-section').each(function() {
        var current = $(this);

        $this.setBoxHeight(current);

        if(current.height() > current.data('expandedHeight') || (current.hasClass($this.options.expandedClass) && current.height() < current.data('expandedHeight')) ) {
          current.css('height', current.data('expandedHeight'));
        }
      });
    },

    destroy: function() {
      var $this = this;

      $(this.element).each(function() {
        var current = $(this);

        current.removeClass('readmore-js-section ' + $this.options.collapsedClass + ' ' + $this.options.expandedClass).css({'max-height': '', 'height': 'auto'}).next('.readmore-js-toggle').remove();

        current.removeData();
      });
    }
  };

  $.fn[readmore] = function( options ) {
    var args = arguments;
    if (options === undefined || typeof options === 'object') {
      return this.each(function () {
        if ($(this).data('plugin_' + readmore)) {
          var instance = $(this).data('plugin_' + readmore);
          instance['destroy'].apply(instance);
        }

        $(this).data('plugin_' + readmore, new Readmore( this, options ));
      });
    } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
      return this.each(function () {
        var instance = $(this).data('plugin_' + readmore);
        if (instance instanceof Readmore && typeof instance[options] === 'function') {
          instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
        }
      });
    }
  }
})(Zepto);
