/**
 * MODULE - Multiple Choice
 *
 * MODULE DESCRIPTION:
 * 
 *
 * MODULE MARKUP
 *<<<<<<<<<<<<<<<<<<<<<<<<<<<
	<div class="module multiple-choice" data-shuffle="1">
    <p data-correct="1">Antwort 1</p>
    <p data-correct="0">Antwort 2</p>
    <p data-correct="0">Antwort 3</p>
    <p data-correct="1">Antwort 4</p>
    <p data-correct="1">Antwort 5</p>
	</div>
	<<<<<<<<<<<<<<<<<<<<<<<<<
	<div class="checkbox" data-correct="0"><label for=""><input type="checkbox"></label></div>
	<div class="checkbox" data-correct="1"><label for=""><input type="checkbox"></label></div>
	<div class="checkbox" data-correct="0"><label for=""><input type="checkbox"></label></div>
	<div class="checkbox" data-correct="1"><label for=""><input type="checkbox"></label></div>
	<<<<<<<<<<<<<<<<<<<<<<<<<
 *
 * REQUIRED data-Attributes:
 * data-title: this is the title of each panel
 *
 * MODULE WRAPPER CLASS
 * multiple-choice
 */
App.ModuleManager.extend("MultipleChoice",
    {
        wrapperClass : "multiple-choice",

        isValidator : true,

        wrapperFunction : function(section){
            // check if there are modules of this module type in the current given section
            // stop this function if not
            var moduleObject = section.find(".module."+this.wrapperClass);
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

                if(!App.Helper.hasAttribute(thisObject,"data-question")){
                    throw new Error("The multiple choice container must have a data-question attribute!");
                }

                // find the parent article object
                var parentArticle = thisObject.parent("article");

                if(parentArticle.length != 1){
                    throw new Error("Malformed article / module structure! The module must be a direct child of an article element!");
                }

                // generates a unique id for this module
                objectID = App.Helper.generateUniqueID();

                // first part of bootstrap collapsable code
                var htmlContent = '<div class=\"container-fluid\"><div class=\"panel panel-default\"><div class=\"panel-heading\">'+thisObject.attr("data-question")+'</div><div class=\"panel-body\"><div id="'+objectID+'" class="form-group"><form role="form">';
				//Mischen
				var arrayShuffle = [];

				content.each(function(index){
                    // pointer to current object
                    currentContentObject = $(this);

                    // check if the data-correct attribute exists, if not, throw an exception and cancel building process
                    if(!App.Helper.hasAttribute(currentContentObject,"data-correct")){
                        throw new Error("Malformed content!\nP tags in multiple-choice must contain a data-correct attribute!");
                    }

                
                    // add elents to arrayShuffle
                    arrayShuffle.push('<div class="checkbox" data-correct="'+currentContentObject.attr("data-correct")+'"><label><input type="checkbox" />'+currentContentObject.html()+'</label></div>');
					
                });
				// shuffle the content of arrayShuffle and combine them afterwards
				htmlContent += (App.Helper.shuffleElements(arrayShuffle)).join("")+'</form><div></div></div></div>';

                // replace the old html code with our generated code
                thisObject.replaceWith(htmlContent);

                // get the jQoury object for later purposes
                var newObject = $("#"+objectID);


                // add it to the global module register
                App.ModuleManager.registerPreparedModule(objectID,{id: objectID, parentArticle: parentArticle.attr("id"), selector: newObject, isValidator: thisHelper.isValidator, validate: thisHelper.isValidator ? thisHelper.validator : null, finished: false});

            });

        },

        validator : function(myModule){
            var allObjects = myModule.selector.find("div.checkbox");
            
            var result = true;

            allObjects.find("span.glyphicon").remove();

            allObjects.each(function(){
                var thisObject = $(this);

                var isCorrect = parseInt(thisObject.attr("data-correct"),10) == 1;

                var checked = thisObject.find("input[type=checkbox]").is(':checked');

                if((isCorrect && checked) || (!isCorrect && !checked)){
                    thisObject.append("<span class=\"glyphicon glyphicon-ok text-success pull-right\"></span>");
                    result = result && true;
                } else {
                    thisObject.append("<span class=\"glyphicon glyphicon-remove text-danger pull-right\"></span>");
                    result = result && false;
                }
            });

            return result;
        }
    }
);