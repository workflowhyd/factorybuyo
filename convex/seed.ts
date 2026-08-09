import { internalMutation } from "./_generated/server";
import { seedProducts } from "./seedData";
import type { Id } from "./_generated/dataModel";

// Run once after deploying: npx convex run seed:seedProducts
export const seedProductsMutation = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("products").first();
    if (existing) {
      return "Products already exist, skipping seed.";
    }
    for (const product of seedProducts) {
      await ctx.db.insert("products", { ...product, createdAt: Date.now() });
    }
    return `Seeded ${seedProducts.length} products.`;
  },
});

// Run once after deploying: npx convex run seed:seedSiteContent
export const seedSiteContent = internalMutation({
  args: {},
  handler: async (ctx) => {
    const results: string[] = [];

    if (await ctx.db.query("trustBadges").first()) {
      results.push("trustBadges already exist, skipping.");
    } else {
      const badges = [
        {
          icon: "BadgeCheck",
          title: "Certified & Tested",
          desc: "Every laptop passes a 40-point check before it's listed — screen, battery, keyboard, ports, performance.",
        },
        {
          icon: "ShieldCheck",
          title: "6-Month Warranty",
          desc: "Every laptop we sell — gaming or pre-owned — is covered for 6 months from the day you collect it.",
        },
        {
          icon: "MessageCircle",
          title: "Reserve, No Card Needed",
          desc: "Message us on WhatsApp to confirm stock and pricing, then pay and collect in person — no online payment required.",
        },
        {
          icon: "Truck",
          title: "Pan-India Delivery",
          desc: "Can't collect in person? We'll ship your laptop safely to your door, anywhere in India.",
        },
      ];
      for (let i = 0; i < badges.length; i++) {
        await ctx.db.insert("trustBadges", { ...badges[i], order: i, hidden: false });
      }
      results.push(`Seeded ${badges.length} trust badges.`);
    }

    if (await ctx.db.query("aboutHero").first()) {
      results.push("aboutHero already exists, skipping.");
    } else {
      await ctx.db.insert("aboutHero", {
        eyebrow: "About Us",
        title: "Good laptops, honestly priced",
        subtitle:
          "FactoryBuyo sells trending gaming laptops and certified pre-owned laptops to customers in India and Singapore — tested, graded, and backed by a 6-month warranty on everything we sell.",
      });
      results.push("Seeded about hero.");
    }

    if (await ctx.db.query("aboutPanels").first()) {
      results.push("aboutPanels already exist, skipping.");
    } else {
      const panels = [
        {
          title: "Our story",
          body: "FactoryBuyo started with a simple frustration: a good laptop shouldn't cost what a new one does, and a new one shouldn't be the only trustworthy option either. We built a place to buy both — trending gaming laptops and certified pre-owned laptops — without the inflated markups or the guesswork, for customers across India and Singapore.",
        },
        {
          title: "What we sell",
          body: "Two lines, chosen carefully rather than stocked broadly: trending gaming laptops from brands like Dell, Acer, HP and Lenovo, and certified pre-owned laptops that have been tested, graded and warrantied. No filler listings — if it's on FactoryBuyo, we'd sell it to a friend.",
        },
        {
          title: "How we source and test",
          body: "Every pre-owned laptop passes a 40-point check covering screen, battery, keyboard, ports and performance before it's graded Good, Very Good or Excellent and listed with real photos. Nothing is listed “refurbished” without being verified first.",
        },
        {
          title: "What to expect",
          body: "Reserve a laptop on WhatsApp, and we'll confirm price, condition and availability with you directly — no online payment required. Pay and collect in person, or have it delivered to your door.",
        },
      ];
      for (let i = 0; i < panels.length; i++) {
        await ctx.db.insert("aboutPanels", { ...panels[i], order: i, hidden: false });
      }
      results.push(`Seeded ${panels.length} about panels.`);
    }

    if (await ctx.db.query("contactInfo").first()) {
      results.push("contactInfo already exists, skipping.");
    } else {
      await ctx.db.insert("contactInfo", {
        email: "contact@factorybuyo.com",
        marketsNote:
          "We currently sell to customers in India and Singapore, with pricing shown in INR and SGD.",
      });
      results.push("Seeded contact info.");
    }

    const policyPages: {
      slug: "privacy-policy" | "terms-and-conditions" | "cancellation-policy";
      title: string;
      intro: string;
      lastUpdated: string;
      sections: { heading: string; body: string }[];
    }[] = [
      {
        slug: "privacy-policy",
        title: "Privacy Policy",
        intro: "How FactoryBuyo collects, uses and protects your information.",
        lastUpdated: "August 2026",
        sections: [
          {
            heading: "Information we collect",
            body: "We collect the information you choose to share with us when you browse our catalogue, reserve a laptop, or message us on WhatsApp — including your name, phone number, delivery address (if you request shipping), and details of the products you're interested in.\n\nWe do not collect payment card details through the website. FactoryBuyo does not process online payments — all payment happens directly between you and our team at the time of collection or delivery.",
          },
          {
            heading: "How we use your information",
            body: "- To confirm stock, pricing and availability for a laptop you've reserved.\n- To arrange collection or delivery of your order.\n- To provide warranty and after-sales support.\n- To respond to questions you send us through WhatsApp or email.",
          },
          {
            heading: "WhatsApp communications",
            body: "Reservations and order conversations happen over WhatsApp. Messages you send us there are subject to WhatsApp's own privacy practices in addition to ours. We use the details you share in that conversation only to complete your order and provide support for it.",
          },
          {
            heading: "Cookies and analytics",
            body: "The site may use basic, privacy-respecting analytics to understand which pages are useful and to fix problems. This data is aggregated and is not used to personally identify you.",
          },
          {
            heading: "Sharing your information",
            body: "We don't sell your information. We share it only where necessary to fulfil your order — for example, with a delivery partner when you request shipping — or where required by law.",
          },
          {
            heading: "Data security",
            body: "We take reasonable steps to protect the information you share with us. No method of storage or transmission is completely secure, but we limit access to customer information to the team members who need it to serve you.",
          },
          {
            heading: "Your rights",
            body: "You can ask us what information we hold about you, request a correction, or ask us to delete it, by contacting us using the details on our Contact page.",
          },
          {
            heading: "Changes to this policy",
            body: "We may update this policy from time to time. The date at the top of this page reflects the most recent revision.",
          },
          {
            heading: "Contact us",
            body: "Questions about this policy can be sent to contact@factorybuyo.com.",
          },
        ],
      },
      {
        slug: "terms-and-conditions",
        title: "Terms and Conditions",
        intro: "The terms that apply when you browse or reserve a laptop through FactoryBuyo.",
        lastUpdated: "August 2026",
        sections: [
          {
            heading: "About FactoryBuyo",
            body: "FactoryBuyo sells new gaming laptops and certified pre-owned (refurbished) laptops to customers in India and Singapore. By using this website, you agree to the terms below.",
          },
          {
            heading: "Product listings and availability",
            body: "We aim to keep stock, pricing and specifications accurate, but availability can change quickly — especially for pre-owned units, which exist in single units rather than open-ended stock. We'll always confirm final availability and price with you on WhatsApp before your order is treated as placed.",
          },
          {
            heading: "Refurbished condition grading",
            body: "Pre-owned laptops are graded and tested before listing:\n\n- Good — visible signs of use, light scratches or marks possible. Fully tested and functional, 80%+ battery health.\n- Very Good — minor wear only visible up close. Fully tested and functional, 85%+ battery health.\n- Excellent — minimal to no visible wear, close to like-new condition. Fully tested, 90%+ battery health.\n\nEvery laptop, new or pre-owned, passes a 40-point check before it's listed.",
          },
          {
            heading: "Reservations and orders",
            body: "Browsing the site does not place an order. Selecting “Contact on WhatsApp” opens a conversation with our team to confirm the exact laptop, condition, price and availability. An order is confirmed only once we've agreed these details with you over WhatsApp.",
          },
          {
            heading: "Pricing and payment",
            body: "Prices are shown in INR for India and SGD for Singapore. FactoryBuyo does not collect payment through the website — payment is made directly to us at the point of collection or delivery, using a method we agree with you on WhatsApp.",
          },
          {
            heading: "Delivery",
            body: "We offer delivery within the markets we serve, or collection in person where available. Delivery timelines are confirmed on WhatsApp once your order is placed and can vary by location and product.",
          },
          {
            heading: "Warranty",
            body: "Every laptop we sell is covered by a 6-month warranty from the day you collect or receive it, covering functional defects that aren't the result of accidental damage or misuse. Contact us on WhatsApp to make a warranty claim.",
          },
          {
            heading: "Limitation of liability",
            body: "FactoryBuyo is not liable for indirect or consequential loss arising from use of this website or a product purchased through it, beyond what is required by applicable law.",
          },
          {
            heading: "Governing law",
            body: "These terms are governed by the laws of the country in which your order is placed and fulfilled (India or Singapore).",
          },
          {
            heading: "Changes to these terms",
            body: "We may update these terms from time to time. The date at the top of this page reflects the most recent revision.",
          },
          {
            heading: "Contact us",
            body: "Questions about these terms can be sent to contact@factorybuyo.com.",
          },
        ],
      },
      {
        slug: "cancellation-policy",
        title: "Cancellation Policy",
        intro: "Because FactoryBuyo doesn't take payment online, cancelling is simple.",
        lastUpdated: "August 2026",
        sections: [
          {
            heading: "Cancelling a reservation",
            body: "Since no payment is collected through the website, you can cancel a reservation at any point before payment is made, at no cost — just let us know on WhatsApp. Nothing further is owed.",
          },
          {
            heading: "Cancelling after payment",
            body: "If you've already paid at the point of collection or delivery and need to cancel, message us on WhatsApp as soon as possible. Because pre-owned laptops are single units rather than restockable inventory, cancellations after payment are handled case by case — we'll always aim for a full refund where the laptop hasn't left our hands or been prepared specifically for your order.",
          },
          {
            heading: "Refusing delivery",
            body: "If a delivered laptop arrives damaged or doesn't match what was agreed on WhatsApp, you can refuse it at the door or return it within 48 hours of receipt. Contact us immediately so we can arrange a replacement or refund.",
          },
          {
            heading: "This isn't a warranty claim",
            body: "A fault that develops after you've accepted and used the laptop is covered under our 6-month warranty, not this cancellation policy. See our Terms and Conditions for warranty details.",
          },
          {
            heading: "How to cancel",
            body: "Message us on WhatsApp with your name and the laptop you reserved or ordered. We'll confirm the cancellation and, if applicable, the refund timeline.",
          },
          {
            heading: "Refunds",
            body: "Since we don't process payment online, refunds are made back to you using whichever method the original payment was made with, agreed directly with our team.",
          },
          {
            heading: "Contact us",
            body: "For any cancellation, reach us on WhatsApp or at contact@factorybuyo.com.",
          },
        ],
      },
    ];

    for (const p of policyPages) {
      const existing = await ctx.db
        .query("policyPages")
        .withIndex("by_slug", (q) => q.eq("slug", p.slug))
        .unique();
      if (existing) {
        results.push(`${p.slug} already exists, skipping.`);
        continue;
      }
      await ctx.db.insert("policyPages", {
        slug: p.slug,
        title: p.title,
        intro: p.intro,
        lastUpdated: p.lastUpdated,
      });
      for (let i = 0; i < p.sections.length; i++) {
        await ctx.db.insert("policySections", {
          pageSlug: p.slug,
          heading: p.sections[i].heading,
          body: p.sections[i].body,
          order: i,
        });
      }
      results.push(`Seeded ${p.slug} (${p.sections.length} sections).`);
    }

    return results.join(" ");
  },
});

