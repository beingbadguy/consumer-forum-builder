import { ComplaintFormData } from '../types/complaint';

export const EMPTY_FORM_DATA_HI: ComplaintFormData = {
  language: 'hi',
  complainants: [
    {
      name: '',
      relationType: 'W/O',
      parentName: '',
      village: '',
      po: '',
      ps: '',
      pinCode: '',
      district: '',
      state: '',
      presentAddress: '',
      address: '',
      phone: '',
      email: '',
    },
  ],
  oppositeParties: [
    {
      name: '',
      through: 'शाखा प्रबंधक / अधिकृत हस्ताक्षरकर्ता',
      address: '',
      phone: '',
      email: '',
    },
  ],
  caseDetails: {
    commissionName: 'DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION',
    commissionPlace: '',
    commissionState: '',
    commissionDistrict: '',
    complaintNo: '',
    complaintYear: new Date().getFullYear().toString(),
    totalConsideration: '',
    totalConsiderationWords: '',
    claimedAmount: '',
    claimedAmountWords: '',
    valueOfGoods: '',
    considerationAmount: '',
    compensationAmount: '',
    litigationAmount: '',
    interestRate: '',
    interestFromDate: '',
    category: '',
    section: 'Section 35(I) (a)',
    sectionsList: ['Section 35(I) (a)'],
    hasHousingProject: 'N/A',
    projectName: '',
    projectMentionPage: '',
    refundOrPossession: '',
    pendingHousingComplaints: 'N/A',
    pendingIdenticalLaw: 'N/A',
    dateOfCauseOfAction: '',
    stateOfCauseOfAction: '',
    districtOfCauseOfAction: '',
    hasDelay: 'No',
    delayDays: '',
    limitationDelay: 'कोई विलंब नहीं। परिवाद उपभोक्ता संरक्षण अधिनियम, 2019 की धारा 69 के तहत 2 वर्ष की सांविधिक परिसीमा के भीतर दायर है।',
    condonationApplicationAttached: 'N/A',
    documentsAttestedTrueCopies: 'Yes',
    englishTranslationsFiled: 'N/A',
    phoneEmailFiled: 'Yes',
    hasAdvocate: 'No',
    advocateName: '',
    advocateAddress: '',
    advocatePhone: '',
    advocateEmail: '',
    petitionPageCount: 4,
  },
  events: [
    {
      date: '',
      description: '',
    },
  ],
  complaintBody: '',
  witnesses: ['परिवादी स्वयं।', 'अन्य स्वतंत्र गवाह, यदि कोई हो।'],
  prayer: '',
  prayerClaims: {
    claimAmount: '',
    claimAmountWords: '',
    interestRate: '12',
    interestFromDate: '',
    compensationAmount: '',
    compensationAmountWords: '',
    litigationCosts: '',
    litigationCostsWords: '',
  },
  verification: '',
  verificationPlace: '',
  verificationDate: new Date().toISOString().split('T')[0],
  affidavit: `1. यह कि मैं संलग्न उपभोक्ता परिवाद में परिवादी हूँ और मामले के तथ्यों एवं परिस्थितियों से पूर्णतः भली-भांति अवगत हूँ।
2. यह कि संलग्न परिवाद पत्र के पैरा 1 से लेकर अंत तक में किए गए सभी कथन मेरे व्यक्तिगत ज्ञान एवं रिकॉर्ड के अनुसार सत्य व सही हैं।
3. यह कि परिवाद के साथ संलग्न सभी दस्तावेज उनके मूल दस्तावेजों की सत्य प्रतिलिपियां हैं।
4. यह कि इस परिवाद में कोई भी भौतिक अथवा सारवान तथ्य छिपाया या दबाया नहीं गया है।
5. यह कि यह शपथ पत्र माननीय आयोग के समक्ष परिवाद के समर्थन में प्रस्तुत करने हेतु निष्पादित किया जा रहा है।`,
  affidavitDate: new Date().toISOString().split('T')[0],
  annexures: [
    {
      annexureNo: 'संलग्नक-1',
      title: '',
      pageCount: 1,
    },
  ],
};

