/**
 * CareerLoop transactional-email design system. Server-only.
 *
 * Dark slate canvas, white typography and Cobalt Blue #405FE2 accents — the
 * brand from `src/theme/theme.ts`, inverted for mail (mail clients paint a
 * light canvas by default and the brand reads better on slate). The header is
 * the website's own logo (`/careerloop-logo.png`, served from the live site),
 * rendered as a round avatar, with no text wordmark.
 *
 * Email-safe by construction: table layout, inline styles only, no flexbox, no
 * external CSS, no web fonts, and fixed pixel width for the logo.
 */

export const BRAND = {
  primary: "#405FE2",
  primaryLight: "#708bf5",
  primaryDark: "#2843be",
  /* dark surfaces (mail) */
  pageBg: "#0b1120",
  cardBg: "#0f172a",
  cardBorder: "#263258",
  codePanelBg: "#0b1120",
  codePanelBorder: "#2a3760",
  logoRing: "#2a3760",
  /* type on dark */
  heading: "#ffffff",
  text: "#c7d0e4",
  muted: "#8b97b3",
  fontStack:
    "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif",
  siteUrl: "https://www.careerloop.co.in",
  logoUrl: "https://www.careerloop.co.in/careerloop-logo.png",
  supportEmail: "support@careerloop.co.in",
  replyEmail: "mail@m.careerloop.co.in",
} as const;

/** The site logo only, round, centred — no wordmark. */
export function brandLogo(size = 56): string {
  return `
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="border-collapse:collapse;">
              <tr>
                <td align="center" style="line-height:0;font-size:0;">
                  <a href="${BRAND.siteUrl}" style="text-decoration:none;display:inline-block;">
                    <img src="${BRAND.logoUrl}" width="${size}" height="${size}" alt="CareerLoop"
                         style="display:block;width:${size}px;height:${size}px;border:1px solid ${BRAND.logoRing};border-radius:50%;outline:none;background:${BRAND.cardBg};" />
                  </a>
                </td>
              </tr>
            </table>`;
}

export interface BrandedEmailOptions {
  /** Short heading inside the card. */
  heading: string;
  /** Pre-header line shown by inbox previews. */
  preheader: string;
  /** Main body HTML (already inline-styled by the caller). */
  bodyHtml: string;
  /** Optional highlighted block (e.g. the OTP digits). */
  codeBlockHtml?: string;
  /** Small print above the footer rule. */
  footnoteHtml?: string;
}

export function renderBrandedEmail({
  heading,
  preheader,
  bodyHtml,
  codeBlockHtml = "",
  footnoteHtml = "",
}: BrandedEmailOptions): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="color-scheme" content="dark" />
    <meta name="supported-color-schemes" content="dark" />
    <title>${heading}</title>
  </head>
  <body style="margin:0;padding:0;background:${BRAND.pageBg};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${preheader}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;background:${BRAND.pageBg};">
      <tr>
        <td align="center" style="padding:32px 14px;background:${BRAND.pageBg};">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;max-width:560px;width:100%;">

            <tr><td align="center" style="padding:0 0 18px 0;">${brandLogo(56)}</td></tr>

            <tr>
              <td style="background:${BRAND.cardBg};border:1px solid ${BRAND.cardBorder};border-radius:16px;overflow:hidden;">
                <!-- brand accent rule -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
                  <tr><td style="height:3px;line-height:3px;font-size:0;background:${BRAND.primary};">&nbsp;</td></tr>
                </table>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
                  <tr>
                    <td style="padding:28px 28px 0 28px;">
                      <h1 style="margin:0 0 10px 0;font-family:${BRAND.fontStack};font-size:20px;line-height:1.35;font-weight:800;letter-spacing:-0.02em;color:${BRAND.heading};">${heading}</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 28px 4px 28px;font-family:${BRAND.fontStack};font-size:14px;line-height:1.65;color:${BRAND.text};">
                      ${bodyHtml}
                    </td>
                  </tr>
                  ${codeBlockHtml}
                  <tr>
                    <td style="padding:22px 28px 26px 28px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
                        <tr><td style="border-top:1px solid ${BRAND.cardBorder};padding-top:16px;font-family:${BRAND.fontStack};font-size:12px;line-height:1.65;color:${BRAND.muted};">
                          ${footnoteHtml}
                        </td></tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:18px 10px 0 10px;font-family:${BRAND.fontStack};font-size:12px;line-height:1.7;color:${BRAND.muted};">
                Team CareerLoop &middot; <a href="mailto:${BRAND.replyEmail}" style="color:${BRAND.primaryLight};text-decoration:none;">Reply to this mail if you need help</a>
                <br />
                <a href="${BRAND.siteUrl}" style="color:${BRAND.muted};text-decoration:none;">careerloop.co.in</a>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** Centered, letter-spaced OTP digits inside the card. */
export function otpCodeBlock(otp: string, ttlMinutes: number): string {
  return `
                  <tr>
                    <td style="padding:8px 28px 0 28px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
                        <tr>
                          <td align="center" style="background:${BRAND.codePanelBg};border:1px solid ${BRAND.codePanelBorder};border-radius:12px;padding:22px 12px;">
                            <div style="font-family:${BRAND.fontStack};font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${BRAND.muted};padding-bottom:10px;">Your verification code</div>
                            <div style="font-family:${BRAND.fontStack};font-size:36px;font-weight:800;letter-spacing:9px;color:${BRAND.primaryLight};line-height:1.1;">${otp}</div>
                            <div style="font-family:${BRAND.fontStack};font-size:12px;color:${BRAND.muted};padding-top:10px;">Expires in ${ttlMinutes} minutes</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>`;
}

export { renderBrandedEmail as renderEmail };
