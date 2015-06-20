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
	};
}());