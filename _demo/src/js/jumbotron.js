/**
 * MODULE - Jumbotron
 *
 * MODULE DESCRIPTION:
 * Creates a twitter bootstrap "Jumbotron"
 *
 * MODULE MARKUP
 *
 * <h2>Jumbotron-Heading</h2>
	<div class="module jumbotron">
	  <p>Jumbotron Text</p>
	  <button data-link-src="#articleToLinkTo">Button text</button>
	</div>
 *
 * REQUIRED data-Attributes:
 * (button) data-link-src: data-menu-id from article to link to
 *
 * MODULE WRAPPER CLASS
 * jumbotron
 */
 
App.ModuleManager.extend("Jumbotron", //registriet Modul in framework.js
    {
        wrapperClass : "jumbotron",

        wrapperFunction : function(section){
          // check if there are modules of this module type in the current given section
            // stop this function if not
            var moduleObject = section.find("."+this.wrapperClass);
            if(moduleObject.length < 1) return;

            // generate a copy of this.wrapperClass because jQuery uses the this-context in its way so we cannot acces this.wrapperClass inside a jQuery each function
            var wrapperClassCopy = this.wrapperClass;

            var objectID;

            // prepare every module in the current article
            moduleObject.each(function(index){
                // generate pointer to the current jQuery object
                var thisObject = $(this);
                
				// find the parent article object
                var parentArticle = thisObject.parent("article");

                if(parentArticle.length != 1){
                    throw new Error("Malformed article / module structure! The module must be a direct child of an article element!");
                }
				
                var heading = parentArticle.find("h2");
				var content = thisObject.find("p"); //Kommt vom Ersteller
				var button = thisObject.find("button"); //Kommt vom Ersteller

                // if there are less than one objects, we cannot generate a valid collapsable module
                // throw an exception
                if(content.length < 1 || heading.length < 1 || button.length < 1){
                    throw new Error("The object \""+wrapperClassCopy+"\" contains no content elements!\nSee at the documentation!");
                }

               // generates a unique id for this module
                objectID = App.Helper.generateUniqueID();
				
                var htmlContent = '<div class="jumbotron" id="' + objectID + '">';
				
				htmlContent += '<h2>' + heading.text() + '</h2>';
				
				htmlContent += '<p>' + content.text() + '</p>';
				
				htmlContent += '<p><a class="btn btn-primary btn-lg" data-link-src="'+button.data('link-src')+'" role="button">' + button.text() + '</a></p>';
				
				htmlContent += '</div>';
				
                // add jumbotron to article
                thisObject.remove();
				heading.remove();
				parentArticle.append(htmlContent);
            }); 
        }
});