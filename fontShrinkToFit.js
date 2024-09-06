/** 
 * fontShrinkToFit
 *
 * 2013-2024 Micah J. Murray
 * creativeAdhocSolutions.com
 *
 * https://github.com/micah1701/fontShrinkToFit/
 * v2.0.0
 *
 * Usage:
 * set css font-size to max desired size for ideal amount of text in defined area 
 * then:
 * const elements = Array.from(document.querySelectorAll('.your-selector'));
 * fontShrinkToFit(elements, {
 *     maxHeight: 400,
 *     maxLines: 2,
 *     fontSizeType: 'px',
 *     lineHeight: 1.2,
 *     shrinkBy: 1,
 *     minFontSize: 10,
 *     maxAttempts: 50,
 *     allToSmallest: false,
 *     callback: (element) => { console.log(`Shrunk: ${element}`); },
 *     finished: () => { console.log("Finished shrinking all elements"); }
 * }); 
 *
 */

function fontShrinkToFit(elements, options = {}) {
    const settings = Object.assign({
        maxHeight: null,  // eg "400" pixels. If using this setting, be sure to set 'maxLines' to null or a value higher than 1.
        maxLines: 1,  // Maximum number of lines to wrap text on to. Set to null to ignore this directive
        fontSizeType: 'px',  // 'px', 'em', 'pt'
        lineHeight: 1.2,  // Calculate line height between multiple lines. This is a percentage of the new font size. Default is 120%
        shrinkBy: 1,  // Units to incrementally reduce font size by. eg "1" pixel or ".1" em
        minFontSize: 10,  // eg "10" pixels or "0.5" em. The function will stop reducing the font once it gets to this size
        maxAttempts: 50,  // Number of incremental attempts to reduce the size before stopping
        allToSmallest: false,  // If being applied to multiple elements, shrink all elements to match the smallest one
        callback: () => true,  // Custom function that triggers when fontShrinkToFit() is finished with each element
        finished: () => true  // Custom function that triggers when fontShrinkToFit() has finished running
    }, options);

    let smallestFont = 99999;

    elements.forEach(el => {
        let block = el;
        let blockHeight = false;

        const shrinkText = (attempt) => {
            let blockText = block.innerHTML;
            let currentFont = parseInt(window.getComputedStyle(block).fontSize);
            let currentHeight = block.offsetHeight;

            if (settings.maxLines !== null && blockHeight === false) {
                block.innerHTML = "X";  // Calculate the height of a single line
                blockHeight = block.offsetHeight;
                block.innerHTML = blockText;
            }

            if (
                (
                    (settings.maxLines !== null && currentHeight > parseInt(blockHeight * settings.maxLines)) ||
                    (settings.maxHeight !== null && currentHeight > settings.maxHeight)
                ) &&
                (settings.minFontSize !== null && currentFont > settings.minFontSize && attempt < settings.maxAttempts)
            ) {
                let newFontSize = currentFont - settings.shrinkBy;
                let newLineHeight = Math.floor(newFontSize * settings.lineHeight) + settings.fontSizeType;
                newFontSize += settings.fontSizeType;

                block.style.fontSize = newFontSize;
                block.style.lineHeight = newLineHeight;

                shrinkText(attempt + 1);
            } else {
                if (currentFont < smallestFont) {
                    smallestFont = currentFont;
                }
                settings.callback(block);
            }
        };
        shrinkText(0);
    });

    if (settings.allToSmallest) {
        elements.forEach(el => {
            el.style.fontSize = smallestFont + settings.fontSizeType;
        });
    }

    settings.finished();
}
