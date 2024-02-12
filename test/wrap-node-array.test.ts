import { test } from "node:test";
import assert from "node:assert/strict";

import wrapNodeArray from "../hast-util-slots/wrap-node-array.js";
import { Literal, Node } from "hast";

test("wrapNodeArray", async (t) => {
  const nodeInput: Literal = { type: "text", value: "Node" };

  await t.test("string input", () => {
    const textNodeResult: Node[] = wrapNodeArray("Hello");
    assert.strictEqual(textNodeResult.length, 1);
    assert.deepStrictEqual(textNodeResult[0], { type: "text", value: "Hello" });
  });

  await t.test("node input", () => {
    const nodeResult: Node[] = wrapNodeArray(nodeInput);
    assert.strictEqual(nodeResult.length, 1);
    assert.deepStrictEqual(nodeResult[0], nodeInput);
  });

  await t.test("root input", () => {
    const rootInput = { type: "root", children: [nodeInput] };
    const rootResult: Node[] = wrapNodeArray(rootInput);
    assert.strictEqual(rootResult.length, 1);
    assert.deepStrictEqual(rootResult[0], nodeInput);
  });

  // Array of nodes input
  await t.test("array input", () => {
    const arrayInput: Literal[] = [{ type: "text", value: "Array Node" }];
    const arrayResult: Node[] = wrapNodeArray(arrayInput);
    assert.strictEqual(arrayResult.length, 1);
    assert.deepStrictEqual(arrayResult, arrayInput);
  });

  // Empty string input
  await t.test("empty string input", () => {
    const emptyStringResult: Node[] = wrapNodeArray("");
    assert.strictEqual(emptyStringResult.length, 1);
    assert.deepStrictEqual(emptyStringResult[0], { type: "text", value: "" });
  });

  await test("empty array input", () => {
    const emptyArrayResult: Node[] = wrapNodeArray([]);
    assert.strictEqual(emptyArrayResult.length, 0);
  });

  // Root with multiple children input
  await t.test("root with multiple children input", () => {
    const multiChildRootInput = {
      type: "root",
      children: [nodeInput, nodeInput],
    };
    const multiChildRootResult: Node[] = wrapNodeArray(multiChildRootInput);
    assert.strictEqual(multiChildRootResult.length, 2);
    assert.deepStrictEqual(multiChildRootResult, [nodeInput, nodeInput]);
  });

  // Array of nodes with multiple nodes input
  await t.test("array of multiple nodes input", () => {
    const multiNodeArrayInput: Literal[] = [nodeInput, nodeInput, nodeInput];
    const multiNodeArrayResult: Node[] = wrapNodeArray(multiNodeArrayInput);
    assert.strictEqual(multiNodeArrayResult.length, 3);
    assert.deepStrictEqual(multiNodeArrayResult, [
      nodeInput,
      nodeInput,
      nodeInput,
    ]);
  });

  await t.test("invalid inputs", () => {
    const invalidInputs = [
      undefined,
      null,
      true,
      123,
      [""],
      [null],
      [nodeInput, nodeInput, "invalid"],
      {},
      ["invalid"],
    ];

    for (const input of invalidInputs) {
      assert.throws(
        () => wrapNodeArray(input),
        {
          name: "Error",
          message: /^Expected a string, node, root, or array of nodes. Found/,
        },
        `should throw error for ${JSON.stringify(input)}`,
      );
    }
  });
});
