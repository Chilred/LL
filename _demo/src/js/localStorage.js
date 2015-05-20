// JavaScript Document

//INFO
/*var foo = localStorage.getItem("bar");
// ...
localStorage.setItem("bar", foo);

…could be rewritten to use square bracket syntax instead:

var foo = localStorage["bar"];
// ...
localStorage["bar"] = foo;

var obj  = {key1: " Value1", key2: 213};

alert(obj.key1);
//In einen String packen
JSON.stringify(obj); // Zeichenkette der Werte von obj  >> var stringified = "{'key':'Value1', 'key2': '213'}";

//Aus dem string entpacken
var neuesObeject = JSON.parse(JSON.stringify(obj));

There are also methods for removing the value for a given named key, and clearing the entire storage area (that is, deleting all the keys and values at once).

interface Storage {
deleter void removeItem(in DOMString key);
void clear();
};

Calling removeItem() with a non-existent key will do nothing.

Finally, there is a property to get the total number of values in the storage area, and to iterate through all of the keys by index (to get the name of each key).

interface Storage {
readonly attribute unsigned long length;
getter DOMString key(in unsigned long index);
};

If you call key() with an index that is not between 0–(length-1), the function will return null. 

*/



SessionController = {

//INITIALISIERUNG

//check if an Storage (object in browser) allready exists 	
	storageEnabled : typeof Storage !== "undefined",	

	currentSession : null,
	storage : null,

	//Speicherzugriff auf localStorage kürzen und prüfen ob der Browser über localStorage verfügt.
	init: function(){
		//check if the browser is able to do localStorage
		if(!this.storageEnabled){ 
			throw new Error("Your browser "+App.BrowserManager.browserName+"\" v."+App.BrowserManager.browserVersion+" does not support LocalStorage! Please update your browser!");
		}

		this.storage = window.localStorage;


// AUSGABE-OPTION FÜR VORHANDENE SESSION
		//check if storage is empty
		if(this.storage.length == 0){
			this.currentSession =  {
				id : (new Date()).getTime(), // Zeitstemple generieren
				data : {}
			}
			this.saveSession(this.currentSession.id);
		} else{
			var htmlString = "";

		//Tabelle mit Sessions ausgeben				
			htmlString = '<table class="table table-hover">';
			//durchlaufe storage und greife auf jedes item zu, item = key = date
			for(item in this.storage){
				//Prüfe ob die ID dem Muster entspricht
				if(!/^[0-9]{13}$/.test(item)) continue;

			//key = date >> date aus key holen
				var date = new Date(parseInt(item,10));
				//date formatiern
				var transformedDate = date.toDateString();

				//String der Modalfunktion übergeben, um als PopUp auszugeben				
				htmlString += '<tr><td><a href="#" style="display:block;" class="sessionLoader" data-id="'+item+'">'+transformedDate+'</a></td></tr>';
			}
		
			htmlString += '</table><br />';
			//Button: Alles Session löschen
			htmlString += '<a href="#" id="deleteSession" class="btn btn-default">Alle Sessions löschen</a>';

			//An Modal-PopUp übergeben
			showModal("Letzte Sitzung wählen", htmlString, function(){});

			//Jedem Link per jQuery loadSession zuweisen
			//
			var thisHelper = this;
			$(".sessionLoader").click(function(e){
			//Standard-Verhalten der Events unterdrücken
				e.preventDefault();
				//Funktion loadSession für ausgewählte Session aufrufen
				thisHelper.loadSession($(this).attr("data-id"));
			});
			
			//Alle Sessions löschen
			$("#deleteSession").click(function(e){
				e.preventDefault();
				for(item in thisHelper.storage){
					if(!/^[0-9]{13}$/.test(item)) continue;
					thisHelper.removeSession(item);
				}
			});
		}

	},


//Eine Sitzung aus localStorage holen >> Current Session rein speichern	
	loadSession : function(id){
		this.currentSession = {
			//übergeben ID ins Feld "id" speichern
			id : id,
			//Daten geparst aus dem spezifischen Speicherplatz in das Feld "data" speichern
			data : JSON.parse(this.storage.getItem(id))
		}
		App.Log.log(this.currentSession);
	},

//Mit removeItem aus den LocalStrorage eine Session löschen	
	removeSession : function(id){
		alert (id);
		this.storage.removeItem(id);
	},

	//Liefert Current Session zurück
	getSession : function(id){
		// Aus dem localStorage holen und den String "entpacken"
		return	this.storage.getItem(id);
	},		

	getData : function(data){
		if(this.currentSession.data == null ){
			throw new Error("No information are saved in the storage.");
		}
		else{
			return this.currentSession.data;
		}

	},

	//Mit setItem in den LocalStrorage reinspeichern
	saveSession : function(id){
		//Aktuelle Sitzung dem localStorage hinzufügen
		this.storage.setItem(id, JSON.stringify(this.currentSession.data));
	}

}