// Run once after deploying: npx convex run seed:seedFaq
export const seedFaq = internalMutation({
  args: {},
  handler: async (ctx) => {
    if (await ctx.db.query("faqs").first()) {
      return "faqs already exist, skipping.";
    }

    const faqs = [
      {
        question: "How do you grade the condition of pre-owned laptops?",
        answer:
          "Every pre-owned laptop is graded Good, Very Good or Excellent. Good means visible signs of use with light scratches possible, 80%+ battery health. Very Good means only minor wear visible up close, 85%+ battery health. Excellent means minimal to no visible wear, close to like-new, 90%+ battery health. All three are fully tested and functional — the grade is about cosmetic condition, not whether it works.",
      },
      {
        question: "What testing does every laptop go through?",
        answer:
          "A 40-point check covering screen, battery, keyboard, ports and performance, before it's ever listed. This applies to every laptop we sell, new or pre-owned.",
      },
      {
        question: "What warranty do I get?",
        answer:
          "Every laptop we sell is covered by a 6-month warranty from the day you collect or receive it, covering functional defects that aren't the result of accidental damage or misuse. Message us on WhatsApp to make a claim.",
      },
      {
        question: "How does delivery work?",
        answer:
          "You can collect in person where available, or we'll ship your laptop safely to your door. We currently deliver to customers in India and Singapore — we'll confirm timelines and cost with you on WhatsApp once your order is placed.",
      },
      {
        question: "Can I cancel or return my order?",
        answer:
          "Since we don't take payment online, you can cancel a reservation any time before payment at no cost. If a delivered laptop arrives damaged or doesn't match what was agreed, you can refuse it at the door or return it within 48 hours of receipt. See our Cancellation Policy for the full details.",
      },
      {
        question: "How do I pay?",
        answer:
          "FactoryBuyo doesn't collect payment online — no card details are needed to reserve a laptop. Once we've confirmed the exact laptop, condition, price and availability with you on WhatsApp, you pay directly at the point of collection or delivery.",
      },
      {
        question: "How do I know if a laptop is still available?",
        answer:
          "Pre-owned laptops exist as single units rather than open-ended stock, so availability can change quickly. Message us on WhatsApp with the laptop you're interested in and we'll confirm live availability and price before anything is treated as reserved.",
      },
      {
        question: "What if something goes wrong after I buy?",
        answer:
          "You're covered by our 6-month warranty for functional defects. Message us on WhatsApp with your order details and we'll take it from there — no separate claims portal or form.",
      },
    ];

    const ids: Id<"faqs">[] = [];
    for (let i = 0; i < faqs.length; i++) {
      ids.push(await ctx.db.insert("faqs", { ...faqs[i], order: i, hidden: false }));
    }

    await ctx.db.insert("faqSettings", {
      heading: "Still have questions?",
      intro: "Answers to what customers most often ask before buying.",
      defaultOpenId: ids[0],
      ctaEnabled: true,
      ctaText: "Still stuck? Ask us on WhatsApp",
    });

    return `Seeded ${faqs.length} FAQs and settings.`;
  },
});

