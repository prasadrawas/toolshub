export function getHowToSteps(category: string): string[] {
  const steps: Record<string, string[]> = {
    mortgage: [
      "Enter the home purchase price and your planned down payment amount. If you already know your loan amount, you can enter that directly.",
      "Set your interest rate and loan term. Most mortgages are 30-year fixed, but you can compare 15-year and adjustable-rate options to see the difference.",
      "Add property taxes, homeowners insurance, and PMI if your down payment is less than 20%. These are included in your total monthly payment (PITI).",
      "Review your results, including the monthly payment breakdown, total interest over the life of the loan, and the amortization schedule showing how your balance decreases over time.",
    ],
    retirement: [
      "Enter your current age, planned retirement age, and current retirement savings balance. This sets the time horizon for your projections.",
      "Input your annual income and the percentage you contribute to retirement accounts. Include any employer match if applicable.",
      "Set your expected annual rate of return before and during retirement. A balanced portfolio historically returns 6-8% annually before inflation.",
      "Review your projected retirement savings, estimated monthly retirement income, and whether you are on track to meet your goals. Adjust contributions or retirement age to close any gaps.",
    ],
    debt: [
      "List each of your debts including the current balance, interest rate (APR), and minimum monthly payment for each one.",
      "Enter any additional amount you can put toward debt repayment beyond the minimum payments each month.",
      "Choose your preferred payoff strategy: snowball (smallest balance first for quick wins) or avalanche (highest interest rate first to minimize total interest).",
      "Review your personalized payoff plan showing the order to pay off each debt, your debt-free date, and the total interest you will pay. Compare strategies to find what works best for you.",
    ],
    tax: [
      "Select your filing status (single, married filing jointly, married filing separately, or head of household) and enter your gross annual income from all sources.",
      "Enter your deductions, either the standard deduction or an itemized total. Include any tax credits you qualify for, such as the child tax credit or education credits.",
      "Add any additional income such as capital gains, self-employment income, or investment income. These may be taxed at different rates.",
      "Review your estimated tax liability, effective tax rate, and marginal tax bracket. The breakdown shows exactly how your income is taxed at each bracket level.",
    ],
    investing: [
      "Enter your initial investment amount (lump sum) and any recurring monthly or annual contributions you plan to make.",
      "Set your expected annual rate of return. Historical stock market returns have averaged about 10% before inflation, but a more conservative estimate of 6-8% is commonly used for planning.",
      "Choose your investment time horizon in years. Longer time horizons allow compound interest to work more effectively in your favor.",
      "Review the projected growth chart and final balance. Pay attention to how much of your total comes from contributions versus investment growth, which demonstrates the power of compounding.",
    ],
    auto: [
      "Enter the vehicle purchase price, your down payment or trade-in value, and any applicable taxes and fees.",
      "Set the loan interest rate (APR) and loan term in months. Common auto loan terms are 36, 48, 60, or 72 months.",
      "Optionally include additional costs like extended warranty, gap insurance, or dealer add-ons to see the true financed amount.",
      "Review your monthly payment, total interest paid, and the total cost of the vehicle over the life of the loan. Compare different terms to find the best balance between monthly payment and total cost.",
    ],
    insurance: [
      "Enter your current age, annual income, and the number of dependents who rely on your income for financial support.",
      "Input your existing savings, investments, and any current insurance coverage you already have in place.",
      "Add your outstanding debts (mortgage, car loans, student loans) and future financial obligations like college tuition for children.",
      "Review the recommended coverage amount, which accounts for income replacement, debt payoff, and future expenses. Compare different coverage levels and policy types to find the right fit.",
    ],
    "real-estate": [
      "Enter the property purchase price, your down payment, and the expected financing terms including interest rate and loan duration.",
      "Input the expected monthly rental income and operating expenses such as property taxes, insurance, maintenance, and property management fees.",
      "Set the expected annual appreciation rate and vacancy rate. Historical real estate appreciation averages 3-4% nationally, but varies significantly by market.",
      "Review key metrics including cash flow, cap rate, cash-on-cash return, and total ROI. These numbers help you compare this property against other investment opportunities.",
    ],
  };

  return steps[category] || steps.investing;
}

