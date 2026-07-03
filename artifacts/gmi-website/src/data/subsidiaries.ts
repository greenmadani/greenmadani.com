export interface Subsidiary {
  name: string;
  slug: string;
  industry: string;
  desc: string;
  longDescription: string;
  services: string[];
  targetAudience: string;
  website?: string;
}

export const subsidiaries: Subsidiary[] = [
  {
    name: "GMI Power Agro",
    slug: "gmi-power-agro",
    industry: "Agriculture",
    desc: "Hybrid seeds, organic fertilizers, and export-quality rice — powering Bangladesh's agricultural transformation with American-formula solutions.",
    longDescription: "GMI Power Agro is the agricultural backbone of the group, delivering hybrid seeds, organic fertilizers, and high-yield rice varieties developed through American-formula R&D. Our farm-to-market model ensures farmers get quality inputs at fair prices while consumers receive safe, chemical-free produce. With operations spanning 42 districts, we are building a self-reliant agricultural ecosystem that boosts yields, protects soil health, and creates sustainable livelihoods for thousands of farmers across Bangladesh.",
    services: ["Hybrid seed development & distribution", "Organic fertilizer production", "High-yield rice varieties", "Farmer training & support programs", "Contract farming & buyback agreements", "Soil health testing & consulting"],
    targetAudience: "Farmers, agricultural cooperatives, government agriculture departments, and food processing companies seeking reliable, high-quality agricultural inputs and farm-to-market partnerships.",
    website: "https://gmipoweragro.com"
  },
  {
    name: "GMI Essential Food & Consumer",
    slug: "gmi-essential-food-consumer",
    industry: "Food & FMCG",
    desc: "Rice, oil, flour, and packaged food essentials delivered through a fully integrated farm-to-shelf supply chain.",
    longDescription: "GMI Essential Food & Consumer manages the group's entire food supply chain — from procurement and processing to packaging and retail distribution. We produce and distribute essential commodities including rice, cooking oil, flour, lentils, spices, and packaged food items under trusted brand names. Our vertically integrated model ensures quality control at every stage, competitive pricing, and consistent availability across urban and rural markets.",
    services: ["Rice milling & packaging", "Edible oil refining", "Flour & grain processing", "Private label manufacturing", "Bulk supply to institutions", "Retail distribution network"],
    targetAudience: "Retail chains, wholesale distributors, hotels & restaurants, institutional buyers, and export partners seeking high-volume, quality-guaranteed food commodities.",
    website: "https://gmifood.com"
  },
  {
    name: "GMI Beverage",
    slug: "gmi-beverage",
    industry: "Beverages",
    desc: "Pure drinking water, natural fruit juices, and healthy soft drinks crafted for everyday wellness.",
    longDescription: "GMI Beverage produces a growing range of healthy, refreshing beverages including purified drinking water, natural fruit juices, and low-sugar soft drinks. Our manufacturing facilities adhere to international food safety standards, using modern filtration and processing technology. We are committed to reducing plastic waste through recyclable packaging and sustainable production practices.",
    services: ["Bottled water production", "Fruit juice manufacturing", "Carbonated soft drinks", "Private label beverage production", "Bulk water supply", "Recyclable packaging solutions"],
    targetAudience: "Retailers, supermarkets, hotels, restaurants, corporate offices, and event organizers looking for trusted, high-quality beverage brands.",
    website: "https://gmibeverage.com"
  },
  {
    name: "GMI Hospital",
    slug: "gmi-hospital",
    industry: "Healthcare",
    desc: "Multi-specialized and digital healthcare services bringing modern medical care closer to communities.",
    longDescription: "GMI Hospital brings quality healthcare to communities through multi-specialty medical services, digital health platforms, and diagnostic centers. We combine experienced medical professionals with modern technology to offer affordable, accessible healthcare. Our services range from primary care and emergency medicine to specialized treatments in cardiology, orthopedics, gynecology, and pediatrics.",
    services: ["Multi-specialty outpatient clinics", "Inpatient & emergency care", "Diagnostic imaging & laboratory", "Telemedicine consultations", "Health screening programs", "Pharmacy services"],
    targetAudience: "Local communities, corporate clients seeking employee health programs, insurance partners, and government healthcare initiatives.",
  },
  {
    name: "GMI Hotel & Resort",
    slug: "gmi-hotel-resort",
    industry: "Hospitality",
    desc: "Luxury city hotels and eco-friendly resorts offering premium hospitality experiences nationwide.",
    longDescription: "GMI Hotel & Resort operates a chain of city hotels and eco-friendly resorts designed to offer world-class hospitality with a distinctly Bangladeshi touch. Our properties blend modern amenities with local culture and sustainable practices. From business travelers to vacationing families, we provide comfortable accommodations, fine dining, event spaces, and recreational facilities across prime locations.",
    services: ["Luxury hotel accommodations", "Eco-resort experiences", "Fine dining restaurants", "Conference & event venues", "Spa & wellness centers", "Tour & excursion packages"],
    targetAudience: "Business travelers, tourists, event planners, corporate clients, and government agencies seeking premium hospitality services.",
  },
  {
    name: "GMI Supermarket",
    slug: "gmi-supermarket",
    industry: "Retail",
    desc: "City-based chain supermarkets with online delivery, bringing GMI's farm-fresh products directly to customers.",
    longDescription: "GMI Supermarket is the group's retail arm, operating modern supermarkets in urban centers. Our stores offer a wide range of products including fresh produce, groceries, household essentials, and GMI's own branded products. With an integrated online ordering and delivery system, we make quality shopping convenient and accessible. Every store reflects our commitment to freshness, quality, and customer service.",
    services: ["Fresh produce & grocery retail", "GMI brand product showcase", "Online ordering & home delivery", "Bulk & wholesale purchasing", "Loyalty & rewards program", "Corporate supply partnerships"],
    targetAudience: "Urban households, working professionals, corporate cafeterias, and small retailers seeking reliable supply of fresh and packaged goods.",
  },
  {
    name: "GMI Tour & Travels",
    slug: "gmi-tour-travels",
    industry: "Travel & Tourism",
    desc: "Hajj, Umrah, and domestic and international tour packages designed for comfort and trust.",
    longDescription: "GMI Tour & Travels provides comprehensive travel services including Hajj and Umrah pilgrimage packages, domestic tours, and international travel arrangements. With years of experience and a dedicated team, we ensure safe, comfortable, and spiritually fulfilling journeys. Our services include visa processing, flight bookings, hotel reservations, transportation, and guided tours — all managed with the highest standards of care and professionalism.",
    services: ["Hajj & Umrah pilgrimage packages", "Domestic tour packages", "International travel arrangements", "Visa processing & documentation", "Flight & hotel bookings", "Group tour coordination"],
    targetAudience: "Pilgrims, holiday travelers, corporate travel departments, and educational institutions seeking organized tour services.",
  },
  {
    name: "GMI Education",
    slug: "gmi-education",
    industry: "Education",
    desc: "Schools, vocational training centers, and online learning platforms building the workforce of tomorrow.",
    longDescription: "GMI Education is building the next generation of skilled professionals through quality schools, vocational training centers, and digital learning platforms. Our curriculum combines academic excellence with practical skills development, preparing students for both higher education and meaningful employment. We focus on STEM education, vocational trades, and soft skills to create a workforce ready for the challenges of a modern economy.",
    services: ["K-12 school education", "Vocational & technical training", "Online learning platform", "Career counseling & placement", "Teacher training programs", "Educational content development"],
    targetAudience: "Students, parents, working professionals seeking upskilling, government education departments, and corporate training partners.",
  },
  {
    name: "GMI Skin Care",
    slug: "gmi-skin-care",
    industry: "Beauty & Personal Care",
    desc: "Herbal, organic, and medical-grade skincare products formulated for natural beauty and wellness.",
    longDescription: "GMI Skin Care offers a complete range of herbal, organic, and medical-grade skincare and personal care products. Our formulations use natural ingredients combined with modern dermatological research to deliver safe, effective results. From daily skincare routines to specialized treatments, our products cater to diverse skin types and concerns. We are committed to cruelty-free, environmentally sustainable production practices.",
    services: ["Herbal skincare products", "Organic personal care range", "Medical-grade dermatological solutions", "Custom formulation for brands", "Wholesale & retail distribution", "Beauty consultation services"],
    targetAudience: "Beauty & wellness retailers, dermatology clinics, export partners, and conscious consumers seeking natural, effective skincare solutions.",
  },
  {
    name: "GMI Fashion House",
    slug: "gmi-fashion-house",
    industry: "Apparel & Fashion",
    desc: "Export-quality garments for men, women, and children — combining comfort, style, and sustainability.",
    longDescription: "GMI Fashion House manufactures and exports high-quality garments for men, women, and children. Our production facilities combine skilled craftsmanship with modern manufacturing technology to deliver apparel that meets international standards. We produce everything from casual wear and formal attire to specialized workwear and uniforms. Sustainability is at the core of our operations, with eco-friendly materials and ethical labor practices.",
    services: ["Garment manufacturing & export", "Custom uniform production", "Private label apparel", "Fabric sourcing & development", "Quality control & compliance", "Sustainable fashion consulting"],
    targetAudience: "International apparel brands, retailers, corporate uniform buyers, and export houses seeking reliable, ethical garment manufacturing partnerships.",
  },
  {
    name: "GMI News & Media",
    slug: "gmi-news-media",
    industry: "Media & Communications",
    desc: "Digital news portal and in-house brand promotion center powering zero-cost marketing across the group.",
    longDescription: "GMI News & Media operates a digital news portal and serves as the group's in-house brand promotion and communications hub. We produce news content, multimedia marketing materials, and brand campaigns that amplify GMI's reach at zero external marketing cost. Our platform covers industry insights, company updates, and stories that showcase the group's impact across Bangladesh.",
    services: ["Digital news publishing", "Brand content production", "Social media management", "Video & multimedia production", "Corporate communications", "Marketing campaign management"],
    targetAudience: "Online news consumers, GMI group companies, partner organizations, and brands seeking content and media production services.",
  },
  {
    name: "GMI R&D Center",
    slug: "gmi-rd-center",
    industry: "Research & Development",
    desc: "The innovation engine behind GMI — developing new products and ensuring quality control across every vertical.",
    longDescription: "GMI R&D Center is the innovation hub of the group, driving product development, quality assurance, and process improvement across all subsidiaries. Our team of scientists, food technologists, and engineers work on developing new formulations, improving existing products, and ensuring compliance with national and international standards. From seed research to beverage formulation, the R&D Center is at the heart of GMI's commitment to quality and innovation.",
    services: ["New product development", "Quality control & testing", "Food safety certification", "Agricultural research", "Process optimization", "Regulatory compliance support"],
    targetAudience: "All GMI group companies, external brands seeking R&D partnerships, regulatory bodies, and quality certification agencies.",
  },
];
