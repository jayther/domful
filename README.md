DOMful
======

Still in early development! Please ignore for now!

A (hopefully) lightweight JavaScript library designed to make elements a little easier. Ideal for prototyping. Inspired by jQuery through their use of CSS selector syntax for their element selector.

The DOMful library enables the creation of elements in JavaScript through the use of CSS selector syntax and JavaScript objects (literal objects or otherwise), strings, or arrays. DOMful reads in the element string (the string in CSS selector syntax that specifies the element with IDs and class names) to create the desired element.

There are only two usable functions in DOMful. `DOMful.parse()` is the main function that parses specifically-formatted JavaScript object, string, or array into elements. `DOMful.parseToString()` simply calls `DOMful.parse()` and returns a string of the HTML instead of JavaScript DOM elements.

---

The functions:

    DOMful.parse({object | array}[, repeat[, proper]]);
    DOMful.parseToString({object | array}[, repeat[, proper]]);


Parameters:

*   `{object | array}`: The object or an array that contains the elements info. If an object is specified or the array contains only one item, AND the `repeat` is not specified or is `1`, the `DOMful.parse` only

*   `repeat`: an integer, specifies the number of times an element is repeated.

*   `proper`: a boolean, specifies whether or not to strictly interpret the object in the "proper" syntax.


Notes:

*   `DOMful.parseToString()` only returns string, even if the `repeat` parameter is specified with more than 1. The `repeat` parameter just repeats the string output.

---

A simple example:

    var div = DOMful.parse('div#myId.myClass');
    
creates this:

    <div id="myId" class="myClass"></div>
    
---

Want the created element to have children? Here is an example using JavaScript objects:

    var div = DOMful.parse({
        'div#myId.myClass': ['p', 'p.otherClass', 'p.otherClass.anotherClass']
    });
    
creates this:

    <div id="myId" class="myClass">
        <p></p>
        <p class="otherClass"></p>
        <p class="otherClass anotherClass"></p>
    </div>
    
---
    
Just want a string as the content? Another simple example:
    
    var p = DOMful.parse({ 'p': 'some content' });
    
will create this:
    
    <p>some content</p>

---

Using the second `repeat` parameter, DOMful is ideal for prototyping and quick testing involving element creation in JavaScript:

    var myDynamicContent = DOMful.parse({ 'p': 'overflow test' }, 10);
    
creates this:

    <p>overflow test</p>
    <p>overflow test</p>
    <p>overflow test</p>
    <p>overflow test</p>
    <p>overflow test</p>
    <p>overflow test</p>
    <p>overflow test</p>
    <p>overflow test</p>
    <p>overflow test</p>
    <p>overflow test</p>

---

If you use an element for the value (or an array of elements), it will use those elements as the child elements:

    var myElement = DOMful.parse({
        'div': document.createElement('p')
    });

will create this:

    <div><p></p></div>
    
---

If you use a function for the value, DOMful will run that function when it is parsed and use the returned value as the content:

    var myElement = DOMful.parse({
        'div': function () {
            return 'ohai';
        }
    });
    
will create this:

    <div>ohai</div>

---

DOMful is ideal for dynamic table creation:

    var obj = {
        'table#myTable': {
            'thead': {
                'tr': [
                    { 'td.nameHeader': 'Name' },
                    { 'td.websiteHeader': 'Website' }
                ]
            },
            'tbody': []
        }
    };
    obj['table#myTable']['tbody'].push({
        'tr': [
            { 'td': 'John Doe' },
            { 'td': 'http://www.example.com/' }
        ]
    });
    obj['table#myTable']['tbody'].push({
        'tr': [
            { 'td': 'Jane Doe' },
            { 'td': 'http://www.example.org/' }
        ]
    });
    var table = DOMful.parse(obj);
    
creates this:

    <table id="myTable">
        <thead>
            <tr>
                <td class="nameHeader">Name</td>
                <td class="websiteHeader">Website</td>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>John Doe</td>
                <td>http://www.example.com/</td>
            </tr>
            <tr>
                <td>Jane Doe</td>
                <td>http://www.example.org/</td>
            </tr>
        </tbody>
    </table>

---

*TODO*: include instructions for attribute selector

*TODO*: include instructions for "proper" syntax for extended ability including adding events.

---

**Notes**:

*   In order for DOMful to know what element you want to make, you have to provide the tag name in the element string. `div#myId` is acceptable. `#myId` is not.
*   You cannot have nested selectors as the element string. DOMful will cry.
*   The element's content is not HTML encoded when using a string for the content. So doing this:

        DOMful.parse({ 'p': '<span></span>' });
    will result in this:
        <p><span></span></p>
        
*   Due to the nature of JavaScript literal objects, you cannot do this for multiple elements with the same selector:

        DOMful.parse({
            'p.same': 'one',
            'p.same': 'two'
        });

    This will just generate `<p class="same">two</p>`. To work around this limitation, use an array, like so:
    
        DOMful.parse([
            { 'p.same': 'one' },
            { 'p.same': 'two' }
        ]);

*   By default, DOMful will throw errors when it runs into issues with parsing. You can either wrap calls to the DOMful functions with a try-catch or you can disable the strict check before the DOMful library is included:
        <script type="text/javascript">
            var DOMful = { strict: false };
        </script>
        <script type="text/javascript" src="domful.js"></script>
        
J'Brian "jayther"