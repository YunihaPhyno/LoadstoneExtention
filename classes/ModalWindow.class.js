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
		this.overlay = new ModalOverlay (this.root_,100009);
		this.overlay.FadeIn(); // test

		// タイトル
		//this.title_ = this.root.append ('<div id="' + this.id_ + "" + '"></div>');
	}

	CreateRoot_ () {
		this.parent_.append ('<div id="' + this.id_ + '"></div>');
		this.root_ = $(ID(this.id_));
	}
}

// like Abstruct Class
class ModalWindow {
	constructor (parent) {
		this.parent_ = parent;
	}

	CreateTitle_ (text) {
		mordalWindow.append ('<h3 class="heading--lg parts__space--add">' + text + '</h3>');
	}

	CreateBody_ () {

	}

	CreateFootter_ (){

	}
}

class ModalOverlay {
	// parent : jquery object
	constructor (parent,z_idx,max_opac = 0.6) {
		this.parent_ = parent;
		this.max_opacity_ = max_opac;
		this.Create_ (z_idx);

		// アニメーション登録
		this.root_.bind("click", {obj:this}, function (event){event.data.obj.FadeOut()});
	}

	Create_ (z_idx) {
		this.parent_.append ('<div class="modal_overlay" style="z-index: ' + z_idx + '; opacity: ' + this.max_opacity_ + '; display: none;"></div>');
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

	FadeIn () {
		this.root_.fadeIn("slow");
	}

	FadeOut () {
		this.root_.fadeOut("slow");
	}

}

