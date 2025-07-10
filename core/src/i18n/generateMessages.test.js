const { vol } = require('memfs');
const path = require('path');
const fs = require('fs');
const glob = require('glob');

// Mock fs and glob
jest.mock('fs');
jest.mock('glob');

describe('generateMessages', () => {
  beforeEach(() => {
    // Reset mocks and virtual filesystem
    jest.resetModules();
    vol.reset();
    fs.writeFileSync.mockClear();
    fs.existsSync.mockImplementation((p) => p === path.join(__dirname, 'app'));
    fs.mkdirSync.mockImplementation(() => {});
  });

  it('merges all messages for the target language', () => {
    // Mock message files
    const fakeFiles = [
      '/src/comp1/messages.js',
      '/src/comp2/messages.js',
    ];
    glob.sync.mockReturnValue(fakeFiles);

    jest.doMock('/src/comp1/messages.js', () => ({
      comp1Messages: {
        en: { hello: 'Hello' },
        hu: { hello: 'Szia' },
      },
    }), { virtual: true });

    jest.doMock('/src/comp2/messages.js', () => ({
      comp2Messages: {
        en: { bye: 'Bye' },
        hu: { bye: 'Viszlát' },
      },
    }), { virtual: true });

    // Run the script
    process.argv[2] = 'hu';
    require('./generateMessages.js');

    // Check output
    const expected = JSON.stringify({ hello: 'Szia', bye: 'Viszlát' }, null, 2);
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      path.join(__dirname, 'app/hu.json'),
      expected,
      'utf8'
    );
  });
});