// Shared outbreak information for CATALYST (used by the Yangon outbreak map, home page and account page).
// CATALYST focuses on Yangon city and its 33 townships.
// Every item comes from a public report listed in SOURCES. This is not a live feed:
// update the text below when new reports are published.

const OUTBREAK_UPDATED = "7 November 2026";

const SOURCES = {
    dmg26: { name: "DMG Newsroom, 16 Aug 2026", url: "https://dmediag.com/news/dccey.html" },
    star14: { name: "The Star, 14 Aug 2026", url: "https://www.thestar.com.my/aseanplus/aseanplus-news/2026/08/14/over-90-test-positive-for-cholera-in-myanmar039s-yangon" },
    street12: { name: "Asia News Network, Aug 2026", url: "https://asianews.network/yangon-townships-ban-street-food-vendors-from-operating-amid-diarrhea-outbreak/" },
    cholera26: { name: "Bloomberg via The Star, 18 Aug 2026", url: "https://www.thestar.com.my/aseanplus/aseanplus-news/2026/08/18/major-alert-in-myanmar-as-cholera-outbreak-kills-three-in-myanmar-hundreds-more-fall-ill" },
    who24: { name: "WHO Myanmar AWD/Cholera situation report, Oct 2024", url: "https://www.who.int/southeastasia/publications/m/item/mawdcoesr00517102024" },
    hc25: { name: "UN Myanmar Health Cluster Bulletin, December 2025", url: "https://myanmar.un.org/sites/default/files/2026-01/Myanmar%20Health%20Cluster%20Bulletin_December2025.pdf" },
    epi: { name: "WHO Myanmar EPI Factsheet 2026", url: "https://cdn.who.int/media/docs/default-source/searo/myanmar/documents/myanmar---epi-factsheet-2026.pdf" },
    dengue25: { name: "The Star (Bernama-Xinhua), 23 May 2025", url: "https://www.thestar.com.my/aseanplus/aseanplus-news/2025/05/23/myanmar-reports-over-860-dengue-fever-cases-so-far-in-2025-four-deaths-have-also-been-confirmed" },
    tb: { name: "WHO TB profile for Myanmar (2022 data)", url: "https://www.aidsdatahub.org/sites/default/files/resource/myanmar-tb-profile.pdf" },
    hiv: { name: "UNAIDS Myanmar country report 2024", url: "https://wa-open-prod-una-weu-001.azurewebsites.net/sites/default/files/2025/Myanmar-country-report_2024.pdf" }
};

// The three colours used on the map
const LEVEL_NAMES = {
    alert: "Outbreak reported (Aug 2026)",
    earlier: "Outbreak reported in 2024",
    watch: "No township alert"
};

// Text for the four townships named in the August 2026 cholera reports
const CHOLERA_ALERT_ITEMS = [
    { disease: "Cholera and diarrhoea", text: "This township was named among the places with the most hospitalised diarrhoea patients when the August 2026 outbreak began. Hospital admissions started on 9 August 2026 in at least nine Yangon townships.", src: "dmg26" },
    { disease: "Street food", text: "Street food stalls in the worst affected townships were stopped for several days, and people were told to avoid street food, unsafe water and ice.", src: "street12" }
];
const CHOLERA_ALERT_ADVICE = "Drink boiled or chlorinated water, avoid street food and ice from unsafe water, use oral rehydration salts (ORS) at the first loose stool, and go to hospital if a person cannot keep fluids down.";

