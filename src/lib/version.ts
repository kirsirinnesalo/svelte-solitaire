/**
 * Version utility for the app
 *
 * @description Gets the current app version from the BUILD_VERSION global variable
 * that is injected during the build process by Vite
 *
 * @covers FEAT-013
 */

declare global {
  var BUILD_VERSION: string | undefined;
}

/**
 * Gets the current app version
 *
 * @returns The app version string from package.json, or 'dev' as fallback
 */
export function getAppVersion(): string {
  if (typeof global.BUILD_VERSION === 'string') {
    return global.BUILD_VERSION.trim();
  }
  return 'dev';
}
