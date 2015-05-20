// JavaScript Document

<!-- Button trigger modal -->
//<button class="btn btn-primary btn-lg" data-toggle="modal" data-target="#myModal">
 // Launch demo modal
//</button>

<!-- Modal -->
//<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
//  <div class="modal-dialog">
//    <div class="modal-content">
//      <div class="modal-header">
//       <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
//        <h4 class="modal-title" id="myModalLabel">Modal title</h4>
//      </div>
//      <div class="modal-body">
//        ...
//      </div>
//      <div class="modal-footer">
//        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
//
//      </div>
//    </div>
//  </div>
//</div>

function showModal(title, content, callback){
		var myModalID = App.Helper.generateUniqueID();
		var myModalLabelID = App.Helper.generateUniqueID();
		
		//String Modal zusammenbauen
		modal = '<div class="modal fade" id="'+myModalID+'" tabindex="-1" role="dialog" aria-labelledby="'+myModalLabelID+'" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><h4 class="modal-title" id="'+myModalLabelID+'">'+title+'</h4></div><div class="modal-body">'+content+'</div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div>';
		//String Modal an body-tag anhängen
		$('body').append(modal);
		$('#'+myModalID).modal('show');	

	$('#'+myModalID).on('hidden.bs.modal', function (e) {
		//Modal löschen
		$(this).remove();
		
		//Callback-Funktion ausführen, wenn vorhanden
		if(typeof callback === "function"){
			callback();
		}
	});

}