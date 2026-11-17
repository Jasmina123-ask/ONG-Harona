import { useState } from "react";
import { FaDroplet, FaBaby, FaBowlFood, FaMobileScreenButton, FaLaptopMedical } from "react-icons/fa6";
import { MdPregnantWoman } from "react-icons/md";
import { Download, ExternalLink, X } from "lucide-react";
import person from "../../assets/images/taranaka/person.png";
import word from "../../assets/images/taranaka/word.png";
import deco from "../../assets/images/taranaka/deco.jpeg";
import logo_madarom from "../../../public/logo_madarom.png";

const BORDEAUX = "#8B1D34";
const CREAM = "#FBF5EE";
const GREEN = "#3D6B24";
const ICON_BG = "#FAE6D2";
const ICON_COLOR = "#830B27";
const WEB_URL = "https://taranaka-web-production.up.railway.app";
const APK_URL = "https://www.madarom.net/download/Taranaka.apk";

const FEATURES = [
  { Icon: FaDroplet, size: 22, label: "Menstrual health" },
  { Icon: MdPregnantWoman, size: 28, label: "Pregnancy" },
  { Icon: FaBaby, size: 22, label: "Child health" },
  { Icon: FaBowlFood, size: 22, label: "Nutrition" },
];

const ACTION_CARD = "rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2 text-white";
const ACTION_BTN =
  "w-full whitespace-nowrap flex items-center justify-center gap-1 bg-white font-bold text-xs py-1.5 rounded-full transition-transform hover:scale-[1.03]";

export default function Taranaka({ onClose }) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    const link = document.createElement("a");
    link.href = APK_URL;
    link.download = "Taranaka.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setClicked(false), 1500);
  };

  return (
    <div className="w-full flex items-center justify-center p-2.5 sm:p-4">
      <style>{`
        @keyframes taranakaSlideDown {
          from { opacity: 0; transform: translateY(-120px); }
          to { opacity: 2; transform: translateY(0); }
        }
        .taranaka-slide-down { animation: taranakaSlideDown 4s cubic-bezier(0.20, 1, 0.36, 1) both; }
        @media (prefers-reduced-motion: reduce) { .taranaka-slide-down { animation: none; } }
      `}</style>
      <div
        className="taranaka-slide-down [zoom:0.384] sm:[zoom:0.48] w-[min(756px,calc(100vw/0.384_-_5rem))] sm:w-[min(772px,calc(100vw/0.48_-_5rem))] rounded-[1.25rem] shadow-2xl border-2 border-white/90 p-4 sm:p-6 flex flex-col gap-4 sm:gap-5"
        style={{ backgroundColor: CREAM }}
      >
        {/* 1. En-tête */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <img src={logo_madarom} alt="Logo Madarom" className="w-44 sm:w-56 object-contain" />
            <span className="text-2xl sm:text-3xl font-bold uppercase leading-none whitespace-nowrap" style={{ color: GREEN }}>
              presents
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="shrink-0 w-12 h-12 bg-white hover:bg-stone-100 rounded-full flex items-center justify-center shadow-md text-stone-900 transition-transform hover:scale-105 cursor-pointer"
          >
            <X size={24} strokeWidth={2.75} />
          </button>
        </div>

        {/* 2. Grande image */}
        <img src={deco} alt="Mère et enfant" className="w-180 h-165 rounded-xl" />

        {/* 3. person + word */}
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          <img src={person} alt="Icône mère et enfant" className="h-16 sm:h-20 lg:h-24 w-auto object-contain" />
          <img src={word} alt="Taranaka" className="h-16 sm:h-20 lg:h-24 w-auto max-w-[65%] object-contain" />
        </div>

        {/* 4. Textes */}
        <div className="text-center">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold leading-snug" style={{ color: BORDEAUX }}>
            Empowering Women, Nurturing Healthier Generations
          </h2>
          <p className="mt-1 text-sm sm:text-base text-stone-500">A digital health initiative by Mad'arom</p>
        </div>

        {/* 5. Fonctionnalités */}
        <div className="[zoom:1.44] grid grid-cols-4 gap-2 sm:gap-3">
          {FEATURES.map(({ Icon, size, label }) => (
            <div key={label} className="flex flex-col items-center text-center">
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl shadow-[0_1px_3px_rgba(131,11,39,0.12)] flex items-center justify-center"
                style={{ backgroundColor: ICON_BG }}
              >
                <Icon size={size} style={{ color: ICON_COLOR }} />
              </div>
              <span className="mt-1.5 text-[11px] sm:text-xs font-bold text-[#231815] leading-tight">{label}</span>
            </div>
          ))}
        </div>

        {/* 6. Boutons d'action */}
        <div className="[zoom:1.44] grid grid-cols-2 gap-2 sm:gap-3">
          <div
            className={`${ACTION_CARD} shadow-[0_3px_8px_rgba(139,29,52,0.35)]`}
            style={{ backgroundColor: BORDEAUX }}
          >
            <FaMobileScreenButton className="text-2xl sm:text-3xl" />
            <p className="font-bold text-base sm:text-xl leading-tight">Taranaka mobile App</p>
            <p>for girls, mothers & families</p>
            <button
              onClick={handleClick}
              title="Télécharger l'application (APK)"
              aria-label="Télécharger l'application (APK)"
              className={`${ACTION_BTN} cursor-pointer`}
              style={{ color: BORDEAUX }}
            >
              <span>Download App</span>
              <span className={`flex items-center justify-center ${clicked ? "dance" : "jump"}`}>
                <Download size={14} />
              </span>
            </button>
          </div>

          <a
            href={WEB_URL}
            className={`${ACTION_CARD} shadow-[0_3px_8px_rgba(47,95,30,0.35)] cursor-pointer`}
            style={{ backgroundColor: GREEN }}
          >
            <FaLaptopMedical className="text-2xl sm:text-3xl" />
            <p className="font-bold text-base sm:text-xl leading-tight">Taranaka web platform</p>
            <p>For CSB, CRENI & health pofessionals </p>
            <span className={ACTION_BTN} style={{ color: BORDEAUX }}>
              <span>Access Web</span>
              <ExternalLink size={13} />
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
