import { HomeInspectionAnalysis } from '@/types/inspection';
import { RedfinPropertyData } from '@/types/redfin';

export const demoAnalysis: HomeInspectionAnalysis = {
  propertyInfo: {
    address: "1234 Maple Street, Springfield, IL 62704",
    inspectionDate: "March 15, 2024"
  },
  issues: [
    {
      description: "Roof shingles showing signs of wear with several loose or missing shingles",
      location: "Main roof area over living room",
      priority: "high",
      estimatedCost: { min: 3500, max: 6500 },
      category: "Roofing",
      sourceQuote: "The roof has several loose shingles and granule loss. Recommend repair within 6 months."
    },
    {
      description: "HVAC system filter is dirty and ductwork shows minor leaks",
      location: "Basement mechanical room",
      priority: "medium",
      estimatedCost: { min: 800, max: 1500 },
      category: "HVAC",
      sourceQuote: "HVAC system operational but needs maintenance. Filter replacement and duct sealing recommended."
    },
    {
      description: "Electrical panel has outdated breakers, some circuits overloaded",
      location: "Basement electrical panel",
      priority: "high",
      estimatedCost: { min: 2200, max: 4000 },
      category: "Electrical",
      sourceQuote: "Electrical panel shows signs of age. Several circuits appear overloaded. Upgrade recommended."
    },
    {
      description: "Kitchen faucet has minor leak and low water pressure",
      location: "Kitchen sink",
      priority: "medium",
      estimatedCost: { min: 200, max: 450 },
      category: "Plumbing",
      sourceQuote: "Kitchen faucet dripping. Water pressure below optimal. Simple repair needed."
    },
    {
      description: "Basement has minor moisture issues and small crack in foundation wall",
      location: "Northeast basement wall",
      priority: "medium",
      estimatedCost: { min: 1200, max: 2800 },
      category: "Foundation",
      sourceQuote: "Minor foundation crack noted. Some moisture evidence. Monitor and seal as needed."
    },
    {
      description: "Bathroom exhaust fan is noisy and not functioning properly",
      location: "Master bathroom",
      priority: "low",
      estimatedCost: { min: 150, max: 300 },
      category: "Ventilation",
      sourceQuote: "Bathroom fan making noise and moving little air. Replacement recommended."
    },
    {
      description: "Deck railing has loose posts and needs refinishing",
      location: "Rear deck",
      priority: "medium",
      estimatedCost: { min: 600, max: 1200 },
      category: "Exterior",
      sourceQuote: "Deck shows wear from weather. Several railing posts loose. Refinishing needed."
    },
    {
      description: "Window caulking around several windows is cracked and needs replacement",
      location: "Living room and bedroom windows",
      priority: "low",
      estimatedCost: { min: 300, max: 600 },
      category: "Windows",
      sourceQuote: "Window caulking shows age and cracking. Re-caulking recommended for energy efficiency."
    }
  ],
  majorSystems: {
    roof: {
      condition: "Fair - needs attention",
      summary: "Asphalt shingle roof showing normal wear for age but requires maintenance",
      type: "Asphalt Shingles",
      age: "12 years",
      yearsLeft: "8-12 years",
      replacementCost: { min: 12000, max: 18000 },
      repairCost: { min: 1500, max: 3500 },
      maintenanceCosts: {
        fiveYear: { min: 1500, max: 2500 },
        tenYear: { min: 3500, max: 5500 }
      },
      anticipatedRepairs: {
        fiveYear: ["Shingle replacement", "Gutter cleaning", "Flashing repair"],
        tenYear: ["Partial roof replacement", "Ventilation upgrade", "Full gutter replacement"]
      }
    },
    electrical: {
      condition: "Fair - upgrade recommended",
      summary: "Electrical system functional but showing age, panel upgrade recommended",
      type: "Circuit Breaker Panel",
      age: "18 years",
      yearsLeft: "5-8 years",
      replacementCost: { min: 3500, max: 6000 },
      repairCost: { min: 800, max: 2200 },
      maintenanceCosts: {
        fiveYear: { min: 800, max: 1200 },
        tenYear: { min: 2000, max: 3500 }
      },
      anticipatedRepairs: {
        fiveYear: ["Panel upgrade", "GFCI outlet installation", "Circuit balancing"],
        tenYear: ["Full electrical modernization", "Smart home wiring", "EV charger preparation"]
      }
    },
    plumbing: {
      condition: "Good - minor maintenance needed",
      summary: "Plumbing system in good condition with minor fixtures needing attention",
      type: "Copper/PVC",
      age: "8 years",
      yearsLeft: "15-20 years",
      replacementCost: { min: 8000, max: 12000 },
      repairCost: { min: 300, max: 800 },
      maintenanceCosts: {
        fiveYear: { min: 600, max: 1000 },
        tenYear: { min: 1500, max: 2500 }
      },
      anticipatedRepairs: {
        fiveYear: ["Fixture repairs", "Water heater maintenance", "Drain cleaning"],
        tenYear: ["Water heater replacement", "Fixture upgrades", "Pipe insulation"]
      }
    },
    hvac: {
      condition: "Good - regular maintenance needed",
      summary: "HVAC system functioning well but requires regular maintenance",
      brand: "Carrier",
      type: "Central Air/Gas Furnace",
      age: "6 years",
      yearsLeft: "12-15 years",
      replacementCost: { min: 6000, max: 10000 },
      repairCost: { min: 400, max: 1200 },
      maintenanceCosts: {
        fiveYear: { min: 1200, max: 1800 },
        tenYear: { min: 2800, max: 4200 }
      },
      anticipatedRepairs: {
        fiveYear: ["Filter replacement", "Duct cleaning", "Coil maintenance"],
        tenYear: ["Compressor service", "Ductwork repair", "Thermostat upgrade"]
      }
    },
    foundation: {
      condition: "Good - monitor minor issues",
      summary: "Foundation structurally sound with minor cosmetic cracks to monitor",
      type: "Poured Concrete",
      age: "25 years",
      yearsLeft: "50+ years",
      replacementCost: { min: 25000, max: 40000 },
      repairCost: { min: 200, max: 600 },
      maintenanceCosts: {
        fiveYear: { min: 500, max: 800 },
        tenYear: { min: 1200, max: 2000 }
      },
      anticipatedRepairs: {
        fiveYear: ["Crack sealing", "Waterproofing touch-up", "Drainage maintenance"],
        tenYear: ["Foundation inspection", "Basement waterproofing", "Structural assessment"]
      }
    }
  },
  costSummary: {
    highPriorityTotal: { min: 5700, max: 10500 },
    mediumPriorityTotal: { min: 2800, max: 5950 },
    lowPriorityTotal: { min: 450, max: 900 },
    grandTotal: { min: 8950, max: 17350 }
  }
};

