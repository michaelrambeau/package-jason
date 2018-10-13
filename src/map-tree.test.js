const { mapTree, stringifyTreeLeaves } = require("./map-tree");

const tree = {
  name: "express",
  version: 1,
  children: [
    {
      name: "debug",
      version: 2,
      children: [
        {
          name: "ms",
          version: 3
        }
      ]
    },
    { name: "body-parser", version: 4 }
  ]
};

it("Should apply the mapper function to all tree leaves", () => {
  const mapper = leaf => ({ name: leaf.name });
  const result = mapTree(tree, mapper);
  expect(result).toEqual({
    name: "express",
    children: [
      {
        name: "debug",
        children: [{ name: "ms" }]
      },
      { name: "body-parser" }
    ]
  });
});

it("Should convert leaves to a single string", () => {
  const mapper = leaf => `${leaf.name}@${leaf.version}`;
  const result = stringifyTreeLeaves(tree, mapper);
  expect(result).toEqual({
    "express@1": [
      {
        "debug@2": ["ms@3"]
      },
      "body-parser@4"
    ]
  });
});
