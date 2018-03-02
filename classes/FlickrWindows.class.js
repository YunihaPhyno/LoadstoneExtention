// あくまでLODESTONE上で動作する
Debug.log("load:FlickrWindows.class.js");

class FlickrWindows extends DocumentObjectBase {
	// id : DOM id
	// parent : jquery object
	constructor (id, parent) {
		super (id);
		this.parent_ = parent;
	}

	CreateObjects (flickrId) {
		// ルートDOMの作成
		this.CreateRoot_ ();

		// オーバーレイの作成
		this.overlay_ = new ModalOverlay (this.root_,100022);

		// オーバーレイをクリックしたら閉じる
		this.overlay_.SetClickEvent({obj:this}, function (event){event.data.obj.FadeOut("slow")});

		// メインウィンドウの作成
		this.mainWindow_ = new FlickrImageSelectBox (flickrId,this.root_,"画像を選択");
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
	// @members
	// this.body_.imgBoxList = this.body_.children("ul").children("li");

	constructor (flickrId,parent,title) {
		super (parent,title);

		this.imgBoxRows = 4;
		this.imgBoxCols = 8;

		this.CreateTitle_ (title);
		this.CreateBody_ ();
		this.CreateFooter_ ();

		// FlickrApiの初期化
		this.flickrApi = new FlickrApi (flickrId, this.imgBoxRows * this.imgBoxCols);

		// 常に水平センタリング
		$(window).bind("resize", {obj:this}, function (event){event.data.obj.HorizontalAlignCenterOnce();});
	}

	CreateBody_() {
		super.CreateBody_ ();
		this.body_.append('<ul class="modal_window_body" style="margin-left: ' + ((1000 - 120 * this.imgBoxCols) / 2) + 'px;"></ul>');
		var body_ul = this.body_.children ("ul");
		for (var i = 0, length = this.imgBoxRows*this.imgBoxCols; i < length; i++) {
			body_ul.append ('<li name="' + i + '" class=""><img class=""></li>');

			// コールバックでthisが呼び出せないのでselfで呼び出せるようにする
			var self = this;
			body_ul.children("li[name="+ i +"]").bind("click", {self:this}, FlickrImageSelectBox.OnClickBox);
		}
		this.body_.imgBoxList = this.body_.children("ul").children("li");
	}

	CreateFooter_ () {
		this.pager_ = new ModalPager (this.root_,this.Reload.bind(this));
	}

	Reload (pageNum) {
		this.Clear ();
		this.flickrApi.Request (pageNum,this.OnloadCallback_.bind(this));
	}

	Clear () {
		for (var i = 0; i < this.body_.imgBoxList.length; i++) {
			var curr = $(this.body_.imgBoxList[i]).children('img');
			curr.attr('src',"");
		}
	}

	OnloadCallback_ (xmldata) {
		var imageUrls = FlickrApi.Xml2UrlArray (xmldata);
		this.SetImages_ (imageUrls);
		this.SyncUploadFileList();
		this.pager_.SetPage (Number(xmldata.getElementsByTagName('photos')[0].getAttribute('page')),Number(xmldata.getElementsByTagName('photos')[0].getAttribute('pages')));
	}

	SetImages_ (imageUrls) {
		for (var i = 0; i < this.body_.imgBoxList.length; i++) {
			var curr = $(this.body_.imgBoxList[i]).children('img');
			if (i < imageUrls.length) {
				curr.attr('src',imageUrls[i]);
			} else {
				curr.attr('src',"");
			}
		}
	}

	//アップロードファイルリストと同期をとる
	SyncUploadFileList () {
		var selectBoxList = this.body_.imgBoxList;
		for (var i = 0; i < selectBoxList.length; i++) {
			var selectBox = $(selectBoxList[i]);
			var url = selectBox.children('img').attr('src');
			$(selectBox).attr("class", "");
			if (FlickrImageSelectBox.IsListed(url)) {
				$(selectBox).attr("class", "flame check");	
			}
		}
	}

	// -------- static Methods --------
	// クリックされたときのコールバック
	// @param this:クリックされたオブジェクト
	// @param self:コールバック登録時にバインドされたthis
	static OnClickBox (event) {
		var selectBox = $(this);
		selectBox.blur();
		var id = Number(selectBox.attr("name"));
		var url = selectBox.children("img").attr("src");

		if (!FlickrImageSelectBox.IsListed(url)) {	//同期がちゃんととれていれば選択されていないときclassは空になる
			FlickrImageSelectBox.AddImage (url);
		} else {
			FlickrImageSelectBox.RemoveImage (url);
		}

		event.data.self.SyncUploadFileList();
	}

	static AddImage (url) {
		Debug.log("add:"+url);
		//テキストボックスにurlを追加して「参照」ボタンを押す
		$("#external_file_uri").val(url);
		$("#external_file_select").click();
	}

	static RemoveImage (url) {
		Debug.log("remove:"+url);
		//urlがあるリストアイテムの「×」ボタンを押す
		var uploadFileList = $("#sys_upload__status>ul");
		for (var i = 0; i < uploadFileList.length; i++) {
			if (uploadFileList[i].childNodes[1].innerHTML == url) {
				uploadFileList[i].childNodes[3].childNodes[0].click();
			}
		}
	}

	static IsListed (url) {
		var uploadFileList = $("#sys_upload__status>ul");
		for (var i = 0; i < uploadFileList.length; i++) {
			if (uploadFileList[i].childNodes[1].innerHTML == url) {
				return true;
			}
		}
		return false;
	}
}