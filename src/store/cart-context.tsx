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

const STORAGE_KEY = "nekofix-cart";

type CartState = { lines: CartLine[] };

type Action =
  | { type: "ADD"; line: CartLine }
  | { type: "REMOVE"; productId: string; color?: string; storageGb?: number }
  | { type: "SET_QTY"; productId: string; quantity: number; color?: string; storageGb?: number }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; lines: CartLine[] };

function lineKey(p: {
  productId: string;
  color?: string;
  storageGb?: number;
}): string {
  return [p.productId, p.color ?? "", p.storageGb ?? ""].join("::");
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
              (l.storageGb ?? 0) === (action.storageGb ?? 0)
            )
        ),
      };
    case "SET_QTY": {
      const idx = state.lines.findIndex(
        (l) =>
          l.productId === action.productId &&
          (l.color ?? "") === (action.color ?? "") &&
          (l.storageGb ?? 0) === (action.storageGb ?? 0)
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
    color?: string;
    storageGb?: number;
  }) => void;
  setQuantity: (p: {
    productId: string;
    quantity: number;
    color?: string;
    storageGb?: number;
  }) => void;
  clear: () => void;
  subtotal: number;
  itemCount: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { lines: [] });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        if (Array.isArray(parsed)) dispatch({ type: "HYDRATE", lines: parsed });
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
    (p: { productId: string; color?: string; storageGb?: number }) => {
      dispatch({ type: "REMOVE", ...p });
    },
    []
  );

  const setQuantity = useCallback(
    (p: {
      productId: string;
      quantity: number;
      color?: string;
      storageGb?: number;
    }) => {
      dispatch({ type: "SET_QTY", ...p });
    },
    []
  );

  const clear = useCallback(() => dispatch({ type: "CLEAR" }), []);

  const subtotal = useMemo(
    () =>
      state.lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0),
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
    [
      state,
      addLine,
      removeLine,
      setQuantity,
      clear,
      subtotal,
      itemCount,
    ]
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
