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