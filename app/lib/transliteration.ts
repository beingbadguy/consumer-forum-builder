/**
 * Hinglish to Hindi Transliteration and English to Hindi Translation Engine
 *
 * Provides:
 * 1. Synchronous & asynchronous Hinglish-to-Devanagari transliteration.
 * 2. High-accuracy dictionary of common Indian names, legal & daily vocabulary.
 * 3. Algorithmic Indic syllabic phonetic engine for unseen words with zero mixed characters.
 * 4. Google Input Tools API integration (client & Next.js server proxy) with caching.
 * 5. English sentence detection and translation into Hindi.
 * 6. Protection of numbers, currencies, emails, URLs, dates, and identifiers.
 */

// In-memory cache for fast, instant lookups
export const TRANSLIT_CACHE = new Map<string, string>();
export const TRANSLATE_CACHE = new Map<string, string>();

/**
 * Common Hinglish to Hindi vocabulary dictionary
 * Includes pronouns, verbs, auxiliaries, common Indian names, legal terms,
 * and everyday conversational words.
 */
export const HINGLISH_DICTIONARY: Record<string, string> = {
  // Pronouns & Demonstratives
  'mera': 'मेरा',
  'meri': 'मेरी',
  'mere': 'मेरे',
  'tera': 'तेरा',
  'teri': 'तेरी',
  'tere': 'तेरे',
  'hum': 'हम',
  'hamara': 'हमारा',
  'hamari': 'हमारी',
  'hamare': 'हमारे',
  'humne': 'हमने',
  'maine': 'मैंने',
  'unhone': 'उन्होंने',
  'inhone': 'इन्होंने',
  'tumne': 'तुमने',
  'aapne': 'आपने',
  'unka': 'उनका',
  'unki': 'उनकी',
  'unke': 'उनके',
  'iska': 'इसका',
  'iski': 'इसकी',
  'iske': 'इसके',
  'aap': 'आप',
  'aapka': 'आपका',
  'aapki': 'आपकी',
  'aapke': 'आपके',
  'tum': 'तुम',
  'tumhara': 'तुम्हारा',
  'tumhari': 'तुम्हारी',
  'tumhare': 'तुम्हारे',
  'yeh': 'यह',
  'ye': 'यह',
  'voh': 'वह',
  'woh': 'वह',
  'wo': 'वह',
  'main': 'मैं',
  'mai': 'मैं',
  'mujhe': 'मुझे',
  'apni': 'अपनी',
  'apna': 'अपना',
  'apne': 'अपने',
  'kya': 'क्या',
  'kyun': 'क्यों',
  'kyu': 'क्यों',
  'kaise': 'कैसे',
  'kaha': 'कहाँ',
  'kahan': 'कहाँ',
  'kab': 'कब',
  'kaun': 'कौन',
  'kisko': 'किसको',
  'kiska': 'किसका',
  'kiski': 'किसकी',
  'kiske': 'किसके',
  'kise': 'किसे',

  // Auxiliaries & Verbs
  'hai': 'है',
  'hain': 'हैं',
  'ho': 'हो',
  'hoon': 'हूँ',
  'hu': 'हूँ',
  'hun': 'हूँ',
  'tha': 'था',
  'thi': 'थी',
  'the': 'थे',
  'raha': 'रहा',
  'rahi': 'रही',
  'rahe': 'रहे',
  'hoga': 'होगा',
  'hogi': 'होगी',
  'hoge': 'होंगे',
  'honge': 'होंगे',
  'karta': 'करता',
  'karti': 'करती',
  'karte': 'करते',
  'karna': 'करना',
  'karni': 'करनी',
  'karne': 'करने',
  'kar': 'कर',
  'kiya': 'किया',
  'kiye': 'किए',
  'ki': 'की',
  'diya': 'दिया',
  'diye': 'दिए',
  'dene': 'देने',
  'dena': 'देना',
  'deni': 'देनी',
  'liya': 'लिया',
  'liye': 'लिए',
  'lene': 'लेने',
  'lena': 'लेना',
  'gaya': 'गया',
  'gayi': 'गई',
  'gaye': 'गए',
  'ja': 'जा',
  'jana': 'जाना',
  'jani': 'जानी',
  'jane': 'जाने',
  'aana': 'आना',
  'aaya': 'आया',
  'aayi': 'आई',
  'aaye': 'आए',
  'paas': 'पास',
  'saath': 'साथ',
  'baad': 'बाद',
  'pehle': 'पहले',
  'pahle': 'पहले',
  'andar': 'अंदर',
  'bahar': 'बाहर',
  'upar': 'ऊपर',
  'niche': 'नीचे',
  'aage': 'आगे',
  'piche': 'पीछे',
  'bhi': 'भी',
  'hi': 'ही',
  'aur': 'और',
  'ya': 'या',
  'lekin': 'लेकिन',
  'parantu': 'परंतु',
  'magar': 'मगर',
  'par': 'पर',
  'se': 'से',
  'ko': 'को',
  'ka': 'का',
  'ke': 'के',
  'me': 'में',
  'mein': 'में',
  'ne': 'ने',
  'tak': 'तक',
  'abhi': 'अभी',
  'aaj': 'आज',
  'kal': 'कल',
  'nahi': 'नहीं',
  'nahin': 'नहीं',
  'na': 'ना',
  'mat': 'मत',
  'kuch': 'कुछ',
  'kuchh': 'कुछ',
  'sab': 'सब',
  'sabhi': 'सभी',
  'bahut': 'बहुत',
  'kam': 'कम',
  'zyada': 'ज़्यादा',
  'jyada': 'ज्यादा',
  'sirf': 'सिर्फ़',
  'keval': 'केवल',
  'kripya': 'कृपया',
  'kripaya': 'कृपया',
  'please': 'कृपया',
  'rehta': 'रहता',
  'rehti': 'रहती',
  'rehte': 'रहते',

  // Names (Standard Indian First Names & Surnames)
  'naam': 'नाम',
  'deepak': 'दीपक',
  'aman': 'अमन',
  'rahul': 'राहुल',
  'kumar': 'कुमार',
  'sharma': 'शर्मा',
  'rohit': 'रोहित',
  'priya': 'प्रिया',
  'amit': 'अमित',
  'singh': 'सिंह',
  'verma': 'वर्मा',
  'gupta': 'गुप्ता',
  'devi': 'देवी',
  'sunita': 'सुनीता',
  'ramesh': 'रमेश',
  'rajesh': 'राजेश',
  'anita': 'अनिता',
  'pooja': 'पूजा',
  'puja': 'पूजा',
  'neha': 'नेहा',
  'vikas': 'विकास',
  'vikash': 'विकास',
  'sanjay': 'संजय',
  'ajay': 'अजय',
  'vijay': 'विजय',
  'manoj': 'मनोज',
  'suresh': 'सुरेश',
  'dinesh': 'दिनेश',
  'anil': 'अनिल',
  'sunil': 'सुनील',
  'alok': 'आलोक',
  'ashok': 'अशोक',
  'mukesh': 'मुकेश',
  'pradeep': 'प्रदीप',
  'praveen': 'प्रवीण',
  'sandeep': 'संदीप',
  'santosh': 'संतोष',
  'kavita': 'कविता',
  'rekha': 'रेखा',
  'anuradha': 'अनुराधा',
  'arti': 'आरती',
  'aarti': 'आरती',
  'shivam': 'शिवम',
  'satyam': 'सत्यम',
  'ankit': 'अंकित',
  'abhishek': 'अभिषेक',
  'yadav': 'यादव',
  'pandey': 'पांडेय',
  'tiwari': 'तिवारी',
  'mishra': 'मिश्रा',
  'pathak': 'पाठक',
  'dubey': 'दुबे',
  'tripathi': 'त्रिपाठी',
  'shukla': 'शुक्ला',
  'chaturvedi': 'चतुर्वेदी',
  'chaudhary': 'चौधरी',
  'patel': 'पटेल',
  'shah': 'शाह',
  'mehta': 'मेहता',
  'jain': 'जैन',
  'agarwal': 'अग्रवाल',
  'aggarwal': 'अग्रवाल',
  'khan': 'खान',
  'ansari': 'अंसारी',
  'ali': 'अली',
  'sinha': 'सिन्हा',
  'thakur': 'ठाकुर',
  'singhania': 'सिंघानिया',
  'jha': 'झा',
  'shri': 'श्री',
  'shrimati': 'श्रीमती',
  'late': 'स्व.',

  // States & Major Cities
  'bihar': 'बिहार',
  'delhi': 'दिल्ली',
  'patna': 'पटना',
  'mumbai': 'मुंबई',
  'kolkata': 'कोलकाता',
  'lucknow': 'लखनऊ',
  'kanpur': 'कानपुर',
  'jaipur': 'जयपुर',
  'ranchi': 'राँची',
  'bhopal': 'भोपाल',
  'indore': 'इंदौर',
  'varanasi': 'वाराणसी',
  'noida': 'नोएडा',
  'ghaziabad': 'गाज़ियाबाद',
  'haryana': 'हरियाणा',
  'punjab': 'पंजाब',
  'rajasthan': 'राजस्थान',
  'gujarat': 'गुजरात',
  'maharashtra': 'महाराष्ट्र',
  'bengal': 'बंगाल',
  'odisha': 'ओडिशा',
  'uttar': 'उत्तर',
  'pradesh': 'प्रदेश',
  'madhya': 'मध्य',

  // Legal & Dispute Vocabulary
  'shikayat': 'शिकायत',
  'complaint': 'शिकायत',
  'darj': 'दर्ज',
  'file': 'फ़ाइल',
  'filed': 'दायर',
  'filing': 'दाखिल',
  'paisa': 'पैसा',
  'paise': 'पैसे',
  'wapas': 'वापस',
  'mila': 'मिला',
  'mile': 'मिले',
  'milna': 'मिलना',
  'mil': 'मिल',
  'insurance': 'इंश्योरेंस',
  'claim': 'क्लेम',
  'reject': 'रिजेक्ट',
  'rejected': 'खारिज',
  'kharid': 'खरीद',
  'kharida': 'खरीदा',
  'kharidi': 'खरीदी',
  'kharide': 'खरीदे',
  'becha': 'बेचा',
  'khareedna': 'खरीदना',
  'bikri': 'बिक्री',
  'samagri': 'सामग्री',
  'saman': 'सामान',
  'vastu': 'वस्तु',
  'seva': 'सेवा',
  'kami': 'कमी',
  'deficiency': 'कमी',
  'fraud': 'धोखाधड़ी',
  'dhoka': 'धोखा',
  'dhokhadhadi': 'धोखाधड़ी',
  'dhokhadhari': 'धोखाधड़ी',
  'aayog': 'आयोग',
  'commission': 'कमीशन',
  'consumer': 'उपभोक्ता',
  'upbhokta': 'उपभोक्ता',
  'parivadi': 'परिवादी',
  'complainant': 'परिवादी',
  'vipakshi': 'विपक्षी',
  'opposite': 'विपक्षी',
  'party': 'पक्षकार',
  'pakshakar': 'पक्षकार',
  'parivad': 'परिवाद',
  'patra': 'पत्र',
  'shapath': 'शपथ',
  'halfnama': 'हलफ़नामा',
  'affidavit': 'शपथ पत्र',
  'prarthana': 'प्रार्थना',
  'prayer': 'प्रार्थना',
  'anurodh': 'अनुरोध',
  'muavza': 'मुआवजा',
  'muavaja': 'मुआवजा',
  'compensation': 'मुआवजा',
  'shatipoorti': 'क्षतिपूर्ति',
  'dava': 'दावा',
  'rashi': 'राशि',
  'kul': 'कुल',
  'total': 'कुल',
  'amount': 'राशि',
  'byaj': 'ब्याज',
  'interest': 'ब्याज',
  'dar': 'दर',
  'kharch': 'खर्च',
  'kharcha': 'खर्चा',
  'vyay': 'व्यय',
  'litigation': 'मुकदमेबाजी',
  'mukadma': 'मुकदमा',
  'mukadmebazi': 'मुकदमेबाजी',
  'nyay': 'न्याय',
  'nyayalaya': 'न्यायालय',
  'court': 'कोर्ट',
  'case': 'केस',
  'pending': 'लंबित',
  'forum': 'फ़ोरम',
  'district': 'जिला',
  'jila': 'जिला',
  'rajya': 'राज्य',
  'state': 'राज्य',
  'thana': 'थाना',
  'police': 'पुलिस',
  'station': 'स्टेशन',
  'dakghar': 'डाकघर',
  'post': 'पोस्ट',
  'office': 'कार्यालय',
  'karyalay': 'कार्यालय',
  'prabandhak': 'प्रबंधक',
  'manager': 'मैनेजर',
  'shakha': 'शाखा',
  'branch': 'शाखा',
  'company': 'कंपनी',
  'adhivakta': 'अधिवक्ता',
  'vakeel': 'वकील',
  'vakil': 'वकील',
  'advocate': 'अधिवक्ता',
  'counsel': 'वकील',
  'notice': 'नोटिस',
  'tareekh': 'तारीख',
  'tarikh': 'तारीख',
  'dinank': 'दिनांक',
  'date': 'तारीख',
  'year': 'वर्ष',
  'saal': 'साल',
  'mahina': 'महीना',
  'month': 'महीना',
  'din': 'दिन',
  'day': 'दिन',
  'samay': 'समय',
  'time': 'समय',
  'bima': 'बीमा',
  'policy': 'पॉलिसी',
  'premium': 'प्रीमियम',
  'rasid': 'रसीद',
  'receipt': 'रसीद',
  'bill': 'बिल',
  'invoice': 'इनवॉइस',
  'tax': 'टैक्स',
  'bank': 'बैंक',
  'khata': 'खाता',
  'account': 'खाता',
  'cheque': 'चेक',
  'check': 'चेक',
  'online': 'ऑनलाइन',
  'payment': 'पेमेंट',
  'bhugtan': 'भुगतान',
  'transaction': 'लेनदेन',
  'refund': 'रिफंड',
  'return': 'वापसी',
  'wapsi': 'वापसी',
  'exchange': 'बदलाव',
  'guarantee': 'गारंटी',
  'warranty': 'वारंटी',
  'kharab': 'ख़राब',
  'tuta': 'टूटा',
  'defective': 'दोषपूर्ण',
  'doshpurna': 'दोषपूर्ण',
  'hospital': 'अस्पताल',
  'doctor': 'डॉक्टर',
  'dawa': 'दवा',
  'ilaj': 'इलाज',
  'treatment': 'इलाज',
  'mritak': 'मृतक',
  'mrityu': 'मृत्यु',
  'death': 'मृत्यु',
  'praman': 'प्रमाण',
  'pramanpatra': 'प्रमाण पत्र',
  'certificate': 'सर्टिफिकेट',
  'dastavez': 'दस्तावेज़',
  'document': 'दस्तावेज़',
  'documents': 'दस्तावेज़',
  'sanlagnak': 'संलग्नक',
  'annexure': 'संलग्नक',
  'suchi': 'सूची',
  'index': 'अनुक्रमणिका',
  'page': 'पृष्ठ',
  'prishth': 'पृष्ठ',
  'sankhya': 'संख्या',
  'number': 'नंबर',
  'no': 'नंबर',
  'flat': 'फ़्लैट',
  'plot': 'प्लॉट',
  'makan': 'मकान',
  'ghar': 'घर',
  'builder': 'बिल्डर',
  'project': 'प्रोजेक्ट',
  'order': 'ऑर्डर',
  'kabza': 'कब्ज़ा',
  'possession': 'कब्ज़ा',
  'delay': 'विलंब',
  'vilamb': 'विलंब',
  'der': 'देर',
  'samvedansheel': 'संवेदनशील',
  'manasik': 'मानसिक',
  'santap': 'संताप',
  'pratadna': 'प्रताड़ना',
  'sharirik': 'शारीरिक',
  'aarthik': 'आर्थिक',
  'hani': 'हानि',
  'nuksan': 'नुकसान',
  'satya': 'सत्य',
  'sahi': 'सही',
  'galat': 'गलत',
  'asaty': 'असत्य',
  'satyapan': 'सत्यापन',
  'verification': 'सत्यापन',
  'adhikar': 'अधिकार',
  'kshetra': 'क्षेत्र',
  'dhara': 'धारा',
  'section': 'धारा',
  'niyam': 'नियम',
  'act': 'अधिनियम',
  'adhiniyam': 'अधिनियम',
  'aadesh': 'आदेश',
  'faisla': 'फ़ैसला',
  'nirnay': 'निर्णय',
  'judgment': 'निर्णय',
  'appeel': 'अपील',
  'appeal': 'अपील',
  'koshish': 'कोशिश',
  'bataya': 'बताया',
  'bola': 'बोला',
  'likha': 'लिखा',
  'bheja': 'भेजा',
  'prapt': 'प्राप्त',
  'bhejna': 'भेजना',
  'maang': 'मांग',
  'manga': 'मांगा',
  'den': 'दें',
  'karein': 'करें',
  'kare': 'करे',
};

