import axios from "axios";
import { EpicResponse } from "../../types";
import { Constants } from "../constants";

export async function extractGameDataFromEpic(url: string): Promise<EpicResponse | null> {
  const regex = /\/p\/([^\/]+)/;

  const match = url.match(regex);

  if (match) {
    const gameName = match[1];

    const response = await axios.get(`${Constants.EpicAPIEndpoint}${gameName}`);

    const gameData = response.data;

    const extractedGameName = gameData.productName;

    let gamePage;

    if ("pages" in gameData && gameData.pages.length > 0) {
      gamePage = gameData.pages[0];
      if (gameData.pages.length > 1) {
        gamePage = gameData.pages[1];
      }

      const gameDescription = gamePage.data.about.shortDescription;
      const gameImage = gamePage.data.hero.backgroundImageUrl;

      return {
        gameName: extractedGameName,
        gameDescription: gameDescription,
        gameImage: gameImage,
      };
    }
    return null;
  }

  return null;
}
