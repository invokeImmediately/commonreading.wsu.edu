/************************************************************************************************************\
| JQUERY-MEDIATED ENHANCED INTERACTIVITY OF GRAVITY FORM FIELDS                                              |
\************************************************************************************************************/
(function ($) {
    "use strict";
    
	$(document).bind("gform_post_render", function () {
		var $rqrdFlds =  $("li.gfield_contains_required");
		checkRqrdInpts($rqrdFlds.find("input"));
		checkRqrdChckbxs($rqrdFlds.find("ul.gfield_checkbox, ul.gfield_radio"));
		checkRqrdTxtAreas($rqrdFlds.find("textarea"));
	});
	$(document).ready(function () {
        if($("div.gform_body").length > 0) {
			initWsuIdInputs(".gf-is-wsu-id");
            setupActvtrChckbxs(".oue-gf-actvtr-checkbox");
            setupActvtrChain(".oue-gf-actvtr-chain");
            setupUploadChain(".oue-gf-upload-chain");
			
            // TODO: streamline functions by querying all ul.gform_fields li.gfield, then determine 
            //   how to handle object by finding div children with gfield_container_class.
			var $rqrdFlds =  $("li.gfield_contains_required");
			hghlghtRqrdInpts($rqrdFlds.find("input"));
			hghlghtRqrdChckbxs($rqrdFlds.find("ul.gfield_checkbox, ul.gfield_radio"));
			hghlghtRqrdTxtAreas($rqrdFlds.find("textarea"));
			hghlghtRqrdSelects($rqrdFlds.find("select"));
        }
    });
	$(window).load(function () {
		hghlghtRqrdRchTxtEdtrs($("li.gfield_contains_required.uses-rich-editor"));
	});
    
    /****************************************************************************************************\
    | Highlight required INPUTS until a value has been properly entered                                  |
    \****************************************************************************************************/
    function checkRqrdInpts ($fields) {
        if ($.isJQueryObj($fields)) {
            $fields.each(function () {
                var $thisInput = $(this);
				if ($thisInput.val() == "") {
					$thisInput.removeClass("gf-value-entered");
				}
				else {
					$thisInput.addClass("gf-value-entered");
				}
            });
        }
    }
	
    function hghlghtRqrdInpts ($fields) {
        if ($.isJQueryObj($fields)) {
            $fields.each(function () {
                var $thisInput = $(this);
				$thisInput.blur(function () {
					if ($thisInput.val() == "") {
						$thisInput.removeClass("gf-value-entered");
					}
					else {
						$thisInput.addClass("gf-value-entered");
					}
				});
            });
        }
    }

    /****************************************************************************************************\
    | Highlight required CHECKBOXES until at least one has been checked                                  |
    \****************************************************************************************************/
    function checkRqrdChckbxs ($fields) {
        if ($.isJQueryObj($fields)) {
            $fields.each(function () {
                var $this = $(this);
                var $inputs = $this.find("input");
				var inputReady = false;
                $inputs.each(function () {
					if ($(this).prop("checked") == true && !inputReady) {
						inputReady = true;
					}
				});
				if (inputReady) {
					$this.addClass("gf-value-entered");
				}
				else {
					$this.removeClass("gf-value-entered");
				}
			});
		}
	}

    function hghlghtRqrdChckbxs ($fields) {
        if ($.isJQueryObj($fields)) {
            $fields.each(function () {
                var $this = $(this);
                var $inputs = $this.find("input");
                $inputs.each(function () {
                    var $thisChild = $(this);
                    $thisChild.change(function () {
                        var $thisParent, $parentsInputs;
                        var inputReady = false;
                        
                        $thisParent = $thisChild.parents("ul.gfield_checkbox, ul.gfield_radio");
                        $parentsInputs = $thisParent.find("input");
                        $parentsInputs.each(function () {
                            if ($(this).prop("checked") == true && !inputReady) {
                                inputReady = true;
                            }
                        });
                        if (inputReady) {
                            $thisParent.addClass("gf-value-entered");
                        }
                        else {
                            $thisParent.removeClass("gf-value-entered");
                        }
                    });
                });
            });
        }
    }

    /****************************************************************************************************\
    | Highlight required TEXT AREA inputs until a value has been properly entered                        |
    \****************************************************************************************************/
    function checkRqrdTxtAreas ($fields) {
		checkRqrdInpts($fields);
    }

    function hghlghtRqrdTxtAreas ($fields) {
		hghlghtRqrdInpts($fields);
    }

    /****************************************************************************************************\
    | Highlight required RICH TEXT EDITOR containters until a value has been properly entered            |
    \****************************************************************************************************/
	function hghlghtRqrdRchTxtEdtrs($fields) {
        if ($.isJQueryObj($fields) && $fields.length > 0) {
            $fields.each(function () {
				var $edtrFrm = $(this).find("iframe");
				$edtrFrm.each(function () {
					var $edtrBdy = $(this).contents().find("#tinymce");
					$edtrBdy.css("background-color", "rgba(255,0,0,0.1)");
					$edtrBdy.focus(function () {
						$(this).css("background-color", "rgba(255,255,255,1)");
					});
					$edtrBdy.blur(function () {
						var $this = $(this);
						if($this.text().replace(/\n|\uFEFF/g, "") == "") {
							$this.css("background-color","rgba(255,0,0,0.1)");
						}
					});
				});
			});
		}
	}

    /****************************************************************************************************\
    | Highlight required SELECTS until at least one has been checked                                     |
    \****************************************************************************************************/
    function hghlghtRqrdSelects ($fields) {
        if ($.isJQueryObj($fields)) {
            $fields.each(function () {
                var $thisInput = $(this);
				var $childSlctdOptn = $thisInput.find("option:selected");
				var optionVal = $childSlctdOptn.text();                        
				if (optionVal != "") {
					$thisInput.addClass("gf-value-entered");
				}
				else {
					$thisInput.removeClass("gf-value-entered");
				}
				$thisInput.change(function () {
					$childSlctdOptn = $thisInput.find("option:selected");
					optionVal = $childSlctdOptn.text();                        
					if (optionVal != "") {
						$thisInput.addClass("gf-value-entered");
					}
					else {
						$thisInput.removeClass("gf-value-entered");
					}
				});
            });
        }
    }

    /****************************************************************************************************\
    | Initialize RegEx filtration of inputs that accept WSU ID numbers                                   |
    \****************************************************************************************************/
    function initWsuIdInputs(slctrInputs) {
        var $wsuIdInputs = $(slctrInputs).find("input[type='text']");
		$wsuIdInputs.keydown(function(e) {
            var $this = $(this);
            var inputText = $this.val();
			if((e.keyCode < 48 || (e.keyCode > 57 && e.keyCode < 96) || e.keyCode > 105) &&
			 !~[8, 9, 20, 35, 36, 37, 39, 46, 110, 144].indexOf(e.keyCode) &&
			 !(e.keyCode == 86 && e.ctrlKey)) {
				e.preventDefault();
			}
			else if (!~[8, 9, 20, 35, 36, 37, 39, 46, 110, 144].indexOf(e.keyCode) && inputText.length >= 9) {
				e.preventDefault();
				alert("Note: WSU ID numbers are no greater than nine (9) digits in length.");
			}
		});
        $wsuIdInputs.on("paste", function (e) {
            var $this = $(this);
			var clipboardData = e.originalEvent.clipboardData || window.clipboardData;
			var inputText = clipboardData.getData('Text');
            var regExMask = /[^0-9]+/g;
            if (regExMask.exec(inputText) != null) {
				var errorMsg = "Note: WSU ID numbers can only contain digits.";
				e.stopPropagation();
				e.preventDefault();
                $this.val(inputText.replace(regExMask, ""));
                inputText = $this.val();
				if (inputText.length > 9) {
					$this.val(inputText.slice(0,9));
					errorMsg += " Also, they must be no greater than nine (9) digits in length.";
				}
				errorMsg += " What you pasted will automatically be corrected; please check the result to see if further corrections are needed."
				alert(errorMsg);
            }
            else if (inputText.length > 9) {
				e.stopPropagation();
				e.preventDefault();
                $this.val(inputText.slice(0,9));
				alert("WSU ID numbers are no greater than nine (9) digits in length. What you pasted will automatically be corrected; please check the result to see if further corrections are needed.");
            }
        });
        $wsuIdInputs.blur(function () {
            var $this = $(this);
            var regExFinalPttrn = /(?:^[0-9]{8}$)|(?:^0[0-9]{8}$)/;
            var inputText = $this.val();
			if (inputText != "") {
				if (regExFinalPttrn.exec(inputText) == null) {					
					$this.val("");
					alert("Please try again: when the leading zero is included, WSU ID numbers are nine (9) digits long. (You can also drop the leading zero and enter in eight (8) digits.)");
				}
			}
        });
    }
	
    /****************************************************************************************************\
    | Setup activator checkboxes that disappear once one is selected                                     |
    \****************************************************************************************************/
    function setupActvtrChckbxs (selector) {
        if ($.type(selector) === "string") {
            $(".gform_body").on("change", selector + " input", function () {
                var $thisChild = $(this);
                var $thisParent = $thisChild.parents(selector);
                $thisParent.addClass("gf-activated");
            });
        }
    }
    
    /****************************************************************************************************\
    | Setup a chain of activator checkboxes, wherein once a checkbox is activated/deactivated,           |
    | only its closest previous sibling is hidden/shown.                                                 |
    \****************************************************************************************************/
    function setupActvtrChain (selector) {
        if ($.type(selector) === "string") {
            $(".gform_body").on("change", selector + " input", function () {
                var $thisChild = $(this);
                var $thisParent = $thisChild.parents(selector);
                var $parentPrevSblngs = $thisParent.prevAll(selector);
                if($thisChild.prop("checked")) {
                    $parentPrevSblngs.first().addClass("gf-hidden");
                }
                else {
                    $parentPrevSblngs.first().removeClass("gf-hidden");
                }
            });
        }
    }

    /****************************************************************************************************\
    | Setup a chain of file uploading inputs, wherein only the left-most input in the tree is            |
    | visible. As the user uploads files in sequence, the next nearest neighbor is unveiled.             |
    \****************************************************************************************************/
    function setupUploadChain (selector) {
        if ($.type(selector) === "string") {
            /* CHECK IF UPLOADS ALREADY EXIST:
             *  It is possible to arrive at this point in execution after the user has submitted a
             *  form containing errors that also already contains transcripts uploaded to input
             *  fields that will be hidden by default. The following blocks of code resolve this
             *  situation by showing such fields, as well as their nearest neighbors.
             */
            var $inputs = $(selector + " input[type='file']");
            $inputs.each(function () {
                var $thisInput = $(this);
                var $nextDiv = $thisInput.nextAll("div[id]").first();
                if($nextDiv.length > 0) {
                    $thisInput.addClass("gf-value-entered");
                    var $parentOfInput = $thisInput.parents(selector).first();
                    $parentOfInput.removeClass("gf-hidden");
                    var $parentNextSblngs = $parentOfInput.nextAll(selector).first();
                    $parentNextSblngs.removeClass("gf-hidden");
                }
            });
            $(".gform_body").on("change", selector + " input[type='file']", function () {
                var $thisInput = $(this);
                if($thisInput.prop("files") != null && $thisInput.prop("files").length > 0) {
                    var valuePassed = true;
                    var $parentOfInput = $thisInput.parents(selector).first();
                    var $parentNextSblngs = $parentOfInput.nextAll(selector);
                    var $parentPrevSblngs = $parentOfInput.prevAll(selector);
                    if($parentNextSblngs.length != 0 || $parentPrevSblngs.length != 0) {
                        var originalFileName = $thisInput.prop("files").item(0).name;
                        $parentPrevSblngs.each(function () {
                            if(valuePassed) {
                                var $thisSblng = $(this);
                                var $thisSblngInput = $thisSblng.find("input[type='file']").first();
                                if($thisSblngInput.prop("files") != null && $thisSblngInput.prop("files").length > 0) {
                                    var thisFileName = $thisSblngInput.prop("files").item(0).name;
                                    valuePassed = originalFileName != thisFileName;
                                }
                            }
                        });
                        $parentNextSblngs.each(function () {
                            if(valuePassed) {
                                var $thisSblng = $(this);
                                var $thisSblngInput = $thisSblng.find("input[type='file']").first();
                                if($thisSblngInput.prop("files") != null && $thisSblngInput.prop("files").length > 0) {
                                    var thisFileName = $thisSblngInput.prop("files").item(0).name;
                                    valuePassed = originalFileName != thisFileName;
                                }
                            }
                        });
                    }
                    if(valuePassed) {                      
                        $thisInput.addClass("gf-value-entered");
                        $parentNextSblngs.first().removeClass("gf-hidden");
                    }
                    else
                    {
                        alert("A file with the same name has already been uploaded; please choose a different file.");
                        $thisInput.get(0).value = "";
                    }
                }
                else {
                    $thisChild.removeClass("gf-value-entered");
                }
            });
        }
    }
    
 })(jQuery);
