/**
 * MODULE - Popcorn (+ Events)
 *
 * MODULE DESCRIPTION:
 * Allows to add a navigation for a video
 *
 * MODULE MARKUP
 *
 * <div class="module popcorn">
		<p data-jump-to="0">Start</p>
		<p data-jump-to="10">Übung #1</p>
		<p data-jump-to="50">Übung #2</p>
	</div>
 *
 * REQUIRED data-Attributes:
 * data-jump-to: the time to jump to in the video
 *
 * MODULE WRAPPER CLASS
 * popcorn
 */

 
App.ModuleManager.extend("Popcorn", //registriet Modul in framework.js
    {
        wrapperClass : "popcorn",

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
				
                var htmlContent = '<div class="popcorn-container btn-group" id="' + objectID + '">';

				content.each(function(index){
                    // pointer to current object
                    currentContentObject = $(this);
					currentContentObjectID = App.Helper.generateUniqueID();

                   //Attribute prüfen !!!
				    // check if the attribute exists, if not, throw an exception and cancel building process
                    if(!App.Helper.hasAttribute(currentContentObject, "data-jump-to")){
                        throw new Error("Malformed content!\nP tags in video body must contain a data-jump-to attribute!");
                    }

					htmlContent += '<button type="button" class="btn btn-default" id="' + currentContentObjectID + '" data-jump-to="' + currentContentObject.data('jump-to') + '">';
                    htmlContent += currentContentObject.text();
					htmlContent += '</button>'; 
                }); 
				htmlContent += '</div>';
				
                // add button group above video
                thisObject.remove();
				parentArticle.find('video').before(htmlContent);
            });

        }
});

// register the events
App.Event.register("add-popcorn-functionality", function(button){
	var popcornContainers = $('.popcorn-container');
	popcornContainers.each(function(index){
		var trigger = $(this);
		var popcornButtons = trigger.find('button');
		var videoID = trigger.closest('article').find('video').attr('id');
		var popcorn = Popcorn('#'+videoID);
		var changeCurrentTime = function(trig) {
			if (popcorn.duration()) {
				popcorn.currentTime(trig.data('jump-to'));
			} else {
				popcorn.on('loadedmetadata', function() {
					popcorn.currentTime(trig.data('jump-to'));
				});
			}
		};
		
		popcornButtons.each(function(index){
			var _t = $(this);		
			_t.click(function() {
				changeCurrentTime(_t);
			});
			popcorn.cue(_t.data('jump-to'), function() {
				trigger.find('button').removeClass('active');
				_t.addClass('active');
			});
			popcorn.on("seeking", function() {
				if (this.currentTime() >= _t.data('jump-to')) {
					trigger.find('button').removeClass('active');
					_t.addClass('active');
				}
			});
		});
	});
});

// trigger the events when DOM is ready
$(document).ready(function(){ 
	App.Event.trigger('add-popcorn-functionality'); 
});