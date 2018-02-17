// あくまでLODESTONE上で動作する
Debug.log("load:ModalWindow.class.js");

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
		this.root_.fadeOut(option,callBack);
	}

	FadeIn (option, callBack) {
		this.root_.fadeIn(option, callBack);
	}
}

//ModalWindowの内部で使うクラス
class ModalPager {
	constructor (parent,reloadFunc) {
		this.parent_ = parent;
		this.reloadFunc_ = reloadFunc;

		this.Create_ ();

		this.currentPageNum_ = 0;
		this.maxPages_ = 0;
	}

	Create_ () {
		this.parent_.append ('<div><ul class="btn__pager sys_upload_pager"></ul></div>');
		this.root_ = this.parent_.children("div").children (".btn__pager");

		this.buttons = new Object ();
		this.buttons.prevAll = this.AddButton_ ("prev--all","先頭へ");
		this.buttons.prev = this.AddButton_ ("prev","前へ");
		
		this.root_.append('<li class="btn__pager__current sys_current_page" page_num=0 page_max=0>0ページ / 0ページ</li>');
		this.display = this.root_.children('.btn__pager__current');

		this.buttons.next = this.AddButton_ ("next","次へ");
		this.buttons.nextAll = this.AddButton_ ("next--all","最後へ");
	}

	AddButton_ (btnName,text) {
		this.root_.append('<li><a href="javascript:void(0);" class="icon-list__pager btn__pager__' + btnName + ' js__tooltip" data-tooltip="' + text + '"></a></li>');
		this.root_.children('li').children(".btn__pager__" + btnName).click({type : btnName, reloadFunc : this.reloadFunc_, self:this},this.OnClick);
		return this.root_.children('li').children(".btn__pager__" + btnName);
	}

	OnClick (event) {
		var currNum = event.data.self.currentPageNum_;
		var maxNum = event.data.self.maxPages_;
		switch (event.data.type) {
		case "prev--all":
			event.data.reloadFunc (1);
			break;
		case "prev":
			event.data.reloadFunc (currNum - 1);
			break;
		case "next":
			event.data.reloadFunc (currNum + 1);
			break;
		case "next--all":
			event.data.reloadFunc (maxNum);
			break;
		default:
			Debug.log ("unknown type : " + event.data.type);
			break;
		}
	}

	SetPage (pageNum, maxPages) {
		this.currentPageNum_ = pageNum;
		this.maxPages_ = maxPages;
		this.Update_ ();
	}

	Update_ () {
		this.display.text(String(this.currentPageNum_) + "ページ / " + String(this.maxPages_) + "ページ");
		this.UpdateButtonsStyle ();
	}

	UpdateButtonsStyle () {
		if (this.currentPageNum_ == 1) {
			this.buttons.prevAll.attr("class", "icon-list__pager btn__pager__prev--all js__tooltip btn__pager__no");
			this.buttons.prev.attr("class", "icon-list__pager btn__pager__prev js__tooltip btn__pager__no");
		} else {
			this.buttons.prevAll.attr("class", "icon-list__pager btn__pager__prev--all js__tooltip");
			this.buttons.prev.attr("class", "icon-list__pager btn__pager__prev js__tooltip");
		}

		if (this.currentPageNum_ == this.maxPages_) {
			this.buttons.nextAll.attr("class", "icon-list__pager btn__pager__next--all js__tooltip btn__pager__no");
			this.buttons.next.attr("class", "icon-list__pager btn__pager__next js__tooltip btn__pager__no");
		} else {
			this.buttons.nextAll.attr("class", "icon-list__pager btn__pager__next--all js__tooltip");
			this.buttons.next.attr("class", "icon-list__pager btn__pager__next js__tooltip");
		}
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

