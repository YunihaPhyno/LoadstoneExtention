/*
* TODO
* 読めない！！！リファクタリング必須！！
*　設計ミス！！ページャはFlickrAPIのpage機能で実装する！！←一応機能するけど最後のページバグってる！！（インデックス余りの問題）
* イメージボックス中央寄せというかうん・・・
* 機能単位でファイル分けを・・・
* そもそもクラス化しましょう
*/
console.log ("Lodestone Extension written by Yuniha Phyno.");

(window.onload = main);
var btnFlickrDOMId = "ButtonFlickr";
var modalWindowFlickrDomId = "modalWindowFlickr";
var overlayDomId = "modalOverlayFlickr";
var imgSelectBoxDomId = "imgSelectBoxFlickr";
var pagerDomId = "pagerFlickr";
var flickrUserId = "";
var flickrPhotos;
var fixedPhrase = "";
var loadOptions = false;
var imgBoxSize = new Object();
imgBoxSize.rows = 4;
imgBoxSize.cols = 8;
imgBoxSize.square = imgBoxSize.rows * imgBoxSize.cols;
var selectBoxStatus;

// 実行を許可するページ

function main_old () {
	// 実行を許可するページ
	console.log(location.href);
	if (!/my\/blog\/post\//.test(location.href) && !/freecompany\/[0-9]+\/forum\/post/.test(location.href)) {
		return;
	}

	console.log("スクリプト実行開始");

	//Chrome拡張のローカルストレージへアクセスリクエスト
	Chrome.Request(["flickrUserId", "fixedPhrase", "fixedPhraseFCForum"]);
	Chrome.Wait();
	//モーダルウィンドウの追加
	createModalWindow();

	//フリッカーボタンの追加
	addFlickrButton ();

	//定型文の入力
	insertFixedPhrase ();
}



function main () {
	console.log("スクリプト実行開始");
	var flickrModalWindows = new FlickrWindows ("FlickrWindows", $("body"));
	var flickrButton = new FlickrButton ();
	flickrButton.SetClickEvent ({modalWindow:flickrModalWindows}, 
		function (event) {
			event.data.modalWindow.Open ();
		}
	);
}

function OnLoadOptions (response) {
	console.log (response);
	flickrUserId = response["flickrUserId"];

	if (/my\/blog\/post\//.test(location.href)){
		insertFixedPhrase (response["fixedPhrase"]);
	} else if (/freecompany\/[0-9]+\/forum\/post/.test(location.href)) {
		insertFixedPhrase (response["fixedPhraseFCForum"]);
	}
}


//----------------定型文関係--------------------
function insertFixedPhrase (text) {
	if (!$("#input_body").val()) {
		$("#input_body").val(text);
	}
}

//----------------モーダルウィンドウ関係--------------------
function onClickBtnPager (event) {
	console.log (event.data.type);

	var pager = $("#" + pagerDomId);
	pager.ul = pager.children('ul');
	pager.ul.li = pager.ul.children('li');
	pager.ul.pager_current = pager.ul.children('.btn__pager__current');

	switch (event.data.type) {
	case "prev_all":
		//画像リスト取得(コールバックで画像表示)
		requestSearch(getFlickrAPIURL(1));
		break;
	case "prev":
		requestSearch(getFlickrAPIURL(Number(pager.ul.pager_current.attr("page_num")) - 1));
		break;
	case "next":
		requestSearch(getFlickrAPIURL(Number(pager.ul.pager_current.attr("page_num")) + 1));
		break;
	case "next_all":
		requestSearch(getFlickrAPIURL(Number(pager.ul.pager_current.attr("page_max"))));
		break;
	}
	//アップロードファイルリストと同期をとる
	syncUploadFileList ();
}

function setPage (pageNum) {
	setImgToImgSelectBox ((pageNum - 1) * imgBoxSize.square);
	updatePager(pageNum,Math.floor(flickrPhotos.length/imgBoxSize.square));
}

function updatePager (currentPagesNum, maxPagesNum) {
	var pager = $("#" + pagerDomId);
	pager.ul = pager.children('ul');
	pager.ul.li = pager.ul.children('li')

	pager.ul.pager_current = pager.ul.children('.btn__pager__current');
	pager.ul.pager_current.attr("page_num",currentPagesNum);
	pager.ul.pager_current.attr("page_max",maxPagesNum);
	pager.ul.pager_current.text(String(currentPagesNum) + "ページ / " + String(maxPagesNum) + "ページ");
	if (currentPagesNum == 1) {
		pager.ul.li.children('.btn__pager__prev--all').attr("class", "icon-list__pager btn__pager__prev--all js__tooltip btn__pager__no");
		pager.ul.li.children('.btn__pager__prev').attr("class", "icon-list__pager btn__pager__prev js__tooltip btn__pager__no");
	} else {
		pager.ul.li.children('.btn__pager__prev--all').attr("class", "icon-list__pager btn__pager__prev--all js__tooltip");
		pager.ul.li.children('.btn__pager__prev').attr("class", "icon-list__pager btn__pager__prev js__tooltip");
	}

	if (currentPagesNum == maxPagesNum) {
		pager.ul.li.children('.btn__pager__next--all').attr("class", "icon-list__pager btn__pager__next--all js__tooltip btn__pager__no");
		pager.ul.li.children('.btn__pager__next').attr("class", "icon-list__pager btn__pager__next js__tooltip btn__pager__no");
	} else {
		pager.ul.li.children('.btn__pager__next--all').attr("class", "icon-list__pager btn__pager__next--all js__tooltip");
		pager.ul.li.children('.btn__pager__next').attr("class", "icon-list__pager btn__pager__next js__tooltip");
	}
}

//----------------フリッカーボタン関係------------------
function getResults(data) {
	//console.log ("getResults");
	flickrPhotos = data.getElementsByTagName('photo');
	console.log (flickrPhotos);
	setImgToImgSelectBox ();
	//ページャ初期化
	updatePager(data.getElementsByTagName('photos')[0].getAttribute('page'),data.getElementsByTagName('photos')[0].getAttribute('pages'));
	syncUploadFileList();
}
	




