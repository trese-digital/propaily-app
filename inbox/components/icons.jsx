// Icons — minimal stroke, 24px viewBox, currentColor
// Designed to feel tech (Linear-like): 1.6 stroke, round joins, square caps where useful.

const Ic = ({ children, size = 18, stroke = 1.6, style = {}, ...rest }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'block', flex: '0 0 auto', ...style }}
    {...rest}
  >
    {children}
  </svg>
);

const IcMap        = (p) => <Ic {...p}><path d="M9 3 3 5v16l6-2 6 2 6-2V3l-6 2-6-2Z"/><path d="M9 3v16M15 5v16"/></Ic>;
const IcBuilding   = (p) => <Ic {...p}><rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M9 8h.01M15 8h.01M9 12h.01M15 12h.01M9 16h.01M15 16h.01"/></Ic>;
const IcChart      = (p) => <Ic {...p}><path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/></Ic>;
const IcCalc       = (p) => <Ic {...p}><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h6M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/></Ic>;
const IcDoc        = (p) => <Ic {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></Ic>;
const IcUsers      = (p) => <Ic {...p}><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4a3.5 3.5 0 0 1 0 7"/><path d="M22 20a6.5 6.5 0 0 0-5-6.3"/></Ic>;
const IcSearch     = (p) => <Ic {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></Ic>;
const IcSettings   = (p) => <Ic {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.36.16.7.39 1 .7"/></Ic>;
const IcBell       = (p) => <Ic {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></Ic>;
const IcPlus       = (p) => <Ic {...p}><path d="M12 5v14M5 12h14"/></Ic>;
const IcFilter     = (p) => <Ic {...p}><path d="M3 5h18l-7 9v5l-4 2v-7L3 5Z"/></Ic>;
const IcGrid       = (p) => <Ic {...p}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></Ic>;
const IcList       = (p) => <Ic {...p}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></Ic>;
const IcChevR      = (p) => <Ic {...p}><path d="m9 6 6 6-6 6"/></Ic>;
const IcChevD      = (p) => <Ic {...p}><path d="m6 9 6 6 6-6"/></Ic>;
const IcArrowUR    = (p) => <Ic {...p}><path d="M7 17 17 7M9 7h8v8"/></Ic>;
const IcPin        = (p) => <Ic {...p}><path d="M12 21s-7-7-7-12a7 7 0 0 1 14 0c0 5-7 12-7 12Z"/><circle cx="12" cy="9" r="2.5"/></Ic>;
const IcLayers     = (p) => <Ic {...p}><path d="m12 2 10 6-10 6L2 8l10-6Z"/><path d="m2 16 10 6 10-6"/><path d="m2 12 10 6 10-6"/></Ic>;
const IcCmd        = (p) => <Ic {...p}><path d="M9 6a3 3 0 1 0-3 3h3V6Zm0 0v12m0 0a3 3 0 1 1-3-3h3v3Zm0 0h6m0 0a3 3 0 1 0 3-3h-3v3Zm0 0V6m0 0a3 3 0 1 1 3 3h-3V6Z"/></Ic>;
const IcDownload   = (p) => <Ic {...p}><path d="M12 4v12m0 0-4-4m4 4 4-4M4 18v2h16v-2"/></Ic>;
const IcEdit       = (p) => <Ic {...p}><path d="M4 20h4l10-10-4-4L4 16v4Z"/><path d="m14 6 4 4"/></Ic>;
const IcMore       = (p) => <Ic {...p}><circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/></Ic>;
const IcArrowR     = (p) => <Ic {...p}><path d="M5 12h14M13 6l6 6-6 6"/></Ic>;
const IcShield     = (p) => <Ic {...p}><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/></Ic>;
const IcSpark      = (p) => <Ic {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></Ic>;
const IcCheck      = (p) => <Ic {...p}><path d="m5 12 5 5 9-11"/></Ic>;
const IcX          = (p) => <Ic {...p}><path d="M6 6 18 18M6 18 18 6"/></Ic>;
const IcPhoto      = (p) => <Ic {...p}><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m3 18 5-5 4 4 3-3 6 6"/></Ic>;
const IcKey        = (p) => <Ic {...p}><circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M16 7l3 3M14 9l3 3"/></Ic>;
const IcArrowUp    = (p) => <Ic {...p}><path d="M12 19V5M5 12l7-7 7 7"/></Ic>;
const IcArrowDown  = (p) => <Ic {...p}><path d="M12 5v14M5 12l7 7 7-7"/></Ic>;

Object.assign(window, {
  Ic, IcMap, IcBuilding, IcChart, IcCalc, IcDoc, IcUsers, IcSearch, IcSettings, IcBell,
  IcPlus, IcFilter, IcGrid, IcList, IcChevR, IcChevD, IcArrowUR, IcPin, IcLayers, IcCmd,
  IcDownload, IcEdit, IcMore, IcArrowR, IcShield, IcSpark, IcCheck, IcX, IcPhoto, IcKey,
  IcArrowUp, IcArrowDown,
});
