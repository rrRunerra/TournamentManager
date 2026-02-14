import { Utils } from "uu5g05";
import lsiEn from "./en.json";
import lsiCz from "./cz.json";
import lsiSk from "./sk.json";
import lsiJa from "./ja.json";
import lsiZh from "./zh.json";
import lsiRu from "./ru.json";
import lsiDe from "./de.json";
import lsiPl from "./pl.json";
import lsiHu from "./hu.json";

const libraryCode = "uu_ritr_maing01-hi";

const importLsi = (lang) => import(`./${lang}.json`);
importLsi.libraryCode = libraryCode;

Utils.Lsi.setDefaultLsi(libraryCode, {
  gb: lsiEn,
  cz: lsiCz,
  sk: lsiSk,
  jp: lsiJa,
  zh: lsiZh,
  ru: lsiRu,
  de: lsiDe,
  pl: lsiPl,
  hu: lsiHu,
});

export default importLsi;