export function getResultsExplanation(category: string): string {
  const explanations: Record<string, string> = {
    mortgage:
      "Your mortgage payment results include the principal and interest payment, plus estimated property taxes, homeowners insurance, and private mortgage insurance (PMI) if applicable. The total monthly payment (PITI) represents the actual amount you need to budget each month. The amortization schedule shows how each payment is split between reducing your loan balance and paying interest, with more going toward principal as the loan matures. The total interest figure reveals the true cost of borrowing over the full loan term.",
    retirement:
      "Your retirement projection shows the estimated value of your savings at your target retirement age, based on your current contributions and expected investment returns. The monthly retirement income estimate uses the 4% safe withdrawal rule, which is widely considered a sustainable spending rate for a 30-year retirement. If your projected savings fall short of your goal, the calculator shows how much additional monthly savings is needed to close the gap. Remember that these projections assume consistent returns, while actual market performance will vary year to year.",
    debt:
      "Your debt payoff results show the exact order to pay off each debt, the monthly payment allocated to each, and your projected debt-free date. The total interest column reveals how much you will pay in interest charges over the payoff period. Comparing the snowball and avalanche methods helps you see the trade-off: the avalanche method typically saves more on interest, while the snowball method gives you psychological wins by eliminating smaller debts quickly. The payoff timeline chart tracks your total debt balance declining to zero over time.",
    tax:
      "Your tax estimate breaks down your federal income tax liability across each tax bracket, showing how the progressive tax system works. Your effective tax rate is the actual percentage of your total income paid in taxes, which is always lower than your marginal bracket rate. The results also show your after-tax income, helping you understand your true take-home pay. If applicable, the calculator accounts for the difference between short-term and long-term capital gains tax rates, as well as the additional net investment income tax.",
    investing:
      "Your investment results display the projected growth of your portfolio over time, breaking down how much comes from your original contributions versus investment returns. The compound growth chart illustrates how earnings on your earnings accelerate growth, especially in later years. The final balance represents the nominal future value of your investments. To understand purchasing power, consider that inflation historically averages 2-3% annually, so a dollar in 20 years buys less than a dollar today. The annualized return figure helps you compare this investment against other opportunities.",
    auto:
      "Your auto loan results show the fixed monthly payment, the total amount of interest paid over the loan term, and the total cost of the vehicle including financing. A shorter loan term means higher monthly payments but significantly less total interest. The payment breakdown shows how each payment is split between principal and interest over the life of the loan. If you are comparing lease versus buy, look at the total cost of each option over the same time period, factoring in the residual value of the vehicle at the end of the term.",
    insurance:
      "Your insurance coverage estimate is based on the income replacement method, which calculates the amount your family would need to maintain their standard of living. The recommended coverage factors in your outstanding debts, future obligations like education costs, final expenses, and an emergency fund, minus existing assets and coverage. The coverage multiple (typically 10-15 times income) provides a quick benchmark, but the detailed calculation gives a more accurate picture. Premium estimates are approximate and will vary based on your specific health profile, lifestyle, and the insurance company.",
    "real-estate":
      "Your real estate investment analysis includes several key metrics. The cap rate (net operating income divided by property value) lets you compare properties regardless of financing. The cash-on-cash return measures the annual return on the actual cash you invested. Monthly cash flow shows the income remaining after all expenses and debt service. Total ROI factors in appreciation, principal paydown, and cash flow over your holding period. A positive cash flow property that also appreciates gives you returns from multiple sources, making real estate a potentially powerful wealth-building tool.",
  };

  return explanations[category] || explanations.investing;
}

