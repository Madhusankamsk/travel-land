/**
 * Magic-link sign-in email: HTML + plain text for nodemailer.
 * Inline styles only — table layout for broad client support.
 */

function escapeHtmlAttr(url: string): string {
  return url.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function escapeHtmlText(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const BRAND = {
  travertine: "#F5F0E8",
  parchment: "#EDE5D5",
  bone: "#D9CEBA",
  obsidian: "#1A1714",
  cream: "#F0EAE0",
  terracotta: "#9B5E3B",
  muted: "#7A7060",
  adriatic: "#1A4A70",
  infoBg: "#D8E8F5",
  infoBorder: "#2E5B8B",
} as const;

export function buildMagicLinkEmail(verifyUrl: string): {
  subject: string;
  text: string;
  html: string;
} {
  const safeHref = escapeHtmlAttr(verifyUrl);

  const subject = "Il tuo link di accesso — TRAVEL-LAND.IT";

  const text = [
    "TRAVEL-LAND.IT — Agenzia di viaggi, tour operator",
    "",
    "Ciao,",
    "",
    "Usa il link qui sotto per accedere al tuo account in modo sicuro, senza password.",
    "",
    verifyUrl,
    "",
    "Il link è valido per 15 minuti e può essere usato una sola volta.",
    "",
    "Se non hai richiesto tu questo accesso, ignora questa email.",
    "",
    "—",
    "TRAVEL-LAND S.R.L.",
    "Viale Edison 666, Sesto San Giovanni (MI)",
    "P.IVA 07403720969",
  ].join("\n");

  const html = `
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${subject}</title>
  <!--[if mso]>
  <style type="text/css">
    table { border-collapse: collapse; }
    .btn a { text-decoration: none !important; }
  </style>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${BRAND.travertine};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${BRAND.travertine};">
    <tr>
      <td align="center" style="padding:32px 16px 48px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;width:100%;">
          <!-- Preheader (hidden) -->
          <tr>
            <td style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
              Accedi a TRAVEL-LAND.IT con un tap — link valido 15 minuti.
            </td>
          </tr>
          <!-- Header bar -->
          <tr>
            <td style="background-color:${BRAND.obsidian};border-radius:20px 20px 0 0;padding:28px 32px;text-align:center;">
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:500;letter-spacing:0.02em;color:${BRAND.cream};">
                TRAVEL-LAND<span style="color:#B8963E;">.IT</span>
              </p>
              <p style="margin:10px 0 0;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#B5A890;">
                Agenzia di viaggi · Tour operator
              </p>
            </td>
          </tr>
          <!-- Card body -->
          <tr>
            <td style="background-color:#ffffff;border-left:1px solid ${BRAND.bone};border-right:1px solid ${BRAND.bone};padding:0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding:32px 28px 8px;">
                    <p style="margin:0 0 8px;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${BRAND.terracotta};">
                      Accesso sicuro
                    </p>
                    <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:500;line-height:1.25;color:${BRAND.obsidian};">
                      Apri il link per continuare
                    </h1>
                    <p style="margin:16px 0 0;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;font-size:15px;line-height:1.65;color:${BRAND.muted};">
                      Ciao,<br><br>
                      hai richiesto un accesso al sito. Tocca il pulsante qui sotto per entrare nel tuo profilo
                      <strong style="color:${BRAND.obsidian};font-weight:600;">senza password</strong>.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:8px 28px 28px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" class="btn">
                      <tr>
                        <td align="center" style="border-radius:9999px;background-color:${BRAND.obsidian};box-shadow:0 4px 16px rgba(26,23,20,0.12);">
                          <a href="${safeHref}" target="_blank" rel="noopener noreferrer"
                            style="display:inline-block;padding:16px 36px;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;font-size:14px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:${BRAND.cream};text-decoration:none;">
                            Accedi ora
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 28px 28px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${BRAND.infoBg};border:1px solid rgba(46,91,139,0.25);border-radius:12px;">
                      <tr>
                        <td style="padding:16px 18px;">
                          <p style="margin:0;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;font-size:13px;line-height:1.55;color:${BRAND.adriatic};">
                            <strong style="display:block;margin-bottom:6px;font-size:12px;letter-spacing:0.04em;">Importante</strong>
                            Il link scade tra <strong>15 minuti</strong> e può essere usato <strong>una sola volta</strong>.
                            Se il pulsante non funziona, copia e incolla questo indirizzo nel browser:
                          </p>
                          <p style="margin:12px 0 0;word-break:break-all;font-family:Consolas,'Courier New',monospace;font-size:12px;line-height:1.5;color:${BRAND.obsidian};">
                            <a href="${safeHref}" style="color:#2E6B9E;text-decoration:underline;">${escapeHtmlText(verifyUrl)}</a>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 28px 32px;">
                    <p style="margin:0;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;font-size:13px;line-height:1.55;color:#9A9080;">
                      Non hai richiesto tu questo messaggio? Puoi ignorare questa email: il tuo account resta protetto.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:${BRAND.parchment};border:1px solid ${BRAND.bone};border-top:none;border-radius:0 0 20px 20px;padding:24px 28px;">
              <p style="margin:0 0 6px;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;font-size:12px;font-weight:600;color:${BRAND.obsidian};">
                TRAVEL-LAND S.R.L.
              </p>
              <p style="margin:0;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;font-size:11px;line-height:1.6;color:${BRAND.muted};">
                Viale Edison 666, Sesto San Giovanni (MI)<br>
                P.IVA 07403720969 · Codice Univoco M5UXCR1
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:24px 0 0;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;font-size:11px;line-height:1.5;color:#9A9080;text-align:center;max-width:480px;">
          Ricevi questa email perché è stato richiesto un accesso con il tuo indirizzo su travel-land.it.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();

  return { subject, text, html };
}
