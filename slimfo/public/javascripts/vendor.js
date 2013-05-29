(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.brunch = true;
})();

// Console-polyfill. MIT license.
// https://github.com/paulmillr/console-polyfill
// Make it safe to do console.log() always.
(function (con) {
  var method;
  var dummy = function() {};
  var methods = ('assert,count,debug,dir,dirxml,error,exception,group,' +
     'groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,' +
     'time,timeEnd,trace,warn').split(',');
  while (method = methods.pop()) {
    con[method] = con[method] || dummy;
  }
})(window.console = window.console || {});
;
/*!
 * jQuery JavaScript Library v1.9.1
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2012 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-2-4
 */
(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<9
	// For `typeof node.method` instead of `node.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,
	location = window.location,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.9.1",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				args = args || [];
				args = [ context, args.slice ? args.slice() : args ];
				if ( list && ( !fired || stack ) ) {
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function() {

	var support, all, a,
		input, select, fragment,
		opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Support tests won't run in some limited or non-browser environments
	all = div.getElementsByTagName("*");
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !all || !a || !all.length ) {
		return {};
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";
	support = {
		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: div.firstChild.nodeType === 3,

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: a.getAttribute("href") === "/a",

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.5/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
		checkOn: !!input.value,

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Tests for enctype support on a form (#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

		// jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode
		boxModel: document.compatMode === "CSS1Compat",

		// Will be defined later
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true,
		boxSizingReliable: true,
		pixelPosition: false
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP), test/csp.php
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
		support.boxSizing = ( div.offsetWidth === 4 );
		support.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== 1 );

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})();

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, ret,
		internalKey = jQuery.expando,
		getByName = typeof name === "string",

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && getByName && data === undefined ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			elem[ internalKey ] = id = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		cache[ id ] = {};

		// Avoids exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		if ( !isNode ) {
			cache[ id ].toJSON = jQuery.noop;
		}
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( getByName ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var i, l, thisCache,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			for ( i = 0, l = name.length; i < l; i++ ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			elem = this[0],
			i = 0,
			data = null;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( !name.indexOf( "data-" ) ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return jQuery.access( this, function( value ) {

			if ( value === undefined ) {
				// Try to fetch any internally stored data first
				return elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
			}

			this.each(function() {
				jQuery.data( this, key, value );
			});
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		hooks.cur = fn;
		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	rboolean = /^(?:checked|selected|autofocus|autoplay|async|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val,
				self = jQuery(this);

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, notxml, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && notxml && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && notxml && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			// In IE9+, Flash objects don't have .getAttribute (#12945)
			// Support: IE9+
			if ( typeof elem.getAttribute !== core_strundefined ) {
				ret =  elem.getAttribute( name );
			}

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( rboolean.test( name ) ) {
					// Set corresponding property to false for boolean attributes
					// Also clear defaultChecked/defaultSelected (if appropriate) for IE<8
					if ( !getSetAttribute && ruseDefault.test( name ) ) {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					} else {
						elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		var
			// Use .prop to determine if this attribute is understood as boolean
			prop = jQuery.prop( elem, name ),

			// Fetch it accordingly
			attr = typeof prop === "boolean" && elem.getAttribute( name ),
			detail = typeof prop === "boolean" ?

				getSetInput && getSetAttribute ?
					attr != null :
					// oldIE fabricates an empty string for missing boolean attributes
					// and conflates checked/selected into attroperties
					ruseDefault.test( name ) ?
						elem[ jQuery.camelCase( "default-" + name ) ] :
						!!attr :

				// fetch an attribute node for properties not recognized as boolean
				elem.getAttributeNode( name );

		return detail && detail.value !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};

// fix oldIE value attroperty
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return jQuery.nodeName( elem, "input" ) ?

				// Ignore the value *property* by using defaultValue
				elem.defaultValue :

				ret && ret.specified ? ret.value : undefined;
		},
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ( name === "id" || name === "name" || name === "coords" ? ret.value !== "" : ret.specified ) ?
				ret.value :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret == null ? undefined : ret;
			}
		});
	});

	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		event.isTrigger = true;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			for ( ; cur != this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			}
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== document.activeElement && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === document.activeElement && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
/*!
 * Sizzle CSS Selector Engine
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://sizzlejs.com/
 */
(function( window, undefined ) {

var i,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	hasDuplicate,
	outermostContext,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsXML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,
	sortOrder,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	support = {},
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Array methods
	arr = [],
	pop = arr.pop,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},


	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	operators = "([*^$|!~]?=)",
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:" + operators + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*" ),
	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"NAME": new RegExp( "^\\[name=['\"]?(" + characterEncoding + ")['\"]?\\]" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rsibling = /[\x20\t\r\n\f]*[+~]/,

	rnative = /^[^{]+\{\s*\[native code/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,
	rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = /\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g,
	funescape = function( _, escaped ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		return high !== high ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Use a stripped-down slice if we can't use a native one
try {
	slice.call( preferredDoc.documentElement.childNodes, 0 )[0].nodeType;
} catch ( e ) {
	slice = function( i ) {
		var elem,
			results = [];
		while ( (elem = this[i++]) ) {
			results.push( elem );
		}
		return results;
	};
}

/**
 * For feature detection
 * @param {Function} fn The function to test for native support
 */
function isNative( fn ) {
	return rnative.test( fn + "" );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var cache,
		keys = [];

	return (cache = function( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	});
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return fn( div );
	} catch (e) {
		return false;
	} finally {
		// release memory in IE
		div = null;
	}
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( !documentIsXML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, slice.call(context.getElementsByTagName( selector ), 0) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getByClassName && context.getElementsByClassName ) {
				push.apply( results, slice.call(context.getElementsByClassName( m ), 0) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && !rbuggyQSA.test(selector) ) {
			old = true;
			nid = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results, slice.call( newContext.querySelectorAll(
						newSelector
					), 0 ) );
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsXML = isXML( doc );

	// Check if getElementsByTagName("*") returns only elements
	support.tagNameNoComments = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if attributes should be retrieved by attribute nodes
	support.attributes = assert(function( div ) {
		div.innerHTML = "<select></select>";
		var type = typeof div.lastChild.getAttribute("multiple");
		// IE8 returns a string for some attributes even when not present
		return type !== "boolean" && type !== "string";
	});

	// Check if getElementsByClassName can be trusted
	support.getByClassName = assert(function( div ) {
		// Opera can't find a second classname (in 9.6)
		div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>";
		if ( !div.getElementsByClassName || !div.getElementsByClassName("e").length ) {
			return false;
		}

		// Safari 3.2 caches class attributes and doesn't catch changes
		div.lastChild.className = "e";
		return div.getElementsByClassName("e").length === 2;
	});

	// Check if getElementById returns elements by name
	// Check if getElementsByName privileges form controls or returns elements by ID
	support.getByName = assert(function( div ) {
		// Inject content
		div.id = expando + 0;
		div.innerHTML = "<a name='" + expando + "'></a><div name='" + expando + "'></div>";
		docElem.insertBefore( div, docElem.firstChild );

		// Test
		var pass = doc.getElementsByName &&
			// buggy browsers will return fewer than the correct 2
			doc.getElementsByName( expando ).length === 2 +
			// buggy browsers will return more than the correct 0
			doc.getElementsByName( expando + 0 ).length;
		support.getIdNotName = !doc.getElementById( expando );

		// Cleanup
		docElem.removeChild( div );

		return pass;
	});

	// IE6/7 return modified attributes
	Expr.attrHandle = assert(function( div ) {
		div.innerHTML = "<a href='#'></a>";
		return div.firstChild && typeof div.firstChild.getAttribute !== strundefined &&
			div.firstChild.getAttribute("href") === "#";
	}) ?
		{} :
		{
			"href": function( elem ) {
				return elem.getAttribute( "href", 2 );
			},
			"type": function( elem ) {
				return elem.getAttribute("type");
			}
		};

	// ID find and filter
	if ( support.getIdNotName ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && !documentIsXML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && !documentIsXML ) {
				var m = context.getElementById( id );

				return m ?
					m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ?
						[m] :
						undefined :
					[];
			}
		};
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.tagNameNoComments ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Name
	Expr.find["NAME"] = support.getByName && function( tag, context ) {
		if ( typeof context.getElementsByName !== strundefined ) {
			return context.getElementsByName( name );
		}
	};

	// Class
	Expr.find["CLASS"] = support.getByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && !documentIsXML ) {
			return context.getElementsByClassName( className );
		}
	};

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21),
	// no need to also add to buggyMatches since matches checks buggyQSA
	// A support test would require too much code (would include document ready)
	rbuggyQSA = [ ":focus" ];

	if ( (support.qsa = isNative(doc.querySelectorAll)) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explictly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// IE8 - Some boolean attributes are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Opera 10-12/IE8 - ^= $= *= and empty values
			// Should not select anything
			div.innerHTML = "<input type='hidden' i=''/>";
			if ( div.querySelectorAll("[i^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:\"\"|'')" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = isNative( (matches = docElem.matchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.webkitMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = new RegExp( rbuggyMatches.join("|") );

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = isNative(docElem.contains) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {
		var compare;

		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( (compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b )) ) {
			if ( compare & 1 || a.parentNode && a.parentNode.nodeType === 11 ) {
				if ( a === doc || contains( preferredDoc, a ) ) {
					return -1;
				}
				if ( b === doc || contains( preferredDoc, b ) ) {
					return 1;
				}
				return 0;
			}
			return compare & 4 ? -1 : 1;
		}

		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	// Always assume the presence of duplicates if sort doesn't
	// pass them to our comparison function (as in Google Chrome).
	hasDuplicate = false;
	[0, 0].sort( sortOrder );
	support.detectDuplicates = hasDuplicate;

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	// rbuggyQSA always contains :focus, so no need for an existence check
	if ( support.matchesSelector && !documentIsXML && (!rbuggyMatches || !rbuggyMatches.test(expr)) && !rbuggyQSA.test(expr) ) {
		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	var val;

	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	if ( !documentIsXML ) {
		name = name.toLowerCase();
	}
	if ( (val = Expr.attrHandle[ name ]) ) {
		return val( elem );
	}
	if ( documentIsXML || support.attributes ) {
		return elem.getAttribute( name );
	}
	return ( (val = elem.getAttributeNode( name )) || elem.getAttribute( name ) ) && elem[ name ] === true ?
		name :
		val && val.specified ? val.value : null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

// Document sorting and removing duplicates
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		i = 1,
		j = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		for ( ; (elem = results[i]); i++ ) {
			if ( elem === results[ i - 1 ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && ( ~b.sourceIndex || MAX_NEGATIVE ) - ( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

// Returns a function to use in pseudos for input types
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

// Returns a function to use in pseudos for buttons
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

// Returns a function to use in pseudos for positionals
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[4] ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeName ) {
			if ( nodeName === "*" ) {
				return function() { return true; };
			}

			nodeName = nodeName.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
			};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( elem.className || (typeof elem.getAttribute !== strundefined && elem.getAttribute("class")) || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifider
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsXML ?
						elem.getAttribute("xml:lang") || elem.getAttribute("lang") :
						elem.lang) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push( {
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			} );
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,
					type: type,
					matches: match
				} );
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector( tokens.slice( 0, i - 1 ) ).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					context.nodeType === 9 && !documentIsXML &&
					Expr.relative[ tokens[1].type ] ) {

				context = Expr.find["ID"]( token.matches[0].replace( runescape, funescape ), context )[0];
				if ( !context ) {
					return results;
				}

				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, slice.call( seed, 0 ) );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		documentIsXML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// Deprecated
Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Easy API for creating new setFilters
function setFilters() {}
Expr.filters = setFilters.prototype = Expr.pseudos;
Expr.setFilters = new setFilters();

// Initialize with the default document
setDocument();

// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
var runtil = /Until$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	isSimple = /^.[^:#\[\.,]*$/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i, ret, self,
			len = this.length;

		if ( typeof selector !== "string" ) {
			self = this;
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		ret = [];
		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, this[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = ( this.selector ? this.selector + " " : "" ) + selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true) );
	},

	is: function( selector ) {
		return !!selector && (
			typeof selector === "string" ?
				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				rneedsContext.test( selector ) ?
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			cur = this[i];

			while ( cur && cur.ownerDocument && cur !== context && cur.nodeType !== 11 ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;
				}
				cur = cur.parentNode;
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

jQuery.fn.andSelf = jQuery.fn.addBack;

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( this.length > 1 && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem ) {
			return ( elem === qualifier ) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, false, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, false, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length > 0 ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( getAll( elem ) );
				}

				if ( elem.parentNode ) {
					if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
						setGlobalEval( getAll( elem, "script" ) );
					}
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function( value ) {
		var isFunc = jQuery.isFunction( value );

		// Make sure that the elements are removed from the DOM before they are inserted
		// this can help fix replacing a parent with child elements
		if ( !isFunc && typeof value !== "string" ) {
			value = jQuery( value ).not( this ).detach();
		}

		return this.domManip( [ value ], true, function( elem ) {
			var next = this.nextSibling,
				parent = this.parentNode;

			if ( parent ) {
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		});
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, table ? self.html() : undefined );
				}
				self.domManip( args, table, callback );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call(
						table && jQuery.nodeName( this[i], "table" ) ?
							findOrAppend( this[i], "tbody" ) :
							this[i],
						node,
						i
					);
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery.ajax({
									url: node.src,
									type: "GET",
									dataType: "script",
									async: false,
									global: false,
									"throws": true
								});
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

function findOrAppend( elem, tag ) {
	return elem.getElementsByTagName( tag )[0] || elem.appendChild( elem.ownerDocument.createElement( tag ) );
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	var attr = elem.getAttributeNode("type");
	elem.type = ( attr && attr.specified ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		var bool = typeof state === "boolean";

		return this.each(function() {
			if ( bool ? state : isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.hover = function( fnOver, fnOut ) {
	return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
};
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 ) {
					isSuccess = true;
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					isSuccess = true;
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					isSuccess = ajaxConvert( s, response );
					statusText = isSuccess.state;
					success = isSuccess.data;
					error = isSuccess.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	}
});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields;

	// Fill responseXXX fields
	for ( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {
	var conv2, current, conv, tmp,
		converters = {},
		i = 0,
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice(),
		prev = dataTypes[ 0 ];

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	// Convert to each sequential dataType, tolerating list modification
	for ( ; (current = dataTypes[++i]); ) {

		// There's only work to do if current dataType is non-auto
		if ( current !== "*" ) {

			// Convert response if prev dataType is non-auto and differs from current
			if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split(" ");
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.splice( i--, 0, current );
								}

								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s["throws"] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}

			// Update prev for next iteration
			prev = current;
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var end, unit,
				tween = this.createTween( prop, value ),
				parts = rfxnum.exec( value ),
				target = tween.cur(),
				start = +target || 0,
				scale = 1,
				maxIterations = 20;

			if ( parts ) {
				end = +parts[2];
				unit = parts[3] || ( jQuery.cssNumber[ prop ] ? "" : "px" );

				// We need to compute starting value
				if ( unit !== "px" && start ) {
					// Iteratively approximate from a nonzero starting point
					// Prefer the current property, because this process will be trivial if it uses the same units
					// Fallback to end or a simple constant
					start = jQuery.css( tween.elem, prop, true ) || end || 1;

					do {
						// If previous iteration zeroed out, double until we get *something*
						// Use a string for doubling factor so we don't accidentally see scale as unchanged below
						scale = scale || ".5";

						// Adjust and apply
						start = start / scale;
						jQuery.style( tween.elem, prop, start + unit );

					// Update scale, tolerating zero or NaN from tween.cur()
					// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
					} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
				}

				tween.unit = unit;
				tween.start = start;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[1] ? start + ( parts[1] + 1 ) * end : end;
			}
			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTweens( animation, props ) {
	jQuery.each( props, function( prop, value ) {
		var collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
			index = 0,
			length = collection.length;
		for ( ; index < length; index++ ) {
			if ( collection[ index ].call( animation, prop, value ) ) {

				// we're done with this property
				return;
			}
		}
	});
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	createTweens( animation, props );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var value, name, index, easing, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/*jshint validthis:true */
	var prop, index, length,
		value, dataShow, toggle,
		tween, hooks, oldfire,
		anim = this,
		style = elem.style,
		orig = {},
		handled = [],
		hidden = elem.nodeType && isHidden( elem );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( index in props ) {
		value = props[ index ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ index ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			handled.push( index );
		}
	}

	length = handled.length;
	if ( length ) {
		dataShow = jQuery._data( elem, "fxshow" ) || jQuery._data( elem, "fxshow", {} );
		if ( "hidden" in dataShow ) {
			hidden = dataShow.hidden;
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( index = 0 ; index < length ; index++ ) {
			prop = handled[ index ];
			tween = anim.createTween( prop, hidden ? dataShow[ prop ] : 0 );
			orig[ prop ] = dataShow[ prop ] || jQuery.style( elem, prop );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Remove in 2.0 - this supports IE8's panic based approach
// to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );
				doAnimation.finish = function() {
					anim.stop( true );
				};
				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.cur && hooks.cur.finish ) {
				hooks.cur.finish.call( this );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.documentElement;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || document.documentElement;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// })();
// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
	define( "jquery", [], function () { return jQuery; } );
}

})( window );
;
//     Underscore.js 1.4.4
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var push             = ArrayProto.push,
      slice            = ArrayProto.slice,
      concat           = ArrayProto.concat,
      toString         = ObjProto.toString,
      hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.4.4';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (_.has(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    return _.filter(obj, function(value, index, list) {
      return !iterator.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs, first) {
    if (_.isEmpty(attrs)) return first ? null : [];
    return _[first ? 'find' : 'filter'](obj, function(value) {
      for (var key in attrs) {
        if (attrs[key] !== value[key]) return false;
      }
      return true;
    });
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.where(obj, attrs, true);
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See: https://bugs.webkit.org/show_bug.cgi?id=80797
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity, value: -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity, value: Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array.
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    return _.isFunction(value) ? value : function(obj){ return obj[value]; };
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, value, context) {
    var iterator = lookupIterator(value);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        index : index,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index < right.index ? -1 : 1;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(obj, value, context, behavior) {
    var result = {};
    var iterator = lookupIterator(value || _.identity);
    each(obj, function(value, index) {
      var key = iterator.call(context, value, index, obj);
      behavior(result, key, value);
    });
    return result;
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key, value) {
      (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
    });
  };

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key) {
      if (!_.has(result, key)) result[key] = 0;
      result[key]++;
    });
  };

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = iterator == null ? _.identity : lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely convert anything iterable into a real, live array.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n != null) && !guard) {
      return slice.call(array, Math.max(array.length - n, 0));
    } else {
      return array[array.length - 1];
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    each(input, function(value) {
      if (_.isArray(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(concat.apply(ArrayProto, arguments));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var args = slice.call(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(args, "" + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, l = list.length; i < l; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, l = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, l + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < l; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    var args = slice.call(arguments, 2);
    return function() {
      return func.apply(context, args.concat(slice.call(arguments)));
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context.
  _.partial = function(func) {
    var args = slice.call(arguments, 1);
    return function() {
      return func.apply(this, args.concat(slice.call(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) funcs = _.functions(obj);
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  _.throttle = function(func, wait) {
    var context, args, timeout, result;
    var previous = 0;
    var later = function() {
      previous = new Date;
      timeout = null;
      result = func.apply(context, args);
    };
    return function() {
      var now = new Date;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, result;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) result = func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) result = func.apply(context, args);
      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func];
      push.apply(args, arguments);
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    if (times <= 0) return func();
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var values = [];
    for (var key in obj) if (_.has(obj, key)) values.push(obj[key]);
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var pairs = [];
    for (var key in obj) if (_.has(obj, key)) pairs.push([key, obj[key]]);
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    for (var key in obj) if (_.has(obj, key)) result[obj[key]] = key;
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] == null) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Objects with different constructors are not equivalent, but `Object`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                               _.isFunction(bCtor) && (bCtor instanceof bCtor))) {
        return false;
      }
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(n);
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named property is a function then invoke it;
  // otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return null;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      // throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

}).call(this);
;
//     Backbone.js 1.0.0

//     (c) 2010-2013 Jeremy Ashkenas, DocumentCloud Inc.
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org

(function(){

  // Initial Setup
  // -------------

  // Save a reference to the global object (`window` in the browser, `exports`
  // on the server).
  var root = this;

  // Save the previous value of the `Backbone` variable, so that it can be
  // restored later on, if `noConflict` is used.
  var previousBackbone = root.Backbone;

  // Create local references to array methods we'll want to use later.
  var array = [];
  var push = array.push;
  var slice = array.slice;
  var splice = array.splice;

  // The top-level namespace. All public Backbone classes and modules will
  // be attached to this. Exported for both the browser and the server.
  var Backbone;
  if (typeof exports !== 'undefined') {
    Backbone = exports;
  } else {
    Backbone = root.Backbone = {};
  }

  // Current version of the library. Keep in sync with `package.json`.
  Backbone.VERSION = '1.0.0';

  // Require Underscore, if we're on the server, and it's not already present.
  var _ = root._;
  if (!_ && (typeof require !== 'undefined')) _ = require('underscore');

  // For Backbone's purposes, jQuery, Zepto, Ender, or My Library (kidding) owns
  // the `$` variable.
  Backbone.$ = root.jQuery || root.Zepto || root.ender || root.$;

  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
  // to its previous owner. Returns a reference to this Backbone object.
  Backbone.noConflict = function() {
    root.Backbone = previousBackbone;
    return this;
  };

  // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
  // will fake `"PUT"` and `"DELETE"` requests via the `_method` parameter and
  // set a `X-Http-Method-Override` header.
  Backbone.emulateHTTP = false;

  // Turn on `emulateJSON` to support legacy servers that can't deal with direct
  // `application/json` requests ... will encode the body as
  // `application/x-www-form-urlencoded` instead and will send the model in a
  // form param named `model`.
  Backbone.emulateJSON = false;

  // Backbone.Events
  // ---------------

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may bind with `on` or remove with `off` callback
  // functions to an event; `trigger`-ing an event fires all callbacks in
  // succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  var Events = Backbone.Events = {

    // Bind an event to a `callback` function. Passing `"all"` will bind
    // the callback to all events fired.
    on: function(name, callback, context) {
      if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
      this._events || (this._events = {});
      var events = this._events[name] || (this._events[name] = []);
      events.push({callback: callback, context: context, ctx: context || this});
      return this;
    },

    // Bind an event to only be triggered a single time. After the first time
    // the callback is invoked, it will be removed.
    once: function(name, callback, context) {
      if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
      var self = this;
      var once = _.once(function() {
        self.off(name, once);
        callback.apply(this, arguments);
      });
      once._callback = callback;
      return this.on(name, once, context);
    },

    // Remove one or many callbacks. If `context` is null, removes all
    // callbacks with that function. If `callback` is null, removes all
    // callbacks for the event. If `name` is null, removes all bound
    // callbacks for all events.
    off: function(name, callback, context) {
      var retain, ev, events, names, i, l, j, k;
      if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
      if (!name && !callback && !context) {
        this._events = {};
        return this;
      }

      names = name ? [name] : _.keys(this._events);
      for (i = 0, l = names.length; i < l; i++) {
        name = names[i];
        if (events = this._events[name]) {
          this._events[name] = retain = [];
          if (callback || context) {
            for (j = 0, k = events.length; j < k; j++) {
              ev = events[j];
              if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
                  (context && context !== ev.context)) {
                retain.push(ev);
              }
            }
          }
          if (!retain.length) delete this._events[name];
        }
      }

      return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function(name) {
      if (!this._events) return this;
      var args = slice.call(arguments, 1);
      if (!eventsApi(this, 'trigger', name, args)) return this;
      var events = this._events[name];
      var allEvents = this._events.all;
      if (events) triggerEvents(events, args);
      if (allEvents) triggerEvents(allEvents, arguments);
      return this;
    },

    // Tell this object to stop listening to either specific events ... or
    // to every object it's currently listening to.
    stopListening: function(obj, name, callback) {
      var listeners = this._listeners;
      if (!listeners) return this;
      var deleteListener = !name && !callback;
      if (typeof name === 'object') callback = this;
      if (obj) (listeners = {})[obj._listenerId] = obj;
      for (var id in listeners) {
        listeners[id].off(name, callback, this);
        if (deleteListener) delete this._listeners[id];
      }
      return this;
    }

  };

  // Regular expression used to split event strings.
  var eventSplitter = /\s+/;

  // Implement fancy features of the Events API such as multiple event
  // names `"change blur"` and jQuery-style event maps `{change: action}`
  // in terms of the existing API.
  var eventsApi = function(obj, action, name, rest) {
    if (!name) return true;

    // Handle event maps.
    if (typeof name === 'object') {
      for (var key in name) {
        obj[action].apply(obj, [key, name[key]].concat(rest));
      }
      return false;
    }

    // Handle space separated event names.
    if (eventSplitter.test(name)) {
      var names = name.split(eventSplitter);
      for (var i = 0, l = names.length; i < l; i++) {
        obj[action].apply(obj, [names[i]].concat(rest));
      }
      return false;
    }

    return true;
  };

  // A difficult-to-believe, but optimized internal dispatch function for
  // triggering events. Tries to keep the usual cases speedy (most internal
  // Backbone events have 3 arguments).
  var triggerEvents = function(events, args) {
    var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
    switch (args.length) {
      case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
      case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
      case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
      case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
      default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args);
    }
  };

  var listenMethods = {listenTo: 'on', listenToOnce: 'once'};

  // Inversion-of-control versions of `on` and `once`. Tell *this* object to
  // listen to an event in another object ... keeping track of what it's
  // listening to.
  _.each(listenMethods, function(implementation, method) {
    Events[method] = function(obj, name, callback) {
      var listeners = this._listeners || (this._listeners = {});
      var id = obj._listenerId || (obj._listenerId = _.uniqueId('l'));
      listeners[id] = obj;
      if (typeof name === 'object') callback = this;
      obj[implementation](name, callback, this);
      return this;
    };
  });

  // Aliases for backwards compatibility.
  Events.bind   = Events.on;
  Events.unbind = Events.off;

  // Allow the `Backbone` object to serve as a global event bus, for folks who
  // want global "pubsub" in a convenient place.
  _.extend(Backbone, Events);

  // Backbone.Model
  // --------------

  // Backbone **Models** are the basic data object in the framework --
  // frequently representing a row in a table in a database on your server.
  // A discrete chunk of data and a bunch of useful, related methods for
  // performing computations and transformations on that data.

  // Create a new model with the specified attributes. A client id (`cid`)
  // is automatically generated and assigned for you.
  var Model = Backbone.Model = function(attributes, options) {
    var defaults;
    var attrs = attributes || {};
    options || (options = {});
    this.cid = _.uniqueId('c');
    this.attributes = {};
    _.extend(this, _.pick(options, modelOptions));
    if (options.parse) attrs = this.parse(attrs, options) || {};
    if (defaults = _.result(this, 'defaults')) {
      attrs = _.defaults({}, attrs, defaults);
    }
    this.set(attrs, options);
    this.changed = {};
    this.initialize.apply(this, arguments);
  };

  // A list of options to be attached directly to the model, if provided.
  var modelOptions = ['url', 'urlRoot', 'collection'];

  // Attach all inheritable methods to the Model prototype.
  _.extend(Model.prototype, Events, {

    // A hash of attributes whose current and previous value differ.
    changed: null,

    // The value returned during the last failed validation.
    validationError: null,

    // The default name for the JSON `id` attribute is `"id"`. MongoDB and
    // CouchDB users may want to set this to `"_id"`.
    idAttribute: 'id',

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Return a copy of the model's `attributes` object.
    toJSON: function(options) {
      return _.clone(this.attributes);
    },

    // Proxy `Backbone.sync` by default -- but override this if you need
    // custom syncing semantics for *this* particular model.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Get the value of an attribute.
    get: function(attr) {
      return this.attributes[attr];
    },

    // Get the HTML-escaped value of an attribute.
    escape: function(attr) {
      return _.escape(this.get(attr));
    },

    // Returns `true` if the attribute contains a value that is not null
    // or undefined.
    has: function(attr) {
      return this.get(attr) != null;
    },

    // Set a hash of model attributes on the object, firing `"change"`. This is
    // the core primitive operation of a model, updating the data and notifying
    // anyone who needs to know about the change in state. The heart of the beast.
    set: function(key, val, options) {
      var attr, attrs, unset, changes, silent, changing, prev, current;
      if (key == null) return this;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options || (options = {});

      // Run validation.
      if (!this._validate(attrs, options)) return false;

      // Extract attributes and options.
      unset           = options.unset;
      silent          = options.silent;
      changes         = [];
      changing        = this._changing;
      this._changing  = true;

      if (!changing) {
        this._previousAttributes = _.clone(this.attributes);
        this.changed = {};
      }
      current = this.attributes, prev = this._previousAttributes;

      // Check for changes of `id`.
      if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

      // For each `set` attribute, update or delete the current value.
      for (attr in attrs) {
        val = attrs[attr];
        if (!_.isEqual(current[attr], val)) changes.push(attr);
        if (!_.isEqual(prev[attr], val)) {
          this.changed[attr] = val;
        } else {
          delete this.changed[attr];
        }
        unset ? delete current[attr] : current[attr] = val;
      }

      // Trigger all relevant attribute changes.
      if (!silent) {
        if (changes.length) this._pending = true;
        for (var i = 0, l = changes.length; i < l; i++) {
          this.trigger('change:' + changes[i], this, current[changes[i]], options);
        }
      }

      // You might be wondering why there's a `while` loop here. Changes can
      // be recursively nested within `"change"` events.
      if (changing) return this;
      if (!silent) {
        while (this._pending) {
          this._pending = false;
          this.trigger('change', this, options);
        }
      }
      this._pending = false;
      this._changing = false;
      return this;
    },

    // Remove an attribute from the model, firing `"change"`. `unset` is a noop
    // if the attribute doesn't exist.
    unset: function(attr, options) {
      return this.set(attr, void 0, _.extend({}, options, {unset: true}));
    },

    // Clear all attributes on the model, firing `"change"`.
    clear: function(options) {
      var attrs = {};
      for (var key in this.attributes) attrs[key] = void 0;
      return this.set(attrs, _.extend({}, options, {unset: true}));
    },

    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged: function(attr) {
      if (attr == null) return !_.isEmpty(this.changed);
      return _.has(this.changed, attr);
    },

    // Return an object containing all the attributes that have changed, or
    // false if there are no changed attributes. Useful for determining what
    // parts of a view need to be updated and/or what attributes need to be
    // persisted to the server. Unset attributes will be set to undefined.
    // You can also pass an attributes object to diff against the model,
    // determining if there *would be* a change.
    changedAttributes: function(diff) {
      if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
      var val, changed = false;
      var old = this._changing ? this._previousAttributes : this.attributes;
      for (var attr in diff) {
        if (_.isEqual(old[attr], (val = diff[attr]))) continue;
        (changed || (changed = {}))[attr] = val;
      }
      return changed;
    },

    // Get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    previous: function(attr) {
      if (attr == null || !this._previousAttributes) return null;
      return this._previousAttributes[attr];
    },

    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousAttributes: function() {
      return _.clone(this._previousAttributes);
    },

    // Fetch the model from the server. If the server's representation of the
    // model differs from its current attributes, they will be overridden,
    // triggering a `"change"` event.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        if (!model.set(model.parse(resp, options), options)) return false;
        if (success) success(model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Set a hash of model attributes, and sync the model to the server.
    // If the server returns an attributes hash that differs, the model's
    // state will be `set` again.
    save: function(key, val, options) {
      var attrs, method, xhr, attributes = this.attributes;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (key == null || typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      // If we're not waiting and attributes exist, save acts as `set(attr).save(null, opts)`.
      if (attrs && (!options || !options.wait) && !this.set(attrs, options)) return false;

      options = _.extend({validate: true}, options);

      // Do not persist invalid models.
      if (!this._validate(attrs, options)) return false;

      // Set temporary attributes if `{wait: true}`.
      if (attrs && options.wait) {
        this.attributes = _.extend({}, attributes, attrs);
      }

      // After a successful server-side save, the client is (optionally)
      // updated with the server-side state.
      if (options.parse === void 0) options.parse = true;
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        // Ensure attributes are restored during synchronous saves.
        model.attributes = attributes;
        var serverAttrs = model.parse(resp, options);
        if (options.wait) serverAttrs = _.extend(attrs || {}, serverAttrs);
        if (_.isObject(serverAttrs) && !model.set(serverAttrs, options)) {
          return false;
        }
        if (success) success(model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);

      method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
      if (method === 'patch') options.attrs = attrs;
      xhr = this.sync(method, this, options);

      // Restore attributes.
      if (attrs && options.wait) this.attributes = attributes;

      return xhr;
    },

    // Destroy this model on the server if it was already persisted.
    // Optimistically removes the model from its collection, if it has one.
    // If `wait: true` is passed, waits for the server to respond before removal.
    destroy: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;

      var destroy = function() {
        model.trigger('destroy', model, model.collection, options);
      };

      options.success = function(resp) {
        if (options.wait || model.isNew()) destroy();
        if (success) success(model, resp, options);
        if (!model.isNew()) model.trigger('sync', model, resp, options);
      };

      if (this.isNew()) {
        options.success();
        return false;
      }
      wrapError(this, options);

      var xhr = this.sync('delete', this, options);
      if (!options.wait) destroy();
      return xhr;
    },

    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    url: function() {
      var base = _.result(this, 'urlRoot') || _.result(this.collection, 'url') || urlError();
      if (this.isNew()) return base;
      return base + (base.charAt(base.length - 1) === '/' ? '' : '/') + encodeURIComponent(this.id);
    },

    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. The default implementation is just to pass the response along.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new model with identical attributes to this one.
    clone: function() {
      return new this.constructor(this.attributes);
    },

    // A model is new if it has never been saved to the server, and lacks an id.
    isNew: function() {
      return this.id == null;
    },

    // Check if the model is currently in a valid state.
    isValid: function(options) {
      return this._validate({}, _.extend(options || {}, { validate: true }));
    },

    // Run validation against the next complete set of model attributes,
    // returning `true` if all is well. Otherwise, fire an `"invalid"` event.
    _validate: function(attrs, options) {
      if (!options.validate || !this.validate) return true;
      attrs = _.extend({}, this.attributes, attrs);
      var error = this.validationError = this.validate(attrs, options) || null;
      if (!error) return true;
      this.trigger('invalid', this, error, _.extend(options || {}, {validationError: error}));
      return false;
    }

  });

  // Underscore methods that we want to implement on the Model.
  var modelMethods = ['keys', 'values', 'pairs', 'invert', 'pick', 'omit'];

  // Mix in each Underscore method as a proxy to `Model#attributes`.
  _.each(modelMethods, function(method) {
    Model.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this.attributes);
      return _[method].apply(_, args);
    };
  });

  // Backbone.Collection
  // -------------------

  // If models tend to represent a single row of data, a Backbone Collection is
  // more analagous to a table full of data ... or a small slice or page of that
  // table, or a collection of rows that belong together for a particular reason
  // -- all of the messages in this particular folder, all of the documents
  // belonging to this particular author, and so on. Collections maintain
  // indexes of their models, both in order, and for lookup by `id`.

  // Create a new **Collection**, perhaps to contain a specific type of `model`.
  // If a `comparator` is specified, the Collection will maintain
  // its models in sort order, as they're added and removed.
  var Collection = Backbone.Collection = function(models, options) {
    options || (options = {});
    if (options.url) this.url = options.url;
    if (options.model) this.model = options.model;
    if (options.comparator !== void 0) this.comparator = options.comparator;
    this._reset();
    this.initialize.apply(this, arguments);
    if (models) this.reset(models, _.extend({silent: true}, options));
  };

  // Default options for `Collection#set`.
  var setOptions = {add: true, remove: true, merge: true};
  var addOptions = {add: true, merge: false, remove: false};

  // Define the Collection's inheritable methods.
  _.extend(Collection.prototype, Events, {

    // The default model for a collection is just a **Backbone.Model**.
    // This should be overridden in most cases.
    model: Model,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // The JSON representation of a Collection is an array of the
    // models' attributes.
    toJSON: function(options) {
      return this.map(function(model){ return model.toJSON(options); });
    },

    // Proxy `Backbone.sync` by default.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Add a model, or list of models to the set.
    add: function(models, options) {
      return this.set(models, _.defaults(options || {}, addOptions));
    },

    // Remove a model, or a list of models from the set.
    remove: function(models, options) {
      models = _.isArray(models) ? models.slice() : [models];
      options || (options = {});
      var i, l, index, model;
      for (i = 0, l = models.length; i < l; i++) {
        model = this.get(models[i]);
        if (!model) continue;
        delete this._byId[model.id];
        delete this._byId[model.cid];
        index = this.indexOf(model);
        this.models.splice(index, 1);
        this.length--;
        if (!options.silent) {
          options.index = index;
          model.trigger('remove', model, this, options);
        }
        this._removeReference(model);
      }
      return this;
    },

    // Update a collection by `set`-ing a new list of models, adding new ones,
    // removing models that are no longer present, and merging models that
    // already exist in the collection, as necessary. Similar to **Model#set**,
    // the core operation for updating the data contained by the collection.
    set: function(models, options) {
      options = _.defaults(options || {}, setOptions);
      if (options.parse) models = this.parse(models, options);
      if (!_.isArray(models)) models = models ? [models] : [];
      var i, l, model, attrs, existing, sort;
      var at = options.at;
      var sortable = this.comparator && (at == null) && options.sort !== false;
      var sortAttr = _.isString(this.comparator) ? this.comparator : null;
      var toAdd = [], toRemove = [], modelMap = {};

      // Turn bare objects into model references, and prevent invalid models
      // from being added.
      for (i = 0, l = models.length; i < l; i++) {
        if (!(model = this._prepareModel(models[i], options))) continue;

        // If a duplicate is found, prevent it from being added and
        // optionally merge it into the existing model.
        if (existing = this.get(model)) {
          if (options.remove) modelMap[existing.cid] = true;
          if (options.merge) {
            existing.set(model.attributes, options);
            if (sortable && !sort && existing.hasChanged(sortAttr)) sort = true;
          }

        // This is a new model, push it to the `toAdd` list.
        } else if (options.add) {
          toAdd.push(model);

          // Listen to added models' events, and index models for lookup by
          // `id` and by `cid`.
          model.on('all', this._onModelEvent, this);
          this._byId[model.cid] = model;
          if (model.id != null) this._byId[model.id] = model;
        }
      }

      // Remove nonexistent models if appropriate.
      if (options.remove) {
        for (i = 0, l = this.length; i < l; ++i) {
          if (!modelMap[(model = this.models[i]).cid]) toRemove.push(model);
        }
        if (toRemove.length) this.remove(toRemove, options);
      }

      // See if sorting is needed, update `length` and splice in new models.
      if (toAdd.length) {
        if (sortable) sort = true;
        this.length += toAdd.length;
        if (at != null) {
          splice.apply(this.models, [at, 0].concat(toAdd));
        } else {
          push.apply(this.models, toAdd);
        }
      }

      // Silently sort the collection if appropriate.
      if (sort) this.sort({silent: true});

      if (options.silent) return this;

      // Trigger `add` events.
      for (i = 0, l = toAdd.length; i < l; i++) {
        (model = toAdd[i]).trigger('add', model, this, options);
      }

      // Trigger `sort` if the collection was sorted.
      if (sort) this.trigger('sort', this, options);
      return this;
    },

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any granular `add` or `remove` events. Fires `reset` when finished.
    // Useful for bulk operations and optimizations.
    reset: function(models, options) {
      options || (options = {});
      for (var i = 0, l = this.models.length; i < l; i++) {
        this._removeReference(this.models[i]);
      }
      options.previousModels = this.models;
      this._reset();
      this.add(models, _.extend({silent: true}, options));
      if (!options.silent) this.trigger('reset', this, options);
      return this;
    },

    // Add a model to the end of the collection.
    push: function(model, options) {
      model = this._prepareModel(model, options);
      this.add(model, _.extend({at: this.length}, options));
      return model;
    },

    // Remove a model from the end of the collection.
    pop: function(options) {
      var model = this.at(this.length - 1);
      this.remove(model, options);
      return model;
    },

    // Add a model to the beginning of the collection.
    unshift: function(model, options) {
      model = this._prepareModel(model, options);
      this.add(model, _.extend({at: 0}, options));
      return model;
    },

    // Remove a model from the beginning of the collection.
    shift: function(options) {
      var model = this.at(0);
      this.remove(model, options);
      return model;
    },

    // Slice out a sub-array of models from the collection.
    slice: function(begin, end) {
      return this.models.slice(begin, end);
    },

    // Get a model from the set by id.
    get: function(obj) {
      if (obj == null) return void 0;
      return this._byId[obj.id != null ? obj.id : obj.cid || obj];
    },

    // Get the model at the given index.
    at: function(index) {
      return this.models[index];
    },

    // Return models with matching attributes. Useful for simple cases of
    // `filter`.
    where: function(attrs, first) {
      if (_.isEmpty(attrs)) return first ? void 0 : [];
      return this[first ? 'find' : 'filter'](function(model) {
        for (var key in attrs) {
          if (attrs[key] !== model.get(key)) return false;
        }
        return true;
      });
    },

    // Return the first model with matching attributes. Useful for simple cases
    // of `find`.
    findWhere: function(attrs) {
      return this.where(attrs, true);
    },

    // Force the collection to re-sort itself. You don't need to call this under
    // normal circumstances, as the set will maintain sort order as each item
    // is added.
    sort: function(options) {
      if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
      options || (options = {});

      // Run sort based on type of `comparator`.
      if (_.isString(this.comparator) || this.comparator.length === 1) {
        this.models = this.sortBy(this.comparator, this);
      } else {
        this.models.sort(_.bind(this.comparator, this));
      }

      if (!options.silent) this.trigger('sort', this, options);
      return this;
    },

    // Figure out the smallest index at which a model should be inserted so as
    // to maintain order.
    sortedIndex: function(model, value, context) {
      value || (value = this.comparator);
      var iterator = _.isFunction(value) ? value : function(model) {
        return model.get(value);
      };
      return _.sortedIndex(this.models, model, iterator, context);
    },

    // Pluck an attribute from each model in the collection.
    pluck: function(attr) {
      return _.invoke(this.models, 'get', attr);
    },

    // Fetch the default set of models for this collection, resetting the
    // collection when they arrive. If `reset: true` is passed, the response
    // data will be passed through the `reset` method instead of `set`.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var success = options.success;
      var collection = this;
      options.success = function(resp) {
        var method = options.reset ? 'reset' : 'set';
        collection[method](resp, options);
        if (success) success(collection, resp, options);
        collection.trigger('sync', collection, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Create a new instance of a model in this collection. Add the model to the
    // collection immediately, unless `wait: true` is passed, in which case we
    // wait for the server to agree.
    create: function(model, options) {
      options = options ? _.clone(options) : {};
      if (!(model = this._prepareModel(model, options))) return false;
      if (!options.wait) this.add(model, options);
      var collection = this;
      var success = options.success;
      options.success = function(resp) {
        if (options.wait) collection.add(model, options);
        if (success) success(model, resp, options);
      };
      model.save(null, options);
      return model;
    },

    // **parse** converts a response into a list of models to be added to the
    // collection. The default implementation is just to pass it through.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new collection with an identical list of models as this one.
    clone: function() {
      return new this.constructor(this.models);
    },

    // Private method to reset all internal state. Called when the collection
    // is first initialized or reset.
    _reset: function() {
      this.length = 0;
      this.models = [];
      this._byId  = {};
    },

    // Prepare a hash of attributes (or other model) to be added to this
    // collection.
    _prepareModel: function(attrs, options) {
      if (attrs instanceof Model) {
        if (!attrs.collection) attrs.collection = this;
        return attrs;
      }
      options || (options = {});
      options.collection = this;
      var model = new this.model(attrs, options);
      if (!model._validate(attrs, options)) {
        this.trigger('invalid', this, attrs, options);
        return false;
      }
      return model;
    },

    // Internal method to sever a model's ties to a collection.
    _removeReference: function(model) {
      if (this === model.collection) delete model.collection;
      model.off('all', this._onModelEvent, this);
    },

    // Internal method called every time a model in the set fires an event.
    // Sets need to update their indexes when models change ids. All other
    // events simply proxy through. "add" and "remove" events that originate
    // in other collections are ignored.
    _onModelEvent: function(event, model, collection, options) {
      if ((event === 'add' || event === 'remove') && collection !== this) return;
      if (event === 'destroy') this.remove(model, options);
      if (model && event === 'change:' + model.idAttribute) {
        delete this._byId[model.previous(model.idAttribute)];
        if (model.id != null) this._byId[model.id] = model;
      }
      this.trigger.apply(this, arguments);
    }

  });

  // Underscore methods that we want to implement on the Collection.
  // 90% of the core usefulness of Backbone Collections is actually implemented
  // right here:
  var methods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
    'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select',
    'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke',
    'max', 'min', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest',
    'tail', 'drop', 'last', 'without', 'indexOf', 'shuffle', 'lastIndexOf',
    'isEmpty', 'chain'];

  // Mix in each Underscore method as a proxy to `Collection#models`.
  _.each(methods, function(method) {
    Collection.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this.models);
      return _[method].apply(_, args);
    };
  });

  // Underscore methods that take a property name as an argument.
  var attributeMethods = ['groupBy', 'countBy', 'sortBy'];

  // Use attributes instead of properties.
  _.each(attributeMethods, function(method) {
    Collection.prototype[method] = function(value, context) {
      var iterator = _.isFunction(value) ? value : function(model) {
        return model.get(value);
      };
      return _[method](this.models, iterator, context);
    };
  });

  // Backbone.View
  // -------------

  // Backbone Views are almost more convention than they are actual code. A View
  // is simply a JavaScript object that represents a logical chunk of UI in the
  // DOM. This might be a single item, an entire list, a sidebar or panel, or
  // even the surrounding frame which wraps your whole app. Defining a chunk of
  // UI as a **View** allows you to define your DOM events declaratively, without
  // having to worry about render order ... and makes it easy for the view to
  // react to specific changes in the state of your models.

  // Creating a Backbone.View creates its initial element outside of the DOM,
  // if an existing element is not provided...
  var View = Backbone.View = function(options) {
    this.cid = _.uniqueId('view');
    this._configure(options || {});
    this._ensureElement();
    this.initialize.apply(this, arguments);
    this.delegateEvents();
  };

  // Cached regex to split keys for `delegate`.
  var delegateEventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be merged as properties.
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];

  // Set up all inheritable **Backbone.View** properties and methods.
  _.extend(View.prototype, Events, {

    // The default `tagName` of a View's element is `"div"`.
    tagName: 'div',

    // jQuery delegate for element lookup, scoped to DOM elements within the
    // current view. This should be prefered to global lookups where possible.
    $: function(selector) {
      return this.$el.find(selector);
    },

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate HTML. The
    // convention is for **render** to always return `this`.
    render: function() {
      return this;
    },

    // Remove this view by taking the element out of the DOM, and removing any
    // applicable Backbone.Events listeners.
    remove: function() {
      this.$el.remove();
      this.stopListening();
      return this;
    },

    // Change the view's element (`this.el` property), including event
    // re-delegation.
    setElement: function(element, delegate) {
      if (this.$el) this.undelegateEvents();
      this.$el = element instanceof Backbone.$ ? element : Backbone.$(element);
      this.el = this.$el[0];
      if (delegate !== false) this.delegateEvents();
      return this;
    },

    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save'
    //       'click .open':       function(e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    // This only works for delegate-able events: not `focus`, `blur`, and
    // not `change`, `submit`, and `reset` in Internet Explorer.
    delegateEvents: function(events) {
      if (!(events || (events = _.result(this, 'events')))) return this;
      this.undelegateEvents();
      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[events[key]];
        if (!method) continue;

        var match = key.match(delegateEventSplitter);
        var eventName = match[1], selector = match[2];
        method = _.bind(method, this);
        eventName += '.delegateEvents' + this.cid;
        if (selector === '') {
          this.$el.on(eventName, method);
        } else {
          this.$el.on(eventName, selector, method);
        }
      }
      return this;
    },

    // Clears all callbacks previously bound to the view with `delegateEvents`.
    // You usually don't need to use this, but may wish to if you have multiple
    // Backbone views attached to the same DOM element.
    undelegateEvents: function() {
      this.$el.off('.delegateEvents' + this.cid);
      return this;
    },

    // Performs the initial configuration of a View with a set of options.
    // Keys with special meaning *(e.g. model, collection, id, className)* are
    // attached directly to the view.  See `viewOptions` for an exhaustive
    // list.
    _configure: function(options) {
      if (this.options) options = _.extend({}, _.result(this, 'options'), options);
      _.extend(this, _.pick(options, viewOptions));
      this.options = options;
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` properties.
    _ensureElement: function() {
      if (!this.el) {
        var attrs = _.extend({}, _.result(this, 'attributes'));
        if (this.id) attrs.id = _.result(this, 'id');
        if (this.className) attrs['class'] = _.result(this, 'className');
        var $el = Backbone.$('<' + _.result(this, 'tagName') + '>').attr(attrs);
        this.setElement($el, false);
      } else {
        this.setElement(_.result(this, 'el'), false);
      }
    }

  });

  // Backbone.sync
  // -------------

  // Override this function to change the manner in which Backbone persists
  // models to the server. You will be passed the type of request, and the
  // model in question. By default, makes a RESTful Ajax request
  // to the model's `url()`. Some possible customizations could be:
  //
  // * Use `setTimeout` to batch rapid-fire updates into a single request.
  // * Send up the models as XML instead of JSON.
  // * Persist models via WebSockets instead of Ajax.
  //
  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
  // as `POST`, with a `_method` parameter containing the true HTTP method,
  // as well as all requests with the body as `application/x-www-form-urlencoded`
  // instead of `application/json` with the model in a param named `model`.
  // Useful when interfacing with server-side languages like **PHP** that make
  // it difficult to read the body of `PUT` requests.
  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];

    // Default options, unless specified.
    _.defaults(options || (options = {}), {
      emulateHTTP: Backbone.emulateHTTP,
      emulateJSON: Backbone.emulateJSON
    });

    // Default JSON-request options.
    var params = {type: type, dataType: 'json'};

    // Ensure that we have a URL.
    if (!options.url) {
      params.url = _.result(model, 'url') || urlError();
    }

    // Ensure that we have the appropriate request data.
    if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(options.attrs || model.toJSON(options));
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (options.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data = params.data ? {model: params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
      params.type = 'POST';
      if (options.emulateJSON) params.data._method = type;
      var beforeSend = options.beforeSend;
      options.beforeSend = function(xhr) {
        xhr.setRequestHeader('X-HTTP-Method-Override', type);
        if (beforeSend) return beforeSend.apply(this, arguments);
      };
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !options.emulateJSON) {
      params.processData = false;
    }

    // If we're sending a `PATCH` request, and we're in an old Internet Explorer
    // that still has ActiveX enabled by default, override jQuery to use that
    // for XHR instead. Remove this line when jQuery supports `PATCH` on IE8.
    if (params.type === 'PATCH' && window.ActiveXObject &&
          !(window.external && window.external.msActiveXFilteringEnabled)) {
      params.xhr = function() {
        return new ActiveXObject("Microsoft.XMLHTTP");
      };
    }

    // Make the request, allowing the user to override any Ajax options.
    var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
    model.trigger('request', model, xhr, options);
    return xhr;
  };

  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'patch':  'PATCH',
    'delete': 'DELETE',
    'read':   'GET'
  };

  // Set the default implementation of `Backbone.ajax` to proxy through to `$`.
  // Override this if you'd like to use a different library.
  Backbone.ajax = function() {
    return Backbone.$.ajax.apply(Backbone.$, arguments);
  };

  // Backbone.Router
  // ---------------

  // Routers map faux-URLs to actions, and fire events when routes are
  // matched. Creating a new one sets its `routes` hash, if not set statically.
  var Router = Backbone.Router = function(options) {
    options || (options = {});
    if (options.routes) this.routes = options.routes;
    this._bindRoutes();
    this.initialize.apply(this, arguments);
  };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var optionalParam = /\((.*?)\)/g;
  var namedParam    = /(\(\?)?:\w+/g;
  var splatParam    = /\*\w+/g;
  var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

  // Set up all inheritable **Backbone.Router** properties and methods.
  _.extend(Router.prototype, Events, {

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route: function(route, name, callback) {
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (_.isFunction(name)) {
        callback = name;
        name = '';
      }
      if (!callback) callback = this[name];
      var router = this;
      Backbone.history.route(route, function(fragment) {
        var args = router._extractParameters(route, fragment);
        callback && callback.apply(router, args);
        router.trigger.apply(router, ['route:' + name].concat(args));
        router.trigger('route', name, args);
        Backbone.history.trigger('route', router, name, args);
      });
      return this;
    },

    // Simple proxy to `Backbone.history` to save a fragment into the history.
    navigate: function(fragment, options) {
      Backbone.history.navigate(fragment, options);
      return this;
    },

    // Bind all defined routes to `Backbone.history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindRoutes: function() {
      if (!this.routes) return;
      this.routes = _.result(this, 'routes');
      var route, routes = _.keys(this.routes);
      while ((route = routes.pop()) != null) {
        this.route(route, this.routes[route]);
      }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp: function(route) {
      route = route.replace(escapeRegExp, '\\$&')
                   .replace(optionalParam, '(?:$1)?')
                   .replace(namedParam, function(match, optional){
                     return optional ? match : '([^\/]+)';
                   })
                   .replace(splatParam, '(.*?)');
      return new RegExp('^' + route + '$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted decoded parameters. Empty or unmatched parameters will be
    // treated as `null` to normalize cross-browser behavior.
    _extractParameters: function(route, fragment) {
      var params = route.exec(fragment).slice(1);
      return _.map(params, function(param) {
        return param ? decodeURIComponent(param) : null;
      });
    }

  });

  // Backbone.History
  // ----------------

  // Handles cross-browser history management, based on either
  // [pushState](http://diveintohtml5.info/history.html) and real URLs, or
  // [onhashchange](https://developer.mozilla.org/en-US/docs/DOM/window.onhashchange)
  // and URL fragments. If the browser supports neither (old IE, natch),
  // falls back to polling.
  var History = Backbone.History = function() {
    this.handlers = [];
    _.bindAll(this, 'checkUrl');

    // Ensure that `History` can be used outside of the browser.
    if (typeof window !== 'undefined') {
      this.location = window.location;
      this.history = window.history;
    }
  };

  // Cached regex for stripping a leading hash/slash and trailing space.
  var routeStripper = /^[#\/]|\s+$/g;

  // Cached regex for stripping leading and trailing slashes.
  var rootStripper = /^\/+|\/+$/g;

  // Cached regex for detecting MSIE.
  var isExplorer = /msie [\w.]+/;

  // Cached regex for removing a trailing slash.
  var trailingSlash = /\/$/;

  // Has the history handling already been started?
  History.started = false;

  // Set up all inheritable **Backbone.History** properties and methods.
  _.extend(History.prototype, Events, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Gets the true hash value. Cannot use location.hash directly due to bug
    // in Firefox where location.hash will always be decoded.
    getHash: function(window) {
      var match = (window || this).location.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    // Get the cross-browser normalized URL fragment, either from the URL,
    // the hash, or the override.
    getFragment: function(fragment, forcePushState) {
      if (fragment == null) {
        if (this._hasPushState || !this._wantsHashChange || forcePushState) {
          fragment = this.location.pathname;
          var root = this.root.replace(trailingSlash, '');
          if (!fragment.indexOf(root)) fragment = fragment.substr(root.length);
        } else {
          fragment = this.getHash();
        }
      }
      return fragment.replace(routeStripper, '');
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start: function(options) {
      if (History.started) throw new Error("Backbone.history has already been started");
      History.started = true;

      // Figure out the initial configuration. Do we need an iframe?
      // Is pushState desired ... is it available?
      this.options          = _.extend({}, {root: '/'}, this.options, options);
      this.root             = this.options.root;
      this._wantsHashChange = this.options.hashChange !== false;
      this._wantsPushState  = !!this.options.pushState;
      this._hasPushState    = !!(this.options.pushState && this.history && this.history.pushState);
      var fragment          = this.getFragment();
      var docMode           = document.documentMode;
      var oldIE             = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));

      // Normalize root to always include a leading and trailing slash.
      this.root = ('/' + this.root + '/').replace(rootStripper, '/');

      if (oldIE && this._wantsHashChange) {
        this.iframe = Backbone.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo('body')[0].contentWindow;
        this.navigate(fragment);
      }

      // Depending on whether we're using pushState or hashes, and whether
      // 'onhashchange' is supported, determine how we check the URL state.
      if (this._hasPushState) {
        Backbone.$(window).on('popstate', this.checkUrl);
      } else if (this._wantsHashChange && ('onhashchange' in window) && !oldIE) {
        Backbone.$(window).on('hashchange', this.checkUrl);
      } else if (this._wantsHashChange) {
        this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
      }

      // Determine if we need to change the base url, for a pushState link
      // opened by a non-pushState browser.
      this.fragment = fragment;
      var loc = this.location;
      var atRoot = loc.pathname.replace(/[^\/]$/, '$&/') === this.root;

      // If we've started off with a route from a `pushState`-enabled browser,
      // but we're currently in a browser that doesn't support it...
      if (this._wantsHashChange && this._wantsPushState && !this._hasPushState && !atRoot) {
        this.fragment = this.getFragment(null, true);
        this.location.replace(this.root + this.location.search + '#' + this.fragment);
        // Return immediately as browser will do redirect to new url
        return true;

      // Or if we've started out with a hash-based route, but we're currently
      // in a browser where it could be `pushState`-based instead...
      } else if (this._wantsPushState && this._hasPushState && atRoot && loc.hash) {
        this.fragment = this.getHash().replace(routeStripper, '');
        this.history.replaceState({}, document.title, this.root + this.fragment + loc.search);
      }

      if (!this.options.silent) return this.loadUrl();
    },

    // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
    // but possibly useful for unit testing Routers.
    stop: function() {
      Backbone.$(window).off('popstate', this.checkUrl).off('hashchange', this.checkUrl);
      clearInterval(this._checkUrlInterval);
      History.started = false;
    },

    // Add a route to be tested when the fragment changes. Routes added later
    // may override previous routes.
    route: function(route, callback) {
      this.handlers.unshift({route: route, callback: callback});
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl: function(e) {
      var current = this.getFragment();
      if (current === this.fragment && this.iframe) {
        current = this.getFragment(this.getHash(this.iframe));
      }
      if (current === this.fragment) return false;
      if (this.iframe) this.navigate(current);
      this.loadUrl() || this.loadUrl(this.getHash());
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl: function(fragmentOverride) {
      var fragment = this.fragment = this.getFragment(fragmentOverride);
      var matched = _.any(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      });
      return matched;
    },

    // Save a fragment into the hash history, or replace the URL state if the
    // 'replace' option is passed. You are responsible for properly URL-encoding
    // the fragment in advance.
    //
    // The options object can contain `trigger: true` if you wish to have the
    // route callback be fired (not usually desirable), or `replace: true`, if
    // you wish to modify the current URL without adding an entry to the history.
    navigate: function(fragment, options) {
      if (!History.started) return false;
      if (!options || options === true) options = {trigger: options};
      fragment = this.getFragment(fragment || '');
      if (this.fragment === fragment) return;
      this.fragment = fragment;
      var url = this.root + fragment;

      // If pushState is available, we use it to set the fragment as a real URL.
      if (this._hasPushState) {
        this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

      // If hash changes haven't been explicitly disabled, update the hash
      // fragment to store history.
      } else if (this._wantsHashChange) {
        this._updateHash(this.location, fragment, options.replace);
        if (this.iframe && (fragment !== this.getFragment(this.getHash(this.iframe)))) {
          // Opening and closing the iframe tricks IE7 and earlier to push a
          // history entry on hash-tag change.  When replace is true, we don't
          // want this.
          if(!options.replace) this.iframe.document.open().close();
          this._updateHash(this.iframe.location, fragment, options.replace);
        }

      // If you've told us that you explicitly don't want fallback hashchange-
      // based history, then `navigate` becomes a page refresh.
      } else {
        return this.location.assign(url);
      }
      if (options.trigger) this.loadUrl(fragment);
    },

    // Update the hash location, either replacing the current entry, or adding
    // a new one to the browser history.
    _updateHash: function(location, fragment, replace) {
      if (replace) {
        var href = location.href.replace(/(javascript:|#).*$/, '');
        location.replace(href + '#' + fragment);
      } else {
        // Some browsers require that `hash` contains a leading #.
        location.hash = '#' + fragment;
      }
    }

  });

  // Create the default Backbone.history.
  Backbone.history = new History;

  // Helpers
  // -------

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && _.has(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Set up inheritance for the model, collection, router, view and history.
  Model.extend = Collection.extend = Router.extend = View.extend = History.extend = extend;

  // Throw an error when a URL is needed, and none is supplied.
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

  // Wrap an optional error callback with a fallback error event.
  var wrapError = function (model, options) {
    var error = options.error;
    options.error = function(resp) {
      if (error) error(model, resp, options);
      model.trigger('error', model, resp, options);
    };
  };

}).call(this);
;
/**
 * Backbone localStorage Adapter
 * Version 1.1.0
 *
 * https://github.com/jeromegn/Backbone.localStorage
 */
(function (root, factory) {
   if (typeof define === "function" && define.amd) {
      // AMD. Register as an anonymous module.
      define(["underscore","backbone"], function(_, Backbone) {
        // Use global variables if the locals are undefined.
        return factory(_ || root._, Backbone || root.Backbone);
      });
   } else {
      // RequireJS isn't being used. Assume underscore and backbone are loaded in <script> tags
      factory(_, Backbone);
   }
}(this, function(_, Backbone) {
// A simple module to replace `Backbone.sync` with *localStorage*-based
// persistence. Models are given GUIDS, and saved into a JSON object. Simple
// as that.

// Hold reference to Underscore.js and Backbone.js in the closure in order
// to make things work even if they are removed from the global namespace

// Generate four random hex digits.
function S4() {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
};

// Generate a pseudo-GUID by concatenating random hexadecimal.
function guid() {
   return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};

// Our Store is represented by a single JS object in *localStorage*. Create it
// with a meaningful name, like the name you'd give a table.
// window.Store is deprectated, use Backbone.LocalStorage instead
Backbone.LocalStorage = window.Store = function(name) {
  this.name = name;
  var store = this.localStorage().getItem(this.name);
  this.records = (store && store.split(",")) || [];
};

_.extend(Backbone.LocalStorage.prototype, {

  // Save the current state of the **Store** to *localStorage*.
  save: function() {
    this.localStorage().setItem(this.name, this.records.join(","));
  },

  // Add a model, giving it a (hopefully)-unique GUID, if it doesn't already
  // have an id of it's own.
  create: function(model) {
    if (!model.id) {
      model.id = guid();
      model.set(model.idAttribute, model.id);
    }
    this.localStorage().setItem(this.name+"-"+model.id, JSON.stringify(model));
    this.records.push(model.id.toString());
    this.save();
    return this.find(model);
  },

  // Update a model by replacing its copy in `this.data`.
  update: function(model) {
    this.localStorage().setItem(this.name+"-"+model.id, JSON.stringify(model));
    if (!_.include(this.records, model.id.toString()))
      this.records.push(model.id.toString()); this.save();
    return this.find(model);
  },

  // Retrieve a model from `this.data` by id.
  find: function(model) {
    return this.jsonData(this.localStorage().getItem(this.name+"-"+model.id));
  },

  // Return the array of all models currently in storage.
  findAll: function() {
    return _(this.records).chain()
      .map(function(id){
        return this.jsonData(this.localStorage().getItem(this.name+"-"+id));
      }, this)
      .compact()
      .value();
  },

  // Delete a model from `this.data`, returning it.
  destroy: function(model) {
    if (model.isNew())
      return false
    this.localStorage().removeItem(this.name+"-"+model.id);
    this.records = _.reject(this.records, function(id){
      return id === model.id.toString();
    });
    this.save();
    return model;
  },

  localStorage: function() {
    return localStorage;
  },

  // fix for "illegal access" error on Android when JSON.parse is passed null
  jsonData: function (data) {
      return data && JSON.parse(data);
  },

  // Clear localStorage for specific collection.
  _clear: function() {
    var local = this.localStorage(),
      itemRe = new RegExp("^" + this.name + "-");

    // Remove id-tracking item (e.g., "foo").
    local.removeItem(this.name);

    // Match all data items (e.g., "foo-ID") and remove.
    _.chain(local).keys()
      .filter(function (k) { return itemRe.test(k); })
      .each(function (k) { local.removeItem(k); });
  },

  // Size of localStorage.
  _storageSize: function() {
    return this.localStorage().length;
  }

});

// localSync delegate to the model or collection's
// *localStorage* property, which should be an instance of `Store`.
// window.Store.sync and Backbone.localSync is deprecated, use Backbone.LocalStorage.sync instead
Backbone.LocalStorage.sync = window.Store.sync = Backbone.localSync = function(method, model, options) {
  var store = model.localStorage || model.collection.localStorage;

  var resp, errorMessage, syncDfd = $.Deferred && $.Deferred(); //If $ is having Deferred - use it.

  try {

    switch (method) {
      case "read":
        resp = model.id != undefined ? store.find(model) : store.findAll();
        break;
      case "create":
        resp = store.create(model);
        break;
      case "update":
        resp = store.update(model);
        break;
      case "delete":
        resp = store.destroy(model);
        break;
    }

  } catch(error) {
    if (error.code === DOMException.QUOTA_EXCEEDED_ERR && store._storageSize() === 0)
      errorMessage = "Private browsing is unsupported";
    else
      errorMessage = error.message;
  }

  if (resp) {
    model.trigger("sync", model, resp, options);
    if (options && options.success)
      if (Backbone.VERSION === "0.9.10") {
        options.success(model, resp, options);
      } else {
        options.success(resp);
      }
    if (syncDfd)
      syncDfd.resolve(resp);

  } else {
    errorMessage = errorMessage ? errorMessage
                                : "Record Not Found";

    model.trigger("error", model, errorMessage, options);
    if (options && options.error)
      if (Backbone.VERSION === "0.9.10") {
        options.error(model, errorMessage, options);
      } else {
        options.error(errorMessage);
      }

    if (syncDfd)
      syncDfd.reject(errorMessage);
  }

  // add compatibility with $.ajax
  // always execute callback for success and error
  if (options && options.complete) options.complete(resp);

  return syncDfd && syncDfd.promise();
};

Backbone.ajaxSync = Backbone.sync;

Backbone.getSyncMethod = function(model) {
  if(model.localStorage || (model.collection && model.collection.localStorage)) {
    return Backbone.localSync;
  }

  return Backbone.ajaxSync;
};

// Override 'Backbone.sync' to default to localSync,
// the original 'Backbone.sync' is still available in 'Backbone.ajaxSync'
Backbone.sync = function(method, model, options) {
  return Backbone.getSyncMethod(model).apply(this, [method, model, options]);
};

return Backbone.LocalStorage;
}));;
/*!
 * Chart.js
 * http://chartjs.org/
 *
 * Copyright 2013 Nick Downie
 * Released under the MIT license
 * https://github.com/nnnick/Chart.js/blob/master/LICENSE.md
 */

//Define the global Chart Variable as a class.
window.Chart = function(context){

  var chart = this;
  
  
  //Easing functions adapted from Robert Penner's easing equations
  //http://www.robertpenner.com/easing/
  
  var animationOptions = {
    linear : function (t){
      return t;
    },
    easeInQuad: function (t) {
      return t*t;
    },
    easeOutQuad: function (t) {
      return -1 *t*(t-2);
    },
    easeInOutQuad: function (t) {
      if ((t/=1/2) < 1) return 1/2*t*t;
      return -1/2 * ((--t)*(t-2) - 1);
    },
    easeInCubic: function (t) {
      return t*t*t;
    },
    easeOutCubic: function (t) {
      return 1*((t=t/1-1)*t*t + 1);
    },
    easeInOutCubic: function (t) {
      if ((t/=1/2) < 1) return 1/2*t*t*t;
      return 1/2*((t-=2)*t*t + 2);
    },
    easeInQuart: function (t) {
      return t*t*t*t;
    },
    easeOutQuart: function (t) {
      return -1 * ((t=t/1-1)*t*t*t - 1);
    },
    easeInOutQuart: function (t) {
      if ((t/=1/2) < 1) return 1/2*t*t*t*t;
      return -1/2 * ((t-=2)*t*t*t - 2);
    },
    easeInQuint: function (t) {
      return 1*(t/=1)*t*t*t*t;
    },
    easeOutQuint: function (t) {
      return 1*((t=t/1-1)*t*t*t*t + 1);
    },
    easeInOutQuint: function (t) {
      if ((t/=1/2) < 1) return 1/2*t*t*t*t*t;
      return 1/2*((t-=2)*t*t*t*t + 2);
    },
    easeInSine: function (t) {
      return -1 * Math.cos(t/1 * (Math.PI/2)) + 1;
    },
    easeOutSine: function (t) {
      return 1 * Math.sin(t/1 * (Math.PI/2));
    },
    easeInOutSine: function (t) {
      return -1/2 * (Math.cos(Math.PI*t/1) - 1);
    },
    easeInExpo: function (t) {
      return (t==0) ? 1 : 1 * Math.pow(2, 10 * (t/1 - 1));
    },
    easeOutExpo: function (t) {
      return (t==1) ? 1 : 1 * (-Math.pow(2, -10 * t/1) + 1);
    },
    easeInOutExpo: function (t) {
      if (t==0) return 0;
      if (t==1) return 1;
      if ((t/=1/2) < 1) return 1/2 * Math.pow(2, 10 * (t - 1));
      return 1/2 * (-Math.pow(2, -10 * --t) + 2);
      },
    easeInCirc: function (t) {
      if (t>=1) return t;
      return -1 * (Math.sqrt(1 - (t/=1)*t) - 1);
    },
    easeOutCirc: function (t) {
      return 1 * Math.sqrt(1 - (t=t/1-1)*t);
    },
    easeInOutCirc: function (t) {
      if ((t/=1/2) < 1) return -1/2 * (Math.sqrt(1 - t*t) - 1);
      return 1/2 * (Math.sqrt(1 - (t-=2)*t) + 1);
    },
    easeInElastic: function (t) {
      var s=1.70158;var p=0;var a=1;
      if (t==0) return 0;  if ((t/=1)==1) return 1;  if (!p) p=1*.3;
      if (a < Math.abs(1)) { a=1; var s=p/4; }
      else var s = p/(2*Math.PI) * Math.asin (1/a);
      return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*1-s)*(2*Math.PI)/p ));
    },
    easeOutElastic: function (t) {
      var s=1.70158;var p=0;var a=1;
      if (t==0) return 0;  if ((t/=1)==1) return 1;  if (!p) p=1*.3;
      if (a < Math.abs(1)) { a=1; var s=p/4; }
      else var s = p/(2*Math.PI) * Math.asin (1/a);
      return a*Math.pow(2,-10*t) * Math.sin( (t*1-s)*(2*Math.PI)/p ) + 1;
    },
    easeInOutElastic: function (t) {
      var s=1.70158;var p=0;var a=1;
      if (t==0) return 0;  if ((t/=1/2)==2) return 1;  if (!p) p=1*(.3*1.5);
      if (a < Math.abs(1)) { a=1; var s=p/4; }
      else var s = p/(2*Math.PI) * Math.asin (1/a);
      if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*1-s)*(2*Math.PI)/p ));
      return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*1-s)*(2*Math.PI)/p )*.5 + 1;
    },
    easeInBack: function (t) {
      var s = 1.70158;
      return 1*(t/=1)*t*((s+1)*t - s);
    },
    easeOutBack: function (t) {
      var s = 1.70158;
      return 1*((t=t/1-1)*t*((s+1)*t + s) + 1);
    },
    easeInOutBack: function (t) {
      var s = 1.70158; 
      if ((t/=1/2) < 1) return 1/2*(t*t*(((s*=(1.525))+1)*t - s));
      return 1/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2);
    },
    easeInBounce: function (t) {
      return 1 - animationOptions.easeOutBounce (1-t);
    },
    easeOutBounce: function (t) {
      if ((t/=1) < (1/2.75)) {
        return 1*(7.5625*t*t);
      } else if (t < (2/2.75)) {
        return 1*(7.5625*(t-=(1.5/2.75))*t + .75);
      } else if (t < (2.5/2.75)) {
        return 1*(7.5625*(t-=(2.25/2.75))*t + .9375);
      } else {
        return 1*(7.5625*(t-=(2.625/2.75))*t + .984375);
      }
    },
    easeInOutBounce: function (t) {
      if (t < 1/2) return animationOptions.easeInBounce (t*2) * .5;
      return animationOptions.easeOutBounce (t*2-1) * .5 + 1*.5;
    }
  };

  //Variables global to the chart
  var width = context.canvas.width;
  var height = context.canvas.height;


  //High pixel density displays - multiply the size of the canvas height/width by the device pixel ratio, then scale.
  if (window.devicePixelRatio) {
    context.canvas.style.width = width + "px";
    context.canvas.style.height = height + "px";
    context.canvas.height = height * window.devicePixelRatio;
    context.canvas.width = width * window.devicePixelRatio;
    context.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  this.PolarArea = function(data,options){
  
    chart.PolarArea.defaults = {
      scaleOverlay : true,
      scaleOverride : false,
      scaleSteps : null,
      scaleStepWidth : null,
      scaleStartValue : null,
      scaleShowLine : true,
      scaleLineColor : "rgba(0,0,0,.1)",
      scaleLineWidth : 1,
      scaleShowLabels : true,
      scaleLabel : "<%=value%>",
      scaleFontFamily : "'Arial'",
      scaleFontSize : 12,
      scaleFontStyle : "normal",
      scaleFontColor : "#666",
      scaleShowLabelBackdrop : true,
      scaleBackdropColor : "rgba(255,255,255,0.75)",
      scaleBackdropPaddingY : 2,
      scaleBackdropPaddingX : 2,
      segmentShowStroke : true,
      segmentStrokeColor : "#fff",
      segmentStrokeWidth : 2,
      animation : true,
      animationSteps : 100,
      animationEasing : "easeOutBounce",
      animateRotate : true,
      animateScale : false,
      onAnimationComplete : null
    };
    
    var config = (options)? mergeChartConfig(chart.PolarArea.defaults,options) : chart.PolarArea.defaults;
    
    return new PolarArea(data,config,context);
  };

  this.Radar = function(data,options){
  
    chart.Radar.defaults = {
      scaleOverlay : false,
      scaleOverride : false,
      scaleSteps : null,
      scaleStepWidth : null,
      scaleStartValue : null,
      scaleShowLine : true,
      scaleLineColor : "rgba(0,0,0,.1)",
      scaleLineWidth : 1,
      scaleShowLabels : false,
      scaleLabel : "<%=value%>",
      scaleFontFamily : "'Arial'",
      scaleFontSize : 12,
      scaleFontStyle : "normal",
      scaleFontColor : "#666",
      scaleShowLabelBackdrop : true,
      scaleBackdropColor : "rgba(255,255,255,0.75)",
      scaleBackdropPaddingY : 2,
      scaleBackdropPaddingX : 2,
      angleShowLineOut : true,
      angleLineColor : "rgba(0,0,0,.1)",
      angleLineWidth : 1,     
      pointLabelFontFamily : "'Arial'",
      pointLabelFontStyle : "normal",
      pointLabelFontSize : 12,
      pointLabelFontColor : "#666",
      pointDot : true,
      pointDotRadius : 3,
      pointDotStrokeWidth : 1,
      datasetStroke : true,
      datasetStrokeWidth : 2,
      datasetFill : true,
      animation : true,
      animationSteps : 60,
      animationEasing : "easeOutQuart",
      onAnimationComplete : null
    };
    
    var config = (options)? mergeChartConfig(chart.Radar.defaults,options) : chart.Radar.defaults;

    return new Radar(data,config,context);
  };
  
  this.Pie = function(data,options){
    chart.Pie.defaults = {
      segmentShowStroke : true,
      segmentStrokeColor : "#fff",
      segmentStrokeWidth : 2,
      animation : true,
      animationSteps : 100,
      animationEasing : "easeOutBounce",
      animateRotate : true,
      animateScale : false,
      onAnimationComplete : null
    };    

    var config = (options)? mergeChartConfig(chart.Pie.defaults,options) : chart.Pie.defaults;
    
    return new Pie(data,config,context);        
  };
  
  this.Doughnut = function(data,options){
  
    chart.Doughnut.defaults = {
      segmentShowStroke : true,
      segmentStrokeColor : "#fff",
      segmentStrokeWidth : 2,
      percentageInnerCutout : 50,
      animation : true,
      animationSteps : 100,
      animationEasing : "easeOutBounce",
      animateRotate : true,
      animateScale : false,
      onAnimationComplete : null
    };    

    var config = (options)? mergeChartConfig(chart.Doughnut.defaults,options) : chart.Doughnut.defaults;
    
    return new Doughnut(data,config,context);     
    
  };

  this.Line = function(data,options){
  
    chart.Line.defaults = {
      scaleOverlay : false,
      scaleOverride : false,
      scaleSteps : null,
      scaleStepWidth : null,
      scaleStartValue : null,
      scaleLineColor : "rgba(0,0,0,.1)",
      scaleLineWidth : 1,
      scaleShowLabels : true,
      scaleLabel : "<%=value%>",
      scaleFontFamily : "'Arial'",
      scaleFontSize : 12,
      scaleFontStyle : "normal",
      scaleFontColor : "#666",
      scaleShowGridLines : true,
      scaleGridLineColor : "rgba(0,0,0,.05)",
      scaleGridLineWidth : 1,
      bezierCurve : true,
      pointDot : true,
      pointDotRadius : 4,
      pointDotStrokeWidth : 2,
      datasetStroke : true,
      datasetStrokeWidth : 2,
      datasetFill : true,
      animation : true,
      animationSteps : 60,
      animationEasing : "easeOutQuart",
      onAnimationComplete : null
    };    
    var config = (options) ? mergeChartConfig(chart.Line.defaults,options) : chart.Line.defaults;
    
    return new Line(data,config,context);
  }
  
  this.Bar = function(data,options){
    chart.Bar.defaults = {
      scaleOverlay : false,
      scaleOverride : false,
      scaleSteps : null,
      scaleStepWidth : null,
      scaleStartValue : null,
      scaleLineColor : "rgba(0,0,0,.1)",
      scaleLineWidth : 1,
      scaleShowLabels : true,
      scaleLabel : "<%=value%>",
      scaleFontFamily : "'Arial'",
      scaleFontSize : 12,
      scaleFontStyle : "normal",
      scaleFontColor : "#666",
      scaleShowGridLines : true,
      scaleGridLineColor : "rgba(0,0,0,.05)",
      scaleGridLineWidth : 1,
      barShowStroke : true,
      barStrokeWidth : 2,
      barValueSpacing : 5,
      barDatasetSpacing : 1,
      animation : true,
      animationSteps : 60,
      animationEasing : "easeOutQuart",
      onAnimationComplete : null
    };    
    var config = (options) ? mergeChartConfig(chart.Bar.defaults,options) : chart.Bar.defaults;
    
    return new Bar(data,config,context);    
  }
  
  var clear = function(c){
    c.clearRect(0, 0, width, height);
  };

  var PolarArea = function(data,config,ctx){
    var maxSize, scaleHop, calculatedScale, labelHeight, scaleHeight, valueBounds, labelTemplateString;   
    
    
    calculateDrawingSizes();
    
    valueBounds = getValueBounds();

    labelTemplateString = (config.scaleShowLabels)? config.scaleLabel : null;

    //Check and set the scale
    if (!config.scaleOverride){
      
      calculatedScale = calculateScale(scaleHeight,valueBounds.maxSteps,valueBounds.minSteps,valueBounds.maxValue,valueBounds.minValue,labelTemplateString);
    }
    else {
      calculatedScale = {
        steps : config.scaleSteps,
        stepValue : config.scaleStepWidth,
        graphMin : config.scaleStartValue,
        labels : []
      }
      populateLabels(labelTemplateString, calculatedScale.labels,calculatedScale.steps,config.scaleStartValue,config.scaleStepWidth);
    }
    
    scaleHop = maxSize/(calculatedScale.steps);

    //Wrap in an animation loop wrapper
    animationLoop(config,drawScale,drawAllSegments,ctx);

    function calculateDrawingSizes(){
      maxSize = (Min([width,height])/2);
      //Remove whatever is larger - the font size or line width.
      
      maxSize -= Max([config.scaleFontSize*0.5,config.scaleLineWidth*0.5]);
      
      labelHeight = config.scaleFontSize*2;
      //If we're drawing the backdrop - add the Y padding to the label height and remove from drawing region.
      if (config.scaleShowLabelBackdrop){
        labelHeight += (2 * config.scaleBackdropPaddingY);
        maxSize -= config.scaleBackdropPaddingY*1.5;
      }
      
      scaleHeight = maxSize;
      //If the label height is less than 5, set it to 5 so we don't have lines on top of each other.
      labelHeight = Default(labelHeight,5);
    }
    function drawScale(){
      for (var i=0; i<calculatedScale.steps; i++){
        //If the line object is there
        if (config.scaleShowLine){
          ctx.beginPath();
          ctx.arc(width/2, height/2, scaleHop * (i + 1), 0, (Math.PI * 2), true);
          ctx.strokeStyle = config.scaleLineColor;
          ctx.lineWidth = config.scaleLineWidth;
          ctx.stroke();
        }

        if (config.scaleShowLabels){
          ctx.textAlign = "center";
          ctx.font = config.scaleFontStyle + " " + config.scaleFontSize + "px " + config.scaleFontFamily;
          var label =  calculatedScale.labels[i];
          //If the backdrop object is within the font object
          if (config.scaleShowLabelBackdrop){
            var textWidth = ctx.measureText(label).width;
            ctx.fillStyle = config.scaleBackdropColor;
            ctx.beginPath();
            ctx.rect(
              Math.round(width/2 - textWidth/2 - config.scaleBackdropPaddingX),     //X
              Math.round(height/2 - (scaleHop * (i + 1)) - config.scaleFontSize*0.5 - config.scaleBackdropPaddingY),//Y
              Math.round(textWidth + (config.scaleBackdropPaddingX*2)), //Width
              Math.round(config.scaleFontSize + (config.scaleBackdropPaddingY*2)) //Height
            );
            ctx.fill();
          }
          ctx.textBaseline = "middle";
          ctx.fillStyle = config.scaleFontColor;
          ctx.fillText(label,width/2,height/2 - (scaleHop * (i + 1)));
        }
      }
    }
    function drawAllSegments(animationDecimal){
      var startAngle = -Math.PI/2,
      angleStep = (Math.PI*2)/data.length,
      scaleAnimation = 1,
      rotateAnimation = 1;
      if (config.animation) {
        if (config.animateScale) {
          scaleAnimation = animationDecimal;
        }
        if (config.animateRotate){
          rotateAnimation = animationDecimal;
        }
      }

      for (var i=0; i<data.length; i++){

        ctx.beginPath();
        ctx.arc(width/2,height/2,scaleAnimation * calculateOffset(data[i].value,calculatedScale,scaleHop),startAngle, startAngle + rotateAnimation*angleStep, false);
        ctx.lineTo(width/2,height/2);
        ctx.closePath();
        ctx.fillStyle = data[i].color;
        ctx.fill();

        if(config.segmentShowStroke){
          ctx.strokeStyle = config.segmentStrokeColor;
          ctx.lineWidth = config.segmentStrokeWidth;
          ctx.stroke();
        }
        startAngle += rotateAnimation*angleStep;
      }
    }
    function getValueBounds() {
      var upperValue = Number.MIN_VALUE;
      var lowerValue = Number.MAX_VALUE;
      for (var i=0; i<data.length; i++){
        if (data[i].value > upperValue) {upperValue = data[i].value;}
        if (data[i].value < lowerValue) {lowerValue = data[i].value;}
      };

      var maxSteps = Math.floor((scaleHeight / (labelHeight*0.66)));
      var minSteps = Math.floor((scaleHeight / labelHeight*0.5));
      
      return {
        maxValue : upperValue,
        minValue : lowerValue,
        maxSteps : maxSteps,
        minSteps : minSteps
      };
      

    }
  }

  var Radar = function (data,config,ctx) {
    var maxSize, scaleHop, calculatedScale, labelHeight, scaleHeight, valueBounds, labelTemplateString; 
      
    //If no labels are defined set to an empty array, so referencing length for looping doesn't blow up.
    if (!data.labels) data.labels = [];
    
    calculateDrawingSizes();

    var valueBounds = getValueBounds();

    labelTemplateString = (config.scaleShowLabels)? config.scaleLabel : null;

    //Check and set the scale
    if (!config.scaleOverride){
      
      calculatedScale = calculateScale(scaleHeight,valueBounds.maxSteps,valueBounds.minSteps,valueBounds.maxValue,valueBounds.minValue,labelTemplateString);
    }
    else {
      calculatedScale = {
        steps : config.scaleSteps,
        stepValue : config.scaleStepWidth,
        graphMin : config.scaleStartValue,
        labels : []
      }
      populateLabels(labelTemplateString, calculatedScale.labels,calculatedScale.steps,config.scaleStartValue,config.scaleStepWidth);
    }
    
    scaleHop = maxSize/(calculatedScale.steps);
    
    animationLoop(config,drawScale,drawAllDataPoints,ctx);
    
    //Radar specific functions.
    function drawAllDataPoints(animationDecimal){
      var rotationDegree = (2*Math.PI)/data.datasets[0].data.length;

      ctx.save();
      //translate to the centre of the canvas.
      ctx.translate(width/2,height/2);
      
      //We accept multiple data sets for radar charts, so show loop through each set
      for (var i=0; i<data.datasets.length; i++){
        ctx.beginPath();

        ctx.moveTo(0,animationDecimal*(-1*calculateOffset(data.datasets[i].data[0],calculatedScale,scaleHop)));
        for (var j=1; j<data.datasets[i].data.length; j++){
          ctx.rotate(rotationDegree); 
          ctx.lineTo(0,animationDecimal*(-1*calculateOffset(data.datasets[i].data[j],calculatedScale,scaleHop)));
      
        }
        ctx.closePath();
        
        
        ctx.fillStyle = data.datasets[i].fillColor;
        ctx.strokeStyle = data.datasets[i].strokeColor;
        ctx.lineWidth = config.datasetStrokeWidth;
        ctx.fill();
        ctx.stroke();
        
                
        if (config.pointDot){
          ctx.fillStyle = data.datasets[i].pointColor;
          ctx.strokeStyle = data.datasets[i].pointStrokeColor;
          ctx.lineWidth = config.pointDotStrokeWidth;
          for (var k=0; k<data.datasets[i].data.length; k++){
            ctx.rotate(rotationDegree);
            ctx.beginPath();
            ctx.arc(0,animationDecimal*(-1*calculateOffset(data.datasets[i].data[k],calculatedScale,scaleHop)),config.pointDotRadius,2*Math.PI,false);
            ctx.fill();
            ctx.stroke();
          }         
          
        }
        ctx.rotate(rotationDegree);
        
      }
      ctx.restore();
      
      
    }
    function drawScale(){
      var rotationDegree = (2*Math.PI)/data.datasets[0].data.length;
      ctx.save();
        ctx.translate(width / 2, height / 2); 
      
      if (config.angleShowLineOut){
        ctx.strokeStyle = config.angleLineColor;              
        ctx.lineWidth = config.angleLineWidth;
        for (var h=0; h<data.datasets[0].data.length; h++){
          
            ctx.rotate(rotationDegree);
          ctx.beginPath();
          ctx.moveTo(0,0);
          ctx.lineTo(0,-maxSize);
          ctx.stroke();
        }
      }

      for (var i=0; i<calculatedScale.steps; i++){
        ctx.beginPath();
        
        if(config.scaleShowLine){
          ctx.strokeStyle = config.scaleLineColor;
          ctx.lineWidth = config.scaleLineWidth;
          ctx.moveTo(0,-scaleHop * (i+1));          
          for (var j=0; j<data.datasets[0].data.length; j++){
              ctx.rotate(rotationDegree);
            ctx.lineTo(0,-scaleHop * (i+1));
          }
          ctx.closePath();
          ctx.stroke();     
              
        }
        
        if (config.scaleShowLabels){        
          ctx.textAlign = 'center';
          ctx.font = config.scaleFontStyle + " " + config.scaleFontSize+"px " + config.scaleFontFamily; 
          ctx.textBaseline = "middle";
          
          if (config.scaleShowLabelBackdrop){
            var textWidth = ctx.measureText(calculatedScale.labels[i]).width;
            ctx.fillStyle = config.scaleBackdropColor;
            ctx.beginPath();
            ctx.rect(
              Math.round(- textWidth/2 - config.scaleBackdropPaddingX),     //X
              Math.round((-scaleHop * (i + 1)) - config.scaleFontSize*0.5 - config.scaleBackdropPaddingY),//Y
              Math.round(textWidth + (config.scaleBackdropPaddingX*2)), //Width
              Math.round(config.scaleFontSize + (config.scaleBackdropPaddingY*2)) //Height
            );
            ctx.fill();
          }           
          ctx.fillStyle = config.scaleFontColor;
          ctx.fillText(calculatedScale.labels[i],0,-scaleHop*(i+1));
        }

      }
      for (var k=0; k<data.labels.length; k++){       
      ctx.font = config.pointLabelFontStyle + " " + config.pointLabelFontSize+"px " + config.pointLabelFontFamily;
      ctx.fillStyle = config.pointLabelFontColor;
        var opposite = Math.sin(rotationDegree*k) * (maxSize + config.pointLabelFontSize);
        var adjacent = Math.cos(rotationDegree*k) * (maxSize + config.pointLabelFontSize);
        
        if(rotationDegree*k == Math.PI || rotationDegree*k == 0){
          ctx.textAlign = "center";
        }
        else if(rotationDegree*k > Math.PI){
          ctx.textAlign = "right";
        }
        else{
          ctx.textAlign = "left";
        }
        
        ctx.textBaseline = "middle";
        
        ctx.fillText(data.labels[k],opposite,-adjacent);
        
      }
      ctx.restore();
    };
    function calculateDrawingSizes(){
      maxSize = (Min([width,height])/2);

      labelHeight = config.scaleFontSize*2;
      
      var labelLength = 0;
      for (var i=0; i<data.labels.length; i++){
        ctx.font = config.pointLabelFontStyle + " " + config.pointLabelFontSize+"px " + config.pointLabelFontFamily;
        var textMeasurement = ctx.measureText(data.labels[i]).width;
        if(textMeasurement>labelLength) labelLength = textMeasurement;
      }
      
      //Figure out whats the largest - the height of the text or the width of what's there, and minus it from the maximum usable size.
      maxSize -= Max([labelLength,((config.pointLabelFontSize/2)*1.5)]);        
      
      maxSize -= config.pointLabelFontSize;
      maxSize = CapValue(maxSize, null, 0);
      scaleHeight = maxSize;
      //If the label height is less than 5, set it to 5 so we don't have lines on top of each other.
      labelHeight = Default(labelHeight,5);
    };
    function getValueBounds() {
      var upperValue = Number.MIN_VALUE;
      var lowerValue = Number.MAX_VALUE;
      
      for (var i=0; i<data.datasets.length; i++){
        for (var j=0; j<data.datasets[i].data.length; j++){
          if (data.datasets[i].data[j] > upperValue){upperValue = data.datasets[i].data[j]}
          if (data.datasets[i].data[j] < lowerValue){lowerValue = data.datasets[i].data[j]}
        }
      }

      var maxSteps = Math.floor((scaleHeight / (labelHeight*0.66)));
      var minSteps = Math.floor((scaleHeight / labelHeight*0.5));
      
      return {
        maxValue : upperValue,
        minValue : lowerValue,
        maxSteps : maxSteps,
        minSteps : minSteps
      };
      

    }
  }

  var Pie = function(data,config,ctx){
    var segmentTotal = 0;
    
    //In case we have a canvas that is not a square. Minus 5 pixels as padding round the edge.
    var pieRadius = Min([height/2,width/2]) - 5;
    
    for (var i=0; i<data.length; i++){
      segmentTotal += data[i].value;
    }
    
    
    animationLoop(config,null,drawPieSegments,ctx);
        
    function drawPieSegments (animationDecimal){
      var cumulativeAngle = -Math.PI/2,
      scaleAnimation = 1,
      rotateAnimation = 1;
      if (config.animation) {
        if (config.animateScale) {
          scaleAnimation = animationDecimal;
        }
        if (config.animateRotate){
          rotateAnimation = animationDecimal;
        }
      }
      for (var i=0; i<data.length; i++){
        var segmentAngle = rotateAnimation * ((data[i].value/segmentTotal) * (Math.PI*2));
        ctx.beginPath();
        ctx.arc(width/2,height/2,scaleAnimation * pieRadius,cumulativeAngle,cumulativeAngle + segmentAngle);
        ctx.lineTo(width/2,height/2);
        ctx.closePath();
        ctx.fillStyle = data[i].color;
        ctx.fill();
        
        if(config.segmentShowStroke){
          ctx.lineWidth = config.segmentStrokeWidth;
          ctx.strokeStyle = config.segmentStrokeColor;
          ctx.stroke();
        }
        cumulativeAngle += segmentAngle;
      }     
    }   
  }

  var Doughnut = function(data,config,ctx){
    var segmentTotal = 0;
    
    //In case we have a canvas that is not a square. Minus 5 pixels as padding round the edge.
    var doughnutRadius = Min([height/2,width/2]) - 5;
    
    var cutoutRadius = doughnutRadius * (config.percentageInnerCutout/100);
    
    for (var i=0; i<data.length; i++){
      segmentTotal += data[i].value;
    }
    
    
    animationLoop(config,null,drawPieSegments,ctx);
    
    
    function drawPieSegments (animationDecimal){
      var cumulativeAngle = -Math.PI/2,
      scaleAnimation = 1,
      rotateAnimation = 1;
      if (config.animation) {
        if (config.animateScale) {
          scaleAnimation = animationDecimal;
        }
        if (config.animateRotate){
          rotateAnimation = animationDecimal;
        }
      }
      for (var i=0; i<data.length; i++){
        var segmentAngle = rotateAnimation * ((data[i].value/segmentTotal) * (Math.PI*2));
        ctx.beginPath();
        ctx.arc(width/2,height/2,scaleAnimation * doughnutRadius,cumulativeAngle,cumulativeAngle + segmentAngle,false);
        ctx.arc(width/2,height/2,scaleAnimation * cutoutRadius,cumulativeAngle + segmentAngle,cumulativeAngle,true);
        ctx.closePath();
        ctx.fillStyle = data[i].color;
        ctx.fill();
        
        if(config.segmentShowStroke){
          ctx.lineWidth = config.segmentStrokeWidth;
          ctx.strokeStyle = config.segmentStrokeColor;
          ctx.stroke();
        }
        cumulativeAngle += segmentAngle;
      }     
    }     
    
    
    
  }

  var Line = function(data,config,ctx){
    var maxSize, scaleHop, calculatedScale, labelHeight, scaleHeight, valueBounds, labelTemplateString, valueHop,widestXLabel, xAxisLength,yAxisPosX,xAxisPosY, rotateLabels = 0;
      
    calculateDrawingSizes();
    
    valueBounds = getValueBounds();
    //Check and set the scale
    labelTemplateString = (config.scaleShowLabels)? config.scaleLabel : "";
    if (!config.scaleOverride){
      
      calculatedScale = calculateScale(scaleHeight,valueBounds.maxSteps,valueBounds.minSteps,valueBounds.maxValue,valueBounds.minValue,labelTemplateString);
    }
    else {
      calculatedScale = {
        steps : config.scaleSteps,
        stepValue : config.scaleStepWidth,
        graphMin : config.scaleStartValue,
        labels : []
      }
      populateLabels(labelTemplateString, calculatedScale.labels,calculatedScale.steps,config.scaleStartValue,config.scaleStepWidth);
    }
    
    scaleHop = Math.floor(scaleHeight/calculatedScale.steps);
    calculateXAxisSize();
    animationLoop(config,drawScale,drawLines,ctx);    
    
    function drawLines(animPc){
      for (var i=0; i<data.datasets.length; i++){
        ctx.strokeStyle = data.datasets[i].strokeColor;
        ctx.lineWidth = config.datasetStrokeWidth;
        ctx.beginPath();
        ctx.moveTo(yAxisPosX, xAxisPosY - animPc*(calculateOffset(data.datasets[i].data[0],calculatedScale,scaleHop)))

        for (var j=1; j<data.datasets[i].data.length; j++){
          if (config.bezierCurve){
            ctx.bezierCurveTo(xPos(j-0.5),yPos(i,j-1),xPos(j-0.5),yPos(i,j),xPos(j),yPos(i,j));
          }
          else{
            ctx.lineTo(xPos(j),yPos(i,j));
          }
        }
        ctx.stroke();
        if (config.datasetFill){
          ctx.lineTo(yAxisPosX + (valueHop*(data.datasets[i].data.length-1)),xAxisPosY);
          ctx.lineTo(yAxisPosX,xAxisPosY);
          ctx.closePath();
          ctx.fillStyle = data.datasets[i].fillColor;
          ctx.fill();
        }
        else{
          ctx.closePath();
        }
        if(config.pointDot){
          ctx.fillStyle = data.datasets[i].pointColor;
          ctx.strokeStyle = data.datasets[i].pointStrokeColor;
          ctx.lineWidth = config.pointDotStrokeWidth;
          for (var k=0; k<data.datasets[i].data.length; k++){
            ctx.beginPath();
            ctx.arc(yAxisPosX + (valueHop *k),xAxisPosY - animPc*(calculateOffset(data.datasets[i].data[k],calculatedScale,scaleHop)),config.pointDotRadius,0,Math.PI*2,true);
            ctx.fill();
            ctx.stroke();
          }
        }
      }
      
      function yPos(dataSet,iteration){
        return xAxisPosY - animPc*(calculateOffset(data.datasets[dataSet].data[iteration],calculatedScale,scaleHop));     
      }
      function xPos(iteration){
        return yAxisPosX + (valueHop * iteration);
      }
    }
    function drawScale(){
      //X axis line
      ctx.lineWidth = config.scaleLineWidth;
      ctx.strokeStyle = config.scaleLineColor;
      ctx.beginPath();
      ctx.moveTo(width-widestXLabel/2+5,xAxisPosY);
      ctx.lineTo(width-(widestXLabel/2)-xAxisLength-5,xAxisPosY);
      ctx.stroke();
      
      
      if (rotateLabels > 0){
        ctx.save();
        ctx.textAlign = "right";
      }
      else{
        ctx.textAlign = "center";
      }
      ctx.fillStyle = config.scaleFontColor;
      for (var i=0; i<data.labels.length; i++){
        ctx.save();
        if (rotateLabels > 0){
          ctx.translate(yAxisPosX + i*valueHop,xAxisPosY + config.scaleFontSize);
          ctx.rotate(-(rotateLabels * (Math.PI/180)));
          ctx.fillText(data.labels[i], 0,0);
          ctx.restore();
        }
        
        else{
          ctx.fillText(data.labels[i], yAxisPosX + i*valueHop,xAxisPosY + config.scaleFontSize+3);          
        }

        ctx.beginPath();
        ctx.moveTo(yAxisPosX + i * valueHop, xAxisPosY+3);
        
        //Check i isnt 0, so we dont go over the Y axis twice.
        if(config.scaleShowGridLines && i>0){
          ctx.lineWidth = config.scaleGridLineWidth;
          ctx.strokeStyle = config.scaleGridLineColor;          
          ctx.lineTo(yAxisPosX + i * valueHop, 5);
        }
        else{
          ctx.lineTo(yAxisPosX + i * valueHop, xAxisPosY+3);        
        }
        ctx.stroke();
      }
      
      //Y axis
      ctx.lineWidth = config.scaleLineWidth;
      ctx.strokeStyle = config.scaleLineColor;
      ctx.beginPath();
      ctx.moveTo(yAxisPosX,xAxisPosY+5);
      ctx.lineTo(yAxisPosX,5);
      ctx.stroke();
      
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      for (var j=0; j<calculatedScale.steps; j++){
        ctx.beginPath();
        ctx.moveTo(yAxisPosX-3,xAxisPosY - ((j+1) * scaleHop));
        if (config.scaleShowGridLines){
          ctx.lineWidth = config.scaleGridLineWidth;
          ctx.strokeStyle = config.scaleGridLineColor;
          ctx.lineTo(yAxisPosX + xAxisLength + 5,xAxisPosY - ((j+1) * scaleHop));         
        }
        else{
          ctx.lineTo(yAxisPosX-0.5,xAxisPosY - ((j+1) * scaleHop));
        }
        
        ctx.stroke();
        
        if (config.scaleShowLabels){
          ctx.fillText(calculatedScale.labels[j],yAxisPosX-8,xAxisPosY - ((j+1) * scaleHop));
        }
      }
      
      
    }
    function calculateXAxisSize(){
      var longestText = 1;
      //if we are showing the labels
      if (config.scaleShowLabels){
        ctx.font = config.scaleFontStyle + " " + config.scaleFontSize+"px " + config.scaleFontFamily;
        for (var i=0; i<calculatedScale.labels.length; i++){
          var measuredText = ctx.measureText(calculatedScale.labels[i]).width;
          longestText = (measuredText > longestText)? measuredText : longestText;
        }
        //Add a little extra padding from the y axis
        longestText +=10;
      }
      xAxisLength = width - longestText - widestXLabel;
      valueHop = Math.floor(xAxisLength/(data.labels.length-1));  
        
      yAxisPosX = width-widestXLabel/2-xAxisLength;
      xAxisPosY = scaleHeight + config.scaleFontSize/2;       
    }   
    function calculateDrawingSizes(){
      maxSize = height;

      //Need to check the X axis first - measure the length of each text metric, and figure out if we need to rotate by 45 degrees.
      ctx.font = config.scaleFontStyle + " " + config.scaleFontSize+"px " + config.scaleFontFamily;
      widestXLabel = 1;
      for (var i=0; i<data.labels.length; i++){
        var textLength = ctx.measureText(data.labels[i]).width;
        //If the text length is longer - make that equal to longest text!
        widestXLabel = (textLength > widestXLabel)? textLength : widestXLabel;
      }
      if (width/data.labels.length < widestXLabel){
        rotateLabels = 45;
        if (width/data.labels.length < Math.cos(rotateLabels) * widestXLabel){
          rotateLabels = 90;
          maxSize -= widestXLabel; 
        }
        else{
          maxSize -= Math.sin(rotateLabels) * widestXLabel;
        }
      }
      else{
        maxSize -= config.scaleFontSize;
      }
      
      //Add a little padding between the x line and the text
      maxSize -= 5;
      
      
      labelHeight = config.scaleFontSize;
      
      maxSize -= labelHeight;
      //Set 5 pixels greater than the font size to allow for a little padding from the X axis.
      
      scaleHeight = maxSize;
      
      //Then get the area above we can safely draw on.
      
    }   
    function getValueBounds() {
      var upperValue = Number.MIN_VALUE;
      var lowerValue = Number.MAX_VALUE;
      for (var i=0; i<data.datasets.length; i++){
        for (var j=0; j<data.datasets[i].data.length; j++){
          if ( data.datasets[i].data[j] > upperValue) { upperValue = data.datasets[i].data[j] };
          if ( data.datasets[i].data[j] < lowerValue) { lowerValue = data.datasets[i].data[j] };
        }
      };
  
      var maxSteps = Math.floor((scaleHeight / (labelHeight*0.66)));
      var minSteps = Math.floor((scaleHeight / labelHeight*0.5));
      
      return {
        maxValue : upperValue,
        minValue : lowerValue,
        maxSteps : maxSteps,
        minSteps : minSteps
      };
      
  
    }

    
  }
  
  var Bar = function(data,config,ctx){
    var maxSize, scaleHop, calculatedScale, labelHeight, scaleHeight, valueBounds, labelTemplateString, valueHop,widestXLabel, xAxisLength,yAxisPosX,xAxisPosY,barWidth, rotateLabels = 0;
      
    calculateDrawingSizes();
    
    valueBounds = getValueBounds();
    //Check and set the scale
    labelTemplateString = (config.scaleShowLabels)? config.scaleLabel : "";
    if (!config.scaleOverride){
      
      calculatedScale = calculateScale(scaleHeight,valueBounds.maxSteps,valueBounds.minSteps,valueBounds.maxValue,valueBounds.minValue,labelTemplateString);
    }
    else {
      calculatedScale = {
        steps : config.scaleSteps,
        stepValue : config.scaleStepWidth,
        graphMin : config.scaleStartValue,
        labels : []
      }
      populateLabels(labelTemplateString, calculatedScale.labels,calculatedScale.steps,config.scaleStartValue,config.scaleStepWidth);
    }
    
    scaleHop = Math.floor(scaleHeight/calculatedScale.steps);
    calculateXAxisSize();
    animationLoop(config,drawScale,drawBars,ctx);   
    
    function drawBars(animPc){
      ctx.lineWidth = config.barStrokeWidth;
      for (var i=0; i<data.datasets.length; i++){
          ctx.fillStyle = data.datasets[i].fillColor;
          ctx.strokeStyle = data.datasets[i].strokeColor;
        for (var j=0; j<data.datasets[i].data.length; j++){
          var barOffset = yAxisPosX + config.barValueSpacing + valueHop*j + barWidth*i + config.barDatasetSpacing*i + config.barStrokeWidth*i;
          
          ctx.beginPath();
          ctx.moveTo(barOffset, xAxisPosY);
          ctx.lineTo(barOffset, xAxisPosY - animPc*calculateOffset(data.datasets[i].data[j],calculatedScale,scaleHop)+(config.barStrokeWidth/2));
          ctx.lineTo(barOffset + barWidth, xAxisPosY - animPc*calculateOffset(data.datasets[i].data[j],calculatedScale,scaleHop)+(config.barStrokeWidth/2));
          ctx.lineTo(barOffset + barWidth, xAxisPosY);
          if(config.barShowStroke){
            ctx.stroke();
          }
          ctx.closePath();
          ctx.fill();
        }
      }
      
    }
    function drawScale(){
      //X axis line
      ctx.lineWidth = config.scaleLineWidth;
      ctx.strokeStyle = config.scaleLineColor;
      ctx.beginPath();
      ctx.moveTo(width-widestXLabel/2+5,xAxisPosY);
      ctx.lineTo(width-(widestXLabel/2)-xAxisLength-5,xAxisPosY);
      ctx.stroke();
      
      
      if (rotateLabels > 0){
        ctx.save();
        ctx.textAlign = "right";
      }
      else{
        ctx.textAlign = "center";
      }
      ctx.fillStyle = config.scaleFontColor;
      for (var i=0; i<data.labels.length; i++){
        ctx.save();
        if (rotateLabels > 0){
          ctx.translate(yAxisPosX + i*valueHop,xAxisPosY + config.scaleFontSize);
          ctx.rotate(-(rotateLabels * (Math.PI/180)));
          ctx.fillText(data.labels[i], 0,0);
          ctx.restore();
        }
        
        else{
          ctx.fillText(data.labels[i], yAxisPosX + i*valueHop + valueHop/2,xAxisPosY + config.scaleFontSize+3);         
        }

        ctx.beginPath();
        ctx.moveTo(yAxisPosX + (i+1) * valueHop, xAxisPosY+3);
        
        //Check i isnt 0, so we dont go over the Y axis twice.
          ctx.lineWidth = config.scaleGridLineWidth;
          ctx.strokeStyle = config.scaleGridLineColor;          
          ctx.lineTo(yAxisPosX + (i+1) * valueHop, 5);
        ctx.stroke();
      }
      
      //Y axis
      ctx.lineWidth = config.scaleLineWidth;
      ctx.strokeStyle = config.scaleLineColor;
      ctx.beginPath();
      ctx.moveTo(yAxisPosX,xAxisPosY+5);
      ctx.lineTo(yAxisPosX,5);
      ctx.stroke();
      
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      for (var j=0; j<calculatedScale.steps; j++){
        ctx.beginPath();
        ctx.moveTo(yAxisPosX-3,xAxisPosY - ((j+1) * scaleHop));
        if (config.scaleShowGridLines){
          ctx.lineWidth = config.scaleGridLineWidth;
          ctx.strokeStyle = config.scaleGridLineColor;
          ctx.lineTo(yAxisPosX + xAxisLength + 5,xAxisPosY - ((j+1) * scaleHop));         
        }
        else{
          ctx.lineTo(yAxisPosX-0.5,xAxisPosY - ((j+1) * scaleHop));
        }
        
        ctx.stroke();
        if (config.scaleShowLabels){
          ctx.fillText(calculatedScale.labels[j],yAxisPosX-8,xAxisPosY - ((j+1) * scaleHop));
        }
      }
      
      
    }
    function calculateXAxisSize(){
      var longestText = 1;
      //if we are showing the labels
      if (config.scaleShowLabels){
        ctx.font = config.scaleFontStyle + " " + config.scaleFontSize+"px " + config.scaleFontFamily;
        for (var i=0; i<calculatedScale.labels.length; i++){
          var measuredText = ctx.measureText(calculatedScale.labels[i]).width;
          longestText = (measuredText > longestText)? measuredText : longestText;
        }
        //Add a little extra padding from the y axis
        longestText +=10;
      }
      xAxisLength = width - longestText - widestXLabel;
      valueHop = Math.floor(xAxisLength/(data.labels.length));  
      
      barWidth = (valueHop - config.scaleGridLineWidth*2 - (config.barValueSpacing*2) - (config.barDatasetSpacing*data.datasets.length-1) - ((config.barStrokeWidth/2)*data.datasets.length-1))/data.datasets.length;
      
      yAxisPosX = width-widestXLabel/2-xAxisLength;
      xAxisPosY = scaleHeight + config.scaleFontSize/2;       
    }   
    function calculateDrawingSizes(){
      maxSize = height;

      //Need to check the X axis first - measure the length of each text metric, and figure out if we need to rotate by 45 degrees.
      ctx.font = config.scaleFontStyle + " " + config.scaleFontSize+"px " + config.scaleFontFamily;
      widestXLabel = 1;
      for (var i=0; i<data.labels.length; i++){
        var textLength = ctx.measureText(data.labels[i]).width;
        //If the text length is longer - make that equal to longest text!
        widestXLabel = (textLength > widestXLabel)? textLength : widestXLabel;
      }
      if (width/data.labels.length < widestXLabel){
        rotateLabels = 45;
        if (width/data.labels.length < Math.cos(rotateLabels) * widestXLabel){
          rotateLabels = 90;
          maxSize -= widestXLabel; 
        }
        else{
          maxSize -= Math.sin(rotateLabels) * widestXLabel;
        }
      }
      else{
        maxSize -= config.scaleFontSize;
      }
      
      //Add a little padding between the x line and the text
      maxSize -= 5;
      
      
      labelHeight = config.scaleFontSize;
      
      maxSize -= labelHeight;
      //Set 5 pixels greater than the font size to allow for a little padding from the X axis.
      
      scaleHeight = maxSize;
      
      //Then get the area above we can safely draw on.
      
    }   
    function getValueBounds() {
      var upperValue = Number.MIN_VALUE;
      var lowerValue = Number.MAX_VALUE;
      for (var i=0; i<data.datasets.length; i++){
        for (var j=0; j<data.datasets[i].data.length; j++){
          if ( data.datasets[i].data[j] > upperValue) { upperValue = data.datasets[i].data[j] };
          if ( data.datasets[i].data[j] < lowerValue) { lowerValue = data.datasets[i].data[j] };
        }
      };
  
      var maxSteps = Math.floor((scaleHeight / (labelHeight*0.66)));
      var minSteps = Math.floor((scaleHeight / labelHeight*0.5));
      
      return {
        maxValue : upperValue,
        minValue : lowerValue,
        maxSteps : maxSteps,
        minSteps : minSteps
      };
      
  
    }
  }
  
  function calculateOffset(val,calculatedScale,scaleHop){
    var outerValue = calculatedScale.steps * calculatedScale.stepValue;
    var adjustedValue = val - calculatedScale.graphMin;
    var scalingFactor = CapValue(adjustedValue/outerValue,1,0);
    return (scaleHop*calculatedScale.steps) * scalingFactor;
  }
  
  function animationLoop(config,drawScale,drawData,ctx){
    var animFrameAmount = (config.animation)? 1/CapValue(config.animationSteps,Number.MAX_VALUE,1) : 1,
      easingFunction = animationOptions[config.animationEasing],
      percentAnimComplete =(config.animation)? 0 : 1;
    
  
    
    if (typeof drawScale !== "function") drawScale = function(){};
    
    requestAnimFrame(animLoop);
    
    function animateFrame(){
      var easeAdjustedAnimationPercent =(config.animation)? CapValue(easingFunction(percentAnimComplete),null,0) : 1;
      clear(ctx);
      if(config.scaleOverlay){
        drawData(easeAdjustedAnimationPercent);
        drawScale();
      } else {
        drawScale();
        drawData(easeAdjustedAnimationPercent);
      }       
    }
    function animLoop(){
      //We need to check if the animation is incomplete (less than 1), or complete (1).
        percentAnimComplete += animFrameAmount;
        animateFrame(); 
        //Stop the loop continuing forever
        if (percentAnimComplete <= 1){
          requestAnimFrame(animLoop);
        }
        else{
          if (typeof config.onAnimationComplete == "function") config.onAnimationComplete();
        }
      
    }   
    
  }

  //Declare global functions to be called within this namespace here.
  
  
  // shim layer with setTimeout fallback
  var requestAnimFrame = (function(){
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback) {
        window.setTimeout(callback, 1000 / 60);
      };
  })();

  function calculateScale(drawingHeight,maxSteps,minSteps,maxValue,minValue,labelTemplateString){
      var graphMin,graphMax,graphRange,stepValue,numberOfSteps,valueRange,rangeOrderOfMagnitude,decimalNum;
      
      valueRange = maxValue - minValue;
      
      rangeOrderOfMagnitude = calculateOrderOfMagnitude(valueRange);

          graphMin = Math.floor(minValue / (1 * Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude);
            
            graphMax = Math.ceil(maxValue / (1 * Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude);
            
            graphRange = graphMax - graphMin;
            
            stepValue = Math.pow(10, rangeOrderOfMagnitude);
            
          numberOfSteps = Math.round(graphRange / stepValue);
          
          //Compare number of steps to the max and min for that size graph, and add in half steps if need be.         
          while(numberOfSteps < minSteps || numberOfSteps > maxSteps) {
            if (numberOfSteps < minSteps){
              stepValue /= 2;
              numberOfSteps = Math.round(graphRange/stepValue);
            }
            else{
              stepValue *=2;
              numberOfSteps = Math.round(graphRange/stepValue);
            }
          };

          var labels = [];
          populateLabels(labelTemplateString, labels, numberOfSteps, graphMin, stepValue);
    
          return {
            steps : numberOfSteps,
        stepValue : stepValue,
        graphMin : graphMin,
        labels : labels           
            
          }
    
      function calculateOrderOfMagnitude(val){
        return Math.floor(Math.log(val) / Math.LN10);
      }   


  }

    //Populate an array of all the labels by interpolating the string.
    function populateLabels(labelTemplateString, labels, numberOfSteps, graphMin, stepValue) {
        if (labelTemplateString) {
            //Fix floating point errors by setting to fixed the on the same decimal as the stepValue.
            for (var i = 1; i < numberOfSteps + 1; i++) {
                labels.push(tmpl(labelTemplateString, {value: (graphMin + (stepValue * i)).toFixed(getDecimalPlaces(stepValue))}));
            }
        }
    }
  
  //Max value from array
  function Max( array ){
    return Math.max.apply( Math, array );
  };
  //Min value from array
  function Min( array ){
    return Math.min.apply( Math, array );
  };
  //Default if undefined
  function Default(userDeclared,valueIfFalse){
    if(!userDeclared){
      return valueIfFalse;
    } else {
      return userDeclared;
    }
  };
  //Is a number function
  function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  //Apply cap a value at a high or low number
  function CapValue(valueToCap, maxValue, minValue){
    if(isNumber(maxValue)) {
      if( valueToCap > maxValue ) {
        return maxValue;
      }
    }
    if(isNumber(minValue)){
      if ( valueToCap < minValue ){
        return minValue;
      }
    }
    return valueToCap;
  }
  function getDecimalPlaces (num){
    var numberOfDecimalPlaces;
    if (num%1!=0){
      return num.toString().split(".")[1].length
    }
    else{
      return 0;
    }
    
  } 
  
  function mergeChartConfig(defaults,userDefined){
    var returnObj = {};
      for (var attrname in defaults) { returnObj[attrname] = defaults[attrname]; }
      for (var attrname in userDefined) { returnObj[attrname] = userDefined[attrname]; }
      return returnObj;
  }
  
  //Javascript micro templating by John Resig - source at http://ejohn.org/blog/javascript-micro-templating/
    var cache = {};
   
    function tmpl(str, data){
      // Figure out if we're getting a template, or if we need to
      // load the template - and be sure to cache the result.
      var fn = !/\W/.test(str) ?
        cache[str] = cache[str] ||
          tmpl(document.getElementById(str).innerHTML) :
       
        // Generate a reusable function that will serve as a template
        // generator (and which will be cached).
        new Function("obj",
          "var p=[],print=function(){p.push.apply(p,arguments);};" +
         
          // Introduce the data as local variables using with(){}
          "with(obj){p.push('" +
         
          // Convert the template into pure JavaScript
          str
            .replace(/[\r\t\n]/g, " ")
            .split("<%").join("\t")
            .replace(/((^|%>)[^\t]*)'/g, "$1\r")
            .replace(/\t=(.*?)%>/g, "',$1,'")
            .split("\t").join("');")
            .split("%>").join("p.push('")
            .split("\r").join("\\'")
        + "');}return p.join('');");
     
      // Provide some basic currying to the user
      return data ? fn( data ) : fn;
    };
}

;
/* ===================================================
 * bootstrap-transition.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#transitions
 * ===================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


  /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
   * ======================================================= */

  $(function () {

    $.support.transition = (function () {

      var transitionEnd = (function () {

        var el = document.createElement('bootstrap')
          , transEndEventNames = {
               'WebkitTransition' : 'webkitTransitionEnd'
            ,  'MozTransition'    : 'transitionend'
            ,  'OTransition'      : 'oTransitionEnd otransitionend'
            ,  'transition'       : 'transitionend'
            }
          , name

        for (name in transEndEventNames){
          if (el.style[name] !== undefined) {
            return transEndEventNames[name]
          }
        }

      }())

      return transitionEnd && {
        end: transitionEnd
      }

    })()

  })

}(window.jQuery);/* ==========================================================
 * bootstrap-alert.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#alerts
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* ALERT CLASS DEFINITION
  * ====================== */

  var dismiss = '[data-dismiss="alert"]'
    , Alert = function (el) {
        $(el).on('click', dismiss, this.close)
      }

  Alert.prototype.close = function (e) {
    var $this = $(this)
      , selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = $(selector)

    e && e.preventDefault()

    $parent.length || ($parent = $this.hasClass('alert') ? $this : $this.parent())

    $parent.trigger(e = $.Event('close'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent
        .trigger('closed')
        .remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent.on($.support.transition.end, removeElement) :
      removeElement()
  }


 /* ALERT PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('alert')
      if (!data) $this.data('alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


 /* ALERT NO CONFLICT
  * ================= */

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


 /* ALERT DATA-API
  * ============== */

  $(document).on('click.alert.data-api', dismiss, Alert.prototype.close)

}(window.jQuery);/* ============================================================
 * bootstrap-button.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#buttons
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* BUTTON PUBLIC CLASS DEFINITION
  * ============================== */

  var Button = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.button.defaults, options)
  }

  Button.prototype.setState = function (state) {
    var d = 'disabled'
      , $el = this.$element
      , data = $el.data()
      , val = $el.is('input') ? 'val' : 'html'

    state = state + 'Text'
    data.resetText || $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d)
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons-radio"]')

    $parent && $parent
      .find('.active')
      .removeClass('active')

    this.$element.toggleClass('active')
  }


 /* BUTTON PLUGIN DEFINITION
  * ======================== */

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('button')
        , options = typeof option == 'object' && option
      if (!data) $this.data('button', (data = new Button(this, options)))
      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.defaults = {
    loadingText: 'loading...'
  }

  $.fn.button.Constructor = Button


 /* BUTTON NO CONFLICT
  * ================== */

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


 /* BUTTON DATA-API
  * =============== */

  $(document).on('click.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
  })

}(window.jQuery);/* ==========================================================
 * bootstrap-carousel.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#carousel
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* CAROUSEL CLASS DEFINITION
  * ========================= */

  var Carousel = function (element, options) {
    this.$element = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options = options
    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.prototype = {

    cycle: function (e) {
      if (!e) this.paused = false
      if (this.interval) clearInterval(this.interval);
      this.options.interval
        && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
      return this
    }

  , getActiveIndex: function () {
      this.$active = this.$element.find('.item.active')
      this.$items = this.$active.parent().children()
      return this.$items.index(this.$active)
    }

  , to: function (pos) {
      var activeIndex = this.getActiveIndex()
        , that = this

      if (pos > (this.$items.length - 1) || pos < 0) return

      if (this.sliding) {
        return this.$element.one('slid', function () {
          that.to(pos)
        })
      }

      if (activeIndex == pos) {
        return this.pause().cycle()
      }

      return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
    }

  , pause: function (e) {
      if (!e) this.paused = true
      if (this.$element.find('.next, .prev').length && $.support.transition.end) {
        this.$element.trigger($.support.transition.end)
        this.cycle(true)
      }
      clearInterval(this.interval)
      this.interval = null
      return this
    }

  , next: function () {
      if (this.sliding) return
      return this.slide('next')
    }

  , prev: function () {
      if (this.sliding) return
      return this.slide('prev')
    }

  , slide: function (type, next) {
      var $active = this.$element.find('.item.active')
        , $next = next || $active[type]()
        , isCycling = this.interval
        , direction = type == 'next' ? 'left' : 'right'
        , fallback  = type == 'next' ? 'first' : 'last'
        , that = this
        , e

      this.sliding = true

      isCycling && this.pause()

      $next = $next.length ? $next : this.$element.find('.item')[fallback]()

      e = $.Event('slide', {
        relatedTarget: $next[0]
      , direction: direction
      })

      if ($next.hasClass('active')) return

      if (this.$indicators.length) {
        this.$indicators.find('.active').removeClass('active')
        this.$element.one('slid', function () {
          var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
          $nextIndicator && $nextIndicator.addClass('active')
        })
      }

      if ($.support.transition && this.$element.hasClass('slide')) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $next.addClass(type)
        $next[0].offsetWidth // force reflow
        $active.addClass(direction)
        $next.addClass(direction)
        this.$element.one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
      } else {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $active.removeClass('active')
        $next.addClass('active')
        this.sliding = false
        this.$element.trigger('slid')
      }

      isCycling && this.cycle()

      return this
    }

  }


 /* CAROUSEL PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('carousel')
        , options = $.extend({}, $.fn.carousel.defaults, typeof option == 'object' && option)
        , action = typeof option == 'string' ? option : options.slide
      if (!data) $this.data('carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.defaults = {
    interval: 5000
  , pause: 'hover'
  }

  $.fn.carousel.Constructor = Carousel


 /* CAROUSEL NO CONFLICT
  * ==================== */

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }

 /* CAROUSEL DATA-API
  * ================= */

  $(document).on('click.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this = $(this), href
      , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      , options = $.extend({}, $target.data(), $this.data())
      , slideIndex

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('carousel').pause().to(slideIndex).cycle()
    }

    e.preventDefault()
  })

}(window.jQuery);/* =============================================================
 * bootstrap-collapse.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#collapse
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* COLLAPSE PUBLIC CLASS DEFINITION
  * ================================ */

  var Collapse = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.collapse.defaults, options)

    if (this.options.parent) {
      this.$parent = $(this.options.parent)
    }

    this.options.toggle && this.toggle()
  }

  Collapse.prototype = {

    constructor: Collapse

  , dimension: function () {
      var hasWidth = this.$element.hasClass('width')
      return hasWidth ? 'width' : 'height'
    }

  , show: function () {
      var dimension
        , scroll
        , actives
        , hasData

      if (this.transitioning || this.$element.hasClass('in')) return

      dimension = this.dimension()
      scroll = $.camelCase(['scroll', dimension].join('-'))
      actives = this.$parent && this.$parent.find('> .accordion-group > .in')

      if (actives && actives.length) {
        hasData = actives.data('collapse')
        if (hasData && hasData.transitioning) return
        actives.collapse('hide')
        hasData || actives.data('collapse', null)
      }

      this.$element[dimension](0)
      this.transition('addClass', $.Event('show'), 'shown')
      $.support.transition && this.$element[dimension](this.$element[0][scroll])
    }

  , hide: function () {
      var dimension
      if (this.transitioning || !this.$element.hasClass('in')) return
      dimension = this.dimension()
      this.reset(this.$element[dimension]())
      this.transition('removeClass', $.Event('hide'), 'hidden')
      this.$element[dimension](0)
    }

  , reset: function (size) {
      var dimension = this.dimension()

      this.$element
        .removeClass('collapse')
        [dimension](size || 'auto')
        [0].offsetWidth

      this.$element[size !== null ? 'addClass' : 'removeClass']('collapse')

      return this
    }

  , transition: function (method, startEvent, completeEvent) {
      var that = this
        , complete = function () {
            if (startEvent.type == 'show') that.reset()
            that.transitioning = 0
            that.$element.trigger(completeEvent)
          }

      this.$element.trigger(startEvent)

      if (startEvent.isDefaultPrevented()) return

      this.transitioning = 1

      this.$element[method]('in')

      $.support.transition && this.$element.hasClass('collapse') ?
        this.$element.one($.support.transition.end, complete) :
        complete()
    }

  , toggle: function () {
      this[this.$element.hasClass('in') ? 'hide' : 'show']()
    }

  }


 /* COLLAPSE PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('collapse')
        , options = $.extend({}, $.fn.collapse.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.defaults = {
    toggle: true
  }

  $.fn.collapse.Constructor = Collapse


 /* COLLAPSE NO CONFLICT
  * ==================== */

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


 /* COLLAPSE DATA-API
  * ================= */

  $(document).on('click.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this = $(this), href
      , target = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
      , option = $(target).data('collapse') ? 'toggle' : $this.data()
    $this[$(target).hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    $(target).collapse(option)
  })

}(window.jQuery);/* ============================================================
 * bootstrap-dropdown.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#dropdowns
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* DROPDOWN CLASS DEFINITION
  * ========================= */

  var toggle = '[data-toggle=dropdown]'
    , Dropdown = function (element) {
        var $el = $(element).on('click.dropdown.data-api', this.toggle)
        $('html').on('click.dropdown.data-api', function () {
          $el.parent().removeClass('open')
        })
      }

  Dropdown.prototype = {

    constructor: Dropdown

  , toggle: function (e) {
      var $this = $(this)
        , $parent
        , isActive

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      clearMenus()

      if (!isActive) {
        $parent.toggleClass('open')
      }

      $this.focus()

      return false
    }

  , keydown: function (e) {
      var $this
        , $items
        , $active
        , $parent
        , isActive
        , index

      if (!/(38|40|27)/.test(e.keyCode)) return

      $this = $(this)

      e.preventDefault()
      e.stopPropagation()

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      if (!isActive || (isActive && e.keyCode == 27)) {
        if (e.which == 27) $parent.find(toggle).focus()
        return $this.click()
      }

      $items = $('[role=menu] li:not(.divider):visible a', $parent)

      if (!$items.length) return

      index = $items.index($items.filter(':focus'))

      if (e.keyCode == 38 && index > 0) index--                                        // up
      if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
      if (!~index) index = 0

      $items
        .eq(index)
        .focus()
    }

  }

  function clearMenus() {
    $(toggle).each(function () {
      getParent($(this)).removeClass('open')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = selector && $(selector)

    if (!$parent || !$parent.length) $parent = $this.parent()

    return $parent
  }


  /* DROPDOWN PLUGIN DEFINITION
   * ========================== */

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('dropdown')
      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


 /* DROPDOWN NO CONFLICT
  * ==================== */

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  /* APPLY TO STANDARD DROPDOWN ELEMENTS
   * =================================== */

  $(document)
    .on('click.dropdown.data-api', clearMenus)
    .on('click.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.dropdown-menu', function (e) { e.stopPropagation() })
    .on('click.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(window.jQuery);
/* =========================================================
 * bootstrap-modal.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#modals
 * =========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */


!function ($) {

  "use strict"; // jshint ;_;


 /* MODAL CLASS DEFINITION
  * ====================== */

  var Modal = function (element, options) {
    this.options = options
    this.$element = $(element)
      .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
    this.options.remote && this.$element.find('.modal-body').load(this.options.remote)
  }

  Modal.prototype = {

      constructor: Modal

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
      }

    , show: function () {
        var that = this
          , e = $.Event('show')

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.backdrop(function () {
          var transition = $.support.transition && that.$element.hasClass('fade')

          if (!that.$element.parent().length) {
            that.$element.appendTo(document.body) //don't move modals dom position
          }

          that.$element.show()

          if (transition) {
            that.$element[0].offsetWidth // force reflow
          }

          that.$element
            .addClass('in')
            .attr('aria-hidden', false)

          that.enforceFocus()

          transition ?
            that.$element.one($.support.transition.end, function () { that.$element.focus().trigger('shown') }) :
            that.$element.focus().trigger('shown')

        })
      }

    , hide: function (e) {
        e && e.preventDefault()

        var that = this

        e = $.Event('hide')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)

        $.support.transition && this.$element.hasClass('fade') ?
          this.hideWithTransition() :
          this.hideModal()
      }

    , enforceFocus: function () {
        var that = this
        $(document).on('focusin.modal', function (e) {
          if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
            that.$element.focus()
          }
        })
      }

    , escape: function () {
        var that = this
        if (this.isShown && this.options.keyboard) {
          this.$element.on('keyup.dismiss.modal', function ( e ) {
            e.which == 27 && that.hide()
          })
        } else if (!this.isShown) {
          this.$element.off('keyup.dismiss.modal')
        }
      }

    , hideWithTransition: function () {
        var that = this
          , timeout = setTimeout(function () {
              that.$element.off($.support.transition.end)
              that.hideModal()
            }, 500)

        this.$element.one($.support.transition.end, function () {
          clearTimeout(timeout)
          that.hideModal()
        })
      }

    , hideModal: function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
          that.removeBackdrop()
          that.$element.trigger('hidden')
        })
      }

    , removeBackdrop: function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
      }

    , backdrop: function (callback) {
        var that = this
          , animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
          var doAnimate = $.support.transition && animate

          this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
            .appendTo(document.body)

          this.$backdrop.click(
            this.options.backdrop == 'static' ?
              $.proxy(this.$element[0].focus, this.$element[0])
            : $.proxy(this.hide, this)
          )

          if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

          this.$backdrop.addClass('in')

          if (!callback) return

          doAnimate ?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (!this.isShown && this.$backdrop) {
          this.$backdrop.removeClass('in')

          $.support.transition && this.$element.hasClass('fade')?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (callback) {
          callback()
        }
      }
  }


 /* MODAL PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.modal

  $.fn.modal = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('modal')
        , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option]()
      else if (options.show) data.show()
    })
  }

  $.fn.modal.defaults = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  $.fn.modal.Constructor = Modal


 /* MODAL NO CONFLICT
  * ================= */

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


 /* MODAL DATA-API
  * ============== */

  $(document).on('click.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this = $(this)
      , href = $this.attr('href')
      , $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
      , option = $target.data('modal') ? 'toggle' : $.extend({ remote:!/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option)
      .one('hide', function () {
        $this.focus()
      })
  })

}(window.jQuery);
/* ===========================================================
 * bootstrap-tooltip.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TOOLTIP PUBLIC CLASS DEFINITION
  * =============================== */

  var Tooltip = function (element, options) {
    this.init('tooltip', element, options)
  }

  Tooltip.prototype = {

    constructor: Tooltip

  , init: function (type, element, options) {
      var eventIn
        , eventOut
        , triggers
        , trigger
        , i

      this.type = type
      this.$element = $(element)
      this.options = this.getOptions(options)
      this.enabled = true

      triggers = this.options.trigger.split(' ')

      for (i = triggers.length; i--;) {
        trigger = triggers[i]
        if (trigger == 'click') {
          this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
        } else if (trigger != 'manual') {
          eventIn = trigger == 'hover' ? 'mouseenter' : 'focus'
          eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'
          this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
          this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
        }
      }

      this.options.selector ?
        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
        this.fixTitle()
    }

  , getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), options)

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay
        , hide: options.delay
        }
      }

      return options
    }

  , enter: function (e) {
      var defaults = $.fn[this.type].defaults
        , options = {}
        , self

      this._options && $.each(this._options, function (key, value) {
        if (defaults[key] != value) options[key] = value
      }, this)

      self = $(e.currentTarget)[this.type](options).data(this.type)

      if (!self.options.delay || !self.options.delay.show) return self.show()

      clearTimeout(this.timeout)
      self.hoverState = 'in'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'in') self.show()
      }, self.options.delay.show)
    }

  , leave: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (this.timeout) clearTimeout(this.timeout)
      if (!self.options.delay || !self.options.delay.hide) return self.hide()

      self.hoverState = 'out'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'out') self.hide()
      }, self.options.delay.hide)
    }

  , show: function () {
      var $tip
        , pos
        , actualWidth
        , actualHeight
        , placement
        , tp
        , e = $.Event('show')

      if (this.hasContent() && this.enabled) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $tip = this.tip()
        this.setContent()

        if (this.options.animation) {
          $tip.addClass('fade')
        }

        placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement

        $tip
          .detach()
          .css({ top: 0, left: 0, display: 'block' })

        this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

        pos = this.getPosition()

        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight

        switch (placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'top':
            tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'left':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
            break
          case 'right':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
            break
        }

        this.applyPlacement(tp, placement)
        this.$element.trigger('shown')
      }
    }

  , applyPlacement: function(offset, placement){
      var $tip = this.tip()
        , width = $tip[0].offsetWidth
        , height = $tip[0].offsetHeight
        , actualWidth
        , actualHeight
        , delta
        , replace

      $tip
        .offset(offset)
        .addClass(placement)
        .addClass('in')

      actualWidth = $tip[0].offsetWidth
      actualHeight = $tip[0].offsetHeight

      if (placement == 'top' && actualHeight != height) {
        offset.top = offset.top + height - actualHeight
        replace = true
      }

      if (placement == 'bottom' || placement == 'top') {
        delta = 0

        if (offset.left < 0){
          delta = offset.left * -2
          offset.left = 0
          $tip.offset(offset)
          actualWidth = $tip[0].offsetWidth
          actualHeight = $tip[0].offsetHeight
        }

        this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
      } else {
        this.replaceArrow(actualHeight - height, actualHeight, 'top')
      }

      if (replace) $tip.offset(offset)
    }

  , replaceArrow: function(delta, dimension, position){
      this
        .arrow()
        .css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
    }

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()

      $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
      $tip.removeClass('fade in top bottom left right')
    }

  , hide: function () {
      var that = this
        , $tip = this.tip()
        , e = $.Event('hide')

      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return

      $tip.removeClass('in')

      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).detach()
        }, 500)

        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout)
          $tip.detach()
        })
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        removeWithAnimation() :
        $tip.detach()

      this.$element.trigger('hidden')

      return this
    }

  , fixTitle: function () {
      var $e = this.$element
      if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
      }
    }

  , hasContent: function () {
      return this.getTitle()
    }

  , getPosition: function () {
      var el = this.$element[0]
      return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
        width: el.offsetWidth
      , height: el.offsetHeight
      }, this.$element.offset())
    }

  , getTitle: function () {
      var title
        , $e = this.$element
        , o = this.options

      title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

      return title
    }

  , tip: function () {
      return this.$tip = this.$tip || $(this.options.template)
    }

  , arrow: function(){
      return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
    }

  , validate: function () {
      if (!this.$element[0].parentNode) {
        this.hide()
        this.$element = null
        this.options = null
      }
    }

  , enable: function () {
      this.enabled = true
    }

  , disable: function () {
      this.enabled = false
    }

  , toggleEnabled: function () {
      this.enabled = !this.enabled
    }

  , toggle: function (e) {
      var self = e ? $(e.currentTarget)[this.type](this._options).data(this.type) : this
      self.tip().hasClass('in') ? self.hide() : self.show()
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  }


 /* TOOLTIP PLUGIN DEFINITION
  * ========================= */

  var old = $.fn.tooltip

  $.fn.tooltip = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tooltip')
        , options = typeof option == 'object' && option
      if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip

  $.fn.tooltip.defaults = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }


 /* TOOLTIP NO CONFLICT
  * =================== */

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(window.jQuery);
/* ===========================================================
 * bootstrap-popover.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#popovers
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* POPOVER PUBLIC CLASS DEFINITION
  * =============================== */

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }


  /* NOTE: POPOVER EXTENDS BOOTSTRAP-TOOLTIP.js
     ========================================== */

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {

    constructor: Popover

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()
        , content = this.getContent()

      $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
      $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

      $tip.removeClass('fade top bottom left right in')
    }

  , hasContent: function () {
      return this.getTitle() || this.getContent()
    }

  , getContent: function () {
      var content
        , $e = this.$element
        , o = this.options

      content = (typeof o.content == 'function' ? o.content.call($e[0]) :  o.content)
        || $e.attr('data-content')

      return content
    }

  , tip: function () {
      if (!this.$tip) {
        this.$tip = $(this.options.template)
      }
      return this.$tip
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  })


 /* POPOVER PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('popover')
        , options = typeof option == 'object' && option
      if (!data) $this.data('popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover

  $.fn.popover.defaults = $.extend({} , $.fn.tooltip.defaults, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


 /* POPOVER NO CONFLICT
  * =================== */

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(window.jQuery);
/* =============================================================
 * bootstrap-scrollspy.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#scrollspy
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* SCROLLSPY CLASS DEFINITION
  * ========================== */

  function ScrollSpy(element, options) {
    var process = $.proxy(this.process, this)
      , $element = $(element).is('body') ? $(window) : $(element)
      , href
    this.options = $.extend({}, $.fn.scrollspy.defaults, options)
    this.$scrollElement = $element.on('scroll.scroll-spy.data-api', process)
    this.selector = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.$body = $('body')
    this.refresh()
    this.process()
  }

  ScrollSpy.prototype = {

      constructor: ScrollSpy

    , refresh: function () {
        var self = this
          , $targets

        this.offsets = $([])
        this.targets = $([])

        $targets = this.$body
          .find(this.selector)
          .map(function () {
            var $el = $(this)
              , href = $el.data('target') || $el.attr('href')
              , $href = /^#\w/.test(href) && $(href)
            return ( $href
              && $href.length
              && [[ $href.position().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]] ) || null
          })
          .sort(function (a, b) { return a[0] - b[0] })
          .each(function () {
            self.offsets.push(this[0])
            self.targets.push(this[1])
          })
      }

    , process: function () {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
          , scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
          , maxScroll = scrollHeight - this.$scrollElement.height()
          , offsets = this.offsets
          , targets = this.targets
          , activeTarget = this.activeTarget
          , i

        if (scrollTop >= maxScroll) {
          return activeTarget != (i = targets.last()[0])
            && this.activate ( i )
        }

        for (i = offsets.length; i--;) {
          activeTarget != targets[i]
            && scrollTop >= offsets[i]
            && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
            && this.activate( targets[i] )
        }
      }

    , activate: function (target) {
        var active
          , selector

        this.activeTarget = target

        $(this.selector)
          .parent('.active')
          .removeClass('active')

        selector = this.selector
          + '[data-target="' + target + '"],'
          + this.selector + '[href="' + target + '"]'

        active = $(selector)
          .parent('li')
          .addClass('active')

        if (active.parent('.dropdown-menu').length)  {
          active = active.closest('li.dropdown').addClass('active')
        }

        active.trigger('activate')
      }

  }


 /* SCROLLSPY PLUGIN DEFINITION
  * =========================== */

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('scrollspy')
        , options = typeof option == 'object' && option
      if (!data) $this.data('scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy

  $.fn.scrollspy.defaults = {
    offset: 10
  }


 /* SCROLLSPY NO CONFLICT
  * ===================== */

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


 /* SCROLLSPY DATA-API
  * ================== */

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(window.jQuery);/* ========================================================
 * bootstrap-tab.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#tabs
 * ========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TAB CLASS DEFINITION
  * ==================== */

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype = {

    constructor: Tab

  , show: function () {
      var $this = this.element
        , $ul = $this.closest('ul:not(.dropdown-menu)')
        , selector = $this.attr('data-target')
        , previous
        , $target
        , e

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      if ( $this.parent('li').hasClass('active') ) return

      previous = $ul.find('.active:last a')[0]

      e = $.Event('show', {
        relatedTarget: previous
      })

      $this.trigger(e)

      if (e.isDefaultPrevented()) return

      $target = $(selector)

      this.activate($this.parent('li'), $ul)
      this.activate($target, $target.parent(), function () {
        $this.trigger({
          type: 'shown'
        , relatedTarget: previous
        })
      })
    }

  , activate: function ( element, container, callback) {
      var $active = container.find('> .active')
        , transition = callback
            && $.support.transition
            && $active.hasClass('fade')

      function next() {
        $active
          .removeClass('active')
          .find('> .dropdown-menu > .active')
          .removeClass('active')

        element.addClass('active')

        if (transition) {
          element[0].offsetWidth // reflow for transition
          element.addClass('in')
        } else {
          element.removeClass('fade')
        }

        if ( element.parent('.dropdown-menu') ) {
          element.closest('li.dropdown').addClass('active')
        }

        callback && callback()
      }

      transition ?
        $active.one($.support.transition.end, next) :
        next()

      $active.removeClass('in')
    }
  }


 /* TAB PLUGIN DEFINITION
  * ===================== */

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tab')
      if (!data) $this.data('tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


 /* TAB NO CONFLICT
  * =============== */

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


 /* TAB DATA-API
  * ============ */

  $(document).on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(window.jQuery);/* =============================================================
 * bootstrap-typeahead.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#typeahead
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function($){

  "use strict"; // jshint ;_;


 /* TYPEAHEAD PUBLIC CLASS DEFINITION
  * ================================= */

  var Typeahead = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.typeahead.defaults, options)
    this.matcher = this.options.matcher || this.matcher
    this.sorter = this.options.sorter || this.sorter
    this.highlighter = this.options.highlighter || this.highlighter
    this.updater = this.options.updater || this.updater
    this.source = this.options.source
    this.$menu = $(this.options.menu)
    this.shown = false
    this.listen()
  }

  Typeahead.prototype = {

    constructor: Typeahead

  , select: function () {
      var val = this.$menu.find('.active').attr('data-value')
      this.$element
        .val(this.updater(val))
        .change()
      return this.hide()
    }

  , updater: function (item) {
      return item
    }

  , show: function () {
      var pos = $.extend({}, this.$element.position(), {
        height: this.$element[0].offsetHeight
      })

      this.$menu
        .insertAfter(this.$element)
        .css({
          top: pos.top + pos.height
        , left: pos.left
        })
        .show()

      this.shown = true
      return this
    }

  , hide: function () {
      this.$menu.hide()
      this.shown = false
      return this
    }

  , lookup: function (event) {
      var items

      this.query = this.$element.val()

      if (!this.query || this.query.length < this.options.minLength) {
        return this.shown ? this.hide() : this
      }

      items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.process, this)) : this.source

      return items ? this.process(items) : this
    }

  , process: function (items) {
      var that = this

      items = $.grep(items, function (item) {
        return that.matcher(item)
      })

      items = this.sorter(items)

      if (!items.length) {
        return this.shown ? this.hide() : this
      }

      return this.render(items.slice(0, this.options.items)).show()
    }

  , matcher: function (item) {
      return ~item.toLowerCase().indexOf(this.query.toLowerCase())
    }

  , sorter: function (items) {
      var beginswith = []
        , caseSensitive = []
        , caseInsensitive = []
        , item

      while (item = items.shift()) {
        if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
        else if (~item.indexOf(this.query)) caseSensitive.push(item)
        else caseInsensitive.push(item)
      }

      return beginswith.concat(caseSensitive, caseInsensitive)
    }

  , highlighter: function (item) {
      var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
      return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
        return '<strong>' + match + '</strong>'
      })
    }

  , render: function (items) {
      var that = this

      items = $(items).map(function (i, item) {
        i = $(that.options.item).attr('data-value', item)
        i.find('a').html(that.highlighter(item))
        return i[0]
      })

      items.first().addClass('active')
      this.$menu.html(items)
      return this
    }

  , next: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , next = active.next()

      if (!next.length) {
        next = $(this.$menu.find('li')[0])
      }

      next.addClass('active')
    }

  , prev: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , prev = active.prev()

      if (!prev.length) {
        prev = this.$menu.find('li').last()
      }

      prev.addClass('active')
    }

  , listen: function () {
      this.$element
        .on('focus',    $.proxy(this.focus, this))
        .on('blur',     $.proxy(this.blur, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this))

      if (this.eventSupported('keydown')) {
        this.$element.on('keydown', $.proxy(this.keydown, this))
      }

      this.$menu
        .on('click', $.proxy(this.click, this))
        .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
        .on('mouseleave', 'li', $.proxy(this.mouseleave, this))
    }

  , eventSupported: function(eventName) {
      var isSupported = eventName in this.$element
      if (!isSupported) {
        this.$element.setAttribute(eventName, 'return;')
        isSupported = typeof this.$element[eventName] === 'function'
      }
      return isSupported
    }

  , move: function (e) {
      if (!this.shown) return

      switch(e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
          e.preventDefault()
          break

        case 38: // up arrow
          e.preventDefault()
          this.prev()
          break

        case 40: // down arrow
          e.preventDefault()
          this.next()
          break
      }

      e.stopPropagation()
    }

  , keydown: function (e) {
      this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40,38,9,13,27])
      this.move(e)
    }

  , keypress: function (e) {
      if (this.suppressKeyPressRepeat) return
      this.move(e)
    }

  , keyup: function (e) {
      switch(e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
        case 16: // shift
        case 17: // ctrl
        case 18: // alt
          break

        case 9: // tab
        case 13: // enter
          if (!this.shown) return
          this.select()
          break

        case 27: // escape
          if (!this.shown) return
          this.hide()
          break

        default:
          this.lookup()
      }

      e.stopPropagation()
      e.preventDefault()
  }

  , focus: function (e) {
      this.focused = true
    }

  , blur: function (e) {
      this.focused = false
      if (!this.mousedover && this.shown) this.hide()
    }

  , click: function (e) {
      e.stopPropagation()
      e.preventDefault()
      this.select()
      this.$element.focus()
    }

  , mouseenter: function (e) {
      this.mousedover = true
      this.$menu.find('.active').removeClass('active')
      $(e.currentTarget).addClass('active')
    }

  , mouseleave: function (e) {
      this.mousedover = false
      if (!this.focused && this.shown) this.hide()
    }

  }


  /* TYPEAHEAD PLUGIN DEFINITION
   * =========================== */

  var old = $.fn.typeahead

  $.fn.typeahead = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('typeahead')
        , options = typeof option == 'object' && option
      if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.typeahead.defaults = {
    source: []
  , items: 8
  , menu: '<ul class="typeahead dropdown-menu"></ul>'
  , item: '<li><a href="#"></a></li>'
  , minLength: 1
  }

  $.fn.typeahead.Constructor = Typeahead


 /* TYPEAHEAD NO CONFLICT
  * =================== */

  $.fn.typeahead.noConflict = function () {
    $.fn.typeahead = old
    return this
  }


 /* TYPEAHEAD DATA-API
  * ================== */

  $(document).on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
    var $this = $(this)
    if ($this.data('typeahead')) return
    $this.typeahead($this.data())
  })

}(window.jQuery);
/* ==========================================================
 * bootstrap-affix.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#affix
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* AFFIX CLASS DEFINITION
  * ====================== */

  var Affix = function (element, options) {
    this.options = $.extend({}, $.fn.affix.defaults, options)
    this.$window = $(window)
      .on('scroll.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.affix.data-api',  $.proxy(function () { setTimeout($.proxy(this.checkPosition, this), 1) }, this))
    this.$element = $(element)
    this.checkPosition()
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
      , scrollTop = this.$window.scrollTop()
      , position = this.$element.offset()
      , offset = this.options.offset
      , offsetBottom = offset.bottom
      , offsetTop = offset.top
      , reset = 'affix affix-top affix-bottom'
      , affix

    if (typeof offset != 'object') offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function') offsetTop = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    affix = this.unpin != null && (scrollTop + this.unpin <= position.top) ?
      false    : offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ?
      'bottom' : offsetTop != null && scrollTop <= offsetTop ?
      'top'    : false

    if (this.affixed === affix) return

    this.affixed = affix
    this.unpin = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(reset).addClass('affix' + (affix ? '-' + affix : ''))
  }


 /* AFFIX PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('affix')
        , options = typeof option == 'object' && option
      if (!data) $this.data('affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix

  $.fn.affix.defaults = {
    offset: 0
  }


 /* AFFIX NO CONFLICT
  * ================= */

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


 /* AFFIX DATA-API
  * ============== */

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
        , data = $spy.data()

      data.offset = data.offset || {}

      data.offsetBottom && (data.offset.bottom = data.offsetBottom)
      data.offsetTop && (data.offset.top = data.offsetTop)

      $spy.affix(data)
    })
  })


}(window.jQuery);;
/* =========================================================
 * bootstrap-slider.js v2.0.0
 * http://www.eyecon.ro/bootstrap-slider
 * =========================================================
 * Copyright 2012 Stefan Petre
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */
 
!function( $ ) {

	var Slider = function(element, options) {
		this.element = $(element);
		this.picker = $('<div class="slider">'+
							'<div class="slider-track">'+
								'<div class="slider-selection"></div>'+
								'<div class="slider-handle"></div>'+
								'<div class="slider-handle"></div>'+
							'</div>'+
							'<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'+
						'</div>')
							.insertBefore(this.element)
							.append(this.element);
		this.id = this.element.data('slider-id')||options.id;
		if (this.id) {
			this.picker[0].id = this.id;
		}

		if (typeof Modernizr !== 'undefined' && Modernizr.touch) {
			this.touchCapable = true;
		}

		var tooltip = this.element.data('slider-tooltip')||options.tooltip;

		this.tooltip = this.picker.find('.tooltip');
		this.tooltipInner = this.tooltip.find('div.tooltip-inner');

		this.orientation = this.element.data('slider-orientation')||options.orientation;
		switch(this.orientation) {
			case 'vertical':
				this.picker.addClass('slider-vertical');
				this.stylePos = 'top';
				this.mousePos = 'pageY';
				this.sizePos = 'offsetHeight';
				this.tooltip.addClass('right')[0].style.left = '100%';
				break;
			default:
				this.picker
					.addClass('slider-horizontal')
					.css('width', this.element.outerWidth());
				this.orientation = 'horizontal';
				this.stylePos = 'left';
				this.mousePos = 'pageX';
				this.sizePos = 'offsetWidth';
				this.tooltip.addClass('top')[0].style.top = -this.tooltip.outerHeight() - 14 + 'px';
				break;
		}

		this.min = this.element.data('slider-min')||options.min;
		this.max = this.element.data('slider-max')||options.max;
		this.step = this.element.data('slider-step')||options.step;
		this.value = this.element.data('slider-value')||options.value;
		if (this.value[1]) {
			this.range = true;
		}

		this.selection = this.element.data('slider-selection')||options.selection;
		this.selectionEl = this.picker.find('.slider-selection');
		if (this.selection === 'none') {
			this.selectionEl.addClass('hide');
		}
		this.selectionElStyle = this.selectionEl[0].style;


		this.handle1 = this.picker.find('.slider-handle:first');
		this.handle1Stype = this.handle1[0].style;
		this.handle2 = this.picker.find('.slider-handle:last');
		this.handle2Stype = this.handle2[0].style;

		var handle = this.element.data('slider-handle')||options.handle;
		switch(handle) {
			case 'round':
				this.handle1.addClass('round');
				this.handle2.addClass('round');
				break
			case 'triangle':
				this.handle1.addClass('triangle');
				this.handle2.addClass('triangle');
				break
		}

		if (this.range) {
			this.value[0] = Math.max(this.min, Math.min(this.max, this.value[0]));
			this.value[1] = Math.max(this.min, Math.min(this.max, this.value[1]));
		} else {
			this.value = [ Math.max(this.min, Math.min(this.max, this.value))];
			this.handle2.addClass('hide');
			if (this.selection == 'after') {
				this.value[1] = this.max;
			} else {
				this.value[1] = this.min;
			}
		}
		this.diff = this.max - this.min;
		this.percentage = [
			(this.value[0]-this.min)*100/this.diff,
			(this.value[1]-this.min)*100/this.diff,
			this.step*100/this.diff
		];

		this.offset = this.picker.offset();
		this.size = this.picker[0][this.sizePos];

		this.formater = options.formater;

		this.layout();

		if (this.touchCapable) {
			// Touch: Bind touch events:
			this.picker.on({
				touchstart: $.proxy(this.mousedown, this)
			});
		} else {
			this.picker.on({
				mousedown: $.proxy(this.mousedown, this)
			});
		}

		if (tooltip === 'show') {
			this.picker.on({
				mouseenter: $.proxy(this.showTooltip, this),
				mouseleave: $.proxy(this.hideTooltip, this)
			});
		} else {
			this.tooltip.addClass('hide');
		}
	};

	Slider.prototype = {
		constructor: Slider,

		over: false,
		inDrag: false,
		
		showTooltip: function(){
			this.tooltip.addClass('in');
			//var left = Math.round(this.percent*this.width);
			//this.tooltip.css('left', left - this.tooltip.outerWidth()/2);
			this.over = true;
		},
		
		hideTooltip: function(){
			if (this.inDrag === false) {
				this.tooltip.removeClass('in');
			}
			this.over = false;
		},

		layout: function(){
			this.handle1Stype[this.stylePos] = this.percentage[0]+'%';
			this.handle2Stype[this.stylePos] = this.percentage[1]+'%';
			if (this.orientation == 'vertical') {
				this.selectionElStyle.top = Math.min(this.percentage[0], this.percentage[1]) +'%';
				this.selectionElStyle.height = Math.abs(this.percentage[0] - this.percentage[1]) +'%';
			} else {
				this.selectionElStyle.left = Math.min(this.percentage[0], this.percentage[1]) +'%';
				this.selectionElStyle.width = Math.abs(this.percentage[0] - this.percentage[1]) +'%';
			}
			if (this.range) {
				this.tooltipInner.text(
					this.formater(this.value[0]) + 
					' : ' + 
					this.formater(this.value[1])
				);
				this.tooltip[0].style[this.stylePos] = this.size * (this.percentage[0] + (this.percentage[1] - this.percentage[0])/2)/100 - (this.orientation === 'vertical' ? this.tooltip.outerHeight()/2 : this.tooltip.outerWidth()/2) +'px';
			} else {
				this.tooltipInner.text(
					this.formater(this.value[0])
				);
				this.tooltip[0].style[this.stylePos] = this.size * this.percentage[0]/100 - (this.orientation === 'vertical' ? this.tooltip.outerHeight()/2 : this.tooltip.outerWidth()/2) +'px';
			}
		},

		mousedown: function(ev) {

			// Touch: Get the original event:
			if (this.touchCapable && ev.type === 'touchstart') {
				ev = ev.originalEvent;
			}

			this.offset = this.picker.offset();
			this.size = this.picker[0][this.sizePos];

			var percentage = this.getPercentage(ev);

			if (this.range) {
				var diff1 = Math.abs(this.percentage[0] - percentage);
				var diff2 = Math.abs(this.percentage[1] - percentage);
				this.dragged = (diff1 < diff2) ? 0 : 1;
			} else {
				this.dragged = 0;
			}

			this.percentage[this.dragged] = percentage;
			this.layout();

			if (this.touchCapable) {
				// Touch: Bind touch events:
				$(document).on({
					touchmove: $.proxy(this.mousemove, this),
					touchend: $.proxy(this.mouseup, this)
				});
			} else {
				$(document).on({
					mousemove: $.proxy(this.mousemove, this),
					mouseup: $.proxy(this.mouseup, this)
				});
			}

			this.inDrag = true;
			var val = this.calculateValue();
			this.element.trigger({
					type: 'slideStart',
					value: val
				}).trigger({
					type: 'slide',
					value: val
				});
			return false;
		},

		mousemove: function(ev) {
			
			// Touch: Get the original event:
			if (this.touchCapable && ev.type === 'touchmove') {
				ev = ev.originalEvent;
			}

			var percentage = this.getPercentage(ev);
			if (this.range) {
				if (this.dragged === 0 && this.percentage[1] < percentage) {
					this.percentage[0] = this.percentage[1];
					this.dragged = 1;
				} else if (this.dragged === 1 && this.percentage[0] > percentage) {
					this.percentage[1] = this.percentage[0];
					this.dragged = 0;
				}
			}
			this.percentage[this.dragged] = percentage;
			this.layout();
			var val = this.calculateValue();
			this.element
				.trigger({
					type: 'slide',
					value: val
				})
				.data('value', val)
				.prop('value', val);
			return false;
		},

		mouseup: function(ev) {
			if (this.touchCapable) {
				// Touch: Bind touch events:
				$(document).off({
					touchmove: this.mousemove,
					touchend: this.mouseup
				});
			} else {
				$(document).off({
					mousemove: this.mousemove,
					mouseup: this.mouseup
				});
			}

			this.inDrag = false;
			if (this.over == false) {
				this.hideTooltip();
			}
			this.element;
			var val = this.calculateValue();
			this.element
				.trigger({
					type: 'slideStop',
					value: val
				})
				.data('value', val)
				.prop('value', val);
			return false;
		},

		calculateValue: function() {
			var val;
			if (this.range) {
				val = [
					(this.min + Math.round((this.diff * this.percentage[0]/100)/this.step)*this.step),
					(this.min + Math.round((this.diff * this.percentage[1]/100)/this.step)*this.step)
				];
				this.value = val;
			} else {
				val = (this.min + Math.round((this.diff * this.percentage[0]/100)/this.step)*this.step);
				this.value = [val, this.value[1]];
			}
			return val;
		},

		getPercentage: function(ev) {
			if (this.touchCapable) {
				ev = ev.touches[0];
			}
			var percentage = (ev[this.mousePos] - this.offset[this.stylePos])*100/this.size;
			percentage = Math.round(percentage/this.percentage[2])*this.percentage[2];
			return Math.max(0, Math.min(100, percentage));
		},

		getValue: function() {
			if (this.range) {
				return this.value;
			}
			return this.value[0];
		},

		setValue: function(val) {
			this.value = val;

			if (this.range) {
				this.value[0] = Math.max(this.min, Math.min(this.max, this.value[0]));
				this.value[1] = Math.max(this.min, Math.min(this.max, this.value[1]));
			} else {
				this.value = [ Math.max(this.min, Math.min(this.max, this.value))];
				this.handle2.addClass('hide');
				if (this.selection == 'after') {
					this.value[1] = this.max;
				} else {
					this.value[1] = this.min;
				}
			}
			this.diff = this.max - this.min;
			this.percentage = [
				(this.value[0]-this.min)*100/this.diff,
				(this.value[1]-this.min)*100/this.diff,
				this.step*100/this.diff
			];
			this.layout();
		}
	};

	$.fn.slider = function ( option, val ) {
		return this.each(function () {
			var $this = $(this),
				data = $this.data('slider'),
				options = typeof option === 'object' && option;
			if (!data)  {
				$this.data('slider', (data = new Slider(this, $.extend({}, $.fn.slider.defaults,options))));
			}
			if (typeof option == 'string') {
				data[option](val);
			}
		})
	};

	$.fn.slider.defaults = {
		min: 0,
		max: 10,
		step: 1,
		orientation: 'horizontal',
		value: 5,
		selection: 'before',
		tooltip: 'show',
		handle: 'round',
		formater: function(value) {
			return value;
		}
	};

	$.fn.slider.Constructor = Slider;

}( window.jQuery );;
// lib/handlebars/base.js

/*jshint eqnull:true*/
this.Handlebars = {};

(function(Handlebars) {

Handlebars.VERSION = "1.0.0-rc.3";
Handlebars.COMPILER_REVISION = 2;

Handlebars.REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '>= 1.0.0-rc.3'
};

Handlebars.helpers  = {};
Handlebars.partials = {};

Handlebars.registerHelper = function(name, fn, inverse) {
  if(inverse) { fn.not = inverse; }
  this.helpers[name] = fn;
};

Handlebars.registerPartial = function(name, str) {
  this.partials[name] = str;
};

Handlebars.registerHelper('helperMissing', function(arg) {
  if(arguments.length === 2) {
    return undefined;
  } else {
    throw new Error("Could not find property '" + arg + "'");
  }
});

var toString = Object.prototype.toString, functionType = "[object Function]";

Handlebars.registerHelper('blockHelperMissing', function(context, options) {
  var inverse = options.inverse || function() {}, fn = options.fn;


  var ret = "";
  var type = toString.call(context);

  if(type === functionType) { context = context.call(this); }

  if(context === true) {
    return fn(this);
  } else if(context === false || context == null) {
    return inverse(this);
  } else if(type === "[object Array]") {
    if(context.length > 0) {
      return Handlebars.helpers.each(context, options);
    } else {
      return inverse(this);
    }
  } else {
    return fn(context);
  }
});

Handlebars.K = function() {};

Handlebars.createFrame = Object.create || function(object) {
  Handlebars.K.prototype = object;
  var obj = new Handlebars.K();
  Handlebars.K.prototype = null;
  return obj;
};

Handlebars.logger = {
  DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, level: 3,

  methodMap: {0: 'debug', 1: 'info', 2: 'warn', 3: 'error'},

  // can be overridden in the host environment
  log: function(level, obj) {
    if (Handlebars.logger.level <= level) {
      var method = Handlebars.logger.methodMap[level];
      if (typeof console !== 'undefined' && console[method]) {
        console[method].call(console, obj);
      }
    }
  }
};

Handlebars.log = function(level, obj) { Handlebars.logger.log(level, obj); };

Handlebars.registerHelper('each', function(context, options) {
  var fn = options.fn, inverse = options.inverse;
  var i = 0, ret = "", data;

  if (options.data) {
    data = Handlebars.createFrame(options.data);
  }

  if(context && typeof context === 'object') {
    if(context instanceof Array){
      for(var j = context.length; i<j; i++) {
        if (data) { data.index = i; }
        ret = ret + fn(context[i], { data: data });
      }
    } else {
      for(var key in context) {
        if(context.hasOwnProperty(key)) {
          if(data) { data.key = key; }
          ret = ret + fn(context[key], {data: data});
          i++;
        }
      }
    }
  }

  if(i === 0){
    ret = inverse(this);
  }

  return ret;
});

Handlebars.registerHelper('if', function(context, options) {
  var type = toString.call(context);
  if(type === functionType) { context = context.call(this); }

  if(!context || Handlebars.Utils.isEmpty(context)) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});

Handlebars.registerHelper('unless', function(context, options) {
  var fn = options.fn, inverse = options.inverse;
  options.fn = inverse;
  options.inverse = fn;

  return Handlebars.helpers['if'].call(this, context, options);
});

Handlebars.registerHelper('with', function(context, options) {
  return options.fn(context);
});

Handlebars.registerHelper('log', function(context, options) {
  var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
  Handlebars.log(level, context);
});

}(this.Handlebars));
;
// lib/handlebars/utils.js

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

Handlebars.Exception = function(message) {
  var tmp = Error.prototype.constructor.apply(this, arguments);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }
};
Handlebars.Exception.prototype = new Error();

// Build out our basic SafeString type
Handlebars.SafeString = function(string) {
  this.string = string;
};
Handlebars.SafeString.prototype.toString = function() {
  return this.string.toString();
};

(function() {
  var escape = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;"
  };

  var badChars = /[&<>"'`]/g;
  var possible = /[&<>"'`]/;

  var escapeChar = function(chr) {
    return escape[chr] || "&amp;";
  };

  Handlebars.Utils = {
    escapeExpression: function(string) {
      // don't escape SafeStrings, since they're already safe
      if (string instanceof Handlebars.SafeString) {
        return string.toString();
      } else if (string == null || string === false) {
        return "";
      }

      if(!possible.test(string)) { return string; }
      return string.replace(badChars, escapeChar);
    },

    isEmpty: function(value) {
      if (!value && value !== 0) {
        return true;
      } else if(Object.prototype.toString.call(value) === "[object Array]" && value.length === 0) {
        return true;
      } else {
        return false;
      }
    }
  };
})();;
// lib/handlebars/runtime.js
Handlebars.VM = {
  template: function(templateSpec) {
    // Just add water
    var container = {
      escapeExpression: Handlebars.Utils.escapeExpression,
      invokePartial: Handlebars.VM.invokePartial,
      programs: [],
      program: function(i, fn, data) {
        var programWrapper = this.programs[i];
        if(data) {
          return Handlebars.VM.program(fn, data);
        } else if(programWrapper) {
          return programWrapper;
        } else {
          programWrapper = this.programs[i] = Handlebars.VM.program(fn);
          return programWrapper;
        }
      },
      programWithDepth: Handlebars.VM.programWithDepth,
      noop: Handlebars.VM.noop,
      compilerInfo: null
    };

    return function(context, options) {
      options = options || {};
      var result = templateSpec.call(container, Handlebars, context, options.helpers, options.partials, options.data);

      var compilerInfo = container.compilerInfo || [],
          compilerRevision = compilerInfo[0] || 1,
          currentRevision = Handlebars.COMPILER_REVISION;

      if (compilerRevision !== currentRevision) {
        if (compilerRevision < currentRevision) {
          var runtimeVersions = Handlebars.REVISION_CHANGES[currentRevision],
              compilerVersions = Handlebars.REVISION_CHANGES[compilerRevision];
          throw "Template was precompiled with an older version of Handlebars than the current runtime. "+
                "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").";
        } else {
          // Use the embedded version info since the runtime doesn't know about this revision yet
          throw "Template was precompiled with a newer version of Handlebars than the current runtime. "+
                "Please update your runtime to a newer version ("+compilerInfo[1]+").";
        }
      }

      return result;
    };
  },

  programWithDepth: function(fn, data, $depth) {
    var args = Array.prototype.slice.call(arguments, 2);

    return function(context, options) {
      options = options || {};

      return fn.apply(this, [context, options.data || data].concat(args));
    };
  },
  program: function(fn, data) {
    return function(context, options) {
      options = options || {};

      return fn(context, options.data || data);
    };
  },
  noop: function() { return ""; },
  invokePartial: function(partial, name, context, helpers, partials, data) {
    var options = { helpers: helpers, partials: partials, data: data };

    if(partial === undefined) {
      throw new Handlebars.Exception("The partial " + name + " could not be found");
    } else if(partial instanceof Function) {
      return partial(context, options);
    } else if (!Handlebars.compile) {
      throw new Handlebars.Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    } else {
      partials[name] = Handlebars.compile(partial, {data: data !== undefined});
      return partials[name](context, options);
    }
  }
};

Handlebars.template = Handlebars.VM.template;
;;
/*!
 * Chaplin 0.8.1
 *
 * Chaplin may be freely distributed under the MIT license.
 * For all details and documentation:
 * http://chaplinjs.org
 */

// Dirty hack for require-ing backbone and underscore.
(function() {
  var deps = {
    backbone: window.Backbone, underscore: window._
  };

  for (var name in deps) {
    (function(name) {
      var definition = {};
      definition[name] = function(exports, require, module) {
        module.exports = deps[name];
      };

      try {
        require(item);
      } catch(e) {
        require.define(definition);
      }
    })(name);
  }
})();

require.define({'chaplin/application': function(exports, require, module) {
'use strict';

var Application, Backbone, Composer, Dispatcher, EventBroker, Layout, Router, mediator, _;

_ = require('underscore');

Backbone = require('backbone');

mediator = require('chaplin/mediator');

Dispatcher = require('chaplin/dispatcher');

Layout = require('chaplin/views/layout');

Composer = require('chaplin/composer');

Router = require('chaplin/lib/router');

EventBroker = require('chaplin/lib/event_broker');

module.exports = Application = (function() {

  function Application() {}

  Application.extend = Backbone.Model.extend;

  _(Application.prototype).extend(EventBroker);

  Application.prototype.title = '';

  Application.prototype.dispatcher = null;

  Application.prototype.layout = null;

  Application.prototype.router = null;

  Application.prototype.composer = null;

  Application.prototype.initialize = function() {};

  Application.prototype.initDispatcher = function(options) {
    return this.dispatcher = new Dispatcher(options);
  };

  Application.prototype.initLayout = function(options) {
    var _ref;
    if (options == null) {
      options = {};
    }
    if ((_ref = options.title) == null) {
      options.title = this.title;
    }
    return this.layout = new Layout(options);
  };

  Application.prototype.initComposer = function(options) {
    if (options == null) {
      options = {};
    }
    return this.composer = new Composer(options);
  };

  Application.prototype.initRouter = function(routes, options) {
    this.router = new Router(options);
    return typeof routes === "function" ? routes(this.router.match) : void 0;
  };

  Application.prototype.startRouting = function() {
    return this.router.startHistory();
  };

  Application.prototype.disposed = false;

  Application.prototype.dispose = function() {
    var prop, properties, _i, _len;
    if (this.disposed) {
      return;
    }
    properties = ['dispatcher', 'layout', 'router', 'composer'];
    for (_i = 0, _len = properties.length; _i < _len; _i++) {
      prop = properties[_i];
      if (!(this[prop] != null)) {
        continue;
      }
      this[prop].dispose();
      delete this[prop];
    }
    this.disposed = true;
    return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
  };

  return Application;

})();

}});;require.define({'chaplin/mediator': function(exports, require, module) {
'use strict';

var Backbone, mediator, support, utils;

Backbone = require('backbone');

support = require('chaplin/lib/support');

utils = require('chaplin/lib/utils');

mediator = {};

mediator.subscribe = Backbone.Events.on;

mediator.unsubscribe = Backbone.Events.off;

mediator.publish = Backbone.Events.trigger;

mediator._callbacks = null;

utils.readonly(mediator, 'subscribe', 'unsubscribe', 'publish');

mediator.seal = function() {
  if (support.propertyDescriptors && Object.seal) {
    return Object.seal(mediator);
  }
};

utils.readonly(mediator, 'seal');

module.exports = mediator;

}});;require.define({'chaplin/dispatcher': function(exports, require, module) {
'use strict';

var Backbone, Dispatcher, EventBroker, utils, _;

_ = require('underscore');

Backbone = require('backbone');

utils = require('chaplin/lib/utils');

EventBroker = require('chaplin/lib/event_broker');

module.exports = Dispatcher = (function() {

  Dispatcher.extend = Backbone.Model.extend;

  _(Dispatcher.prototype).extend(EventBroker);

  Dispatcher.prototype.previousRoute = null;

  Dispatcher.prototype.currentController = null;

  Dispatcher.prototype.currentRoute = null;

  Dispatcher.prototype.currentParams = null;

  function Dispatcher() {
    this.initialize.apply(this, arguments);
  }

  Dispatcher.prototype.initialize = function(options) {
    if (options == null) {
      options = {};
    }
    this.settings = _(options).defaults({
      controllerPath: 'controllers/',
      controllerSuffix: '_controller'
    });
    return this.subscribeEvent('router:match', this.dispatch);
  };

  Dispatcher.prototype.dispatch = function(route, params, options) {
    var _ref, _ref1,
      _this = this;
    params = params ? _.clone(params) : {};
    options = options ? _.clone(options) : {};
    if (options.changeURL !== false) {
      options.changeURL = true;
    }
    if (options.forceStartup !== true) {
      options.forceStartup = false;
    }
    if (!options.forceStartup && ((_ref = this.currentRoute) != null ? _ref.controller : void 0) === route.controller && ((_ref1 = this.currentRoute) != null ? _ref1.action : void 0) === route.action && _.isEqual(this.currentParams, params)) {
      return;
    }
    return this.loadController(route.controller, function(Controller) {
      return _this.controllerLoaded(route, params, options, Controller);
    });
  };

  Dispatcher.prototype.loadController = function(name, handler) {
    var fileName, moduleName;
    fileName = utils.underscorize(name) + this.settings.controllerSuffix;
    moduleName = this.settings.controllerPath + fileName;
    if (typeof define !== "undefined" && define !== null ? define.amd : void 0) {
      return require([moduleName], handler);
    } else {
      return handler(require(moduleName));
    }
  };

  Dispatcher.prototype.controllerLoaded = function(route, params, options, Controller) {
    var controller, methodName;
    this.previousRoute = this.currentRoute;
    this.currentRoute = _.extend({}, route, {
      previous: utils.beget(this.previousRoute)
    });
    controller = new Controller(params, this.currentRoute, options);
    methodName = controller.beforeAction ? 'executeBeforeActions' : 'executeAction';
    return this[methodName](controller, this.currentRoute, params, options);
  };

  Dispatcher.prototype.executeAction = function(controller, route, params, options) {
    if (this.currentController) {
      this.publishEvent('beforeControllerDispose', this.currentController);
      this.currentController.dispose(params, route, options);
    }
    controller[route.action](params, route, options);
    this.currentController = controller;
    this.currentParams = params;
    if (controller.redirected) {
      return;
    }
    this.adjustURL(route, params, options);
    return this.publishEvent('dispatcher:dispatch', this.currentController, params, route, options);
  };

  Dispatcher.prototype.executeBeforeActions = function(controller, route, params, options) {
    var action, actions, beforeActions, name, next, _i, _len, _ref,
      _this = this;
    beforeActions = [];
    _ref = utils.getAllPropertyVersions(controller, 'beforeAction');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      actions = _ref[_i];
      for (name in actions) {
        action = actions[name];
        if (name === route.action || RegExp("^" + name + "$").test(route.action)) {
          if (typeof action === 'string') {
            action = controller[action];
          }
          if (typeof action !== 'function') {
            throw new Error('Controller#executeBeforeActions: ' + ("" + action + " is not a valid action method for " + name + "."));
          }
          beforeActions.push(action);
        }
      }
    }
    next = function(method, previous) {
      if (previous == null) {
        previous = null;
      }
      if (controller.redirected) {
        return;
      }
      if (!method) {
        _this.executeAction(controller, route, params, options);
        return;
      }
      previous = method.call(controller, params, route, options, previous);
      if (previous && typeof previous.then === 'function') {
        return previous.then(function(data) {
          if (!_this.currentController || controller === _this.currentController) {
            return next(beforeActions.shift(), data);
          }
        });
      } else {
        return next(beforeActions.shift(), previous);
      }
    };
    return next(beforeActions.shift());
  };

  Dispatcher.prototype.adjustURL = function(route, params, options) {
    var url;
    if (route.path == null) {
      return;
    }
    url = route.path + (route.query ? "?" + route.query : "");
    if (options.changeURL) {
      return this.publishEvent('!router:changeURL', url, options);
    }
  };

  Dispatcher.prototype.disposed = false;

  Dispatcher.prototype.dispose = function() {
    if (this.disposed) {
      return;
    }
    this.unsubscribeAllEvents();
    this.disposed = true;
    return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
  };

  return Dispatcher;

})();

}});;require.define({'chaplin/composer': function(exports, require, module) {
'use strict';

var Backbone, Composer, Composition, EventBroker, utils, _;

_ = require('underscore');

Backbone = require('backbone');

utils = require('chaplin/lib/utils');

Composition = require('chaplin/lib/composition');

EventBroker = require('chaplin/lib/event_broker');

module.exports = Composer = (function() {

  Composer.extend = Backbone.Model.extend;

  _(Composer.prototype).extend(EventBroker);

  Composer.prototype.compositions = null;

  function Composer() {
    this.initialize.apply(this, arguments);
  }

  Composer.prototype.initialize = function(options) {
    if (options == null) {
      options = {};
    }
    this.compositions = {};
    this.subscribeEvent('!composer:compose', this.compose);
    this.subscribeEvent('!composer:retrieve', this.retrieve);
    return this.subscribeEvent('dispatcher:dispatch', this.cleanup);
  };

  Composer.prototype.compose = function(name, second, third) {
    if (typeof second === 'function') {
      if (third || second.prototype.dispose) {
        if (second.prototype instanceof Composition) {
          return this._compose(name, {
            composition: second,
            options: third
          });
        } else {
          return this._compose(name, {
            options: third,
            compose: function() {
              var autoRender, disabledAutoRender;
              this.item = new second(this.options);
              autoRender = this.item.autoRender;
              disabledAutoRender = autoRender === void 0 || !autoRender;
              if (disabledAutoRender && typeof this.item.render === 'function') {
                return this.item.render();
              }
            }
          });
        }
      }
      return this._compose(name, {
        compose: second
      });
    }
    if (typeof third === 'function') {
      return this._compose(name, {
        compose: third,
        options: second
      });
    }
    return this._compose(name, second);
  };

  Composer.prototype._compose = function(name, options) {
    var composition, current;
    if (typeof options.compose !== 'function' && !(options.composition != null)) {
      throw new Error('Composer#compose was used incorrectly');
    }
    if (options.composition != null) {
      composition = new options.composition(options.options);
    } else {
      composition = new Composition(options.options);
      composition.compose = options.compose;
      if (options.check) {
        composition.check = options.check;
      }
    }
    current = this.compositions[name];
    if (current && current.check(composition.options)) {
      current.stale(false);
    } else {
      if (current) {
        current.dispose();
      }
      composition.compose(composition.options);
      composition.stale(false);
      this.compositions[name] = composition;
    }
    return this.compositions[name];
  };

  Composer.prototype.retrieve = function(name, callback) {
    var active, item;
    active = this.compositions[name];
    item = (active && !active.stale() ? active.item : void 0);
    return callback(item);
  };

  Composer.prototype.cleanup = function() {
    var composition, name, _ref;
    _ref = this.compositions;
    for (name in _ref) {
      composition = _ref[name];
      if (composition.stale()) {
        composition.dispose();
        delete this.compositions[name];
      } else {
        composition.stale(true);
      }
    }
  };

  Composer.prototype.dispose = function() {
    var composition, name, _ref;
    if (this.disposed) {
      return;
    }
    this.unsubscribeAllEvents();
    _ref = this.compositions;
    for (name in _ref) {
      composition = _ref[name];
      composition.dispose();
    }
    delete this.compositions;
    this.disposed = true;
    return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
  };

  return Composer;

})();

}});;require.define({'chaplin/controllers/controller': function(exports, require, module) {
'use strict';

var Backbone, Controller, EventBroker, _,
  __hasProp = {}.hasOwnProperty;

_ = require('underscore');

Backbone = require('backbone');

EventBroker = require('chaplin/lib/event_broker');

module.exports = Controller = (function() {

  Controller.extend = Backbone.Model.extend;

  _(Controller.prototype).extend(Backbone.Events);

  _(Controller.prototype).extend(EventBroker);

  Controller.prototype.view = null;

  Controller.prototype.redirected = false;

  function Controller() {
    this.initialize.apply(this, arguments);
  }

  Controller.prototype.initialize = function() {};

  Controller.prototype.adjustTitle = function(subtitle) {
    return this.publishEvent('!adjustTitle', subtitle);
  };

  Controller.prototype.compose = function(name, second, third) {
    var item;
    if (arguments.length === 1) {
      item = null;
      this.publishEvent('!composer:retrieve', name, function(composition) {
        return item = composition;
      });
      return item;
    } else {
      return this.publishEvent('!composer:compose', name, second, third);
    }
  };

  Controller.prototype.redirectTo = function(url, options) {
    if (options == null) {
      options = {};
    }
    this.redirected = true;
    return this.publishEvent('!router:route', url, options, function(routed) {
      if (!routed) {
        throw new Error('Controller#redirectTo: no route matched');
      }
    });
  };

  Controller.prototype.redirectToRoute = function(name, params, options) {
    this.redirected = true;
    return this.publishEvent('!router:routeByName', name, params, options, function(routed) {
      if (!routed) {
        throw new Error('Controller#redirectToRoute: no route matched');
      }
    });
  };

  Controller.prototype.disposed = false;

  Controller.prototype.dispose = function() {
    var obj, prop, properties, _i, _len;
    if (this.disposed) {
      return;
    }
    for (prop in this) {
      if (!__hasProp.call(this, prop)) continue;
      obj = this[prop];
      if (!(obj && typeof obj.dispose === 'function')) {
        continue;
      }
      obj.dispose();
      delete this[prop];
    }
    this.unsubscribeAllEvents();
    this.stopListening();
    properties = ['redirected'];
    for (_i = 0, _len = properties.length; _i < _len; _i++) {
      prop = properties[_i];
      delete this[prop];
    }
    this.disposed = true;
    return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
  };

  return Controller;

})();

}});;require.define({'chaplin/models/collection': function(exports, require, module) {
'use strict';

var Backbone, Collection, EventBroker, Model, utils, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('underscore');

Backbone = require('backbone');

EventBroker = require('chaplin/lib/event_broker');

Model = require('chaplin/models/model');

utils = require('chaplin/lib/utils');

module.exports = Collection = (function(_super) {

  __extends(Collection, _super);

  function Collection() {
    return Collection.__super__.constructor.apply(this, arguments);
  }

  _(Collection.prototype).extend(EventBroker);

  Collection.prototype.model = Model;

  Collection.prototype.initDeferred = function() {
    return _(this).extend($.Deferred());
  };

  Collection.prototype.serialize = function() {
    return this.map(utils.serialize);
  };

  Collection.prototype.disposed = false;

  Collection.prototype.dispose = function() {
    var prop, properties, _i, _len;
    if (this.disposed) {
      return;
    }
    this.trigger('dispose', this);
    this.reset([], {
      silent: true
    });
    this.unsubscribeAllEvents();
    this.stopListening();
    this.off();
    if (typeof this.reject === "function") {
      this.reject();
    }
    properties = ['model', 'models', '_byId', '_byCid', '_callbacks'];
    for (_i = 0, _len = properties.length; _i < _len; _i++) {
      prop = properties[_i];
      delete this[prop];
    }
    this.disposed = true;
    return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
  };

  return Collection;

})(Backbone.Collection);

}});;require.define({'chaplin/models/model': function(exports, require, module) {
'use strict';

var Backbone, EventBroker, Model, serializeAttributes, serializeModelAttributes, utils, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('underscore');

Backbone = require('backbone');

utils = require('chaplin/lib/utils');

EventBroker = require('chaplin/lib/event_broker');

serializeAttributes = function(model, attributes, modelStack) {
  var delegator, key, otherModel, serializedModels, value, _i, _len, _ref;
  delegator = utils.beget(attributes);
  if (modelStack == null) {
    modelStack = {};
  }
  modelStack[model.cid] = true;
  for (key in attributes) {
    value = attributes[key];
    if (value instanceof Backbone.Model) {
      delegator[key] = serializeModelAttributes(value, model, modelStack);
    } else if (value instanceof Backbone.Collection) {
      serializedModels = [];
      _ref = value.models;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        otherModel = _ref[_i];
        serializedModels.push(serializeModelAttributes(otherModel, model, modelStack));
      }
      delegator[key] = serializedModels;
    }
  }
  delete modelStack[model.cid];
  return delegator;
};

serializeModelAttributes = function(model, currentModel, modelStack) {
  var attributes;
  if (model === currentModel || _(modelStack).has(model.cid)) {
    return null;
  }
  attributes = typeof model.getAttributes === 'function' ? model.getAttributes() : model.attributes;
  return serializeAttributes(model, attributes, modelStack);
};

module.exports = Model = (function(_super) {

  __extends(Model, _super);

  function Model() {
    return Model.__super__.constructor.apply(this, arguments);
  }

  _(Model.prototype).extend(EventBroker);

  Model.prototype.initDeferred = function() {
    return _(this).extend($.Deferred());
  };

  Model.prototype.getAttributes = function() {
    return this.attributes;
  };

  Model.prototype.serialize = function() {
    return serializeAttributes(this, this.getAttributes());
  };

  Model.prototype.disposed = false;

  Model.prototype.dispose = function() {
    var prop, properties, _i, _len;
    if (this.disposed) {
      return;
    }
    this.trigger('dispose', this);
    this.unsubscribeAllEvents();
    this.stopListening();
    this.off();
    if (typeof this.reject === "function") {
      this.reject();
    }
    properties = ['collection', 'attributes', 'changed', '_escapedAttributes', '_previousAttributes', '_silent', '_pending', '_callbacks'];
    for (_i = 0, _len = properties.length; _i < _len; _i++) {
      prop = properties[_i];
      delete this[prop];
    }
    this.disposed = true;
    return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
  };

  return Model;

})(Backbone.Model);

}});;require.define({'chaplin/views/layout': function(exports, require, module) {
'use strict';

var $, Backbone, EventBroker, Layout, utils, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

_ = require('underscore');

Backbone = require('backbone');

utils = require('chaplin/lib/utils');

EventBroker = require('chaplin/lib/event_broker');

$ = Backbone.$;

module.exports = Layout = (function() {

  Layout.extend = Backbone.Model.extend;

  _(Layout.prototype).extend(EventBroker);

  Layout.prototype.title = '';

  Layout.prototype.events = {};

  Layout.prototype.el = document;

  Layout.prototype.$el = $(document);

  Layout.prototype.cid = 'chaplin-layout';

  Layout.prototype.regions = null;

  Layout.prototype._registeredRegions = null;

  function Layout() {
    this.openLink = __bind(this.openLink, this);
    this.initialize.apply(this, arguments);
    this.delegateEvents();
    this.registerRegions(this, this.regions);
  }

  Layout.prototype.initialize = function(options) {
    if (options == null) {
      options = {};
    }
    this.title = options.title;
    if (options.regions) {
      this.regions = options.regions;
    }
    this.settings = _(options).defaults({
      titleTemplate: _.template("<%= subtitle %> \u2013 <%= title %>"),
      openExternalToBlank: false,
      routeLinks: 'a, .go-to',
      skipRouting: '.noscript',
      scrollTo: [0, 0]
    });
    this._registeredRegions = [];
    this.subscribeEvent('beforeControllerDispose', this.hideOldView);
    this.subscribeEvent('dispatcher:dispatch', this.showNewView);
    this.subscribeEvent('!adjustTitle', this.adjustTitle);
    this.subscribeEvent('!region:show', this.showRegion);
    this.subscribeEvent('!region:register', this.registerRegionHandler);
    this.subscribeEvent('!region:unregister', this.unregisterRegionHandler);
    if (this.settings.routeLinks) {
      return this.startLinkRouting();
    }
  };

  Layout.prototype.delegateEvents = Backbone.View.prototype.delegateEvents;

  Layout.prototype.undelegateEvents = Backbone.View.prototype.undelegateEvents;

  Layout.prototype.$ = Backbone.View.prototype.$;

  Layout.prototype.hideOldView = function(controller) {
    var scrollTo, view;
    scrollTo = this.settings.scrollTo;
    if (scrollTo) {
      window.scrollTo(scrollTo[0], scrollTo[1]);
    }
    view = controller.view;
    if (view) {
      return view.$el.hide();
    }
  };

  Layout.prototype.showNewView = function(controller) {
    var view;
    view = controller.view;
    if (view) {
      return view.$el.show();
    }
  };

  Layout.prototype.adjustTitle = function(subtitle) {
    var title;
    if (subtitle == null) {
      subtitle = '';
    }
    title = this.settings.titleTemplate({
      title: this.title,
      subtitle: subtitle
    });
    return setTimeout((function() {
      return document.title = title;
    }), 50);
  };

  Layout.prototype.startLinkRouting = function() {
    if (this.settings.routeLinks) {
      return $(document).on('click', this.settings.routeLinks, this.openLink);
    }
  };

  Layout.prototype.stopLinkRouting = function() {
    if (this.settings.routeLinks) {
      return $(document).off('click', this.settings.routeLinks);
    }
  };

  Layout.prototype.isExternalLink = function(link) {
    var _ref, _ref1;
    return link.target === '_blank' || link.rel === 'external' || ((_ref = link.protocol) !== 'http:' && _ref !== 'https:' && _ref !== 'file:') || ((_ref1 = link.hostname) !== location.hostname && _ref1 !== '');
  };

  Layout.prototype.openLink = function(event) {
    var $el, callback, el, external, href, isAnchor, options, path, queryString, skipRouting, type, _ref;
    if (utils.modifierKeyPressed(event)) {
      return;
    }
    el = event.currentTarget;
    $el = $(el);
    isAnchor = el.nodeName === 'A';
    href = $el.attr('href') || $el.data('href') || null;
    if (href === null || href === void 0 || href === '' || href.charAt(0) === '#') {
      return;
    }
    skipRouting = this.settings.skipRouting;
    type = typeof skipRouting;
    if (type === 'function' && !skipRouting(href, el) || type === 'string' && $el.is(skipRouting)) {
      return;
    }
    external = isAnchor && this.isExternalLink(el);
    if (external) {
      if (this.settings.openExternalToBlank) {
        event.preventDefault();
        window.open(el.href);
      }
      return;
    }
    if (isAnchor) {
      path = el.pathname;
      queryString = el.search.substring(1);
      if (path.charAt(0) !== '/') {
        path = "/" + path;
      }
    } else {
      _ref = href.split('?'), path = _ref[0], queryString = _ref[1];
      if (queryString == null) {
        queryString = '';
      }
    }
    options = {
      queryString: queryString
    };
    callback = function(routed) {
      if (routed) {
        event.preventDefault();
      } else if (!isAnchor) {
        location.href = path;
      }
    };
    this.publishEvent('!router:route', path, options, callback);
  };

  Layout.prototype.registerRegionHandler = function(instance, name, selector) {
    if (name != null) {
      return this.registerRegion(instance, name, selector);
    } else {
      return this.registerRegions(instance);
    }
  };

  Layout.prototype.registerRegion = function(instance, name, selector) {
    this.unregisterRegion(instance, name);
    return this._registeredRegions.unshift({
      instance: instance,
      name: name,
      selector: selector
    });
  };

  Layout.prototype.registerRegions = function(instance) {
    var name, selector, version, _i, _len, _ref;
    _ref = utils.getAllPropertyVersions(instance, 'regions');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      version = _ref[_i];
      for (selector in version) {
        name = version[selector];
        this.registerRegion(instance, name, selector);
      }
    }
  };

  Layout.prototype.unregisterRegionHandler = function(instance, name) {
    if (name != null) {
      return this.unregisterRegion(instance, name);
    } else {
      return this.unregisterRegions(instance);
    }
  };

  Layout.prototype.unregisterRegion = function(instance, name) {
    var cid;
    cid = instance.cid;
    return this._registeredRegions = _.filter(this._registeredRegions, function(region) {
      return region.instance.cid !== cid || region.name !== name;
    });
  };

  Layout.prototype.unregisterRegions = function(instance) {
    return this._registeredRegions = _.filter(this._registeredRegions, function(region) {
      return region.instance.cid !== instance.cid;
    });
  };

  Layout.prototype.showRegion = function(name, instance) {
    var region;
    region = _.find(this._registeredRegions, function(region) {
      return region.name === name && !region.instance.stale;
    });
    if (!region) {
      throw new Error("No region registered under " + name);
    }
    return instance.container = region.selector === '' ? region.instance.$el : region.instance.$(region.selector);
  };

  Layout.prototype.disposed = false;

  Layout.prototype.dispose = function() {
    if (this.disposed) {
      return;
    }
    delete this.regions;
    this.stopLinkRouting();
    this.unsubscribeAllEvents();
    this.undelegateEvents();
    delete this.title;
    this.disposed = true;
    return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
  };

  return Layout;

})();

}});;require.define({'chaplin/views/view': function(exports, require, module) {
'use strict';

var $, Backbone, EventBroker, View, utils, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('underscore');

Backbone = require('backbone');

utils = require('chaplin/lib/utils');

EventBroker = require('chaplin/lib/event_broker');

$ = Backbone.$;

module.exports = View = (function(_super) {

  __extends(View, _super);

  _(View.prototype).extend(EventBroker);

  View.prototype.autoRender = false;

  View.prototype.autoAttach = true;

  View.prototype.container = null;

  View.prototype.containerMethod = 'append';

  View.prototype.regions = null;

  View.prototype.region = null;

  View.prototype.subviews = null;

  View.prototype.subviewsByName = null;

  View.prototype.stale = false;

  function View(options) {
    var render,
      _this = this;
    if (options) {
      _(this).extend(_.pick(options, ['autoAttach', 'autoRender', 'container', 'containerMethod', 'region']));
    }
    render = this.render;
    this.render = function() {
      if (_this.disposed) {
        return false;
      }
      render.apply(_this, arguments);
      if (_this.autoAttach) {
        _this.attach.apply(_this, arguments);
      }
      return _this;
    };
    View.__super__.constructor.apply(this, arguments);
    this.delegateListeners();
    if (this.model) {
      this.listenTo(this.model, 'dispose', this.dispose);
    }
    if (this.collection) {
      this.listenTo(this.collection, 'dispose', function(subject) {
        if (!subject || subject === _this.collection) {
          return _this.dispose();
        }
      });
    }
    if (this.regions != null) {
      this.publishEvent('!region:register', this);
    }
    if (this.autoRender) {
      this.render();
    }
  }

  View.prototype.delegate = function(eventName, second, third) {
    var bound, events, handler, list, selector,
      _this = this;
    if (typeof eventName !== 'string') {
      throw new TypeError('View#delegate: first argument must be a string');
    }
    if (arguments.length === 2) {
      handler = second;
    } else if (arguments.length === 3) {
      selector = second;
      if (typeof selector !== 'string') {
        throw new TypeError('View#delegate: ' + 'second argument must be a string');
      }
      handler = third;
    } else {
      throw new TypeError('View#delegate: ' + 'only two or three arguments are allowed');
    }
    if (typeof handler !== 'function') {
      throw new TypeError('View#delegate: ' + 'handler argument must be function');
    }
    list = _.map(eventName.split(' '), function(event) {
      return "" + event + ".delegate" + _this.cid;
    });
    events = list.join(' ');
    bound = _.bind(handler, this);
    this.$el.on(events, selector || null, bound);
    return bound;
  };

  View.prototype._delegateEvents = function(events) {
    var bound, eventName, handler, key, match, selector, value;
    for (key in events) {
      value = events[key];
      handler = typeof value === 'function' ? value : this[value];
      if (!handler) {
        throw new Error("Method '" + handler + "' does not exist");
      }
      match = key.match(/^(\S+)\s*(.*)$/);
      eventName = "" + match[1] + ".delegateEvents" + this.cid;
      selector = match[2];
      bound = _.bind(handler, this);
      this.$el.on(eventName, selector || null, bound);
    }
  };

  View.prototype.delegateEvents = function(events) {
    var classEvents, _i, _len, _ref;
    this.undelegateEvents();
    if (events) {
      this._delegateEvents(events);
      return;
    }
    if (!this.events) {
      return;
    }
    _ref = utils.getAllPropertyVersions(this, 'events');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      classEvents = _ref[_i];
      if (typeof classEvents === 'function') {
        throw new TypeError('View#delegateEvents: functions are not supported');
      }
      this._delegateEvents(classEvents);
    }
  };

  View.prototype.undelegate = function() {
    return this.$el.unbind(".delegate" + this.cid);
  };

  View.prototype.delegateListeners = function() {
    var eventName, key, method, target, version, _i, _len, _ref, _ref1;
    if (!this.listen) {
      return;
    }
    _ref = utils.getAllPropertyVersions(this, 'listen');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      version = _ref[_i];
      for (key in version) {
        method = version[key];
        if (typeof method !== 'function') {
          method = this[method];
        }
        if (typeof method !== 'function') {
          throw new Error('View#delegateListeners: ' + ("" + method + " must be function"));
        }
        _ref1 = key.split(' '), eventName = _ref1[0], target = _ref1[1];
        this.delegateListener(eventName, target, method);
      }
    }
  };

  View.prototype.delegateListener = function(eventName, target, callback) {
    var prop;
    if (target === 'model' || target === 'collection') {
      prop = this[target];
      if (prop) {
        this.listenTo(prop, eventName, callback);
      }
    } else if (target === 'mediator') {
      this.subscribeEvent(eventName, callback);
    } else if (!target) {
      this.on(eventName, callback, this);
    }
  };

  View.prototype.registerRegion = function(selector, name) {
    return this.publishEvent('!region:register', this, name, selector);
  };

  View.prototype.unregisterRegion = function(name) {
    return this.publishEvent('!region:unregister', this, name);
  };

  View.prototype.unregisterAllRegions = function() {
    return this.publishEvent('!region:unregister', this);
  };

  View.prototype.subview = function(name, view) {
    var byName, subviews, _ref, _ref1;
    subviews = (_ref = this.subviews) != null ? _ref : this.subviews = [];
    byName = (_ref1 = this.subviewsByName) != null ? _ref1 : this.subviewsByName = {};
    if (name && view) {
      this.removeSubview(name);
      subviews.push(view);
      byName[name] = view;
      return view;
    } else if (name) {
      return byName[name];
    }
  };

  View.prototype.removeSubview = function(nameOrView) {
    var byName, index, name, otherName, otherView, subviews, view, _ref, _ref1;
    if (!nameOrView) {
      return;
    }
    subviews = (_ref = this.subviews) != null ? _ref : this.subviews = [];
    byName = (_ref1 = this.subviewsByName) != null ? _ref1 : this.subviewsByName = {};
    if (typeof nameOrView === 'string') {
      name = nameOrView;
      view = byName[name];
    } else {
      view = nameOrView;
      for (otherName in byName) {
        otherView = byName[otherName];
        if (view === otherView) {
          name = otherName;
          break;
        }
      }
    }
    if (!(name && view && view.dispose)) {
      return;
    }
    view.dispose();
    index = _.indexOf(subviews, view);
    if (index !== -1) {
      subviews.splice(index, 1);
    }
    return delete byName[name];
  };

  View.prototype.getTemplateData = function() {
    var data, source;
    data = this.model ? utils.serialize(this.model) : this.collection ? {
      items: utils.serialize(this.collection),
      length: this.collection.length
    } : {};
    source = this.model || this.collection;
    if (source) {
      if (typeof source.state === 'function' && !('resolved' in data)) {
        data.resolved = source.state() === 'resolved';
      }
      if (typeof source.isSynced === 'function' && !('synced' in data)) {
        data.synced = source.isSynced();
      }
    }
    return data;
  };

  View.prototype.getTemplateFunction = function() {
    throw new Error('View#getTemplateFunction must be overridden');
  };

  View.prototype.render = function() {
    var html, templateFunc;
    if (this.disposed) {
      return false;
    }
    templateFunc = this.getTemplateFunction();
    if (typeof templateFunc === 'function') {
      html = templateFunc(this.getTemplateData());
      this.$el.html(html);
    }
    return this;
  };

  View.prototype.attach = function() {
    if (this.region != null) {
      this.publishEvent('!region:show', this.region, this);
    }
    if (this.container) {
      $(this.container)[this.containerMethod](this.el);
      return this.trigger('addedToDOM');
    }
  };

  View.prototype.disposed = false;

  View.prototype.dispose = function() {
    var prop, properties, subview, _i, _j, _len, _len1, _ref;
    if (this.disposed) {
      return;
    }
    this.unregisterAllRegions();
    if (this.subviews != null) {
      _ref = this.subviews;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        subview = _ref[_i];
        subview.dispose();
      }
    }
    this.unsubscribeAllEvents();
    this.stopListening();
    this.off();
    this.$el.remove();
    properties = ['el', '$el', 'options', 'model', 'collection', 'subviews', 'subviewsByName', '_callbacks'];
    for (_j = 0, _len1 = properties.length; _j < _len1; _j++) {
      prop = properties[_j];
      delete this[prop];
    }
    this.disposed = true;
    return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
  };

  return View;

})(Backbone.View);

}});;require.define({'chaplin/views/collection_view': function(exports, require, module) {
'use strict';

var $, Backbone, CollectionView, View, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('underscore');

Backbone = require('backbone');

View = require('chaplin/views/view');

$ = Backbone.$;

module.exports = CollectionView = (function(_super) {

  __extends(CollectionView, _super);

  CollectionView.prototype.itemView = null;

  CollectionView.prototype.autoRender = true;

  CollectionView.prototype.renderItems = true;

  CollectionView.prototype.animationDuration = 500;

  CollectionView.prototype.useCssAnimation = false;

  CollectionView.prototype.animationStartClass = 'animated-item-view';

  CollectionView.prototype.animationEndClass = 'animated-item-view-end';

  CollectionView.prototype.listSelector = null;

  CollectionView.prototype.$list = null;

  CollectionView.prototype.fallbackSelector = null;

  CollectionView.prototype.$fallback = null;

  CollectionView.prototype.loadingSelector = null;

  CollectionView.prototype.$loading = null;

  CollectionView.prototype.itemSelector = null;

  CollectionView.prototype.filterer = null;

  CollectionView.prototype.filterCallback = function(view, included) {
    return view.$el.stop(true, true).toggle(included);
  };

  CollectionView.prototype.visibleItems = null;

  function CollectionView(options) {
    this.renderAllItems = __bind(this.renderAllItems, this);

    this.toggleFallback = __bind(this.toggleFallback, this);

    this.itemsReset = __bind(this.itemsReset, this);

    this.itemRemoved = __bind(this.itemRemoved, this);

    this.itemAdded = __bind(this.itemAdded, this);
    if (options) {
      _(this).extend(_.pick(options, ['renderItems', 'itemView']));
    }
    this.visibleItems = [];
    CollectionView.__super__.constructor.apply(this, arguments);
  }

  CollectionView.prototype.initialize = function(options) {
    if (options == null) {
      options = {};
    }
    this.addCollectionListeners();
    if (options.filterer != null) {
      return this.filter(options.filterer);
    }
  };

  CollectionView.prototype.addCollectionListeners = function() {
    this.listenTo(this.collection, 'add', this.itemAdded);
    this.listenTo(this.collection, 'remove', this.itemRemoved);
    return this.listenTo(this.collection, 'reset sort', this.itemsReset);
  };

  CollectionView.prototype.getTemplateData = function() {
    var templateData;
    templateData = {
      length: this.collection.length
    };
    if (typeof this.collection.state === 'function') {
      templateData.resolved = this.collection.state() === 'resolved';
    }
    if (typeof this.collection.isSynced === 'function') {
      templateData.synced = this.collection.isSynced();
    }
    return templateData;
  };

  CollectionView.prototype.getTemplateFunction = function() {};

  CollectionView.prototype.render = function() {
    CollectionView.__super__.render.apply(this, arguments);
    this.$list = this.listSelector ? this.$(this.listSelector) : this.$el;
    this.initFallback();
    this.initLoadingIndicator();
    if (this.renderItems) {
      return this.renderAllItems();
    }
  };

  CollectionView.prototype.itemAdded = function(item, collection, options) {
    if (options == null) {
      options = {};
    }
    return this.insertView(item, this.renderItem(item), options.index);
  };

  CollectionView.prototype.itemRemoved = function(item) {
    return this.removeViewForItem(item);
  };

  CollectionView.prototype.itemsReset = function() {
    return this.renderAllItems();
  };

  CollectionView.prototype.initFallback = function() {
    if (!this.fallbackSelector) {
      return;
    }
    this.$fallback = this.$(this.fallbackSelector);
    this.on('visibilityChange', this.toggleFallback);
    this.listenTo(this.collection, 'syncStateChange', this.toggleFallback);
    return this.toggleFallback();
  };

  CollectionView.prototype.toggleFallback = function() {
    var visible;
    visible = this.visibleItems.length === 0 && (typeof this.collection.isSynced === 'function' ? this.collection.isSynced() : true);
    return this.$fallback.toggle(visible);
  };

  CollectionView.prototype.initLoadingIndicator = function() {
    if (!(this.loadingSelector && typeof this.collection.isSyncing === 'function')) {
      return;
    }
    this.$loading = this.$(this.loadingSelector);
    this.listenTo(this.collection, 'syncStateChange', this.toggleLoadingIndicator);
    return this.toggleLoadingIndicator();
  };

  CollectionView.prototype.toggleLoadingIndicator = function() {
    var visible;
    visible = this.collection.length === 0 && this.collection.isSyncing();
    return this.$loading.toggle(visible);
  };

  CollectionView.prototype.getItemViews = function() {
    var itemViews, name, view, _ref;
    itemViews = {};
    if (this.subviewsByName) {
      _ref = this.subviewsByName;
      for (name in _ref) {
        view = _ref[name];
        if (name.slice(0, 9) === 'itemView:') {
          itemViews[name.slice(9)] = view;
        }
      }
    }
    return itemViews;
  };

  CollectionView.prototype.filter = function(filterer, filterCallback) {
    var included, index, item, view, _i, _len, _ref;
    this.filterer = filterer;
    if (filterCallback) {
      this.filterCallback = filterCallback;
    }
    if (filterCallback == null) {
      filterCallback = this.filterCallback;
    }
    if (!_(this.getItemViews()).isEmpty()) {
      _ref = this.collection.models;
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        item = _ref[index];
        included = typeof filterer === 'function' ? filterer(item, index) : true;
        view = this.subview("itemView:" + item.cid);
        if (!view) {
          throw new Error('CollectionView#filter: ' + ("no view found for " + item.cid));
        }
        this.filterCallback(view, included);
        this.updateVisibleItems(view.model, included, false);
      }
    }
    return this.trigger('visibilityChange', this.visibleItems);
  };

  CollectionView.prototype.renderAllItems = function() {
    var cid, index, item, items, remainingViewsByCid, view, _i, _j, _len, _len1, _ref;
    items = this.collection.models;
    this.visibleItems = [];
    remainingViewsByCid = {};
    for (_i = 0, _len = items.length; _i < _len; _i++) {
      item = items[_i];
      view = this.subview("itemView:" + item.cid);
      if (view) {
        remainingViewsByCid[item.cid] = view;
      }
    }
    _ref = this.getItemViews();
    for (cid in _ref) {
      if (!__hasProp.call(_ref, cid)) continue;
      view = _ref[cid];
      if (!(cid in remainingViewsByCid)) {
        this.removeSubview("itemView:" + cid);
      }
    }
    for (index = _j = 0, _len1 = items.length; _j < _len1; index = ++_j) {
      item = items[index];
      view = this.subview("itemView:" + item.cid);
      if (view) {
        this.insertView(item, view, index, false);
      } else {
        this.insertView(item, this.renderItem(item), index);
      }
    }
    if (items.length === 0) {
      return this.trigger('visibilityChange', this.visibleItems);
    }
  };

  CollectionView.prototype.renderItem = function(item) {
    var view;
    view = this.subview("itemView:" + item.cid);
    if (!view) {
      view = this.initItemView(item);
      this.subview("itemView:" + item.cid, view);
    }
    view.render();
    return view;
  };

  CollectionView.prototype.initItemView = function(model) {
    if (this.itemView) {
      return new this.itemView({
        model: model,
        autoRender: false
      });
    } else {
      throw new Error('The CollectionView#itemView property ' + 'must be defined or the initItemView() must be overridden.');
    }
  };

  CollectionView.prototype.insertView = function(item, view, index, enableAnimation) {
    var $list, $next, $previous, $viewEl, children, childrenLength, included, insertInMiddle, isEnd, length, method, position, viewEl,
      _this = this;
    if (index == null) {
      index = null;
    }
    if (enableAnimation == null) {
      enableAnimation = true;
    }
    if (this.animationDuration === 0) {
      enableAnimation = false;
    }
    position = typeof index === 'number' ? index : this.collection.indexOf(item);
    included = typeof this.filterer === 'function' ? this.filterer(item, position) : true;
    viewEl = view.el;
    $viewEl = view.$el;
    if (included && enableAnimation) {
      if (this.useCssAnimation) {
        $viewEl.addClass(this.animationStartClass);
      } else {
        $viewEl.css('opacity', 0);
      }
    }
    if (this.filterer) {
      this.filterCallback(view, included);
    }
    length = this.collection.length;
    insertInMiddle = (0 < position && position < length);
    isEnd = function(length) {
      return length === 0 || position === length;
    };
    $list = this.$list;
    if (insertInMiddle || this.itemSelector) {
      children = $list.children(this.itemSelector);
      childrenLength = children.length;
      if (children.get(position) !== viewEl) {
        if (isEnd(childrenLength)) {
          $list.append(viewEl);
        } else {
          if (position === 0) {
            $next = children.eq(position);
            $next.before(viewEl);
          } else {
            $previous = children.eq(position - 1);
            $previous.after(viewEl);
          }
        }
      }
    } else {
      method = isEnd(length) ? 'append' : 'prepend';
      $list[method](viewEl);
    }
    view.trigger('addedToParent');
    this.updateVisibleItems(item, included);
    if (included && enableAnimation) {
      if (this.useCssAnimation) {
        setTimeout(function() {
          return $viewEl.addClass(_this.animationEndClass);
        }, 0);
      } else {
        $viewEl.animate({
          opacity: 1
        }, this.animationDuration);
      }
    }
  };

  CollectionView.prototype.removeViewForItem = function(item) {
    this.updateVisibleItems(item, false);
    return this.removeSubview("itemView:" + item.cid);
  };

  CollectionView.prototype.updateVisibleItems = function(item, includedInFilter, triggerEvent) {
    var includedInVisibleItems, visibilityChanged, visibleItemsIndex;
    if (triggerEvent == null) {
      triggerEvent = true;
    }
    visibilityChanged = false;
    visibleItemsIndex = _(this.visibleItems).indexOf(item);
    includedInVisibleItems = visibleItemsIndex !== -1;
    if (includedInFilter && !includedInVisibleItems) {
      this.visibleItems.push(item);
      visibilityChanged = true;
    } else if (!includedInFilter && includedInVisibleItems) {
      this.visibleItems.splice(visibleItemsIndex, 1);
      visibilityChanged = true;
    }
    if (visibilityChanged && triggerEvent) {
      this.trigger('visibilityChange', this.visibleItems);
    }
    return visibilityChanged;
  };

  CollectionView.prototype.dispose = function() {
    var prop, properties, _i, _len;
    if (this.disposed) {
      return;
    }
    properties = ['$list', '$fallback', '$loading', 'visibleItems'];
    for (_i = 0, _len = properties.length; _i < _len; _i++) {
      prop = properties[_i];
      delete this[prop];
    }
    return CollectionView.__super__.dispose.apply(this, arguments);
  };

  return CollectionView;

})(View);

}});;require.define({'chaplin/lib/route': function(exports, require, module) {
'use strict';

var Backbone, Controller, EventBroker, Route, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty;

_ = require('underscore');

Backbone = require('backbone');

EventBroker = require('chaplin/lib/event_broker');

Controller = require('chaplin/controllers/controller');

module.exports = Route = (function() {
  var escapeRegExp;

  Route.extend = Backbone.Model.extend;

  _(Route.prototype).extend(EventBroker);

  escapeRegExp = /[-[\]{}()+?.,\\^$|#\s]/g;

  function Route(pattern, controller, action, options) {
    var _ref;
    this.pattern = pattern;
    this.controller = controller;
    this.action = action;
    this.handler = __bind(this.handler, this);

    this.addParamName = __bind(this.addParamName, this);

    if (_.isRegExp(this.pattern)) {
      throw new Error('Route: RegExps are not supported.\
        Use strings with :names and `constraints` option of route');
    }
    this.options = options ? _.clone(options) : {};
    if (this.options.name != null) {
      this.name = this.options.name;
    }
    if (this.name && this.name.indexOf('#') !== -1) {
      throw new Error('Route: "#" cannot be used in name');
    }
    if ((_ref = this.name) == null) {
      this.name = this.controller + '#' + this.action;
    }
    this.paramNames = [];
    if (_(Controller.prototype).has(this.action)) {
      throw new Error('Route: You should not use existing controller ' + 'properties as action names');
    }
    this.createRegExp();
    if (typeof Object.freeze === "function") {
      Object.freeze(this);
    }
  }

  Route.prototype.matches = function(criteria) {
    var name, property, _i, _len, _ref;
    if (typeof criteria === 'string') {
      return criteria === this.name;
    } else {
      _ref = ['name', 'action', 'controller'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        property = criteria[name];
        if (property && property !== this[name]) {
          return false;
        }
      }
      return true;
    }
  };

  Route.prototype.reverse = function(params) {
    var index, name, url, value, _i, _len, _ref;
    url = this.pattern;
    if (_.isArray(params)) {
      if (params.length < this.paramNames.length) {
        return false;
      }
      index = 0;
      url = url.replace(/[:*][^\/\?]+/g, function(match) {
        var result;
        result = params[index];
        index += 1;
        return result;
      });
    } else {
      _ref = this.paramNames;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        value = params[name];
        if (value === void 0) {
          return false;
        }
        url = url.replace(RegExp("[:*]" + name, "g"), value);
      }
    }
    if (this.test(url)) {
      return url;
    } else {
      return false;
    }
  };

  Route.prototype.createRegExp = function() {
    var pattern;
    pattern = this.pattern.replace(escapeRegExp, '\\$&').replace(/(?::|\*)(\w+)/g, this.addParamName);
    return this.regExp = RegExp("^" + pattern + "(?=\\?|$)");
  };

  Route.prototype.addParamName = function(match, paramName) {
    this.paramNames.push(paramName);
    if (match.charAt(0) === ':') {
      return '([^\/\?]+)';
    } else {
      return '(.*?)';
    }
  };

  Route.prototype.test = function(path) {
    var constraint, constraints, matched, name, params;
    matched = this.regExp.test(path);
    if (!matched) {
      return false;
    }
    constraints = this.options.constraints;
    if (constraints) {
      params = this.extractParams(path);
      for (name in constraints) {
        if (!__hasProp.call(constraints, name)) continue;
        constraint = constraints[name];
        if (!constraint.test(params[name])) {
          return false;
        }
      }
    }
    return true;
  };

  Route.prototype.handler = function(path, options) {
    var params, query, route, _ref;
    options = options ? _.clone(options) : {};
    query = (_ref = options.query) != null ? _ref : this.getCurrentQuery();
    params = this.buildParams(path, query);
    route = {
      path: path,
      action: this.action,
      controller: this.controller,
      name: this.name,
      query: query
    };
    delete options.query;
    return this.publishEvent('router:match', route, params, options);
  };

  Route.prototype.getCurrentQuery = function() {
    return location.search.substring(1);
  };

  Route.prototype.buildParams = function(path, queryString) {
    return _.extend({}, this.extractQueryParams(queryString), this.extractParams(path), this.options.params);
  };

  Route.prototype.extractParams = function(path) {
    var index, match, matches, paramName, params, _i, _len, _ref;
    params = {};
    matches = this.regExp.exec(path);
    _ref = matches.slice(1);
    for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
      match = _ref[index];
      paramName = this.paramNames.length ? this.paramNames[index] : index;
      params[paramName] = match;
    }
    return params;
  };

  Route.prototype.extractQueryParams = function(queryString) {
    var current, field, pair, pairs, params, value, _i, _len, _ref;
    params = {};
    if (!queryString) {
      return params;
    }
    pairs = queryString.split('&');
    for (_i = 0, _len = pairs.length; _i < _len; _i++) {
      pair = pairs[_i];
      if (!pair.length) {
        continue;
      }
      _ref = pair.split('='), field = _ref[0], value = _ref[1];
      if (!field.length) {
        continue;
      }
      field = decodeURIComponent(field);
      value = decodeURIComponent(value);
      current = params[field];
      if (current) {
        if (current.push) {
          current.push(value);
        } else {
          params[field] = [current, value];
        }
      } else {
        params[field] = value;
      }
    }
    return params;
  };

  return Route;

})();

}});;require.define({'chaplin/lib/router': function(exports, require, module) {
'use strict';

var Backbone, EventBroker, Route, Router, utils, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

_ = require('underscore');

Backbone = require('backbone');

EventBroker = require('chaplin/lib/event_broker');

Route = require('chaplin/lib/route');

utils = require('chaplin/lib/utils');

module.exports = Router = (function() {

  Router.extend = Backbone.Model.extend;

  _(Router.prototype).extend(EventBroker);

  function Router(options) {
    this.options = options != null ? options : {};
    this.route = __bind(this.route, this);

    this.match = __bind(this.match, this);

    _(this.options).defaults({
      pushState: true,
      root: '/'
    });
    this.removeRoot = new RegExp('^' + utils.escapeRegExp(this.options.root) + '(#)?');
    this.subscribeEvent('!router:route', this.routeHandler);
    this.subscribeEvent('!router:routeByName', this.routeByNameHandler);
    this.subscribeEvent('!router:reverse', this.reverseHandler);
    this.subscribeEvent('!router:changeURL', this.changeURLHandler);
    this.createHistory();
  }

  Router.prototype.createHistory = function() {
    return Backbone.history || (Backbone.history = new Backbone.History());
  };

  Router.prototype.startHistory = function() {
    return Backbone.history.start(this.options);
  };

  Router.prototype.stopHistory = function() {
    if (Backbone.History.started) {
      return Backbone.history.stop();
    }
  };

  Router.prototype.match = function(pattern, target, options) {
    var action, controller, route, _ref;
    if (options == null) {
      options = {};
    }
    if (arguments.length === 2 && typeof target === 'object') {
      options = target;
      controller = options.controller, action = options.action;
      if (!(controller && action)) {
        throw new Error('Router#match must receive either target or ' + 'options.controller & options.action');
      }
    } else {
      controller = options.controller, action = options.action;
      if (controller || action) {
        throw new Error('Router#match cannot use both target and ' + 'options.controller / options.action');
      }
      _ref = target.split('#'), controller = _ref[0], action = _ref[1];
    }
    route = new Route(pattern, controller, action, options);
    Backbone.history.handlers.push({
      route: route,
      callback: route.handler
    });
    return route;
  };

  Router.prototype.route = function(path, options) {
    var handler, _i, _len, _ref;
    options = options ? _.clone(options) : {};
    _(options).defaults({
      changeURL: true
    });
    path = path.replace(this.removeRoot, '');
    _ref = Backbone.history.handlers;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      handler = _ref[_i];
      if (handler.route.test(path)) {
        handler.callback(path, options);
        return true;
      }
    }
    return false;
  };

  Router.prototype.routeHandler = function(path, options, callback) {
    var routed;
    if (arguments.length === 2 && typeof options === 'function') {
      callback = options;
      options = {};
    }
    routed = this.route(path, options);
    return typeof callback === "function" ? callback(routed) : void 0;
  };

  Router.prototype.routeByNameHandler = function(name, params, options, callback) {
    var path, routed;
    if (arguments.length === 3 && typeof options === 'function') {
      callback = options;
      options = {};
    }
    path = this.reverse(name, params);
    if (typeof path === 'string') {
      routed = this.route(path, options);
      return typeof callback === "function" ? callback(routed) : void 0;
    } else {
      return typeof callback === "function" ? callback(false) : void 0;
    }
  };

  Router.prototype.reverse = function(criteria, params) {
    var handler, handlers, reversed, root, url, _i, _len;
    root = this.options.root;
    handlers = Backbone.history.handlers;
    for (_i = 0, _len = handlers.length; _i < _len; _i++) {
      handler = handlers[_i];
      if (!(handler.route.matches(criteria))) {
        continue;
      }
      reversed = handler.route.reverse(params);
      if (reversed !== false) {
        url = root ? root + reversed : reversed;
        return url;
      }
    }
    return false;
  };

  Router.prototype.reverseHandler = function(name, params, callback) {
    return callback(this.reverse(name, params));
  };

  Router.prototype.changeURL = function(url, options) {
    var navigateOptions;
    if (options == null) {
      options = {};
    }
    navigateOptions = {
      trigger: options.trigger === true,
      replace: options.replace === true
    };
    return Backbone.history.navigate(url, navigateOptions);
  };

  Router.prototype.changeURLHandler = function(url, options) {
    return this.changeURL(url, options);
  };

  Router.prototype.disposed = false;

  Router.prototype.dispose = function() {
    if (this.disposed) {
      return;
    }
    this.stopHistory();
    delete Backbone.history;
    this.unsubscribeAllEvents();
    this.disposed = true;
    return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
  };

  return Router;

})();

}});;require.define({'chaplin/lib/delayer': function(exports, require, module) {
'use strict';

var Delayer;

Delayer = {
  setTimeout: function(name, time, handler) {
    var handle, wrappedHandler, _ref,
      _this = this;
    if ((_ref = this.timeouts) == null) {
      this.timeouts = {};
    }
    this.clearTimeout(name);
    wrappedHandler = function() {
      delete _this.timeouts[name];
      return handler();
    };
    handle = setTimeout(wrappedHandler, time);
    this.timeouts[name] = handle;
    return handle;
  },
  clearTimeout: function(name) {
    if (!(this.timeouts && (this.timeouts[name] != null))) {
      return;
    }
    clearTimeout(this.timeouts[name]);
    delete this.timeouts[name];
  },
  clearAllTimeouts: function() {
    var handle, name, _ref;
    if (!this.timeouts) {
      return;
    }
    _ref = this.timeouts;
    for (name in _ref) {
      handle = _ref[name];
      this.clearTimeout(name);
    }
  },
  setInterval: function(name, time, handler) {
    var handle, _ref;
    this.clearInterval(name);
    if ((_ref = this.intervals) == null) {
      this.intervals = {};
    }
    handle = setInterval(handler, time);
    this.intervals[name] = handle;
    return handle;
  },
  clearInterval: function(name) {
    if (!(this.intervals && this.intervals[name])) {
      return;
    }
    clearInterval(this.intervals[name]);
    delete this.intervals[name];
  },
  clearAllIntervals: function() {
    var handle, name, _ref;
    if (!this.intervals) {
      return;
    }
    _ref = this.intervals;
    for (name in _ref) {
      handle = _ref[name];
      this.clearInterval(name);
    }
  },
  clearDelayed: function() {
    this.clearAllTimeouts();
    this.clearAllIntervals();
  }
};

if (typeof Object.freeze === "function") {
  Object.freeze(Delayer);
}

module.exports = Delayer;

}});;require.define({'chaplin/lib/event_broker': function(exports, require, module) {
'use strict';

var EventBroker, mediator,
  __slice = [].slice;

mediator = require('chaplin/mediator');

EventBroker = {
  subscribeEvent: function(type, handler) {
    if (typeof type !== 'string') {
      throw new TypeError('EventBroker#subscribeEvent: ' + 'type argument must be a string');
    }
    if (typeof handler !== 'function') {
      throw new TypeError('EventBroker#subscribeEvent: ' + 'handler argument must be a function');
    }
    mediator.unsubscribe(type, handler, this);
    return mediator.subscribe(type, handler, this);
  },
  unsubscribeEvent: function(type, handler) {
    if (typeof type !== 'string') {
      throw new TypeError('EventBroker#unsubscribeEvent: ' + 'type argument must be a string');
    }
    if (typeof handler !== 'function') {
      throw new TypeError('EventBroker#unsubscribeEvent: ' + 'handler argument must be a function');
    }
    return mediator.unsubscribe(type, handler);
  },
  unsubscribeAllEvents: function() {
    return mediator.unsubscribe(null, null, this);
  },
  publishEvent: function() {
    var args, type;
    type = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (typeof type !== 'string') {
      throw new TypeError('EventBroker#publishEvent: ' + 'type argument must be a string');
    }
    return mediator.publish.apply(mediator, [type].concat(__slice.call(args)));
  }
};

if (typeof Object.freeze === "function") {
  Object.freeze(EventBroker);
}

module.exports = EventBroker;

}});;require.define({'chaplin/lib/support': function(exports, require, module) {
'use strict';

var support;

support = {
  propertyDescriptors: (function() {
    var o;
    if (!(typeof Object.defineProperty === 'function' && typeof Object.defineProperties === 'function')) {
      return false;
    }
    try {
      o = {};
      Object.defineProperty(o, 'foo', {
        value: 'bar'
      });
      return o.foo === 'bar';
    } catch (error) {
      return false;
    }
  })()
};

module.exports = support;

}});;require.define({'chaplin/lib/composition': function(exports, require, module) {
'use strict';

var Backbone, Composition, EventBroker, _,
  __hasProp = {}.hasOwnProperty;

_ = require('underscore');

Backbone = require('backbone');

EventBroker = require('chaplin/lib/event_broker');

module.exports = Composition = (function() {

  Composition.extend = Backbone.Model.extend;

  _(Composition.prototype).extend(Backbone.Events);

  _(Composition.prototype).extend(EventBroker);

  Composition.prototype.item = null;

  Composition.prototype.options = null;

  Composition.prototype._stale = false;

  function Composition(options) {
    if (options != null) {
      this.options = _.clone(options);
    }
    this.item = this;
    this.initialize(this.options);
  }

  Composition.prototype.initialize = function() {};

  Composition.prototype.compose = function() {};

  Composition.prototype.check = function(options) {
    return _.isEqual(this.options, options);
  };

  Composition.prototype.stale = function(value) {
    var item, name;
    if (value == null) {
      return this._stale;
    }
    this._stale = value;
    for (name in this) {
      item = this[name];
      if (item && item !== this && _(item).has('stale')) {
        item.stale = value;
      }
    }
  };

  Composition.prototype.disposed = false;

  Composition.prototype.dispose = function() {
    var obj, prop, properties, _i, _len;
    if (this.disposed) {
      return;
    }
    for (prop in this) {
      if (!__hasProp.call(this, prop)) continue;
      obj = this[prop];
      if (obj && typeof obj.dispose === 'function') {
        if (obj !== this) {
          obj.dispose();
          delete this[prop];
        }
      }
    }
    this.unsubscribeAllEvents();
    this.stopListening();
    properties = ['redirected'];
    for (_i = 0, _len = properties.length; _i < _len; _i++) {
      prop = properties[_i];
      delete this[prop];
    }
    this.disposed = true;
    return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
  };

  return Composition;

})();

}});;require.define({'chaplin/lib/sync_machine': function(exports, require, module) {
'use strict';

var STATE_CHANGE, SYNCED, SYNCING, SyncMachine, UNSYNCED, event, _fn, _i, _len, _ref;

UNSYNCED = 'unsynced';

SYNCING = 'syncing';

SYNCED = 'synced';

STATE_CHANGE = 'syncStateChange';

SyncMachine = {
  _syncState: UNSYNCED,
  _previousSyncState: null,
  syncState: function() {
    return this._syncState;
  },
  isUnsynced: function() {
    return this._syncState === UNSYNCED;
  },
  isSynced: function() {
    return this._syncState === SYNCED;
  },
  isSyncing: function() {
    return this._syncState === SYNCING;
  },
  unsync: function() {
    var _ref;
    if ((_ref = this._syncState) === SYNCING || _ref === SYNCED) {
      this._previousSync = this._syncState;
      this._syncState = UNSYNCED;
      this.trigger(this._syncState, this, this._syncState);
      this.trigger(STATE_CHANGE, this, this._syncState);
    }
  },
  beginSync: function() {
    var _ref;
    if ((_ref = this._syncState) === UNSYNCED || _ref === SYNCED) {
      this._previousSync = this._syncState;
      this._syncState = SYNCING;
      this.trigger(this._syncState, this, this._syncState);
      this.trigger(STATE_CHANGE, this, this._syncState);
    }
  },
  finishSync: function() {
    if (this._syncState === SYNCING) {
      this._previousSync = this._syncState;
      this._syncState = SYNCED;
      this.trigger(this._syncState, this, this._syncState);
      this.trigger(STATE_CHANGE, this, this._syncState);
    }
  },
  abortSync: function() {
    if (this._syncState === SYNCING) {
      this._syncState = this._previousSync;
      this._previousSync = this._syncState;
      this.trigger(this._syncState, this, this._syncState);
      this.trigger(STATE_CHANGE, this, this._syncState);
    }
  }
};

_ref = [UNSYNCED, SYNCING, SYNCED, STATE_CHANGE];
_fn = function(event) {
  return SyncMachine[event] = function(callback, context) {
    if (context == null) {
      context = this;
    }
    this.on(event, callback, context);
    if (this._syncState === event) {
      return callback.call(context);
    }
  };
};
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  event = _ref[_i];
  _fn(event);
}

if (typeof Object.freeze === "function") {
  Object.freeze(SyncMachine);
}

module.exports = SyncMachine;

}});;require.define({'chaplin/lib/utils': function(exports, require, module) {
'use strict';

var support, utils, _,
  __slice = [].slice,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

_ = require('underscore');

support = require('chaplin/lib/support');

utils = {
  beget: (function() {
    var ctor;
    if (typeof Object.create === 'function') {
      return Object.create;
    } else {
      ctor = function() {};
      return function(obj) {
        ctor.prototype = obj;
        return new ctor;
      };
    }
  })(),
  serialize: function(data) {
    if (typeof data.serialize === 'function') {
      return data.serialize();
    } else if (typeof data.toJSON === 'function') {
      return data.toJSON();
    } else {
      throw new TypeError('utils.serialize: Unknown data was passed');
    }
  },
  readonly: (function() {
    var readonlyDescriptor;
    if (support.propertyDescriptors) {
      readonlyDescriptor = {
        writable: false,
        enumerable: true,
        configurable: false
      };
      return function() {
        var obj, prop, properties, _i, _len;
        obj = arguments[0], properties = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        for (_i = 0, _len = properties.length; _i < _len; _i++) {
          prop = properties[_i];
          readonlyDescriptor.value = obj[prop];
          Object.defineProperty(obj, prop, readonlyDescriptor);
        }
        return true;
      };
    } else {
      return function() {
        return false;
      };
    }
  })(),
  getPrototypeChain: function(object) {
    var chain, _ref;
    chain = [object.constructor.prototype];
    while (object = (_ref = object.constructor) != null ? _ref.__super__ : void 0) {
      chain.push(object);
    }
    return chain;
  },
  getAllPropertyVersions: function(object, property) {
    var proto, result, value, _i, _len, _ref;
    result = [];
    _ref = utils.getPrototypeChain(object);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      proto = _ref[_i];
      value = proto[property];
      if (value && __indexOf.call(result, value) < 0) {
        result.push(value);
      }
    }
    return result.reverse();
  },
  upcase: function(str) {
    return str.charAt(0).toUpperCase() + str.substring(1);
  },
  underscorize: function(string) {
    return string.replace(/[A-Z]/g, function(char, index) {
      return (index !== 0 ? '_' : '') + char.toLowerCase();
    });
  },
  escapeRegExp: function(str) {
    return String(str || '').replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
  },
  modifierKeyPressed: function(event) {
    return event.shiftKey || event.altKey || event.ctrlKey || event.metaKey;
  }
};

if (typeof Object.seal === "function") {
  Object.seal(utils);
}

module.exports = utils;

}});;require.define({'chaplin/lib/helpers': function(exports, require, module) {
'use strict';

var helpers, mediator;

mediator = require('chaplin/mediator');

helpers = {
  reverse: function(routeName, params) {
    var url;
    url = null;
    mediator.publish('!router:reverse', routeName, params, function(result) {
      if (result === false) {
        throw new Error('Chaplin.helpers.reverse: invalid route specified.');
      }
      return url = result;
    });
    return url;
  }
};

module.exports = helpers;

}});;require.define({'chaplin': function(exports, require, module) {

module.exports = {
  Application: require('chaplin/application'),
  mediator: require('chaplin/mediator'),
  Dispatcher: require('chaplin/dispatcher'),
  Controller: require('chaplin/controllers/controller'),
  Composer: require('chaplin/composer'),
  Composition: require('chaplin/lib/composition'),
  Collection: require('chaplin/models/collection'),
  Model: require('chaplin/models/model'),
  Layout: require('chaplin/views/layout'),
  View: require('chaplin/views/view'),
  CollectionView: require('chaplin/views/collection_view'),
  Route: require('chaplin/lib/route'),
  Router: require('chaplin/lib/router'),
  Delayer: require('chaplin/lib/delayer'),
  EventBroker: require('chaplin/lib/event_broker'),
  helpers: require('chaplin/lib/helpers'),
  support: require('chaplin/lib/support'),
  SyncMachine: require('chaplin/lib/sync_machine'),
  utils: require('chaplin/lib/utils')
};

}});;
(function(){function e(e,t){try{for(var n in t)Object.defineProperty(e.prototype,n,{value:t[n],enumerable:!1})}catch(r){e.prototype=t}}function t(e){var t=-1,n=e.length,r=[];while(++t<n)r.push(e[t]);return r}function n(e){return Array.prototype.slice.call(e)}function r(){}function i(e){return e}function s(){return this}function o(){return!0}function u(e){return typeof e=="function"?e:function(){return e}}function a(e,t,n){return function(){var r=n.apply(t,arguments);return arguments.length?e:r}}function f(e){return e!=null&&!isNaN(e)}function l(e){return e.length}function c(e){return e==null}function h(e){return e.trim().replace(/\s+/g," ")}function p(e){var t=1;while(e*t%1)t*=10;return t}function d(){}function v(e){function t(){var t=n,r=-1,i=t.length,s;while(++r<i)(s=t[r].on)&&s.apply(this,arguments);return e}var n=[],i=new r;return t.on=function(t,r){var s=i.get(t),o;return arguments.length<2?s&&s.on:(s&&(s.on=null,n=n.slice(0,o=n.indexOf(s)).concat(n.slice(o+1)),i.remove(t)),r&&n.push(i.set(t,{on:r})),e)},t}function m(e,t){return t-(e?1+Math.floor(Math.log(e+Math.pow(10,1+Math.floor(Math.log(e)/Math.LN10)-t))/Math.LN10):1)}function g(e){return e+""}function y(e){var t=e.lastIndexOf("."),n=t>=0?e.substring(t):(t=e.length,""),r=[];while(t>0)r.push(e.substring(t-=3,t+3));return r.reverse().join(",")+n}function b(e,t){var n=Math.pow(10,Math.abs(8-t)*3);return{scale:t>8?function(e){return e/n}:function(e){return e*n},symbol:e}}function w(e){return function(t){return t<=0?0:t>=1?1:e(t)}}function E(e){return function(t){return 1-e(1-t)}}function S(e){return function(t){return.5*(t<.5?e(2*t):2-e(2-2*t))}}function x(e){return e}function T(e){return function(t){return Math.pow(t,e)}}function N(e){return 1-Math.cos(e*Math.PI/2)}function C(e){return Math.pow(2,10*(e-1))}function k(e){return 1-Math.sqrt(1-e*e)}function L(e,t){var n;return arguments.length<2&&(t=.45),arguments.length<1?(e=1,n=t/4):n=t/(2*Math.PI)*Math.asin(1/e),function(r){return 1+e*Math.pow(2,10*-r)*Math.sin((r-n)*2*Math.PI/t)}}function A(e){return e||(e=1.70158),function(t){return t*t*((e+1)*t-e)}}function O(e){return e<1/2.75?7.5625*e*e:e<2/2.75?7.5625*(e-=1.5/2.75)*e+.75:e<2.5/2.75?7.5625*(e-=2.25/2.75)*e+.9375:7.5625*(e-=2.625/2.75)*e+.984375}function M(){d3.event.stopPropagation(),d3.event.preventDefault()}function _(){var e=d3.event,t;while(t=e.sourceEvent)e=t;return e}function D(e){var t=new d,n=0,r=arguments.length;while(++n<r)t[arguments[n]]=v(t);return t.of=function(n,r){return function(i){try{var s=i.sourceEvent=d3.event;i.target=e,d3.event=i,t[i.type].apply(n,r)}finally{d3.event=s}}},t}function P(e){var t=[e.a,e.b],n=[e.c,e.d],r=B(t),i=H(t,n),s=B(j(n,t,-i))||0;t[0]*n[1]<n[0]*t[1]&&(t[0]*=-1,t[1]*=-1,r*=-1,i*=-1),this.rotate=(r?Math.atan2(t[1],t[0]):Math.atan2(-n[0],n[1]))*ls,this.translate=[e.e,e.f],this.scale=[r,s],this.skew=s?Math.atan2(i,s)*ls:0}function H(e,t){return e[0]*t[0]+e[1]*t[1]}function B(e){var t=Math.sqrt(H(e,e));return t&&(e[0]/=t,e[1]/=t),t}function j(e,t,n){return e[0]+=n*t[0],e[1]+=n*t[1],e}function F(e){return e=="transform"?d3.interpolateTransform:d3.interpolate}function I(e,t){return t=t-(e=+e)?1/(t-e):0,function(n){return(n-e)*t}}function q(e,t){return t=t-(e=+e)?1/(t-e):0,function(n){return Math.max(0,Math.min(1,(n-e)*t))}}function R(){}function U(e,t,n){return new z(e,t,n)}function z(e,t,n){this.r=e,this.g=t,this.b=n}function W(e){return e<16?"0"+Math.max(0,e).toString(16):Math.min(255,e).toString(16)}function X(e,t,n){var r=0,i=0,s=0,o,u,a;o=/([a-z]+)\((.*)\)/i.exec(e);if(o){u=o[2].split(",");switch(o[1]){case"hsl":return n(parseFloat(u[0]),parseFloat(u[1])/100,parseFloat(u[2])/100);case"rgb":return t(K(u[0]),K(u[1]),K(u[2]))}}return(a=ds.get(e))?t(a.r,a.g,a.b):(e!=null&&e.charAt(0)==="#"&&(e.length===4?(r=e.charAt(1),r+=r,i=e.charAt(2),i+=i,s=e.charAt(3),s+=s):e.length===7&&(r=e.substring(1,3),i=e.substring(3,5),s=e.substring(5,7)),r=parseInt(r,16),i=parseInt(i,16),s=parseInt(s,16)),t(r,i,s))}function V(e,t,n){var r=Math.min(e/=255,t/=255,n/=255),i=Math.max(e,t,n),s=i-r,o,u,a=(i+r)/2;return s?(u=a<.5?s/(i+r):s/(2-i-r),e==i?o=(t-n)/s+(t<n?6:0):t==i?o=(n-e)/s+2:o=(e-t)/s+4,o*=60):u=o=0,Q(o,u,a)}function $(e,t,n){e=J(e),t=J(t),n=J(n);var r=ut((.4124564*e+.3575761*t+.1804375*n)/ys),i=ut((.2126729*e+.7151522*t+.072175*n)/bs),s=ut((.0193339*e+.119192*t+.9503041*n)/ws);return nt(116*i-16,500*(r-i),200*(i-s))}function J(e){return(e/=255)<=.04045?e/12.92:Math.pow((e+.055)/1.055,2.4)}function K(e){var t=parseFloat(e);return e.charAt(e.length-1)==="%"?Math.round(t*2.55):t}function Q(e,t,n){return new G(e,t,n)}function G(e,t,n){this.h=e,this.s=t,this.l=n}function Y(e,t,n){function r(e){return e>360?e-=360:e<0&&(e+=360),e<60?s+(o-s)*e/60:e<180?o:e<240?s+(o-s)*(240-e)/60:s}function i(e){return Math.round(r(e)*255)}var s,o;return e%=360,e<0&&(e+=360),t=t<0?0:t>1?1:t,n=n<0?0:n>1?1:n,o=n<=.5?n*(1+t):n+t-n*t,s=2*n-o,U(i(e+120),i(e),i(e-120))}function Z(e,t,n){return new et(e,t,n)}function et(e,t,n){this.h=e,this.c=t,this.l=n}function tt(e,t,n){return nt(n,Math.cos(e*=Math.PI/180)*t,Math.sin(e)*t)}function nt(e,t,n){return new rt(e,t,n)}function rt(e,t,n){this.l=e,this.a=t,this.b=n}function it(e,t,n){var r=(e+16)/116,i=r+t/500,s=r-n/200;return i=ot(i)*ys,r=ot(r)*bs,s=ot(s)*ws,U(at(3.2404542*i-1.5371385*r-.4985314*s),at(-0.969266*i+1.8760108*r+.041556*s),at(.0556434*i-.2040259*r+1.0572252*s))}function st(e,t,n){return Z(Math.atan2(n,t)/Math.PI*180,Math.sqrt(t*t+n*n),e)}function ot(e){return e>.206893034?e*e*e:(e-4/29)/7.787037}function ut(e){return e>.008856?Math.pow(e,1/3):7.787037*e+4/29}function at(e){return Math.round(255*(e<=.00304?12.92*e:1.055*Math.pow(e,1/2.4)-.055))}function ft(e){return Qi(e,ks),e}function lt(e){return function(){return Ss(e,this)}}function ct(e){return function(){return xs(e,this)}}function ht(e,t){function n(){this.removeAttribute(e)}function r(){this.removeAttributeNS(e.space,e.local)}function i(){this.setAttribute(e,t)}function s(){this.setAttributeNS(e.space,e.local,t)}function o(){var n=t.apply(this,arguments);n==null?this.removeAttribute(e):this.setAttribute(e,n)}function u(){var n=t.apply(this,arguments);n==null?this.removeAttributeNS(e.space,e.local):this.setAttributeNS(e.space,e.local,n)}return e=d3.ns.qualify(e),t==null?e.local?r:n:typeof t=="function"?e.local?u:o:e.local?s:i}function pt(e){return new RegExp("(?:^|\\s+)"+d3.requote(e)+"(?:\\s+|$)","g")}function dt(e,t){function n(){var n=-1;while(++n<i)e[n](this,t)}function r(){var n=-1,r=t.apply(this,arguments);while(++n<i)e[n](this,r)}e=e.trim().split(/\s+/).map(vt);var i=e.length;return typeof t=="function"?r:n}function vt(e){var t=pt(e);return function(n,r){if(i=n.classList)return r?i.add(e):i.remove(e);var i=n.className,s=i.baseVal!=null,o=s?i.baseVal:i;r?(t.lastIndex=0,t.test(o)||(o=h(o+" "+e),s?i.baseVal=o:n.className=o)):o&&(o=h(o.replace(t," ")),s?i.baseVal=o:n.className=o)}}function mt(e,t,n){function r(){this.style.removeProperty(e)}function i(){this.style.setProperty(e,t,n)}function s(){var r=t.apply(this,arguments);r==null?this.style.removeProperty(e):this.style.setProperty(e,r,n)}return t==null?r:typeof t=="function"?s:i}function gt(e,t){function n(){delete this[e]}function r(){this[e]=t}function i(){var n=t.apply(this,arguments);n==null?delete this[e]:this[e]=n}return t==null?n:typeof t=="function"?i:r}function yt(e){return{__data__:e}}function bt(e){return function(){return Cs(this,e)}}function wt(e){return arguments.length||(e=d3.ascending),function(t,n){return e(t&&t.__data__,n&&n.__data__)}}function Et(e,t,n){function r(){var t=this[s];t&&(this.removeEventListener(e,t,t.$),delete this[s])}function i(){function i(e){var n=d3.event;d3.event=e,u[0]=o.__data__;try{t.apply(o,u)}finally{d3.event=n}}var o=this,u=arguments;r.call(this),this.addEventListener(e,this[s]=i,i.$=n),i._=t}var s="__on"+e,o=e.indexOf(".");return o>0&&(e=e.substring(0,o)),t?i:r}function St(e,t){for(var n=0,r=e.length;n<r;n++)for(var i=e[n],s=0,o=i.length,u;s<o;s++)(u=i[s])&&t(u,s,n);return e}function xt(e){return Qi(e,As),e}function Tt(e,t,n){Qi(e,Os);var i=new r,s=d3.dispatch("start","end"),o=Fs;return e.id=t,e.time=n,e.tween=function(t,n){return arguments.length<2?i.get(t):(n==null?i.remove(t):i.set(t,n),e)},e.ease=function(t){return arguments.length?(o=typeof t=="function"?t:d3.ease.apply(d3,arguments),e):o},e.each=function(t,n){return arguments.length<2?Nt.call(e,t):(s.on(t,n),e)},d3.timer(function(r){return St(e,function(e,u,a){function f(r){return v.active>t?c():(v.active=t,i.forEach(function(t,n){(n=n.call(e,m,u))&&h.push(n)}),s.start.call(e,m,u),l(r)||d3.timer(l,0,n),1)}function l(n){if(v.active!==t)return c();var r=(n-p)/d,i=o(r),a=h.length;while(a>0)h[--a].call(e,i);if(r>=1)return c(),_s=t,s.end.call(e,m,u),_s=0,1}function c(){return--v.count||delete e.__transition__,1}var h=[],p=e.delay,d=e.duration,v=(e=e.node).__transition__||(e.__transition__={active:0,count:0}),m=e.__data__;++v.count,p<=r?f(r):d3.timer(f,p,n)})},0,n),e}function Nt(e){var t=_s,n=Fs,r=Bs,i=js;return _s=this.id,Fs=this.ease(),St(this,function(t,n,r){Bs=t.delay,js=t.duration,e.call(t=t.node,t.__data__,n,r)}),_s=t,Fs=n,Bs=r,js=i,this}function Ct(e,t,n){return n!=""&&Is}function kt(e,t){return d3.tween(e,F(t))}function Lt(){var e,t=Date.now(),n=Us;while(n)e=t-n.then,e>=n.delay&&(n.flush=n.callback(e)),n=n.next;var r=At()-t;r>24?(isFinite(r)&&(clearTimeout(Ws),Ws=setTimeout(Lt,r)),zs=0):(zs=1,Xs(Lt))}function At(){var e=null,t=Us,n=Infinity;while(t)t.flush?(delete Rs[t.callback.id],t=e?e.next=t.next:Us=t.next):(n=Math.min(n,t.then+t.delay),t=(e=t).next);return n}function Ot(e,t){var n=e.ownerSVGElement||e;if(n.createSVGPoint){var r=n.createSVGPoint();if(Vs<0&&(window.scrollX||window.scrollY)){n=d3.select(document.body).append("svg").style("position","absolute").style("top",0).style("left",0);var i=n[0][0].getScreenCTM();Vs=!i.f&&!i.e,n.remove()}return Vs?(r.x=t.pageX,r.y=t.pageY):(r.x=t.clientX,r.y=t.clientY),r=r.matrixTransform(e.getScreenCTM().inverse()),[r.x,r.y]}var s=e.getBoundingClientRect();return[t.clientX-s.left-e.clientLeft,t.clientY-s.top-e.clientTop]}function Mt(){}function _t(e){var t=e[0],n=e[e.length-1];return t<n?[t,n]:[n,t]}function Dt(e){return e.rangeExtent?e.rangeExtent():_t(e.range())}function Pt(e,t){var n=0,r=e.length-1,i=e[n],s=e[r],o;s<i&&(o=n,n=r,r=o,o=i,i=s,s=o);if(t=t(s-i))e[n]=t.floor(i),e[r]=t.ceil(s);return e}function Ht(){return Math}function Bt(e,t,n,r){function i(){var i=Math.min(e.length,t.length)>2?zt:Ut,a=r?q:I;return o=i(e,t,a,n),u=i(t,e,a,d3.interpolate),s}function s(e){return o(e)}var o,u;return s.invert=function(e){return u(e)},s.domain=function(t){return arguments.length?(e=t.map(Number),i()):e},s.range=function(e){return arguments.length?(t=e,i()):t},s.rangeRound=function(e){return s.range(e).interpolate(d3.interpolateRound)},s.clamp=function(e){return arguments.length?(r=e,i()):r},s.interpolate=function(e){return arguments.length?(n=e,i()):n},s.ticks=function(t){return qt(e,t)},s.tickFormat=function(t){return Rt(e,t)},s.nice=function(){return Pt(e,Ft),i()},s.copy=function(){return Bt(e,t,n,r)},i()}function jt(e,t){return d3.rebind(e,t,"range","rangeRound","interpolate","clamp")}function Ft(e){return e=Math.pow(10,Math.round(Math.log(e)/Math.LN10)-1),e&&{floor:function(t){return Math.floor(t/e)*e},ceil:function(t){return Math.ceil(t/e)*e}}}function It(e,t){var n=_t(e),r=n[1]-n[0],i=Math.pow(10,Math.floor(Math.log(r/t)/Math.LN10)),s=t/r*i;return s<=.15?i*=10:s<=.35?i*=5:s<=.75&&(i*=2),n[0]=Math.ceil(n[0]/i)*i,n[1]=Math.floor(n[1]/i)*i+i*.5,n[2]=i,n}function qt(e,t){return d3.range.apply(d3,It(e,t))}function Rt(e,t){return d3.format(",."+Math.max(0,-Math.floor(Math.log(It(e,t)[2])/Math.LN10+.01))+"f")}function Ut(e,t,n,r){var i=n(e[0],e[1]),s=r(t[0],t[1]);return function(e){return s(i(e))}}function zt(e,t,n,r){var i=[],s=[],o=0,u=Math.min(e.length,t.length)-1;e[u]<e[0]&&(e=e.slice().reverse(),t=t.slice().reverse());while(++o<=u)i.push(n(e[o-1],e[o])),s.push(r(t[o-1],t[o]));return function(t){var n=d3.bisect(e,t,1,u)-1;return s[n](i[n](t))}}function Wt(e,t){function n(n){return e(t(n))}var r=t.pow;return n.invert=function(t){return r(e.invert(t))},n.domain=function(i){return arguments.length?(t=i[0]<0?Vt:Xt,r=t.pow,e.domain(i.map(t)),n):e.domain().map(r)},n.nice=function(){return e.domain(Pt(e.domain(),Ht)),n},n.ticks=function(){var n=_t(e.domain()),i=[];if(n.every(isFinite)){var s=Math.floor(n[0]),o=Math.ceil(n[1]),u=r(n[0]),a=r(n[1]);if(t===Vt){i.push(r(s));for(;s++<o;)for(var f=9;f>0;f--)i.push(r(s)*f)}else{for(;s<o;s++)for(var f=1;f<10;f++)i.push(r(s)*f);i.push(r(s))}for(s=0;i[s]<u;s++);for(o=i.length;i[o-1]>a;o--);i=i.slice(s,o)}return i},n.tickFormat=function(e,i){arguments.length<2&&(i=$s);if(arguments.length<1)return i;var s=Math.max(.1,e/n.ticks().length),o=t===Vt?(u=-1e-12,Math.floor):(u=1e-12,Math.ceil),u;return function(e){return e/r(o(t(e)+u))<=s?i(e):""}},n.copy=function(){return Wt(e.copy(),t)},jt(n,e)}function Xt(e){return Math.log(e<0?0:e)/Math.LN10}function Vt(e){return-Math.log(e>0?0:-e)/Math.LN10}function $t(e,t){function n(t){return e(r(t))}var r=Jt(t),i=Jt(1/t);return n.invert=function(t){return i(e.invert(t))},n.domain=function(t){return arguments.length?(e.domain(t.map(r)),n):e.domain().map(i)},n.ticks=function(e){return qt(n.domain(),e)},n.tickFormat=function(e){return Rt(n.domain(),e)},n.nice=function(){return n.domain(Pt(n.domain(),Ft))},n.exponent=function(e){if(!arguments.length)return t;var s=n.domain();return r=Jt(t=e),i=Jt(1/t),n.domain(s)},n.copy=function(){return $t(e.copy(),t)},jt(n,e)}function Jt(e){return function(t){return t<0?-Math.pow(-t,e):Math.pow(t,e)}}function Kt(e,t){function n(t){return o[((s.get(t)||s.set(t,e.push(t)))-1)%o.length]}function i(t,n){return d3.range(e.length).map(function(e){return t+n*e})}var s,o,u;return n.domain=function(i){if(!arguments.length)return e;e=[],s=new r;var o=-1,u=i.length,a;while(++o<u)s.has(a=i[o])||s.set(a,e.push(a));return n[t.t].apply(n,t.a)},n.range=function(e){return arguments.length?(o=e,u=0,t={t:"range",a:arguments},n):o},n.rangePoints=function(r,s){arguments.length<2&&(s=0);var a=r[0],f=r[1],l=(f-a)/(Math.max(1,e.length-1)+s);return o=i(e.length<2?(a+f)/2:a+l*s/2,l),u=0,t={t:"rangePoints",a:arguments},n},n.rangeBands=function(r,s,a){arguments.length<2&&(s=0),arguments.length<3&&(a=s);var f=r[1]<r[0],l=r[f-0],c=r[1-f],h=(c-l)/(e.length-s+2*a);return o=i(l+h*a,h),f&&o.reverse(),u=h*(1-s),t={t:"rangeBands",a:arguments},n},n.rangeRoundBands=function(r,s,a){arguments.length<2&&(s=0),arguments.length<3&&(a=s);var f=r[1]<r[0],l=r[f-0],c=r[1-f],h=Math.floor((c-l)/(e.length-s+2*a)),p=c-l-(e.length-s)*h;return o=i(l+Math.round(p/2),h),f&&o.reverse(),u=Math.round(h*(1-s)),t={t:"rangeRoundBands",a:arguments},n},n.rangeBand=function(){return u},n.rangeExtent=function(){return _t(t.a[0])},n.copy=function(){return Kt(e,t)},n.domain(e)}function Qt(e,t){function n(){var n=0,s=e.length,o=t.length;i=[];while(++n<o)i[n-1]=d3.quantile(e,n/o);return r}function r(e){return isNaN(e=+e)?NaN:t[d3.bisect(i,e)]}var i;return r.domain=function(t){return arguments.length?(e=t.filter(function(e){return!isNaN(e)}).sort(d3.ascending),n()):e},r.range=function(e){return arguments.length?(t=e,n()):t},r.quantiles=function(){return i},r.copy=function(){return Qt(e,t)},n()}function Gt(e,t,n){function r(t){return n[Math.max(0,Math.min(o,Math.floor(s*(t-e))))]}function i(){return s=n.length/(t-e),o=n.length-1,r}var s,o;return r.domain=function(n){return arguments.length?(e=+n[0],t=+n[n.length-1],i()):[e,t]},r.range=function(e){return arguments.length?(n=e,i()):n},r.copy=function(){return Gt(e,t,n)},i()}function Yt(e,t){function n(n){return t[d3.bisect(e,n)]}return n.domain=function(t){return arguments.length?(e=t,n):e},n.range=function(e){return arguments.length?(t=e,n):t},n.copy=function(){return Yt(e,t)},n}function Zt(e){function t(e){return+e}return t.invert=t,t.domain=t.range=function(n){return arguments.length?(e=n.map(t),t):e},t.ticks=function(t){return qt(e,t)},t.tickFormat=function(t){return Rt(e,t)},t.copy=function(){return Zt(e)},t}function en(e){return e.innerRadius}function tn(e){return e.outerRadius}function nn(e){return e.startAngle}function rn(e){return e.endAngle}function sn(e){function t(t){function o(){a.push("M",s(e(l),f))}var a=[],l=[],c=-1,h=t.length,p,d=u(n),v=u(r);while(++c<h)i.call(this,p=t[c],c)?l.push([+d.call(this,p,c),+v.call(this,p,c)]):l.length&&(o(),l=[]);return l.length&&o(),a.length?a.join(""):null}var n=on,r=un,i=o,s=an,a=s.key,f=.7;return t.x=function(e){return arguments.length?(n=e,t):n},t.y=function(e){return arguments.length?(r=e,t):r},t.defined=function(e){return arguments.length?(i=e,t):i},t.interpolate=function(e){return arguments.length?(typeof e=="function"?a=s=e:a=(s=eo.get(e)||an).key,t):a},t.tension=function(e){return arguments.length?(f=e,t):f},t}function on(e){return e[0]}function un(e){return e[1]}function an(e){return e.join("L")}function fn(e){return an(e)+"Z"}function ln(e){var t=0,n=e.length,r=e[0],i=[r[0],",",r[1]];while(++t<n)i.push("V",(r=e[t])[1],"H",r[0]);return i.join("")}function cn(e){var t=0,n=e.length,r=e[0],i=[r[0],",",r[1]];while(++t<n)i.push("H",(r=e[t])[0],"V",r[1]);return i.join("")}function hn(e,t){return e.length<4?an(e):e[1]+vn(e.slice(1,e.length-1),mn(e,t))}function pn(e,t){return e.length<3?an(e):e[0]+vn((e.push(e[0]),e),mn([e[e.length-2]].concat(e,[e[1]]),t))}function dn(e,t,n){return e.length<3?an(e):e[0]+vn(e,mn(e,t))}function vn(e,t){if(t.length<1||e.length!=t.length&&e.length!=t.length+2)return an(e);var n=e.length!=t.length,r="",i=e[0],s=e[1],o=t[0],u=o,a=1;n&&(r+="Q"+(s[0]-o[0]*2/3)+","+(s[1]-o[1]*2/3)+","+s[0]+","+s[1],i=e[1],a=2);if(t.length>1){u=t[1],s=e[a],a++,r+="C"+(i[0]+o[0])+","+(i[1]+o[1])+","+(s[0]-u[0])+","+(s[1]-u[1])+","+s[0]+","+s[1];for(var f=2;f<t.length;f++,a++)s=e[a],u=t[f],r+="S"+(s[0]-u[0])+","+(s[1]-u[1])+","+s[0]+","+s[1]}if(n){var l=e[a];r+="Q"+(s[0]+u[0]*2/3)+","+(s[1]+u[1]*2/3)+","+l[0]+","+l[1]}return r}function mn(e,t){var n=[],r=(1-t)/2,i,s=e[0],o=e[1],u=1,a=e.length;while(++u<a)i=s,s=o,o=e[u],n.push([r*(o[0]-i[0]),r*(o[1]-i[1])]);return n}function gn(e){if(e.length<3)return an(e);var t=1,n=e.length,r=e[0],i=r[0],s=r[1],o=[i,i,i,(r=e[1])[0]],u=[s,s,s,r[1]],a=[i,",",s];Sn(a,o,u);while(++t<n)r=e[t],o.shift(),o.push(r[0]),u.shift(),u.push(r[1]),Sn(a,o,u);t=-1;while(++t<2)o.shift(),o.push(r[0]),u.shift(),u.push(r[1]),Sn(a,o,u);return a.join("")}function yn(e){if(e.length<4)return an(e);var t=[],n=-1,r=e.length,i,s=[0],o=[0];while(++n<3)i=e[n],s.push(i[0]),o.push(i[1]);t.push(En(ro,s)+","+En(ro,o)),--n;while(++n<r)i=e[n],s.shift(),s.push(i[0]),o.shift(),o.push(i[1]),Sn(t,s,o);return t.join("")}function bn(e){var t,n=-1,r=e.length,i=r+4,s,o=[],u=[];while(++n<4)s=e[n%r],o.push(s[0]),u.push(s[1]);t=[En(ro,o),",",En(ro,u)],--n;while(++n<i)s=e[n%r],o.shift(),o.push(s[0]),u.shift(),u.push(s[1]),Sn(t,o,u);return t.join("")}function wn(e,t){var n=e.length-1;if(n){var r=e[0][0],i=e[0][1],s=e[n][0]-r,o=e[n][1]-i,u=-1,a,f;while(++u<=n)a=e[u],f=u/n,a[0]=t*a[0]+(1-t)*(r+f*s),a[1]=t*a[1]+(1-t)*(i+f*o)}return gn(e)}function En(e,t){return e[0]*t[0]+e[1]*t[1]+e[2]*t[2]+e[3]*t[3]}function Sn(e,t,n){e.push("C",En(to,t),",",En(to,n),",",En(no,t),",",En(no,n),",",En(ro,t),",",En(ro,n))}function xn(e,t){return(t[1]-e[1])/(t[0]-e[0])}function Tn(e){var t=0,n=e.length-1,r=[],i=e[0],s=e[1],o=r[0]=xn(i,s);while(++t<n)r[t]=(o+(o=xn(i=s,s=e[t+1])))/2;return r[t]=o,r}function Nn(e){var t=[],n,r,i,s,o=Tn(e),u=-1,a=e.length-1;while(++u<a)n=xn(e[u],e[u+1]),Math.abs(n)<1e-6?o[u]=o[u+1]=0:(r=o[u]/n,i=o[u+1]/n,s=r*r+i*i,s>9&&(s=n*3/Math.sqrt(s),o[u]=s*r,o[u+1]=s*i));u=-1;while(++u<=a)s=(e[Math.min(a,u+1)][0]-e[Math.max(0,u-1)][0])/(6*(1+o[u]*o[u])),t.push([s||0,o[u]*s||0]);return t}function Cn(e){return e.length<3?an(e):e[0]+vn(e,Nn(e))}function kn(e){var t,n=-1,r=e.length,i,s;while(++n<r)t=e[n],i=t[0],s=t[1]+Ys,t[0]=i*Math.cos(s),t[1]=i*Math.sin(s);return e}function Ln(e){function t(t){function o(){l.push("M",f(e(v),p),h,c(e(d.reverse()),p),"Z")}var l=[],d=[],v=[],m=-1,g=t.length,y,b=u(n),w=u(i),E=n===r?function(){return x}:u(r),S=i===s?function(){return T}:u(s),x,T;while(++m<g)a.call(this,y=t[m],m)?(d.push([x=+b.call(this,y,m),T=+w.call(this,y,m)]),v.push([+E.call(this,y,m),+S.call(this,y,m)])):d.length&&(o(),d=[],v=[]);return d.length&&o(),l.length?l.join(""):null}var n=on,r=on,i=0,s=un,a=o,f=an,l=f.key,c=f,h="L",p=.7;return t.x=function(e){return arguments.length?(n=r=e,t):r},t.x0=function(e){return arguments.length?(n=e,t):n},t.x1=function(e){return arguments.length?(r=e,t):r},t.y=function(e){return arguments.length?(i=s=e,t):s},t.y0=function(e){return arguments.length?(i=e,t):i},t.y1=function(e){return arguments.length?(s=e,t):s},t.defined=function(e){return arguments.length?(a=e,t):a},t.interpolate=function(e){return arguments.length?(typeof e=="function"?l=f=e:l=(f=eo.get(e)||an).key,c=f.reverse||f,h=f.closed?"M":"L",t):l},t.tension=function(e){return arguments.length?(p=e,t):p},t}function An(e){return e.source}function On(e){return e.target}function Mn(e){return e.radius}function _n(e){return e.startAngle}function Dn(e){return e.endAngle}function Pn(e){return[e.x,e.y]}function Hn(e){return function(){var t=e.apply(this,arguments),n=t[0],r=t[1]+Ys;return[n*Math.cos(r),n*Math.sin(r)]}}function Bn(){return 64}function jn(){return"circle"}function Fn(e){var t=Math.sqrt(e/Math.PI);return"M0,"+t+"A"+t+","+t+" 0 1,1 0,"+ -t+"A"+t+","+t+" 0 1,1 0,"+t+"Z"}function In(e,t){e.attr("transform",function(e){return"translate("+t(e)+",0)"})}function qn(e,t){e.attr("transform",function(e){return"translate(0,"+t(e)+")"})}function Rn(e,t,n){i=[];if(n&&t.length>1){var r=_t(e.domain()),i,s=-1,o=t.length,u=(t[1]-t[0])/++n,a,f;while(++s<o)for(a=n;--a>0;)(f=+t[s]-a*u)>=r[0]&&i.push(f);for(--s,a=0;++a<n&&(f=+t[s]+a*u)<r[1];)i.push(f)}return i}function Un(){fo||(fo=d3.select("body").append("div").style("visibility","hidden").style("top",0).style("height",0).style("width",0).style("overflow-y","scroll").append("div").style("height","2000px").node().parentNode);var e=d3.event,t;try{fo.scrollTop=1e3,fo.dispatchEvent(e),t=1e3-fo.scrollTop}catch(n){t=e.wheelDelta||-e.detail*5}return t}function zn(e){var t=e.source,n=e.target,r=Xn(t,n),i=[t];while(t!==r)t=t.parent,i.push(t);var s=i.length;while(n!==r)i.splice(s,0,n),n=n.parent;return i}function Wn(e){var t=[],n=e.parent;while(n!=null)t.push(e),e=n,n=n.parent;return t.push(e),t}function Xn(e,t){if(e===t)return e;var n=Wn(e),r=Wn(t),i=n.pop(),s=r.pop(),o=null;while(i===s)o=i,i=n.pop(),s=r.pop();return o}function Vn(e){e.fixed|=2}function $n(e){e.fixed&=1}function Jn(e){e.fixed|=4}function Kn(e){e.fixed&=3}function Qn(e,t,n){var r=0,i=0;e.charge=0;if(!e.leaf){var s=e.nodes,o=s.length,u=-1,a;while(++u<o){a=s[u];if(a==null)continue;Qn(a,t,n),e.charge+=a.charge,r+=a.charge*a.cx,i+=a.charge*a.cy}}if(e.point){e.leaf||(e.point.x+=Math.random()-.5,e.point.y+=Math.random()-.5);var f=t*n[e.point.index];e.charge+=e.pointCharge=f,r+=f*e.point.x,i+=f*e.point.y}e.cx=r/e.charge,e.cy=i/e.charge}function Gn(e){return 20}function Yn(e){return 1}function Zn(e){return e.x}function er(e){return e.y}function tr(e,t,n){e.y0=t,e.y=n}function nr(e){return d3.range(e.length)}function rr(e){var t=-1,n=e[0].length,r=[];while(++t<n)r[t]=0;return r}function ir(e){var t=1,n=0,r=e[0][1],i,s=e.length;for(;t<s;++t)(i=e[t][1])>r&&(n=t,r=i);return n}function sr(e){return e.reduce(or,0)}function or(e,t){return e+t[1]}function ur(e,t){return ar(e,Math.ceil(Math.log(t.length)/Math.LN2+1))}function ar(e,t){var n=-1,r=+e[0],i=(e[1]-r)/t,s=[];while(++n<=t)s[n]=i*n+r;return s}function fr(e){return[d3.min(e),d3.max(e)]}function lr(e,t){return d3.rebind(e,t,"sort","children","value"),e.links=dr,e.nodes=function(t){return vo=!0,(e.nodes=e)(t)},e}function cr(e){return e.children}function hr(e){return e.value}function pr(e,t){return t.value-e.value}function dr(e){return d3.merge(e.map(function(e){return(e.children||[]).map(function(t){return{source:e,target:t}})}))}function vr(e,t){return e.value-t.value}function mr(e,t){var n=e._pack_next;e._pack_next=t,t._pack_prev=e,t._pack_next=n,n._pack_prev=t}function gr(e,t){e._pack_next=t,t._pack_prev=e}function yr(e,t){var n=t.x-e.x,r=t.y-e.y,i=e.r+t.r;return i*i-n*n-r*r>.001}function br(e){function t(e){r=Math.min(e.x-e.r,r),i=Math.max(e.x+e.r,i),s=Math.min(e.y-e.r,s),o=Math.max(e.y+e.r,o)}if(!(n=e.children)||!(p=n.length))return;var n,r=Infinity,i=-Infinity,s=Infinity,o=-Infinity,u,a,f,l,c,h,p;n.forEach(wr),u=n[0],u.x=-u.r,u.y=0,t(u);if(p>1){a=n[1],a.x=a.r,a.y=0,t(a);if(p>2){f=n[2],xr(u,a,f),t(f),mr(u,f),u._pack_prev=f,mr(f,a),a=u._pack_next;for(l=3;l<p;l++){xr(u,a,f=n[l]);var d=0,v=1,m=1;for(c=a._pack_next;c!==a;c=c._pack_next,v++)if(yr(c,f)){d=1;break}if(d==1)for(h=u._pack_prev;h!==c._pack_prev;h=h._pack_prev,m++)if(yr(h,f))break;d?(v<m||v==m&&a.r<u.r?gr(u,a=c):gr(u=h,a),l--):(mr(u,f),a=f,t(f))}}}var g=(r+i)/2,y=(s+o)/2,b=0;for(l=0;l<p;l++)f=n[l],f.x-=g,f.y-=y,b=Math.max(b,f.r+Math.sqrt(f.x*f.x+f.y*f.y));e.r=b,n.forEach(Er)}function wr(e){e._pack_next=e._pack_prev=e}function Er(e){delete e._pack_next,delete e._pack_prev}function Sr(e,t,n,r){var i=e.children;e.x=t+=r*e.x,e.y=n+=r*e.y,e.r*=r;if(i){var s=-1,o=i.length;while(++s<o)Sr(i[s],t,n,r)}}function xr(e,t,n){var r=e.r+n.r,i=t.x-e.x,s=t.y-e.y;if(r&&(i||s)){var o=t.r+n.r,u=i*i+s*s;o*=o,r*=r;var a=.5+(r-o)/(2*u),f=Math.sqrt(Math.max(0,2*o*(r+u)-(r-=u)*r-o*o))/(2*u);n.x=e.x+a*i+f*s,n.y=e.y+a*s-f*i}else n.x=e.x+r,n.y=e.y}function Tr(e){return 1+d3.max(e,function(e){return e.y})}function Nr(e){return e.reduce(function(e,t){return e+t.x},0)/e.length}function Cr(e){var t=e.children;return t&&t.length?Cr(t[0]):e}function kr(e){var t=e.children,n;return t&&(n=t.length)?kr(t[n-1]):e}function Lr(e,t){return e.parent==t.parent?1:2}function Ar(e){var t=e.children;return t&&t.length?t[0]:e._tree.thread}function Or(e){var t=e.children,n;return t&&(n=t.length)?t[n-1]:e._tree.thread}function Mr(e,t){var n=e.children;if(n&&(i=n.length)){var r,i,s=-1;while(++s<i)t(r=Mr(n[s],t),e)>0&&(e=r)}return e}function _r(e,t){return e.x-t.x}function Dr(e,t){return t.x-e.x}function Pr(e,t){return e.depth-t.depth}function Hr(e,t){function n(e,r){var i=e.children;if(i&&(a=i.length)){var s,o=null,u=-1,a;while(++u<a)s=i[u],n(s,o),o=s}t(e,r)}n(e,null)}function Br(e){var t=0,n=0,r=e.children,i=r.length,s;while(--i>=0)s=r[i]._tree,s.prelim+=t,s.mod+=t,t+=s.shift+(n+=s.change)}function jr(e,t,n){e=e._tree,t=t._tree;var r=n/(t.number-e.number);e.change+=r,t.change-=r,t.shift+=n,t.prelim+=n,t.mod+=n}function Fr(e,t,n){return e._tree.ancestor.parent==t.parent?e._tree.ancestor:n}function Ir(e){return{x:e.x,y:e.y,dx:e.dx,dy:e.dy}}function qr(e,t){var n=e.x+t[3],r=e.y+t[0],i=e.dx-t[1]-t[3],s=e.dy-t[0]-t[2];return i<0&&(n+=i/2,i=0),s<0&&(r+=s/2,s=0),{x:n,y:r,dx:i,dy:s}}function Rr(e,t){function n(e,r){d3.text(e,t,function(e){r(e&&n.parse(e))})}function r(t){return t.map(i).join(e)}function i(e){return o.test(e)?'"'+e.replace(/\"/g,'""')+'"':e}var s=new RegExp("\r\n|["+e+"\r\n]","g"),o=new RegExp('["'+e+"\n]"),u=e.charCodeAt(0);return n.parse=function(e){var t;return n.parseRows(e,function(e,n){if(n){var r={},i=-1,s=t.length;while(++i<s)r[t[i]]=e[i];return r}return t=e,null})},n.parseRows=function(e,t){function n(){if(s.lastIndex>=e.length)return i;if(l)return l=!1,r;var t=s.lastIndex;if(e.charCodeAt(t)===34){var n=t;while(n++<e.length)if(e.charCodeAt(n)===34){if(e.charCodeAt(n+1)!==34)break;n++}s.lastIndex=n+2;var o=e.charCodeAt(n+1);return o===13?(l=!0,e.charCodeAt(n+2)===10&&s.lastIndex++):o===10&&(l=!0),e.substring(t+1,n).replace(/""/g,'"')}var a=s.exec(e);return a?(l=a[0].charCodeAt(0)!==u,e.substring(t,a.index)):(s.lastIndex=e.length,e.substring(t))}var r={},i={},o=[],a=0,f,l;s.lastIndex=0;while((f=n())!==i){var c=[];while(f!==r&&f!==i)c.push(f),f=n();if(t&&!(c=t(c,a++)))continue;o.push(c)}return o},n.format=function(e){return e.map(r).join("\n")},n}function Ur(e,t){return function(n){return n&&e.hasOwnProperty(n.type)?e[n.type](n):t}}function zr(e){return"m0,"+e+"a"+e+","+e+" 0 1,1 0,"+ -2*e+"a"+e+","+e+" 0 1,1 0,"+2*e+"z"}function Wr(e,t){go.hasOwnProperty(e.type)&&go[e.type](e,t)}function Xr(e,t){Wr(e.geometry,t)}function Vr(e,t){for(var n=e.features,r=0,i=n.length;r<i;r++)Wr(n[r].geometry,t)}function $r(e,t){for(var n=e.geometries,r=0,i=n.length;r<i;r++)Wr(n[r],t)}function Jr(e,t){for(var n=e.coordinates,r=0,i=n.length;r<i;r++)t.apply(null,n[r])}function Kr(e,t){for(var n=e.coordinates,r=0,i=n.length;r<i;r++)for(var s=n[r],o=0,u=s.length;o<u;o++)t.apply(null,s[o])}function Qr(e,t){for(var n=e.coordinates,r=0,i=n.length;r<i;r++)for(var s=n[r][0],o=0,u=s.length;o<u;o++)t.apply(null,s[o])}function Gr(e,t){t.apply(null,e.coordinates)}function Yr(e,t){for(var n=e.coordinates[0],r=0,i=n.length;r<i;r++)t.apply(null,n[r])}function Zr(e){return e.source}function ei(e){return e.target}function ti(){function e(e){var t=Math.sin(e*=p)*d,n=Math.sin(p-e)*d,r=n*s+t*c,u=n*o+t*h,a=n*i+t*l;return[Math.atan2(u,r)/mo,Math.atan2(a,Math.sqrt(r*r+u*u))/mo]}var t,n,r,i,s,o,u,a,f,l,c,h,p,d;return e.distance=function(){return p==null&&(d=1/Math.sin(p=Math.acos(Math.max(-1,Math.min(1,i*l+r*f*Math.cos(u-t)))))),p},e.source=function(u){var a=Math.cos(t=u[0]*mo),f=Math.sin(t);return r=Math.cos(n=u[1]*mo),i=Math.sin(n),s=r*a,o=r*f,p=null,e},e.target=function(t){var n=Math.cos(u=t[0]*mo),r=Math.sin(u);return f=Math.cos(a=t[1]*mo),l=Math.sin(a),c=f*n,h=f*r,p=null,e},e}function ni(e,t){var n=ti().source(e).target(t);return n.distance(),n}function ri(e){var t=0,n=0;for(;;){if(e(t,n))return[t,n];t===0?(t=n+1,n=0):(t-=1,n+=1)}}function ii(e,t,n,r){var i,s,o,u,a,f,l;return i=r[e],s=i[0],o=i[1],i=r[t],u=i[0],a=i[1],i=r[n],f=i[0],l=i[1],(l-o)*(u-s)-(a-o)*(f-s)>0}function si(e,t,n){return(n[0]-t[0])*(e[1]-t[1])<(n[1]-t[1])*(e[0]-t[0])}function oi(e,t,n,r){var i=e[0],s=t[0],o=n[0],u=r[0],a=e[1],f=t[1],l=n[1],c=r[1],h=i-o,p=s-i,d=u-o,v=a-l,m=f-a,g=c-l,y=(d*v-g*h)/(g*p-d*m);return[i+y*p,a+y*m]}function ui(e,t){var n={list:e.map(function(e,t){return{index:t,x:e[0],y:e[1]}}).sort(function(e,t){return e.y<t.y?-1:e.y>t.y?1:e.x<t.x?-1:e.x>t.x?1:0}),bottomSite:null},r={list:[],leftEnd:null,rightEnd:null,init:function(){r.leftEnd=r.createHalfEdge(null,"l"),r.rightEnd=r.createHalfEdge(null,"l"),r.leftEnd.r=r.rightEnd,r.rightEnd.l=r.leftEnd,r.list.unshift(r.leftEnd,r.rightEnd)},createHalfEdge:function(e,t){return{edge:e,side:t,vertex:null,l:null,r:null}},insert:function(e,t){t.l=e,t.r=e.r,e.r.l=t,e.r=t},leftBound:function(e){var t=r.leftEnd;do t=t.r;while(t!=r.rightEnd&&i.rightOf(t,e));return t=t.l,t},del:function(e){e.l.r=e.r,e.r.l=e.l,e.edge=null},right:function(e){return e.r},left:function(e){return e.l},leftRegion:function(e){return e.edge==null?n.bottomSite:e.edge.region[e.side]},rightRegion:function(e){return e.edge==null?n.bottomSite:e.edge.region[wo[e.side]]}},i={bisect:function(e,t){var n={region:{l:e,r:t},ep:{l:null,r:null}},r=t.x-e.x,i=t.y-e.y,s=r>0?r:-r,o=i>0?i:-i;return n.c=e.x*r+e.y*i+(r*r+i*i)*.5,s>o?(n.a=1,n.b=i/r,n.c/=r):(n.b=1,n.a=r/i,n.c/=i),n},intersect:function(e,t){var n=e.edge,r=t.edge;if(!n||!r||n.region.r==r.region.r)return null;var i=n.a*r.b-n.b*r.a;if(Math.abs(i)<1e-10)return null;var s=(n.c*r.b-r.c*n.b)/i,o=(r.c*n.a-n.c*r.a)/i,u=n.region.r,a=r.region.r,f,l;u.y<a.y||u.y==a.y&&u.x<a.x?(f=e,l=n):(f=t,l=r);var c=s>=l.region.r.x;return c&&f.side==="l"||!c&&f.side==="r"?null:{x:s,y:o}},rightOf:function(e,t){var n=e.edge,r=n.region.r,i=t.x>r.x;if(i&&e.side==="l")return 1;if(!i&&e.side==="r")return 0;if(n.a===1){var s=t.y-r.y,o=t.x-r.x,u=0,a=0;!i&&n.b<0||i&&n.b>=0?a=u=s>=n.b*o:(a=t.x+t.y*n.b>n.c,n.b<0&&(a=!a),a||(u=1));if(!u){var f=r.x-n.region.l.x;a=n.b*(o*o-s*s)<f*s*(1+2*o/f+n.b*n.b),n.b<0&&(a=!a)}}else{var l=n.c-n.a*t.x,c=t.y-l,h=t.x-r.x,p=l-r.y;a=c*c>h*h+p*p}return e.side==="l"?a:!a},endPoint:function(e,n,r){e.ep[n]=r;if(!e.ep[wo[n]])return;t(e)},distance:function(e,t){var n=e.x-t.x,r=e.y-t.y;return Math.sqrt(n*n+r*r)}},s={list:[],insert:function(e,t,n){e.vertex=t,e.ystar=t.y+n;for(var r=0,i=s.list,o=i.length;r<o;r++){var u=i[r];if(e.ystar>u.ystar||e.ystar==u.ystar&&t.x>u.vertex.x)continue;break}i.splice(r,0,e)},del:function(e){for(var t=0,n=s.list,r=n.length;t<r&&n[t]!=e;++t);n.splice(t,1)},empty:function(){return s.list.length===0},nextEvent:function(e){for(var t=0,n=s.list,r=n.length;t<r;++t)if(n[t]==e)return n[t+1];return null},min:function(){var e=s.list[0];return{x:e.vertex.x,y:e.ystar}},extractMin:function(){return s.list.shift()}};r.init(),n.bottomSite=n.list.shift();var o=n.list.shift(),u,a,f,l,c,h,p,d,v,m,g,y,b;for(;;){s.empty()||(u=s.min());if(o&&(s.empty()||o.y<u.y||o.y==u.y&&o.x<u.x))a=r.leftBound(o),f=r.right(a),p=r.rightRegion(a),y=i.bisect(p,o),h=r.createHalfEdge(y,"l"),r.insert(a,h),m=i.intersect(a,h),m&&(s.del(a),s.insert(a,m,i.
distance(m,o))),a=h,h=r.createHalfEdge(y,"r"),r.insert(a,h),m=i.intersect(h,f),m&&s.insert(h,m,i.distance(m,o)),o=n.list.shift();else{if(!!s.empty())break;a=s.extractMin(),l=r.left(a),f=r.right(a),c=r.right(f),p=r.leftRegion(a),d=r.rightRegion(f),g=a.vertex,i.endPoint(a.edge,a.side,g),i.endPoint(f.edge,f.side,g),r.del(a),s.del(f),r.del(f),b="l",p.y>d.y&&(v=p,p=d,d=v,b="r"),y=i.bisect(p,d),h=r.createHalfEdge(y,b),r.insert(l,h),i.endPoint(y,wo[b],g),m=i.intersect(l,h),m&&(s.del(l),s.insert(l,m,i.distance(m,p))),m=i.intersect(h,c),m&&s.insert(h,m,i.distance(m,p))}}for(a=r.right(r.leftEnd);a!=r.rightEnd;a=r.right(a))t(a.edge)}function ai(){return{leaf:!0,nodes:[],point:null}}function fi(e,t,n,r,i,s){if(!e(t,n,r,i,s)){var o=(n+i)*.5,u=(r+s)*.5,a=t.nodes;a[0]&&fi(e,a[0],n,r,o,u),a[1]&&fi(e,a[1],o,r,i,u),a[2]&&fi(e,a[2],n,u,o,s),a[3]&&fi(e,a[3],o,u,i,s)}}function li(e){return{x:e[0],y:e[1]}}function ci(){this._=new Date(arguments.length>1?Date.UTC.apply(this,arguments):arguments[0])}function hi(e){return e.substring(0,3)}function pi(e,t,n,r){var i,s,o=0,u=t.length,a=n.length;while(o<u){if(r>=a)return-1;i=t.charCodeAt(o++);if(i==37){s=Uo[t.charAt(o++)];if(!s||(r=s(e,n,r))<0)return-1}else if(i!=n.charCodeAt(r++))return-1}return r}function di(e){return new RegExp("^(?:"+e.map(d3.requote).join("|")+")","i")}function vi(e){var t=new r,n=-1,i=e.length;while(++n<i)t.set(e[n].toLowerCase(),n);return t}function mi(e,t,n){Bo.lastIndex=0;var r=Bo.exec(t.substring(n));return r?n+=r[0].length:-1}function gi(e,t,n){Ho.lastIndex=0;var r=Ho.exec(t.substring(n));return r?n+=r[0].length:-1}function yi(e,t,n){Io.lastIndex=0;var r=Io.exec(t.substring(n));return r?(e.m=qo.get(r[0].toLowerCase()),n+=r[0].length):-1}function bi(e,t,n){jo.lastIndex=0;var r=jo.exec(t.substring(n));return r?(e.m=Fo.get(r[0].toLowerCase()),n+=r[0].length):-1}function wi(e,t,n){return pi(e,Ro.c.toString(),t,n)}function Ei(e,t,n){return pi(e,Ro.x.toString(),t,n)}function Si(e,t,n){return pi(e,Ro.X.toString(),t,n)}function xi(e,t,n){zo.lastIndex=0;var r=zo.exec(t.substring(n,n+4));return r?(e.y=+r[0],n+=r[0].length):-1}function Ti(e,t,n){zo.lastIndex=0;var r=zo.exec(t.substring(n,n+2));return r?(e.y=Ni(+r[0]),n+=r[0].length):-1}function Ni(e){return e+(e>68?1900:2e3)}function Ci(e,t,n){zo.lastIndex=0;var r=zo.exec(t.substring(n,n+2));return r?(e.m=r[0]-1,n+=r[0].length):-1}function ki(e,t,n){zo.lastIndex=0;var r=zo.exec(t.substring(n,n+2));return r?(e.d=+r[0],n+=r[0].length):-1}function Li(e,t,n){zo.lastIndex=0;var r=zo.exec(t.substring(n,n+2));return r?(e.H=+r[0],n+=r[0].length):-1}function Ai(e,t,n){zo.lastIndex=0;var r=zo.exec(t.substring(n,n+2));return r?(e.M=+r[0],n+=r[0].length):-1}function Oi(e,t,n){zo.lastIndex=0;var r=zo.exec(t.substring(n,n+2));return r?(e.S=+r[0],n+=r[0].length):-1}function Mi(e,t,n){zo.lastIndex=0;var r=zo.exec(t.substring(n,n+3));return r?(e.L=+r[0],n+=r[0].length):-1}function _i(e,t,n){var r=Wo.get(t.substring(n,n+=2).toLowerCase());return r==null?-1:(e.p=r,n)}function Di(e){var t=e.getTimezoneOffset(),n=t>0?"-":"+",r=~~(Math.abs(t)/60),i=Math.abs(t)%60;return n+Mo(r)+Mo(i)}function Pi(e){return e.toISOString()}function Hi(e,t,n){function r(t){var n=e(t),r=s(n,1);return t-n<r-t?n:r}function i(n){return t(n=e(new Eo(n-1)),1),n}function s(e,n){return t(e=new Eo(+e),n),e}function o(e,r,s){var o=i(e),u=[];if(s>1)while(o<r)n(o)%s||u.push(new Date(+o)),t(o,1);else while(o<r)u.push(new Date(+o)),t(o,1);return u}function u(e,t,n){try{Eo=ci;var r=new ci;return r._=e,o(r,t,n)}finally{Eo=Date}}e.floor=e,e.round=r,e.ceil=i,e.offset=s,e.range=o;var a=e.utc=Bi(e);return a.floor=a,a.round=Bi(r),a.ceil=Bi(i),a.offset=Bi(s),a.range=u,e}function Bi(e){return function(t,n){try{Eo=ci;var r=new ci;return r._=t,e(r,n)._}finally{Eo=Date}}}function ji(e,t,n){function r(t){return e(t)}return r.invert=function(t){return Ii(e.invert(t))},r.domain=function(t){return arguments.length?(e.domain(t),r):e.domain().map(Ii)},r.nice=function(e){return r.domain(Pt(r.domain(),function(){return e}))},r.ticks=function(n,i){var s=Fi(r.domain());if(typeof n!="function"){var o=s[1]-s[0],u=o/n,a=d3.bisect(Vo,u);if(a==Vo.length)return t.year(s,n);if(!a)return e.ticks(n).map(Ii);Math.log(u/Vo[a-1])<Math.log(Vo[a]/u)&&--a,n=t[a],i=n[1],n=n[0].range}return n(s[0],new Date(+s[1]+1),i)},r.tickFormat=function(){return n},r.copy=function(){return ji(e.copy(),t,n)},d3.rebind(r,e,"range","rangeRound","interpolate","clamp")}function Fi(e){var t=e[0],n=e[e.length-1];return t<n?[t,n]:[n,t]}function Ii(e){return new Date(e)}function qi(e){return function(t){var n=e.length-1,r=e[n];while(!r[1](t))r=e[--n];return r[0](t)}}function Ri(e){var t=new Date(e,0,1);return t.setFullYear(e),t}function Ui(e){var t=e.getFullYear(),n=Ri(t),r=Ri(t+1);return t+(e-n)/(r-n)}function zi(e){var t=new Date(Date.UTC(e,0,1));return t.setUTCFullYear(e),t}function Wi(e){var t=e.getUTCFullYear(),n=zi(t),r=zi(t+1);return t+(e-n)/(r-n)}Date.now||(Date.now=function(){return+(new Date)});try{document.createElement("div").style.setProperty("opacity",0,"")}catch(Xi){var Vi=CSSStyleDeclaration.prototype,$i=Vi.setProperty;Vi.setProperty=function(e,t,n){$i.call(this,e,t+"",n)}}d3={version:"2.10.3"};var Ji=n;try{Ji(document.documentElement.childNodes)[0].nodeType}catch(Ki){Ji=t}var Qi=[].__proto__?function(e,t){e.__proto__=t}:function(e,t){for(var n in t)e[n]=t[n]};d3.map=function(e){var t=new r;for(var n in e)t.set(n,e[n]);return t},e(r,{has:function(e){return Gi+e in this},get:function(e){return this[Gi+e]},set:function(e,t){return this[Gi+e]=t},remove:function(e){return e=Gi+e,e in this&&delete this[e]},keys:function(){var e=[];return this.forEach(function(t){e.push(t)}),e},values:function(){var e=[];return this.forEach(function(t,n){e.push(n)}),e},entries:function(){var e=[];return this.forEach(function(t,n){e.push({key:t,value:n})}),e},forEach:function(e){for(var t in this)t.charCodeAt(0)===Yi&&e.call(this,t.substring(1),this[t])}});var Gi="\0",Yi=Gi.charCodeAt(0);d3.functor=u,d3.rebind=function(e,t){var n=1,r=arguments.length,i;while(++n<r)e[i=arguments[n]]=a(e,t,t[i]);return e},d3.ascending=function(e,t){return e<t?-1:e>t?1:e>=t?0:NaN},d3.descending=function(e,t){return t<e?-1:t>e?1:t>=e?0:NaN},d3.mean=function(e,t){var n=e.length,r,i=0,s=-1,o=0;if(arguments.length===1)while(++s<n)f(r=e[s])&&(i+=(r-i)/++o);else while(++s<n)f(r=t.call(e,e[s],s))&&(i+=(r-i)/++o);return o?i:undefined},d3.median=function(e,t){return arguments.length>1&&(e=e.map(t)),e=e.filter(f),e.length?d3.quantile(e.sort(d3.ascending),.5):undefined},d3.min=function(e,t){var n=-1,r=e.length,i,s;if(arguments.length===1){while(++n<r&&((i=e[n])==null||i!=i))i=undefined;while(++n<r)(s=e[n])!=null&&i>s&&(i=s)}else{while(++n<r&&((i=t.call(e,e[n],n))==null||i!=i))i=undefined;while(++n<r)(s=t.call(e,e[n],n))!=null&&i>s&&(i=s)}return i},d3.max=function(e,t){var n=-1,r=e.length,i,s;if(arguments.length===1){while(++n<r&&((i=e[n])==null||i!=i))i=undefined;while(++n<r)(s=e[n])!=null&&s>i&&(i=s)}else{while(++n<r&&((i=t.call(e,e[n],n))==null||i!=i))i=undefined;while(++n<r)(s=t.call(e,e[n],n))!=null&&s>i&&(i=s)}return i},d3.extent=function(e,t){var n=-1,r=e.length,i,s,o;if(arguments.length===1){while(++n<r&&((i=o=e[n])==null||i!=i))i=o=undefined;while(++n<r)(s=e[n])!=null&&(i>s&&(i=s),o<s&&(o=s))}else{while(++n<r&&((i=o=t.call(e,e[n],n))==null||i!=i))i=undefined;while(++n<r)(s=t.call(e,e[n],n))!=null&&(i>s&&(i=s),o<s&&(o=s))}return[i,o]},d3.random={normal:function(e,t){var n=arguments.length;return n<2&&(t=1),n<1&&(e=0),function(){var n,r,i;do n=Math.random()*2-1,r=Math.random()*2-1,i=n*n+r*r;while(!i||i>1);return e+t*n*Math.sqrt(-2*Math.log(i)/i)}},logNormal:function(e,t){var n=arguments.length;n<2&&(t=1),n<1&&(e=0);var r=d3.random.normal();return function(){return Math.exp(e+t*r())}},irwinHall:function(e){return function(){for(var t=0,n=0;n<e;n++)t+=Math.random();return t/e}}},d3.sum=function(e,t){var n=0,r=e.length,i,s=-1;if(arguments.length===1)while(++s<r)isNaN(i=+e[s])||(n+=i);else while(++s<r)isNaN(i=+t.call(e,e[s],s))||(n+=i);return n},d3.quantile=function(e,t){var n=(e.length-1)*t+1,r=Math.floor(n),i=e[r-1],s=n-r;return s?i+s*(e[r]-i):i},d3.transpose=function(e){return d3.zip.apply(d3,e)},d3.zip=function(){if(!(i=arguments.length))return[];for(var e=-1,t=d3.min(arguments,l),n=new Array(t);++e<t;)for(var r=-1,i,s=n[e]=new Array(i);++r<i;)s[r]=arguments[r][e];return n},d3.bisector=function(e){return{left:function(t,n,r,i){arguments.length<3&&(r=0),arguments.length<4&&(i=t.length);while(r<i){var s=r+i>>>1;e.call(t,t[s],s)<n?r=s+1:i=s}return r},right:function(t,n,r,i){arguments.length<3&&(r=0),arguments.length<4&&(i=t.length);while(r<i){var s=r+i>>>1;n<e.call(t,t[s],s)?i=s:r=s+1}return r}}};var Zi=d3.bisector(function(e){return e});d3.bisectLeft=Zi.left,d3.bisect=d3.bisectRight=Zi.right,d3.first=function(e,t){var n=0,r=e.length,i=e[0],s;arguments.length===1&&(t=d3.ascending);while(++n<r)t.call(e,i,s=e[n])>0&&(i=s);return i},d3.last=function(e,t){var n=0,r=e.length,i=e[0],s;arguments.length===1&&(t=d3.ascending);while(++n<r)t.call(e,i,s=e[n])<=0&&(i=s);return i},d3.nest=function(){function e(t,s){if(s>=i.length)return u?u.call(n,t):o?t.sort(o):t;var a=-1,f=t.length,l=i[s++],c,h,p=new r,d,v={};while(++a<f)(d=p.get(c=l(h=t[a])))?d.push(h):p.set(c,[h]);return p.forEach(function(t,n){v[t]=e(n,s)}),v}function t(e,n){if(n>=i.length)return e;var r=[],o=s[n++],u;for(u in e)r.push({key:u,values:t(e[u],n)});return o&&r.sort(function(e,t){return o(e.key,t.key)}),r}var n={},i=[],s=[],o,u;return n.map=function(t){return e(t,0)},n.entries=function(n){return t(e(n,0),0)},n.key=function(e){return i.push(e),n},n.sortKeys=function(e){return s[i.length-1]=e,n},n.sortValues=function(e){return o=e,n},n.rollup=function(e){return u=e,n},n},d3.keys=function(e){var t=[];for(var n in e)t.push(n);return t},d3.values=function(e){var t=[];for(var n in e)t.push(e[n]);return t},d3.entries=function(e){var t=[];for(var n in e)t.push({key:n,value:e[n]});return t},d3.permute=function(e,t){var n=[],r=-1,i=t.length;while(++r<i)n[r]=e[t[r]];return n},d3.merge=function(e){return Array.prototype.concat.apply([],e)},d3.split=function(e,t){var n=[],r=[],i,s=-1,o=e.length;arguments.length<2&&(t=c);while(++s<o)t.call(r,i=e[s],s)?r=[]:(r.length||n.push(r),r.push(i));return n},d3.range=function(e,t,n){arguments.length<3&&(n=1,arguments.length<2&&(t=e,e=0));if((t-e)/n===Infinity)throw new Error("infinite range");var r=[],i=p(Math.abs(n)),s=-1,o;e*=i,t*=i,n*=i;if(n<0)while((o=e+n*++s)>t)r.push(o/i);else while((o=e+n*++s)<t)r.push(o/i);return r},d3.requote=function(e){return e.replace(es,"\\$&")};var es=/[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;d3.round=function(e,t){return t?Math.round(e*(t=Math.pow(10,t)))/t:Math.round(e)},d3.xhr=function(e,t,n){var r=new XMLHttpRequest;arguments.length<3?(n=t,t=null):t&&r.overrideMimeType&&r.overrideMimeType(t),r.open("GET",e,!0),t&&r.setRequestHeader("Accept",t),r.onreadystatechange=function(){if(r.readyState===4){var e=r.status;n(!e&&r.response||e>=200&&e<300||e===304?r:null)}},r.send(null)},d3.text=function(e,t,n){function r(e){n(e&&e.responseText)}arguments.length<3&&(n=t,t=null),d3.xhr(e,t,r)},d3.json=function(e,t){d3.text(e,"application/json",function(e){t(e?JSON.parse(e):null)})},d3.html=function(e,t){d3.text(e,"text/html",function(e){if(e!=null){var n=document.createRange();n.selectNode(document.body),e=n.createContextualFragment(e)}t(e)})},d3.xml=function(e,t,n){function r(e){n(e&&e.responseXML)}arguments.length<3&&(n=t,t=null),d3.xhr(e,t,r)};var ts={svg:"http://www.w3.org/2000/svg",xhtml:"http://www.w3.org/1999/xhtml",xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"};d3.ns={prefix:ts,qualify:function(e){var t=e.indexOf(":"),n=e;return t>=0&&(n=e.substring(0,t),e=e.substring(t+1)),ts.hasOwnProperty(n)?{space:ts[n],local:e}:e}},d3.dispatch=function(){var e=new d,t=-1,n=arguments.length;while(++t<n)e[arguments[t]]=v(e);return e},d.prototype.on=function(e,t){var n=e.indexOf("."),r="";return n>0&&(r=e.substring(n+1),e=e.substring(0,n)),arguments.length<2?this[e].on(r):this[e].on(r,t)},d3.format=function(e){var t=ns.exec(e),n=t[1]||" ",r=t[3]||"",i=t[5],s=+t[6],o=t[7],u=t[8],a=t[9],f=1,l="",c=!1;u&&(u=+u.substring(1)),i&&(n="0",o&&(s-=Math.floor((s-1)/4)));switch(a){case"n":o=!0,a="g";break;case"%":f=100,l="%",a="f";break;case"p":f=100,l="%",a="r";break;case"d":c=!0,u=0;break;case"s":f=-1,a="r"}return a=="r"&&!u&&(a="g"),a=rs.get(a)||g,function(e){if(c&&e%1)return"";var t=e<0&&(e=-e)?"-":r;if(f<0){var h=d3.formatPrefix(e,u);e=h.scale(e),l=h.symbol}else e*=f;e=a(e,u);if(i){var p=e.length+t.length;p<s&&(e=(new Array(s-p+1)).join(n)+e),o&&(e=y(e)),e=t+e}else{o&&(e=y(e)),e=t+e;var p=e.length;p<s&&(e=(new Array(s-p+1)).join(n)+e)}return e+l}};var ns=/(?:([^{])?([<>=^]))?([+\- ])?(#)?(0)?([0-9]+)?(,)?(\.[0-9]+)?([a-zA-Z%])?/,rs=d3.map({g:function(e,t){return e.toPrecision(t)},e:function(e,t){return e.toExponential(t)},f:function(e,t){return e.toFixed(t)},r:function(e,t){return d3.round(e,t=m(e,t)).toFixed(Math.max(0,Math.min(20,t)))}}),is=["y","z","a","f","p","n","μ","m","","k","M","G","T","P","E","Z","Y"].map(b);d3.formatPrefix=function(e,t){var n=0;return e&&(e<0&&(e*=-1),t&&(e=d3.round(e,m(e,t))),n=1+Math.floor(1e-12+Math.log(e)/Math.LN10),n=Math.max(-24,Math.min(24,Math.floor((n<=0?n+1:n-1)/3)*3))),is[8+n/3]};var ss=T(2),os=T(3),us=function(){return x},as=d3.map({linear:us,poly:T,quad:function(){return ss},cubic:function(){return os},sin:function(){return N},exp:function(){return C},circle:function(){return k},elastic:L,back:A,bounce:function(){return O}}),fs=d3.map({"in":x,out:E,"in-out":S,"out-in":function(e){return S(E(e))}});d3.ease=function(e){var t=e.indexOf("-"),n=t>=0?e.substring(0,t):e,r=t>=0?e.substring(t+1):"in";return n=as.get(n)||us,r=fs.get(r)||x,w(r(n.apply(null,Array.prototype.slice.call(arguments,1))))},d3.event=null,d3.transform=function(e){var t=document.createElementNS(d3.ns.prefix.svg,"g");return(d3.transform=function(e){t.setAttribute("transform",e);var n=t.transform.baseVal.consolidate();return new P(n?n.matrix:cs)})(e)},P.prototype.toString=function(){return"translate("+this.translate+")rotate("+this.rotate+")skewX("+this.skew+")scale("+this.scale+")"};var ls=180/Math.PI,cs={a:1,b:0,c:0,d:1,e:0,f:0};d3.interpolate=function(e,t){var n=d3.interpolators.length,r;while(--n>=0&&!(r=d3.interpolators[n](e,t)));return r},d3.interpolateNumber=function(e,t){return t-=e,function(n){return e+t*n}},d3.interpolateRound=function(e,t){return t-=e,function(n){return Math.round(e+t*n)}},d3.interpolateString=function(e,t){var n,r,i,s=0,o=0,u=[],a=[],f,l;hs.lastIndex=0;for(r=0;n=hs.exec(t);++r)n.index&&u.push(t.substring(s,o=n.index)),a.push({i:u.length,x:n[0]}),u.push(null),s=hs.lastIndex;s<t.length&&u.push(t.substring(s));for(r=0,f=a.length;(n=hs.exec(e))&&r<f;++r){l=a[r];if(l.x==n[0]){if(l.i)if(u[l.i+1]==null){u[l.i-1]+=l.x,u.splice(l.i,1);for(i=r+1;i<f;++i)a[i].i--}else{u[l.i-1]+=l.x+u[l.i+1],u.splice(l.i,2);for(i=r+1;i<f;++i)a[i].i-=2}else if(u[l.i+1]==null)u[l.i]=l.x;else{u[l.i]=l.x+u[l.i+1],u.splice(l.i+1,1);for(i=r+1;i<f;++i)a[i].i--}a.splice(r,1),f--,r--}else l.x=d3.interpolateNumber(parseFloat(n[0]),parseFloat(l.x))}while(r<f)l=a.pop(),u[l.i+1]==null?u[l.i]=l.x:(u[l.i]=l.x+u[l.i+1],u.splice(l.i+1,1)),f--;return u.length===1?u[0]==null?a[0].x:function(){return t}:function(e){for(r=0;r<f;++r)u[(l=a[r]).i]=l.x(e);return u.join("")}},d3.interpolateTransform=function(e,t){var n=[],r=[],i,s=d3.transform(e),o=d3.transform(t),u=s.translate,a=o.translate,f=s.rotate,l=o.rotate,c=s.skew,h=o.skew,p=s.scale,d=o.scale;return u[0]!=a[0]||u[1]!=a[1]?(n.push("translate(",null,",",null,")"),r.push({i:1,x:d3.interpolateNumber(u[0],a[0])},{i:3,x:d3.interpolateNumber(u[1],a[1])})):a[0]||a[1]?n.push("translate("+a+")"):n.push(""),f!=l?(f-l>180?l+=360:l-f>180&&(f+=360),r.push({i:n.push(n.pop()+"rotate(",null,")")-2,x:d3.interpolateNumber(f,l)})):l&&n.push(n.pop()+"rotate("+l+")"),c!=h?r.push({i:n.push(n.pop()+"skewX(",null,")")-2,x:d3.interpolateNumber(c,h)}):h&&n.push(n.pop()+"skewX("+h+")"),p[0]!=d[0]||p[1]!=d[1]?(i=n.push(n.pop()+"scale(",null,",",null,")"),r.push({i:i-4,x:d3.interpolateNumber(p[0],d[0])},{i:i-2,x:d3.interpolateNumber(p[1],d[1])})):(d[0]!=1||d[1]!=1)&&n.push(n.pop()+"scale("+d+")"),i=r.length,function(e){var t=-1,s;while(++t<i)n[(s=r[t]).i]=s.x(e);return n.join("")}},d3.interpolateRgb=function(e,t){e=d3.rgb(e),t=d3.rgb(t);var n=e.r,r=e.g,i=e.b,s=t.r-n,o=t.g-r,u=t.b-i;return function(e){return"#"+W(Math.round(n+s*e))+W(Math.round(r+o*e))+W(Math.round(i+u*e))}},d3.interpolateHsl=function(e,t){e=d3.hsl(e),t=d3.hsl(t);var n=e.h,r=e.s,i=e.l,s=t.h-n,o=t.s-r,u=t.l-i;return s>180?s-=360:s<-180&&(s+=360),function(e){return Y(n+s*e,r+o*e,i+u*e)+""}},d3.interpolateLab=function(e,t){e=d3.lab(e),t=d3.lab(t);var n=e.l,r=e.a,i=e.b,s=t.l-n,o=t.a-r,u=t.b-i;return function(e){return it(n+s*e,r+o*e,i+u*e)+""}},d3.interpolateHcl=function(e,t){e=d3.hcl(e),t=d3.hcl(t);var n=e.h,r=e.c,i=e.l,s=t.h-n,o=t.c-r,u=t.l-i;return s>180?s-=360:s<-180&&(s+=360),function(e){return tt(n+s*e,r+o*e,i+u*e)+""}},d3.interpolateArray=function(e,t){var n=[],r=[],i=e.length,s=t.length,o=Math.min(e.length,t.length),u;for(u=0;u<o;++u)n.push(d3.interpolate(e[u],t[u]));for(;u<i;++u)r[u]=e[u];for(;u<s;++u)r[u]=t[u];return function(e){for(u=0;u<o;++u)r[u]=n[u](e);return r}},d3.interpolateObject=function(e,t){var n={},r={},i;for(i in e)i in t?n[i]=F(i)(e[i],t[i]):r[i]=e[i];for(i in t)i in e||(r[i]=t[i]);return function(e){for(i in n)r[i]=n[i](e);return r}};var hs=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;d3.interpolators=[d3.interpolateObject,function(e,t){return t instanceof Array&&d3.interpolateArray(e,t)},function(e,t){return(typeof e=="string"||typeof t=="string")&&d3.interpolateString(e+"",t+"")},function(e,t){return(typeof t=="string"?ds.has(t)||/^(#|rgb\(|hsl\()/.test(t):t instanceof R)&&d3.interpolateRgb(e,t)},function(e,t){return!isNaN(e=+e)&&!isNaN(t=+t)&&d3.interpolateNumber(e,t)}],R.prototype.toString=function(){return this.rgb()+""},d3.rgb=function(e,t,n){return arguments.length===1?e instanceof z?U(e.r,e.g,e.b):X(""+e,U,Y):U(~~e,~~t,~~n)};var ps=z.prototype=new R;ps.brighter=function(e){e=Math.pow(.7,arguments.length?e:1);var t=this.r,n=this.g,r=this.b,i=30;return!t&&!n&&!r?U(i,i,i):(t&&t<i&&(t=i),n&&n<i&&(n=i),r&&r<i&&(r=i),U(Math.min(255,Math.floor(t/e)),Math.min(255,Math.floor(n/e)),Math.min(255,Math.floor(r/e))))},ps.darker=function(e){return e=Math.pow(.7,arguments.length?e:1),U(Math.floor(e*this.r),Math.floor(e*this.g),Math.floor(e*this.b))},ps.hsl=function(){return V(this.r,this.g,this.b)},ps.toString=function(){return"#"+W(this.r)+W(this.g)+W(this.b)};var ds=d3.map({aliceblue:"#f0f8ff",antiquewhite:"#faebd7",aqua:"#00ffff",aquamarine:"#7fffd4",azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",black:"#000000",blanchedalmond:"#ffebcd",blue:"#0000ff",blueviolet:"#8a2be2",brown:"#a52a2a",burlywood:"#deb887",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkgray:"#a9a9a9",darkgreen:"#006400",darkgrey:"#a9a9a9",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkslategrey:"#2f4f4f",darkturquoise:"#00ced1",darkviolet:"#9400d3",deeppink:"#ff1493",deepskyblue:"#00bfff",dimgray:"#696969",dimgrey:"#696969",dodgerblue:"#1e90ff",firebrick:"#b22222",floralwhite:"#fffaf0",forestgreen:"#228b22",fuchsia:"#ff00ff",gainsboro:"#dcdcdc",ghostwhite:"#f8f8ff",gold:"#ffd700",goldenrod:"#daa520",gray:"#808080",green:"#008000",greenyellow:"#adff2f",grey:"#808080",honeydew:"#f0fff0",hotpink:"#ff69b4",indianred:"#cd5c5c",indigo:"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",lavender:"#e6e6fa",lavenderblush:"#fff0f5",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral:"#f08080",lightcyan:"#e0ffff",lightgoldenrodyellow:"#fafad2",lightgray:"#d3d3d3",lightgreen:"#90ee90",lightgrey:"#d3d3d3",lightpink:"#ffb6c1",lightsalmon:"#ffa07a",lightseagreen:"#20b2aa",lightskyblue:"#87cefa",lightslategray:"#778899",lightslategrey:"#778899",lightsteelblue:"#b0c4de",lightyellow:"#ffffe0",lime:"#00ff00",limegreen:"#32cd32",linen:"#faf0e6",magenta:"#ff00ff",maroon:"#800000",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",mediumorchid:"#ba55d3",mediumpurple:"#9370db",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a",mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",navajowhite:"#ffdead",navy:"#000080",oldlace:"#fdf5e6",olive:"#808000",olivedrab:"#6b8e23",orange:"#ffa500",orangered:"#ff4500",orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#db7093",papayawhip:"#ffefd5",peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",red:"#ff0000",rosybrown:"#bc8f8f",royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",seagreen:"#2e8b57",seashell:"#fff5ee",sienna:"#a0522d",silver:"#c0c0c0",skyblue:"#87ceeb",slateblue:"#6a5acd",slategray:"#708090",slategrey:"#708090",snow:"#fffafa",springgreen:"#00ff7f",steelblue:"#4682b4",tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",wheat:"#f5deb3",white:"#ffffff",whitesmoke:"#f5f5f5",yellow:"#ffff00",yellowgreen:"#9acd32"});ds.forEach(function(e,t){ds.set(e,X(t,U,Y))}),d3.hsl=function(e,t,n){return arguments.length===1?e instanceof G?Q(e.h,e.s,e.l):X(""+e,V,Q):Q(+e,+t,+n)};var vs=G.prototype=new R;vs.brighter=function(e){return e=Math.pow(.7,arguments.length?e:1),Q(this.h,this.s,this.l/e)},vs.darker=function(e){return e=Math.pow(.7,arguments.length?e:1),Q(this.h,this.s,e*this.l)},vs.rgb=function(){return Y(this.h,this.s,this.l)},d3.hcl=function(e,t,n){return arguments.length===1?e instanceof et?Z(e.h,e.c,e.l):e instanceof rt?st(e.l,e.a,e.b):st((e=$((e=d3.rgb(e)).r,e.g,e.b)).l,e.a,e.b):Z(+e,+t,+n)};var ms=et.prototype=new R;ms.brighter=function(e){return Z(this.h,this.c,Math.min(100,this.l+gs*(arguments.length?e:1)))},ms.darker=function(e){return Z(this.h,this.c,Math.max(0,this.l-gs*(arguments.length?e:1)))},ms.rgb=function(){return tt(this.h,this.c,this.l).rgb()},d3.lab=function(e,t,n){return arguments.length===1?e instanceof rt?nt(e.l,e.a,e.b):e instanceof et?tt(e.l,e.c,e.h):$((e=d3.rgb(e)).r,e.g,e.b):nt(+e,+t,+n)};var gs=18,ys=.95047,bs=1,ws=1.08883,Es=rt.prototype=new R;Es.brighter=function(e){return nt(Math.min(100,this.l+gs*(arguments.length?e:1)),this.a,this.b)},Es.darker=function(e){return nt(Math.max(0,this.l-gs*(arguments.length?e:1)),this.a,this.b)},Es.rgb=function(){return it(this.l,this.a,this.b)};var Ss=function(e,t){return t.querySelector(e)},xs=function(e,t){return t.querySelectorAll(e)},Ts=document.documentElement,Ns=Ts.matchesSelector||Ts.webkitMatchesSelector||Ts.mozMatchesSelector||Ts.msMatchesSelector||Ts.oMatchesSelector,Cs=function(e,t){return Ns.call(e,t)};typeof Sizzle=="function"&&(Ss=function(e,t){return Sizzle(e,t)[0]||null},xs=function(e,t){return Sizzle.uniqueSort(Sizzle(e,t))},Cs=Sizzle.matchesSelector);var ks=[];d3.selection=function(){return Ls},d3.selection.prototype=ks,ks.select=function(e){var t=[],n,r,i,s;typeof e!="function"&&(e=lt(e));for(var o=-1,u=this.length;++o<u;){t.push(n=[]),n.parentNode=(i=this[o]).parentNode;for(var a=-1,f=i.length;++a<f;)(s=i[a])?(n.push(r=e.call(s,s.__data__,a)),r&&"__data__"in s&&(r.__data__=s.__data__)):n.push(null)}return ft(t)},ks.selectAll=function(e){var t=[],n,r;typeof e!="function"&&(e=ct(e));for(var i=-1,s=this.length;++i<s;)for(var o=this[i],u=-1,a=o.length;++u<a;)if(r=o[u])t.push(n=Ji(e.call(r,r.__data__,u))),n.parentNode=r;return ft(t)},ks.attr=function(e,t){if(arguments.length<2){if(typeof e=="string"){var n=this.node();return e=d3.ns.qualify(e),e.local?n.getAttributeNS(e.space,e.local):n.getAttribute(e)}for(t in e)this.each(ht(t,e[t]));return this}return this.each(ht(e,t))},ks.classed=function(e,t){if(arguments.length<2){if(typeof e=="string"){var n=this.node(),r=(e=e.trim().split(/^|\s+/g)).length,i=-1;if(t=n.classList){while(++i<r)if(!t.contains(e[i]))return!1}else{t=n.className,t.baseVal!=null&&(t=t.baseVal);while(++i<r)if(!pt(e[i]).test(t))return!1}return!0}for(t in e)this.each(dt(t,e[t]));return this}return this.each(dt(e,t))},ks.style=function(e,t,n){var r=arguments.length;if(r<3){if(typeof e!="string"){r<2&&(t="");for(n in e)this.each(mt(n,e[n],t));return this}if(r<2)return window.getComputedStyle(this.node(),null).getPropertyValue(e);n=""}return this.each(mt(e,t,n))},ks.property=function(e,t){if(arguments.length<2){if(typeof e=="string")return this.node()[e];for(t in e)this.each(gt(t,e[t]));return this}return this.each(gt(e,t))},ks.text=function(e){return arguments.length<1?this.node().textContent:this.each(typeof e=="function"?function(){var t=e.apply(this,arguments);this.textContent=t==null?"":t}:e==null?function(){this.textContent=""}:function(){this.textContent=e})},ks.html=function(e){return arguments.length<1?this.node().innerHTML:this.each(typeof e=="function"?function(){var t=e.apply(this,arguments);this.innerHTML=t==null?"":t}:e==null?function(){this.innerHTML=""}:function(){this.innerHTML=e})},ks.append=function(e){function t(){return this.appendChild(document.createElementNS(this.namespaceURI,e))}function n(){return this.appendChild(document.createElementNS(e.space,e.local))}return e=d3.ns.qualify(e),this.select(e.local?n:t)},ks.insert=function(e,t){function n(){return this.insertBefore(document.createElementNS(this.namespaceURI,e),Ss(t,this))}function r(){return this.insertBefore(document.createElementNS(e.space,e.local),Ss(t,this))}return e=d3.ns.qualify(e),this.select(e.local?r:n)},ks.remove=function(){return this.each(function(){var e=this.parentNode;e&&e.removeChild(this)})},ks.data=function(e,t){function n(e,n){var i,s=e.length,o=n.length,u=Math.min(s,o),c=Math.max(s,o),h=[],p=[],d=[],v,m;if(t){var g=new r,y=[],b,w=n.length;for(i=-1;++i<s;)b=t.call(v=e[i],v.__data__,i),g.has(b)?d[w++]=v:g.set(b,v),y.push(b);for(i=-1;++i<o;)b=t.call(n,m=n[i],i),g.has(b)?(h[i]=v=g.get(b),v.__data__=m,p[i]=d[i]=null):(p[i]=yt(m),h[i]=d[i]=null),g.remove(b);for(i=-1;++i<s;)g.has(y[i])&&(d[i]=e[i])}else{for(i=-1;++i<u;)v=e[i],m=n[i],v?(v.__data__=m,h[i]=v,p[i]=d[i]=null):(p[i]=yt(m),h[i]=d[i]=null);for(;i<o;++i)p[i]=yt(n[i]),h[i]=d[i]=null;for(;i<c;++i)d[i]=e[i],p[i]=h[i]=null}p.update=h,p.parentNode=h.parentNode=d.parentNode=e.parentNode,a.push(p),f.push(h),l.push(d)}var i=-1,s=this.length,o,u;if(!arguments.length){e=new Array(s=(o=this[0]).length);while(++i<s)if(u=o[i])e[i]=u.__data__;return e}var a=xt([]),f=ft([]),l=ft([]);if(typeof e=="function")while(++i<s)n(o=this[i],e.call(o,o.parentNode.__data__,i));else while(++i<s)n(o=this[i],e);return f.enter=function(){return a},f.exit=function(){return l},f},ks.datum=ks.map=function(e){return arguments.length<1?this.property("__data__"):this.property("__data__",e)},ks.filter=function(e){var t=[],n,r,i;typeof e!="function"&&(e=bt(e));for(var s=0,o=this.length;s<o;s++){t.push(n=[]),n.parentNode=(r=this[s]).parentNode;for(var u=0,a=r.length;u<a;u++)(i=r[u])&&e.call(i,i.__data__,u)&&n.push(i)}return ft(t)},ks.order=function(){for(var e=-1,t=this.length;++e<t;)for(var n=this[e],r=n.length-1,i=n[r],s;--r>=0;)if(s=n[r])i&&i!==s.nextSibling&&i.parentNode.insertBefore(s,i),i=s;return this},ks.sort=function(e){e=wt.apply(this,arguments);for(var t=-1,n=this.length;++t<n;)this[t].sort(e);return this.order()},ks.on=function(e,t,n){var r=arguments.length;if(r<3){if(typeof e!="string"){r<2&&(t=!1);for(n in e)this.each(Et(n,e[n],t));return this}if(r<2)return(r=this.node()["__on"+e])&&r._;n=!1}return this.each(Et(e,t,n))},ks.each=function(e){return St(this,function(t,n,r){e.call(t,t.__data__,n,r)})},ks.call=function(e){return e.apply(this,(arguments[0]=this,arguments)),this},ks.empty=function(){return!this.node()},ks.node=function(e){for(var t=0,n=this.length;t<n;t++)for(var r=this[t],i=0,s=r.length;i<s;i++){var o=r[i];if(o)return o}return null},ks.transition=function(){var e=[],t,n;for(var r=-1,i=this.length;++r<i;){e.push(t=[]);for(var s=this[r],o=-1,u=s.length;++o<u;)t.push((n=s[o])?{node:n,delay:Bs,duration:js}:null)}return Tt(e,_s||++Ms,Date.now())};var Ls=ft([[document]]);Ls[0].parentNode=Ts,d3.select=function(e){return typeof e=="string"?Ls.select(e):ft([[e]])},d3.selectAll=function(e){return typeof e=="string"?Ls.selectAll(e):ft([Ji(e)])};var As=[];d3.selection.enter=xt,d3.selection.enter.prototype=As,As.append=ks.append,As.insert=ks.insert,As.empty=ks.empty,As.node=ks.node,As.select=function(e){var t=[],n,r,i,s,o;for(var u=-1,a=this.length;++u<a;){i=(s=this[u]).update,t.push(n=[]),n.parentNode=s.parentNode;for(var f=-1,l=s.length;++f<l;)(o=s[f])?(n.push(i[f]=r=e.call(s.parentNode,o.__data__,f)),r.__data__=o.__data__):n.push(null)}return ft(t)};var Os=[],Ms=0,_s=0,Ds=0,Ps=250,Hs=d3.ease("cubic-in-out"),Bs=Ds,js=Ps,Fs=Hs;Os.call=ks.call,d3.transition=function(e){return arguments.length?_s?e.transition():e:Ls.transition()},d3.transition.prototype=Os,Os.select=function(e){var t=[],n,r,i;typeof e!="function"&&(e=lt(e));for(var s=-1,o=this.length;++s<o;){t.push(n=[]);for(var u=this[s],a=-1,f=u.length;++a<f;)(i=u[a])&&(r=e.call(i.node,i.node.__data__,a))?("__data__"in i.node&&(r.__data__=i.node.__data__),n.push({node:r,delay:i.delay,duration:i.duration})):n.push(null)}return Tt(t,this.id,this.time).ease(this.ease())},Os.selectAll=function(e){var t=[],n,r,i;typeof e!="function"&&(e=ct(e));for(var s=-1,o=this.length;++s<o;)for(var u=this[s],a=-1,f=u.length;++a<f;)if(i=u[a]){r=e.call(i.node,i.node.__data__,a),t.push(n=[]);for(var l=-1,c=r.length;++l<c;)n.push({node:r[l],delay:i.delay,duration:i.duration})}return Tt(t,this.id,this.time).ease(this.ease())},Os.filter=function(e){var t=[],n,r,i;typeof e!="function"&&(e=bt(e));for(var s=0,o=this.length;s<o;s++){t.push(n=[]);for(var r=this[s],u=0,a=r.length;u<a;u++)(i=r[u])&&e.call(i.node,i.node.__data__,u)&&n.push(i)}return Tt(t,this.id,this.time).ease(this.ease())},Os.attr=function(e,t){if(arguments.length<2){for(t in e)this.attrTween(t,kt(e[t],t));return this}return this.attrTween(e,kt(t,e))},Os.attrTween=function(e,t){function n(e,n){var r=t.call(this,e,n,this.getAttribute(i));return r===Is?(this.removeAttribute(i),null):r&&function(e){this.setAttribute(i,r(e))}}function r(e,n){var r=t.call(this,e,n,this.getAttributeNS(i.space,i.local));return r===Is?(this.removeAttributeNS(i.space,i.local),null):r&&function(e){this.setAttributeNS(i.space,i.local,r(e))}}var i=d3.ns.qualify(e);return this.tween("attr."+e,i.local?r:n)},Os.style=function(e,t,n){var r=arguments.length;if(r<3){if(typeof e!="string"){r<2&&(t="");for(n in e)this.styleTween(n,kt(e[n],n),t);return this}n=""}return this.styleTween(e,kt(t,e),n)},Os.styleTween=function(e,t,n){return arguments.length<3&&(n=""),this.tween("style."+e,function(r,i){var s=t.call(this,r,i,window.getComputedStyle(this,null).getPropertyValue(e));return s===Is?(this.style.removeProperty(e),null):s&&function(t){this.style.setProperty(e,s(t),n)}})},Os.text=function(e){return this.tween("text",function(t,n){this.textContent=typeof e=="function"?e.call(this,t,n):e})},Os.remove=function(){return this.each("end.transition",function(){var e;!this.__transition__&&(e=this.parentNode)&&e.removeChild(this)})},Os.delay=function(e){return St(this,typeof e=="function"?function(t,n,r){t.delay=e.call(t=t.node,t.__data__,n,r)|0}:(e|=0,function(t){t.delay=e}))},Os.duration=function(e){return St(this,typeof e=="function"?function(t,n,r){t.duration=Math.max(1,e.call(t=t.node,t.__data__,n,r)|0)}:(e=Math.max(1,e|0),function(t){t.duration=e}))},Os.transition=function(){return this.select(s)},d3.tween=function(e,t){function n(n,r,i){var s=e.call(this,n,r);return s==null?i!=""&&Is:i!=s&&t(i,s+"")}function r(n,r,i){return i!=e&&t(i,e)}return typeof e=="function"?n:e==null?Ct:(e+="",r)};var Is={},qs=0,Rs={},Us=null,zs,Ws;d3.timer=function(e,t,n){if(arguments.length<3){if(arguments.length<2)t=0;else if(!isFinite(t))return;n=Date.now()}var r=Rs[e.id];r&&r.callback===e?(r.then=n,r.delay=t):Rs[e.id=++qs]=Us={callback:e,then:n,delay:t,next:Us},zs||(Ws=clearTimeout(Ws),zs=1,Xs(Lt))},d3.timer.flush=function(){var e,t=Date.now(),n=Us;while(n)e=t-n.then,n.delay||(n.flush=n.callback(e)),n=n.next;At()};var Xs=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(e){setTimeout
(e,17)};d3.mouse=function(e){return Ot(e,_())};var Vs=/WebKit/.test(navigator.userAgent)?-1:0;d3.touches=function(e,t){return arguments.length<2&&(t=_().touches),t?Ji(t).map(function(t){var n=Ot(e,t);return n.identifier=t.identifier,n}):[]},d3.scale={},d3.scale.linear=function(){return Bt([0,1],[0,1],d3.interpolate,!1)},d3.scale.log=function(){return Wt(d3.scale.linear(),Xt)};var $s=d3.format(".0e");Xt.pow=function(e){return Math.pow(10,e)},Vt.pow=function(e){return-Math.pow(10,-e)},d3.scale.pow=function(){return $t(d3.scale.linear(),1)},d3.scale.sqrt=function(){return d3.scale.pow().exponent(.5)},d3.scale.ordinal=function(){return Kt([],{t:"range",a:[[]]})},d3.scale.category10=function(){return d3.scale.ordinal().range(Js)},d3.scale.category20=function(){return d3.scale.ordinal().range(Ks)},d3.scale.category20b=function(){return d3.scale.ordinal().range(Qs)},d3.scale.category20c=function(){return d3.scale.ordinal().range(Gs)};var Js=["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf"],Ks=["#1f77b4","#aec7e8","#ff7f0e","#ffbb78","#2ca02c","#98df8a","#d62728","#ff9896","#9467bd","#c5b0d5","#8c564b","#c49c94","#e377c2","#f7b6d2","#7f7f7f","#c7c7c7","#bcbd22","#dbdb8d","#17becf","#9edae5"],Qs=["#393b79","#5254a3","#6b6ecf","#9c9ede","#637939","#8ca252","#b5cf6b","#cedb9c","#8c6d31","#bd9e39","#e7ba52","#e7cb94","#843c39","#ad494a","#d6616b","#e7969c","#7b4173","#a55194","#ce6dbd","#de9ed6"],Gs=["#3182bd","#6baed6","#9ecae1","#c6dbef","#e6550d","#fd8d3c","#fdae6b","#fdd0a2","#31a354","#74c476","#a1d99b","#c7e9c0","#756bb1","#9e9ac8","#bcbddc","#dadaeb","#636363","#969696","#bdbdbd","#d9d9d9"];d3.scale.quantile=function(){return Qt([],[])},d3.scale.quantize=function(){return Gt(0,1,[0,1])},d3.scale.threshold=function(){return Yt([.5],[0,1])},d3.scale.identity=function(){return Zt([0,1])},d3.svg={},d3.svg.arc=function(){function e(){var e=t.apply(this,arguments),s=n.apply(this,arguments),o=r.apply(this,arguments)+Ys,u=i.apply(this,arguments)+Ys,a=(u<o&&(a=o,o=u,u=a),u-o),f=a<Math.PI?"0":"1",l=Math.cos(o),c=Math.sin(o),h=Math.cos(u),p=Math.sin(u);return a>=Zs?e?"M0,"+s+"A"+s+","+s+" 0 1,1 0,"+ -s+"A"+s+","+s+" 0 1,1 0,"+s+"M0,"+e+"A"+e+","+e+" 0 1,0 0,"+ -e+"A"+e+","+e+" 0 1,0 0,"+e+"Z":"M0,"+s+"A"+s+","+s+" 0 1,1 0,"+ -s+"A"+s+","+s+" 0 1,1 0,"+s+"Z":e?"M"+s*l+","+s*c+"A"+s+","+s+" 0 "+f+",1 "+s*h+","+s*p+"L"+e*h+","+e*p+"A"+e+","+e+" 0 "+f+",0 "+e*l+","+e*c+"Z":"M"+s*l+","+s*c+"A"+s+","+s+" 0 "+f+",1 "+s*h+","+s*p+"L0,0"+"Z"}var t=en,n=tn,r=nn,i=rn;return e.innerRadius=function(n){return arguments.length?(t=u(n),e):t},e.outerRadius=function(t){return arguments.length?(n=u(t),e):n},e.startAngle=function(t){return arguments.length?(r=u(t),e):r},e.endAngle=function(t){return arguments.length?(i=u(t),e):i},e.centroid=function(){var e=(t.apply(this,arguments)+n.apply(this,arguments))/2,s=(r.apply(this,arguments)+i.apply(this,arguments))/2+Ys;return[Math.cos(s)*e,Math.sin(s)*e]},e};var Ys=-Math.PI/2,Zs=2*Math.PI-1e-6;d3.svg.line=function(){return sn(i)};var eo=d3.map({linear:an,"linear-closed":fn,"step-before":ln,"step-after":cn,basis:gn,"basis-open":yn,"basis-closed":bn,bundle:wn,cardinal:dn,"cardinal-open":hn,"cardinal-closed":pn,monotone:Cn});eo.forEach(function(e,t){t.key=e,t.closed=/-closed$/.test(e)});var to=[0,2/3,1/3,0],no=[0,1/3,2/3,0],ro=[0,1/6,2/3,1/6];d3.svg.line.radial=function(){var e=sn(kn);return e.radius=e.x,delete e.x,e.angle=e.y,delete e.y,e},ln.reverse=cn,cn.reverse=ln,d3.svg.area=function(){return Ln(i)},d3.svg.area.radial=function(){var e=Ln(kn);return e.radius=e.x,delete e.x,e.innerRadius=e.x0,delete e.x0,e.outerRadius=e.x1,delete e.x1,e.angle=e.y,delete e.y,e.startAngle=e.y0,delete e.y0,e.endAngle=e.y1,delete e.y1,e},d3.svg.chord=function(){function e(e,u){var a=t(this,s,e,u),f=t(this,o,e,u);return"M"+a.p0+r(a.r,a.p1,a.a1-a.a0)+(n(a,f)?i(a.r,a.p1,a.r,a.p0):i(a.r,a.p1,f.r,f.p0)+r(f.r,f.p1,f.a1-f.a0)+i(f.r,f.p1,a.r,a.p0))+"Z"}function t(e,t,n,r){var i=t.call(e,n,r),s=a.call(e,i,r),o=f.call(e,i,r)+Ys,u=l.call(e,i,r)+Ys;return{r:s,a0:o,a1:u,p0:[s*Math.cos(o),s*Math.sin(o)],p1:[s*Math.cos(u),s*Math.sin(u)]}}function n(e,t){return e.a0==t.a0&&e.a1==t.a1}function r(e,t,n){return"A"+e+","+e+" 0 "+ +(n>Math.PI)+",1 "+t}function i(e,t,n,r){return"Q 0,0 "+r}var s=An,o=On,a=Mn,f=nn,l=rn;return e.radius=function(t){return arguments.length?(a=u(t),e):a},e.source=function(t){return arguments.length?(s=u(t),e):s},e.target=function(t){return arguments.length?(o=u(t),e):o},e.startAngle=function(t){return arguments.length?(f=u(t),e):f},e.endAngle=function(t){return arguments.length?(l=u(t),e):l},e},d3.svg.diagonal=function(){function e(e,i){var s=t.call(this,e,i),o=n.call(this,e,i),u=(s.y+o.y)/2,a=[s,{x:s.x,y:u},{x:o.x,y:u},o];return a=a.map(r),"M"+a[0]+"C"+a[1]+" "+a[2]+" "+a[3]}var t=An,n=On,r=Pn;return e.source=function(n){return arguments.length?(t=u(n),e):t},e.target=function(t){return arguments.length?(n=u(t),e):n},e.projection=function(t){return arguments.length?(r=t,e):r},e},d3.svg.diagonal.radial=function(){var e=d3.svg.diagonal(),t=Pn,n=e.projection;return e.projection=function(e){return arguments.length?n(Hn(t=e)):t},e},d3.svg.mouse=d3.mouse,d3.svg.touches=d3.touches,d3.svg.symbol=function(){function e(e,r){return(io.get(t.call(this,e,r))||Fn)(n.call(this,e,r))}var t=jn,n=Bn;return e.type=function(n){return arguments.length?(t=u(n),e):t},e.size=function(t){return arguments.length?(n=u(t),e):n},e};var io=d3.map({circle:Fn,cross:function(e){var t=Math.sqrt(e/5)/2;return"M"+ -3*t+","+ -t+"H"+ -t+"V"+ -3*t+"H"+t+"V"+ -t+"H"+3*t+"V"+t+"H"+t+"V"+3*t+"H"+ -t+"V"+t+"H"+ -3*t+"Z"},diamond:function(e){var t=Math.sqrt(e/(2*oo)),n=t*oo;return"M0,"+ -t+"L"+n+",0"+" 0,"+t+" "+ -n+",0"+"Z"},square:function(e){var t=Math.sqrt(e)/2;return"M"+ -t+","+ -t+"L"+t+","+ -t+" "+t+","+t+" "+ -t+","+t+"Z"},"triangle-down":function(e){var t=Math.sqrt(e/so),n=t*so/2;return"M0,"+n+"L"+t+","+ -n+" "+ -t+","+ -n+"Z"},"triangle-up":function(e){var t=Math.sqrt(e/so),n=t*so/2;return"M0,"+ -n+"L"+t+","+n+" "+ -t+","+n+"Z"}});d3.svg.symbolTypes=io.keys();var so=Math.sqrt(3),oo=Math.tan(30*Math.PI/180);d3.svg.axis=function(){function e(e){e.each(function(){var e=d3.select(this),c=a==null?t.ticks?t.ticks.apply(t,u):t.domain():a,h=f==null?t.tickFormat?t.tickFormat.apply(t,u):String:f,p=Rn(t,c,l),d=e.selectAll(".minor").data(p,String),v=d.enter().insert("line","g").attr("class","tick minor").style("opacity",1e-6),m=d3.transition(d.exit()).style("opacity",1e-6).remove(),g=d3.transition(d).style("opacity",1),y=e.selectAll("g").data(c,String),b=y.enter().insert("g","path").style("opacity",1e-6),w=d3.transition(y.exit()).style("opacity",1e-6).remove(),E=d3.transition(y).style("opacity",1),S,x=Dt(t),T=e.selectAll(".domain").data([0]),N=T.enter().append("path").attr("class","domain"),C=d3.transition(T),k=t.copy(),L=this.__chart__||k;this.__chart__=k,b.append("line").attr("class","tick"),b.append("text");var A=b.select("line"),O=E.select("line"),M=y.select("text").text(h),_=b.select("text"),D=E.select("text");switch(n){case"bottom":S=In,v.attr("y2",i),g.attr("x2",0).attr("y2",i),A.attr("y2",r),_.attr("y",Math.max(r,0)+o),O.attr("x2",0).attr("y2",r),D.attr("x",0).attr("y",Math.max(r,0)+o),M.attr("dy",".71em").attr("text-anchor","middle"),C.attr("d","M"+x[0]+","+s+"V0H"+x[1]+"V"+s);break;case"top":S=In,v.attr("y2",-i),g.attr("x2",0).attr("y2",-i),A.attr("y2",-r),_.attr("y",-(Math.max(r,0)+o)),O.attr("x2",0).attr("y2",-r),D.attr("x",0).attr("y",-(Math.max(r,0)+o)),M.attr("dy","0em").attr("text-anchor","middle"),C.attr("d","M"+x[0]+","+ -s+"V0H"+x[1]+"V"+ -s);break;case"left":S=qn,v.attr("x2",-i),g.attr("x2",-i).attr("y2",0),A.attr("x2",-r),_.attr("x",-(Math.max(r,0)+o)),O.attr("x2",-r).attr("y2",0),D.attr("x",-(Math.max(r,0)+o)).attr("y",0),M.attr("dy",".32em").attr("text-anchor","end"),C.attr("d","M"+ -s+","+x[0]+"H0V"+x[1]+"H"+ -s);break;case"right":S=qn,v.attr("x2",i),g.attr("x2",i).attr("y2",0),A.attr("x2",r),_.attr("x",Math.max(r,0)+o),O.attr("x2",r).attr("y2",0),D.attr("x",Math.max(r,0)+o).attr("y",0),M.attr("dy",".32em").attr("text-anchor","start"),C.attr("d","M"+s+","+x[0]+"H0V"+x[1]+"H"+s)}if(t.ticks)b.call(S,L),E.call(S,k),w.call(S,k),v.call(S,L),g.call(S,k),m.call(S,k);else{var P=k.rangeBand()/2,H=function(e){return k(e)+P};b.call(S,H),E.call(S,H)}})}var t=d3.scale.linear(),n="bottom",r=6,i=6,s=6,o=3,u=[10],a=null,f,l=0;return e.scale=function(n){return arguments.length?(t=n,e):t},e.orient=function(t){return arguments.length?(n=t,e):n},e.ticks=function(){return arguments.length?(u=arguments,e):u},e.tickValues=function(t){return arguments.length?(a=t,e):a},e.tickFormat=function(t){return arguments.length?(f=t,e):f},e.tickSize=function(t,n,o){if(!arguments.length)return r;var u=arguments.length-1;return r=+t,i=u>1?+n:r,s=u>0?+arguments[u]:r,e},e.tickPadding=function(t){return arguments.length?(o=+t,e):o},e.tickSubdivide=function(t){return arguments.length?(l=+t,e):l},e},d3.svg.brush=function(){function e(s){s.each(function(){var s=d3.select(this),f=s.selectAll(".background").data([0]),l=s.selectAll(".extent").data([0]),c=s.selectAll(".resize").data(a,String),h;s.style("pointer-events","all").on("mousedown.brush",i).on("touchstart.brush",i),f.enter().append("rect").attr("class","background").style("visibility","hidden").style("cursor","crosshair"),l.enter().append("rect").attr("class","extent").style("cursor","move"),c.enter().append("g").attr("class",function(e){return"resize "+e}).style("cursor",function(e){return uo[e]}).append("rect").attr("x",function(e){return/[ew]$/.test(e)?-3:null}).attr("y",function(e){return/^[ns]/.test(e)?-3:null}).attr("width",6).attr("height",6).style("visibility","hidden"),c.style("display",e.empty()?"none":null),c.exit().remove(),o&&(h=Dt(o),f.attr("x",h[0]).attr("width",h[1]-h[0]),n(s)),u&&(h=Dt(u),f.attr("y",h[0]).attr("height",h[1]-h[0]),r(s)),t(s)})}function t(e){e.selectAll(".resize").attr("transform",function(e){return"translate("+f[+/e$/.test(e)][0]+","+f[+/^s/.test(e)][1]+")"})}function n(e){e.select(".extent").attr("x",f[0][0]),e.selectAll(".extent,.n>rect,.s>rect").attr("width",f[1][0]-f[0][0])}function r(e){e.select(".extent").attr("y",f[0][1]),e.selectAll(".extent,.e>rect,.w>rect").attr("height",f[1][1]-f[0][1])}function i(){function i(){var e=d3.event.changedTouches;return e?d3.touches(v,e)[0]:d3.mouse(v)}function a(){d3.event.keyCode==32&&(S||(x=null,T[0]-=f[1][0],T[1]-=f[1][1],S=2),M())}function c(){d3.event.keyCode==32&&S==2&&(T[0]+=f[1][0],T[1]+=f[1][1],S=0,M())}function h(){var e=i(),s=!1;N&&(e[0]+=N[0],e[1]+=N[1]),S||(d3.event.altKey?(x||(x=[(f[0][0]+f[1][0])/2,(f[0][1]+f[1][1])/2]),T[0]=f[+(e[0]<x[0])][0],T[1]=f[+(e[1]<x[1])][1]):x=null),w&&p(e,o,0)&&(n(y),s=!0),E&&p(e,u,1)&&(r(y),s=!0),s&&(t(y),g({type:"brush",mode:S?"move":"resize"}))}function p(e,t,n){var r=Dt(t),i=r[0],s=r[1],o=T[n],u=f[1][n]-f[0][n],a,c;S&&(i-=o,s-=u+o),a=Math.max(i,Math.min(s,e[n])),S?c=(a+=o)+u:(x&&(o=Math.max(i,Math.min(s,2*x[n]-a))),o<a?(c=a,a=o):c=o);if(f[0][n]!==a||f[1][n]!==c)return l=null,f[0][n]=a,f[1][n]=c,!0}function d(){h(),y.style("pointer-events","all").selectAll(".resize").style("display",e.empty()?"none":null),d3.select("body").style("cursor",null),C.on("mousemove.brush",null).on("mouseup.brush",null).on("touchmove.brush",null).on("touchend.brush",null).on("keydown.brush",null).on("keyup.brush",null),g({type:"brushend"}),M()}var v=this,m=d3.select(d3.event.target),g=s.of(v,arguments),y=d3.select(v),b=m.datum(),w=!/^(n|s)$/.test(b)&&o,E=!/^(e|w)$/.test(b)&&u,S=m.classed("extent"),x,T=i(),N,C=d3.select(window).on("mousemove.brush",h).on("mouseup.brush",d).on("touchmove.brush",h).on("touchend.brush",d).on("keydown.brush",a).on("keyup.brush",c);if(S)T[0]=f[0][0]-T[0],T[1]=f[0][1]-T[1];else if(b){var k=+/w$/.test(b),L=+/^n/.test(b);N=[f[1-k][0]-T[0],f[1-L][1]-T[1]],T[0]=f[k][0],T[1]=f[L][1]}else d3.event.altKey&&(x=T.slice());y.style("pointer-events","none").selectAll(".resize").style("display",null),d3.select("body").style("cursor",m.style("cursor")),g({type:"brushstart"}),h(),M()}var s=D(e,"brushstart","brush","brushend"),o=null,u=null,a=ao[0],f=[[0,0],[0,0]],l;return e.x=function(t){return arguments.length?(o=t,a=ao[!o<<1|!u],e):o},e.y=function(t){return arguments.length?(u=t,a=ao[!o<<1|!u],e):u},e.extent=function(t){var n,r,i,s,a;return arguments.length?(l=[[0,0],[0,0]],o&&(n=t[0],r=t[1],u&&(n=n[0],r=r[0]),l[0][0]=n,l[1][0]=r,o.invert&&(n=o(n),r=o(r)),r<n&&(a=n,n=r,r=a),f[0][0]=n|0,f[1][0]=r|0),u&&(i=t[0],s=t[1],o&&(i=i[1],s=s[1]),l[0][1]=i,l[1][1]=s,u.invert&&(i=u(i),s=u(s)),s<i&&(a=i,i=s,s=a),f[0][1]=i|0,f[1][1]=s|0),e):(t=l||f,o&&(n=t[0][0],r=t[1][0],l||(n=f[0][0],r=f[1][0],o.invert&&(n=o.invert(n),r=o.invert(r)),r<n&&(a=n,n=r,r=a))),u&&(i=t[0][1],s=t[1][1],l||(i=f[0][1],s=f[1][1],u.invert&&(i=u.invert(i),s=u.invert(s)),s<i&&(a=i,i=s,s=a))),o&&u?[[n,i],[r,s]]:o?[n,r]:u&&[i,s])},e.clear=function(){return l=null,f[0][0]=f[0][1]=f[1][0]=f[1][1]=0,e},e.empty=function(){return o&&f[0][0]===f[1][0]||u&&f[0][1]===f[1][1]},d3.rebind(e,s,"on")};var uo={n:"ns-resize",e:"ew-resize",s:"ns-resize",w:"ew-resize",nw:"nwse-resize",ne:"nesw-resize",se:"nwse-resize",sw:"nesw-resize"},ao=[["n","e","s","w","nw","ne","se","sw"],["e","w"],["n","s"],[]];d3.behavior={},d3.behavior.drag=function(){function e(){this.on("mousedown.drag",t).on("touchstart.drag",t)}function t(){function e(){var e=o.parentNode;return f?d3.touches(e).filter(function(e){return e.identifier===f})[0]:d3.mouse(e)}function t(){if(!o.parentNode)return i();var t=e(),n=t[0]-c[0],r=t[1]-c[1];h|=n|r,c=t,M(),u({type:"drag",x:t[0]+l[0],y:t[1]+l[1],dx:n,dy:r})}function i(){u({type:"dragend"}),h&&(M(),d3.event.target===a&&p.on("click.drag",s,!0)),p.on(f?"touchmove.drag-"+f:"mousemove.drag",null).on(f?"touchend.drag-"+f:"mouseup.drag",null)}function s(){M(),p.on("click.drag",null)}var o=this,u=n.of(o,arguments),a=d3.event.target,f=d3.event.touches&&d3.event.changedTouches[0].identifier,l,c=e(),h=0,p=d3.select(window).on(f?"touchmove.drag-"+f:"mousemove.drag",t).on(f?"touchend.drag-"+f:"mouseup.drag",i,!0);r?(l=r.apply(o,arguments),l=[l.x-c[0],l.y-c[1]]):l=[0,0],f||M(),u({type:"dragstart"})}var n=D(e,"drag","dragstart","dragend"),r=null;return e.origin=function(t){return arguments.length?(r=t,e):r},d3.rebind(e,n,"on")},d3.behavior.zoom=function(){function e(){this.on("mousedown.zoom",o).on("mousewheel.zoom",u).on("mousemove.zoom",a).on("DOMMouseScroll.zoom",u).on("dblclick.zoom",f).on("touchstart.zoom",l).on("touchmove.zoom",c).on("touchend.zoom",l)}function t(e){return[(e[0]-h[0])/d,(e[1]-h[1])/d]}function n(e){return[e[0]*d+h[0],e[1]*d+h[1]]}function r(e){d=Math.max(m[0],Math.min(m[1],e))}function i(e,t){t=n(t),h[0]+=e[0]-t[0],h[1]+=e[1]-t[1]}function s(e){b&&b.domain(y.range().map(function(e){return(e-h[0])/d}).map(y.invert)),E&&E.domain(w.range().map(function(e){return(e-h[1])/d}).map(w.invert)),d3.event.preventDefault(),e({type:"zoom",scale:d,translate:h})}function o(){function e(){f=1,i(d3.mouse(o),c),s(u)}function n(){f&&M(),l.on("mousemove.zoom",null).on("mouseup.zoom",null),f&&d3.event.target===a&&l.on("click.zoom",r,!0)}function r(){M(),l.on("click.zoom",null)}var o=this,u=g.of(o,arguments),a=d3.event.target,f=0,l=d3.select(window).on("mousemove.zoom",e).on("mouseup.zoom",n),c=t(d3.mouse(o));window.focus(),M()}function u(){p||(p=t(d3.mouse(this))),r(Math.pow(2,Un()*.002)*d),i(d3.mouse(this),p),s(g.of(this,arguments))}function a(){p=null}function f(){var e=d3.mouse(this),n=t(e);r(d3.event.shiftKey?d/2:d*2),i(e,n),s(g.of(this,arguments))}function l(){var e=d3.touches(this),n=Date.now();v=d,p={},e.forEach(function(e){p[e.identifier]=t(e)}),M();if(e.length===1){if(n-S<500){var o=e[0],u=t(e[0]);r(d*2),i(o,u),s(g.of(this,arguments))}S=n}}function c(){var e=d3.touches(this),t=e[0],n=p[t.identifier];if(o=e[1]){var o,u=p[o.identifier];t=[(t[0]+o[0])/2,(t[1]+o[1])/2],n=[(n[0]+u[0])/2,(n[1]+u[1])/2],r(d3.event.scale*v)}i(t,n),S=null,s(g.of(this,arguments))}var h=[0,0],p,d=1,v,m=lo,g=D(e,"zoom"),y,b,w,E,S;return e.translate=function(t){return arguments.length?(h=t.map(Number),e):h},e.scale=function(t){return arguments.length?(d=+t,e):d},e.scaleExtent=function(t){return arguments.length?(m=t==null?lo:t.map(Number),e):m},e.x=function(t){return arguments.length?(b=t,y=t.copy(),e):b},e.y=function(t){return arguments.length?(E=t,w=t.copy(),e):E},d3.rebind(e,g,"on")};var fo,lo=[0,Infinity];d3.layout={},d3.layout.bundle=function(){return function(e){var t=[],n=-1,r=e.length;while(++n<r)t.push(zn(e[n]));return t}},d3.layout.chord=function(){function e(){var e={},n=[],c=d3.range(o),h=[],p,d,v,m,g;r=[],i=[],p=0,m=-1;while(++m<o){d=0,g=-1;while(++g<o)d+=s[m][g];n.push(d),h.push(d3.range(o)),p+=d}a&&c.sort(function(e,t){return a(n[e],n[t])}),f&&h.forEach(function(e,t){e.sort(function(e,n){return f(s[t][e],s[t][n])})}),p=(2*Math.PI-u*o)/p,d=0,m=-1;while(++m<o){v=d,g=-1;while(++g<o){var y=c[m],b=h[y][g],w=s[y][b],E=d,S=d+=w*p;e[y+"-"+b]={index:y,subindex:b,startAngle:E,endAngle:S,value:w}}i[y]={index:y,startAngle:v,endAngle:d,value:(d-v)/p},d+=u}m=-1;while(++m<o){g=m-1;while(++g<o){var x=e[m+"-"+g],T=e[g+"-"+m];(x.value||T.value)&&r.push(x.value<T.value?{source:T,target:x}:{source:x,target:T})}}l&&t()}function t(){r.sort(function(e,t){return l((e.source.value+e.target.value)/2,(t.source.value+t.target.value)/2)})}var n={},r,i,s,o,u=0,a,f,l;return n.matrix=function(e){return arguments.length?(o=(s=e)&&s.length,r=i=null,n):s},n.padding=function(e){return arguments.length?(u=e,r=i=null,n):u},n.sortGroups=function(e){return arguments.length?(a=e,r=i=null,n):a},n.sortSubgroups=function(e){return arguments.length?(f=e,r=null,n):f},n.sortChords=function(e){return arguments.length?(l=e,r&&t(),n):l},n.chords=function(){return r||e(),r},n.groups=function(){return i||e(),i},n},d3.layout.force=function(){function e(e){return function(t,n,r,i,s){if(t.point!==e){var o=t.cx-e.x,u=t.cy-e.y,a=1/Math.sqrt(o*o+u*u);if((i-n)*a<d){var f=t.charge*a*a;return e.px-=o*f,e.py-=u*f,!0}if(t.point&&isFinite(a)){var f=t.pointCharge*a*a;e.px-=o*f,e.py-=u*f}}return!t.charge}}function t(e){e.px=d3.event.x,e.py=d3.event.y,n.resume()}var n={},r=d3.dispatch("start","tick","end"),s=[1,1],o,a,f=.9,l=Gn,c=Yn,h=-30,p=.1,d=.8,v,m=[],g=[],y,b,w;return n.tick=function(){if((a*=.99)<.005)return r.end({type:"end",alpha:a=0}),!0;var t=m.length,n=g.length,i,o,u,l,c,d,v,E,S;for(o=0;o<n;++o){u=g[o],l=u.source,c=u.target,E=c.x-l.x,S=c.y-l.y;if(d=E*E+S*S)d=a*b[o]*((d=Math.sqrt(d))-y[o])/d,E*=d,S*=d,c.x-=E*(v=l.weight/(c.weight+l.weight)),c.y-=S*v,l.x+=E*(v=1-v),l.y+=S*v}if(v=a*p){E=s[0]/2,S=s[1]/2,o=-1;if(v)while(++o<t)u=m[o],u.x+=(E-u.x)*v,u.y+=(S-u.y)*v}if(h){Qn(i=d3.geom.quadtree(m),a,w),o=-1;while(++o<t)(u=m[o]).fixed||i.visit(e(u))}o=-1;while(++o<t)u=m[o],u.fixed?(u.x=u.px,u.y=u.py):(u.x-=(u.px-(u.px=u.x))*f,u.y-=(u.py-(u.py=u.y))*f);r.tick({type:"tick",alpha:a})},n.nodes=function(e){return arguments.length?(m=e,n):m},n.links=function(e){return arguments.length?(g=e,n):g},n.size=function(e){return arguments.length?(s=e,n):s},n.linkDistance=function(e){return arguments.length?(l=u(e),n):l},n.distance=n.linkDistance,n.linkStrength=function(e){return arguments.length?(c=u(e),n):c},n.friction=function(e){return arguments.length?(f=e,n):f},n.charge=function(e){return arguments.length?(h=typeof e=="function"?e:+e,n):h},n.gravity=function(e){return arguments.length?(p=e,n):p},n.theta=function(e){return arguments.length?(d=e,n):d},n.alpha=function(e){return arguments.length?(a?e>0?a=e:a=0:e>0&&(r.start({type:"start",alpha:a=e}),d3.timer(n.tick)),n):a},n.start=function(){function e(e,n){var i=t(r),s=-1,o=i.length,u;while(++s<o)if(!isNaN(u=i[s][e]))return u;return Math.random()*n}function t(){if(!p){p=[];for(i=0;i<o;++i)p[i]=[];for(i=0;i<u;++i){var e=g[i];p[e.source.index].push(e.target),p[e.target.index].push(e.source)}}return p[r]}var r,i,o=m.length,u=g.length,a=s[0],f=s[1],p,d;for(r=0;r<o;++r)(d=m[r]).index=r,d.weight=0;y=[],b=[];for(r=0;r<u;++r)d=g[r],typeof d.source=="number"&&(d.source=m[d.source]),typeof d.target=="number"&&(d.target=m[d.target]),y[r]=l.call(this,d,r),b[r]=c.call(this,d,r),++d.source.weight,++d.target.weight;for(r=0;r<o;++r)d=m[r],isNaN(d.x)&&(d.x=e("x",a)),isNaN(d.y)&&(d.y=e("y",f)),isNaN(d.px)&&(d.px=d.x),isNaN(d.py)&&(d.py=d.y);w=[];if(typeof h=="function")for(r=0;r<o;++r)w[r]=+h.call(this,m[r],r);else for(r=0;r<o;++r)w[r]=h;return n.resume()},n.resume=function(){return n.alpha(.1)},n.stop=function(){return n.alpha(0)},n.drag=function(){o||(o=d3.behavior.drag().origin(i).on("dragstart",Vn).on("drag",t).on("dragend",$n)),this.on("mouseover.force",Jn).on("mouseout.force",Kn).call(o)},d3.rebind(n,r,"on")},d3.layout.partition=function(){function e(t,n,r,i){var s=t.children;t.x=n,t.y=t.depth*i,t.dx=r,t.dy=i;if(s&&(u=s.length)){var o=-1,u,a,f;r=t.value?r/t.value:0;while(++o<u)e(a=s[o],n,f=a.value*r,i),n+=f}}function t(e){var n=e.children,r=0;if(n&&(s=n.length)){var i=-1,s;while(++i<s)r=Math.max(r,t(n[i]))}return 1+r}function n(n,s){var o=r.call(this,n,s);return e(o[0],0,i[0],i[1]/t(o[0])),o}var r=d3.layout.hierarchy(),i=[1,1];return n.size=function(e){return arguments.length?(i=e,n):i},lr(n,r)},d3.layout.pie=function(){function e(s,o){var u=s.map(function(n,r){return+t.call(e,n,r)}),a=+(typeof r=="function"?r.apply(this,arguments):r),f=((typeof i=="function"?i.apply(this,arguments):i)-r)/d3.sum(u),l=d3.range(s.length);n!=null&&l.sort(n===co?function(e,t){return u[t]-u[e]}:function(e,t){return n(s[e],s[t])});var c=[];return l.forEach(function(e){var t;c[e]={data:s[e],value:t=u[e],startAngle:a,endAngle:a+=t*f}}),c}var t=Number,n=co,r=0,i=2*Math.PI;return e.value=function(n){return arguments.length?(t=n,e):t},e.sort=function(t){return arguments.length?(n=t,e):n},e.startAngle=function(t){return arguments.length?(r=t,e):r},e.endAngle=function(t){return arguments.length?(i=t,e):i},e};var co={};d3.layout.stack=function(){function e(i,a){var f=i.map(function(n,r){return t.call(e,n,r)}),l=f.map(function(t,n){return t.map(function(t,n){return[o.call(e,t,n),u.call(e,t,n)]})}),c=n.call(e,l,a);f=d3.permute(f,c),l=d3.permute(l,c);var h=r.call(e,l,a),p=f.length,d=f[0].length,v,m,g;for(m=0;m<d;++m){s.call(e,f[0][m],g=h[m],l[0][m][1]);for(v=1;v<p;++v)s.call(e,f[v][m],g+=l[v-1][m][1],l[v][m][1])}return i}var t=i,n=nr,r=rr,s=tr,o=Zn,u=er;return e.values=function(n){return arguments.length?(t=n,e):t},e.order=function(t){return arguments.length?(n=typeof t=="function"?t:ho.get(t)||nr,e):n},e.offset=function(t){return arguments.length?(r=typeof t=="function"?t:po.get(t)||rr,e):r},e.x=function(t){return arguments.length?(o=t,e):o},e.y=function(t){return arguments.length?(u=t,e):u},e.out=function(t){return arguments.length?(s=t,e):s},e};var ho=d3.map({"inside-out":function(e){var t=e.length,n,r,i=e.map(ir),s=e.map(sr),o=d3.range(t).sort(function(e,t){return i[e]-i[t]}),u=0,a=0,f=[],l=[];for(n=0;n<t;++n)r=o[n],u<a?(u+=s[r],f.push(r)):(a+=s[r],l.push(r));return l.reverse().concat(f)},reverse:function(e){return d3.range(e.length).reverse()},"default":nr}),po=d3.map({silhouette:function(e){var t=e.length,n=e[0].length,r=[],i=0,s,o,u,a=[];for(o=0;o<n;++o){for(s=0,u=0;s<t;s++)u+=e[s][o][1];u>i&&(i=u),r.push(u)}for(o=0;o<n;++o)a[o]=(i-r[o])/2;return a},wiggle:function(e){var t=e.length,n=e[0],r=n.length,i=0,s,o,u,a,f,l,c,h,p,d=[];d[0]=h=p=0;for(o=1;o<r;++o){for(s=0,a=0;s<t;++s)a+=e[s][o][1];for(s=0,f=0,c=n[o][0]-n[o-1][0];s<t;++s){for(u=0,l=(e[s][o][1]-e[s][o-1][1])/(2*c);u<s;++u)l+=(e[u][o][1]-e[u][o-1][1])/c;f+=l*e[s][o][1]}d[o]=h-=a?f/a*c:0,h<p&&(p=h)}for(o=0;o<r;++o)d[o]-=p;return d},expand:function(e){var t=e.length,n=e[0].length,r=1/t,i,s,o,u=[];for(s=0;s<n;++s){for(i=0,o=0;i<t;i++)o+=e[i][s][1];if(o)for(i=0;i<t;i++)e[i][s][1]/=o;else for(i=0;i<t;i++)e[i][s][1]=r}for(s=0;s<n;++s)u[s]=0;return u},zero:rr});d3.layout.histogram=function(){function e(e,s){var o=[],u=e.map(n,this),a=r.call(this,u,s),f=i.call(this,a,u,s),l,s=-1,c=u.length,h=f.length-1,p=t?1:1/c,d;while(++s<h)l=o[s]=[],l.dx=f[s+1]-(l.x=f[s]),l.y=0;if(h>0){s=-1;while(++s<c)d=u[s],d>=a[0]&&d<=a[1]&&(l=o[d3.bisect(f,d,1,h)-1],l.y+=p,l.push(e[s]))}return o}var t=!0,n=Number,r=fr,i=ur;return e.value=function(t){return arguments.length?(n=t,e):n},e.range=function(t){return arguments.length?(r=u(t),e):r},e.bins=function(t){return arguments.length?(i=typeof t=="number"?function(e){return ar(e,t)}:u(t),e):i},e.frequency=function(n){return arguments.length?(t=!!n,e):t},e},d3.layout.hierarchy=function(){function e(t,o,u){var a=i.call(n,t,o),f=vo?t:{data:t};f.depth=o,u.push(f);if(a&&(c=a.length)){var l=-1,c,h=f.children=[],p=0,d=o+1,v;while(++l<c)v=e(a[l],d,u),v.parent=f,h.push(v),p+=v.value;r&&h.sort(r),s&&(f.value=p)}else s&&(f.value=+s.call(n,t,o)||0);return f}function t(e,r){var i=e.children,o=0;if(i&&(a=i.length)){var u=-1,a,f=r+1;while(++u<a)o+=t(i[u],f)}else s&&(o=+s.call(n,vo?e:e.data,r)||0);return s&&(e.value=o),o}function n(t){var n=[];return e(t,0,n),n}var r=pr,i=cr,s=hr;return n.sort=function(e){return arguments.length?(r=e,n):r},n.children=function(e){return arguments.length?(i=e,n):i},n.value=function(e){return arguments.length?(s=e,n):s},n.revalue=function(e){return t(e,0),e},n};var vo=!1;d3.layout.pack=function(){function e(e,i){var s=t.call(this,e,i),o=s[0];o.x=0,o.y=0,Hr(o,function(e){e.r=Math.sqrt(e.value)}),Hr(o,br);var u=r[0],a=r[1],f=Math.max(2*o.r/u,2*o.r/a);if(n>0){var l=n*f/2;Hr(o,function(e){e.r+=l}),Hr(o,br),Hr(o,function(e){e.r-=l}),f=Math.max(2*o.r/u,2*o.r/a)}return Sr(o,u/2,a/2,1/f),s}var t=d3.layout.hierarchy().sort(vr),n=0,r=[1,1];return e.size=function(t){return arguments.length?(r=t,e):r},e.padding=function(t){return arguments.length?(n=+t,e):n},lr(e,t)},d3.layout.cluster=function(){function e(e,i){var s=t.call(this,e,i),o=s[0],u,a=0,f,l;Hr(o,function(e){var t=e.children;t&&t.length?(e.x=Nr(t),e.y=Tr(t)):(e.x=u?a+=n(e,u):0,e.y=0,u=e)});var c=Cr(o),h=kr(o),p=c.x-n(c,h)/2,d=h.x+n(h,c)/2;return Hr(o,function(e){e.x=(e.x-p)/(d-p)*r[0],e.y=(1-(o.y?e.y/o.y:1))*r[1]}),s}var t=d3.layout.hierarchy().sort(null).value(null),n=Lr,r=[1,1];return e.separation=function(t){return arguments.length?(n=t,e):n},e.size=function(t){return arguments.length?(r=t,e):r},lr(e,t)},d3.layout.tree=function(){function e(e,i){function s(e,t){var r=e.children,i=e._tree;if(r&&(o=r.length)){var o,a=r[0],f,l=a,c,h=-1;while(++h<o)c=r[h],s(c,f),l=u(c,f,l),f=c;Br(e);var p=.5*(a._tree.prelim+c._tree.prelim);t?(i.prelim=t._tree.prelim+n(e,t),i.mod=i.prelim-p):i.prelim=p}else t&&(i.prelim=t._tree.prelim+n(e,t))}function o(e,t){e.x=e._tree.prelim+t;var n=e.children;if(n&&(i=n.length)){var r=-1,i;t+=e._tree.mod;while(++r<i)o(n[r],t)}}function u(e,t,r){if(t){var i=e,s=e,o=t,u=e.parent.children[0],a=i._tree.mod,f=s._tree.mod,l=o._tree.mod,c=u._tree.mod,h;while(o=Or(o),i=Ar(i),o&&i)u=Ar(u),s=Or(s),s._tree.ancestor=e,h=o._tree.prelim+l-i._tree.prelim-a+n(o,i),h>0&&(jr(Fr(o,e,r),e,h),a+=h,f+=h),l+=o._tree.mod,a+=i._tree.mod,c+=u._tree.mod,f+=s._tree.mod;o&&!Or(s)&&(s._tree.thread=o,s._tree.mod+=l-f),i&&!Ar(u)&&(u._tree.thread=i,u._tree.mod+=a-c,r=e)}return r}var a=t.call(this,e,i),f=a[0];Hr(f,function(e,t){e._tree={ancestor:e,prelim:0,mod:0,change:0,shift:0,number:t?t._tree.number+1:0}}),s(f),o(f,-f._tree.prelim);var l=Mr(f,Dr),c=Mr(f,_r),h=Mr(f,Pr),p=l.x-n(l,c)/2,d=c.x+n(c,l)/2,v=h.depth||1;return Hr(f,function(e){e.x=(e.x-p)/(d-p)*r[0],e.y=e.depth/v*r[1],delete e._tree}),a}var t=d3.layout.hierarchy().sort(null).value(null),n=Lr,r=[1,1];return e.separation=function(t){return arguments.length?(n=t,e):n},e.size=function(t){return arguments.length?(r=t,e):r},lr(e,t)},d3.layout.treemap=function(){function e(e,t){var n=-1,r=e.length,i,s;while(++n<r)s=(i=e[n]).value*(t<0?0:t),i.area=isNaN(s)||s<=0?0:s}function t(n){var s=n.children;if(s&&s.length){var o=l(n),u=[],a=s.slice(),f,c=Infinity,h,p=Math.min(o.dx,o.dy),d;e(a,o.dx*o.dy/n.value),u.area=0;while((d=a.length)>0)u.push(f=a[d-1]),u.area+=f.area,(h=r(u,p))<=c?(a.pop(),c=h):(u.area-=u.pop().area,i(u,p,o,!1),p=Math.min(o.dx,o.dy),u.length=u.area=0,c=Infinity);u.length&&(i(u,p,o,!0),u.length=u.area=0),s.forEach(t)}}function n(t){var r=t.children;if(r&&r.length){var s=l(t),o=r.slice(),u,a=[];e(o,s.dx*s.dy/t.value),a.area=0;while(u=o.pop())a.push(u),a.area+=u.area,u.z!=null&&(i(a,u.z?s.dx:s.dy,s,!o.length),a.length=a.area=0);r.forEach(n)}}function r(e,t){var n=e.area,r,i=0,s=Infinity,o=-1,u=e.length;while(++o<u){if(!(r=e[o].area))continue;r<s&&(s=r),r>i&&(i=r)}return n*=n,t*=t,n?Math.max(t*i*p/n,n/(t*s*p)):Infinity}function i(e,t,n,r){var i=-1,s=e.length,o=n.x,a=n.y,f=t?u(e.area/t):0,l;if(t==n.dx){if(r||f>n.dy)f=n.dy;while(++i<s)l=e[i],l.x=o,l.y=a,l.dy=f,o+=l.dx=Math.min(n.x+n.dx-o,f?u(l.area/f):0);l.z=!0,l.dx+=n.x+n.dx-o,n.y+=f,n.dy-=f}else{if(r||f>n.dx)f=n.dx;while(++i<s)l=e[i],l.x=o,l.y=a,l.dx=f,a+=l.dy=Math.min(n.y+n.dy-a,f?u(l.area/f):0);l.z=!1,l.dy+=n.y+n.dy-a,n.x+=f,n.dx-=f}}function s(r){var i=h||o(r),s=i[0];return s.x=0,s.y=0,s.dx=a[0],s.dy=a[1],h&&o.revalue(s),e([s],s.dx*s.dy/s.value),(h?n:t)(s),c&&(h=i),i}var o=d3.layout.hierarchy(),u=Math.round,a=[1,1],f=null,l=Ir,c=!1,h,p=.5*(1+Math.sqrt(5));return s.size=function(e){return arguments.length?(a=e,s):a},s.padding=function(e){function t(t){var n=e.call(s,t,t.depth);return n==null?Ir(t):qr(t,typeof n=="number"?[n,n,n,n]:n)}function n(t){return qr(t,e)}if(!arguments.length)return f;var r;return l=(f=e)==null?Ir:(r=typeof e)==="function"?t:r==="number"?(e=[e,e,e,e],n):n,s},s.round=function(e){return arguments.length?(u=e?Math.round:Number,s):u!=Number},s.sticky=function(e){return arguments.length?(c=e,h=null,s):c},s.ratio=function(e){return arguments.length?(p=e,s):p},lr(s,o)},d3.csv=Rr(",","text/csv"),d3.tsv=Rr("	","text/tab-separated-values"),d3.geo={};var mo=Math.PI/180;d3.geo.azimuthal=function(){function e(e){var n=e[0]*mo-s,o=e[1]*mo,f=Math.cos(n),l=Math.sin(n),c=Math.cos(o),h=Math.sin(o),p=t!=="orthographic"?a*h+u*c*f:null,d,v=t==="stereographic"?1/(1+p):t==="gnomonic"?1/p:t==="equidistant"?(d=Math.acos(p),d?d/Math.sin(d):0):t==="equalarea"?Math.sqrt(2/(1+p)):1,m=v*c*l,g=v*(a*c*f-u*h);return[r*m+i[0],r*g+i[1]]}var t="orthographic",n,r=200,i=[480,250],s,o,u,a;return e.invert=function(e){var n=(e[0]-i[0])/r,o=(e[1]-i[1])/r,f=Math.sqrt(n*n+o*o),l=t==="stereographic"?2*Math.atan(f):t==="gnomonic"?Math.atan(f):t==="equidistant"?f:t==="equalarea"?2*Math.asin(.5*f):Math.asin(f),c=Math.sin(l),h=Math.cos(l);return[(s+Math.atan2(n*c,f*u*h+o*a*c))/mo,Math.asin(h*a-(f?o*c*u/f:0))/mo]},e.mode=function(n){return arguments.length?(t=n+"",e):t},e.origin=function(t){return arguments.length?(n=t,s=n[0]*mo,o=n[1]*mo,u=Math.cos(o),a=Math.sin(o),e):n},e.scale=function(t){return arguments.length?(r=+t,e):r},e.translate=function(t){return arguments.length?(i=[+t[0],+t[1]],e):i},e.origin([0,0])},d3.geo.albers=function(){function e(e){var t=u*(mo*e[0]-o),n=Math.sqrt(a-2*u*Math.sin(mo*e[1]))/u;return[i*n*Math.sin(t)+s[0],i*(n*Math.cos(t)-f)+s[1]]}function t(){var t=mo*r[0],i=mo*r[1],s=mo*n[1],l=Math.sin(t),c=Math.cos(t);return o=mo*n[0],u=.5*(l+Math.sin(i)),a=c*c+2*u*l,f=Math.sqrt(a-2*u*Math.sin(s))/u,e}var n=[-98,38],r=[29.5,45.5],i=1e3,s=[480,250],o,u,a,f;return e.invert=function(e){var t=(e[0]-s[0])/i,n=(e[1]-s[1])/i,r=f+n,l=Math.atan2(t,r),c=Math.sqrt(t*t+r*r);return[(o+l/u)/mo,Math.asin((a-c*c*u*u)/(2*u))/mo]},e.origin=function(e){return arguments.length?(n=[+e[0],+e[1]],t()):n},e.parallels=function(e){return arguments.length?(r=[+e[0],+e[1]],t()):r},e.scale=function(t){return arguments.length?(i=+t,e):i},e.translate=function(t){return arguments.length?(s=[+t[0],+t[1]],e):s},t()},d3.geo.albersUsa=function(){function e(e){var s=e[0],o=e[1];return(o>50?n:s<-140?r:o<21?i:t)(e)}var t=d3.geo.albers(),n=d3.geo.albers().origin([-160,60]).parallels([55,65]),r=d3.geo.albers().origin([-160,20]).parallels([8,18]),i=d3.geo.albers().origin([-60,10]).parallels([8,18]);return e.scale=function(s){return arguments.length?(t.scale(s),n.scale(s*.6),r.scale(s),i.scale(s*1.5),e.translate(t.translate())):t.scale()},e.translate=function(s){if(!arguments.length)return t.translate();var o=t.scale()/1e3,u=s[0],a=s[1];return t.translate(s),n.translate([u-400*o,a+170*o]),r.translate([u-190*o,a+200*o]),i.translate([u+580*o,a+430*o]),e},e.scale(t.scale())},d3.geo.bonne=function(){function e(e){var u=e[0]*mo-r,a=e[1]*mo-i;if(s){var f=o+s-a,l=u*Math.cos(a)/f;u=f*Math.sin(l),a=f*Math.cos(l)-o}else u*=Math.cos(a),a*=-1;return[t*u+n[0],t*a+n[1]]}var t=200,n=[480,250],r,i,s,o;return e.invert=function(e){var i=(e[0]-n[0])/t,u=(e[1]-n[1])/t;if(s){var a=o+u,f=Math.sqrt(i*i+a*a);u=o+s-f,i=r+f*Math.atan2(i,a)/Math.cos(u)}else u*=-1,i/=Math.cos(u);return[i/mo,u/mo]},e.parallel=function(t){return arguments.length?(o=1/Math.tan(s=t*mo),e):s/mo},e.origin=function(t){return arguments.length?(r=t[0]*mo,i=t[1]*mo,e):[r/mo,i/mo]},e.scale=function(
n){return arguments.length?(t=+n,e):t},e.translate=function(t){return arguments.length?(n=[+t[0],+t[1]],e):n},e.origin([0,0]).parallel(45)},d3.geo.equirectangular=function(){function e(e){var r=e[0]/360,i=-e[1]/360;return[t*r+n[0],t*i+n[1]]}var t=500,n=[480,250];return e.invert=function(e){var r=(e[0]-n[0])/t,i=(e[1]-n[1])/t;return[360*r,-360*i]},e.scale=function(n){return arguments.length?(t=+n,e):t},e.translate=function(t){return arguments.length?(n=[+t[0],+t[1]],e):n},e},d3.geo.mercator=function(){function e(e){var r=e[0]/360,i=-(Math.log(Math.tan(Math.PI/4+e[1]*mo/2))/mo)/360;return[t*r+n[0],t*Math.max(-0.5,Math.min(.5,i))+n[1]]}var t=500,n=[480,250];return e.invert=function(e){var r=(e[0]-n[0])/t,i=(e[1]-n[1])/t;return[360*r,2*Math.atan(Math.exp(-360*i*mo))/mo-90]},e.scale=function(n){return arguments.length?(t=+n,e):t},e.translate=function(t){return arguments.length?(n=[+t[0],+t[1]],e):n},e},d3.geo.path=function(){function e(e,t){typeof s=="function"&&(o=zr(s.apply(this,arguments))),f(e);var n=a.length?a.join(""):null;return a=[],n}function t(e){return u(e).join(",")}function n(e){var t=i(e[0]),n=0,r=e.length;while(++n<r)t-=i(e[n]);return t}function r(e){var t=d3.geom.polygon(e[0].map(u)),n=t.area(),r=t.centroid(n<0?(n*=-1,1):-1),i=r[0],s=r[1],o=n,a=0,f=e.length;while(++a<f)t=d3.geom.polygon(e[a].map(u)),n=t.area(),r=t.centroid(n<0?(n*=-1,1):-1),i-=r[0],s-=r[1],o-=n;return[i,s,6*o]}function i(e){return Math.abs(d3.geom.polygon(e.map(u)).area())}var s=4.5,o=zr(s),u=d3.geo.albersUsa(),a=[],f=Ur({FeatureCollection:function(e){var t=e.features,n=-1,r=t.length;while(++n<r)a.push(f(t[n].geometry))},Feature:function(e){f(e.geometry)},Point:function(e){a.push("M",t(e.coordinates),o)},MultiPoint:function(e){var n=e.coordinates,r=-1,i=n.length;while(++r<i)a.push("M",t(n[r]),o)},LineString:function(e){var n=e.coordinates,r=-1,i=n.length;a.push("M");while(++r<i)a.push(t(n[r]),"L");a.pop()},MultiLineString:function(e){var n=e.coordinates,r=-1,i=n.length,s,o,u;while(++r<i){s=n[r],o=-1,u=s.length,a.push("M");while(++o<u)a.push(t(s[o]),"L");a.pop()}},Polygon:function(e){var n=e.coordinates,r=-1,i=n.length,s,o,u;while(++r<i){s=n[r],o=-1;if((u=s.length-1)>0){a.push("M");while(++o<u)a.push(t(s[o]),"L");a[a.length-1]="Z"}}},MultiPolygon:function(e){var n=e.coordinates,r=-1,i=n.length,s,o,u,f,l,c;while(++r<i){s=n[r],o=-1,u=s.length;while(++o<u){f=s[o],l=-1;if((c=f.length-1)>0){a.push("M");while(++l<c)a.push(t(f[l]),"L");a[a.length-1]="Z"}}}},GeometryCollection:function(e){var t=e.geometries,n=-1,r=t.length;while(++n<r)a.push(f(t[n]))}}),l=e.area=Ur({FeatureCollection:function(e){var t=0,n=e.features,r=-1,i=n.length;while(++r<i)t+=l(n[r]);return t},Feature:function(e){return l(e.geometry)},Polygon:function(e){return n(e.coordinates)},MultiPolygon:function(e){var t=0,r=e.coordinates,i=-1,s=r.length;while(++i<s)t+=n(r[i]);return t},GeometryCollection:function(e){var t=0,n=e.geometries,r=-1,i=n.length;while(++r<i)t+=l(n[r]);return t}},0),c=e.centroid=Ur({Feature:function(e){return c(e.geometry)},Polygon:function(e){var t=r(e.coordinates);return[t[0]/t[2],t[1]/t[2]]},MultiPolygon:function(e){var t=0,n=e.coordinates,i,s=0,o=0,u=0,a=-1,f=n.length;while(++a<f)i=r(n[a]),s+=i[0],o+=i[1],u+=i[2];return[s/u,o/u]}});return e.projection=function(t){return u=t,e},e.pointRadius=function(t){return typeof t=="function"?s=t:(s=+t,o=zr(s)),e},e},d3.geo.bounds=function(e){var t=Infinity,n=Infinity,r=-Infinity,i=-Infinity;return Wr(e,function(e,s){e<t&&(t=e),e>r&&(r=e),s<n&&(n=s),s>i&&(i=s)}),[[t,n],[r,i]]};var go={Feature:Xr,FeatureCollection:Vr,GeometryCollection:$r,LineString:Jr,MultiLineString:Kr,MultiPoint:Jr,MultiPolygon:Qr,Point:Gr,Polygon:Yr};d3.geo.circle=function(){function e(){}function t(e){return a.distance(e)<u}function n(e){var t=-1,n=e.length,i=[],s,o,f,l,c;while(++t<n)c=a.distance(f=e[t]),c<u?(o&&i.push(ni(o,f)((l-u)/(l-c))),i.push(f),s=o=null):(o=f,!s&&i.length&&(i.push(ni(i[i.length-1],o)((u-l)/(c-l))),s=o)),l=c;return s=e[0],o=i[0],o&&f[0]===s[0]&&f[1]===s[1]&&(f[0]!==o[0]||f[1]!==o[1])&&i.push(o),r(i)}function r(e){var t=0,n=e.length,r,i,s=n?[e[0]]:e,o,u=a.source();while(++t<n){o=a.source(e[t-1])(e[t]).coordinates;for(r=0,i=o.length;++r<i;)s.push(o[r])}return a.source(u),s}var s=[0,0],o=89.99,u=o*mo,a=d3.geo.greatArc().source(s).target(i);e.clip=function(e){return typeof s=="function"&&a.source(s.apply(this,arguments)),f(e)||null};var f=Ur({FeatureCollection:function(e){var t=e.features.map(f).filter(i);return t&&(e=Object.create(e),e.features=t,e)},Feature:function(e){var t=f(e.geometry);return t&&(e=Object.create(e),e.geometry=t,e)},Point:function(e){return t(e.coordinates)&&e},MultiPoint:function(e){var n=e.coordinates.filter(t);return n.length&&{type:e.type,coordinates:n}},LineString:function(e){var t=n(e.coordinates);return t.length&&(e=Object.create(e),e.coordinates=t,e)},MultiLineString:function(e){var t=e.coordinates.map(n).filter(function(e){return e.length});return t.length&&(e=Object.create(e),e.coordinates=t,e)},Polygon:function(e){var t=e.coordinates.map(n);return t[0].length&&(e=Object.create(e),e.coordinates=t,e)},MultiPolygon:function(e){var t=e.coordinates.map(function(e){return e.map(n)}).filter(function(e){return e[0].length});return t.length&&(e=Object.create(e),e.coordinates=t,e)},GeometryCollection:function(e){var t=e.geometries.map(f).filter(i);return t.length&&(e=Object.create(e),e.geometries=t,e)}});return e.origin=function(t){return arguments.length?(s=t,typeof s!="function"&&a.source(s),e):s},e.angle=function(t){return arguments.length?(u=(o=+t)*mo,e):o},d3.rebind(e,a,"precision")},d3.geo.greatArc=function(){function e(){var t=e.distance.apply(this,arguments),r=0,u=s/t,a=[n];while((r+=u)<1)a.push(o(r));return a.push(i),{type:"LineString",coordinates:a}}var t=Zr,n,r=ei,i,s=6*mo,o=ti();return e.distance=function(){return typeof t=="function"&&o.source(n=t.apply(this,arguments)),typeof r=="function"&&o.target(i=r.apply(this,arguments)),o.distance()},e.source=function(r){return arguments.length?(t=r,typeof t!="function"&&o.source(n=t),e):t},e.target=function(t){return arguments.length?(r=t,typeof r!="function"&&o.target(i=r),e):r},e.precision=function(t){return arguments.length?(s=t*mo,e):s/mo},e},d3.geo.greatCircle=d3.geo.circle,d3.geom={},d3.geom.contour=function(e,t){var n=t||ri(e),r=[],i=n[0],s=n[1],o=0,u=0,a=NaN,f=NaN,l=0;do l=0,e(i-1,s-1)&&(l+=1),e(i,s-1)&&(l+=2),e(i-1,s)&&(l+=4),e(i,s)&&(l+=8),l===6?(o=f===-1?-1:1,u=0):l===9?(o=0,u=a===1?-1:1):(o=yo[l],u=bo[l]),o!=a&&u!=f&&(r.push([i,s]),a=o,f=u),i+=o,s+=u;while(n[0]!=i||n[1]!=s);return r};var yo=[1,0,1,1,-1,0,-1,1,0,0,0,0,-1,0,-1,NaN],bo=[0,-1,0,0,0,-1,0,0,1,-1,1,1,0,-1,0,NaN];d3.geom.hull=function(e){if(e.length<3)return[];var t=e.length,n=t-1,r=[],i=[],s,o,u=0,a,f,l,c,h,p,d,v;for(s=1;s<t;++s)e[s][1]<e[u][1]?u=s:e[s][1]==e[u][1]&&(u=e[s][0]<e[u][0]?s:u);for(s=0;s<t;++s){if(s===u)continue;f=e[s][1]-e[u][1],a=e[s][0]-e[u][0],r.push({angle:Math.atan2(f,a),index:s})}r.sort(function(e,t){return e.angle-t.angle}),d=r[0].angle,p=r[0].index,h=0;for(s=1;s<n;++s)o=r[s].index,d==r[s].angle?(a=e[p][0]-e[u][0],f=e[p][1]-e[u][1],l=e[o][0]-e[u][0],c=e[o][1]-e[u][1],a*a+f*f>=l*l+c*c?r[s].index=-1:(r[h].index=-1,d=r[s].angle,h=s,p=o)):(d=r[s].angle,h=s,p=o);i.push(u);for(s=0,o=0;s<2;++o)r[o].index!==-1&&(i.push(r[o].index),s++);v=i.length;for(;o<n;++o){if(r[o].index===-1)continue;while(!ii(i[v-2],i[v-1],r[o].index,e))--v;i[v++]=r[o].index}var m=[];for(s=0;s<v;++s)m.push(e[i[s]]);return m},d3.geom.polygon=function(e){return e.area=function(){var t=0,n=e.length,r=e[n-1][0]*e[0][1],i=e[n-1][1]*e[0][0];while(++t<n)r+=e[t-1][0]*e[t][1],i+=e[t-1][1]*e[t][0];return(i-r)*.5},e.centroid=function(t){var n=-1,r=e.length,i=0,s=0,o,u=e[r-1],a;arguments.length||(t=-1/(6*e.area()));while(++n<r)o=u,u=e[n],a=o[0]*u[1]-u[0]*o[1],i+=(o[0]+u[0])*a,s+=(o[1]+u[1])*a;return[i*t,s*t]},e.clip=function(t){var n,r=-1,i=e.length,s,o,u=e[i-1],a,f,l;while(++r<i){n=t.slice(),t.length=0,a=e[r],f=n[(o=n.length)-1],s=-1;while(++s<o)l=n[s],si(l,u,a)?(si(f,u,a)||t.push(oi(f,l,u,a)),t.push(l)):si(f,u,a)&&t.push(oi(f,l,u,a)),f=l;u=a}return t},e},d3.geom.voronoi=function(e){var t=e.map(function(){return[]});return ui(e,function(e){var n,r,i,s,o,u;e.a===1&&e.b>=0?(n=e.ep.r,r=e.ep.l):(n=e.ep.l,r=e.ep.r),e.a===1?(o=n?n.y:-1e6,i=e.c-e.b*o,u=r?r.y:1e6,s=e.c-e.b*u):(i=n?n.x:-1e6,o=e.c-e.a*i,s=r?r.x:1e6,u=e.c-e.a*s);var a=[i,o],f=[s,u];t[e.region.l.index].push(a,f),t[e.region.r.index].push(a,f)}),t.map(function(t,n){var r=e[n][0],i=e[n][1];return t.forEach(function(e){e.angle=Math.atan2(e[0]-r,e[1]-i)}),t.sort(function(e,t){return e.angle-t.angle}).filter(function(e,n){return!n||e.angle-t[n-1].angle>1e-10})})};var wo={l:"r",r:"l"};d3.geom.delaunay=function(e){var t=e.map(function(){return[]}),n=[];return ui(e,function(n){t[n.region.l.index].push(e[n.region.r.index])}),t.forEach(function(t,r){var i=e[r],s=i[0],o=i[1];t.forEach(function(e){e.angle=Math.atan2(e[0]-s,e[1]-o)}),t.sort(function(e,t){return e.angle-t.angle});for(var u=0,a=t.length-1;u<a;u++)n.push([i,t[u],t[u+1]])}),n},d3.geom.quadtree=function(e,t,n,r,i){function s(e,t,n,r,i,s){if(isNaN(t.x)||isNaN(t.y))return;if(e.leaf){var u=e.point;u?Math.abs(u.x-t.x)+Math.abs(u.y-t.y)<.01?o(e,t,n,r,i,s):(e.point=null,o(e,u,n,r,i,s),o(e,t,n,r,i,s)):e.point=t}else o(e,t,n,r,i,s)}function o(e,t,n,r,i,o){var u=(n+i)*.5,a=(r+o)*.5,f=t.x>=u,l=t.y>=a,c=(l<<1)+f;e.leaf=!1,e=e.nodes[c]||(e.nodes[c]=ai()),f?n=u:i=u,l?r=a:o=a,s(e,t,n,r,i,o)}var u,a=-1,f=e.length;f&&isNaN(e[0].x)&&(e=e.map(li));if(arguments.length<5)if(arguments.length===3)i=r=n,n=t;else{t=n=Infinity,r=i=-Infinity;while(++a<f)u=e[a],u.x<t&&(t=u.x),u.y<n&&(n=u.y),u.x>r&&(r=u.x),u.y>i&&(i=u.y);var l=r-t,c=i-n;l>c?i=n+l:r=t+c}var h=ai();return h.add=function(e){s(h,e,t,n,r,i)},h.visit=function(e){fi(e,h,t,n,r,i)},e.forEach(h.add),h},d3.time={};var Eo=Date,So=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];ci.prototype={getDate:function(){return this._.getUTCDate()},getDay:function(){return this._.getUTCDay()},getFullYear:function(){return this._.getUTCFullYear()},getHours:function(){return this._.getUTCHours()},getMilliseconds:function(){return this._.getUTCMilliseconds()},getMinutes:function(){return this._.getUTCMinutes()},getMonth:function(){return this._.getUTCMonth()},getSeconds:function(){return this._.getUTCSeconds()},getTime:function(){return this._.getTime()},getTimezoneOffset:function(){return 0},valueOf:function(){return this._.valueOf()},setDate:function(){xo.setUTCDate.apply(this._,arguments)},setDay:function(){xo.setUTCDay.apply(this._,arguments)},setFullYear:function(){xo.setUTCFullYear.apply(this._,arguments)},setHours:function(){xo.setUTCHours.apply(this._,arguments)},setMilliseconds:function(){xo.setUTCMilliseconds.apply(this._,arguments)},setMinutes:function(){xo.setUTCMinutes.apply(this._,arguments)},setMonth:function(){xo.setUTCMonth.apply(this._,arguments)},setSeconds:function(){xo.setUTCSeconds.apply(this._,arguments)},setTime:function(){xo.setTime.apply(this._,arguments)}};var xo=Date.prototype,To="%a %b %e %H:%M:%S %Y",No="%m/%d/%y",Co="%H:%M:%S",ko=So,Lo=ko.map(hi),Ao=["January","February","March","April","May","June","July","August","September","October","November","December"],Oo=Ao.map(hi);d3.time.format=function(e){function t(t){var r=[],i=-1,s=0,o,u;while(++i<n)e.charCodeAt(i)==37&&(r.push(e.substring(s,i),(u=Ro[o=e.charAt(++i)])?u(t):o),s=i+1);return r.push(e.substring(s,i)),r.join("")}var n=e.length;return t.parse=function(t){var n={y:1900,m:0,d:1,H:0,M:0,S:0,L:0},r=pi(n,e,t,0);if(r!=t.length)return null;"p"in n&&(n.H=n.H%12+n.p*12);var i=new Eo;return i.setFullYear(n.y,n.m,n.d),i.setHours(n.H,n.M,n.S,n.L),i},t.toString=function(){return e},t};var Mo=d3.format("02d"),_o=d3.format("03d"),Do=d3.format("04d"),Po=d3.format("2d"),Ho=di(ko),Bo=di(Lo),jo=di(Ao),Fo=vi(Ao),Io=di(Oo),qo=vi(Oo),Ro={a:function(e){return Lo[e.getDay()]},A:function(e){return ko[e.getDay()]},b:function(e){return Oo[e.getMonth()]},B:function(e){return Ao[e.getMonth()]},c:d3.time.format(To),d:function(e){return Mo(e.getDate())},e:function(e){return Po(e.getDate())},H:function(e){return Mo(e.getHours())},I:function(e){return Mo(e.getHours()%12||12)},j:function(e){return _o(1+d3.time.dayOfYear(e))},L:function(e){return _o(e.getMilliseconds())},m:function(e){return Mo(e.getMonth()+1)},M:function(e){return Mo(e.getMinutes())},p:function(e){return e.getHours()>=12?"PM":"AM"},S:function(e){return Mo(e.getSeconds())},U:function(e){return Mo(d3.time.sundayOfYear(e))},w:function(e){return e.getDay()},W:function(e){return Mo(d3.time.mondayOfYear(e))},x:d3.time.format(No),X:d3.time.format(Co),y:function(e){return Mo(e.getFullYear()%100)},Y:function(e){return Do(e.getFullYear()%1e4)},Z:Di,"%":function(e){return"%"}},Uo={a:mi,A:gi,b:yi,B:bi,c:wi,d:ki,e:ki,H:Li,I:Li,L:Mi,m:Ci,M:Ai,p:_i,S:Oi,x:Ei,X:Si,y:Ti,Y:xi},zo=/^\s*\d+/,Wo=d3.map({am:0,pm:1});d3.time.format.utc=function(e){function t(e){try{Eo=ci;var t=new Eo;return t._=e,n(t)}finally{Eo=Date}}var n=d3.time.format(e);return t.parse=function(e){try{Eo=ci;var t=n.parse(e);return t&&t._}finally{Eo=Date}},t.toString=n.toString,t};var Xo=d3.time.format.utc("%Y-%m-%dT%H:%M:%S.%LZ");d3.time.format.iso=Date.prototype.toISOString?Pi:Xo,Pi.parse=function(e){var t=new Date(e);return isNaN(t)?null:t},Pi.toString=Xo.toString,d3.time.second=Hi(function(e){return new Eo(Math.floor(e/1e3)*1e3)},function(e,t){e.setTime(e.getTime()+Math.floor(t)*1e3)},function(e){return e.getSeconds()}),d3.time.seconds=d3.time.second.range,d3.time.seconds.utc=d3.time.second.utc.range,d3.time.minute=Hi(function(e){return new Eo(Math.floor(e/6e4)*6e4)},function(e,t){e.setTime(e.getTime()+Math.floor(t)*6e4)},function(e){return e.getMinutes()}),d3.time.minutes=d3.time.minute.range,d3.time.minutes.utc=d3.time.minute.utc.range,d3.time.hour=Hi(function(e){var t=e.getTimezoneOffset()/60;return new Eo((Math.floor(e/36e5-t)+t)*36e5)},function(e,t){e.setTime(e.getTime()+Math.floor(t)*36e5)},function(e){return e.getHours()}),d3.time.hours=d3.time.hour.range,d3.time.hours.utc=d3.time.hour.utc.range,d3.time.day=Hi(function(e){var t=new Eo(1970,0);return t.setFullYear(e.getFullYear(),e.getMonth(),e.getDate()),t},function(e,t){e.setDate(e.getDate()+t)},function(e){return e.getDate()-1}),d3.time.days=d3.time.day.range,d3.time.days.utc=d3.time.day.utc.range,d3.time.dayOfYear=function(e){var t=d3.time.year(e);return Math.floor((e-t-(e.getTimezoneOffset()-t.getTimezoneOffset())*6e4)/864e5)},So.forEach(function(e,t){e=e.toLowerCase(),t=7-t;var n=d3.time[e]=Hi(function(e){return(e=d3.time.day(e)).setDate(e.getDate()-(e.getDay()+t)%7),e},function(e,t){e.setDate(e.getDate()+Math.floor(t)*7)},function(e){var n=d3.time.year(e).getDay();return Math.floor((d3.time.dayOfYear(e)+(n+t)%7)/7)-(n!==t)});d3.time[e+"s"]=n.range,d3.time[e+"s"].utc=n.utc.range,d3.time[e+"OfYear"]=function(e){var n=d3.time.year(e).getDay();return Math.floor((d3.time.dayOfYear(e)+(n+t)%7)/7)}}),d3.time.week=d3.time.sunday,d3.time.weeks=d3.time.sunday.range,d3.time.weeks.utc=d3.time.sunday.utc.range,d3.time.weekOfYear=d3.time.sundayOfYear,d3.time.month=Hi(function(e){return e=d3.time.day(e),e.setDate(1),e},function(e,t){e.setMonth(e.getMonth()+t)},function(e){return e.getMonth()}),d3.time.months=d3.time.month.range,d3.time.months.utc=d3.time.month.utc.range,d3.time.year=Hi(function(e){return e=d3.time.day(e),e.setMonth(0,1),e},function(e,t){e.setFullYear(e.getFullYear()+t)},function(e){return e.getFullYear()}),d3.time.years=d3.time.year.range,d3.time.years.utc=d3.time.year.utc.range;var Vo=[1e3,5e3,15e3,3e4,6e4,3e5,9e5,18e5,36e5,108e5,216e5,432e5,864e5,1728e5,6048e5,2592e6,7776e6,31536e6],$o=[[d3.time.second,1],[d3.time.second,5],[d3.time.second,15],[d3.time.second,30],[d3.time.minute,1],[d3.time.minute,5],[d3.time.minute,15],[d3.time.minute,30],[d3.time.hour,1],[d3.time.hour,3],[d3.time.hour,6],[d3.time.hour,12],[d3.time.day,1],[d3.time.day,2],[d3.time.week,1],[d3.time.month,1],[d3.time.month,3],[d3.time.year,1]],Jo=[[d3.time.format("%Y"),function(e){return!0}],[d3.time.format("%B"),function(e){return e.getMonth()}],[d3.time.format("%b %d"),function(e){return e.getDate()!=1}],[d3.time.format("%a %d"),function(e){return e.getDay()&&e.getDate()!=1}],[d3.time.format("%I %p"),function(e){return e.getHours()}],[d3.time.format("%I:%M"),function(e){return e.getMinutes()}],[d3.time.format(":%S"),function(e){return e.getSeconds()}],[d3.time.format(".%L"),function(e){return e.getMilliseconds()}]],Ko=d3.scale.linear(),Qo=qi(Jo);$o.year=function(e,t){return Ko.domain(e.map(Ui)).ticks(t).map(Ri)},d3.time.scale=function(){return ji(d3.scale.linear(),$o,Qo)};var Go=$o.map(function(e){return[e[0].utc,e[1]]}),Yo=[[d3.time.format.utc("%Y"),function(e){return!0}],[d3.time.format.utc("%B"),function(e){return e.getUTCMonth()}],[d3.time.format.utc("%b %d"),function(e){return e.getUTCDate()!=1}],[d3.time.format.utc("%a %d"),function(e){return e.getUTCDay()&&e.getUTCDate()!=1}],[d3.time.format.utc("%I %p"),function(e){return e.getUTCHours()}],[d3.time.format.utc("%I:%M"),function(e){return e.getUTCMinutes()}],[d3.time.format.utc(":%S"),function(e){return e.getUTCSeconds()}],[d3.time.format.utc(".%L"),function(e){return e.getUTCMilliseconds()}]],Zo=qi(Yo);Go.year=function(e,t){return Ko.domain(e.map(Wi)).ticks(t).map(zi)},d3.time.scale.utc=function(){return ji(d3.scale.linear(),Go,Zo)}})();;
(function(){function t(e,t){return(new Date(t,e+1,0)).getDate()}function n(e,t,n){return function(r,i,s){var o=e(r),u=[];o<r&&t(o);if(s>1)while(o<i){var a=new Date(+o);n(a)%s===0&&u.push(a),t(o)}else while(o<i)u.push(new Date(+o)),t(o);return u}}var e=window.nv||{};e.version="0.0.1a",e.dev=!0,window.nv=e,e.tooltip={},e.utils={},e.models={},e.charts={},e.graphs=[],e.logs={},e.dispatch=d3.dispatch("render_start","render_end"),e.dev&&(e.dispatch.on("render_start",function(t){e.logs.startTime=+(new Date)}),e.dispatch.on("render_end",function(t){e.logs.endTime=+(new Date),e.logs.totalTime=e.logs.endTime-e.logs.startTime,e.log("total",e.logs.totalTime)})),e.log=function(){if(e.dev&&console.log&&console.log.apply)console.log.apply(console,arguments);else if(e.dev&&console.log&&Function.prototype.bind){var t=Function.prototype.bind.call(console.log,console);t.apply(console,arguments)}return arguments[arguments.length-1]},e.render=function(n){n=n||1,e.render.active=!0,e.dispatch.render_start(),setTimeout(function(){var t,r;for(var i=0;i<n&&(r=e.render.queue[i]);i++)t=r.generate(),typeof r.callback==typeof Function&&r.callback(t),e.graphs.push(t);e.render.queue.splice(0,i),e.render.queue.length?setTimeout(arguments.callee,0):(e.render.active=!1,e.dispatch.render_end())},0)},e.render.active=!1,e.render.queue=[],e.addGraph=function(t){typeof arguments[0]==typeof Function&&(t={generate:arguments[0],callback:arguments[1]}),e.render.queue.push(t),e.render.active||e.render()},e.identity=function(e){return e},e.strip=function(e){return e.replace(/(\s|&)/g,"")},d3.time.monthEnd=function(e){return new Date(e.getFullYear(),e.getMonth(),0)},d3.time.monthEnds=n(d3.time.monthEnd,function(e){e.setUTCDate(e.getUTCDate()+1),e.setDate(t(e.getMonth()+1,e.getFullYear()))},function(e){return e.getMonth()}),function(){var t=window.nv.tooltip={};t.show=function(t,n,r,i,s,o){var u=document.createElement("div");u.className="nvtooltip "+(o?o:"xy-tooltip"),r=r||"s",i=i||20;var a=s;if(!s||s.tagName.match(/g|svg/i))a=document.getElementsByTagName("body")[0];u.innerHTML=n,u.style.left=0,u.style.top=0,u.style.opacity=0,a.appendChild(u);var f=parseInt(u.offsetHeight),l=parseInt(u.offsetWidth),c=e.utils.windowSize().width,h=e.utils.windowSize().height,p=window.scrollY,d=window.scrollX,v,m;h=window.innerWidth>=document.body.scrollWidth?h:h-16,c=window.innerHeight>=document.body.scrollHeight?c:c-16;var g=function(e){var t=m;do isNaN(e.offsetTop)||(t+=e.offsetTop);while(e=e.offsetParent);return t},y=function(e){var t=v;do isNaN(e.offsetLeft)||(t+=e.offsetLeft);while(e=e.offsetParent);return t};switch(r){case"e":v=t[0]-l-i,m=t[1]-f/2;var b=y(u),w=g(u);b<d&&(v=t[0]+i>d?t[0]+i:d-b+v),w<p&&(m=p-w+m),w+f>p+h&&(m=p+h-w+m-f);break;case"w":v=t[0]+i,m=t[1]-f/2,b+l>c&&(v=t[0]-l-i),w<p&&(m=p+5),w+f>p+h&&(m=p-f-5);break;case"n":v=t[0]-l/2-5,m=t[1]+i;var b=y(u),w=g(u);b<d&&(v=d+5),b+l>c&&(v=v-l/2+5),w+f>p+h&&(m=p+h-w+m-f);break;case"s":v=t[0]-l/2,m=t[1]-f-i;var b=y(u),w=g(u);b<d&&(v=d+5),b+l>c&&(v=v-l/2+5),p>w&&(m=p)}return u.style.left=v+"px",u.style.top=m+"px",u.style.opacity=1,u.style.position="absolute",u.style.pointerEvents="none",u},t.cleanup=function(){var e=document.getElementsByClassName("nvtooltip"),t=[];while(e.length)t.push(e[0]),e[0].style.transitionDelay="0 !important",e[0].style.opacity=0,e[0].className="nvtooltip-pending-removal";setTimeout(function(){while(t.length){var e=t.pop();e.parentNode.removeChild(e)}},500)}}(),e.utils.windowSize=function(){var e={width:640,height:480};return document.body&&document.body.offsetWidth&&(e.width=document.body.offsetWidth,e.height=document.body.offsetHeight),document.compatMode=="CSS1Compat"&&document.documentElement&&document.documentElement.offsetWidth&&(e.width=document.documentElement.offsetWidth,e.height=document.documentElement.offsetHeight),window.innerWidth&&window.innerHeight&&(e.width=window.innerWidth,e.height=window.innerHeight),e},e.utils.windowResize=function(e){var t=window.onresize;window.onresize=function(n){typeof t=="function"&&t(n),e(n)}},e.utils.getColor=function(t){return arguments.length?Object.prototype.toString.call(t)==="[object Array]"?function(e,n){return e.color||t[n%t.length]}:t:e.utils.defaultColor()},e.utils.defaultColor=function(){var e=d3.scale.category20().range();return function(t,n){return t.color||e[n%e.length]}},e.utils.customTheme=function(e,t,n){t=t||function(e){return e.key},n=n||d3.scale.category20().range();var r=n.length;return function(i,s){var o=t(i);return r||(r=n.length),typeof e[o]!="undefined"?typeof e[o]=="function"?e[o]():e[o]:n[--r]}},e.utils.pjax=function(t,n){function r(r){d3.html(r,function(r){var i=d3.select(n).node();i.parentNode.replaceChild(d3.select(r).select(n).node(),i),e.utils.pjax(t,n)})}d3.selectAll(t).on("click",function(){history.pushState(this.href,this.textContent,this.href),r(this.href),d3.event.preventDefault()}),d3.select(window).on("popstate",function(){d3.event.state&&r(d3.event.state)})},e.utils.calcApproxTextWidth=function(e){if(e instanceof d3.selection){var t=parseInt(e.style("font-size").replace("px","")),n=e.text().length;return n*t*.5}return 0},e.models.axis=function(){function d(r){return r.each(function(r){var d=d3.select(this),v=d.selectAll("g.nv-wrap.nv-axis").data([r]),m=v.enter().append("g").attr("class","nvd3 nv-wrap nv-axis"),g=m.append("g"),y=v.select("g");h!==null?e.ticks(h):(e.orient()=="top"||e.orient()=="bottom")&&e.ticks(Math.abs(i.range()[1]-i.range()[0])/100),d3.transition(y).call(e),p=p||e.scale();var b=e.tickFormat();b==null&&(b=p.tickFormat());var w=y.selectAll("text.nv-axislabel").data([s||null]);w.exit().remove();switch(e.orient()){case"top":w.enter().append("text").attr("class","nv-axislabel");var E=i.range().length==2?i.range()[1]:i.range()[i.range().length-1]+(i.range()[1]-i.range()[0]);w.attr("text-anchor","middle").attr("y",0).attr("x",E/2);if(o){var S=v.selectAll("g.nv-axisMaxMin").data(i.domain());S.enter().append("g").attr("class","nv-axisMaxMin").append("text"),S.exit().remove(),S.attr("transform",function(e,t){return"translate("+i(e)+",0)"}).select("text").attr("dy","0em").attr("y",-e.tickPadding()).attr("text-anchor","middle").text(function(e,t){var n=b(e);return(""+n).match("NaN")?"":n}),d3.transition(S).attr("transform",function(e,t){return"translate("+i.range()[t]+",0)"})}break;case"bottom":var x=36,T=30,N=y.selectAll("g").select("text");if(a%360){N.each(function(e,t){var n=this.getBBox().width;n>T&&(T=n)});var C=Math.abs(Math.sin(a*Math.PI/180)),x=(C?C*T:T)+30;N.attr("transform",function(e,t,n){return"rotate("+a+" 0,0)"}).attr("text-anchor",a%360>0?"start":"end")}w.enter().append("text").attr("class","nv-axislabel");var E=i.range().length==2?i.range()[1]:i.range()[i.range().length-1]+(i.range()[1]-i.range()[0]);w.attr("text-anchor","middle").attr("y",x).attr("x",E/2);if(o){var S=v.selectAll("g.nv-axisMaxMin").data([i.domain()[0],i.domain()[i.domain().length-1]]);S.enter().append("g").attr("class","nv-axisMaxMin").append("text"),S.exit().remove(),S.attr("transform",function(e,t){return"translate("+(i(e)+(c?i.rangeBand()/2:0))+",0)"}).select("text").attr("dy",".71em").attr("y",e.tickPadding()).attr("transform",function(e,t,n){return"rotate("+a+" 0,0)"}).attr("text-anchor",a?a%360>0?"start":"end":"middle").text(function(e,t){var n=b(e);return(""+n).match("NaN")?"":n}),d3.transition(S).attr("transform",function(e,t){return"translate("+(i(e)+(c?i.rangeBand()/2:0))+",0)"})}l&&N.attr("transform",function(e,t){return"translate(0,"+(t%2==0?"0":"12")+")"});break;case"right":w.enter().append("text").attr("class","nv-axislabel"),w.attr("text-anchor",f?"middle":"begin").attr("transform",f?"rotate(90)":"").attr("y",f?-Math.max(t.right,n)+12:-10).attr("x",f?i.range()[0]/2:e.tickPadding());if(o){var S=v.selectAll("g.nv-axisMaxMin").data(i.domain());S.enter().append("g").attr("class","nv-axisMaxMin").append("text").style("opacity",0),S.exit().remove(),S.attr("transform",function(e,t){return"translate(0,"+i(e)+")"}).select("text").attr("dy",".32em").attr("y",0).attr("x",e.tickPadding()).attr("text-anchor","start").text(function(e,t){var n=b(e);return(""+n).match("NaN")?"":n}),d3.transition(S).attr("transform",function(e,t){return"translate(0,"+i.range()[t]+")"}).select("text").style("opacity",1)}break;case"left":w.enter().append("text").attr("class","nv-axislabel"),w.attr("text-anchor",f?"middle":"end").attr("transform",f?"rotate(-90)":"").attr("y",f?-Math.max(t.left,n)+12:-10).attr("x",f?-i.range()[0]/2:-e.tickPadding());if(o){var S=v.selectAll("g.nv-axisMaxMin").data(i.domain());S.enter().append("g").attr("class","nv-axisMaxMin").append("text").style("opacity",0),S.exit().remove(),S.attr("transform",function(e,t){return"translate(0,"+p(e)+")"}).select("text").attr("dy",".32em").attr("y",0).attr("x",-e.tickPadding()).attr("text-anchor","end").text(function(e,t){var n=b(e);return(""+n).match("NaN")?"":n}),d3.transition(S).attr("transform",function(e,t){return"translate(0,"+i.range()[t]+")"}).select("text").style("opacity",1)}}w.text(function(e){return e}),o&&(e.orient()==="left"||e.orient()==="right")&&(y.selectAll("g").each(function(e,t){d3.select(this).select("text").attr("opacity",1);if(i(e)<i.range()[1]+10||i(e)>i.range()[0]-10)(e>1e-10||e<-1e-10)&&d3.select(this).attr("opacity",0),d3.select(this).select("text").attr("opacity",0)}),i.domain()[0]==i.domain()[1]&&i.domain()[0]==0&&v.selectAll("g.nv-axisMaxMin").style("opacity",function(e,t){return t?0:1}));if(o&&(e.orient()==="top"||e.orient()==="bottom")){var k=[];v.selectAll("g.nv-axisMaxMin").each(function(e,t){try{t?k.push(i(e)-this.getBBox().width-4):k.push(i(e)+this.getBBox().width+4)}catch(n){t?k.push(i(e)-4):k.push(i(e)+4)}}),y.selectAll("g").each(function(e,t){if(i(e)<k[0]||i(e)>k[1])e>1e-10||e<-1e-10?d3.select(this).remove():d3.select(this).select("text").remove()})}u&&y.selectAll("line.tick").filter(function(e){return!parseFloat(Math.round(e*1e5)/1e6)}).classed("zero",!0),p=i.copy()}),d}var e=d3.svg.axis(),t={top:0,right:0,bottom:0,left:0},n=75,r=60,i=d3.scale.linear(),s=null,o=!0,u=!0,a=0,f=!0,l=!1,c=!1,h=null;e.scale(i).orient("bottom").tickFormat(function(e){return e});var p;return d.axis=e,d3.rebind(d,e,"orient","tickValues","tickSubdivide","tickSize","tickPadding","tickFormat"),d3.rebind(d,i,"domain","range","rangeBand","rangeBands"),d.margin=function(e){return arguments.length?(t.top=typeof e.top!="undefined"?e.top:t.top,t.right=typeof e.right!="undefined"?e.right:t.right,t.bottom=typeof e.bottom!="undefined"?e.bottom:t.bottom,t.left=typeof e.left!="undefined"?e.left:t.left,d):t},d.width=function(e){return arguments.length?(n=e,d):n},d.ticks=function(e){return arguments.length?(h=e,d):h},d.height=function(e){return arguments.length?(r=e,d):r},d.axisLabel=function(e){return arguments.length?(s=e,d):s},d.showMaxMin=function(e){return arguments.length?(o=e,d):o},d.highlightZero=function(e){return arguments.length?(u=e,d):u},d.scale=function(t){return arguments.length?(i=t,e.scale(i),c=typeof i.rangeBands=="function",d3.rebind(d,i,"domain","range","rangeBand","rangeBands"),d):i},d.rotateYLabel=function(e){return arguments.length?(f=e,d):f},d.rotateLabels=function(e){return arguments.length?(a=e,d):a},d.staggerLabels=function(e){return arguments.length?(l=e,d):l},d},e.models.historicalBar=function(){function g(e){return e.each(function(e){var g=n-t.left-t.right,b=r-t.top-t.bottom,w=d3.select(this);s.domain(d||d3.extent(e[0].values.map(u).concat(f))),c?s.range([g*.5/e[0].values.length,g*(e[0].values.length-.5)/e[0].values.length]):s.range([0,g]),o.domain(v||d3.extent(e[0].values.map(a).concat(l))).range([b,0]);if(s.domain()[0]===s.domain()[1]||o.domain()[0]===o.domain()[1])singlePoint=!0;s.domain()[0]===s.domain()[1]&&(s.domain()[0]?s.domain([s.domain()[0]-s.domain()[0]*.01,s.domain()[1]+s.domain()[1]*.01]):s.domain([-1,1])),o.domain()[0]===o.domain()[1]&&(o.domain()[0]?o.domain([o.domain()[0]+o.domain()[0]*.01,o.domain()[1]-o.domain()[1]*.01]):o.domain([-1,1]));var E=w.selectAll("g.nv-wrap.nv-bar").data([e[0].values]),S=E.enter().append("g").attr("class","nvd3 nv-wrap nv-bar"),T=S.append("defs"),N=S.append("g"),C=E.select("g");N.append("g").attr("class","nv-bars"),E.attr("transform","translate("+t.left+","+t.top+")"),w.on("click",function(e,t){m.chartClick({data:e,index:t,pos:d3.event,id:i})}),T.append("clipPath").attr("id","nv-chart-clip-path-"+i).append("rect"),E.select("#nv-chart-clip-path-"+i+" rect").attr("width",g).attr("height",b),C.attr("clip-path",h?"url(#nv-chart-clip-path-"+i+")":"");var k=E.select(".nv-bars").selectAll(".nv-bar").data(function(e){return e});k.exit().remove();var L=k.enter().append("rect").attr("x",0).attr("y",function(e,t){return o(Math.max(0,a(e,t)))}).attr("height",function(e,t){return Math.abs(o(a(e,t))-o(0))}).on("mouseover",function(t,n){d3.select(this).classed("hover",!0),m.elementMouseover({point:t,series:e[0],pos:[s(u(t,n)),o(a(t,n))],pointIndex:n,seriesIndex:0,e:d3.event})}).on("mouseout",function(t,n){d3.select(this).classed("hover",!1),m.elementMouseout({point:t,series:e[0],pointIndex:n,seriesIndex:0,e:d3.event})}).on("click",function(e,t){m.elementClick({value:a(e,t),data:e,index:t,pos:[s(u(e,t)),o(a(e,t))],e:d3.event,id:i}),d3.event.stopPropagation()}).on("dblclick",function(e,t){m.elementDblClick({value:a(e,t),data:e,index:t,pos:[s(u(e,t)),o(a(e,t))],e:d3.event,id:i}),d3.event.stopPropagation()});k.attr("fill",function(e,t){return p(e,t)}).attr("class",function(e,t,n){return(a(e,t)<0?"nv-bar negative":"nv-bar positive")+" nv-bar-"+n+"-"+t}).attr("transform",function(t,n){return"translate("+(s(u(t,n))-g/e[0].values.length*.45)+",0)"}).attr("width",g/e[0].values.length*.9),d3.transition(k).attr("y",function(e,t){return a(e,t)<0?o(0):o(0)-o(a(e,t))<1?o(0)-1:o(a(e,t))}).attr("height",function(e,t){return Math.max(Math.abs(o(a(e,t))-o(0)),1)})}),g}var t={top:0,right:0,bottom:0,left:0},n=960,r=500,i=Math.floor(Math.random()*1e4),s=d3.scale.linear(),o=d3.scale.linear(),u=function(e){return e.x},a=function(e){return e.y},f=[],l=[0],c=!1,h=!0,p=e.utils.defaultColor(),d,v,m=d3.dispatch("chartClick","elementClick","elementDblClick","elementMouseover","elementMouseout");return g.dispatch=m,g.x=function(e){return arguments.length?(u=e,g):u},g.y=function(e){return arguments.length?(a=e,g):a},g.margin=function(e){return arguments.length?(t.top=typeof e.top!="undefined"?e.top:t.top,t.right=typeof e.right!="undefined"?e.right:t.right,t.bottom=typeof e.bottom!="undefined"?e.bottom:t.bottom,t.left=typeof e.left!="undefined"?e.left:t.left,g):t},g.width=function(e){return arguments.length?(n=e,g):n},g.height=function(e){return arguments.length?(r=e,g):r},g.xScale=function(e){return arguments.length?(s=e,g):s},g.yScale=function(e){return arguments.length?(o=e,g):o},g.xDomain=function(e){return arguments.length?(d=e,g):d},g.yDomain=function(e){return arguments.length?(v=e,g):v},g.forceX=function(e){return arguments.length?(f=e,g):f},g.forceY=function(e){return arguments.length?(l=e,g):l},g.padData=function(e){return arguments.length?(c=e,g):c},g.clipEdge=function(e){return arguments.length?(h=e,g):h},g.color=function(t){return arguments.length?(p=e.utils.getColor(t),g):p},g.id=function(e){return arguments.length?(i=e,g):i},g},e.models.bullet=function(){function p(e){return e.each(function(e,n){var l=a-t.left-t.right,p=f-t.top-t.bottom,d=d3.select(this),v=i.call(this,e,n).slice().sort(d3.descending),m=s.call(this,e,n).slice().sort(d3.descending),g=o.call(this,e,n).slice().sort(d3.descending),y=d3.scale.linear().domain(d3.extent(d3.merge([u,v]))).range(r?[l,0]:[0,l]),b=this.__chart__||d3.scale.linear().domain([0,Infinity]).range(y.range());this.__chart__=y;var w=d3.min(v),E=d3.max(v),S=v[1],x=d.selectAll("g.nv-wrap.nv-bullet").data([e]),T=x.enter().append("g").attr("class","nvd3 nv-wrap nv-bullet"),N=T.append("g"),C=x.select("g");N.append("rect").attr("class","nv-range nv-rangeMax"),N.append("rect").attr("class","nv-range nv-rangeAvg"),N.append("rect").attr("class","nv-range nv-rangeMin"),N.append("rect").attr("class","nv-measure"),N.append("path").attr("class","nv-markerTriangle"),x.attr("transform","translate("+t.left+","+t.top+")");var k=function(e){return Math.abs(b(e)-b(0))},L=function(e){return Math.abs(y(e)-y(0))},A=function(e){return e<0?b(e):b(0)},O=function(e){return e<0?y(e):y(0)};C.select("rect.nv-rangeMax").attr("height",p).attr("width",L(E>0?E:w)).attr("x",O(E>0?E:w)).datum(E>0?E:w),C.select("rect.nv-rangeAvg").attr("height",p).attr("width",L(S)).attr("x",O(S)).datum(S),C.select("rect.nv-rangeMin").attr("height",p).attr("width",L(E)).attr("x",O(E)).attr("width",L(E>0?w:E)).attr("x",O(E>0?w:E)).datum(E>0?w:E),C.select("rect.nv-measure").style("fill",c).attr("height",p/3).attr("y",p/3).attr("width",g<0?y(0)-y(g[0]):y(g[0])-y(0)).attr("x",O(g)).on("mouseover",function(){h.elementMouseover({value:g[0],label:"Current",pos:[y(g[0]),p/2]})}).on("mouseout",function(){h.elementMouseout({value:g[0],label:"Current"})});var M=p/6;m[0]?C.selectAll("path.nv-markerTriangle").attr("transform",function(e){return"translate("+y(m[0])+","+p/2+")"}).attr("d","M0,"+M+"L"+M+","+ -M+" "+ -M+","+ -M+"Z").on("mouseover",function(){h.elementMouseover({value:m[0],label:"Previous",pos:[y(m[0]),p/2]})}).on("mouseout",function(){h.elementMouseout({value:m[0],label:"Previous"})}):C.selectAll("path.nv-markerTriangle").remove(),x.selectAll(".nv-range").on("mouseover",function(e,t){var n=t?t==1?"Mean":"Minimum":"Maximum";h.elementMouseover({value:e,label:n,pos:[y(e),p/2]})}).on("mouseout",function(e,t){var n=t?t==1?"Mean":"Minimum":"Maximum";h.elementMouseout({value:e,label:n})})}),p}var t={top:0,right:0,bottom:0,left:0},n="left",r=!1,i=function(e){return e.ranges},s=function(e){return e.markers},o=function(e){return e.measures},u=[0],a=380,f=30,l=null,c=e.utils.getColor(["#1f77b4"]),h=d3.dispatch("elementMouseover","elementMouseout");return p.dispatch=h,p.orient=function(e){return arguments.length?(n=e,r=n=="right"||n=="bottom",p):n},p.ranges=function(e){return arguments.length?(i=e,p):i},p.markers=function(e){return arguments.length?(s=e,p):s},p.measures=function(e){return arguments.length?(o=e,p):o},p.forceX=function(e){return arguments.length?(u=e,p):u},p.width=function(e){return arguments.length?(a=e,p):a},p.height=function(e){return arguments.length?(f=e,p):f},p.margin=function(e){return arguments.length?(t.top=typeof e.top!="undefined"?e.top:t.top,t.right=typeof e.right!="undefined"?e.right:t.right,t.bottom=typeof e.bottom!="undefined"?e.bottom:t.bottom,t.left=typeof e.left!="undefined"?e.left:t.left,p):t},p.tickFormat=function(e){return arguments.length?(l=e,p):l},p.color=function(t){return arguments.length?(c=e.utils.getColor(t),p):c},p},e.models.bulletChart=function(){function m(e){return e.each(function(n,h){var g=d3.select(this),y=(a||parseInt(g.style("width"))||960)-i.left-i.right,b=f-i.top-i.bottom,w=this;m.update=function(){m(e)},m.container=this;if(!n||!s.call(this,n,h)){var E=g.selectAll(".nv-noData").data([p]);return E.enter().append("text").attr("class","nvd3 nv-noData").attr("dy","-.7em").style("text-anchor","middle"),E.attr("x",i.left+y/2).attr("y",18+i.top+b/2).text(function(e){return e}),m}g.selectAll(".nv-noData").remove();var S=s.call(this,n,h).slice().sort(d3.descending),x=o.call(this,n,h).slice().sort(d3.descending),T=u.call(this,n,h).slice().sort(d3.descending),N=g.selectAll("g.nv-wrap.nv-bulletChart").data([n]),C=N.enter().append("g").attr("class","nvd3 nv-wrap nv-bulletChart"),k=C.append("g"),L=N.select("g");k.append("g").attr("class","nv-bulletWrap"),k.append("g").attr("class","nv-titles"),N.attr("transform","translate("+i.left+","+i.top+")");var A=d3.scale.linear().domain([0,Math.max(S[0],x[0],T[0])]).range(r?[y,0]:[0,y]),O=this.__chart__||d3.scale.linear().domain([0,Infinity]).range(A.range());this.__chart__=A;var M=function(e){return Math.abs(O(e)-O(0))},_=function(e){return Math.abs(A(e)-A(0))},D=k.select(".nv-titles").append("g").attr("text-anchor","end").attr("transform","translate(-6,"+(f-i.top-i.bottom)/2+")");D.append("text").attr("class","nv-title").text(function(e){return e.title}),D.append("text").attr("class","nv-subtitle").attr("dy","1em").text(function(e){return e.subtitle}),t.width(y).height(b);var P=L.select(".nv-bulletWrap");d3.transition(P).call(t);var H=l||A.tickFormat(y/100),B=L.selectAll("g.nv-tick").data(A.ticks(y/50),function(e){return this.textContent||H(e)}),j=B.enter().append("g").attr("class","nv-tick").attr("transform",function(e){return"translate("+O(e)+",0)"}).style("opacity",1e-6);j.append("line").attr("y1",b).attr("y2",b*7/6),j.append("text").attr("text-anchor","middle").attr("dy","1em").attr("y",b*7/6).text(H);var F=d3.transition(B).attr("transform",function(e){return"translate("+A(e)+",0)"}).style("opacity",1);F.select("line").attr("y1",b).attr("y2",b*7/6),F.select("text").attr("y",b*7/6),d3.transition(B.exit()).attr("transform",function(e){return"translate("+A(e)+",0)"}).style("opacity",1e-6).remove(),d.on("tooltipShow",function(e){e.key=n.title,c&&v(e,w.parentNode)})}),d3.timer.flush(),m}var t=e.models.bullet(),n="left",r=!1,i={top:5,right:40,bottom:20,left:120},s=function(e){return e.ranges},o=function(e){return e.markers},u=function(e){return e.measures},a=null,f=55,l=null,c=!0,h=function(e,t,n,r,i){return"<h3>"+t+"</h3>"+"<p>"+n+"</p>"},p="No Data Available.",d=d3.dispatch("tooltipShow","tooltipHide"),v=function(t,n){var r=t.pos[0]+(n.offsetLeft||0)+i.left,s=t.pos[1]+(n.offsetTop||0)+i.top,o=h(t.key,t.label,t.value,t,m);e.tooltip.show([r,s],o,t.value<0?"e":"w",null,n)};return t.dispatch.on("elementMouseover.tooltip",function(e){d.tooltipShow(e)}),t.dispatch.on("elementMouseout.tooltip",function(e){d.tooltipHide(e)}),d.on("tooltipHide",function(){c&&e.tooltip.cleanup()}),m.dispatch=d,m.bullet=t,d3.rebind(m,t,"color"),m.orient=function(e){return arguments.length?(n=e,r=n=="right"||n=="bottom",m):n},m.ranges=function(e){return arguments.length?(s=e,m):s},m.markers=function(e){return arguments.length?(o=e,m):o},m.measures=function(e){return arguments.length?(u=e,m):u},m.width=function(e){return arguments.length?(a=e,m):a},m.height=function(e){return arguments.length?(f=e,m):f},m.margin=function(e){return arguments.length?(i.top=typeof e.top!="undefined"?e.top:i.top,i.right=typeof e.right!="undefined"?e.right:i.right,i.bottom=typeof e.bottom!="undefined"?e.bottom:i.bottom,i.left=typeof e.left!="undefined"?e.left:i.left,m):i},m.tickFormat=function(e){return arguments.length?(l=e,m):l},m.tooltips=function(e){return arguments.length?(c=e,m):c},m.tooltipContent=function(e){return arguments.length?(h=e,m):h},m.noData=function(e){return arguments.length?(p=e,m):p},m},e.models.cumulativeLineChart=function(){function C(e){return e.each(function(d){function P(e,t){d3.select(C.container).style("cursor","ew-resize")}function H(e,t){T.x=d3.event.x,T.i=Math.round(x.invert(T.x)),K()}function B(e,t){d3.select(C.container).style("cursor","auto"),y.index=T.i,S.stateChange(y)}function K(){J.data([T]),C.update()}var L=d3.select(this).classed("nv-chart-"+g,!0),A=this,O=(a||parseInt(L.style("width"))||960)-o.left-o.right,M=(f||parseInt(L.style("height"))||400)-o.top-o.bottom;C.update=function(){C(e)},C.container=this,y.disabled=d.map(function(e){return!!e.disabled});if(!b){var _;b={};for(_ in y)y[_]instanceof Array?b[_]=y[_].slice(0):b[_]=y[_]}var D=d3.behavior.drag().on("dragstart",P).on("drag",H).on("dragend",B);if(!d||!d.length||!d.filter(function(e){return e.values.length}).length){var j=L.selectAll(".nv-noData").data([w]);return j.enter().append("text").attr("class","nvd3 nv-noData").attr("dy","-.7em").style("text-anchor","middle"),j.attr("x",o.left+O/2).attr("y",o.top+M/2).text(function(e){return e}),C}L.selectAll(".nv-noData").remove(),v=t.xScale(),m=t.yScale();if(!p){var F=d.filter(function(e){return!e.disabled}).map(function(e,n){var r=d3.extent(e.values,t.y());return r[0]<-0.95&&(r[0]=-0.95),[(r[0]-r[1])/(1+r[1]),(r[1]-r[0])/(1+r[0])]}),I=[d3.min(F,function(e){return e[0]}),d3.max(F,function(e){return e[1]})];t.yDomain(I)}else t.yDomain(null);x.domain([0,d[0].values.length-1]).range([0,O]).clamp(!0);var d=k(T.i,d),q=L.selectAll("g.nv-wrap.nv-cumulativeLine").data([d]),R=q.enter().append("g").attr("class","nvd3 nv-wrap nv-cumulativeLine").append("g"),U=q.select("g");R.append("g").attr("class","nv-x nv-axis"),R.append("g").attr("class","nv-y nv-axis"),R.append("g").attr("class","nv-background"),R.append("g").attr("class","nv-linesWrap"),R.append("g").attr("class","nv-avgLinesWrap"),R.append("g").attr("class","nv-legendWrap"),R.append("g").attr("class","nv-controlsWrap"),l&&(i.width(O),U.select(".nv-legendWrap").datum(d).call(i),o.top!=i.height()&&(o.top=i.height(),M=(f||parseInt(L.style("height"))||400)-o.top-o.bottom),U.select(".nv-legendWrap").attr("transform","translate(0,"+ -o.top+")"));if(h){var z=[{key:"Re-scale y-axis",disabled:!p}];s.width(140).color(["#444","#444","#444"]),U.select(".nv-controlsWrap").datum(z).attr("transform","translate(0,"+ -o.top+")").call(s)}q.attr("transform","translate("+o.left+","+o.top+")");var W=d.filter(function(e){return e.tempDisabled});q.select(".tempDisabled").remove(),W.length&&q.append("text").attr("class","tempDisabled").attr("x",O/2).attr("y","-.71em").style("text-anchor","end").text(W.map(function(e){return e.key}).join(", ")+" values cannot be calculated for this time period."),R.select(".nv-background").append("rect"),U.select(".nv-background rect").attr("width",O).attr("height",M),t.y(function(e){return e.display.y}).width(O).height(M).color(d.map(function(e,t){return e.color||u(e,t)}).filter(function(e,t){return!d[t].disabled&&!d[t].tempDisabled}));var X=U.select(".nv-linesWrap").datum(d.filter(function(e){return!e.disabled&&!e.tempDisabled}));X.call(t),d.forEach(function(e,t){e.seriesIndex=t});var V=d.filter(function(e){return!e.disabled&&!!E(e)}),$=U.select(".nv-avgLinesWrap").selectAll("line").data(V,function(e){return e.key});$.enter().append("line").style("stroke-width",2).style("stroke-dasharray","10,10").style("stroke",function(e,n){return t.color()(e,e.seriesIndex)}).attr("x1",0).attr("x2",O).attr("y1",function(e){return m(E(e))}).attr("y2",function(e){return m(E(e))}),$.attr("x1",0).attr("x2",O).attr("y1",function(e){return m(E(e))}).attr("y2",function(e){return m(E(e))}),$.exit().remove();var J=X.selectAll(".nv-indexLine").data([T]);J.enter().append("rect").attr("class","nv-indexLine").attr("width",3).attr("x",-2).attr("fill","red").attr("fill-opacity",.5).call(D),J.attr("transform",function(e){return"translate("+x(e.i)+",0)"}).attr("height",M),n.scale(v).ticks(Math.min(d[0].values.length,O/70)).tickSize(-M,0),U.select(".nv-x.nv-axis").attr("transform","translate(0,"+m.range()[0]+")"),d3.transition(U.select(".nv-x.nv-axis")).call(n),r.scale(m).ticks(M/36).tickSize(-O,0),d3.transition(U.select(".nv-y.nv-axis")).call(r),U.select(".nv-background rect").on("click",function(){T.x=d3.mouse(this)[0],T.i=Math.round(x.invert(T.x)),y.index=T.i,S.stateChange(y),K()}),t.dispatch.on("elementClick",function(e){T.i=e.pointIndex,T.x=x(T.i),y.index=T.i,S.stateChange(y),K()}),s.dispatch.on("legendClick",function(t,n){t.disabled=!t.disabled,p=!t.disabled,y.rescaleY=p,S.stateChange(y),e.call(C)}),i.dispatch.on("legendClick",function(t,n){t.disabled=!t.disabled,d.filter(function(e){return!e.disabled}).length||d.map(function(e){return e.disabled=!1,q.selectAll(".nv-series").classed("disabled",!1),e}),y.disabled=d.map(function(e){return!!e.disabled}),S.stateChange(y),e.call(C)}),S.on("tooltipShow",function(e){c&&N(e,A.parentNode)}),S.on("changeState",function(t){typeof t.disabled!="undefined"&&(d.forEach(function(e,n){e.disabled=t.disabled[n]}),y.disabled=t.disabled),typeof t.index!="undefined"&&(T.i=t.index,T.x=x(T.i),y.index=t.index,J.data([T])),typeof t.rescaleY!="undefined"&&(p=t.rescaleY),e.call(C)})}),C}function k(e,n){return n.map(function(n,r){if(!n.values)return n;var i=t.y()(n.values[e],e);return i<-0.95?(n.tempDisabled=!0,n):(n.tempDisabled=!1,n.values=n.values.map(function(e,n){return e.display={y:(t.y()(e,n)-i)/(1+i)},e}),n)})}var t=e.models.line(),n=e.models.axis(),r=e.models.axis(),i=e.models.legend(),s=e.models.legend(),o={top:30,right:30,bottom:50,left:60},u=e.utils.defaultColor(),a=null,f=null,l=!0,c=!0,h=!0,p=!0,d=function(e,t,n,r,i){return"<h3>"+e+"</h3>"+"<p>"+n+" at "+t+"</p>"},v,m,g=t.id(),y={index:0,rescaleY:p},b=null,w="No Data Available.",E=function(e){return e.average},S=d3.dispatch("tooltipShow","tooltipHide","stateChange","changeState");n.orient("bottom").tickPadding(7),r.orient("left");var x=d3.scale.linear(),T={i:0,x:0},N=function(i,s){var o=i.pos[0]+(s.offsetLeft||0),u=i.pos[1]+(s.offsetTop||0),a=n.tickFormat()(t.x()(i.point,i.pointIndex)),f=r.tickFormat()(t.y()(i.point,i.pointIndex)),l=d(i.series.key,a,f,i,C);e.tooltip.show([o,u],l,null,null,s)};return t.dispatch.on("elementMouseover.tooltip",function(e){e.pos=[e.pos[0]+o.left,e.pos[1]+o.top],S.tooltipShow(e)}),t.dispatch.on("elementMouseout.tooltip",function(e){S.tooltipHide(e)}),S.on("tooltipHide",function(){c&&e.tooltip.cleanup()}),C.dispatch=S,C.lines=t,C.legend=i,C.xAxis=n,C.yAxis=r,d3.rebind(C,t,"defined","isArea","x","y","size","xDomain","yDomain","forceX","forceY","interactive","clipEdge","clipVoronoi","id"),C.margin=function(e){return arguments.length?(o.top=typeof e.top!="undefined"?e.top:o.top,o.right=typeof e.right!="undefined"?e.right:o.right,o.bottom=typeof e.bottom!="undefined"?e.bottom:o.bottom,o.left=typeof e.left!="undefined"?e.left:o.left,C):o},C.width=function(e){return arguments.length?(a=e,C):a},C.height=function(e){return arguments.length?(f=e,C):f},C.color=function(t){return arguments.length?(u=e.utils.getColor(t),i.color(u),C):u},C.rescaleY=function(e){return arguments.length?(p=e,p):p},C.showControls=function(e){return arguments.length?(h=e,C):h},C.showLegend=function(e){return arguments.length?(l=e,C):l},C.tooltips=function(e){return arguments.length?(c=e,C):c},C.tooltipContent=function(e){return arguments.length?(d=e,C):d},C.state=function(e){return arguments.length?(y=e,C):y},C.defaultState=function(e){return arguments.length?(b=e,C):b},C.noData=function(e){return arguments.length?(w=e,C):w},C.average=function(e){return arguments.length?(E=e,C):E},C},e.models.discreteBar=function(){function b(e){return e.each(function(e){var i=n-t.left-t.right,b=r-t.top-t.bottom,w=d3.select(this);e=e.map(function(e,t){return e.values=e.values.map(function(e){return e.series=t,e}),e});var E=p&&d?[]:e.map(function(e){return e.values.map(function(e,t){return{x:u(e,t),y:a(e,t),y0:e.y0}})});s.domain(p||d3.merge(E).map(function(e){return e.x})).rangeBands([0,i],.1),o.domain(d||d3.extent(d3.merge(E).map(function(e){return e.y}).concat(f))),c?o.range([b-(o.domain()[0]<0?12:0),o.domain()[1]>0?12:0]):o.range([b,0]),g=g||s,y=y||o.copy().range([o(0),o(0)]);var S=w.selectAll("g.nv-wrap.nv-discretebar").data([e]),T=S.enter().append("g").attr("class","nvd3 nv-wrap nv-discretebar"),N=T.append("g"),C=S.select("g");N.append("g").attr("class","nv-groups"),S.attr("transform","translate("+t.left+","+t.top+")");var k=S.select(".nv-groups").selectAll(".nv-group").data(function(e){return e},function(e){return e.key});k.enter().append("g").style("stroke-opacity",1e-6).style("fill-opacity",1e-6),d3.transition(k.exit()).style("stroke-opacity",1e-6).style("fill-opacity",1e-6).remove(),k.attr("class",function(e,t){return"nv-group nv-series-"+t}).classed("hover",function(e){return e.hover}),d3.transition(k).style("stroke-opacity",1).style("fill-opacity",.75);var L=k.selectAll("g.nv-bar").data(function(e){return e.values});L.exit().remove();var A=L.enter().append("g").attr("transform",function(e,t,n){return"translate("+(s(u(e,t))+s.rangeBand()*.05)+", "+o(0)+")"}).on("mouseover",function(t,n){d3.select(this).classed("hover",!0),v.elementMouseover({value:a(t,n),point:t,series:e[t.series],pos:[s(u(t,n))+s.rangeBand()*(t.series+.5)/e.length,o(a(t,n))],pointIndex:n,seriesIndex:t.series,e:d3.event})}).on("mouseout",function(t,n){d3.select(this).classed("hover",!1),v.elementMouseout({value:a(t,n),point:t,series:e[t.series],pointIndex:n,seriesIndex:t.series,e:d3.event})}).on("click",function(t,n){v.elementClick({value:a(t,n),point:t,series:e[t.series],pos:[s(u(t,n))+s.rangeBand()*(t.series+.5)/e.length,o(a(t,n))],pointIndex:n,seriesIndex:t.series,e:d3.event}),d3.event.stopPropagation()}).on("dblclick",function(t,n){v.elementDblClick({value:a(t,n),point:t,series:e[t.series],pos:[s(u(t,n))+s.rangeBand()*(t.series+.5)/e.length,o(a(t,n))],pointIndex:n,seriesIndex:t.series,e:d3.event}),d3.event.stopPropagation()});A.append("rect").attr("height",0).attr("width",s.rangeBand()*.9/e.length),c?(A.append("text").attr("text-anchor","middle"),L.select("text").attr("x",s.rangeBand()*.9/2).attr("y",function(e,t){return a(e,t)<0?o(a(e,t))-o(0)+12:-4
}).text(function(e,t){return h(a(e,t))})):L.selectAll("text").remove(),L.attr("class",function(e,t){return a(e,t)<0?"nv-bar negative":"nv-bar positive"}).style("fill",function(e,t){return e.color||l(e,t)}).style("stroke",function(e,t){return e.color||l(e,t)}).select("rect").attr("class",m).attr("width",s.rangeBand()*.9/e.length),d3.transition(L).attr("transform",function(e,t){var n=s(u(e,t))+s.rangeBand()*.05,r=a(e,t)<0?o(0):o(0)-o(a(e,t))<1?o(0)-1:o(a(e,t));return"translate("+n+", "+r+")"}).select("rect").attr("height",function(e,t){return Math.max(Math.abs(o(a(e,t))-o(0))||1)}),g=s.copy(),y=o.copy()}),b}var t={top:0,right:0,bottom:0,left:0},n=960,r=500,i=Math.floor(Math.random()*1e4),s=d3.scale.ordinal(),o=d3.scale.linear(),u=function(e){return e.x},a=function(e){return e.y},f=[0],l=e.utils.defaultColor(),c=!1,h=d3.format(",.2f"),p,d,v=d3.dispatch("chartClick","elementClick","elementDblClick","elementMouseover","elementMouseout"),m="discreteBar",g,y;return b.dispatch=v,b.x=function(e){return arguments.length?(u=e,b):u},b.y=function(e){return arguments.length?(a=e,b):a},b.margin=function(e){return arguments.length?(t.top=typeof e.top!="undefined"?e.top:t.top,t.right=typeof e.right!="undefined"?e.right:t.right,t.bottom=typeof e.bottom!="undefined"?e.bottom:t.bottom,t.left=typeof e.left!="undefined"?e.left:t.left,b):t},b.width=function(e){return arguments.length?(n=e,b):n},b.height=function(e){return arguments.length?(r=e,b):r},b.xScale=function(e){return arguments.length?(s=e,b):s},b.yScale=function(e){return arguments.length?(o=e,b):o},b.xDomain=function(e){return arguments.length?(p=e,b):p},b.yDomain=function(e){return arguments.length?(d=e,b):d},b.forceY=function(e){return arguments.length?(f=e,b):f},b.color=function(t){return arguments.length?(l=e.utils.getColor(t),b):l},b.id=function(e){return arguments.length?(i=e,b):i},b.showValues=function(e){return arguments.length?(c=e,b):c},b.valueFormat=function(e){return arguments.length?(h=e,b):h},b.rectClass=function(e){return arguments.length?(m=e,b):m},b},e.models.discreteBarChart=function(){function m(e){return e.each(function(u){var l=d3.select(this),g=this,b=(s||parseInt(l.style("width"))||960)-i.left-i.right,w=(o||parseInt(l.style("height"))||400)-i.top-i.bottom;m.update=function(){d.beforeUpdate(),e.transition().call(m)},m.container=this;if(!u||!u.length||!u.filter(function(e){return e.values.length}).length){var E=l.selectAll(".nv-noData").data([p]);return E.enter().append("text").attr("class","nvd3 nv-noData").attr("dy","-.7em").style("text-anchor","middle"),E.attr("x",i.left+b/2).attr("y",i.top+w/2).text(function(e){return e}),m}l.selectAll(".nv-noData").remove(),c=t.xScale(),h=t.yScale();var S=l.selectAll("g.nv-wrap.nv-discreteBarWithAxes").data([u]),T=S.enter().append("g").attr("class","nvd3 nv-wrap nv-discreteBarWithAxes").append("g"),N=T.append("defs"),C=S.select("g");T.append("g").attr("class","nv-x nv-axis"),T.append("g").attr("class","nv-y nv-axis"),T.append("g").attr("class","nv-barsWrap"),C.attr("transform","translate("+i.left+","+i.top+")"),t.width(b).height(w);var k=C.select(".nv-barsWrap").datum(u.filter(function(e){return!e.disabled}));d3.transition(k).call(t),N.append("clipPath").attr("id","nv-x-label-clip-"+t.id()).append("rect"),C.select("#nv-x-label-clip-"+t.id()+" rect").attr("width",c.rangeBand()*(a?2:1)).attr("height",16).attr("x",-c.rangeBand()/(a?1:2)),n.scale(c).ticks(b/100).tickSize(-w,0),C.select(".nv-x.nv-axis").attr("transform","translate(0,"+(h.range()[0]+(t.showValues()&&h.domain()[0]<0?16:0))+")"),C.select(".nv-x.nv-axis").transition().duration(0).call(n);var L=C.select(".nv-x.nv-axis").selectAll("g");a&&L.selectAll("text").attr("transform",function(e,t,n){return"translate(0,"+(n%2==0?"5":"17")+")"}),r.scale(h).ticks(w/36).tickSize(-b,0),d3.transition(C.select(".nv-y.nv-axis")).call(r),d.on("tooltipShow",function(e){f&&v(e,g.parentNode)})}),m}var t=e.models.discreteBar(),n=e.models.axis(),r=e.models.axis(),i={top:15,right:10,bottom:50,left:60},s=null,o=null,u=e.utils.getColor(),a=!1,f=!0,l=function(e,t,n,r,i){return"<h3>"+t+"</h3>"+"<p>"+n+"</p>"},c,h,p="No Data Available.",d=d3.dispatch("tooltipShow","tooltipHide","beforeUpdate");n.orient("bottom").highlightZero(!1).showMaxMin(!1).tickFormat(function(e){return e}),r.orient("left").tickFormat(d3.format(",.1f"));var v=function(i,s){var o=i.pos[0]+(s.offsetLeft||0),u=i.pos[1]+(s.offsetTop||0),a=n.tickFormat()(t.x()(i.point,i.pointIndex)),f=r.tickFormat()(t.y()(i.point,i.pointIndex)),c=l(i.series.key,a,f,i,m);e.tooltip.show([o,u],c,i.value<0?"n":"s",null,s)};return t.dispatch.on("elementMouseover.tooltip",function(e){e.pos=[e.pos[0]+i.left,e.pos[1]+i.top],d.tooltipShow(e)}),t.dispatch.on("elementMouseout.tooltip",function(e){d.tooltipHide(e)}),d.on("tooltipHide",function(){f&&e.tooltip.cleanup()}),m.dispatch=d,m.discretebar=t,m.xAxis=n,m.yAxis=r,d3.rebind(m,t,"x","y","xDomain","yDomain","forceX","forceY","id","showValues","valueFormat"),m.margin=function(e){return arguments.length?(i.top=typeof e.top!="undefined"?e.top:i.top,i.right=typeof e.right!="undefined"?e.right:i.right,i.bottom=typeof e.bottom!="undefined"?e.bottom:i.bottom,i.left=typeof e.left!="undefined"?e.left:i.left,m):i},m.width=function(e){return arguments.length?(s=e,m):s},m.height=function(e){return arguments.length?(o=e,m):o},m.color=function(n){return arguments.length?(u=e.utils.getColor(n),t.color(u),m):u},m.staggerLabels=function(e){return arguments.length?(a=e,m):a},m.tooltips=function(e){return arguments.length?(f=e,m):f},m.tooltipContent=function(e){return arguments.length?(l=e,m):l},m.noData=function(e){return arguments.length?(p=e,m):p},m},e.models.distribution=function(){function l(e){return e.each(function(e){var a=n-(i==="x"?t.left+t.right:t.top+t.bottom),l=i=="x"?"y":"x",c=d3.select(this);f=f||u;var h=c.selectAll("g.nv-distribution").data([e]),p=h.enter().append("g").attr("class","nvd3 nv-distribution"),d=p.append("g"),v=h.select("g");h.attr("transform","translate("+t.left+","+t.top+")");var m=v.selectAll("g.nv-dist").data(function(e){return e},function(e){return e.key});m.enter().append("g"),m.attr("class",function(e,t){return"nv-dist nv-series-"+t}).style("stroke",function(e,t){return o(e,t)});var g=m.selectAll("line.nv-dist"+i).data(function(e){return e.values});g.enter().append("line").attr(i+"1",function(e,t){return f(s(e,t))}).attr(i+"2",function(e,t){return f(s(e,t))}),d3.transition(m.exit().selectAll("line.nv-dist"+i)).attr(i+"1",function(e,t){return u(s(e,t))}).attr(i+"2",function(e,t){return u(s(e,t))}).style("stroke-opacity",0).remove(),g.attr("class",function(e,t){return"nv-dist"+i+" nv-dist"+i+"-"+t}).attr(l+"1",0).attr(l+"2",r),d3.transition(g).attr(i+"1",function(e,t){return u(s(e,t))}).attr(i+"2",function(e,t){return u(s(e,t))}),f=u.copy()}),l}var t={top:0,right:0,bottom:0,left:0},n=400,r=8,i="x",s=function(e){return e[i]},o=e.utils.defaultColor(),u=d3.scale.linear(),a,f;return l.margin=function(e){return arguments.length?(t.top=typeof e.top!="undefined"?e.top:t.top,t.right=typeof e.right!="undefined"?e.right:t.right,t.bottom=typeof e.bottom!="undefined"?e.bottom:t.bottom,t.left=typeof e.left!="undefined"?e.left:t.left,l):t},l.width=function(e){return arguments.length?(n=e,l):n},l.axis=function(e){return arguments.length?(i=e,l):i},l.size=function(e){return arguments.length?(r=e,l):r},l.getData=function(e){return arguments.length?(s=d3.functor(e),l):s},l.scale=function(e){return arguments.length?(u=e,l):u},l.color=function(t){return arguments.length?(o=e.utils.getColor(t),l):o},l},e.models.indentedTree=function(){function m(e){return e.each(function(e){function C(e,t,n){d3.event.stopPropagation();if(d3.event.shiftKey&&!n)return d3.event.shiftKey=!1,e.values&&e.values.forEach(function(e){(e.values||e._values)&&C(e,0,!0)}),!0;if(!A(e))return!0;e.values?(e._values=e.values,e.values=null):(e.values=e._values,e._values=null),m.update()}function k(e){return e._values&&e._values.length?h:e.values&&e.values.length?p:""}function L(e){return e._values&&e._values.length}function A(e){var t=e.values||e._values;return t&&t.length}var t=1,n=d3.select(this),i=d3.layout.tree().children(function(e){return e.values}).size([r,f]);m.update=function(){n.transition().duration(600).call(m)},e[0]||(e[0]={key:a});var s=i.nodes(e[0]),g=d3.select(this).selectAll("div").data([[s]]),y=g.enter().append("div").attr("class","nvd3 nv-wrap nv-indentedtree"),b=y.append("table"),w=g.select("table").attr("width","100%").attr("class",c);if(o){var E=b.append("thead"),S=E.append("tr");l.forEach(function(e){S.append("th").attr("width",e.width?e.width:"10%").style("text-align",e.type=="numeric"?"right":"left").append("span").text(e.label)})}var x=w.selectAll("tbody").data(function(e){return e});x.enter().append("tbody"),t=d3.max(s,function(e){return e.depth}),i.size([r,t*f]);var T=x.selectAll("tr").data(function(e){return e.filter(function(e){return u&&!e.children?u(e):!0})},function(e,t){return e.id||e.id||++v});T.exit().remove(),T.select("img.nv-treeicon").attr("src",k).classed("folded",L);var N=T.enter().append("tr");l.forEach(function(e,t){var n=N.append("td").style("padding-left",function(e){return(t?0:e.depth*f+12+(k(e)?0:16))+"px"},"important").style("text-align",e.type=="numeric"?"right":"left");t==0&&n.append("img").classed("nv-treeicon",!0).classed("nv-folded",L).attr("src",k).style("width","14px").style("height","14px").style("padding","0 1px").style("display",function(e){return k(e)?"inline-block":"none"}).on("click",C),n.append("span").attr("class",d3.functor(e.classes)).text(function(t){return e.format?e.format(t):t[e.key]||"-"}),e.showCount&&(n.append("span").attr("class","nv-childrenCount"),T.selectAll("span.nv-childrenCount").text(function(e){return e.values&&e.values.length||e._values&&e._values.length?"("+(e.values&&e.values.filter(function(e){return u?u(e):!0}).length||e._values&&e._values.filter(function(e){return u?u(e):!0}).length||0)+")":""})),e.click&&n.select("span").on("click",e.click)}),T.order().on("click",function(e){d.elementClick({row:this,data:e,pos:[e.x,e.y]})}).on("dblclick",function(e){d.elementDblclick({row:this,data:e,pos:[e.x,e.y]})}).on("mouseover",function(e){d.elementMouseover({row:this,data:e,pos:[e.x,e.y]})}).on("mouseout",function(e){d.elementMouseout({row:this,data:e,pos:[e.x,e.y]})})}),m}var t={top:0,right:0,bottom:0,left:0},n=960,r=500,i=e.utils.defaultColor(),s=Math.floor(Math.random()*1e4),o=!0,u=!1,a="No Data Available.",f=20,l=[{key:"key",label:"Name",type:"text"}],c=null,h="images/grey-plus.png",p="images/grey-minus.png",d=d3.dispatch("elementClick","elementDblclick","elementMouseover","elementMouseout"),v=0;return m.margin=function(e){return arguments.length?(t.top=typeof e.top!="undefined"?e.top:t.top,t.right=typeof e.right!="undefined"?e.right:t.right,t.bottom=typeof e.bottom!="undefined"?e.bottom:t.bottom,t.left=typeof e.left!="undefined"?e.left:t.left,m):t},m.width=function(e){return arguments.length?(n=e,m):n},m.height=function(e){return arguments.length?(r=e,m):r},m.color=function(t){return arguments.length?(i=e.utils.getColor(t),scatter.color(i),m):i},m.id=function(e){return arguments.length?(s=e,m):s},m.header=function(e){return arguments.length?(o=e,m):o},m.noData=function(e){return arguments.length?(a=e,m):a},m.filterZero=function(e){return arguments.length?(u=e,m):u},m.columns=function(e){return arguments.length?(l=e,m):l},m.tableClass=function(e){return arguments.length?(c=e,m):c},m.iconOpen=function(e){return arguments.length?(h=e,m):h},m.iconClose=function(e){return arguments.length?(p=e,m):p},m},e.models.legend=function(){function a(f){return f.each(function(a){var f=n-t.left-t.right,l=d3.select(this),c=l.selectAll("g.nv-legend").data([a]),h=c.enter().append("g").attr("class","nvd3 nv-legend").append("g"),p=c.select("g");c.attr("transform","translate("+t.left+","+t.top+")");var d=p.selectAll(".nv-series").data(function(e){return e}),v=d.enter().append("g").attr("class","nv-series").on("mouseover",function(e,t){u.legendMouseover(e,t)}).on("mouseout",function(e,t){u.legendMouseout(e,t)}).on("click",function(e,t){u.legendClick(e,t)}).on("dblclick",function(e,t){u.legendDblclick(e,t)});v.append("circle").style("stroke-width",2).attr("r",5),v.append("text").attr("text-anchor","start").attr("dy",".32em").attr("dx","8"),d.classed("disabled",function(e){return e.disabled}),d.exit().remove(),d.select("circle").style("fill",function(e,t){return e.color||s(e,t)}).style("stroke",function(e,t){return e.color||s(e,t)}),d.select("text").text(i);if(o){var m=[];d.each(function(t,n){var r=d3.select(this).select("text"),i=r.node().getComputedTextLength()||e.utils.calcApproxTextWidth(r);m.push(i+28)});var g=0,y=0,b=[];while(y<f&&g<m.length)b[g]=m[g],y+=m[g++];while(y>f&&g>1){b=[],g--;for(k=0;k<m.length;k++)m[k]>(b[k%g]||0)&&(b[k%g]=m[k]);y=b.reduce(function(e,t,n,r){return e+t})}var w=[];for(var E=0,S=0;E<g;E++)w[E]=S,S+=b[E];d.attr("transform",function(e,t){return"translate("+w[t%g]+","+(5+Math.floor(t/g)*20)+")"}),p.attr("transform","translate("+(n-t.right-y)+","+t.top+")"),r=t.top+t.bottom+Math.ceil(m.length/g)*20}else{var x=5,T=5,N=0,C;d.attr("transform",function(e,r){var i=d3.select(this).select("text").node().getComputedTextLength()+28;return C=T,n<t.left+t.right+C+i&&(T=C=5,x+=20),T+=i,T>N&&(N=T),"translate("+C+","+x+")"}),p.attr("transform","translate("+(n-t.right-N)+","+t.top+")"),r=t.top+t.bottom+x+15}}),a}var t={top:5,right:0,bottom:5,left:0},n=400,r=20,i=function(e){return e.key},s=e.utils.defaultColor(),o=!0,u=d3.dispatch("legendClick","legendDblclick","legendMouseover","legendMouseout");return a.dispatch=u,a.margin=function(e){return arguments.length?(t.top=typeof e.top!="undefined"?e.top:t.top,t.right=typeof e.right!="undefined"?e.right:t.right,t.bottom=typeof e.bottom!="undefined"?e.bottom:t.bottom,t.left=typeof e.left!="undefined"?e.left:t.left,a):t},a.width=function(e){return arguments.length?(n=e,a):n},a.height=function(e){return arguments.length?(r=e,a):r},a.key=function(e){return arguments.length?(i=e,a):i},a.color=function(t){return arguments.length?(s=e.utils.getColor(t),a):s},a.align=function(e){return arguments.length?(o=e,a):o},a},e.models.line=function(){function m(e){return e.each(function(e){var m=r-n.left-n.right,g=i-n.top-n.bottom,b=d3.select(this);c=t.xScale(),h=t.yScale(),d=d||c,v=v||h;var w=b.selectAll("g.nv-wrap.nv-line").data([e]),E=w.enter().append("g").attr("class","nvd3 nv-wrap nv-line"),S=E.append("defs"),T=E.append("g"),N=w.select("g");T.append("g").attr("class","nv-groups"),T.append("g").attr("class","nv-scatterWrap"),w.attr("transform","translate("+n.left+","+n.top+")"),t.width(m).height(g);var C=w.select(".nv-scatterWrap");d3.transition(C).call(t),S.append("clipPath").attr("id","nv-edge-clip-"+t.id()).append("rect"),w.select("#nv-edge-clip-"+t.id()+" rect").attr("width",m).attr("height",g),N.attr("clip-path",l?"url(#nv-edge-clip-"+t.id()+")":""),C.attr("clip-path",l?"url(#nv-edge-clip-"+t.id()+")":"");var k=w.select(".nv-groups").selectAll(".nv-group").data(function(e){return e},function(e){return e.key});k.enter().append("g").style("stroke-opacity",1e-6).style("fill-opacity",1e-6),d3.transition(k.exit()).style("stroke-opacity",1e-6).style("fill-opacity",1e-6).remove(),k.attr("class",function(e,t){return"nv-group nv-series-"+t}).classed("hover",function(e){return e.hover}).style("fill",function(e,t){return s(e,t)}).style("stroke",function(e,t){return s(e,t)}),d3.transition(k).style("stroke-opacity",1).style("fill-opacity",.5);var L=k.selectAll("path.nv-area").data(function(e){return f(e)?[e]:[]});L.enter().append("path").attr("class","nv-area").attr("d",function(e){return d3.svg.area().interpolate(p).defined(a).x(function(e,t){return d(o(e,t))}).y0(function(e,t){return v(u(e,t))}).y1(function(e,t){return v(h.domain()[0]<=0?h.domain()[1]>=0?0:h.domain()[1]:h.domain()[0])}).apply(this,[e.values])}),d3.transition(k.exit().selectAll("path.nv-area")).attr("d",function(e){return d3.svg.area().interpolate(p).defined(a).x(function(e,t){return d(o(e,t))}).y0(function(e,t){return v(u(e,t))}).y1(function(e,t){return v(h.domain()[0]<=0?h.domain()[1]>=0?0:h.domain()[1]:h.domain()[0])}).apply(this,[e.values])}),d3.transition(L).attr("d",function(e){return d3.svg.area().interpolate(p).defined(a).x(function(e,t){return d(o(e,t))}).y0(function(e,t){return v(u(e,t))}).y1(function(e,t){return v(h.domain()[0]<=0?h.domain()[1]>=0?0:h.domain()[1]:h.domain()[0])}).apply(this,[e.values])});var A=k.selectAll("path.nv-line").data(function(e){return[e.values]});A.enter().append("path").attr("class","nv-line").attr("d",d3.svg.line().interpolate(p).defined(a).x(function(e,t){return d(o(e,t))}).y(function(e,t){return v(u(e,t))})),d3.transition(k.exit().selectAll("path.nv-line")).attr("d",d3.svg.line().interpolate(p).defined(a).x(function(e,t){return c(o(e,t))}).y(function(e,t){return h(u(e,t))})),d3.transition(A).attr("d",d3.svg.line().interpolate(p).defined(a).x(function(e,t){return c(o(e,t))}).y(function(e,t){return h(u(e,t))})),d=c.copy(),v=h.copy()}),m}var t=e.models.scatter(),n={top:0,right:0,bottom:0,left:0},r=960,i=500,s=e.utils.defaultColor(),o=function(e){return e.x},u=function(e){return e.y},a=function(e,t){return!isNaN(u(e,t))&&u(e,t)!==null},f=function(e){return e.area},l=!1,c,h,p="linear";t.size(16).sizeDomain([16,256]);var d,v;return m.dispatch=t.dispatch,m.scatter=t,d3.rebind(m,t,"id","interactive","size","xScale","yScale","zScale","xDomain","yDomain","sizeDomain","forceX","forceY","forceSize","clipVoronoi","clipRadius","padData"),m.margin=function(e){return arguments.length?(n.top=typeof e.top!="undefined"?e.top:n.top,n.right=typeof e.right!="undefined"?e.right:n.right,n.bottom=typeof e.bottom!="undefined"?e.bottom:n.bottom,n.left=typeof e.left!="undefined"?e.left:n.left,m):n},m.width=function(e){return arguments.length?(r=e,m):r},m.height=function(e){return arguments.length?(i=e,m):i},m.x=function(e){return arguments.length?(o=e,t.x(e),m):o},m.y=function(e){return arguments.length?(u=e,t.y(e),m):u},m.clipEdge=function(e){return arguments.length?(l=e,m):l},m.color=function(n){return arguments.length?(s=e.utils.getColor(n),t.color(s),m):s},m.interpolate=function(e){return arguments.length?(p=e,m):p},m.defined=function(e){return arguments.length?(a=e,m):a},m.isArea=function(e){return arguments.length?(f=d3.functor(e),m):f},m},e.models.lineChart=function(){function b(e){return e.each(function(c){var w=d3.select(this),E=this,S=(u||parseInt(w.style("width"))||960)-s.left-s.right,T=(a||parseInt(w.style("height"))||400)-s.top-s.bottom;b.update=function(){b(e)},b.container=this,d.disabled=c.map(function(e){return!!e.disabled});if(!v){var N;v={};for(N in d)d[N]instanceof Array?v[N]=d[N].slice(0):v[N]=d[N]}if(!c||!c.length||!c.filter(function(e){return e.values.length}).length){var C=w.selectAll(".nv-noData").data([m]);return C.enter().append("text").attr("class","nvd3 nv-noData").attr("dy","-.7em").style("text-anchor","middle"),C.attr("x",s.left+S/2).attr("y",s.top+T/2).text(function(e){return e}),b}w.selectAll(".nv-noData").remove(),h=t.xScale(),p=t.yScale();var k=w.selectAll("g.nv-wrap.nv-lineChart").data([c]),L=k.enter().append("g").attr("class","nvd3 nv-wrap nv-lineChart").append("g"),A=k.select("g");L.append("g").attr("class","nv-x nv-axis"),L.append("g").attr("class","nv-y nv-axis"),L.append("g").attr("class","nv-linesWrap"),L.append("g").attr("class","nv-legendWrap"),f&&(i.width(S),A.select(".nv-legendWrap").datum(c).call(i),s.top!=i.height()&&(s.top=i.height(),T=(a||parseInt(w.style("height"))||400)-s.top-s.bottom),k.select(".nv-legendWrap").attr("transform","translate(0,"+ -s.top+")")),k.attr("transform","translate("+s.left+","+s.top+")"),t.width(S).height(T).color(c.map(function(e,t){return e.color||o(e,t)}).filter(function(e,t){return!c[t].disabled}));var O=A.select(".nv-linesWrap").datum(c.filter(function(e){return!e.disabled}));d3.transition(O).call(t),n.scale(h).ticks(S/100).tickSize(-T,0),A.select(".nv-x.nv-axis").attr("transform","translate(0,"+p.range()[0]+")"),d3.transition(A.select(".nv-x.nv-axis")).call(n),r.scale(p).ticks(T/36).tickSize(-S,0),d3.transition(A.select(".nv-y.nv-axis")).call(r),i.dispatch.on("legendClick",function(t,n){t.disabled=!t.disabled,c.filter(function(e){return!e.disabled}).length||c.map(function(e){return e.disabled=!1,k.selectAll(".nv-series").classed("disabled",!1),e}),d.disabled=c.map(function(e){return!!e.disabled}),g.stateChange(d),e.transition().call(b)}),g.on("tooltipShow",function(e){l&&y(e,E.parentNode)}),g.on("changeState",function(t){typeof t.disabled!="undefined"&&(c.forEach(function(e,n){e.disabled=t.disabled[n]}),d.disabled=t.disabled),e.call(b)})}),b}var t=e.models.line(),n=e.models.axis(),r=e.models.axis(),i=e.models.legend(),s={top:30,right:20,bottom:50,left:60},o=e.utils.defaultColor(),u=null,a=null,f=!0,l=!0,c=function(e,t,n,r,i){return"<h3>"+e+"</h3>"+"<p>"+n+" at "+t+"</p>"},h,p,d={},v=null,m="No Data Available.",g=d3.dispatch("tooltipShow","tooltipHide","stateChange","changeState");n.orient("bottom").tickPadding(7),r.orient("left");var y=function(i,s){if(s){var o=d3.select(s).select("svg"),u=o.node()?o.attr("viewBox"):null;if(u){u=u.split(" ");var a=parseInt(o.style("width"))/u[2];i.pos[0]=i.pos[0]*a,i.pos[1]=i.pos[1]*a}}var f=i.pos[0]+(s.offsetLeft||0),l=i.pos[1]+(s.offsetTop||0),h=n.tickFormat()(t.x()(i.point,i.pointIndex)),p=r.tickFormat()(t.y()(i.point,i.pointIndex)),d=c(i.series.key,h,p,i,b);e.tooltip.show([f,l],d,null,null,s)};return t.dispatch.on("elementMouseover.tooltip",function(e){e.pos=[e.pos[0]+s.left,e.pos[1]+s.top],g.tooltipShow(e)}),t.dispatch.on("elementMouseout.tooltip",function(e){g.tooltipHide(e)}),g.on("tooltipHide",function(){l&&e.tooltip.cleanup()}),b.dispatch=g,b.lines=t,b.legend=i,b.xAxis=n,b.yAxis=r,d3.rebind(b,t,"defined","isArea","x","y","size","xScale","yScale","xDomain","yDomain","forceX","forceY","interactive","clipEdge","clipVoronoi","id","interpolate"),b.margin=function(e){return arguments.length?(s.top=typeof e.top!="undefined"?e.top:s.top,s.right=typeof e.right!="undefined"?e.right:s.right,s.bottom=typeof e.bottom!="undefined"?e.bottom:s.bottom,s.left=typeof e.left!="undefined"?e.left:s.left,b):s},b.width=function(e){return arguments.length?(u=e,b):u},b.height=function(e){return arguments.length?(a=e,b):a},b.color=function(t){return arguments.length?(o=e.utils.getColor(t),i.color(o),b):o},b.showLegend=function(e){return arguments.length?(f=e,b):f},b.tooltips=function(e){return arguments.length?(l=e,b):l},b.tooltipContent=function(e){return arguments.length?(c=e,b):c},b.state=function(e){return arguments.length?(d=e,b):d},b.defaultState=function(e){return arguments.length?(v=e,b):v},b.noData=function(e){return arguments.length?(m=e,b):m},b},e.models.linePlusBarChart=function(){function T(e){return e.each(function(l){var c=d3.select(this),v=this,N=(a||parseInt(c.style("width"))||960)-u.left-u.right,C=(f||parseInt(c.style("height"))||400)-u.top-u.bottom;T.update=function(){T(e)},T.container=this,b.disabled=l.map(function(e){return!!e.disabled});if(!w){var k;w={};for(k in b)b[k]instanceof Array?w[k]=b[k].slice(0):w[k]=b[k]}if(!l||!l.length||!l.filter(function(e){return e.values.length}).length){var L=c.selectAll(".nv-noData").data([E]);return L.enter().append("text").attr("class","nvd3 nv-noData").attr("dy","-.7em").style("text-anchor","middle"),L.attr("x",u.left+N/2).attr("y",u.top+C/2).text(function(e){return e}),T}c.selectAll(".nv-noData").remove();var A=l.filter(function(e){return!e.disabled&&e.bar}),O=l.filter(function(e){return!e.bar});m=O.filter(function(e){return!e.disabled}).length&&O.filter(function(e){return!e.disabled})[0].values.length?t.xScale():n.xScale(),g=n.yScale(),y=t.yScale();var M=d3.select(this).selectAll("g.nv-wrap.nv-linePlusBar").data([l]),_=M.enter().append("g").attr("class","nvd3 nv-wrap nv-linePlusBar").append("g"),D=M.select("g");_.append("g").attr("class","nv-x nv-axis"),_.append("g").attr("class","nv-y1 nv-axis"),_.append("g").attr("class","nv-y2 nv-axis"),_.append("g").attr("class","nv-barsWrap"),_.append("g").attr("class","nv-linesWrap"),_.append("g").attr("class","nv-legendWrap"),p&&(o.width(N/2),D.select(".nv-legendWrap").datum(l.map(function(e){return e.originalKey=e.originalKey===undefined?e.key:e.originalKey,e.key=e.originalKey+(e.bar?" (left axis)":" (right axis)"),e})).call(o),u.top!=o.height()&&(u.top=o.height(),C=(f||parseInt(c.style("height"))||400)-u.top-u.bottom),D.select(".nv-legendWrap").attr("transform","translate("+N/2+","+ -u.top+")")),M.attr("transform","translate("+u.left+","+u.top+")"),t.width(N).height(C).color(l.map(function(e,t){return e.color||h(e,t)}).filter(function(e,t){return!l[t].disabled&&!l[t].bar})),n.width(N).height(C).color(l.map(function(e,t){return e.color||h(e,t)}).filter(function(e,t){return!l[t].disabled&&l[t].bar}));var P=D.select(".nv-barsWrap").datum(A.length?A:[{values:[]}]),H=D.select(".nv-linesWrap").datum(O[0]&&!O[0].disabled?O:[{values:[]}]);d3.transition(P).call(n),d3.transition(H).call(t),r.scale(m).ticks(N/100).tickSize(-C,0),D.select(".nv-x.nv-axis").attr("transform","translate(0,"+g.range()[0]+")"),d3.transition(D.select(".nv-x.nv-axis")).call(r),i.scale(g).ticks(C/36).tickSize(-N,0),d3.transition(D.select(".nv-y1.nv-axis")).style("opacity",A.length?1:0).call(i),s.scale(y).ticks(C/36).tickSize(A.length?0:-N,0),D.select(".nv-y2.nv-axis").style("opacity",O.length?1:0).attr("transform","translate("+N+",0)"),d3.transition(D.select(".nv-y2.nv-axis")).call(s),o.dispatch.on("legendClick",function(t,n){t.disabled=!t.disabled,l.filter(function(e){return!e.disabled}).length||l.map(function(e){return e.disabled=!1,M.selectAll(".nv-series").classed("disabled",!1),e}),b.disabled=l.map(function(e){return!!e.disabled}),S.stateChange(b),e.transition().call(T)}),S.on("tooltipShow",function(e){d&&x(e,v.parentNode)}),S.on("changeState",function(t){typeof t.disabled!="undefined"&&(l.forEach(function(e,n){e.disabled=t.disabled[n]}),b.disabled=t.disabled),e.call(T)})}),T}var t=e.models.line(),n=e.models.historicalBar(),r=e.models.axis(),i=e.models.axis(),s=e.models.axis(),o=e.models.legend(),u={top:30,right:60,bottom:50,left:60},a=null,f=null,l=function(e){return e.x},c=function(e){return e.y},h=e.utils.defaultColor(),p=!0,d=!0,v=function(e,t,n,r,i){return"<h3>"+e+"</h3>"+"<p>"+n+" at "+t+"</p>"},m,g,y,b={},w=null,E="No Data Available.",S=d3.dispatch("tooltipShow","tooltipHide","stateChange","changeState");n.padData(!0),t.clipEdge(!1).padData(!0),r.orient("bottom").tickPadding(7).highlightZero(!1),i.orient("left"),s.orient("right");var x=function(n,o){var u=n.pos[0]+(o.offsetLeft||0),a=n.pos[1]+(o.offsetTop||0),f=r.tickFormat()(t.x()(n.point,n.pointIndex)),l=(n.series.bar?i:s).tickFormat()(t.y()(n.point,n.pointIndex)),c=v(n.series.key,f,l,n,T);e.tooltip.show([u,a],c,n.value<0?"n":"s",null,o)};return t.dispatch.on("elementMouseover.tooltip",function(e){e.pos=[e.pos[0]+u.left,e.pos[1]+u.top],S.tooltipShow(e)}),t.dispatch.on("elementMouseout.tooltip",function(e){S.tooltipHide(e)}),n.dispatch.on("elementMouseover.tooltip",function(e){e.pos=[e.pos[0]+u.left,e.pos[1]+u.top],S.tooltipShow(e)}),n.dispatch.on("elementMouseout.tooltip",function(e){S.tooltipHide(e)}),S.on("tooltipHide",function(){d&&e.tooltip.cleanup()}),T.dispatch=S,T.legend=o,T.lines=t,T.bars=n,T.xAxis=r,T.y1Axis=i,T.y2Axis=s,d3.rebind(T,t,"defined","size","clipVoronoi","interpolate"),T.x=function(e){return arguments.length?(l=e,t.x(e),n.x(e),T):l},T.y=function(e){return arguments.length?(c=e,t.y(e),n.y(e),T):c},T.margin=function(e){return arguments.length?(u.top=typeof e.top!="undefined"?e.top:u.top,u.right=typeof e.right!="undefined"?e.right:u.right,u.bottom=typeof e.bottom!="undefined"?e.bottom:u.bottom,u.left=typeof e.left!="undefined"?e.left:u.left,T):u},T.width=function(e){return arguments.length?(a=e,T):a},T.height=function(e){return arguments.length?(f=e,T):f},T.color=function(t){return arguments.length?(h=e.utils.getColor(t),o.color(h),T):h},T.showLegend=function(e){return arguments.length?(p=e,T):p},T.tooltips=function(e){return arguments.length?(d=e,T):d},T.tooltipContent=function(e){return arguments.length?(v=e,T):v},T.state=function(e){return arguments.length?(b=e,T):b},T.defaultState=function(e){return arguments.length?(w=e,T):w},T.noData=function(e){return arguments.length?(E=e,T):E},T},e.models.lineWithFocusChart=function(){function C(e){return e.each(function(S){function R(e){var t=+(e=="e"),n=t?1:-1,r=M/3;return"M"+.5*n+","+r+"A6,6 0 0 "+t+" "+6.5*n+","+(r+6)+"V"+(2*r-6)+"A6,6 0 0 "+t+" "+.5*n+","+2*r+"Z"+"M"+2.5*n+","+(r+8)+"V"+(2*r-8)+"M"+4.5*n+","+(r+8)+"V"+(2*r-8)}function U(){a.empty()||a.extent(w),I.data([a.empty()?g.domain():w]).each(function(e,t){var n=g(e[0])-v.range()[0],r=v.range()[1]-g(e[1]);d3.select(this).select(".left").attr("width",n<0?0:n),d3.select(this).select(".right").attr("x",g(e[1])).attr("width",r<0?0:r)})}function z(){w=a.empty()?null:a.extent(),extent=a.empty()?g.domain():a.extent(),T.brush({extent:extent,brush:a}),U();var e=H.select(".nv-focus .nv-linesWrap").datum(S.filter(function(e){return!e.disabled}).map(function(e,n){return{key:e.key,values:e.values.filter(function(e,n){return t.x()(e,n)>=extent[0]&&t.x()(e,n)<=extent[1]})}}));d3.transition(e).call(t),d3.transition(H.select(".nv-focus .nv-x.nv-axis")).call(r),d3.transition(H.select(".nv-focus .nv-y.nv-axis")).call(i)}var k=d3.select(this),L=this,A=(h||parseInt(k.style("width"))||960)-f.left-f.right,O=(p||parseInt(k.style("height"))||400)-f.top-f.bottom-d,M=d-l.top-l.bottom;C.update=function(){C(e)},C.container=this;if(!S||!S.length||!S.filter(function(e){return e.values.length}).length){var _=k.selectAll(".nv-noData").data([x]);return _.enter().append("text").attr("class","nvd3 nv-noData").attr("dy","-.7em").style("text-anchor","middle"),_.attr("x",f.left+A/2).attr("y",f.top+O/2).text(function(e){return e}),C}k.selectAll(".nv-noData").remove(),v=t.xScale(),m=t.yScale(),g=n.xScale(),y=n.yScale();var D=k.selectAll("g.nv-wrap.nv-lineWithFocusChart").data([S]),P=D.enter().append("g").attr("class","nvd3 nv-wrap nv-lineWithFocusChart").append("g"),H=D.select("g");P.append("g").attr("class","nv-legendWrap");var B=P.append("g").attr("class","nv-focus");B.append("g").attr("class","nv-x nv-axis"),B.append("g").attr("class","nv-y nv-axis"),B.append("g").attr("class","nv-linesWrap");var j=P.append("g").attr("class","nv-context");j.append("g").attr("class","nv-x nv-axis"),j.append("g").attr("class","nv-y nv-axis"),j.append("g").attr("class","nv-linesWrap"),j.append("g").attr("class","nv-brushBackground"),j.append("g").attr("class","nv-x nv-brush"),b&&(u.width(A),H.select(".nv-legendWrap").datum(S).call(u),f.top!=u.height()&&(f.top=u.height(),O=(p||parseInt(k.style("height"))||400)-f.top-f.bottom-d),H.select(".nv-legendWrap").attr("transform","translate(0,"+ -f.top+")")),D.attr("transform","translate("+f.left+","+f.top+")"),t.width(A).height(O).color(S.map(function(e,t){return e.color||c(e,t)}).filter(function(e,t){return!S[t].disabled})),n.defined(t.defined()).width(A).height(M).color(S.map(function(e,t){return e.color||c(e,t)}).filter(function(e,t){return!S[t].disabled})),H.select(".nv-context").attr("transform","translate(0,"+(O+f.bottom+l.top)+")");var F=H.select(".nv-context .nv-linesWrap").datum(S.filter(function(e){return!e.disabled}));d3.transition(F).call(n),r.scale(v).ticks(A/100).tickSize(-O,0),i.scale(m).ticks(O/36).tickSize(-A,0),H.select(".nv-focus .nv-x.nv-axis").attr("transform","translate(0,"+O+")"),a.x(g).on("brush",z),w&&a.extent(w);var I=H.select(".nv-brushBackground").selectAll("g").data([w||a.extent()]),q=I.enter().append("g");q.append("rect").attr("class","left").attr("x",0).attr("y",0).attr("height",M),q.append("rect").attr("class","right").attr("x",0).attr("y",0).attr("height",M),gBrush=H.select(".nv-x.nv-brush").call(a),gBrush.selectAll("rect").attr("height",M),gBrush.selectAll(".resize").append("path").attr("d",R),z(),s.scale(g).ticks(A/100).tickSize(-M,0),H.select(".nv-context .nv-x.nv-axis").attr("transform","translate(0,"+y.range()[0]+")"),d3.transition(H.select(".nv-context .nv-x.nv-axis")).call(s),o.scale(y).ticks(M/36).tickSize(-A,0),d3.transition(H.select(".nv-context .nv-y.nv-axis")).call(o),H.select(".nv-context .nv-x.nv-axis").attr("transform","translate(0,"+y.range()[0]+")"),u.dispatch.on("legendClick",function(t,n){t.disabled=!t.disabled,S.filter(function(e){return!e.disabled}).length||S.map(function(e){return e.disabled=!1,D.selectAll(".nv-series").classed("disabled",!1),e}),e.transition().call(C)}),T.on("tooltipShow",function(e){E&&N(e,L.parentNode)})}),C}var t=e.models.line(),n=e.models.line(),r=e.models.axis(),i=e.models.axis(),s=e.models.axis(),o=e.models.axis(),u=e.models.legend(),a=d3.svg.brush(),f={top:30,right:30,bottom:30,left:60
},l={top:0,right:30,bottom:20,left:60},c=e.utils.defaultColor(),h=null,p=null,d=100,v,m,g,y,b=!0,w=null,E=!0,S=function(e,t,n,r,i){return"<h3>"+e+"</h3>"+"<p>"+n+" at "+t+"</p>"},x="No Data Available.",T=d3.dispatch("tooltipShow","tooltipHide","brush");t.clipEdge(!0),n.interactive(!1),r.orient("bottom").tickPadding(5),i.orient("left"),s.orient("bottom").tickPadding(5),o.orient("left");var N=function(n,s){var o=n.pos[0]+(s.offsetLeft||0),u=n.pos[1]+(s.offsetTop||0),a=r.tickFormat()(t.x()(n.point,n.pointIndex)),f=i.tickFormat()(t.y()(n.point,n.pointIndex)),l=S(n.series.key,a,f,n,C);e.tooltip.show([o,u],l,null,null,s)};return t.dispatch.on("elementMouseover.tooltip",function(e){e.pos=[e.pos[0]+f.left,e.pos[1]+f.top],T.tooltipShow(e)}),t.dispatch.on("elementMouseout.tooltip",function(e){T.tooltipHide(e)}),T.on("tooltipHide",function(){E&&e.tooltip.cleanup()}),C.dispatch=T,C.legend=u,C.lines=t,C.lines2=n,C.xAxis=r,C.yAxis=i,C.x2Axis=s,C.y2Axis=o,d3.rebind(C,t,"defined","isArea","size","xDomain","yDomain","forceX","forceY","interactive","clipEdge","clipVoronoi","id"),C.x=function(e){return arguments.length?(t.x(e),n.x(e),C):t.x},C.y=function(e){return arguments.length?(t.y(e),n.y(e),C):t.y},C.margin=function(e){return arguments.length?(f.top=typeof e.top!="undefined"?e.top:f.top,f.right=typeof e.right!="undefined"?e.right:f.right,f.bottom=typeof e.bottom!="undefined"?e.bottom:f.bottom,f.left=typeof e.left!="undefined"?e.left:f.left,C):f},C.margin2=function(e){return arguments.length?(l=e,C):l},C.width=function(e){return arguments.length?(h=e,C):h},C.height=function(e){return arguments.length?(p=e,C):p},C.height2=function(e){return arguments.length?(d=e,C):d},C.color=function(t){return arguments.length?(c=e.utils.getColor(t),u.color(c),C):c},C.showLegend=function(e){return arguments.length?(b=e,C):b},C.tooltips=function(e){return arguments.length?(E=e,C):E},C.tooltipContent=function(e){return arguments.length?(S=e,C):S},C.interpolate=function(e){return arguments.length?(t.interpolate(e),n.interpolate(e),C):t.interpolate()},C.noData=function(e){return arguments.length?(x=e,C):x},C.xTickFormat=function(e){return arguments.length?(r.tickFormat(e),s.tickFormat(e),C):r.tickFormat()},C.yTickFormat=function(e){return arguments.length?(i.tickFormat(e),o.tickFormat(e),C):i.tickFormat()},C},e.models.linePlusBarWithFocusChart=function(){function H(e){return e.each(function(N){function nt(e){var t=+(e=="e"),n=t?1:-1,r=q/3;return"M"+.5*n+","+r+"A6,6 0 0 "+t+" "+6.5*n+","+(r+6)+"V"+(2*r-6)+"A6,6 0 0 "+t+" "+.5*n+","+2*r+"Z"+"M"+2.5*n+","+(r+8)+"V"+(2*r-8)+"M"+4.5*n+","+(r+8)+"V"+(2*r-8)}function rt(){h.empty()||h.extent(x),Z.data([h.empty()?k.domain():x]).each(function(e,t){var n=k(e[0])-k.range()[0],r=k.range()[1]-k(e[1]);d3.select(this).select(".left").attr("width",n<0?0:n),d3.select(this).select(".right").attr("x",k(e[1])).attr("width",r<0?0:r)})}function it(){x=h.empty()?null:h.extent(),S=h.empty()?k.domain():h.extent(),D.brush({extent:S,brush:h}),rt(),r.width(F).height(I).color(N.map(function(e,t){return e.color||w(e,t)}).filter(function(e,t){return!N[t].disabled&&N[t].bar})),t.width(F).height(I).color(N.map(function(e,t){return e.color||w(e,t)}).filter(function(e,t){return!N[t].disabled&&!N[t].bar}));var e=J.select(".nv-focus .nv-barsWrap").datum(U.length?U.map(function(e,t){return{key:e.key,values:e.values.filter(function(e,t){return r.x()(e,t)>=S[0]&&r.x()(e,t)<=S[1]})}}):[{values:[]}]),n=J.select(".nv-focus .nv-linesWrap").datum(z[0].disabled?[{values:[]}]:z.map(function(e,n){return{key:e.key,values:e.values.filter(function(e,n){return t.x()(e,n)>=S[0]&&t.x()(e,n)<=S[1]})}}));U.length?C=r.xScale():C=t.xScale(),s.scale(C).ticks(F/100).tickSize(-I,0),s.domain([Math.ceil(S[0]),Math.floor(S[1])]),d3.transition(J.select(".nv-x.nv-axis")).call(s),d3.transition(e).call(r),d3.transition(n).call(t),J.select(".nv-focus .nv-x.nv-axis").attr("transform","translate(0,"+L.range()[0]+")"),u.scale(L).ticks(I/36).tickSize(-F,0),J.select(".nv-focus .nv-y1.nv-axis").style("opacity",U.length?1:0),a.scale(A).ticks(I/36).tickSize(U.length?0:-F,0),J.select(".nv-focus .nv-y2.nv-axis").style("opacity",z.length?1:0).attr("transform","translate("+C.range()[1]+",0)"),d3.transition(J.select(".nv-focus .nv-y1.nv-axis")).call(u),d3.transition(J.select(".nv-focus .nv-y2.nv-axis")).call(a)}var B=d3.select(this),j=this,F=(v||parseInt(B.style("width"))||960)-p.left-p.right,I=(m||parseInt(B.style("height"))||400)-p.top-p.bottom-g,q=g-d.top-d.bottom;H.update=function(){H(e)},H.container=this;if(!N||!N.length||!N.filter(function(e){return e.values.length}).length){var R=B.selectAll(".nv-noData").data([_]);return R.enter().append("text").attr("class","nvd3 nv-noData").attr("dy","-.7em").style("text-anchor","middle"),R.attr("x",p.left+F/2).attr("y",p.top+I/2).text(function(e){return e}),H}B.selectAll(".nv-noData").remove();var U=N.filter(function(e){return!e.disabled&&e.bar}),z=N.filter(function(e){return!e.bar});C=r.xScale(),k=o.scale(),L=r.yScale(),A=t.yScale(),O=i.yScale(),M=n.yScale();var W=N.filter(function(e){return!e.disabled&&e.bar}).map(function(e){return e.values.map(function(e,t){return{x:y(e,t),y:b(e,t)}})}),X=N.filter(function(e){return!e.disabled&&!e.bar}).map(function(e){return e.values.map(function(e,t){return{x:y(e,t),y:b(e,t)}})});C.range([0,F]),k.domain(d3.extent(d3.merge(W.concat(X)),function(e){return e.x})).range([0,F]);var V=B.selectAll("g.nv-wrap.nv-linePlusBar").data([N]),$=V.enter().append("g").attr("class","nvd3 nv-wrap nv-linePlusBar").append("g"),J=V.select("g");$.append("g").attr("class","nv-legendWrap");var K=$.append("g").attr("class","nv-focus");K.append("g").attr("class","nv-x nv-axis"),K.append("g").attr("class","nv-y1 nv-axis"),K.append("g").attr("class","nv-y2 nv-axis"),K.append("g").attr("class","nv-barsWrap"),K.append("g").attr("class","nv-linesWrap");var Q=$.append("g").attr("class","nv-context");Q.append("g").attr("class","nv-x nv-axis"),Q.append("g").attr("class","nv-y1 nv-axis"),Q.append("g").attr("class","nv-y2 nv-axis"),Q.append("g").attr("class","nv-barsWrap"),Q.append("g").attr("class","nv-linesWrap"),Q.append("g").attr("class","nv-brushBackground"),Q.append("g").attr("class","nv-x nv-brush"),E&&(c.width(F/2),J.select(".nv-legendWrap").datum(N.map(function(e){return e.originalKey=e.originalKey===undefined?e.key:e.originalKey,e.key=e.originalKey+(e.bar?" (left axis)":" (right axis)"),e})).call(c),p.top!=c.height()&&(p.top=c.height(),I=(m||parseInt(B.style("height"))||400)-p.top-p.bottom-g),J.select(".nv-legendWrap").attr("transform","translate("+F/2+","+ -p.top+")")),V.attr("transform","translate("+p.left+","+p.top+")"),i.width(F).height(q).color(N.map(function(e,t){return e.color||w(e,t)}).filter(function(e,t){return!N[t].disabled&&N[t].bar})),n.width(F).height(q).color(N.map(function(e,t){return e.color||w(e,t)}).filter(function(e,t){return!N[t].disabled&&!N[t].bar}));var G=J.select(".nv-context .nv-barsWrap").datum(U.length?U:[{values:[]}]),Y=J.select(".nv-context .nv-linesWrap").datum(z[0].disabled?[{values:[]}]:z);J.select(".nv-context").attr("transform","translate(0,"+(I+p.bottom+d.top)+")"),d3.transition(G).call(i),d3.transition(Y).call(n),h.x(k).on("brush",it),x&&h.extent(x);var Z=J.select(".nv-brushBackground").selectAll("g").data([x||h.extent()]),et=Z.enter().append("g");et.append("rect").attr("class","left").attr("x",0).attr("y",0).attr("height",q),et.append("rect").attr("class","right").attr("x",0).attr("y",0).attr("height",q);var tt=J.select(".nv-x.nv-brush").call(h);tt.selectAll("rect").attr("height",q),tt.selectAll(".resize").append("path").attr("d",nt),o.ticks(F/100).tickSize(-q,0),J.select(".nv-context .nv-x.nv-axis").attr("transform","translate(0,"+O.range()[0]+")"),d3.transition(J.select(".nv-context .nv-x.nv-axis")).call(o),f.scale(O).ticks(q/36).tickSize(-F,0),J.select(".nv-context .nv-y1.nv-axis").style("opacity",U.length?1:0).attr("transform","translate(0,"+k.range()[0]+")"),d3.transition(J.select(".nv-context .nv-y1.nv-axis")).call(f),l.scale(M).ticks(q/36).tickSize(U.length?0:-F,0),J.select(".nv-context .nv-y2.nv-axis").style("opacity",z.length?1:0).attr("transform","translate("+k.range()[1]+",0)"),d3.transition(J.select(".nv-context .nv-y2.nv-axis")).call(l),c.dispatch.on("legendClick",function(t,n){t.disabled=!t.disabled,N.filter(function(e){return!e.disabled}).length||N.map(function(e){return e.disabled=!1,V.selectAll(".nv-series").classed("disabled",!1),e}),e.call(H)}),D.on("tooltipShow",function(e){T&&P(e,j.parentNode)}),it()}),H}var t=e.models.line(),n=e.models.line(),r=e.models.historicalBar(),i=e.models.historicalBar(),s=e.models.axis(),o=e.models.axis(),u=e.models.axis(),a=e.models.axis(),f=e.models.axis(),l=e.models.axis(),c=e.models.legend(),h=d3.svg.brush(),p={top:30,right:30,bottom:30,left:60},d={top:0,right:30,bottom:20,left:60},v=null,m=null,g=100,y=function(e){return e.x},b=function(e){return e.y},w=e.utils.defaultColor(),E=!0,S,x=null,T=!0,N=function(e,t,n,r,i){return"<h3>"+e+"</h3>"+"<p>"+n+" at "+t+"</p>"},C,k,L,A,O,M,_="No Data Available.",D=d3.dispatch("tooltipShow","tooltipHide","brush");t.clipEdge(!0),n.interactive(!1),s.orient("bottom").tickPadding(5),u.orient("left"),a.orient("right"),o.orient("bottom").tickPadding(5),f.orient("left"),l.orient("right");var P=function(n,r){S&&(n.pointIndex+=Math.ceil(S[0]));var i=n.pos[0]+(r.offsetLeft||0),o=n.pos[1]+(r.offsetTop||0),f=s.tickFormat()(t.x()(n.point,n.pointIndex)),l=(n.series.bar?u:a).tickFormat()(t.y()(n.point,n.pointIndex)),c=N(n.series.key,f,l,n,H);e.tooltip.show([i,o],c,n.value<0?"n":"s",null,r)};return t.dispatch.on("elementMouseover.tooltip",function(e){e.pos=[e.pos[0]+p.left,e.pos[1]+p.top],D.tooltipShow(e)}),t.dispatch.on("elementMouseout.tooltip",function(e){D.tooltipHide(e)}),r.dispatch.on("elementMouseover.tooltip",function(e){e.pos=[e.pos[0]+p.left,e.pos[1]+p.top],D.tooltipShow(e)}),r.dispatch.on("elementMouseout.tooltip",function(e){D.tooltipHide(e)}),D.on("tooltipHide",function(){T&&e.tooltip.cleanup()}),H.dispatch=D,H.legend=c,H.lines=t,H.lines2=n,H.bars=r,H.bars2=i,H.xAxis=s,H.x2Axis=o,H.y1Axis=u,H.y2Axis=a,H.y3Axis=f,H.y4Axis=l,d3.rebind(H,t,"defined","size","clipVoronoi","interpolate"),H.x=function(e){return arguments.length?(y=e,t.x(e),r.x(e),H):y},H.y=function(e){return arguments.length?(b=e,t.y(e),r.y(e),H):b},H.margin=function(e){return arguments.length?(p.top=typeof e.top!="undefined"?e.top:p.top,p.right=typeof e.right!="undefined"?e.right:p.right,p.bottom=typeof e.bottom!="undefined"?e.bottom:p.bottom,p.left=typeof e.left!="undefined"?e.left:p.left,H):p},H.width=function(e){return arguments.length?(v=e,H):v},H.height=function(e){return arguments.length?(m=e,H):m},H.color=function(t){return arguments.length?(w=e.utils.getColor(t),c.color(w),H):w},H.showLegend=function(e){return arguments.length?(E=e,H):E},H.tooltips=function(e){return arguments.length?(T=e,H):T},H.tooltipContent=function(e){return arguments.length?(N=e,H):N},H.noData=function(e){return arguments.length?(_=e,H):_},H.brushExtent=function(e){return arguments.length?(x=e,H):x},H},e.models.multiBar=function(){function S(e){return e.each(function(e){var S=n-t.left-t.right,T=r-t.top-t.bottom,N=d3.select(this);p&&e.length&&(p=[{values:e[0].values.map(function(e){return{x:e.x,y:0,series:e.series,size:.01}})}]),c&&(e=d3.layout.stack().offset("zero").values(function(e){return e.values}).y(a)(!e.length&&p?p:e)),e=e.map(function(e,t){return e.values=e.values.map(function(e){return e.series=t,e}),e}),c&&e[0].values.map(function(t,n){var r=0,i=0;e.map(function(e){var t=e.values[n];t.size=Math.abs(t.y),t.y<0?(t.y1=i,i-=t.size):(t.y1=t.size+r,r+=t.size)})});var C=g&&y?[]:e.map(function(e){return e.values.map(function(e,t){return{x:u(e,t),y:a(e,t),y0:e.y0,y1:e.y1}})});i.domain(d3.merge(C).map(function(e){return e.x})).rangeBands([0,S],.1),s.domain(y||d3.extent(d3.merge(C).map(function(e){return c?e.y>0?e.y1:e.y1+e.y:e.y}).concat(f))).range([T,0]);if(i.domain()[0]===i.domain()[1]||s.domain()[0]===s.domain()[1])singlePoint=!0;i.domain()[0]===i.domain()[1]&&(i.domain()[0]?i.domain([i.domain()[0]-i.domain()[0]*.01,i.domain()[1]+i.domain()[1]*.01]):i.domain([-1,1])),s.domain()[0]===s.domain()[1]&&(s.domain()[0]?s.domain([s.domain()[0]+s.domain()[0]*.01,s.domain()[1]-s.domain()[1]*.01]):s.domain([-1,1])),w=w||i,E=E||s;var k=N.selectAll("g.nv-wrap.nv-multibar").data([e]),L=k.enter().append("g").attr("class","nvd3 nv-wrap nv-multibar"),A=L.append("defs"),O=L.append("g"),M=k.select("g");O.append("g").attr("class","nv-groups"),k.attr("transform","translate("+t.left+","+t.top+")"),A.append("clipPath").attr("id","nv-edge-clip-"+o).append("rect"),k.select("#nv-edge-clip-"+o+" rect").attr("width",S).attr("height",T),M.attr("clip-path",l?"url(#nv-edge-clip-"+o+")":"");var _=k.select(".nv-groups").selectAll(".nv-group").data(function(e){return e},function(e){return e.key});_.enter().append("g").style("stroke-opacity",1e-6).style("fill-opacity",1e-6),_.exit().selectAll("rect.nv-bar").transition().delay(function(t,n){return n*m/e[0].values.length}).attr("y",function(e){return c?E(e.y0):E(0)}).attr("height",0).remove(),_.attr("class",function(e,t){return"nv-group nv-series-"+t}).classed("hover",function(e){return e.hover}).style("fill",function(e,t){return h(e,t)}).style("stroke",function(e,t){return h(e,t)}),d3.transition(_).style("stroke-opacity",1).style("fill-opacity",.75);var D=_.selectAll("rect.nv-bar").data(function(t){return p&&!e.length?p.values:t.values});D.exit().remove();var P=D.enter().append("rect").attr("class",function(e,t){return a(e,t)<0?"nv-bar negative":"nv-bar positive"}).attr("x",function(t,n,r){return c?0:r*i.rangeBand()/e.length}).attr("y",function(e){return E(c?e.y0:0)}).attr("height",0).attr("width",i.rangeBand()/(c?1:e.length));D.style("fill",function(e,t,n){return h(e,n,t)}).style("stroke",function(e,t,n){return h(e,n,t)}).on("mouseover",function(t,n){d3.select(this).classed("hover",!0),b.elementMouseover({value:a(t,n),point:t,series:e[t.series],pos:[i(u(t,n))+i.rangeBand()*(c?e.length/2:t.series+.5)/e.length,s(a(t,n)+(c?t.y0:0))],pointIndex:n,seriesIndex:t.series,e:d3.event})}).on("mouseout",function(t,n){d3.select(this).classed("hover",!1),b.elementMouseout({value:a(t,n),point:t,series:e[t.series],pointIndex:n,seriesIndex:t.series,e:d3.event})}).on("click",function(t,n){b.elementClick({value:a(t,n),point:t,series:e[t.series],pos:[i(u(t,n))+i.rangeBand()*(c?e.length/2:t.series+.5)/e.length,s(a(t,n)+(c?t.y0:0))],pointIndex:n,seriesIndex:t.series,e:d3.event}),d3.event.stopPropagation()}).on("dblclick",function(t,n){b.elementDblClick({value:a(t,n),point:t,series:e[t.series],pos:[i(u(t,n))+i.rangeBand()*(c?e.length/2:t.series+.5)/e.length,s(a(t,n)+(c?t.y0:0))],pointIndex:n,seriesIndex:t.series,e:d3.event}),d3.event.stopPropagation()}),D.attr("class",function(e,t){return a(e,t)<0?"nv-bar negative":"nv-bar positive"}).attr("transform",function(e,t){return"translate("+i(u(e,t))+",0)"}),d&&(v||(v=e.map(function(){return!0})),D.style("fill",function(e,t,n){return d3.rgb(d(e,t)).darker(v.map(function(e,t){return t}).filter(function(e,t){return!v[t]})[n]).toString()}).style("stroke",function(e,t,n){return d3.rgb(d(e,t)).darker(v.map(function(e,t){return t}).filter(function(e,t){return!v[t]})[n]).toString()})),c?D.transition().delay(function(t,n){return n*m/e[0].values.length}).attr("y",function(e,t){return s(c?e.y1:0)}).attr("height",function(e,t){return Math.max(Math.abs(s(e.y+(c?e.y0:0))-s(c?e.y0:0)),1)}).each("end",function(){d3.transition(d3.select(this)).attr("x",function(t,n){return c?0:t.series*i.rangeBand()/e.length}).attr("width",i.rangeBand()/(c?1:e.length))}):d3.transition(D).delay(function(t,n){return n*m/e[0].values.length}).attr("x",function(t,n){return t.series*i.rangeBand()/e.length}).attr("width",i.rangeBand()/e.length).each("end",function(){d3.transition(d3.select(this)).attr("y",function(e,t){return a(e,t)<0?s(0):s(0)-s(a(e,t))<1?s(0)-1:s(a(e,t))||0}).attr("height",function(e,t){return Math.max(Math.abs(s(a(e,t))-s(0)),1)||0})}),w=i.copy(),E=s.copy()}),S}var t={top:0,right:0,bottom:0,left:0},n=960,r=500,i=d3.scale.ordinal(),s=d3.scale.linear(),o=Math.floor(Math.random()*1e4),u=function(e){return e.x},a=function(e){return e.y},f=[0],l=!0,c=!1,h=e.utils.defaultColor(),p=!1,d=null,v,m=1200,g,y,b=d3.dispatch("chartClick","elementClick","elementDblClick","elementMouseover","elementMouseout"),w,E;return S.dispatch=b,S.x=function(e){return arguments.length?(u=e,S):u},S.y=function(e){return arguments.length?(a=e,S):a},S.margin=function(e){return arguments.length?(t.top=typeof e.top!="undefined"?e.top:t.top,t.right=typeof e.right!="undefined"?e.right:t.right,t.bottom=typeof e.bottom!="undefined"?e.bottom:t.bottom,t.left=typeof e.left!="undefined"?e.left:t.left,S):t},S.width=function(e){return arguments.length?(n=e,S):n},S.height=function(e){return arguments.length?(r=e,S):r},S.xScale=function(e){return arguments.length?(i=e,S):i},S.yScale=function(e){return arguments.length?(s=e,S):s},S.xDomain=function(e){return arguments.length?(g=e,S):g},S.yDomain=function(e){return arguments.length?(y=e,S):y},S.forceY=function(e){return arguments.length?(f=e,S):f},S.stacked=function(e){return arguments.length?(c=e,S):c},S.clipEdge=function(e){return arguments.length?(l=e,S):l},S.color=function(t){return arguments.length?(h=e.utils.getColor(t),S):h},S.barColor=function(t){return arguments.length?(d=e.utils.getColor(t),S):d},S.disabled=function(e){return arguments.length?(v=e,S):v},S.id=function(e){return arguments.length?(o=e,S):o},S.hideable=function(e){return arguments.length?(p=e,S):p},S.delay=function(e){return arguments.length?(m=e,S):m},S},e.models.multiBarChart=function(){function N(e){return e.each(function(m){var C=d3.select(this),k=this,L=(u||parseInt(C.style("width"))||960)-o.left-o.right,A=(a||parseInt(C.style("height"))||400)-o.top-o.bottom;N.update=function(){e.transition().call(N)},N.container=this,b.disabled=m.map(function(e){return!!e.disabled});if(!w){var O;w={};for(O in b)b[O]instanceof Array?w[O]=b[O].slice(0):w[O]=b[O]}if(!m||!m.length||!m.filter(function(e){return e.values.length}).length){var M=C.selectAll(".nv-noData").data([E]);return M.enter().append("text").attr("class","nvd3 nv-noData").attr("dy","-.7em").style("text-anchor","middle"),M.attr("x",o.left+L/2).attr("y",o.top+A/2).text(function(e){return e}),N}C.selectAll(".nv-noData").remove(),g=t.xScale(),y=t.yScale();var _=C.selectAll("g.nv-wrap.nv-multiBarWithLegend").data([m]),D=_.enter().append("g").attr("class","nvd3 nv-wrap nv-multiBarWithLegend").append("g"),P=_.select("g");D.append("g").attr("class","nv-x nv-axis"),D.append("g").attr("class","nv-y nv-axis"),D.append("g").attr("class","nv-barsWrap"),D.append("g").attr("class","nv-legendWrap"),D.append("g").attr("class","nv-controlsWrap"),c&&(i.width(L-x()),t.barColor()&&m.forEach(function(e,t){e.color=d3.rgb("#ccc").darker(t*1.5).toString()}),P.select(".nv-legendWrap").datum(m).call(i),o.top!=i.height()&&(o.top=i.height(),A=(a||parseInt(C.style("height"))||400)-o.top-o.bottom),P.select(".nv-legendWrap").attr("transform","translate("+x()+","+ -o.top+")"));if(l){var H=[{key:"Grouped",disabled:t.stacked()},{key:"Stacked",disabled:!t.stacked()}];s.width(x()).color(["#444","#444","#444"]),P.select(".nv-controlsWrap").datum(H).attr("transform","translate(0,"+ -o.top+")").call(s)}_.attr("transform","translate("+o.left+","+o.top+")"),t.disabled(m.map(function(e){return e.disabled})).width(L).height(A).color(m.map(function(e,t){return e.color||f(e,t)}).filter(function(e,t){return!m[t].disabled}));var B=P.select(".nv-barsWrap").datum(m.filter(function(e){return!e.disabled}));d3.transition(B).call(t),n.scale(g).ticks(L/100).tickSize(-A,0),P.select(".nv-x.nv-axis").attr("transform","translate(0,"+y.range()[0]+")"),d3.transition(P.select(".nv-x.nv-axis")).call(n);var j=P.select(".nv-x.nv-axis > g").selectAll("g");j.selectAll("line, text").style("opacity",1);if(p){var F=function(e,t){return"translate("+e+","+t+")"},I=5,q=17;j.selectAll("text").attr("transform",function(e,t,n){return F(0,n%2==0?I:q)});var R=d3.selectAll(".nv-x.nv-axis .nv-wrap g g text")[0].length;P.selectAll(".nv-x.nv-axis .nv-axisMaxMin text").attr("transform",function(e,t){return F(0,t===0||R%2!==0?q:I)})}h&&j.filter(function(e,t){return t%Math.ceil(m[0].values.length/(L/100))!==0}).selectAll("text, line").style("opacity",0),d&&j.selectAll("text").attr("transform","rotate("+d+" 0,0)").attr("text-anchor",d>0?"start":"end"),P.select(".nv-x.nv-axis").selectAll("g.nv-axisMaxMin text").style("opacity",1),r.scale(y).ticks(A/36).tickSize(-L,0),d3.transition(P.select(".nv-y.nv-axis")).call(r),i.dispatch.on("legendClick",function(t,n){t.disabled=!t.disabled,m.filter(function(e){return!e.disabled}).length||m.map(function(e){return e.disabled=!1,_.selectAll(".nv-series").classed("disabled",!1),e}),b.disabled=m.map(function(e){return!!e.disabled}),S.stateChange(b),e.transition().call(N)}),s.dispatch.on("legendClick",function(n,r){if(!n.disabled)return;H=H.map(function(e){return e.disabled=!0,e}),n.disabled=!1;switch(n.key){case"Grouped":t.stacked(!1);break;case"Stacked":t.stacked(!0)}b.stacked=t.stacked(),S.stateChange(b),e.transition().call(N)}),S.on("tooltipShow",function(e){v&&T(e,k.parentNode)}),S.on("changeState",function(n){typeof n.disabled!="undefined"&&(m.forEach(function(e,t){e.disabled=n.disabled[t]}),b.disabled=n.disabled),typeof n.stacked!="undefined"&&(t.stacked(n.stacked),b.stacked=n.stacked),e.call(N)})}),N}var t=e.models.multiBar(),n=e.models.axis(),r=e.models.axis(),i=e.models.legend(),s=e.models.legend(),o={top:30,right:20,bottom:50,left:60},u=null,a=null,f=e.utils.defaultColor(),l=!0,c=!0,h=!0,p=!1,d=0,v=!0,m=function(e,t,n,r,i){return"<h3>"+e+"</h3>"+"<p>"+n+" on "+t+"</p>"},g,y,b={stacked:!1},w=null,E="No Data Available.",S=d3.dispatch("tooltipShow","tooltipHide","stateChange","changeState"),x=function(){return l?180:0};t.stacked(!1),n.orient("bottom").tickPadding(7).highlightZero(!1).showMaxMin(!1).tickFormat(function(e){return e}),r.orient("left").tickFormat(d3.format(",.1f"));var T=function(i,s){var o=i.pos[0]+(s.offsetLeft||0),u=i.pos[1]+(s.offsetTop||0),a=n.tickFormat()(t.x()(i.point,i.pointIndex)),f=r.tickFormat()(t.y()(i.point,i.pointIndex)),l=m(i.series.key,a,f,i,N);e.tooltip.show([o,u],l,i.value<0?"n":"s",null,s)};return t.dispatch.on("elementMouseover.tooltip",function(e){e.pos=[e.pos[0]+o.left,e.pos[1]+o.top],S.tooltipShow(e)}),t.dispatch.on("elementMouseout.tooltip",function(e){S.tooltipHide(e)}),S.on("tooltipHide",function(){v&&e.tooltip.cleanup()}),N.dispatch=S,N.multibar=t,N.legend=i,N.xAxis=n,N.yAxis=r,d3.rebind(N,t,"x","y","xDomain","yDomain","forceX","forceY","clipEdge","id","stacked","delay","barColor"),N.margin=function(e){return arguments.length?(o.top=typeof e.top!="undefined"?e.top:o.top,o.right=typeof e.right!="undefined"?e.right:o.right,o.bottom=typeof e.bottom!="undefined"?e.bottom:o.bottom,o.left=typeof e.left!="undefined"?e.left:o.left,N):o},N.width=function(e){return arguments.length?(u=e,N):u},N.height=function(e){return arguments.length?(a=e,N):a},N.color=function(t){return arguments.length?(f=e.utils.getColor(t),i.color(f),N):f},N.showControls=function(e){return arguments.length?(l=e,N):l},N.showLegend=function(e){return arguments.length?(c=e,N):c},N.reduceXTicks=function(e){return arguments.length?(h=e,N):h},N.rotateLabels=function(e){return arguments.length?(d=e,N):d},N.staggerLabels=function(e){return arguments.length?(p=e,N):p},N.tooltip=function(e){return arguments.length?(m=e,N):m},N.tooltips=function(e){return arguments.length?(v=e,N):v},N.tooltipContent=function(e){return arguments.length?(m=e,N):m},N.state=function(e){return arguments.length?(b=e,N):b},N.defaultState=function(e){return arguments.length?(w=e,N):w},N.noData=function(e){return arguments.length?(E=e,N):E},N},e.models.multiBarHorizontal=function(){function x(e){return e.each(function(e){var i=n-t.left-t.right,g=r-t.top-t.bottom,x=d3.select(this);p&&(e=d3.layout.stack().offset("zero").values(function(e){return e.values}).y(a)(e)),e=e.map(function(e,t){return e.values=e.values.map(function(e){return e.series=t,e}),e}),p&&e[0].values.map(function(t,n){var r=0,i=0;e.map(function(e){var t=e.values[n];t.size=Math.abs(t.y),t.y<0?(t.y1=i-t.size,i-=t.size):(t.y1=r,r+=t.size)})});var T=y&&b?[]:e.map(function(e){return e.values.map(function(e,t){return{x:u(e,t),y:a(e,t),y0:e.y0,y1:e.y1}})});s.domain(y||d3.merge(T).map(function(e){return e.x})).rangeBands([0,g],.1),o.domain(b||d3.extent(d3.merge(T).map(function(e){return p?e.y>0?e.y1+e.y:e.y1:e.y}).concat(f))),d&&!p?o.range([o.domain()[0]<0?v:0,i-(o.domain()[1]>0?v:0)]):o.range([0,i]),E=E||s,S=S||d3.scale.linear().domain(o.domain()).range([o(0),o(0)]);var N=d3.select(this).selectAll("g.nv-wrap.nv-multibarHorizontal").data([e]),C=N.enter().append("g").attr("class","nvd3 nv-wrap nv-multibarHorizontal"),k=C.append("defs"),L=C.append("g"),A=N.select("g");L.append("g").attr("class","nv-groups"),N.attr("transform","translate("+t.left+","+t.top+")");var O=N.select(".nv-groups").selectAll(".nv-group").data(function(e){return e},function(e){return e.key});O.enter().append("g").style("stroke-opacity",1e-6).style("fill-opacity",1e-6),d3.transition(O.exit()).style("stroke-opacity",1e-6).style("fill-opacity",1e-6).remove(),O.attr("class",function(e,t){return"nv-group nv-series-"+t}).classed("hover",function(e){return e.hover}).style("fill",function(e,t){return l(e,t)}).style("stroke",function(e,t){return l(e,t)}),d3.transition(O).style("stroke-opacity",1).style("fill-opacity",.75);var M=O.selectAll("g.nv-bar").data(function(e){return e.values});M.exit().remove();var _=M.enter().append("g").attr("transform",function(t,n,r){return"translate("+S(p?t.y0:0)+","+(p?0:r*s.rangeBand()/e.length+s(u(t,n)))+")"});_.append("rect").attr("width",0).attr("height",s.rangeBand()/(p?1:e.length)),M.on("mouseover",function(t,n){d3.select(this).classed("hover",!0),w.elementMouseover({value:a(t,n),point:t,series:e[t.series],pos:[o(a(t,n)+(p?t.y0:0)),s(u(t,n))+s.rangeBand()*(p?e.length/2:t.series+.5)/e.length],pointIndex:n,seriesIndex:t.series,e:d3.event})}).on("mouseout",function(t,n){d3.select(this).classed("hover",!1),w.elementMouseout({value:a(t,n),point:t,series:e[t.series],pointIndex:n,seriesIndex:t.series,e:d3.event})}).on("click",function(t,n){w.elementClick({value:a(t,n),point:t,series:e[t.series],pos:[s(u(t,n))+s.rangeBand()*(p?e.length/2:t.series+.5)/e.length,o(a(t,n)+(p?t.y0:0))],pointIndex:n,seriesIndex:t.series,e:d3.event}),d3.event.stopPropagation()}).on("dblclick",function(t,n){w.elementDblClick({value:a(t,n),point:t,series:e[t.series],pos:[s(u(t,n))+s.rangeBand()*(p?e.length/2:t.series+.5)/e.length,o(a(t,n)+(p?t.y0:0))],pointIndex:n,seriesIndex:t.series,e:d3.event}),d3.event.stopPropagation()}),_.append("text"),d&&!p?(M.select("text").attr("text-anchor",function(e,t){return a(e,t)<0?"end":"start"}).attr("y",s.rangeBand()/(e.length*2)).attr("dy",".32em").text(function(e,t){return m(a(e,t))}),d3.transition(M).select("text").attr("x",function(e,t){return a(e,t)<0?-4:o(a(e,t))-o(0)+4})):M.selectAll("text").text(""),M.attr("class",function(e,t){return a(e,t)<0?"nv-bar negative":"nv-bar positive"}),c&&(h||(h=e.map(function(){return!0})),M.style("fill",function(e,t,n){return d3.rgb(c(e,t)).darker(h.map(function(e,t){return t}).filter(function(e,t){return!h[t]})[n]).toString()}).style("stroke",function(e,t,n){return d3.rgb(c(e,t)).darker(h.map(function(e,t){return t}).filter(function(e,t){return!h[t]})[n]).toString()})),p?d3.transition(M).attr("transform",function(e,t){return"translate("+o(e.y1)+","+s(u(e,t))+")"}).select("rect").attr("width",function(e,t){return Math.abs(o(a(e,t)+e.y0)-o(e.y0))}).attr("height",s.rangeBand()):d3.transition(M).attr("transform",function(t,n){return"translate("+(a(t,n)<0?o(a(t,n)):o(0))+","+(t.series*s.rangeBand()/e.length+s(u(t,n)))+")"}).select("rect").attr("height",s.rangeBand()/e.length).attr("width",function(e,t){return Math.max(Math.abs(o(a(e,t))-o(0)),1)}),E=s.copy(),S=o.copy()}),x}var t={top:0,right:0,bottom:0,left:0},n=960,r=500,i=Math.floor(Math.random()*1e4),s=d3.scale.ordinal(),o=d3.scale.linear(),u=function(e){return e.x},a=function(e){return e.y},f=[0],l=e.utils.defaultColor(),c=null,h,p=!1,d=!1,v=60,m=d3.format(",.2f"),g=1200,y,b,w=d3.dispatch("chartClick","elementClick","elementDblClick","elementMouseover","elementMouseout"),E,S;return x.dispatch=w,x.x=function(e){return arguments.length?(u=e,x):u},x.y=function(e){return arguments.length?(a=e,x):a},x.margin=function(e){return arguments.length?(t.top=typeof e.top!="undefined"?e.top:t.top,t.right=typeof e.right!="undefined"?e.right:t.right,t.bottom=typeof e.bottom!="undefined"?e.bottom:t.bottom,t.left=typeof e.left!="undefined"?e.left:t.left,x):t},x.width=function(e){return arguments.length?(n=e,x):n},x.height=function(e){return arguments.length?(r=e,x):r},x.xScale=function(e){return arguments.length?(s=e,x):s},x.yScale=function(e){return arguments.length?(o=e,x):o},x.xDomain=function(e){return arguments.length?(y=e,x):y},x.yDomain=function(e){return arguments.length?(b=e,x):b},x.forceY=function(e){return arguments.length?(f=e,x):f},x.stacked=function(e){return arguments.length?(p=e,x):p},x.color=function(t){return arguments.length?(l=e.utils.getColor(t),x):l},x.barColor=function(t){return arguments.length?(c=e.utils.getColor(t),x):c},x.disabled=function(e){return arguments.length?(h=e,x):h},x.id=function(e){return arguments.length?(i=e,x):i},x.delay=function(e){return arguments.length?(g=e,x):g},x.showValues=function(e){return arguments.length?(d=e,x):d},x.valueFormat=function(e){return arguments.length?(m=e,x):m},x.valuePadding=function(e){return arguments.length?(v=e,x):v},x},e.models.multiBarHorizontalChart=function(){function x(e){return e.each(function(h){var d=d3.select(this),T=this,N=(u||parseInt(d.style("width"))||960)-o.left-o.right,C=(a||parseInt(d.style("height"))||400)-o.top-o.bottom;x.update=function(){e.transition().call(x)},x.container=this,g.disabled=h.map(function(e){return!!e.disabled});if(!y){var k;y={};for(k in g)g[k]instanceof Array?y[k]=g[k].slice(0):y[k]=g[k]}if(!h||!h.length||!h.filter(function(e){return e.values.length}).length){var L=d.selectAll(".nv-noData").data([b]);return L.enter().append("text").attr("class","nvd3 nv-noData").attr("dy","-.7em").style("text-anchor","middle"),L.attr("x",o.left+N/2).attr("y",o.top+C/2).text(function(e){return e}),x}d.selectAll(".nv-noData").remove(),v=t.xScale(),m=t.yScale();var A=d.selectAll("g.nv-wrap.nv-multiBarHorizontalChart").data([h]),O=A.enter().append("g").attr("class","nvd3 nv-wrap nv-multiBarHorizontalChart").append("g"),M=A.select("g");O.append("g").attr("class","nv-x nv-axis"),O.append("g").attr("class","nv-y nv-axis"),O.append("g").attr("class","nv-barsWrap"),O.append("g").attr("class","nv-legendWrap"),O.append("g").attr("class","nv-controlsWrap"),c&&(i.width(N-E()),t.barColor()&&h.forEach(function(e,t){e.color=d3.rgb("#ccc").darker(t*1.5).toString()}),M.select(".nv-legendWrap").datum(h).call(i),o.top!=i.height()&&(o.top=i.height(),C=(a||parseInt(d.style("height"))||400)-o.top-o.bottom),M.select(".nv-legendWrap").attr("transform","translate("+E()+","+ -o.top+")"));if(l){var _=[{key:"Grouped",disabled:t.stacked()},{key:"Stacked",disabled:!t.stacked()}];s.width(E()).color(["#444","#444","#444"]),M.select(".nv-controlsWrap").datum(_).attr("transform","translate(0,"+ -o.top+")").call(s)}A.attr("transform","translate("+o.left+","+o.top+")"),t.disabled(h.map(function(e){return e.disabled})).width(N).height(C).color(h.map(function(e,t){return e.color||f(e,t)}).filter(function(e,t){return!h[t].disabled}));var D=M.select(".nv-barsWrap").datum(h.filter(function(e){return!e.disabled}));d3.transition(D).call(t),n.scale(v).ticks(C/24).tickSize(-N,0),d3.transition(M.select(".nv-x.nv-axis")).call(n);var P=M.select(".nv-x.nv-axis").selectAll("g");P.selectAll("line, text").style("opacity",1),r.scale(m).ticks(N/100).tickSize(-C,0),M.select(".nv-y.nv-axis").attr("transform","translate(0,"+C+")"),d3.transition(M.select(".nv-y.nv-axis")).call(r),i.dispatch.on("legendClick",function(t,n){t.disabled=!t.disabled,h.filter(function(e){return!e.disabled}).length||h.map(function(e){return e.disabled=!1,A.selectAll(".nv-series").classed("disabled",!1),e}),g.disabled=h.map(function(e){return!!e.disabled}),w.stateChange(g),e.transition().call(x)}),s.dispatch.on("legendClick",function(n,r){if(!n.disabled)return;_=_.map(function(e){return e.disabled=!0,e}),n.disabled=!1;switch(n.key){case"Grouped":t.stacked(!1);break;case"Stacked":t.stacked(!0)}g.stacked=t.stacked(),w.stateChange(g),e.transition().call(x)}),w.on("tooltipShow",function(e){p&&S(e,T.parentNode)}),w.on("changeState",function(n){typeof n.disabled!="undefined"&&(h.forEach
(function(e,t){e.disabled=n.disabled[t]}),g.disabled=n.disabled),typeof n.stacked!="undefined"&&(t.stacked(n.stacked),g.stacked=n.stacked),e.call(x)})}),x}var t=e.models.multiBarHorizontal(),n=e.models.axis(),r=e.models.axis(),i=e.models.legend().height(30),s=e.models.legend().height(30),o={top:30,right:20,bottom:50,left:60},u=null,a=null,f=e.utils.defaultColor(),l=!0,c=!0,h=!1,p=!0,d=function(e,t,n,r,i){return"<h3>"+e+" - "+t+"</h3>"+"<p>"+n+"</p>"},v,m,g={stacked:h},y=null,b="No Data Available.",w=d3.dispatch("tooltipShow","tooltipHide","stateChange","changeState"),E=function(){return l?180:0};t.stacked(h),n.orient("left").tickPadding(5).highlightZero(!1).showMaxMin(!1).tickFormat(function(e){return e}),r.orient("bottom").tickFormat(d3.format(",.1f"));var S=function(i,s){var o=i.pos[0]+(s.offsetLeft||0),u=i.pos[1]+(s.offsetTop||0),a=n.tickFormat()(t.x()(i.point,i.pointIndex)),f=r.tickFormat()(t.y()(i.point,i.pointIndex)),l=d(i.series.key,a,f,i,x);e.tooltip.show([o,u],l,i.value<0?"e":"w",null,s)};return t.dispatch.on("elementMouseover.tooltip",function(e){e.pos=[e.pos[0]+o.left,e.pos[1]+o.top],w.tooltipShow(e)}),t.dispatch.on("elementMouseout.tooltip",function(e){w.tooltipHide(e)}),w.on("tooltipHide",function(){p&&e.tooltip.cleanup()}),x.dispatch=w,x.multibar=t,x.legend=i,x.xAxis=n,x.yAxis=r,d3.rebind(x,t,"x","y","xDomain","yDomain","forceX","forceY","clipEdge","id","delay","showValues","valueFormat","stacked","barColor"),x.margin=function(e){return arguments.length?(o.top=typeof e.top!="undefined"?e.top:o.top,o.right=typeof e.right!="undefined"?e.right:o.right,o.bottom=typeof e.bottom!="undefined"?e.bottom:o.bottom,o.left=typeof e.left!="undefined"?e.left:o.left,x):o},x.width=function(e){return arguments.length?(u=e,x):u},x.height=function(e){return arguments.length?(a=e,x):a},x.color=function(t){return arguments.length?(f=e.utils.getColor(t),i.color(f),x):f},x.showControls=function(e){return arguments.length?(l=e,x):l},x.showLegend=function(e){return arguments.length?(c=e,x):c},x.tooltip=function(e){return arguments.length?(d=e,x):d},x.tooltips=function(e){return arguments.length?(p=e,x):p},x.tooltipContent=function(e){return arguments.length?(d=e,x):d},x.state=function(e){return arguments.length?(g=e,x):g},x.defaultState=function(e){return arguments.length?(y=e,x):y},x.noData=function(e){return arguments.length?(b=e,x):b},x},e.models.multiChart=function(){function T(e){return e.each(function(u){var f=d3.select(this),N=this,C=(r||parseInt(f.style("width"))||960)-t.left-t.right,k=(i||parseInt(f.style("height"))||400)-t.top-t.bottom,L=u.filter(function(e){return!e.disabled&&e.type=="line"&&e.yAxis==1}),A=u.filter(function(e){return!e.disabled&&e.type=="line"&&e.yAxis==2}),O=u.filter(function(e){return!e.disabled&&e.type=="bar"&&e.yAxis==1}),M=u.filter(function(e){return!e.disabled&&e.type=="bar"&&e.yAxis==2}),_=u.filter(function(e){return!e.disabled&&e.type=="area"&&e.yAxis==1}),D=u.filter(function(e){return!e.disabled&&e.type=="area"&&e.yAxis==2}),P=u.filter(function(e){return!e.disabled&&e.yAxis==1}).map(function(e){return e.values.map(function(e,t){return{x:e.x,y:e.y}})}),H=u.filter(function(e){return!e.disabled&&e.yAxis==2}).map(function(e){return e.values.map(function(e,t){return{x:e.x,y:e.y}})});a.domain(d3.extent(d3.merge(P.concat(H)),function(e){return e.x})).range([0,C]);var B=f.selectAll("g.wrap.multiChart").data([u]),j=B.enter().append("g").attr("class","wrap nvd3 multiChart").append("g");j.append("g").attr("class","x axis"),j.append("g").attr("class","y1 axis"),j.append("g").attr("class","y2 axis"),j.append("g").attr("class","lines1Wrap"),j.append("g").attr("class","lines2Wrap"),j.append("g").attr("class","bars1Wrap"),j.append("g").attr("class","bars2Wrap"),j.append("g").attr("class","stack1Wrap"),j.append("g").attr("class","stack2Wrap"),j.append("g").attr("class","legendWrap");var F=B.select("g");s&&(E.width(C/2),F.select(".legendWrap").datum(u.map(function(e){return e.originalKey=e.originalKey===undefined?e.key:e.originalKey,e.key=e.originalKey+(e.yAxis==1?"":" (right axis)"),e})).call(E),t.top!=E.height()&&(t.top=E.height(),k=(i||parseInt(f.style("height"))||400)-t.top-t.bottom),F.select(".legendWrap").attr("transform","translate("+C/2+","+ -t.top+")")),h.width(C).height(k).interpolate("monotone").color(u.map(function(e,t){return e.color||n[t%n.length]}).filter(function(e,t){return!u[t].disabled&&u[t].yAxis==1&&u[t].type=="line"})),p.width(C).height(k).interpolate("monotone").color(u.map(function(e,t){return e.color||n[t%n.length]}).filter(function(e,t){return!u[t].disabled&&u[t].yAxis==2&&u[t].type=="line"})),d.width(C).height(k).color(u.map(function(e,t){return e.color||n[t%n.length]}).filter(function(e,t){return!u[t].disabled&&u[t].yAxis==1&&u[t].type=="bar"})),v.width(C).height(k).color(u.map(function(e,t){return e.color||n[t%n.length]}).filter(function(e,t){return!u[t].disabled&&u[t].yAxis==2&&u[t].type=="bar"})),m.width(C).height(k).color(u.map(function(e,t){return e.color||n[t%n.length]}).filter(function(e,t){return!u[t].disabled&&u[t].yAxis==1&&u[t].type=="area"})),g.width(C).height(k).color(u.map(function(e,t){return e.color||n[t%n.length]}).filter(function(e,t){return!u[t].disabled&&u[t].yAxis==2&&u[t].type=="area"})),F.attr("transform","translate("+t.left+","+t.top+")");var I=F.select(".lines1Wrap").datum(L),q=F.select(".bars1Wrap").datum(O),R=F.select(".stack1Wrap").datum(_),U=F.select(".lines2Wrap").datum(A),z=F.select(".bars2Wrap").datum(M),W=F.select(".stack2Wrap").datum(D),X=_.length?_.map(function(e){return e.values}).reduce(function(e,t){return e.map(function(e,n){return{x:e.x,y:e.y+t[n].y}})}).concat([{x:0,y:0}]):[],V=D.length?D.map(function(e){return e.values}).reduce(function(e,t){return e.map(function(e,n){return{x:e.x,y:e.y+t[n].y}})}).concat([{x:0,y:0}]):[];l.domain(d3.extent(d3.merge(P).concat(X),function(e){return e.y})).range([0,k]),c.domain(d3.extent(d3.merge(H).concat(V),function(e){return e.y})).range([0,k]),h.yDomain(l.domain()),d.yDomain(l.domain()),m.yDomain(l.domain()),p.yDomain(c.domain()),v.yDomain(c.domain()),g.yDomain(c.domain()),_.length&&d3.transition(R).call(m),D.length&&d3.transition(W).call(g),O.length&&d3.transition(q).call(d),M.length&&d3.transition(z).call(v),L.length&&d3.transition(I).call(h),A.length&&d3.transition(U).call(p),y.ticks(C/100).tickSize(-k,0),F.select(".x.axis").attr("transform","translate(0,"+k+")"),d3.transition(F.select(".x.axis")).call(y),b.ticks(k/36).tickSize(-C,0),d3.transition(F.select(".y1.axis")).call(b),w.ticks(k/36).tickSize(-C,0),d3.transition(F.select(".y2.axis")).call(w),F.select(".y2.axis").style("opacity",H.length?1:0).attr("transform","translate("+a.range()[1]+",0)"),E.dispatch.on("legendClick",function(t,n){t.disabled=!t.disabled,u.filter(function(e){return!e.disabled}).length||u.map(function(e){return e.disabled=!1,B.selectAll(".series").classed("disabled",!1),e}),e.transition().call(T)}),S.on("tooltipShow",function(e){o&&x(e,N.parentNode)})}),T.update=function(){T(e)},T.container=this,T}var t={top:30,right:20,bottom:50,left:60},n=d3.scale.category20().range(),r=null,i=null,s=!0,o=!0,u=function(e,t,n,r,i){return"<h3>"+e+"</h3>"+"<p>"+n+" at "+t+"</p>"},a,f,a=d3.scale.linear(),l=d3.scale.linear(),c=d3.scale.linear(),h=e.models.line().yScale(l),p=e.models.line().yScale(c),d=e.models.multiBar().stacked(!1).yScale(l),v=e.models.multiBar().stacked(!1).yScale(c),m=e.models.stackedArea().yScale(l),g=e.models.stackedArea().yScale(c),y=e.models.axis().scale(a).orient("bottom").tickPadding(5),b=e.models.axis().scale(l).orient("left"),w=e.models.axis().scale(c).orient("right"),E=e.models.legend().height(30),S=d3.dispatch("tooltipShow","tooltipHide"),x=function(t,n){var r=t.pos[0]+(n.offsetLeft||0),i=t.pos[1]+(n.offsetTop||0),s=y.tickFormat()(h.x()(t.point,t.pointIndex)),o=(t.series.yAxis==2?w:b).tickFormat()(h.y()(t.point,t.pointIndex)),a=u(t.series.key,s,o,t,T);e.tooltip.show([r,i],a,undefined,undefined,n.offsetParent)};return h.dispatch.on("elementMouseover.tooltip",function(e){e.pos=[e.pos[0]+t.left,e.pos[1]+t.top],S.tooltipShow(e)}),h.dispatch.on("elementMouseout.tooltip",function(e){S.tooltipHide(e)}),p.dispatch.on("elementMouseover.tooltip",function(e){e.pos=[e.pos[0]+t.left,e.pos[1]+t.top],S.tooltipShow(e)}),p.dispatch.on("elementMouseout.tooltip",function(e){S.tooltipHide(e)}),d.dispatch.on("elementMouseover.tooltip",function(e){e.pos=[e.pos[0]+t.left,e.pos[1]+t.top],S.tooltipShow(e)}),d.dispatch.on("elementMouseout.tooltip",function(e){S.tooltipHide(e)}),v.dispatch.on("elementMouseover.tooltip",function(e){e.pos=[e.pos[0]+t.left,e.pos[1]+t.top],S.tooltipShow(e)}),v.dispatch.on("elementMouseout.tooltip",function(e){S.tooltipHide(e)}),m.dispatch.on("tooltipShow",function(e){if(!Math.round(m.y()(e.point)*100))return setTimeout(function(){d3.selectAll(".point.hover").classed("hover",!1)},0),!1;e.pos=[e.pos[0]+t.left,e.pos[1]+t.top],S.tooltipShow(e)}),m.dispatch.on("tooltipHide",function(e){S.tooltipHide(e)}),g.dispatch.on("tooltipShow",function(e){if(!Math.round(g.y()(e.point)*100))return setTimeout(function(){d3.selectAll(".point.hover").classed("hover",!1)},0),!1;e.pos=[e.pos[0]+t.left,e.pos[1]+t.top],S.tooltipShow(e)}),g.dispatch.on("tooltipHide",function(e){S.tooltipHide(e)}),h.dispatch.on("elementMouseover.tooltip",function(e){e.pos=[e.pos[0]+t.left,e.pos[1]+t.top],S.tooltipShow(e)}),h.dispatch.on("elementMouseout.tooltip",function(e){S.tooltipHide(e)}),p.dispatch.on("elementMouseover.tooltip",function(e){e.pos=[e.pos[0]+t.left,e.pos[1]+t.top],S.tooltipShow(e)}),p.dispatch.on("elementMouseout.tooltip",function(e){S.tooltipHide(e)}),S.on("tooltipHide",function(){o&&e.tooltip.cleanup()}),T.dispatch=S,T.lines1=h,T.lines2=p,T.bars1=d,T.bars2=v,T.stack1=m,T.stack2=g,T.xAxis=y,T.yAxis1=b,T.yAxis2=w,T.x=function(e){return arguments.length?(getX=e,h.x(e),d.x(e),T):getX},T.y=function(e){return arguments.length?(getY=e,h.y(e),d.y(e),T):getY},T.margin=function(e){return arguments.length?(t=e,T):t},T.width=function(e){return arguments.length?(r=e,T):r},T.height=function(e){return arguments.length?(i=e,T):i},T.color=function(e){return arguments.length?(n=e,E.color(e),T):n},T.showLegend=function(e){return arguments.length?(s=e,T):s},T.tooltips=function(e){return arguments.length?(o=e,T):o},T.tooltipContent=function(e){return arguments.length?(u=e,T):u},T},e.models.ohlcBar=function(){function E(e){return e.each(function(e){var g=n-t.left-t.right,E=r-t.top-t.bottom,S=d3.select(this);s.domain(y||d3.extent(e[0].values.map(u).concat(p))),v?s.range([g*.5/e[0].values.length,g*(e[0].values.length-.5)/e[0].values.length]):s.range([0,g]),o.domain(b||[d3.min(e[0].values.map(h).concat(d)),d3.max(e[0].values.map(c).concat(d))]).range([E,0]);if(s.domain()[0]===s.domain()[1]||o.domain()[0]===o.domain()[1])singlePoint=!0;s.domain()[0]===s.domain()[1]&&(s.domain()[0]?s.domain([s.domain()[0]-s.domain()[0]*.01,s.domain()[1]+s.domain()[1]*.01]):s.domain([-1,1])),o.domain()[0]===o.domain()[1]&&(o.domain()[0]?o.domain([o.domain()[0]+o.domain()[0]*.01,o.domain()[1]-o.domain()[1]*.01]):o.domain([-1,1]));var T=d3.select(this).selectAll("g.nv-wrap.nv-ohlcBar").data([e[0].values]),N=T.enter().append("g").attr("class","nvd3 nv-wrap nv-ohlcBar"),C=N.append("defs"),k=N.append("g"),L=T.select("g");k.append("g").attr("class","nv-ticks"),T.attr("transform","translate("+t.left+","+t.top+")"),S.on("click",function(e,t){w.chartClick({data:e,index:t,pos:d3.event,id:i})}),C.append("clipPath").attr("id","nv-chart-clip-path-"+i).append("rect"),T.select("#nv-chart-clip-path-"+i+" rect").attr("width",g).attr("height",E),L.attr("clip-path",m?"url(#nv-chart-clip-path-"+i+")":"");var A=T.select(".nv-ticks").selectAll(".nv-tick").data(function(e){return e});A.exit().remove();var O=A.enter().append("path").attr("class",function(e,t,n){return(f(e,t)>l(e,t)?"nv-tick negative":"nv-tick positive")+" nv-tick-"+n+"-"+t}).attr("d",function(t,n){var r=g/e[0].values.length*.9;return"m0,0l0,"+(o(f(t,n))-o(c(t,n)))+"l"+ -r/2+",0l"+r/2+",0l0,"+(o(h(t,n))-o(f(t,n)))+"l0,"+(o(l(t,n))-o(h(t,n)))+"l"+r/2+",0l"+ -r/2+",0z"}).attr("transform",function(e,t){return"translate("+s(u(e,t))+","+o(c(e,t))+")"}).on("mouseover",function(t,n){d3.select(this).classed("hover",!0),w.elementMouseover({point:t,series:e[0],pos:[s(u(t,n)),o(a(t,n))],pointIndex:n,seriesIndex:0,e:d3.event})}).on("mouseout",function(t,n){d3.select(this).classed("hover",!1),w.elementMouseout({point:t,series:e[0],pointIndex:n,seriesIndex:0,e:d3.event})}).on("click",function(e,t){w.elementClick({value:a(e,t),data:e,index:t,pos:[s(u(e,t)),o(a(e,t))],e:d3.event,id:i}),d3.event.stopPropagation()}).on("dblclick",function(e,t){w.elementDblClick({value:a(e,t),data:e,index:t,pos:[s(u(e,t)),o(a(e,t))],e:d3.event,id:i}),d3.event.stopPropagation()});A.attr("class",function(e,t,n){return(f(e,t)>l(e,t)?"nv-tick negative":"nv-tick positive")+" nv-tick-"+n+"-"+t}),d3.transition(A).attr("transform",function(e,t){return"translate("+s(u(e,t))+","+o(c(e,t))+")"}).attr("d",function(t,n){var r=g/e[0].values.length*.9;return"m0,0l0,"+(o(f(t,n))-o(c(t,n)))+"l"+ -r/2+",0l"+r/2+",0l0,"+(o(h(t,n))-o(f(t,n)))+"l0,"+(o(l(t,n))-o(h(t,n)))+"l"+r/2+",0l"+ -r/2+",0z"})}),E}var t={top:0,right:0,bottom:0,left:0},n=960,r=500,i=Math.floor(Math.random()*1e4),s=d3.scale.linear(),o=d3.scale.linear(),u=function(e){return e.x},a=function(e){return e.y},f=function(e){return e.open},l=function(e){return e.close},c=function(e){return e.high},h=function(e){return e.low},p=[],d=[],v=!1,m=!0,g=e.utils.defaultColor(),y,b,w=d3.dispatch("chartClick","elementClick","elementDblClick","elementMouseover","elementMouseout");return E.dispatch=w,E.x=function(e){return arguments.length?(u=e,E):u},E.y=function(e){return arguments.length?(a=e,E):a},E.open=function(e){return arguments.length?(f=e,E):f},E.close=function(e){return arguments.length?(l=e,E):l},E.high=function(e){return arguments.length?(c=e,E):c},E.low=function(e){return arguments.length?(h=e,E):h},E.margin=function(e){return arguments.length?(t.top=typeof e.top!="undefined"?e.top:t.top,t.right=typeof e.right!="undefined"?e.right:t.right,t.bottom=typeof e.bottom!="undefined"?e.bottom:t.bottom,t.left=typeof e.left!="undefined"?e.left:t.left,E):t},E.width=function(e){return arguments.length?(n=e,E):n},E.height=function(e){return arguments.length?(r=e,E):r},E.xScale=function(e){return arguments.length?(s=e,E):s},E.yScale=function(e){return arguments.length?(o=e,E):o},E.xDomain=function(e){return arguments.length?(y=e,E):y},E.yDomain=function(e){return arguments.length?(b=e,E):b},E.forceX=function(e){return arguments.length?(p=e,E):p},E.forceY=function(e){return arguments.length?(d=e,E):d},E.padData=function(e){return arguments.length?(v=e,E):v},E.clipEdge=function(e){return arguments.length?(m=e,E):m},E.color=function(t){return arguments.length?(g=e.utils.getColor(t),E):g},E.id=function(e){return arguments.length?(i=e,E):i},E},e.models.pie=function(){function E(e){return e.each(function(e){function P(e){var t=(e.startAngle+e.endAngle)*90/Math.PI-90;return t>90?t-180:t}function H(e){v||(e.innerRadius=0);var t=d3.interpolate(this._current,e);return this._current=t(0),function(e){return L(t(e))}}function B(e){e.innerRadius=0;var t=d3.interpolate({startAngle:0,endAngle:0},e);return function(e){return L(t(e))}}var u=n-t.left-t.right,l=r-t.top-t.bottom,E=Math.min(u,l)/2,S=E-E/5,x=d3.select(this),T=x.selectAll(".nv-wrap.nv-pie").data([i(e[0])]),N=T.enter().append("g").attr("class","nvd3 nv-wrap nv-pie nv-chart-"+a),C=N.append("g"),k=T.select("g");C.append("g").attr("class","nv-pie"),T.attr("transform","translate("+t.left+","+t.top+")"),k.select(".nv-pie").attr("transform","translate("+u/2+","+l/2+")"),x.on("click",function(e,t){w.chartClick({data:e,index:t,pos:d3.event,id:a})});var L=d3.svg.arc().outerRadius(S);g&&L.startAngle(g),y&&L.endAngle(y),v&&L.innerRadius(E*b);var A=d3.layout.pie().sort(null).value(function(e){return e.disabled?0:o(e)}),O=T.select(".nv-pie").selectAll(".nv-slice").data(A);O.exit().remove();var M=O.enter().append("g").attr("class","nv-slice").on("mouseover",function(e,t){d3.select(this).classed("hover",!0),w.elementMouseover({label:s(e.data),value:o(e.data),point:e.data,pointIndex:t,pos:[d3.event.pageX,d3.event.pageY],id:a})}).on("mouseout",function(e,t){d3.select(this).classed("hover",!1),w.elementMouseout({label:s(e.data),value:o(e.data),point:e.data,index:t,id:a})}).on("click",function(e,t){w.elementClick({label:s(e.data),value:o(e.data),point:e.data,index:t,pos:d3.event,id:a}),d3.event.stopPropagation()}).on("dblclick",function(e,t){w.elementDblClick({label:s(e.data),value:o(e.data),point:e.data,index:t,pos:d3.event,id:a}),d3.event.stopPropagation()});O.attr("fill",function(e,t){return f(e,t)}).attr("stroke",function(e,t){return f(e,t)});var _=M.append("path").each(function(e){this._current=e});d3.transition(O.select("path")).attr("d",L).attrTween("d",H);if(c){var D=d3.svg.arc().innerRadius(0);h&&(D=L),p&&(D=d3.svg.arc().outerRadius(L.outerRadius())),M.append("g").classed("nv-label",!0).each(function(e,t){var n=d3.select(this);n.attr("transform",function(e){if(m){e.outerRadius=S+10,e.innerRadius=S+15;var t=(e.startAngle+e.endAngle)/2*(180/Math.PI);return(e.startAngle+e.endAngle)/2<Math.PI?t-=90:t+=90,"translate("+D.centroid(e)+") rotate("+t+")"}return e.outerRadius=E+10,e.innerRadius=E+15,"translate("+D.centroid(e)+")"}),n.append("rect").style("stroke","#fff").style("fill","#fff").attr("rx",3).attr("ry",3),n.append("text").style("text-anchor",m?(e.startAngle+e.endAngle)/2<Math.PI?"start":"end":"middle").style("fill","#000")}),O.select(".nv-label").transition().attr("transform",function(e){if(m){e.outerRadius=S+10,e.innerRadius=S+15;var t=(e.startAngle+e.endAngle)/2*(180/Math.PI);return(e.startAngle+e.endAngle)/2<Math.PI?t-=90:t+=90,"translate("+D.centroid(e)+") rotate("+t+")"}return e.outerRadius=E+10,e.innerRadius=E+15,"translate("+D.centroid(e)+")"}),O.each(function(e,t){var n=d3.select(this);n.select(".nv-label text").style("text-anchor",m?(e.startAngle+e.endAngle)/2<Math.PI?"start":"end":"middle").text(function(e,t){var n=(e.endAngle-e.startAngle)/(2*Math.PI);return e.value&&n>d?s(e.data):""});var r=n.select("text").node().getBBox();n.select(".nv-label rect").attr("width",r.width+10).attr("height",r.height+10).attr("transform",function(){return"translate("+[r.x-5,r.y-5]+")"})})}}),E}var t={top:0,right:0,bottom:0,left:0},n=500,r=500,i=function(e){return e.values},s=function(e){return e.x},o=function(e){return e.y},u=function(e){return e.description},a=Math.floor(Math.random()*1e4),f=e.utils.defaultColor(),l=d3.format(",.2f"),c=!0,h=!0,p=!1,d=.02,v=!1,m=!1,g=!1,y=!1,b=.5,w=d3.dispatch("chartClick","elementClick","elementDblClick","elementMouseover","elementMouseout");return E.dispatch=w,E.margin=function(e){return arguments.length?(t.top=typeof e.top!="undefined"?e.top:t.top,t.right=typeof e.right!="undefined"?e.right:t.right,t.bottom=typeof e.bottom!="undefined"?e.bottom:t.bottom,t.left=typeof e.left!="undefined"?e.left:t.left,E):t},E.width=function(e){return arguments.length?(n=e,E):n},E.height=function(e){return arguments.length?(r=e,E):r},E.values=function(e){return arguments.length?(i=e,E):i},E.x=function(e){return arguments.length?(s=e,E):s},E.y=function(e){return arguments.length?(o=d3.functor(e),E):o},E.description=function(e){return arguments.length?(u=e,E):u},E.showLabels=function(e){return arguments.length?(c=e,E):c},E.labelSunbeamLayout=function(e){return arguments.length?(m=e,E):m},E.donutLabelsOutside=function(e){return arguments.length?(p=e,E):p},E.pieLabelsOutside=function(e){return arguments.length?(h=e,E):h},E.donut=function(e){return arguments.length?(v=e,E):v},E.donutRatio=function(e){return arguments.length?(b=e,E):b},E.startAngle=function(e){return arguments.length?(g=e,E):g},E.endAngle=function(e){return arguments.length?(y=e,E):y},E.id=function(e){return arguments.length?(a=e,E):a},E.color=function(t){return arguments.length?(f=e.utils.getColor(t),E):f},E.valueFormat=function(e){return arguments.length?(l=e,E):l},E.labelThreshold=function(e){return arguments.length?(d=e,E):d},E},e.models.pieChart=function(){function v(e){return e.each(function(u){var a=d3.select(this),f=this,d=(i||parseInt(a.style("width"))||960)-r.left-r.right,m=(s||parseInt(a.style("height"))||400)-r.top-r.bottom;v.update=function(){v(e)},v.container=this,l.disabled=u[0].map(function(e){return!!e.disabled});if(!c){var g;c={};for(g in l)l[g]instanceof Array?c[g]=l[g].slice(0):c[g]=l[g]}if(!u[0]||!u[0].length){var y=a.selectAll(".nv-noData").data([h]);return y.enter().append("text").attr("class","nvd3 nv-noData").attr("dy","-.7em").style("text-anchor","middle"),y.attr("x",r.left+d/2).attr("y",r.top+m/2).text(function(e){return e}),v}a.selectAll(".nv-noData").remove();var b=a.selectAll("g.nv-wrap.nv-pieChart").data([u]),w=b.enter().append("g").attr("class","nvd3 nv-wrap nv-pieChart").append("g"),E=b.select("g");w.append("g").attr("class","nv-pieWrap"),w.append("g").attr("class","nv-legendWrap"),o&&(n.width(d).key(t.x()),b.select(".nv-legendWrap").datum(t.values()(u[0])).call(n),r.top!=n.height()&&(r.top=n.height(),m=(s||parseInt(a.style("height"))||400)-r.top-r.bottom),b.select(".nv-legendWrap").attr("transform","translate(0,"+ -r.top+")")),b.attr("transform","translate("+r.left+","+r.top+")"),t.width(d).height(m);var S=E.select(".nv-pieWrap").datum(u);d3.transition(S).call(t),n.dispatch.on("legendClick",function(n,r,i){n.disabled=!n.disabled,t.values()(u[0]).filter(function(e){return!e.disabled}).length||t.values()(u[0]).map(function(e){return e.disabled=!1,b.selectAll(".nv-series").classed("disabled",!1),e}),l.disabled=u[0].map(function(e){return!!e.disabled}),p.stateChange(l),e.transition().call(v)}),t.dispatch.on("elementMouseout.tooltip",function(e){p.tooltipHide(e)}),p.on("changeState",function(t){typeof t.disabled!="undefined"&&(u[0].forEach(function(e,n){e.disabled=t.disabled[n]}),l.disabled=t.disabled),e.call(v)})}),v}var t=e.models.pie(),n=e.models.legend(),r={top:30,right:20,bottom:20,left:20},i=null,s=null,o=!0,u=e.utils.defaultColor(),a=!0,f=function(e,t,n,r){return"<h3>"+e+"</h3>"+"<p>"+t+"</p>"},l={},c=null,h="No Data Available.",p=d3.dispatch("tooltipShow","tooltipHide","stateChange","changeState"),d=function(n,r){var i=t.description()(n.point)||t.x()(n.point),s=n.pos[0]+(r&&r.offsetLeft||0),o=n.pos[1]+(r&&r.offsetTop||0),u=t.valueFormat()(t.y()(n.point)),a=f(i,u,n,v);e.tooltip.show([s,o],a,n.value<0?"n":"s",null,r)};return t.dispatch.on("elementMouseover.tooltip",function(e){e.pos=[e.pos[0]+r.left,e.pos[1]+r.top],p.tooltipShow(e)}),p.on("tooltipShow",function(e){a&&d(e)}),p.on("tooltipHide",function(){a&&e.tooltip.cleanup()}),v.legend=n,v.dispatch=p,v.pie=t,d3.rebind(v,t,"valueFormat","values","x","y","description","id","showLabels","donutLabelsOutside","pieLabelsOutside","donut","donutRatio","labelThreshold"),v.margin=function(e){return arguments.length?(r.top=typeof e.top!="undefined"?e.top:r.top,r.right=typeof e.right!="undefined"?e.right:r.right,r.bottom=typeof e.bottom!="undefined"?e.bottom:r.bottom,r.left=typeof e.left!="undefined"?e.left:r.left,v):r},v.width=function(e){return arguments.length?(i=e,v):i},v.height=function(e){return arguments.length?(s=e,v):s},v.color=function(r){return arguments.length?(u=e.utils.getColor(r),n.color(u),t.color(u),v):u},v.showLegend=function(e){return arguments.length?(o=e,v):o},v.tooltips=function(e){return arguments.length?(a=e,v):a},v.tooltipContent=function(e){return arguments.length?(f=e,v):f},v.state=function(e){return arguments.length?(l=e,v):l},v.defaultState=function(e){return arguments.length?(c=e,v):c},v.noData=function(e){return arguments.length?(h=e,v):h},v},e.models.scatter=function(){function B(e){return e.each(function(e){function V(){if(!g)return!1;var i,a=d3.merge(e.map(function(e,t){return e.values.map(function(e,n){var r=f(e,n)+Math.random()*1e-10,i=l(e,n)+Math.random()*1e-10;return[o(r),u(i),t,n,e]}).filter(function(e,t){return y(e[4],t)})}));if(O===!0){if(S){var c=q.select("defs").selectAll(".nv-point-clips").data([s]).enter();c.append("clipPath").attr("class","nv-point-clips").attr("id","nv-points-clip-"+s);var h=q.select("#nv-points-clip-"+s).selectAll("circle").data(a);h.enter().append("circle").attr("r",x),h.exit().remove(),h.attr("cx",function(e){return e[0]}).attr("cy",function(e){return e[1]}),q.select(".nv-point-paths").attr("clip-path","url(#nv-points-clip-"+s+")")}a.push([o.range()[0]-20,u.range()[0]-20,null,null]),a.push([o.range()[1]+20,u.range()[1]+20,null,null]),a.push([o.range()[0]-20,u.range()[0]+20,null,null]),a.push([o.range()[1]+20,u.range()[1]-20,null,null]);var p=d3.geom.polygon([[-10,-10],[-10,r+10],[n+10,r+10],[n+10,-10]]),d=d3.geom.voronoi(a).map(function(e,t){return{data:p.clip(e),series:a[t][2],point:a[t][3]}}),v=q.select(".nv-point-paths").selectAll("path").data(d);v.enter().append("path").attr("class",function(e,t){return"nv-path-"+t}),v.exit().remove(),v.attr("d",function(e){return e.data.length===0?"M 0 0":"M"+e.data.join("L")+"Z"}),v.on("click",function(n){if(H)return 0;var r=e[n.series],i=r.values[n.point];A.elementClick({point:i,series:r,pos:[o(f(i,n.point))+t.left,u(l(i,n.point))+t.top],seriesIndex:n.series,pointIndex:n.point})}).on("mouseover",function(n){if(H)return 0;var r=e[n.series],i=r.values[n.point];A.elementMouseover({point:i,series:r,pos:[o(f(i,n.point))+t.left,u(l(i,n.point))+t.top],seriesIndex:n.series,pointIndex:n.point})}).on("mouseout",function(t,n){if(H)return 0;var r=e[t.series],i=r.values[t.point];A.elementMouseout({point:i,series:r,seriesIndex:t.series,pointIndex:t.point})})}else q.select(".nv-groups").selectAll(".nv-group").selectAll(".nv-point").on("click",function(n,r){if(H||!e[n.series])return 0;var i=e[n.series],s=i.values[r];A.elementClick({point:s,series:i,pos:[o(f(s,r))+t.left,u(l(s,r))+t.top],seriesIndex:n.series,pointIndex:r})}).on("mouseover",function(n,r){if(H||!e[n.series])return 0;var i=e[n.series],s=i.values[r];A.elementMouseover({point:s,series:i,pos:[o(f(s,r))+t.left,u(l(s,r))+t.top],seriesIndex:n.series,pointIndex:r})}).on("mouseout",function(t,n){if(H||!e[t.series])return 0;var r=e[t.series],i=r.values[n];A.elementMouseout({point:i,series:r,seriesIndex:t.series,pointIndex:n})});H=!1}var B=n-t.left-t.right,j=r-t.top-t.bottom,F=d3.select(this);e=e.map(function(e,t){return e.values=e.values.map(function(e){return e.series=t,e}),e});var I=T&&N&&C?[]:d3.merge(e.map(function(e){return e.values.map(function(e,t){return{x:f(e,t),y:l(e,t),size:c(e,t)}})}));o.domain(T||d3.extent(I.map(function(e){return e.x}).concat(d))),b&&e[0]?o.range([(B*w+B)/(2*e[0].values.length),B-B*(1+w)/(2*e[0].values.length)]):o.range([0,B]),u.domain(N||d3.extent(I.map(function(e){return e.y}).concat(v))).range([j,0]),a.domain(C||d3.extent(I.map(function(e){return e.size}).concat(m))).range(k||[16,256]);if(o.domain()[0]===o.domain()[1]||u.domain()[0]===u.domain()[1])L=!0;o.domain()[0]===o.domain()[1]&&(o.domain()[0]?o.domain([o.domain()[0]-o.domain()[0]*.01,o.domain()[1]+o.domain()[1]*.01]):o.domain([-1,1])),u.domain()[0]===u.domain()[1]&&(u.domain()[0]?u.domain([u.domain()[0]+u.domain()[0]*.01,u.domain()[1]-u.domain()[1]*.01]):u.domain([-1,1])),isNaN(o.domain()[0])&&o.domain([-1,1]),isNaN(u.domain()[0])&&u.domain([-1,1]),M=M||o,_=_||u,D=D||a;var q=F.selectAll("g.nv-wrap.nv-scatter").data([e]),R=q.enter().append("g").attr("class","nvd3 nv-wrap nv-scatter nv-chart-"+s+(L?" nv-single-point":"")),U=R.append("defs"),W=R.append("g"),X=q.select("g");W.append("g").attr("class","nv-groups"),W.append("g").attr("class","nv-point-paths"),q.attr("transform","translate("+t.left+","+t.top+")"),U.append("clipPath").attr("id","nv-edge-clip-"+s).append("rect"),q.select("#nv-edge-clip-"+s+" rect").attr("width",B).attr("height",j),X.attr("clip-path",E?"url(#nv-edge-clip-"+s+")":""),H=!0;var $=q.select(".nv-groups").selectAll(".nv-group").data(function(e){return e},function(e){return e.key});$.enter().append("g").style("stroke-opacity",1e-6).style("fill-opacity",1e-6),d3.transition($.exit()).style("stroke-opacity",1e-6).style("fill-opacity",1e-6).remove(),$.attr("class",function(e,t){return"nv-group nv-series-"+t}).classed("hover",function(e){return e.hover}),d3.transition($).style("fill",function(e,t){return i(e,t)}).style("stroke",function(e,t){return i(e,t)}).style("stroke-opacity",1).style("fill-opacity",.5);if(p){var J=$.selectAll("circle.nv-point").data(function(e){return e.values});J.enter().append("circle").attr("cx",function(e,t){return M(f(e,t))}).attr("cy",function(e,t){return _(l(e,t))}).attr("r",function(e,t){return Math.sqrt(a(c(e,t))/Math.PI)}),J.exit().remove(),d3.transition($.exit().selectAll("path.nv-point")).attr("cx",function(e,t){return o(f(e,t))}).attr("cy",function(e,t){return u(l(e,t))}).remove(),J.attr("class",function(e,t){return"nv-point nv-point-"+t}),d3.transition(J).attr("cx",function(e,t){return o(f(e,t))}).attr("cy",function(e,t){return u(l(e,t))}).attr("r",function(e,t){return Math.sqrt(a(c(e,t))/Math.PI)})}else{var J=$.selectAll("path.nv-point").data(function(e){return e.values});J.enter().append("path").attr("transform",function(e,t){return"translate("+M(f(e,t))+","+_(l(e,t))+")"}).attr("d",d3.svg.symbol().type(h).size(function(e,t){return a(c(e,t))})),J.exit().remove(),d3.transition($.exit().selectAll("path.nv-point")).attr("transform",function(e,t){return"translate("+o(f(e,t))+","+u(l(e,t))+")"}).remove(),J.attr("class",function(e,t){return"nv-point nv-point-"+t}),d3.transition(J).attr("transform",function(e,t){return"translate("+o(f(e,t))+","+u(l(e,t))+")"}).attr("d",d3.svg.symbol().type(h).size(function(e,t){return a(c(e,t))}))}clearTimeout(P),P=setTimeout(V,300),M=o.copy(),_=u.copy(),D=a.copy()}),B}var t={top:0,right:0,bottom:0,left:0},n=960,r=500,i=e.utils.defaultColor(),s=Math.floor(Math.random()*1e5),o=d3.scale.linear(),u=d3.scale.linear(),a=d3.scale.linear(),f=function(e){return e.x},l=function(e){return e.y},c=function(e){return e.size||1},h=function(e){return e.shape||"circle"},p=!0,d=[],v=[],m=[],g=!0,y=function(e){return!e.notActive},b=!1,w=.1,E=!1,S=!0,x=function(){return 25},T=null,N=null,C=null,k=null,L=!1,A=d3.dispatch("elementClick","elementMouseover","elementMouseout"),O=!0,M,_,D,P,H=!1;return A.on("elementMouseover.point",function(e){g&&d3.select(".nv-chart-"+s+" .nv-series-"+e.seriesIndex+" .nv-point-"+e.pointIndex).classed("hover",!0)}),A.on("elementMouseout.point",function(e){g&&d3.select(".nv-chart-"+s+" .nv-series-"+e.seriesIndex+" .nv-point-"+e.pointIndex).classed("hover",!1)}),B.dispatch=A,B.x=function(e){return arguments.length?(f=d3.functor(e),B):f},B.y=function(e){return arguments.length?(l=d3.functor(e),B):l},B.size=function(e){return arguments.length?(c=d3.functor(e),B):c},B.margin=function(e){return arguments.length?(t.top=typeof e.top!="undefined"?e.top:t.top,t.right=typeof e.right!="undefined"?e.right:t.right,t.bottom=typeof e.bottom!="undefined"?e.bottom:t.bottom,t.left=typeof e.left!="undefined"?e.left:t.left,B):t},B.width=function(e){return arguments.length?(n=e,B):n},B.height=function(e){return arguments.length?(r=e,B):r},B.xScale=function(e){return arguments.length?(o=e,B):o},B.yScale=function(e){return arguments.length?(u=e,B):u},B.zScale=function(e){return arguments.length?(a=e,B):a},B.xDomain=function(e){return arguments.length?(T=e,B):T},B.yDomain=function(e){return arguments.length?(N=e,B):N},B.sizeDomain=function(e){return arguments.length?(C=e,B):C},B.sizeRange=function(e){return arguments.length?(k=e,B):k},B.forceX=function(e){return arguments.length?(d=e,B):d},B.forceY=function(e){return arguments.length?(v=e,B):v},B.forceSize=function(e){return arguments.length?(m=e,B):m},B.interactive=function(e){return arguments.length?(g=e,B):g},B.pointActive=function(e){return arguments.length?(y=e,B):y},B.padData=function(e){return arguments.length?(b=e,B):b},B.padDataOuter=function(e){return arguments.length?(w=e,B):w},B.clipEdge=function(e){return arguments.length?(E=e,B):E},B.clipVoronoi=function(e){return arguments.length?(S=e,B):S},B.useVoronoi=function(e){return arguments.length?(O=e,O===!1&&(S=!1),B):O},B.clipRadius=function(e){return arguments.length?(x=e,B):x},B.color=function(t){return arguments.length?(i=e.utils.getColor(t),B):i},B.shape=function(e){return arguments.length?(h=e,B):h},B.onlyCircles=function(e){return arguments.length?(p=e,B):p},B.id=function(e){return arguments.length?(s=e,B):s},B.singlePoint=function(e){return arguments.length?(L=e,B):L},B},e.models.scatterChart=function(){function P(e){return e.each(function(x){function X(){if(E)return U.select(".nv-point-paths").style("pointer-events","all"),!1;U.select(".nv-point-paths").style("pointer-events","none");var e=d3.mouse(this);h.distortion(w).focus(e[0]),p.distortion(w).focus(e[1]),U.select(".nv-scatterWrap"
).call(t),U.select(".nv-x.nv-axis").call(n),U.select(".nv-y.nv-axis").call(r),U.select(".nv-distributionX").datum(x.filter(function(e){return!e.disabled})).call(o),U.select(".nv-distributionY").datum(x.filter(function(e){return!e.disabled})).call(u)}var T=d3.select(this),N=this,H=(f||parseInt(T.style("width"))||960)-a.left-a.right,B=(l||parseInt(T.style("height"))||400)-a.top-a.bottom;P.update=function(){P(e)},P.container=this,C.disabled=x.map(function(e){return!!e.disabled});if(!k){var j;k={};for(j in C)C[j]instanceof Array?k[j]=C[j].slice(0):k[j]=C[j]}if(!x||!x.length||!x.filter(function(e){return e.values.length}).length){var F=T.selectAll(".nv-noData").data([A]);return F.enter().append("text").attr("class","nvd3 nv-noData").attr("dy","-.7em").style("text-anchor","middle"),F.attr("x",a.left+H/2).attr("y",a.top+B/2).text(function(e){return e}),P}T.selectAll(".nv-noData").remove(),O=O||h,M=M||p;var I=T.selectAll("g.nv-wrap.nv-scatterChart").data([x]),q=I.enter().append("g").attr("class","nvd3 nv-wrap nv-scatterChart nv-chart-"+t.id()),R=q.append("g"),U=I.select("g");R.append("rect").attr("class","nvd3 nv-background"),R.append("g").attr("class","nv-x nv-axis"),R.append("g").attr("class","nv-y nv-axis"),R.append("g").attr("class","nv-scatterWrap"),R.append("g").attr("class","nv-distWrap"),R.append("g").attr("class","nv-legendWrap"),R.append("g").attr("class","nv-controlsWrap"),y&&(i.width(H/2),I.select(".nv-legendWrap").datum(x).call(i),a.top!=i.height()&&(a.top=i.height(),B=(l||parseInt(T.style("height"))||400)-a.top-a.bottom),I.select(".nv-legendWrap").attr("transform","translate("+H/2+","+ -a.top+")")),b&&(s.width(180).color(["#444"]),U.select(".nv-controlsWrap").datum(D).attr("transform","translate(0,"+ -a.top+")").call(s)),I.attr("transform","translate("+a.left+","+a.top+")"),t.width(H).height(B).color(x.map(function(e,t){return e.color||c(e,t)}).filter(function(e,t){return!x[t].disabled})),I.select(".nv-scatterWrap").datum(x.filter(function(e){return!e.disabled})).call(t);if(d){var z=h.domain()[1]-h.domain()[0];h.domain([h.domain()[0]-d*z,h.domain()[1]+d*z])}if(v){var W=p.domain()[1]-p.domain()[0];p.domain([p.domain()[0]-v*W,p.domain()[1]+v*W])}n.scale(h).ticks(n.ticks()&&n.ticks().length?n.ticks():H/100).tickSize(-B,0),U.select(".nv-x.nv-axis").attr("transform","translate(0,"+p.range()[0]+")").call(n),r.scale(p).ticks(r.ticks()&&r.ticks().length?r.ticks():B/36).tickSize(-H,0),U.select(".nv-y.nv-axis").call(r),m&&(o.getData(t.x()).scale(h).width(H).color(x.map(function(e,t){return e.color||c(e,t)}).filter(function(e,t){return!x[t].disabled})),R.select(".nv-distWrap").append("g").attr("class","nv-distributionX"),U.select(".nv-distributionX").attr("transform","translate(0,"+p.range()[0]+")").datum(x.filter(function(e){return!e.disabled})).call(o)),g&&(u.getData(t.y()).scale(p).width(B).color(x.map(function(e,t){return e.color||c(e,t)}).filter(function(e,t){return!x[t].disabled})),R.select(".nv-distWrap").append("g").attr("class","nv-distributionY"),U.select(".nv-distributionY").attr("transform","translate(-"+u.size()+",0)").datum(x.filter(function(e){return!e.disabled})).call(u)),d3.fisheye&&(U.select(".nv-background").attr("width",H).attr("height",B),U.select(".nv-background").on("mousemove",X),U.select(".nv-background").on("click",function(){E=!E}),t.dispatch.on("elementClick.freezeFisheye",function(){E=!E})),s.dispatch.on("legendClick",function(i,s){i.disabled=!i.disabled,w=i.disabled?0:2.5,U.select(".nv-background").style("pointer-events",i.disabled?"none":"all"),U.select(".nv-point-paths").style("pointer-events",i.disabled?"all":"none"),i.disabled?(h.distortion(w).focus(0),p.distortion(w).focus(0),U.select(".nv-scatterWrap").call(t),U.select(".nv-x.nv-axis").call(n),U.select(".nv-y.nv-axis").call(r)):E=!1,P(e)}),i.dispatch.on("legendClick",function(t,n,r){t.disabled=!t.disabled,x.filter(function(e){return!e.disabled}).length||x.map(function(e){return e.disabled=!1,I.selectAll(".nv-series").classed("disabled",!1),e}),C.disabled=x.map(function(e){return!!e.disabled}),L.stateChange(C),P(e)}),t.dispatch.on("elementMouseover.tooltip",function(e){d3.select(".nv-chart-"+t.id()+" .nv-series-"+e.seriesIndex+" .nv-distx-"+e.pointIndex).attr("y1",e.pos[1]-B),d3.select(".nv-chart-"+t.id()+" .nv-series-"+e.seriesIndex+" .nv-disty-"+e.pointIndex).attr("x2",e.pos[0]+o.size()),e.pos=[e.pos[0]+a.left,e.pos[1]+a.top],L.tooltipShow(e)}),L.on("tooltipShow",function(e){S&&_(e,N.parentNode)}),L.on("changeState",function(t){typeof t.disabled!="undefined"&&(x.forEach(function(e,n){e.disabled=t.disabled[n]}),C.disabled=t.disabled),e.call(P)}),O=h.copy(),M=p.copy()}),P}var t=e.models.scatter(),n=e.models.axis(),r=e.models.axis(),i=e.models.legend(),s=e.models.legend(),o=e.models.distribution(),u=e.models.distribution(),a={top:30,right:20,bottom:50,left:75},f=null,l=null,c=e.utils.defaultColor(),h=d3.fisheye?d3.fisheye.scale(d3.scale.linear).distortion(0):t.xScale(),p=d3.fisheye?d3.fisheye.scale(d3.scale.linear).distortion(0):t.yScale(),d=0,v=0,m=!1,g=!1,y=!0,b=!!d3.fisheye,w=0,E=!1,S=!0,x=function(e,t,n){return"<strong>"+t+"</strong>"},T=function(e,t,n){return"<strong>"+n+"</strong>"},N=null,C={},k=null,L=d3.dispatch("tooltipShow","tooltipHide","stateChange","changeState"),A="No Data Available.";t.xScale(h).yScale(p),n.orient("bottom").tickPadding(10),r.orient("left").tickPadding(10),o.axis("x"),u.axis("y");var O,M,_=function(i,s){var o=i.pos[0]+(s.offsetLeft||0),u=i.pos[1]+(s.offsetTop||0),f=i.pos[0]+(s.offsetLeft||0),l=p.range()[0]+a.top+(s.offsetTop||0),c=h.range()[0]+a.left+(s.offsetLeft||0),d=i.pos[1]+(s.offsetTop||0),v=n.tickFormat()(t.x()(i.point,i.pointIndex)),m=r.tickFormat()(t.y()(i.point,i.pointIndex));x!=null&&e.tooltip.show([f,l],x(i.series.key,v,m,i,P),"n",1,s,"x-nvtooltip"),T!=null&&e.tooltip.show([c,d],T(i.series.key,v,m,i,P),"e",1,s,"y-nvtooltip"),N!=null&&e.tooltip.show([o,u],N(i.series.key,v,m,i,P),i.value<0?"n":"s",null,s)},D=[{key:"Magnify",disabled:!0}];return t.dispatch.on("elementMouseout.tooltip",function(e){L.tooltipHide(e),d3.select(".nv-chart-"+t.id()+" .nv-series-"+e.seriesIndex+" .nv-distx-"+e.pointIndex).attr("y1",0),d3.select(".nv-chart-"+t.id()+" .nv-series-"+e.seriesIndex+" .nv-disty-"+e.pointIndex).attr("x2",u.size())}),L.on("tooltipHide",function(){S&&e.tooltip.cleanup()}),P.dispatch=L,P.scatter=t,P.legend=i,P.controls=s,P.xAxis=n,P.yAxis=r,P.distX=o,P.distY=u,d3.rebind(P,t,"id","interactive","pointActive","x","y","shape","size","xScale","yScale","zScale","xDomain","yDomain","sizeDomain","sizeRange","forceX","forceY","forceSize","clipVoronoi","clipRadius","useVoronoi"),P.margin=function(e){return arguments.length?(a.top=typeof e.top!="undefined"?e.top:a.top,a.right=typeof e.right!="undefined"?e.right:a.right,a.bottom=typeof e.bottom!="undefined"?e.bottom:a.bottom,a.left=typeof e.left!="undefined"?e.left:a.left,P):a},P.width=function(e){return arguments.length?(f=e,P):f},P.height=function(e){return arguments.length?(l=e,P):l},P.color=function(t){return arguments.length?(c=e.utils.getColor(t),i.color(c),o.color(c),u.color(c),P):c},P.showDistX=function(e){return arguments.length?(m=e,P):m},P.showDistY=function(e){return arguments.length?(g=e,P):g},P.showControls=function(e){return arguments.length?(b=e,P):b},P.showLegend=function(e){return arguments.length?(y=e,P):y},P.fisheye=function(e){return arguments.length?(w=e,P):w},P.xPadding=function(e){return arguments.length?(d=e,P):d},P.yPadding=function(e){return arguments.length?(v=e,P):v},P.tooltips=function(e){return arguments.length?(S=e,P):S},P.tooltipContent=function(e){return arguments.length?(N=e,P):N},P.tooltipXContent=function(e){return arguments.length?(x=e,P):x},P.tooltipYContent=function(e){return arguments.length?(T=e,P):T},P.state=function(e){return arguments.length?(C=e,P):C},P.defaultState=function(e){return arguments.length?(k=e,P):k},P.noData=function(e){return arguments.length?(A=e,P):A},P},e.models.scatterPlusLineChart=function(){function _(e){return e.each(function(E){function z(){if(b)return q.select(".nv-point-paths").style("pointer-events","all"),!1;q.select(".nv-point-paths").style("pointer-events","none");var e=d3.mouse(this);h.distortion(y).focus(e[0]),p.distortion(y).focus(e[1]),q.select(".nv-scatterWrap").datum(E.filter(function(e){return!e.disabled})).call(t),q.select(".nv-x.nv-axis").call(n),q.select(".nv-y.nv-axis").call(r),q.select(".nv-distributionX").datum(E.filter(function(e){return!e.disabled})).call(o),q.select(".nv-distributionY").datum(E.filter(function(e){return!e.disabled})).call(u)}var S=d3.select(this),x=this,D=(f||parseInt(S.style("width"))||960)-a.left-a.right,P=(l||parseInt(S.style("height"))||400)-a.top-a.bottom;_.update=function(){_(e)},_.container=this,T.disabled=E.map(function(e){return!!e.disabled});if(!N){var H;N={};for(H in T)T[H]instanceof Array?N[H]=T[H].slice(0):N[H]=T[H]}if(!E||!E.length||!E.filter(function(e){return e.values.length}).length){var B=S.selectAll(".nv-noData").data([k]);return B.enter().append("text").attr("class","nvd3 nv-noData").attr("dy","-.7em").style("text-anchor","middle"),B.attr("x",a.left+D/2).attr("y",a.top+P/2).text(function(e){return e}),_}S.selectAll(".nv-noData").remove(),h=t.xScale(),p=t.yScale(),L=L||h,A=A||p;var j=S.selectAll("g.nv-wrap.nv-scatterChart").data([E]),F=j.enter().append("g").attr("class","nvd3 nv-wrap nv-scatterChart nv-chart-"+t.id()),I=F.append("g"),q=j.select("g");I.append("rect").attr("class","nvd3 nv-background"),I.append("g").attr("class","nv-x nv-axis"),I.append("g").attr("class","nv-y nv-axis"),I.append("g").attr("class","nv-scatterWrap"),I.append("g").attr("class","nv-regressionLinesWrap"),I.append("g").attr("class","nv-distWrap"),I.append("g").attr("class","nv-legendWrap"),I.append("g").attr("class","nv-controlsWrap"),j.attr("transform","translate("+a.left+","+a.top+")"),m&&(i.width(D/2),j.select(".nv-legendWrap").datum(E).call(i),a.top!=i.height()&&(a.top=i.height(),P=(l||parseInt(S.style("height"))||400)-a.top-a.bottom),j.select(".nv-legendWrap").attr("transform","translate("+D/2+","+ -a.top+")")),g&&(s.width(180).color(["#444"]),q.select(".nv-controlsWrap").datum(M).attr("transform","translate(0,"+ -a.top+")").call(s)),t.width(D).height(P).color(E.map(function(e,t){return e.color||c(e,t)}).filter(function(e,t){return!E[t].disabled})),j.select(".nv-scatterWrap").datum(E.filter(function(e){return!e.disabled})).call(t),j.select(".nv-regressionLinesWrap").attr("clip-path","url(#nv-edge-clip-"+t.id()+")");var R=j.select(".nv-regressionLinesWrap").selectAll(".nv-regLines").data(function(e){return e}),U=R.enter().append("g").attr("class","nv-regLines").append("line").attr("class","nv-regLine").style("stroke-opacity",0);R.selectAll(".nv-regLines line").attr("x1",h.range()[0]).attr("x2",h.range()[1]).attr("y1",function(e,t){return p(h.domain()[0]*e.slope+e.intercept)}).attr("y2",function(e,t){return p(h.domain()[1]*e.slope+e.intercept)}).style("stroke",function(e,t,n){return c(e,n)}).style("stroke-opacity",function(e,t){return e.disabled||typeof e.slope=="undefined"||typeof e.intercept=="undefined"?0:1}),n.scale(h).ticks(n.ticks()?n.ticks():D/100).tickSize(-P,0),q.select(".nv-x.nv-axis").attr("transform","translate(0,"+p.range()[0]+")").call(n),r.scale(p).ticks(r.ticks()?r.ticks():P/36).tickSize(-D,0),q.select(".nv-y.nv-axis").call(r),d&&(o.getData(t.x()).scale(h).width(D).color(E.map(function(e,t){return e.color||c(e,t)}).filter(function(e,t){return!E[t].disabled})),I.select(".nv-distWrap").append("g").attr("class","nv-distributionX"),q.select(".nv-distributionX").attr("transform","translate(0,"+p.range()[0]+")").datum(E.filter(function(e){return!e.disabled})).call(o)),v&&(u.getData(t.y()).scale(p).width(P).color(E.map(function(e,t){return e.color||c(e,t)}).filter(function(e,t){return!E[t].disabled})),I.select(".nv-distWrap").append("g").attr("class","nv-distributionY"),q.select(".nv-distributionY").attr("transform","translate(-"+u.size()+",0)").datum(E.filter(function(e){return!e.disabled})).call(u)),d3.fisheye&&(q.select(".nv-background").attr("width",D).attr("height",P),q.select(".nv-background").on("mousemove",z),q.select(".nv-background").on("click",function(){b=!b}),t.dispatch.on("elementClick.freezeFisheye",function(){b=!b})),s.dispatch.on("legendClick",function(i,s){i.disabled=!i.disabled,y=i.disabled?0:2.5,q.select(".nv-background").style("pointer-events",i.disabled?"none":"all"),q.select(".nv-point-paths").style("pointer-events",i.disabled?"all":"none"),i.disabled?(h.distortion(y).focus(0),p.distortion(y).focus(0),q.select(".nv-scatterWrap").call(t),q.select(".nv-x.nv-axis").call(n),q.select(".nv-y.nv-axis").call(r)):b=!1,_(e)}),i.dispatch.on("legendClick",function(t,n,r){t.disabled=!t.disabled,E.filter(function(e){return!e.disabled}).length||E.map(function(e){return e.disabled=!1,j.selectAll(".nv-series").classed("disabled",!1),e}),T.disabled=E.map(function(e){return!!e.disabled}),C.stateChange(T),_(e)}),t.dispatch.on("elementMouseover.tooltip",function(e){d3.select(".nv-chart-"+t.id()+" .nv-series-"+e.seriesIndex+" .nv-distx-"+e.pointIndex).attr("y1",e.pos[1]-P),d3.select(".nv-chart-"+t.id()+" .nv-series-"+e.seriesIndex+" .nv-disty-"+e.pointIndex).attr("x2",e.pos[0]+o.size()),e.pos=[e.pos[0]+a.left,e.pos[1]+a.top],C.tooltipShow(e)}),C.on("tooltipShow",function(e){w&&O(e,x.parentNode)}),C.on("changeState",function(t){typeof t.disabled!="undefined"&&(E.forEach(function(e,n){e.disabled=t.disabled[n]}),T.disabled=t.disabled),e.call(_)}),L=h.copy(),A=p.copy()}),_}var t=e.models.scatter(),n=e.models.axis(),r=e.models.axis(),i=e.models.legend(),s=e.models.legend(),o=e.models.distribution(),u=e.models.distribution(),a={top:30,right:20,bottom:50,left:75},f=null,l=null,c=e.utils.defaultColor(),h=d3.fisheye?d3.fisheye.scale(d3.scale.linear).distortion(0):t.xScale(),p=d3.fisheye?d3.fisheye.scale(d3.scale.linear).distortion(0):t.yScale(),d=!1,v=!1,m=!0,g=!!d3.fisheye,y=0,b=!1,w=!0,E=function(e,t,n){return"<strong>"+t+"</strong>"},S=function(e,t,n){return"<strong>"+n+"</strong>"},x=function(e,t,n,r){return"<h3>"+e+"</h3>"+"<p>"+r+"</p>"},T={},N=null,C=d3.dispatch("tooltipShow","tooltipHide","stateChange","changeState"),k="No Data Available.";t.xScale(h).yScale(p),n.orient("bottom").tickPadding(10),r.orient("left").tickPadding(10),o.axis("x"),u.axis("y");var L,A,O=function(i,s){var o=i.pos[0]+(s.offsetLeft||0),u=i.pos[1]+(s.offsetTop||0),f=i.pos[0]+(s.offsetLeft||0),l=p.range()[0]+a.top+(s.offsetTop||0),c=h.range()[0]+a.left+(s.offsetLeft||0),d=i.pos[1]+(s.offsetTop||0),v=n.tickFormat()(t.x()(i.point,i.pointIndex)),m=r.tickFormat()(t.y()(i.point,i.pointIndex));E!=null&&e.tooltip.show([f,l],E(i.series.key,v,m,i,_),"n",1,s,"x-nvtooltip"),S!=null&&e.tooltip.show([c,d],S(i.series.key,v,m,i,_),"e",1,s,"y-nvtooltip"),x!=null&&e.tooltip.show([o,u],x(i.series.key,v,m,i.point.tooltip,i,_),i.value<0?"n":"s",null,s)},M=[{key:"Magnify",disabled:!0}];return t.dispatch.on("elementMouseout.tooltip",function(e){C.tooltipHide(e),d3.select(".nv-chart-"+t.id()+" .nv-series-"+e.seriesIndex+" .nv-distx-"+e.pointIndex).attr("y1",0),d3.select(".nv-chart-"+t.id()+" .nv-series-"+e.seriesIndex+" .nv-disty-"+e.pointIndex).attr("x2",u.size())}),C.on("tooltipHide",function(){w&&e.tooltip.cleanup()}),_.dispatch=C,_.scatter=t,_.legend=i,_.controls=s,_.xAxis=n,_.yAxis=r,_.distX=o,_.distY=u,d3.rebind(_,t,"id","interactive","pointActive","x","y","shape","size","xScale","yScale","zScale","xDomain","yDomain","sizeDomain","sizeRange","forceX","forceY","forceSize","clipVoronoi","clipRadius","useVoronoi"),_.margin=function(e){return arguments.length?(a.top=typeof e.top!="undefined"?e.top:a.top,a.right=typeof e.right!="undefined"?e.right:a.right,a.bottom=typeof e.bottom!="undefined"?e.bottom:a.bottom,a.left=typeof e.left!="undefined"?e.left:a.left,_):a},_.width=function(e){return arguments.length?(f=e,_):f},_.height=function(e){return arguments.length?(l=e,_):l},_.color=function(t){return arguments.length?(c=e.utils.getColor(t),i.color(c),o.color(c),u.color(c),_):c},_.showDistX=function(e){return arguments.length?(d=e,_):d},_.showDistY=function(e){return arguments.length?(v=e,_):v},_.showControls=function(e){return arguments.length?(g=e,_):g},_.showLegend=function(e){return arguments.length?(m=e,_):m},_.fisheye=function(e){return arguments.length?(y=e,_):y},_.tooltips=function(e){return arguments.length?(w=e,_):w},_.tooltipContent=function(e){return arguments.length?(x=e,_):x},_.tooltipXContent=function(e){return arguments.length?(E=e,_):E},_.tooltipYContent=function(e){return arguments.length?(S=e,_):S},_.state=function(e){return arguments.length?(T=e,_):T},_.defaultState=function(e){return arguments.length?(N=e,_):N},_.noData=function(e){return arguments.length?(k=e,_):k},_},e.models.sparkline=function(){function h(e){return e.each(function(e){var i=n-t.left-t.right,h=r-t.top-t.bottom,p=d3.select(this);s.domain(l||d3.extent(e,u)).range([0,i]),o.domain(c||d3.extent(e,a)).range([h,0]);var d=p.selectAll("g.nv-wrap.nv-sparkline").data([e]),v=d.enter().append("g").attr("class","nvd3 nv-wrap nv-sparkline"),m=v.append("g"),g=d.select("g");d.attr("transform","translate("+t.left+","+t.top+")");var b=d.selectAll("path").data(function(e){return[e]});b.enter().append("path"),b.exit().remove(),b.style("stroke",function(e,t){return e.color||f(e,t)}).attr("d",d3.svg.line().x(function(e,t){return s(u(e,t))}).y(function(e,t){return o(a(e,t))}));var w=d.selectAll("circle.nv-point").data(function(e){function n(t){if(t!=-1){var n=e[t];return n.pointIndex=t,n}return null}var t=e.map(function(e,t){return a(e,t)}),r=n(t.lastIndexOf(o.domain()[1])),i=n(t.indexOf(o.domain()[0])),s=n(t.length-1);return[i,r,s].filter(function(e){return e!=null})});w.enter().append("circle"),w.exit().remove(),w.attr("cx",function(e,t){return s(u(e,e.pointIndex))}).attr("cy",function(e,t){return o(a(e,e.pointIndex))}).attr("r",2).attr("class",function(e,t){return u(e,e.pointIndex)==s.domain()[1]?"nv-point nv-currentValue":a(e,e.pointIndex)==o.domain()[0]?"nv-point nv-minValue":"nv-point nv-maxValue"})}),h}var t={top:2,right:0,bottom:2,left:0},n=400,r=32,i=!0,s=d3.scale.linear(),o=d3.scale.linear(),u=function(e){return e.x},a=function(e){return e.y},f=e.utils.getColor(["#000"]),l,c;return h.margin=function(e){return arguments.length?(t.top=typeof e.top!="undefined"?e.top:t.top,t.right=typeof e.right!="undefined"?e.right:t.right,t.bottom=typeof e.bottom!="undefined"?e.bottom:t.bottom,t.left=typeof e.left!="undefined"?e.left:t.left,h):t},h.width=function(e){return arguments.length?(n=e,h):n},h.height=function(e){return arguments.length?(r=e,h):r},h.x=function(e){return arguments.length?(u=d3.functor(e),h):u},h.y=function(e){return arguments.length?(a=d3.functor(e),h):a},h.xScale=function(e){return arguments.length?(s=e,h):s},h.yScale=function(e){return arguments.length?(o=e,h):o},h.xDomain=function(e){return arguments.length?(l=e,h):l},h.yDomain=function(e){return arguments.length?(c=e,h):c},h.animate=function(e){return arguments.length?(i=e,h):i},h.color=function(t){return arguments.length?(f=e.utils.getColor(t),h):f},h},e.models.sparklinePlus=function(){function v(e){return e.each(function(c){function O(){if(a)return;var e=C.selectAll(".nv-hoverValue").data(u),r=e.enter().append("g").attr("class","nv-hoverValue").style("stroke-opacity",0).style("fill-opacity",0);e.exit().transition().duration(250).style("stroke-opacity",0).style("fill-opacity",0).remove(),e.attr("transform",function(e){return"translate("+s(t.x()(c[e],e))+",0)"}).transition().duration(250).style("stroke-opacity",1).style("fill-opacity",1);if(!u.length)return;r.append("line").attr("x1",0).attr("y1",-n.top).attr("x2",0).attr("y2",b),r.append("text").attr("class","nv-xValue").attr("x",-6).attr("y",-n.top).attr("text-anchor","end").attr("dy",".9em"),C.select(".nv-hoverValue .nv-xValue").text(f(t.x()(c[u[0]],u[0]))),r.append("text").attr("class","nv-yValue").attr("x",6).attr("y",-n.top).attr("text-anchor","start").attr("dy",".9em"),C.select(".nv-hoverValue .nv-yValue").text(l(t.y()(c[u[0]],u[0])))}function M(){function r(e,n){var r=Math.abs(t.x()(e[0],0)-n),i=0;for(var s=0;s<e.length;s++)Math.abs(t.x()(e[s],s)-n)<r&&(r=Math.abs(t.x()(e[s],s)-n),i=s);return i}if(a)return;var e=d3.mouse(this)[0]-n.left;u=[r(c,Math.round(s.invert(e)))],O()}var m=d3.select(this),g=(r||parseInt(m.style("width"))||960)-n.left-n.right,b=(i||parseInt(m.style("height"))||400)-n.top-n.bottom;v.update=function(){v(e)},v.container=this;if(!c||!c.length){var w=m.selectAll(".nv-noData").data([d]);return w.enter().append("text").attr("class","nvd3 nv-noData").attr("dy","-.7em").style("text-anchor","middle"),w.attr("x",n.left+g/2).attr("y",n.top+b/2).text(function(e){return e}),v}m.selectAll(".nv-noData").remove();var E=t.y()(c[c.length-1],c.length-1);s=t.xScale(),o=t.yScale();var S=m.selectAll("g.nv-wrap.nv-sparklineplus").data([c]),T=S.enter().append("g").attr("class","nvd3 nv-wrap nv-sparklineplus"),N=T.append("g"),C=S.select("g");N.append("g").attr("class","nv-sparklineWrap"),N.append("g").attr("class","nv-valueWrap"),N.append("g").attr("class","nv-hoverArea"),S.attr("transform","translate("+n.left+","+n.top+")");var k=C.select(".nv-sparklineWrap");t.width(g).height(b),k.call(t);var L=C.select(".nv-valueWrap"),A=L.selectAll(".nv-currentValue").data([E]);A.enter().append("text").attr("class","nv-currentValue").attr("dx",p?-8:8).attr("dy",".9em").style("text-anchor",p?"end":"start"),A.attr("x",g+(p?n.right:0)).attr("y",h?function(e){return o(e)}:0).style("fill",t.color()(c[c.length-1],c.length-1)).text(l(E)),N.select(".nv-hoverArea").append("rect").on("mousemove",M).on("click",function(){a=!a}).on("mouseout",function(){u=[],O()}),C.select(".nv-hoverArea rect").attr("transform",function(e){return"translate("+ -n.left+","+ -n.top+")"}).attr("width",g+n.left+n.right).attr("height",b+n.top)}),v}var t=e.models.sparkline(),n={top:15,right:100,bottom:10,left:50},r=null,i=null,s,o,u=[],a=!1,f=d3.format(",r"),l=d3.format(",.2f"),c=!0,h=!0,p=!1,d="No Data Available.";return v.sparkline=t,d3.rebind(v,t,"x","y","xScale","yScale","color"),v.margin=function(e){return arguments.length?(n.top=typeof e.top!="undefined"?e.top:n.top,n.right=typeof e.right!="undefined"?e.right:n.right,n.bottom=typeof e.bottom!="undefined"?e.bottom:n.bottom,n.left=typeof e.left!="undefined"?e.left:n.left,v):n},v.width=function(e){return arguments.length?(r=e,v):r},v.height=function(e){return arguments.length?(i=e,v):i},v.xTickFormat=function(e){return arguments.length?(f=e,v):f},v.yTickFormat=function(e){return arguments.length?(l=e,v):l},v.showValue=function(e){return arguments.length?(c=e,v):c},v.alignValue=function(e){return arguments.length?(h=e,v):h},v.rightAlignValue=function(e){return arguments.length?(p=e,v):p},v.noData=function(e){return arguments.length?(d=e,v):d},v},e.models.stackedArea=function(){function g(e){return e.each(function(e){var a=n-t.left-t.right,g=r-t.top-t.bottom,b=d3.select(this);p=v.xScale(),d=v.yScale(),e=e.map(function(e,t){return e.values=e.values.map(function(t,n){return t.index=n,t.stackedY=e.disabled?0:u(t,n),t}),e}),e=d3.layout.stack().order(l).offset(f).values(function(e){return e.values}).x(o).y(function(e){return e.stackedY}).out(function(e,t,n){e.display={y:n,y0:t}})(e);var w=b.selectAll("g.nv-wrap.nv-stackedarea").data([e]),E=w.enter().append("g").attr("class","nvd3 nv-wrap nv-stackedarea"),S=E.append("defs"),T=E.append("g"),N=w.select("g");T.append("g").attr("class","nv-areaWrap"),T.append("g").attr("class","nv-scatterWrap"),w.attr("transform","translate("+t.left+","+t.top+")"),v.width(a).height(g).x(o).y(function(e){return e.display.y+e.display.y0}).forceY([0]).color(e.map(function(e,t){return e.color||i(e,t)}).filter(function(t,n){return!e[n].disabled}));var C=N.select(".nv-scatterWrap").datum(e.filter(function(e){return!e.disabled}));C.call(v),S.append("clipPath").attr("id","nv-edge-clip-"+s).append("rect"),w.select("#nv-edge-clip-"+s+" rect").attr("width",a).attr("height",g),N.attr("clip-path",h?"url(#nv-edge-clip-"+s+")":"");var k=d3.svg.area().x(function(e,t){return p(o(e,t))}).y0(function(e){return d(e.display.y0)}).y1(function(e){return d(e.display.y+e.display.y0)}).interpolate(c),L=d3.svg.area().x(function(e,t){return p(o(e,t))}).y0(function(e){return d(e.display.y0)}).y1(function(e){return d(e.display.y0)}),A=N.select(".nv-areaWrap").selectAll("path.nv-area").data(function(e){return e});A.enter().append("path").attr("class",function(e,t){return"nv-area nv-area-"+t}).on("mouseover",function(e,t){d3.select(this).classed("hover",!0),m.areaMouseover({point:e,series:e.key,pos:[d3.event.pageX,d3.event.pageY],seriesIndex:t})}).on("mouseout",function(e,t){d3.select(this).classed("hover",!1),m.areaMouseout({point:e,series:e.key,pos:[d3.event.pageX,d3.event.pageY],seriesIndex:t})}).on("click",function(e,t){d3.select(this).classed("hover",!1),m.areaClick({point:e,series:e.key,pos:[d3.event.pageX,d3.event.pageY],seriesIndex:t})}),A.exit().attr("d",function(e,t){return L(e.values,t)}).remove(),A.style("fill",function(e,t){return e.color||i(e,t)}).style("stroke",function(e,t){return e.color||i(e,t)}),A.attr("d",function(e,t){return k(e.values,t)}),v.dispatch.on("elementMouseover.area",function(e){N.select(".nv-chart-"+s+" .nv-area-"+e.seriesIndex).classed("hover",!0)}),v.dispatch.on("elementMouseout.area",function(e){N.select(".nv-chart-"+s+" .nv-area-"+e.seriesIndex).classed("hover",!1)})}),g}var t={top:0,right:0,bottom:0,left:0},n=960,r=500,i=e.utils.defaultColor(),s=Math.floor(Math.random()*1e5),o=function(e){return e.x},u=function(e){return e.y},a="stack",f="zero",l="default",c="linear",h=!1,p,d,v=e.models.scatter(),m=d3.dispatch("tooltipShow","tooltipHide","areaClick","areaMouseover","areaMouseout");return v.size(2.2).sizeDomain([2.2,2.2]),v.dispatch.on("elementClick.area",function(e){m.areaClick(e)}),v.dispatch.on("elementMouseover.tooltip",function(e){e.pos=[e.pos[0]+t.left,e.pos[1]+t.top],m.tooltipShow(e)}),v.dispatch.on("elementMouseout.tooltip",function(e){m.tooltipHide(e)}),g.dispatch=m,g.scatter=v,d3.rebind(g,v,"interactive","size","xScale","yScale","zScale","xDomain","yDomain","sizeDomain","forceX","forceY","forceSize","clipVoronoi","clipRadius"),g.x=function(e){return arguments.length?(o=d3.functor(e),g):o},g.y=function(e){return arguments.length?(u=d3.functor(e),g):u},g.margin=function(e){return arguments.length?(t.top=typeof e.top!="undefined"?e.top:t.top,t.right=typeof e.right!="undefined"?e.right:t.right,t.bottom=typeof e.bottom!="undefined"?e.bottom:t.bottom,t.left=typeof e.left!="undefined"?e.left:t.left,g):t},g.width=function(e){return arguments.length?(n=e,g):n},g.height=function(e){return arguments.length?(r=e,g):r},g.clipEdge=function(e){return arguments.length?(h=e,g):h},g.color=function(t){return arguments.length?(i=e.utils.getColor(t),g):i},g.offset=function(e){return arguments.length?(f=e,g):f},g.order=function(e){return arguments.length?(l=e,g):l},g.style=function(e){if(!arguments.length)return a;a=e;switch(a){case"stack":g.offset("zero"),g.order("default");break;case"stream":g.offset("wiggle"),g.order("inside-out");break;case"stream-center":g.offset("silhouette"),g.order("inside-out");break;case"expand":g.offset("expand"),g.order("default")}return g},g.interpolate=function(e){return arguments.length?(c=e,c):c},g},e.models.stackedAreaChart=function(){function x(e){return e.each(function(f){var p=d3.select(this),T=this,N=(u||parseInt(p.style("width"))||960)-o.left-o.right,C=(a||parseInt(p.style("height"))||400)-o.top-o.bottom;x.update=function(){x(e)},x.container=this,g.disabled=f.map(function(e){return!!e.disabled});if(!y){var k;y={};for(k in g)g[k]instanceof Array?y[k]=g[k].slice(0):y[k]=g[k]}if(!f||!f.length||!f.filter(function(e){return e.values.length}).length){var L=p.selectAll(".nv-noData").data([b]);return L.enter().append("text").attr("class","nvd3 nv-noData").attr("dy","-.7em").style("text-anchor","middle"),L.attr("x",o.left+N/2).attr("y",o.top+C/2).text(function(e){return e}),x}p.selectAll(".nv-noData").remove(),d=t.xScale(),v=t.yScale();var A=p.selectAll("g.nv-wrap.nv-stackedAreaChart").data([f]),O=A.enter().append("g").attr("class","nvd3 nv-wrap nv-stackedAreaChart").append("g"),M=A.select("g");O.append("g").attr("class","nv-x nv-axis"),O.append("g").attr("class","nv-y nv-axis"),O.append("g").attr("class","nv-stackedWrap"),O.append("g").attr("class","nv-legendWrap"),O.append("g").attr("class","nv-controlsWrap"),c&&(i.width(N-E),M.select(".nv-legendWrap").datum(f).call(i),o.top!=i.height()&&(o.top=i.height(),C=(a||parseInt(p.style("height"))||400)-o.top-o.bottom),M.select(".nv-legendWrap").attr("transform","translate("+E+","+ -o.top+")"));if(l){var _=[{key:"Stacked",disabled:t.offset()!="zero"},{key:"Stream",disabled:t.offset()!="wiggle"},{key:"Expanded",disabled:t.offset()!="expand"}];s.width(E).color(["#444","#444","#444"]),M.select(".nv-controlsWrap").datum(_).call(s),o.top!=Math.max(s.height(),i.height())&&(o.top=Math.max(s.height(),i.height()),C=(a||parseInt(p.style("height"))||400)-o.top-o.bottom),M.select(".nv-controlsWrap").attr("transform","translate(0,"+ -o.top+")")}A.attr("transform","translate("+o.left+","+o.top+")"),t.width(N).height(C);var D=M.select(".nv-stackedWrap").datum(f);D.call(t),n.scale(d).ticks(N/100).tickSize(-C,0),M.select(".nv-x.nv-axis").attr("transform","translate(0,"+C+")"),M.select(".nv-x.nv-axis").transition().duration(0).call(n),r.scale(v).ticks(t.offset()=="wiggle"?0:C/36).tickSize(-N,0).setTickFormat(t.offset()=="expand"?d3.format("%"):m),M.select(".nv-y.nv-axis").transition().duration(0).call(r),t.dispatch.on("areaClick.toggle",function(t){f.filter(function(e){return!e.disabled}).length===1?f=f.map(function(e){return e.disabled=!1,e}):f=f.map(function(e,n){return e.disabled=n!=t.seriesIndex,e}),g.disabled=f.map(function(e){return!!e.disabled}),w.stateChange(g),x(e)}),i.dispatch.on("legendClick",function(t,n){t.disabled=!t.disabled,f.filter(function(e){return!e.disabled}).length||f.map(function(e){return e.disabled=!1,e}),g.disabled=f.map(function(e){return!!e.disabled}),w.stateChange(g),x(e)}),s.dispatch.on("legendClick",function(n,r){if(!n.disabled)return;_=_.map(function(e){return e.disabled=!0,e}),n.disabled=!1;switch(n.key){case"Stacked":t.style("stack");break;case"Stream":t.style("stream");break;case"Expanded":t.style("expand")}g.style=t.style(),w.stateChange(g),x(e)}),w.on("tooltipShow",function(e){h&&S(e,T.parentNode)}),w.on("changeState",function(n){typeof n.disabled!="undefined"&&(f.forEach(function(e,t){e.disabled=n.disabled[t]}),g.disabled=n.disabled),typeof n.style!="undefined"&&t.style(n.style),e.call(x)})}),x}var t=e.models.stackedArea(),n=e.models.axis(),r=e.models.axis(),i=e.models.legend(),s=e.models.legend(),o={top:30,right:25,bottom:50,left:60},u=null,a=null,f=e.utils.defaultColor(),l=!0,c=!0,h=!0,p=function(e,t,n,r,i){return"<h3>"+e+"</h3>"+"<p>"+n+" on "+t+"</p>"},d,v,m=d3.format(",.2f"),g={style:t.style()},y=null,b="No Data Available.",w=d3.dispatch("tooltipShow","tooltipHide","stateChange","changeState"),E=250;n.orient("bottom").tickPadding(7),r.orient("left"),t.scatter.pointActive(function(e){return!!Math.round(t.y()(e)*100)});var S=function(i,s){var o=i.pos[0]+(s.offsetLeft||0),u=i.pos[1]+(s.offsetTop||0),a=n.tickFormat()(t.x()(i.point,i.pointIndex)),f=r.tickFormat()(t.y()(i.point,i.pointIndex)),l=p(i.series.key,a,f,i,x);e.tooltip.show([o,u],l,i.value<0?"n":"s",null,s)};return t.dispatch.on("tooltipShow",function(e){e.pos=[e.pos[0]+o.left,e.pos[1]+o.top],w.tooltipShow(e)}),t.dispatch.on("tooltipHide",function(e){w.tooltipHide(e)}),w.on("tooltipHide",function(){h&&e.tooltip.cleanup()}),x.dispatch=w,x.stacked=t,x.legend=i,x.controls=s,x.xAxis=n,x.yAxis=r,d3.rebind(x,t,"x","y","size","xScale","yScale","xDomain","yDomain","sizeDomain","interactive","offset","order","style","clipEdge","forceX","forceY","forceSize","interpolate"),x.margin=function(e){return arguments.length?(o.top=typeof e.top!="undefined"?e.top:o.top,o.right=typeof e.right!="undefined"?e.right:o.right,o.bottom=typeof e.bottom!="undefined"?e.bottom:o.bottom,o.left=typeof e.left!="undefined"?e.left:o.left,x):o},x.width=function(e){return arguments.length?(u=e,x):getWidth},x.height=function(e){return arguments.length?(a=e,x):getHeight},x.color=function(n){return arguments.length?(f=e.utils.getColor(n),i.color(f),t.color(f),x):f},x.showControls=function(e){return arguments.length?(l=e,x):l},x.showLegend=function(e){return arguments.length?(c=e,x):c},x.tooltip=function(e){return arguments.length?(p=e,x):p},x.tooltips=function(e){return arguments.length?(h=e,x):h},x.tooltipContent=function(e){return arguments.length?(p=e,x):p},x.state=function(e){return arguments.length?(g=e,x):g},x.defaultState=function(e){return arguments.length?(y=e,x):y},x.noData=function(e){return arguments
.length?(b=e,x):b},r.setTickFormat=r.tickFormat,r.tickFormat=function(e){return arguments.length?(m=e,r):m},x}})();;
