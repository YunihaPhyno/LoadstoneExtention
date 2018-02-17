console.log ("Lodestone Extension written by Yuniha Phyno.");

(window.onload = main);

// 実行を許可するページ
function main () {
	console.log("スクリプト実行開始");
	if (!/my\/blog\/post\//.test(location.href) && !/my\/blog\/[0-9]+\/edit/.test(location.href) && !/freecompany\/[0-9]+\/forum\/post/.test(location.href) && !/freecompany\/[0-9]+\/forum\/[0-9]+\/comment\/post/.test(location.href) &&!/freecompany\/[0-9]+\/forum\/[0-9]+\/edit/.test(location.href)) {
		return;
	}

	// Flickr用のモーダルウィンドウ追加
	var flickrModalWindows = new FlickrWindows ("FlickrWindows", $("body"));

	// Flickr画像を参照ボタンを追加
	var flickrButton = new FlickrButton ();
	flickrButton.SetClickEvent ({modalWindow:flickrModalWindows}, function (event) {event.data.modalWindow.Open ();});

	// 定型文関係
	chrome.storage.sync.get(["flickrUserId", "fixedPhrase", "fixedPhraseFCForum", "title_diary", "title_forum"], OnLoadOptions);
}

function OnLoadOptions (response) {
	console.log (response);
	flickrUserId = response["flickrUserId"];

	if (/my\/blog\/post\//.test(location.href)){
		insertFixedPhrase (response["title_diary"],response["fixedPhrase"]);
	} else if (/freecompany\/[0-9]+\/forum\/post/.test(location.href)) {
		insertFixedPhrase (response["title_forum"],response["fixedPhraseFCForum"]);
	}
	
}

function insertFixedPhrase (title, text) {
	if (!$("#input_title").val()) {
		$("#input_title").val(title);
	}

	if (!$("#input_body").val()) {
		$("#input_body").val(text);
	}
}