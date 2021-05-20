/*!*************************************************************************************************
 * █▀▀▀ █  █ █    █▀▀▄ █▀▀▀ ▀█▀ █    █▀▀▀      █ ▄▀▀▀
 * █ ▀▄ █  █ █  ▄ █▄▄▀ █▀▀▀  █  █  ▄ █▀▀    ▄  █ ▀▀▀█
 * ▀▀▀▀  ▀▀  ▀▀▀  █    ▀    ▀▀▀ ▀▀▀  ▀▀▀▀ ▀ ▀▄▄█ ▀▀▀ 
 *
 * Gulp automation task definition file for setting up tasks that build source files containing
 *   custom CSS and JS code for designed for application to WSUWP website of the WSU Common Reading
 *   program.
 *
 * @version 1.0.0
 *
 * @link https://github.com/invokeImmediately/commonreading.wsu.edu/blob/master/gulpfile.js
 * @author Daniel Rieck [daniel.rieck@wsu.edu] (https://github.com/invokeImmediately)
 * @license MIT - Copyright (c) 2021 Washington State University
 *   Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 *     and associated documentation files (the “Software”), to deal in the Software without
 *     restriction, including without limitation the rights to use, copy, modify, merge, publish,
 *     distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom
 *     the Software is furnished to do so, subject to the following conditions:
 *   The above copyright notice and this permission notice shall be included in all copies or
 *     substantial portions of the Software.
 *   THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 *     BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *     NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 *     DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *     FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 **************************************************************************************************/

////////////////////////////////////////////////////////////////////////////////////////////////////
// TABLE OF CONTENTS
// -----------------
// §1: Gulp task dependencies..................................................................44
// §2: Specificiation of build settings .......................................................49
//   §2.1: getCssBuildSettings()...............................................................52
//   §2.2: getJsBuildSettings()...............................................................113
// §3: Entry point: Set up of build taks......................................................145
////////////////////////////////////////////////////////////////////////////////////////////////////

( function() {

'use strict';

////////////////////////////////////////////////////////////////////////////////////////////////////
// §1: Gulp task dependencies

var gulpBuilder = require( './WSU-UE---JS/gulpBuilder.js' );

////////////////////////////////////////////////////////////////////////////////////////////////////
// §2: Specificiation of build settings 

////////
// §2.1: getCssBuildSettings()

/**
 * Get the settings for a gulp-mediated custom CSS build from Less source files.
 *
 * @return {object} - Instance of gulpBuilder.CssBuildSettings.
 */
function getCssBuildSettings() {
	var commentRemovalNeedle = /^(?:[ \t]*)?\/\*[^!].*$\n(?:^\*\*?[^/].*$\n)*\*\*?\/\n\n?/gm;
	var dependenciesPath = './WSU-UE---CSS/';
	var destFolder = './CSS/';
	var fontImportStr = '@import url(\'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wg' +
		'ht@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&family=PT+Serif:ital,wght@0,400;0,700' +
		';1,400;1,700&family=Roboto+Condensed:ital,wght@0,400;0,700;1,400;1,700&family=Roboto+Mon' +
		'o:ital,wght@0,400;0,700;1,400;1,700&display=swap\');\r\n';
	var insertingMediaQuerySectionHeader = {
			'before': /^@media/,
			'lineBefore': '/*! ==================================================================' +
				'==============================\r\n*** Media queries section\r\n*** =============' +
				'================================================================================' +
				'===\r\n***   SUMMARY: Media queries built from precompiled CSS written in the Le' +
				'ss language extension of\r\n***    CSS. Queries in this section are a combinatio' +
				'n of those designed for use on DAESA websites***\r\n    and those intended speci' +
				'fically for use on the Common Reading program website.\r\n***\r\n***   DESCRIPTI' +
				'ON: Fully documented, precompiled source code from which this section of the cus' +
				'tom\r\n***    stylesheet was built is developed and maintained on the following ' +
				'two GitHub projects:\r\n***    https://github.com/invokeImmediately/WSU-UE---CSS' +
				'/\r\n***    https://github.com/invokeImmediately/commonreading.wsu.edu/\r\n***  ' +
				' AUTHOR: Daniel Rieck [daniel.rieck@wsu.edu] (https://github.com/invokeImmediate' +
				'ly)\r\n***\r\n***   LICENSE: ISC - Copyright (c) 2020 Daniel C. Rieck.\r\n***\r' +
				'\n***     Permission to use, copy, modify, and/or distribute this software for a' +
				'ny purpose with or\r\n***     without fee is hereby granted, provided that the a' +
				'bove copyright notice and this permission\r\n***     notice appear in all copies' +
				'.\r\n***\r\n***     THE SOFTWARE IS PROVIDED "AS IS" AND DANIEL C. RIECK DISCLAI' +
				'MS ALL WARRANTIES WITH REGARD TO\r\n***     THIS SOFTWARE INCLUDING ALL IMPLIED ' +
				'WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT\r\n***     SHALL DANIEL C' +
				'. RIECK BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR' +
				'\r\n***     ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, ' +
				'WHETHER IN AN ACTION OF\r\n***     CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION' +
				', ARISING OUT OF OR IN CONNECTION WITH THE USE\r\n***     OR PERFORMANCE OF THIS' +
				' SOFTWARE.\r\n*** ==============================================================' +
				'==================================\r\n**/',
			'stopAfterFirstMatch': true
		};
	var minCssFileExtension = '.min.css';
	var minCssFileHeaderStr = '';
	var sourceFile = './CSS/cr-custom.less';

	return new gulpBuilder.CssBuildSettings(
		commentRemovalNeedle,
		dependenciesPath,
		destFolder,
		fontImportStr,
		insertingMediaQuerySectionHeader,
		minCssFileExtension,
		minCssFileHeaderStr,
		sourceFile
	);
}

////////
// §2.2: getJsBuildSettings()

/**
 * Get the settings for a gulp-mediated custom JS build.
 *
 * @return {object} - Simple collection of settings for JS builds.
 */
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
		replaceCallback: gulpBuilder.fixFileHeaderComments
	};
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// §3: Entry point: Set up of build taks

gulpBuilder.setUpCssBuildTask( getCssBuildSettings() );
gulpBuilder.setUpJsBuildTask( getJsBuildSettings() );

} )();
