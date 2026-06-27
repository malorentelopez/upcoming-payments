import type { SimpleIcon } from "simple-icons";
import {
  si1password,
  siApple,
  siApplemusic,
  siAppletv,
  siAudible,
  siBitwarden,
  siCloudflare,
  siCrunchyroll,
  siCursor,
  siDeepl,
  siDeezer,
  siDropbox,
  siDuolingo,
  siExpressvpn,
  siFigma,
  siGithub,
  siGithubcopilot,
  siGoogle,
  siGoogledrive,
  siHbomax,
  siIcloud,
  siMax,
  siMovistar,
  siNetflix,
  siNordvpn,
  siNotion,
  siOrange,
  siParamountplus,
  siPeloton,
  siPlaystation,
  siProtonmail,
  siProtonvpn,
  siSoundcloud,
  siSpotify,
  siStrava,
  siSurfshark,
  siTidal,
  siTwitch,
  siVercel,
  siVodafone,
  siYoutube,
  siYoutubemusic,
} from "simple-icons";

export type MerchantIconData = {
  slug: string;
  title: string;
  path: string;
  hex: string;
};

function toIconData(icon: SimpleIcon): MerchantIconData {
  return {
    slug: icon.slug,
    title: icon.title,
    path: icon.path,
    hex: `#${icon.hex}`,
  };
}

const ICON_BY_SLUG: Record<string, MerchantIconData> = {
  [si1password.slug]: toIconData(si1password),
  [siApple.slug]: toIconData(siApple),
  [siApplemusic.slug]: toIconData(siApplemusic),
  [siAppletv.slug]: toIconData(siAppletv),
  [siAudible.slug]: toIconData(siAudible),
  [siBitwarden.slug]: toIconData(siBitwarden),
  [siCloudflare.slug]: toIconData(siCloudflare),
  [siCrunchyroll.slug]: toIconData(siCrunchyroll),
  [siCursor.slug]: toIconData(siCursor),
  [siDeepl.slug]: toIconData(siDeepl),
  [siDeezer.slug]: toIconData(siDeezer),
  [siDropbox.slug]: toIconData(siDropbox),
  [siDuolingo.slug]: toIconData(siDuolingo),
  [siExpressvpn.slug]: toIconData(siExpressvpn),
  [siFigma.slug]: toIconData(siFigma),
  [siGithub.slug]: toIconData(siGithub),
  [siGithubcopilot.slug]: toIconData(siGithubcopilot),
  [siGoogle.slug]: toIconData(siGoogle),
  [siGoogledrive.slug]: toIconData(siGoogledrive),
  [siHbomax.slug]: toIconData(siHbomax),
  [siIcloud.slug]: toIconData(siIcloud),
  [siMax.slug]: toIconData(siMax),
  [siMovistar.slug]: toIconData(siMovistar),
  [siNetflix.slug]: toIconData(siNetflix),
  [siNordvpn.slug]: toIconData(siNordvpn),
  [siNotion.slug]: toIconData(siNotion),
  [siOrange.slug]: toIconData(siOrange),
  [siParamountplus.slug]: toIconData(siParamountplus),
  [siPeloton.slug]: toIconData(siPeloton),
  [siPlaystation.slug]: toIconData(siPlaystation),
  [siProtonmail.slug]: toIconData(siProtonmail),
  [siProtonvpn.slug]: toIconData(siProtonvpn),
  [siSoundcloud.slug]: toIconData(siSoundcloud),
  [siSpotify.slug]: toIconData(siSpotify),
  [siStrava.slug]: toIconData(siStrava),
  [siSurfshark.slug]: toIconData(siSurfshark),
  [siTidal.slug]: toIconData(siTidal),
  [siTwitch.slug]: toIconData(siTwitch),
  [siVercel.slug]: toIconData(siVercel),
  [siVodafone.slug]: toIconData(siVodafone),
  [siYoutube.slug]: toIconData(siYoutube),
  [siYoutubemusic.slug]: toIconData(siYoutubemusic),
};

export function getMerchantIcon(iconSlug: string): MerchantIconData | null {
  return ICON_BY_SLUG[iconSlug] ?? null;
}
