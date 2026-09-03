/**
 * Attribution for every free-licence photograph on this site.
 *
 * CONTEXT.md §5 (owner override, 2026-09-03) allows real photography ONLY where
 * the company owns it or it carries a free licence. These thirteen are the free-
 * licence half: Wikimedia Commons files under CC0, CC BY or CC BY-SA.
 *
 * CC BY and CC BY-SA both REQUIRE attribution. <SiteFooter> renders every row
 * below, with a link to the source page and to the licence deed. If a row is
 * removed from here, the image must be removed from the site in the same
 * change — an unattributed CC BY file is a licence breach, not a style choice.
 *
 * Provenance for all of them, plus the company-owned media, is in
 * `img-raw/SOURCES.md`. Harvested and vetted by `scripts/harvest-commons.py`,
 * which rejects NC, ND and unknown licences outright.
 */
import type { ImageSlot } from "../lib/images";
import type { Lang } from "../lib/gated";

export interface PhotoCredit {
  slot: ImageSlot;
  /** Title of the file on Commons. */
  title: string;
  /** Author as Commons records them. Never shortened away. */
  author: string;
  licence: string;
  licenceUrl: string;
  sourcePage: string;
  alt: Record<Lang, string>;
}

export const PHOTO_CREDITS: PhotoCredit[] = [
  {
    slot: "cm-semporna-dusk",
    title: "Semporna - Tun Sakaran Marine Park.jpg",
    author: "Adznee Abas from Shah Alam, Malaysia",
    licence: "CC BY 2.0",
    licenceUrl: "https://creativecommons.org/licenses/by/2.0",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Semporna_-_Tun_Sakaran_Marine_Park.jpg",
    alt: { bm: "Senja di Semporna: siluet pulau berbukit di ufuk, air tenang di hadapan, langit jingga dan kelabu.", en: "Dusk at Semporna: hill islands in silhouette on the horizon, calm water in front, an orange and grey sky." },
  },
  {
    slot: "cm-stilt-lagoon",
    title: "Bodgaya Island.jpg",
    author: "Fabio Achilli",
    licence: "CC BY 2.0",
    licenceUrl: "https://creativecommons.org/licenses/by/2.0",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Bodgaya_Island.jpg",
    alt: { bm: "Rumah atas tiang di atas lagun pirus cetek, dengan pulau berhutan curam di belakangnya.", en: "Stilt houses standing over a shallow turquoise lagoon, with a steep forested island behind." },
  },
  {
    slot: "cm-reef-mosaic",
    title: "Marine Mosaic Coral Creations.jpg",
    author: "Zakee Man",
    licence: "CC BY-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Marine_Mosaic_Coral_Creations.jpg",
    alt: { bm: "Pandangan dari udara: mozek karang dan pasir di bawah air cetek, bersempadan hutan pulau.", en: "Seen from above: a mosaic of coral and sand under shallow water, edged by island forest." },
  },
  {
    slot: "cm-stilt-village",
    title: "Sea Gypsies Village, Pulau Tetagan, Southwest of Pulau Bodgaya, Tun Sakaran Marine Park, Sabah.jpg",
    author: "Fabio Achilli",
    licence: "CC BY 2.0",
    licenceUrl: "https://creativecommons.org/licenses/by/2.0",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Sea_Gypsies_Village,_Pulau_Tetagan,_Southwest_of_Pulau_Bodgaya,_Tun_Sakaran_Marine_Park,_Sabah.jpg",
    alt: { bm: "Perkampungan atas air dengan rumah kayu beratap rumbia dan tangga menuruni ke laut.", en: "A stilt village of timber houses with thatched roofs and ladders down to the sea." },
  },
  {
    slot: "cm-semporna-town",
    title: "Semporna Sabah Kampung-Balimbang-Asal-01.jpg",
    author: "CEphoto, Uwe Aranas",
    licence: "CC BY-SA 3.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Semporna_Sabah_Kampung-Balimbang-Asal-01.jpg",
    alt: { bm: "Pandangan ke arah Semporna dari air, dengan bangunan tepi laut dan gunung di ufuk.", en: "A view towards Semporna from the water, with the shoreline buildings and a peak on the horizon." },
  },
  {
    slot: "cm-white-beach",
    title: "Mataking Island Sabah.jpg",
    author: "Angah hfz",
    licence: "CC BY-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Mataking_Island_Sabah.jpg",
    alt: { bm: "Pantai pasir putih dengan air pirus cerah, dahan kayu hanyut di pasir dan pulau jauh di ufuk.", en: "A white sand beach with bright turquoise water, driftwood on the sand and a distant island." },
  },
  {
    slot: "cm-sipadan-wall",
    title: "Beneath Sipadan Island.jpeg",
    author: "Johnny Chen",
    licence: "CC0",
    licenceUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Beneath_Sipadan_Island.jpeg",
    alt: { bm: "Tebing karang menegak dilihat dari bawah air, dengan pancaran cahaya matahari menembusi air biru.", en: "A vertical reef wall seen underwater, with shafts of sunlight coming down through blue water." },
  },
  {
    slot: "cm-turtle",
    title: "Green Turtle (Chelonia mydas) (6133097542).jpg",
    author: "Bernard DUPONT from FRANCE",
    licence: "CC BY-SA 2.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/2.0",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Green_Turtle_(Chelonia_mydas)_(6133097542).jpg",
    alt: { bm: "Penyu hijau berenang perlahan di atas karang.", en: "A green sea turtle swimming slowly above the reef." },
  },
  {
    slot: "cm-jackfish",
    title: "Jack fish and reef sharks.jpg",
    author: "Avoini",
    licence: "CC BY-SA 3.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Jack_fish_and_reef_sharks.jpg",
    alt: { bm: "Kumpulan besar ikan jack berpusing rapat di air biru, dengan yu karang di antaranya.", en: "A large school of jack fish turning tightly in blue water, with reef sharks among them." },
  },
  {
    slot: "cm-reef-shark",
    title: "Reef shark beneath a school of jack fish.jpg",
    author: "Avoini",
    licence: "CC BY-SA 3.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Reef_shark_beneath_a_school_of_jack_fish.jpg",
    alt: { bm: "Yu karang berenang di bawah kumpulan ikan jack yang padat.", en: "A reef shark swimming beneath a dense school of jack fish." },
  },
  {
    slot: "cm-reef-fish",
    title: "Anchor Tuskfish, Sipadan Island, Malaysia imported from iNaturalist photo 60922931.jpg",
    author: "(c) Kai Squires, some rights reserved (CC BY)",
    licence: "CC BY 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by/4.0",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Anchor_Tuskfish,_Sipadan_Island,_Malaysia_imported_from_iNaturalist_photo_60922931.jpg",
    alt: { bm: "Ikan karang berwarna hijau dan kuning berhampiran dasar berkarang.", en: "A green and yellow reef fish close to the coral bottom." },
  },
  {
    slot: "cm-wrasse",
    title: "Blue-headed Wrasse, Thalassoma amblycephalum, Kapalai, Sabah, Malaysia imported from iNaturalist photo 396387479.jpg",
    author: "(c) portioid, some rights reserved (CC BY-SA)",
    licence: "CC BY-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Blue-headed_Wrasse,_Thalassoma_amblycephalum,_Kapalai,_Sabah,_Malaysia_imported_from_iNaturalist_photo_396387479.jpg",
    alt: { bm: "Ikan wrasse kecil di antara karang keras dan lembut.", en: "A small wrasse among hard and soft coral." },
  },
  {
    slot: "cm-bubble-coral",
    title: "Acoel Flatworms (Waminoa sp.) on Bubble Coral (Plerogyra sinuosa) - Panglima, Pulau Mabul, Sabah, Malaysia.jpg",
    author: "Bernard DUPONT from FRANCE",
    licence: "CC BY-SA 2.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/2.0",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Acoel_Flatworms_(Waminoa_sp.)_on_Bubble_Coral_(Plerogyra_sinuosa)_-_Panglima,_Pulau_Mabul,_Sabah,_Malaysia.jpg",
    alt: { bm: "Karang gelembung dilihat dekat, permukaannya bulat dan lut sinar.", en: "Bubble coral seen close up, its surface round and translucent." },
  },
];

/** Look up one credit by slot. */
export function credit(slot: ImageSlot): PhotoCredit | undefined {
  return PHOTO_CREDITS.find((c) => c.slot === slot);
}

/**
 * Alt text for a credited photo. Throws at BUILD time if the slot is unknown,
 * so a free-licence image can never ship without both an alt string and an
 * attribution row.
 */
export function creditAlt(slot: ImageSlot, lang: Lang): string {
  const c = credit(slot);
  if (!c) throw new Error(`[photo-credits] no credit recorded for slot "${slot}"`);
  return c.alt[lang];
}
