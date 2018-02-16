// あくまでLODESTONE上で動作する
Debug.log("load:FlickrWindows.class.js");

class FlickrWindows extends DocumentObjectBase {
	// id : DOM id
	// parent : jquery object
	constructor (id, parent) {
		super (id);
		this.parent_ = parent;
		this.CreateObjects_ ();
	}

	CreateObjects_ () {
		// ルートDOMの作成
		this.CreateRoot_ ();

		// オーバーレイの作成
		this.overlay_ = new ModalOverlay (this.root_,100022);

		// オーバーレイをクリックしたら閉じる
		this.overlay_.SetClickEvent({obj:this}, function (event){event.data.obj.FadeOut("slow")});

		// メインウィンドウの作成
		this.mainWindow_ = new FlickrImageSelectBox (this.root_,"画像を選択");
	}

	// FlickrWindowsをfadeinするとなんか変な感じになる
	FadeIn_ (option, callBack) {
		this.overlay_.FadeIn(option);
		this.mainWindow_.FadeIn(option, callBack);//コールバックは一回だけ呼ばれる
		this.mainWindow_.HorizontalAlignCenterOnce ();
		this.mainWindow_.VerticalAlignTopOnce ();
	}

	FadeOut (option, callBack) {
		this.overlay_.FadeOut(option);
		this.mainWindow_.FadeOut(option, callBack);
	}

	CreateRoot_ () {
		this.parent_.append ('<div id="' + this.id_ + '"></div>');
		this.root_ = $(ID(this.id_));
	}

	Open () {
		this.FadeIn_("slow");
		this.mainWindow_.Reload (1);
	}
}



class FlickrImageSelectBox extends ModalWindow {
	constructor (parent,title) {
		super (parent,title);

		this.imgBoxRows = 4;
		this.imgBoxCols = 8;

		this.CreateTitle_ (title);
		this.CreateBody_ ();
		this.CreateFootter_ ();

		// FlickrApiの初期化
		this.flickrApi = new FlickrApi ("152412377@N03",8 * 4);

		// 常に水平センタリング
		$(window).bind("resize", {obj:this}, function (event){event.data.obj.HorizontalAlignCenterOnce();});
	}

	CreateBody_() {
		super.CreateBody_ ();
		this.body_.append('<ul class="modal_window_body" style="margin-left: ' + ((1000 - 120 * this.imgBoxCols) / 2) + 'px;"></ul>');
		var body_ul = this.body_.children ("ul");
		for (var i = 0, length = this.imgBoxRows*this.imgBoxCols; i < length; i++) {
			body_ul.append ('<li name="' + i + '" class="js__images"><img class=></li>');
			//body_ul.children("li[name="+ i +"]").click(onClickImgSelectBox);
		}
		this.body_.imgBoxList = this.body_.children("ul").children("li");
	}

	CreateFootter_ () {
		this.pager_ = new ModalPager (this.root_);
	}

	Reload (pageNum) {
		this.flickrApi.Request (pageNum,this.OnloadCallback_.bind(this));
	}

	OnloadCallback_ (xmldata) {
		var imageUrls = this.Xml2UrlArray_ (xmldata);
		this.SetImages_ (imageUrls);

		for (var i = 0; i < this.body_.imgBoxList.length; i++) {
			var curr = $(this.body_.imgBoxList[i]).children('img');
			if (i < imageUrls.length) {
				curr.attr('src',imageUrls[i]);
			} else {
				curr.attr('src',"");
			}
		}
	}

	SetImages_ (imageUrls) {
		Debug.log (this.body_.imgBoxList);

	}

	GetFlickrImgUrl (photo) {
		return "http://farm" + photo.getAttribute('farm') + ".staticflickr.com/"+ photo.getAttribute('server') +"/" + photo.getAttribute('id') + "_"+ photo.getAttribute('secret') +"_h.jpg";
	}

	Xml2UrlArray_ (xmldata) {
		var photos = xmldata.getElementsByTagName('photo');
		var urlArray = new Array (photos.length);
		for (var i = 0; i < urlArray.length; i++) {
			urlArray [i] = this.GetFlickrImgUrl (photos[i]);
		}

		return urlArray;
	}

}