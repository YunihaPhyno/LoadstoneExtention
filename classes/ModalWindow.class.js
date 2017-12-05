Debug.log("load:ModalWindow.class.js");

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

class ModalWindow extends DocumentObjectBase {
	// id : DOM id
	// parent : jquery object
	constructor (id, parent) {
		super (id);
		this.parent_ = parent;
		this.Create_ ();
	}

	Create_ () {
		this.root_ = this.parent_.append ('<div id="' + this.id_ + '"></div>');
		this.title_ = this.root.append ('<div id="' + this.id_ + "" + '"></div>');
	}
}
