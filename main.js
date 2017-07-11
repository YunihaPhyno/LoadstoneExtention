(window.onload = main);
var btnFlickrDOMId = "ButtonFlickr";
var modalWindowFlickrDomId = "modalWindowFlickr";
var overlayDomId = "modalOverlayFlickr";
var imgSelectBoxDomId = "imgSelectBoxFlickr";
var userId = "152412377@N03";
var testAddress = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=8013aa7e65fc72888f4f1eae7dadc448&user_id=152412377%40N03&format=rest";

function main () {
	//モーダルウィンドウの追加
	createModalWindow();

	//フリッカーボタンの追加
	addFlickrButton ();
}

//----------------モーダルウィンドウ関係--------------------
function createModalWindow () {
	//DOMの追加
	$("body").append('<div id="' + modalWindowFlickrDomId + '"></div>');
	//$("body").append('<div id="' + modalWindowFlickrDomId + '" class="sys_img_select_box" style="opacity: 1; position: absolute; top: 166px; left: 642.5px;"><ul class="upload__list clearfix sys__upload__list"></ul><ul class="btn__pager sys_upload_pager"><li><a href="javascript:void(0);" class="icon-list__pager btn__pager__prev--all js__tooltip" data-tooltip="先頭へ"></a></li><li><a href="javascript:void(0);" class="icon-list__pager btn__pager__prev js__tooltip" data-tooltip="前へ"></a></li><li class="btn__pager__current sys_current_page"></li><li><a href="javascript:void(0);" class="icon-list__pager btn__pager__next js__tooltip" data-tooltip="次へ"></a></li><li><a href="javascript:void(0);" class="icon-list__pager btn__pager__next--all js__tooltip" data-tooltip="最後へ"></a></li></ul><a href="javascript:void(0);" class="btn__color--radius parts__space--reset sys_upload_submit">選択画像で決定</a></div>');
	var mordalWindow = $("#" + modalWindowFlickrDomId);
	createTitle (mordalWindow);
	createImageSelectBox (mordalWindow);
}

function createTitle (mordalWindow) {
	mordalWindow.append ('<h3 class="heading--lg parts__space--add">画像を選択</h3>');
}

function createImageSelectBox (mordalWindow) {
	mordalWindow.append ('<div id="' + imgSelectBoxDomId + '" class="sys_img_select_box"><ul class="clearfix"></ul></div>');
}

//----------------フリッカーボタン関係------------------
function addFlickrButton () {
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
	//ボタンからフォーカスを外す
	$(this).blur() ;

	createOverlay ();

	//フェードイン
	$("#"+modalWindowFlickrDomId).fadeIn("slow");
	$("#"+overlayDomId).fadeIn("slow");

	//requestSearch(testAddress);

	centeringModalSyncer();
}

function createOverlay () {
	//新しくモーダルウィンドウを起動しない
	if($("#" + overlayDomId)[0]) {
		return false ;
	}

	//オーバーレイ用のHTMLコードを、[body]内の最後に生成する
	$("body").append('<div id="' + overlayDomId + '"></div>');

	$("#"+overlayDomId).click(onClickOverlay);
}

function onClickOverlay () {
	//フェードアウトさせる
	$("#"+overlayDomId+",#"+modalWindowFlickrDomId).fadeOut("slow",afterFadeOutOverlay);
}

function afterFadeOutOverlay () {
	//フェードアウト後、[#modal-overlay]をHTML(DOM)上から削除
	$("#"+overlayDomId).remove();
}

//センタリングをする関数
function centeringModalSyncer(){
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
	modalWindow.css({"top": pxtop + "px"});

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
		
		$("#"+imgSelectBoxDomId+">ul").append('<li class="js__images" data-isexteral style="cursor: pointer;"><img src="' + url + '" width="110"></li>');
		if (i > 10) break;
	}
}