// Populate initial cache with dictionary values
for (const [k, v] of Object.entries(HINGLISH_DICTIONARY)) {
  TRANSLIT_CACHE.set(k.toLowerCase(), v);
}

/**
 * Phonetic syllabary mappings for robust Indic conversion
 */
const VOWEL_INITIAL: Record<string, string> = {
  'aa': 'आ', 'a': 'अ', 'ee': 'ई', 'i': 'इ', 'oo': 'ऊ', 'u': 'उ',
  'e': 'ए', 'ai': 'ऐ', 'o': 'ओ', 'au': 'औ', 'ri': 'ऋ',
};

const MATRA: Record<string, string> = {
  'aa': 'ा', 'a': '', 'ee': 'ी', 'i': 'ि', 'oo': 'ू', 'u': 'ु',
  'e': 'े', 'ai': 'ै', 'o': 'ो', 'au': 'ौ', 'ri': 'ृ',
};

const CONSONANTS: Record<string, string> = {
  'shh': 'ष', 'chh': 'छ',
  'kh': 'ख', 'gh': 'घ', 'ch': 'च', 'jh': 'झ',
  'th': 'थ', 'dh': 'ध', 'ph': 'फ', 'bh': 'भ',
  'sh': 'श', 'thh': 'ठ', 'dhh': 'ढ',
  'k': 'क', 'g': 'ग', 'c': 'क',
  'j': 'ज', 'z': 'ज़', 'f': 'फ़',
  't': 'त', 'd': 'द', 'n': 'न',
  'p': 'प', 'b': 'ब', 'm': 'म',
  'y': 'य', 'r': 'र', 'l': 'ल',
  'v': 'व', 'w': 'व', 's': 'स', 'h': 'ह',
  'q': 'क़', 'x': 'क्स',
};

