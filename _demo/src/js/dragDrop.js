/**
 * MODULE - Accoridon
 *
 * MODULE DESCRIPTION:
 * This module allows to drag & drop content.
 *
 * MODULE MARKUP
 *
 * <div class="module dragDrop">
    <div>
        <div>Apfel</div>
        <div>Baum</div>
    </div>
    <div>
        <div></div>
        <div></div>
    </div>
    <div>
        <div></div>
        <div></div>
    </div>
    <div>
        <div></div>
        <div></div>
    </div>
</div>

>>>>>>>>

<div class="draggable" id="UIZVUeowuieopog234567">
	<div class="snapTarget_UIZVUeowuieopog234567">Apfel</div>
	<div class="snapTarget_UIZVUeowuieopog234567"></div>

    <div class="snapable_UIZVUeowuieopog234567">Baum</div>
	<div class="snapable_UIZVUeowuieopog234567"></div>
</div>

<div class="draggable" id="izusegfaiweujbvoczu§$%&/(djasiodujvbwfio">
	<div class="snapTarget"></div> <div class="snapTarget"></div>
	<div class="snapTarget"></div> <div class="snapTarget"></div>

    <div class="snapable_"></div>
	<div class="snapable"></div>
</div> 

 *
 * REQUIRED data-Attributes:
 * data-title: this is the title of each panel
 *
 * MODULE WRAPPER CLASS
 * dragDrop
 */
App.ModuleManager.extend("DragDrop", //registriet Modul in framework.js
    {
        wrapperClass : "dragDrop",

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
                if(content.length < 2){
                    throw new Error("The object \""+wrapperClassCopy+"\" needs at least 2 further DIV elements!\nSee at the documentation!");
                }

                if(!App.Helper.hasAttribute(thisObject,"data-question")){
                    throw new Error("The drag and drop container must have a data-question attribute!");
                }

                // find the parent article object
                var parentArticle = thisObject.parent("article");

                if(parentArticle.length != 1){
                    throw new Error("Malformed article / module structure! The module must be a direct child of an article element!");
                }

                // generates a unique id for this module
                objectID = App.Helper.generateUniqueID();

				//Arrays fürs Mischen
				var answers = [];
				var objects = [];

                // first part of dragdrop tag
                var htmlContent = '<div class=\"container-fluid\"><div class=\"panel panel-default\"><div class=\"panel-heading\">'+thisObject.attr("data-question")+'</div><div class=\"panel-body\"><div id="'+objectID+'" class="col-md-12 col-xs-12 wrapper">';

                // for every div (data) entry generate a panel
                content.each(function(index){
					// pointer to current object
					currentContentObject = $(this);	
					children = currentContentObject.children("div");
				  
                    if(children.length != 2){
					   throw new Error("The object \""+wrapperClassCopy+"\" needs at least 2 further DIV elements!\nSee at the documentation!");
					}
					
                    var tmpID = App.Helper.generateUniqueID();
					
                    children.each(function(index){

                        var thisChild = $(this);

					   var tmpHTML;
					   if(index === 0){
                            //1. DIV anlegen
                            tmpHTML = '<div class="draggable snapable_'+ objectID+'" data-target="'+tmpID+'">'+thisChild.html()+'</div>';

                            //1. DIV in Array answers einfügen
                            answers.push(tmpHTML);
					   } else {
        					//2. DIV anlegen; solutions
        					tmpHTML = '<li><div id="'+objectID+'" class="snapTarget_'+objectID+' dragIntoBox col-md-5 col-sd-5 col-lg-5"></div><div class="col-md-6 col-sd-6 col-lg-6">'+thisChild.html()+'</div></li>';
        					
        					//2. DIV in Array objects einfügen
        					objects.push(tmpHTML);
    					}
				   });
                });
				// arrays mischen
				answers =	App.Helper.shuffleElements(answers);
				objects =	App.Helper.shuffleElements(objects);
				//arrays zusammenfügen
				htmlContent += '<div class="col-md-4 col-sd-4 col-lg-4">'+answers.join("\n")+'</div><div class="solutions col-md-8 col-sd-8 col-lg-8"><ul>'+objects.join("\n")+"</ul></div></div></div></div></div>";
				
				
                // replace the old html code with our generated code
                thisObject.replaceWith(htmlContent);
				

                // get the jQoury object for later purposes
                var newObject = $("#"+objectID);
				
				//"Leben einhauchen" // 
				//finde alle Divs mit Klasse snapable, mache sie ziehbar und snapbar an die DIVs mit der Klasse snapTarget.
				newObject.find(".snapable_"+objectID).draggable({snap: ".snapTarget_"+objectID, revert: "invalid"});
				newObject.find(".snapTarget_"+objectID).droppable({accept: ".snapable_"+objectID});

                // add it to the global module register
                App.ModuleManager.registerPreparedModule(objectID,{id: objectID, parentArticle: parentArticle.attr("id"), selector: newObject, isValidator: thisHelper.isValidator, validate: thisHelper.isValidator ? thisHelper.validator : null, finished: false});

            });

        }
    }
);
