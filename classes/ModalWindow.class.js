// あくまでLODESTONE上で動作する
Debug.log("load:ModalWindow.class.js");

function ID (id) {
	return "#" + id;
}

// like Abstruct Class
class DocumentObjectBase {

	// id : DOM id
	constructor (id) {
		this.id_ = id;
	}

	GetId () {
		return this.id_;
	}
}

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

	FadeIn (option, callBack) {
		Debug.log (option);
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
}

// like Abstruct Class
class ModalWindow {
	constructor (parent,title) {
		this.parent_ = parent;

		this.CreateRoot_ ();
	}

	CreateRoot_ () {
		this.parent_.append ('<div class="modal_window sys_img_select_box" style="z-index: 100022; display:none;"></div>');
		this.root_ = this.parent_.children (".modal_window");
	}

	CreateTitle_ (text) {
		this.root_.append ('<h3 class="modal_window_title heading--lg parts__space--add">' + text + '</h3>');
		this.title_ = this.root_.children (".modal_window_title");
	}

	CreateBody_() {
		this.root_.append ('<div class="modal_window_body"></div>');
		this.body_ = this.root_.children (".modal_window_body");
	}

	CreateFootter_ (){}

	HorizontalAlignCenterOnce () {
		var window_obj = $(window);
		var window_width = window_obj.width ();
		
		var mordal_width = this.root_.outerWidth ();
		
		var center = (window_width - mordal_width) / 2;
		this.root_.css("left", center + "px");
	}

	VerticalAlignTopOnce () {
		var center = $(window).scrollTop();
		this.root_.css("top", center + "px");
	}

	FadeOut (option, callBack) {
		Debug.log(option);
		this.root_.fadeOut(option,callBack);
	}

	FadeIn (option, callBack) {
		this.root_.fadeIn(option, callBack);
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

		// 常に水平センタリング
		$(window).bind("resize", {obj:this}, function (event){event.data.obj.HorizontalAlignCenterOnce();})
	}

	CreateBody_() {
		super.CreateBody_ ();
		this.body_.append('<ul class="modal_window_body" style="margin-left: ' + ((1000 - 120 * this.imgBoxCols) / 2) + 'px;"></ul>');
		var body_ul = this.body_.children ("ul");
		for (var i = 0, length = this.imgBoxRows*this.imgBoxCols; i < length; i++) {
			body_ul.append ('<li name="' + i + '"></li>');
			//body_ul.children("li[name="+ i +"]").click(onClickImgSelectBox);
		}
	}

	CreateFootter_ () {
		this.pager_ = new ModalPager (this.root_);
	}
}

//ModalWindowの内部で使うクラス
class ModalPager {
	constructor (parent) {
		Debug.log (parent);
		this.parent_ = parent;
		this.Create_ ();
	}

	Create_ () {
		this.parent_.append ('<div><ul class="btn__pager sys_upload_pager"></ul></div>');
		this.root_ = this.parent_.children("div").children (".btn__pager");
		this.AddButton ("prev--all","先頭へ");
		this.AddButton ("prev","前へ");
		this.root_.append('<li class="btn__pager__current sys_current_page" page_num=0 page_max=0>0ページ / 0ページ</li>');
		this.AddButton ("next","次へ");
		this.AddButton ("next--all","最後へ");

	}

	AddButton (btnName,text) {
		//Debug.log (btnName + ":" + text);
		this.root_.append('<li><a href="javascript:void(0);" class="icon-list__pager btn__pager__' + btnName + ' js__tooltip" data-tooltip="' + text + '"></a></li>');
		//pager.ul.li.children(".btn__pager__" + btnName).click({type : btnName},onClickBtnPager);
	}

}

//ModalWindowの背後において画面を暗くする透過スクリーン
class ModalOverlay {
	// parent : jquery object
	// z_idx : cssのz-index
	// max_opac : 最大透過度
	constructor (parent,z_idx,max_opac = 0.6) {
		this.parent_ = parent;
		this.max_opacity_ = max_opac;
		this.Create_ (z_idx);
	}

	Create_ (z_idx) {
		this.parent_.append ('<div class="modal_overlay" style="z-index: ' + z_idx + '; opacity: ' + this.max_opacity_ + '; display:none;"></div>');
		this.root_ = this.parent_.children (".modal_overlay");
	}

	SetClickEvent (objects,callBack) {
		this.root_.bind ("click", objects, callBack);
	}

	FadeOut (option, callBack) {
		this.root_.fadeOut(option,callBack);
	}

	FadeIn (option, callBack) {
		this.root_.fadeIn(option, callBack);
	}

}

