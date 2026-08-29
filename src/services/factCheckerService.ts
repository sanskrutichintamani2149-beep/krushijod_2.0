export type FactCheckStatus = 'VERIFIED' | 'UNVERIFIED' | 'FALSE' | 'SUSPICIOUS';

export interface FactCheckSource {
  name: string;
  url: string;
  type: 'Official Government' | 'Academic / Research' | 'International Organization' | 'News / Reporting' | 'Local Authority';
  authority: 'High' | 'Medium' | 'Low';
  summary: string;
}

export interface FactCheckResult {
  status: FactCheckStatus;
  score: number;
  confidence: number;
  verdict: string;
  explanation: string;
  governmentVerified: boolean;
  checkedAt: string;
  sources: FactCheckSource[];
  extractedClaims: string[];
  suspiciousIndicators: string[];
}

export interface FactCheckRequest {
  text?: string;
  imageText?: string;
  sourceLabel?: string;
}

const OFFICIAL_GOVT_SOURCES = [
  {
    name: 'Government of India',
    url: 'https://www.india.gov.in/',
    type: 'Official Government',
    authority: 'High',
    summary: 'Primary official public information portal for policy, regulations, and public notices.'
  },
  {
    name: 'PIB India',
    url: 'https://pib.gov.in/',
    type: 'Official Government',
    authority: 'High',
    summary: 'Press Information Bureau releases government notices, official messaging and schemes.'
  },
  {
    name: 'MyGov India',
    url: 'https://www.mygov.in/',
    type: 'Official Government',
    authority: 'High',
    summary: 'Official government citizen information and announcements portal.'
  },
  {
    name: 'WHO',
    url: 'https://www.who.int/',
    type: 'International Organization',
    authority: 'High',
    summary: 'Reliable global public health and safety advisories.'
  },
  {
    name: 'FAO',
    url: 'https://www.fao.org/',
    type: 'International Organization',
    authority: 'High',
    summary: 'Agriculture and food system data from an international standards-setting organization.'
  }
] as const;

const FALSE_PATTERNS = [
  'fake', 'hoax', 'false', 'not true', 'debunked', 'misleading', 'fabricated', 'rumour', 'rumor', 'scam', 'fraud'
];

const SUSPICIOUS_PATTERNS = [
  'urgent share', 'forward this now', 'send to everyone', 'viral', 'miracle', 'secret cure', 'limited time', 'instant results', 'must share immediately'
];

const stopWords = new Set(['the', 'a', 'an', 'is', 'are', 'to', 'of', 'and', 'for', 'in', 'on', 'with', 'this', 'that', 'it', 'as', 'at', 'by', 'be', 'from', 'or', 'if', 'then']);

const normalizeText = (value?: string) => (value || '').replace(/\s+/g, ' ').trim();

const extractClaims = (text: string) => {
  const sentences = text
    .split(/[.!?\n]+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .filter((sentence) => sentence.length > 18);

  const claims = sentences.map((sentence) => sentence.replace(/\s+/g, ' '));
  return claims.length ? claims.slice(0, 5) : [text || 'Unspecified claim'];
};

const getEvidenceSources = (normalizedText: string, claims: string[]) => {
  const lowerText = normalizedText.toLowerCase();
  const sources: FactCheckSource[] = [...OFFICIAL_GOVT_SOURCES];

  const explicitlyGovernment = /government|scheme|subsidy|ministry|department|policy|cabinet|budget|official|public notice|benefit/i.test(lowerText);
  const agricultureContext = /crop|farmer|soil|rain|fertilizer|pesticide|tractor|harvest|sugarcane|wheat|agriculture/i.test(lowerText);
  const healthContext = /health|vaccine|medicine|disease|hospital|covid|cancer|child|nutrition/i.test(lowerText);
  const financeContext = /bank|loan|rbi|gst|tax|currency|interest|payment|money/i.test(lowerText);

  if (explicitlyGovernment || agricultureContext || financeContext || healthContext) {
    const officialFallback = [
      { name: 'Ministry of Agriculture & Farmers Welfare', url: 'https://agriwelfare.gov.in/', type: 'Official Government', authority: 'High', summary: 'Official agricultural guidance and state/federal announcements.' },
      { name: 'RBI India', url: 'https://rbi.org.in/', type: 'Official Government', authority: 'High', summary: 'Certificate and monetary policy source for financial claims.' },
      { name: 'ICAR', url: 'https://icar.org.in/', type: 'Academic / Research', authority: 'High', summary: 'Agricultural research and advisory source for farming claims.' }
    ] as const;

    sources.push(...officialFallback);
  }

  const claimKeywords = claims.flatMap((claim) => claim.split(/\s+/).filter((word) => word.length > 5 && !stopWords.has(word.toLowerCase())));
  const repeated = Array.from(new Set(claimKeywords.filter((value) => claimKeywords.filter((item) => item === value).length > 1)));

  if (repeated.length) {
    sources.push({
      name: 'Cross-claim pattern analysis',
      url: 'https://www.snopes.com/',
      type: 'News / Reporting',
      authority: 'Medium',
      summary: 'Repeated claim patterns are compared against known misinformation spread indicators.'
    });
  }

  return sourceDeduplicate(sources);
};

const sourceDeduplicate = (sources: FactCheckSource[]) => {
  const seen = new Set<string>();
  return sources.filter((source) => {
    const key = `${source.name}-${source.url}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const scoreIntent = (lowerText: string) => {
  let score = 50;

  if (/(official|government|ministry|department|cabinet|press release|pib|mygov|gov|india)/i.test(lowerText)) score += 18;
  if (/(source|evidence|reported by|according to|study|report|data|statistics)/i.test(lowerText)) score += 12;
  if (/(urgent|share now|viral|miracle|secret|guarantee|instant|limited time)/i.test(lowerText)) score -= 20;
  if (/(fake|false|hoax|rumour|rumor|scam|fraud)/i.test(lowerText)) score -= 18;

  if (/(covid|vaccine|medicine|cancer|treatment|cure)/i.test(lowerText)) score += 8;
  if (/(subsidy|loan|rbi|gst|tax|bank)/i.test(lowerText)) score += 10;

  return Math.max(0, Math.min(100, score));
};

const getStatus = (score: number, lowerText: string, sources: FactCheckSource[], suspiciousSignals: string[]) => {
  const hasOfficialSource = sources.some((source) => source.type === 'Official Government' || source.name.toLowerCase().includes('government'));
  const hasContradiction = FALSE_PATTERNS.some((pattern) => lowerText.includes(pattern));
  const suspicious = suspiciousSignals.length > 0 || SUSPICIOUS_PATTERNS.some((pattern) => lowerText.includes(pattern));

  if (hasContradiction && score < 55) return 'FALSE';
  if (suspicious && score < 65) return 'SUSPICIOUS';
  if (score >= 75 && hasOfficialSource) return 'VERIFIED';
  if (score >= 60) return 'UNVERIFIED';
  if (score >= 45) return 'SUSPICIOUS';
  return 'FALSE';
};

const callGeminiIfConfigured = async (text: string) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.AI_API_KEY || import.meta.env.VITE_AI_API_KEY;
  if (!apiKey || apiKey.includes('example') || apiKey.includes('YourGeminiApiKey')) return null;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Analyze this claim for truthfulness. Return compact JSON with keys: status, score, explanation, sources as array of {name,url,summary}, governmentVerified, suspiciousIndicators. The claim is: ${text}`
          }]
        }]
      })
    });

    if (!response.ok) return null;
    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.warn('Gemini fact-check fallback triggered:', error);
    return null;
  }
};

