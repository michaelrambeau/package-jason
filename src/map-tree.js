const processChild = fn => child => mapTree(child, fn);

/*
Apply a function to all tree leaves to transform the leaves objects 
while preserving the tree structure.
*/
function mapTree(tree, fn) {
  const { children, ...rest } = tree;
  return children
    ? { ...fn(rest), children: children.map(processChild(fn)) }
    : fn(rest);
}

/*
Apply a function to stringify all tree leaves
The tree structure will be  simplified, no more `children` properties.
*/
function stringifyTreeLeaves(tree, getKey) {
  const { children, ...rest } = tree;
  const key = getKey(rest);
  return children
    ? { [key]: children.map(child => stringifyTreeLeaves(child, getKey)) }
    : key;
}

module.exports = { mapTree, stringifyTreeLeaves };
