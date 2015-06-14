/**
 * EVENT - Remove last buttons
 *
 * DESCRIPTION:
 * Removes the last button of the last article of a section.
 *
 * MARKUP
 *
 * <section class="no-last-buttons">
	<!-- The last button from the last article in this section will be removed -->
   </section>
 *
 * EVENT-NAME
 * 'remove-last-button'
 */

// remove all last buttons that are supposed to be removed once DOM is loaded
$(document).ready(function(){ 
	var noButtonArticles = $("section.no-last-button").find('article');
	
	noButtonArticles.each(function(index){
		var removeID = $(this).attr('id');
		App.Event.triggerArg("remove-element", $("[id='" + removeID + "']").find("[href='#finish']")); 
	});
});