/**
 * Ensures that no output word contains mixed Devanagari and Latin characters.
 * E.g., prevents outputs like 'अंaन', 'दीpक', or 'कुmar'.
 */
export function cleanMixedScript(text: string): string {
  if (!text) return '';
  // Check if text has both Devanagari (\u0900-\u097F) and Latin ([a-zA-Z])
  const hasDevanagari = /[\u0900-\u097F]/.test(text);
  const hasLatin = /[a-zA-Z]/.test(text);

  if (hasDevanagari && hasLatin) {
    // Strip isolated leftover single Latin characters inside Hindi words
    return text.replace(/([\u0900-\u097F]+)[a-zA-Z]+([\u0900-\u097F]*)/g, '$1$2')
               .replace(/[a-zA-Z]+([\u0900-\u097F]+)/g, '$1');
  }
  return text;
}

/**
 * Converts a single Hinglish phonetic word into clean Devanagari
 * using Indic syllabic parsing with matras, halant, and zero leftover ASCII characters.
 */
export function phoneticTransliterateWord(word: string): string {
  if (!word) return '';

  const lower = word.toLowerCase();
  if (TRANSLIT_CACHE.has(lower)) {
    return TRANSLIT_CACHE.get(lower)!;
  }

  // Preserve numerical and special strings
  if (/^[0-9]+$/.test(lower)) return lower;
  if (/^[^a-z]+$/.test(lower)) return lower;

  let result = '';
  let i = 0;
  const len = lower.length;

  while (i < len) {
    const isInitial = (i === 0);

    if (isInitial) {
      // Check 2-letter vowel, then 1-letter vowel
      const v2 = lower.slice(i, i + 2);
      const v1 = lower.slice(i, i + 1);

      if (VOWEL_INITIAL[v2]) {
        result += VOWEL_INITIAL[v2];
        i += 2;
        continue;
      }
      if (VOWEL_INITIAL[v1]) {
        result += VOWEL_INITIAL[v1];
        i += 1;
        continue;
      }
    }

    // Match consonant (3-char, 2-char, 1-char)
    let cons = '';
    let consLen = 0;

    const c3 = lower.slice(i, i + 3);
    const c2 = lower.slice(i, i + 2);
    const c1 = lower.slice(i, i + 1);

    if (CONSONANTS[c3]) {
      cons = CONSONANTS[c3];
      consLen = 3;
    } else if (CONSONANTS[c2]) {
      cons = CONSONANTS[c2];
      consLen = 2;
    } else if (CONSONANTS[c1]) {
      cons = CONSONANTS[c1];
      consLen = 1;
    }

    if (cons) {
      result += cons;
      i += consLen;

      // Look ahead for matra
      if (i < len) {
        const vm2 = lower.slice(i, i + 2);
        const vm1 = lower.slice(i, i + 1);

        if (MATRA[vm2] !== undefined) {
          result += MATRA[vm2];
          i += 2;
        } else if (MATRA[vm1] !== undefined) {
          if (vm1 === 'a') {
            if (i === len - 1 && len > 3) {
              result += 'ा';
            }
            i += 1;
          } else {
            result += MATRA[vm1];
            i += 1;
          }
        } else if (lower[i] >= 'a' && lower[i] <= 'z') {
          // Next is another consonant -> halant conjunct
          result += '्';
        }
      }
      continue;
    }

    // Middle vowel
    const v2 = lower.slice(i, i + 2);
    const v1 = lower.slice(i, i + 1);
    if (MATRA[v2] !== undefined) {
      result += MATRA[v2];
      i += 2;
      continue;
    }
    if (MATRA[v1] !== undefined) {
      result += MATRA[v1];
      i += 1;
      continue;
    }

    // Advance without appending raw Latin character!
    i++;
  }

  // Remove dangling halant
  if (result.endsWith('्')) {
    result = result.slice(0, -1);
  }

  // Only cache if pure Devanagari
  if (result && !/[a-zA-Z]/.test(result)) {
    TRANSLIT_CACHE.set(lower, result);
  }

  return cleanMixedScript(result);
}

