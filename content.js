// Copy and demo data for the Edukaan POS landing page (EN / AR × UAE / KSA).
// Ported verbatim from the Claude Design file "Edukaan POS Page v2".

// Arabic display names map to the same slot id as the English ones so one drop fills both languages.
const LOGO_KEYS = { 'Apple Pay': 'applepay', 'Samsung Pay': 'samsungpay', 'Amazon.ae': 'amazon', 'Amazon.sa': 'amazon', 'Oracle NetSuite': 'netsuite', 'SAP': 'sap', 'ZATCA': 'zatca', 'Ingenico': 'ingenico', 'تابي': 'tabby', 'تمارا': 'tamara', 'نون': 'noon', 'تريدلينج': 'tradeling', 'مدى': 'mada', 'أمازون': 'amazon', 'هيئة الزكاة والضريبة والجمارك': 'zatca' };
const LOGO_SRC = Object.fromEntries(['visa','mastercard','applepay','samsungpay','tamara','tabby','amazon','noon','tradeling','odoo','netsuite','sap','zatca','ingenico'].map(k => [k, 'assets/int-' + k + '.png']));
const TRUSTED = [{ key: 'samsung', name: 'Samsung', src: 'assets/trusted-samsung.png' }, { key: 'huawei', name: 'Huawei', src: 'assets/trusted-huawei.png' }];

const LANG_LABELS = {"en":"EN","ar":"عربي","hi":"हिंदी","ur":"اردو"};