/*!
 * jQuery Plugin: Are-You-Sure (Dirty Form Detection)
 * https://github.com/codedance/jquery.AreYouSure/
 *
 * Copyright (c) 2012-2014, Chris Dance and PaperCut Software http://www.papercut.com/
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Author:  chris.dance@papercut.com
 * Version: 1.9.0
 * Date:    13th August 2014
 */
(function($) {
  
  $.fn.areYouSure = function(options) {
      
    var settings = $.extend(
      {
        'message' : 'You have unsaved changes!',
        'dirtyClass' : 'dirty',
        'change' : null,
        'silent' : false,
        'addRemoveFieldsMarksDirty' : false,
        'fieldEvents' : 'change keyup propertychange input',
        'fieldSelector': ":input:not(input[type=submit]):not(input[type=button])"
      }, options);

    var getValue = function($field) {
      if ($field.hasClass('ays-ignore')
          || $field.hasClass('aysIgnore')
          || $field.attr('data-ays-ignore')
          || $field.attr('name') === undefined) {
        return null;
      }

      if ($field.is(':disabled')) {
        return 'ays-disabled';
      }

      var val;
      var type = $field.attr('type');
      if ($field.is('select')) {
        type = 'select';
      }

      switch (type) {
        case 'checkbox':
        case 'radio':
          val = $field.is(':checked');
          break;
        case 'select':
          val = '';
          $field.find('option').each(function(o) {
            var $option = $(this);
            if ($option.is(':selected')) {
              val += $option.val();
            }
          });
          break;
        default:
          val = $field.val();
      }

      return val;
    };

    var storeOrigValue = function($field) {
      $field.data('ays-orig', getValue($field));
    };

    var checkForm = function(evt) {

      var isFieldDirty = function($field) {
        var origValue = $field.data('ays-orig');
        if (undefined === origValue) {
          return false;
        }
        return (getValue($field) != origValue);
      };

      var $form = ($(this).is('form')) 
                    ? $(this)
                    : $(this).parents('form');

      // Test on the target first as it's the most likely to be dirty
      if (isFieldDirty($(evt.target))) {
        setDirtyStatus($form, true);
        return;
      }

      $fields = $form.find(settings.fieldSelector);

      if (settings.addRemoveFieldsMarksDirty) {              
        // Check if field count has changed
        var origCount = $form.data("ays-orig-field-count");
        if (origCount != $fields.length) {
          setDirtyStatus($form, true);
          return;
        }
      }

      // Brute force - check each field
      var isDirty = false;
      $fields.each(function() {
        $field = $(this);
        if (isFieldDirty($field)) {
          isDirty = true;
          return false; // break
        }
      });
      
      setDirtyStatus($form, isDirty);
    };

    var initForm = function($form) {
      var fields = $form.find(settings.fieldSelector);
      $(fields).each(function() { storeOrigValue($(this)); });
      $(fields).unbind(settings.fieldEvents, checkForm);
      $(fields).bind(settings.fieldEvents, checkForm);
      $form.data("ays-orig-field-count", $(fields).length);
      setDirtyStatus($form, false);
    };

    var setDirtyStatus = function($form, isDirty) {
      var changed = isDirty != $form.hasClass(settings.dirtyClass);
      $form.toggleClass(settings.dirtyClass, isDirty);
        
      // Fire change event if required
      if (changed) {
        if (settings.change) settings.change.call($form, $form);

        if (isDirty) $form.trigger('dirty.areYouSure', [$form]);
        if (!isDirty) $form.trigger('clean.areYouSure', [$form]);
        $form.trigger('change.areYouSure', [$form]);
      }
    };

    var rescan = function() {
      var $form = $(this);
      var fields = $form.find(settings.fieldSelector);
      $(fields).each(function() {
        var $field = $(this);
        if (!$field.data('ays-orig')) {
          storeOrigValue($field);
          $field.bind(settings.fieldEvents, checkForm);
        }
      });
      // Check for changes while we're here
      $form.trigger('checkform.areYouSure');
    };

    var reinitialize = function() {
      initForm($(this));
    }

    if (!settings.silent && !window.aysUnloadSet) {
      window.aysUnloadSet = true;
      $(window).bind('beforeunload', function() {
        $dirtyForms = $("form").filter('.' + settings.dirtyClass);
        if ($dirtyForms.length == 0) {
          return;
        }
        // Prevent multiple prompts - seen on Chrome and IE
        if (navigator.userAgent.toLowerCase().match(/msie|chrome/)) {
          if (window.aysHasPrompted) {
            return;
          }
          window.aysHasPrompted = true;
          window.setTimeout(function() {window.aysHasPrompted = false;}, 900);
        }
        return settings.message;
      });
    }

    return this.each(function(elem) {
      if (!$(this).is('form')) {
        return;
      }
      var $form = $(this);
        
      $form.submit(function() {
        $form.removeClass(settings.dirtyClass);
      });
      $form.bind('reset', function() { setDirtyStatus($form, false); });
      // Add a custom events
      $form.bind('rescan.areYouSure', rescan);
      $form.bind('reinitialize.areYouSure', reinitialize);
      $form.bind('checkform.areYouSure', checkForm);
      initForm($form);
    });
  };
})(jQuery);

