/** 
 * fontShrinkToFit
 *
 * 2012 Micah J. Murray
 * micahj.com
 *
 * https://github.com/micah1701/fontShrinkToFit/
 * v1.1
 *
 * Usage:
 * set css font-size to max desired size for ideal amount of text in defined area 
 * then call like this:
 * 		$("#element").fontShrinkToFit({ optional:'settings' });
 *
 */
$.fn.fontShrinkToFit = function(settings) {

	var settings = $.extend( {
		'maxHeight'		: null,	// eg "400" pixels.  if using this setting, be sure to set 'maxLines' to null or a value higher than 1.
		'maxLines' 		: 1,	// maximum number of lines to wrap text on to.  set to null to ignore this directive
		'fontSizeType'	: 'px', // 'px', 'em', 'pt'
		'shrinkBy'		: 1, 	// units to incrementally reduce font size by.  eg "1" pixel or ".1" em
		'minFontSize'	: 10,	// eg "10" pixels or "0.5" em -- the function will stop reducing the font once it gets to this size
		'maxAttempts'	: 50	// number of incremental attempts to reduce the size before stopping
    }, settings);

    return this.each(function() {  
		var block = $(this),
			lineHeight = false,
			f = function(attempt){
			
			var blockText = block.html(),
				currentFont = parseInt( block.css("font-size")),
				currentHeight = block.height();
			
			if(settings['maxLines'] != null && !lineHeight){ 
				lineHeight = block.html("X").height(); // calculate the height of a single line
				block.html(blockText);
			}
			
			if( (
				  ( settings['maxLines']  != null && currentHeight > parseInt( lineHeight * settings['maxLines'] ) ) ||
				  ( settings['maxHeight'] != null && currentHeight > settings['maxHeight'] ) 
				)	
				&&
				(		
				  settings['minFontSize'] != null && currentFont > settings['minFontSize'] &&
				  attempt < settings['maxAttempts'] 
			  	)
			  )
			{
				var newfontsize = parseInt(currentFont - settings['shrinkBy']) + settings['fontSizeType'];
				block.css("font-size",newfontsize);
				f(attempt+1);
			}
		};
		f(0);  
	});
};