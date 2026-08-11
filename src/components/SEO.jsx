import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import seoConfig, { defaultSEO, resolveSEO } from "../data/seoConfig";

const SITE_URL = "https://ilmora.texora.ai";

export default function SEO() {
  const { pathname } = useLocation();
  const data = resolveSEO(pathname);
  const fullUrl = `${SITE_URL}${pathname}`;

  return (
    <Helmet>
      <title>{data.title}</title>
      <meta name="description" content={data.description} />
      {data.keywords && <meta name="keywords" content={data.keywords} />}
      <link rel="canonical" href={fullUrl} />
      {data.noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content="website" />
      <meta property="og:title" content={data.title} />
      <meta property="og:description" content={data.description} />
      <meta property="og:image" content={`${SITE_URL}/og-icon.jpg`} />
      <meta property="og:url" content={fullUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={data.title} />
      <meta name="twitter:description" content={data.description} />
    </Helmet>
  );
}