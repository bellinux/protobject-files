

var Protobject = {
	message: null,
	listenerActive: false,
	load: function(fileToLoad) {
        return new Promise((resolve, reject) => {
            var scriptToLoad = document.createElement('script');
            scriptToLoad.setAttribute('src', fileToLoad);
			scriptToLoad.type="module";
            scriptToLoad.onload = () => {
                console.log('script loaded');
                resolve();
            };
            scriptToLoad.onerror = () => reject(new Error(`Errore nel caricamento dello script: ${fileToLoad}`));

            document.head.appendChild(scriptToLoad);
        });
    },
	send: function(message) {
		this.message = message;
        return this; // Permettere la concatenazione
	}, 
	to: function(scriptName){
		
		if (this.message === null) {
            console.error('Messaggio non specificato.');
            return;
        }
		
		if (this.message instanceof Map)
			this.message = Object.fromEntries(this.message);
		
		if (window.parent !== window) {
			window.parent.postMessage({message: this.message, to: scriptName}, '*');
		} else {
			console.error('Il frame non ha un genitore accessibile.');
		}
		
		this.message = null;
		
	},
	
	callback: null,
	
	onReceived(callback){
		//return (ev)
		if (this.listenerActive==false){
			let thisCurrent=this;
			
			window.addEventListener('message', function(ev) {
				//console.log(ev);
					if (ev.data.hasOwnProperty("incoming")) {
						
						thisCurrent.receiveData(ev.data.incoming);
				
					} 
				
			}, false);
			this.listenerActive=true;
		}
			
		this.callback = callback;
			
		
		
	},
	
	receiveData(data) {
		if (this.callback && typeof this.callback === 'function') {
		  this.callback(data);
		}
	}
	
}


export default Protobject;

