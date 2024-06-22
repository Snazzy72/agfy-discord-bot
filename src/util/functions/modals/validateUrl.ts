import { Constants } from "../../constants";

export function validSteamUrl(url: string): boolean {
  return url.startsWith(Constants.SteamUrl);
}

export function validEpicUrl(url: string): boolean {
  return url.startsWith(Constants.EpicUrl);
}

export function validAGFYUrl(url: string): boolean {
  return url.startsWith(Constants.AGFYUrl);
}
