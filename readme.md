# rehype-slots

[**rehype**][rehype] plugin to replace slot elements in an HTML fragment.

## Use

Take this HTML fragment:

```html
<h1>
  <slot name="title"></slot>
</h1>
<article>
  <div>
    <slot name="quote"></slot>
  </div>
  <div>
    <slot name="author">Anonymous</slot>
  </div>
</article>
```

Provide the slot values to be inserted:

```js
const h = require("hastscript");

const values = {
  // a string that will create a text node
  title: "A Tale Of Two Cities",

  // a HAST tree that will be inserted
  quote: h("p", "It was the best of times...")
};
```

In the following code, `rehype-slots` will traverse the HTML tree and replace
each `<slot>` element with the value that was provided for it, based on the
`name` attribute.

If a `<slot>` element is encountered but no value was provided for it, then the
element's contents will be used as a default value.

```js
const unified = require("unified");
const rehypeParse = require("rehype-parse");
const rehypeSlots = require("rehype-slots");
const rehypeFormat = require("rehype-format");
const rehypeStringify = require("rehype-stringify");

unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeSlots, { values })
  .use(rehypeFormat)
  .use(rehypeStringify)
  .process(input)
  .then(output => {
    console.log(output.contents);
  });
```

Output:

```html
<h1>A Tale Of Two Cities</h1>
<article>
  <div>
    <p>It was the best of times...</p>
  </div>
  <div>Anonymous</div>
</article>
```
