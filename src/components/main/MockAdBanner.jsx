const VARIANT_CLASS_NAME = {
  banner: "mock-ad-banner--banner",
  square: "mock-ad-banner--square",
  inline: "mock-ad-banner--inline",
};

const DEFAULT_AD = {
  sponsor: "Mock Ads",
  title: "이 자리에 광고가 들어갑니다",
  description: "레이아웃과 간격을 먼저 확인하기 위한 테스트 광고 영역입니다.",
  ctaLabel: "광고 자리 확인",
  variant: "banner",
};

export default function MockAdBanner({
  ad = null,
  className = "",
  variant,
  sponsor,
  title,
  description,
  ctaLabel,
}) {
  const resolvedAd = {
    ...DEFAULT_AD,
    ...(ad || {}),
    sponsor: sponsor ?? ad?.sponsor ?? DEFAULT_AD.sponsor,
    title: title ?? ad?.title ?? DEFAULT_AD.title,
    description: description ?? ad?.description ?? DEFAULT_AD.description,
    ctaLabel: ctaLabel ?? ad?.ctaLabel ?? DEFAULT_AD.ctaLabel,
    variant: variant ?? ad?.variant ?? DEFAULT_AD.variant,
  };

  const variantClassName =
    VARIANT_CLASS_NAME[resolvedAd.variant] || VARIANT_CLASS_NAME.banner;

  const rootClassName = ["mock-ad-banner", variantClassName, className]
    .filter(Boolean)
    .join(" ");

  return (
    <aside className={rootClassName}>
      <div className="mock-ad-banner__eyebrow">
        <span className="mock-ad-banner__badge">Sponsored</span>
        <span className="mock-ad-banner__sponsor">{resolvedAd.sponsor}</span>
      </div>

      <div className="mock-ad-banner__body">
        <p className="mock-ad-banner__title">{resolvedAd.title}</p>
        <p className="mock-ad-banner__description">{resolvedAd.description}</p>
      </div>

      <button type="button" className="mock-ad-banner__cta">
        {resolvedAd.ctaLabel}
      </button>
    </aside>
  );
}
