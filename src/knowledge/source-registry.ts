export type KnowledgeSource = {
  id: string;
  organization: string;
  title: string;
  url: string;
  verifiedAt: string;
  status?: string;
  version?: string;
  purpose: string[];
};

export const sourceRegistry = [
  {
    id: 'ITU_R_P_525_5_2024',
    organization: 'ITU-R',
    title: 'Recommendation ITU-R P.525-5 — Calculation of free-space attenuation',
    url: 'https://www.itu.int/rec/R-REC-P.525-5-202411-I/en',
    verifiedAt: '2026-09-16',
    status: 'In force / Main',
    version: 'P.525-5 (11/2024)',
    purpose: ['FSPL baseline'],
  },
  {
    id: '3GPP_TR_38_901_R19_4_0',
    organization: '3GPP',
    title: 'TR 38.901 — Study on channel model for frequencies from 0.5 to 100 GHz',
    url: 'https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=3173',
    verifiedAt: '2026-09-16',
    status: 'Under change control',
    version: 'Release 19, v19.4.0',
    purpose: ['5G propagation', 'UMi', 'UMa', 'Indoor'],
  },
  {
    id: '3GPP_TS_38_101_1',
    organization: '3GPP',
    title: 'TS 38.101-1 — NR UE radio transmission and reception; Part 1: Range 1 Standalone',
    url: 'https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=3283',
    verifiedAt: '2026-09-16',
    status: 'Under change control',
    purpose: ['FR1 SA UE', 'NR bands', 'radio compatibility'],
  },
  {
    id: '3GPP_TS_38_104',
    organization: '3GPP',
    title: 'TS 38.104 — NR Base Station radio transmission and reception',
    url: 'https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=3202',
    verifiedAt: '2026-09-16',
    status: 'Under change control',
    purpose: ['gNB radio specifications'],
  },
  {
    id: '3GPP_TS_23_501',
    organization: '3GPP',
    title: 'TS 23.501 — System architecture for the 5G System',
    url: 'https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=3144',
    verifiedAt: '2026-09-16',
    status: 'Under change control',
    purpose: ['5GS architecture'],
  },
  {
    id: '3GPP_TS_33_501',
    organization: '3GPP',
    title: 'TS 33.501 — Security architecture and procedures for 5G System',
    url: 'https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=3169',
    verifiedAt: '2026-09-16',
    status: 'Under change control',
    purpose: ['5G security'],
  },
  {
    id: 'ITU_R_M_2160_0_2023',
    organization: 'ITU-R',
    title: 'Recommendation ITU-R M.2160-0 — IMT-2030 Framework',
    url: 'https://www.itu.int/rec/R-REC-M.2160-0-202311-I/en',
    verifiedAt: '2026-09-16',
    status: 'In force / Main',
    version: 'M.2160-0 (11/2023)',
    purpose: ['IMT-2030 framework'],
  },
  {
    id: 'ITU_IMT2030_WP5D_2026',
    organization: 'ITU-R WP 5D',
    title: 'IMT towards 2030 and beyond (IMT-2030)',
    url: 'https://www.itu.int/en/ITU-R/study-groups/rsg5/rwp5d/imt-2030/pages/default.aspx',
    verifiedAt: '2026-09-16',
    status: 'IMT-2030 development process ongoing',
    purpose: ['IMT-2030 status', 'experimental assessment guardrails'],
  },
  {
    id: 'NIST_BOLTZMANN',
    organization: 'NIST',
    title: 'Kelvin: Boltzmann Constant',
    url: 'https://www.nist.gov/si-redefinition/kelvin/kelvin-boltzmann-constant',
    verifiedAt: '2026-09-16',
    purpose: ['thermal noise constant'],
  },
  {
    id: 'SHANNON_1948',
    organization: 'Bell System Technical Journal',
    title: 'Claude E. Shannon — A Mathematical Theory of Communication',
    url: 'https://doi.org/10.1002/j.1538-7305.1948.tb01338.x',
    verifiedAt: '2026-09-16',
    version: '1948',
    purpose: ['theoretical channel capacity'],
  },
] satisfies KnowledgeSource[];
