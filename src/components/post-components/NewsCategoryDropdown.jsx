import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  ChevronDown,
  Check,
  Newspaper,
  Landmark,
  Building2,
  Vote,
} from "lucide-react";

const categories = [
  { value: "General", label: "General", icon: Newspaper },
  { value: "Civic", label: "Civic", icon: Landmark },
  { value: "Development", label: "Development", icon: Building2 },
  { value: "Politics", label: "Politics", icon: Vote },
];

export const NewsCategoryDropdown = ({ category, setCategory }) => {
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

  // 🔥 Reposition on scroll & resize
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

  const current = categories.find((c) => c.value === category);

  return (
    <div className="space-y-2">
      <label className="text-[12px] font-medium text-slate-500 ml-1">
        Post Category
      </label>

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`
          flex justify-between items-center gap-3 w-full
          bg-slate-950/50 border rounded-lg px-4 py-3
          text-[12px] font-medium transition-all
          ${open
            ? "border-primary-500 ring-2 ring-primary-500/20"
            : "border-slate-700 hover:border-slate-500"
          }
          text-slate-200
        `}
      >
        <div className="flex items-center gap-2 truncate">
          {current && <current.icon className="w-4 h-4 text-primary-400" />}
          <span className="truncate">
            {current?.label || "Select category"}
          </span>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-slate-500 transition-transform ${open ? "rotate-180" : ""
            }`}
        />
      </button>

      {open &&
        rect &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-99"
            style={{
              top: rect.bottom + 8,
              left: rect.left,
              width: rect.width,
            }}
          >
            <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden">
              <div className="p-1 max-h-72 overflow-y-auto custom-scrollbar">
                <div className="px-3 py-2 text-[12px] text-slate-500">
                  Select category
                </div>

                {categories.map((item) => {
                  const Icon = item.icon;
                  const isSelected = category === item.value;

                  return (
                    <button
                      key={item.value}
                      onClick={() => {
                        setCategory(item.value);
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
                      <div className="flex items-center gap-2 truncate">
                        <Icon className="w-4 h-4" />
                        <span className="truncate">{item.label}</span>
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
