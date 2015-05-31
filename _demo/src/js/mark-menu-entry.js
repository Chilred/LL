/**
 * ADD-On - Mark certain menu entries
 *
 * DESCRIPTION:
 * Marks certain menu entries when you don't want the default menu entry to be marked.
 *
 * MARKUP
 *
 * <article class="no-mainNavigation" data-mark-menu="#example"> <!-- marks the article with data-menu-id="#example" -->
 *
 *
 * EVENT-NAME
 * 'remove-mainNavigation-entries', 'remove-subNavigation-entries'
 */
 
App.NavigationManager.activeLink = (function() {
	var cached_function = App.NavigationManager.activeLink;

	return function() {
		var menuItemToBeActivated = $("article[data-menu-id='" + App.SectionManager.articles[arguments[0]].selector.data('mark-menu') + "']").attr('id');
		if(menuItemToBeActivated) {
			$("a[data-target='" + menuItemToBeActivated + "']").closest('li').addClass('active');
		} else {
			cached_function.apply(this, arguments);
		}
	};
}());

App.NavigationManager.inactiveLink = (function() {
	var cached_function = App.NavigationManager.inactiveLink;

	return function() {
		var menuItemToBeDeactivated = $("article[data-menu-id='" + App.SectionManager.articles[arguments[0]].selector.data('mark-menu') + "']").attr('id');
		if(menuItemToBeDeactivated) {
			$("a[data-target='" + menuItemToBeDeactivated + "']").closest('li').removeClass('active');
		} else {
			cached_function.apply(this, arguments);
		}
	};
}());