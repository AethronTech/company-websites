# WEBS-49: OG Preview Validatie Checklist

## 🤖 **Automatische Validatie (Eerst Uitvoeren)**

### **Lokale Automatische Test**
```bash
# Start de lokale server
npm run serve

# Run automatische OG validatie (in nieuwe terminal)
npm run validate:og
```

### **CI/CD Pipeline Controle**
- [ ] **GitHub Actions Build** - Automatische OG validatie draait bij elke push
- [ ] **Deployment Workflow** - OG validatie draait voor productie deployment
- [ ] **Validatie Rapport** - Bekijk `og-validation-report.md` in build artifacts

### **Automatische Validatie Resultaten**
- [ ] ✅ Alle verplichte OG properties aanwezig (`og:title`, `og:description`, `og:url`, `og:type`, `og:site_name`, `og:image`)
- [ ] ✅ Titel lengte OK (≤ 60 karakters)
- [ ] ✅ Beschrijving lengte OK (≤ 160 karakters)  
- [ ] ✅ Juiste afbeeldingen gedetecteerd per pagina
- [ ] ✅ Alle pagina's bereikbaar (geen 404 fouten)
- [ ] ✅ `og:type` = "website"
- [ ] ✅ `og:site_name` bevat "Aethron"

**Als automatische validatie faalt:**
1. Bekijk het validatie rapport voor details
2. Los de gevonden issues op
3. Test opnieuw lokaal
4. Push naar dev branch voor CI/CD validatie

---

## 📋 **Handmatige Validatie Checklist**

### **Voorbereiding**
- [ ] Website is live/toegankelijk op productie URL
- [ ] Alle pagina's zijn gebouwd en gepubliceerd
- [ ] OG images zijn toegankelijk in `/assets/images/og/`

### **LinkedIn Post Inspector Validatie**
**URL:** https://www.linkedin.com/post-inspector/

#### **Te testen pagina's:**
- [ ] **Homepage** - `https://aethron.tech/`
  - [ ] ✅ Afbeelding toont: `og-home-en.png` (1200x630)
  - [ ] ✅ Titel: "Aethron Technologies - People-centric software. Flexible. Reliable. Smart."
  - [ ] ✅ Beschrijving: Bedrijfsomschrijving zichtbaar
  - [ ] ✅ URL: Clean en correct

- [ ] **Over Ons** - `https://aethron.tech/about/`
  - [ ] ✅ Afbeelding toont: `og-about-en.png`
  - [ ] ✅ Titel bevat: "About" 
  - [ ] ✅ Beschrijving: About pagina content
  - [ ] ✅ URL: Correct canonical URL

- [ ] **Oplossingen** - `https://aethron.tech/solutions/`
  - [ ] ✅ Afbeelding toont: `og-solutions-en.png`
  - [ ] ✅ Titel bevat: "Solutions"
  - [ ] ✅ Beschrijving: Solutions pagina content
  - [ ] ✅ URL: Correct canonical URL

- [ ] **Contact** - `https://aethron.tech/contact/`
  - [ ] ✅ Afbeelding toont: `og-contact-en.png`
  - [ ] ✅ Titel bevat: "Contact"
  - [ ] ✅ Beschrijving: Contact pagina content
  - [ ] ✅ URL: Correct canonical URL

#### **Nederlandse versies:**
- [ ] **Homepage NL** - `https://aethron.tech/nl/`
  - [ ] ✅ Afbeelding toont: `og-home-nl.png`
  - [ ] ✅ Locale: `nl_NL`
  - [ ] ✅ Nederlandse titel en beschrijving

- [ ] **Over Ons NL** - `https://aethron.tech/nl/over/`
  - [ ] ✅ Afbeelding toont: `og-about-nl.png`
  - [ ] ✅ Nederlandse content
  - [ ] ✅ Correct NL URL

### **Facebook Debugger Validatie**  
**URL:** https://developers.facebook.com/tools/debug/

#### **Voor elke pagina:**
- [ ] **URL invoeren** en "Debug" klikken
- [ ] **Scrape Again** klikken voor fresh cache
- [ ] **Controleren:**
  - [ ] ✅ Alle OG properties gedetecteerd
  - [ ] ✅ `og:title` - Correct
  - [ ] ✅ `og:description` - Correct  
  - [ ] ✅ `og:image` - Correct afbeelding URL
  - [ ] ✅ `og:url` - Canonical URL
  - [ ] ✅ `og:type` - "website"
  - [ ] ✅ `og:site_name` - "Aethron Technologies"
  - [ ] ✅ `og:locale` - en_US/nl_NL
  - [ ] ✅ Image properties (1200x630, image/png)

