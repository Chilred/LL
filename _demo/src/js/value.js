/**
 * MODULE - Value
 *
 * MODULE DESCRIPTION:
 * This module allows to check values
 *
 * MODULE MARKUP
 *
 * Value

<div class="module value" data-value="hier der korrekte wert" data-label="einheit... was auch immer..."></div>


 *
 * REQUIRED data-Attributes:
 * data-src: the path to the audio file
 *
 * MODULE WRAPPER CLASS
 * audio
 */
App.ModuleManager.extend("Value", //registriet Modul in framework.js
    {
        wrapperClass : "value",

        isValidator : true,

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
              
                // find the parent article object
                var parentArticle = thisObject.parent("article");

                if(parentArticle.length != 1){
                    throw new Error("Malformed article / module structure! The module must be a direct child of an article element!");
                }

                // generates a unique id for this module
                objectID = App.Helper.generateUniqueID();
                   //Attribute prüfen !!!
				    // check if the data-title attribute exists, if not, throw an exception and cancel building process
                if(!App.Helper.hasAttribute(thisObject, "data-value") ){
                    throw new Error("Malformed content!\nThe DIV-Element must contain a data-value attribute!");
				}

                if(!App.Helper.hasAttribute(thisObject,"data-question")){
                    throw new Error("The value input container must have a data-question attribute!");
                }
				
				var htmlContent ='<div class=\"container-fluid\"><div class=\"panel panel-default\"><div class=\"panel-heading\">'+thisObject.attr("data-question")+'</div><div class=\"panel-body\"><div id="'+objectID+'"><form class="form-inline" role="form"><div class="form-group"><div class="input-group"><input class="form-control col-md-4 col-xs-12 col-sm-6" data-value="'+thisObject.attr("data-value")+'" type="text"/><div class="input-group-addon">'+thisObject.attr("data-label")+'</div></div></div></form></div></div></div></div>';

                // replaces the old object with the new one
                thisObject.replaceWith(htmlContent);
                // every row gets a own id
                var newObject = $("#"+objectID);

                // add it to the global module register
                App.ModuleManager.registerPreparedModule(objectID,{id: objectID, parentArticle: parentArticle.attr("id"), selector: newObject, isValidator: thisHelper.isValidator, validate: thisHelper.isValidator ? thisHelper.validator : null, finished: false});
            });

        },

        validator : function(myModule){
            var allObjects = myModule.selector.find("input");

            var containerObject = myModule.selector.find(".input-group");

            containerObject.find(".indicator").remove();

            var isCorrect = allObjects.attr("data-value") == allObjects.val();

            containerObject.append("<div class=\"input-group-addon indicator\"><span class=\"glyphicon "+(isCorrect ? "glyphicon-ok text-success" : "glyphicon-remove text-danger")+"\"></span></div>");

            return isCorrect;
        }
    }
);