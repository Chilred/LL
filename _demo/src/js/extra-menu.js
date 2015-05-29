/**
 * MODULE - Extra-Menu
 *
 * MODULE DESCRIPTION:
 * This module allows to add an extra menu for specifiv articles you specify yourself
 *
 * MODULE MARKUP
 *
 * <div class="module extra-menu">
	<h1>Menu Title</h1> <!-- --> optional title that is shown in front of the menu entries
    <p data-src="#article1"></p> <!-- the article tag must contain a data-menu-id attribute, e.g. data-menu-id="#article1" in this case -->
    <p data-src="#article2"></p> <!-- the article tag must contain a data-menu-id attribute, e.g. data-menu-id="#article2" in this case -->
</div>
 *
 * REQUIRED data-Attributes:
 * data-src: the "id" of the article you wish to link to (CAUTION: id doesn't mean the id attribute here but the data-menu-id attribute as shown in the example above
 *
 * MODULE WRAPPER CLASS
 * extra-menu
 */
App.ModuleManager.extend("Extra-Menu",
    {
        wrapperClass : "extra-menu",

        wrapperFunction : function(section){
            // check if there are modules of this module type in the current given section
            // stop this function if not
            var moduleObject = $("."+this.wrapperClass);
            if(moduleObject.length < 1) return;
			
            // generate a copy of this.wrapperClass because jQuery uses the this-context in its way so we cannot acces this.wrapperClass inside a jQuery each function
            var wrapperClassCopy = this.wrapperClass;
			
			var objectID;

            // prepare every module in the current article
			moduleObject.each(function(index){
				// generate pointer to the current jQuery object
                var thisObject = $(this);
				// find all p (data) tags
				var content = thisObject.find("p");
				var heading = thisObject.find("h1").text();

				// if there are less than one objects, we cannot generate a menu
				// throw an exception
				if(content.length < 1){
					throw new Error("The object \""+wrapperClassCopy+"\" contains no content elements!\nSee at the documentation!");
				}
				
				 // generates a unique id for this module
				objectID = App.Helper.generateUniqueID();
				
				// first part of video tag
				var htmlContent = '<nav id=\"' + objectID + '\" class=\"navbar navbar-default navbar-fixed-top\"><div class=\"container-fluid\"><div class=\"navbar-header\"><button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#extra-nav\"><span class=\"sr-only\">Toggle navigation</span><span class=\"icon-bar\"></span><span class=\"icon-bar\"></span><span class=\"icon-bar\"></span></button><div id="extra-nav" class=\"collapse navbar-collapse\"><ul class=\"nav navbar-nav extra-nav\"><a class="navbar-brand" href="#">' + heading +'</a>';
				
				// for every p (data) entry generate a panel
                content.each(function(index){
                    // pointer to current object
                    currentContentObject = $(this);

					//Attribute prüfen !!!
				    // check if the data-src attribute exists, if not, throw an exception and cancel building process
                    if(!App.Helper.hasAttribute(currentContentObject, "data-src")){
                        throw new Error("Malformed content!\nP tags must contain a data-src attribute!");
                    }

					// getting the ID of the article that shall be linked
					var path = currentContentObject.attr("data-src"); // p-tag auslesen
					
					var menuItemID = $("[data-menu-id='" + path + "']").attr("id");

                    // add panel code to the html string
                    htmlContent += '<li><a data-target=\"' + menuItemID + '\" href=\"#' + menuItemID + '\">' + App.SectionManager.articles[menuItemID].selector.find("h2:first-child").text() +  '</a></li>';
                }); 
				htmlContent += '</ul></div></div></div></nav>';
                // replace the old html code with our generated code
                thisObject.replaceWith(htmlContent); 
				
            });
			
			// add EventListener to menu entries to show the article and activate/deactivate the menu entry
			$(".extra-nav > li > a").click(function(e){
				var t = $(this);

				var parentLI = t.parent("li");
				// if the LI is disabled, stop here
				if(parentLI.hasClass("disabled")){
					e.preventDefault();
					return;
				}
				
				App.NavigationManager.inactiveLink(App.SectionManager.articles[App.SectionManager.currentArticle].id);
				App.SectionManager.showArticle(t.attr("data-target"));
				App.NavigationManager.activeLink(t.attr("data-target"));
			});
			
			// Expands the App.NavigationManager.inactiveLink() function from framework.js
			// Deactivates a menu entry in the extra menu
			App.NavigationManager.inactiveLink = (function() {
				var cached_function = App.NavigationManager.inactiveLink;

				return function() {
					cached_function.apply(this, arguments);
					$(".extra-nav [data-target='" + arguments[0] + "']").parent().removeClass('active');
				};
			}());
			
			// Expands the App.NavigationManager.activeLink() function from framework.js
			// Activates a menu entry in the extra menu
			App.NavigationManager.activeLink = (function() {
				var cached_function = App.NavigationManager.activeLink;

				return function() {
					cached_function.apply(this, arguments);
					$(".extra-nav [data-target='" + arguments[0] + "']").parent().addClass('active');
				};
			}());
        }
    } 
);