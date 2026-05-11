import Link from "next/link";

const tools = [
  {
    name: "Finance Tools",
    description: "112 free financial calculators for mortgages, retirement, taxes, debt, and investing.",
    href: "/financetools",
    status: "Live",
  },
  {
    name: "Developer Tools",
    description: "150 free browser-based dev tools. JSON formatter, Base64 encoder, regex tester, and more. 100% client-side.",
    href: "/devtools",
    status: "Live",
  },
  {
    name: "PDF Tools",
    description: "Convert, merge, compress, and edit PDFs online for free.",
    href: "/pdftools",
    status: "Coming Soon",
  },
  {
    name: "Resume Tools",
    description: "Build, format, and optimize your resume with AI-powered tools.",
    href: "/resumetools",
    status: "Coming Soon",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">USFinanceTools</h1>
        <p className="text-gray-500 mb-12">Free online tools for everyone</p>

        <div className="grid gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.name}
              href={tool.href}
              className="block rounded-xl border border-gray-200 bg-white p-6 text-left shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-900">{tool.name}</h2>
                <span
                  className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                    tool.status === "Live"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {tool.status}
                </span>
              </div>
              <p className="text-sm text-gray-500">{tool.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
