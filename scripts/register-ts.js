const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const compilerOptions = {
  module: ts.ModuleKind.CommonJS,
  target: ts.ScriptTarget.ES2020,
  esModuleInterop: true,
  resolveJsonModule: true,
};

require.extensions[".ts"] = function registerTs(module, filename) {
  const source = fs.readFileSync(filename, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions,
    fileName: filename,
  });
  return module._compile(outputText, filename);
};

require.extensions[".tsx"] = require.extensions[".ts"];
