/**
 * EVENT - Add custom link
 *
 * DESCRIPTION:
 * Allows to link to a specific article
 *
 * MARKUP
 *
 * <a data-link-src="#menuID">
	<!-- the data-link-src attribute needs to contain the value of the data-menu-id attribute from an article -->
   </a>
 *
 * EVENT-NAME
 * 'add-custom-link'
 */
 
// register the removing function
App.Event.register("add-custom-link", function(obj){
	
	var dataLinkSrc = obj.data('link-src');
	var menuItemID = $("[data-menu-id='" + dataLinkSrc + "']").attr("id");
	
	obj.attr('href', '#'+menuItemID);
	obj.attr('data-target', menuItemID)
	
	obj.click(function(e){
				var t = $(this);
				
				App.NavigationManager.inactiveLink(App.SectionManager.articles[App.SectionManager.currentArticle].id);
				App.SectionManager.showArticle(t.attr("data-target"));
				App.NavigationManager.activeLink(t.attr("data-target"));
			});
});

// create all custom links when DOM is ready
$(document).ready(function(){ 
	var links = $("[data-link-src]");
	
	links.each(function(index){
		var _t = $(this);
		App.Event.triggerArg("add-custom-link", _t); 
	});
});