export function getTips(
  category: string
): { title: string; description: string }[] {
  const tips: Record<string, { title: string; description: string }[]> = {
    mortgage: [
      {
        title: "Shop around for rates",
        description:
          "Even a 0.25% difference in interest rate can save you tens of thousands of dollars over the life of a 30-year mortgage. Get quotes from at least 3-5 lenders, including banks, credit unions, and online lenders.",
      },
      {
        title: "Consider a 15-year term",
        description:
          "A 15-year mortgage typically has a lower interest rate and saves you more than half the total interest of a 30-year loan. The monthly payment is higher, but the long-term savings are substantial.",
      },
      {
        title: "Put at least 20% down",
        description:
          "A 20% down payment eliminates private mortgage insurance (PMI), which can add $100-$300 per month to your payment. If you cannot reach 20%, explore FHA or VA loan options for lower requirements.",
      },
      {
        title: "Factor in all housing costs",
        description:
          "Your mortgage payment is just one piece of the puzzle. Budget for property taxes, homeowners insurance, maintenance (typically 1-2% of home value annually), and potential HOA fees.",
      },
      {
        title: "Make extra principal payments",
        description:
          "Even one extra mortgage payment per year can shave several years off a 30-year loan and save thousands in interest. Biweekly payments are an easy way to achieve this automatically.",
      },
    ],
    retirement: [
      {
        title: "Start as early as possible",
        description:
          "Thanks to compound interest, money invested in your 20s has far more growth potential than money invested in your 40s. Even small contributions early on can grow into significant retirement savings.",
      },
      {
        title: "Maximize your employer match",
        description:
          "If your employer offers a 401(k) match, contribute at least enough to get the full match. This is essentially free money and provides an immediate 50-100% return on your contribution.",
      },
      {
        title: "Diversify across account types",
        description:
          "Having a mix of pre-tax (401k, Traditional IRA) and after-tax (Roth IRA, Roth 401k) accounts gives you flexibility in retirement to manage your tax bracket and required minimum distributions.",
      },
      {
        title: "Increase contributions with raises",
        description:
          "Each time you receive a raise, increase your retirement contribution by at least half the raise amount. You will still see a boost in take-home pay while accelerating your savings rate.",
      },
      {
        title: "Plan for healthcare costs",
        description:
          "Healthcare is one of the largest expenses in retirement. A 65-year-old couple can expect to spend over $300,000 on healthcare throughout retirement. Consider an HSA as a tax-advantaged way to save for these costs.",
      },
    ],
    debt: [
      {
        title: "Stop adding new debt",
        description:
          "The first step to becoming debt-free is to stop borrowing. Put your credit cards away and commit to cash or debit for daily expenses while you work through your payoff plan.",
      },
      {
        title: "Build a small emergency fund first",
        description:
          "Before aggressively paying down debt, save $1,000-$2,000 for emergencies. This prevents you from going further into debt when unexpected expenses arise.",
      },
      {
        title: "Pick a strategy and stick with it",
        description:
          "Whether you choose the snowball method (smallest balance first) or avalanche method (highest rate first), consistency matters more than the method. The best strategy is the one you will actually follow.",
      },
      {
        title: "Negotiate lower interest rates",
        description:
          "Call your credit card companies and ask for a rate reduction. If you have a good payment history, many issuers will lower your rate by 2-5 percentage points, saving you significant interest.",
      },
      {
        title: "Consider balance transfer offers",
        description:
          "A 0% intro APR balance transfer card can give you 12-21 months of interest-free payments. Just make sure you can pay off the balance before the promotional period ends, and factor in the transfer fee (typically 3-5%).",
      },
    ],
    tax: [
      {
        title: "Know your marginal vs. effective rate",
        description:
          "Your marginal tax rate applies only to the last dollar you earn, not your entire income. Your effective rate (total tax divided by total income) is your true tax burden and is always lower than your top bracket.",
      },
      {
        title: "Maximize pre-tax contributions",
        description:
          "Contributing to a 401(k), Traditional IRA, or HSA reduces your taxable income dollar for dollar. Maxing out a 401(k) at $23,500 in 2026 could save you $5,000 or more in taxes depending on your bracket.",
      },
      {
        title: "Track deductible expenses",
        description:
          "Even if you normally take the standard deduction, major life events like buying a home, large medical bills, or significant charitable donations could push your itemized deductions higher. Keep records throughout the year.",
      },
      {
        title: "Harvest investment losses",
        description:
          "Selling investments at a loss can offset capital gains and up to $3,000 of ordinary income per year. Unused losses carry forward to future years. This strategy can significantly reduce your tax bill.",
      },
      {
        title: "Plan estimated payments carefully",
        description:
          "If you have self-employment or investment income, make quarterly estimated tax payments to avoid underpayment penalties. Aim to pay at least 100% of last year's tax liability (110% if income exceeds $150,000).",
      },
    ],
    investing: [
      {
        title: "Keep fees low",
        description:
          "Investment fees compound just like returns, but in reverse. A 1% annual fee can reduce your portfolio value by over 25% over 30 years. Choose low-cost index funds with expense ratios under 0.20% whenever possible.",
      },
      {
        title: "Diversify your portfolio",
        description:
          "Spread your investments across different asset classes (stocks, bonds, real estate), geographies (domestic and international), and sectors. Diversification reduces risk without necessarily reducing returns.",
      },
      {
        title: "Stay the course during downturns",
        description:
          "Market downturns are normal and temporary. Historically, the S&P 500 has recovered from every decline and gone on to reach new highs. Selling during a downturn locks in losses and means missing the recovery.",
      },
      {
        title: "Rebalance annually",
        description:
          "As different assets grow at different rates, your portfolio drifts from your target allocation. Rebalancing once or twice a year brings you back to your intended risk level and can improve long-term returns.",
      },
      {
        title: "Automate your investments",
        description:
          "Set up automatic transfers to your investment accounts on payday. Dollar-cost averaging removes the temptation to time the market and ensures you consistently build wealth over time.",
      },
    ],
    auto: [
      {
        title: "Get pre-approved before shopping",
        description:
          "Secure financing from your bank or credit union before visiting the dealership. This gives you negotiating leverage and a baseline rate to compare against dealer financing offers.",
      },
      {
        title: "Keep the loan term to 60 months or less",
        description:
          "Longer loan terms lower your monthly payment but cost significantly more in total interest. A 72 or 84-month loan can also leave you upside down (owing more than the car is worth) for years.",
      },
      {
        title: "Put at least 20% down",
        description:
          "A substantial down payment reduces your monthly payment, lowers total interest, and helps prevent negative equity. It also often qualifies you for a better interest rate.",
      },
      {
        title: "Factor in total cost of ownership",
        description:
          "The purchase price is just the beginning. Insurance, fuel, maintenance, and depreciation can add $5,000-$10,000 per year to the cost of owning a vehicle. Consider all costs before deciding what you can afford.",
      },
      {
        title: "Consider certified pre-owned vehicles",
        description:
          "A certified pre-owned (CPO) car that is 1-3 years old offers significant savings over new while still providing manufacturer warranty coverage. New cars lose 20-30% of their value in the first two years.",
      },
    ],
    insurance: [
      {
        title: "Buy term life insurance when young",
        description:
          "Term life insurance is most affordable when you are young and healthy. A 30-year-old can get $500,000 in coverage for $25-$40 per month. Waiting until age 40 can more than double that cost.",
      },
      {
        title: "Match coverage to actual needs",
        description:
          "Use an income replacement calculation rather than guessing. Most families need coverage equal to 10-15 times the primary earner's income, minus existing savings and other income sources.",
      },
      {
        title: "Bundle policies for discounts",
        description:
          "Many insurers offer 10-25% discounts when you bundle home and auto insurance, or add umbrella coverage. Always compare the bundled price against separate policies from different companies.",
      },
      {
        title: "Review coverage annually",
        description:
          "Life changes like marriage, having children, buying a home, or paying off debts all affect your insurance needs. Review your coverage each year to ensure you are neither underinsured nor overpaying.",
      },
      {
        title: "Do not skip disability insurance",
        description:
          "You are far more likely to become disabled than to die during your working years. Long-term disability insurance replaces 60-70% of your income and is often available at a reasonable cost through your employer.",
      },
    ],
    "real-estate": [
      {
        title: "Run the numbers conservatively",
        description:
          "Use realistic estimates for rent, expenses, and vacancy rates. Budget at least 5-10% of rent for vacancy, 5-10% for maintenance, and 8-10% for property management even if you self-manage initially.",
      },
      {
        title: "Focus on cash flow over appreciation",
        description:
          "Appreciation is speculative and not guaranteed. A property that cash flows positively from day one protects you if property values stagnate or decline. Cash flow provides a reliable return regardless of market conditions.",
      },
      {
        title: "Understand the local market",
        description:
          "Real estate is hyper-local. Research neighborhood trends, rental demand, employment growth, and comparable property values before investing. A great deal in a declining area is not a great deal.",
      },
      {
        title: "Account for all expenses",
        description:
          "Beyond the mortgage, budget for property taxes, insurance, HOA fees, utilities (if included), property management, repairs, capital expenditures (roof, HVAC), and legal or accounting costs.",
      },
      {
        title: "Leverage tax advantages",
        description:
          "Real estate offers significant tax benefits including depreciation deductions, mortgage interest deductions, and 1031 exchanges for deferring capital gains. Work with a tax professional to maximize these benefits.",
      },
    ],
  };

  return tips[category] || tips.investing;
}

