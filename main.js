(window.onload = main);
var btnFlickrDOMId = "ButtonFlickr";
var modalWindowFlickrDomId = "modalWindowFlickr";
var overlayDomId = "modalOverlayFlickr";
var imgSelectBoxDomId = "imgSelectBoxFlickr";
var userId = "152412377@N03";
var testAddress = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=730f880c45aed14a1e0cee8ff851b4d2&user_id=152412377%40N03&format=rest";
var flickrPhotos;
var selectBoxStatus;

function main () {
	//モーダルウィンドウの追加
	createModalWindow();

	//フリッカーボタンの追加
	addFlickrButton ();

	requestSearch(testAddress);
}

//----------------モーダルウィンドウ関係--------------------
function createModalWindow () {
	console.log ("createModalWindow");
	//DOMの追加
	$("body").append('<div id="' + modalWindowFlickrDomId + '"></div>');
	//$("body").append('<div id="' + modalWindowFlickrDomId + '" class="sys_img_select_box" style="opacity: 1; position: absolute; top: 166px; left: 642.5px;"><ul class="upload__list clearfix sys__upload__list"></ul><ul class="btn__pager sys_upload_pager"><li><a href="javascript:void(0);" class="icon-list__pager btn__pager__prev--all js__tooltip" data-tooltip="先頭へ"></a></li><li><a href="javascript:void(0);" class="icon-list__pager btn__pager__prev js__tooltip" data-tooltip="前へ"></a></li><li class="btn__pager__current sys_current_page"></li><li><a href="javascript:void(0);" class="icon-list__pager btn__pager__next js__tooltip" data-tooltip="次へ"></a></li><li><a href="javascript:void(0);" class="icon-list__pager btn__pager__next--all js__tooltip" data-tooltip="最後へ"></a></li></ul><a href="javascript:void(0);" class="btn__color--radius parts__space--reset sys_upload_submit">選択画像で決定</a></div>');
	var mordalWindow = $("#" + modalWindowFlickrDomId);
	createTitle (mordalWindow);
	createImageSelectBox (mordalWindow);
}

function createTitle (mordalWindow) {
	console.log ("createTitle");
	mordalWindow.append ('<h3 class="heading--lg parts__space--add">画像を選択</h3>');
}

function createImageSelectBox (mordalWindow) {
	console.log ("createImageSelectBox");
	mordalWindow.append ('<div id="' + imgSelectBoxDomId + '"><ul></ul></div>');
	var imgSelectBox = $("#"+imgSelectBoxDomId);
	for (var i = 0; i < 24; i++) {
		imgSelectBox.children("ul").append ('<li name="' + i + '"></li>');
	}
}

function getFlickrImgUrl (photo) {
	console.log ("getFlickrImgUrl");
	return "http://farm" + photo.getAttribute('farm') + ".staticflickr.com/"+ photo.getAttribute('server') +"/" + photo.getAttribute('id') + "_"+ photo.getAttribute('secret') +"_h.jpg";
}

//----------------フリッカーボタン関係------------------
function addFlickrButton () {
	console.log ("addFlickrButton");

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
	console.log ("onClickFlickrButton");
	//ボタンからフォーカスを外す
	$(this).blur() ;

	createOverlay ();

	//フェードイン
	$("#"+modalWindowFlickrDomId).fadeIn("slow");
	$("#"+overlayDomId).fadeIn("slow");

	centeringModalSyncer();

	$("#embedfiles").click();
}

function createOverlay () {
	console.log ("createOverlay");
	//新しくモーダルウィンドウを起動しない
	if($("#" + overlayDomId)[0]) {
		return false ;
	}

	//オーバーレイ用のHTMLコードを、[body]内の最後に生成する
	$("body").append('<div id="' + overlayDomId + '"></div>');

	$("#"+overlayDomId).click(onClickOverlay);
}

function onClickOverlay () {
	console.log ("onClickOverlay");
	//フェードアウトさせる
	$("#"+overlayDomId+",#"+modalWindowFlickrDomId).fadeOut("slow",afterFadeOutOverlay);
}

function afterFadeOutOverlay () {
	console.log ("afterFadeOutOverlay");
	//フェードアウト後、[#modal-overlay]をHTML(DOM)上から削除
	$("#"+overlayDomId).remove();
}

//センタリングをする関数
function centeringModalSyncer(){
	console.log ("centeringModalSyncer");
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

	console.log($(window).scrollTop());

	//[#modal-content]のCSSに[left]の値(pxleft)を設定
	modalWindow.css({"left": pxleft + "px"});
	//modalWindow.css({"top": pxtop + "px"});
	modalWindow.css({"top": 50 + "%"});

}

function requestSearch(uri) {
	console.log ("requestSearch");
	var ajax = new XMLHttpRequest();
	ajax.onreadystatechange = readyStateChange;
	ajax.open('GET', uri, true);
	ajax.send(null);
	
}

function readyStateChange(event) {
	console.log ("readyStateChange");
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
	console.log ("getResults");
	flickrPhotos = data.getElementsByTagName('photo');
	console.log (flickrPhotos);
	setImgToImgSelectBox ();
}

function setImgToImgSelectBox () {
	console.log ("setImgToImgSelectBox");
	var selectBoxList = $("#" + imgSelectBoxDomId).children("ul").children('li');
	for (var i = 0; i < selectBoxList.length; i++) {
		$(selectBoxList[i]).children("img").remove();
		$(selectBoxList[i]).append($("<img>").attr("src", getFlickrImgUrl (flickrPhotos[i])));
		$(selectBoxList[i]).click (onClickImgSelectBox);
	}
	selectBoxStatus = new Array(selectBoxList.length);
}


function onClickImgSelectBox () {
	console.log ("onClickImgSelectBox");
	var selectBox = $(this);
	selectBox.blur();
	var id = Number(selectBox.attr("name"));

	if (selectBox.attr("class") == "") {
		$("#external_file_uri").val(getFlickrImgUrl (flickrPhotos[id]));
		$("#external_file_select").click();
	} else {
		
	}
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