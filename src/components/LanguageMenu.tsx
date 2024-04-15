'use client';

import { useState } from 'react';
import SelectMenu from './SelectMenu';

const languages = {
  en: 'English',
  es: 'Español',
};

export default function LanguageMenu() {
  const [lang, setLang] = useState('en');

  return (
    <SelectMenu
      options={Object.entries(languages)}
      id="language-menu"
      value={lang}
      onValueChange={setLang}
      label="language"
      hideLabel
    />
  );
}
