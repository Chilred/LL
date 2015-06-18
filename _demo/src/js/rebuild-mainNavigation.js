/**
 * EVENT - Remove Menu Entries
 *
 * DESCRIPTION:
 * Removes articles from the main navigation and/or the subnavigation to avoid duplicate entries 
 * For example, without this addon all articles that you place in the extra menu will also be visible in the main and subnavigation. With the help
 * of this addon you can hide those articles in the main and sub navigation so they are only shown at the extra navigation. Or, if you want to split
 * content into multiple articles but only want one "main" navigation point you just hide all but the first article.
 *
 * MARKUP
 *
 * <article class="no-mainNavigation no-subNavigation">
	<!-- Just add the class "no-mainNavigation" to the article and it won't appear in the main navigation, 
		the same goes for "no-subNavigation", so the article won't appear in the subnavigation -->
   </article>
   
   OR
   
   <section class="no-mainNavigation no-subNavigation">
	<!-- All articles from this section won't appear in the main and/or subnavigation and the "heading" of the navigation entries gets removed -->
   </section>
 *
 * EVENT-NAME
 * 'remove-mainNavigation-entries', 'remove-subNavigation-entries'
 */
 
App.NavigationManager.buildMainNavigation = (function() {
	var cached_function = App.NavigationManager.buildMainNavigation;

	return function() {
		cached_function.apply(this, arguments);
		
		
		
		$(document).ready(function(){ 
			var listElements = $(".mainNavigation ul.nav").find('li.dropdown');
		
			listElements.each(function(index){
				var _t = $(this);
				
			console.log(_t.find('ul.dropdown-menu').first('li').data('target'));
				_t.removeClass('dropdown'); 
				_t.attr('data-target', 'test');
				_t.find('a').attr('data-target', _t.find('ul.dropdown-menu').first('li').data('target'));
				_t.find('a').attr('href', '#' + _t.find('ul.dropdown-menu').first('li').data('target'));
				_t.find('ul.dropdown-menu').hide();
			});
		});
		
		/*$(".mainNavigation ul.nav").find('li.dropdown').removeClass('dropdown');
		
		$(".mainNavigation ul.nav").append('<li class="rebuildMainNav easyNav"><a data-link-src="#easyStart">Easy</a></li>');
		$(".mainNavigation ul.nav").append('<li class="rebuildMainNav mediumNav"><a data-link-src="#mediumStart">Medium</a></li>');
		$(".mainNavigation ul.nav").append('<li class="rebuildMainNav hardNav"><a data-link-src="#hardStart">Hard</a></li>'); */
	};
}());

$(document).ready(function(){ 
	$(".rebuildMainNav").click(function(e){
		var t = $(this);

		$(".rebuildMainNav").show();
		t.hide();
		t.after($('.subNavigation').closest('div'));

		
	});
});