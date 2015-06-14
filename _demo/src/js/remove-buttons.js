/**
 * EVENT - Remove buttons
 *
 * DESCRIPTION:
 * Removes buttons on articles you don't want to have buttons on. Works also for whole sections.
 *
 * MARKUP
 *
 * <article class="no-buttons">
	<!-- Just add the class "no-buttons" to the article from which you want the buttons removed -->
   </article>
   
   OR
   
   <section class="no-buttons">
	<!-- The buttons from every article in this section will be removed -->
   </section>
 *
 * EVENT-NAME
 * 'remove-button'
 */

// remove all buttons that are supposed to be removed once DOM is loaded
$(document).ready(function(){ 
	var noButtonArticles = $("section.no-buttons").find('article');
	
	noButtonArticles.each(function(index){
		var removeID = $(this).attr('id');
		App.Event.triggerArg("remove-element", $("[id='" + removeID + "']").find('.footer > .walkingButton').parent()); 
	});
	
	noButtonArticles = $("article.no-buttons");
	
	noButtonArticles.each(function(index){
		var removeID = $(this).attr('id');
		App.Event.triggerArg("remove-element", $("[id='" + removeID + "']").find('.footer > .walkingButton').parent()); 
	});
});