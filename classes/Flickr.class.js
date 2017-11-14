Debug.log("load:Flickr.class.js");

class Flickr {
	constructor (userid, nImgsPerPage) {
		this.userId = userid;
		this.perPage = nImgsPerPage;
		Debug.log ("flickr id : " + this.userId);
	}

	GetAPIURL (pageNum = 0) {
		return GetBaseUrl() + "&" + "api_key=" + GetApiKey() + "&" + "user_id=" + this.userId + "&" + "per_page=" + this.perPage + "&" + "page=" + pageNum + "&format=rest";
	}

	static GetBaseUrl () {
		return "https://api.flickr.com/services/rest/?method=flickr.photos.search";
	}

	static GetApiKey () {
		return "730f880c45aed14a1e0cee8ff851b4d2";
	}
}