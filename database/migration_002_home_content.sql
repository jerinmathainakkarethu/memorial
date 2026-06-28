-- Migration 002: Allow longer setting values and add home content defaults

ALTER TABLE app_settings MODIFY setting_value TEXT NULL;

INSERT INTO app_settings (setting_key, setting_value, description) VALUES
('home_banner_quote_en', '"Those who do not remember the past are condemned to repeat it."', 'Home page banner quote (English)'),
('home_banner_quote_ml', '"ഭൂതകാലത്തെ ഓർക്കാത്തവർ അത് ആവർത്തിക്കാൻ വിധിക്കപ്പെടുന്നു."', 'Home page banner quote (Malayalam)'),
('home_banner_cite_en', '— George Santayana', 'Home page banner citation (English)'),
('home_banner_cite_ml', '— ജോർജ് സന്തായന', 'Home page banner citation (Malayalam)'),
('home_mission_title_en', 'Our Family Heritage', 'Home page mission section title (English)'),
('home_mission_title_ml', 'നമ്മുടെ കുടുംബ പൈതൃകം', 'Home page mission section title (Malayalam)'),
('home_mission_text_en', 'This memorial is a living archive of our family history — a place where stories are preserved, photos are cherished, and the flame of memory never fades. Explore the branches of our family tree, light a candle in loving memory, and leave your tribute for generations to come.', 'Home page mission section text (English)'),
('home_mission_text_ml', 'ഈ സ്മരണിക നമ്മുടെ കുടുംബ ചരിത്രത്തിന്റെ ഒരു ജീവിക്കുന്ന ശേഖരമാണ് — കഥകൾ സംരക്ഷിക്കപ്പെടുകയും ഫോട്ടോകൾ വിലമതിക്കപ്പെടുകയും ഓർമ്മകളുടെ ജ്വാല ഒരിക്കലും കെടാതിരിക്കുകയും ചെയ്യുന്ന ഒരു സ്ഥലം. നമ്മുടെ കുടുംബ വൃക്ഷത്തിന്റെ ശാഖകളിലൂടെ സഞ്ചരിക്കുക, പ്രിയപ്പെട്ടവരുടെ ഓർമ്മയ്ക്കായി മെഴുകുതിരി കൊളുത്തുക, വരും തലമുറകൾക്കായി നിങ്ങളുടെ ആദരാഞ്ജലി രേഖപ്പെടുത്തുക.', 'Home page mission section text (Malayalam)'),
('home_cta_title_en', 'Preserve Your Family Story', 'Home page CTA section title (English)'),
('home_cta_title_ml', 'നിങ്ങളുടെ കുടുംബ കഥ സംരക്ഷിക്കുക', 'Home page CTA section title (Malayalam)'),
('home_cta_text_en', 'Our family legacy is built on the lives we live and the memories we share. Every name, every face, every story matters.', 'Home page CTA section text (English)'),
('home_cta_text_ml', 'നമ്മുടെ കുടുംബ പാരമ്പര്യം നാം ജീവിക്കുന്ന ജീവിതങ്ങളിലും പങ്കിടുന്ന ഓർമ്മകളിലും നിർമ്മിച്ചിരിക്കുന്നു. ഓരോ പേരും, ഓരോ മുഖവും, ഓരോ കഥയും പ്രധാനമാണ്.', 'Home page CTA section text (Malayalam)')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), description = VALUES(description);
