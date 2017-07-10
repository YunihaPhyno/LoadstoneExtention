(window.onload = main);

function main () {
	addFlickrButton ();

	$("#breadcrumb")[0].innerHTML = $("#breadcrumb")[0].innerHTML.replace(/日記/,"ダイアリー");
	
	console.log ();
	var userId = "152412377@N03";
	var testAddress = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=7633b48cbee42b2fed0aa22b08ea8b3c&user_id=152412377%40N03&format=rest";

	requestSearch(testAddress);


}


function addFlickrButton () {
	var btnFlickrDOMId = "ButtonFlickr";
	var title = $("#img_select");
	if (title == undefined) {
		setTimeout(testloop,1000);
	}
	$('<ul><li><a href="javascript:void(0);" class="btn__color--radius" id=' + btnFlickrDOMId + '>Flickr画像を参照</a></li></ul>').insertAfter('#container>ul');
	var btnFlickr = document.getElementById(btnFlickrDOMId);
	btnFlickr.addEventListener("click", onClickButtonFlickr, false);
}

function onClickButtonFlickr () {
	alert ("Welcome to Flickr");
}



function requestSearch(uri) {
	console.log(uri);
	var ajax = new XMLHttpRequest();
	ajax.onreadystatechange = readyStateChange;
	ajax.open('GET', uri, true);
	ajax.send(null);
	
}

function readyStateChange(event) {
	var ajax = event.target;
	var data = null;
	if (ajax.readyState == 4) {
		if ((ajax.status >= 200 && ajax.status < 300) || (ajax.status == 304)) {
			data = ajax.responseXML;
			if (data != null) {
				getResults(data);
			}
		}
	}

}

function getResults(data) {
	var photos = data.getElementsByTagName('photo');
	var str = '';
	console.log(photos);
	for (var i = 0, count = photos.length; i < count; i++) {

		var farmId = photos[i].getAttribute('farm');
		var serverId = photos[i].getAttribute('server');
		var id = photos[i].getAttribute('id');
		var secret = photos[i].getAttribute('secret');

		var url = "http://farm" + farmId + ".staticflickr.com/"+ serverId +"/" + id + "_"+ secret +".jpg";
		var image = new Image();
		console.log(url);
		image.src = url;
		//display.appendChild(image);
	}
}