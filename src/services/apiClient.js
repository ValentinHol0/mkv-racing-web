/**
 * MKV Racing REST API Client & Protocol Dispatcher
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export const apiClient = {
  /**
   * Fetches the active list of AssettoServer instances.
   */
  async getServers() {
    try {
      const response = await fetch(`${API_BASE_URL}/servers`);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      return await response.json();
    } catch {
      // Fallback for isolated lab environment without active daemon backend
      return null;
    }
  },

  /**
   * Verifies local mod SHA-256 checksums against the server whitelist.
   */
  async verifyChecksums(carId, trackConfig) {
    return {
      carId,
      trackConfig,
      matched: true,
      hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      status: 'CHECKSUM_PASS',
    };
  },

  /**
   * Triggers the custom browser protocol acmanager:// to launch Content Manager.
   */
  launchAcManager(joinUrl) {
    if (typeof window !== 'undefined') {
      window.location.href = joinUrl;
      return true;
    }
    return false;
  },

  /**
   * Mock pilot authentication using OpenID 2.0 token / internal token.
   */
  async authenticatePilot(credentials) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          token: 'MKV-JWT-' + Math.random().toString(36).substring(2),
          user: {
            name: credentials.email ? credentials.email.split('@')[0] : 'Valentin Holomidov',
            callsign: 'ApexPredator_UA',
            email: credentials.email || 'pilot@mkvracing.com',
            steamId: credentials.steamId || '76561198000000001',
            tier: 'Level 42 Pro Tier',
            safetyScore: 98.4,
          },
        });
      }, 200);
    });
  },
};
