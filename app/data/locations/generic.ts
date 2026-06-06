import type { LocationData } from './types';

export const generateGenericLocation = (
  name: string,
  slug: string,
  image: string,
  country: string | null = null
): LocationData => ({
  slug,
  name,
  country,
  image,
  images: {
    boxes: '/images/moving_boxes.png',
    van: '/images/moving_van.png',
    room: '/images/empty_room.png'
  },
  en: {
    seo: {
      title: `Top Rated Moving Company in ${name} | MoveIt`,
      description: `Comprehensive moving guide for ${name}. MoveIt offers premium local, long-distance, and business relocation services. Get a free transparent quote today!`,
      keywords: `movers ${name}, moving company ${name}, relocation services ${name}, local movers ${name}, cheap moving ${name}, best movers in ${name}, commercial moving ${name}, residential movers ${name}`
    },
    hero: {
      title: `Expert Movers in ${name}`,
      subtitle: `Your trusted, five-star moving partner for a completely stress-free relocation to, from, or within ${name}.`
    },
    content: {
      introduction: {
        title: `Comprehensive Moving Guide to ${name}`,
        text: [
          `Relocating to a new home or office in ${name} represents an exciting new chapter in your life, but the logistics of moving can often feel overwhelming. At MoveIt, our primary mission is to remove the stress and physical toll associated with transitioning to a new environment.`,
          `Whether you are a student moving into a city-center studio, a family upgrading to a spacious suburban home, or a business expanding your operations within ${name}, navigating the local terrain requires expertise. Our seasoned teams understand the specific nuances of ${name}'s infrastructure, from strict parking regulations to the challenges of moving large furniture through narrow, historic doorways.`,
          `We don't just transport boxes; we deliver peace of mind. Every move is planned meticulously down to the minute. With transparent pricing, fully insured transit, and a dedicated team that treats your belongings as their own, choosing MoveIt guarantees a Michelin-star moving experience in ${name}.`
        ]
      },
      residentialDetails: {
        title: `Residential Moving Services in ${name}`,
        text: [
          `Moving households is at the core of what we do. From the initial quote to the moment the last box is unpacked in your new living room, our residential moving services in ${name} are designed around your specific needs. We recognize that every household is unique, holding irreplaceable family heirlooms, fragile electronics, and heavy, awkward furniture.`,
          `For smaller moves, such as 1-2 bedroom apartments, our efficient 'Van + 2 Movers' package is the perfect fit. Our team arrives fully equipped with heavy-duty blankets, specialized moving straps, and custom dollies to navigate staircases and tight corridors safely. For larger family estates, we deploy comprehensive teams and multiple high-capacity trucks to complete the relocation swiftly, often within a single day.`,
          `Furthermore, our full-service options in ${name} mean you never have to lift a finger. We can handle the complete packing process the day before the move, professionally disassemble large wardrobes or beds, and reassemble everything perfectly in your new home.`
        ]
      },
      commercialDetails: {
        title: `Commercial & Office Relocations`,
        text: [
          `Time is money, and when a business relocates within or to ${name}, minimizing operational downtime is the absolute highest priority. MoveIt provides specialized commercial moving services tailored specifically for offices, retail stores, and corporate facilities.`,
          `Our commercial relocation managers work directly with your team to create a highly detailed, step-by-step moving schedule. We often execute office moves during evenings or weekends to ensure your business experiences zero interruptions during standard operating hours.`,
          `We handle the safe transport of sensitive IT equipment, large conference tables, ergonomic workstations, and secure document filing systems. Our crews use specialized commercial moving bins and IT-crates to guarantee the utmost security and efficiency. Trust the leading corporate movers in ${name} to transition your business flawlessly.`
        ]
      },
      packingTips: {
        title: `Expert Packing & Preparation`,
        text: [
          `The secret to a successful and damage-free move lies entirely in the preparation. Proper packing is an art form. Using high-quality double-walled moving boxes, acid-free packing paper, and industrial-grade bubble wrap is non-negotiable for protecting your fragile items.`,
          `If you choose to pack yourself, we recommend starting with non-essential items like out-of-season clothing and books at least two weeks before your moving date in ${name}. Always label your boxes clearly on multiple sides, indicating both the contents and the destination room. This drastically speeds up the unloading process for our moving crews.`,
          `Don't want to deal with the hassle? Our professional packing service in ${name} is incredibly popular. Our trained specialists can securely pack an entire kitchen, including delicate glassware and china, in a fraction of the time it takes an untrained individual.`
        ]
      },
      localInsights: {
        title: `Local Insights: Navigating ${name}`,
        text: [
          `Every city has its unique logistical challenges, and ${name} is no exception. Understanding the local traffic patterns, one-way street systems, and optimal routes is what separates an average moving company from a great one.`,
          `In many neighborhoods in ${name}, securing a parking permit or temporarily blocking a street is legally required for large moving vans. Our operations team proactively handles these local municipality requirements, ensuring there are no delays or fines on moving day.`,
          `Additionally, if you are moving into a high-rise apartment or a building with a particularly narrow stairwell, we coordinate external moving lifts (verhuisliften) to safely hoist large items through windows or balconies, preventing damage to both your furniture and the building's interior.`
        ]
      },
      costFactors: {
        title: `Transparent Pricing & Cost Factors`,
        text: [
          `We firmly believe that a professional moving company should never surprise you with hidden fees. Our pricing structure in ${name} is completely transparent. When you request a quote, we provide a detailed breakdown of costs based on the estimated volume of your goods, the distance of the move, and the specific services required.`,
          `Our hourly rates for local moves include the moving van, the professional crew, fuel within the local area, and comprehensive goods-in-transit insurance. There are no unexpected charges for stairs or heavy lifting.`,
          `To keep costs down, we highly recommend our mid-week moving specials, where you can benefit from discounted hourly rates compared to the busy weekend slots. By being fully transparent, MoveIt has earned its reputation as the most trusted moving service in ${name}.`
        ]
      },
      whyUs: [
        `Unmatched local expertise navigating the specific challenges of ${name}.`,
        '100% transparent pricing with absolutely no hidden fees or surprise invoices.',
        'Fully insured relocations covering every single item during transit.',
        'Highly trained, vetted, and friendly moving crews dedicated to customer service.'
      ],
      neighborhoodsTitle: `Neighborhoods We Proudly Serve in ${name}`,
      neighborhoods: [
        'Historic City Center',
        'Modern Suburbs',
        'Financial & Business Districts',
        'University & Student Areas',
        'Surrounding Towns and Villages'
      ]
    }
  },
  nl: {
    seo: {
      title: `Top Beoordeeld Verhuisbedrijf in ${name} | MoveIt`,
      description: `Uitgebreide verhuisgids voor ${name}. MoveIt biedt premium lokale, lange afstand en zakelijke verhuisdiensten. Vraag vandaag nog een gratis offerte aan!`,
      keywords: `verhuisbedrijf ${name}, verhuizers ${name}, goedkoop verhuizen ${name}, verhuisservice ${name}, lokaal verhuisbedrijf, zakelijk verhuizen ${name}, particuliere verhuizing ${name}`
    },
    hero: {
      title: `Expert Verhuizers in ${name}`,
      subtitle: `Uw vertrouwde, vijfsterren verhuispartner voor een volledig stressvrije verhuizing van, naar of binnen ${name}.`
    },
    content: {
      introduction: {
        title: `Uitgebreide Verhuisgids voor ${name}`,
        text: [
          `Verhuizen naar een nieuwe woning of kantoor in ${name} is een spannend nieuw hoofdstuk in uw leven, maar de logistiek van een verhuizing kan vaak overweldigend aanvoelen. Bij MoveIt is onze belangrijkste missie om de stress en fysieke belasting van een verhuizing volledig weg te nemen.`,
          `Of u nu een student bent die naar een studio in het centrum verhuist, een gezin dat naar een ruime woning in de buitenwijken trekt, of een bedrijf dat uitbreidt binnen ${name}, het navigeren door de lokale omgeving vereist expertise. Onze ervaren teams begrijpen de specifieke nuances van de infrastructuur van ${name}, van strikte parkeerregels tot de uitdagingen van het verplaatsen van grote meubels door smalle, historische deuropeningen.`,
          `Wij vervoeren niet zomaar dozen; wij leveren gemoedsrust. Elke verhuizing wordt tot op de minuut nauwkeurig gepland. Met transparante prijzen, volledig verzekerd transport en een toegewijd team dat uw spullen behandelt alsof ze van henzelf zijn, garandeert het kiezen voor MoveIt een Michelin-ster verhuiservaring in ${name}.`
        ]
      },
      residentialDetails: {
        title: `Particuliere Verhuisdiensten in ${name}`,
        text: [
          `Het verhuizen van huishoudens is de kern van wat we doen. Vanaf de eerste offerte tot het moment dat de laatste doos in uw nieuwe woonkamer is uitgepakt, zijn onze particuliere verhuisdiensten in ${name} ontworpen rond uw specifieke behoeften. We erkennen dat elk huishouden uniek is, met onvervangbare familiestukken, breekbare elektronica en zware, onhandige meubels.`,
          `Voor kleinere verhuizingen, zoals appartementen met 1 of 2 slaapkamers, is ons efficiënte 'Verhuiswagen + 2 Verhuizers' pakket de perfecte keuze. Ons team arriveert volledig uitgerust met zware verhuisdekens, speciale spanbanden en op maat gemaakte steekwagens om veilig over trappen en door smalle gangen te navigeren. Voor grotere gezinswoningen zetten we uitgebreide teams en meerdere vrachtwagens met grote capaciteit in om de verhuizing snel, vaak binnen één dag, af te ronden.`,
          `Bovendien betekenen onze full-service opties in ${name} dat u nooit een vinger hoeft uit te steken. We kunnen het volledige inpakproces de dag voor de verhuizing afhandelen, grote kledingkasten of bedden professioneel demonteren en alles perfect monteren in uw nieuwe woning.`
        ]
      },
      commercialDetails: {
        title: `Zakelijke & Kantoorverhuizingen`,
        text: [
          `Tijd is geld, en wanneer een bedrijf binnen of naar ${name} verhuist, is het minimaliseren van operationele downtime de absolute topprioriteit. MoveIt biedt gespecialiseerde commerciële verhuisdiensten die specifiek zijn afgestemd op kantoren, winkels en zakelijke faciliteiten.`,
          `Onze commerciële verhuismanagers werken direct samen met uw team om een zeer gedetailleerde, stapsgewijze verhuisplanning te maken. We voeren kantoorverhuizingen vaak 's avonds of in het weekend uit om ervoor te zorgen dat uw bedrijf nul onderbrekingen ervaart tijdens de standaard kantooruren.`,
          `We verzorgen het veilige transport van gevoelige IT-apparatuur, grote vergadertafels, ergonomische werkplekken en beveiligde archiveringssystemen. Onze teams gebruiken gespecialiseerde commerciële verhuisbakken en IT-kratten om de grootst mogelijke veiligheid en efficiëntie te garanderen. Vertrouw op de toonaangevende zakelijke verhuizers in ${name} om uw bedrijf vlekkeloos te verhuizen.`
        ]
      },
      packingTips: {
        title: `Expert Inpakken & Voorbereiding`,
        text: [
          `Het geheim van een succesvolle en schadevrije verhuizing ligt volledig in de voorbereiding. Goed inpakken is een kunst. Het gebruik van hoogwaardige dubbelwandige verhuisdozen, zuurvrij inpakpapier en industriële noppenfolie is niet onderhandelbaar voor het beschermen van uw breekbare spullen.`,
          `Als u ervoor kiest om zelf in te pakken, raden we aan om minstens twee weken voor uw verhuisdatum in ${name} te beginnen met niet-essentiële items zoals seizoenskleding en boeken. Label uw dozen altijd duidelijk op meerdere zijden, met vermelding van zowel de inhoud als de bestemmingskamer. Dit versnelt het uitlaadproces voor onze verhuisteams aanzienlijk.`,
          `Wilt u niet met dit gedoe omgaan? Onze professionele inpakservice in ${name} is ongelooflijk populair. Onze getrainde specialisten kunnen een hele keuken, inclusief delicaat glaswerk en porselein, veilig inpakken in een fractie van de tijd die een ongetraind persoon nodig heeft.`
        ]
      },
      localInsights: {
        title: `Lokale Inzichten: Navigeren in ${name}`,
        text: [
          `Elke stad heeft zijn unieke logistieke uitdagingen, en ${name} is daarop geen uitzondering. Het begrijpen van de lokale verkeerspatronen, eenrichtingsverkeerssystemen en optimale routes is wat een gemiddeld verhuisbedrijf onderscheidt van een geweldig verhuisbedrijf.`,
          `In veel wijken in ${name} is het beveiligen van een parkeervergunning of het tijdelijk blokkeren van een straat wettelijk verplicht voor grote verhuiswagens. Ons operationele team handelt deze lokale gemeentelijke eisen proactief af, zodat er geen vertragingen of boetes zijn op de verhuisdag.`,
          `Bovendien, als u verhuist naar een appartement op een hoge verdieping of een gebouw met een bijzonder smal trappenhuis, coördineren wij externe verhuisliften om grote items veilig door ramen of balkons te hijsen, waardoor schade aan zowel uw meubilair als het interieur van het gebouw wordt voorkomen.`
        ]
      },
      costFactors: {
        title: `Transparante Prijzen & Kostenfactoren`,
        text: [
          `Wij geloven stellig dat een professioneel verhuisbedrijf u nooit mag verrassen met verborgen kosten. Onze prijsstructuur in ${name} is volledig transparant. Wanneer u een offerte aanvraagt, geven we een gedetailleerde uitsplitsing van de kosten op basis van het geschatte volume van uw goederen, de afstand van de verhuizing en de specifieke vereiste diensten.`,
          `Onze uurtarieven voor lokale verhuizingen zijn inclusief de verhuiswagen, het professionele team, brandstof binnen de lokale omgeving en een uitgebreide transportverzekering. Er zijn geen onverwachte kosten voor trappen of zwaar tillen.`,
          `Om de kosten laag te houden, raden we onze doordeweekse verhuisacties ten zeerste aan, waarbij u kunt profiteren van gereduceerde uurtarieven in vergelijking met de drukke weekendtijden. Door volledig transparant te zijn, heeft MoveIt zijn reputatie verdiend als het meest vertrouwde verhuisbedrijf in ${name}.`
        ]
      },
      whyUs: [
        `Ongeëvenaarde lokale expertise in het navigeren door de specifieke uitdagingen van ${name}.`,
        '100% transparante prijzen met absoluut geen verborgen kosten of verrassingsfacturen.',
        'Volledig verzekerde verhuizingen die elk afzonderlijk item tijdens transport dekken.',
        'Hoog opgeleide, gescreende en vriendelijke verhuisteams toegewijd aan klantenservice.'
      ],
      neighborhoodsTitle: `Wijken die wij met trots bedienen in ${name}`,
      neighborhoods: [
        'Historisch Stadscentrum',
        'Moderne Buitenwijken',
        'Financiële & Zakelijke Districten',
        'Universiteits- & Studentenwijken',
        'Omliggende Dorpen en Gemeenten'
      ]
    }
  }
});
