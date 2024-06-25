'use client';

import { useState } from 'react';
import SelectMenu from './SelectMenu';

const languages = {
  en: 'English',
  es: { name: 'Español', disabled: true },
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
