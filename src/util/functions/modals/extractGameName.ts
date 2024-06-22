export function extractGameName(url: string) {
  url = url.trim().replace(/\/+$/, "");

  const parts = url.split("free-download");
  const gameNameWithDashes = parts[0].split("/").pop() || "";
  const gameName = gameNameWithDashes
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return gameName;
}
