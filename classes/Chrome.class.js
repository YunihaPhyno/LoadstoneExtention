Debug.log("load:Chrome.class.js");

class Chrome {

	static Request (values) {
		chrome.storage.sync.get(values, Chrome._OnLoad);
		this.flag = true;
	}


	static _Wait (time) {
		sleep(time).then(() => {
			if (this.flag){
				this.count++;
				return Chrome._Wait(time);
			} else {
				return;
			}
		});
	}
	static Wait () {
		this.count = 0;
		Debug.log ("Chrome.Wait:start");

		this._Wait(10);
		Debug.log(this.count);
		Debug.log ("Chrome.Wait:finished");
	}

	static _OnLoad (response) {
		Debug.log (response);
		this.response = response;
		this.flag = false;
	}	
}

function sleep(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}