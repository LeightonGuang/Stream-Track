import generateRandomState from "../generateRandomState";

import { ManifestType } from "../../../types/manifestType";

const manifest = chrome.runtime.getManifest() as ManifestType;
const clientId = manifest.oauth2?.client_id;

const getUserAccessToken = async (
  forceLogin: boolean,
): Promise<string | null> => {
  try {
    console.log("getting access token");
    return new Promise((resolve, reject) => {
      const redirectUri = chrome.identity.getRedirectURL();
      const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=user:read:follows&state=${generateRandomState()}${forceLogin && "&force_login=true"}`;

      chrome.identity.launchWebAuthFlow(
        { url: authUrl, interactive: true },
        (redirectUrl) => {
          if (chrome.runtime.lastError) {
            console.error(
              "Error launching web auth flow: ",
              chrome.runtime.lastError.message,
            );
            reject(chrome.runtime.lastError.message);
            return;
          }

          if (redirectUrl) {
            const params = new URLSearchParams(
              new URL(redirectUrl).hash.substring(1),
            );
            const accessToken = params.get("access_token");
            resolve(accessToken || null);
          } else {
            reject("No redirect URL found");
          }
        },
      );
    });
  } catch (error) {
    console.error("Error getting app access token: ", error);
    return null;
  }
};

export default getUserAccessToken;
