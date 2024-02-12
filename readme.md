# rehype-slots

[**rehype**][rehype] plugin to replace slot elements in an HTML fragment.

Replacement value is provided as a [**HAST**][hast] tree

## Installation

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). 

Install the
[rehype-slots npm module](https://www.npmjs.com/package/rehype):

```sh
npm install rehype-slots
```

```js
import rehypeSlots from "rehype-slots";
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
import { h } from "hastscript";

const values = {
  // a string that will create a text node
  title: "A Tale Of Two Cities",

  // a HAST tree that will be inserted
  quote: h("p", "It was the best of times..."),
};
```

In the following code, `rehype-slots` will traverse the HTML tree and replace
each `<slot>` element with the value that was provided for it, based on the
`name` attribute.

If a `<slot>` element is encountered but no value was provided for it, then the
element's contents will be used as a default value.

```js
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import rehypeSlots from "rehype-slots";

unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeSlots, { values }) // <-- attach the rehype-slots plugin
  .use(rehypeFormat)
  .use(rehypeStringify)
  .process(input)
  .then((output) => {
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
- no value was provided for the `author` slot, so the slot element's contents
  were used as the default value.

## API

### `rehype().use(rehypeSlots[, options])`

Replace slot elements with the provided values.

##### Basic options

###### `options.values`

Object containing slot names and slot values. (`object`, default: `{}`)

Allowed value types:

- String (will be converted to a HAST text node)
- HAST node
- HAST root (document, fragment or template)
- Array of HAST nodes
- Function that returns any of the above. The function will be called with the
  slot name as the first argument.

###### `options.fallbackBehavior`

Defines the behavior when a slot is not found in the values object. It can be
one of the following:

- "unwrap": Replace the slot with its own children, i.e. unwrap it. This is the
  default.
- "remove": Remove the slot element entirely.
- "keep": Do nothing, keep the slot element as it is.

###### `options.replacer`

A function that will be called for each slot whose name was not found in the
values object. It will be called with `(slotName, slotElement)` and can return a
value to replace the slot with, or return undefined to use the fallback
behavior.

##### Advanced options

###### `options.slotTagName`

Tag name of the element to replace, if you want to use a different element than
`slot` which is the default.

###### `options.slotNameAttribute`

Name of the attribute on the slot element that holds the slot's name. The
default is `name`.

## License

MIT © Marek Zaluski

[rehype]: https://github.com/rehypejs/rehype
[hast]: https://github.com/syntax-tree/hast
[hastscript]: https://github.com/syntax-tree/hastscript
