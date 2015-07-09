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
		var isTraining = App.SectionManager.articles[arguments[0]].selector.closest('section').data('is-training');
		
		if(menuItemToBeActivated) {
			$(".mainNavigation a[data-target='" + menuItemToBeActivated + "']").closest('li').addClass('active');
			$(".subNavigation a[data-target='" + menuItemToBeActivated + "']").addClass('active');			
		} else {
			cached_function.apply(this, arguments);
		}
		if(isTraining) {
			$(".extra-nav").find('li').first().addClass('active');
		}
	};
}());

App.NavigationManager.inactiveLink = (function() {
	var cached_function = App.NavigationManager.inactiveLink;

	return function() {
		var menuItemToBeDeactivated = $("article[data-menu-id='" + App.SectionManager.articles[arguments[0]].selector.data('mark-menu') + "']").attr('id');
		var isTraining = App.SectionManager.articles[arguments[0]].selector.closest('section').data('is-training');
		
		if(menuItemToBeDeactivated) {
			$(".mainNavigation a[data-target='" + menuItemToBeDeactivated + "']").closest('li').removeClass('active');
			$(".subNavigation a[data-target='" + menuItemToBeDeactivated + "']").removeClass('active');
		} else {
			cached_function.apply(this, arguments);
		}
		
		//remove "training" mark
		$(".extra-nav").find('li').first().removeClass('active');
	};
}());