'use client';

import React from 'react';
import { ComplaintFormData, Complainant, OppositeParty } from '../../types/complaint';

interface StepProps {
  data: ComplaintFormData;
  updateData: (updater: (prev: ComplaintFormData) => ComplaintFormData) => void;
  errors: Record<string, string>;
}

export const Step3MemoOfParties: React.FC<StepProps> = ({
  data,
  updateData,
  errors,
}) => {
  // Complainant handlers
  const handleComplainantChange = (
    index: number,
    field: keyof Complainant,
    value: string
  ) => {
    updateData((prev) => {
      const nextList = [...prev.complainants];
      const comp = { ...nextList[index], [field]: value };

      // Also construct clean full address string
      const addrParts = [
        comp.village ? `Vill: ${comp.village}` : '',
        comp.po ? `P.O.: ${comp.po}` : '',
        comp.ps ? `P.S.: ${comp.ps}` : '',
        comp.district ? `District: ${comp.district}` : '',
        comp.state ? comp.state : '',
        comp.pinCode ? `PIN: ${comp.pinCode}` : '',
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
      const nextList = [...prev.oppositeParties];
      nextList[index] = { ...nextList[index], [field]: value };
      return { ...prev, oppositeParties: nextList };
    });
  };

  const handleAddOp = () => {
    updateData((prev) => ({
      ...prev,
      oppositeParties: [
        ...prev.oppositeParties,
        {
          name: '',
          through: 'its Branch Manager / Authorized Signatory',
          address: '',
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
      {/* Complainants Section */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 text-xs font-bold flex items-center justify-center">
                1
              </span>
              Complainant(s) Details
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Formatted according to Indian court memo standards (Resident, P.O., P.S., District, Contact).
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddComplainant}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-300 rounded-xl hover:bg-amber-100 transition-colors shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add More Complainant
          </button>
        </div>

        {errors.complainants && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
            {errors.complainants}
          </div>
        )}

        <div className="space-y-5">
          {data.complainants.map((comp, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4 relative"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Complainant #{idx + 1} {idx === 0 && '(Primary / Deponent)'}
                </span>

                {data.complainants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveComplainant(idx)}
                    className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-medium"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove
                  </button>
                )}
              </div>

              {/* Name & Parentage */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={comp.name}
                    onChange={(e) => handleComplainantChange(idx, 'name', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border text-xs bg-white ${
                      errors[`complainant_${idx}_name`] ? 'border-red-500 bg-red-50/50' : 'border-slate-300'
                    }`}
                    placeholder="e.g. Sunita Devi"
                  />
                  {errors[`complainant_${idx}_name`] && (
                    <p className="text-[11px] text-red-500 mt-0.5">{errors[`complainant_${idx}_name`]}</p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 md:col-span-2">
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Relation</label>
                    <select
                      value={comp.relationType}
                      onChange={(e) => handleComplainantChange(idx, 'relationType', e.target.value)}
                      className="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                    >
                      <option value="W/O">W/O (Wife of)</option>
                      <option value="S/O">S/O (Son of)</option>
                      <option value="D/O">D/O (Daughter of)</option>
                      <option value="C/O">C/O (Care of)</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Spouse / Father Name</label>
                    <input
                      type="text"
                      value={comp.parentName}
                      onChange={(e) => handleComplainantChange(idx, 'parentName', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                      placeholder="e.g. Late Ramesh Kumar"
                    />
                  </div>
                </div>
              </div>

              {/* Permanent Address breakdown matching Page 4 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Resident of Village/City</label>
                  <input
                    type="text"
                    value={comp.village}
                    onChange={(e) => handleComplainantChange(idx, 'village', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                    placeholder="e.g. Rampur"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">P.O. (Post Office)</label>
                  <input
                    type="text"
                    value={comp.po}
                    onChange={(e) => handleComplainantChange(idx, 'po', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                    placeholder="e.g. Rampur"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">P.S. (Police Station)</label>
                  <input
                    type="text"
                    value={comp.ps}
                    onChange={(e) => handleComplainantChange(idx, 'ps', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                    placeholder="e.g. Danapur"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Pin Code</label>
                  <input
                    type="text"
                    value={comp.pinCode}
                    onChange={(e) => handleComplainantChange(idx, 'pinCode', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                    placeholder="e.g. 801503"
                  />
                </div>
              </div>

              {/* Present Address & District */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    At Present Village / Mohalla / City Address
                  </label>
                  <input
                    type="text"
                    value={comp.presentAddress || ''}
                    onChange={(e) => handleComplainantChange(idx, 'presentAddress', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                    placeholder="House No. 42, Anand Nagar, Bailey Road"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">District</label>
                  <input
                    type="text"
                    value={comp.district}
                    onChange={(e) => handleComplainantChange(idx, 'district', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                    placeholder="e.g. Patna"
                  />
                </div>
              </div>

              {/* Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone / Mobile No. *</label>
                  <input
                    type="text"
                    value={comp.phone}
                    onChange={(e) => handleComplainantChange(idx, 'phone', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border text-xs bg-white ${
                      errors[`complainant_${idx}_phone`] ? 'border-red-500 bg-red-50/50' : 'border-slate-300'
                    }`}
                    placeholder="e.g. 9835012345"
                  />
                  {errors[`complainant_${idx}_phone`] && (
                    <p className="text-[11px] text-red-500 mt-0.5">{errors[`complainant_${idx}_phone`]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={comp.email}
                    onChange={(e) => handleComplainantChange(idx, 'email', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border text-xs bg-white ${
                      errors[`complainant_${idx}_email`] ? 'border-red-500 bg-red-50/50' : 'border-slate-300'
                    }`}
                    placeholder="e.g. sunitadevi@gmail.com"
                  />
                  {errors[`complainant_${idx}_email`] && (
                    <p className="text-[11px] text-red-500 mt-0.5">{errors[`complainant_${idx}_email`]}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Opposite Parties Section (Matches Page 4 (i), (ii)) */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 text-xs font-bold flex items-center justify-center">
                2
              </span>
              Opposite Party / Parties (O.Ps)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Company/Entity name, through its representative, and registered/branch office address.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddOp}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-300 rounded-xl hover:bg-amber-100 transition-colors shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add More Opposite Party
          </button>
        </div>

        {errors.oppositeParties && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
            {errors.oppositeParties}
          </div>
        )}

        <div className="space-y-4">
          {data.oppositeParties.map((op, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Opposite Party #{idx + 1} ({String.fromCharCode(105 + idx)})
                </span>

                {data.oppositeParties.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOp(idx)}
                    className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-medium"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Entity Name *</label>
                  <input
                    type="text"
                    value={op.name}
                    onChange={(e) => handleOpChange(idx, 'name', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border text-xs bg-white ${
                      errors[`op_${idx}_name`] ? 'border-red-500 bg-red-50/50' : 'border-slate-300'
                    }`}
                    placeholder="e.g. HDFC Life Insurance Company Limited"
                  />
                  {errors[`op_${idx}_name`] && (
                    <p className="text-[11px] text-red-500 mt-0.5">{errors[`op_${idx}_name`]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Through its (Designation)</label>
                  <input
                    type="text"
                    value={op.through}
                    onChange={(e) => handleOpChange(idx, 'through', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                    placeholder="e.g. its Branch Manager / its Managing Director"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Situated at / Complete Address *</label>
                  <input
                    type="text"
                    value={op.address}
                    onChange={(e) => handleOpChange(idx, 'address', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                    placeholder="e.g. 2nd Floor, Grand Plaza, Fraser Road, Patna, Bihar - 800001"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
