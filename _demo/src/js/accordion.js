/**
 * MODULE - Accoridon
 *
 * MODULE DESCRIPTION:
 * This module allows to display any content in collapsable panels.
 *
 * MODULE MARKUP
 *
 * <div class="module accordion">
 *     <p data-title="Insert your panel title here">Insert your panel content here</p>
 *     ...
 * </div>
 *
 * REQUIRED data-Attributes:
 * data-title: this is the title of each panel
 *
 * MODULE WRAPPER CLASS
 * accordion
 */
App.ModuleManager.extend("Accordion",
    {
        wrapperClass : "accordion",

        isValidator : false,

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
                var content = thisObject.find("p");

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

                // find the parent article object
                var parentArticle = thisObject.parent("article");

                if(parentArticle.length != 1){
                    throw new Error("Malformed article / module structure! The module must be a direct child of an article element!");
                }

                // generates a unique id for this module
                objectID = App.Helper.generateUniqueID();

                // first part of bootstrap collapsable code
                var htmlContent = '<div class=\"container-fluid\"><div class="panel-group" id="'+objectID+'">';

                // for every p (data) entry generate a panel
                content.each(function(index){
                    // pointer to current object
                    currentContentObject = $(this);

                    // check if the data-title attribute exists, if not, throw an exception and cancel building process
                    if(!App.Helper.hasAttribute(currentContentObject,"data-title")){
                        throw new Error("Malformed content!\nP tags in accordion body must contain a data-title attribute!");
                    }

                    // every row gets a own id
                    var rowID = App.Helper.generateUniqueID();
                    // add panel code to the html string
                    htmlContent += '<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a data-toggle="collapse" data-parent="#'+objectID+'" href="#'+rowID+'">'+currentContentObject.attr("data-title")+'</a></h4></div><div id="'+rowID+'" class="panel-collapse collapse'+(index == 0 ? " in" : "")+'"><div class="panel-body">'+currentContentObject.html()+'</div></div></div>';

                });

                htmlContent += '</div></div>';

                // replace the old html code with our generated code
                thisObject.replaceWith(htmlContent);

                // get the jQoury object for later purposes
                var newObject = $("#"+objectID);

                // call bootstraps collpase method
                newObject.collapse();

                // add it to the global module register
                App.ModuleManager.registerPreparedModule(objectID,{id: objectID, parentArticle: parentArticle.attr("id"), selector: newObject, isValidator: thisHelper.isValidator, validate: thisHelper.isValidator ? thisHelper.validator : null, finished: false});

            });

        }
    }
);