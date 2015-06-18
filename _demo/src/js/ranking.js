var ranking = (function(win){ "use strict";
	var doc = win.document;	
	function connection(){
		var xmlHttpObject = false;
		if (typeof XMLHttpRequest != 'undefined') {
			xmlHttpObject = new XMLHttpRequest();
		}
		if (!xmlHttpObject) {
			try {
				xmlHttpObject = new ActiveXObject("Msxml2.XMLHTTP");
			}
			catch(e) {
				xmlHttpObject = new ActiveXObject("Microsoft.XMLHTTP");
			}
		}
		return xmlHttpObject;
	}
	
	function getRanking(selectedGroup){
		var result,i;
		if (xmlHttpObject.readyState==4 && xmlHttpObject.status==200){
			var json_obj = JSON.parse(xmlHttpObject.responseText);
			//console.log(xmlHttpObject.responseText);
			var stars5=0,stars4=0,stars3=0,stars2=0,stars1=0;
			for(var i = 0; i<json_obj.length;i+=2){
				if(json_obj[i] == selectedGroup){
					if(json_obj[i+1] == 5){stars5++};
					if(json_obj[i+1] == 4){stars4++};
					if(json_obj[i+1] == 3){stars3++};
					if(json_obj[i+1] == 2){stars2++};
					if(json_obj[i+1] == 1){stars1++};
				}
			}			
			var doughnutData = [
				{value: stars5,color:"#F7464A",highlight: "#FF5A5E",label: "Sehr gut"},
				{value: stars4,color: "#46BFBD",highlight: "#5AD3D1",label: "Gut"},				
				{value: stars3,color: "#FDB45C",highlight: "#FFC870",label: "Mittelmäßig"},
				{value: stars2,color: "#949FB1",highlight: "#A8B3C5",label: "Schlecht"},
				{value: stars1,color: "#4D5360",highlight: "#616774",label: "Sehr schlecht"}			
			];	

			return doughnutData;
		}
	}
	
	function saveContent(file,exercise,star){
		var stars = [],
		jsonObj;
		stars[0] = exercise;
		stars[1] = star;
		jsonObj = JSON.stringify(stars);		
		xmlHttpObject.onreadystatechange = handleContent;
		xmlHttpObject.open("GET",file+"?q="+jsonObj,true);
		xmlHttpObject.send();	
	}
	
		
	return {
		connection:connection,
		getRanking:getRanking,
		saveContent:saveContent,
		ver:'2015'
	};
}(window));
