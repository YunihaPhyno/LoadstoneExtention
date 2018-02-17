// あくまでLODESTONE上で動作する
Debug.log("load:DocumentObjectBase.class.js");

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