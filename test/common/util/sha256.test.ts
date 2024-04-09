import { sha256 } from '../../../src/common/util/sha256';

describe('util.sha256', () => {
  it('should encode text using sha256 algorithm', () => {
    const text = 'example';
    const encodedText = sha256.encode(text);
    expect(encodedText).toBe('50d858e0985ecc7f60418aaf0cc5ab587f42c2570a884095a9e8ccacd0f6545c');
  });
});