/**
 * Instant synchronous word transliteration for keydown (Space/Enter/Punctuation).
 * Returns highest-accuracy word from dictionary or cache, or phonetic fallback.
 */
export function transliterateWordImmediate(word: string): string {
  if (!word || !word.trim()) return word;

  const trimmed = word.trim();
  const lower = trimmed.toLowerCase();

  // 1. O(1) Instant dictionary lookup
  if (HINGLISH_DICTIONARY[lower]) {
    return HINGLISH_DICTIONARY[lower];
  }

  // 2. Memory cache lookup
  if (TRANSLIT_CACHE.has(lower)) {
    const cached = TRANSLIT_CACHE.get(lower)!;
    if (cached && !/[a-zA-Z]/.test(cached)) {
      return cached;
    }
  }

  // 3. Preserve identifiers, numbers, emails
  if (/^[0-9\/\-\.:@_]+$/.test(trimmed) || trimmed.includes('@') || trimmed.startsWith('http')) {
    return trimmed;
  }

  // 4. Algorithmic Indic syllable transliteration (clean Devanagari, NO English letters)
  const phonetic = phoneticTransliterateWord(trimmed);
  return cleanMixedScript(phonetic) || trimmed;
}

/**
 * Asynchronously fetches high-accuracy transliteration via Google Input Tools API,
 * using the Next.js server proxy or direct endpoint, with memory caching.
 */
