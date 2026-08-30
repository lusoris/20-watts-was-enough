# 0047 — Keep Cloudflare as the public Pages TLS authority

- **Status:** accepted
- **Date:** 2026-08-30
- **Related:** [0029](0029-bind-pages-to-the-custom-domain-root.md)

## Context

The public reader is healthy at `https://www.cordana.dev/` through proxied
Cloudflare DNS. On 2026-08-30, public checks observed Cloudflare anycast A and
AAAA responses, an exact HTTP-to-HTTPS redirect, a successful HTTPS response,
and a publicly trusted certificate covering `cordana.dev` and
`*.cordana.dev`.

The authenticated Cloudflare dashboard reported **Always Use HTTPS** enabled
and the automatic origin encryption mode at
[**Full**](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full/).
Full encrypts the Cloudflare-to-origin connection but does not validate the
origin certificate; it must not be described as end-to-end authenticated TLS.
Cloudflare recommends
[Full (strict)](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full-strict/)
when the origin can present a valid matching certificate.

GitHub's [Pages API](https://docs.github.com/en/rest/pages/pages?apiVersion=2022-11-28)
reported `cname: www.cordana.dev`, no Pages certificate and
`https_enforced: false`. GitHub's
[certificate flow](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)
performs a DNS check before provisioning, while proxied public DNS exposes
Cloudflare rather than the direct Pages records. The maintainer selected the
keep-proxy option in
[issue 9](https://github.com/lusoris/20-watts-was-enough/issues/9).

## Decision

1. Keep `www.cordana.dev` proxied through Cloudflare. Cloudflare edge TLS and
   **Always Use HTTPS** are the public transport authority.
2. Retain the current automatic **Full** origin mode as an explicit limitation.
   It encrypts the origin leg but does not prove origin identity. Do not claim
   that GitHub's `https_enforced` flag protects the public route while this
   boundary remains in force.
3. Bind the public contract in
   [`.github/public-transport.json`](../.github/public-transport.json). A
   standard-library Go check must refuse redirects while measuring them,
   require the exact HTTP redirect and HTTPS status, verify the system-trusted
   certificate and hostname with at least fourteen days remaining, and require
   Cloudflare's `Server` and `CF-Ray` response evidence.
4. Run that bounded read-only check after each successful Pages deployment.
   It receives no write permission and does not mutate DNS, Cloudflare, GitHub
   Pages or the deployed artifact. Retain its combined output as the
   `public-transport-observation` Actions artifact for 30 days; this is
   operational evidence, not a scientific result.
5. Treat the dashboard origin mode as a separately verified administrative
   fact. Recheck it after a DNS, proxy, origin or Cloudflare automatic-mode
   change; the public probe cannot establish how Cloudflare authenticated its
   origin connection.
6. Move to **Full (strict)** only after a read-only preflight proves that the
   GitHub origin presents a certificate Cloudflare can validate for the
   requested or target hostname. Any temporary DNS-only provisioning window is
   a separate availability-affecting change and needs an explicit maintainer
   instruction.

## Consequences

- Public HTTP is redirected at Cloudflare before the Pages origin, and a failed
  public redirect, edge identity, status or certificate check makes the Pages
  workflow visibly fail after deployment. Each executed probe keeps one
  bounded 30-day observation artifact alongside the workflow run.
- GitHub continues to build and host the static artifact, but its current
  `https_enforced: false` value is not represented as the public HTTPS control.
- The origin leg is encrypted but not certificate-validated while automatic
  mode remains at Full. This residual risk stays visible rather than being
  hidden by a successful edge-only check.
- No DNS, proxy or Cloudflare setting changed as part of this decision.

## Supersession

Supersede this record if the site becomes direct GitHub Pages, another proxy or
host becomes the public TLS authority, Cloudflare reaches a verified Full
(strict) origin contract, or the canonical domain changes.
