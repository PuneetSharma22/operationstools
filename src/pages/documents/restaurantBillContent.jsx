// Static SEO / marketing copy for the Restaurant Bill Generator page.
// Pulled out of RestaurantBillPage.jsx so the page file is about behaviour and
// this file is about words — the two change for completely different reasons.

export const SEO_TITLE = "Free Restaurant Bill Generator Online — 4 Receipt Formats (2026)";
export const SEO_DESCRIPTION = "Generate a restaurant or cafe bill online for free. Formal, POS, and thermal receipt formats with CGST/SGST and service charge. No login. Instant PDF.";
export const CANONICAL = "https://www.opstools.ai/documents/restaurant-bill";

export const softwareAppSchema = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "OpsTools Restaurant Bill Generator", operatingSystem: "Web", applicationCategory: "BusinessApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "INR" }, description: SEO_DESCRIPTION, url: CANONICAL, provider: { "@type": "Organization", name: "OpsTools", url: "https://www.opstools.ai" } };

export const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [{ "@type": "Question", name: "Is this restaurant bill generator free to use?", acceptedAnswer: { "@type": "Answer", text: "Yes, completely free with no login required." } }, { "@type": "Question", name: "Which receipt format should I use?", acceptedAnswer: { "@type": "Answer", text: "Formal Receipt suits a sit-down restaurant, Classic POS matches a typical billing-counter printout, and the two Thermal formats match small thermal receipt printers used at cafes and quick-service counters." } }, { "@type": "Question", name: "Does it calculate service charge and GST?", acceptedAnswer: { "@type": "Answer", text: "Yes — service charge, CGST and SGST percentages are all configurable and the totals, including round-off, are calculated automatically." } }, { "@type": "Question", name: "Does this generate a PDF?", acceptedAnswer: { "@type": "Answer", text: "Yes. Click Save to download the bill as a PDF or PNG." } }] };

export const INTRO = (<><p style={{ marginBottom: 16 }}>Running a restaurant or cafe without a full POS system? OpsTools Restaurant Bill Generator lays out a proper itemised bill in under a minute — pick a receipt format, add your dishes, and the service charge, CGST/SGST and total calculate themselves.</p><p>Four formats cover how bills actually get printed in India: a Formal Receipt for a sit-down restaurant, a Classic POS layout, and two thermal formats for the small receipt printers common at cafes and quick-service counters. The preview updates live as you type, and your data never leaves your browser.</p></>);

export const WHAT_IS = `A restaurant bill is the itemised receipt given to a customer at a restaurant, cafe or food outlet, listing each dish ordered along with service charge, applicable GST (CGST/SGST), and the final total. It serves as proof of purchase for the customer and a billing record for the outlet.`;

export const WHY_USE = [{ title: "Small restaurants & cafes", body: "Generate professional, itemised bills without investing in a full POS system." }, { title: "Quick-service counters", body: "The thermal formats match the compact receipts customers expect from a counter printer." }, { title: "Pop-ups & food stalls", body: "Issue a proper bill even without a permanent billing setup." }, { title: "Expense records", body: "Customers can keep a clean, itemised bill for business meal expense claims." }];

export const FEATURES = [{ icon: "🧾", title: "4 receipt formats", body: "Formal Receipt, Classic POS, Thermal Full, and Thermal Compact." }, { icon: "🍽️", title: "Itemised dishes", body: "Add any number of dishes with quantity and price — the bill itemises each one." }, { icon: "🧮", title: "Service charge & GST", body: "Configurable service charge, CGST and SGST percentages, with automatic round-off." }, { icon: "👁️", title: "Live preview", body: "See the bill update in real time as you fill the form." }, { icon: "⬇️", title: "PDF or PNG download", body: "One click downloads the bill — no print dialog needed." }, { icon: "🔒", title: "100% private", body: "No data is stored or transmitted. Everything happens in your browser." }, { icon: "🆓", title: "No login needed", body: "No account, no email, no credit card." }];

export const HOW_TO_STEPS = [{ step: 1, title: "Choose a receipt format", body: "Formal, Classic POS, Thermal Full, or Thermal Compact." }, { step: 2, title: "Add restaurant details", body: "Name, address, GSTIN and FSSAI number." }, { step: 3, title: "Enter bill details", body: "Bill number, date/time, table or dine-in number." }, { step: 4, title: "Add dishes", body: "List each item with quantity and price." }, { step: 5, title: "Set service charge & GST", body: "Configure the percentages — totals calculate automatically." }, { step: 6, title: "Download PDF or PNG", body: "Click Save to download the finished bill." }];

export const BENEFITS = ["Generate unlimited bills — no caps or credit limits.", "No registration or sign-up required.", "Automatic service charge, GST and round-off calculation.", "Four formats match real Indian restaurant receipt styles.", "All data stays in your browser — zero privacy risk.", "Completely free — no subscription."];

export const FORMAT_FIELDS = [{ field: "Restaurant Name", description: "Name of the restaurant or cafe", example: "Kake Da Hotel" }, { field: "GSTIN", description: "Restaurant's GST registration number", example: "27AABCU9603R1ZX" }, { field: "FSSAI No.", description: "Food safety license number", example: "14-digit license no." }, { field: "Bill No. / Dine In", description: "Bill number and table/dine-in reference", example: "50455 / Table 5" }, { field: "Service Charge", description: "Optional service charge percentage", example: "10%" }, { field: "CGST / SGST", description: "GST split for restaurant services", example: "2.5% + 2.5%" }];

export const FAQS = faqSchema.mainEntity.map((i) => ({ q: i.name, a: i.acceptedAnswer.text }));

export const RELATED_DOCS = [{ name: "Hotel Bill Generator", href: "/documents/hotel-bill", description: "Hotel stay receipts for reimbursement." }, { name: "Medical Bill Generator", href: "/documents/medical-bill", description: "Hospital & pharmacy expense receipts." }, { name: "Quotation Generator", href: "/documents/quotation", description: "Price quotes with validity and terms." }];

export const BREADCRUMBS = [
  { name: "Home", url: "https://www.opstools.ai" },
  { name: "Documents", url: "https://www.opstools.ai/documents" },
  { name: "Restaurant Bill Generator", url: CANONICAL },
];
