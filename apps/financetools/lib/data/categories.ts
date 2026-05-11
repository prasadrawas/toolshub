import { Category } from "./tools";

export type CategoryInfo = {
  id: Category;
  name: string;
  slug: string;
  icon: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  subSections: string[];
};

export const categories: CategoryInfo[] = [
  {
    id: "mortgage",
    name: "Mortgage",
    slug: "mortgage",
    icon: "Home",
    description:
      "Calculate mortgage payments, affordability, refinancing options, and more. Our mortgage calculators help you make informed decisions about home financing with accurate, up-to-date rates and formulas.",
    seoTitle: "Mortgage Calculators | USFinanceTools — Free Financial Calculators",
    seoDescription:
      "Free mortgage calculators for home buying, refinancing, and equity. Calculate monthly payments, affordability, amortization schedules, and more. Updated for 2026.",
    subSections: ["Buying a home", "Refinancing", "Equity"],
  },
  {
    id: "retirement",
    name: "Retirement",
    slug: "retirement",
    icon: "UserRound",
    description:
      "Plan your retirement with confidence using our free calculators. Estimate savings growth, required contributions, Social Security benefits, and withdrawal strategies to ensure a comfortable retirement.",
    seoTitle: "Retirement Calculators | USFinanceTools — Free Financial Calculators",
    seoDescription:
      "Free retirement planning calculators. Estimate 401(k) growth, IRA contributions, Social Security benefits, and how much you need to retire. Updated for 2026.",
    subSections: ["Savings & Growth", "Retirement Accounts", "Income Planning"],
  },
  {
    id: "debt",
    name: "Debt",
    slug: "debt",
    icon: "CreditCard",
    description:
      "Take control of your debt with our free payoff calculators. Compare snowball vs. avalanche methods, calculate payoff timelines, and find the fastest path to becoming debt-free.",
    seoTitle: "Debt Payoff Calculators | USFinanceTools — Free Financial Calculators",
    seoDescription:
      "Free debt payoff calculators. Use snowball or avalanche methods, calculate credit card payoff dates, and plan your path to debt freedom. Updated for 2026.",
    subSections: ["Payoff Strategies", "Loans", "Credit Cards"],
  },
  {
    id: "tax",
    name: "Tax",
    slug: "tax",
    icon: "Receipt",
    description:
      "Estimate your federal and state taxes with our free calculators. Calculate income tax, capital gains, self-employment tax, and more using the latest 2026 tax brackets and rates.",
    seoTitle: "Tax Calculators | USFinanceTools — Free Financial Calculators",
    seoDescription:
      "Free tax calculators for 2026. Estimate federal income tax, capital gains, self-employment tax, and state taxes. Uses latest IRS tax brackets.",
    subSections: ["Income Tax", "Capital Gains & Investment", "Deductions & Credits"],
  },
  {
    id: "investing",
    name: "Investing",
    slug: "investing",
    icon: "TrendingUp",
    description:
      "Grow your wealth with our free investment calculators. Calculate compound interest, investment returns, dividend income, and savings goals to make smarter investment decisions.",
    seoTitle: "Investment Calculators | USFinanceTools — Free Financial Calculators",
    seoDescription:
      "Free investment calculators for compound interest, stock returns, dividends, and savings goals. Plan your investment strategy with accurate projections. Updated for 2026.",
    subSections: ["Growth & Returns", "Stocks & Funds", "Savings"],
  },
  {
    id: "auto",
    name: "Auto",
    slug: "auto",
    icon: "Car",
    description:
      "Make smart car buying and financing decisions with our free auto calculators. Calculate loan payments, lease costs, depreciation, and total cost of ownership.",
    seoTitle: "Auto & Car Loan Calculators | USFinanceTools — Free Financial Calculators",
    seoDescription:
      "Free auto calculators for car loans, leases, depreciation, and affordability. Compare financing options and calculate total cost of ownership. Updated for 2026.",
    subSections: ["Financing", "Cost of Ownership", "Buying & Selling"],
  },
  {
    id: "insurance",
    name: "Insurance",
    slug: "insurance",
    icon: "Shield",
    description:
      "Determine the right insurance coverage with our free calculators. Estimate life insurance needs, compare policy types, and calculate how much coverage you need to protect your family.",
    seoTitle: "Insurance Calculators | USFinanceTools — Free Financial Calculators",
    seoDescription:
      "Free insurance calculators for life, health, home, and disability coverage. Determine how much insurance you need and compare policy options. Updated for 2026.",
    subSections: ["Life Insurance", "Health & Disability", "Property"],
  },
  {
    id: "real-estate",
    name: "Real Estate",
    slug: "real-estate",
    icon: "Building",
    description:
      "Analyze real estate investments with our free calculators. Calculate rental yields, cap rates, ROI, and property appreciation to make data-driven investment decisions.",
    seoTitle: "Real Estate Investment Calculators | USFinanceTools — Free Financial Calculators",
    seoDescription:
      "Free real estate investment calculators. Calculate rental yields, cap rates, cash-on-cash returns, and property ROI. Updated for 2026.",
    subSections: ["Rental Properties", "Investment Analysis", "Buying & Selling"],
  },
];

export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  return categories.find((c) => c.slug === slug);
}