// Run once after deploying: npx convex run seed:seedBrands
export const seedBrands = internalMutation({
  args: {},
  handler: async (ctx) => {
    if (await ctx.db.query("brands").first()) {
      return "brands already exist, skipping.";
    }

    const brands = [
      { name: "Dell", logo: "/placeholders/brands/dell.svg" },
      { name: "HP", logo: "/placeholders/brands/hp.svg" },
      { name: "Lenovo", logo: "/placeholders/brands/lenovo.svg" },
      { name: "Acer", logo: "/placeholders/brands/acer.svg" },
      { name: "Apple", logo: "/placeholders/brands/apple.svg" },
      { name: "Microsoft", logo: "/placeholders/brands/microsoft.svg" },
    ];

    for (let i = 0; i < brands.length; i++) {
      await ctx.db.insert("brands", {
        name: brands[i].name,
        logo: brands[i].logo,
        order: i,
        hidden: false,
        mode: "auto",
        matchBrand: brands[i].name,
        sortBy: "default",
        onlyInStock: true,
        visibleCount: 8,
        productIds: [],
      });
    }

    await ctx.db.insert("brandSwitcherSettings", {
      heading: "Shop by brand",
      intro: "Pick a brand to see what we currently have in stock.",
      ctaLabel: "See all laptops",
      ctaHref: "/search",
    });

    return `Seeded ${brands.length} brands and settings.`;
  },
});

