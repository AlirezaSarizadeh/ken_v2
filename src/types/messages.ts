// src/types/messages.ts

export type GlobalMessages = {
  Metadata?: {
    title?: string;
    description?: string;
  };

  GlobalLayout?: {
    brand?: {
      title?: string;
      subtitle?: string;
    };
    navLinks?: Array<{
      name: string;
      path: string;
    }>;
    backHome?: string;
    footer?: {
      title?: string;
      quote?: string;
      copyright?: string;
      credit?: string;
    };
  };

  Home?: {
    sections?: {
      academy?: { title?: string; kanji?: string; desc?: string };
      about?: { title?: string; kanji?: string; desc?: string };
      contact?: { title?: string; kanji?: string; desc?: string };
      courses?: { title?: string; kanji?: string; desc?: string };
      gallery?: { title?: string; kanji?: string; desc?: string };
      katuri?: { title?: string; kanji?: string; desc?: string };
      members?: { title?: string; kanji?: string; desc?: string };
      store?: { title?: string; kanji?: string; desc?: string };
    };
  };
  SectionMembers?: {
    heading?: { title?: string; subtitle?: string };
    ui?: {
      searchPlaceholder?: string;
      levelLabel?: string;
      sortLabel?: string;
      sortNewest?: string;
      sortName?: string;
      sortCode?: string;
      allLabel?: string;
    };
    decor?: {
      floatingKanjiTop?: string;
      floatingKanjiBottom?: string;
      headerKanji?: string;
      bgImage?: string;
    };
    members?: Array<{
      id?: number;
      name?: string;
      code?: string;
      level?: string;
      kanji?: string;
      bio?: string;
      tags?: string[];
      avatar?: string;
    }>;
  };

  Section1?: {
    master?: {
      titlePrefix?: string;
      name?: string;
      quote?: string;
      imageAlt?: string;
    };
    header?: {
      titlePart1?: string;
      titlePart2?: string;
      floatingKanjiTop?: string;
      floatingKanjiBottom?: string;
      headerKanji?: string;
    };
    slides?: Array<{
      id?: number;
      title?: string;
      desc?: string;
      image?: string;
      kanji?: string;
    }>;
  };

  Katuri?: {
    master?: {
      titlePrefix?: string;
      name?: string;
      quote?: string;
      imageAlt?: string;
    };
    header?: {
      titlePart1?: string;
      titlePart2?: string;
      floatingKanjiTop?: string;
      floatingKanjiBottom?: string;
      headerKanji?: string;
    };
    slides?: Array<{
      id?: number;
      title?: string;
      desc?: string;
      image?: string;
      kanji?: string;
    }>;
  };
  SectionShop?: {
    allKey?: string;
    heading?: { title?: string; subtitle?: string };
    categories?: string[];
    ui?: {
      searchPlaceholder?: string;
      sortLabel?: string;
      sortPopular?: string;
      sortNewest?: string;
      sortPriceLow?: string;
      sortPriceHigh?: string;
      addToCart?: string;
      outOfStock?: string;
      details?: string;
      close?: string;
      currency?: string;
    };
    items?: Array<{
      id?: number;
      name?: string;
      kanji?: string;
      description?: string;
      origin?: string;
      material?: string;
      image?: string;
      category?: string;
      price?: number;
      inStock?: boolean;
      badge?: string;
    }>;
  };
  Section2?: {
    heading?: {
      title?: string;
      kanji?: string;
    };
    founded?: {
      label?: string;
      value?: string;
    };
    moreInfo?: string;
    tabs?: Array<{
      id?: number;
      name?: string;
      content?: string;
    }>;
  };

  Section3?: {
    heading?: {
      title?: string;
      kanji?: string;
    };
    form?: {
      title?: string;
      nameLabel?: string;
      namePlaceholder?: string;
      emailLabel?: string;
      emailPlaceholder?: string;
      messageLabel?: string;
      messagePlaceholder?: string;
      submit?: string;
      sent?: string;
      thanksTitle?: string;
      thanksBody?: string;
    };
    contactInfo?: Array<{
      id?: number;
      kind?: string;
      label?: string;
      text?: string;
    }>;
    messengerAlt?: string;
  };

  Section4?: {
    heading?: {
      title?: string;
      subtitle?: string;
    };
    roadmapTitle?: string;
    labels?: {
      prereqTitle?: string;
      skillsTitle?: string;
      enrollCta?: string;
      skillLevelLabel?: string;
    };
    levels?: Array<{
      id?: number;
      title?: string;
      duration?: string;
      kanji?: string;
      description?: string;
      image?: string;
      progress?: number;
      requirements?: string[];
      skills?: string[];
    }>;
    milestones?: Array<{
      title?: string;
      completed?: boolean;
    }>;
  };

  Section5?: {
    heading?: {
      title?: string;
      subtitle?: string;
    };
    categories?: string[];
  };

  BlogPage?: {
    meta?: {
      title?: string;
      description?: string;
      keywords?: string[];
    };
    ui?: {
      headingTitle?: string;
      headingSubtitle?: string;
      kanjiLarge?: string;
    };
  };

  BlogPostList?: {
    ui?: {
      loading?: string;
      readTimeSuffix?: string;
    };
    categories?: Array<{
      key: "all" | "history" | "philosophy" | "martialArts";
      label: string;
      matches?: string[];
    }>;
  };

  BlogPostPage?: {
    meta?: {
      siteTitle?: string;
      notFoundTitle?: string;
      notFoundDescription?: string;
    };
  };

  BlogPostContent?: {
    ui?: {
      opening?: string;
      backToArchive?: string;
      minRead?: string;
      relatedTitle?: string;
    };
  };
  ProductPage?: {
    meta?: {
      title?: string;
      description?: string;
      brand?: string;
    };
    ui?: {
      pageTitle?: string;
      gallery?: string;
      specs?: string;
      reviews?: string;
      addToCart?: string;
      outOfStock?: string;
      currency?: string;
      writeReview?: string;
      yourName?: string;
      yourReview?: string;
      rating?: string;
      submit?: string;
      emptyProduct?: string;
    };
  };
  JoinPage?: {
    meta?: {
      title?: string;
    };
    ui?: {
      heading?: string;
      submit?: string;
      submitting?: string;
      successTitle?: string;
      title?: string;
      body?: string;
      conductLabel?: string;
      conductQuote?: string;
      benefits?: string[];
      footerBrand?: string;
    };
    form?: {
      heading?: string;
      pledgeHint?: string;
      submit?: string;
      loading?: string;
      labels?: Record<string, string>;
      placeholders?: Record<string, string>;
      options?: Record<string, any>;
    };
    success?: {
      title?: string;
      body?: string;
    };
    validation?: Record<string, string>;
  };
};