export async function fetchGoogleTransliteration(word: string): Promise<string> {
  const trimmed = word.trim();
  if (!trimmed) return word;

  const lower = trimmed.toLowerCase();

  // 1. Check dictionary first
  if (HINGLISH_DICTIONARY[lower]) {
    return HINGLISH_DICTIONARY[lower];
  }

  // 2. Check cache
  if (TRANSLIT_CACHE.has(lower)) {
    const cached = TRANSLIT_CACHE.get(lower)!;
    if (cached && !/[a-zA-Z]/.test(cached)) {
      return cached;
    }
  }

  // Do not transliterate numbers, emails, URLs, dates
  if (/^[0-9\/\-\.:@_]+$/.test(trimmed) || trimmed.includes('@') || trimmed.startsWith('http')) {
    return trimmed;
  }

  // 3. Try Next.js local server proxy /api/transliterate
  try {
    const localUrl = `/api/transliterate?text=${encodeURIComponent(trimmed)}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(localUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.result && typeof data.result === 'string' && data.result !== trimmed) {
        const clean = cleanMixedScript(data.result);
        TRANSLIT_CACHE.set(lower, clean);
        return clean;
      }
    }
  } catch {
    // If local fetch fails, try direct external or fallback
  }

  // 4. Try direct Google Input Tools endpoint
  try {
    const directUrl = `https://inputtools.google.com/request?text=${encodeURIComponent(
      trimmed
    )}&itc=hi-t-i0-und&num=3&cp=0&cs=1&ie=utf-8&oe=utf-8`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    const res = await fetch(directUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (
        Array.isArray(data) &&
        data[0] === 'SUCCESS' &&
        Array.isArray(data[1]) &&
        data[1][0] &&
        Array.isArray(data[1][0][1]) &&
        data[1][0][1][0]
      ) {
        const hindiWord = cleanMixedScript(data[1][0][1][0]);
        TRANSLIT_CACHE.set(lower, hindiWord);
        return hindiWord;
      }
    }
  } catch {
    // Fallback safely to phonetic
  }

  // 5. Fallback to algorithmic phonetic engine
  const fallback = phoneticTransliterateWord(trimmed);
  return cleanMixedScript(fallback);
}

/**
 * Detects whether a text chunk is a complete English sentence rather than Hinglish.
 * Checks for standard English auxiliary words, pronouns, and sentence syntax.
 */
export function isEnglishSentence(text: string): boolean {
  if (!text || text.trim().length < 5) return false;

  const englishMarkers = [
    'i', 'you', 'we', 'they', 'he', 'she', 'it',
    'want', 'have', 'has', 'had', 'not', 'received', 'refund', 'complaint',
    'file', 'filed', 'filing', 'paid', 'pay', 'order', 'ordered', 'delivered',
    'please', 'my', 'our', 'your', 'their', 'his', 'her',
    'the', 'this', 'that', 'these', 'those',
    'is', 'am', 'are', 'was', 'were', 'will', 'would', 'shall', 'should', 'can', 'could',
    'from', 'with', 'without', 'because', 'against', 'company', 'service',
  ];

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(Boolean);

  if (words.length < 3) return false;

  let matchCount = 0;
  for (const w of words) {
    if (englishMarkers.includes(w)) {
      matchCount++;
    }
  }

  return matchCount >= Math.min(3, Math.ceil(words.length * 0.45));
}

/**
 * Common legal complaint sentences dictionary for offline translation
 */
const COMMON_SENTENCE_TRANSLATIONS: Record<string, string> = {
  'i want to file a complaint': 'मैं एक परिवाद दर्ज करना चाहता हूँ।',
  'i want to file a complaint.': 'मैं एक परिवाद दर्ज करना चाहता हूँ।',
  'i have not received my refund': 'मुझे मेरा रिफंड नहीं मिला है।',
  'i have not received my refund.': 'मुझे मेरा रिफंड नहीं मिला है।',
  'my insurance claim was rejected': 'मेरा बीमा दावा निरस्त कर दिया गया था।',
  'my insurance claim was rejected.': 'मेरा बीमा दावा निरस्त कर दिया गया था।',
  'the company refused to refund my money': 'कंपनी ने मेरे पैसे वापस करने से इनकार कर दिया।',
  'the product delivered was defective': 'वितरित किया गया उत्पाद दोषपूर्ण था।',
  'there is severe deficiency in service': 'सेवा में गंभीर कमी है।',
  'please grant compensation for mental agony': 'कृपया मानसिक संताप हेतु मुआवजा प्रदान करें।',
  'i purchased goods on': 'मैंने सामान खरीदा था दिनांक',
};

/**
 * Translates a complete English sentence into Hindi.
 * Falls back to word-by-word transliteration if translation is unavailable.
 */
export async function translateEnglishSentence(sentence: string): Promise<string> {
  const trimmed = sentence.trim();
  if (!trimmed) return sentence;

  const lower = trimmed.toLowerCase();
  if (TRANSLATE_CACHE.has(lower)) {
    return TRANSLATE_CACHE.get(lower)!;
  }

  // Check offline dictionary first
  if (COMMON_SENTENCE_TRANSLATIONS[lower]) {
    const res = COMMON_SENTENCE_TRANSLATIONS[lower];
    TRANSLATE_CACHE.set(lower, res);
    return res;
  }

  // 1. Try local server route /api/translate
  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: trimmed }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.result && typeof data.result === 'string') {
        TRANSLATE_CACHE.set(lower, data.result);
        return data.result;
      }
    }
  } catch {
    // Try direct endpoint if server route unavailable
  }

  // 2. Direct Google Translate client endpoint
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${encodeURIComponent(
      trimmed
    )}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const translated = data[0].map((item: any) => item[0]).join('');
        if (translated && translated.trim().length > 0) {
          TRANSLATE_CACHE.set(lower, translated);
          return translated;
        }
      }
    }
  } catch {
    // Fallback to full text transliteration
  }

  return transliterateFullText(trimmed);
}

/**
 * Transliterates an entire string of text preserving punctuation,
 * numbers, emails, and spacing, ensuring 100% Devanagari script.
 */
export async function transliterateFullText(text: string): Promise<string> {
  if (!text) return '';

  const tokens = text.split(/(\s+|[.,;!?()[\]{}"'\-\/]+)/);

  const convertedTokens = await Promise.all(
    tokens.map(async (tok) => {
      if (/^[\s.,;!?()[\]{}"'\-\/]+$/.test(tok)) {
        return tok;
      }
      if (/^[0-9\/\-\.:@_]+$/.test(tok) || tok.includes('@') || tok.startsWith('http')) {
        return tok;
      }
      return await fetchGoogleTransliteration(tok);
    })
  );

  return cleanMixedScript(convertedTokens.join(''));
}
