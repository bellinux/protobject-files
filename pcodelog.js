function convertToString(...values) {
    const visited = new Set();

    function stringify(value) {
        if (value === null) {
            return 'null';
        }

        if (visited.has(value)) {
            return '[Circular]';
        }

        switch (typeof value) {
            case 'undefined':
                return 'undefined';
            case 'boolean':
                return value ? 'true' : 'false';
            case 'number':
                return value.toString();
            case 'string':
                return `"${value}"`;
            case 'symbol':
                return value.toString();
            case 'bigint':
                return value.toString() + 'n';
            case 'function':
                return value.toString();
            case 'object':
                visited.add(value);
                if (Array.isArray(value)) {
                    return '[' + value.map(v => stringify(v)).join(', ') + ']';
                } else if (value instanceof Date) {
                    return value.toISOString();
                } else if (value instanceof Map) {
                    return 'Map(' + [...value.entries()].map(([k, v]) => `${stringify(k)} => ${stringify(v)}`).join(', ') + ')';
                } else if (value instanceof Set) {
                    return 'Set(' + [...value.values()].map(v => stringify(v)).join(', ') + ')';
                } else if (value instanceof Error) {
                    return `Error(${value.name}: ${value.message})`;
                } else {
                    return '{' + Object.entries(value).map(([k, v]) => `"${k}": ${stringify(v)}`).join(', ') + '}';
                }
            default:
                return String(value);
        }
    }

    return values.map(value => stringify(value)).join(', ');
}

setTimeout(() => {


// define a new console
var console=(function(oldCons){
    return {
        log: function(...t){
			txt=convertToString(...t);
			
            sendConsole({acc:'log', desc: txt, line: -1});
            // Your code
        },
        info: function (...t) {
			txt=convertToString(...t);
            sendConsole({acc:'inf', desc: txt, line: -1});
            // Your code
        },
        warn: function (...t) {
			txt=convertToString(t);
            sendConsole({acc:'war', desc: txt, line: -1});
            // Your code
        },
		error: function (...t) {
			txt=convertToString(...t);
            sendConsole({acc:'err', desc: txt, line: -1});
            // Your code
        },
		debug: function (...t) {
			txt=convertToString(...t);
            sendConsole({acc:'inf', desc: txt, line: -1});
            // Your code
        },
    };
}(window.console));
	alert("new console");
}, 1000);
//Then redefine the old console
window.console = console;


window.onerror = function(error, url, line) {
    //console.log({acc:'error', desc: error, line: line});
	sendConsole({acc:'err', desc: error, line: line});
	
};

function sendConsole(el){
	if (window.parent !== window) {
		window.parent.postMessage({ptjCnsle: el}, '*');
	}
}
