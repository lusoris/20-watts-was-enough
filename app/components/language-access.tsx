"use client";

import { useState } from "react";
import {
  languageAvailability,
  languageDestinationUrl,
  translationContributionUrl,
} from "../lib/language-access.mjs";

export function LanguageAccess({ basePath = "/" }: { basePath?: string }) {
  const [language, setLanguage] = useState("en");
  const location = typeof window === "undefined"
    ? { pathname: "/", hash: "" }
    : window.location;
  const availability = languageAvailability(location, { basePath });
  const selectedLanguage = availability.available.some(
    (entry) => entry.code === language,
  ) ? language : availability.currentLanguage;
  const destinationHref = typeof window === "undefined"
    ? null
    : languageDestinationUrl(selectedLanguage, location, { basePath });
  const contributionHref = translationContributionUrl(location, { basePath });
  const current = availability.available.find((entry) => entry.current);

  return (
    <details className="language-access">
      <summary>Language</summary>
      <div className="language-access-panel">
        <label htmlFor="site-language">Read this page</label>
        <select
          id="site-language"
          value={selectedLanguage}
          onChange={(event) => setLanguage(event.target.value)}
        >
          {availability.available.map(({ code, label }) => (
            <option key={code} lang={code} value={code}>{label}</option>
          ))}
        </select>
        {destinationHref ? (
          <a href={destinationHref}>
            {selectedLanguage === "en"
              ? "Open canonical English"
              : "Open reviewed translation"}
          </a>
        ) : (
          <span className="language-access-current">
            {current?.code === "en"
              ? "English is the canonical text."
              : `${current?.label ?? "This language"} is the current reviewed edition.`}
          </span>
        )}
        <small>
          Only translations tied to this source version and recorded after
          human review appear as reading options.
        </small>
        <a
          className="language-access-help"
          href={contributionHref}
          target="_blank"
          rel="noreferrer"
        >
          Help add or review a language
        </a>
      </div>
    </details>
  );
}