export const EMPTY_FORM_DATA_EN: ComplaintFormData = {
  language: 'en',
  complainants: [
    {
      name: '',
      relationType: 'W/O',
      parentName: '',
      village: '',
      po: '',
      ps: '',
      pinCode: '',
      district: '',
      state: '',
      presentAddress: '',
      address: '',
      phone: '',
      email: '',
    },
  ],
  oppositeParties: [
    {
      name: '',
      through: 'its Branch Manager / Authorized Signatory',
      address: '',
      phone: '',
      email: '',
    },
  ],
  caseDetails: {
    commissionName: 'DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION',
    commissionPlace: '',
    commissionState: '',
    commissionDistrict: '',
    complaintNo: '',
    complaintYear: new Date().getFullYear().toString(),
    totalConsideration: '',
    totalConsiderationWords: '',
    claimedAmount: '',
    claimedAmountWords: '',
    valueOfGoods: '',
    considerationAmount: '',
    compensationAmount: '',
    litigationAmount: '',
    interestRate: '12',
    interestFromDate: '',
    category: '',
    section: 'Section 35(I) (a)',
    sectionsList: ['Section 35(I) (a)'],
    hasHousingProject: 'N/A',
    projectName: '',
    projectMentionPage: '',
    refundOrPossession: '',
    pendingHousingComplaints: 'N/A',
    pendingIdenticalLaw: 'None',
    dateOfCauseOfAction: '',
    stateOfCauseOfAction: '',
    districtOfCauseOfAction: '',
    hasDelay: 'No',
    delayDays: '',
    limitationDelay: 'No delay. Complaint filed within the statutory limitation period of 2 years under Section 69 of Consumer Protection Act, 2019.',
    condonationApplicationAttached: 'N/A',
    documentsAttestedTrueCopies: 'Yes',
    englishTranslationsFiled: 'Yes',
    phoneEmailFiled: 'Yes',
    hasAdvocate: 'No',
    advocateName: '',
    advocateAddress: '',
    advocatePhone: '',
    advocateEmail: '',
    petitionPageCount: 4,
  },
  events: [
    {
      date: '',
      description: '',
    },
  ],
  complaintBody: '',
  witnesses: ['The Complainant herself/himself.', 'Other independent witness(es), if any.'],
  prayer: '',
  prayerClaims: {
    claimAmount: '',
    claimAmountWords: '',
    interestRate: '12',
    interestFromDate: '',
    compensationAmount: '',
    compensationAmountWords: '',
    litigationCosts: '',
    litigationCostsWords: '',
  },
  verification: '',
  verificationPlace: '',
  verificationDate: new Date().toISOString().split('T')[0],
  affidavit: `1. That I am the complainant in the accompanying consumer complaint and, being fully acquainted with the facts and circumstances of the case, I am competent to swear this affidavit.
2. That I have read and understood the contents of the accompanying consumer complaint, and the statements made in paragraphs 1 to 6 thereof are true and correct to my personal knowledge, information and belief.
3. That all the annexures annexed with the accompanying complaint are true Xerox copies of their respective originals and are relied upon in support of the present complaint.
4. That the statements made in the accompanying complaint are true and correct, and nothing material has been concealed or suppressed therefrom.
5. That this affidavit is being sworn for the purpose of supporting the accompanying consumer complaint and the documents annexed thereto before this Hon'ble Commission.`,
  affidavitDate: new Date().toISOString().split('T')[0],
  annexures: [
    {
      annexureNo: 'Annexure-1',
      title: '',
      pageCount: 1,
    },
  ],
};

