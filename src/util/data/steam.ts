import axios from "axios";
import { SteamResponse } from "../../types";
import { Constants } from "../constants";

export async function extractGameDataFromSteam(url: string): Promise<SteamResponse | null> {
  const regex = /\/app\/(\d+)\//;

  const match = url.match(regex);

  if (match) {
    const appId = match[1];

    const response = await axios.get(`${Constants.SteamAPIEndpoint}${appId}&l=en`);

    const gameData = response.data[appId].data;

    return {
      gameName: gameData.name,
      gameDescription: gameData.short_description,
      gameImage: gameData.header_image,
    };
  }

  return null;
}
