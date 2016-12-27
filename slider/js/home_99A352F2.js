/* Homepage */

// Animation vars
var lightAnim = false;	// If animations should be minimal
var animTimeout = 2500;
var startOverlay = '155px';
var startFg = '30px';
var endOverlay = '185px';
var endFg = '0px';

$(function() {

	// Low end browsers receive light transitions
	if($.browser.msie && $.browser.version < 9) {
		lightAnim = true;
	}

	// Setup slideshow
	var slides = $('#slideshow .slide');
	var slideBgs = $('#slide-bgs');
	if(slides.length > 1) {
	
		// Normal slideshow with more than one slide
		slideBgs.maximage({
			fillElement: '#slideshow',
			backgroundSize: 'cover',
			overrideMSIEStop: true,
			cycleOptions: {
				fx: 'fade',
				speed: lightAnim ? 200 : 700,
				timeout: animTimeout,
				before: onCycleBefore,
				after: onCycleAfter,
				pause: true
			},
			onFirstImageLoaded: function() {
				if (lightAnim) {
					slideBgs.show();
				} else {
					slideBgs.fadeIn('fast');
				}
			}
		});
		
		// Initialize pagination
    	$('#dots').show();
    	$('#dots .dot').each(function(i){
    		$(this).click(function(){
    			slideBgs.cycle(i);
    		});
    	});
    		
    	// Pause and start triggers
    	$('div.slide, div.slide a').hover(function() {
    		slideBgs.cycle('pause');
    	},function() {
    		slideBgs.cycle('resume');
    	});
				
	} else {
		
		// Single slide
		slideBgs.maximage({
			fillElement: '#slideshow',
			backgroundSize: 'cover',
			overrideMSIEStop: true,
			cycleOptions: {
				fx: 'fade',
				speed: lightAnim ? 200 : 700,
				timeout: animTimeout,
				pause: false
			},
			onFirstImageLoaded: function() {
				slides.fadeIn(function() {
					if (lightAnim) {
						slideBgs.show();
						$('div.overlay', slides).css('top', endOverlay).show();
						$('div.foreground', slides).css('top', endFg).show();
					} else {
						slideBgs.fadeIn('fast');
						$('div.overlay', slides).animate({opacity: 'toggle', top: endOverlay}, 800, 'easeOutQuad');
						$('div.foreground', slides).animate({opacity: 'toggle', top: endFg}, 800, 'easeOutQuad');
					}
				});
			}
		});

	}
	
	// Search Events
	$('#search-box').focus(function(){
		clearTimeout(searchTimeOut);
		$(this).addClass('hover').animate({ width: '192px' }, 'fast');
	}).blur(function(){
		searchTimeOut = setTimeout(closeSearch,200);
	});
});

// Search
var searchTimeOut;
function closeSearch() {
	$('#search-box').removeClass('hover').animate({ width: '33px' }, 'fast');
}

// Before slide bg animates
function onCycleBefore(curr, next, opts) {
	// Fade out current slide overlays
	var slide = $('div.slide-' + opts.currSlide);
	var overlay = $('div.overlay', slide);
	var foreground = $('div.foreground', slide);
	
	slide.fadeOut(function() {
		// Reset internals
		overlay.hide();
		foreground.hide();
		if (!lightAnim) {
			overlay.css('top', startOverlay);
			foreground.css('top', startFg);
		}
	});
	
	// Progress active dot
	if(curr == next) {
		// Initial
		$($('#dots .dot')[opts.currSlide]).addClass('active');
	} else {
		// Normal
		$($('#dots .dot')[opts.currSlide]).removeClass('active');
		$($('#dots .dot')[opts.nextSlide]).addClass('active');
	}
}

// After slide bg animates
function onCycleAfter(curr, next, opts) {
	// Fade in current slide overlays
	var slide = $('div.slide-' + opts.currSlide);
	slide.fadeIn(function() {
		if (lightAnim) {
			$('div.overlay', slide).css('top', endOverlay).show();
			$('div.foreground', slide).css('top', endFg).show();
		} else {
			$('div.overlay', slide).animate({opacity: 'toggle', top: endOverlay}, 800, 'easeOutQuad');
			$('div.foreground', slide).animate({opacity: 'toggle', top: endFg}, 800, 'easeOutQuad');
		}
	});
}
