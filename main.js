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
	var flickrModal = new FlickrWindows ("FlickrWindows", $("body"));
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
function createModalWindow () {
	//console.log ("createModalWindow");
	//DOMの追加
	$("body").append('<div id="' + modalWindowFlickrDomId + '"></div>');
	//$("body").append('<div id="' + modalWindowFlickrDomId + '" class="sys_img_select_box" style="opacity: 1; position: absolute; top: 166px; left: 642.5px;"><ul class="upload__list clearfix sys__upload__list"></ul><ul class="btn__pager sys_upload_pager"><li><a href="javascript:void(0);" class="icon-list__pager btn__pager__prev--all js__tooltip" data-tooltip="先頭へ"></a></li><li><a href="javascript:void(0);" class="icon-list__pager btn__pager__prev js__tooltip" data-tooltip="前へ"></a></li><li class="btn__pager__current sys_current_page"></li><li><a href="javascript:void(0);" class="icon-list__pager btn__pager__next js__tooltip" data-tooltip="次へ"></a></li><li><a href="javascript:void(0);" class="icon-list__pager btn__pager__next--all js__tooltip" data-tooltip="最後へ"></a></li></ul><a href="javascript:void(0);" class="btn__color--radius parts__space--reset sys_upload_submit">選択画像で決定</a></div>');
	var mordalWindow = $("#" + modalWindowFlickrDomId);
	createTitle (mordalWindow);
	createImageSelectBox (mordalWindow);
	createPager (mordalWindow);
}

/*
function createTitle (mordalWindow) {
	//console.log ("createTitle");
	mordalWindow.append ('<h3 class="heading--lg parts__space--add">画像を選択</h3>');
}
*/

function createImageSelectBox (mordalWindow) {
	//console.log ("createImageSelectBox");
	
	var imgSelectBox = $("#"+imgSelectBoxDomId);
	for (var i = 0, length = imgBoxSize.rows*imgBoxSize.cols; i < length; i++) {
		imgSelectBox.children("ul").append ('<li name="' + i + '"></li>');
		imgSelectBox.children("ul").children("li[name="+ i +"]").click(onClickImgSelectBox);
	}
}

function createPager (mordalWindow) {
	mordalWindow.append ('<div id="' +pagerDomId+ '"><ul class="btn__pager sys_upload_pager"></ul></div>');
	var pager = $("#" + pagerDomId);

	// append children
	pager.ul = pager.children("ul");
	pager.ul.append('<li><a href="javascript:void(0);" class="icon-list__pager btn__pager__prev--all js__tooltip" data-tooltip="先頭へ"></a></li>');
	pager.ul.append('<li><a href="javascript:void(0);" class="icon-list__pager btn__pager__prev js__tooltip" data-tooltip="前へ"></a></li>');
	pager.ul.append('<li class="btn__pager__current sys_current_page" page_num=0 page_max=0>0ページ / 0ページ</li>');
	pager.ul.append('<li><a href="javascript:void(0);" class="icon-list__pager btn__pager__next js__tooltip" data-tooltip="次へ"></a></li>');
	pager.ul.append('<li><a href="javascript:void(0);" class="icon-list__pager btn__pager__next--all js__tooltip" data-tooltip="最後へ"></a></li>');
	
	pager.ul.li = pager.ul.children("li");
	// set click event
	pager.ul.li.children(".btn__pager__prev--all").click({type : "prev_all"},onClickBtnPager);
	pager.ul.li.children(".btn__pager__prev").click({type : "prev"},onClickBtnPager);
	pager.ul.li.children(".btn__pager__next").click({type : "next"},onClickBtnPager);
	pager.ul.li.children(".btn__pager__next--all").click({type : "next_all"},onClickBtnPager);
}

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

function getFlickrImgUrl (photo) {
	//console.log ("getFlickrImgUrl");
	return "http://farm" + photo.getAttribute('farm') + ".staticflickr.com/"+ photo.getAttribute('server') +"/" + photo.getAttribute('id') + "_"+ photo.getAttribute('secret') +"_h.jpg";
}

//----------------フリッカーボタン関係------------------
function addFlickrButton () {
	//console.log ("addFlickrButton");

	//img_selectは遅延読み込みされるため読み込みを待つ
	var title = $("#img_select");
	if (!title) {
		setTimeout(addFlickrButton,1000);
	}

	//DOM埋め込み
	$('<ul><li><a href="javascript:void(0);" class="btn__color--radius" id=' + btnFlickrDOMId + '>Flickr画像を参照</a></li></ul>').insertAfter('#container>ul.upload__btn-2');

	//クリックイベント埋め込み
	document.getElementById(btnFlickrDOMId).addEventListener("click", onClickFlickrButton, false);
}

