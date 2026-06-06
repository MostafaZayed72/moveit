export interface LocalizedContent {
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  hero: {
    title: string;
    subtitle: string;
  };
  content: {
    introduction: {
      title: string;
      text: string[];
    };
    residentialDetails: {
      title: string;
      text: string[];
    };
    commercialDetails: {
      title: string;
      text: string[];
    };
    packingTips: {
      title: string;
      text: string[];
    };
    localInsights: {
      title: string;
      text: string[];
    };
    costFactors: {
      title: string;
      text: string[];
    };
    whyUs: string[];
    neighborhoodsTitle?: string;
    neighborhoods?: string[];
  };
}

export interface LocationData {
  slug: string;
  name: string;
  country: string | null;
  image: string;
  images: {
    boxes: string;
    van: string;
    room: string;
  };
  en: LocalizedContent;
  nl: LocalizedContent;
}
