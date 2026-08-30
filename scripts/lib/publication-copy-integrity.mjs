export function assertExactPublicationCopy(source, published, label) {
  if (!Buffer.isBuffer(source) || !Buffer.isBuffer(published)) {
    throw new TypeError("Publication copy inputs must be Buffers.");
  }
  if (!source.equals(published)) {
    throw new Error(
      `${label} differs from its current public source; rebuild the GitHub Pages artifact.`,
    );
  }
}
