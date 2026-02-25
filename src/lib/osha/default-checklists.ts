export interface OshaChecklistTemplate {
  title: string;
  standard: string;
  description: string;
  items: string[];
}

export const oshaChecklistTemplates: OshaChecklistTemplate[] = [
  {
    title: "Fall Protection",
    standard: "29 CFR 1926.501",
    description:
      "OSHA's #1 most cited construction standard. Required when workers are exposed to falls of 6 feet or more.",
    items: [
      "Guardrails installed on all open sides and edges above 6 feet",
      "Personal fall arrest systems (harness + lanyard) inspected before each use",
      "Anchorage points rated for 5,000 lbs per worker",
      "Floor holes and openings covered, secured, and labeled",
      "Safety nets installed where other fall protection is not feasible",
      "Leading edge work has controlled access zones marked",
      "Workers trained on fall protection within the last 12 months",
      "Fall protection plan available on site for reference",
    ],
  },
  {
    title: "Scaffolding",
    standard: "29 CFR 1926.451",
    description:
      "Second most cited standard. Covers all scaffolds used in construction including supported, suspended, and mobile.",
    items: [
      "Scaffold erected on firm, level foundation (mudsills or base plates)",
      "Guardrails, midrails, and toeboards on all open sides above 10 feet",
      "Scaffold platforms fully planked (no gaps over 1 inch)",
      "Safe access provided (ladder, stair tower, or ramp)",
      "Scaffold inspected by competent person before each shift",
      "Cross-bracing and tie-ins properly installed",
      "No scaffold loaded beyond its rated capacity",
      "Scaffold at least 10 feet from power lines (or de-energized)",
    ],
  },
  {
    title: "Ladders",
    standard: "29 CFR 1926.1053",
    description:
      "Third most cited. Covers all ladder use on construction sites — portable, fixed, and job-made.",
    items: [
      "Ladder extends at least 3 feet above the landing surface",
      "Ladder set at proper 4-to-1 angle (1 foot out per 4 feet up)",
      "Ladder secured at top to prevent displacement",
      "Side rails and rungs free of damage, grease, and debris",
      "No metal ladders used near exposed electrical",
      "Ladder rated for the load (worker + materials)",
      "Workers maintain 3 points of contact while climbing",
      "Defective ladders tagged out of service and removed",
    ],
  },
  {
    title: "Electrical Safety",
    standard: "29 CFR 1926.405",
    description:
      "Covers temporary wiring, GFCI protection, and electrical installation on construction sites.",
    items: [
      "GFCI protection on all temporary 120V circuits",
      "Extension cords inspected — no damage, proper grounding",
      "Temporary power panels labeled, closed, and accessible",
      "No exposed live parts within reach of workers",
      "Lockout/tagout procedures posted and followed",
      "Electrical equipment rated for the environment (wet/dry)",
      "Flexible cords not used as fixed wiring substitute",
      "Qualified electrician performs all electrical work",
    ],
  },
  {
    title: "Head Protection",
    standard: "29 CFR 1926.100",
    description:
      "Hard hat requirements for all areas where falling objects, overhead hazards, or electrical contact exists.",
    items: [
      "Hard hats worn in all areas with overhead hazards",
      "Hard hats free from cracks, dents, and modifications",
      "Suspension system intact and properly adjusted",
      "Class E or G hard hat used based on electrical exposure",
      "Hard hat replaced after any significant impact",
      "No unapproved attachments drilled or glued to shell",
      "Hard hats stored away from sunlight and chemicals when not in use",
    ],
  },
  {
    title: "Hazard Communication",
    standard: "29 CFR 1926.59 / 1910.1200",
    description:
      "Right-to-know standard. All chemicals on site must be identified, labeled, and communicated to workers.",
    items: [
      "Written HazCom program available on site",
      "Safety Data Sheets (SDS) accessible for all chemicals on site",
      "All chemical containers properly labeled (GHS format)",
      "Workers trained on chemical hazards they may encounter",
      "Proper PPE available for chemical handling (gloves, goggles, respirator)",
      "Secondary containers labeled with product name and hazards",
      "Chemical inventory list current and complete",
      "Emergency procedures posted for chemical spills",
    ],
  },
  {
    title: "Excavations",
    standard: "29 CFR 1926.651",
    description:
      "Required for any trench or excavation. Cave-ins are among the most deadly construction hazards.",
    items: [
      "Competent person inspected excavation before entry",
      "Protective system in place: sloping, benching, shoring, or shield",
      "Spoil pile set back at least 2 feet from trench edge",
      "Means of egress (ladder, ramp, stairs) within 25 feet of travel",
      "Underground utilities located and marked before digging (811 called)",
      "Water accumulation monitored and controlled",
      "Heavy equipment kept away from trench edge",
      "Atmosphere tested in excavations deeper than 4 feet (if hazard exists)",
      "Daily inspections documented by competent person",
    ],
  },
  {
    title: "Stairways",
    standard: "29 CFR 1926.1052",
    description:
      "Stairway requirements for construction sites — temporary and permanent stairs, landings, and handrails.",
    items: [
      "Stairways with 4 or more risers have handrails",
      "Handrail height between 30 and 37 inches",
      "Stair treads have non-slip surface",
      "Uniform riser height and tread depth throughout",
      "Landings provided at every 12 feet of vertical rise",
      "Stairways adequately lit",
      "No obstructions on stairs or landings",
      "Temporary stairs have proper guardrails on open sides",
    ],
  },
  {
    title: "Eye and Face Protection",
    standard: "29 CFR 1926.102",
    description:
      "Required wherever workers are exposed to flying particles, molten metal, chemicals, or harmful light.",
    items: [
      "Safety glasses or goggles worn during cutting, grinding, and drilling",
      "Face shields used for operations with splash or flying debris risk",
      "Welding helmets with proper shade lens for the process",
      "Eye protection meets ANSI Z87.1 standard",
      "Side shields installed on safety glasses where required",
      "Eye wash station accessible within 10 seconds of chemical use areas",
      "Prescription safety glasses provided where needed",
    ],
  },
  {
    title: "Personal Protective Equipment",
    standard: "29 CFR 1926.95",
    description:
      "General PPE requirements. Employer must assess hazards and provide appropriate protective equipment at no cost.",
    items: [
      "PPE hazard assessment completed and documented for the site",
      "High-visibility vests worn in vehicle traffic areas",
      "Hearing protection provided in areas above 85 dB",
      "Gloves appropriate for the task (cut-resistant, chemical, etc.)",
      "Steel-toe or safety-toe footwear worn on site",
      "Respiratory protection available and fit-tested where required",
      "All PPE properly fitted and in good condition",
      "Workers trained on proper use and limitations of PPE",
    ],
  },
];
