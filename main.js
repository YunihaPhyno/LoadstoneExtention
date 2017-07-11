(window.onload = main);
var btnFlickrDOMId = "ButtonFlickr";
var modalWindowFlickrDomId = "modal-content";



function main () {
	addFlickrButton ();
	
	console.log ();
	var userId = "152412377@N03";
	var testAddress = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=7633b48cbee42b2fed0aa22b08ea8b3c&user_id=152412377%40N03&format=rest";

	$("body").append('<div id="' + modalWindowFlickrDomId + '" style="opacity: 1; position: absolute; top: 166px; left: 642.5px;"><p>「閉じる」か「背景」をクリックするとモーダルウィンドウを終了します。</p><p><a id="modal-close" class="button-link">閉じる</a></p></div>');
	
	createModalContentWindow();
}

function createModalContentWindow () {
	$("body").append('<div id="' + modalWindowFlickrDomId + '" style="opacity: 1; position: absolute; top: 166px; left: 642.5px;"></div>');
	
	var mordalWindow = $("#" + modalWindowFlickrDomId);
	mordalWindow.append ('<h3 class="heading--lg parts__space--add">画像を選択</h3>');

	var imgSelectBoxDomId = "img_select_box_flickr";
	mordalWindow.append ('<div id="' + imgSelectBoxDomId + '" class="sys_img_select_box"></div>');
	var imgSelectBox = mordalWindow.children("#" + imgSelectBoxDomId);
	imgSelectBox.append('<ul class="upload__list clearfix sys__upload__list"></ul>');
	requestSearch(testAddress);
}

function addFlickrButton () {
	var title = $("#img_select");
	if (title == undefined) {
		setTimeout(testloop,1000);
	}
	$('<ul><li><a href="javascript:void(0);" class="btn__color--radius" id=' + btnFlickrDOMId + '>Flickr画像を参照</a></li></ul>').insertAfter('#container>ul');
	var btnFlickr = document.getElementById(btnFlickrDOMId);
	btnFlickr.addEventListener("click", onClickButtonFlickr, false);
}

function onClickButtonFlickr () {
	$(this).blur() ;	//ボタンからフォーカスを外す
	if($("#modal-overlay")[0]) return false ;		//新しくモーダルウィンドウを起動しない [下とどちらか選択]

	//オーバーレイ用のHTMLコードを、[body]内の最後に生成する
	$("body").append('<div id="modal-overlay"></div>');

	//[$modal-overlay]をフェードインさせる
	$("#modal-content").fadeIn("slow");
	$("#modal-overlay").fadeIn("slow");

	centeringModalSyncer();

	$("#modal-overlay,#modal-close").unbind().click(function(){
		//[#modal-overlay]と[#modal-close]をフェードアウトする
		$("#modal-content,#modal-overlay").fadeOut("slow",function(){
			//フェードアウト後、[#modal-overlay]をHTML(DOM)上から削除
			$("#modal-overlay").remove();
		});
	});
}



//センタリングをする関数
function centeringModalSyncer(){

	//画面(ウィンドウ)の幅を取得し、変数[w]に格納
	var w = $(window).width();

	//画面(ウィンドウ)の高さを取得し、変数[h]に格納
	var h = $(window).height();

	//コンテンツ(#modal-content)の幅を取得し、変数[cw]に格納
	var cw = $("#modal-content").outerWidth({margin:true});

	//コンテンツ(#modal-content)の高さを取得し、変数[ch]に格納
	var ch = $("#modal-content").outerHeight({margin:true});

	//コンテンツ(#modal-content)を真ん中に配置するのに、左端から何ピクセル離せばいいか？を計算して、変数[pxleft]に格納
	var pxleft = ((w - cw)/2);

	//コンテンツ(#modal-content)を真ん中に配置するのに、上部から何ピクセル離せばいいか？を計算して、変数[pxtop]に格納
	var pxtop = ((h - ch)/2);

	//[#modal-content]のCSSに[left]の値(pxleft)を設定
	$("#modal-content").css({"left": pxleft + "px"});

	//[#modal-content]のCSSに[top]の値(pxtop)を設定
	$("#modal-content").css({"top": pxtop + "px"});

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

	$("#"+modalWindowFlickrDomId).append('<ul class="upload__list clearfix sys__upload__list"></ul>');
	for (var i = 0, count = photos.length; i < count; i++) {

		var farmId = photos[i].getAttribute('farm');
		var serverId = photos[i].getAttribute('server');
		var id = photos[i].getAttribute('id');
		var secret = photos[i].getAttribute('secret');

		var url = "http://farm" + farmId + ".staticflickr.com/"+ serverId +"/" + id + "_"+ secret +".jpg";
		var image = new Image();
		console.log(url);
		image.src = url;
		
		$("#"+modalWindowFlickrDomId+">ul").append('<li class="js__images" data-uri="' + url + '" data-isexteral style="cursor: pointer;"><img src="' + url + '"></li>');
		if (i > 10) break;
	}
}