# Package Jason

Do you want to see the package dependency tree? Ask Jason, he knows everything about the `package.json` files!

_Package Jason_ is a tool that scan recursively all dependencies of a given package and generate a tree that shows all nested dependencies.

For example, let's scan `react` package:

```js
const packageJason = require("package-jason");
const result = await packageJason("react");
```

We will get a JSON `tree` and meta data about the packages scanned:

- total: total number of packages found during the scanning process
- count: number of unique packages found (because the same package can be included by several sub-dependencies)

```json
{
  "tree": {
    "name": "react",
    "version": "16.5.2",
    "children": [
      {
        "name": "loose-envify",
        "version": "1.4.0",
        "children": [
          {
            "name": "js-tokens",
            "version": "4.0.0"
          }
        ]
      },
      {
        "name": "object-assign",
        "version": "4.1.1"
      },
      {
        "name": "prop-types",
        "version": "15.6.2",
        "children": [
          {
            "name": "loose-envify",
            "version": "1.4.0",
            "children": [
              {
                "name": "js-tokens",
                "version": "4.0.0"
              }
            ]
          },
          {
            "name": "object-assign",
            "version": "4.1.1"
          }
        ]
      },
      {
        "name": "schedule",
        "version": "0.5.0",
        "children": [
          {
            "name": "object-assign",
            "version": "4.1.1"
          }
        ]
      }
    ]
  },
  "meta": {
    "count": 7,
    "total": 10
  }
}
```

## Compatibility

To be used with Node.js 10+.

This is a package for the Node.js only, not for the browser.

## Testing

```
npm test
```

## Credits

_Package Jason_ relies on [`package-json`](https://github.com/sindresorhus/package-json) package from the great [Sindre Sorhus](https://github.com/sindresorhus)
