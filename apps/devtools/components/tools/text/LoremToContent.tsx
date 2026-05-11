"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2, RefreshCw } from "lucide-react";

const REAL_SENTENCES = [
  "Modern applications leverage cloud-native architectures for improved scalability and resilience.",
  "The development team adopted agile methodologies to accelerate product delivery cycles.",
  "Data-driven decision making has become essential for competitive advantage in today's market.",
  "Our platform processes millions of transactions per day with sub-millisecond latency.",
  "The new API gateway provides unified authentication and rate limiting across all services.",
  "Machine learning models continuously improve prediction accuracy through automated retraining pipelines.",
  "Cross-functional teams collaborate using integrated project management and communication tools.",
  "The migration to microservices reduced deployment times from hours to minutes.",
  "User research revealed key pain points in the onboarding flow that needed immediate attention.",
  "Automated testing pipelines catch regressions before they reach production environments.",
  "The analytics dashboard provides real-time insights into customer engagement and retention metrics.",
  "Security best practices include regular audits, encryption at rest, and zero-trust networking.",
  "Our design system ensures consistency across web and mobile platforms.",
  "The infrastructure team implemented auto-scaling to handle unpredictable traffic patterns.",
  "Continuous integration and deployment pipelines streamline the software release process.",
  "Customer feedback loops drive iterative improvements to the product experience.",
  "The engineering team optimized database queries, reducing page load times by forty percent.",
  "Strategic partnerships enable companies to expand into new markets efficiently.",
  "Remote work policies have reshaped how teams communicate and collaborate across time zones.",
  "Performance monitoring tools provide actionable alerts for system health and reliability.",
  "The content management system supports multi-language publishing for global audiences.",
  "Investment in developer experience leads to higher productivity and lower turnover rates.",
  "Edge computing brings processing closer to end users, improving response times significantly.",
  "Blockchain technology offers transparent and immutable record-keeping for supply chain management.",
  "The product roadmap aligns business objectives with technical capabilities and resource constraints.",
  "Open source contributions strengthen the developer community and accelerate innovation.",
  "Digital transformation initiatives require executive sponsorship and cross-departmental alignment.",
  "The notification service handles over ten million push notifications daily with high deliverability.",
  "Accessibility standards ensure that digital products are usable by people of all abilities.",
  "Revenue growth depends on acquiring new customers while retaining and expanding existing accounts.",
];

const LOREM_PATTERN = /lorem\s+ipsum(?:\s+dolor\s+sit\s+amet)?[^.]*\./gi;
const LOREM_WORD_PATTERN = /\b(?:lorem|ipsum|dolor|sit|amet|consectetur|adipiscing|elit|sed|do|eiusmod|tempor|incididunt|ut|labore|et|dolore|magna|aliqua|enim|ad|minim|veniam|quis|nostrud|exercitation|ullamco|laboris|nisi|aliquip|ex|ea|commodo|consequat|duis|aute|irure|in|reprehenderit|voluptate|velit|esse|cillum|fugiat|nulla|pariatur|excepteur|sint|occaecat|cupidatat|non|proident|sunt|culpa|qui|officia|deserunt|mollit|anim|id|est|laborum)\b/gi;

function replaceLorem(text: string): string {
  let sentenceIndex = Math.floor(Math.random() * REAL_SENTENCES.length);

  const getSentence = () => {
    const s = REAL_SENTENCES[sentenceIndex % REAL_SENTENCES.length];
    sentenceIndex++;
    return s;
  };

  // First try to replace full lorem ipsum sentences
  let result = text.replace(LOREM_PATTERN, () => getSentence());

  // Then replace remaining lorem-ish words in sequence
  const loremWords = result.match(LOREM_WORD_PATTERN);
  if (loremWords && loremWords.length > 3) {
    // If there are many lorem words left, replace the whole block
    const sentences: string[] = [];
    const wordCount = loremWords.length;
    let wordsUsed = 0;
    while (wordsUsed < wordCount) {
      const s = getSentence();
      sentences.push(s);
      wordsUsed += s.split(" ").length;
    }
    result = result.replace(
      new RegExp(`(${LOREM_WORD_PATTERN.source}[\\s,]*){3,}`, "gi"),
      () => sentences.splice(0, 1)[0] || getSentence()
    );
  }

  return result;
}

export default function LoremToContent() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleReplace = () => {
    setOutput(replaceLorem(input));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={handleReplace} disabled={!input} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100 disabled:opacity-50">
          <RefreshCw className="h-4 w-4" /> Replace Lorem
        </button>
        <button onClick={handleCopy} disabled={!output} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
        <button onClick={() => { setInput(""); setOutput(""); }} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
          <Trash2 className="h-4 w-4" /> Clear
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Input (with Lorem Ipsum)</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-80 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none"
            placeholder="Paste text containing lorem ipsum..."
            spellCheck={false}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Output (realistic content)</label>
          <textarea
            value={output}
            readOnly
            className="w-full h-80 rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm resize-none"
            placeholder="Replaced text will appear here..."
          />
        </div>
      </div>
    </div>
  );
}
