---
title: "ADR 0001: Shared privacy choices"
summary: "One initial action with separate advertising and analytics purpose state"
read_when:
  - Maintaining this service or reviewing its implementation
---

# ADR 0001: Shared privacy choices

Status: Accepted; implemented 2026-10-24; reviewed 2026-10-25.

## Context

Sequential advertising and analytics prompts interrupted users twice. Showing both checkboxes before the primary actions made the unified prompt look like a three-click form. The six services share an operator and parent domain but retain different provider configurations.

## Decision

Use `src/consent.js` as the local consent coordinator, with identical copies in Spin, Type, Bracket, Print, Daily and Compare.

- Initial allow/reject actions commit both purpose choices immediately. Individual checkboxes and the save action are revealed only through customization.
- Preserve two fields, `ads` and `analytics`. Combining the UI does not collapse the purposes or imply one from the other.
- Store `denny-privacy-preferences-v2` with `{ version: 2, ads, analytics, at }`. Purpose values are booleans or `null` for unknown; timestamps in the future, expired records and malformed records are rejected.
- On the parent domain and its subdomains, write `Domain=.iamdenny.com; Path=/; SameSite=Lax`, with `Secure` on HTTPS and a maximum age of 180 days. Other hosts use a host-only cookie. Store the same record locally as a fallback.
- Read a valid shared cookie before local storage, then consult legacy per-purpose storage. Fully known legacy choices migrate with their oldest timestamp; partial legacy choices leave the other purpose unknown and eligible for a prompt.
- Emit `denny-consent-changed` after explicit saves. Loaded pages re-read shared choices on focus and when becoming visible. Footer/settings and ad-placeholder controls reopen the same panel.
- Keep descriptions, provider details and a privacy link available. Locale key definitions live in the module's `copy` object; public policy text lives in the builder and, where present, `src/messages.json`.

## Alternatives considered

Separate prompts retained purpose separation but repeated interruptions. An always-expanded checkbox form required extra effort for an all-or-nothing choice. A single undifferentiated flag would prevent independent purposes. A remote consent service would introduce availability and integration costs for static sites.

## Consequences and boundaries

A visitor can choose once across participating services in the same browser, while selecting individual purposes when needed. Participating services must maintain aligned policy descriptions and code copies. The parent-domain cookie can be read or changed by sibling subdomains, so it is a preference record, not a security or authentication boundary. Store no input text or user identifier in it.

Blocked cookies, separate browser profiles and unrelated domains prevent sharing. The cookie is not a certified AdSense CMP. Adsterra approval, GA hostname restrictions and AdSense-specific gates still apply. Withdrawal affects future activity after a page processes the change; it does not retroactively delete provider data.

## Verification and unresolved edges

Native tests cover record parsing, lifetime and legacy data; provider-specific tests cover their gates. Browser checks must cover one-action allow/reject, custom mixed choices, cross-service navigation, keyboard access and narrow-screen action visibility. Check revoke/regrant in the same page: the analytics loader currently returns early when already loaded, before renewing its consent update. See [operations](../operations.md) for the release checklist and current limits.
