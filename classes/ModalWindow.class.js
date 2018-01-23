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
		this.overlay_ = new ModalOverlay (this.root_,100009);

		// メインウィンドウの作成
		this.mainWindow_ = new FlickrImageSelectBox (this.root_,"画像を選択");

		this.root_.fadeIn("slow"); // test
	}

	CreateRoot_ () {
		this.parent_.append ('<div id="' + this.id_ + '" style="display:none;"></div>');
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
		this.parent_.append ('<div class="modal_window"></div>');
		this.root_ = this.parent_.children(".modal_window");
	}

	CreateTitle_ (text) {
		this.root_.append ('<h3 class="modal_window_title heading--lg parts__space--add">' + text + '</h3>');
		this.title_ = this.root_.children (".modal_window_title");
	}

	CreateBody_() {
		this.root_.append ('<div class="modal_window_body"></div>');
		this.body_ = this.root_.children (".modal_window_body");
	}

	CreateFootter_ (){

	}
}

class FlickrImageSelectBox extends ModalWindow {
	constructor (parent,title) {
		super (parent,title);

		this.imgBoxRows = 4;
		this.imgBoxCols = 8;

		this.CreateTitle_ (title);
		this.CreateBody_();

	}

	CreateBody_() {
		super.CreateBody_ ();
		this.body_.append('<ul style="margin-left: ' + ((1000 - 120 * this.imgBoxCols) / 2) + 'px;"></ul>');
		var body_ul = this.body_.children ("ul");
		for (var i = 0, length = this.imgBoxRows*this.imgBoxCols; i < length; i++) {
			body_ul.append ('<li name="' + i + '"></li>');
			//body_ul.children("li[name="+ i +"]").click(onClickImgSelectBox);
		}
	}
}

class ModalOverlay {
	// parent : jquery object
	constructor (parent,z_idx,max_opac = 0.6) {
		this.parent_ = parent;
		this.max_opacity_ = max_opac;
		this.Create_ (z_idx);

		// アニメーション登録
		this.root_.bind("click", {obj:this.parent_}, function (event){event.data.obj.fadeOut("slow")});
	}

	Create_ (z_idx) {
		this.parent_.append ('<div class="modal_overlay" style="z-index: ' + z_idx + '; opacity: ' + this.max_opacity_ + ';"></div>');
		this.root_ = this.parent_.children (".modal_overlay");
		Debug.log (this.root_);
	}

	SetActive_ (flag) {
		if (flag) {
			this.root_.css ("visibility", "visible");
		} 

		else {
			
		}
	}
}