export const demoPropertyData: RedfinPropertyData = {
  soldDate: "2021-08-15",
  soldPrice: 285000,
  listedDate: "2021-07-20",
  listedPrice: 299000,
  bedrooms: 3,
  squareFeet: 1850,
  regionCode: "62704",
  neighborhoodAvgDaysOnMarket: 32,
  neighborhoodAvgSaleToListRatio: 0.97,
  nearbyHomesAvgSquareFeet: 1920
};

export const demoNegotiationStrategy = {
  quickReference: {
    recommendedAsk: { min: 12000, max: 17000 },
    strongPoints: [
      "Multiple high-priority electrical and roofing issues",
      "HVAC maintenance required immediately",
      "Foundation monitoring needed",
      "Total repair costs exceed typical buyer expectations"
    ]
  },
  phaseGuide: {
    initialResponse: [
      "Present inspection findings professionally with cost estimates",
      "Focus on safety-related electrical and roofing issues first",
      "Request $15,000 credit or equivalent repairs",
      "Emphasize that these are not cosmetic but functional issues"
    ],
    counterNegotiation: [
      "If seller counters low, separate immediate vs. future needs",
      "Minimum acceptable should cover high-priority items ($8,000-$10,000)",
      "Consider asking for seller to handle electrical work pre-closing",
      "Use comparable sales data to support your position"
    ],
    finalStrategy: [
      "Be prepared to walk away if safety issues aren't addressed",
      "Consider splitting costs on major systems (roof, electrical)",
      "Document any agreements about repair timelines",
      "Ensure all work is completed by licensed professionals"
    ]
  }
};