// Run once after deploying: npx convex run seed:seedMenu
export const seedMenu = internalMutation({
  args: {},
  handler: async (ctx) => {
    if (await ctx.db.query("menuItems").first()) {
      return "menuItems already exist, skipping.";
    }

    const categories = [
      { label: "Gaming Laptops", href: "/gaming-laptops", icon: "Gamepad2" },
      { label: "Pre-Owned Laptops", href: "/preowned-laptops", icon: "Recycle" },
      { label: "Hot Deals", href: "/hot-deals", icon: "Flame" },
    ];
    for (let i = 0; i < categories.length; i++) {
      await ctx.db.insert("menuItems", {
        kind: "category",
        label: categories[i].label,
        href: categories[i].href,
        icon: categories[i].icon,
        order: i,
        hidden: false,
      });
    }

    const info = [
      { label: "About Us", href: "/about", icon: "Info" },
      { label: "Terms and Conditions", href: "/terms-and-conditions", icon: "FileText" },
      { label: "Cancellation Policy", href: "/cancellation-policy", icon: "RotateCcw" },
      { label: "Privacy Policy", href: "/privacy-policy", icon: "ShieldCheck" },
      { label: "Contact Information", href: "/contact", icon: "Mail" },
      { label: "FAQs", href: "/#faq", icon: "HelpCircle" },
    ];
    for (let i = 0; i < info.length; i++) {
      await ctx.db.insert("menuItems", {
        kind: "info",
        label: info[i].label,
        href: info[i].href,
        icon: info[i].icon,
        order: i,
        hidden: false,
      });
    }

    return `Seeded ${categories.length} categories and ${info.length} info links.`;
  },
});

// Run once after deploying: npx convex run seed:seedRegions
export const seedRegions = internalMutation({
  args: {},
  handler: async (ctx) => {
    if (await ctx.db.query("regionSettings").first()) {
      return "regionSettings already exist, skipping.";
    }

    const bannerText =
      "Reserve your laptop online, pay & collect at pickup — no card details needed.";

    await ctx.db.insert("regionSettings", {
      code: "IN",
      label: "INR",
      flag: "🇮🇳",
      bannerText,
      deliveryNote: "Shipped safely to your door, anywhere in India.",
      enabled: true,
    });

    await ctx.db.insert("regionSettings", {
      code: "SG",
      label: "SGD",
      flag: "🇸🇬",
      bannerText,
      deliveryNote: "Shipped safely to your door, anywhere in Singapore.",
      enabled: true,
    });

    return "Seeded 2 regions.";
  },
});