// level: "alert" = outbreak reported in August 2026, "earlier" = outbreak reported in 2024, "watch" = no township alert found
// lat and lng are the approximate middle of each township (used only to place the circles on the map)
const REGIONS = [
    { name: "Kyauktada", lat: 16.7760, lng: 96.1590, level: "alert", tags: ["cholera"], items: CHOLERA_ALERT_ITEMS, advice: CHOLERA_ALERT_ADVICE },
    { name: "Pabedan", lat: 16.7800, lng: 96.1540, level: "alert", tags: ["cholera"], items: CHOLERA_ALERT_ITEMS, advice: CHOLERA_ALERT_ADVICE },
    { name: "Latha", lat: 16.7780, lng: 96.1500, level: "alert", tags: ["cholera"], items: CHOLERA_ALERT_ITEMS, advice: CHOLERA_ALERT_ADVICE },
    { name: "Lanmadaw", lat: 16.7810, lng: 96.1450, level: "alert", tags: ["cholera"], items: CHOLERA_ALERT_ITEMS, advice: CHOLERA_ALERT_ADVICE },
    {
        name: "Hlaingthaya", lat: 16.8800, lng: 96.0500, level: "earlier", tags: ["cholera"],
        items: [
            { disease: "Earlier wave", text: "576 hospitalised acute watery diarrhoea cases were reported from 9 September to 6 October 2024, linked to Hlaingthayar Township.", src: "who24" }
        ],
        advice: "Keep stored water covered, boil drinking water and wash hands with soap, especially in the rainy season."
    },
    {
        name: "Tamwe", lat: 16.8100, lng: 96.1750, level: "earlier", tags: ["cholera"],
        items: [
            { disease: "Earlier outbreak", text: "Health officials inspected Tamwe Township during a diarrhoea outbreak in 2024.", src: "dmg26" }
        ],
        advice: "Boil drinking water, keep food covered and use ORS for diarrhoea."
    },
    { name: "Mingalar Taung Nyunt", lat: 16.7900, lng: 96.1690, level: "watch", tags: [] },
    { name: "Botahtaung", lat: 16.7690, lng: 96.1700, level: "watch", tags: [] },
    { name: "Pazundaung", lat: 16.7810, lng: 96.1720, level: "watch", tags: [] },
    { name: "Ahlone", lat: 16.7870, lng: 96.1290, level: "watch", tags: [] },
    { name: "Seikkan", lat: 16.7620, lng: 96.1470, level: "watch", tags: [] },
    { name: "Dagon", lat: 16.7930, lng: 96.1560, level: "watch", tags: [] },
    { name: "Bahan", lat: 16.8120, lng: 96.1530, level: "watch", tags: [] },
    { name: "Sanchaung", lat: 16.8010, lng: 96.1340, level: "watch", tags: [] },
    { name: "Kyimyindaing", lat: 16.8000, lng: 96.1180, level: "watch", tags: [] },
    { name: "Kamayut", lat: 16.8200, lng: 96.1330, level: "watch", tags: [] },
    { name: "Hlaing", lat: 16.8400, lng: 96.1250, level: "watch", tags: [] },
    { name: "Mayangone", lat: 16.8680, lng: 96.1300, level: "watch", tags: [] },
    { name: "Yankin", lat: 16.8330, lng: 96.1650, level: "watch", tags: [] },
    { name: "Thingangyun", lat: 16.8200, lng: 96.1950, level: "watch", tags: [] },
    { name: "South Okkalapa", lat: 16.8430, lng: 96.1900, level: "watch", tags: [] },
    { name: "North Okkalapa", lat: 16.8800, lng: 96.1700, level: "watch", tags: [] },
    { name: "Thaketa", lat: 16.7720, lng: 96.2050, level: "watch", tags: [] },
    { name: "Dawbon", lat: 16.7800, lng: 96.1880, level: "watch", tags: [] },
    { name: "Insein", lat: 16.9000, lng: 96.1000, level: "watch", tags: [] },
    { name: "Mingaladon", lat: 16.9500, lng: 96.1500, level: "watch", tags: [] },
    { name: "Shwepyitha", lat: 16.9400, lng: 96.0800, level: "watch", tags: [] },
    { name: "East Dagon", lat: 16.8900, lng: 96.2300, level: "watch", tags: [] },
    { name: "North Dagon", lat: 16.8750, lng: 96.2050, level: "watch", tags: [] },
    { name: "South Dagon", lat: 16.8300, lng: 96.2450, level: "watch", tags: [] },
    { name: "Dagon Seikkan", lat: 16.8600, lng: 96.2900, level: "watch", tags: [] },
    { name: "Dala", lat: 16.7500, lng: 96.1200, level: "watch", tags: [] },
    { name: "Seikkyi Kanaungto", lat: 16.7700, lng: 96.1250, level: "watch", tags: [] }
];

// Townships with no specific alert use this text
const DEFAULT_REGION = {
    items: [
        { disease: "No township alert", text: "No outbreak report naming this township was found in the sources used by CATALYST. The Yangon-wide risks below still apply here.", src: null }
    ],
    advice: "Dengue peaks in the rainy season (June to October), so empty standing water every week. Boil drinking water and keep vaccinations up to date."
};

// Facts for the whole of Yangon city (Myanmar figures that also apply to Yangon)
const NATIONAL = [
    { disease: "Cholera and diarrhoea", text: "About 500 people were hospitalised with severe diarrhoea in Yangon between 9 and 16 August 2026, and 149 tested positive for cholera.", src: "cholera26" },
    { disease: "Dengue", text: "The Ministry of Health reported more than 860 cases and 4 deaths in Myanmar between 1 January and 10 May 2025, lower than the same period of 2024. Cases normally rise in the rainy season.", src: "dengue25" },
    { disease: "Measles", text: "Routine measles vaccine coverage in Myanmar was 71% for dose 1 and 68% for dose 2 in 2025. The 2025 catch-up campaign for children aged 9 to 59 months reached 67%.", src: "epi" },
    { disease: "Diphtheria", text: "107 diphtheria cases were reported in Myanmar in 2025, compared with 3 in 2021.", src: "epi" },
    { disease: "Tuberculosis", text: "WHO estimates 257,000 new TB cases a year in Myanmar (475 per 100,000 people), and only 46% of them were treated. Figures are for 2022.", src: "tb" },
    { disease: "HIV", text: "In 2024 antiretroviral treatment was maintained for 220,000 clients affected by conflict in Myanmar, and 95% of those tested for viral load were virally suppressed.", src: "hiv" }
];

// Find one township by name (arrow function with find)
const getRegion = (name) => REGIONS.find((township) => township.name == name) || null;

// Township name for a signed-in member (empty when the member did not choose one)
const regionForUser = (user) => {
    if (user.township != undefined && user.township != "") {
        return user.township;
    }
    return "";
};
