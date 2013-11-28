/**
 * DOMful library. Simple library that helps create HTML elements from JavaScript objects.
 * Author: J'Brian "jayther"
 * 
 */
/*jslint browser: true*/
(function (w) {
    'use strict';
    var window = w,
        document = window.document,
        Node = window.Node,
        HTMLElement = window.Element,
        console = window.console || { log: function () {}, warn: function () {}},
        nativeTypes = ['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object'],
        class2type = {},
        isArray,
        isNode,
        isElement,
        countProps,
        DEFAULT_OPTIONS = {
            errorPrefix: 'DOMful: ',
            strict: false
        },
        DOMful;
    
    //populate class2type
    //borrowed from jQuery's method
    (function () {
        var i;
        for (i = 0; i < nativeTypes.length; i += 1) {
            class2type['[object ' + nativeTypes[i] + ']'] = nativeTypes[i].toLowerCase();
        }
    }());
        
    //borrowed from jQuery's method
    isArray = Array.isArray || function (objOrArr) {
        return objOrArr === null ? String(objOrArr) : class2type[Object.toString().call(objOrArr)] || 'object';
    };
    countProps = function (obj) {
        var i, sum = 0;
        for (i in obj) {
            if (obj.hasOwnProperty(i)) {
                sum += 1;
            }
        }
        return sum;
    };
    
    //code from: http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
    //Returns true if it is a DOM node
    isNode = function (o) {
        return (
            typeof Node === 'object' ?
                    o instanceof Node :
                    o && typeof o === 'object' && typeof o.nodeType === "number" && typeof o.nodeName === 'string'
        );
    };
    
    //code from: http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
    //Returns true if it is a DOM element    
    isElement = function (o) {
        return (
            typeof HTMLElement === 'object' ?
                    o instanceof HTMLElement : //DOM2
                    o && typeof o === 'object' && o !== null && o.nodeType === 1 && typeof o.nodeName === 'string'
        );
    };
    
    //DOMful class
    DOMful = function (opt) {
        var parse,
            parseToString,
            parser,
            processError,
            options,
            init;
        
        //parser which contains functions necessary to parse CSS selector syntax into elements.
        parser = {
            stringToElement: function (elementString) {
                if (elementString) {
                    var tag, classNames = [], id, i, el, matches, attributes = {}, parts, attrVal;
                    //get id
                    matches = elementString.match(/\#\-?[_a-zA-Z]+[_a-zA-Z0-9\-]*/g);
                    if (matches && matches.length > 0) {
                        id = matches[0].substring(1);
                        attributes.id = id;
                    }
                    
                    //get classnames
                    matches = elementString.match(/\.\-?[_a-zA-Z]+[_a-zA-Z0-9\-]*/g);
                    if (matches && matches.length > 0) {
                        for (i = 0; i < matches.length; i += 1) {
                            classNames.push(matches[i].substring(1));
                        }
                        attributes['class'] = classNames.join(' ');
                    }
                    
                    //get attributes
                    // TODO: better way than to have an encompassing "."?
                    matches = elementString.match(/\[[a-zA-Z_:]*?[\-a-zA-Z0-9_:.]+(?:\=["']?.+?["']?)?\]/g);
                    //matches = elementString.match(/\[[a-zA-Z_:]*?[\-a-zA-Z0-9_:.]+(?:\="?[a-zA-Z0-9\-\:\=]+?"?)?\]/g); //too limiting
                    if (matches && matches.length > 0) {
                        for (i = 0; i < matches.length; i += 1) {
                            parts = matches[i].split('=', 2);
                            if (parts.length === 1) {
                                attributes[parts[0].substring(1, parts[0].length - 1)] = null;
                            } else if (parts.length === 2) {
                                attrVal = parts[1].substring(0, parts[1].length - 1);
                                if ((attrVal[0] === '"' && attrVal[attrVal.length - 1] === '"') ||
                                        (attrVal[0] === "'" && attrVal[attrVal.length - 1] === "'")) {
                                    attrVal = attrVal.substring(1, attrVal.length - 1);
                                }
                                attributes[parts[0].substring(1)] = attrVal;
                            }
                        }
                    }
                    // TODO: is there anyway to use regex for this?
                    if (elementString.indexOf('#') !== -1) {
                        tag = elementString.substring(0, elementString.indexOf('#'));
                    } else if (elementString.indexOf('.') !== -1) {
                        tag = elementString.substring(0, elementString.indexOf('.'));
                    } else {
                        tag = elementString;
                    }
                    if (tag && tag.length > 0) {
                        el = document.createElement(tag);
                        for (i in attributes) {
                            if (attributes.hasOwnProperty(i)) {
                                if (i === 'class' && el.hasOwnProperty('className')) {
                                    el.className = attributes[i];
                                } else if (el.hasOwnProperty(i)) {
                                    el[i] = attributes[i];
                                } else {
                                    el.setAttribute(i, attributes[i]);
                                }
                            }
                        }
                        return el;
                    }
                }
                return null;
            },
            stringToElementWithContent: function (elementString, content, proper) {
                var element = parser.stringToElement(elementString), i, childs;
                if (content) {
                    if (typeof content === 'function') {
                        element.innerHTML = content();
                    } else if (isElement(content)) {
                        element.appendChild(content);
                    } else if (typeof content === 'object') {
                        childs = parser.objectToElements(content, proper);
                        if (isArray(childs)) {
                            for (i = 0; i < childs.length; i += 1) {
                                element.appendChild(childs[i]);
                            }
                        } else {
                            element.appendChild(childs);
                        }
                    } else if (typeof content === 'string') {
                        element.innerHTML = content;
                    }
                }
                return element;
            },
            objectToElements: function (objOrArr, proper) {
                var i, element, elements = [];
                if (isArray(objOrArr)) {
                    return parser.arrayToElements(objOrArr, proper, true);
                } else if (isElement(objOrArr)) {
                    return objOrArr;
                } else if (typeof objOrArr === 'object') {
                    if (proper) {
                        if (objOrArr.tag) {
                            element = parser.stringToElementWithContent(
                                objOrArr.tag,
                                objOrArr.childs,
                                proper
                            );
                            if (element) {
                                elements.push(element);
                            }
                        }
                    } else {
                        for (i in objOrArr) {
                            if (objOrArr.hasOwnProperty(i)) {
                                element = parser.stringToElementWithContent(i, objOrArr[i], proper);
                                if (element) {
                                    elements.push(element);
                                }
                            }
                        }
                    }
                } else if (typeof objOrArr === 'string') {
                    element = parser.stringToElement(objOrArr);
                    if (element) {
                        elements.push(element);
                    }
                }
                if (elements.length === 1) {
                    return elements[0];
                }
                return elements;
            },
            arrayToElements: function (objOrArr, proper, isArr) {
                var elements = [], i;
                if (isArr || isArray(objOrArr)) {
                    for (i = 0; i < objOrArr.length; i += 1) {
                        elements.push(parser.objectToElements(objOrArr[i], proper));
                    }
                }
                return elements;
            }
        };
        
        /**
         * Parses the object or array to HTML elements.
         */
        parse = function (objOrArr, proper) {
            var els = null;
            try {
                if (objOrArr) {
                    if (typeof objOrArr === 'object' || typeof objOrArr === 'string') {
                        els = parser.objectToElements(objOrArr, proper);
                    } else {
                        throw new Error('Parameter in parse function can only be an object or an array.');
                    }
                } else {
                    throw new Error('Parameter in parse function cannot be null (only an object or an array).');
                }
            } catch (e) {
                processError(e.message);
            }
            return els;
        };
        this.parse = parse;
        
        /**
         * Parses the object or array to an HTML string.
         */
        parseToString = function (objOrArr) {
            var dummy,
                els;
            try {
                els = parse(objOrArr);
                if (els) {
                    dummy = document.createElement('div');
                    dummy.appendChild(els);
                    return dummy.innerHTML;
                } else {
                    throw new Error('Creation returned null.');
                }
            } catch (e) {
                processError(e.message);
            }
            return '';
        };
        this.parseToString = parseToString;
        
        processError = function (msg) {
            if (options.strict) {
                throw new Error(options.errorPrefix + msg);
            } else {
                console.warn(options.errorPrefix + msg);
            }
        };
        
        init = function () {
            var i, o = opt || {};
            options = {};
            for (i in o) {
                if (o.hasOwnProperty(i)) {
                    options[i] = o[i];
                }
            }
            for (i in DEFAULT_OPTIONS) {
                if (DEFAULT_OPTIONS.hasOwnProperty(i) && !options.hasOwnProperty(i)) {
                    options[i] = DEFAULT_OPTIONS[i];
                }
            }
        };
        init();
    };
    
    window.DOMful = new DOMful();
}(window));