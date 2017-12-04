Debug.log("load:ModalWindow.class.js");

// like Abstruct Class
class DocumentObjectBase {

	constructor (id) {
		this.id_ = id;
	}

	GetId () {
		return this.id_;
	}
}

class ModalWindow extends DocumentObjectBase {
	constructor (id, parent) {
		super (id);
	}
}
