import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getAppVersion } from './version';

describe('getAppVersion', () => {
  const originalBuildVersion = typeof global.BUILD_VERSION !== 'undefined' ? global.BUILD_VERSION : undefined;

  afterEach(() => {
    if (originalBuildVersion !== undefined) {
      global.BUILD_VERSION = originalBuildVersion;
    } else {
      delete (global as any).BUILD_VERSION;
    }
  });

  it('returns the version from BUILD_VERSION when available', () => {
    global.BUILD_VERSION = '1.0.1';
    expect(getAppVersion()).toBe('1.0.1');
  });

  it('returns fallback version when BUILD_VERSION is not available', () => {
    delete (global as any).BUILD_VERSION;
    expect(getAppVersion()).toBe('dev');
  });

  it('handles version strings with special characters', () => {
    global.BUILD_VERSION = '1.0.1-alpha';
    expect(getAppVersion()).toBe('1.0.1-alpha');
  });

  it('trims whitespace from version string', () => {
    global.BUILD_VERSION = '  1.0.1  ';
    expect(getAppVersion()).toBe('1.0.1');
  });
});
