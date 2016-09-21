/* NODE.JS - Build Production JavaScript File */
var concat = require('../../../../AppData/Roaming/npm/node_modules/concat-files');
concat([
 './cr-custom.js',
 '../WSU-UE---JS/jQuery.forms.js'
 ], './wp-custom-js-source.js', function() {
    console.log('Concatenation complete.');     
 });
 