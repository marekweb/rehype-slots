# rehype-slots

[**rehype**][rehype] plugin to replace slot elements in an HTML fragment.

Replacement value is provided as a [**HAST**][hast] tree

## Installation

The module is experimental and isn't published on NPM yet, but can be installed
directly from the GitHub repository.

```sh
npm install marekweb/rehype-slots
```

```js
const rehypeSlots = require("rehype-slots");
```

## Example Usage

Take this HTML fragment which contains `<slot>` elements:

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

Provide the slot values to be inserted, in this case using
[`hastscript`][hastscript] to create the HAST tree:

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
const rehypeFormat = require("rehype-format");
const rehypeStringify = require("rehype-stringify");
const rehypeSlots = require("rehype-slots");

unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeSlots, { values }) // <-- attach the rehype-slots plugin
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

Notice in the output:

- the `title` slot was replaced with a string
- the `quote` slot was replaced with an HTML tree (HAST)
- no value was provide for the `author` slot, so the slot element's contents
  were used as the default value.

## API

### `rehype().use(rehypeSlots[, options])`

Replace slot elements with the provide values.

##### `options`

###### `options.values`

Object containing slot names and slot values. (`object`, default: `{}`)

###### `options.unwrap`

Boolean flag indicating whether to use the slot element's contents as the
default value if no value is provided in `options.values`. Effectively this
unwraps (`boolean`, default: `true`)

## License

MIT © Marek Zaluski

[rehype]: https://github.com/rehypejs/rehype
[hast]: https://github.com/syntax-tree/hast
[hastscript]: https://github.com/syntax-tree/hastscript
