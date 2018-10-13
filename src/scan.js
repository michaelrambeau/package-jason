const packageJson = require("package-json");
const pMap = require("p-map");
const debug = require("debug")("scan");

function fetchPackageJson({ name, version }) {
  debug("Calling `package-json`", name, version);
  return packageJson(name, { version });
}

async function scanPackage({ name, version, cache, counters }) {
  debug("Scanning", name, version);
  const key = getCacheKey({ name, version });
  incrementCounter({ counters, key });
  const fetchFn = () => fetchPackageJson({ name, version });
  const { data } = await fetchIfNeeded({
    fetchFn,
    key,
    cache
  });
  debug(Object.keys(data));
  const { dependencies } = data;
  const allDependencies = dependencies;
  const children = dependencies
    ? Object.keys(allDependencies).map(key => ({
        name: key,
        version: allDependencies[key]
      }))
    : [];
  return { name, version: data.version, children };
}

const recursiveMapper = ({ cache, counters }) => async values => {
  const { children, name, version } = await scanDependencies({
    ...values,
    cache,
    counters
  });
  const data = { name, version };
  return children ? { ...data, children } : data;
};

async function scanDependencies({ name, version, cache, counters }) {
  const { children, ...rest } = await scanPackage({
    name,
    version,
    cache,
    counters
  });
  const tree =
    children && children.length > 0
      ? await pMap(children, recursiveMapper({ cache, counters }), {
          concurrency: 20
        })
      : await null;
  return tree ? { ...rest, children: tree } : rest;
}

async function scan({ packageName, version = "latest", cache }) {
  const counters = new Map();
  const tree = await scanDependencies({
    name: packageName,
    version,
    cache,
    counters
  });
  const sum = (acc, val) => acc + val;
  const total = Array.from(counters.values()).reduce(sum, 0);
  const meta = {
    count: counters.size,
    total
  };
  return {
    tree,
    meta
  };
}

async function fetchIfNeeded({ fetchFn, key, cache, skipCache }) {
  const cachedValue = !skipCache && (await cache.get(key));
  const fromCache = !!cachedValue;
  debug(key, fromCache ? "in the cache" : "not in the cache!");
  const fetchAndUpdateCache = async () => {
    const value = await fetchFn(key);
    await cache.set(key, value);
    return value;
  };
  const data = await (cachedValue || fetchAndUpdateCache());
  const meta = { fromCache };
  return { data, meta };
}

function getCacheKey({ name, version }) {
  return `${name}@${version}`;
}

function incrementCounter({ counters, key }) {
  const value = counters.has(key) ? counters.get(key) + 1 : 1;
  counters.set(key, value);
}

module.exports = scan;
