import { test } from "node:test";
import assert from "node:assert/strict";

import isRoot from "../hast-util-slots/is-root.js";

test("isRoot", async (t) => {
  await t.test("valid roots", () => {
    assert.ok(isRoot({ type: "root", children: [] }));
    assert.ok(
      isRoot({ type: "root", children: [{ type: "element", children: [] }] }),
    );

    // Current behavior is that root expects to have children but the types of
    // the children are not checked to keep the function simple.
    assert.ok(isRoot({ type: "root", children: [1, 2, 3] }));
  });

  await t.test("invalid roots", () => {
    assert.ok(!isRoot({ type: "element", children: [] }));
    assert.ok(!isRoot({ type: "root" }));
    assert.ok(!isRoot({ type: "root", children: "foo" }));
    assert.ok(!isRoot(undefined));
    assert.ok(!isRoot(null));
    assert.ok(!isRoot(true));
    assert.ok(!isRoot(false));
    assert.ok(!isRoot("foo"));
    assert.ok(!isRoot(1));
    assert.ok(!isRoot({}));
    assert.ok(!isRoot([]));
  });
});
