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
 
// register the removing functions
App.Event.register("remove-mainNavigation-entries", function(article){
	$(".mainNavigation a[data-target='" + article + "']").closest('li').hide();
});

App.Event.register("remove-subNavigation-entries", function(article){
	$(".subNavigation a[data-target='" + article + "']").hide();
});

App.NavigationManager.buildMainNavigation = (function() {
	var cached_function = App.NavigationManager.buildMainNavigation;

	return function() {
		cached_function.apply(this, arguments);
		
		var noMenuArticles = $("section.no-mainNavigation").find('article');
		if(noMenuArticles.length > 0) {
			var removeID = noMenuArticles.first().attr('id');
			$(".mainNavigation a[data-target='" + removeID + "']").closest('ul').closest('li').hide();
		}
		
		noMenuArticles = $("article.no-mainNavigation");
		noMenuArticles.each(function(index){
			var removeID = $(this).attr('id');
			App.Event.triggerArg("remove-mainNavigation-entries", removeID); 
		});
	};
}());

App.NavigationManager.buildSubNavigation = (function() {
	var cached_function = App.NavigationManager.buildSubNavigation;

	return function() {
		cached_function.apply(this, arguments);
		
		var noMenuArticles = $("section.no-subNavigation").find('article');
		if(noMenuArticles.length > 0) {
			var removeID = noMenuArticles.first().attr('id');
			$(".subNavigation a[data-target='" + article + "']").closest('nav').find('*').hide();
		}
		
		noMenuArticles = $("article.no-subNavigation");
		noMenuArticles.each(function(index){
			var removeID = $(this).attr('id');
			App.Event.triggerArg("remove-subNavigation-entries", removeID); 
		});
	};
}());

$(document).ready(function(){ 
	var noMenuArticles = $("section.no-mainNavigation").find('article');
	if(noMenuArticles.length > 0) {
		var removeID = noMenuArticles.first().attr('id');
		$(".mainNavigation a[data-target='" + removeID + "']").closest('ul').closest('li').hide();
	}
	
	noMenuArticles = $("article.no-mainNavigation");
	noMenuArticles.each(function(index){
		var removeID = $(this).attr('id');
		App.Event.triggerArg("remove-mainNavigation-entries", removeID); 
	});
	
	var noMenuArticles = $("section.no-subNavigation").find('article');
	if(noMenuArticles.length > 0) {
		var removeID = noMenuArticles.first().attr('id');
		$(".subNavigation a[data-target='" + article + "']").closest('nav').find('*').hide();
	}
	
	noMenuArticles = $("article.no-subNavigation");
	noMenuArticles.each(function(index){
		var removeID = $(this).attr('id');
		App.Event.triggerArg("remove-subNavigation-entries", removeID); 
	});
});