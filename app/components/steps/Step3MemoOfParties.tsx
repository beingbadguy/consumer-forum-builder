'use client';

import React from 'react';
import { ComplaintFormData, Complainant, OppositeParty } from '../../types/complaint';
import { ALL_INDIAN_STATES, getDistrictsByState } from '../../lib/indiaStatesDistricts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { TRANSLATIONS } from '../../lib/translations';
import { Icons } from '../ui/Icons';

interface StepProps {
  data: ComplaintFormData;
  updateData: (updater: (prev: ComplaintFormData) => ComplaintFormData) => void;
  errors: Record<string, string>;
}

function toRoman(num: number): string {
  const romanLookup: [number, string][] = [
    [10, 'x'], [9, 'ix'], [5, 'v'], [4, 'iv'], [1, 'i']
  ];
  let result = '';
  for (const [val, sym] of romanLookup) {
    while (num >= val) {
      result += sym;
      num -= val;
    }
  }
  return result;
}

export const Step3MemoOfParties: React.FC<StepProps> = ({
  data,
  updateData,
  errors,
}) => {
  const isEn = data.language === 'en';
  const t = TRANSLATIONS[data.language || 'hi'].step3;

  // Complainant handlers
  const handleComplainantChange = (
    index: number,
    field: keyof Complainant,
    value: string
  ) => {
    updateData((prev) => {
      const nextList = [...prev.complainants];
      const comp = { ...nextList[index], [field]: value };

      // Construct clean full address string
      const addrParts = [
        comp.village ? (isEn ? `Village/Mohalla: ${comp.village}` : `ग्राम/मोहल्ला: ${comp.village}`) : '',
        comp.po ? (isEn ? `P.O.: ${comp.po}` : `डाकघर: ${comp.po}`) : '',
        comp.ps ? (isEn ? `P.S.: ${comp.ps}` : `थाना: ${comp.ps}`) : '',
        comp.district ? (isEn ? `District: ${comp.district}` : `जिला: ${comp.district}`) : '',
        comp.state ? comp.state : '',
        comp.pinCode ? (isEn ? `PIN: ${comp.pinCode}` : `पिन: ${comp.pinCode}`) : '',
      ].filter(Boolean);

      comp.address = addrParts.join(', ');

      nextList[index] = comp;
      return { ...prev, complainants: nextList };
    });
  };

  const handleComplainantStateChange = (index: number, stateName: string) => {
    updateData((prev) => {
      const nextList = [...prev.complainants];
      const comp = { ...nextList[index], state: stateName, district: '' };

      const addrParts = [
        comp.village ? (isEn ? `Village/Mohalla: ${comp.village}` : `ग्राम/मोहल्ला: ${comp.village}`) : '',
        comp.po ? (isEn ? `P.O.: ${comp.po}` : `डाकघर: ${comp.po}`) : '',
        comp.ps ? (isEn ? `P.S.: ${comp.ps}` : `थाना: ${comp.ps}`) : '',
        comp.state ? comp.state : '',
        comp.pinCode ? (isEn ? `PIN: ${comp.pinCode}` : `पिन: ${comp.pinCode}`) : '',
      ].filter(Boolean);
      comp.address = addrParts.join(', ');

      nextList[index] = comp;
      return { ...prev, complainants: nextList };
    });
  };

  const handleAddComplainant = () => {
    updateData((prev) => ({
      ...prev,
      complainants: [
        ...prev.complainants,
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
    }));
  };

  const handleRemoveComplainant = (index: number) => {
    if (data.complainants.length <= 1) return;
    updateData((prev) => ({
      ...prev,
      complainants: prev.complainants.filter((_, i) => i !== index),
    }));
  };

  // Opposite Party handlers
  const handleOpChange = (
    index: number,
    field: keyof OppositeParty,
    value: string
  ) => {
    updateData((prev) => {
      const nextOps = [...prev.oppositeParties];
      nextOps[index] = { ...nextOps[index], [field]: value };
      return { ...prev, oppositeParties: nextOps };
    });
  };

  const handleAddOp = () => {
    updateData((prev) => ({
      ...prev,
      oppositeParties: [
        ...prev.oppositeParties,
        {
          name: '',
          through: isEn ? 'its Branch Manager / Authorized Signatory' : 'शाखा प्रबंधक / अधिकृत हस्ताक्षरकर्ता',
          address: '',
          phone: '',
          email: '',
        },
      ],
    }));
  };

  const handleRemoveOp = (index: number) => {
    if (data.oppositeParties.length <= 1) return;
    updateData((prev) => ({
      ...prev,
      oppositeParties: prev.oppositeParties.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      {/* 1. Complainants Section */}
      <Card className="border-[#E5E5E5] bg-white">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0F0F0] pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded bg-[#111111] text-white text-[11px] font-medium flex items-center justify-center shrink-0">
                1
              </span>
              <CardTitle className="text-sm sm:text-base font-semibold text-[#111111]">
                {isEn ? 'Complainant / Consumer Particulars (Page 4 — Memo of Parties)' : 'परिवादी / उपभोक्ता का विवरण (Complainant Details)'}
              </CardTitle>
            </div>
            <CardDescription className="mt-1 text-xs text-[#666666]">
              {isEn ? 'Enter the full residential and postal addresses of the Complainant(s).' : 'न्यायालय प्रारूप के पृष्ठ 4 (Memo of Parties) पर परिवादी का पूर्ण आवासीय एवं डाक पता।'}
            </CardDescription>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddComplainant}
            className="shrink-0 self-start sm:self-auto text-xs font-medium bg-white hover:bg-[#F5F5F5] border-[#E5E5E5] text-[#111111] shadow-none"
          >
            <Icons.Plus size={14} className="text-[#111111] mr-1.5" />
            <span>{t.addComplainant}</span>
          </Button>
        </CardHeader>

        <CardContent className="space-y-5 pt-4">
          {errors.complainants && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
              {errors.complainants}
            </div>
          )}

          <div className="space-y-5">
            {data.complainants.map((comp, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl space-y-4 relative transition-all"
              >
                <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-[#111111] text-white text-[11px] font-semibold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-[#111111]">
                      {isEn ? `Complainant #${idx + 1}` : `परिवादी #${idx + 1}`} {idx === 0 ? (isEn ? '(Primary Complainant)' : '(मुख्य परिवादी)') : ''}
                    </span>
                  </div>

                  {data.complainants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveComplainant(idx)}
                      className="text-xs text-[#666666] hover:text-[#111111] flex items-center gap-1 font-medium transition-colors"
                    >
                      <Icons.Trash size={14} className="text-[#666666]" />
                      <span>{t.removeComplainant}</span>
                    </button>
                  )}
                </div>

                {/* Name & Parentage */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-1">
                    <Label className="block text-xs font-medium text-[#222222] mb-1">
                      {t.name} <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      type="text"
                      value={comp.name}
                      onChange={(e) => handleComplainantChange(idx, 'name', e.target.value)}
                      className={errors[`complainant_${idx}_name`] ? 'border-red-500 bg-red-50/20' : 'bg-white'}
                      placeholder={isEn ? 'e.g. Ramesh Kumar Sharma' : 'जैसे: रमेश कुमार शर्मा'}
                    />
                    {errors[`complainant_${idx}_name`] && (
                      <p className="text-[11px] text-red-600 mt-1">{errors[`complainant_${idx}_name`]}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 md:col-span-2">
                    <div className="col-span-1">
                      <Label className="block text-xs font-medium text-[#222222] mb-1">{t.relation}</Label>
                      <Select
                        value={comp.relationType}
                        onChange={(e) => handleComplainantChange(idx, 'relationType', e.target.value)}
                        className="bg-white"
                      >
                        <option value="W/O">{isEn ? 'W/O (Wife of)' : 'W/O (पत्नी)'}</option>
                        <option value="S/O">{isEn ? 'S/O (Son of)' : 'S/O (पुत्र)'}</option>
                        <option value="D/O">{isEn ? 'D/O (Daughter of)' : 'D/O (पुत्री)'}</option>
                        <option value="C/O">{isEn ? 'C/O (Care of)' : 'C/O (देखरेख)'}</option>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Label className="block text-xs font-medium text-[#222222] mb-1">{t.parentName}</Label>
                      <Input
                        type="text"
                        value={comp.parentName}
                        onChange={(e) => handleComplainantChange(idx, 'parentName', e.target.value)}
                        placeholder={isEn ? "Full name of father / spouse" : "पिता या पति का पूरा नाम"}
                        className="bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Permanent Address breakdown */}
                <div>
                  <Label className="block text-[11px] font-semibold text-[#111111] mb-1.5">
                    {isEn ? 'Permanent Address Breakdown' : 'स्थायी पता घटक (Permanent Address)'}
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                    <div>
                      <Label className="block text-[11px] text-[#666666] mb-1">{t.village}</Label>
                      <Input
                        type="text"
                        value={comp.village}
                        onChange={(e) => handleComplainantChange(idx, 'village', e.target.value)}
                        placeholder={isEn ? 'Village or Locality' : 'ग्राम या मोहल्ला'}
                        className="h-9 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <Label className="block text-[11px] text-[#666666] mb-1">{t.po}</Label>
                      <Input
                        type="text"
                        value={comp.po}
                        onChange={(e) => handleComplainantChange(idx, 'po', e.target.value)}
                        placeholder={isEn ? 'Post Office name' : 'डाकघर का नाम'}
                        className="h-9 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <Label className="block text-[11px] text-[#666666] mb-1">{t.ps}</Label>
                      <Input
                        type="text"
                        value={comp.ps}
                        onChange={(e) => handleComplainantChange(idx, 'ps', e.target.value)}
                        placeholder={isEn ? 'Police Station' : 'थाना / पुलिस स्टेशन'}
                        className="h-8.5 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <Label className="block text-[11px] text-slate-600 mb-1">{t.pin}</Label>
                      <Input
                        type="text"
                        noTransliterate={true}
                        value={comp.pinCode}
                        onChange={(e) => handleComplainantChange(idx, 'pinCode', e.target.value)}
                        placeholder={isEn ? '6-digit PIN' : '6 अंकों का पिन'}
                        maxLength={6}
                        className="h-8.5 text-xs bg-white font-mono"
                      />
                    </div>
                  </div>

                  {/* State & District row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2.5">
                    <div>
                      <Label className="block text-[11px] text-slate-600 mb-1">{t.state} <span className="text-red-600">*</span></Label>
                      <Select
                        value={comp.state}
                        onChange={(e) => handleComplainantStateChange(idx, e.target.value)}
                        className={`h-8.5 text-xs bg-white ${errors[`complainant_${idx}_state`] ? 'border-red-500' : ''}`}
                      >
                        <option value="">{isEn ? 'Select State' : 'राज्य चुनें'}</option>
                        {ALL_INDIAN_STATES.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </Select>
                    </div>

                    <div>
                      <Label className="block text-[11px] text-slate-600 mb-1">{t.district} <span className="text-red-600">*</span></Label>
                      <Select
                        value={comp.district}
                        onChange={(e) => handleComplainantChange(idx, 'district', e.target.value)}
                        disabled={!comp.state}
                        className={`h-8.5 text-xs bg-white ${errors[`complainant_${idx}_district`] ? 'border-red-500' : ''}`}
                      >
                        <option value="">{comp.state ? (isEn ? 'Select District' : 'जिला चुनें') : (isEn ? 'Select State First' : 'पहले राज्य चुनें')}</option>
                        {comp.state &&
                          getDistrictsByState(comp.state).map((dt) => (
                            <option key={dt} value={dt}>{dt}</option>
                          ))}
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Present Address */}
                <div>
                  <Label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.presentAddress}
                  </Label>
                  <Input
                    type="text"
                    value={comp.presentAddress || ''}
                    onChange={(e) => handleComplainantChange(idx, 'presentAddress', e.target.value)}
                    placeholder={isEn ? 'Leave empty if same as permanent address' : 'यदि स्थायी पते के समान है तो खाली छोड़ दें'}
                    className="bg-white text-xs"
                  />
                </div>

                {/* Contact numbers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-[#E2E8F0]">
                  <div>
                    <Label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.phone} <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      type="tel"
                      value={comp.phone}
                      onChange={(e) => handleComplainantChange(idx, 'phone', e.target.value)}
                      className={errors[`complainant_${idx}_phone`] ? 'border-red-500 bg-red-50/20' : 'bg-white font-mono text-xs'}
                      placeholder={isEn ? '10-digit mobile number' : '10 अंकों का मोबाइल नंबर'}
                      maxLength={10}
                    />
                    {errors[`complainant_${idx}_phone`] && (
                      <p className="text-[11px] text-red-600 mt-1">{errors[`complainant_${idx}_phone`]}</p>
                    )}
                  </div>

                  <div>
                    <Label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.email} <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      type="email"
                      value={comp.email}
                      onChange={(e) => handleComplainantChange(idx, 'email', e.target.value)}
                      className={errors[`complainant_${idx}_email`] ? 'border-red-500 bg-red-50/20' : 'bg-white font-mono text-xs'}
                      placeholder="name@example.com"
                    />
                    {errors[`complainant_${idx}_email`] && (
                      <p className="text-[11px] text-red-600 mt-1">{errors[`complainant_${idx}_email`]}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 2. Opposite Parties Section */}
      <Card className="border-[#E5E5E5] bg-white">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0F0F0] pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded bg-[#111111] text-white text-[11px] font-medium flex items-center justify-center shrink-0">
                2
              </span>
              <CardTitle className="text-sm sm:text-base font-semibold text-[#111111]">
                {isEn ? 'Opposite Party / Respondent Particulars (Page 4 — Memo of Parties)' : 'विपक्षी दल / कंपनी का विवरण (Opposite Parties)'}
              </CardTitle>
            </div>
            <CardDescription className="mt-1 text-xs text-[#666666]">
              {isEn ? 'Enter company name, designation (Through), and full registered/branch office address.' : 'कंपनी या विक्रेता का नाम, पदनाम एवं पंजीकृत / शाखा कार्यालय का पूर्ण पता (पृष्ठ 4)।'}
            </CardDescription>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddOp}
            className="shrink-0 self-start sm:self-auto text-xs font-medium bg-white hover:bg-[#F5F5F5] border-[#E5E5E5] text-[#111111] shadow-none"
          >
            <Icons.Plus size={14} className="text-[#111111] mr-1.5" />
            <span>{t.addOp}</span>
          </Button>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          {errors.oppositeParties && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
              {errors.oppositeParties}
            </div>
          )}

          <div className="space-y-4">
            {data.oppositeParties.map((op, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl space-y-3.5 relative transition-all"
              >
                <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2.5">
                  <span className="text-xs font-semibold text-[#111111]">
                    {isEn ? `Opposite Party #${idx + 1} (${toRoman(idx + 1)})` : `विपक्षी पक्षकार #${idx + 1} (${toRoman(idx + 1)})`}
                  </span>

                  {data.oppositeParties.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOp(idx)}
                      className="text-xs text-[#666666] hover:text-[#111111] flex items-center gap-1 font-medium transition-colors"
                    >
                      <Icons.Trash size={14} className="text-[#666666]" />
                      <span>{t.removeOp}</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div>
                    <Label className="block text-xs font-medium text-[#222222] mb-1">
                      {isEn ? 'Company / Business / Respondent Name' : 'कंपनी / संस्थान / विक्रेता का नाम'} <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      type="text"
                      value={op.name}
                      onChange={(e) => handleOpChange(idx, 'name', e.target.value)}
                      className={errors[`op_${idx}_name`] ? 'border-red-500 bg-red-50/20' : 'bg-white'}
                      placeholder={isEn ? 'e.g. HDFC Life Insurance Company Limited' : 'जैसे: एचडीएफसी स्टैंडर्ड लाइफ इंश्योरेंस कंपनी लि.'}
                    />
                    {errors[`op_${idx}_name`] && (
                      <p className="text-[11px] text-red-600 mt-1">{errors[`op_${idx}_name`]}</p>
                    )}
                  </div>

                  <div>
                    <Label className="block text-xs font-medium text-[#222222] mb-1">{t.through}</Label>
                    <Input
                      type="text"
                      value={op.through}
                      onChange={(e) => handleOpChange(idx, 'through', e.target.value)}
                      placeholder={t.throughPlaceholder}
                      className="bg-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label className="block text-xs font-medium text-[#222222] mb-1">
                      {t.opAddress} <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      type="text"
                      value={op.address}
                      onChange={(e) => handleOpChange(idx, 'address', e.target.value)}
                      placeholder={isEn ? 'Full address with city, state and PIN code' : 'पूर्ण शाखा / कार्यालय का पता, शहर, राज्य एवं पिन कोड सहित'}
                      className="bg-white"
                    />
                  </div>

                  <div>
                    <Label className="block text-xs font-medium text-[#222222] mb-1">{isEn ? 'Helpline / Phone Number (Optional)' : 'हेल्पलाइन / फोन नंबर (वैकल्पिक)'}</Label>
                    <Input
                      type="text"
                      noTransliterate={true}
                      value={op.phone || ''}
                      onChange={(e) => handleOpChange(idx, 'phone', e.target.value)}
                      placeholder={isEn ? 'Phone or Mobile Number' : 'फोन या मोबाइल नंबर'}
                      className="bg-white text-xs font-mono"
                    />
                  </div>

                  <div>
                    <Label className="block text-xs font-medium text-[#222222] mb-1">{isEn ? 'Customer Support Email (Optional)' : 'कस्टमर केयर ईमेल (वैकल्पिक)'}</Label>
                    <Input
                      type="email"
                      value={op.email || ''}
                      onChange={(e) => handleOpChange(idx, 'email', e.target.value)}
                      placeholder="support@company.com"
                      className="bg-white text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
