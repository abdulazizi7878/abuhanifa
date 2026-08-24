import { useTranslations } from "next-intl";

// ============================================================================
// PLACEHOLDER IMAGES: Replace these with Abu Hanifa's real project photos.
// ============================================================================
const SHOWCASE_IMAGES = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop",
    altKey: "showcase_alt_1",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop",
    altKey: "showcase_alt_2",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop",
    altKey: "showcase_alt_3",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=800&auto=format&fit=crop",
    altKey: "showcase_alt_4",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?q=80&w=800&auto=format&fit=crop",
    altKey: "showcase_alt_5",
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop",
    altKey: "showcase_alt_6",
  },
];

export default function AbuHanifaShowcase() {
  const t = useTranslations("home");

  return (
    <section className="w-full my-16 py-10 bg-background text-foreground flex flex-col items-center overflow-hidden">
      {/* Header Container */}
      <div className="w-11/12 max-w-6xl flex flex-col items-center text-center mb-8">
        <span className="text-xs uppercase tracking-widest text-(--primary) font-semibold px-4 py-1.5 rounded-full bg-purple-950/20 border border-(--primary)/20 mb-3">
          {t("showcase_tag")}
        </span>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 text-balance">
          {t("showcase_title")}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl text-balance">
          {t("showcase_description")}
        </p>
      </div>

      {/* Horizontal Scroll Showcase Container */}
      <div className="w-full max-w-7xl px-4 sm:px-6">
        <div className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-6 pt-2 px-2 w-full">
          {SHOWCASE_IMAGES.map((item) => (
            <div
              key={item.id}
              className="snap-start shrink-0 w-[80vw] sm:w-[45vw] md:w-[32vw] lg:w-[24vw] max-w-[360px] relative group rounded-3xl overflow-hidden border border-(--border) bg-card shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="h-64 sm:h-72 w-full overflow-hidden relative">
                <img
                  src={item.url}
                  alt={t(item.altKey)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Touch Instruction */}
      <div className="flex items-center gap-2 mt-2 sm:hidden text-xs text-muted-foreground">
        <span>{t("showcase_swipe_hint")}</span>
      </div>
    </section>
  );
}