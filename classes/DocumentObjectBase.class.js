// あくまでLODESTONE上で動作する
Debug.log("load:DocumentObjectBase.class.js");

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