export function getFAQs(
  category: string
): { question: string; answer: string }[] {
  const faqs: Record<string, { question: string; answer: string }[]> = {
    mortgage: [
      {
        question: "How much house can I afford on my salary?",
        answer:
          "A common guideline is that your total monthly housing costs (mortgage, taxes, insurance) should not exceed 28% of your gross monthly income. Lenders also look at your total debt-to-income ratio, which should generally be below 36-43%. For example, on a $75,000 salary, you might afford a home in the $225,000-$300,000 range depending on your down payment, interest rate, and other debts.",
      },
      {
        question: "What is the difference between a fixed-rate and adjustable-rate mortgage?",
        answer:
          "A fixed-rate mortgage locks in your interest rate for the entire loan term (typically 15 or 30 years), giving you predictable monthly payments. An adjustable-rate mortgage (ARM) offers a lower initial rate for a set period (usually 5, 7, or 10 years) that then adjusts periodically based on market conditions. ARMs can be a good choice if you plan to sell or refinance before the adjustment period begins.",
      },
      {
        question: "How much should I save for a down payment?",
        answer:
          "While 20% is the traditional recommendation because it avoids private mortgage insurance (PMI), many loan programs allow much less. FHA loans require as little as 3.5% down, conventional loans can go as low as 3%, and VA and USDA loans offer zero-down options for eligible borrowers. However, a larger down payment means lower monthly payments and less interest over the life of the loan.",
      },
      {
        question: "When does it make sense to refinance my mortgage?",
        answer:
          "Refinancing is typically worthwhile when you can lower your interest rate by at least 0.5-1%, plan to stay in the home long enough to recoup closing costs (usually 2-5 years), or need to switch from an ARM to a fixed rate. Calculate your break-even point by dividing the closing costs by your monthly savings to see how many months it takes to benefit from the refinance.",
      },
      {
        question: "What is PMI and how do I get rid of it?",
        answer:
          "Private mortgage insurance (PMI) is required by lenders when your down payment is less than 20% of the home's value. It typically costs 0.5-1.5% of the loan amount annually. You can request PMI removal once your loan balance reaches 80% of the original home value, and it is automatically canceled at 78%. You can reach 80% faster by making extra principal payments or if your home appreciates in value.",
      },
      {
        question: "Should I pay for mortgage points?",
        answer:
          "Mortgage points (also called discount points) let you prepay interest to get a lower rate. One point costs 1% of your loan amount and typically reduces your rate by 0.25%. Points make sense if you plan to keep the loan for a long time, as it usually takes 4-7 years to break even on the upfront cost. If you might sell or refinance sooner, skip the points and keep your cash.",
      },
      {
        question: "What are closing costs and how much should I expect?",
        answer:
          "Closing costs are fees paid when you finalize your mortgage and typically range from 2-5% of the loan amount. They include lender fees (origination, appraisal, credit report), title fees (title search, title insurance), government fees (recording, transfer taxes), and prepaid items (property taxes, homeowners insurance, prepaid interest). Some costs are negotiable, and sellers can sometimes contribute toward buyer closing costs.",
      },
      {
        question: "Is a 15-year or 30-year mortgage better?",
        answer:
          "A 15-year mortgage has higher monthly payments but saves you significantly on total interest and builds equity faster. A 30-year mortgage offers lower monthly payments, giving you more financial flexibility. For example, on a $300,000 loan at current rates, a 30-year mortgage might cost over $200,000 in total interest while a 15-year mortgage might cost under $90,000. The best choice depends on your budget, financial goals, and comfort level with the higher payment.",
      },
    ],
    retirement: [
      {
        question: "How much do I need to save for retirement?",
        answer:
          "A widely used benchmark is to save 10-15 times your pre-retirement annual income by the time you retire. For example, if you earn $80,000, aim for $800,000 to $1.2 million in retirement savings. However, your actual number depends on your desired lifestyle, expected Social Security benefits, healthcare needs, and retirement age. Use the 4% rule as a starting point: multiply your desired annual retirement income by 25.",
      },
      {
        question: "What is the difference between a 401(k) and an IRA?",
        answer:
          "A 401(k) is an employer-sponsored plan with higher contribution limits ($23,500 in 2026) and potential employer matching. An IRA (Individual Retirement Account) is opened independently with a lower limit ($7,000 in 2026). Both come in traditional (pre-tax) and Roth (after-tax) versions. Many people contribute to both: enough to a 401(k) to get the full employer match, then max out an IRA, then contribute more to the 401(k) if possible.",
      },
      {
        question: "Should I choose a Traditional or Roth retirement account?",
        answer:
          "The key question is whether your tax rate will be higher now or in retirement. If you expect to be in a higher tax bracket in retirement (common for younger workers early in their careers), a Roth account lets you pay taxes now at a lower rate and withdraw tax-free later. If you are in your peak earning years, a traditional account gives you a tax deduction now and you pay taxes on withdrawals in retirement when you may be in a lower bracket.",
      },
      {
        question: "When can I start withdrawing from my retirement accounts?",
        answer:
          "You can withdraw from retirement accounts without penalty starting at age 59 and a half. Withdrawals before that age generally incur a 10% early withdrawal penalty plus income taxes, though there are exceptions (the Rule of 55, substantially equal payments, first-time home purchase for IRAs). Required minimum distributions (RMDs) must begin at age 73 for traditional accounts, but Roth IRAs have no RMD requirements during the owner's lifetime.",
      },
      {
        question: "How does Social Security factor into my retirement plan?",
        answer:
          "Social Security provides a foundation of retirement income but is not designed to replace your full salary. The average benefit is approximately $1,900 per month in 2026. You can claim as early as age 62 (with a reduced benefit), at your full retirement age (66-67 depending on birth year), or as late as age 70 (with an increased benefit of about 8% per year of delay). Delaying benefits is generally advantageous if you are in good health and can afford to wait.",
      },
      {
        question: "What rate of return should I expect on my retirement investments?",
        answer:
          "Historical average annual returns (before inflation) are approximately 10% for U.S. stocks, 5-6% for bonds, and 7-8% for a balanced 60/40 portfolio. However, past performance does not guarantee future results. For conservative retirement planning, many financial advisors suggest using 6-7% for a diversified portfolio. After accounting for inflation (typically 2-3%), real returns of 4-5% are a reasonable long-term expectation.",
      },
      {
        question: "How much should I save at each age?",
        answer:
          "Fidelity's age-based milestones suggest saving 1x your salary by age 30, 3x by 40, 6x by 50, 8x by 60, and 10x by 67. If you are behind, do not panic, but take action: increase your savings rate, take advantage of catch-up contributions after age 50 ($7,500 extra in a 401(k) in 2026), and consider working a few extra years, which both increases savings and reduces the years your money needs to last.",
      },
      {
        question: "What is the 4% rule for retirement withdrawals?",
        answer:
          "The 4% rule is a guideline suggesting you can withdraw 4% of your portfolio in the first year of retirement and adjust for inflation each subsequent year with a high probability of not running out of money over 30 years. For a $1 million portfolio, that means starting with $40,000 per year. Some financial planners now suggest a more conservative 3-3.5% rate given current market conditions and longer life expectancies.",
      },
    ],
    debt: [
      {
        question: "Should I use the debt snowball or avalanche method?",
        answer:
          "The avalanche method (paying off highest interest rate first) saves the most money mathematically. The snowball method (paying off smallest balance first) provides psychological wins that help you stay motivated. Research shows the snowball method often leads to higher success rates because people are more likely to stick with it. Choose the method that fits your personality: if you need motivation, go snowball; if you are disciplined and want to minimize interest, go avalanche.",
      },
      {
        question: "Should I pay off debt or invest?",
        answer:
          "As a general rule, pay off high-interest debt (above 7-8%) before investing beyond your employer match. Credit card debt at 20%+ APR costs far more than typical investment returns. However, always contribute enough to get your full employer 401(k) match first, as that is an immediate 50-100% return. For lower-rate debt like mortgages (3-7%), investing often makes more sense mathematically, but some people prefer the peace of mind of being debt-free.",
      },
      {
        question: "How do I negotiate lower interest rates on my credit cards?",
        answer:
          "Call the number on the back of your credit card and ask to speak with the retention or hardship department. Mention your payment history, how long you have been a customer, and that you are considering transferring the balance to a competitor with a lower rate. Success rates are surprisingly high: studies show about 70% of people who ask receive some reduction. Even a 2-3% reduction on a $10,000 balance saves $200-$300 per year in interest.",
      },
      {
        question: "Is debt consolidation a good idea?",
        answer:
          "Debt consolidation can be helpful if it lowers your overall interest rate and simplifies your payments into one monthly bill. Options include personal loans, balance transfer cards, and home equity loans. However, consolidation only works if you stop accumulating new debt. If you consolidate credit card debt and then run up the cards again, you end up in worse shape. Address the spending habits that created the debt alongside consolidation.",
      },
      {
        question: "How does debt affect my credit score?",
        answer:
          "Debt impacts your credit score primarily through credit utilization (30% of your score) and payment history (35% of your score). Keep credit card balances below 30% of your credit limits, ideally below 10%. Making all payments on time is the single most important factor for a good credit score. Paying off revolving debt (credit cards) typically improves your score faster than paying off installment loans (car loans, mortgages).",
      },
      {
        question: "What is a good debt-to-income ratio?",
        answer:
          "Your debt-to-income (DTI) ratio is your total monthly debt payments divided by your gross monthly income. Lenders generally prefer a DTI below 36%, with no more than 28% going toward housing. A DTI above 43% makes it difficult to qualify for most mortgages. To improve your DTI, you can either increase your income or reduce your debt payments. Paying off smaller debts can quickly improve your ratio.",
      },
      {
        question: "Should I use savings to pay off debt?",
        answer:
          "Keep a small emergency fund ($1,000-$2,000) before aggressively paying down debt. Using all your savings for debt payoff leaves you vulnerable to emergencies that could force you back into debt. Once you have that buffer, direct extra cash toward high-interest debt. After the high-interest debt is gone, build your emergency fund to 3-6 months of expenses before aggressively paying off lower-rate debt.",
      },
      {
        question: "How long will it take to pay off my credit card?",
        answer:
          "Making only minimum payments on a $5,000 credit card balance at 20% APR would take about 25 years and cost over $7,000 in interest. Doubling your minimum payment could reduce that to about 3 years and save you thousands. Use a credit card payoff calculator to see how extra payments dramatically shorten your payoff timeline. Even an extra $50-$100 per month can make a huge difference.",
      },
    ],
    tax: [
      {
        question: "How do tax brackets work?",
        answer:
          "The U.S. uses a progressive tax system, meaning only the income within each bracket is taxed at that rate. For example, if you are single with $50,000 in taxable income in 2026, you do not pay 22% on all of it. You pay 10% on the first $11,925, 12% on income from $11,926 to $48,475, and 22% only on the remaining $1,525. Your effective tax rate (total tax divided by total income) ends up being much lower than your top bracket.",
      },
      {
        question: "Should I take the standard deduction or itemize?",
        answer:
          "For 2026, the standard deduction is $15,000 for single filers and $30,000 for married filing jointly. Itemize only if your total deductible expenses exceed these amounts. Common itemized deductions include mortgage interest, state and local taxes (capped at $10,000), charitable donations, and medical expenses exceeding 7.5% of your adjusted gross income. About 90% of taxpayers benefit from the standard deduction.",
      },
      {
        question: "What is the difference between a tax credit and a tax deduction?",
        answer:
          "A tax deduction reduces your taxable income, so the actual savings depends on your tax bracket. A $1,000 deduction saves $220 if you are in the 22% bracket. A tax credit directly reduces your tax bill dollar for dollar, so a $1,000 credit saves you exactly $1,000 regardless of your bracket. Some credits are refundable (you get the money even if you owe no tax), making them especially valuable for lower-income taxpayers.",
      },
      {
        question: "Do I need to make estimated tax payments?",
        answer:
          "You generally need to make quarterly estimated payments if you expect to owe at least $1,000 in federal tax that is not covered by withholding. This commonly applies to self-employed individuals, freelancers, landlords, and people with significant investment income. Payments are due in April, June, September, and January. To avoid penalties, pay at least 90% of the current year's tax or 100% of last year's tax (110% if your income exceeds $150,000).",
      },
      {
        question: "How are capital gains taxed?",
        answer:
          "Short-term capital gains (assets held one year or less) are taxed at your ordinary income tax rate, which can be as high as 37%. Long-term capital gains (assets held more than one year) receive preferential rates of 0%, 15%, or 20% depending on your taxable income. Most taxpayers pay the 15% rate. An additional 3.8% net investment income tax applies if your modified adjusted gross income exceeds $200,000 (single) or $250,000 (married filing jointly).",
      },
      {
        question: "What tax breaks are available for homeowners?",
        answer:
          "Homeowners can deduct mortgage interest on up to $750,000 of mortgage debt, property taxes (subject to the $10,000 SALT cap), and mortgage insurance premiums. When you sell your primary residence, you can exclude up to $250,000 in capital gains ($500,000 for married couples) if you have lived there for at least two of the last five years. These benefits only help if you itemize deductions rather than taking the standard deduction.",
      },
      {
        question: "How can I reduce my tax bill legally?",
        answer:
          "Maximize pre-tax retirement contributions (401(k), Traditional IRA, HSA), which reduce your taxable income. Harvest investment losses to offset gains. Time income and deductions strategically between tax years. Take advantage of education credits, child tax credits, and energy efficiency credits. If self-employed, deduct business expenses, health insurance premiums, and the employer portion of self-employment tax. Consider consulting a tax professional for personalized strategies.",
      },
      {
        question: "What is the AMT and could it affect me?",
        answer:
          "The Alternative Minimum Tax (AMT) is a parallel tax system that limits certain deductions and preferences. After the 2017 tax reform, far fewer people are affected, but it can still apply if you have high income combined with large state and local tax deductions, numerous dependents, or exercise incentive stock options (ISOs). The AMT exemption for 2026 is approximately $88,100 for single filers and $137,000 for married filing jointly.",
      },
    ],
    investing: [
      {
        question: "How does compound interest work?",
        answer:
          "Compound interest means you earn interest on both your original investment and on previously accumulated interest. For example, $10,000 invested at 8% earns $800 in the first year (growing to $10,800), then $864 in the second year (8% of $10,800), and so on. Over 30 years, that $10,000 grows to about $100,627, with over 90% of the final value coming from compounding rather than your original investment. The earlier you start, the more powerful this effect becomes.",
      },
      {
        question: "What is the difference between stocks and bonds?",
        answer:
          "Stocks represent ownership in a company, offering higher potential returns (historically 10% annually) but with greater volatility and risk. Bonds are loans you make to companies or governments, providing lower but more predictable returns (historically 5-6%) with less risk. Most financial advisors recommend a mix of both, with the ratio shifting from stocks toward bonds as you approach retirement. A common rule of thumb is to hold your age as a percentage in bonds.",
      },
      {
        question: "Should I invest in index funds or individual stocks?",
        answer:
          "For most investors, low-cost index funds are the better choice. They provide instant diversification across hundreds or thousands of companies, charge minimal fees, and historically outperform the majority of actively managed funds over long periods. Research shows that over 15 years, roughly 90% of actively managed funds underperform their benchmark index. If you enjoy stock picking, consider keeping no more than 5-10% of your portfolio in individual stocks.",
      },
      {
        question: "How much should I have in an emergency fund?",
        answer:
          "Financial experts recommend keeping 3-6 months of essential living expenses in a readily accessible savings account or money market fund. If you have variable income, are self-employed, or have only one household income, aim for 6-12 months. This money should not be invested in stocks because you may need it during a market downturn. High-yield savings accounts currently offer 4-5% APY, making them a good place to keep emergency funds.",
      },
      {
        question: "What is dollar-cost averaging?",
        answer:
          "Dollar-cost averaging (DCA) is the practice of investing a fixed amount at regular intervals regardless of market conditions. When prices are low, your fixed amount buys more shares; when prices are high, you buy fewer shares. This approach reduces the risk of investing a large sum at a market peak and removes the emotional temptation to time the market. Most 401(k) contributions are automatically dollar-cost averaged through payroll deductions.",
      },
      {
        question: "How do investment fees affect my returns?",
        answer:
          "Investment fees have a dramatic compounding effect on long-term returns. On a $100,000 portfolio earning 7% annually over 30 years, a 0.10% expense ratio results in about $724,000, while a 1.00% ratio leaves you with about $574,000, a difference of $150,000. That is why low-cost index funds with expense ratios of 0.03-0.20% are recommended over actively managed funds that often charge 0.50-1.50% or more.",
      },
      {
        question: "When should I start investing?",
        answer:
          "Start investing as soon as you have an emergency fund and have paid off high-interest debt. Even small amounts matter: investing just $200 per month starting at age 25, with an 8% average annual return, grows to about $700,000 by age 65. Waiting until age 35 to start with the same amount yields only about $300,000. Time in the market is far more important than timing the market.",
      },
      {
        question: "What is asset allocation and why does it matter?",
        answer:
          "Asset allocation is how you divide your investments among different asset classes like stocks, bonds, and cash. Studies show that asset allocation determines about 90% of a portfolio's return variability over time, making it the most important investment decision you will make. Your ideal allocation depends on your time horizon, risk tolerance, and financial goals. Younger investors with decades until retirement can typically hold a higher percentage in stocks.",
      },
    ],
    auto: [
      {
        question: "How much car can I afford?",
        answer:
          "A general guideline is that your total transportation costs (car payment, insurance, fuel, maintenance) should not exceed 15-20% of your take-home pay. Your monthly car payment specifically should be no more than 10-15% of your gross monthly income. For a $60,000 salary, that means a car payment of $500-$750 per month. Remember to factor in insurance, fuel, and maintenance when determining your true budget.",
      },
      {
        question: "Is it better to buy or lease a car?",
        answer:
          "Buying is generally cheaper in the long run, especially if you keep the car for 7-10 years after paying off the loan. Leasing offers lower monthly payments and a new car every 2-3 years, but you never build equity and face mileage limits and potential fees. Leasing can make sense if you drive under 12,000-15,000 miles per year, want to always have warranty coverage, or need a nicer car for business purposes.",
      },
      {
        question: "What loan term should I choose for a car?",
        answer:
          "Financial experts recommend 48-60 months maximum for a new car loan and 36-48 months for a used car. While 72 or 84-month loans offer lower monthly payments, they cost thousands more in interest and you risk being underwater (owing more than the car is worth) for much of the loan term. A shorter loan also forces you to buy a car you can truly afford rather than stretching your budget with extended payments.",
      },
      {
        question: "How much does a car depreciate over time?",
        answer:
          "New cars lose approximately 20-25% of their value in the first year and about 15% each additional year for the first five years. After five years, a car retains roughly 35-40% of its original value. This is why buying a 2-3 year old certified pre-owned vehicle can save you 30-40% compared to buying new while still getting a relatively modern car with warranty coverage.",
      },
      {
        question: "Should I refinance my car loan?",
        answer:
          "Refinancing makes sense if interest rates have dropped since you took out your loan, your credit score has improved significantly, or you need to lower your monthly payment. Generally, refinancing is worthwhile if you can reduce your rate by at least 1-2 percentage points and you have at least 12-24 months remaining on your loan. Check with your current lender, local credit unions, and online lenders to find the best rate.",
      },
      {
        question: "What is the true cost of owning a car?",
        answer:
          "According to AAA, the average annual cost of owning a new car is approximately $10,000-$12,000, including the car payment, insurance ($1,500-$2,500), fuel ($1,500-$3,000), maintenance ($500-$1,000), registration and taxes ($500-$800), and depreciation ($3,000-$5,000). Over 10 years of ownership, the total cost easily exceeds $80,000-$100,000. Understanding these costs helps you make informed decisions about which vehicle to purchase.",
      },
    ],
    insurance: [
      {
        question: "How much life insurance do I need?",
        answer:
          "A common rule of thumb is 10-15 times your annual income, but a more precise calculation considers your specific situation. Add up your debts (mortgage, loans), years of income replacement needed, future expenses (children's college, spouse's retirement), and final expenses. Then subtract existing savings and insurance. For example, a 35-year-old earning $80,000 with a mortgage and two young children might need $1-1.5 million in coverage.",
      },
      {
        question: "What is the difference between term and whole life insurance?",
        answer:
          "Term life insurance provides coverage for a specific period (10, 20, or 30 years) and is significantly cheaper, often 5-10 times less expensive than whole life. Whole life insurance covers you for your entire life and builds a cash value component, but comes with much higher premiums. For most families, term life insurance provides the most coverage per dollar. The cash value growth in whole life policies often underperforms compared to investing the premium difference in the market.",
      },
      {
        question: "Do I need life insurance if I am single?",
        answer:
          "If no one depends on your income, you may not need life insurance. However, there are some reasons to consider it: if you have cosigned debts that would fall to someone else, if you want to leave money to family or charity, or if you want to lock in low rates while you are young and healthy before you start a family. A small term policy taken out in your 20s is very affordable and can provide valuable coverage later.",
      },
      {
        question: "What does homeowners insurance cover?",
        answer:
          "Standard homeowners insurance (HO-3 policy) covers your home's structure, personal belongings, liability if someone is injured on your property, and additional living expenses if your home is uninhabitable. It typically covers perils like fire, theft, windstorms, and vandalism. Notable exclusions include flood damage, earthquake damage, and normal wear and tear. You may need separate flood or earthquake policies depending on your location.",
      },
      {
        question: "How much disability insurance do I need?",
        answer:
          "Aim for disability coverage that replaces 60-70% of your gross income. Since benefits from a policy you pay for with after-tax dollars are received tax-free, this replacement rate maintains a similar take-home income. Many employers offer short-term disability (covering 3-6 months) and some offer long-term disability. If your employer coverage is insufficient, supplement with an individual policy. Focus on long-term disability coverage, as short-term emergencies can often be handled with savings.",
      },
      {
        question: "What is an umbrella insurance policy?",
        answer:
          "An umbrella policy provides additional liability coverage beyond the limits of your homeowners and auto insurance. It kicks in when a claim exceeds your underlying policy limits. A $1 million umbrella policy typically costs $150-$300 per year and is recommended if your net worth exceeds your auto and home liability limits, you own rental property, have a pool or trampoline, or have teenage drivers. It protects your assets from lawsuits and large claims.",
      },
      {
        question: "How can I lower my insurance premiums?",
        answer:
          "Increase your deductibles (raising from $500 to $1,000 can save 10-25%), bundle policies with one insurer, maintain a good credit score, install safety devices (smoke detectors, security systems, anti-lock brakes), ask about available discounts (multi-policy, good driver, professional associations), review and update coverage annually to remove unnecessary riders, and shop around every 2-3 years to ensure competitive pricing.",
      },
      {
        question: "Do I need renters insurance?",
        answer:
          "Yes. Renters insurance is one of the most affordable and valuable insurance products available, typically costing $15-$30 per month. It covers your personal belongings against theft, fire, and other perils, provides liability protection if someone is injured in your apartment, and covers additional living expenses if your rental becomes uninhabitable. Your landlord's policy only covers the building structure, not your personal property.",
      },
    ],
    "real-estate": [
      {
        question: "What is a good cap rate for a rental property?",
        answer:
          "Cap rates vary significantly by market, property type, and condition. Generally, a cap rate of 5-10% is considered acceptable for residential rental properties. Higher cap rates (8-12%) indicate higher potential returns but often come with more risk or are in less desirable locations. Lower cap rates (3-5%) are typical in expensive markets where investors rely more on appreciation. Compare cap rates to other investment returns and local market averages to determine if a property is worth pursuing.",
      },
      {
        question: "How do I calculate cash flow on a rental property?",
        answer:
          "Cash flow equals total rental income minus all expenses. Expenses include mortgage payment (principal and interest), property taxes, insurance, property management (8-10% of rent), maintenance and repairs (5-10% of rent), vacancy allowance (5-10% of rent), HOA fees, and utilities if you pay them. Positive cash flow means the property generates income after all expenses. Aim for at least $100-$200 per unit per month in positive cash flow for a worthwhile investment.",
      },
      {
        question: "What is the 1% rule in real estate investing?",
        answer:
          "The 1% rule is a quick screening tool that suggests a rental property's monthly rent should be at least 1% of the purchase price. For example, a $200,000 property should rent for at least $2,000 per month. Properties meeting this threshold are more likely to generate positive cash flow. While useful for initial screening, this rule is a rough guide. Always perform a detailed analysis including all expenses, financing costs, and local market conditions before purchasing.",
      },
      {
        question: "Should I hire a property manager or self-manage?",
        answer:
          "Property managers typically charge 8-12% of monthly rent plus placement fees for finding tenants. Self-managing saves this cost but requires your time and availability. Consider hiring a manager if you own multiple properties, invest in a different city, have a demanding full-time job, or do not want to handle tenant issues. Many successful investors self-manage their first 1-3 properties to learn the business, then hire managers as their portfolio grows.",
      },
      {
        question: "What are the tax benefits of owning rental property?",
        answer:
          "Rental property offers several tax advantages: depreciation (deducting the building's cost over 27.5 years), mortgage interest deductions, deductions for operating expenses (repairs, insurance, property management, travel to properties), and the ability to use 1031 exchanges to defer capital gains when selling. The qualified business income (QBI) deduction may also apply. These benefits can significantly reduce or eliminate the tax owed on rental income.",
      },
      {
        question: "How much down payment do I need for an investment property?",
        answer:
          "Most lenders require 20-25% down for investment properties, compared to 3-20% for primary residences. You will also need cash reserves of 3-6 months of mortgage payments. Interest rates for investment properties are typically 0.5-0.75% higher than for primary residences. Some strategies to reduce the down payment include house hacking (living in one unit of a multi-family property), using FHA loans for owner-occupied multi-family properties, or BRRRR (Buy, Rehab, Rent, Refinance, Repeat).",
      },
      {
        question: "What is a 1031 exchange and how does it work?",
        answer:
          "A 1031 exchange allows you to defer capital gains taxes when you sell an investment property by reinvesting the proceeds into a like-kind property. You must identify a replacement property within 45 days and close within 180 days of selling. The exchange must be facilitated by a qualified intermediary who holds the funds. This strategy lets you continually trade up to larger properties while deferring taxes, potentially indefinitely. At death, heirs receive a stepped-up basis, potentially eliminating the deferred taxes entirely.",
      },
      {
        question: "How do I evaluate a real estate market for investing?",
        answer:
          "Key indicators of a strong rental market include population and job growth, low unemployment, diverse employment base (not dependent on one employer or industry), rising rents, low vacancy rates, and favorable landlord-tenant laws. Research median home prices relative to median rents to assess potential returns. Look at planned infrastructure, new businesses, and university presence. Avoid markets with declining populations, high crime rates, or over-reliance on a single industry.",
      },
    ],
  };

  return faqs[category] || faqs.investing;
}
