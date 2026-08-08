import { internalMutation } from "./_generated/server";
import { seedProducts } from "./seedData";

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
