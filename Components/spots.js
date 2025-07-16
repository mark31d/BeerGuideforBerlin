// Components/spots.js

export const SPOTS = {
    recommended: [
      {
        id: 'hopfenreich',
        name: 'Hopfenreich (Kreuzberg)',
        desc:
          'The first almost craft bar in Berlin (opened in 2014), with 15–22 taps, constantly updated local and imported varieties. The atmosphere is relaxed, industrial decorations with taps in the form of antique cars. Friendly bartenders are ready to recommend something new or open up the world of beer for you 🍻.',
        address: 'Kreuzberg',
        coords: { lat: 52.4992, lon: 13.4220 },
        rating: 4,
        img: require('../assets/hopfenreich.png'),
      },
      {
        id: 'mikkeller_bar',
        name: 'Mikkeller Bar Berlin (Mitte)',
        desc:
          'Scandinavian bar chain with 24 taps, wide range of bottles, convenient location on Torstraße. Bartenders are multicultural, always available for tastings and advice.',
        address: 'Torstraße, Mitte',
        coords: { lat: 52.5321, lon: 13.3965 },
        rating: 4,
        img: require('../assets/mikkeller_bar.png'),
      },
      {
        id: 'muted_horn',
        name: 'Muted Horn (Neukölln)',
        desc:
          'Industrial style, about 20 taps, tasting boards. Known among local fans as a great place for lager and lambic barrels.',
        address: 'Neukölln',
        coords: { lat: 52.4767, lon: 13.4410 },
        rating: 4,
        img: require('../assets/muted_horn.png'),
      },
      {
        id: 'hops_and_barley',
        name: 'Hops & Barley (Friedrichshain)',
        desc:
          'Gastronomic brewery with its own beers (traditional and craft), friendly atmosphere, often full on outdoor terraces.',
        address: 'Friedrichshain',
        coords: { lat: 52.5125, lon: 13.4548 },
        rating: 4,
        img: require('../assets/hops_and_barley.png'),
      },
      {
        id: 'vagabund_brauerei',
        name: 'Vagabund Brauerei (Wedding)',
        desc:
          'American-Berlin brewery with a festive atmosphere, regular tours and tastings. Recommended for its incredible IPA & Gose.',
        address: 'Wedding',
        coords: { lat: 52.5483, lon: 13.3470 },
        rating: 4,
        img: require('../assets/vagabund_brauerei.png'),
      },
      {
        id: 'brlo_brew_house',
        name: 'BRLO Brwhouse (Gleisdreieck)',
        desc:
          'Container brewery with restaurant, green park nearby. Large selection of craft lagers and dishes.',
        address: 'Gleisdreieck',
        coords: { lat: 52.4970, lon: 13.3785 },
        rating: 4,
        img: require('../assets/brlo_brewhouse.png'),
      },
      {
        id: 'prater_garten',
        name: 'Prater Garten (Prenzlauer Berg)',
        desc:
          "Berlin's oldest beer garden since 1837. Traditional atmosphere and classic German lagers. Perfect for sunny days.",
        address: 'Prenzlauer Berg',
        coords: { lat: 52.5380, lon: 13.4140 },
        rating: 4,
        img: require('../assets/prater_garten.png'),
      },
      {
        id: 'brauerei_lemke',
        name: 'Brauerei Lemke (Hackescher Markt)',
        desc:
          'Local brewery, famous for its Berliner Weisse on fruit sourdough, known for classics and innovations.',
        address: 'Hackescher Markt',
        coords: { lat: 52.5232, lon: 13.4125 },
        rating: 4.1,
        img: require('../assets/brauerei_lemke.png'),
      },
      {
        id: 'braufactum',
        name: 'BraufactuM Berlin (Alexanderplatz)',
        desc:
          'Craft brewery with 16 taps, BBQ garden. Combines trendy interior with good beer.',
        address: 'Alexanderplatz',
        coords: { lat: 52.5215, lon: 13.4134 },
        rating: 3,
        img: require('../assets/braufactum.png'),
      },
      {
        id: 'das_gift',
        name: 'Das Gift (Neukölln)',
        desc:
          'Scottish pub with ales, cider, art parties. For music lovers & festival vibe.',
        address: 'Neukölln',
        coords: { lat: 52.4931, lon: 13.4330 },
        rating: 3,
        img: require('../assets/das_gift.png'),
      },
      {
        id: 'dogtap_berlin',
        name: 'DogTap Berlin (BrewDog)',
        desc:
          'English chain: pubs, arcades, craft selection and wide reach. Recommended for the atmosphere, but often called too commercial.',
        address: 'Marienpark',
        coords: { lat: 52.4290, lon: 13.3520 },
        rating: 3,
        img: require('../assets/dogtap_berlin.png'),
      },
      {
        id: 'stone_brewing',
        name: 'Stone Brewing – Berlin (Marienpark)',
        desc:
          'American bistro with about 75 kegs, own beer and American BBQ.',
        address: 'Marienpark',
        coords: { lat: 52.4291, lon: 13.3522 },
        rating: 4,
        img: require('../assets/stone_brewing.png'),
      },
      {
        id: 'kaschk_by_brlo',
        name: 'Kaschk by BRLO (Mitte)',
        desc:
          'Scandinavian style, shuffleboard, craft lagers and a light vibe.',
        address: 'Mitte',
        coords: { lat: 52.5236, lon: 13.4090 },
        rating: 4,
        img: require('../assets/kaschk_by_brlo.png'),
      },
      {
        id: 'castle_pub',
        name: 'Castle Pub (Mitte)',
        desc:
          '100+ craft bottles, games, events — a real community bar for beer fans.',
        address: 'Mitte',
        coords: { lat: 52.5290, lon: 13.3785 },
        rating: 3,
        img: require('../assets/castle_pub.png'),
      },
      {
        id: 'birra',
        name: 'Birra (Prenzlauer Berg)',
        desc:
          'Italian craft bar with a cool vibe, a small snack menu and a chill zone.',
        address: 'Prenzlauer Berg',
        coords: { lat: 52.5438, lon: 13.4245 },
        rating: 4,
        img: require('../assets/birra.png'),
      },
      {
        id: 'protokoll',
        name: 'Protokoll (Friedrichshain)',
        desc:
          'Bar with IPA, Nordic interior elements, a light place for communication and beer.',
        address: 'Friedrichshain',
        coords: { lat: 52.5150, lon: 13.4540 },
        rating: 4,
        img: require('../assets/protokoll.png'),
      },
      {
        id: 'lager_lager',
        name: 'Lager Lager (Reuterkiez)',
        desc:
          'Shop + bar, 5 taps and a large selection of bottled beers. Recommended for its friendly atmosphere and affordable selection.',
        address: 'Reuterkiez',
        coords: { lat: 52.4870, lon: 13.4220 },
        rating: 3,
        img: require('../assets/lager_lager.png'),
      },
      {
        id: 'eschenbraeu',
        name: 'Eschenbräu (Wedding)',
        desc:
          'Family-run local brewery with award-winning hefeweizen. Locals call it a must-visit for fresh craft.',
        address: 'Wedding',
        coords: { lat: 52.5480, lon: 13.3570 },
        rating: 4,
        img: require('../assets/eschenbraeu.png'),
      },
      {
        id: 'herman',
        name: 'HERMAN (Prenzlauer Berg)',
        desc:
          'Belgian beer house with ~99 bottles, exquisite range of Trappist varieties, cozy atmosphere.',
        address: 'Prenzlauer Berg',
        coords: { lat: 52.5385, lon: 13.4240 },
        rating: 4,
        img: require('../assets/herman.png'),
      },
      {
        id: 'kulturbrauerei',
        name: 'Kulturbrauerei (Prenzlauer Berg)',
        desc:
          'Former historic brewery → modern cultural center with cozy cafés/pubs, where you can also enjoy local beer.',
        address: 'Prenzlauer Berg',
        coords: { lat: 52.5382, lon: 13.4246 },
        rating: 3,
        img: require('../assets/kulturbrauerei.png'),
      },
    ],
  };
  