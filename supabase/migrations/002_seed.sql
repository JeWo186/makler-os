-- Seed: Cities (Top 20 deutsche Städte)
insert into cities (slug, name, state, population) values
  ('berlin', 'Berlin', 'Berlin', 3677472),
  ('hamburg', 'Hamburg', 'Hamburg', 1906411),
  ('muenchen', 'München', 'Bayern', 1512491),
  ('koeln', 'Köln', 'Nordrhein-Westfalen', 1084394),
  ('frankfurt', 'Frankfurt am Main', 'Hessen', 773068),
  ('stuttgart', 'Stuttgart', 'Baden-Württemberg', 635911),
  ('duesseldorf', 'Düsseldorf', 'Nordrhein-Westfalen', 646000),
  ('leipzig', 'Leipzig', 'Sachsen', 624099),
  ('dortmund', 'Dortmund', 'Nordrhein-Westfalen', 588250),
  ('essen', 'Essen', 'Nordrhein-Westfalen', 582760),
  ('bremen', 'Bremen', 'Bremen', 569352),
  ('hannover', 'Hannover', 'Niedersachsen', 538068),
  ('nuernberg', 'Nürnberg', 'Bayern', 518365),
  ('duisburg', 'Duisburg', 'Nordrhein-Westfalen', 496000),
  ('bochum', 'Bochum', 'Nordrhein-Westfalen', 365587),
  ('wuppertal', 'Wuppertal', 'Nordrhein-Westfalen', 354646),
  ('bielefeld', 'Bielefeld', 'Nordrhein-Westfalen', 341755),
  ('bonn', 'Bonn', 'Nordrhein-Westfalen', 334176),
  ('muenster', 'Münster', 'Nordrhein-Westfalen', 318516),
  ('karlsruhe', 'Karlsruhe', 'Baden-Württemberg', 313092)
on conflict (slug) do nothing;

-- Seed: Specializations
insert into specializations (slug, name, description) values
  ('luxusimmobilien', 'Luxus & Premiumimmobilien', 'Hochwertige Immobilien ab 1 Mio. € Marktwert'),
  ('kapitalanlagen', 'Kapitalanlagen & Renditeobjekte', 'Anlageimmobilien, ETW-Pakete, Zinshäuser'),
  ('mehrfamilienhaeuser', 'Mehrfamilienhäuser', 'MFH, Zinshäuser, gemischte Objekte'),
  ('gewerbeimmobilien', 'Gewerbeimmobilien', 'Büros, Hallen, Einzelhandel, Logistik'),
  ('erbimmobilien', 'Erbimmobilien & Nachlassverkauf', 'Diskrete Abwicklung von Erbschaften'),
  ('scheidungsimmobilien', 'Scheidungsimmobilien', 'Schnelle, faire Abwicklung bei Trennung'),
  ('neubauprojekte', 'Neubauprojekte & Bauträger', 'Neubau-Erstverkäufe und Projektentwicklungen'),
  ('off-market', 'Off-Market-Verkäufe', 'Diskrete Verkäufe ohne öffentliche Vermarktung'),
  ('denkmalimmobilien', 'Denkmalimmobilien', 'Sanierte und denkmalgeschützte Objekte'),
  ('kaeufervertretung', 'Käufervertretung (Buyer Agent)', 'Exklusiv auf Käuferseite tätig')
on conflict (slug) do nothing;