export const SAMPLE_FORM_DATA_HI: ComplaintFormData = {
  language: 'hi',
  complainants: [
    {
      name: 'सुनीता देवी',
      relationType: 'W/O',
      parentName: 'स्व. रमेश कुमार',
      village: 'रामपुर, दानापुर',
      po: 'दानापुर कैंट',
      ps: 'दानापुर',
      pinCode: '801503',
      district: 'Patna',
      state: 'Bihar',
      presentAddress: 'मकान संख्या 42, आनंद नगर, बेली रोड, पटना - 800014',
      address: 'ग्राम रामपुर, डाकघर दानापुर कैंट, थाना दानापुर, जिला पटना, बिहार - 801503',
      phone: '9835012345',
      email: 'sunitadevi.patna@gmail.com',
    },
  ],
  oppositeParties: [
    {
      name: 'एचडीएफसी लाइफ इंश्योरेंस कंपनी लिमिटेड',
      through: 'शाखा प्रबंधक',
      address: 'द्वितीय तल, ग्रैंड प्लाजा, फ्रेजर रोड, पटना, बिहार - 800001',
      phone: '06122234567',
      email: 'claims@hdfclife.com',
    },
    {
      name: 'एचडीएफसी स्टैंडर्ड लाइफ इंश्योरेंस कंपनी लिमिटेड (प्रधान कार्यालय)',
      through: 'प्रबंध निदेशक एवं मुख्य कार्यकारी अधिकारी',
      address: 'लोढ़ा एक्सेलस, 13वां तल, अपोलो मिल्स कंपाउंड, एन.एम. जोशी मार्ग, महालक्ष्मी, मुंबई - 400011',
      phone: '02267516666',
      email: 'service@hdfclife.com',
    },
  ],
  caseDetails: {
    commissionName: 'DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION',
    commissionPlace: 'PATNA',
    commissionState: 'Bihar',
    commissionDistrict: 'Patna',
    complaintNo: '142',
    complaintYear: '2024',
    totalConsideration: '20,00,000',
    totalConsiderationWords: 'बीस लाख',
    claimedAmount: '25,00,000',
    claimedAmountWords: 'पच्चीस लाख',
    valueOfGoods: '20,00,000',
    considerationAmount: '4,50,000',
    compensationAmount: '4,50,000',
    litigationAmount: '50,000',
    interestRate: '12',
    interestFromDate: '15/04/2023',
    category: 'Insurance',
    section: 'Section 35(I) (a)',
    sectionsList: ['Section 35(I) (a)'],
    hasHousingProject: 'N/A',
    projectName: '',
    projectMentionPage: '',
    refundOrPossession: '',
    pendingHousingComplaints: 'N/A',
    pendingIdenticalLaw: 'N/A',
    dateOfCauseOfAction: '14/09/2023',
    stateOfCauseOfAction: 'Bihar',
    districtOfCauseOfAction: 'Patna',
    hasDelay: 'No',
    delayDays: '',
    limitationDelay: 'कोई विलंब नहीं। दावा निरस्तीकरण पत्र दिनांक 14/09/2023 से 2 वर्ष की वैधानिक परिसीमा के भीतर परिवाद प्रस्तुत है।',
    condonationApplicationAttached: 'N/A',
    documentsAttestedTrueCopies: 'Yes',
    englishTranslationsFiled: 'N/A',
    phoneEmailFiled: 'Yes',
    hasAdvocate: 'Yes',
    advocateName: 'राजेश कुमार सिंह',
    advocateAddress: 'चेंबर सं. 44, बार एसोसिएशन भवन, सिविल कोर्ट, पटना - 800004',
    advocatePhone: '9431098765',
    advocateEmail: 'advocate.rajeshsingh@gmail.com',
    petitionPageCount: 4,
  },
  events: [
    {
      date: '10/01/2021',
      description: 'विपक्षी बीमा कंपनी से पॉलिसी सं. 23891044 के तहत 20,00,000/- रुपये की बीमा पॉलिसी खरीदी गई एवं नियमित प्रीमियम का भुगतान किया गया।',
    },
    {
      date: '15/04/2023',
      description: 'बीमित (परिवादी के पति) का आकस्मिक हृदयाघात के कारण असामयिक देहांत हो गया।',
    },
    {
      date: '20/05/2023',
      description: 'परिवादी द्वारा मृत्यु प्रमाण पत्र एवं आवश्यक साक्ष्यों के साथ मृत्यु दावा (Death Claim) आवेदन विपक्षी सं. 1 के समक्ष प्रस्तुत किया गया।',
    },
    {
      date: '14/09/2023',
      description: 'विपक्षीगण द्वारा मनमाने एवं निराधार तर्कों के आधार पर बीमा दावा अनुचित रूप से निरस्त (Repudiate) कर दिया गया, जिससे वाद कारण उत्पन्न हुआ।',
    },
    {
      date: '12/11/2023',
      description: 'परिवादी द्वारा अधिवक्ता के माध्यम से विपक्षीगण को कानूनी नोटिस प्रेषित किया गया, जिसका कोई संतोषजनक उत्तर नहीं दिया गया।',
    },
  ],
  complaintBody: `1. यह कि परिवादी उपरोक्त पते की स्थायी निवासी हैं तथा स्व. रमेश कुमार की धर्मपत्नी एवं एकमात्र विधिक उत्तराधिकारी तथा नामित (नॉमिनी) हैं।

2. यह कि परिवादी के दिवंगत पति ने अपने जीवनकाल में विपक्षी संख्या 1 से एक जीवन बीमा पॉलिसी (पॉलिसी संख्या 23891044) खरीदी थी, जिसका बीमित धन 20,00,000/- (बीस लाख रुपये) था। परिवादी के पति द्वारा समस्त वार्षिक प्रीमियमों का नियत समय पर बिना किसी चूक के नियमित भुगतान किया गया।

3. यह कि दिनांक 15/04/2023 को बीमित व्यक्ति का अचानक हृदयाघात होने से निधन हो गया। एकमात्र नॉमिनी होने के नाते परिवादी ने सभी आवश्यक कागजात, मृत्यु प्रमाण पत्र एवं अस्पताल के दस्तावेज संलग्न कर दावा प्रस्तुत किया।

4. यह कि विपक्षीगण ने द्वेषपूर्ण एवं मनमाने ढंग से बिना किसी ठोस मेडिकल प्रमाण के दिनांक 14/09/2023 के पत्र द्वारा परिवादी का वैध मृत्यु दावा निरस्त कर दिया।

5. यह कि विपक्षी बीमा कंपनी का यह कृत्य उपभोक्ता संरक्षण अधिनियम, 2019 की धारा 2(11) के तहत गंभीर सेवा में कमी (Deficiency in Service) तथा धारा 2(47) के तहत अनुचित व्यापार व्यवहार (Unfair Trade Practice) की श्रेणी में आता है।

6. यह कि प्रस्तुत परिवाद पत्र वाद कारण उत्पन्न होने की तिथि 14/09/2023 से 2 वर्ष की सांविधिक परिसीमा के भीतर दायर किया गया है। माननीय जिला आयोग को इस परिवाद की सुनवाई का पूर्ण प्रादेशिक एवं आर्थिक क्षेत्राधिकार प्राप्त है।`,
  witnesses: ['परिवादी स्वयं।', 'अन्य स्वतंत्र गवाह, यदि कोई हो।'],
  prayer: `(i) विपक्षीगण को संयुक्त एवं पृथक रूप से आदेशित किया जाए कि वे परिवादी को पॉलिसी संख्या 23891044 के तहत देय दावा राशि 20,00,000/- (अक्षरे बीस लाख रुपये मात्र) का भुगतान मृत्यु की तिथि दिनांक 15/04/2023 से वास्तविक भुगतान की तिथि तक 12% प्रति वर्ष ब्याज सहित करें।

(ii) विपक्षीगण द्वारा की गई सेवा में घोर कमी एवं अनुचित व्यापार व्यवहार के कारण परिवादी को हुए असहनीय मानसिक संत्रास, शारीरिक प्रताड़ना एवं आर्थिक संकट की क्षतिपूर्ति हेतु 4,50,000/- (अक्षरे चार लाख पचास हजार रुपये मात्र) अदा करने का आदेश पारित किया जाए।

(iii) परिवादी को कानूनी कार्यवाही एवं मुकदमेबाजी में हुए खर्च के रूप में 50,000/- (अक्षरे पचास हजार रुपये मात्र) विपक्षीगण से दिलाए जाएं।

(iv) अन्य कोई भी अनुतोष या आदेश जो माननीय आयोग के विचार में न्यायहित में उचित व आवश्यक हो, पारित करने की कृपा की जाए।`,
  prayerClaims: {
    claimAmount: '25,00,000',
    claimAmountWords: 'पच्चीस लाख',
    interestRate: '12',
    interestFromDate: '15/04/2023',
    compensationAmount: '4,50,000',
    compensationAmountWords: 'चार लाख पचास हजार',
    litigationCosts: '50,000',
    litigationCostsWords: 'पचास हजार',
  },
  verification: `मै, उपरोक्त नामित परिवादी, सत्यनिष्ठा से सत्यापित करती हूँ कि संलग्न परिवाद पत्र के पैरा 1 से 6 तक में अंकित समस्त विवरण मेरे निजी ज्ञान, सूचना एवं उपलब्ध अभिलेखों के आधार पर सत्य व सही हैं, तथा इसमें से कोई भी सारवान तथ्य छिपाया या दबाया नहीं गया है।`,
  verificationPlace: 'Patna',
  verificationDate: '2024-03-15',
  affidavit: `1. यह कि मैं संलग्न उपभोक्ता परिवाद में परिवादी हूँ और मामले के तथ्यों एवं परिस्थितियों से पूर्णतः भली-भांति अवगत हूँ।
2. यह कि संलग्न परिवाद पत्र के पैरा 1 से लेकर 6 तक में किए गए सभी कथन मेरे व्यक्तिगत ज्ञान एवं रिकॉर्ड के अनुसार सत्य व सही हैं।
3. यह कि परिवाद के साथ संलग्न सभी दस्तावेज उनके मूल दस्तावेजों की सत्य प्रतिलिपियां हैं।
4. यह कि इस परिवाद में कोई भी भौतिक अथवा सारवान तथ्य छिपाया या दबाया नहीं गया है।
5. यह कि यह शपथ पत्र माननीय आयोग के समक्ष परिवाद के समर्थन में प्रस्तुत करने हेतु निष्पादित किया जा रहा है।`,
  affidavitDate: '2024-03-15',
  annexures: [
    {
      annexureNo: 'संलग्नक-1',
      title: 'बीमा पॉलिसी बांड संख्या 23891044 की छायाप्रति',
      pageCount: 1,
    },
    {
      annexureNo: 'संलग्नक-2',
      title: 'नियमित प्रीमियम भुगतान की रसीदों की छायाप्रतियां',
      pageCount: 1,
    },
    {
      annexureNo: 'संलग्नक-3',
      title: 'नगर निगम द्वारा जारी बीमित व्यक्ति का मृत्यु प्रमाण पत्र',
      pageCount: 1,
    },
    {
      annexureNo: 'संलग्नक-4',
      title: 'बीमा दावा प्रपत्र एवं पावती रसीद की छायाप्रति',
      pageCount: 1,
    },
    {
      annexureNo: 'संलग्नक-5',
      title: 'विपक्षी कंपनी द्वारा प्रेषित दावा निरस्तीकरण पत्र दिनांक 14/09/2023',
      pageCount: 1,
    },
  ],
};

