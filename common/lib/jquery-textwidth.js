var $ = require('jquery');

(function () {
	'use strict';

	function textWidth(text, font) {
	    if (!$.fn.textWidth.fakeEl) $.fn.textWidth.fakeEl = $('<span>').hide().appendTo(document.body);
	    var htmlText = text || this.val() || this.text();
	    htmlText = $.fn.textWidth.fakeEl.text(htmlText).html(); //encode to Html
	    htmlText = htmlText.replace(/\s/g, "&nbsp;"); //replace trailing and leading spaces
	    $.fn.textWidth.fakeEl.html(htmlText).css('font', font || this.css('font'));
	    return $.fn.textWidth.fakeEl.width();
	};

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = textWidth;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd){
		// AMD. Register as an anonymous module.
		define(function () {
			return textWidth;
		});
	} else {
		window.textWidth = textWidth;
	}

}());