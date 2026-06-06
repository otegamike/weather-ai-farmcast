"use client";

import { useState, useEffect, useReducer, useRef, useCallback, type FormEvent } from "react";
import type { Suggestion } from "@/hooks/useWeatherSearch";
import SearchIcon from "@/components/ui/icons/SearchIcon";
import styles from "./SearchInput.module.css";

function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 0x1F1E6 + char.charCodeAt(0) - 65);
  return String.fromCodePoint(...codePoints);
}

interface SearchInputProps {
  suggestions: Suggestion[];
  isSearching: boolean;
  onSearch: (query: string) => void;
  onSelectSuggestion: (suggestion: Suggestion) => void;
  isLoading?: boolean;
}

type DDState = { open: boolean; focused: number };
type DDAction =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "FOCUS_DOWN"; max: number }
  | { type: "FOCUS_UP"; max: number }
  | { type: "RESET_FOCUS" };

function ddReducer(state: DDState, action: DDAction): DDState {
  switch (action.type) {
    case "OPEN":
      return { ...state, open: true };
    case "CLOSE":
      return { open: false, focused: -1 };
    case "FOCUS_DOWN":
      return { ...state, focused: state.focused < action.max ? state.focused + 1 : 0 };
    case "FOCUS_UP":
      return { ...state, focused: state.focused > 0 ? state.focused - 1 : action.max };
    case "RESET_FOCUS":
      return { ...state, focused: -1 };
    default:
      return state;
  }
}

export default function SearchInput({
  suggestions,
  isSearching,
  onSearch,
  onSelectSuggestion,
  isLoading,
}: SearchInputProps) {
  const [value, setValue] = useState("");
  const [ddState, ddDispatch] = useReducer(ddReducer, { open: false, focused: -1 });
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch(value);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, onSearch]);

  useEffect(() => {
    if (suggestions.length > 0) {
      ddDispatch({ type: "OPEN" });
    }
    ddDispatch({ type: "RESET_FOCUS" });
  }, [suggestions]);

  const selectIndex = useCallback(
    (idx: number) => {
      const s = suggestions[idx];
      if (s) {
        setValue(s.name);
        ddDispatch({ type: "CLOSE" });
        onSelectSuggestion(s);
      }
    },
    [suggestions, onSelectSuggestion]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!ddState.open) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        ddDispatch({ type: "FOCUS_DOWN", max: suggestions.length - 1 });
        break;
      case "ArrowUp":
        e.preventDefault();
        ddDispatch({ type: "FOCUS_UP", max: suggestions.length - 1 });
        break;
      case "Enter":
        e.preventDefault();
        if (ddState.focused >= 0) {
          selectIndex(ddState.focused);
        } else if (value.trim()) {
          onSearch(value.trim());
        }
        break;
      case "Escape":
        ddDispatch({ type: "CLOSE" });
        inputRef.current?.blur();
        break;
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (ddState.focused >= 0) {
      selectIndex(ddState.focused);
    } else if (suggestions.length > 0) {
      selectIndex(0);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputWrapper}>
        <input
          ref={inputRef}
          type="text"
          className={styles.input}
          placeholder="Enter city or zip code"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => ddDispatch({ type: "CLOSE" }), 200)}
          onFocus={() => suggestions.length > 0 && ddDispatch({ type: "OPEN" })}
          autoComplete="off"
        />
        <button
          type="submit"
          className={styles.button}
          disabled={isLoading || isSearching || !value.trim()}
          aria-label="Search location"
        >
          {isLoading || isSearching ? (
            <span className={styles.spinner} />
          ) : (
            <SearchIcon />
          )}
        </button>
      </div>
      {ddState.open && (
        <ul className={styles.dropdown}>
          {suggestions.map((s, i) => (
            <li
              key={`${s.latitude}-${s.longitude}`}
              className={`${styles.item} ${i === ddState.focused ? styles.focused : ""}`}
              onMouseDown={() => selectIndex(i)}
            >
              <div className={styles.itemLeft}>
                <span className={styles.itemName}>{s.name}</span>
                {s.admin1 && <span className={styles.itemAdmin}>{s.admin1}</span>}
              </div>
              <div className={styles.itemRight}>
                <span className={styles.itemFlag}>{getFlagEmoji(s.country_code)}</span>
                <span className={styles.itemCountry}>{s.country}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