/*!
 * Application of jQuery Plugin to WSU OUE websites.
 *
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Author:  danielcrieck@gmail.com
 * Version: 1.0.0
 */
(function($) {
	$(document).ready(function() {
		var $gForms = $("div.gform_wrapper > form");
		$gForms.areYouSure();
	});
})(jQuery);
/*!
 * imagesLoaded PACKAGED v4.1.0
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */
!function(t,e){"function"==typeof define&&define.amd?define("ev-emitter/ev-emitter",e):"object"==typeof module&&module.exports?module.exports=e():t.EvEmitter=e()}(this,function(){function t(){}var e=t.prototype;return e.on=function(t,e){if(t&&e){var i=this._events=this._events||{},n=i[t]=i[t]||[];return-1==n.indexOf(e)&&n.push(e),this}},e.once=function(t,e){if(t&&e){this.on(t,e);var i=this._onceEvents=this._onceEvents||{},n=i[t]=i[t]||[];return n[e]=!0,this}},e.off=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){var n=i.indexOf(e);return-1!=n&&i.splice(n,1),this}},e.emitEvent=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){var n=0,o=i[n];e=e||[];for(var r=this._onceEvents&&this._onceEvents[t];o;){var s=r&&r[o];s&&(this.off(t,o),delete r[o]),o.apply(this,e),n+=s?0:1,o=i[n]}return this}},t}),function(t,e){"use strict";"function"==typeof define&&define.amd?define(["ev-emitter/ev-emitter"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("ev-emitter")):t.imagesLoaded=e(t,t.EvEmitter)}(window,function(t,e){function i(t,e){for(var i in e)t[i]=e[i];return t}function n(t){var e=[];if(Array.isArray(t))e=t;else if("number"==typeof t.length)for(var i=0;i<t.length;i++)e.push(t[i]);else e.push(t);return e}function o(t,e,r){return this instanceof o?("string"==typeof t&&(t=document.querySelectorAll(t)),this.elements=n(t),this.options=i({},this.options),"function"==typeof e?r=e:i(this.options,e),r&&this.on("always",r),this.getImages(),h&&(this.jqDeferred=new h.Deferred),void setTimeout(function(){this.check()}.bind(this))):new o(t,e,r)}function r(t){this.img=t}function s(t,e){this.url=t,this.element=e,this.img=new Image}var h=t.jQuery,a=t.console;o.prototype=Object.create(e.prototype),o.prototype.options={},o.prototype.getImages=function(){this.images=[],this.elements.forEach(this.addElementImages,this)},o.prototype.addElementImages=function(t){"IMG"==t.nodeName&&this.addImage(t),this.options.background===!0&&this.addElementBackgroundImages(t);var e=t.nodeType;if(e&&d[e]){for(var i=t.querySelectorAll("img"),n=0;n<i.length;n++){var o=i[n];this.addImage(o)}if("string"==typeof this.options.background){var r=t.querySelectorAll(this.options.background);for(n=0;n<r.length;n++){var s=r[n];this.addElementBackgroundImages(s)}}}};var d={1:!0,9:!0,11:!0};return o.prototype.addElementBackgroundImages=function(t){var e=getComputedStyle(t);if(e)for(var i=/url\((['"])?(.*?)\1\)/gi,n=i.exec(e.backgroundImage);null!==n;){var o=n&&n[2];o&&this.addBackground(o,t),n=i.exec(e.backgroundImage)}},o.prototype.addImage=function(t){var e=new r(t);this.images.push(e)},o.prototype.addBackground=function(t,e){var i=new s(t,e);this.images.push(i)},o.prototype.check=function(){function t(t,i,n){setTimeout(function(){e.progress(t,i,n)})}var e=this;return this.progressedCount=0,this.hasAnyBroken=!1,this.images.length?void this.images.forEach(function(e){e.once("progress",t),e.check()}):void this.complete()},o.prototype.progress=function(t,e,i){this.progressedCount++,this.hasAnyBroken=this.hasAnyBroken||!t.isLoaded,this.emitEvent("progress",[this,t,e]),this.jqDeferred&&this.jqDeferred.notify&&this.jqDeferred.notify(this,t),this.progressedCount==this.images.length&&this.complete(),this.options.debug&&a&&a.log("progress: "+i,t,e)},o.prototype.complete=function(){var t=this.hasAnyBroken?"fail":"done";if(this.isComplete=!0,this.emitEvent(t,[this]),this.emitEvent("always",[this]),this.jqDeferred){var e=this.hasAnyBroken?"reject":"resolve";this.jqDeferred[e](this)}},r.prototype=Object.create(e.prototype),r.prototype.check=function(){var t=this.getIsImageComplete();return t?void this.confirm(0!==this.img.naturalWidth,"naturalWidth"):(this.proxyImage=new Image,this.proxyImage.addEventListener("load",this),this.proxyImage.addEventListener("error",this),this.img.addEventListener("load",this),this.img.addEventListener("error",this),void(this.proxyImage.src=this.img.src))},r.prototype.getIsImageComplete=function(){return this.img.complete&&void 0!==this.img.naturalWidth},r.prototype.confirm=function(t,e){this.isLoaded=t,this.emitEvent("progress",[this,this.img,e])},r.prototype.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},r.prototype.onload=function(){this.confirm(!0,"onload"),this.unbindEvents()},r.prototype.onerror=function(){this.confirm(!1,"onerror"),this.unbindEvents()},r.prototype.unbindEvents=function(){this.proxyImage.removeEventListener("load",this),this.proxyImage.removeEventListener("error",this),this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)},s.prototype=Object.create(r.prototype),s.prototype.check=function(){this.img.addEventListener("load",this),this.img.addEventListener("error",this),this.img.src=this.url;var t=this.getIsImageComplete();t&&(this.confirm(0!==this.img.naturalWidth,"naturalWidth"),this.unbindEvents())},s.prototype.unbindEvents=function(){this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)},s.prototype.confirm=function(t,e){this.isLoaded=t,this.emitEvent("progress",[this,this.element,e])},o.makeJQueryPlugin=function(e){e=e||t.jQuery,e&&(h=e,h.fn.imagesLoaded=function(t,e){var i=new o(this,t,e);return i.jqDeferred.promise(h(this))})},o.makeJQueryPlugin(),o});

/*! 
 * Masonry PACKAGED v4.0.0
 * Cascading grid layout library
 * http://masonry.desandro.com
 * MIT License
 * by David DeSandro
 */
!function(t,e){"use strict";"function"==typeof define&&define.amd?define("jquery-bridget/jquery-bridget",["jquery"],function(i){e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("jquery")):t.jQueryBridget=e(t,t.jQuery)}(window,function(t,e){"use strict";function i(i,r,a){function h(t,e,n){var o,r="$()."+i+'("'+e+'")';return t.each(function(t,h){var u=a.data(h,i);if(!u)return void s(i+" not initialized. Cannot call methods, i.e. "+r);var d=u[e];if(!d||"_"==e.charAt(0))return void s(r+" is not a valid method");var c=d.apply(u,n);o=void 0===o?c:o}),void 0!==o?o:t}function u(t,e){t.each(function(t,n){var o=a.data(n,i);o?(o.option(e),o._init()):(o=new r(n,e),a.data(n,i,o))})}a=a||e||t.jQuery,a&&(r.prototype.option||(r.prototype.option=function(t){a.isPlainObject(t)&&(this.options=a.extend(!0,this.options,t))}),a.fn[i]=function(t){if("string"==typeof t){var e=o.call(arguments,1);return h(this,t,e)}return u(this,t),this},n(a))}function n(t){!t||t&&t.bridget||(t.bridget=i)}var o=Array.prototype.slice,r=t.console,s="undefined"==typeof r?function(){}:function(t){r.error(t)};return n(e||t.jQuery),i}),function(t,e){"function"==typeof define&&define.amd?define("ev-emitter/ev-emitter",e):"object"==typeof module&&module.exports?module.exports=e():t.EvEmitter=e()}(this,function(){function t(){}var e=t.prototype;return e.on=function(t,e){if(t&&e){var i=this._events=this._events||{},n=i[t]=i[t]||[];return-1==n.indexOf(e)&&n.push(e),this}},e.once=function(t,e){if(t&&e){this.on(t,e);var i=this._onceEvents=this._onceEvents||{},n=i[t]=i[t]||[];return n[e]=!0,this}},e.off=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){var n=i.indexOf(e);return-1!=n&&i.splice(n,1),this}},e.emitEvent=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){var n=0,o=i[n];e=e||[];for(var r=this._onceEvents&&this._onceEvents[t];o;){var s=r&&r[o];s&&(this.off(t,o),delete r[o]),o.apply(this,e),n+=s?0:1,o=i[n]}return this}},t}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("get-size/get-size",[],function(){return e()}):"object"==typeof module&&module.exports?module.exports=e():t.getSize=e()}(window,function(){"use strict";function t(t){var e=parseFloat(t),i=-1==t.indexOf("%")&&!isNaN(e);return i&&e}function e(){}function i(){for(var t={width:0,height:0,innerWidth:0,innerHeight:0,outerWidth:0,outerHeight:0},e=0;u>e;e++){var i=h[e];t[i]=0}return t}function n(t){var e=getComputedStyle(t);return e||a("Style returned "+e+". Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1"),e}function o(){if(!d){d=!0;var e=document.createElement("div");e.style.width="200px",e.style.padding="1px 2px 3px 4px",e.style.borderStyle="solid",e.style.borderWidth="1px 2px 3px 4px",e.style.boxSizing="border-box";var i=document.body||document.documentElement;i.appendChild(e);var o=n(e);r.isBoxSizeOuter=s=200==t(o.width),i.removeChild(e)}}function r(e){if(o(),"string"==typeof e&&(e=document.querySelector(e)),e&&"object"==typeof e&&e.nodeType){var r=n(e);if("none"==r.display)return i();var a={};a.width=e.offsetWidth,a.height=e.offsetHeight;for(var d=a.isBorderBox="border-box"==r.boxSizing,c=0;u>c;c++){var l=h[c],f=r[l],m=parseFloat(f);a[l]=isNaN(m)?0:m}var p=a.paddingLeft+a.paddingRight,g=a.paddingTop+a.paddingBottom,y=a.marginLeft+a.marginRight,v=a.marginTop+a.marginBottom,_=a.borderLeftWidth+a.borderRightWidth,E=a.borderTopWidth+a.borderBottomWidth,z=d&&s,b=t(r.width);b!==!1&&(a.width=b+(z?0:p+_));var x=t(r.height);return x!==!1&&(a.height=x+(z?0:g+E)),a.innerWidth=a.width-(p+_),a.innerHeight=a.height-(g+E),a.outerWidth=a.width+y,a.outerHeight=a.height+v,a}}var s,a="undefined"==typeof console?e:function(t){console.error(t)},h=["paddingLeft","paddingRight","paddingTop","paddingBottom","marginLeft","marginRight","marginTop","marginBottom","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth"],u=h.length,d=!1;return r}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("matches-selector/matches-selector",e):"object"==typeof module&&module.exports?module.exports=e():t.matchesSelector=e()}(window,function(){"use strict";var t=function(){var t=Element.prototype;if(t.matches)return"matches";if(t.matchesSelector)return"matchesSelector";for(var e=["webkit","moz","ms","o"],i=0;i<e.length;i++){var n=e[i],o=n+"MatchesSelector";if(t[o])return o}}();return function(e,i){return e[t](i)}}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("fizzy-ui-utils/utils",["matches-selector/matches-selector"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("desandro-matches-selector")):t.fizzyUIUtils=e(t,t.matchesSelector)}(window,function(t,e){var i={};i.extend=function(t,e){for(var i in e)t[i]=e[i];return t},i.modulo=function(t,e){return(t%e+e)%e},i.makeArray=function(t){var e=[];if(Array.isArray(t))e=t;else if(t&&"number"==typeof t.length)for(var i=0;i<t.length;i++)e.push(t[i]);else e.push(t);return e},i.removeFrom=function(t,e){var i=t.indexOf(e);-1!=i&&t.splice(i,1)},i.getParent=function(t,i){for(;t!=document.body;)if(t=t.parentNode,e(t,i))return t},i.getQueryElement=function(t){return"string"==typeof t?document.querySelector(t):t},i.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},i.filterFindElements=function(t,n){t=i.makeArray(t);var o=[];return t.forEach(function(t){if(t instanceof HTMLElement){if(!n)return void o.push(t);e(t,n)&&o.push(t);for(var i=t.querySelectorAll(n),r=0;r<i.length;r++)o.push(i[r])}}),o},i.debounceMethod=function(t,e,i){var n=t.prototype[e],o=e+"Timeout";t.prototype[e]=function(){var t=this[o];t&&clearTimeout(t);var e=arguments,r=this;this[o]=setTimeout(function(){n.apply(r,e),delete r[o]},i||100)}},i.docReady=function(t){"complete"==document.readyState?t():document.addEventListener("DOMContentLoaded",t)},i.toDashed=function(t){return t.replace(/(.)([A-Z])/g,function(t,e,i){return e+"-"+i}).toLowerCase()};var n=t.console;return i.htmlInit=function(e,o){i.docReady(function(){var r=i.toDashed(o),s="data-"+r,a=document.querySelectorAll("["+s+"]"),h=document.querySelectorAll(".js-"+r),u=i.makeArray(a).concat(i.makeArray(h)),d=s+"-options",c=t.jQuery;u.forEach(function(t){var i,r=t.getAttribute(s)||t.getAttribute(d);try{i=r&&JSON.parse(r)}catch(a){return void(n&&n.error("Error parsing "+s+" on "+t.className+": "+a))}var h=new e(t,i);c&&c.data(t,o,h)})})},i}),function(t,e){"function"==typeof define&&define.amd?define("outlayer/item",["ev-emitter/ev-emitter","get-size/get-size"],function(i,n){return e(t,i,n)}):"object"==typeof module&&module.exports?module.exports=e(t,require("ev-emitter"),require("get-size")):(t.Outlayer={},t.Outlayer.Item=e(t,t.EvEmitter,t.getSize))}(window,function(t,e,i){"use strict";function n(t){for(var e in t)return!1;return e=null,!0}function o(t,e){t&&(this.element=t,this.layout=e,this.position={x:0,y:0},this._create())}function r(t){return t.replace(/([A-Z])/g,function(t){return"-"+t.toLowerCase()})}var s=document.documentElement.style,a="string"==typeof s.transition?"transition":"WebkitTransition",h="string"==typeof s.transform?"transform":"WebkitTransform",u={WebkitTransition:"webkitTransitionEnd",transition:"transitionend"}[a],d=[h,a,a+"Duration",a+"Property"],c=o.prototype=Object.create(e.prototype);c.constructor=o,c._create=function(){this._transn={ingProperties:{},clean:{},onEnd:{}},this.css({position:"absolute"})},c.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},c.getSize=function(){this.size=i(this.element)},c.css=function(t){var e=this.element.style;for(var i in t){var n=d[i]||i;e[n]=t[i]}},c.getPosition=function(){var t=getComputedStyle(this.element),e=this.layout._getOption("originLeft"),i=this.layout._getOption("originTop"),n=t[e?"left":"right"],o=t[i?"top":"bottom"],r=this.layout.size,s=-1!=n.indexOf("%")?parseFloat(n)/100*r.width:parseInt(n,10),a=-1!=o.indexOf("%")?parseFloat(o)/100*r.height:parseInt(o,10);s=isNaN(s)?0:s,a=isNaN(a)?0:a,s-=e?r.paddingLeft:r.paddingRight,a-=i?r.paddingTop:r.paddingBottom,this.position.x=s,this.position.y=a},c.layoutPosition=function(){var t=this.layout.size,e={},i=this.layout._getOption("originLeft"),n=this.layout._getOption("originTop"),o=i?"paddingLeft":"paddingRight",r=i?"left":"right",s=i?"right":"left",a=this.position.x+t[o];e[r]=this.getXValue(a),e[s]="";var h=n?"paddingTop":"paddingBottom",u=n?"top":"bottom",d=n?"bottom":"top",c=this.position.y+t[h];e[u]=this.getYValue(c),e[d]="",this.css(e),this.emitEvent("layout",[this])},c.getXValue=function(t){var e=this.layout._getOption("horizontal");return this.layout.options.percentPosition&&!e?t/this.layout.size.width*100+"%":t+"px"},c.getYValue=function(t){var e=this.layout._getOption("horizontal");return this.layout.options.percentPosition&&e?t/this.layout.size.height*100+"%":t+"px"},c._transitionTo=function(t,e){this.getPosition();var i=this.position.x,n=this.position.y,o=parseInt(t,10),r=parseInt(e,10),s=o===this.position.x&&r===this.position.y;if(this.setPosition(t,e),s&&!this.isTransitioning)return void this.layoutPosition();var a=t-i,h=e-n,u={};u.transform=this.getTranslate(a,h),this.transition({to:u,onTransitionEnd:{transform:this.layoutPosition},isCleaning:!0})},c.getTranslate=function(t,e){var i=this.layout._getOption("originLeft"),n=this.layout._getOption("originTop");return t=i?t:-t,e=n?e:-e,"translate3d("+t+"px, "+e+"px, 0)"},c.goTo=function(t,e){this.setPosition(t,e),this.layoutPosition()},c.moveTo=c._transitionTo,c.setPosition=function(t,e){this.position.x=parseInt(t,10),this.position.y=parseInt(e,10)},c._nonTransition=function(t){this.css(t.to),t.isCleaning&&this._removeStyles(t.to);for(var e in t.onTransitionEnd)t.onTransitionEnd[e].call(this)},c._transition=function(t){if(!parseFloat(this.layout.options.transitionDuration))return void this._nonTransition(t);var e=this._transn;for(var i in t.onTransitionEnd)e.onEnd[i]=t.onTransitionEnd[i];for(i in t.to)e.ingProperties[i]=!0,t.isCleaning&&(e.clean[i]=!0);if(t.from){this.css(t.from);var n=this.element.offsetHeight;n=null}this.enableTransition(t.to),this.css(t.to),this.isTransitioning=!0};var l="opacity,"+r(d.transform||"transform");c.enableTransition=function(){this.isTransitioning||(this.css({transitionProperty:l,transitionDuration:this.layout.options.transitionDuration}),this.element.addEventListener(u,this,!1))},c.transition=o.prototype[a?"_transition":"_nonTransition"],c.onwebkitTransitionEnd=function(t){this.ontransitionend(t)},c.onotransitionend=function(t){this.ontransitionend(t)};var f={"-webkit-transform":"transform"};c.ontransitionend=function(t){if(t.target===this.element){var e=this._transn,i=f[t.propertyName]||t.propertyName;if(delete e.ingProperties[i],n(e.ingProperties)&&this.disableTransition(),i in e.clean&&(this.element.style[t.propertyName]="",delete e.clean[i]),i in e.onEnd){var o=e.onEnd[i];o.call(this),delete e.onEnd[i]}this.emitEvent("transitionEnd",[this])}},c.disableTransition=function(){this.removeTransitionStyles(),this.element.removeEventListener(u,this,!1),this.isTransitioning=!1},c._removeStyles=function(t){var e={};for(var i in t)e[i]="";this.css(e)};var m={transitionProperty:"",transitionDuration:""};return c.removeTransitionStyles=function(){this.css(m)},c.removeElem=function(){this.element.parentNode.removeChild(this.element),this.css({display:""}),this.emitEvent("remove",[this])},c.remove=function(){return a&&parseFloat(this.layout.options.transitionDuration)?(this.once("transitionEnd",function(){this.removeElem()}),void this.hide()):void this.removeElem()},c.reveal=function(){delete this.isHidden,this.css({display:""});var t=this.layout.options,e={},i=this.getHideRevealTransitionEndProperty("visibleStyle");e[i]=this.onRevealTransitionEnd,this.transition({from:t.hiddenStyle,to:t.visibleStyle,isCleaning:!0,onTransitionEnd:e})},c.onRevealTransitionEnd=function(){this.isHidden||this.emitEvent("reveal")},c.getHideRevealTransitionEndProperty=function(t){var e=this.layout.options[t];if(e.opacity)return"opacity";for(var i in e)return i},c.hide=function(){this.isHidden=!0,this.css({display:""});var t=this.layout.options,e={},i=this.getHideRevealTransitionEndProperty("hiddenStyle");e[i]=this.onHideTransitionEnd,this.transition({from:t.visibleStyle,to:t.hiddenStyle,isCleaning:!0,onTransitionEnd:e})},c.onHideTransitionEnd=function(){this.isHidden&&(this.css({display:"none"}),this.emitEvent("hide"))},c.destroy=function(){this.css({position:"",left:"",right:"",top:"",bottom:"",transition:"",transform:""})},o}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("outlayer/outlayer",["ev-emitter/ev-emitter","get-size/get-size","fizzy-ui-utils/utils","./item"],function(i,n,o,r){return e(t,i,n,o,r)}):"object"==typeof module&&module.exports?module.exports=e(t,require("ev-emitter"),require("get-size"),require("fizzy-ui-utils"),require("./item")):t.Outlayer=e(t,t.EvEmitter,t.getSize,t.fizzyUIUtils,t.Outlayer.Item)}(window,function(t,e,i,n,o){"use strict";function r(t,e){var i=n.getQueryElement(t);if(!i)return void(a&&a.error("Bad element for "+this.constructor.namespace+": "+(i||t)));this.element=i,h&&(this.$element=h(this.element)),this.options=n.extend({},this.constructor.defaults),this.option(e);var o=++d;this.element.outlayerGUID=o,c[o]=this,this._create();var r=this._getOption("initLayout");r&&this.layout()}function s(t){function e(){t.apply(this,arguments)}return e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e}var a=t.console,h=t.jQuery,u=function(){},d=0,c={};r.namespace="outlayer",r.Item=o,r.defaults={containerStyle:{position:"relative"},initLayout:!0,originLeft:!0,originTop:!0,resize:!0,resizeContainer:!0,transitionDuration:"0.4s",hiddenStyle:{opacity:0,transform:"scale(0.001)"},visibleStyle:{opacity:1,transform:"scale(1)"}};var l=r.prototype;return n.extend(l,e.prototype),l.option=function(t){n.extend(this.options,t)},l._getOption=function(t){var e=this.constructor.compatOptions[t];return e&&void 0!==this.options[e]?this.options[e]:this.options[t]},r.compatOptions={initLayout:"isInitLayout",horizontal:"isHorizontal",layoutInstant:"isLayoutInstant",originLeft:"isOriginLeft",originTop:"isOriginTop",resize:"isResizeBound",resizeContainer:"isResizingContainer"},l._create=function(){this.reloadItems(),this.stamps=[],this.stamp(this.options.stamp),n.extend(this.element.style,this.options.containerStyle);var t=this._getOption("resize");t&&this.bindResize()},l.reloadItems=function(){this.items=this._itemize(this.element.children)},l._itemize=function(t){for(var e=this._filterFindItemElements(t),i=this.constructor.Item,n=[],o=0;o<e.length;o++){var r=e[o],s=new i(r,this);n.push(s)}return n},l._filterFindItemElements=function(t){return n.filterFindElements(t,this.options.itemSelector)},l.getItemElements=function(){return this.items.map(function(t){return t.element})},l.layout=function(){this._resetLayout(),this._manageStamps();var t=this._getOption("layoutInstant"),e=void 0!==t?t:!this._isLayoutInited;this.layoutItems(this.items,e),this._isLayoutInited=!0},l._init=l.layout,l._resetLayout=function(){this.getSize()},l.getSize=function(){this.size=i(this.element)},l._getMeasurement=function(t,e){var n,o=this.options[t];o?("string"==typeof o?n=this.element.querySelector(o):o instanceof HTMLElement&&(n=o),this[t]=n?i(n)[e]:o):this[t]=0},l.layoutItems=function(t,e){t=this._getItemsForLayout(t),this._layoutItems(t,e),this._postLayout()},l._getItemsForLayout=function(t){return t.filter(function(t){return!t.isIgnored})},l._layoutItems=function(t,e){if(this._emitCompleteOnItems("layout",t),t&&t.length){var i=[];t.forEach(function(t){var n=this._getItemLayoutPosition(t);n.item=t,n.isInstant=e||t.isLayoutInstant,i.push(n)},this),this._processLayoutQueue(i)}},l._getItemLayoutPosition=function(){return{x:0,y:0}},l._processLayoutQueue=function(t){t.forEach(function(t){this._positionItem(t.item,t.x,t.y,t.isInstant)},this)},l._positionItem=function(t,e,i,n){n?t.goTo(e,i):t.moveTo(e,i)},l._postLayout=function(){this.resizeContainer()},l.resizeContainer=function(){var t=this._getOption("resizeContainer");if(t){var e=this._getContainerSize();e&&(this._setContainerMeasure(e.width,!0),this._setContainerMeasure(e.height,!1))}},l._getContainerSize=u,l._setContainerMeasure=function(t,e){if(void 0!==t){var i=this.size;i.isBorderBox&&(t+=e?i.paddingLeft+i.paddingRight+i.borderLeftWidth+i.borderRightWidth:i.paddingBottom+i.paddingTop+i.borderTopWidth+i.borderBottomWidth),t=Math.max(t,0),this.element.style[e?"width":"height"]=t+"px"}},l._emitCompleteOnItems=function(t,e){function i(){o.dispatchEvent(t+"Complete",null,[e])}function n(){s++,s==r&&i()}var o=this,r=e.length;if(!e||!r)return void i();var s=0;e.forEach(function(e){e.once(t,n)})},l.dispatchEvent=function(t,e,i){var n=e?[e].concat(i):i;if(this.emitEvent(t,n),h)if(this.$element=this.$element||h(this.element),e){var o=h.Event(e);o.type=t,this.$element.trigger(o,i)}else this.$element.trigger(t,i)},l.ignore=function(t){var e=this.getItem(t);e&&(e.isIgnored=!0)},l.unignore=function(t){var e=this.getItem(t);e&&delete e.isIgnored},l.stamp=function(t){t=this._find(t),t&&(this.stamps=this.stamps.concat(t),t.forEach(this.ignore,this))},l.unstamp=function(t){t=this._find(t),t&&t.forEach(function(t){n.removeFrom(this.stamps,t),this.unignore(t)},this)},l._find=function(t){return t?("string"==typeof t&&(t=this.element.querySelectorAll(t)),t=n.makeArray(t)):void 0},l._manageStamps=function(){this.stamps&&this.stamps.length&&(this._getBoundingRect(),this.stamps.forEach(this._manageStamp,this))},l._getBoundingRect=function(){var t=this.element.getBoundingClientRect(),e=this.size;this._boundingRect={left:t.left+e.paddingLeft+e.borderLeftWidth,top:t.top+e.paddingTop+e.borderTopWidth,right:t.right-(e.paddingRight+e.borderRightWidth),bottom:t.bottom-(e.paddingBottom+e.borderBottomWidth)}},l._manageStamp=u,l._getElementOffset=function(t){var e=t.getBoundingClientRect(),n=this._boundingRect,o=i(t),r={left:e.left-n.left-o.marginLeft,top:e.top-n.top-o.marginTop,right:n.right-e.right-o.marginRight,bottom:n.bottom-e.bottom-o.marginBottom};return r},l.handleEvent=n.handleEvent,l.bindResize=function(){t.addEventListener("resize",this),this.isResizeBound=!0},l.unbindResize=function(){t.removeEventListener("resize",this),this.isResizeBound=!1},l.onresize=function(){this.resize()},n.debounceMethod(r,"onresize",100),l.resize=function(){this.isResizeBound&&this.needsResizeLayout()&&this.layout()},l.needsResizeLayout=function(){var t=i(this.element),e=this.size&&t;return e&&t.innerWidth!==this.size.innerWidth},l.addItems=function(t){var e=this._itemize(t);return e.length&&(this.items=this.items.concat(e)),e},l.appended=function(t){var e=this.addItems(t);e.length&&(this.layoutItems(e,!0),this.reveal(e))},l.prepended=function(t){var e=this._itemize(t);if(e.length){var i=this.items.slice(0);this.items=e.concat(i),this._resetLayout(),this._manageStamps(),this.layoutItems(e,!0),this.reveal(e),this.layoutItems(i)}},l.reveal=function(t){this._emitCompleteOnItems("reveal",t),t&&t.length&&t.forEach(function(t){t.reveal()})},l.hide=function(t){this._emitCompleteOnItems("hide",t),t&&t.length&&t.forEach(function(t){t.hide()})},l.revealItemElements=function(t){var e=this.getItems(t);this.reveal(e)},l.hideItemElements=function(t){var e=this.getItems(t);this.hide(e)},l.getItem=function(t){for(var e=0;e<this.items.length;e++){var i=this.items[e];if(i.element==t)return i}},l.getItems=function(t){t=n.makeArray(t);var e=[];return t.forEach(function(t){var i=this.getItem(t);i&&e.push(i)},this),e},l.remove=function(t){var e=this.getItems(t);this._emitCompleteOnItems("remove",e),e&&e.length&&e.forEach(function(t){t.remove(),n.removeFrom(this.items,t)},this)},l.destroy=function(){var t=this.element.style;t.height="",t.position="",t.width="",this.items.forEach(function(t){t.destroy()}),this.unbindResize();var e=this.element.outlayerGUID;delete c[e],delete this.element.outlayerGUID,h&&h.removeData(this.element,this.constructor.namespace)},r.data=function(t){t=n.getQueryElement(t);var e=t&&t.outlayerGUID;return e&&c[e]},r.create=function(t,e){var i=s(r);return i.defaults=n.extend({},r.defaults),n.extend(i.defaults,e),i.compatOptions=n.extend({},r.compatOptions),i.namespace=t,i.data=r.data,i.Item=s(o),n.htmlInit(i,t),h&&h.bridget&&h.bridget(t,i),i},r.Item=o,r}),function(t,e){"function"==typeof define&&define.amd?define(["outlayer/outlayer","get-size/get-size"],e):"object"==typeof module&&module.exports?module.exports=e(require("outlayer"),require("get-size")):t.Masonry=e(t.Outlayer,t.getSize)}(window,function(t,e){var i=t.create("masonry");return i.compatOptions.fitWidth="isFitWidth",i.prototype._resetLayout=function(){this.getSize(),this._getMeasurement("columnWidth","outerWidth"),this._getMeasurement("gutter","outerWidth"),this.measureColumns(),this.colYs=[];for(var t=0;t<this.cols;t++)this.colYs.push(0);this.maxY=0},i.prototype.measureColumns=function(){if(this.getContainerWidth(),!this.columnWidth){var t=this.items[0],i=t&&t.element;this.columnWidth=i&&e(i).outerWidth||this.containerWidth}var n=this.columnWidth+=this.gutter,o=this.containerWidth+this.gutter,r=o/n,s=n-o%n,a=s&&1>s?"round":"floor";r=Math[a](r),this.cols=Math.max(r,1)},i.prototype.getContainerWidth=function(){var t=this._getOption("fitWidth"),i=t?this.element.parentNode:this.element,n=e(i);this.containerWidth=n&&n.innerWidth},i.prototype._getItemLayoutPosition=function(t){t.getSize();var e=t.size.outerWidth%this.columnWidth,i=e&&1>e?"round":"ceil",n=Math[i](t.size.outerWidth/this.columnWidth);n=Math.min(n,this.cols);for(var o=this._getColGroup(n),r=Math.min.apply(Math,o),s=o.indexOf(r),a={x:this.columnWidth*s,y:r},h=r+t.size.outerHeight,u=this.cols+1-o.length,d=0;u>d;d++)this.colYs[s+d]=h;return a},i.prototype._getColGroup=function(t){if(2>t)return this.colYs;for(var e=[],i=this.cols+1-t,n=0;i>n;n++){var o=this.colYs.slice(n,n+t);e[n]=Math.max.apply(Math,o)}return e},i.prototype._manageStamp=function(t){var i=e(t),n=this._getElementOffset(t),o=this._getOption("originLeft"),r=o?n.left:n.right,s=r+i.outerWidth,a=Math.floor(r/this.columnWidth);a=Math.max(0,a);var h=Math.floor(s/this.columnWidth);h-=s%this.columnWidth?0:1,h=Math.min(this.cols-1,h);for(var u=this._getOption("originTop"),d=(u?n.top:n.bottom)+i.outerHeight,c=a;h>=c;c++)this.colYs[c]=Math.max(d,this.colYs[c])},i.prototype._getContainerSize=function(){this.maxY=Math.max.apply(Math,this.colYs);var t={height:this.maxY};return this._getOption("fitWidth")&&(t.width=this._getContainerFitWidth()),t},i.prototype._getContainerFitWidth=function(){for(var t=0,e=this.cols;--e&&0===this.colYs[e];)t++;return(this.cols-t)*this.columnWidth-this.gutter},i.prototype.needsResizeLayout=function(){var t=this.containerWidth;return this.getContainerWidth(),t!=this.containerWidth},i});

/*!
 * Application of imagesLoaded & Masonry libraries to WSU OUE websites.
 */
(function ($) {
	/*******************************************************************************************************************
	 * Function calls made once the DOM IS READY                                                                       *
	 *******************************************************************************************************************/
    $(function () {
        var $masonryTrgts = $("ul.cascaded-layout");
        $masonryTrgts.each(function () {
            var $thisCascade = $(this);
            var proceedWithLayout = true;
            var sizerFound = false;
            var gutterSizerFound = false;
            var $cascadeChilren = $thisCascade.children();
            $cascadeChilren.each(function () { // Look for the correct layout
                var $thisChild = $(this);
                if(!$thisChild.hasClass("cascaded-item")) {
                    if(!$thisChild.hasClass("cascade-sizer")) {
                        if(!$thisChild.hasClass("gutter-sizer")) {
                            if(!$thisChild.hasClass("cascade-other")) {
                                return proceedWithLayout = false;
                            }
                        }
                        else
                        {
                            gutterSizerFound = true;
                        }
                    }
                    else {
                        sizerFound = true;
                    }
                }
            });
            if(proceedWithLayout && (!sizerFound || !gutterSizerFound)) proceedWithLayout = false;
            if(proceedWithLayout) {
                $thisCascade.masonry({
                    columnWidth: ".cascade-sizer",
                    gutter: ".gutter-sizer",
                    itemSelector: ".cascaded-item",
                    percentPosition: true
                });
                $thisCascade.attr("data-masonry-active","1");
                $thisCascade.imagesLoaded().progress( function() {
                    $thisCascade.masonry("layout");
                });
            }
        });
    });
	
	/*******************************************************************************************************************
	 * WINDOW LOAD event bindings                                                                                      *
	 *******************************************************************************************************************/
    $(window).on("load", function () {
        var $masonryTrgts = $("ul.cascaded-layout");
        $masonryTrgts.each(function () {
            var $thisCascade = $(this);
            var proceedWithLayout = true;
            var sizerFound = false;
            var gutterSizerFound = false;
            var $cascadeChilren = $thisCascade.children();
            $cascadeChilren.each(function () { // Look for the correct layout
                var $thisChild = $(this);
                if(!$thisChild.hasClass("cascaded-item")) {
                    if(!$thisChild.hasClass("cascade-sizer")) {
                        if(!$thisChild.hasClass("gutter-sizer")) {
                            if(!$thisChild.hasClass("cascade-other")) {
                                return proceedWithLayout = false;
                            }
                        }
                        else
                        {
                            gutterSizerFound = true;
                        }
                    }
                    else {
                        sizerFound = true;
                    }
                }
            });
            if(proceedWithLayout && (!sizerFound || !gutterSizerFound)) proceedWithLayout = false;
            if(proceedWithLayout) {
                $thisCascade.masonry("layout");
            }
        });
    });
})(jQuery);
// See [https://github.com/invokeImmediately/commonreading.wsu.edu] for repository of source code
/**********************************************************************************************************************
 CUSTOM JQUERY-BASED DYNAMIC CONTENT
 *********************************************************************************************************************/
"use strict";

(function ($) {
	$(function () {
 		var params = new Object();
		var theseParams;
		
		params.initCalendarItemExpansion = {
			slctrCalendars: "ul.cascaded-layout.calendar"
			expansionClass: "double",
			expansionDelay: 300
		};
		
		theseParams = params.initCalendarItemExpansion;
		initCalendarItemExpansion(
			theseParams.slctrCalendars,
			theseParams.expansionClass
		);
	});
	
	function initCalendarItemExpansion(slctrCalendars, expansionClass, expansionDelay) {
		var $calendars = $(slctrCalendars);
		if ($calendars.length) {
			$calendars.each(function () {
				var $thisCalendar = $(this);
				var $items = $thisCalendar.children("li");
				$items.each(function() {
					var $thisItem = $(this);
					$this.mouseenter(function() {
						expandCalendarItem($thisCalendar, $thisItem, expansionClass, expansionDelay);
					});
					$this.mouseleave(function() {
						collapseCalendarItem($thisCalendar, $thisItem, expansionClass, expansionDelay);
					});
				});
			});
		}
	}
	
	function expandCalendarItem($calendar, $item, expansionClass, expansionDelay) {
		$item.addClass(expansionClass);
		$calendar.delay(expansionDelay).masonry("layout");
	}
	
	function collapseCalendarItem($calendar, $item, expansionClass, expansionDelay) {
		$item.removeClass(expansionClass);
		$calendar.delay(expansionDelay).masonry("layout");
	}
})(jQuery);
