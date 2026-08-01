// ===============================
// Risk Registration Dropdown Data
// ===============================


const riskCategories = {

  InternalFraud: {

    "Unauthorized Activity": [
      "Transactions not reported (intentional)",
      "Transaction type unauthorized (monetary loss)",
      "Mismarking of position (intentional)"
    ],

    "Theft and Fraud": [
      "Fraud / worthless deposits",
      "Theft / extortion / embezzlement / robbery",
      "Misappropriation of assets",
      "Malicious destruction of assets",
      "Forgery",
      "Check kiting",
      "Account take-over / impersonation",
      "Tax non-compliance / evasion (willful)",
      "Bribes / kickbacks",
      "Insider trading (not on firm's account)"
    ]

  },

  ExternalFraud: {

    "Theft and Fraud": [
      "Theft / Robbery",
      "Forgery",
      "Check kiting"
    ],

    "Systems Security": [
      "Hacking damage",
      "Theft of information (monetary loss)"
    ]

  },

  EmploymentPractices: {

    "Employee Relations": [
      "Compensation, benefit, termination issues"
    ],

    "Safe Environment": [
      "General liability",
      "Employee health & safety events",
      "Workers compensation"
    ],

    "Diversity & Discrimination": [
      "All discrimination types"
    ]

  },

  ClientsProducts: {

    "Suitability, Disclosure & Fiduciary": [
      "Fiduciary breaches/ guideline violations",
      "Suitability / disclosure issues(KYC)",
      "Retail customer disclosure violations",
      "Breach of privacy",
      "Aggressive sales",
      "Account churning",
      "Misuse of confidential information",
      "Lender liability"
    ],

    "Improper Business or Market Practices": [
      "Antitrust",
      "Improper trade / market practices",
      "Market manipulation",
      "Insider trading(on bank's account)",
      "Unlicensed activity",
      "Money laundering"
    ],

    "Product Flaws": [
      "Product defects(unauthorized)",
      "Model errors"
    ],

    "Selection, Sponsorship & Exposure": [
      "Failure to investigate client per guidelines",
      "Exceeding client exposure limits"
    ],

    "Advisory Activities": [
      "Disputes overperformance of advisory activities"
    ]

  },

  DamageToPhysicalAssets: {

    "Disasters and Other Events": [
      "Natural disaster losses",
      "Human losses from external sources (terrorism, vandalism)",
      "Vandalism"
    ]

  },

  BusinessDisruption: {

    "Systems": [
      "Hardware",
      "Software",
      "Telecommunications",
      "Utility outage / disruptions"
    ]

  },

  ExecutionDelivery: {

    "Transaction Capture, Execution & Maintenance": [
      "Miscommunication",
      "Data entry,maintenance or loading error",
      "Missed deadline or responsibility",
      "Model / system miss operation",
      "Accounting error/entity attribution error",
      "Other task miss performance",
      "Delivery failure",
      "Collateral management failure",
      "Reference data maintenance failure"
    ],

    "Monitoring and Reporting": [
      "Failed mandatory reporting obligation",
      "Inaccurate external report (loss incurred)"
    ],

    "Customer Intake and Documentation": [
      "Client permissions / disclaimers missing",
      "Legal documents missing / incomplete"
    ],

    "Customer / Client Account Management": [
      "Unapproved access given to accounts",
      "Incorrect client records",
      "Negligent loss or damage of client assets"
    ],

    "Trade Counterparties": [
      "Non-client counterparty mis-performance",
      "Non-client counterparty disputes"
    ],

    "Vendors & Suppliers": [
      "Outsourcing dispute",
      "Vendor disputes"
    ]

  }

};

const Probabilities = [
    { value: "Rare", text: "Rare", score: 1 },
    { value: "Unlikely", text: "Unlikely", score: 2 },
    { value: "Possible", text: "Possible", score: 3 },
    { value: "Likely", text: "Likely", score: 4 },
    { value: "AlmostCertain", text: "Almost Certain", score: 5 }
];

