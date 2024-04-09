import sha1 from '../../../src/common/util/sha1';

describe('util.sha1', () => {
  it('should encode text using sha1 algorithm', () => {
    const text = 'example';
    const encodedText = sha1.encode(text);
    expect(encodedText).toBe('c3499c2729730a7f807efb8676a92dcb6f8a3f8f');
  });
});
