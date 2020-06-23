// See [https://github.com/invokeImmediately/commonreading.wsu.edu] for repository of source code
/**********************************************************************************************************************
 CUSTOM JQUERY-BASED DYNAMIC CONTENT
 *********************************************************************************************************************/
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

function toggleCalendarItemExpansion( $calendar, $item, expansionClass, expansionDelay ) {
	$item.toggleClass( expansionClass );
	$calendar.masonry();
}

$( function () {
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
} );

} )( jQuery );