const Causes = [
  { value: "AbsenceOfInternalControl", text: "Absence Of Internal Control" },
  { value: "AbuseOfAuthority", text: "Abuse Of Authority" },
  { value: "AbuseOfAuthorityAndWorkLoad", text: "Abuse Of Authority & Work Load" },
  { value: "AbuseOfAuthorityAndNegligence", text: "Abuse Of Authority And Negligence" },
  { value: "AbuseOfAuthorityAndPoorInternalControl", text: "Abuse Of Authority And Poor Internal Control" },
  { value: "CompetencyGap", text: "Competency Gap" },
  { value: "CompetencyGapAndPoorInternalControl", text: "Competency Gap And Poor Internal Control" },
  { value: "EmployeeDissatisfaction", text: "Employee Dissatisfaction" },
  { value: "InadequateFacility", text: "Inadequate Facility" },
  { value: "Negligence", text: "Negligence" },
  { value: "NegligenceAndCompetencyGap", text: "Negligence & Competency Gap" },
  { value: "NegligenceAndInadequateFacility", text: "Negligence & Inadequate Facility" },
  { value: "NegligenceAndWorkLoad", text: "Negligence & Work Load" },
  { value: "PoorInternalControl", text: "Poor Internal Control" },
  { value: "PoorInternalControlAndAbuseOfAuthority", text: "Poor Internal Control & Abuse Of Authority" },
  { value: "SystemIrregularity", text: "System Irregularity" },
  { value: "SystemIrregularityAndInadequateFacility", text: "System Irregularity And Inadequate Facility" },
  { value: "WorkLoad", text: "Work Load" }
];


const Effects = [
  { value: "Compliance", text: "Compliance" },
  { value: "Legal", text: "Legal" },
  { value: "Financial", text: "Financial" },
  { value: "Reputational", text: "Reputational" },
  { value: "ComplianceAndLegal", text: "Compliance And Legal" },
  { value: "ComplianceAndReputational", text: "Compliance And Reputational" },
  { value: "ComplianceAndFinancial", text: "Compliance And Financial" },
  { value: "ReputationalAndCompliance", text: "Reputational And Compliance" },
  { value: "ReputationalAndFinancial", text: "Reputational And Financial" },
  { value: "ReputationalAndLegal", text: "Reputational And Legal" },
  { value: "FinancialAndLegal", text: "Financial And Legal" },
  { value: "FinancialAndReputational", text: "Financial And Reputational" },
  { value: "FinancialAndCompliance", text: "Financial And Compliance" },
  { value: "LegalAndReputational", text: "Legal And Reputational" },
  { value: "LegalAndFinancial", text: "Legal And Financial" },
  { value: "LegalAndCompliance", text: "Legal And Compliance" }
];

const IdentifiedRisks = [
  { value: "DomesticBanking", text: "Domestic Banking" },
  { value: "CreditOperation", text: "Credit Operation" },
  { value: "InternationalBanking", text: "International Banking" },
  { value: "InvestmentPortfolio", text: "Investment Portfolio" },
  { value: "ComplianceRegulatory", text: "Compliance & Regulatory" }
];


const RiskSources = [
  { value: "InternalFraud", text: "Internal Fraud" },
  { value: "ExternalFraud", text: "External Fraud" },
  { value: "EmploymentWorkplaceSafety", text: "Employment & Workplace Safety" },
  { value: "PropertyDamage", text: "Property Damage" },
  { value: "SystemFailureBusinessDisruption", text: "System Failure & Business Disruption" },
  { value: "ProcessManagementExecution", text: "Process Management & Execution" },
  { value: "CustomerProductRisk", text: "Customer & Product Risk" }
];


const RiskCategories = [
  { value: "AbsenceofInternalControl", text: "Absence of Internal Control" },
  { value: "AbuseofAuthority", text: "Abuse of Authority" },
  { value: "EmploymentWorkplaceSafety", text: "Employment & Workplace Safety" },
  { value: "PropertyDamage", text: "Property Damage" },
  { value: "SystemFailureBusinessDisruption", text: "System Failure & Business Disruption" },
  { value: "ProcessManagementExecution", text: "Process Management & Execution" },
  { value: "CustomerProductRisk", text: "Customer & Product Risk" }
];


const ImpactLevels = [
    { value: "VeryLow", text: "Very Low", score: 1 },
    { value: "Low", text: "Low", score: 2 },
    { value: "Medium", text: "Medium", score: 3 },
    { value: "High", text: "High", score: 4 },
    { value: "VeryHigh", text: "Very High", score: 5 }
];


const RiskRatings = [
  { value: "Low", text: "Low" },
  { value: "Medium", text: "Medium" },
  { value: "High", text: "High" },
  { value: "Extreme", text: "Extreme" }
];


const ResidualRiskLevels = [
  { value: "Low", text: "Low" },
  { value: "Medium", text: "Medium" },
  { value: "High", text: "High" },
  { value: "Extreme", text: "Extreme" }
];