const COPY = {
  en: {
    names: { AE: 'United Arab Emirates', SA: 'Saudi Arabia' }, langName: 'English',
    base: {
      langTitle: 'Language', navFeatures: 'Features', navHardware: 'Hardware', navPricing: 'Pricing', navFaq: 'FAQ', regionTitle: 'Choose your market',
      cta: 'Talk to us on WhatsApp', ctaShort: 'WhatsApp us', ctaNote: 'Replies within the hour',
      heroA: 'Built for the ', heroB: 'busy', heroC: ' counter.', posLine: 'Edukaan POS',
      scanHint: 'Scan barcode or search…', total: 'Total', paidLabel: 'Paid · receipt printed', payWith: 'Pay with', backedBy: 'Backed by',
      featTitle: 'Everything your store needs, in one screen.', featSub: 'Scroll to see how a day at the counter runs on Edukaan.',
      hubOverline: 'One POS does everything', hubTitle: 'Every part of your shop runs through the till.', hubCore: 'Edukaan POS', hubCoreSub: 'One login · one stock · one set of numbers',
      replTitle: 'Automatic replenishment', replOn: 'Auto',
      repOverline: 'Reporting', repTitle: 'Know what you stock, what sells, and what doesn’t.', repBody: 'Revenue, margin and stock per item, per branch, per day. Edukaan turns every sale into a number you can act on.',
      repDash: 'Owner dashboard', repRange: 'Last 7 days', repChart: 'Daily revenue', repChartNote: 'Today highlighted', repTop: 'Top sellers', repSlow: 'Slow movers',
      recOverline: 'Automatic replenishment', recTitle: 'Low on stock? It’s already reordered.', recHead: 'WHAT YOU GET', recSystems: 'Systems to juggle', recSetup: 'Setup', recSetupVal: '1 session', recContract: 'Contract', recContractVal: 'None', recThanks: 'Thank you for shopping local',
      stepsTitle: 'Live in one session.',
      hwTitle: 'Hardware, delivered and installed', hwNote: 'Or bring your own Android tablet.',
      intTitle: 'Works with', intPay: 'Payments Integration', intMarket: 'Marketplace Integration', intErp: 'ERP Integration', intHeadline: 'Plugs into the payments, marketplaces and ERPs you already use.', priceTitle: 'Pricing', priceSub: 'Start free. Pay when the system is already making you money.', priceNote: 'Excl. VAT. Hardware sold or leased separately.', priceBadge: 'Most retailers', notIncluded: 'Not included',
      faqTitle: 'Questions shop owners ask', contactTitle: 'Let’s get your counter busy.', formTitle: 'Or request a call back', fName: 'Your name', fPhone: 'WhatsApp number', fSend: 'Send',
      footBlurb: 'Edukaan is the POS from Tradeling Group, the region’s B2B platform for sourcing and distribution.', footGroup: 'A Tradeling Group brand', footContact: 'Contact', footRights: 'All rights reserved.', footPrivacy: 'Privacy policy',
      trustedBy: 'Trusted by',
    },
    AE: {
      countryTag: 'UAE', heroSub: 'The POS for independent retailers: checkout, stock, BNPL and marketplace orders in one system. UAE VAT compliant, works offline.',
      saleNo: 'Sale #4821', saleMeta: 'Al Barsha · Till 2', vatLine: 'incl. VAT 5%', compFoot: 'FTA tax invoice ready', lowStock: 'Low stock · Al Ain 500ml', reorder: 'Reorder from Tradeling',
      footAddr: 'Building 9W, 5th floor, Dubai Airport Freezone (DAFZ), Dubai, UAE',
      recBody: 'Set a minimum level per item. When stock dips below it, Edukaan drafts the wholesale order from Tradeling; approve with one tap or let it run fully automatic. Delivered next day across Dubai, Sharjah and Abu Dhabi.', recSupplier: 'Wholesale supply by Tradeling',
    },
    SA: {
      countryTag: 'KSA', heroSub: 'The POS for electronics retailers: checkout, IMEI tracking, BNPL and marketplace orders in one system. ZATCA Phase 2 built in, works offline.',
      saleNo: 'Sale #4821', saleMeta: 'Olaya · Till 2', vatLine: 'incl. VAT 15%', compFoot: 'ZATCA e-invoice · QR ready', lowStock: 'Low stock · 25W chargers', reorder: 'Reorder from Axiom',
      footAddr: 'Axiom by Tradeling · Riyadh, Saudi Arabia',
      recBody: 'Set a minimum level per item. When stock dips below it, Edukaan drafts the wholesale order from Axiom by Tradeling; approve with one tap or let it run fully automatic. Delivered across Riyadh, Jeddah and Dammam.', recSupplier: 'Wholesale supply by Axiom by Tradeling',
    },
  },
  ar: {
    names: { AE: 'الإمارات العربية المتحدة', SA: 'المملكة العربية السعودية' }, langName: 'العربية',
    base: {
      langTitle: 'اللغة', navFeatures: 'المزايا', navHardware: 'الأجهزة', navPricing: 'الأسعار', navFaq: 'الأسئلة', regionTitle: 'اختر السوق',
      cta: 'تواصل معنا على واتساب', ctaShort: 'واتساب', ctaNote: 'نرد خلال ساعة',
      heroA: 'صُنع لساعات ', heroB: 'الذروة', heroC: ' على الكاشير.', posLine: 'إدكان POS · نظام نقاط البيع',
      scanHint: 'امسح الباركود أو ابحث…', total: 'الإجمالي', paidLabel: 'تم الدفع · طُبعت الفاتورة', payWith: 'الدفع بـ', backedBy: 'بدعم من',
      featTitle: 'كل ما يحتاجه متجرك، في شاشة واحدة.', featSub: 'مرّر لترى كيف يمر يوم على الكاشير مع إدكان.',
      hubOverline: 'نظام واحد يقوم بكل شيء', hubTitle: 'كل جزء من متجرك يمر عبر الكاشير.', hubCore: 'إدكان POS', hubCoreSub: 'حساب واحد · مخزون واحد · أرقام واحدة',
      replTitle: 'إعادة التخزين التلقائية', replOn: 'تلقائي',
      repOverline: 'التقارير', repTitle: 'اعرف ما تخزّنه، وما يُباع، وما لا يُباع.', repBody: 'الإيرادات والهامش والمخزون لكل صنف وكل فرع وكل يوم. إدكان يحوّل كل عملية بيع إلى رقم يمكنك التصرف بناءً عليه.',
      repDash: 'لوحة المالك', repRange: 'آخر 7 أيام', repChart: 'الإيراد اليومي', repChartNote: 'اليوم مميز', repTop: 'الأكثر مبيعاً', repSlow: 'بطيئة الحركة',
      recOverline: 'إعادة التخزين التلقائية', recTitle: 'نقص في المخزون؟ تم الطلب مسبقاً.', recHead: 'ما ستحصل عليه', recSystems: 'عدد الأنظمة', recSetup: 'التركيب', recSetupVal: 'جلسة واحدة', recContract: 'العقد', recContractVal: 'بدون', recThanks: 'شكراً لدعمكم التجار المحليين',
      stepsTitle: 'تشغيل في جلسة واحدة.',
      hwTitle: 'أجهزة نوصلها ونركبها لك', hwNote: 'أو استخدم جهازك اللوحي.',
      intTitle: 'يعمل مع', intPay: 'تكامل المدفوعات', intMarket: 'تكامل المتاجر الإلكترونية', intErp: 'تكامل أنظمة ERP', intHeadline: 'يتكامل مع المدفوعات والمتاجر الإلكترونية وأنظمة ERP التي تستخدمها.', priceTitle: 'الأسعار', priceSub: 'ابدأ مجاناً. ادفع عندما يبدأ النظام بجني المال لك.', priceNote: 'غير شامل الضريبة. الأجهزة تُباع أو تُؤجّر بشكل منفصل.', priceBadge: 'معظم التجار', notIncluded: 'غير مشمول',
      faqTitle: 'أسئلة أصحاب المحلات', contactTitle: 'خلّ كاشيرك مشغول.', formTitle: 'أو اطلب مكالمة', fName: 'اسمك', fPhone: 'رقم واتساب', fSend: 'إرسال',
      footBlurb: 'إدكان هو نظام نقاط البيع من مجموعة تريدلينج، منصة B2B للتوريد والتوزيع في المنطقة.', footGroup: 'إحدى علامات مجموعة تريدلينج', footContact: 'تواصل', footRights: 'جميع الحقوق محفوظة.', footPrivacy: 'سياسة الخصوصية',
      trustedBy: 'يثق بنا',
    },
    AE: {
      countryTag: 'الإمارات', heroSub: 'البيع والمخزون والتقسيط وطلبات المتاجر الإلكترونية في نظام واحد. متوافق مع ضريبة الإمارات، ويعمل بدون إنترنت.',
      saleNo: 'فاتورة #4821', saleMeta: 'البرشاء · كاشير 2', vatLine: 'شامل الضريبة 5%', compFoot: 'فاتورة ضريبية معتمدة', lowStock: 'نقص مخزون · مياه العين 500مل', reorder: 'اطلب من تريدلينج',
      footAddr: 'مبنى 9W، الطابق الخامس، المنطقة الحرة بمطار دبي (DAFZ)، دبي، الإمارات',
      recBody: 'حدّد حداً أدنى لكل صنف. عندما ينخفض المخزون عنه، يُعدّ إدكان طلب الجملة من تريدلينج؛ وافق بضغطة واحدة أو اجعله تلقائياً بالكامل. التوصيل في اليوم التالي في دبي والشارقة وأبوظبي.', recSupplier: 'التوريد بالجملة من تريدلينج',
    },
    SA: {
      countryTag: 'السعودية', heroSub: 'البيع وتتبع IMEI والتقسيط وطلبات المتاجر الإلكترونية في نظام واحد. فاتورة المرحلة الثانية مدمجة، ويعمل بدون إنترنت.',
      saleNo: 'فاتورة #4821', saleMeta: 'العليا · كاشير 2', vatLine: 'شامل الضريبة 15%', compFoot: 'فاتورة إلكترونية · رمز QR', lowStock: 'نقص مخزون · شواحن 25 واط', reorder: 'اطلب من أكسيوم',
      footAddr: 'أكسيوم من تريدلينج · الرياض، السعودية',
      recBody: 'حدّد حداً أدنى لكل صنف. عندما ينخفض المخزون عنه، يُعدّ إدكان طلب الجملة من أكسيوم من تريدلينج؛ وافق بضغطة واحدة أو اجعله تلقائياً بالكامل. التوصيل في الرياض وجدة والدمام.', recSupplier: 'التوريد بالجملة من أكسيوم من تريدلينج',
    },
  },
  // Hindi and Urdu: only the strings below; anything missing falls back to English.
  hi: {
    names: {
      AE: "संयुक्त अरब अमीरात",
      SA: "सऊदी अरब"
    },
    langName: "हिंदी",
    base: {
      langTitle: "भाषा",
      navFeatures: "फ़ीचर",
      navHardware: "हार्डवेयर",
      navPricing: "कीमत",
      navFaq: "सवाल",
      regionTitle: "अपना बाज़ार चुनें",
      cta: "WhatsApp पर बात करें",
      ctaShort: "WhatsApp करें",
      ctaNote: "एक घंटे में जवाब",
      heroA: "भीड़ वाले ",
      heroB: "काउंटर",
      heroC: " के लिए बना है।",
      posLine: "Edukaan POS",
      scanHint: "बारकोड स्कैन करें या खोजें…",
      total: "कुल",
      paidLabel: "भुगतान हुआ · रसीद छपी",
      payWith: "भुगतान करें",
      backedBy: "सहयोग से",
      featTitle: "आपकी दुकान की हर ज़रूरत, एक स्क्रीन पर।",
      featSub: "स्क्रॉल करें और देखें कि Edukaan पर काउंटर का दिन कैसे चलता है।",
      hubOverline: "एक POS, सब काम",
      hubTitle: "आपकी दुकान का हर हिस्सा काउंटर से चलता है।",
      hubCore: "Edukaan POS",
      hubCoreSub: "एक लॉगिन · एक स्टॉक · एक हिसाब",
      replTitle: "ऑटोमैटिक री-स्टॉक",
      replOn: "ऑटो",
      repOverline: "रिपोर्टिंग",
      repTitle: "जानिए क्या स्टॉक है, क्या बिकता है, क्या नहीं।",
      repBody: "हर आइटम, हर ब्रांच, हर दिन का रेवेन्यू, मार्जिन और स्टॉक। Edukaan हर बिक्री को ऐसा आंकड़ा बनाता है जिस पर आप फ़ैसला ले सकें।",
      repDash: "मालिक का डैशबोर्ड",
      repRange: "पिछले 7 दिन",
      repChart: "दैनिक रेवेन्यू",
      repChartNote: "आज हाइलाइट में",
      repTop: "सबसे ज़्यादा बिकने वाले",
      repSlow: "धीमे बिकने वाले",
      recOverline: "ऑटोमैटिक री-स्टॉक",
      recTitle: "स्टॉक कम? ऑर्डर पहले ही हो गया।",
      recHead: "आपको क्या मिलता है",
      recSystems: "सिस्टम संभालने हैं",
      recSetup: "सेटअप",
      recSetupVal: "1 सेशन",
      recContract: "कॉन्ट्रैक्ट",
      recContractVal: "नहीं",
      recThanks: "लोकल दुकान से खरीदने के लिए धन्यवाद",
      stepsTitle: "एक सेशन में लाइव।",
      hwTitle: "हार्डवेयर, डिलीवर और इंस्टॉल किया हुआ",
      hwNote: "या अपना Android टैबलेट इस्तेमाल करें।",
      intTitle: "इनके साथ काम करता है",
      intPay: "पेमेंट इंटीग्रेशन",
      intMarket: "मार्केटप्लेस इंटीग्रेशन",
      intErp: "ERP इंटीग्रेशन",
      intHeadline: "आपके मौजूदा पेमेंट, मार्केटप्लेस और ERP से जुड़ता है।",
      priceTitle: "कीमत",
      priceSub: "मुफ़्त शुरू करें। तब पैसे दें जब सिस्टम आपकी कमाई बढ़ा रहा हो।",
      priceNote: "VAT अलग। हार्डवेयर अलग से बिकता या किराए पर मिलता है।",
      priceBadge: "ज़्यादातर दुकानदार",
      notIncluded: "शामिल नहीं",
      faqTitle: "दुकानदार जो सवाल पूछते हैं",
      contactTitle: "आपके काउंटर पर भीड़ लगाते हैं।",
      formTitle: "या कॉल बैक मांगें",
      fName: "आपका नाम",
      fPhone: "WhatsApp नंबर",
      fSend: "भेजें",
      footBlurb: "Edukaan, Tradeling Group का POS है, जो इस क्षेत्र का सोर्सिंग और डिस्ट्रीब्यूशन का B2B प्लैटफ़ॉर्म है।",
      footGroup: "Tradeling Group का ब्रांड",
      footContact: "संपर्क",
      footRights: "सर्वाधिकार सुरक्षित।",
      footPrivacy: "प्राइवेसी पॉलिसी",
      trustedBy: "इनका भरोसा"
    },
    AE: {
      countryTag: "UAE",
      heroSub: "छोटे दुकानदारों के लिए POS: चेकआउट, स्टॉक, BNPL और मार्केटप्लेस ऑर्डर एक सिस्टम में। UAE VAT के अनुसार, ऑफ़लाइन भी चलता है।",
      saleNo: "बिक्री #4821",
      saleMeta: "Al Barsha · काउंटर 2",
      vatLine: "VAT 5% सहित",
      compFoot: "FTA टैक्स इनवॉइस तैयार",
      lowStock: "स्टॉक कम · Al Ain 500ml",
      reorder: "Tradeling से दोबारा ऑर्डर",
      recBody: "हर आइटम की न्यूनतम मात्रा तय करें। स्टॉक उससे नीचे जाए तो Edukaan Tradeling से होलसेल ऑर्डर तैयार करता है; एक टैप में मंज़ूरी दें या पूरा ऑटोमैटिक चलाएं। दुबई, शारजाह और अबू धाबी में अगले दिन डिलीवरी।",
      recSupplier: "होलसेल सप्लाई Tradeling से"
    },
    SA: {
      countryTag: "KSA",
      heroSub: "इलेक्ट्रॉनिक्स दुकानदारों के लिए POS: चेकआउट, IMEI ट्रैकिंग, BNPL और मार्केटप्लेस ऑर्डर एक सिस्टम में। ZATCA फ़ेज़ 2 बिल्ट-इन, ऑफ़लाइन भी चलता है।",
      saleNo: "बिक्री #4821",
      saleMeta: "Olaya · काउंटर 2",
      vatLine: "VAT 15% सहित",
      compFoot: "ZATCA ई-इनवॉइस · QR तैयार",
      lowStock: "स्टॉक कम · 25W चार्जर",
      reorder: "Axiom से दोबारा ऑर्डर",
      recBody: "हर आइटम की न्यूनतम मात्रा तय करें। स्टॉक उससे नीचे जाए तो Edukaan Axiom by Tradeling से होलसेल ऑर्डर तैयार करता है; एक टैप में मंज़ूरी दें या पूरा ऑटोमैटिक चलाएं। रियाद, जेद्दा और दम्माम में डिलीवरी।",
      recSupplier: "होलसेल सप्लाई Axiom by Tradeling से"
    }
  },
  ur: {
    names: {
      AE: "متحدہ عرب امارات",
      SA: "سعودی عرب"
    },
    langName: "اردو",
    base: {
      langTitle: "زبان",
      navFeatures: "خصوصیات",
      navHardware: "ہارڈویئر",
      navPricing: "قیمت",
      navFaq: "سوالات",
      regionTitle: "اپنی مارکیٹ منتخب کریں",
      cta: "WhatsApp پر بات کریں",
      ctaShort: "WhatsApp کریں",
      ctaNote: "ایک گھنٹے میں جواب",
      heroA: "مصروف ",
      heroB: "کاؤنٹر",
      heroC: " کے لیے بنایا گیا۔",
      posLine: "Edukaan POS",
      scanHint: "بارکوڈ اسکین کریں یا تلاش کریں…",
      total: "کل",
      paidLabel: "ادائیگی ہو گئی · رسید چھپ گئی",
      payWith: "ادائیگی کریں",
      backedBy: "تعاون سے",
      featTitle: "آپ کی دکان کی ہر ضرورت، ایک اسکرین پر۔",
      featSub: "اسکرول کریں اور دیکھیں کہ Edukaan پر کاؤنٹر کا دن کیسے چلتا ہے۔",
      hubOverline: "ایک POS، سب کام",
      hubTitle: "آپ کی دکان کا ہر حصہ کاؤنٹر سے چلتا ہے۔",
      hubCore: "Edukaan POS",
      hubCoreSub: "ایک لاگ اِن · ایک اسٹاک · ایک حساب",
      replTitle: "خودکار ری اسٹاک",
      replOn: "آٹو",
      repOverline: "رپورٹنگ",
      repTitle: "جانیں کیا اسٹاک ہے، کیا بکتا ہے، کیا نہیں۔",
      repBody: "ہر آئٹم، ہر برانچ، ہر دن کی آمدنی، مارجن اور اسٹاک۔ Edukaan ہر فروخت کو ایسا نمبر بناتا ہے جس پر آپ فیصلہ کر سکیں۔",
      repDash: "مالک کا ڈیش بورڈ",
      repRange: "پچھلے 7 دن",
      repChart: "روزانہ آمدنی",
      repChartNote: "آج نمایاں",
      repTop: "سب سے زیادہ بکنے والے",
      repSlow: "آہستہ بکنے والے",
      recOverline: "خودکار ری اسٹاک",
      recTitle: "اسٹاک کم؟ آرڈر پہلے ہی ہو گیا۔",
      recHead: "آپ کو کیا ملتا ہے",
      recSystems: "سسٹم سنبھالنے ہیں",
      recSetup: "سیٹ اپ",
      recSetupVal: "1 سیشن",
      recContract: "کانٹریکٹ",
      recContractVal: "نہیں",
      recThanks: "مقامی دکان سے خریدنے کا شکریہ",
      stepsTitle: "ایک سیشن میں لائیو۔",
      hwTitle: "ہارڈویئر، ڈیلیور اور انسٹال شدہ",
      hwNote: "یا اپنا Android ٹیبلٹ استعمال کریں۔",
      intTitle: "ان کے ساتھ کام کرتا ہے",
      intPay: "پیمنٹ انٹیگریشن",
      intMarket: "مارکیٹ پلیس انٹیگریشن",
      intErp: "ERP انٹیگریشن",
      intHeadline: "آپ کے موجودہ پیمنٹ، مارکیٹ پلیس اور ERP سے جڑتا ہے۔",
      priceTitle: "قیمت",
      priceSub: "مفت شروع کریں۔ تب پیسے دیں جب سسٹم آپ کی کمائی بڑھا رہا ہو۔",
      priceNote: "VAT الگ۔ ہارڈویئر الگ سے فروخت یا کرائے پر۔",
      priceBadge: "زیادہ تر دکاندار",
      notIncluded: "شامل نہیں",
      faqTitle: "دکاندار جو سوال پوچھتے ہیں",
      contactTitle: "آپ کے کاؤنٹر کو مصروف کرتے ہیں۔",
      formTitle: "یا کال بیک مانگیں",
      fName: "آپ کا نام",
      fPhone: "WhatsApp نمبر",
      fSend: "بھیجیں",
      footBlurb: "Edukaan، Tradeling Group کا POS ہے، جو اس خطے کا سورسنگ اور ڈسٹری بیوشن کا B2B پلیٹ فارم ہے۔",
      footGroup: "Tradeling Group کا برانڈ",
      footContact: "رابطہ",
      footRights: "جملہ حقوق محفوظ ہیں۔",
      footPrivacy: "پرائیویسی پالیسی",
      trustedBy: "ان کا بھروسا"
    },
    AE: {
      countryTag: "UAE",
      heroSub: "چھوٹے دکانداروں کے لیے POS: چیک آؤٹ، اسٹاک، BNPL اور مارکیٹ پلیس آرڈر ایک سسٹم میں۔ UAE VAT کے مطابق، آف لائن بھی چلتا ہے۔",
      saleNo: "فروخت #4821",
      saleMeta: "Al Barsha · کاؤنٹر 2",
      vatLine: "VAT 5% شامل",
      compFoot: "FTA ٹیکس انوائس تیار",
      lowStock: "اسٹاک کم · Al Ain 500ml",
      reorder: "Tradeling سے دوبارہ آرڈر",
      recBody: "ہر آئٹم کی کم سے کم مقدار طے کریں۔ اسٹاک اس سے نیچے جائے تو Edukaan Tradeling سے ہول سیل آرڈر تیار کرتا ہے؛ ایک ٹیپ میں منظوری دیں یا پورا خودکار چلائیں۔ دبئی، شارجہ اور ابوظہبی میں اگلے دن ڈیلیوری۔",
      recSupplier: "ہول سیل سپلائی Tradeling سے"
    },
    SA: {
      countryTag: "KSA",
      heroSub: "الیکٹرانکس دکانداروں کے لیے POS: چیک آؤٹ، IMEI ٹریکنگ، BNPL اور مارکیٹ پلیس آرڈر ایک سسٹم میں۔ ZATCA فیز 2 بلٹ اِن، آف لائن بھی چلتا ہے۔",
      saleNo: "فروخت #4821",
      saleMeta: "Olaya · کاؤنٹر 2",
      vatLine: "VAT 15% شامل",
      compFoot: "ZATCA ای انوائس · QR تیار",
      lowStock: "اسٹاک کم · 25W چارجر",
      reorder: "Axiom سے دوبارہ آرڈر",
      recBody: "ہر آئٹم کی کم سے کم مقدار طے کریں۔ اسٹاک اس سے نیچے جائے تو Edukaan Axiom by Tradeling سے ہول سیل آرڈر تیار کرتا ہے؛ ایک ٹیپ میں منظوری دیں یا پورا خودکار چلائیں۔ ریاض، جدہ اور دمام میں ڈیلیوری۔",
      recSupplier: "ہول سیل سپلائی Axiom by Tradeling سے"
    }
  },
};

