// Property text is entered in English, optionally in Urdu; fall back to English.
export function pickLang(localizedText, lang) {
  if (!localizedText) return '';
  return localizedText[lang] || localizedText.en || '';
}
