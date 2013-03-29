/** 
 * fontShrinkToFit
 *
 * 2013 Micah J. Murray
 * micahj.com
 *
 * https://github.com/micah1701/fontShrinkToFit/
 * v1.2
 *
 * Usage:
 * set css font-size to max desired size for ideal amount of text in defined area 
 * then call like this:
 * 		$("#element").fontShrinkToFit({ optional:'settings' });
 *
 */
$.fn.fontShrinkToFit = function(settings) {

	var settings = $.extend( {
		'maxHeight'	: null,	 // eg "400" pixels.  if using this setting, be sure to set 'maxLines' to null or a value higher than 1.
		'maxLines'	: 1,	 // maximum number of lines to wrap text on to.  set to null to ignore this directive
		'fontSizeType'	: 'px',	 // 'px', 'em', 'pt'
		'lineHeight'	: 1.2,	 // calculate line height between multiple lines. This is a percentage of the new font size. default is 120%
		'shrinkBy'	: 1,	 // units to incrementally reduce font size by.  eg "1" pixel or ".1" em
		'minFontSize'	: 10,	 // eg "10" pixels or "0.5" em -- the function will stop reducing the font once it gets to this size
		'maxAttempts'	: 50,	 // number of incremental attempts to reduce the size before stopping
		'allToSmallest'	: false,  // if being applied to multiple elements, shrink all elements to match the smallest one
		'callback'	: function(){ return true; }, // custom function that triggers when fontShrinkToFit() is finished with each element
		'finished'	: function(){ return true; }  // custom function that triggers when fontShrinkToFit() has finished running
    }, settings);

    var smallestFont = 99999,
		shrink = this.each(function() {  
		var block = $(this),
			blockHeight = false,
			f = function(attempt){		
				var blockText = block.html(),
					currentFont = parseInt( block.css("font-size")),
					currentHeight = block.height();
				
				if(settings['maxLines'] != null && blockHeight === false){ 
					blockHeight = block.html("X").height(); // calculate the height of a single line
					block.html(blockText);
				}
				
				if( (
					  ( settings['maxLines']  != null && currentHeight > parseInt( blockHeight * settings['maxLines'] ) ) ||
					  ( settings['maxHeight'] != null && currentHeight > settings['maxHeight'] ) 
					)	
					&&
					(		
					  settings['minFontSize'] != null && currentFont > settings['minFontSize'] &&
					  attempt < settings['maxAttempts'] 
					)
				  )
				{
					var newfontsize = parseInt(currentFont - settings['shrinkBy']); 
					var newlineheight = Math.floor(newfontsize * settings['lineHeight']) + settings['fontSizeType'];
					newfontsize += settings['fontSizeType'];
					block.css({"font-size":newfontsize,"line-height":newlineheight});
					
					f(attempt+1);
				
				}else{
					
					if( currentFont < smallestFont)
					{
						smallestFont = currentFont;
					}
					
					var callback = settings['callback'];
					callback(block);
				}				
			};
		f(0); 				 
	});
	
	if(shrink)
	{
		if(settings['allToSmallest'])
		{
			this.each(function() {
				$(this).css({"font-size":smallestFont});		
			});
		}
		
		var finished = settings['finished'];
		finished();
	}
};
