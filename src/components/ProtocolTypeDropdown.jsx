import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";

import { Landmark, Vote, Archive, Users } from "lucide-react";

const protocolTypes = [
  { value: "Civic", label: "Civic Protocol", icon: Landmark },
  { value: "Political", label: "Political Protocol", icon: Vote },
  { value: "News", label: "Archive Protocol", icon: Archive },
  { value: "Social", label: "Connect Protocol", icon: Users },
];


export const ProtocolTypeDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [rect, setRect] = useState(null);

  const updatePosition = useCallback(() => {
    if (triggerRef.current) {
      setRect(triggerRef.current.getBoundingClientRect());
    }
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !triggerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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

  const current = protocolTypes.find((t) => t.value === value);

  return (
    <div className="space-y-2">
      <label className="text-[12px] font-medium text-slate-500 ml-1">
        Protocol Type
      </label>

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`
          w-full flex items-center justify-between gap-2
          bg-slate-950/50 border rounded-lg px-4 py-3
          text-[11px] font-bold transition-all
          ${
            open
              ? "border-primary-500 ring-2 ring-primary-500/20"
              : "border-white/10 hover:border-white/20"
          }
          text-white
        `}
      >
        <div className="flex items-center gap-2 truncate">
          {current && <current.icon className="w-4 h-4 text-primary-400" />}
          <span>{current?.label || "Select Protocol"}</span>
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
            <div className="bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
              <div className="p-1">
                {protocolTypes.map((item) => {
                  const Icon = item.icon;
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
                        ${
                          isSelected
                            ? "bg-primary-600/10 text-primary-400"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </div>
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
