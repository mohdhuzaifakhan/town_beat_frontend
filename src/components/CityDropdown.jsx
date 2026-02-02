import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { MapPin, ChevronDown, Check } from "lucide-react";


const cities = [
  "All Cities (Uttar Pradesh)",
  "Lucknow",
  "Kanpur",
  "Varanasi",
  "Agra",
  "Prayagraj",
  "Ghaziabad",
  "Noida",
  "Meerut",
  "Bareilly",
  "Aligarh",
  "Moradabad",
  "Rampur",
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Ahmedabad",
  "Chennai",
  "Kolkata",
  "Surat",
  "Pune",
  "Jaipur",
];


export const CityDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [rect, setRect] = useState(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    setRect(triggerRef.current.getBoundingClientRect());
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Reposition on scroll & resize
  useEffect(() => {
    if (!open) return;

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, updatePosition]);

  return (
    <div className="space-y-1.5">
      <label className="text-xs text-slate-400 ml-1">City</label>

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`
          w-full flex items-center justify-between
          bg-slate-950/50 border rounded-lg px-4 py-3
          text-[12px] transition-all border-white/10
          ${
            open
              ? "border-primary-500 ring-2 ring-primary-500/20"
              : "border-slate-700 hover:border-slate-500"
          }
          text-slate-200
        `}
      >
        <div className="flex items-center gap-2 truncate">
          <MapPin className="w-4 h-4 text-primary-400" />
          <span className="truncate">{value || "Select city"}</span>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-slate-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open &&
        rect &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-[999]"
            style={{
              top: rect.bottom + 8,
              left: rect.left,
              width: rect.width,
            }}
          >
            <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
              {/* 👇 max-h ≈ 8 items */}
              <div className="max-h-[320px] overflow-y-auto custom-scrollbar p-1">
                <div className="px-3 py-2 text-[11px] font-semibold uppercase text-slate-500">
                  Select City
                </div>

                {cities.map((city) => {
                  const isSelected = value === city;

                  return (
                    <button
                      key={city}
                      onClick={() => {
                        onChange(city);
                        setOpen(false);
                      }}
                      className={`
                        w-full flex items-center justify-between
                        px-3 py-2 rounded-md text-sm transition-colors
                        ${
                          isSelected
                            ? "bg-primary-600/10 text-primary-400"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }
                      `}
                    >
                      <span className="truncate">{city}</span>
                      {isSelected && <Check className="w-4 h-4" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};
