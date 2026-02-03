import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check, Clock } from "lucide-react";

const durationUnits = [
  { value: "minutes", label: "Minutes" },
  { value: "hours", label: "Hours" },
  { value: "days", label: "Days" },
  { value: "months", label: "Months" },
  { value: "years", label: "Years" },
];


export const PollDurationDropdown = ({
  value,
  onChange,
  durationValue,
  setDurationValue,
}) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [rect, setRect] = useState(null);

  const updatePosition = useCallback(() => {
    if (triggerRef.current) {
      setRect(triggerRef.current.getBoundingClientRect());
    }
  }, []);

  // close on outside click
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

  // reposition on scroll / resize
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

  const current = durationUnits.find((d) => d.value === value);

  return (
    <div className="space-y-2">
      <label className="text-[12px] font-medium text-slate-500 ml-1">
        Poll Duration
      </label>

      {/* Trigger */}
      <div className="flex gap-2">
        <input
          type="number"
          min="1"
          value={durationValue}
          onChange={(e) => setDurationValue(e.target.value)}
          className="w-20 bg-slate-950/50 border border-white/10 rounded-lg px-3 py-2 text-[12px] text-white focus:outline-none focus:border-primary-500/50 transition-all font-medium"
        />

        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((p) => !p)}
          className={`
            flex-1 flex items-center justify-between gap-2
            bg-slate-950/50 border rounded-lg px-4 py-2
            text-[12px] transition-all
            ${open
              ? "border-primary-500 ring-2 ring-primary-500/20"
              : "border-white/10 hover:border-white/20"
            }
            text-white
          `}
        >
          <div className="flex items-center gap-2 truncate">
            <Clock className="w-4 h-4 text-primary-400" />
            <span>{current?.label || "Select unit"}</span>
          </div>

          <ChevronDown
            className={`w-4 h-4 text-slate-500 transition-transform ${open ? "rotate-180" : ""
              }`}
          />
        </button>
      </div>

      {/* Dropdown */}
      {open &&
        rect &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-[999]"
            style={{
              top: rect.bottom + 8,
              left: rect.left + 80, // aligns under dropdown button (after number input)
              width: rect.width - 80,
            }}
          >
            <div className="bg-slate-900 border border-white/10 rounded-lg shadow-2xl overflow-hidden">
              <div className="p-1">
                {durationUnits.map((item) => {
                  const isSelected = value === item.value;

                  return (
                    <button
                      key={item.value}
                      onClick={() => {
                        onChange(item.value);
                        setOpen(false);
                      }}
                      className={`
                        w-full flex items-center justify-between
                        px-3 py-2 rounded-md text-[12px] transition-colors
                        ${isSelected
                          ? "bg-primary-600/10 text-primary-400"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }
                      `}
                    >
                      <span>{item.label}</span>
                      {isSelected && <Check className="w-4 h-4" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
