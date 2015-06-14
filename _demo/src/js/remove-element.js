/**
 * EVENT - Remove element
 *
 * DESCRIPTION:
 * Removes an element from the DOM tree
 *
 * EVENT-NAME
 * 'remove-element'
 */
 
// register the removing function
App.Event.register("remove-element", function(obj){
	obj.remove();
});
