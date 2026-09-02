/**
 * Real guest photographs — the only real photography on the site.
 *
 * Supplied by Semporna Paradise and cleared for publication by the guests
 * appearing in them and by the company owner (clearance of record 2026-09-02,
 * CONTEXT.md §5). Every other image on the site is generated and captioned as
 * generated (DESIGN.md §7).
 *
 * Captions describe the moment and the place only. They never name a resort,
 * never state a date, never imply availability, and never make a safety or
 * outcome claim — CONTEXT.md §3 hard rules 2 and 6 still apply to a caption.
 *
 * Alt text describes what is in the frame for a screen reader. It is not the
 * caption repeated.
 */
import type { ImageSlot } from "../lib/images";
import type { Lang } from "../lib/gated";

export interface Photo {
  slot: ImageSlot;
  alt: Record<Lang, string>;
  caption: Record<Lang, string>;
}

export const PHOTOS = {
  boatGroup: {
    slot: "photo-boat-group",
    alt: {
      bm: "Sekumpulan tetamu memakai jaket keselamatan duduk di dalam bot beratap biru di atas air pirus, dengan rumah atas air di latar belakang.",
      en: "A group of guests in life jackets seated under a blue boat canopy on turquoise water, with stilt houses behind them.",
    },
    caption: {
      bm: "Dalam perjalanan bot keluar dari jeti, melepasi perkampungan atas air.",
      en: "On the boat out from the jetty, passing the stilt village.",
    },
  },
  boheyDulang: {
    slot: "photo-bohey-dulang",
    alt: {
      bm: "Sembilan orang bergambar bersama di bawah papan tanda kayu bertulis Bohey Dulang Trail 700M di bawah naungan pokok.",
      en: "Nine people posing together under a wooden sign reading Bohey Dulang Trail 700M in the shade of the trees.",
    },
    caption: {
      bm: "Di pangkal denai Bohey Dulang, Taman Marin Tun Sakaran.",
      en: "At the foot of the Bohey Dulang trail, Tun Sakaran Marine Park.",
    },
  },
  sandbarSea: {
    slot: "photo-sandbar-sea",
    alt: {
      bm: "Seorang berdiri di dalam ombak cetek di tepi pantai, menghadap laut pirus dan langit biru cerah dengan pulau jauh di ufuk.",
      en: "A person standing in the shallow surf at the shoreline, facing turquoise water and a bright blue sky with a distant island on the horizon.",
    },
    caption: {
      bm: "Air cetek di tepi pulau, dengan pulau lain kelihatan di ufuk.",
      en: "Shallow water at the island edge, another island on the horizon.",
    },
  },
  boatSelfie: {
    slot: "photo-boat-selfie",
    alt: {
      bm: "Swafoto seorang pemandu di dalam bot, dengan tetamu memakai jaket keselamatan tersenyum di belakangnya dan jeti pulau di latar.",
      en: "A guide taking a selfie on the boat, with guests in life jackets smiling behind and an island jetty in the background.",
    },
    caption: {
      bm: "Pemandu kami bersama tetamu semasa perjalanan antara pulau.",
      en: "Our guide with guests on the crossing between islands.",
    },
  },
  heartSandbar: {
    slot: "photo-heart-sandbar",
    alt: {
      bm: "Dua tangan membentuk hati membingkai seorang bertopi yang berdiri jauh di atas beting pasir putih.",
      en: "Two hands forming a heart shape, framing a person in a sun hat standing far off on a white sandbar.",
    },
    caption: {
      bm: "Beting pasir putih pada waktu tengah hari.",
      en: "The white sandbar at midday.",
    },
  },
  groupSign: {
    slot: "photo-group-sign",
    alt: {
      bm: "Sekumpulan tetamu bergambar di atas pasir putih di bawah papan tanda kayu berbahasa Bajau dan Melayu, diapit bendera Sabah dan Malaysia.",
      en: "A group of guests posing on white sand under a wooden sign in Bajau and Malay, flanked by the Sabah and Malaysia flags.",
    },
    caption: {
      bm: "Papan tanda perpisahan di pulau — “Magsukul na”, terima kasih.",
      en: "The farewell sign on the island — “Magsukul na”, thank you.",
    },
  },
  boatThumbs: {
    slot: "photo-boat-thumbs",
    alt: {
      bm: "Tetamu memakai jaket keselamatan mengangkat ibu jari di dalam bot yang sedang bergerak, dengan bandar Semporna di latar belakang.",
      en: "Guests in life jackets giving a thumbs up aboard a moving boat, with the Semporna shoreline behind.",
    },
    caption: {
      bm: "Bertolak dari jeti Semporna pada awal pagi.",
      en: "Leaving the Semporna jetty in the early morning.",
    },
  },
} as const satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof PHOTOS;

/** Flatten the bilingual record into what <GuestGallery> renders. */
export function gallery(keys: readonly PhotoKey[], lang: Lang) {
  return keys.map((k) => ({
    slot: PHOTOS[k].slot,
    alt: PHOTOS[k].alt[lang],
    caption: PHOTOS[k].caption[lang],
  }));
}
