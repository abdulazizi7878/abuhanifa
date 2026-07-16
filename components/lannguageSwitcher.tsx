"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

const languages = [
  { code: "en", name: "English" },
  { code: "am", name: "አማርኛ" },
  { code: "ar", name: "العربية" },
];

export default function LanguageSwitcher({display}) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function changeLanguage(newLocale: string) {
    if (!pathname) return;

    const segments = pathname.split("/");
    segments[1] = newLocale;

    router.push(segments.join("/"));
  }

  return (
    <div className="flex items-center">
      {
        (display != false && (
     
     <label htmlFor="language-switcher" className="text-sm mr-2 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--foreground)">
          <path d="M325-111.5q-73-31.5-127.5-86t-86-127.5Q80-398 80-480.5t31.5-155q31.5-72.5 86-127t127.5-86Q398-880 480.5-880t155 31.5q72.5 31.5 127 86t86 127Q880-563 880-480.5T848.5-325q-31.5 73-86 127.5t-127 86Q563-80 480.5-80T325-111.5ZM480-162q26-36 45-75t31-83H404q12 44 31 83t45 75Zm-104-16q-18-33-31.5-68.5T322-320H204q29 50 72.5 87t99.5 55Zm208 0q56-18 99.5-55t72.5-87H638q-9 38-22.5 73.5T584-178ZM170-400h136q-3-20-4.5-39.5T300-480q0-21 1.5-40.5T306-560H170q-5 20-7.5 39.5T160-480q0 21 2.5 40.5T170-400Zm216 0h188q3-20 4.5-39.5T580-480q0-21-1.5-40.5T574-560H386q-3 20-4.5 39.5T380-480q0 21 1.5 40.5T386-400Zm268 0h136q5-20 7.5-39.5T800-480q0-21-2.5-40.5T790-560H654q3 20 4.5 39.5T660-480q0 21-1.5 40.5T654-400Zm-16-240h118q-29-50-72.5-87T584-782q18 33 31.5 68.5T638-640Zm-234 0h152q-12-44-31-83t-45-75q-26 36-45 75t-31 83Zm-200 0h118q9-38 22.5-73.5T376-782q-56 18-99.5 55T204-640Z"/>
        </svg>
        Language:
      </label>

        ))
      }

      <select
        value={locale}
        onChange={(e) => changeLanguage(e.target.value)}
        className="text-sm cursor-pointer"
        id="language-switcher"
      >
        {languages.map((lang) => (
          <option
            className="text-sm duration-200 px-4 rounded-2xl text-black"
            key={lang.code}
            value={lang.code}
          >
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}