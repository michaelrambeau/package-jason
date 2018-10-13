const scan = require("../src/scan");
const { stringifyTreeLeaves } = require("../src/map-tree");
const sample = require("./sample");

it("Should return the right tree for Redux package, making 4 HTTP requests", async () => {
  const cache = new Map();
  const { tree } = await scan({
    packageName: "redux",
    version: "4.0.0",
    cache
  });
  expect(tree).toEqual(sample.redux);
  expect(cache.size).toBe(4);
});

it("Should return the right tree for Express package", async () => {
  const cache = new Map();
  const { tree } = await scan({
    packageName: "express",
    version: "4.16.4",
    cache
  });
  const mapper = leaf => `${leaf.name}@${leaf.version}`;
  const compactTree = stringifyTreeLeaves(tree, mapper);
  expect(compactTree).toEqual(sample.express);
  expect(cache.size).toBe(52);
});
