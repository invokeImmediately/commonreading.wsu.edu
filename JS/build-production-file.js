/* NODE.JS - Build Production JavaScript File */
var concat = require('../../../../AppData/Roaming/npm/node_modules/concat-files');
concat([
 '../WSU-UE---JS/jQuery.oue-custom.js',
 '../WSU-UE---JS/jQuery.forms.js',
 '../WSU-UE---JS/jQuery.are-you-sure.js',
 '../WSU-UE---JS/jQuery.masonry.min.js',
 './cr-custom.js'
 ], './wp-custom-js-source.js', function() {
    console.log('Concatenation complete.');     
 });
