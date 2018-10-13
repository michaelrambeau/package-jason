const scan = require("./src");
const ora = require("ora");

async function main() {
  const argv = require("minimist")(process.argv.slice(2));
  const [packageName] = argv._;
  const spinner = ora(`Fetching ${packageName}`).start();
  try {
    const result = await scan(packageName);
    spinner.stop();
    print(result);
  } catch (error) {
    console.error(error.message); // eslint-disable-line no-console
    spinner.stop();
  }
}

function print(json) {
  console.log(JSON.stringify(json, null, "  ")); // eslint-disable-line no-console
}

main();
