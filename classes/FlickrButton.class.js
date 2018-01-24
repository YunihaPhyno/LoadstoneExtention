Debug.log("load:FlickrButton.class.js");



// like abstract class
class LodestoneButtonBase {
	constructor (parent,text) {
		this.parent_ = parent;
		this.Create_ (text);
	}

	Create_ (text) {
		this.parent_.append('<li><a href="javascript:void(0);" class="btn__color--radius">' + text + '</a></li>');
		var li = this.parent_.children('li');
		this.root_ = $(li[li.length - 1]); // appendでliの一番最後に要素を追加したからそれを取得
	}

	SetClickEvent (objects,callBack) {
		this.root_.bind ("click", objects, callBack);
	}
}

class FlickrButton extends LodestoneButtonBase {
	constructor () {
		super($('#container>ul.upload__btn-2'),"Flickr画像を参照");
		this.HorizontalAlignCenterOnce ();
	}

	HorizontalAlignCenterOnce () {
		this.root_.css("margin-left", (this.parent_.width() - this.root_.width()) / 2 + "px");
	}
}