Debug.log("load:Flickr.class.js");

// @abstruct
class NetworkApi {
	constructor () {}

	static Request (url,callback) {
		var ajax = new XMLHttpRequest();
		ajax.onreadystatechange = this.OnReceivedCallBack_;
		ajax.onfinishedcallback = callback;
		ajax.open('GET', url, true); 
		ajax.send(null);
	}

	static 	OnReceivedCallBack_ (event) {
		var ajax = event.target;
		var data = null;
		if (ajax.readyState == 4) {
			if ((ajax.status >= 200 && ajax.status < 300) || (ajax.status == 304)) {
				data = ajax.responseXML;
				if (data != null) {
					this.onfinishedcallback (data);
				} else {
					Debug.log ("Data was not received");
				}
			}
		}
	}
}

class FlickrApi {

	constructor (userid, nImgsPerPage) {
		this.userId_ = userid;
		this.perPage_ = nImgsPerPage;
		Debug.log ("flickr id : " + this.userId_);
	}

	Request (pageNum,callback) {
		NetworkApi.Request (this.GetApiUrl(pageNum), callback);
	}

	GetApiUrl (pageNum) {
		return FlickrApi.GetBaseUrl() + "&" + "api_key=" + FlickrApi.GetApiKey() + "&" + "user_id=" + this.userId_ + "&" + "per_page=" + this.perPage_ + "&" + "page=" + pageNum + "&format=rest";
	}

	static GetBaseUrl () {
		return "https://api.flickr.com/services/rest/?method=flickr.photos.search";
	}

	static GetApiKey () {
		return "730f880c45aed14a1e0cee8ff851b4d2";
	}

	static GetFlickrImgUrl (photo) {
		return "http://farm" + photo.getAttribute('farm') + ".staticflickr.com/"+ photo.getAttribute('server') +"/" + photo.getAttribute('id') + "_"+ photo.getAttribute('secret') +"_h.jpg";
	}

	static Xml2UrlArray (xmldata) {
		var photos = xmldata.getElementsByTagName('photo');
		var urlArray = new Array (photos.length);
		for (var i = 0; i < urlArray.length; i++) {
			urlArray [i] = FlickrApi.GetFlickrImgUrl (photos[i]);
		}

		return urlArray;
	}
}