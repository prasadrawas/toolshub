export type Category =
  | "mortgage"
  | "retirement"
  | "debt"
  | "tax"
  | "investing"
  | "auto"
  | "insurance"
  | "real-estate";

export type Tool = {
  id: string;
  name: string;
  slug: string;
  category: Category;
  description: string;
  keywords: string[];
  isBuilt: boolean;
  isPopular: boolean;
  relatedTools: string[];
};

export const tools: Tool[] = [
  // ─────────────────────────────────────────────
  // MORTGAGE (18 tools)
  // ─────────────────────────────────────────────
  {
    id: "mortgage-payment-calculator",
    name: "Mortgage Payment Calculator",
    slug: "mortgage-payment-calculator",
    category: "mortgage",
    description:
      "Calculate your monthly mortgage payment including principal, interest, taxes, and insurance.",
    keywords: ["mortgage payment", "monthly payment", "home loan", "PITI", "mortgage estimate"],
    isBuilt: true,
    isPopular: true,
    relatedTools: [
      "how-much-house-can-i-afford",
      "mortgage-amortization-calculator",
      "refinance-calculator",
      "pmi-calculator",
    ],
  },
  {
    id: "how-much-house-can-i-afford",
    name: "How Much House Can I Afford",
    slug: "how-much-house-can-i-afford",
    category: "mortgage",
    description:
      "Determine the maximum home price you can afford based on your income, debts, and down payment.",
    keywords: ["affordability", "home budget", "house price", "buying power", "income to home price"],
    isBuilt: true,
    isPopular: true,
    relatedTools: [
      "mortgage-payment-calculator",
      "closing-cost-calculator",
      "rent-vs-buy-calculator",
      "debt-to-income-ratio-calculator",
    ],
  },
  {
    id: "refinance-calculator",
    name: "Refinance Calculator",
    slug: "refinance-calculator",
    category: "mortgage",
    description:
      "Evaluate whether refinancing your mortgage will save you money by comparing your current and new loan terms.",
    keywords: ["refinance", "mortgage refinance", "lower rate", "break even", "refi"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "mortgage-payment-calculator",
      "mortgage-amortization-calculator",
      "15-year-mortgage-calculator",
      "biweekly-mortgage-calculator",
    ],
  },
  {
    id: "arm-calculator",
    name: "ARM Calculator",
    slug: "arm-calculator",
    category: "mortgage",
    description:
      "Estimate payments for an adjustable-rate mortgage and see how rate changes affect your monthly cost.",
    keywords: ["adjustable rate", "ARM", "variable rate mortgage", "rate adjustment", "hybrid ARM"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "mortgage-payment-calculator",
      "refinance-calculator",
      "15-year-mortgage-calculator",
      "biweekly-mortgage-calculator",
    ],
  },
  {
    id: "fha-loan-calculator",
    name: "FHA Loan Calculator",
    slug: "fha-loan-calculator",
    category: "mortgage",
    description:
      "Calculate monthly payments and upfront costs for an FHA-insured home loan with low down payment requirements.",
    keywords: ["FHA", "FHA loan", "low down payment", "government loan", "first-time buyer"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "mortgage-payment-calculator",
      "pmi-calculator",
      "va-loan-calculator",
      "usda-loan-calculator",
    ],
  },
  {
    id: "va-loan-calculator",
    name: "VA Loan Calculator",
    slug: "va-loan-calculator",
    category: "mortgage",
    description:
      "Estimate monthly payments for a VA-backed home loan available to eligible veterans and service members.",
    keywords: ["VA loan", "veteran mortgage", "military loan", "no down payment", "VA funding fee"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "mortgage-payment-calculator",
      "fha-loan-calculator",
      "usda-loan-calculator",
      "closing-cost-calculator",
    ],
  },
  {
    id: "mortgage-points-calculator",
    name: "Mortgage Points Calculator",
    slug: "mortgage-points-calculator",
    category: "mortgage",
    description:
      "Determine whether buying discount points to lower your mortgage interest rate is worth the upfront cost.",
    keywords: ["discount points", "buy down rate", "mortgage points", "break even points", "rate buydown"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "mortgage-payment-calculator",
      "refinance-calculator",
      "closing-cost-calculator",
      "mortgage-amortization-calculator",
    ],
  },
  {
    id: "rent-vs-buy-calculator",
    name: "Rent vs Buy Calculator",
    slug: "rent-vs-buy-calculator",
    category: "mortgage",
    description:
      "Compare the total long-term cost of renting versus buying a home to make a smarter housing decision.",
    keywords: ["rent or buy", "renting vs owning", "home ownership", "rent comparison", "buy a house"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "how-much-house-can-i-afford",
      "mortgage-payment-calculator",
      "closing-cost-calculator",
      "rent-affordability-calculator",
    ],
  },
  {
    id: "heloc-calculator",
    name: "HELOC Calculator",
    slug: "heloc-calculator",
    category: "mortgage",
    description:
      "Estimate your available credit line and monthly payments for a home equity line of credit.",
    keywords: ["HELOC", "home equity line", "equity borrowing", "credit line", "home equity"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "home-equity-loan-calculator",
      "second-mortgage-calculator",
      "mortgage-payment-calculator",
      "debt-consolidation-calculator",
    ],
  },
  {
    id: "home-equity-loan-calculator",
    name: "Home Equity Loan Calculator",
    slug: "home-equity-loan-calculator",
    category: "mortgage",
    description:
      "Calculate fixed monthly payments on a lump-sum home equity loan based on your available equity.",
    keywords: ["home equity loan", "second lien", "equity", "fixed rate equity", "home loan"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "heloc-calculator",
      "second-mortgage-calculator",
      "mortgage-payment-calculator",
      "refinance-calculator",
    ],
  },
  {
    id: "15-year-mortgage-calculator",
    name: "15-Year Mortgage Calculator",
    slug: "15-year-mortgage-calculator",
    category: "mortgage",
    description:
      "Compare a 15-year mortgage against a 30-year term to see how much interest you can save.",
    keywords: ["15 year mortgage", "short term loan", "15 vs 30", "pay off faster", "mortgage term"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "mortgage-payment-calculator",
      "biweekly-mortgage-calculator",
      "mortgage-amortization-calculator",
      "refinance-calculator",
    ],
  },
  {
    id: "biweekly-mortgage-calculator",
    name: "Biweekly Mortgage Calculator",
    slug: "biweekly-mortgage-calculator",
    category: "mortgage",
    description:
      "See how switching to biweekly mortgage payments can shorten your loan term and reduce total interest.",
    keywords: ["biweekly payments", "extra payments", "pay off early", "accelerated payoff", "biweekly mortgage"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "mortgage-payment-calculator",
      "15-year-mortgage-calculator",
      "mortgage-amortization-calculator",
      "refinance-calculator",
    ],
  },
  {
    id: "mortgage-amortization-calculator",
    name: "Mortgage Amortization Calculator",
    slug: "mortgage-amortization-calculator",
    category: "mortgage",
    description:
      "Generate a full amortization schedule showing how each payment is split between principal and interest.",
    keywords: ["amortization schedule", "loan payoff schedule", "principal vs interest", "amortization table", "payment breakdown"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "mortgage-payment-calculator",
      "biweekly-mortgage-calculator",
      "15-year-mortgage-calculator",
      "refinance-calculator",
    ],
  },
  {
    id: "closing-cost-calculator",
    name: "Closing Cost Calculator",
    slug: "closing-cost-calculator",
    category: "mortgage",
    description:
      "Estimate the total closing costs when purchasing or refinancing a home, including fees and taxes.",
    keywords: ["closing costs", "settlement costs", "home purchase fees", "title fees", "escrow"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "how-much-house-can-i-afford",
      "mortgage-payment-calculator",
      "rent-vs-buy-calculator",
      "fha-loan-calculator",
    ],
  },
  {
    id: "pmi-calculator",
    name: "PMI Calculator",
    slug: "pmi-calculator",
    category: "mortgage",
    description:
      "Calculate your private mortgage insurance cost and find out when you can cancel PMI on your loan.",
    keywords: ["PMI", "private mortgage insurance", "mortgage insurance", "PMI removal", "LTV ratio"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "mortgage-payment-calculator",
      "fha-loan-calculator",
      "how-much-house-can-i-afford",
      "closing-cost-calculator",
    ],
  },
  {
    id: "jumbo-loan-calculator",
    name: "Jumbo Loan Calculator",
    slug: "jumbo-loan-calculator",
    category: "mortgage",
    description:
      "Estimate payments for a jumbo mortgage that exceeds conforming loan limits in your area.",
    keywords: ["jumbo loan", "jumbo mortgage", "non-conforming loan", "high balance loan", "luxury home"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "mortgage-payment-calculator",
      "how-much-house-can-i-afford",
      "mortgage-amortization-calculator",
      "closing-cost-calculator",
    ],
  },
  {
    id: "second-mortgage-calculator",
    name: "Second Mortgage Calculator",
    slug: "second-mortgage-calculator",
    category: "mortgage",
    description:
      "Calculate payments and costs for a second mortgage taken out against your home equity.",
    keywords: ["second mortgage", "second lien", "piggyback loan", "80-10-10", "subordinate loan"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "heloc-calculator",
      "home-equity-loan-calculator",
      "mortgage-payment-calculator",
      "pmi-calculator",
    ],
  },
  {
    id: "usda-loan-calculator",
    name: "USDA Loan Calculator",
    slug: "usda-loan-calculator",
    category: "mortgage",
    description:
      "Estimate monthly payments for a USDA rural development loan with zero down payment.",
    keywords: ["USDA loan", "rural loan", "zero down payment", "government loan", "rural housing"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "fha-loan-calculator",
      "va-loan-calculator",
      "mortgage-payment-calculator",
      "how-much-house-can-i-afford",
    ],
  },

  // ─────────────────────────────────────────────
  // RETIREMENT (16 tools)
  // ─────────────────────────────────────────────
  {
    id: "retirement-savings-calculator",
    name: "Retirement Savings Calculator",
    slug: "retirement-savings-calculator",
    category: "retirement",
    description:
      "Project how much your retirement savings will grow based on contributions, returns, and time horizon.",
    keywords: ["retirement savings", "retirement planning", "nest egg", "retirement goal", "savings projection"],
    isBuilt: true,
    isPopular: true,
    relatedTools: [
      "401k-calculator",
      "compound-interest-calculator",
      "retirement-income-calculator",
      "nest-egg-calculator",
    ],
  },
  {
    id: "401k-calculator",
    name: "401(k) Calculator",
    slug: "401k-calculator",
    category: "retirement",
    description:
      "Estimate the future value of your 401(k) including employer matching contributions and tax advantages.",
    keywords: ["401k", "employer match", "retirement account", "tax deferred", "workplace retirement"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "retirement-savings-calculator",
      "403b-calculator",
      "roth-ira-calculator",
      "catch-up-contribution-calculator",
    ],
  },
  {
    id: "roth-ira-calculator",
    name: "Roth IRA Calculator",
    slug: "roth-ira-calculator",
    category: "retirement",
    description:
      "Calculate the tax-free growth potential of a Roth IRA based on your contributions and investment returns.",
    keywords: ["Roth IRA", "tax free retirement", "Roth conversion", "after-tax retirement", "IRA"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "traditional-ira-calculator",
      "retirement-savings-calculator",
      "401k-calculator",
      "compound-interest-calculator",
    ],
  },
  {
    id: "traditional-ira-calculator",
    name: "Traditional IRA Calculator",
    slug: "traditional-ira-calculator",
    category: "retirement",
    description:
      "Estimate the future value of a traditional IRA with tax-deductible contributions and deferred growth.",
    keywords: ["traditional IRA", "tax deductible IRA", "IRA contributions", "pre-tax retirement", "IRA"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "roth-ira-calculator",
      "401k-calculator",
      "retirement-savings-calculator",
      "required-minimum-distribution-calculator",
    ],
  },
  {
    id: "social-security-calculator",
    name: "Social Security Calculator",
    slug: "social-security-calculator",
    category: "retirement",
    description:
      "Estimate your Social Security benefits based on earnings history and the age you plan to start claiming.",
    keywords: ["Social Security", "SS benefits", "retirement benefits", "claiming age", "full retirement age"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "retirement-income-calculator",
      "retirement-savings-calculator",
      "pension-calculator",
      "nest-egg-calculator",
    ],
  },
  {
    id: "required-minimum-distribution-calculator",
    name: "Required Minimum Distribution Calculator",
    slug: "required-minimum-distribution-calculator",
    category: "retirement",
    description:
      "Calculate the minimum annual withdrawal you must take from tax-deferred retirement accounts after age 73.",
    keywords: ["RMD", "required minimum distribution", "mandatory withdrawal", "IRA withdrawal", "retirement distribution"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "traditional-ira-calculator",
      "401k-calculator",
      "retirement-withdrawal-calculator",
      "retirement-income-calculator",
    ],
  },
  {
    id: "pension-calculator",
    name: "Pension Calculator",
    slug: "pension-calculator",
    category: "retirement",
    description:
      "Estimate the value of your defined-benefit pension plan and expected monthly income in retirement.",
    keywords: ["pension", "defined benefit", "pension income", "pension plan", "employer pension"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "social-security-calculator",
      "retirement-income-calculator",
      "annuity-calculator",
      "retirement-savings-calculator",
    ],
  },
  {
    id: "early-retirement-calculator",
    name: "Early Retirement Calculator",
    slug: "early-retirement-calculator",
    category: "retirement",
    description:
      "Determine whether you have enough savings to retire early and how long your money will last.",
    keywords: ["early retirement", "FIRE", "retire early", "financial independence", "early exit"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "retirement-savings-calculator",
      "nest-egg-calculator",
      "retirement-withdrawal-calculator",
      "retirement-income-calculator",
    ],
  },
  {
    id: "retirement-income-calculator",
    name: "Retirement Income Calculator",
    slug: "retirement-income-calculator",
    category: "retirement",
    description:
      "Estimate your total income in retirement from all sources including savings, Social Security, and pensions.",
    keywords: ["retirement income", "income streams", "retirement paycheck", "withdrawal strategy", "retirement funding"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "social-security-calculator",
      "pension-calculator",
      "retirement-withdrawal-calculator",
      "retirement-savings-calculator",
    ],
  },
  {
    id: "catch-up-contribution-calculator",
    name: "Catch-Up Contribution Calculator",
    slug: "catch-up-contribution-calculator",
    category: "retirement",
    description:
      "Calculate how much extra you can contribute to retirement accounts after age 50 and its impact on savings.",
    keywords: ["catch-up contributions", "over 50 contributions", "extra savings", "contribution limits", "retirement boost"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "401k-calculator",
      "roth-ira-calculator",
      "traditional-ira-calculator",
      "retirement-savings-calculator",
    ],
  },
  {
    id: "annuity-calculator",
    name: "Annuity Calculator",
    slug: "annuity-calculator",
    category: "retirement",
    description:
      "Estimate the income stream from an annuity or the lump sum needed to purchase guaranteed retirement income.",
    keywords: ["annuity", "guaranteed income", "annuity payout", "fixed annuity", "annuitization"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "pension-calculator",
      "retirement-income-calculator",
      "retirement-savings-calculator",
      "compound-interest-calculator",
    ],
  },
  {
    id: "403b-calculator",
    name: "403(b) Calculator",
    slug: "403b-calculator",
    category: "retirement",
    description:
      "Project the growth of a 403(b) retirement plan for employees of public schools and nonprofits.",
    keywords: ["403b", "nonprofit retirement", "teacher retirement", "tax sheltered annuity", "public employee"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "401k-calculator",
      "retirement-savings-calculator",
      "roth-ira-calculator",
      "catch-up-contribution-calculator",
    ],
  },
  {
    id: "sep-ira-calculator",
    name: "SEP IRA Calculator",
    slug: "sep-ira-calculator",
    category: "retirement",
    description:
      "Calculate maximum contributions and projected growth for a Simplified Employee Pension IRA for self-employed individuals.",
    keywords: ["SEP IRA", "self-employed retirement", "SEP contributions", "small business retirement", "sole proprietor IRA"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "simple-ira-calculator",
      "traditional-ira-calculator",
      "self-employment-tax-calculator",
      "retirement-savings-calculator",
    ],
  },
  {
    id: "simple-ira-calculator",
    name: "SIMPLE IRA Calculator",
    slug: "simple-ira-calculator",
    category: "retirement",
    description:
      "Estimate contributions and growth for a SIMPLE IRA plan designed for small businesses.",
    keywords: ["SIMPLE IRA", "small business IRA", "employer IRA", "simple plan", "small employer retirement"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "sep-ira-calculator",
      "401k-calculator",
      "traditional-ira-calculator",
      "retirement-savings-calculator",
    ],
  },
  {
    id: "retirement-withdrawal-calculator",
    name: "Retirement Withdrawal Calculator",
    slug: "retirement-withdrawal-calculator",
    category: "retirement",
    description:
      "Determine a sustainable withdrawal rate so your retirement savings last through your lifetime.",
    keywords: ["withdrawal rate", "4% rule", "safe withdrawal", "retirement drawdown", "spending rate"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "retirement-income-calculator",
      "required-minimum-distribution-calculator",
      "nest-egg-calculator",
      "early-retirement-calculator",
    ],
  },
  {
    id: "nest-egg-calculator",
    name: "Nest Egg Calculator",
    slug: "nest-egg-calculator",
    category: "retirement",
    description:
      "Calculate the total retirement nest egg you need to maintain your desired lifestyle after you stop working.",
    keywords: ["nest egg", "retirement target", "savings goal", "how much to retire", "retirement number"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "retirement-savings-calculator",
      "early-retirement-calculator",
      "retirement-withdrawal-calculator",
      "retirement-income-calculator",
    ],
  },

  // ─────────────────────────────────────────────
  // DEBT (14 tools)
  // ─────────────────────────────────────────────
  {
    id: "debt-snowball-calculator",
    name: "Debt Snowball Calculator",
    slug: "debt-snowball-calculator",
    category: "debt",
    description:
      "Create a debt payoff plan using the snowball method by tackling your smallest balances first.",
    keywords: ["debt snowball", "smallest balance first", "debt payoff", "Dave Ramsey", "snowball method"],
    isBuilt: true,
    isPopular: true,
    relatedTools: [
      "debt-avalanche-calculator",
      "debt-payoff-calculator",
      "credit-card-payoff-calculator",
      "debt-consolidation-calculator",
    ],
  },
  {
    id: "debt-payoff-calculator",
    name: "Debt Payoff Calculator",
    slug: "debt-payoff-calculator",
    category: "debt",
    description:
      "Calculate how long it will take to pay off your debt and the total interest you will pay.",
    keywords: ["debt payoff", "pay off debt", "debt free date", "total interest", "debt elimination"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "debt-snowball-calculator",
      "debt-avalanche-calculator",
      "credit-card-payoff-calculator",
      "payoff-date-calculator",
    ],
  },
  {
    id: "credit-card-payoff-calculator",
    name: "Credit Card Payoff Calculator",
    slug: "credit-card-payoff-calculator",
    category: "debt",
    description:
      "Find out how long it takes to pay off a credit card balance and how extra payments speed up the process.",
    keywords: ["credit card payoff", "credit card debt", "pay off credit card", "minimum payment", "credit card interest"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "debt-snowball-calculator",
      "balance-transfer-calculator",
      "debt-payoff-calculator",
      "debt-consolidation-calculator",
    ],
  },
  {
    id: "debt-consolidation-calculator",
    name: "Debt Consolidation Calculator",
    slug: "debt-consolidation-calculator",
    category: "debt",
    description:
      "Compare the cost of consolidating multiple debts into a single loan versus paying them separately.",
    keywords: ["debt consolidation", "consolidation loan", "combine debts", "single payment", "lower rate"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "personal-loan-calculator",
      "debt-snowball-calculator",
      "balance-transfer-calculator",
      "debt-management-calculator",
    ],
  },
  {
    id: "debt-avalanche-calculator",
    name: "Debt Avalanche Calculator",
    slug: "debt-avalanche-calculator",
    category: "debt",
    description:
      "Build a debt repayment plan using the avalanche method by targeting the highest interest rate first.",
    keywords: ["debt avalanche", "highest interest first", "debt payoff strategy", "avalanche method", "interest savings"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "debt-snowball-calculator",
      "debt-payoff-calculator",
      "credit-card-payoff-calculator",
      "loan-comparison-calculator",
    ],
  },
  {
    id: "personal-loan-calculator",
    name: "Personal Loan Calculator",
    slug: "personal-loan-calculator",
    category: "debt",
    description:
      "Calculate monthly payments, total interest, and total cost for a fixed-rate personal loan.",
    keywords: ["personal loan", "unsecured loan", "loan payment", "fixed rate loan", "installment loan"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "loan-comparison-calculator",
      "debt-consolidation-calculator",
      "debt-payoff-calculator",
      "debt-to-income-ratio-calculator",
    ],
  },
  {
    id: "student-loan-calculator",
    name: "Student Loan Calculator",
    slug: "student-loan-calculator",
    category: "debt",
    description:
      "Estimate monthly payments and total cost of repaying federal or private student loans.",
    keywords: ["student loan", "education loan", "student debt", "loan repayment", "college loan"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "student-loan-refinance-calculator",
      "debt-payoff-calculator",
      "debt-snowball-calculator",
      "loan-comparison-calculator",
    ],
  },
  {
    id: "student-loan-refinance-calculator",
    name: "Student Loan Refinance Calculator",
    slug: "student-loan-refinance-calculator",
    category: "debt",
    description:
      "Determine whether refinancing your student loans to a lower rate will save you money over time.",
    keywords: ["student loan refinance", "refi student loan", "lower student loan rate", "consolidate student loans", "student loan savings"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "student-loan-calculator",
      "personal-loan-calculator",
      "loan-comparison-calculator",
      "debt-consolidation-calculator",
    ],
  },
  {
    id: "debt-to-income-ratio-calculator",
    name: "Debt-to-Income Ratio Calculator",
    slug: "debt-to-income-ratio-calculator",
    category: "debt",
    description:
      "Calculate your debt-to-income ratio to understand how lenders evaluate your borrowing capacity.",
    keywords: ["DTI", "debt to income", "borrowing capacity", "lender qualification", "DTI ratio"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "how-much-house-can-i-afford",
      "personal-loan-calculator",
      "mortgage-payment-calculator",
      "debt-management-calculator",
    ],
  },
  {
    id: "line-of-credit-calculator",
    name: "Line of Credit Calculator",
    slug: "line-of-credit-calculator",
    category: "debt",
    description:
      "Estimate interest costs and payments for a revolving line of credit based on your draw schedule.",
    keywords: ["line of credit", "LOC", "revolving credit", "credit line", "draw schedule"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "heloc-calculator",
      "personal-loan-calculator",
      "credit-card-payoff-calculator",
      "debt-consolidation-calculator",
    ],
  },
  {
    id: "balance-transfer-calculator",
    name: "Balance Transfer Calculator",
    slug: "balance-transfer-calculator",
    category: "debt",
    description:
      "Calculate savings from transferring a credit card balance to a card with a lower or zero percent intro rate.",
    keywords: ["balance transfer", "0% APR", "intro rate", "transfer fee", "credit card transfer"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "credit-card-payoff-calculator",
      "debt-consolidation-calculator",
      "debt-snowball-calculator",
      "debt-payoff-calculator",
    ],
  },
  {
    id: "debt-management-calculator",
    name: "Debt Management Calculator",
    slug: "debt-management-calculator",
    category: "debt",
    description:
      "Evaluate the benefits of enrolling in a debt management plan with negotiated lower interest rates.",
    keywords: ["debt management", "DMP", "credit counseling", "negotiated rates", "debt plan"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "debt-consolidation-calculator",
      "debt-snowball-calculator",
      "debt-avalanche-calculator",
      "credit-card-payoff-calculator",
    ],
  },
  {
    id: "loan-comparison-calculator",
    name: "Loan Comparison Calculator",
    slug: "loan-comparison-calculator",
    category: "debt",
    description:
      "Compare multiple loan offers side by side to find the best deal based on rate, term, and fees.",
    keywords: ["loan comparison", "compare loans", "best loan", "loan offers", "APR comparison"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "personal-loan-calculator",
      "student-loan-calculator",
      "mortgage-payment-calculator",
      "debt-consolidation-calculator",
    ],
  },
  {
    id: "payoff-date-calculator",
    name: "Payoff Date Calculator",
    slug: "payoff-date-calculator",
    category: "debt",
    description:
      "Find the exact date you will be debt-free based on your current balances and payment amounts.",
    keywords: ["payoff date", "debt free date", "when debt free", "payoff timeline", "debt countdown"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "debt-payoff-calculator",
      "credit-card-payoff-calculator",
      "debt-snowball-calculator",
      "debt-avalanche-calculator",
    ],
  },

  // ─────────────────────────────────────────────
  // TAX (14 tools)
  // ─────────────────────────────────────────────
  {
    id: "income-tax-calculator-2026",
    name: "Income Tax Calculator 2026",
    slug: "income-tax-calculator-2026",
    category: "tax",
    description:
      "Estimate your 2026 federal income tax liability based on filing status, income, deductions, and credits.",
    keywords: ["income tax", "federal tax", "tax estimate", "2026 taxes", "tax liability"],
    isBuilt: true,
    isPopular: true,
    relatedTools: [
      "tax-bracket-calculator",
      "tax-withholding-calculator",
      "tax-refund-calculator",
      "capital-gains-tax-calculator",
    ],
  },
  {
    id: "capital-gains-tax-calculator",
    name: "Capital Gains Tax Calculator",
    slug: "capital-gains-tax-calculator",
    category: "tax",
    description:
      "Calculate the tax owed on profits from selling investments, including short-term and long-term rates.",
    keywords: ["capital gains", "investment tax", "stock gains tax", "long term gains", "short term gains"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "income-tax-calculator-2026",
      "stock-profit-calculator",
      "investment-return-calculator",
      "tax-bracket-calculator",
    ],
  },
  {
    id: "sales-tax-calculator",
    name: "Sales Tax Calculator",
    slug: "sales-tax-calculator",
    category: "tax",
    description:
      "Calculate the sales tax on a purchase or determine the pre-tax price from a total including tax.",
    keywords: ["sales tax", "state tax", "purchase tax", "tax rate", "consumer tax"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "property-tax-calculator",
      "income-tax-calculator-2026",
      "tax-deduction-calculator",
      "tax-bracket-calculator",
    ],
  },
  {
    id: "property-tax-calculator",
    name: "Property Tax Calculator",
    slug: "property-tax-calculator",
    category: "tax",
    description:
      "Estimate annual property taxes on a home based on assessed value and local tax rates.",
    keywords: ["property tax", "real estate tax", "home tax", "mill rate", "assessed value"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "mortgage-payment-calculator",
      "how-much-house-can-i-afford",
      "income-tax-calculator-2026",
      "tax-deduction-calculator",
    ],
  },
  {
    id: "tax-bracket-calculator",
    name: "Tax Bracket Calculator",
    slug: "tax-bracket-calculator",
    category: "tax",
    description:
      "Find your marginal and effective federal tax rates based on your taxable income and filing status.",
    keywords: ["tax bracket", "marginal rate", "effective rate", "tax rate", "income bracket"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "income-tax-calculator-2026",
      "capital-gains-tax-calculator",
      "tax-withholding-calculator",
      "self-employment-tax-calculator",
    ],
  },
  {
    id: "self-employment-tax-calculator",
    name: "Self-Employment Tax Calculator",
    slug: "self-employment-tax-calculator",
    category: "tax",
    description:
      "Calculate the Social Security and Medicare taxes owed on your self-employment income.",
    keywords: ["self employment tax", "SE tax", "freelancer tax", "independent contractor", "1099 tax"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "income-tax-calculator-2026",
      "quarterly-tax-calculator",
      "tax-bracket-calculator",
      "sep-ira-calculator",
    ],
  },
  {
    id: "estate-tax-calculator",
    name: "Estate Tax Calculator",
    slug: "estate-tax-calculator",
    category: "tax",
    description:
      "Estimate the federal estate tax liability on an estate based on its total value and applicable exemptions.",
    keywords: ["estate tax", "inheritance tax", "death tax", "estate planning", "estate exemption"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "gift-tax-calculator",
      "income-tax-calculator-2026",
      "life-insurance-calculator",
      "tax-bracket-calculator",
    ],
  },
  {
    id: "gift-tax-calculator",
    name: "Gift Tax Calculator",
    slug: "gift-tax-calculator",
    category: "tax",
    description:
      "Determine whether a financial gift triggers federal gift tax and how it impacts your lifetime exemption.",
    keywords: ["gift tax", "annual exclusion", "lifetime exemption", "gifting", "gift tax return"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "estate-tax-calculator",
      "income-tax-calculator-2026",
      "tax-bracket-calculator",
      "tax-deduction-calculator",
    ],
  },
  {
    id: "tax-withholding-calculator",
    name: "Tax Withholding Calculator",
    slug: "tax-withholding-calculator",
    category: "tax",
    description:
      "Adjust your W-4 withholding so you neither owe a large tax bill nor give the IRS an interest-free loan.",
    keywords: ["W-4", "tax withholding", "paycheck tax", "withholding allowances", "adjust withholding"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "income-tax-calculator-2026",
      "tax-refund-calculator",
      "tax-bracket-calculator",
      "self-employment-tax-calculator",
    ],
  },
  {
    id: "quarterly-tax-calculator",
    name: "Quarterly Tax Calculator",
    slug: "quarterly-tax-calculator",
    category: "tax",
    description:
      "Calculate estimated quarterly tax payments required if you are self-employed or have non-wage income.",
    keywords: ["quarterly taxes", "estimated taxes", "1040-ES", "quarterly payments", "estimated tax payment"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "self-employment-tax-calculator",
      "income-tax-calculator-2026",
      "tax-withholding-calculator",
      "tax-bracket-calculator",
    ],
  },
  {
    id: "tax-refund-calculator",
    name: "Tax Refund Calculator",
    slug: "tax-refund-calculator",
    category: "tax",
    description:
      "Estimate whether you will receive a tax refund or owe money when you file your return.",
    keywords: ["tax refund", "refund estimate", "tax return", "owe taxes", "refund amount"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "income-tax-calculator-2026",
      "tax-withholding-calculator",
      "tax-bracket-calculator",
      "earned-income-credit-calculator",
    ],
  },
  {
    id: "amt-calculator",
    name: "AMT Calculator",
    slug: "amt-calculator",
    category: "tax",
    description:
      "Determine whether you may owe the Alternative Minimum Tax and calculate the potential additional amount.",
    keywords: ["AMT", "alternative minimum tax", "AMT exemption", "ISO tax", "tax preference items"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "income-tax-calculator-2026",
      "tax-bracket-calculator",
      "capital-gains-tax-calculator",
      "tax-deduction-calculator",
    ],
  },
  {
    id: "tax-deduction-calculator",
    name: "Tax Deduction Calculator",
    slug: "tax-deduction-calculator",
    category: "tax",
    description:
      "Compare the standard deduction to your itemized deductions to determine which saves you more on taxes.",
    keywords: ["tax deduction", "itemized deductions", "standard deduction", "Schedule A", "deduction comparison"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "income-tax-calculator-2026",
      "property-tax-calculator",
      "tax-bracket-calculator",
      "tax-refund-calculator",
    ],
  },
  {
    id: "earned-income-credit-calculator",
    name: "Earned Income Credit Calculator",
    slug: "earned-income-credit-calculator",
    category: "tax",
    description:
      "Check your eligibility and estimate the amount of the Earned Income Tax Credit based on income and dependents.",
    keywords: ["EITC", "earned income credit", "EIC", "tax credit", "low income credit"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "tax-deduction-calculator",
      "income-tax-calculator-2026",
      "tax-refund-calculator",
      "tax-bracket-calculator",
    ],
  },

  // ─────────────────────────────────────────────
  // INVESTING (16 tools)
  // ─────────────────────────────────────────────
  {
    id: "compound-interest-calculator",
    name: "Compound Interest Calculator",
    slug: "compound-interest-calculator",
    category: "investing",
    description:
      "Calculate how your money grows over time with compound interest on savings or investments.",
    keywords: ["compound interest", "interest calculator", "money growth", "compounding", "future value"],
    isBuilt: true,
    isPopular: true,
    relatedTools: [
      "investment-growth-calculator",
      "savings-goal-calculator",
      "retirement-savings-calculator",
      "rule-of-72-calculator",
    ],
  },
  {
    id: "investment-return-calculator",
    name: "Investment Return Calculator",
    slug: "investment-return-calculator",
    category: "investing",
    description:
      "Calculate the total return and annualized performance of an investment over a given period.",
    keywords: ["investment return", "ROI", "annualized return", "total return", "investment performance"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "compound-interest-calculator",
      "stock-return-calculator",
      "investment-growth-calculator",
      "real-return-calculator",
    ],
  },
  {
    id: "stock-return-calculator",
    name: "Stock Return Calculator",
    slug: "stock-return-calculator",
    category: "investing",
    description:
      "Calculate the profit or loss on a stock trade including dividends and capital appreciation.",
    keywords: ["stock return", "stock profit", "equity return", "stock performance", "share gain"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "investment-return-calculator",
      "stock-profit-calculator",
      "dividend-calculator",
      "capital-gains-tax-calculator",
    ],
  },
  {
    id: "bond-yield-calculator",
    name: "Bond Yield Calculator",
    slug: "bond-yield-calculator",
    category: "investing",
    description:
      "Calculate the current yield, yield to maturity, and yield to call for a bond investment.",
    keywords: ["bond yield", "yield to maturity", "YTM", "bond return", "fixed income"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "investment-return-calculator",
      "cd-calculator",
      "compound-interest-calculator",
      "real-return-calculator",
    ],
  },
  {
    id: "dividend-calculator",
    name: "Dividend Calculator",
    slug: "dividend-calculator",
    category: "investing",
    description:
      "Project dividend income from stocks based on yield, share count, and dividend reinvestment over time.",
    keywords: ["dividend", "dividend yield", "DRIP", "dividend income", "dividend reinvestment"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "stock-return-calculator",
      "compound-interest-calculator",
      "investment-growth-calculator",
      "stock-profit-calculator",
    ],
  },
  {
    id: "dollar-cost-averaging-calculator",
    name: "Dollar Cost Averaging Calculator",
    slug: "dollar-cost-averaging-calculator",
    category: "investing",
    description:
      "Compare dollar cost averaging to lump-sum investing to see how each strategy performs over time.",
    keywords: ["dollar cost averaging", "DCA", "systematic investing", "regular investing", "averaging in"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "investment-growth-calculator",
      "compound-interest-calculator",
      "index-fund-calculator",
      "investment-return-calculator",
    ],
  },
  {
    id: "portfolio-rebalancing-calculator",
    name: "Portfolio Rebalancing Calculator",
    slug: "portfolio-rebalancing-calculator",
    category: "investing",
    description:
      "Determine the trades needed to rebalance your portfolio back to your target asset allocation.",
    keywords: ["rebalancing", "asset allocation", "portfolio balance", "target allocation", "portfolio management"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "investment-return-calculator",
      "index-fund-calculator",
      "etf-expense-ratio-calculator",
      "mutual-fund-calculator",
    ],
  },
  {
    id: "real-return-calculator",
    name: "Real Return Calculator",
    slug: "real-return-calculator",
    category: "investing",
    description:
      "Calculate inflation-adjusted investment returns to understand the true purchasing power of your gains.",
    keywords: ["real return", "inflation adjusted", "purchasing power", "after inflation", "real rate"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "investment-return-calculator",
      "compound-interest-calculator",
      "bond-yield-calculator",
      "savings-goal-calculator",
    ],
  },
  {
    id: "index-fund-calculator",
    name: "Index Fund Calculator",
    slug: "index-fund-calculator",
    category: "investing",
    description:
      "Project the long-term growth of index fund investments based on historical market returns and fees.",
    keywords: ["index fund", "passive investing", "S&P 500", "market returns", "low cost investing"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "etf-expense-ratio-calculator",
      "mutual-fund-calculator",
      "dollar-cost-averaging-calculator",
      "investment-growth-calculator",
    ],
  },
  {
    id: "etf-expense-ratio-calculator",
    name: "ETF Expense Ratio Calculator",
    slug: "etf-expense-ratio-calculator",
    category: "investing",
    description:
      "See how expense ratios erode investment returns over time and compare the cost of different funds.",
    keywords: ["expense ratio", "ETF fees", "fund costs", "management fee", "fee comparison"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "index-fund-calculator",
      "mutual-fund-calculator",
      "investment-return-calculator",
      "compound-interest-calculator",
    ],
  },
  {
    id: "rule-of-72-calculator",
    name: "Rule of 72 Calculator",
    slug: "rule-of-72-calculator",
    category: "investing",
    description:
      "Quickly estimate how many years it takes to double your money at a given interest or return rate.",
    keywords: ["rule of 72", "doubling time", "double money", "rule of 70", "compound growth"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "compound-interest-calculator",
      "investment-growth-calculator",
      "investment-return-calculator",
      "real-return-calculator",
    ],
  },
  {
    id: "investment-growth-calculator",
    name: "Investment Growth Calculator",
    slug: "investment-growth-calculator",
    category: "investing",
    description:
      "Visualize how a lump sum and recurring contributions grow over time at a specified rate of return.",
    keywords: ["investment growth", "portfolio growth", "wealth accumulation", "growth projection", "future value"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "compound-interest-calculator",
      "dollar-cost-averaging-calculator",
      "investment-return-calculator",
      "savings-goal-calculator",
    ],
  },
  {
    id: "stock-profit-calculator",
    name: "Stock Profit Calculator",
    slug: "stock-profit-calculator",
    category: "investing",
    description:
      "Calculate your net profit from a stock trade after accounting for buy price, sell price, and commissions.",
    keywords: ["stock profit", "trade profit", "buy sell calculator", "stock gain loss", "trading calculator"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "stock-return-calculator",
      "capital-gains-tax-calculator",
      "dividend-calculator",
      "investment-return-calculator",
    ],
  },
  {
    id: "mutual-fund-calculator",
    name: "Mutual Fund Calculator",
    slug: "mutual-fund-calculator",
    category: "investing",
    description:
      "Estimate the future value of mutual fund investments considering loads, fees, and reinvested distributions.",
    keywords: ["mutual fund", "fund calculator", "fund growth", "load fund", "mutual fund fees"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "index-fund-calculator",
      "etf-expense-ratio-calculator",
      "investment-growth-calculator",
      "compound-interest-calculator",
    ],
  },
  {
    id: "cd-calculator",
    name: "CD Calculator",
    slug: "cd-calculator",
    category: "investing",
    description:
      "Calculate the earnings on a certificate of deposit based on deposit amount, term, and APY.",
    keywords: ["CD", "certificate of deposit", "CD rate", "CD earnings", "fixed deposit"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "savings-goal-calculator",
      "compound-interest-calculator",
      "bond-yield-calculator",
      "real-return-calculator",
    ],
  },
  {
    id: "savings-goal-calculator",
    name: "Savings Goal Calculator",
    slug: "savings-goal-calculator",
    category: "investing",
    description:
      "Figure out how much you need to save each month to reach a specific financial goal by a target date.",
    keywords: ["savings goal", "monthly savings", "savings target", "goal planning", "save for"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "compound-interest-calculator",
      "investment-growth-calculator",
      "cd-calculator",
      "retirement-savings-calculator",
    ],
  },

  // ─────────────────────────────────────────────
  // AUTO (12 tools)
  // ─────────────────────────────────────────────
  {
    id: "car-loan-calculator",
    name: "Car Loan Calculator",
    slug: "car-loan-calculator",
    category: "auto",
    description:
      "Calculate monthly payments, total interest, and the full cost of financing a vehicle purchase.",
    keywords: ["car loan", "auto loan", "vehicle financing", "car payment", "auto finance"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "car-payment-calculator",
      "car-affordability-calculator",
      "auto-refinance-calculator",
      "total-cost-of-ownership-calculator",
    ],
  },
  {
    id: "auto-lease-calculator",
    name: "Auto Lease Calculator",
    slug: "auto-lease-calculator",
    category: "auto",
    description:
      "Estimate monthly lease payments and total lease cost based on vehicle price, residual value, and money factor.",
    keywords: ["auto lease", "car lease", "lease payment", "residual value", "money factor"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "car-loan-calculator",
      "car-affordability-calculator",
      "total-cost-of-ownership-calculator",
      "vehicle-depreciation-calculator",
    ],
  },
  {
    id: "car-affordability-calculator",
    name: "Car Affordability Calculator",
    slug: "car-affordability-calculator",
    category: "auto",
    description:
      "Determine how much car you can afford based on your income, expenses, and desired monthly payment.",
    keywords: ["car affordability", "car budget", "how much car", "vehicle budget", "auto budget"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "car-loan-calculator",
      "car-payment-calculator",
      "total-cost-of-ownership-calculator",
      "debt-to-income-ratio-calculator",
    ],
  },
  {
    id: "vehicle-depreciation-calculator",
    name: "Vehicle Depreciation Calculator",
    slug: "vehicle-depreciation-calculator",
    category: "auto",
    description:
      "Estimate how quickly your vehicle loses value over time and project its future resale worth.",
    keywords: ["depreciation", "car value loss", "vehicle value", "resale value", "auto depreciation"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "used-car-value-calculator",
      "trade-in-value-calculator",
      "total-cost-of-ownership-calculator",
      "auto-lease-calculator",
    ],
  },
  {
    id: "gas-mileage-calculator",
    name: "Gas Mileage Calculator",
    slug: "gas-mileage-calculator",
    category: "auto",
    description:
      "Calculate your actual fuel economy and annual gas costs based on driving habits and fuel prices.",
    keywords: ["gas mileage", "MPG", "fuel economy", "fuel cost", "miles per gallon"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "ev-savings-calculator",
      "total-cost-of-ownership-calculator",
      "car-affordability-calculator",
      "car-loan-calculator",
    ],
  },
  {
    id: "ev-savings-calculator",
    name: "EV Savings Calculator",
    slug: "ev-savings-calculator",
    category: "auto",
    description:
      "Compare the total ownership cost of an electric vehicle versus a gas-powered car including fuel and maintenance savings.",
    keywords: ["EV savings", "electric vehicle", "EV vs gas", "electric car cost", "EV comparison"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "gas-mileage-calculator",
      "total-cost-of-ownership-calculator",
      "car-loan-calculator",
      "car-affordability-calculator",
    ],
  },
  {
    id: "car-insurance-estimator",
    name: "Car Insurance Estimator",
    slug: "car-insurance-estimator",
    category: "auto",
    description:
      "Estimate your annual car insurance premium based on vehicle type, coverage level, and driver profile.",
    keywords: ["car insurance", "auto insurance", "insurance estimate", "coverage cost", "premium estimate"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "total-cost-of-ownership-calculator",
      "car-affordability-calculator",
      "home-insurance-calculator",
      "insurance-needs-calculator",
    ],
  },
  {
    id: "used-car-value-calculator",
    name: "Used Car Value Calculator",
    slug: "used-car-value-calculator",
    category: "auto",
    description:
      "Estimate the fair market value of a used vehicle based on its age, mileage, and condition.",
    keywords: ["used car value", "car worth", "vehicle value", "blue book", "fair market value"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "vehicle-depreciation-calculator",
      "trade-in-value-calculator",
      "car-loan-calculator",
      "total-cost-of-ownership-calculator",
    ],
  },
  {
    id: "car-payment-calculator",
    name: "Car Payment Calculator",
    slug: "car-payment-calculator",
    category: "auto",
    description:
      "Quickly estimate your monthly car payment based on price, down payment, trade-in, interest rate, and term.",
    keywords: ["car payment", "monthly payment", "auto payment", "vehicle payment", "payment estimate"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "car-loan-calculator",
      "car-affordability-calculator",
      "auto-lease-calculator",
      "auto-refinance-calculator",
    ],
  },
  {
    id: "auto-refinance-calculator",
    name: "Auto Refinance Calculator",
    slug: "auto-refinance-calculator",
    category: "auto",
    description:
      "Determine if refinancing your auto loan will lower your monthly payment or save on total interest.",
    keywords: ["auto refinance", "car refinance", "lower car payment", "refi auto loan", "vehicle refinance"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "car-loan-calculator",
      "car-payment-calculator",
      "loan-comparison-calculator",
      "refinance-calculator",
    ],
  },
  {
    id: "total-cost-of-ownership-calculator",
    name: "Total Cost of Ownership Calculator",
    slug: "total-cost-of-ownership-calculator",
    category: "auto",
    description:
      "Calculate the true cost of owning a vehicle including payments, insurance, fuel, maintenance, and depreciation.",
    keywords: ["total cost of ownership", "TCO", "true car cost", "ownership cost", "annual car cost"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "car-loan-calculator",
      "gas-mileage-calculator",
      "vehicle-depreciation-calculator",
      "car-insurance-estimator",
    ],
  },
  {
    id: "trade-in-value-calculator",
    name: "Trade-In Value Calculator",
    slug: "trade-in-value-calculator",
    category: "auto",
    description:
      "Estimate the trade-in value of your current vehicle to plan your next car purchase budget.",
    keywords: ["trade-in value", "trade in", "car trade", "dealer trade value", "vehicle trade"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "used-car-value-calculator",
      "vehicle-depreciation-calculator",
      "car-loan-calculator",
      "car-affordability-calculator",
    ],
  },

  // ─────────────────────────────────────────────
  // INSURANCE (10 tools)
  // ─────────────────────────────────────────────
  {
    id: "life-insurance-calculator",
    name: "Life Insurance Calculator",
    slug: "life-insurance-calculator",
    category: "insurance",
    description:
      "Determine how much life insurance coverage you need to protect your family based on income, debts, and goals.",
    keywords: ["life insurance", "coverage amount", "death benefit", "insurance needs", "family protection"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "term-life-insurance-calculator",
      "whole-life-vs-term-calculator",
      "insurance-needs-calculator",
      "disability-insurance-calculator",
    ],
  },
  {
    id: "term-life-insurance-calculator",
    name: "Term Life Insurance Calculator",
    slug: "term-life-insurance-calculator",
    category: "insurance",
    description:
      "Estimate the monthly premium for a term life insurance policy based on your age, health, and coverage amount.",
    keywords: ["term life", "term insurance", "life insurance premium", "term policy", "affordable life insurance"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "life-insurance-calculator",
      "whole-life-vs-term-calculator",
      "insurance-needs-calculator",
      "disability-insurance-calculator",
    ],
  },
  {
    id: "health-insurance-calculator",
    name: "Health Insurance Calculator",
    slug: "health-insurance-calculator",
    category: "insurance",
    description:
      "Compare health insurance plans by estimating total annual costs including premiums, deductibles, and copays.",
    keywords: ["health insurance", "medical insurance", "insurance plan", "healthcare cost", "premium comparison"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "insurance-needs-calculator",
      "disability-insurance-calculator",
      "life-insurance-calculator",
      "retirement-savings-calculator",
    ],
  },
  {
    id: "home-insurance-calculator",
    name: "Home Insurance Calculator",
    slug: "home-insurance-calculator",
    category: "insurance",
    description:
      "Estimate the annual cost of homeowners insurance based on your home value, location, and coverage level.",
    keywords: ["home insurance", "homeowners insurance", "dwelling coverage", "property insurance", "home protection"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "renters-insurance-calculator",
      "mortgage-payment-calculator",
      "umbrella-insurance-calculator",
      "insurance-needs-calculator",
    ],
  },
  {
    id: "disability-insurance-calculator",
    name: "Disability Insurance Calculator",
    slug: "disability-insurance-calculator",
    category: "insurance",
    description:
      "Calculate the disability insurance benefit you need to replace your income if you become unable to work.",
    keywords: ["disability insurance", "income protection", "disability benefit", "short term disability", "long term disability"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "life-insurance-calculator",
      "insurance-needs-calculator",
      "health-insurance-calculator",
      "long-term-care-calculator",
    ],
  },
  {
    id: "umbrella-insurance-calculator",
    name: "Umbrella Insurance Calculator",
    slug: "umbrella-insurance-calculator",
    category: "insurance",
    description:
      "Determine how much umbrella liability coverage you need beyond your existing auto and home policies.",
    keywords: ["umbrella insurance", "excess liability", "umbrella policy", "liability coverage", "extra coverage"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "home-insurance-calculator",
      "car-insurance-estimator",
      "insurance-needs-calculator",
      "life-insurance-calculator",
    ],
  },
  {
    id: "long-term-care-calculator",
    name: "Long-Term Care Calculator",
    slug: "long-term-care-calculator",
    category: "insurance",
    description:
      "Estimate the potential cost of long-term care and the insurance coverage needed to protect your assets.",
    keywords: ["long term care", "LTC", "nursing home cost", "assisted living", "care insurance"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "disability-insurance-calculator",
      "life-insurance-calculator",
      "retirement-savings-calculator",
      "insurance-needs-calculator",
    ],
  },
  {
    id: "insurance-needs-calculator",
    name: "Insurance Needs Calculator",
    slug: "insurance-needs-calculator",
    category: "insurance",
    description:
      "Get a comprehensive overview of all the insurance types and coverage amounts your household needs.",
    keywords: ["insurance needs", "coverage review", "insurance checkup", "protection gap", "insurance planning"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "life-insurance-calculator",
      "health-insurance-calculator",
      "home-insurance-calculator",
      "disability-insurance-calculator",
    ],
  },
  {
    id: "whole-life-vs-term-calculator",
    name: "Whole Life vs Term Calculator",
    slug: "whole-life-vs-term-calculator",
    category: "insurance",
    description:
      "Compare the costs and benefits of whole life insurance versus term life to decide which is right for you.",
    keywords: ["whole life vs term", "permanent insurance", "cash value", "insurance comparison", "whole life"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "life-insurance-calculator",
      "term-life-insurance-calculator",
      "insurance-needs-calculator",
      "investment-return-calculator",
    ],
  },
  {
    id: "renters-insurance-calculator",
    name: "Renters Insurance Calculator",
    slug: "renters-insurance-calculator",
    category: "insurance",
    description:
      "Estimate the cost of renters insurance and determine how much personal property coverage you need.",
    keywords: ["renters insurance", "tenant insurance", "personal property", "rental coverage", "apartment insurance"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "home-insurance-calculator",
      "insurance-needs-calculator",
      "rent-affordability-calculator",
      "umbrella-insurance-calculator",
    ],
  },

  // ─────────────────────────────────────────────
  // REAL ESTATE (12 tools)
  // ─────────────────────────────────────────────
  {
    id: "rental-property-calculator",
    name: "Rental Property Calculator",
    slug: "rental-property-calculator",
    category: "real-estate",
    description:
      "Analyze the cash flow, ROI, and profitability of a rental property investment including all expenses.",
    keywords: ["rental property", "rental income", "cash flow", "landlord", "investment property"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "cap-rate-calculator",
      "cash-on-cash-return-calculator",
      "rental-yield-calculator",
      "property-roi-calculator",
    ],
  },
  {
    id: "cap-rate-calculator",
    name: "Cap Rate Calculator",
    slug: "cap-rate-calculator",
    category: "real-estate",
    description:
      "Calculate the capitalization rate of a property to evaluate its potential return as an investment.",
    keywords: ["cap rate", "capitalization rate", "property valuation", "NOI", "investment return"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "rental-property-calculator",
      "cash-on-cash-return-calculator",
      "rental-yield-calculator",
      "property-roi-calculator",
    ],
  },
  {
    id: "cash-on-cash-return-calculator",
    name: "Cash-on-Cash Return Calculator",
    slug: "cash-on-cash-return-calculator",
    category: "real-estate",
    description:
      "Measure the annual return on the actual cash you invested in a property relative to its net income.",
    keywords: ["cash on cash", "CoC return", "cash invested", "real estate return", "cash yield"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "rental-property-calculator",
      "cap-rate-calculator",
      "property-roi-calculator",
      "rental-yield-calculator",
    ],
  },
  {
    id: "rental-yield-calculator",
    name: "Rental Yield Calculator",
    slug: "rental-yield-calculator",
    category: "real-estate",
    description:
      "Calculate the gross and net rental yield of an investment property based on rent and purchase price.",
    keywords: ["rental yield", "gross yield", "net yield", "rent return", "yield percentage"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "rental-property-calculator",
      "cap-rate-calculator",
      "cash-on-cash-return-calculator",
      "property-roi-calculator",
    ],
  },
  {
    id: "house-flipping-calculator",
    name: "House Flipping Calculator",
    slug: "house-flipping-calculator",
    category: "real-estate",
    description:
      "Estimate the profit from flipping a house by accounting for purchase price, renovation costs, and selling expenses.",
    keywords: ["house flip", "fix and flip", "flip profit", "renovation ROI", "flipping calculator"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "property-roi-calculator",
      "real-estate-commission-calculator",
      "rental-property-calculator",
      "closing-cost-calculator",
    ],
  },
  {
    id: "property-roi-calculator",
    name: "Property ROI Calculator",
    slug: "property-roi-calculator",
    category: "real-estate",
    description:
      "Calculate the total return on investment for a property including appreciation, cash flow, and equity buildup.",
    keywords: ["property ROI", "real estate ROI", "investment return", "property profit", "total return"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "rental-property-calculator",
      "cap-rate-calculator",
      "cash-on-cash-return-calculator",
      "property-appreciation-calculator",
    ],
  },
  {
    id: "real-estate-commission-calculator",
    name: "Real Estate Commission Calculator",
    slug: "real-estate-commission-calculator",
    category: "real-estate",
    description:
      "Calculate the real estate agent commission and your net proceeds from the sale of a property.",
    keywords: ["real estate commission", "agent fee", "broker commission", "seller proceeds", "closing proceeds"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "house-flipping-calculator",
      "closing-cost-calculator",
      "property-roi-calculator",
      "property-appreciation-calculator",
    ],
  },
  {
    id: "rent-affordability-calculator",
    name: "Rent Affordability Calculator",
    slug: "rent-affordability-calculator",
    category: "real-estate",
    description:
      "Determine the maximum monthly rent you can afford based on your income and financial obligations.",
    keywords: ["rent affordability", "how much rent", "rent budget", "affordable rent", "rent income ratio"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "rent-vs-buy-calculator",
      "debt-to-income-ratio-calculator",
      "renters-insurance-calculator",
      "how-much-house-can-i-afford",
    ],
  },
  {
    id: "property-appreciation-calculator",
    name: "Property Appreciation Calculator",
    slug: "property-appreciation-calculator",
    category: "real-estate",
    description:
      "Project the future value of a property based on historical or expected annual appreciation rates.",
    keywords: ["property appreciation", "home value growth", "real estate appreciation", "future home value", "property value"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "property-roi-calculator",
      "rental-property-calculator",
      "real-estate-investment-calculator",
      "cap-rate-calculator",
    ],
  },
  {
    id: "1031-exchange-calculator",
    name: "1031 Exchange Calculator",
    slug: "1031-exchange-calculator",
    category: "real-estate",
    description:
      "Calculate the tax deferral benefit of a 1031 like-kind exchange when selling an investment property.",
    keywords: ["1031 exchange", "like kind exchange", "tax deferred exchange", "investment property swap", "starker exchange"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "capital-gains-tax-calculator",
      "property-roi-calculator",
      "rental-property-calculator",
      "real-estate-investment-calculator",
    ],
  },
  {
    id: "real-estate-investment-calculator",
    name: "Real Estate Investment Calculator",
    slug: "real-estate-investment-calculator",
    category: "real-estate",
    description:
      "Compare a real estate investment to other asset classes to decide the best use of your capital.",
    keywords: ["real estate investment", "property vs stocks", "REIT", "real estate comparison", "alternative investment"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "rental-property-calculator",
      "property-roi-calculator",
      "investment-return-calculator",
      "1031-exchange-calculator",
    ],
  },
  {
    id: "vacancy-rate-calculator",
    name: "Vacancy Rate Calculator",
    slug: "vacancy-rate-calculator",
    category: "real-estate",
    description:
      "Estimate the impact of vacancy periods on rental income and factor it into your investment analysis.",
    keywords: ["vacancy rate", "rental vacancy", "occupancy rate", "vacant units", "vacancy loss"],
    isBuilt: true,
    isPopular: false,
    relatedTools: [
      "rental-property-calculator",
      "rental-yield-calculator",
      "cap-rate-calculator",
      "cash-on-cash-return-calculator",
    ],
  },
];

// ─────────────────────────────────────────────
// Helper functions
// ─────────────────────────────────────────────

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find(t => t.slug === slug);
}

export function getToolsByCategory(category: Category): Tool[] {
  return tools.filter(t => t.category === category);
}

export function getPopularTools(): Tool[] {
  return tools.filter(t => t.isPopular);
}

export function searchTools(query: string): Tool[] {
  const q = query.toLowerCase();
  return tools.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.keywords.some(k => k.toLowerCase().includes(q))
  );
}
