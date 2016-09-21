// See [https://github.com/invokeImmediately/commonreading.wsu.edu] for repository of source code
/**********************************************************************************************************************
 CUSTOM JQUERY-BASED DYNAMIC CONTENT
 *********************************************************************************************************************/
(function ($) {
	$(document).ready(function () {
        /**********************************************************************************************
         * Tweak HTML source to work around some quirks of WordPress setup                            *
         **********************************************************************************************/
        var crSiteURL = window.location.pathname;
		/* switch(fyeSiteURL) {
            case '/news/':
                $('div.column.one').first().parent('section').before('<section class="row single gutter pad-top"><div class="column one"><section class="article-header header-newsEvents"><div class="header-content"><h2>News</h2><h3>What We and Our Students Have Accomplished</h3></div></section></div></section>');
                break;
        } */
	});
})(jQuery);
/**************************************************************************************************\
| JQUERY-MEDIATED ENHANCED INTERACTIVITY OF GRAVITY FORM FIELDS                                    |
\**************************************************************************************************/
(function ($) {
    "use strict";
    
	$(document).ready(function () {
        if($("div.gform_body").length > 0) {
            //TODO: streamline functions by querying all ul.gform_fields li.gfield, then determine 
            //       how to handle object by finding div children with gfield_container_class.
			initWsuIdInputs(".gf-is-wsu-id");
            hghlghtRqrdInpts("li.gfield_contains_required input");
            hghlghtRqrdChckbxs(".oue-gf-rqrd-checkbox, .oue-gf-hghlghts-rqrd-checkbox");
            hghlghtRqrdTxtAreas(".oue-gf-rqrd-txtarea, .oue-gf-hghlghts-rqrd-txtarea");
            hghlghtRqrdSelects(".oue-gf-rqrd-select, .oue-gf-hghlghts-rqrd-select");
            setupActvtrChckbxs(".oue-gf-actvtr-checkbox");
            setupActvtrChain(".oue-gf-actvtr-chain");
            setupUploadChain(".oue-gf-upload-chain");
        }
    });
    
    /******************************************************************************************\
    | Highlight required INPUTS until a value has been properly entered                        |
    \******************************************************************************************/
    function hghlghtRqrdInpts (selector) {
        if ($.type(selector) === "string") {
            $(selector).each(function () {
                var $thisInput = $(this);
				if ($thisInput.val() == "") {
					$thisInput.removeClass("gf-value-entered");
				}
				else {
					$thisInput.addClass("gf-value-entered");
				}
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

    /******************************************************************************************\
    | Highlight required CHECKBOXES until at least one has been checked                        |
    \******************************************************************************************/
    function hghlghtRqrdChckbxs (selector) {
        if ($.type(selector) === "string") {
            $(selector).each(function () {
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

    /******************************************************************************************\
    | Highlight required TEXT AREA inputs until a value has been properly entered              |
    \******************************************************************************************/
    function hghlghtRqrdTxtAreas (selector) {
        if ($.type(selector) === "string") {
            $(selector).each(function () {
                var $this = $(this);
                var $inputs = $this.find("textarea");
                $inputs.each(function () {
                    var $thisChild = $(this);
                    if ($thisChild.val() == "") {
                        $thisChild.removeClass("gf-value-entered");
                    }
                    else {
                        $thisChild.addClass("gf-value-entered");
                    }
                    $thisChild.change(function () {
                        if ($thisChild.val() == "") {
                            $thisChild.removeClass("gf-value-entered");
                        }
                        else {
                            $thisChild.addClass("gf-value-entered");
                        }
                    });
                });
            });
        }
    }

    /******************************************************************************************\
    | Highlight required SELECTS until at least one has been checked                           |
    \******************************************************************************************/
    function hghlghtRqrdSelects (selector) {
        if ($.type(selector) === "string") {
            $(selector).each(function () {
                var $this = $(this);
                var $inputs = $this.find("select");
                $inputs.each(function () {
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
            });
        }
    }

    /******************************************************************************************\
    | Initialize RegEx filtration of inputs that accept WSU ID numbers                         |
    \******************************************************************************************/
    function initWsuIdInputs(slctrInputs) {
        var $wsuIdInputs = $(slctrInputs).find("input[type='text']");
        $wsuIdInputs.on("keyup paste", function () {
            var $this = $(this);
            var regExMask = /[^0-9]+/g;
            var inputText = $this.val();
            if (regExMask.exec(inputText) != null) {
                $this.val(inputText.replace(regExMask, ""));
                inputText = $this.val();
				alert("WSU ID numbers can only contain digts.");
            }
            if (inputText.length > 9) {
                $this.val(inputText.slice(0,9));
				alert("WSU ID numbers are no greater than nine (9) digits in length.");
            }
        });
        $wsuIdInputs.blur(function () {
            var $this = $(this);
            var regExFinalPttrn = /(?:^[0-9]{8}$)|(?:^0[0-9]{8}$)/;
            var inputText = $this.val();
			if (inputText != "") {
				if (regExFinalPttrn.exec(inputText) == null) {					
					$this.val("");
					alert("Please try again: when the leading zero is included, WSU ID numbers are nine (9) digits long. (You can also drop the leading zero and enter in eight (8) digits.");
				}
			}
        });
    }
	
    /******************************************************************************************\
    | Setup activator checkboxes that disappear once one is selected                           |
    \******************************************************************************************/
    function setupActvtrChckbxs (selector) {
        if ($.type(selector) === "string") {
            $(".gform_body").on("change", selector + " input", function () {
                var $thisChild = $(this);
                var $thisParent = $thisChild.parents(selector);
                $thisParent.addClass("gf-activated");
            });
        }
    }
    
    /******************************************************************************************\
    | Setup a chain of activator checkboxes, wherein once a checkbox is activated/deactivated, |
    | only its closest previous sibling is hidden/shown.                                       |
    \******************************************************************************************/
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

    /******************************************************************************************\
    | Setup a chain of file uploading inputs, wherein only the left-most input in the tree is  |
    | visible. As the user uploads files in sequence, the next nearest neighbor is unveiled.   |
    \******************************************************************************************/
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
