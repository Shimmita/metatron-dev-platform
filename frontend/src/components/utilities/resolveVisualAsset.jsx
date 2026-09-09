import AppLogo from "../../images/logo_sm.png";
import { getImageMatch } from "./getImageMatch";

const isUrlLike = (value = "") =>
  /^(https?:)?\/\//i.test(`${value || ""}`.trim()) ||
  /^data:image\//i.test(`${value || ""}`.trim()) ||
  /^blob:/i.test(`${value || ""}`.trim());

const normalizeUrl = (value = "") => {
  const raw = `${value || ""}`.trim();
  return raw.startsWith("//") ? `https:${raw}` : raw;
};

export const isMetatronAssetToken = (value = "") =>
  ["metatron", "metatron logo", "metatron-logo"].includes(`${value || ""}`.trim().toLowerCase());

export const resolveVisualAsset = (value = "", fallbackValue = "") => {
  const candidate = `${value || ""}`.trim() || `${fallbackValue || ""}`.trim();

  if (!candidate || isMetatronAssetToken(candidate)) return AppLogo;
  if (isUrlLike(candidate)) return normalizeUrl(candidate);

  const matchedAsset = getImageMatch(candidate);
  const defaultSkillAsset = getImageMatch("");
  const isIntentionalCodingAsset = candidate.toLowerCase() === "coding";

  if (matchedAsset !== defaultSkillAsset || isIntentionalCodingAsset) return matchedAsset;
  if (fallbackValue && fallbackValue !== candidate) return resolveVisualAsset(fallbackValue);

  return AppLogo;
};

export default resolveVisualAsset;
