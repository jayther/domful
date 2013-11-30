DOMful
======

Still in early development! Please ignore for now!

A (hopefully) lightweight JavaScript library designed to make elements a little easier. Ideal for prototyping. Inspired by jQuery through their use of CSS selector syntax for their element selector.

The DOMful library enables the creation of elements in JavaScript through the use of CSS selector syntax and JavaScript objects (literal objects or otherwise), strings, or arrays.

There are only two usable functions in DOMful. `DOMful.parse()` is the main function that parses specifically-formatted JavaScript object, string, or array into elements. `DOMful.parseToString()` simply calls `DOMful.parse()` and returns a string of the HTML instead of JavaScript DOM elements.

A simple example:
`
<script type="text/javascript">
var div = DOMful.parse('div#myId.myClass');
</script>
`
creates this:
`
<div id="myId" class="myClass"></div>
`

Want the created element to have children? Here is an example using JavaScript objects:
`
<script type="text/javascript">
var div = DOMful.parse({
    'div#myId.myClass': ['p', 'p.otherClass', 'p.otherClass.anotherClass']
});
</script>
`
creates this:
`
<div id="myId" class="myClass">
    <p></p>
    <p class="otherClass"></p>
    <p class="otherClass anotherClass"></p>
</div>
`

Using the second `repeat` parameter, DOMful is ideal for prototyping and quick testing involving element creation in JavaScript:
`
<script type="text/javascript">
var myDynamicContent = DOMful.parse({ 'p': 'overflow test' }, 10);
</script>
`
creates this:
`
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
`

DOMful is ideal for dynamic table creation:
`
<script type="text/javascript">
var table = DOMful.parse({
    'table#myTable': {
        'thead': {
            'tr': [
                { 'td.nameHeader': 'Name' },
                { 'td.websiteHeader': 'Website' }
            ]
        },
        'tbody': [
            {
                'tr': [
                    { 'td': 'John Doe' },
                    { 'td': 'http://www.example.com/' }
                ]
            },
            {
                'tr': [
                    { 'td': 'Jane Doe' },
                    { 'td': 'http://www.example.org/' }
                ]
            }
        ]
    }
});
</script>
`
creates this:
`
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
`

J'Brian "jayther"