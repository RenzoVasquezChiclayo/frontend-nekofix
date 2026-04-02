"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { CartLine } from "@/types/order";

const STORAGE_KEY = "nekofix-cart-v2";

type CartState = { lines: CartLine[] };

type Action =
  | { type: "ADD"; line: CartLine }
  | {
      type: "REMOVE";
      productId: string;
      color?: string | null;
      storage?: string | null;
      condition?: CartLine["condition"];
    }
  | {
      type: "SET_QTY";
      productId: string;
      quantity: number;
      color?: string | null;
      storage?: string | null;
      condition?: CartLine["condition"];
    }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; lines: CartLine[] };

function lineKey(p: {
  productId: string;
  color?: string | null;
  storage?: string | null;
  condition?: CartLine["condition"];
}): string {
  return [p.productId, p.color ?? "", p.storage ?? "", p.condition ?? ""].join("::");
}

function cartReducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { lines: action.lines };
    case "CLEAR":
      return { lines: [] };
    case "ADD": {
      const idx = state.lines.findIndex(
        (l) => lineKey(l) === lineKey(action.line)
      );
      if (idx === -1) {
        return { lines: [...state.lines, action.line] };
      }
      const next = [...state.lines];
      next[idx] = {
        ...next[idx],
        quantity: next[idx].quantity + action.line.quantity,
      };
      return { lines: next };
    }
    case "REMOVE":
      return {
        lines: state.lines.filter(
          (l) =>
            !(
              l.productId === action.productId &&
              (l.color ?? "") === (action.color ?? "") &&
              (l.storage ?? "") === (action.storage ?? "") &&
              l.condition === (action.condition ?? l.condition)
            )
        ),
      };
    case "SET_QTY": {
      const idx = state.lines.findIndex(
        (l) =>
          l.productId === action.productId &&
          (l.color ?? "") === (action.color ?? "") &&
          (l.storage ?? "") === (action.storage ?? "") &&
          l.condition === (action.condition ?? l.condition)
      );
      if (idx === -1) return state;
      if (action.quantity <= 0) {
        const lines = state.lines.filter((_, i) => i !== idx);
        return { lines };
      }
      const next = [...state.lines];
      next[idx] = { ...next[idx], quantity: action.quantity };
      return { lines: next };
    }
    default:
      return state;
  }
}

type CartContextValue = CartState & {
  addLine: (line: CartLine) => void;
  removeLine: (p: {
    productId: string;
    color?: string | null;
    storage?: string | null;
    condition?: CartLine["condition"];
  }) => void;
  setQuantity: (p: {
    productId: string;
    quantity: number;
    color?: string | null;
    storage?: string | null;
    condition?: CartLine["condition"];
  }) => void;
  clear: () => void;
  subtotal: number;
  itemCount: number;
};

const CartContext = createContext<CartContextValue | null>(null);

function parseHydratedLines(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((item): item is CartLine => {
    if (!item || typeof item !== "object") return false;
    const o = item as Record<string, unknown>;
    return (
      typeof o.productId === "string" &&
      typeof o.slug === "string" &&
      typeof o.name === "string" &&
      typeof o.unitPrice === "number" &&
      typeof o.quantity === "number" &&
      typeof o.condition === "string"
    );
  });
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { lines: [] });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = parseHydratedLines(JSON.parse(raw));
        if (parsed.length) dispatch({ type: "HYDRATE", lines: parsed });
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
    } catch {
      /* ignore */
    }
  }, [state.lines]);

  const addLine = useCallback((line: CartLine) => {
    dispatch({ type: "ADD", line });
  }, []);

  const removeLine = useCallback(
    (p: {
      productId: string;
      color?: string | null;
      storage?: string | null;
      condition?: CartLine["condition"];
    }) => {
      dispatch({ type: "REMOVE", ...p });
    },
    []
  );

  const setQuantity = useCallback(
    (p: {
      productId: string;
      quantity: number;
      color?: string | null;
      storage?: string | null;
      condition?: CartLine["condition"];
    }) => {
      dispatch({ type: "SET_QTY", ...p });
    },
    []
  );

  const clear = useCallback(() => dispatch({ type: "CLEAR" }), []);

  const subtotal = useMemo(
    () => state.lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0),
    [state.lines]
  );

  const itemCount = useMemo(
    () => state.lines.reduce((s, l) => s + l.quantity, 0),
    [state.lines]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      ...state,
      addLine,
      removeLine,
      setQuantity,
      clear,
      subtotal,
      itemCount,
    }),
    [state, addLine, removeLine, setQuantity, clear, subtotal, itemCount]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
