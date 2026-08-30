"use client";

import { useState } from "react";
import {
  officialEuLanguages,
  reviewedTranslationUrl,
  translationContributionUrl,
} from "../lib/language-access.mjs";

export function LanguageAccess() {
  const [language, setLanguage] = useState("en");
  const translationHref = typeof window === "undefined"
    ? null
    : reviewedTranslationUrl(language, window.location);
  const contributionHref = typeof window === "undefined"
    ? null
    : translationContributionUrl(language, window.location);

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
          <a href={translationHref}>
            Open reviewed translation
          </a>
        ) : contributionHref ? (
          <a href={contributionHref} target="_blank" rel="noreferrer">
            Help translate or review this page
          </a>
        ) : (
          <span className="language-access-current">English is the canonical text.</span>
        )}
        <small>
          Translations are published from Git only after source-version checks
          and human review. No automatic translation is presented as project text.
        </small>
      </div>
    </details>
  );
}