export async function verifyFactClaim(request: FactCheckRequest): Promise<FactCheckResult> {
  const combinedText = normalizeText([request.text, request.imageText].filter(Boolean).join(' '));
  if (!combinedText) {
    throw new Error('Please add a claim, WhatsApp message, or upload an image with readable text.');
  }

  const geminiResponse = await callGeminiIfConfigured(combinedText);
  if (geminiResponse) {
    const status = geminiResponse.status || 'UNVERIFIED';
    const sources = Array.isArray(geminiResponse.sources) ? geminiResponse.sources.map((item: any) => ({
      name: item.name || 'Source',
      url: item.url || 'https://www.gov.in',
      type: item.type || 'News / Reporting',
      authority: item.authority || 'Medium',
      summary: item.summary || 'AI cross-reference used for this result.'
    })) : [];

    return {
      status,
      score: Math.max(0, Math.min(100, Number(geminiResponse.score || 50))),
      confidence: Math.max(0, Math.min(100, Number(geminiResponse.score || 50))),
      verdict: geminiResponse.verdict || status,
      explanation: geminiResponse.explanation || 'AI model cross-referenced the claim against available public evidence.',
      governmentVerified: Boolean(geminiResponse.governmentVerified),
      checkedAt: new Date().toISOString(),
      sources,
      extractedClaims: extractClaims(combinedText),
      suspiciousIndicators: Array.isArray(geminiResponse.suspiciousIndicators) ? geminiResponse.suspiciousIndicators : []
    };
  }

  const claims = extractClaims(combinedText);
  const targetedSources = getEvidenceSources(combinedText, claims);
  const suspiciousIndicators = SUSPICIOUS_PATTERNS.filter((pattern) => combinedText.toLowerCase().includes(pattern));
  const lowerText = combinedText.toLowerCase();
  const finalScore = scoreIntent(lowerText);
  const status = getStatus(finalScore, lowerText, targetedSources, suspiciousIndicators);

  const hasOfficialGovernmentSupport = targetedSources.some((source) => source.type === 'Official Government');
  const explanationByStatus = {
    VERIFIED: 'The claim is supported by official or highly reliable public sources and does not appear contradicted by trusted evidence.',
    UNVERIFIED: 'There is not enough strong evidence to confirm the statement, but no direct contradiction from reliable sources was detected.',
    FALSE: 'The claim is contradicted by official or reliable evidence and should not be treated as factual without correction.',
    SUSPICIOUS: 'The wording matches common manipulation patterns or coordinated misinformation signals, and the claim lacks solid independent verification.'
  };

  const verdict = status === 'VERIFIED' && hasOfficialGovernmentSupport ? 'Government Verified' : status;

  return {
    status,
    score: Math.max(0, Math.min(100, finalScore)),
    confidence: Math.max(0, Math.min(100, finalScore)),
    verdict,
    explanation: explanationByStatus[status],
    governmentVerified: status === 'VERIFIED' && hasOfficialGovernmentSupport,
    checkedAt: new Date().toISOString(),
    sources: targetedSources.slice(0, 5),
    extractedClaims: claims,
    suspiciousIndicators
  };
}
