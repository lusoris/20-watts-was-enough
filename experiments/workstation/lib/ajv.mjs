import Ajv from "ajv";
import addFormats from "ajv-formats";

const projectVocabulary = Object.freeze(["x-runtime-validator"]);

export function createAjv(options = {}) {
  // JSON Schema permits applicator keywords without a sibling `type`.
  // Keep unknown-keyword strictness, while disabling Ajv's stricter lint rule.
  const validator = new Ajv({ strictTypes: false, ...options });
  validator.addVocabulary(projectVocabulary);
  addFormats(validator);
  return validator;
}
