/**
 * ADD-ON - Custom Article Animation
 *
 * DESCRIPTION:
 * Adds a custom fading animation when a new article is shown. An animation can be defined either for the whole website, a whole section or every single article.
 * You can choose between "show" or "fadeIn" for displaying the new article and "hide" or "fadeOut" for making the old article disappear. The speed is in milliseconds. 
 * The default types are "show" and "hide" and the default speed is 0, so the next article is shown immediately without animation.
 *
 * MARKUP
 *
 * <body data-animation-type-in="fadeIn" data-animation-speed-in="300" data-animation-type-out="fadeOut" data-animation-speed-out="300"> <!-- body-tag: Adds an animation for the whole website -->
 * <section data-animation-type-in="fadeIn" data-animation-speed-in="300" data-animation-type-out="fadeOut" data-animation-speed-out="300"> <!-- section-tag: Adds an animation for all articles in this section. Overwrites the body animation. -->
 * <article data-animation-type-in="fadeIn" data-animation-speed-in="300" data-animation-type-out="fadeOut" data-animation-speed-out="300"> <!-- article-tag: Adds an animation for a single article. Overwrites the body animation and the section animation. -->
 *
 */
 
// Expands the App.SectionManager.showArticle() function from framework.js
// Adds custom animation for displaying an article
App.SectionManager.showArticle = (function() {
	var cached_function = App.SectionManager.showArticle;

	return function() {
		var defaultValues = {'animation-type-in': 'show', 'animation-speed-in': '0', 'animation-type-out': 'hide', 'animation-speed-out': '0' };
		
		// read data attributes to choose a animation type and speef
		var getAnimationData = function(art, datatype) {
			var result;
			if(art.selector.data(datatype)) {
				result = art.selector.data(datatype);
			} else if(art.selector.closest('section').data(datatype)) {
				result = art.selector.closest('section').data(datatype);
			} else if($('body').data(datatype)) {
				result = $('body').data(datatype);
			} else {
				result = defaultValues[datatype];
			}

			return result;
		}
		
		var fadeInArticle = function() {
			// get article that is supposed to be shown
			var article = App.SectionManager.articles[arg[0]];
			
			// hide it immediately so custom animation can take effect
			article.selector.hide();
			
			var animationSpeed = Number.parseInt(getAnimationData(article, 'animation-speed-in'));
			var animationType = getAnimationData(article, 'animation-type-in');
			
			// add custom animation
			switch(animationType) {
				case "fadeIn":
					article.selector.fadeIn(animationSpeed);
					break;
				case "show":
					article.selector.show(animationSpeed);
					break;
			}
		}
	
		if(App.SectionManager.firstRun) {
			// call original function on first run
			cached_function.apply(this, arguments);
		} else {
			// get current article that is supposed to be faded out
			var currentArticle = App.SectionManager.articles[App.SectionManager.currentArticle];
			
			var animationSpeed = Number.parseInt(getAnimationData(currentArticle, 'animation-speed-out'));
			var animationType = getAnimationData(currentArticle, 'animation-type-out');
			
			// save "this" object and arguments array for anonymous function in the fading out process
			var _t = this;
			var arg = arguments;
			
			// add custom animation
			switch(animationType) {
				case "fadeOut":
					// when fading animation is done, execute original showArticle() function, afterwards fade in the new article via custom animation
					currentArticle.selector.fadeOut(animationSpeed, function() {
						cached_function.apply(_t, arg);
						fadeInArticle();
					  });
					break;
				case "hide":
					currentArticle.selector.hide(animationSpeed, function() {
						cached_function.apply(_t, arg);
						fadeInArticle();
					  });
					break;
			}
		}
	};
}());