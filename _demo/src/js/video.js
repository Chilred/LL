/**
 * MODULE - Accoridon
 *
 * MODULE DESCRIPTION:
 * This module allows to display any content in collapsable panels.
 *
 * MODULE MARKUP
 *
 * <div class="module video">
    <p data-src="pfad zum Video 1"></p>
    <p data-src="pfad zum Video n"></p>
</div>
 *
 * REQUIRED data-Attributes:
 * data-title: this is the title of each panel
 *
 * MODULE WRAPPER CLASS
 * video
 */
App.ModuleManager.extend("Video", //registriet Modul in framework.js
    {
        wrapperClass : "video",

        wrapperFunction : function(section){
            // check if there are modules of this module type in the current given section
            // stop this function if not
            var moduleObject = section.find("."+this.wrapperClass);
            if(moduleObject.length < 1) return;

            var thisHelper = this;

            // generate a copy of this.wrapperClass because jQuery uses the this-context in its way so we cannot acces this.wrapperClass inside a jQuery each function
            var wrapperClassCopy = this.wrapperClass;

            var objectID;

            // prepare every module in the current article
            moduleObject.each(function(index){
                // generate pointer to the current jQuery object
                var thisObject = $(this);
                // find all p (data) tags
                var content = thisObject.find("p"); //Kommt vom Ersteller

                // if there are less than one objects, we cannot generate a valid collapsable module
                // throw an exception
                if(content.length < 1){
                    throw new Error("The object \""+wrapperClassCopy+"\" contains no content elements!\nSee at the documentation!");
                }

                // find the parent article object
                var parentArticle = thisObject.parent("article");

                if(parentArticle.length != 1){
                    throw new Error("Malformed article / module structure! The module must be a direct child of an article element!");
                }

                // generates a unique id for this module
                objectID = App.Helper.generateUniqueID();

                // first part of video tag
                var htmlContent = '<div class=\"container-fluid\"><video controls id="'+objectID+'" class="col-md-12 col-xs-12">';

                // for every p (data) entry generate a panel
                content.each(function(index){
                    // pointer to current object
                    currentContentObject = $(this);

                   //Attribute prüfen !!!
				    // check if the data-title attribute exists, if not, throw an exception and cancel building process
                    if(!App.Helper.hasAttribute(currentContentObject, "data-src")){
                        throw new Error("Malformed content!\nP tags in video body must contain a src-title attribute!");
                    }


					// getting the video-typ
					var path = currentContentObject.attr("data-src"); // p-tag auslesen
					var videoTyp = (App.Helper.getFileType(path)).toLowerCase(); // Datei-endung herausfiltern und in Kleinbuchstaben konvertieren
					
					//check video-format
					if (!App.Helper.isValidExtension(videoTyp, ["ogg","mp4", "webm"])){
						throw new Error ("The filetype " +videoTyp+ " is not a valid file. Only exepted formats: .mp4, .ogg, .webm");
					}
					
					
                    // every row gets a own id
                    var rowID = App.Helper.generateUniqueID();
                    // add panel code to the html string
                    htmlContent += '<source src="'+path+'" type="video/'+videoTyp+'">';
                });
				htmlContent += 'Your browser does not support the video tag.</video></div>';
                // replace the old html code with our generated code
                thisObject.replaceWith(htmlContent);

                // get the jQoury object for later purposes
                var newObject = $("#"+objectID);

                // add it to the global module register
                App.ModuleManager.registerPreparedModule(objectID,{id: objectID, parentArticle: parentArticle.attr("id"), selector: newObject, isValidator: thisHelper.isValidator, validate: thisHelper.isValidator ? thisHelper.validator : null, finished: false});

            });

        }
    }
);