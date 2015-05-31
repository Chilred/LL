/**
 * EVENT - Add Article Title To Buttons
 *
 * DESCRIPTION:
 * Adds the title of the next article to the "next button" and the title of the previous article to the "previous button". For the default text no extra markup is needed.
 * Also allows to add custom button texts.
 *
 * MARKUP // only needed for custom button texts
 *
 * <article data-prev-btn="Your custom title for previous button" data-next-btn="Your custom title for next button">
	<!-- your code -->
   </article>
 *
 * EVENT-NAME
 * 'add-article-title-to-next-button', 'add-article-title-to-prev-button'
 */
 
// register the events
App.Event.register("add-article-title-to-next-button", function(button){
	// get custom button texts of current article
	var currentArticle = button.closest('article');
	var btnText = currentArticle.data("next-btn");
	if(btnText) {
		// add custom button text
		text = btnText;
	} else {
		// if no custom button text, add default text that includes the article title
		text = 'Nächstes: ' + $("article[id='" + button.data("id") + "']").find('h2:first-child').text();
	}
	button.text(text);
});

App.Event.register("add-article-title-to-prev-button", function(button){
	// get custom button texts of current article
	var currentArticle = button.closest('article');
	var btnText = currentArticle.data("prev-btn");
	if(btnText) {
		// add custom button text
		text = btnText;
	} else {
		// if no custom button text, add default text that includes the article title
		text = 'Zurück zu: ' + $("article[id='" + button.data("id") + "']").find('h2:first-child').text();
	}
	button.text(text);
});

// trigger the events when DOM is ready
$(document).ready(function(){ 
	var buttonsPrev = $(".footer .pull-left"); 
	buttonsPrev.each(function(index){
		App.Event.triggerArg('add-article-title-to-prev-button', $(this)); 
	});
	
	var buttonsNext = $(".footer .pull-right");
	buttonsNext.each(function(index){
		App.Event.triggerArg('add-article-title-to-next-button', $(this)); 
	});
});