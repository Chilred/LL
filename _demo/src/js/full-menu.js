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


App.NavigationManager.buildMainNavigation = (function() {
	var cached_function = App.NavigationManager.buildMainNavigation;

	return function() {
		cached_function.apply(this, arguments);

			var listElements = $(".mainNavigation ul.nav").find('li.dropdown');
		
			listElements.each(function(index){
				var _t = $(this);
				
				_t.attr('data-target', _t.find('ul.dropdown-menu').find('li').first().data('target'));
				_t.children('a').find('.caret').remove();
				_t.children('a').attr('data-target', _t.find('ul.dropdown-menu').find('li').first().data('target'));
				_t.children('a').attr('href', '#' + _t.find('ul.dropdown-menu').find('li').first().data('target'));
				_t.find('ul.dropdown-menu').find('li').first().hide();
				
				_t.children('a').click(function(e){
						_t.find('ul.dropdown-menu').hide();
						var t = $(this);

						var parentLI = t.parent("li");
						// if the LI is disabled, stop here
						if(parentLI.hasClass("disabled")){
							e.preventDefault();
							return;
						}
						// call the SectionManagers showArticle method
						App.SectionManager.showArticle(t.attr("data-target"));

				});
			});
		
		/*$(".mainNavigation ul.nav").find('li.dropdown').removeClass('dropdown');
		
		$(".mainNavigation ul.nav").append('<li class="rebuildMainNav easyNav"><a data-link-src="#easyStart">Easy</a></li>');
		$(".mainNavigation ul.nav").append('<li class="rebuildMainNav mediumNav"><a data-link-src="#mediumStart">Medium</a></li>');
		$(".mainNavigation ul.nav").append('<li class="rebuildMainNav hardNav"><a data-link-src="#hardStart">Hard</a></li>'); */
	};
}());