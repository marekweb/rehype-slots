import { test } from "node:test";
import assert from "node:assert/strict";
import type { Element } from "hast";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeSlots from "../rehype-slots/rehype-slots.js";
import type { RehypeSlotsOptions } from "../rehype-slots/rehype-slots.js";
import rehypeStringify from "rehype-stringify";
import { Child, h } from "hastscript";
import { SlotReplacer } from "../hast-util-slots/hast-util-slots.js";

const input =
  '<h1><slot name="title">Untitled</slot></h1>' +
  "<article>" +
  '<div><slot name="quote">None</slot></div>' +
  '<div><slot name="author">Anonymous</slot></div>' +
  "</article>";

const values = {
  // a string that will create a text node
  title: "A Tale Of Two Cities",

  // a HAST tree that will be inserted
  quote: h("p", "It was the best of times..."),
};

async function processDocument(
  input: string,
  optionsForRehypeSlots: RehypeSlotsOptions,
): Promise<string> {
  const output = await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeSlots, optionsForRehypeSlots)
    // .use(rehypeFormat)
    .use(rehypeStringify)
    .process(input);
  return String(output);
}

test("rehype-slots", async (t) => {
  await t.test("replace slots with default behavior", async () => {
    const output = await processDocument(input, {
      values,
    });

    const expected =
      "<h1>A Tale Of Two Cities</h1><article>" +
      "<div><p>It was the best of times...</p></div>" +
      "<div>Anonymous</div></article>";

    const contents = String(output);

    assert.equal(contents, expected, "output equals expected");
  });

  await t.test('replace slots with fallbackBehavior="keep"', async () => {
    const expected =
      "<h1>A Tale Of Two Cities</h1>" +
      "<article>" +
      "<div>" +
      "<p>It was the best of times...</p>" +
      "</div>" +
      "<div>" +
      '<slot name="author">Anonymous</slot>' +
      "</div>" +
      "</article>";

    const output = await processDocument(input, {
      values,
      fallbackBehavior: "keep",
    });

    assert.equal(output, expected, "output equals expected");
  });

  await t.test('replace slots with fallbackBehavior="remove"', async () => {
    const expected =
      "<h1>A Tale Of Two Cities</h1>" +
      "<article>" +
      "<div>" +
      "<p>It was the best of times...</p>" +
      "</div>" +
      "<div></div>" +
      "</article>";
    const output = await processDocument(input, {
      values,
      fallbackBehavior: "remove",
    });

    assert.equal(output, expected, "output equals expected");
  });

  await t.test(
    "replace slots with custom replacer returning a value",
    async () => {
      const replacer: SlotReplacer = (name: string) => {
        if (name === "author") {
          return "Custom Author";
        }
      };

      const expected =
        "<h1>A Tale Of Two Cities</h1>" +
        "<article>" +
        "<div>" +
        "<p>It was the best of times...</p>" +
        "</div>" +
        "<div>Custom Author</div>" +
        "</article>";

      const output = await processDocument(input, {
        values,
        replacer,
      });

      assert.equal(output, expected, "output equals expected");
    },
  );

  await t.test(
    "replace slots with custom replacer returning undefined with default behavior",
    async () => {
      const replacer: SlotReplacer = (name: string) => {
        if (name === "author") {
          return undefined;
        }
      };

      const expected =
        "<h1>A Tale Of Two Cities</h1>" +
        "<article>" +
        "<div>" +
        "<p>It was the best of times...</p>" +
        "</div>" +
        "<div>Anonymous</div>" +
        "</article>";

      const output = await processDocument(input, {
        values,
        replacer,
      });

      assert.equal(output, expected, "output equals expected");
    },
  );

  await t.test(
    'replace slots with custom replacer returning undefined with fallbackBehavior="keep"',
    async () => {
      const replacer: SlotReplacer = (name: string) => {
        if (name === "author") {
          return undefined;
        }
      };

      const expected =
        "<h1>A Tale Of Two Cities</h1>" +
        "<article>" +
        "<div>" +
        "<p>It was the best of times...</p>" +
        "</div>" +
        "<div>" +
        '<slot name="author">Anonymous</slot>' +
        "</div>" +
        "</article>";

      const output = await processDocument(input, {
        values,
        replacer,
        fallbackBehavior: "keep",
      });

      assert.equal(output, expected, "output equals expected");
    },
  );

  await t.test(
    'replace slots with custom replacer returning undefined with fallbackBehavior="remove"',
    async () => {
      const replacer: SlotReplacer = (name: string) => {
        if (name === "author") {
          return undefined;
        }
      };

      const expected =
        "<h1>A Tale Of Two Cities</h1>" +
        "<article>" +
        "<div>" +
        "<p>It was the best of times...</p>" +
        "</div>" +
        "<div></div>" +
        "</article>";

      const output = await processDocument(input, {
        values,
        replacer,
        fallbackBehavior: "remove",
      });

      assert.equal(output, expected, "output equals expected");
    },
  );

  await t.test("replace slots with empty slot name", async () => {
    const input = "<h1><slot>Untitled</slot></h1>";
    const output = await processDocument(input, { values });
    const expected = "<h1>Untitled</h1>";
    assert.equal(output, expected, "output equals expected");
  });

  await t.test("replace slots with same name", async () => {
    const input =
      '<h1><slot name="title">Title 1</slot></h1><h2><slot name="title">Title 2</slot></h2>';
    const output = await processDocument(input, { values });
    const expected =
      "<h1>A Tale Of Two Cities</h1><h2>A Tale Of Two Cities</h2>";
    assert.equal(output, expected, "output equals expected");
  });

  await t.test("replace slots with dynamic replacement value", async () => {
    const input =
      '<h1><slot name="title">Title 1</slot></h1><h2><slot name="title">Title 2</slot></h2>';

    let calledNumber = 0;
    const values = {
      title: (name: string, slot: Element & Child) => {
        calledNumber++;
        assert.equal(name, "title", "replaced called with correct name");
        assert.equal(slot.tagName, "slot", "replaced called with correct slot");
        assert.equal(
          slot.properties.name,
          "title",
          "replaced called with correct slot name",
        );
        if (calledNumber === 1) {
          return "Dynamic title";
        }
        return undefined;
      },
    };

    const output = await processDocument(input, { values });
    const expected = "<h1>Dynamic title</h1><h2>Title 2</h2>";
    assert.equal(output, expected, "output equals expected");
    assert.equal(calledNumber, 2, "replacer called twice");
  });

  await t.test("replace slots with invalid input", async () => {
    const input = '<h1><slot name="title">Untitled</slot></h1>';
    const values = {
      title: {},
    };
    // Assert that it will throw
    assert.rejects(
      processDocument(input, { values } as unknown as RehypeSlotsOptions),
      {
        name: "Error",
        message: /^Expected a string, node, root, or array of nodes. Found/,
      },
      "should throw error",
    );
  });

  await t.test("replace slots with array of nodes", async () => {
    const input = '<h1><slot name="title">Untitled</slot></h1>';
    const values = {
      title: [h("em", "A"), h("strong", "B"), h("u", "C")],
    };
    const output = await processDocument(input, { values });
    const expected = "<h1><em>A</em><strong>B</strong><u>C</u></h1>";
    assert.equal(output, expected, "output equals expected");
  });
});
