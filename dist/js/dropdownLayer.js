
/*
		Dropdown layer jQuery plugin
		
		Copyright (C) 2014 by Viktor Aksionov

		Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.

    v0.1  09/06/2014 initial version
    v0.2  17/07/2014 rewrote js to coffescript and added option `disableDropdownClass` for custom disabling of dropdown item
    v0.3  27/11/2015 Added posibility to change slideUp and slideDown speed
 */
(function($, window, document) {
  "use strict";
  if (typeof $ === "undefined") {
    return false;
  }
  $.fn.dropdownLayer = function(options) {
    var current, current_is_active, current_is_not_active, defaults, getElemPercent, init_state, init_user_state, onClick, rec, settings, state, update_dropdown_layout, user_state;
    current = this;
    state = 0;
    user_state = 0;
    defaults = {
      'elemSelector': "js-dropdown-item",
      'containerClass': "js-dropdown-items",
      'descriptionClass': "js-description",
      'dropdownClass': "js-dropdown",
      'arrowClass': "js-dropdown-arrow",
      'dropdownContentClass': "js-dropdown-content",
      'disableDropdownClass': "js-dropdown-disable",
      'slideUpSpeed': 300,
      'slideDownSpeed': 300,
      'useSlideDown': false,
      'useSlideUp': false,
      'transitionEffect': 'swing',
      'callOnCompleteHide': function() {},
      'callOnCompleteShow': function() {}
    };
    settings = $.extend(defaults, options);
    getElemPercent = function() {
      return 100 * $("." + settings.elemSelector).width() / $("." + settings.containerClass).width();
    };

    /*
    @param {callback} callback function which has to be called at the end
     */
    init_state = function(callback) {
      if (getElemPercent() <= 25) {
        state = 3;
      } else if (getElemPercent() <= 50) {
        state = 2;
      } else {
        state = 1;
      }
      if (typeof callback === "function") {
        callback();
      }
    };

    /*
    @param {callback} callback function which has to be called at the end
     */
    init_user_state = function(callback) {
      if (getElemPercent() <= 25) {
        user_state = 3;
      } else if (getElemPercent() <= 50) {
        user_state = 2;
      } else {
        user_state = 1;
      }
      if (typeof callback === "function") {
        callback();
      }
    };
    update_dropdown_layout = function() {
      init_state(function() {
        var n, o;
        if (user_state !== 0) {
          o = $('.' + settings.dropdownClass).detach();
          n = current.next();
          if (typeof n.position() !== "undefined") {
            o.insertAfter(rec(current, n));
          } else {
            o.insertAfter(current);
          }
          $("." + settings.arrowClass).css("left", current.position().left + current.outerWidth() / 2);
        }
      });
    };
    current_is_active = function() {
      $("." + settings.arrowClass).hide();
      if (settings.useSlideUp) {
        $('.' + settings.dropdownClass).slideUp({
          duration: settings.slideUpSpeed,
          easing: settings.transitionEffect,
          complete: function() {
            $('.' + settings.dropdownClass).remove();
            current.removeClass("active");
            user_state = 0;
            settings.callOnCompleteHide();
          }
        });
      } else {
        $('.' + settings.dropdownClass).remove();
        current.removeClass("active");
        user_state = 0;
        settings.callOnCompleteHide();
      }
    };
    current_is_not_active = function() {
      init_user_state(function() {

        /*
        $.each $('.'+settings.elemSelector), (ind, val) ->
          if $(val).hasClass 'active'
            if settings.useSlideUp
              $('.'+settings.dropdownClass).slideUp 
                duration: settings.slideUpSpeed,
                easing: settings.transitionEffect,
                complete: ->
                  $(val).removeClass 'active'
                  $('.'+settings.dropdownClass).remove()
                  settings.callOnCompleteHide()
                  return
              return
            else
              $('.'+settings.dropdownClass).remove()
              $(val).removeClass "active"
              settings.callOnCompleteHide()
              return
         */
        var dscr, n;
        $.each($('.' + settings.elemSelector), function(ind, val) {
          if ($(val).hasClass('active')) {
            $('.' + settings.dropdownClass).remove();
            $(val).removeClass("active");
            settings.callOnCompleteHide();
            return false;
          }
        });
        dscr = current.find("." + settings.descriptionClass).html();
        n = current.next();
        if (typeof n.position() !== "undefined") {
          $("<div class=\"" + settings.dropdownClass + "\" style=\"display:none\"><div class=\"" + settings.dropdownContentClass + "\"><div class=\"" + settings.arrowClass + "\"></div>" + dscr + "</div></div>").insertAfter(rec(current, n));
        } else {
          $("<div class=\"" + settings.dropdownClass + "\" style=\"display:none\"><div class=\"" + settings.dropdownContentClass + "\"><div class=\"" + settings.arrowClass + "\"></div>" + dscr + "</div></div>").insertAfter(current);
        }
        if (settings.useSlideDown) {
          $('.' + settings.dropdownClass).slideDown({
            duration: settings.slideDownSpeed,
            easing: settings.transitionEffect,
            complete: function() {
              $("." + settings.arrowClass).show();
              $("." + settings.arrowClass).css("left", current.position().left + current.outerWidth() / 2);
              current.addClass("active");
              settings.callOnCompleteShow();
            }
          });
        } else {
          $('.' + settings.dropdownClass).show();
          $("." + settings.arrowClass).show();
          $("." + settings.arrowClass).css("left", current.position().left + current.outerWidth() / 2);
          current.addClass("active");
          settings.callOnCompleteShow();
          return;
        }
      });
    };
    rec = function(cc, nn) {
      if ("undefined" !== typeof nn.position() && cc.position().top === nn.position().top) {
        return rec(nn, nn.next());
      } else {
        return cc;
      }
    };
    onClick = function() {
      current = $(this);
      if (current.hasClass('active')) {
        current_is_active();
      } else {
        current_is_not_active();
      }
    };
    $(window).ready(function() {
      init_state();
    });
    $(window).resize(function() {
      update_dropdown_layout();
    });
    return this.each(function() {
      var dscr;
      dscr = $(this).find("." + settings.descriptionClass).html();
      if (typeof dscr === "undefined" || dscr.length === 0 || $(this).hasClass(settings.disableDropdownClass)) {
        return true;
      } else {
        $(this).click(onClick);
      }
    });
  };
})(jQuery, window, document);