const MitigationRatings = [
  { value: "VeryWeak", text: "Very Weak" },
  { value: "Weak", text: "Weak" },
  { value: "Moderate", text: "Moderate" },
  { value: "Strong", text: "Strong" },
  { value: "VeryStrong", text: "Very Strong" }
];

const RiskMatrix = {

    Rare: {
        VeryLow: "Very Low",
        Low: "Very Low",
        Medium: "Low",
        High: "Low",
        VeryHigh: "Medium"
    },

    Unlikely: {
        VeryLow: "Very Low",
        Low: "Low",
        Medium: "Medium",
        High: "Medium",
        VeryHigh: "High"
    },

    Possible: {
        VeryLow: "Low",
        Low: "Medium",
        Medium: "Medium",
        High: "High",
        VeryHigh: "High"
    },

    Likely: {
        VeryLow: "Low",
        Low: "Medium",
        Medium: "High",
        High: "High",
        VeryHigh: "Very High"
    },

    AlmostCertain: {
        VeryLow: "Medium",
        Low: "Medium",
        Medium: "Medium",
        High: "Very High",
        VeryHigh: "Very High"
    }

};

// Populate Category

const categorySelect = document.getElementById("RiskCategory");
const subCategorySelect = document.getElementById("RiskSubCategory");
const eventSelect = document.getElementById("RiskEvent");

Object.keys(riskCategories).forEach(category => {

  categorySelect.innerHTML += `
        <option value="${category}">
            ${category}
        </option>
    `;

});

categorySelect.addEventListener("change", function () {

  subCategorySelect.innerHTML =
    '<option value="">Select Sub Category</option>';

  eventSelect.innerHTML =
    '<option value="">Select Risk Event</option>';

  eventSelect.disabled = true;

  if (!this.value) {

    subCategorySelect.disabled = true;
    return;

  }

  subCategorySelect.disabled = false;

  Object.keys(riskCategories[this.value]).forEach(sub => {

    subCategorySelect.innerHTML += `
            <option value="${sub}">
                ${sub}
            </option>
        `;

  });

});

subCategorySelect.addEventListener("change", function () {

  eventSelect.innerHTML =
    '<option value="">Select Risk Event</option>';

  if (!this.value) {

    eventSelect.disabled = true;
    return;

  }

  eventSelect.disabled = false;

  riskCategories[categorySelect.value][this.value].forEach(event => {

    eventSelect.innerHTML += `
            <option value="${event}">
                ${event}
            </option>
        `;

  });

});

const identifiedRiskSelect = document.getElementById("IdentifiedRisk");

IdentifiedRisks.forEach(risk => {

  identifiedRiskSelect.add(
    new Option(risk.text, risk.value)
  );

});
const sourceOfRiskSelect = document.getElementById("SourceOfRisk");

RiskSources.forEach(source => {

  sourceOfRiskSelect.add(
    new Option(source.text, source.value)
  );

});

const effectSelect = document.getElementById("Effect");

Effects.forEach(effect => {

  effectSelect.add(
    new Option(
      effect.text,
      effect.value
    )
  );

});
const probabilitySelect = document.getElementById("Probability");

Probabilities.forEach(probability => {

  probabilitySelect.add(
    new Option(
      probability.text,
      probability.value
    )
  );

});

const impactSelect = document.getElementById("ImpactLevel");


ImpactLevels.forEach(level => {

  impactSelect.add(
    new Option(
      level.text,
      level.value
    )
  );

});

const mitigationSelect  = document.getElementById("MitigationRating");


MitigationRatings.forEach(level => {

  mitigationSelect.add(
    new Option(
      level.text,
      level.value
    )
  );

});





const badge = document.getElementById("RiskRatingBadge");

function updateRiskRating() {

    const probability = probabilitySelect.value;
    const impact = impactSelect.value;

    if (!probability || !impact) {

        badge.className = "badge fs-6 px-4 py-3 rounded-pill bg-secondary";
        badge.textContent = "Select Probability & Impact";
        return;
    }

    const rating = RiskMatrix[probability][impact];

    badge.className = "badge fs-6 px-4 py-3 rounded-pill risk-badge";

    switch (rating) {

        case "Very Low":
            badge.classList.add("risk-very-low");
            break;

        case "Low":
            badge.classList.add("risk-low");
            break;

        case "Medium":
            badge.classList.add("risk-medium");
            break;

        case "High":
            badge.classList.add("risk-high");
            break;

        case "Very High":
            badge.classList.add("risk-very-high");
            break;
    }

    badge.textContent = rating;
}

probabilitySelect.addEventListener("change", updateRiskRating);
impactSelect.addEventListener("change", updateRiskRating);