var display;
var searchBox;
var searchButton;

var server = "http://api.flickr.com/services/rest";

//http://www.flickr.com/services/api/explore/flickr.photos.search
//flickr.photos.search APIを使う
//per_pageというのは、何枚取得するか。
//textというのは、指定するとテキストで検索をして写真を選んでくれる
var method ="?method=flickr.photos.search&per_page=5&text=";

var apiKey = "自分のAPIキーを入れてください";

var messageNotFound = "画像なかった・・・";
var messageTypeSomething = "検索語句を入力してください";

window.onload = appInit;

function appInit() {
	display = document.getElementById("display");
	searchBox = document.getElementById("searchBox");
	searchButton = document.getElementById("searchButton");
	searchButton.addEventListener("click", searchPhoto, false);
}

function searchPhoto() {

	var child;
	//ゴミ掃除
	while (child = display.firstChild) {
		display.removeChild(child);
	}
	var keyword = encodeURIComponent(searchBox.value.trim());
	if (keyword.length == 0) {
		display.textContent =messageTypeSomething;
		return;
	}

	var endPointUri = server + method + keyword + "&api_key=" + apiKey;
	requestSearch(endPointUri);
}

function getXMLHttpRequestObject() {
	var ajax  = null;

	if (window.XMLHttpRequest) {
		ajax = new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		ajax = new ActiveXObject('MSXML2.XMLHTTP.3.0');
	}

	return ajax;
}

function requestSearch(uri) {
	//var ajax = getXMLHttpRequestObject();
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
		if ((ajax.status >= 200 && ajax.status < 300)
			|| (ajax.status == 304)) {
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
		//console.log(photos[i].getAttribute('id'));
		//console.log(photos[i].getAttribute('farm'));
		//console.log(photos[i].getAttribute('server'));
		//console.log(photos[i].getAttribute('secret'));

		var farmId = photos[i].getAttribute('farm');
		var serverId = photos[i].getAttribute('server');
		var id = photos[i].getAttribute('id');
		var secret = photos[i].getAttribute('secret');

		var url = "http://farm" + farmId + ".staticflickr.com/"+ serverId +"/" + id + "_"+ secret +".jpg";
		var image = new Image();
		console.log(url);
		image.src = url;
		display.appendChild(image);
	}
}