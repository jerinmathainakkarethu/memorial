const pool = require('./database');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const { generateQRCode } = require('../utils/qrGenerator');

async function createPlaceholderImage(fileName, text, bgColor = '#0F172A', textColor = '#D4AF37') {
  const width = 800;
  const height = 600;
  
  // Custom styled SVG for respectful Navy & Gold aesthetic
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${bgColor}"/>
      <circle cx="${width/2}" cy="${height/2}" r="160" fill="none" stroke="${textColor}" stroke-width="2" opacity="0.25"/>
      <rect x="20" y="20" width="${width-40}" height="${height-40}" fill="none" stroke="${textColor}" stroke-width="1" opacity="0.4"/>
      <text x="50%" y="50%" font-family="'Playfair Display', 'Georgia', serif" font-size="44" font-weight="bold" fill="${textColor}" dominant-baseline="middle" text-anchor="middle">
        ${text}
      </text>
    </svg>
  `;
  
  const outputDir = path.join(__dirname, '../../uploads/photos');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const outputPath = path.join(outputDir, fileName);
  await sharp(Buffer.from(svg))
    .jpeg({ quality: 90 })
    .toFile(outputPath);
}

async function seed() {
  console.log('Seeding database with rich demo data...');
  
  try {
    // 0. Disable foreign key checks to safely clean out all tables
    await pool.query('SET FOREIGN_KEY_CHECKS = 0');
    await pool.query('TRUNCATE TABLE grave_locations');
    await pool.query('TRUNCATE TABLE audio_clips');
    await pool.query('TRUNCATE TABLE activity_logs');
    await pool.query('TRUNCATE TABLE memorial_messages');
    await pool.query('TRUNCATE TABLE qr_codes');
    await pool.query('TRUNCATE TABLE timeline_events');
    await pool.query('TRUNCATE TABLE videos');
    await pool.query('TRUNCATE TABLE media');
    await pool.query('TRUNCATE TABLE relationships');
    await pool.query('TRUNCATE TABLE family_members');
    await pool.query('TRUNCATE TABLE families');
    await pool.query('TRUNCATE TABLE app_settings');
    await pool.query('TRUNCATE TABLE users');
    await pool.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('Tables cleared.');

    // 1. Create default administrative users
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const [userResult] = await pool.query(
      `INSERT INTO users (id, name, email, password_hash, role) 
       VALUES (?, ?, ?, ?, ?)`,
      [1, 'Super Admin', 'admin@familymemorial.com', adminPasswordHash, 'super_admin']
    );
    const adminId = userResult.insertId;
    console.log('Admin user seeded.');

    await pool.query(
      `INSERT INTO app_settings (setting_key, setting_value) VALUES (?, ?)`,
      ['hide_living', '0']
    );
    console.log('App settings seeded.');

    // 2. Insert cover placeholders
    await createPlaceholderImage('mathai-cover.jpg', 'The Mathai Family Archive', '#0F172A', '#D4AF37');
    await createPlaceholderImage('cherian-cover.jpg', 'The Cherian Family History', '#0F172A', '#D4AF37');
    
    // Insert generic gallery placeholders
    await createPlaceholderImage('gallery-vintage.jpg', 'Family Portrait (1965)', '#1E293B', '#CBD5E1');
    await createPlaceholderImage('gallery-gathering.jpg', 'Grand Reunion (1985)', '#450A0A', '#D4AF37');
    await createPlaceholderImage('gallery-estate.jpg', 'Ancestral Plantation House', '#064E3B', '#D9F99D');
    await createPlaceholderImage('gallery-church.jpg', 'St. Marys Orthodox Church', '#3B0764', '#F5D0FE');

    // 3. Insert Families
    const [mathaiFamilyResult] = await pool.query(
      `INSERT INTO families (id, name, name_ml, slug, description, description_ml, motto, motto_ml, cover_photo, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        1,
        'The Mathai Family',
        'മാത്യു കുടുംബം',
        'mathai-family',
        'A distinguished family with roots in central Kerala, known for their dedication to agriculture, education, and community welfare over multiple generations.',
        'കേരളത്തിന്റെ മധ്യഭാഗത്ത് ഉത്ഭവിച്ച ഒരു പ്രമുഖ കുടുംബം, കൃഷി, വിദ്യാഭ്യാസം, കമ്മ്യൂണിറ്റി ക്ഷേമം എന്നിവയ്ക്കായി തലമുറകളായി നൽകിയ സംഭാവനകൾക്ക് പേരുകേട്ടതാണ്.',
        'Unity is Strength, Love is Legacy',
        'ഐക്യം ബലം, സ്നേഹം പാരമ്പര്യം',
        '/uploads/photos/mathai-cover.jpg',
        adminId
      ]
    );
    const mathaiFamilyId = mathaiFamilyResult.insertId;

    const [cherianFamilyResult] = await pool.query(
      `INSERT INTO families (id, name, name_ml, slug, description, description_ml, motto, motto_ml, cover_photo, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        2,
        'The Cherian Family',
        'ചെറിയാൻ കുടുംബം',
        'cherian-family',
        'A lineage with roots in Niranam, Pathanamthitta, historically prominent in academic scholarship, civil services, and philanthropic ventures.',
        'പത്തനംതിട്ടയിലെ നിരണം സ്വദേശികളായ ഒരു പ്രമുഖ കുടുംബം, വിദ്യാഭ്യാസ രംഗത്തും സിവിൽ സർവീസിലും ജീവകാരുണ്യ പ്രവർത്തനങ്ങളിലും ചരിത്രപരമായ പങ്കുവഹിച്ചിട്ടുണ്ട്.',
        'Faith, Integrity, Knowledge',
        'വിശ്വാസം, സത്യസന്ധത, അറിവ്',
        '/uploads/photos/cherian-cover.jpg',
        adminId
      ]
    );
    const cherianFamilyId = cherianFamilyResult.insertId;
    console.log('Families seeded.');

    // 4. Family Members list
    const membersData = [
      // ================= MATHAI FAMILY (ID 1) =================
      // Gen 0
      {
        id: 1, family_id: 1, full_name: 'Mathai K. Mathew', full_name_ml: 'മത്തായി കെ. മാത്യു', nickname: 'Appachan', nickname_ml: 'അപ്പച്ചൻ',
        slug: 'mathai-k-mathew', gender: 'male', date_of_birth: '1915-08-10', date_of_death: '1995-12-05',
        place_of_birth: 'Kottayam, Kerala', place_of_death: 'Kottayam, Kerala',
        biography: 'Mathai K. Mathew was the patriarch of the family. He was a pioneer agriculturist, who expanded the family plantations and established community schools. He was known for his wisdom, piety, and leadership.',
        biography_ml: 'കുടുംബത്തിന്റെ സ്ഥാപകനായ മത്തായി കെ. മാത്യു ഒരു പ്രമുഖ കർഷകനായിരുന്നു. അദ്ദേഹം കുടുംബ കൃഷിയിടങ്ങൾ വികസിപ്പിക്കുകയും സ്‌കൂളുകൾ സ്ഥാപിക്കുകയും ചെയ്തു. അദ്ദേഹത്തിന്റെ ബുദ്ധിശക്തിയും ദൈവഭക്തിയും നേതൃത്വവും എല്ലാവർക്കും മാതൃകയായിരുന്നു.',
        occupation: 'Planter & Community Leader', occupation_ml: 'കൃഷിക്കാരൻ & കമ്മ്യൂണിറ്റി നേതാവ്',
        education: 'Intermediate, CMS College Kottayam', education_ml: 'ഇന്റർമീഡിയറ്റ്, സി.എം.എസ് കോളേജ് കോട്ടയം',
        is_deceased: 1, candle_count: 120, display_order: 1
      },
      {
        id: 2, family_id: 1, full_name: 'Mariamma Mathai', full_name_ml: 'മറിയാമ്മ മത്തായി', nickname: 'Ammachi', nickname_ml: 'അമ്മച്ചി',
        slug: 'mariamma-mathai', gender: 'female', date_of_birth: '1920-04-12', date_of_death: '2005-06-18',
        place_of_birth: 'Thiruvalla, Kerala', place_of_death: 'Kottayam, Kerala',
        biography: 'Mariamma Mathai was a compassionate matriarch. She dedicated her life to raising her six sons and supporting local church charities. She was an expert in traditional culinary arts and herbal remedies.',
        biography_ml: 'മറിയാമ്മ മത്തായി കാരുണ്യമുള്ള ഒരു മാതൃകയായിരുന്നു. തന്റെ ആറ് ആൺമക്കളെ വളർത്തുന്നതിനും പ്രാദേശിക സഭയുടെ കാരുണ്യപ്രവർത്തനങ്ങളെ പിന്തുണയ്ക്കുന്നതിനും അവർ ജീവിതം സമർപ്പിച്ചു. പരമ്പരാഗത പാചകകലയിലും ഔഷധപ്രയോഗങ്ങളിലും അവർ വിദഗ്ദ്ധയായിരുന്നു.',
        occupation: 'Homemaker', occupation_ml: 'ഗൃഹനാഥ',
        education: 'High School', education_ml: 'ഹൈസ്കൂൾ',
        is_deceased: 1, candle_count: 145, display_order: 2
      },
      // Gen 1 (6 Brothers & Spouses)
      {
        id: 3, family_id: 1, full_name: 'John Mathai', full_name_ml: 'ജോൺ മത്തായി', nickname: 'Joy', nickname_ml: 'ജോയ്',
        slug: 'john-mathai', gender: 'male', date_of_birth: '1940-02-15', date_of_death: '2018-03-24',
        place_of_birth: 'Kottayam, Kerala', place_of_death: 'Ernakulam, Kerala',
        biography: 'John Mathai, the eldest of the six brothers, was an exceptional civil engineer. He contributed to major infrastructure projects in Kerala and the Middle East. He had a passion for Malayalam literature and local history.',
        biography_ml: 'ആറ് സഹോദരന്മാരിൽ മുതിർന്നയാളായ ജോൺ മത്തായി ഒരു മികച്ച സിവിൽ എഞ്ചിനീയറായിരുന്നു. കേരളത്തിലെയും മിഡിൽ ഈസ്റ്റിലെയും പ്രധാന അടിസ്ഥാന സൗകര്യ പദ്ധതികളിൽ അദ്ദേഹം പങ്കാളിയായി. മലയാള സാഹിത്യത്തിലും പ്രാദേശിക ചരിത്രത്തിലും അദ്ദേഹത്തിന് താല്പര്യമുണ്ടായിരുന്നു.',
        occupation: 'Civil Engineer', occupation_ml: 'സിവിൽ എഞ്ചിനീയർ',
        education: 'B.Tech in Civil Engineering, CET Trivandrum', education_ml: 'സിവിൽ എഞ്ചിനീയറിംഗിൽ ബി.ടെക്, സി.ഇ.ടി തിരുവനന്തപുരം',
        is_deceased: 1, candle_count: 78, display_order: 3
      },
      {
        id: 9, family_id: 1, full_name: 'Mary John', full_name_ml: 'മേരി ജോൺ', nickname: 'Mary', nickname_ml: 'മേരി',
        slug: 'mary-john', gender: 'female', date_of_birth: '1945-03-20', date_of_death: null,
        place_of_birth: 'Kottayam, Kerala', place_of_death: null,
        biography: 'Mary John is the spouse of the late John Mathai. She was a high school teacher in English and is currently active in local social associations.',
        biography_ml: 'മേരി ജോൺ അന്തരിച്ച ജോൺ മത്തായിയുടെ ഭാര്യയാണ്. അവർ സ്കൂൾ അദ്ധ്യാപികയായിരുന്നു. ഇപ്പോൾ പള്ളിയിലെ വിവിധ സാമൂഹിക പ്രവർത്തനങ്ങളിൽ സജീവമാണ്.',
        occupation: 'Retired Teacher', occupation_ml: 'വിരമിച്ച അധ്യാപിക',
        education: 'BA, B.Ed', education_ml: 'ബി.എ, ബി.എഡ്',
        is_deceased: 0, candle_count: 0, display_order: 4
      },
      {
        id: 4, family_id: 1, full_name: 'Thomas Mathai', full_name_ml: 'തോമസ് മത്തായി', nickname: 'Thankachan', nickname_ml: 'തങ്കച്ചൻ',
        slug: 'thomas-mathai', gender: 'male', date_of_birth: '1942-05-18', date_of_death: '2020-07-11',
        place_of_birth: 'Kottayam, Kerala', place_of_death: 'Kottayam, Kerala',
        biography: 'Thomas Mathai was a beloved professor of English literature. He inspired generations of students with his eloquent lectures and deep love for poetry.',
        biography_ml: 'തോമസ് മത്തായി ഇംഗ്ലീഷ് സാഹിത്യത്തിലെ പ്രിയപ്പെട്ട പ്രൊഫസറായിരുന്നു. കവിതയോടുള്ള സ്നേഹവും പ്രഭാഷണങ്ങളും കൊണ്ട് അദ്ദേഹം വിദ്യാർത്ഥികളെ സ്വാധീനിച്ചു.',
        occupation: 'Professor of English', occupation_ml: 'ഇംഗ്ലീഷ് പ്രൊഫസർ',
        education: 'MA in English Literature, University of Kerala', education_ml: 'ഇംഗ്ലീഷ് സാഹിത്യത്തിൽ എം.എ, കേരള സർവകലാശാല',
        is_deceased: 1, candle_count: 85, display_order: 5
      },
      {
        id: 10, family_id: 1, full_name: 'Ann Thomas', full_name_ml: 'അന്ന തോമസ്', nickname: 'Annam', nickname_ml: 'അന്നം',
        slug: 'ann-thomas', gender: 'female', date_of_birth: '1948-07-14', date_of_death: null,
        place_of_birth: 'Changanacherry, Kerala', place_of_death: null,
        biography: 'Ann Thomas is a retired librarian and spouse of the late Prof. Thomas Mathai.',
        biography_ml: 'അന്ന തോമസ് റിട്ടയേർഡ് ലൈബ്രേറിയനും പ്രൊഫ. തോമസ് മത്തായിയുടെ ഭാര്യയുമാണ്.',
        occupation: 'Retired Librarian', occupation_ml: 'വിരമിച്ച ലൈബ്രേറിയൻ',
        education: 'B.Lib.Sc', education_ml: 'ബി.ലിബ്.എസ്‌സി',
        is_deceased: 0, candle_count: 0, display_order: 6
      },
      {
        id: 5, family_id: 1, full_name: 'Joseph Mathai', full_name_ml: 'ജോസഫ് മത്തായി', nickname: 'Sunny', nickname_ml: 'സണ്ണി',
        slug: 'joseph-mathai', gender: 'male', date_of_birth: '1945-11-30', date_of_death: '2021-09-02',
        place_of_birth: 'Kottayam, Kerala', place_of_death: 'Kottayam, Kerala',
        biography: 'Joseph Mathai dedicated his life to advanced farming and dairy development. He imported modern organic methods to the family plantation, creating a model farm.',
        biography_ml: 'ജോസഫ് മത്തായി തന്റെ ജീവിതം ആധുനിക കൃഷിരീതികൾക്കും ക്ഷീരവികസനത്തിനുമായി സമർപ്പിച്ചു. കുടുംബ തോട്ടത്തിലേക്ക് അദ്ദേഹം ജൈവകൃഷി രീതികൾ കൊണ്ടുവന്നു.',
        occupation: 'Planter & Farmer', occupation_ml: 'കർഷകൻ',
        education: 'B.Sc in Agriculture, KAU', education_ml: 'അഗ്രിക്കൾച്ചറിൽ ബി.എസ്‌സി, കേരള കാർഷിക സർവകലാശാല',
        is_deceased: 1, candle_count: 90, display_order: 7
      },
      {
        id: 11, family_id: 1, full_name: 'Susan Joseph', full_name_ml: 'സൂസൻ ജോസഫ്', nickname: 'Susan', nickname_ml: 'സൂസൻ',
        slug: 'susan-joseph', gender: 'female', date_of_birth: '1948-02-10', date_of_death: null,
        place_of_birth: 'Kozhencherry, Kerala', place_of_death: null,
        biography: 'Susan Joseph is the spouse of late Joseph Mathai. She has a deep love for organic gardening and church choir.',
        biography_ml: 'സൂസൻ ജോസഫ് അന്തരിച്ച ജോസഫ് മത്തായിയുടെ ഭാര്യയാണ്. പൂന്തോട്ട നിർമ്മാണത്തിലും പള്ളിയിലെ ഗായകസംഘത്തിലും അവർ സജീവമാണ്.',
        occupation: 'Homemaker', occupation_ml: 'ഗൃഹനാഥ',
        education: 'BSc Chemistry', education_ml: 'ബി.എസ്‌സി കെമിസ്ട്രി',
        is_deceased: 0, candle_count: 0, display_order: 8
      },
      {
        id: 6, family_id: 1, full_name: 'George Mathai', full_name_ml: 'ജോർജ്ജ് മത്തായി', nickname: 'Pappan', nickname_ml: 'പാപ്പൻ',
        slug: 'george-mathai', gender: 'male', date_of_birth: '1948-03-22', date_of_death: '2022-10-15',
        place_of_birth: 'Kottayam, Kerala', place_of_death: 'Trivandrum, Kerala',
        biography: 'George Mathai was a well-known cardiologist. He founded a charitable clinic in his village providing free healthcare for underprivileged families.',
        biography_ml: 'ജോർജ്ജ് മത്തായി അറിയപ്പെടുന്ന ഒരു കാർഡിയോളജിസ്റ്റായിരുന്നു. തന്റെ ഗ്രാമത്തിൽ അദ്ദേഹം ഒരു ചാരിറ്റബിൾ ക്ലിനിക്ക് സ്ഥാപിക്കുകയും നിർധനരായ കുടുംബങ്ങൾക്ക് സൗജന്യ ചികിത്സ നൽകുകയും ചെയ്തു.',
        occupation: 'Cardiologist', occupation_ml: 'ഹൃദ്രോഗ വിദഗ്ദ്ധൻ',
        education: 'MD in Cardiology, Kasturba Medical College', education_ml: 'കാർഡിയോളജിയിൽ എം.ഡി, കസ്തൂർബ മെഡിക്കൽ കോളേജ്',
        is_deceased: 1, candle_count: 112, display_order: 9
      },
      {
        id: 12, family_id: 1, full_name: 'Dr. Elizabeth George', full_name_ml: 'ഡോ. എലിസബത്ത് ജോർജ്ജ്', nickname: 'Lizy', nickname_ml: 'ലിസി',
        slug: 'elizabeth-george', gender: 'female', date_of_birth: '1950-04-05', date_of_death: '2015-08-20',
        place_of_birth: 'Ernakulam, Kerala', place_of_death: 'Trivandrum, Kerala',
        biography: 'Dr. Elizabeth George was a dedicated pediatrician who worked hand-in-hand with her husband Dr. George Mathai in rural medical camps.',
        biography_ml: 'ഡോ. എലിസബത്ത് ജോർജ്ജ് കുട്ടികളുടെ മികച്ച ഡോക്ടറായിരുന്നു, തന്റെ ഭർത്താവ് ഡോ. ജോർജ്ജിനൊപ്പം നിരവധി സൗജന്യ ക്ലിനിക്കുകളിൽ സേവനമനുഷ്ഠിച്ചു.',
        occupation: 'Pediatrician', occupation_ml: 'കുട്ടികളുടെ ഡോക്ടർ',
        education: 'MD in Pediatrics', education_ml: 'പീഡിയാട്രിക്സിൽ എം.ഡി',
        is_deceased: 1, candle_count: 44, display_order: 10
      },
      {
        id: 7, family_id: 1, full_name: 'Abraham Mathai', full_name_ml: 'അബ്രഹാം മത്തായി', nickname: 'Roy', nickname_ml: 'റോയ്',
        slug: 'abraham-mathai', gender: 'male', date_of_birth: '1950-09-08', date_of_death: '2023-01-29',
        place_of_birth: 'Kottayam, Kerala', place_of_death: 'Kochi, Kerala',
        biography: 'Abraham Mathai was a distinguished lawyer practicing at the High Court of Kerala. He offered free legal aid to social causes and advocated for environmental protection.',
        biography_ml: 'അബ്രഹാം മത്തായി കേരള ഹൈക്കോടതിയിൽ പ്രശസ്തനായ ഒരു അഭിഭാഷകനായിരുന്നു. സാമൂഹിക പ്രശ്നങ്ങൾക്ക് അദ്ദേഹം സൗജന്യ നിയമസഹായം നൽകുകയും പരിസ്ഥിതി സംരക്ഷണ പ്രവർത്തനങ്ങൾക്ക് നേതൃത്വം നൽകുകയും ചെയ്തു.',
        occupation: 'Advocate, High Court', occupation_ml: 'ഹൈക്കോടതി അഭിഭാഷകൻ',
        education: 'LLB, Government Law College Ernakulam', education_ml: 'എൽ.എൽ.ബി, ഗവൺമെന്റ് ലോ കോളേജ് എറണാകുളം',
        is_deceased: 1, candle_count: 53, display_order: 11
      },
      {
        id: 13, family_id: 1, full_name: 'Sarah Abraham', full_name_ml: 'സാറാ അബ്രഹാം', nickname: 'Sarah', nickname_ml: 'സാറാ',
        slug: 'sarah-abraham', gender: 'female', date_of_birth: '1953-06-12', date_of_death: null,
        place_of_birth: 'Kottayam, Kerala', place_of_death: null,
        biography: 'Sarah Abraham is the spouse of late Advocate Abraham Mathai. She is a retired bank officer.',
        biography_ml: 'സാറാ അബ്രഹാം റിട്ടയേർഡ് ബാങ്ക് ഓഫീസറും പരേതനായ അഡ്വ. അബ്രഹാമിന്റെ ഭാര്യയുമാണ്.',
        occupation: 'Retired Bank Officer', occupation_ml: 'വിരമിച്ച ബാങ്ക് ഉദ്യോഗസ്ഥ',
        education: 'B.Com', education_ml: 'ബി.കോം',
        is_deceased: 0, candle_count: 0, display_order: 12
      },
      {
        id: 8, family_id: 1, full_name: 'Philip Mathai', full_name_ml: 'ഫിലിപ്പ് മത്തായി', nickname: 'Babu', nickname_ml: 'ബാബു',
        slug: 'philip-mathai', gender: 'male', date_of_birth: '1952-12-05', date_of_death: '2025-02-14',
        place_of_birth: 'Kottayam, Kerala', place_of_death: 'Bangalore, Karnataka',
        biography: 'Philip Mathai, the youngest of the brothers, had an illustrious banking career. He was a passionate singer, choir master, and organized multiple cultural festivals.',
        biography_ml: 'സഹോദരന്മാരിൽ ഇളയ ആളായ ഫിലിപ്പ് മത്തായി, ഒരു ബാങ്ക് മാനേജരായി വിരമിച്ചു. അദ്ദേഹം ഒരു മികച്ച ഗായകനും ക്വയർ മാസ്റ്ററുമായിരുന്നു.',
        occupation: 'Senior Bank Manager', occupation_ml: 'സീനിയർ ബാങ്ക് മാനേജർ',
        education: 'MBA in Finance', education_ml: 'ഫിനാൻസിൽ എം.ബി.എ',
        is_deceased: 1, candle_count: 67, display_order: 13
      },
      {
        id: 14, family_id: 1, full_name: 'Jessy Philip', full_name_ml: 'ജെസ്സി ഫിലിപ്പ്', nickname: 'Jessy', nickname_ml: 'ജെസ്സി',
        slug: 'jessy-philip', gender: 'female', date_of_birth: '1955-11-20', date_of_death: null,
        place_of_birth: 'Thiruvalla, Kerala', place_of_death: null,
        biography: 'Jessy Philip is the spouse of the late Philip Mathai and has worked as an interior designer.',
        biography_ml: 'ജെസ്സി ഫിലിപ്പ് ഇന്റീരിയർ ഡിസൈനറും പരേതനായ ഫിലിപ്പ് മത്തായിയുടെ ഭാര്യയുമാണ്.',
        occupation: 'Interior Designer', occupation_ml: 'ഡിസൈനർ',
        education: 'Diploma in Design', education_ml: 'ഡിപ്ലോമ ഇൻ ഡിസൈൻ',
        is_deceased: 0, candle_count: 0, display_order: 14
      },
      // Gen 2 (Grandchildren)
      {
        id: 15, family_id: 1, full_name: 'Mathew John', full_name_ml: 'മാത്യു ജോൺ', nickname: 'Mathew', nickname_ml: 'മാത്യു',
        slug: 'mathew-john', gender: 'male', date_of_birth: '1972-04-15', date_of_death: null,
        place_of_birth: 'Ernakulam, Kerala', place_of_death: null,
        biography: 'Mathew John is the son of John Mathai. He is working in Dubai as a software architect.',
        biography_ml: 'മാത്യു ജോൺ, ജോൺ മത്തായിയുടെ മകനാണ്. ദുബായിൽ സോഫ്റ്റ്‌വെയർ ആർക്കിടെക്റ്റായി ജോലി ചെയ്യുന്നു.',
        occupation: 'Software Architect', occupation_ml: 'സോഫ്റ്റ്‌വെയർ ആർക്കിടെക്റ്റ്',
        education: 'M.Tech in CS, IIT Madras', education_ml: 'എം.ടെക്, ഐ.ഐ.ടി മദ്രാസ്',
        is_deceased: 0, candle_count: 0, display_order: 15
      },
      {
        id: 16, family_id: 1, full_name: 'Mariam John', full_name_ml: 'മറിയം ജോൺ', nickname: 'Mariam', nickname_ml: 'മറിയം',
        slug: 'mariam-john', gender: 'female', date_of_birth: '1975-08-22', date_of_death: null,
        place_of_birth: 'Ernakulam, Kerala', place_of_death: null,
        biography: 'Mariam John is the daughter of John Mathai and is currently a research scientist in Germany.',
        biography_ml: 'മറിയം ജോൺ, ജോൺ മത്തായിയുടെ മകളാണ്. ജർമ്മനിയിൽ ശാസ്ത്രജ്ഞയായി ജോലി ചെയ്യുന്നു.',
        occupation: 'Research Scientist', occupation_ml: 'ഗവേഷക',
        education: 'PhD in Biotechnology', education_ml: 'പി.എച്ച്.ഡി',
        is_deceased: 0, candle_count: 0, display_order: 16
      },
      {
        id: 17, family_id: 1, full_name: 'Krupa Thomas', full_name_ml: 'കൃപ തോമസ്', nickname: 'Krupa', nickname_ml: 'കൃപ',
        slug: 'krupa-thomas', gender: 'female', date_of_birth: '1978-03-12', date_of_death: null,
        place_of_birth: 'Kottayam, Kerala', place_of_death: null,
        biography: 'Krupa Thomas is the daughter of Prof. Thomas Mathai. She is a writer and digital marketing expert.',
        biography_ml: 'കൃപ തോമസ്, പ്രൊഫ. തോമസ് മത്തായിയുടെ മകളാണ്. എഴുത്തുകാരിയും മാർക്കറ്റിംഗ് വിദഗ്ദ്ധയുമാണ്.',
        occupation: 'Author & Digital Marketer', occupation_ml: 'എഴുത്തുകാരി',
        education: 'MA Journalism', education_ml: 'എം.എ ജേണലിസം',
        is_deceased: 0, candle_count: 0, display_order: 17
      },
      {
        id: 18, family_id: 1, full_name: 'Jerry George', full_name_ml: 'ജെറി ജോർജ്ജ്', nickname: 'Jerry', nickname_ml: 'ജെറി',
        slug: 'jerry-george', gender: 'male', date_of_birth: '1980-11-05', date_of_death: null,
        place_of_birth: 'Trivandrum, Kerala', place_of_death: null,
        biography: 'Jerry George is the son of Dr. George Mathai. He has followed in his parents footsteps and is currently practicing medicine as a pediatrician.',
        biography_ml: 'ജെറി ജോർജ്ജ്, ഡോ. ജോർജ്ജിന്റെ മകനാണ്. മാതാപിതാക്കളുടെ പാത പിന്തുടർന്ന് പീഡിയാട്രിക് ഡോക്ടറായി ജോലി ചെയ്യുന്നു.',
        occupation: 'Pediatrician', occupation_ml: 'കുട്ടികളുടെ ഡോക്ടർ',
        education: 'MD Pediatrics', education_ml: 'എം.ഡി',
        is_deceased: 0, candle_count: 0, display_order: 18
      },
      {
        id: 19, family_id: 1, full_name: 'Kevin Abraham', full_name_ml: 'കെവിൻ അബ്രഹാം', nickname: 'Kevin', nickname_ml: 'കെവിൻ',
        slug: 'kevin-abraham', gender: 'male', date_of_birth: '1984-09-30', date_of_death: null,
        place_of_birth: 'Kochi, Kerala', place_of_death: null,
        biography: 'Kevin Abraham is the son of Advocate Abraham Mathai. He is practicing as an advocate at the High Court of Kerala.',
        biography_ml: 'കെവിൻ അബ്രഹാം, അഡ്വ. അബ്രഹാം മത്തായിയുടെ മകനാണ്. കേരള ഹൈക്കോടതിയിൽ അഭിഭാഷകനായി ജോലി ചെയ്യുന്നു.',
        occupation: 'Advocate, High Court', occupation_ml: 'ഹൈക്കോടതി അഭിഭാഷകൻ',
        education: 'LLM, NLSIU Bangalore', education_ml: 'എൽ.എൽ.എം, ബാംഗ്ലൂർ',
        is_deceased: 0, candle_count: 0, display_order: 19
      },

      // ================= CHERIAN FAMILY (ID 2) =================
      // Gen 0
      {
        id: 20, family_id: 2, full_name: 'Cherian C. Varghese', full_name_ml: 'ചെറിയാൻ സി. വർഗ്ഗീസ്', nickname: 'Cherian', nickname_ml: 'ചെറിയാൻ',
        slug: 'cherian-c-varghese', gender: 'male', date_of_birth: '1925-01-10', date_of_death: '2002-11-15',
        place_of_birth: 'Niranam, Kerala', place_of_death: 'Niranam, Kerala',
        biography: 'Cherian C. Varghese was a prominent leader and education advocate in Niranam. He dedicated his life to community progress.',
        biography_ml: 'നിരനത്തെ വിദ്യാഭ്യാസ സാമൂഹിക പുരോഗതികൾക്കായി സമർപ്പിച്ച ഒരു മികച്ച കമ്മ്യൂണിറ്റി നേതാവായിരുന്നു ചെറിയാൻ സി. വർഗ്ഗീസ്.',
        occupation: 'Social Worker & Planter', occupation_ml: 'സാമൂഹിക പ്രവർത്തകൻ',
        education: 'BA, Madras University', education_ml: 'ബി.എ, മദ്രാസ് യൂണിവേഴ്സിറ്റി',
        is_deceased: 1, candle_count: 95, display_order: 1
      },
      {
        id: 21, family_id: 2, full_name: 'Aleyamma Cherian', full_name_ml: 'അലിയാമ്മ ചെറിയാൻ', nickname: 'Aleyamma', nickname_ml: 'അലിയാമ്മ',
        slug: 'aleyamma-cherian', gender: 'female', date_of_birth: '1930-05-18', date_of_death: '2018-02-20',
        place_of_birth: 'Pathanamthitta, Kerala', place_of_death: 'Niranam, Kerala',
        biography: 'Aleyamma Cherian was a beloved mother who spent her life helping poor children with their schooling costs and meals.',
        biography_ml: 'നിർധനരായ കുട്ടികളുടെ വിദ്യാഭ്യാസ ചിലവുകൾക്കും മറ്റും സഹായങ്ങൾ നൽകിയിരുന്ന ഒരു ഉദാരമനസ്കയായിരുന്നു അലിയാമ്മ ചെറിയാൻ.',
        occupation: 'Homemaker', occupation_ml: 'ഗൃഹനാഥ',
        education: 'High School', education_ml: 'ഹൈസ്കൂൾ',
        is_deceased: 1, candle_count: 110, display_order: 2
      },
      // Gen 1
      {
        id: 22, family_id: 2, full_name: 'Dr. C. V. Cherian', full_name_ml: 'ഡോ. സി. വി. ചെറിയാൻ', nickname: 'Cherian Jr.', nickname_ml: 'ചെറിയാൻ ജൂനിയർ',
        slug: 'c-v-cherian', gender: 'male', date_of_birth: '1955-08-25', date_of_death: '2021-04-12',
        place_of_birth: 'Niranam, Kerala', place_of_death: 'Niranam, Kerala',
        biography: 'Dr. C. V. Cherian was a well-respected physician in Niranam who treated local villagers with deep care and minimal fees.',
        biography_ml: 'നിരനത്തെ ജനങ്ങളുടെ പ്രിയങ്കരനായ ഡോക്ടറായിരുന്നു സി. വി. ചെറിയാൻ. വളരെ ചെറിയ ഫീസിൽ അദ്ദേഹം രോഗികളെ പരിചരിച്ചിരുന്നു.',
        occupation: 'General Physician', occupation_ml: 'ഡോക്ടർ',
        education: 'MBBS, Government Medical College Kottayam', education_ml: 'എം.ബി.ബി.എസ്, കോട്ടയം മെഡിക്കൽ കോളേജ്',
        is_deceased: 1, candle_count: 45, display_order: 3
      },
      {
        id: 23, family_id: 2, full_name: 'Susan Cherian', full_name_ml: 'സൂസൻ ചെറിയാൻ', nickname: 'Susan', nickname_ml: 'സൂസൻ',
        slug: 'susan-cherian', gender: 'female', date_of_birth: '1960-03-15', date_of_death: null,
        place_of_birth: 'Kozhencherry, Kerala', place_of_death: null,
        biography: 'Susan Cherian is the spouse of late Dr. C. V. Cherian and is a retired high school headmistress.',
        biography_ml: 'സൂസൻ ചെറിയാൻ വിരമിച്ച സ്കൂൾ ഹെഡ്മിസ്ട്രസും പരേതനായ ഡോ. സി.വി ചെറിയാന്റെ ഭാര്യയുമാണ്.',
        occupation: 'Retired Headmistress', occupation_ml: 'ഹെഡ്മിസ്ട്രസ്',
        education: 'MA, MEd', education_ml: 'എം.എ, എം.എഡ്',
        is_deceased: 0, candle_count: 0, display_order: 4
      },
      {
        id: 24, family_id: 2, full_name: 'Grace Cherian', full_name_ml: 'ഗ്രേസ് ചെറിയാൻ', nickname: 'Grace', nickname_ml: 'ഗ്രേസ്',
        slug: 'grace-cherian', gender: 'female', date_of_birth: '1958-12-02', date_of_death: '2010-09-18',
        place_of_birth: 'Niranam, Kerala', place_of_death: 'Ernakulam, Kerala',
        biography: 'Grace Cherian was a social activist who worked extensively for rural women empowerment programs in Central Kerala.',
        biography_ml: 'മധ്യകേരളത്തിലെ സ്ത്രീ ശാക്തീകരണ പ്രസ്ഥാനങ്ങളിൽ മുൻപന്തിയിൽ നിന്നിരുന്ന ഒരു സാമൂഹിക പ്രവർത്തകയായിരുന്നു ഗ്രേസ് ചെറിയാൻ.',
        occupation: 'Social Worker', occupation_ml: 'സാമൂഹിക പ്രവർത്തക',
        education: 'MSW, Rajagiri College of Social Sciences', education_ml: 'എം.എസ്.ഡബ്ല്യു, രാജഗിരി കോളേജ്',
        is_deceased: 1, candle_count: 30, display_order: 5
      },
      // Gen 2
      {
        id: 25, family_id: 2, full_name: 'Rohan Cherian', full_name_ml: 'രോഹൻ ചെറിയാൻ', nickname: 'Rohan', nickname_ml: 'രോഹൻ',
        slug: 'rohan-cherian', gender: 'male', date_of_birth: '1988-06-20', date_of_death: null,
        place_of_birth: 'Trivandrum, Kerala', place_of_death: null,
        biography: 'Rohan Cherian is the grandson of Cherian C. Varghese. He is currently working as a bank analyst in Bangalore.',
        biography_ml: 'രോഹൻ ചെറിയാൻ, ചെറിയാൻ സി. വർഗ്ഗീസിന്റെ കൊച്ചുമകനാണ്. ബാംഗ്ലൂരിൽ ബാങ്ക് അനലിസ്റ്റായി ജോലി ചെയ്യുന്നു.',
        occupation: 'Financial Analyst', occupation_ml: 'ബാങ്ക് അനലിസ്റ്റ്',
        education: 'MBA, IIM Bangalore', education_ml: 'എം.ബി.എ, ഐ.ഐ.എം ബാംഗ്ലൂർ',
        is_deceased: 0, candle_count: 0, display_order: 6
      }
    ];

    // Create and attach custom styled profile photos dynamically
    for (const member of membersData) {
      const fileName = `profile-${member.slug}.jpg`;
      const nameText = member.nickname || member.full_name.split(' ')[0];
      await createPlaceholderImage(fileName, nameText, member.gender === 'male' ? '#0F172A' : '#1E293B', '#D4AF37');
      member.profile_photo = `/uploads/photos/${fileName}`;
    }

    // Insert family members to database
    for (const m of membersData) {
      await pool.query(
        `INSERT INTO family_members 
         (id, family_id, full_name, full_name_ml, nickname, nickname_ml, slug, gender, date_of_birth, date_of_death,
          place_of_birth, place_of_death, biography, biography_ml, occupation, occupation_ml, education, education_ml,
          profile_photo, is_deceased, candle_count, display_order, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          m.id, m.family_id, m.full_name, m.full_name_ml, m.nickname, m.nickname_ml,
          m.slug, m.gender, m.date_of_birth, m.date_of_death,
          m.place_of_birth, m.place_of_death, m.biography, m.biography_ml,
          m.occupation, m.occupation_ml, m.education, m.education_ml,
          m.profile_photo, m.is_deceased, m.candle_count, m.display_order, adminId
        ]
      );
    }
    console.log('Family members seeded successfully.');

    // 5. Build Traversal Relationships in both directions
    const relationshipsData = [
      // ================= Mathai Family (1) =================
      // Gen 0 spouses
      { family_id: 1, member_id: 1, related_member_id: 2, relationship_type: 'spouse' },
      { family_id: 1, member_id: 2, related_member_id: 1, relationship_type: 'spouse' },

      // John (Brother 1)
      { family_id: 1, member_id: 1, related_member_id: 3, relationship_type: 'child' },
      { family_id: 1, member_id: 2, related_member_id: 3, relationship_type: 'child' },
      { family_id: 1, member_id: 3, related_member_id: 1, relationship_type: 'father' },
      { family_id: 1, member_id: 3, related_member_id: 2, relationship_type: 'mother' },
      { family_id: 1, member_id: 3, related_member_id: 9, relationship_type: 'spouse' },
      { family_id: 1, member_id: 9, related_member_id: 3, relationship_type: 'spouse' },

      // Thomas (Brother 2)
      { family_id: 1, member_id: 1, related_member_id: 4, relationship_type: 'child' },
      { family_id: 1, member_id: 2, related_member_id: 4, relationship_type: 'child' },
      { family_id: 1, member_id: 4, related_member_id: 1, relationship_type: 'father' },
      { family_id: 1, member_id: 4, related_member_id: 2, relationship_type: 'mother' },
      { family_id: 1, member_id: 4, related_member_id: 10, relationship_type: 'spouse' },
      { family_id: 1, member_id: 10, related_member_id: 4, relationship_type: 'spouse' },

      // Joseph (Brother 3)
      { family_id: 1, member_id: 1, related_member_id: 5, relationship_type: 'child' },
      { family_id: 1, member_id: 2, related_member_id: 5, relationship_type: 'child' },
      { family_id: 1, member_id: 5, related_member_id: 1, relationship_type: 'father' },
      { family_id: 1, member_id: 5, related_member_id: 2, relationship_type: 'mother' },
      { family_id: 1, member_id: 5, related_member_id: 11, relationship_type: 'spouse' },
      { family_id: 1, member_id: 11, related_member_id: 5, relationship_type: 'spouse' },

      // George (Brother 4)
      { family_id: 1, member_id: 1, related_member_id: 6, relationship_type: 'child' },
      { family_id: 1, member_id: 2, related_member_id: 6, relationship_type: 'child' },
      { family_id: 1, member_id: 6, related_member_id: 1, relationship_type: 'father' },
      { family_id: 1, member_id: 6, related_member_id: 2, relationship_type: 'mother' },
      { family_id: 1, member_id: 6, related_member_id: 12, relationship_type: 'spouse' },
      { family_id: 1, member_id: 12, related_member_id: 6, relationship_type: 'spouse' },

      // Abraham (Brother 5)
      { family_id: 1, member_id: 1, related_member_id: 7, relationship_type: 'child' },
      { family_id: 1, member_id: 2, related_member_id: 7, relationship_type: 'child' },
      { family_id: 1, member_id: 7, related_member_id: 1, relationship_type: 'father' },
      { family_id: 1, member_id: 7, related_member_id: 2, relationship_type: 'mother' },
      { family_id: 1, member_id: 7, related_member_id: 13, relationship_type: 'spouse' },
      { family_id: 1, member_id: 13, related_member_id: 7, relationship_type: 'spouse' },

      // Philip (Brother 6)
      { family_id: 1, member_id: 1, related_member_id: 8, relationship_type: 'child' },
      { family_id: 1, member_id: 2, related_member_id: 8, relationship_type: 'child' },
      { family_id: 1, member_id: 8, related_member_id: 1, relationship_type: 'father' },
      { family_id: 1, member_id: 8, related_member_id: 2, relationship_type: 'mother' },
      { family_id: 1, member_id: 8, related_member_id: 14, relationship_type: 'spouse' },
      { family_id: 1, member_id: 14, related_member_id: 8, relationship_type: 'spouse' },

      // Mathew John (Gen 2 child of John & Mary)
      { family_id: 1, member_id: 3, related_member_id: 15, relationship_type: 'child' },
      { family_id: 1, member_id: 9, related_member_id: 15, relationship_type: 'child' },
      { family_id: 1, member_id: 15, related_member_id: 3, relationship_type: 'father' },
      { family_id: 1, member_id: 15, related_member_id: 9, relationship_type: 'mother' },

      // Mariam John (Gen 2 child of John & Mary)
      { family_id: 1, member_id: 3, related_member_id: 16, relationship_type: 'child' },
      { family_id: 1, member_id: 9, related_member_id: 16, relationship_type: 'child' },
      { family_id: 1, member_id: 16, related_member_id: 3, relationship_type: 'father' },
      { family_id: 1, member_id: 16, related_member_id: 9, relationship_type: 'mother' },

      // Krupa Thomas (Gen 2 child of Thomas & Ann)
      { family_id: 1, member_id: 4, related_member_id: 17, relationship_type: 'child' },
      { family_id: 1, member_id: 10, related_member_id: 17, relationship_type: 'child' },
      { family_id: 1, member_id: 17, related_member_id: 4, relationship_type: 'father' },
      { family_id: 1, member_id: 17, related_member_id: 10, relationship_type: 'mother' },

      // Jerry George (Gen 2 child of George & Elizabeth)
      { family_id: 1, member_id: 6, related_member_id: 18, relationship_type: 'child' },
      { family_id: 1, member_id: 12, related_member_id: 18, relationship_type: 'child' },
      { family_id: 1, member_id: 18, related_member_id: 6, relationship_type: 'father' },
      { family_id: 1, member_id: 18, related_member_id: 12, relationship_type: 'mother' },

      // Kevin Abraham (Gen 2 child of Abraham & Sarah)
      { family_id: 1, member_id: 7, related_member_id: 19, relationship_type: 'child' },
      { family_id: 1, member_id: 13, related_member_id: 19, relationship_type: 'child' },
      { family_id: 1, member_id: 19, related_member_id: 7, relationship_type: 'father' },
      { family_id: 1, member_id: 19, related_member_id: 13, relationship_type: 'mother' },

      // ================= Cherian Family (2) =================
      // Gen 0 spouses
      { family_id: 2, member_id: 20, related_member_id: 21, relationship_type: 'spouse' },
      { family_id: 2, member_id: 21, related_member_id: 20, relationship_type: 'spouse' },

      // Dr. C. V. Cherian (Gen 1)
      { family_id: 2, member_id: 20, related_member_id: 22, relationship_type: 'child' },
      { family_id: 2, member_id: 21, related_member_id: 22, relationship_type: 'child' },
      { family_id: 2, member_id: 22, related_member_id: 20, relationship_type: 'father' },
      { family_id: 2, member_id: 22, related_member_id: 21, relationship_type: 'mother' },
      { family_id: 2, member_id: 22, related_member_id: 23, relationship_type: 'spouse' },
      { family_id: 2, member_id: 23, related_member_id: 22, relationship_type: 'spouse' },

      // Grace Cherian (Gen 1)
      { family_id: 2, member_id: 20, related_member_id: 24, relationship_type: 'child' },
      { family_id: 2, member_id: 21, related_member_id: 24, relationship_type: 'child' },
      { family_id: 2, member_id: 24, related_member_id: 20, relationship_type: 'father' },
      { family_id: 2, member_id: 24, related_member_id: 21, relationship_type: 'mother' },

      // Rohan Cherian (Gen 2 child of C. V. Cherian & Susan)
      { family_id: 2, member_id: 22, related_member_id: 25, relationship_type: 'child' },
      { family_id: 2, member_id: 23, related_member_id: 25, relationship_type: 'child' },
      { family_id: 2, member_id: 25, related_member_id: 22, relationship_type: 'father' },
      { family_id: 2, member_id: 25, related_member_id: 23, relationship_type: 'mother' }
    ];

    for (const rel of relationshipsData) {
      await pool.query(
        `INSERT INTO relationships (family_id, member_id, related_member_id, relationship_type) 
         VALUES (?, ?, ?, ?)`,
        [rel.family_id, rel.member_id, rel.related_member_id, rel.relationship_type]
      );
    }
    console.log('Relationships seeded successfully.');

    // 6. Seed Timeline Events for Deceased Members
    const timelineData = [
      // Mathai K. Mathew (1)
      { member_id: 1, title: 'Born in Kottayam', title_ml: 'കോട്ടയത്ത് ജനനം', description: 'Born into a traditional agricultural family in Kottayam.', event_year: 1915, event_type: 'birth', icon: 'birth' },
      { member_id: 1, title: 'Married Mariamma', title_ml: 'മറിയാമ്മയുമായി വിവാഹം', description: 'Holy matrimony conducted in Kottayam.', event_year: 1938, event_type: 'marriage', icon: 'marriage' },
      { member_id: 1, title: 'Established Community School', title_ml: 'കമ്മ്യൂണിറ്റി സ്കൂൾ സ്ഥാപിച്ചു', description: 'Donated land and founded the first local high school.', event_year: 1952, event_type: 'career', icon: 'career' },
      { member_id: 1, title: 'Passed Away', title_ml: 'സ്വർഗ്ഗസ്ഥനായി', description: 'Passed away peacefully surrounded by his family.', event_year: 1995, event_type: 'death', icon: 'death' },

      // Mariamma Mathai (2)
      { member_id: 2, title: 'Born in Thiruvalla', title_ml: 'തിരുവല്ലയിൽ ജനനം', description: 'Born in the prominent Nedumprath family in Thiruvalla.', event_year: 1920, event_type: 'birth', icon: 'birth' },
      { member_id: 2, title: 'Married Mathai K. Mathew', title_ml: 'മത്തായിയുമായി വിവാഹം', description: 'Began her journey as the matriarch of the family.', event_year: 1938, event_type: 'marriage', icon: 'marriage' },
      { member_id: 2, title: 'Passed Away', title_ml: 'സ്വർഗ്ഗസ്ഥയായി', description: 'Left for her heavenly abode in her 85th year.', event_year: 2005, event_type: 'death', icon: 'death' },

      // John Mathai (3)
      { member_id: 3, title: 'Born in Kottayam', title_ml: 'കോട്ടയത്ത് ജനനം', description: 'Eldest son of Mathai K. Mathew and Mariamma Mathai.', event_year: 1940, event_type: 'birth', icon: 'birth' },
      { member_id: 3, title: 'Graduated in Civil Engineering', title_ml: 'സിവിൽ എഞ്ചിനീയറിംഗിൽ ബിരുദം', description: 'Graduated from College of Engineering Trivandrum (CET).', event_year: 1962, event_type: 'education', icon: 'education' },
      { member_id: 3, title: 'Married Mary John', title_ml: 'മേരിയുമായി വിവാഹം', description: 'Married Mary John, a high school English teacher.', event_year: 1970, event_type: 'marriage', icon: 'marriage' },
      { member_id: 3, title: 'Retired as Chief Engineer', title_ml: 'ചീഫ് എഞ്ചിനീയറായി വിരമിക്കൽ', description: 'Retired after serving Kerala PWD for 30 years.', event_year: 1998, event_type: 'retirement', icon: 'retirement' },
      { member_id: 3, title: 'Passed Away', title_ml: 'സ്വർഗ്ഗസ്ഥനായി', description: 'Passed away peacefully at Ernakulam.', event_year: 2018, event_type: 'death', icon: 'death' },

      // Thomas Mathai (4)
      { member_id: 4, title: 'Born in Kottayam', title_ml: 'കോട്ടയത്ത് ജനനം', description: 'Second son of the family.', event_year: 1942, event_type: 'birth', icon: 'birth' },
      { member_id: 4, title: 'Completed MA in English', title_ml: 'ഇംഗ്ലീഷിൽ എം.എ പൂർത്തിയാക്കി', description: 'Earned degree from University of Kerala.', event_year: 1965, event_type: 'education', icon: 'education' },
      { member_id: 4, title: 'Appointed as Professor', title_ml: 'പ്രൊഫസറായി നിയമിതനായി', description: 'Joined English Department at CMS College.', event_year: 1972, event_type: 'career', icon: 'career' },
      { member_id: 4, title: 'Passed Away', title_ml: 'സ്വർഗ്ഗസ്ഥനായി', description: 'Passed away in Kottayam.', event_year: 2020, event_type: 'death', icon: 'death' },

      // Joseph Mathai (5)
      { member_id: 5, title: 'Born in Kottayam', title_ml: 'കോട്ടയത്ത് ജനനം', description: 'Third son, born in 1945.', event_year: 1945, event_type: 'birth', icon: 'birth' },
      { member_id: 5, title: 'Organic Farm Launch', title_ml: 'ജൈവ കൃഷി തുടക്കം', description: 'Pioneered eco-friendly organic farming in the family plantation.', event_year: 1978, event_type: 'career', icon: 'career' },
      { member_id: 5, title: 'Passed Away', title_ml: 'സ്വർഗ്ഗസ്ഥനായി', description: 'Passed away in Kottayam.', event_year: 2021, event_type: 'death', icon: 'death' },

      // George Mathai (6)
      { member_id: 6, title: 'Born in Kottayam', title_ml: 'കോട്ടയത്ത് ജനനം', description: 'Fourth son, born in 1948.', event_year: 1948, event_type: 'birth', icon: 'birth' },
      { member_id: 6, title: 'Completed MD in Cardiology', title_ml: 'കാർഡിയോളജിയിൽ എം.ഡി പൂർത്തിയാക്കി', description: 'Graduated from Kasturba Medical College Manipal.', event_year: 1975, event_type: 'education', icon: 'education' },
      { member_id: 6, title: 'Founded Charity Clinic', title_ml: 'ചാരിറ്റബിൾ ക്ലിനിക്ക് സ്ഥാപിച്ചു', description: 'Started free weekly cardiac clinic in the village.', event_year: 1985, event_type: 'career', icon: 'career' },
      { member_id: 6, title: 'Passed Away', title_ml: 'സ്വർഗ്ഗസ്ഥനായി', description: 'Passed away in Trivandrum.', event_year: 2022, event_type: 'death', icon: 'death' },

      // Abraham Mathai (7)
      { member_id: 7, title: 'Born in Kottayam', title_ml: 'കോട്ടയത്ത് ജനനം', description: 'Fifth son, born in 1950.', event_year: 1950, event_type: 'birth', icon: 'birth' },
      { member_id: 7, title: 'Began Law Practice', title_ml: 'നിയമ പരിശീലനം ആരംഭിച്ചു', description: 'Enrolled in Kerala High Court bar.', event_year: 1976, event_type: 'career', icon: 'career' },
      { member_id: 7, title: 'Passed Away', title_ml: 'സ്വർഗ്ഗസ്ഥനായി', description: 'Passed away in Kochi.', event_year: 2023, event_type: 'death', icon: 'death' },

      // Philip Mathai (8)
      { member_id: 8, title: 'Born in Kottayam', title_ml: 'കോട്ടയത്ത് ജനനം', description: 'Youngest son, born in 1952.', event_year: 1952, event_type: 'birth', icon: 'birth' },
      { member_id: 8, title: 'Senior Manager Promotion', title_ml: 'സീനിയർ മാനേജരായി പ്രമോഷൻ', description: 'Promoted to Senior Manager at State Bank.', event_year: 1990, event_type: 'career', icon: 'career' },
      { member_id: 8, title: 'Passed Away', title_ml: 'സ്വർഗ്ഗസ്ഥനായി', description: 'Passed away in Bangalore.', event_year: 2025, event_type: 'death', icon: 'death' },

      // Dr. Elizabeth George (12)
      { member_id: 12, title: 'Born in Ernakulam', title_ml: 'എറണാകുളത്ത് ജനനം', description: 'Born in 1950.', event_year: 1950, event_type: 'birth', icon: 'birth' },
      { member_id: 12, title: 'Married Dr. George Mathai', title_ml: 'ഡോ. ജോർജ്ജുമായി വിവാഹം', description: 'Holy Matrimony at Ernakulam Church.', event_year: 1977, event_type: 'marriage', icon: 'marriage' },
      { member_id: 12, title: 'Passed Away', title_ml: 'സ്വർഗ്ഗസ്ഥയായി', description: 'Passed away after a brief illness.', event_year: 2015, event_type: 'death', icon: 'death' },

      // Cherian C. Varghese (20)
      { member_id: 20, title: 'Born in Niranam', title_ml: 'നിരനത്തിൽ ജനനം', description: 'Born as the eldest of the Cherian family.', event_year: 1925, event_type: 'birth', icon: 'birth' },
      { member_id: 20, title: 'Passed Away', title_ml: 'സ്വർഗ്ഗസ്ഥനായി', description: 'Passed away peacefully at Niranam.', event_year: 2002, event_type: 'death', icon: 'death' },

      // Aleyamma Cherian (21)
      { member_id: 21, title: 'Born in Pathanamthitta', title_ml: 'പത്തനംതിട്ടയിൽ ജനനം', description: 'Born in 1930.', event_year: 1930, event_type: 'birth', icon: 'birth' },
      { member_id: 21, title: 'Passed Away', title_ml: 'സ്വർഗ്ഗസ്ഥയായി', description: 'Passed away at Niranam.', event_year: 2018, event_type: 'death', icon: 'death' },

      // Dr. C. V. Cherian (22)
      { member_id: 22, title: 'Born in Niranam', title_ml: 'നിരനത്തിൽ ജനനം', description: 'Born in 1955.', event_year: 1955, event_type: 'birth', icon: 'birth' },
      { member_id: 22, title: 'Passed Away', title_ml: 'സ്വർഗ്ഗസ്ഥനായി', description: 'Passed away at Niranam.', event_year: 2021, event_type: 'death', icon: 'death' },

      // Grace Cherian (24)
      { member_id: 24, title: 'Born in Niranam', title_ml: 'നിരനത്തിൽ ജനനം', description: 'Born in 1958.', event_year: 1958, event_type: 'birth', icon: 'birth' },
      { member_id: 24, title: 'Passed Away', title_ml: 'സ്വർഗ്ഗസ്ഥയായി', description: 'Passed away in Ernakulam.', event_year: 2010, event_type: 'death', icon: 'death' }
    ];

    for (const ev of timelineData) {
      const fId = ev.member_id <= 19 ? mathaiFamilyId : cherianFamilyId;
      await pool.query(
        `INSERT INTO timeline_events (family_id, member_id, title, title_ml, description, description_ml, event_year, event_type, icon, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [fId, ev.member_id, ev.title, ev.title_ml, ev.description, ev.description_ml, ev.event_year, ev.event_type, ev.icon, adminId]
      );
    }
    console.log('Timeline events seeded.');

    // 7. Seed Photos (Media) & Videos
    const mediaPhotos = [
      { family_id: 1, member_id: 1, file_name: 'gallery-vintage.jpg', file_path: '/uploads/photos/gallery-vintage.jpg', caption: 'Mathai with family sons in 1965', is_featured: 1 },
      { family_id: 1, member_id: 2, file_name: 'gallery-gathering.jpg', file_path: '/uploads/photos/gallery-gathering.jpg', caption: 'Mariamma hosting dinner at the ancestral home', is_featured: 1 },
      { family_id: 1, member_id: 3, file_name: 'gallery-estate.jpg', file_path: '/uploads/photos/gallery-estate.jpg', caption: 'John visiting the family rubber plantations', is_featured: 1 },
      { family_id: 1, member_id: 6, file_name: 'gallery-church.jpg', file_path: '/uploads/photos/gallery-church.jpg', caption: 'St. Marys Orthodox Church cathedral where George served', is_featured: 1 }
    ];

    for (const photo of mediaPhotos) {
      await pool.query(
        `INSERT INTO media (family_id, member_id, file_name, file_path, file_type, alt_text, caption, is_featured, uploaded_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [photo.family_id, photo.member_id, photo.file_name, photo.file_path, 'image', photo.caption, photo.caption, photo.is_featured, adminId]
      );
    }

    const youtubeVideos = [
      { family_id: 1, member_id: 3, title: 'Memorial Tribute: John Mathai', description: 'A collection of testimonies from friends, family, and colleagues.', youtube_id: 'dQw4w9WgXcQ' },
      { family_id: 1, member_id: 6, title: 'Village Charity Clinic Inauguration', description: 'Video clip from the opening ceremony of the rural cardiology clinic.', youtube_id: '9bZkp7q19f0' }
    ];

    for (const video of youtubeVideos) {
      await pool.query(
        `INSERT INTO videos (family_id, member_id, title, description, video_type, youtube_id, youtube_url, is_featured, uploaded_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [video.family_id, video.member_id, video.title, video.description, 'youtube', video.youtube_id, `https://www.youtube.com/watch?v=${video.youtube_id}`, 1, adminId]
      );
    }
    console.log('Media & Videos seeded.');

    // 8. Seed Grave locations
    const graveLocationsData = [
      { member_id: 1, latitude: 9.591000, longitude: 76.522000, address: 'Kottayam, Kerala, India', cemetery_name: 'St. Marys Orthodox Church Cemetery', plot_number: 'Plot-01A', section: 'Section A' },
      { member_id: 2, latitude: 9.591100, longitude: 76.522100, address: 'Kottayam, Kerala, India', cemetery_name: 'St. Marys Orthodox Church Cemetery', plot_number: 'Plot-01B', section: 'Section A' },
      { member_id: 3, latitude: 9.588267, longitude: 76.522904, address: 'Kottayam, Kerala, India', cemetery_name: 'St. Marys Orthodox Church Cemetery', plot_number: 'Plot-40B', section: 'Section B' },
      { member_id: 4, latitude: 9.588300, longitude: 76.522950, address: 'Kottayam, Kerala, India', cemetery_name: 'St. Marys Orthodox Church Cemetery', plot_number: 'Plot-40C', section: 'Section B' },
      { member_id: 5, latitude: 9.588400, longitude: 76.522800, address: 'Kottayam, Kerala, India', cemetery_name: 'St. Marys Orthodox Church Cemetery', plot_number: 'Plot-41A', section: 'Section B' },
      { member_id: 6, latitude: 9.588500, longitude: 76.522700, address: 'Kottayam, Kerala, India', cemetery_name: 'St. Marys Orthodox Church Cemetery', plot_number: 'Plot-42A', section: 'Section B' },
      { member_id: 7, latitude: 9.588600, longitude: 76.522600, address: 'Kottayam, Kerala, India', cemetery_name: 'St. Marys Orthodox Church Cemetery', plot_number: 'Plot-43A', section: 'Section B' },
      { member_id: 8, latitude: 9.588700, longitude: 76.522500, address: 'Kottayam, Kerala, India', cemetery_name: 'St. Marys Orthodox Church Cemetery', plot_number: 'Plot-44A', section: 'Section B' },
      { member_id: 12, latitude: 9.588800, longitude: 76.522400, address: 'Kottayam, Kerala, India', cemetery_name: 'St. Marys Orthodox Church Cemetery', plot_number: 'Plot-42B', section: 'Section B' },
      { member_id: 20, latitude: 9.387100, longitude: 76.505000, address: 'Niranam, Pathanamthitta, India', cemetery_name: 'St. Marys Church Cemetery Niranam', plot_number: 'Plot-CV01', section: 'Main Section' },
      { member_id: 21, latitude: 9.387200, longitude: 76.505100, address: 'Niranam, Pathanamthitta, India', cemetery_name: 'St. Marys Church Cemetery Niranam', plot_number: 'Plot-CV02', section: 'Main Section' },
      { member_id: 22, latitude: 9.387300, longitude: 76.505200, address: 'Niranam, Pathanamthitta, India', cemetery_name: 'St. Marys Church Cemetery Niranam', plot_number: 'Plot-CV03', section: 'Main Section' },
      { member_id: 24, latitude: 9.387400, longitude: 76.505300, address: 'Niranam, Pathanamthitta, India', cemetery_name: 'St. Marys Church Cemetery Niranam', plot_number: 'Plot-CV04', section: 'Main Section' }
    ];

    for (const grave of graveLocationsData) {
      await pool.query(
        `INSERT INTO grave_locations (member_id, latitude, longitude, address, cemetery_name, plot_number, section)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [grave.member_id, grave.latitude, grave.longitude, grave.address, grave.cemetery_name, grave.plot_number, grave.section]
      );
    }
    console.log('Grave locations seeded.');

    // 9. Seed Memorial Messages (Approved & Pending)
    const messagesData = [
      { member_id: 1, visitor_name: 'Dr. Joseph Samuel', message: 'Appachan was an inspiration to all of us. His memory will always remain in our hearts.', is_approved: 1 },
      { member_id: 1, visitor_name: 'Abraham Mathew', message: 'Remembering the patriarch of our family on his memorial day.', is_approved: 1 },
      { member_id: 1, visitor_name: 'Unknown Visitor', message: 'Wonderful site, looks very neat.', is_approved: 0 },
      
      { member_id: 2, visitor_name: 'Elizabeth Kurian', message: 'Ammachi was the kindest soul. Her traditional recipes and love are still cherished.', is_approved: 1 },
      { member_id: 2, visitor_name: 'Sarah Joseph', message: 'Miss you, Ammachi. Thank you for all the beautiful stories.', is_approved: 1 },
      
      { member_id: 3, visitor_name: 'Thomas Varghese', message: 'John was an outstanding engineer and a very good friend. Working with him was an honor.', is_approved: 1 },
      { member_id: 3, visitor_name: 'Anonymous', message: 'Miss you Uncle Joy.', is_approved: 0 },
      
      { member_id: 4, visitor_name: 'Prof. Jacob George', message: 'Thankachan was a brilliant academic. His lectures on Shakespeare were legendary.', is_approved: 1 },
      { member_id: 4, visitor_name: 'Former Student', message: 'You changed my life, professor. Rest in peace.', is_approved: 1 },
      { member_id: 4, visitor_name: 'SEO Spammer', message: 'Cheap electronics on sale! Click here to buy bitcoin!', is_approved: 0 },
      
      { member_id: 5, visitor_name: 'K. R. Pillai', message: 'Sunny set an example in organic farming. His agricultural models are still followed by many.', is_approved: 1 },
      { member_id: 5, visitor_name: 'Neighbor', message: 'Always helpful and smiling. Rest in peace, Sunny chettan.', is_approved: 1 },
      
      { member_id: 6, visitor_name: 'Mercy Daniel', message: 'Dr. George treated my grandfather with so much care. A truly noble doctor.', is_approved: 1 },
      { member_id: 6, visitor_name: 'Colleague Doctor', message: 'His contributions to cardiology and charity will never be forgotten.', is_approved: 1 },
      { member_id: 6, visitor_name: 'Cryptobot', message: 'Make money working from home! Click my link.', is_approved: 0 },
      
      { member_id: 7, visitor_name: 'Adv. Suresh Kumar', message: 'Roy was a man of integrity in the courtroom. A great lawyer and environmentalist.', is_approved: 1 },
      { member_id: 7, visitor_name: 'Social Worker', message: 'His pro-bono work for environmental conservation helped save our local wetlands.', is_approved: 1 },
      
      { member_id: 8, visitor_name: 'Choir Member', message: 'Babu uncle had an angelic voice. The church choir will never be the same without him.', is_approved: 1 },
      { member_id: 8, visitor_name: 'Family Friend', message: 'Remembering Babu with love and prayers.', is_approved: 1 },
      
      { member_id: 12, visitor_name: 'Dr. John Philip', message: 'Elizabeth was a dedicated pediatrician and a loving mother. Her memories shine on.', is_approved: 1 },
      
      { member_id: 20, visitor_name: 'K. C. Chacko', message: 'A respected figure in Niranam. Rest in peace, Cherian.', is_approved: 1 },
      { member_id: 21, visitor_name: 'Mariamma Jacob', message: 'Miss you, Aleyamma. Your prayers sustained many.', is_approved: 1 },
      { member_id: 22, visitor_name: 'Colleague Doctor', message: 'Dr. Cherian was a pioneer in general medicine. Deepest condolences.', is_approved: 1 },
      { member_id: 24, visitor_name: 'Grace Supporter', message: 'A gentle lady who empowered so many rural women. Gone too soon.', is_approved: 1 }
    ];

    for (const msg of messagesData) {
      const fId = msg.member_id <= 19 ? mathaiFamilyId : cherianFamilyId;
      await pool.query(
        `INSERT INTO memorial_messages (family_id, member_id, visitor_name, message, is_approved, approved_by, approved_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [fId, msg.member_id, msg.visitor_name, msg.message, msg.is_approved, msg.is_approved ? adminId : null, msg.is_approved ? new Date() : null]
      );
    }
    console.log('Memorial messages seeded.');

    // 10. Generate Physical QR Code PNGs for all deceased members (13 total)
    const domain = process.env.DOMAIN || 'http://localhost:5173';
    
    // We generate QR codes for all deceased members: 1, 2, 3, 4, 5, 6, 7, 8, 12, 20, 21, 22, 24
    const deceasedMembers = membersData.filter(m => m.is_deceased === 1);
    for (const m of deceasedMembers) {
      try {
        const qr = await generateQRCode(m.slug, domain);
        await pool.query(
          `INSERT INTO qr_codes (family_id, member_id, code, file_path, slug, url, generated_by) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [m.family_id, m.id, qr.fileName, qr.filePath, m.slug, qr.url, adminId]
        );
        console.log(`QR generated for: ${m.full_name}`);
      } catch (err) {
        console.error(`Failed to generate QR for ${m.full_name}:`, err.message);
      }
    }

    console.log('Seeding completed successfully!');
  } catch (err) {
    console.error('Seeding failed:', err.message, err.stack);
  } finally {
    await pool.end();
  }
}

seed();
