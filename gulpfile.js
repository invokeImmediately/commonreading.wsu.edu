'use strict';

/* -------------------------------------------------------------------------------------------------
** Variable Declarations
*/

// Gulp task dependencies
var cleanCss = require( 'gulp-clean-css' );
var concat = require( 'gulp-concat' );
var extName = require( 'gulp-extname' );
var gcmq = require( 'gulp-group-css-media-queries' );
var gulp = require( 'gulp' );
var insert = require( 'gulp-insert' );
var insertLines = require( 'gulp-insert-lines' );
var lessc = require( 'gulp-less' );
var replace = require( 'gulp-replace' );
var uglifyJs = require( 'gulp-uglify' );
var pump = require( 'pump' );

/* -------------------------------------------------------------------------------------------------
** Function declarations
*/
function getCssBuildSettings() {
	return {
		commentRemovalNeedle: /^(?:[ \t]*)?\/\*[^!].*$\n(?:^\*\*?[^/].*$\n)*\*\*?\/\n\n?/gm,
		dependenciesPath: './WSU-UE---CSS/',
		destFolder: './CSS/',
		fontImportStr: '@import url(\'https://fonts.googleapis.com/css?family=Roboto+Mono:300|Robot\
o+Condensed:400,700|Roboto+Slab|PT+Serif|Share+Tech+Mono|Kanit:300,400,600|Spinnaker:400,700\');\r\n',
		insertingMediaQuerySectionHeader: {
			'before': /^@media/,
			'lineBefore': '/*! ====================================================================\
============================\r\n*** Media queries section\r\n*** ==================================\
==============================================================\r\n***   SUMMARY: Media queries buil\
t from precompiled CSS written in the Less language extension of\r\n***    CSS. Queries in this sec\
tion are a combination of those designed for use on DAESA websites***\r\n    and those intended spe\
cifically for use on the Common Reading program website.\r\n***\r\n***   DESCRIPTION: Fully documen\
ted, precompiled source code from which this section of the custom\r\n***    stylesheet was built i\
s developed and maintained on the following two GitHub projects:\r\n***    https://github.com/invok\
eImmediately/WSU-UE---CSS/\r\n***    https://github.com/invokeImmediately/commonreading.wsu.edu/\r\
\n***   AUTHOR: Daniel Rieck [daniel.rieck@wsu.edu] (https://github.com/invokeImmediately)\r\n***\r\
\n***   LICENSE: ISC - Copyright (c) 2019 Daniel C. Rieck.\r\n***\r\n***     Permission to use, cop\
y, modify, and/or distribute this software for any purpose with or\r\n***     without fee is hereby\
 granted, provided that the above copyright notice and this permission\r\n***     notice appear in \
all copies.\r\n***\r\n***     THE SOFTWARE IS PROVIDED "AS IS" AND DANIEL RIECK DISCLAIMS ALL WARRA\
NTIES WITH REGARD TO\r\n***     THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY A\
ND FITNESS. IN NO EVENT\r\n***     SHALL DANIEL RIECK BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, \
OR CONSEQUENTIAL DAMAGES OR\r\n***     ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR P\
ROFITS, WHETHER IN AN ACTION OF\r\n***     CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING O\
UT OF OR IN CONNECTION WITH THE USE\r\n***     OR PERFORMANCE OF THIS SOFTWARE.\r\n*** ============\
====================================================================================\r\n**/',
			'stopAfterFirstMatch': true
		},
		minCssFileExtension: '.min.css',
		minCssFileHeaderStr: '',
		sourceFile: './CSS/cr-custom.less'
	};
}

function getJsBuildSettings() {
	return {
		buildDependenciesList: [
			'./WSU-UE---JS/jQuery.oue-custom.js',
			'./WSU-UE---JS/jQuery.cookieObjs.js',
			'./WSU-UE---JS/jQuery.forms.js',
			'../jQuery.AreYouSure/jquery.are-you-sure.js',
			'./WSU-UE---JS/jQuery.are-you-sure.js',
			'../qTip2/dist/jquery.qtip.min.js',
			'./WSU-UE---JS/jQuery.qTip.js',
			'./WSU-UE---JS/jQuery.textResize.js',
			'./WSU-UE---JS/jQuery.masonry-custom.js',
			// '../jQuery.countdown/dist/jquery.countdown.min.js',
			// './WSU-UE---JS/jQuery.countdown-custom.js',
			'./JS/cr-custom.js'
		],
		commentNeedle: /^(\/\*)(?!!)/g,
		compiledJsFileName: 'cr-build.js',
		destFolder: './JS/',
		minJsFileExtension: '.min.js',
		replaceCallback: fixFileHeaderComments
	};
}

function fixFileHeaderComments ( match, p1, offset, string ) {
	var replacementStr = match;
	if ( offset == 0 ) {
		replacementStr = '/*!';
	}
	return replacementStr;
}

function setUpCssBuildTask( settings ) {
	gulp.task( 'buildMinCss', function ( callBack ) {
		pump( [
				gulp.src( settings.sourceFile ),
				lessc( {
					paths: [settings.dependenciesPath]
				} ),
				replace( settings.commentRemovalNeedle, '' ),
				insert.prepend( settings.fontImportStr ),
				insert.prepend( settings.minCssFileHeaderStr ),
				gulp.dest( settings.destFolder ),
				gcmq(),
				insertLines( settings.insertingMediaQuerySectionHeader ),
				cleanCss(),
				extName( settings.minCssFileExtension ),
				gulp.dest( settings.destFolder )
			],
			callBack
		);
	} );
}

function setUpJsBuildTask( settings ) {
	gulp.task( 'buildMinJs', function ( callBack ) {
		pump( [
				gulp.src( settings.buildDependenciesList ),
				replace( settings.commentNeedle, settings.replaceCallback ),
				concat( settings.compiledJsFileName ),
				gulp.dest( settings.destFolder ),
				uglifyJs( {
					output: {
						comments: /^!/
					},
					toplevel: true,
				} ),
				extName( settings.minJsFileExtension ),
				gulp.dest( settings.destFolder )
			],
			callBack
		);
	} );
}

/* -------------------------------------------------------------------------------------------------
** Main execution sequence
*/

setUpCssBuildTask( getCssBuildSettings() );
setUpJsBuildTask( getJsBuildSettings() );
