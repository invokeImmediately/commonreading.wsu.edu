/* NODE.JS - Build Production JavaScript File */
var concat = require('../../../../AppData/Roaming/npm/node_modules/concat-files');
concat([
 './cr-custom.js',
 '../WSU-UE---JS/jQuery.forms.js',
 '../WSU-UE---JS/jQuery.are-you-sure.js'
 ], './wp-custom-js-source.js', function() {
    console.log('Concatenation complete.');     
 });
 