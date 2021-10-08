/*!*************************************************************************************************
 * ▄▀▀▀ █▀▀▄    ▄▀▀▀ █  █ ▄▀▀▀▐▀█▀▌▄▀▀▄ ▐▀▄▀▌      █ ▄▀▀▀
 * █    █▄▄▀ ▀▀ █    █  █ ▀▀▀█  █  █  █ █ ▀ ▌   ▄  █ ▀▀▀█
 *  ▀▀▀ ▀  ▀▄    ▀▀▀  ▀▀  ▀▀▀   █   ▀▀  █   ▀ ▀ ▀▄▄█ ▀▀▀
 *
 * Custom JS code written specifically for use on the Common Reading website and designed to be
 *   applied via the Custom JavaScript Editor in WSUWP.
 *
 * @version 1.0.0
 *
 * @author Daniel Rieck [daniel.rieck@wsu.edu] (https://github.com/invokeImmediately)
 * @link https://github.com/invokeImmediately/commonreading.wsu.edu/master/blob/JS/cr-custom.js
 * @license MIT — Copyright (c) 2021 Washington State University.
 *   Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 *     and associated documentation files (the “Software”), to deal in the Software without
 *     restriction, including without limitation the rights to use, copy, modify, merge, publish,
 *     distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
 *     Software is furnished to do so, subject to the following conditions:
 *   The above copyright notice and this permission notice shall be included in all copies or
 *     substantial portions of the Software.
 *   THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 *     BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *     NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 *     DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *     FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 **************************************************************************************************/