export const SAMPLE_FORM_DATA_EN: ComplaintFormData = {
  language: 'en',
  complainants: [
    {
      name: 'Sunita Devi',
      relationType: 'W/O',
      parentName: 'Late Ramesh Kumar',
      village: 'Rampur',
      po: 'Rampur',
      ps: 'Danapur',
      pinCode: '801503',
      district: 'Patna',
      state: 'Bihar',
      presentAddress: 'House No. 42, Anand Nagar, Bailey Road, Patna - 800014',
      address: 'Village Rampur, P.O. Rampur, P.S. Danapur, District Patna, Bihar - 801503',
      phone: '9835012345',
      email: 'sunitadevi.patna@gmail.com',
    },
  ],
  oppositeParties: [
    {
      name: 'HDFC Life Insurance Company Limited',
      through: 'its Branch Manager',
      address: '2nd Floor, Grand Plaza, Fraser Road, Patna, Bihar - 800001',
      phone: '06122234567',
      email: 'claims@hdfclife.com',
    },
    {
      name: 'HDFC Standard Life Insurance Company Limited',
      through: 'its Managing Director & CEO',
      address: 'Lodha Excelus, 13th Floor, Apollo Mills Compound, N.M. Joshi Marg, Mahalaxmi, Mumbai - 400011',
      phone: '02267516666',
      email: 'service@hdfclife.com',
    },
  ],
  caseDetails: {
    commissionName: 'DISTRICT CONSUMER DISPUTE REDRESSAL COMMISSION',
    commissionPlace: 'PATNA',
    commissionState: 'Bihar',
    commissionDistrict: 'Patna',
    complaintNo: '142',
    complaintYear: '2024',
    totalConsideration: '20,00,000',
    totalConsiderationWords: 'Twenty Lakh',
    claimedAmount: '25,00,000',
    claimedAmountWords: 'Twenty Five Lakh',
    valueOfGoods: '20,00,000',
    considerationAmount: '4,50,000',
    compensationAmount: '4,50,000',
    litigationAmount: '50,000',
    interestRate: '12',
    interestFromDate: '15/04/2023',
    category: 'Insurance',
    section: 'Section 35(I) (a)',
    sectionsList: ['Section 35(I) (a)'],
    hasHousingProject: 'N/A',
    projectName: '',
    projectMentionPage: '',
    refundOrPossession: '',
    pendingHousingComplaints: 'N/A',
    pendingIdenticalLaw: 'None',
    dateOfCauseOfAction: '14/09/2023',
    stateOfCauseOfAction: 'Bihar',
    districtOfCauseOfAction: 'Patna',
    limitationDelay: 'No delay. Complaint filed within 2 years from date of repudiation under Section 69 of CPA 2019.',
    condonationApplicationAttached: 'N/A',
    documentsAttestedTrueCopies: 'Yes',
    englishTranslationsFiled: 'Yes',
    phoneEmailFiled: 'Yes',
    hasAdvocate: 'Yes',
    advocateName: 'Rajesh Kumar Singh',
    advocateAddress: 'Chamber No. 44, Bar Association Building, Civil Court, Patna - 800004',
    advocatePhone: '9431098765',
    advocateEmail: 'advocate.rajeshsingh@gmail.com',
    petitionPageCount: 4,
  },
  events: [
    {
      date: '10/01/2021',
      description: 'Complainant’s late husband purchased Life Insurance Policy bearing Policy No. 23891044 from Opposite Party No. 1 and paid regular premiums.',
    },
    {
      date: '15/04/2023',
      description: 'Life Assured suffered a sudden fatal cardiac arrest and passed away at Patna.',
    },
    {
      date: '20/05/2023',
      description: 'Complainant submitted formal death claim intimation with death certificate and medical papers to Opposite Party No. 1.',
    },
    {
      date: '14/09/2023',
      description: 'Opposite Party arbitrarily repudiated genuine insurance claim on frivolous grounds, giving rise to cause of action.',
    },
    {
      date: '12/11/2023',
      description: 'Legal Notice served upon Opposite Parties calling upon them to settle claim, which met with no positive response.',
    },
  ],
  complaintBody: `1. That the Complainant is a law-abiding citizen of India residing at the aforesaid address and is the legally wedded wife, sole nominee, and Class-I legal heir of Late Ramesh Kumar.

2. That the Complainant’s late husband had during his lifetime obtained a Life Insurance Policy bearing Policy No. 23891044 from Opposite Party No. 1 for a sum assured of Rs. 20,00,000/- (Rupees Twenty Lakh only). The Life Assured paid all annual premiums punctually without any default.

3. That on 15/04/2023, the Life Assured suffered a sudden fatal cardiac arrest and passed away. The Complainant being the sole nominee submitted the original death certificate along with all necessary claim forms and hospital discharge documents to Opposite Party No. 1.

4. That to the shock of the Complainant, Opposite Party No. 1 vide letter dated 14/09/2023 arbitrarily and maliciously repudiated the claim on baseless and hyper-technical grounds of non-disclosure, without any medical evidence.

5. That the arbitrary repudiation constitutes severe deficiency in service and unfair trade practice under Section 2(11) and Section 2(47) of the Consumer Protection Act, 2019.

6. That the cause of action first arose on 15/04/2023 and subsequently on 14/09/2023 when the claim was repudiated. The complaint is filed within the 2-year limitation period. This Hon'ble Commission has full territorial and pecuniary jurisdiction.`,
  witnesses: ['The Complainant herself.', 'Other independent witness(es), if any.'],
  prayer: `(i) Direct the Opposite Parties, jointly and severally, to honour the insurance contract and pay to the complainant the Claim amount of Rs. 20,00,000/- (Rupees Twenty Lakh only) payable under Policy No. 23891044, together with interest @ 12% per annum from the date of death of the Life Assured, i.e., 15/04/2023, till the date of actual payment, along with all consequential contractual benefits admissible under the policy.

(ii) Direct the Opposite Parties, jointly and severally, to pay a sum of Rs. 4,50,000/- (Rupees Four Lakh Fifty Thousand only) to the complainant as compensation for the immense mental agony, physical harassment, financial hardship and emotional trauma suffered by her due to the illegal repudiation of the genuine insurance claim.

(iii) Direct the Opposite Parties to pay Rs. 50,000/- (Rupees Fifty Thousand only) towards litigation expenses and incidental costs incurred by the complainant.

(iv) Pass any other or further order(s), direction(s) or relief(s) as this Hon'ble Commission may deem fit and proper in the facts and circumstances of the case.`,
  prayerClaims: {
    claimAmount: '25,00,000',
    claimAmountWords: 'Twenty Five Lakh',
    interestRate: '12',
    interestFromDate: '15/04/2023',
    compensationAmount: '4,50,000',
    compensationAmountWords: 'Four Lakh Fifty Thousand',
    litigationCosts: '50,000',
    litigationCostsWords: 'Fifty Thousand',
  },
  verification: `I, the above-named complainant, do hereby verify that the statements made in paragraphs 1 to 6 of the accompanying complaint are true and correct to my personal knowledge, information and belief and the records of the case, and that nothing material has been concealed or suppressed therefrom.`,
  verificationPlace: 'Patna',
  verificationDate: '2024-03-15',
  affidavit: `1. That I am the complainant in the accompanying consumer complaint and, being fully acquainted with the facts and circumstances of the case, I am competent to swear this affidavit.
2. That I have read and understood the contents of the accompanying consumer complaint, and the statements made in paragraphs 1 to 6 thereof are true and correct to my personal knowledge, information and belief.
3. That all the annexures annexed with the accompanying complaint are true Xerox copies of their respective originals and are relied upon in support of the present complaint.
4. That the statements made in the accompanying complaint are true and correct, and nothing material has been concealed or suppressed therefrom.
5. That this affidavit is being sworn for the purpose of supporting the accompanying consumer complaint and the documents annexed thereto before this Hon'ble Commission.`,
  affidavitDate: '2024-03-15',
  annexures: [
    {
      annexureNo: 'Annexure-1',
      title: 'Copy of Insurance Policy Schedule bearing Policy No. 23891044',
      pageCount: 1,
    },
    {
      annexureNo: 'Annexure-2',
      title: 'Copies of Premium Payment Receipts showing continuous policy in force',
      pageCount: 1,
    },
    {
      annexureNo: 'Annexure-3',
      title: 'Copy of Death Certificate of Life Assured Late Ramesh Kumar issued by Municipal Corporation',
      pageCount: 1,
    },
    {
      annexureNo: 'Annexure-4',
      title: 'Copy of Claim Intimation Form along with acknowledgment of submission',
      pageCount: 1,
    },
    {
      annexureNo: 'Annexure-5',
      title: 'Copy of Repudiation Letter dated 14/09/2023 issued by Opposite Party',
      pageCount: 1,
    },
  ],
};

export const EMPTY_FORM_DATA = EMPTY_FORM_DATA_HI;
export const SAMPLE_FORM_DATA = SAMPLE_FORM_DATA_HI;

export function getSampleFormData(lang: 'hi' | 'en'): ComplaintFormData {
  return lang === 'en' ? SAMPLE_FORM_DATA_EN : SAMPLE_FORM_DATA_HI;
}

export function getEmptyFormData(lang: 'hi' | 'en'): ComplaintFormData {
  return lang === 'en' ? EMPTY_FORM_DATA_EN : EMPTY_FORM_DATA_HI;
}
