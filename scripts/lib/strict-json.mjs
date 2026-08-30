const numberPattern = /-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?/uy;
const hexadecimalPattern = /^[0-9a-fA-F]{4}$/u;

function refuse(label, reason) {
  throw new SyntaxError(`Invalid ${label}: ${reason}`);
}

function jsonText(source, label) {
  if (typeof source === "string") return source;
  if (!(source instanceof Uint8Array)) {
    refuse(label, "input must be UTF-8 bytes or a string");
  }
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(source);
  } catch {
    refuse(label, "input is not valid UTF-8");
  }
}

function parserOptions(label, maximumDepth, maximumContainerEntries) {
  if (typeof label !== "string" || label.length === 0) {
    throw new TypeError("Strict JSON requires a non-empty label.");
  }
  if (!Number.isSafeInteger(maximumDepth) || maximumDepth < 1 || maximumDepth > 64) {
    refuse(label, "maximumDepth must be an integer from 1 through 64");
  }
  if (
    !Number.isSafeInteger(maximumContainerEntries)
    || maximumContainerEntries < 1
    || maximumContainerEntries > 65_536
  ) {
    refuse(label, "maximumContainerEntries must be an integer from 1 through 65536");
  }
}

class StrictJsonParser {
  constructor(source, label, maximumDepth, maximumContainerEntries) {
    this.source = source;
    this.label = label;
    this.maximumDepth = maximumDepth;
    this.maximumContainerEntries = maximumContainerEntries;
    this.index = 0;
  }

  skipWhitespace() {
    while (
      this.source[this.index] === " "
      || this.source[this.index] === "\n"
      || this.source[this.index] === "\r"
      || this.source[this.index] === "\t"
    ) this.index += 1;
  }

  parseString() {
    const start = this.index;
    this.index += 1;
    while (this.index < this.source.length) {
      const character = this.source[this.index];
      if (character === '"') {
        this.index += 1;
        return JSON.parse(this.source.slice(start, this.index));
      }
      if (character.charCodeAt(0) < 0x20) {
        refuse(this.label, `string contains a control character at offset ${this.index}`);
      }
      if (character !== "\\") {
        this.index += 1;
        continue;
      }
      this.index += 1;
      const escape = this.source[this.index];
      if (escape === "u") {
        const hexadecimal = this.source.slice(this.index + 1, this.index + 5);
        if (!hexadecimalPattern.test(hexadecimal)) {
          refuse(this.label, `string has an invalid Unicode escape at offset ${this.index - 1}`);
        }
        this.index += 5;
      } else if ('"\\/bfnrt'.includes(escape)) {
        this.index += 1;
      } else {
        refuse(this.label, `string has an invalid escape at offset ${this.index - 1}`);
      }
    }
    refuse(this.label, `string starting at offset ${start} is not terminated`);
  }

  parseNumber() {
    numberPattern.lastIndex = this.index;
    const match = numberPattern.exec(this.source);
    if (!match) refuse(this.label, `expected a JSON value at offset ${this.index}`);
    this.index = numberPattern.lastIndex;
    const value = Number(match[0]);
    if (!Number.isFinite(value)) {
      refuse(this.label, `number at offset ${match.index} is not finite`);
    }
    return value;
  }

  parseLiteral(literal, value) {
    if (!this.source.startsWith(literal, this.index)) {
      refuse(this.label, `expected a JSON value at offset ${this.index}`);
    }
    this.index += literal.length;
    return value;
  }

  parseObject(depth) {
    if (depth >= this.maximumDepth) {
      refuse(this.label, `nesting exceeds the ${this.maximumDepth}-level limit`);
    }
    this.index += 1;
    this.skipWhitespace();
    const value = Object.create(null);
    const names = new Set();
    if (this.source[this.index] === "}") {
      this.index += 1;
      return value;
    }
    for (let count = 0; ; count += 1) {
      if (count >= this.maximumContainerEntries) {
        refuse(this.label, "object exceeds its member limit");
      }
      if (this.source[this.index] !== '"') {
        refuse(this.label, `object name is missing at offset ${this.index}`);
      }
      const name = this.parseString();
      if (names.has(name)) refuse(this.label, `object repeats name ${JSON.stringify(name)}`);
      names.add(name);
      this.skipWhitespace();
      if (this.source[this.index] !== ":") {
        refuse(this.label, `object name lacks a value at offset ${this.index}`);
      }
      this.index += 1;
      value[name] = this.parseValue(depth + 1);
      this.skipWhitespace();
      if (this.source[this.index] === "}") {
        this.index += 1;
        return value;
      }
      if (this.source[this.index] !== ",") {
        refuse(this.label, `object is not closed at offset ${this.index}`);
      }
      this.index += 1;
      this.skipWhitespace();
    }
  }

  parseArray(depth) {
    if (depth >= this.maximumDepth) {
      refuse(this.label, `nesting exceeds the ${this.maximumDepth}-level limit`);
    }
    this.index += 1;
    this.skipWhitespace();
    const value = [];
    if (this.source[this.index] === "]") {
      this.index += 1;
      return value;
    }
    for (let count = 0; ; count += 1) {
      if (count >= this.maximumContainerEntries) {
        refuse(this.label, "array exceeds its item limit");
      }
      value.push(this.parseValue(depth + 1));
      this.skipWhitespace();
      if (this.source[this.index] === "]") {
        this.index += 1;
        return value;
      }
      if (this.source[this.index] !== ",") {
        refuse(this.label, `array is not closed at offset ${this.index}`);
      }
      this.index += 1;
      this.skipWhitespace();
    }
  }

  parseValue(depth) {
    this.skipWhitespace();
    const character = this.source[this.index];
    if (character === "{") return this.parseObject(depth);
    if (character === "[") return this.parseArray(depth);
    if (character === '"') return this.parseString();
    if (character === "t") return this.parseLiteral("true", true);
    if (character === "f") return this.parseLiteral("false", false);
    if (character === "n") return this.parseLiteral("null", null);
    return this.parseNumber();
  }

  parse() {
    const value = this.parseValue(0);
    this.skipWhitespace();
    if (this.index !== this.source.length) {
      refuse(this.label, `contains trailing data at offset ${this.index}`);
    }
    return value;
  }
}

export function parseStrictJson(
  input,
  {
    label = "JSON document",
    maximumDepth = 16,
    maximumContainerEntries = 65_536,
  } = {},
) {
  parserOptions(label, maximumDepth, maximumContainerEntries);
  const source = jsonText(input, label);
  return new StrictJsonParser(
    source,
    label,
    maximumDepth,
    maximumContainerEntries,
  ).parse();
}