function onClickFlickrButton () {
	//console.log ("onClickFlickrButton");
	//ボタンからフォーカスを外す
	$(this).blur() ;

	createOverlay ();

	//フェードイン
	$("#"+modalWindowFlickrDomId).fadeIn("slow");
	$("#"+overlayDomId).fadeIn("slow");

	centeringModalSyncer();

	$("#embedfiles").click();

	//画像リスト取得(コールバックで画像表示)
	requestSearch(getFlickrAPIURL(1));

	//アップロードファイルリストと同期をとる
	syncUploadFileList ();
}

function getFlickrAPIURL (pageNum) {
	
	
}

//センタリングをする関数
function centeringModalSyncer(){
	//console.log ("centeringModalSyncer");
	//ウィンドウサイズ
	var windowHeight = $(window).height();
	var windowWidth = $(window).width();

	//モーダルウィンドウのサイズ
	var modalWindow = $("#"+modalWindowFlickrDomId);
	var modalHeight = $("#"+modalWindowFlickrDomId).outerHeight(true);
	var modalWidth = $("#"+modalWindowFlickrDomId).outerWidth(true);

	//コンテンツ(#modal-content)を真ん中に配置するのに、左端から何ピクセル離せばいいか？を計算して、変数[pxleft]に格納
	var pxleft = ((windowWidth - modalWidth)/2);
	var pxtop = $(window).scrollTop() - modalHeight * 2 + 30;//((windowHeight - modalHeight)/2);

	//console.log($(window).scrollTop());

	//[#modal-content]のCSSに[left]の値(pxleft)を設定
	modalWindow.css({"left": pxleft + "px"});
	//modalWindow.css({"top": pxtop + "px"});
	modalWindow.css({"top": 50 + "%"});

}

function requestSearch(uri) {
	//console.log ("requestSearch");
	var ajax = new XMLHttpRequest();
	ajax.onreadystatechange = readyStateChange;
	ajax.open('GET', uri, true);
	ajax.send(null);
	
}

function readyStateChange(event) {
	//console.log ("readyStateChange");
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
	//console.log ("getResults");
	flickrPhotos = data.getElementsByTagName('photo');
	console.log (flickrPhotos);
	setImgToImgSelectBox ();
	//ページャ初期化
	updatePager(data.getElementsByTagName('photos')[0].getAttribute('page'),data.getElementsByTagName('photos')[0].getAttribute('pages'));
	syncUploadFileList();
}
	
function setImgToImgSelectBox () {
	//console.log ("setImgToImgSelectBox");
	var selectBoxList = $("#" + imgSelectBoxDomId).children("ul").children('li');
	console.log (flickrPhotos.length);
	for (var i = 0; i < selectBoxList.length; i++) {
		$(selectBoxList[i]).children("img").remove();
		if (i < flickrPhotos.length) {
			$(selectBoxList[i]).append($("<img>").attr("src", getFlickrImgUrl (flickrPhotos[i])));
		}
	}
	selectBoxStatus = new Array(selectBoxList.length);
}

function onClickImgSelectBox () {
	//console.log ("onClickImgSelectBox");
	var selectBox = $(this);
	selectBox.blur();
	var id = Number(selectBox.attr("name"));
	var url = selectBox.children("img").attr("src");

	//同期がちゃんととれていれば選択されていないときclassは空になる
	if (selectBox.attr("class") == "") {
		//テキストボックスにurlを追加して「参照」ボタンを押す
		$("#external_file_uri").val(url);
		$("#external_file_select").click();
	} else {
		//自分のurlがあるリストアイテムの「×」ボタンを押す
		deleteSelectedFile (url);
	}

	//アップロードファイルリストと同期をとる
	syncUploadFileList();
}

//アップロードファイルリストと同期をとる
function syncUploadFileList () {
	var selectBoxList = $("#" + imgSelectBoxDomId).children("ul").children('li');
	var uploadFileList = $("#sys_upload__status>ul");
	for (var i = 0; i < selectBoxList.length; i++) {
		var selectBox = $(selectBoxList[i]);
		var url = selectBox.children('img').attr('src');
		$(selectBox).attr("class", "");
		for (var j = 0; j < uploadFileList.length; j++) {
			if (uploadFileList[j].childNodes[1].innerHTML == url) {
				$(selectBox).attr("class", "flame check");
				break;
			}
		}
	}
}

//urlがあるリストアイテムの「×」ボタンを押す
function deleteSelectedFile (url) {
	var uploadFileList = $("#sys_upload__status>ul");
	for (var i = 0; i < uploadFileList.length; i++) {
		if (uploadFileList[i].childNodes[1].innerHTML == url) {
			uploadFileList[i].childNodes[3].childNodes[0].click();
		}
	}
}