( function ( $ ) {

"use strict";

function addNewsHeaderViaClassUtilization( markup ) {
	var $body = $( 'body' ).first();
	if ( $body.hasClass( 'single-post' ) || ( $body.hasClass( 'archive' ) &&
			( $body.hasClass( 'category' ) ||  $body.hasClass( 'tag' ) ) ) ) {
		$body.find( '.column.one' ).first().parent( '.row' ).before( markup );
	}
}

function addNewsHeaderViaLocation( markup ) {
	var siteURL = window.location.pathname;
	if ( siteURL == '/news/' ) {
		$( '.column.one' ).first().parent( '.row' ).before( markup );
	}
}

function addPageHeaderOnNewsPages( params ) {
	addNewsHeaderViaLocation( params.markup );
	addNewsHeaderViaClassUtilization( params.markup );
}

function addPgHeaderOnCalendarPages( params ) {
	var $body = $( 'body' ).first();
	if ( $body.hasClass( params.bodyClass ) ) {
		$body.find( '.row.single' ).first().before( params.markup );
	}
}

function bindDragSafeClick( $obj, callback ) {
	if( $.isJQueryObj( $obj ) ) {
		$obj.mousedown( dragSafeMouseDown );
		$obj.mousemove( dragSafeMouseMove );
		$obj.mouseup( function () {
			dragSafeMouseUp( $obj, callback );
		} );
	}
}

function initCalendarItemExpansion( params ) {
	//TODO: implement keyboard activation
	var $calendars = $( params.slctrCalendars );
	if ( $calendars.length ) {
		$calendars.each( function () {
			var $thisCalendar = $( this );
			var $items = $thisCalendar.children( 'li' );
			$items.each( function () {
				var $thisItem = $( this );
				bindDragSafeClick( $thisItem, function() {
					toggleCalendarItemExpansion(
						$thisCalendar,
						$thisItem,
						params.expansionClass,
						params.expansionDelay
					);
				} );
			} );
		} );
	}
}

function dragSafeMouseDown( e ) {
	var $this = $(this);

	$this.data( 'wasDragging', 0 );
	$this.data( 'buttonClicked', e.button );
	$this.data( 'dragSafeClickStart', {
		clickX: e.pageX,
		clickY: e.pageY
	} );
}

function dragSafeMouseMove( e ) {
	var $this = $(this);
	var clickStart = $this.data( 'dragSafeClickStart' );
	if ( clickStart ) {
		var dx = Math.abs( clickStart.clickX - e.pageX );
		var dy = Math.abs( clickStart.clickY - e.pageY );
		if ( dx > 4 || dy > 4 ) {
			$this.data( 'wasDragging' , 1);
		}
	}
}

function dragSafeMouseUp( $this, clickCallback ) {
	if ( $.isJQueryObj( $this ) ) {
		var buttonClicked = $this.data( 'buttonClicked' );
		var wasDragging = $this.data( 'wasDragging' );
		if ( buttonClicked === 0 && !wasDragging ) {
			clickCallback();
		}
	}
}

function removeHiddenBlackKeyCluePosts( params ) {
	var $pages = $( params.slctrPageTypes );
	var $posts;

	if ( $pages.length > 0 ) {
		$posts = $pages.find( params.slctrBlackKeyPosts );
		$posts.remove();
	}
}

function shortenCalendarUrl( selector ) {
    let $url = jQuery( selector );
    if ( $url.length ) {
        let txt = $url.text();
        txt = txt.replace( 'https://', '' );
        txt = txt.replace( 'http://', '' );
        if ( txt.charAt( txt.length - 1 ) == '/' ) {
            txt = txt.substr( 0, txt.length - 1 );
        }
        if ( txt.length > 32 ) {
            txt = txt.substr( 0, 31 ) + "…";
        }
        $url.text( txt );
    }
}

function toggleCalendarItemExpansion( $calendar, $item, expansionClass, expansionDelay ) {
	$item.toggleClass( expansionClass );
	$calendar.masonry();
}

$( function () {
	addPgHeaderOnCalendarPages( {
		bodyClass: 'post-type-archive-tribe_events',
		markup:	'<section id="page-heading" class="row single article-header h--192px">\n' +
			'\t<div class="column one">\n' +
			'\t\t<div class="wrapper">\n' +
			'\t\t\t<ol class="breadcrumb-list">\n' +
			'\t\t\t\t<li class="breadcrumb-list__breadcrumb"><a class="breadcrumb-list__link"' +
			' href="/">Common Reading</a></li>\n' +
			'\t\t\t</ol>\n' +
			'\t\t\t<h1 class="tt--uppercase">Calendar</h1>\n' +
			'\t\t</div>\n' +
			'\t</div>\n' +
			'</section>'
	} );

	addPgHeaderOnCalendarPages( {
		bodyClass: 'single-tribe_events',
		markup:	'<section id="page-heading" class="row single article-header h--192px">\n' +
			'\t<div class="column one">\n' +
			'\t\t<div class="wrapper">\n' +
			'\t\t\t<ol class="breadcrumb-list">\n' +
			'\t\t\t\t<li class="breadcrumb-list__breadcrumb"><a class="breadcrumb-list__link"' +
			' href="/">Common Reading</a></li>\n' +
			'\t\t\t\t<li class="breadcrumb-list__breadcrumb"><a class="breadcrumb-list__link"' +
			' href="/calendar/">Calendar</a></li>\n' +
			'\t\t\t</ol>\n' +
			'\t\t\t<h1 class="tt--uppercase">Event Details</h1>\n' +
			'\t\t</div>\n' +
			'\t</div>\n' +
			'</section>'
	} );

	addPageHeaderOnNewsPages( {
		markup:	'<section id="news-section-header" class="row single article-header h--192px">\n' +
			'\t<div class="column one">\n' +
			'\t\t<div class="wrapper">\n' +
			'\t\t\t<ol class="breadcrumb-list">\n' +
			'\t\t\t\t<li class="breadcrumb-list__breadcrumb"><a class="breadcrumb-list__link"' +
			' href="/">Common Reading</a></li>\n' +
			'\t\t\t</ol>\n' +
			'\t\t\t<h1 class="tt--uppercase">News</h1>\n' +
			'\t\t</div>\n' +
			'\t</div>\n' +
			'</section>'
	} );

	initCalendarItemExpansion( {
		slctrCalendars: 'ul.cascaded-layout.calendar.thirds',
		expansionClass: 'double',
		expansionDelay: 3000
	} );

	removeHiddenBlackKeyCluePosts( {
		slctrPageTypes: '.blog, .archive.category',
		slctrBlackKeyPosts: '.post.category-black-key-clue'
	} );

    shortenCalendarUrl( '.single-tribe_events .tribe-events-event-url a' );
    shortenCalendarUrl( '.single-tribe_events .tribe-venue-url a' );
    shortenCalendarUrl( '.single-tribe_events .tribe-organizer-url a' );
} );

} )( jQuery );
