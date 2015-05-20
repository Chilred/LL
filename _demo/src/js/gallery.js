/**
 * MODULE - Accoridon
 *
 * MODULE DESCRIPTION:
 * This module allows to display audio elements
 *
 * MODULE MARKUP
 *
 * Gallery

<div class="module gallery">
    <div data-image="pfad zum Bild1">Optional: Image Caption</div>
    <div data-image="pfad zum Bild2">Optional: Image Caption</div>
    ...
</div>


 *
 * REQUIRED data-Attributes:
 * data-src: the path to the audio file
 *
 * MODULE WRAPPER CLASS
 * audio
 */
App.ModuleManager.extend("Gallery", //registriet Modul in framework.js
    {
        wrapperClass : "gallery",

        wrapperFunction : function(section){
            // check if there are modules of this module type in the current given section
            // stop this function if not
            var moduleObject = section.find("."+this.wrapperClass);
            if(moduleObject.length < 1) return;

            // generate a copy of this.wrapperClass because jQuery uses the this-context in its way so we cannot acces this.wrapperClass inside a jQuery each function
            var wrapperClassCopy = this.wrapperClass;

            var objectID;

            var thisHelper = this;

            // prepare every module in the current article
            moduleObject.each(function(index){
                // generate pointer to the current jQuery object
                var thisObject = $(this);
                // find all p (data) tags
                var content = thisObject.children("div"); //Kommt vom Ersteller

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
				
                App.Log.log(content);

                // first part of slide tag
                var htmlContent = '<div class=\"container-fluid\"><div id="'+objectID+'" class="col-md-12 col-xs-12 col-sm-12 carousel slide" data-ride="carousel">';
				var indicatorList = '<!-- Indicators --><ol class="carousel-indicators">';
 				var itemList = '<!-- Wrapper for slides --><div class="carousel-inner">';
                // FOR EACH p (data) ENTRY GENEERATE PANEL
                content.each(function(index){

                    index /= 2;

                    // pointer to current object
                    currentContentObject = $(this);

                    if(!App.Helper.hasAttribute(currentContentObject,"data-src") && currentContentObject.text() === "") return;

                   //Attribute prüfen !!!
				    // check if the data-title attribute exists, if not, throw an exception and cancel building process
                    if(!App.Helper.hasAttribute(currentContentObject, "data-src")){
                        throw new Error("Malformed content!\nP tags in image body must contain a data-src attribute!");
                    }

                    App.Log.log(currentContentObject.text());

					// getting the Content
					// Indicators for Slides (control per ol)
					var indicators = '<li data-target="#'+objectID+'" data-slide-to="'+index+'" class="'+(index == 0 ? "active" : "")+'"></li>'
					var path = currentContentObject.attr("data-src"); // p-tag auslesen

					itemList += '<div class="item'+(index == 0 ? " active" : "" )+'"><img src="'+path+'" alt=""/><div class="carousel-caption">'+currentContentObject.html()+'</div></div>';
					
                    // every row gets a own id
                    var rowID = App.Helper.generateUniqueID();
                    // add panel code to the html string
                    indicatorList += indicators;
                });
				htmlContent += indicatorList + '</ol>' + itemList + '</div>'
				htmlContent += '<!--Controls --><a class="left carousel-control" href="#'+objectID+'" role="button" data-slide="prev"><span class="glyphicon glyphicon-chevron-left"></span></a><a class="right carousel-control" href="#'+objectID+'" role="button" data-slide="next">    <span class="glyphicon glyphicon-chevron-right"></span></a></div></div>';
                // replace the old html code with our generated code
                thisObject.replaceWith(htmlContent);

                // get the jQoury object for later purposes
                var newObject = $("#"+objectID);

                // call bootstraps collpase method
                newObject.carousel();

                // add it to the global module register
                App.ModuleManager.registerPreparedModule(objectID,{id: objectID, parentArticle: parentArticle.attr("id"), selector: newObject, isValidator: thisHelper.isValidator, validate: thisHelper.isValidator ? thisHelper.validator : null, finished: false});

            });

        }
    }
);