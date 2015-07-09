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
 
 var defaultValues, animationSpeedIn, animationTypeIn, animationSpeedOut, animationTypeOut;
 
// Expands the App.SectionManager.showArticle() function from framework.js
// Adds custom animation for displaying an article
App.SectionManager.showArticle = (function() {
	var cached_function = App.SectionManager.showArticle;

	return function() {
		defaultValues = {'animation-type-in': 'show', 'animation-speed-in': '0', 'animation-type-out': 'hide', 'animation-speed-out': '0' };
		
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
			
			// Rebuild main navigation
			$(".mainNavigation ul.dropdown-menu").find('li').parent().removeClass('activeDropdown');
			$(".activeDropdownHeading").removeClass('activeDropdownHeading');
			
			var activeElement = $(".mainNavigation ul.dropdown-menu").find('li[data-target="' + article.id + '"]');
			
			activeElement.parent().addClass('activeDropdown');
			activeElement.parent().prev().addClass('activeDropdownHeading');
			
			// Animation stuff
			animationSpeedIn = Number.parseInt(getAnimationData(article, 'animation-speed-in'));
			animationTypeIn = getAnimationData(article, 'animation-type-in');
			var elem;
			if(article.selector.hasClass('hide-subNavigation')) {
				$(".sidebar-nav").parent().hide();
				$(".sidebar-nav").parent().next().removeAttr('class');
				$(".sidebar-nav").parent().next().addClass('col-md-12 col-xs-12');
				elem = article.selector.parent().parent().parent();
			} else {
				elem = article.selector;
			}
			
			elem.hide();
			
			// add custom animation
			switch(animationTypeIn) {
				case "fadeIn":
					elem.fadeIn(animationSpeedIn);
					break;
				case "show":
					elem.show(animationSpeedIn);
					break;
			}
		}
	
		if(App.SectionManager.firstRun) {
			// call original function on first run
			cached_function.apply(this, arguments);
			// pause videos on new article
			$("video").each(function(){
				$(this).get(0).pause();
			});
			
			if(App.SectionManager.articles[arguments[0]].selector.hasClass('hide-subNavigation')) {
				$(".sidebar-nav").parent().hide();
				$(".sidebar-nav").parent().next().removeAttr('class');
				$(".sidebar-nav").parent().next().addClass('col-md-12 col-xs-12');
			}
		} else {
			// pause videos on new article
			$("video").each(function(){
				$(this).get(0).pause();
			});
		
			// get current article that is supposed to be faded out
			var currentArticle = App.SectionManager.articles[App.SectionManager.currentArticle];
			
			animationSpeedOut = Number.parseInt(getAnimationData(currentArticle, 'animation-speed-out'));
			animationTypeOut = getAnimationData(currentArticle, 'animation-type-out');
			
			// save "this" object and arguments array for anonymous function in the fading out process
			var _t = this;
			var arg = arguments;
			var elem;
			if(App.SectionManager.articles[arg[0]].selector.hasClass('hide-subNavigation')) {
				elem = currentArticle.selector.parent().parent().parent();
			} else {
				elem = currentArticle.selector;
			}
			
			
			
			// add custom animation
			switch(animationTypeOut) {
				case "fadeOut":
					// when fading animation is done, execute original showArticle() function, afterwards fade in the new article via custom animation
					elem.fadeOut(animationSpeedOut, function() {
						cached_function.apply(_t, arg);
						if($(".sidebar-nav").parent().css('display') == 'none') {
							$(".sidebar-nav").parent().next().removeAttr('class');
							$(".sidebar-nav").parent().next().addClass('col-md-10 col-xs-10');
							$(".sidebar-nav").parent().show();
						}
						fadeInArticle();
					  });
					break;
				case "hide":
					elem.hide(animationSpeedOut, function() {
						cached_function.apply(_t, arg);
						if($(".sidebar-nav").parent().css('display') == 'none') {
							$(".sidebar-nav").parent().next().removeAttr('class');
							$(".sidebar-nav").parent().next().addClass('col-md-10 col-xs-10');
							$(".sidebar-nav").parent().show();
						}
						fadeInArticle();
					  });
					break;
			}
		}
	};
}());