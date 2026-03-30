import { Star, Utensils, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { UserLocation } from "../App";

const FOODS = [
  {
    type: "restaurant",
    name: "The Golden Fork",
    cuisine: "Continental",
    rating: 4.7,
    dist: "0.3 km",
    price: "$$",
    emoji: "🍴",
  },
  {
    type: "cafe",
    name: "Bean & Brew Cafe",
    cuisine: "Coffee & Snacks",
    rating: 4.5,
    dist: "0.5 km",
    price: "$",
    emoji: "☕",
  },
  {
    type: "restaurant",
    name: "Sakura Ramen",
    cuisine: "Japanese",
    rating: 4.8,
    dist: "0.7 km",
    price: "$$",
    emoji: "🍜",
  },
  {
    type: "fast_food",
    name: "Burger Palace",
    cuisine: "American",
    rating: 4.2,
    dist: "0.4 km",
    price: "$",
    emoji: "🍔",
  },
  {
    type: "street",
    name: "Street Taco King",
    cuisine: "Mexican",
    rating: 4.6,
    dist: "0.2 km",
    price: "$",
    emoji: "🌮",
  },
  {
    type: "restaurant",
    name: "Naan & Curry House",
    cuisine: "Indian",
    rating: 4.4,
    dist: "0.9 km",
    price: "$$",
    emoji: "🍛",
  },
  {
    type: "cafe",
    name: "Artisan Bakehouse",
    cuisine: "Bakery",
    rating: 4.9,
    dist: "0.6 km",
    price: "$",
    emoji: "🥐",
  },
  {
    type: "fast_food",
    name: "Pizza Express",
    cuisine: "Italian",
    rating: 4.3,
    dist: "1.1 km",
    price: "$$",
    emoji: "🍕",
  },
];

const CATEGORIES = ["all", "restaurant", "cafe", "fast_food", "street"];

const CATEGORY_LABELS: Record<string, string> = {
  all: "All",
  restaurant: "Restaurants",
  cafe: "Cafes",
  fast_food: "Fast Food",
  street: "Street Food",
};

interface Props {
  userLocation: UserLocation | null;
  onClose: () => void;
}

export default function FoodPanel({ onClose }: Props) {
  const [active, setActive] = useState("all");
  const filtered =
    active === "all" ? FOODS : FOODS.filter((f) => f.type === active);

  return (
    <div
      className="absolute top-0 left-0 bottom-0 z-[1001] flex flex-col overflow-hidden"
      style={{
        width: "360px",
        background: "rgba(11,15,20,0.95)",
        backdropFilter: "blur(16px)",
        borderRight: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center gap-2">
          <Utensils size={16} style={{ color: "#F2A23A" }} />
          <span className="font-semibold text-sm" style={{ color: "#E8EEF6" }}>
            Food Discovery
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <X size={14} style={{ color: "#A7B3C2" }} />
        </button>
      </div>

      <div
        className="flex gap-1.5 px-4 py-3 overflow-x-auto"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        {CATEGORIES.map((cat) => (
          <button
            type="button"
            key={cat}
            onClick={() => setActive(cat)}
            className="px-3 py-1.5 rounded-full text-[11px] font-medium shrink-0 transition-colors"
            style={{
              background:
                active === cat
                  ? "rgba(242,162,58,0.15)"
                  : "rgba(255,255,255,0.05)",
              color: active === cat ? "#F2A23A" : "#A7B3C2",
              border:
                active === cat
                  ? "1px solid rgba(242,162,58,0.3)"
                  : "1px solid transparent",
            }}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2">
        {filtered.map((f) => (
          <div key={f.name} className="glass-card p-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ background: "rgba(242,162,58,0.1)" }}
              >
                {f.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-semibold truncate"
                  style={{ color: "#E8EEF6" }}
                >
                  {f.name}
                </p>
                <p className="text-xs" style={{ color: "#6F7C8D" }}>
                  {f.cuisine}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className="flex items-center gap-0.5 text-[11px]"
                    style={{ color: "#F2A23A" }}
                  >
                    <Star size={9} fill="#F2A23A" />
                    {f.rating}
                  </span>
                  <span className="text-[11px]" style={{ color: "#6F7C8D" }}>
                    {f.dist}
                  </span>
                  <span className="text-[11px]" style={{ color: "#4AA3FF" }}>
                    {f.price}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toast.info("Redirecting to order...")}
                className="px-3 py-1.5 rounded-lg text-[11px] font-semibold shrink-0"
                style={{ background: "#4AA3FF", color: "#0B0F14" }}
              >
                Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
