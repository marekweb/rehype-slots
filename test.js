const assert = require("assert");
const unified = require("unified");
const rehypeParse = require("rehype-parse");
const rehypeSlots = require(".");
const rehypeFormat = require("rehype-format");
const rehypeStringify = require("rehype-stringify");
const h = require("hastscript");

const input = `
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
`;

const values = {
  // a string that will create a text node
  title: "A Tale Of Two Cities",

  // a HAST tree that will be inserted
  quote: h("p", "It was the best of times...")
};

const expected = `
<h1>A Tale Of Two Cities</h1>
<article>
  <div>
    <p>It was the best of times...</p>
  </div>
  <div>Anonymous</div>
</article>
`;

const expected2 = `
<h1>A Tale Of Two Cities</h1>
<article>
  <div>
    <p>It was the best of times...</p>
  </div>
  <div>
    <slot name="author">Anonymous</slot>
  </div>
</article>
`;

function processDocument(input, optionsForRehypeSlots) {
  return unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeSlots, optionsForRehypeSlots)
    .use(rehypeFormat)
    .use(rehypeStringify)
    .process(input);
}

async function test() {
  const output = await processDocument(input, {
    values
  });

  assert.equal(output.contents, expected, "output equals expected");

  const output2 = await processDocument(input, { values, unwrap: false });

  assert.equal(output2.contents, expected2, "output2 equals expected2");
}

test().catch(error => {
  console.error(error);
  process.exit();
});