const DATA = {
  en: {
    retail: { AE: ['Mobile shop', 'Baqala', 'Pharmacy', 'Café'], SA: ['Mobile shop', 'Electronics', 'Accessories', 'Gaming'] },
    cart: { AE: [['Al Ain Water 500ml ×12', 18], ['Lipton Yellow Label 100s', 21.5], ['Chips Oman ×6', 6], ['Samsung 25W charger', 69]], SA: [['iPhone 16 128GB · IMEI ✓', 3399], ['Clear case', 49], ['25W USB-C charger', 79], ['Screen protector', 35]] },
    pay: { AE: ['Cash', 'Card', 'Tabby', 'Split'], SA: ['mada', 'Cash', 'Tamara', 'STC Pay'] },
    features: {
      AE: [
        { title: 'Fast checkout', stat: '< 1s', statLabel: 'per scan', mini: ['Weighed items', 'Price overrides with PIN', 'Hold & recall baskets'], badge: 'Live', tiles: [{k:'Queue',v:'3'},{k:'Avg basket',v:'AED 84'},{k:'Today',v:'147 sales'}], chips: ['Barcode & scale', 'Bundles', 'Reprint receipts'], body: 'Scan, weigh, discount, bundle. Reprint any receipt in a tap.', cardTitle: 'Checkout', rows: [{ k: 'Items', v: '14' }, { k: 'Scan speed', v: '< 1 sec' }, { k: 'Discount', v: 'Buy 2 get 1' }], action: 'Charge AED 120.23' },
        { title: 'Every way to pay', stat: '6', statLabel: 'payment methods', mini: ['Terminal pairs automatically', 'Tips & rounding', 'Refund to original method'], badge: 'Approved', tiles: [{k:'Card',v:'62%'},{k:'Cash',v:'29%'},{k:'BNPL',v:'9%'}], chips: ['Cash', 'Card', 'BNPL', 'Split'], body: 'Cash, card, Tabby, Tamara, gift cards and split payments.', cardTitle: 'Payment', rows: [{ k: 'Card', v: 'AED 60.00' }, { k: 'Cash', v: 'AED 60.23' }, { k: 'Change', v: 'AED 0.00' }], action: 'Complete sale' },
        { title: 'Live inventory', stat: '100%', statLabel: 'stock accuracy', mini: ['Stock counts on phone', 'Expiry tracking', 'Branch transfers'], badge: 'Synced', tiles: [{k:'SKUs',v:'1,860'},{k:'Low stock',v:'12'},{k:'Expiring',v:'4'}], chips: ['Per branch', 'Transfers', 'Low-stock alerts'], body: 'Stock updates with every sale, across every branch.', cardTitle: 'Stock · Al Ain 500ml', rows: [{ k: 'Al Barsha', v: '6 left' }, { k: 'Al Nahda', v: '48' }, { k: 'Alert', v: 'Reorder' }], action: 'Transfer 24 units' },
        { title: 'Marketplaces', stat: '3', statLabel: 'channels, one stock', mini: ['Auto-accept orders', 'Pick lists by aisle', 'Courier labels'], badge: '15 new', tiles: [{k:'Amazon',v:'9'},{k:'Noon',v:'6'},{k:'Returns',v:'1'}], chips: ['Amazon', 'Noon', 'Tradeling'], body: 'Amazon, Noon and Tradeling orders from the same stock.', cardTitle: 'Orders today', rows: [{ k: 'In-store', v: '47' }, { k: 'Amazon.ae', v: '9' }, { k: 'Noon', v: '6' }], action: 'Print pick list' },
        { title: 'Loyalty & CRM', stat: '31', statLabel: 'visits this month', mini: ['Points on every sale', 'Birthday offers', 'Credit book (udhaar)'], badge: 'VIP', tiles: [{k:'Members',v:'2,140'},{k:'Redeemed',v:'AED 640'},{k:'Repeat',v:'58%'}], chips: ['Points', 'Visit history', 'WhatsApp offers'], body: 'Know your regulars. Points, history, WhatsApp offers.', cardTitle: 'Customer', rows: [{ k: 'Visits', v: '31' }, { k: 'Points', v: '1,240' }, { k: 'Last', v: 'Yesterday' }], action: 'Send offer' },
        { title: 'UAE VAT, handled', stat: '5%', statLabel: 'calculated automatically', mini: ['FTA-format invoices', 'VAT return export', 'Tourist refund tagging'], badge: 'FTA', tiles: [{k:'Invoices',v:'147'},{k:'VAT today',v:'AED 612'},{k:'Refunds',v:'2'}], chips: ['FTA invoice', 'TRN', 'Tourist refund'], body: 'FTA tax invoices and tourist VAT refunds, automatic.', cardTitle: 'Tax invoice', rows: [{ k: 'TRN', v: '100 2345 6789' }, { k: 'VAT 5%', v: 'AED 5.73' }, { k: 'Tourist refund', v: 'Eligible' }], action: 'Issue invoice' },
      ],
      SA: [
        { title: 'IMEI tracking', stat: '0', statLabel: 'untracked devices', mini: ['Scan at goods-in', 'Scan at sale', 'Blacklist check'], badge: 'Verified', tiles: [{k:'In stock',v:'86'},{k:'Sold today',v:'11'},{k:'Reserved',v:'3'}], chips: ['Goods-in scan', 'Sale scan', 'Warranty dates'], body: 'Every handset scanned in and out. No mystery stock.', cardTitle: 'Device', rows: [{ k: 'Model', v: 'iPhone 16' }, { k: 'IMEI', v: '3542 …221' }, { k: 'Warranty', v: '24 months' }], action: 'Sell device' },
        { title: 'Warranty & repairs', stat: '24m', statLabel: 'warranty on file', mini: ['Repair intake form', 'Parts & labour quote', 'SMS when ready'], badge: 'Open', tiles: [{k:'Tickets',v:'7'},{k:'Ready',v:'2'},{k:'Avg time',v:'2 days'}], chips: ['Repair tickets', 'Estimates', 'Status'], body: 'Warranty registration and repair tickets in the same till.', cardTitle: 'Repair #8812', rows: [{ k: 'Issue', v: 'Screen crack' }, { k: 'Estimate', v: 'SAR 1,450' }, { k: 'Status', v: 'In progress' }], action: 'Complete repair' },
        { title: 'mada, BNPL, split', stat: '4×', statLabel: 'instalments at the till', mini: ['mada & Apple Pay', 'Tamara / Tabby approval', 'Split across methods'], badge: 'Approved', tiles: [{k:'mada',v:'54%'},{k:'BNPL',v:'31%'},{k:'Cash',v:'15%'}], chips: ['mada', 'STC Pay', 'Tabby', 'Tamara'], body: 'mada, STC Pay, cards, Tabby and Tamara instalments.', cardTitle: 'Payment', rows: [{ k: 'Tamara ×4', v: 'SAR 890.50' }, { k: 'mada', v: 'SAR 0.00' }, { k: 'Approval', v: 'Instant' }], action: 'Complete sale' },
        { title: 'ZATCA Phase 2', stat: '100%', statLabel: 'e-invoices cleared', mini: ['Simplified & standard', 'QR on every receipt', 'Auto reporting'], badge: 'Cleared', tiles: [{k:'Issued',v:'146'},{k:'Reported',v:'146'},{k:'Rejected',v:'0'}], chips: ['Fatoora', 'QR code', 'Auto reporting'], body: 'Fatoora e-invoices with QR, cleared and reported automatically.', cardTitle: 'E-invoice', rows: [{ k: 'Type', v: 'Simplified' }, { k: 'QR', v: 'Generated' }, { k: 'ZATCA', v: 'Reported ✓' }], action: 'Print invoice' },
        { title: 'Marketplaces', stat: '3', statLabel: 'channels, one stock', mini: ['Auto-accept orders', 'Pick lists by aisle', 'Courier labels'], badge: '15 new', tiles: [{k:'Amazon',v:'9'},{k:'Noon',v:'6'},{k:'Returns',v:'1'}], chips: ['Amazon', 'Noon', 'Tradeling'], body: 'Amazon.sa, Noon and Tradeling orders from the same stock.', cardTitle: 'Orders today', rows: [{ k: 'In-store', v: '63' }, { k: 'Amazon.sa', v: '12' }, { k: 'Noon', v: '8' }], action: 'Print pick list' },
        { title: 'Multi-branch', stat: '3', statLabel: 'branches, one view', mini: ['Roles & permissions', 'Central pricing', 'Stock transfers'], badge: 'Live', tiles: [{k:'Olaya',v:'51.2K'},{k:'Al Rawdah',v:'29.8K'},{k:'Dammam',v:'22.1K'}], chips: ['Riyadh', 'Jeddah', 'Dammam'], body: 'Riyadh, Jeddah, Dammam on one dashboard, with roles.', cardTitle: 'Today · all branches', rows: [{ k: 'Olaya', v: 'SAR 51.2K' }, { k: 'Al Rawdah', v: 'SAR 29.8K' }, { k: 'Dammam', v: 'SAR 22.1K' }], action: 'View report' },
      ],
    },
    receipt: { AE: ['Fast checkout · barcode · scale', 'Cash · card · BNPL · split', 'Live inventory, every branch', 'Amazon · Noon · Tradeling orders', 'Wholesale reorder from Tradeling', 'UAE VAT invoices · tourist refund', 'Loyalty & CRM', 'Works offline'], SA: ['Fast checkout · barcode · IMEI', 'mada · card · BNPL · split', 'Live inventory, every branch', 'Amazon.sa · Noon · Tradeling orders', 'Wholesale reorder from Axiom', 'ZATCA Phase 2 e-invoice · QR', 'Warranty & repair tickets', 'Works offline'] },
    hub: [
      { tag: 'Store sales', title: 'Checkout', body: 'Barcode, IMEI, discounts, receipts. Built for a queue.' },
      { tag: 'Marketplace / Online', title: 'Amazon, Noon & more', body: 'Orders from every channel land in the same stock.' },
      { tag: 'Payments', title: 'Cash, card, BNPL', body: 'Integrated terminal, instalments and split payments.' },
      { tag: 'Inventory management', title: 'Live stock', body: 'Every branch, every channel, auto-replenished.' },
      { tag: 'ERP', title: 'Books that write themselves', body: 'Tax invoices, ledgers and sync to Odoo and Oracle NetSuite.' },
      { tag: 'Finance', title: 'Credit & working capital', body: 'Wholesale credit lines and financing from the same dashboard.' },
    ],
    hubStats: [{ v: '1', k: 'login' }, { v: '1', k: 'inventory' }, { v: '6', k: 'jobs done' }],
    repPoints: ['Revenue and gross margin per item, category and branch', 'Top sellers and slow movers, so you buy what sells', 'Export to Excel or your accountant in one tap'],
    days: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    rep: {
      AE: { kpis: [{ k: 'Revenue', v: '38,410', cur: true, d: '+12% vs last week' }, { k: 'Gross margin', v: '23.4%', d: '+1.8 pts' }, { k: 'Items sold', v: '1,204', d: '+6%' }], top: [{ item: 'Al Ain Water 500ml', v: '412 sold' }, { item: 'Lipton Yellow Label', v: '188 sold' }, { item: 'Samsung 25W charger', v: '61 sold' }], slow: [{ item: 'Phone stand (black)', v: '0 in 30d' }, { item: 'HDMI cable 3m', v: '2 in 30d' }, { item: 'Car charger 12V', v: '3 in 30d' }] },
      SA: { kpis: [{ k: 'Revenue', v: '51,240', cur: true, d: '+9% vs last week' }, { k: 'Gross margin', v: '11.2%', d: '+0.6 pts' }, { k: 'Devices sold', v: '146', d: '+14%' }], top: [{ item: 'iPhone 16 128GB', v: '38 sold' }, { item: 'Galaxy A56', v: '27 sold' }, { item: '25W USB-C charger', v: '112 sold' }], slow: [{ item: 'Tablet keyboard case', v: '0 in 30d' }, { item: 'Wired earphones', v: '4 in 30d' }, { item: 'Screen protector (old model)', v: '5 in 30d' }] },
    },
    repl: {
      AE: [
        { item: 'Al Ain Water 500ml', status: 'Low · auto-ordered', level: 'ordered', pct: '18%', note: '6 left · min 24 · 48 ordered from Tradeling, arrives tomorrow' },
        { item: 'Samsung 25W charger', status: 'Below minimum', level: 'low', pct: '10%', note: '2 left · min 10 · order drafted, tap to approve' },
        { item: 'Lipton Yellow Label 100s', status: 'Healthy', level: 'ok', pct: '72%', note: '36 left · min 12' },
      ],
      SA: [
        { item: '25W USB-C chargers', status: 'Low · auto-ordered', level: 'ordered', pct: '15%', note: '3 left · min 15 · 30 ordered from Axiom, arrives in 2 days' },
        { item: 'iPhone 16 128GB', status: 'Below minimum', level: 'low', pct: '20%', note: '1 left · min 4 · order drafted, tap to approve' },
        { item: 'Clear cases', status: 'Healthy', level: 'ok', pct: '80%', note: '48 left · min 20' },
      ],
    },
    steps: [{ title: 'Connect', body: 'Printer, scanner, drawer, card terminal.' }, { title: 'Import', body: 'Your catalogue, from Tradeling or a file.' }, { title: 'Sell', body: 'First sale the same afternoon.' }],
    hardware: [{ name: 'Touch terminal', spec: '15" · dual screen', placeholder: 'Terminal photo' }, { name: 'Receipt printer', spec: '80mm thermal', placeholder: 'Printer photo' }, { name: 'Barcode scanner', spec: '1D / 2D', placeholder: 'Scanner photo' }, { name: 'Cash drawer', spec: '5 notes · 8 coins', placeholder: 'Drawer photo' }, { name: 'Card terminal', spec: 'Tap · chip', placeholder: 'Card terminal photo' }],
    integrations: {
      AE: [{ group: 'Payments Integration', items: ['Visa', 'Mastercard', 'Apple Pay', 'Samsung Pay', 'Tamara', 'Tabby'] }, { group: 'Marketplace Integration', items: ['Amazon.ae', 'Noon', 'Tradeling'] }, { group: 'ERP Integration', items: ['Odoo', 'Oracle NetSuite', 'SAP', 'Ingenico'] }],
      SA: [{ group: 'Payments Integration', items: ['mada', 'Visa', 'Mastercard', 'Apple Pay', 'Tamara', 'Tabby'] }, { group: 'Marketplace Integration', items: ['Amazon.sa', 'Noon', 'Tradeling'] }, { group: 'ERP Integration', items: ['Odoo', 'Oracle NetSuite', 'SAP', 'ZATCA', 'Ingenico'] }],
    },
    plans: [
      { name: 'Basic', price: '', priceLabel: 'Free', desc: '1 outlet · 1 register · forever', items: ['Product catalogue, search & cart', 'Cash payments', 'IMEI & serial capture', 'Real-time stock for one outlet', 'Tax-compliant invoicing', 'Basic accounting module', 'Standard sales reports', 'Up to 3 users', 'Email support'], excluded: ['No payment integration or aggregation', 'No marketplace sync', 'No custom integrations'], btn: 'Start free' },
      { name: 'Pro', price: '500', desc: 'per month · up to 10 outlets · 30 users', lead: 'Everything in Basic, plus:', items: ['Integrated payment terminal', 'BNPL — Tabby & Tamara', '2 marketplace integrations', 'Advanced accounting module', 'Advanced reporting & analytics', 'AI recommendations & auto-cataloguing', 'Smart replenishment from Tradeling', 'Promotions, VAS & loyalty', 'Priority support, extended hours'], btn: 'Start with Pro' },
      { name: 'Enterprise', price: '', priceLabel: 'Custom', desc: 'unlimited outlets, users & installations', lead: 'Everything in Pro, plus:', items: ['Unlimited users and installations', 'Unlimited marketplace channels', 'Custom development', 'Custom & ERP integrations, open API', 'White-glove data migration', 'Dedicated customer success manager', 'SLA-backed support', 'QFunder credit line access'], btn: 'Talk to us' },
    ],
    stories: {
      AE: [{ stat: '−6 hrs / week', quote: 'Stock count is done when the last sale rings.', who: 'Baqala owner (placeholder)', where: 'Sharjah' }, { stat: '3 branches', quote: 'All three shops on my phone at iftar.', who: 'Mobile shop owner (placeholder)', where: 'Deira' }, { stat: '+18% basket', quote: 'BNPL at the counter changed which phones people buy.', who: 'Electronics manager (placeholder)', where: 'Al Ain' }],
      SA: [{ stat: '0 IMEI errors', quote: 'Warranty claims stopped being arguments.', who: 'Mobile shop owner (placeholder)', where: 'Riyadh' }, { stat: 'Phase 2 in a day', quote: 'ZATCA was switched on before we finished training.', who: 'Electronics owner (placeholder)', where: 'Jeddah' }, { stat: '+22% basket', quote: 'Tamara at the till changed which phones people buy.', who: 'Accessories manager (placeholder)', where: 'Dammam' }],
    },
    faq: {
      AE: [
        { q: 'Is it compliant with UAE VAT?', a: 'Yes. Every sale produces an FTA-compliant tax invoice with your TRN; VAT reports export for filing. Tourist refunds are supported.' },
        { q: 'Does it work when the internet drops?', a: 'Yes. Sales continue offline and sync when you reconnect.' },
        { q: 'Can I keep my printer and scanner?', a: 'Most 80mm thermal printers and USB or Bluetooth scanners work. We check during onboarding.' },
        { q: 'How does wholesale reordering work?', a: 'Low-stock alerts link to Tradeling wholesale. Confirm at the till; delivery is next day across Dubai, Sharjah and Abu Dhabi.' },
        { q: 'Is there a contract?', a: 'No. Monthly plans, cancel anytime. Hardware can be bought or leased.' },
      ],
      SA: [
        { q: 'Is it compliant with ZATCA Phase 2?', a: 'Yes. Fatoora-compliant e-invoices with QR codes; clearance and reporting with ZATCA happen automatically.' },
        { q: 'Does it track IMEI and serials?', a: 'Every device is scanned at goods-in and at sale, with warranty dates attached.' },
        { q: 'Which payment methods?', a: 'mada, cards, STC Pay, Tabby and Tamara instalments, cash and split payments.' },
        { q: 'Who supplies stock in Saudi Arabia?', a: 'Axiom by Tradeling, the group’s distribution brand in KSA, with delivery across Riyadh, Jeddah and Dammam.' },
        { q: 'Is there a contract?', a: 'No. Monthly plans, cancel anytime. Hardware can be bought or leased.' },
      ],
    },
  },
  ar: {
    retail: { AE: ['محل جوالات', 'بقالة', 'صيدلية', 'كافيه'], SA: ['محل جوالات', 'إلكترونيات', 'إكسسوارات', 'ألعاب'] },
    cart: { AE: [['مياه العين 500مل ×12', 18], ['ليبتون العلامة الصفراء 100', 21.5], ['شيبس عمان ×6', 6], ['شاحن سامسونج 25 واط', 69]], SA: [['آيفون 16 128GB · IMEI ✓', 3399], ['غطاء شفاف', 49], ['شاحن USB-C 25 واط', 79], ['حماية شاشة', 35]] },
    pay: { AE: ['نقداً', 'بطاقة', 'تابي', 'مقسّم'], SA: ['مدى', 'نقداً', 'تمارا', 'STC Pay'] },
    features: {
      AE: [
        { title: 'بيع سريع', stat: '< 1 ث', statLabel: 'لكل مسح', mini: ['أصناف موزونة', 'تعديل السعر برمز PIN', 'تعليق واستدعاء السلة'], badge: 'مباشر', tiles: [{k:'الطابور',v:'3'},{k:'متوسط السلة',v:'84 د.إ'},{k:'اليوم',v:'147 عملية'}], chips: ['باركود وميزان', 'حزم', 'إعادة طباعة'], body: 'امسح، وزّن، خصّم، اجمع. أعد طباعة أي فاتورة بضغطة.', cardTitle: 'الكاشير', rows: [{ k: 'الأصناف', v: '14' }, { k: 'سرعة المسح', v: '< ثانية' }, { k: 'خصم', v: 'اشترِ 2 واحصل على 1' }], action: 'تحصيل 120.23 د.إ' },
        { title: 'كل طرق الدفع', stat: '6', statLabel: 'طرق دفع', mini: ['ربط تلقائي للجهاز', 'إكرامية وتقريب', 'استرجاع لطريقة الدفع الأصلية'], badge: 'مقبول', tiles: [{k:'بطاقة',v:'62%'},{k:'نقد',v:'29%'},{k:'تقسيط',v:'9%'}], chips: ['نقد', 'بطاقة', 'تقسيط', 'مقسّم'], body: 'نقد، بطاقة، تابي، تمارا، بطاقات هدايا، ودفع مقسّم.', cardTitle: 'الدفع', rows: [{ k: 'بطاقة', v: '60.00 د.إ' }, { k: 'نقد', v: '60.23 د.إ' }, { k: 'الباقي', v: '0.00 د.إ' }], action: 'إتمام البيع' },
        { title: 'مخزون مباشر', stat: '100%', statLabel: 'دقة المخزون', mini: ['جرد من الجوال', 'تتبع الصلاحية', 'تحويلات بين الفروع'], badge: 'متزامن', tiles: [{k:'الأصناف',v:'1,860'},{k:'نقص',v:'12'},{k:'قرب الانتهاء',v:'4'}], chips: ['لكل فرع', 'تحويلات', 'تنبيهات النقص'], body: 'يتحدث المخزون مع كل عملية بيع وفي كل فرع.', cardTitle: 'المخزون · مياه العين', rows: [{ k: 'البرشاء', v: '6 متبقية' }, { k: 'النهدة', v: '48' }, { k: 'تنبيه', v: 'أعد الطلب' }], action: 'تحويل 24 وحدة' },
        { title: 'المتاجر الإلكترونية', stat: '3', statLabel: 'قنوات، مخزون واحد', mini: ['قبول تلقائي للطلبات', 'قوائم تجهيز حسب الرف', 'ملصقات الشحن'], badge: '15 جديد', tiles: [{k:'أمازون',v:'9'},{k:'نون',v:'6'},{k:'مرتجعات',v:'1'}], chips: ['أمازون', 'نون', 'تريدلينج'], body: 'طلبات أمازون ونون وتريدلينج من المخزون نفسه.', cardTitle: 'طلبات اليوم', rows: [{ k: 'المحل', v: '47' }, { k: 'أمازون', v: '9' }, { k: 'نون', v: '6' }], action: 'طباعة قائمة التجهيز' },
        { title: 'الولاء والعملاء', stat: '31', statLabel: 'زيارة هذا الشهر', mini: ['نقاط على كل عملية', 'عروض أعياد الميلاد', 'دفتر الدين'], badge: 'VIP', tiles: [{k:'الأعضاء',v:'2,140'},{k:'المستبدل',v:'640 د.إ'},{k:'تكرار',v:'58%'}], chips: ['نقاط', 'سجل الزيارات', 'عروض واتساب'], body: 'اعرف زبائنك. نقاط، سجل، وعروض واتساب.', cardTitle: 'العميل', rows: [{ k: 'الزيارات', v: '31' }, { k: 'النقاط', v: '1,240' }, { k: 'آخر زيارة', v: 'أمس' }], action: 'إرسال عرض' },
        { title: 'ضريبة الإمارات، مضبوطة', stat: '5%', statLabel: 'تُحسب تلقائياً', mini: ['فواتير بصيغة الهيئة', 'تصدير الإقرار الضريبي', 'تمييز استرداد السياح'], badge: 'معتمد', tiles: [{k:'فواتير',v:'147'},{k:'ضريبة اليوم',v:'612 د.إ'},{k:'استرداد',v:'2'}], chips: ['فاتورة معتمدة', 'الرقم الضريبي', 'استرداد السياح'], body: 'فواتير ضريبية معتمدة واسترداد للسياح، تلقائياً.', cardTitle: 'فاتورة ضريبية', rows: [{ k: 'الرقم الضريبي', v: '100 2345 6789' }, { k: 'ضريبة 5%', v: '5.73 د.إ' }, { k: 'استرداد السياح', v: 'مؤهل' }], action: 'إصدار الفاتورة' },
      ],
      SA: [
        { title: 'تتبع IMEI', stat: '0', statLabel: 'أجهزة غير متتبعة', mini: ['مسح عند الاستلام', 'مسح عند البيع', 'فحص القائمة السوداء'], badge: 'موثق', tiles: [{k:'في المخزون',v:'86'},{k:'مبيع اليوم',v:'11'},{k:'محجوز',v:'3'}], chips: ['مسح عند الاستلام', 'مسح عند البيع', 'تواريخ الضمان'], body: 'كل جهاز يُمسح عند الدخول والخروج. لا مخزون مجهول.', cardTitle: 'الجهاز', rows: [{ k: 'الموديل', v: 'آيفون 16' }, { k: 'IMEI', v: '3542 …221' }, { k: 'الضمان', v: '24 شهراً' }], action: 'بيع الجهاز' },
        { title: 'الضمان والصيانة', stat: '24 شهر', statLabel: 'ضمان مسجل', mini: ['نموذج استلام الصيانة', 'عرض سعر قطع وأجور', 'رسالة عند الجاهزية'], badge: 'مفتوح', tiles: [{k:'تذاكر',v:'7'},{k:'جاهز',v:'2'},{k:'متوسط الوقت',v:'يومان'}], chips: ['تذاكر صيانة', 'تقديرات', 'الحالة'], body: 'تسجيل الضمان وتذاكر الصيانة من الكاشير نفسه.', cardTitle: 'صيانة #8812', rows: [{ k: 'المشكلة', v: 'كسر شاشة' }, { k: 'التقدير', v: '1,450 ر.س' }, { k: 'الحالة', v: 'جارٍ' }], action: 'إتمام الصيانة' },
        { title: 'مدى، تقسيط، مقسّم', stat: '4×', statLabel: 'أقساط عند الكاشير', mini: ['مدى وApple Pay', 'موافقة تمارا / تابي', 'تقسيم بين طرق الدفع'], badge: 'مقبول', tiles: [{k:'مدى',v:'54%'},{k:'تقسيط',v:'31%'},{k:'نقد',v:'15%'}], chips: ['مدى', 'STC Pay', 'تابي', 'تمارا'], body: 'مدى، STC Pay، البطاقات، وتقسيط تابي وتمارا.', cardTitle: 'الدفع', rows: [{ k: 'تمارا ×4', v: '890.50 ر.س' }, { k: 'مدى', v: '0.00 ر.س' }, { k: 'الموافقة', v: 'فورية' }], action: 'إتمام البيع' },
        { title: 'فاتورة المرحلة الثانية', stat: '100%', statLabel: 'فواتير معتمدة', mini: ['مبسطة وقياسية', 'QR على كل فاتورة', 'إبلاغ تلقائي'], badge: 'معتمد', tiles: [{k:'صادرة',v:'146'},{k:'مُبلَّغة',v:'146'},{k:'مرفوضة',v:'0'}], chips: ['فاتورة', 'رمز QR', 'إبلاغ تلقائي'], body: 'فواتير إلكترونية مع QR، تُعتمد وتُبلَّغ تلقائياً.', cardTitle: 'فاتورة إلكترونية', rows: [{ k: 'النوع', v: 'مبسطة' }, { k: 'QR', v: 'تم الإنشاء' }, { k: 'الهيئة', v: 'تم الإبلاغ ✓' }], action: 'طباعة الفاتورة' },
        { title: 'المتاجر الإلكترونية', stat: '3', statLabel: 'قنوات، مخزون واحد', mini: ['قبول تلقائي للطلبات', 'قوائم تجهيز حسب الرف', 'ملصقات الشحن'], badge: '15 جديد', tiles: [{k:'أمازون',v:'9'},{k:'نون',v:'6'},{k:'مرتجعات',v:'1'}], chips: ['أمازون', 'نون', 'تريدلينج'], body: 'طلبات أمازون السعودية ونون وتريدلينج من المخزون نفسه.', cardTitle: 'طلبات اليوم', rows: [{ k: 'المحل', v: '63' }, { k: 'أمازون', v: '12' }, { k: 'نون', v: '8' }], action: 'طباعة قائمة التجهيز' },
        { title: 'عدة فروع', stat: '3', statLabel: 'فروع، لوحة واحدة', mini: ['صلاحيات وأدوار', 'تسعير مركزي', 'تحويلات المخزون'], badge: 'مباشر', tiles: [{k:'العليا',v:'51.2K'},{k:'الروضة',v:'29.8K'},{k:'الدمام',v:'22.1K'}], chips: ['الرياض', 'جدة', 'الدمام'], body: 'الرياض وجدة والدمام في لوحة واحدة، مع صلاحيات.', cardTitle: 'اليوم · كل الفروع', rows: [{ k: 'العليا', v: '51.2 ألف ر.س' }, { k: 'الروضة', v: '29.8 ألف ر.س' }, { k: 'الدمام', v: '22.1 ألف ر.س' }], action: 'عرض التقرير' },
      ],
    },
    receipt: { AE: ['بيع سريع · باركود · ميزان', 'نقد · بطاقة · تقسيط · مقسّم', 'مخزون مباشر في كل فرع', 'طلبات أمازون · نون · تريدلينج', 'طلب جملة من تريدلينج', 'فواتير ضريبة الإمارات · استرداد السياح', 'الولاء والعملاء', 'يعمل بدون إنترنت'], SA: ['بيع سريع · باركود · IMEI', 'مدى · بطاقة · تقسيط · مقسّم', 'مخزون مباشر في كل فرع', 'طلبات أمازون · نون · تريدلينج', 'طلب جملة من أكسيوم', 'فاتورة المرحلة الثانية · QR', 'الضمان وتذاكر الصيانة', 'يعمل بدون إنترنت'] },
    hub: [
      { tag: 'مبيعات المتجر', title: 'الكاشير', body: 'باركود، IMEI، خصومات، فواتير. مصمم للطوابير.' },
      { tag: 'المتاجر الإلكترونية', title: 'أمازون ونون وغيرها', body: 'طلبات كل القنوات تصل إلى المخزون نفسه.' },
      { tag: 'المدفوعات', title: 'نقد، بطاقة، تقسيط', body: 'جهاز مدمج، أقساط، ودفع مقسّم.' },
      { tag: 'إدارة المخزون', title: 'مخزون مباشر', body: 'كل فرع وكل قناة، مع إعادة تخزين تلقائية.' },
      { tag: 'ERP', title: 'دفاتر تكتب نفسها', body: 'فواتير ضريبية ودفاتر ومزامنة مع Odoo وOracle NetSuite.' },
      { tag: 'التمويل', title: 'ائتمان ورأس مال عامل', body: 'حدود ائتمان للجملة وتمويل من اللوحة نفسها.' },
    ],
    hubStats: [{ v: '1', k: 'حساب' }, { v: '1', k: 'مخزون' }, { v: '6', k: 'مهام منجزة' }],
    repPoints: ['الإيراد والهامش الإجمالي لكل صنف وفئة وفرع', 'الأكثر مبيعاً وبطيئة الحركة، لتشتري ما يُباع', 'تصدير إلى Excel أو إلى محاسبك بضغطة واحدة'],
    days: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
    rep: {
      AE: { kpis: [{ k: 'الإيراد', v: '38,410', cur: true, d: '+12% عن الأسبوع الماضي' }, { k: 'الهامش الإجمالي', v: '23.4%', d: '+1.8 نقطة' }, { k: 'أصناف مبيعة', v: '1,204', d: '+6%' }], top: [{ item: 'مياه العين 500مل', v: '412' }, { item: 'ليبتون العلامة الصفراء', v: '188' }, { item: 'شاحن سامسونج 25 واط', v: '61' }], slow: [{ item: 'حامل جوال (أسود)', v: '0 في 30 يوماً' }, { item: 'كيبل HDMI 3م', v: '2 في 30 يوماً' }, { item: 'شاحن سيارة 12V', v: '3 في 30 يوماً' }] },
      SA: { kpis: [{ k: 'الإيراد', v: '51,240', cur: true, d: '+9% عن الأسبوع الماضي' }, { k: 'الهامش الإجمالي', v: '11.2%', d: '+0.6 نقطة' }, { k: 'أجهزة مبيعة', v: '146', d: '+14%' }], top: [{ item: 'آيفون 16 128GB', v: '38' }, { item: 'جالكسي A56', v: '27' }, { item: 'شاحن USB-C 25 واط', v: '112' }], slow: [{ item: 'غطاء لوحة مفاتيح للتابلت', v: '0 في 30 يوماً' }, { item: 'سماعات سلكية', v: '4 في 30 يوماً' }, { item: 'حماية شاشة (موديل قديم)', v: '5 في 30 يوماً' }] },
    },
    repl: {
      AE: [
        { item: 'مياه العين 500مل', status: 'منخفض · طُلب تلقائياً', level: 'ordered', pct: '18%', note: '6 متبقية · الحد 24 · طُلب 48 من تريدلينج، يصل غداً' },
        { item: 'شاحن سامسونج 25 واط', status: 'تحت الحد الأدنى', level: 'low', pct: '10%', note: '2 متبقية · الحد 10 · الطلب جاهز، اضغط للموافقة' },
        { item: 'ليبتون 100 كيس', status: 'جيد', level: 'ok', pct: '72%', note: '36 متبقية · الحد 12' },
      ],
      SA: [
        { item: 'شواحن USB-C 25 واط', status: 'منخفض · طُلب تلقائياً', level: 'ordered', pct: '15%', note: '3 متبقية · الحد 15 · طُلب 30 من أكسيوم، يصل خلال يومين' },
        { item: 'آيفون 16 128GB', status: 'تحت الحد الأدنى', level: 'low', pct: '20%', note: '1 متبقٍ · الحد 4 · الطلب جاهز، اضغط للموافقة' },
        { item: 'أغطية شفافة', status: 'جيد', level: 'ok', pct: '80%', note: '48 متبقية · الحد 20' },
      ],
    },
    steps: [{ title: 'اربط', body: 'الطابعة والماسح والدرج وجهاز البطاقات.' }, { title: 'استورد', body: 'كتالوجك من تريدلينج أو من ملف.' }, { title: 'بِع', body: 'أول عملية بيع في نفس اليوم.' }],
    hardware: [{ name: 'شاشة كاشير لمس', spec: '15 إنش · شاشتان', placeholder: 'صورة الجهاز' }, { name: 'طابعة فواتير', spec: '80مم حرارية', placeholder: 'صورة الطابعة' }, { name: 'ماسح باركود', spec: '1D / 2D', placeholder: 'صورة الماسح' }, { name: 'درج نقود', spec: '5 أوراق · 8 عملات', placeholder: 'صورة الدرج' }, { name: 'جهاز بطاقات', spec: 'لمس · شريحة', placeholder: 'صورة جهاز البطاقات' }],
    integrations: {
      AE: [{ group: 'تكامل المدفوعات', items: ['Visa', 'Mastercard', 'Apple Pay', 'Samsung Pay', 'تمارا', 'تابي'] }, { group: 'تكامل المتاجر الإلكترونية', items: ['أمازون', 'نون', 'تريدلينج'] }, { group: 'تكامل أنظمة ERP', items: ['Odoo', 'Oracle NetSuite', 'SAP', 'Ingenico'] }],
      SA: [{ group: 'تكامل المدفوعات', items: ['مدى', 'Visa', 'Mastercard', 'Apple Pay', 'تمارا', 'تابي'] }, { group: 'تكامل المتاجر الإلكترونية', items: ['أمازون', 'نون', 'تريدلينج'] }, { group: 'تكامل أنظمة ERP', items: ['Odoo', 'Oracle NetSuite', 'SAP', 'هيئة الزكاة والضريبة والجمارك', 'Ingenico'] }],
    },
    plans: [
      { name: 'الأساسية', price: '', priceLabel: 'مجاناً', desc: 'فرع واحد · نقطة بيع واحدة · للأبد', items: ['كتالوج المنتجات والبحث والسلة', 'الدفع نقداً', 'تسجيل IMEI والأرقام التسلسلية', 'مخزون مباشر لفرع واحد', 'فواتير متوافقة ضريبياً', 'وحدة محاسبة أساسية', 'تقارير مبيعات قياسية', 'حتى 3 مستخدمين', 'دعم عبر البريد'], excluded: ['بدون تكامل أو تجميع للمدفوعات', 'بدون مزامنة المتاجر الإلكترونية', 'بدون تكاملات مخصصة'], btn: 'ابدأ مجاناً' },
      { name: 'برو', price: '500', desc: 'شهرياً · حتى 10 فروع · 30 مستخدماً', lead: 'كل ما في الأساسية، بالإضافة إلى:', items: ['جهاز دفع مدمج', 'تقسيط — تابي وتمارا', 'تكامل مع متجرين إلكترونيين', 'وحدة محاسبة متقدمة', 'تقارير وتحليلات متقدمة', 'توصيات ذكاء اصطناعي وفهرسة تلقائية', 'إعادة تخزين ذكية من تريدلينج', 'العروض والخدمات المضافة والولاء', 'دعم بأولوية وساعات ممتدة'], btn: 'ابدأ مع برو' },
      { name: 'المؤسسات', price: '', priceLabel: 'مخصص', desc: 'فروع ومستخدمون وتركيبات غير محدودة', lead: 'كل ما في برو، بالإضافة إلى:', items: ['مستخدمون وتركيبات غير محدودة', 'قنوات متاجر إلكترونية غير محدودة', 'تطوير مخصص', 'تكاملات ERP مخصصة وواجهة API مفتوحة', 'نقل بيانات كامل الخدمة', 'مدير نجاح عملاء مخصص', 'دعم باتفاقية مستوى خدمة', 'حد ائتماني من QFunder'], btn: 'تواصل معنا' },
    ],
    stories: {
      AE: [{ stat: '−6 ساعات أسبوعياً', quote: 'الجرد ينتهي مع آخر عملية بيع.', who: 'صاحب بقالة (نموذج)', where: 'الشارقة' }, { stat: '3 فروع', quote: 'الفروع الثلاثة على جوالي وقت الإفطار.', who: 'صاحب محل جوالات (نموذج)', where: 'ديرة' }, { stat: '+18% قيمة السلة', quote: 'التقسيط عند الكاشير غيّر أي جوالات يشتريها الناس.', who: 'مدير إلكترونيات (نموذج)', where: 'العين' }],
      SA: [{ stat: '0 أخطاء IMEI', quote: 'مطالبات الضمان ما عادت جدالاً.', who: 'صاحب محل جوالات (نموذج)', where: 'الرياض' }, { stat: 'المرحلة الثانية في يوم', quote: 'الفوترة اشتغلت قبل أن ننهي التدريب.', who: 'صاحب إلكترونيات (نموذج)', where: 'جدة' }, { stat: '+22% قيمة السلة', quote: 'تمارا عند الكاشير غيّرت أي جوالات يشتريها الناس.', who: 'مدير إكسسوارات (نموذج)', where: 'الدمام' }],
    },
    faq: {
      AE: [
        { q: 'هل هو متوافق مع ضريبة الإمارات؟', a: 'نعم. كل عملية بيع تُصدر فاتورة ضريبية معتمدة برقمك الضريبي، وتقارير الضريبة تُصدَّر للإقرار. استرداد السياح مدعوم.' },
        { q: 'هل يعمل عند انقطاع الإنترنت؟', a: 'نعم. تستمر المبيعات بدون اتصال وتُزامَن عند العودة.' },
        { q: 'هل أستخدم طابعتي وماسحي؟', a: 'معظم الطابعات الحرارية 80مم والماسحات USB أو بلوتوث تعمل. نتحقق أثناء التجهيز.' },
        { q: 'كيف يعمل طلب الجملة؟', a: 'تنبيهات النقص ترتبط بجملة تريدلينج. أكّد من الكاشير والتوصيل في اليوم التالي في دبي والشارقة وأبوظبي.' },
        { q: 'هل يوجد عقد؟', a: 'لا. خطط شهرية، إلغاء في أي وقت. الأجهزة تُشترى أو تُؤجّر.' },
      ],
      SA: [
        { q: 'هل هو متوافق مع فاتورة المرحلة الثانية؟', a: 'نعم. فواتير إلكترونية متوافقة مع رموز QR، والاعتماد والإبلاغ مع الهيئة يتمان تلقائياً.' },
        { q: 'هل يتتبع IMEI والأرقام التسلسلية؟', a: 'كل جهاز يُمسح عند الاستلام وعند البيع مع تواريخ الضمان.' },
        { q: 'ما طرق الدفع؟', a: 'مدى، البطاقات، STC Pay، تقسيط تابي وتمارا، النقد، والدفع المقسّم.' },
        { q: 'من يورّد البضاعة في السعودية؟', a: 'أكسيوم من تريدلينج، ذراع التوزيع للمجموعة في المملكة، مع توصيل في الرياض وجدة والدمام.' },
        { q: 'هل يوجد عقد؟', a: 'لا. خطط شهرية، إلغاء في أي وقت. الأجهزة تُشترى أو تُؤجّر.' },
      ],
    },
  },
  // Hindi and Urdu: only steps and FAQ are translated; every other DATA list falls back to English.
  hi: {
    steps: [
      {
        title: "कनेक्ट करें",
        body: "प्रिंटर, स्कैनर, ड्रॉअर, कार्ड टर्मिनल।"
      },
      {
        title: "इम्पोर्ट करें",
        body: "आपका कैटलॉग, Tradeling से या फ़ाइल से।"
      },
      {
        title: "बेचें",
        body: "उसी दोपहर पहली बिक्री।"
      }
    ],
    faq: {
      AE: [
        {
          q: "क्या यह UAE VAT के अनुसार है?",
          a: "हाँ। हर बिक्री पर आपके TRN के साथ FTA-अनुसार टैक्स इनवॉइस बनता है; VAT रिपोर्ट फ़ाइलिंग के लिए एक्सपोर्ट होती है। टूरिस्ट रिफ़ंड भी सपोर्टेड है।"
        },
        {
          q: "इंटरनेट चला जाए तो चलता है?",
          a: "हाँ। बिक्री ऑफ़लाइन चलती रहती है और कनेक्ट होने पर सिंक हो जाती है।"
        },
        {
          q: "क्या मैं अपना प्रिंटर और स्कैनर रख सकता हूँ?",
          a: "ज़्यादातर 80mm थर्मल प्रिंटर और USB या Bluetooth स्कैनर चलते हैं। ऑनबोर्डिंग में हम जांच लेते हैं।"
        },
        {
          q: "होलसेल री-ऑर्डर कैसे काम करता है?",
          a: "कम स्टॉक के अलर्ट Tradeling होलसेल से जुड़े हैं। काउंटर पर कन्फ़र्म करें; दुबई, शारजाह और अबू धाबी में अगले दिन डिलीवरी।"
        },
        {
          q: "कोई कॉन्ट्रैक्ट है?",
          a: "नहीं। मासिक प्लान, कभी भी बंद करें। हार्डवेयर खरीद या किराए पर ले सकते हैं।"
        }
      ],
      SA: [
        {
          q: "क्या यह ZATCA फ़ेज़ 2 के अनुसार है?",
          a: "हाँ। QR कोड वाले Fatoora-अनुसार ई-इनवॉइस; ZATCA के साथ क्लियरेंस और रिपोर्टिंग अपने आप होती है।"
        },
        {
          q: "क्या यह IMEI और सीरियल ट्रैक करता है?",
          a: "हर डिवाइस माल आने पर और बिक्री पर स्कैन होता है, वारंटी तारीख के साथ।"
        },
        {
          q: "कौन-कौन से पेमेंट तरीके?",
          a: "mada, कार्ड, STC Pay, Tabby और Tamara किस्तें, कैश और स्प्लिट पेमेंट।"
        },
        {
          q: "सऊदी अरब में स्टॉक कौन देता है?",
          a: "Axiom by Tradeling, ग्रुप का KSA में डिस्ट्रीब्यूशन ब्रांड, रियाद, जेद्दा और दम्माम में डिलीवरी के साथ।"
        },
        {
          q: "कोई कॉन्ट्रैक्ट है?",
          a: "नहीं। मासिक प्लान, कभी भी बंद करें। हार्डवेयर खरीद या किराए पर ले सकते हैं।"
        }
      ]
    }
  },
  ur: {
    steps: [
      {
        title: "کنیکٹ کریں",
        body: "پرنٹر، اسکینر، ڈراور، کارڈ ٹرمینل۔"
      },
      {
        title: "امپورٹ کریں",
        body: "آپ کا کیٹلاگ، Tradeling سے یا فائل سے۔"
      },
      {
        title: "بیچیں",
        body: "اسی دوپہر پہلی فروخت۔"
      }
    ],
    faq: {
      AE: [
        {
          q: "کیا یہ UAE VAT کے مطابق ہے؟",
          a: "جی ہاں۔ ہر فروخت پر آپ کے TRN کے ساتھ FTA کے مطابق ٹیکس انوائس بنتی ہے؛ VAT رپورٹ فائلنگ کے لیے ایکسپورٹ ہوتی ہے۔ ٹورسٹ ریفنڈ بھی سپورٹڈ ہے۔"
        },
        {
          q: "انٹرنیٹ چلا جائے تو چلتا ہے؟",
          a: "جی ہاں۔ فروخت آف لائن جاری رہتی ہے اور کنیکٹ ہونے پر سنک ہو جاتی ہے۔"
        },
        {
          q: "کیا میں اپنا پرنٹر اور اسکینر رکھ سکتا ہوں؟",
          a: "زیادہ تر 80mm تھرمل پرنٹر اور USB یا Bluetooth اسکینر چلتے ہیں۔ آن بورڈنگ میں ہم چیک کر لیتے ہیں۔"
        },
        {
          q: "ہول سیل ری آرڈر کیسے کام کرتا ہے؟",
          a: "کم اسٹاک کے الرٹ Tradeling ہول سیل سے جڑے ہیں۔ کاؤنٹر پر کنفرم کریں؛ دبئی، شارجہ اور ابوظہبی میں اگلے دن ڈیلیوری۔"
        },
        {
          q: "کوئی کانٹریکٹ ہے؟",
          a: "نہیں۔ ماہانہ پلان، کبھی بھی بند کریں۔ ہارڈویئر خرید یا کرائے پر لے سکتے ہیں۔"
        }
      ],
      SA: [
        {
          q: "کیا یہ ZATCA فیز 2 کے مطابق ہے؟",
          a: "جی ہاں۔ QR کوڈ والی Fatoora کے مطابق ای انوائس؛ ZATCA کے ساتھ کلیئرنس اور رپورٹنگ خود بخود ہوتی ہے۔"
        },
        {
          q: "کیا یہ IMEI اور سیریل ٹریک کرتا ہے؟",
          a: "ہر ڈیوائس مال آنے پر اور فروخت پر اسکین ہوتی ہے، وارنٹی تاریخ کے ساتھ۔"
        },
        {
          q: "کون کون سے پیمنٹ طریقے؟",
          a: "mada، کارڈ، STC Pay، Tabby اور Tamara قسطیں، کیش اور اسپلٹ پیمنٹ۔"
        },
        {
          q: "سعودی عرب میں اسٹاک کون دیتا ہے؟",
          a: "Axiom by Tradeling، گروپ کا KSA میں ڈسٹری بیوشن برانڈ، ریاض، جدہ اور دمام میں ڈیلیوری کے ساتھ۔"
        },
        {
          q: "کوئی کانٹریکٹ ہے؟",
          a: "نہیں۔ ماہانہ پلان، کبھی بھی بند کریں۔ ہارڈویئر خرید یا کرائے پر لے سکتے ہیں۔"
        }
      ]
    }
  },
};
