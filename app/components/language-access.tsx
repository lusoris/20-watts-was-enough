"use client";

import { useState } from "react";
import {
  googleTranslationHandoffUrl,
  officialEuLanguages,
} from "../lib/machine-translation.mjs";

export function LanguageAccess() {
  const [language, setLanguage] = useState("en");
  const translationHref = typeof window === "undefined"
    ? null
    : googleTranslationHandoffUrl(language, window.location);

  return (
    <details className="language-access">
      <summary>Language</summary>
      <div className="language-access-panel">
        <label htmlFor="site-language">Read in another EU language</label>
        <select
          id="site-language"
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
        >
          {officialEuLanguages.map(([code, label]) => (
            <option key={code} value={code}>{label}</option>
          ))}
        </select>
        {translationHref ? (
          <a href={translationHref} target="_blank" rel="noreferrer">
            Open automatic translation
          </a>
        ) : (
          <span className="language-access-current">English is the canonical text.</span>
        )}
        <small>
          Non-English versions are generated automatically by Google Translate
          after you follow the link. Google&apos;s terms and privacy policy then apply.
        </small>
      </div>
    </details>
  );
}