#### **Foutmeldingen controleren:**
- [ ] ✅ Geen warnings over ontbrekende properties
- [ ] ✅ Geen fouten bij image loading
- [ ] ✅ Geen SSL/HTTPS problemen
- [ ] ✅ Geen redirect warnings

### **Twitter Card Validator** (Bonus)
**URL:** https://cards-dev.twitter.com/validator

- [ ] **Test major pages** voor Twitter card preview
- [ ] ✅ `summary_large_image` card type
- [ ] ✅ Afbeelding correct weergegeven
- [ ] ✅ Titel en beschrijving correct

### **Mobiele Preview Test**
#### **WhatsApp Test:**
- [ ] Deel URL via WhatsApp
- [ ] ✅ Preview toont correct
- [ ] ✅ Afbeelding laadt snel
- [ ] ✅ Titel en beschrijving zichtbaar

#### **Telegram Test:**
- [ ] Deel URL via Telegram  
- [ ] ✅ Instant preview werkt
- [ ] ✅ Alle elementen zichtbaar

### **Prestatie & Toegankelijkheid**
- [ ] **OG Images loading time**
  - [ ] ✅ Afbeeldingen < 100KB per stuk
  - [ ] ✅ Laden binnen 2 seconden
  - [ ] ✅ Correct cache headers

- [ ] **SEO Impact**
  - [ ] ✅ OG tags interfereren niet met andere meta tags
  - [ ] ✅ Pagina performance niet beïnvloed

## 🚨 **Veelvoorkomende Problemen & Oplossingen**

### **Afbeelding wordt niet getoond:**
- [ ] Controleer image URL is volledig en toegankelijk
- [ ] Gebruik "Scrape Again" in Facebook Debugger
- [ ] Controleer bestandsgrootte (< 8MB voor Facebook)
- [ ] Verifieer image dimensies (1200x630 aanbevolen)

### **Verkeerde titel/beschrijving:**
- [ ] Check of meta tags correct gegenereerd zijn
- [ ] Controleer template logica in `meta-tags.njk`
- [ ] Clear cache in social platform inspector

### **URL problemen:**
- [ ] Verifieer `site.site.url` configuratie
- [ ] Check canonical URL settings
- [ ] Controleer trailing slashes consistency

## ✅ **Aftekenformulier**

**Getest door:** ___________________  
**Datum:** ___________________  
**Status:** 
- [ ] ✅ Alle tests geslaagd - WEBS-49 compleet
- [ ] ⚠️ Minor issues gevonden (specificeer): ___________________
- [ ] ❌ Major issues - aanvullende ontwikkeling nodig

**Opmerkingen:**
___________________________________________________
___________________________________________________

## 📊 **Testresultaten Samenvatting**

| Platform | Homepage | About | Solutions | Contact | NL Versies |
|----------|----------|--------|-----------|---------|------------|
| LinkedIn | [ ] | [ ] | [ ] | [ ] | [ ] |
| Facebook | [ ] | [ ] | [ ] | [ ] | [ ] |
| Twitter  | [ ] | [ ] | [ ] | [ ] | [ ] |
| WhatsApp | [ ] | [ ] | [ ] | [ ] | [ ] |

**Alle tests geslaagd = WEBS-49 gereed voor productie! 🚀**

---

## 🔧 **Ontwikkelaar Notities**

### **Automatische Pipeline Integratie**
- ✅ OG validatie geïntegreerd in `.github/workflows/build.yml`
- ✅ Pre-deployment OG checks in `.github/workflows/deploy.yml`
- ✅ Validatie rapport wordt automatisch gegenereerd en geüpload als artifact

### **Scripts & Tools**
- `npm run validate:og` - Lokale OG validatie
- `scripts/validate-og-alt.js` - Hoofdvalidatie script
- `og-validation-report.md` - Gedetailleerd rapport

### **Template Locaties**
- `src/_includes/meta-tags.njk` - OG meta tags template
- `src/assets/images/og/` - OG images directory

### **CI/CD Monitoring**
- GitHub Actions toont OG validatie status in build logs
- Deployment workflow blokkeert bij kritieke OG fouten
- Artifacts bevatten volledige validatie rapporten voor troubleshooting

**🎯 WEBS-49 Status: GEREED VOOR PRODUCTIE**
