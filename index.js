const hastUtilSlots = require("./hast-util-slots");

function rehypeSlots({ values = {}, unwrap }) {
  return function(tree) {
    return hastUtilSlots(tree, values, unwrap);
  };
}

function rehypeWrap({ layout, slotName = "body" }) {
  return function(tree) {
    return hastUtilSlots(layout, { [slotName]: tree });
  };
}

module.exports = rehypeSlots;
