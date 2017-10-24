// See [https://github.com/invokeImmediately/commonreading.wsu.edu] for repository of source code
/**********************************************************************************************************************
 CUSTOM JQUERY-BASED DYNAMIC CONTENT
 *********************************************************************************************************************/
"use strict";

( function ( $ ) {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DOM LOADED:
// Call functions to be executed once the DOM is loaded.

$( function () {
	var params = new Object();
	var theseParams;

	// Setup parameters for function calls.
	params.initCalendarItemExpansion = {
		slctrCalendars: 'ul.cascaded-layout.calendar.thirds',
		expansionClass: 'double',
		expansionDelay: 3000
	};

	params.removeHiddenBlackKeyCluePosts = {
		slctrPageTypes: '.blog, .archive.category',
		slctrBlackKeyPosts: '.post.category-black-key-clue'
	}

	// Make function calls
	theseParams = params.initCalendarItemExpansion;
	initCalendarItemExpansion(
		theseParams.slctrCalendars,
		theseParams.expansionClass
	);

	theseParams = params.removeHiddenBlackKeyCluePosts;
	removeHiddenBlackKeyCluePosts(
		theseParams.slctrPageTypes,
		theseParams.slctrBlackKeyPosts
	);
} );

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FUNCTION DECLARATIONS

function initCalendarItemExpansion( slctrCalendars, expansionClass, expansionDelay ) {

	//TODO: implement keyboard activation
	var $calendars = $( slctrCalendars );
	if ( $calendars.length ) {
		$calendars.each( function () {
			var $thisCalendar = $( this );
			var $items = $thisCalendar.children( 'li' );
			$items.each( function () {
				var $thisItem = $( this );
				bindDragSafeClick( $thisItem, function() {
					toggleCalendarItemExpansion( $thisCalendar, $thisItem, expansionClass, expansionDelay );
				} );
			} );
		} );
	}
}

function toggleCalendarItemExpansion( $calendar, $item, expansionClass, expansionDelay ) {
	$item.toggleClass( expansionClass );
	$calendar.masonry();
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

function removeHiddenBlackKeyCluePosts( slctrPageTypes, slctrBlackKeyPosts) {
	var $pages = $( slctrPageTypes );
	var $posts;

	if ( $pages.length > 0 ) {
		$posts = $pages.find( slctrBlackKeyPosts );
		$posts.remove();
	}
}

} )( jQuery );
