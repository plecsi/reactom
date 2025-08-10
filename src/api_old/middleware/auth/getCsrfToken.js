// CSRF token visszaadása
export function GetCsrfTokenMW(req, res) {
  res.json({ csrfToken: req.csrfToken() });
}