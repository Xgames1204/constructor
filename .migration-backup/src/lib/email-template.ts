export function buildVerificationEmailHtml(code: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const logoUrl = `${baseUrl}/logo-light.png`;

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Код подтверждения</title>
</head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:linear-gradient(160deg,#e8f4fc 0%,#f0f4f8 45%,#eef2ff 100%);min-height:100vh;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;">
          <tr>
            <td style="padding-bottom:24px;text-align:center;">
              <img src="${logoUrl}" alt="XEMENS Constructor" width="56" height="56" style="display:inline-block;object-fit:contain;" />
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;border-radius:20px;box-shadow:0 8px 40px rgba(12,140,233,0.08),0 2px 8px rgba(0,0,0,0.04);overflow:hidden;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background:linear-gradient(135deg,#0c8ce9 0%,#006fc7 100%);padding:28px 32px;text-align:center;">
                    <p style="margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.85);">XEMENS</p>
                    <h1 style="margin:0;font-size:26px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">Constructor</h1>
                    <p style="margin:10px 0 0;font-size:14px;color:rgba(255,255,255,0.9);">Подтверждение регистрации</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:36px 32px 28px;">
                    <p style="margin:0 0 8px;font-size:16px;line-height:1.5;color:#334155;">Здравствуйте!</p>
                    <p style="margin:0 0 28px;font-size:15px;line-height:1.6;color:#64748b;">
                      Вы регистрируетесь в конструкторе сайтов <strong style="color:#0f172a;">XEMENS Constructor</strong>.
                      Введите код ниже на странице регистрации:
                    </p>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" style="background:linear-gradient(180deg,#f8fafc 0%,#f1f5f9 100%);border:2px dashed #cbd5e1;border-radius:16px;padding:28px 20px;">
                          <p style="margin:0 0 10px;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#94a3b8;">Ваш код</p>
                          <p style="margin:0;font-size:42px;font-weight:800;letter-spacing:12px;color:#0c8ce9;font-variant-numeric:tabular-nums;">${code}</p>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:28px 0 0;font-size:13px;line-height:1.5;color:#94a3b8;text-align:center;">
                      Код действителен <strong style="color:#64748b;">15 минут</strong>.<br />
                      Не передавайте его третьим лицам.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 32px 32px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fafc;border-radius:12px;">
                      <tr>
                        <td style="padding:16px 20px;">
                          <p style="margin:0;font-size:12px;line-height:1.5;color:#94a3b8;">
                            Если вы не запрашивали регистрацию — просто проигнорируйте это письмо.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 8px 0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                © XEMENS · Constructor · Визуальный конструктор сайтов
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildVerificationEmailText(code: string): string {
  return `XEMENS Constructor — подтверждение регистрации

Ваш код: ${code}

Код действителен 15 минут.
Введите его на странице регистрации.

Если вы не регистрировались — проигнорируйте это письмо.

— XEMENS Constructor`;
}
