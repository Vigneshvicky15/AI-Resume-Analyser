const axios = require('axios');

/**
 * Highly comprehensive and dynamic local NLP analyzer that reads the actual resume text and job description
 * to generate personalized, field-specific ATS optimization.
 * Supports 10 fields: Software/IT, Mechanical, Civil, ECE/EEE, MBA/Business, Data Science, Healthcare, Finance, Marketing, General.
 */
const smartLocalAnalyzer = (resumeText, jobDescription = '') => {
  const text = resumeText.toLowerCase();
  const jd = jobDescription.toLowerCase();

  // ========================
  // STEP 1: Domain & Field Dictionaries
  // ========================
  const domainProfiles = {
    software: {
      name: 'Software / IT',
      keywords: ['javascript', 'python', 'react', 'node', 'express', 'mongodb', 'sql', 'api', 'github', 'git', 'docker', 'html', 'css', 'typescript', 'angular', 'vue', 'spring', 'java', 'c++', 'golang', 'rust', 'flutter', 'kotlin', 'swift', 'backend', 'frontend', 'full stack', 'fullstack', 'devops', 'ci/cd', 'aws', 'azure', 'linux', 'agile', 'scrum', 'rest api', 'graphql', 'microservices', 'kubernetes', 'cloud', 'deployment', 'saas', 'software developer', 'web developer'],
      skills: ['React', 'Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'JavaScript', 'TypeScript', 'Python', 'Java', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'REST APIs', 'GraphQL', 'Microservices', 'CI/CD Pipelines', 'Git', 'GitHub', 'Agile Methodology', 'Scrum', 'HTML5/CSS3', 'Linux', 'Unit Testing', 'System Design'],
      softSkills: ['Problem Solving', 'Team Collaboration', 'Agile Communication', 'Technical Writing', 'Time Management'],
      verbs: ['Engineered', 'Architected', 'Refactored', 'Automated', 'Deployed', 'Optimized', 'Integrated', 'Streamlined', 'Debugged', 'Slashed'],
      metrics: ['Reduced API latency by X%', 'Scaled user traffic capacity by X%', 'Automated deployments, saving X hours/week', 'Boosted unit test coverage to X%'],
      bulletTemplates: {
        entry: [
          {
            before: "Worked on coding the frontend web pages using React.",
            after: "Engineered 12+ responsive frontend pages using React and Tailwind CSS, improving core web vitals and reducing page-load time by 28%.",
            rationale: "Replaced passive phrasing with the active verb 'Engineered' and added a clear performance optimization metric."
          },
          {
            before: "Responsible for writing backend APIs and connecting databases.",
            after: "Architected 8 RESTful API endpoints using Node.js and Express, integrating MongoDB indexes to cut request response latencies by 35%.",
            rationale: "Uses strong verb 'Architected' and highlights database index optimization to show solid backend proficiency."
          },
          {
            before: "Helped test and debug the team's software application.",
            after: "Automated test suites using Jest and Supertest, expanding code coverage by 24% and identifying 15+ blocking bugs prior to deployment.",
            rationale: "Shows initiative by shifting from manual 'helped test' to 'Automated test suites' with clear coverage expansion metrics."
          }
        ],
        mid: [
          {
            before: "Maintained software updates and deployed apps to cloud.",
            after: "Orchestrated CI/CD pipelines using GitHub Actions and Docker, reducing deployment cycle times by 40% and ensuring 99.9% uptime on AWS EC2.",
            rationale: "Demonstrates cloud automation expertise using active verbs and critical business uptime KPIs."
          },
          {
            before: "Lead the migration of legacy code to modern React framework.",
            after: "Refactored legacy monolith frontend into a clean React-TypeScript architecture, accelerating feature delivery times by 30% for the design team.",
            rationale: "Shows architectural impact and cross-team productivity gains rather than just technical replacement."
          },
          {
            before: "Helped optimize database query performance.",
            after: "Optimized sluggish SQL query executions and normalized schemas, slashing peak-load CPU utilization by 45% and eliminating connection timeouts.",
            rationale: "Demonstrates heavy database tuning ability with measurable hardware load reduction statistics."
          }
        ],
        senior: [
          {
            before: "Managed a team of developers to build new features.",
            after: "Spearheaded a cross-functional squad of 6 developers, delivering a core SaaS module that generated $150K ARR within the first quarter.",
            rationale: "Shows executive leadership, ownership of high-value business modules, and concrete financial ARR growth."
          },
          {
            before: "Responsible for microservices architecture and scalability.",
            after: "Architected a scalable microservices structure on Kubernetes, migrating 4 legacy databases and boosting system concurrency capacity by 250%.",
            rationale: "Demonstrates master-level architectural vision, data migration capability, and system scalability metrics."
          },
          {
            before: "Met with business stakeholders and designed system roadmaps.",
            after: "Formulated technical product roadmaps in alignment with product management, saving $45K in annual infrastructure costs by deprecating underutilized cloud instances.",
            rationale: "Balances technical direction with strategic cost-management and executive-level alignment."
          }
        ]
      }
    },
    mechanical: {
      name: 'Mechanical Engineering',
      keywords: ['cad', 'solidworks', 'autocad', 'catia', 'ansys', 'thermodynamics', 'fluid mechanics', 'manufacturing', 'cnc', 'gd&t', 'fea', 'cfd', 'material science', '3d printing', 'mechanical design', 'tolerance', 'assembly', 'hvac', 'machining', 'robotics', 'kinematics', 'heat transfer', 'hydraulics', 'pneumatics', 'drafting'],
      skills: ['SolidWorks', 'AutoCAD', 'ANSYS FEA', 'GD&T (ASME Y14.5)', 'CNC Programming', 'CFD Analysis', 'Material Selection', 'HVAC Design', 'Tolerance Stackup', 'Prototyping', '3D Printing', 'Structural Analysis', 'DFM (Design for Manufacturing)', 'Hydraulics & Pneumatics', 'DFMA'],
      softSkills: ['Analytical Thinking', 'Cross-functional Collaboration', 'Root Cause Analysis', 'Project Management', 'Vendor Relations'],
      verbs: ['Designed', 'Fabricated', 'Simulated', 'Calibrated', 'Drafted', 'Standardized', 'Optimized', 'Evaluated', 'Streamlined', 'Tested'],
      metrics: ['Reduced material waste by X%', 'Improved assembly efficiency by X%', 'Cut prototype fabrication costs by X%', 'Ensured GD&T tolerances within X mm'],
      bulletTemplates: {
        entry: [
          {
            before: "Made CAD models for mechanical parts in SolidWorks.",
            after: "Designed 15+ intricate 3D CAD models and production-ready drawings in SolidWorks, applying tight GD&T tolerances to ensure perfect assembly fits.",
            rationale: "Injects professional engineering standards like 'GD&T tolerances' and highlights productivity volume."
          },
          {
            before: "Helped run simulation stress tests on prototypes.",
            after: "Simulated finite element analysis (FEA) using ANSYS on structural frames, identifying high-stress concentration points and reducing material mass by 12% without sacrificing safety.",
            rationale: "Demonstrates theoretical knowledge applied practically to save material cost while maintaining structural safety."
          },
          {
            before: "Assisted in the maintenance of CNC manufacturing machines.",
            after: "Calibrated high-precision CNC mills and lathes, cutting downtime by 15% and maintaining part dimensions within +/- 0.05mm tolerances.",
            rationale: "Specifies engineering precision and operational efficiency metrics."
          }
        ],
        mid: [
          {
            before: "Designed mechanical components and worked with manufacturers.",
            after: "Optimized part designs using DFM (Design for Manufacturing) guidelines, cutting vendor fabrication costs by 22% and reducing assembly steps from 9 to 5.",
            rationale: "Shows business acumen (cutting costs) and assembly streamlined designs using industry DFM methodologies."
          },
          {
            before: "Ran HVAC design projects for commercial buildings.",
            after: "Designed and calculated energy-efficient HVAC duct networks for a 15,000 sq ft office space, reducing projected monthly energy bills by 18%.",
            rationale: "Highlights large-scale system planning with green energy and cost saving outcomes."
          },
          {
            before: "Did thermal analysis on electronic packages.",
            after: "Analyzed convective heat transfer in enclosure packaging using CFD modeling, implementing a custom heat-sink design that reduced CPU operating temperatures by 14°C.",
            rationale: "Shows engineering thermal simulation proficiency with direct performance outcome measurements."
          }
        ],
        senior: [
          {
            before: "Led the mechanical design team for new automotive parts.",
            after: "Spearheaded a team of 4 engineers in design of advanced automotive suspension units, securing 2 international design patents and cutting weight by 15%.",
            rationale: "Shows top-tier leadership, patent security, and advanced engineering structural success."
          },
          {
            before: "Managed manufacturing lines and set factory standards.",
            after: "Directed a major tooling overhaul for a high-volume manufacturing line, boosting throughput by 28% and achieving a Six Sigma defect level of less than 3.4 DPMO.",
            rationale: "Expresses deep manufacturing execution, high QA standards (Six Sigma), and massive line throughput gains."
          },
          {
            before: "Negotiated with vendors and selected materials for projects.",
            after: "Re-negotiated global raw steel supply agreements and optimized material selections, slashing annual material acquisition overheads by $80K.",
            rationale: "Emphasizes senior strategic vendor management and massive bottom-line savings."
          }
        ]
      }
    },
    civil: {
      name: 'Civil Engineering',
      keywords: ['structural', 'construction', 'autocad', 'revit', 'etabs', 'staad', 'concrete', 'reinforcement', 'surveying', 'geotechnical', 'transportation', 'estimation', 'project management', 'building codes', 'site inspection', 'foundation', 'drainage', 'estimating', 'billing', 'quantity takeoff', 'tender', 'mxe', 'safeway'],
      skills: ['AutoCAD Civil 3D', 'Revit Structure', 'STAAD.Pro', 'ETABS', 'Quantity Takeoff', 'Structural Design', 'Foundation Engineering', 'Geotechnical Surveying', 'Project Estimation', 'Billing & Bar Bending Schedules (BBS)', 'Building Codes (IBC/IS)', 'Site Safety Auditing', 'Land Surveying', 'MS Project', 'Tender Documentation'],
      softSkills: ['Contract Negotiation', 'Site Leadership', 'Safety Consciousness', 'Regulatory Compliance', 'Problem Solving'],
      verbs: ['Supervised', 'Estimated', 'Modeled', 'Inspected', 'Coordinated', 'Constructed', 'Designed', 'Approved', 'Audited', 'Slashed'],
      metrics: ['Managed projects worth $X Million', 'Completed construction X weeks ahead of schedule', 'Reduced structural concrete cost by X%', 'Maintained 100% zero-accident safety records'],
      bulletTemplates: {
        entry: [
          {
            before: "Drew site plans and drafting designs in AutoCAD.",
            after: "Drafted 20+ comprehensive architectural and structural layouts in AutoCAD, adhering to strict local municipal building codes.",
            rationale: "Replaces simple drawing with 'Drafted structural layouts' and references code compliance."
          },
          {
            before: "Helped calculate materials needed for construction projects.",
            after: "Conducted quantity takeoffs and material estimations for a 4-story residential project, estimating material costs within a 3% margin of actual spend.",
            rationale: "Highlights precision in cost estimation which is crucial for entry-level civil estimators."
          },
          {
            before: "Went to construction site to inspect the work.",
            after: "Supervised daily steel reinforcement layouts and concrete pours, ensuring compliance with design specifications and structural drawings.",
            rationale: "Shows active supervisory field role rather than passive observation."
          }
        ],
        mid: [
          {
            before: "Designed building structures and analyzed columns.",
            after: "Modeled and analyzed complex concrete frames in STAAD.Pro, optimizing beam-column reinforcement ratios and reducing rebar expenses by 14%.",
            rationale: "Demonstrates cost optimization on key materials (rebar) using industry-standard computational tools."
          },
          {
            before: "Managed the subcontractors and construction schedule.",
            after: "Coordinated 5 distinct subcontractor groups on site using MS Project, completing foundation works 2 weeks ahead of schedule and within budget.",
            rationale: "Shows schedule mastery, subcontractor leadership, and direct schedule acceleration results."
          },
          {
            before: "Checked site safety and handled paperwork.",
            after: "Enforced OSHA safety guidelines and initiated weekly toolbox talks, achieving 180 consecutive accident-free days on site.",
            rationale: "Highlights high safety standards and active regulatory enforcement, key for project execution."
          }
        ],
        senior: [
          {
            before: "In charge of big construction projects and budgets.",
            after: "Spearheaded construction of a $12M mixed-use high-rise development, leading 40+ site staff and completing project 25 days ahead of contract timeline.",
            rationale: "Highlights massive budget responsibility ($12M), large-scale leadership, and impressive time-to-market margins."
          },
          {
            before: "Met with government authorities and secured approvals.",
            after: "Negotiated and obtained regulatory environmental and zoning clearance approvals from municipal corporations for a 10-acre commercial park layout.",
            rationale: "Shows senior diplomatic/legal clearance abilities which prevent costly legal bottlenecks."
          },
          {
            before: "Managed engineering design reviews and tenders.",
            after: "Directed structural design reviews and bid evaluations, saving $140K in construction budgets through smart value-engineering alternatives.",
            rationale: "Presents senior-level value-engineering expertise saving substantial developer funds."
          }
        ]
      }
    },
    ece_eee: {
      name: 'ECE / EEE / Embedded Systems',
      keywords: ['circuit', 'pcb', 'vhdl', 'verilog', 'embedded', 'microcontroller', 'arduino', 'raspberry pi', 'plc', 'scada', 'power systems', 'signal processing', 'iot', 'fpga', 'matlab', 'simulink', 'control systems', 'vlsi', 'analog', 'digital', 'firmware', 'multisim', 'oscilloscope', 'soldering'],
      skills: ['Embedded C/C++', 'PCB Layout (Altium Designer/KiCad)', 'Verilog/VHDL', 'FPGA Design', 'MATLAB/Simulink', 'Microcontrollers (ARM Cortex, PIC, AVR)', 'RTOS (FreeRTOS)', 'I2C/SPI/UART Protocols', 'PLC Programming (Siemens/Allen-Bradley)', 'Circuit Simulation (LTspice)', 'Analog & Digital Design', 'RF Testing', 'Power Electronics', 'SCADA Systems', 'LabVIEW'],
      softSkills: ['Hardware Troubleshooting', 'Analytical Thinking', 'Cross-functional Collaboration', 'Technical Documentation', 'Attention to Detail'],
      verbs: ['Programmed', 'Synthesized', 'Integrated', 'Tested', 'Troubleshot', 'Prototyped', 'Designed', 'Simulated', 'Optimized', 'Calibrated'],
      metrics: ['Reduced power consumption by X%', 'Designed PCB layers up to X layers', 'Cut hardware noise by X dB', 'Improved sensor calibration accuracy by X%'],
      bulletTemplates: {
        entry: [
          {
            before: "Designed small circuits and simulated them.",
            after: "Designed and simulated 8+ analog amplifier circuits in LTspice, matching theoretical frequency responses within a 4% variance margin.",
            rationale: "Adds technical depth by specifying the tool (LTspice) and the precision metrics of matching theory."
          },
          {
            before: "Wrote code for Arduino and connected sensors.",
            after: "Programmed modular firmware in Embedded C on ARM Cortex microcontrollers, integrating SPI sensors and reducing power usage by 18%.",
            rationale: "Elevates 'Arduino code' to professional 'Embedded C on ARM microcontrollers' with optimization metrics."
          },
          {
            before: "Helped solder components on PCBs and tested boards.",
            after: "Assembled and tested 4-layer prototype PCBs, utilizing digital oscilloscopes to diagnose and resolve high-frequency noise spikes by 12 dB.",
            rationale: "Highlights hardware test tool proficiency (oscilloscope) and noise isolation capabilities."
          }
        ],
        mid: [
          {
            before: "Designed PCB layouts and worked on hardware.",
            after: "Architected a high-speed, 6-layer PCB in Altium Designer, routing high-density differential pairs and minimizing EMI to pass FCC certifications.",
            rationale: "Shows high-speed routing design capabilities and crucial compliance certification (FCC/EMI) awareness."
          },
          {
            before: "Wrote embedded firmware for IoT smart devices.",
            after: "Developed multitasking firmware utilizing FreeRTOS on ESP32, achieving seamless Wi-Fi telemetry and raising device battery life by 25%.",
            rationale: "Demonstrates advanced RTOS concepts and crucial IoT low-power optimization achievements."
          },
          {
            before: "Programmed PLC units for manufacturing plant.",
            after: "Programmed Siemens S7-1200 PLCs and designed SCADA monitoring screens, automating a conveyor routing line and boosting line efficiency by 22%.",
            rationale: "Shows automation, PLC systems knowledge, and direct manufacturing throughput enhancements."
          }
        ],
        senior: [
          {
            before: "Led ECE team and designed VLSI chips.",
            after: "Spearheaded physical design and Verilog synthesis of a high-speed DSP core, supervising 3 junior engineers and improving gate-delay timings by 15%.",
            rationale: "Illustrates leadership and deep VLSI chip synthesis capabilities with precise timing improvements."
          },
          {
            before: "In charge of electrical power distribution system.",
            after: "Managed a $500K substation upgrade design, designing protective relay logic and lowering grid power transmission losses by 6%.",
            rationale: "Shows high-voltage EEE design authority, budget responsibility, and crucial energy transmission savings."
          },
          {
            before: "Worked on hardware safety and testing certifications.",
            after: "Directed comprehensive SIL-2 (Safety Integrity Level) hardware safety compliance audits for industrial controllers, eliminating 8 critical design vulnerabilities.",
            rationale: "Demonstrates safety certification leadership, preventing expensive liability risks."
          }
        ]
      }
    },
    data_science: {
      name: 'Data Science & AI',
      keywords: ['data analysis', 'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'pandas', 'numpy', 'statistics', 'data science', 'data engineering', 'big data', 'spark', 'hadoop', 'tableau', 'power bi', 'r programming', 'jupyter', 'nlp', 'computer vision', 'ai', 'artificial intelligence', 'sql', 'scikit-learn', 'keras', 'aws sagemaker'],
      skills: ['Python', 'SQL (PostgreSQL/BigQuery)', 'Machine Learning (Scikit-Learn)', 'Deep Learning (TensorFlow/PyTorch)', 'Data Analysis (Pandas/NumPy)', 'Data Visualization (Tableau/Power BI)', 'Big Data (Apache Spark/Hadoop)', 'Natural Language Processing (NLP)', 'Computer Vision (OpenCV)', 'MLOps (MLflow/Docker)', 'Cloud (AWS SageMaker/GCP)', 'A/B Testing & Statistics', 'Feature Engineering', 'Data Pipelines (Airflow)', 'Data Scraping'],
      softSkills: ['Data Storytelling', 'Analytical Mindset', 'Cross-functional Collaboration', 'Business Acumen', 'Research Focus'],
      verbs: ['Modelled', 'Extracted', 'Analyzed', 'Visualized', 'Trained', 'Synthesized', 'Engineered', 'Optimized', 'Deployed', 'Boosted'],
      metrics: ['Improved model accuracy by X%', 'Reduced model inference latency by X%', 'Built dashboard tracking X KPIs', 'Processed over X Gigabytes of data'],
      bulletTemplates: {
        entry: [
          {
            before: "Analyzed dataset using Python and made graphs.",
            after: "Analyzed 50K+ customer transactions using Python and Pandas, extracting 5 key purchasing patterns to guide local product placements.",
            rationale: "Shows dataset scale (50K+ records) and directly translates statistical plots into business growth insights."
          },
          {
            before: "Built machine learning models to predict prices.",
            after: "Trained and evaluated a Random Forest regression model on Scikit-Learn, attaining a 92% prediction accuracy and reducing price forecast error by 14%.",
            rationale: "Injects model details, accuracy percentages, and standard error reduction metrics."
          },
          {
            before: "Made dashboards for business sales data.",
            after: "Developed an interactive sales dashboard in Tableau, compiling 4 distinct database sources to track 8 key executive performance KPIs.",
            rationale: "Highlights multi-source data integration and executive-level dashboard designs."
          }
        ],
        mid: [
          {
            before: "Created NLP classification model for customer emails.",
            after: "Engineered an end-to-end NLP text classifier using PyTorch and BERT, achieving a 0.89 F1-score and automating 40% of routing for support tickets.",
            rationale: "Expresses advanced deep learning modeling (BERT) and direct automation metrics saving human support time."
          },
          {
            before: "Optimized machine learning models and deployed them.",
            after: "Optimized ML inference pipeline via TensorRT and deployed to AWS SageMaker, cutting prediction latency from 240ms to 45ms (81% faster).",
            rationale: "Shows advanced production MLOps optimizations, focusing on latency KPIs which are highly valued in tech."
          },
          {
            before: "Designed data engineering pipelines for analytics.",
            after: "Orchestrated ETL data pipelines using Apache Airflow and BigQuery, processing 400 GB of daily logs and reducing query costs by 32%.",
            rationale: "Demonstrates big data competency, scheduling automation, and significant cloud warehouse cost reduction."
          }
        ],
        senior: [
          {
            before: "Managed the data science team and built models.",
            after: "Spearheaded a team of 4 data scientists in building a real-time recommendation engine that drove a 6.2% lift in total cart value ($240K/month).",
            rationale: "Demonstrates major team leadership and outstanding financial revenue results driven by machine learning algorithms."
          },
          {
            before: "Designed the AI strategy and cloud databases.",
            after: "Designed enterprise-wide hybrid database architectures, integrating Spark clusters to cut batch analytics time from 14 hours to 45 minutes.",
            rationale: "Highlights massive technical scaling capability, cluster management, and extreme speed optimizations."
          },
          {
            before: "Led statistical A/B testing and experimentation.",
            after: "Formulated A/B testing experimental frameworks on user pricing models, analyzing 2M+ active profiles and boosting subscription conversion rates by 8%.",
            rationale: "Shows deep statistical validation methods at large scale with significant monetization success."
          }
        ]
      }
    },
    business_mba: {
      name: 'MBA / Business & Management',
      keywords: ['project management', 'strategy', 'operations', 'stakeholder', 'business development', 'client management', 'p&l', 'leadership', 'team management', 'kpi', 'okr', 'cross-functional', 'roadmap', 'product management', 'mba', 'consulting', 'financial planning', 'market research', 'sales growth', 'business analysis', 'scrum master', 'agile'],
      skills: ['Project Management (PMP)', 'Strategic Planning', 'Agile/Scrum Frameworks', 'P&L Management', 'Cross-functional Leadership', 'Business Development & B2B Sales', 'KPI & OKR Goal Setting', 'Market Research & Analytics', 'Client Relationship Management', 'Budgeting & Financial Forecasting', 'Process Optimization', 'Change Management', 'Product Roadmap Planning', 'Vendor Management', 'Salesforce/Jira Tools'],
      softSkills: ['Executive Communication', 'Conflict Resolution', 'Negotiation', 'Strategic Influence', 'Public Speaking'],
      verbs: ['Spearheaded', 'Orchestrated', 'Streamlined', 'Formulated', 'Directed', 'Negotiated', 'Expanded', 'Delivered', 'Maximized', 'Captured'],
      metrics: ['Grew sales revenue by X%', 'Managed team sizes up to X members', 'Reduced operational costs by X%', 'Maintained client satisfaction scores at X%'],
      bulletTemplates: {
        entry: [
          {
            before: "Helped manage team projects and tasks.",
            after: "Coordinated project milestones for a team of 5 using Jira and Scrum boards, delivering a marketing campaign 5 days ahead of schedule.",
            rationale: "Demonstrates structured project management tools (Jira, Scrum) and direct scheduling success."
          },
          {
            before: "Talked to clients and did sales presentations.",
            after: "Prepared and delivered sales pitches to 12 corporate prospects, successfully onboarding 3 new enterprise B2B accounts and generating $15K revenue.",
            rationale: "Highlights measurable conversion rates (3 out of 12) and tangible monetization."
          },
          {
            before: "Did research on competitor companies.",
            after: "Conducted exhaustive market research and pricing matrix analysis of 8 direct competitors, identifying a pricing gap that enabled a 4% profit margin lift.",
            rationale: "Connects simple research to a high-value business metric (profit margin expansion)."
          }
        ],
        mid: [
          {
            before: "Managed the operations of the department.",
            after: "Streamlined regional delivery operations and re-negotiated shipping tariffs, cutting monthly operational overheads by 18% while expanding shipping capacity.",
            rationale: "Shows operational waste reduction, negotiation skills, and capacity scaling achievements."
          },
          {
            before: "Launched new products to the market.",
            after: "Orchestrated the cross-functional launch of a new digital service line, aligning design, sales, and dev teams to onboard 20K+ users in 90 days.",
            rationale: "Highlights complex multi-team alignment, project orchestration, and rapid user acquisition."
          },
          {
            before: "Responsible for client relations and retention.",
            after: "Managed relationship portfolios of 15 premium accounts, achieving a client retention rate of 96% and boosting upsell revenues by 22%.",
            rationale: "Demonstrates excellent client trust, minimized churn, and substantial upsell monetization."
          }
        ],
        senior: [
          {
            before: "In charge of company strategy and profit/loss.",
            after: "Held full accountability for a $4M business division P&L, driving a 28% year-over-year revenue expansion and maximizing EBITDA margins by 6%.",
            rationale: "Presents master-level executive fiscal responsibility (P&L, EBITDA) and massive year-over-year division growth."
          },
          {
            before: "Led global expansion and major business partnerships.",
            after: "Negotiated and closed strategic distribution alliances with 3 multi-national retail chains, capturing 12% market share and securing $1.2M in annual recurring sales.",
            rationale: "Shows global contract negotiations, strategic alliances, and high-dollar contract values."
          },
          {
            before: "Managed large corporate restructuring and processes.",
            after: "Directed an enterprise Agile transformation involving 80+ employees, shortening software-to-market release cycles by 40% and cutting re-work costs by $90K.",
            rationale: "Illustrates leadership in change management, massive operational scale, and direct cost reduction."
          }
        ]
      }
    },
    healthcare: {
      name: 'Healthcare & Medical',
      keywords: ['clinical', 'patient care', 'nursing', 'medical records', 'ehr', 'pharmacology', 'healthcare', 'diagnosis', 'treatment', 'hospital', 'patient safety', 'emr', 'pathology', 'triage', 'cardiology', 'anatomy', 'medical devices', 'infection control', 'rehabilitation', 'clinical trials', 'hipaa'],
      skills: ['Patient Care & Triage', 'Electronic Health Records (EHR/EMR)', 'Clinical Diagnosis & Treatment', 'Patient Safety & Quality Assurance', 'HIPAA Compliance', 'Pharmacology & Medication Admin', 'Emergency Care (ACLS/BLS)', 'Infection Control Protocols', 'Lab Specimen Collection', 'Wound Management', 'Patient Advocacy', 'Medical Equipment Calibration', 'Clinical Documentation', 'Diagnostic Interpretation', 'Therapeutic Care'],
      softSkills: ['Empathy & Compassion', 'Crisis Management', 'Interpersonal Communication', 'Active Listening', 'Collaboration'],
      verbs: ['Administered', 'Coordinated', 'Facilitated', 'Evaluated', 'Treated', 'Monitored', 'Optimized', 'Diagnosed', 'Rehabilitated', 'Streamlined'],
      metrics: ['Maintained patient satisfaction rates at X%', 'Managed care load up to X patients daily', 'Reduced hospital readmission rates by X%', 'Cut patient triage wait times by X minutes'],
      bulletTemplates: {
        entry: [
          {
            before: "Took care of patients and recorded their data.",
            after: "Provided compassionate care to 12+ daily assigned ward patients, accurately documenting vitals and records into EHR systems in compliance with HIPAA.",
            rationale: "Shows HIPAA awareness, clinical workload numbers, and accurate charting proficiency."
          },
          {
            before: "Helped give medications and clinical treatments.",
            after: "Administered prescribed intravenous and oral medications to 15+ daily patients, double-checking dosages and ensuring zero medication administration errors.",
            rationale: "Highlights focus on absolute patient safety and high volume dosage precision."
          },
          {
            before: "Kept the clinic clean and prepped tools.",
            after: "Sterilized and prepared surgical tools and patient rooms, achieving 100% compliance with infection-control audits and local safety protocols.",
            rationale: "Expresses deep safety diligence and successful inspection records."
          }
        ],
        mid: [
          {
            before: "Worked in triage and checked incoming patients.",
            after: "Streamlined the emergency triage routing workflow, reducing average patient check-in wait times by 18 minutes (35% speed improvement).",
            rationale: "Highlights administrative workflow optimization in high-stress settings, saving valuable patient response time."
          },
          {
            before: "Managed the training of student nurses.",
            after: "Mentored and trained a group of 6 junior nursing graduates, boosting patient documentation accuracy rates by 22% in critical care units.",
            rationale: "Shows leadership in training, elevating clinical documentation quality metrics across the hospital."
          },
          {
            before: "Assisted in research and clinical drug trials.",
            after: "Coordinated clinical data collections for a phase-II cardiovascular drug trial, verifying compliance metrics for 80+ enrolled study patients.",
            rationale: "Exhibits complex data-verification abilities in highly regulated clinical trial domains."
          }
        ],
        senior: [
          {
            before: "Head of nursing department and hospital rules.",
            after: "Directed clinical nursing operations for a 40-bed cardiac care unit, managing 22+ clinical staff and maintaining a patient satisfaction rating of 98%.",
            rationale: "Displays high-level medical department leadership, staff delegation, and unmatched patient success reviews."
          },
          {
            before: "Led hospital-wide infection control reforms.",
            after: "Formulated and executed a hospital-wide sanitization protocol, cutting post-operative nosocomial infection rates by 42% over a 12-month span.",
            rationale: "Presents strategic clinical reforms saving lives and minimizing expensive readmission cycles."
          },
          {
            before: "Managed medical procurement and department budgets.",
            after: "Supervised a $600K clinical equipment acquisition budget, negotiating key vendor agreements and reducing acquisition costs by 15% ($90K saved).",
            rationale: "Shows fiscal medical command and massive cost savings on specialized equipment."
          }
        ]
      }
    },
    finance: {
      name: 'Finance & Accounting',
      keywords: ['accounting', 'financial analysis', 'investment', 'banking', 'audit', 'taxation', 'budgeting', 'forecasting', 'excel', 'financial modeling', 'risk management', 'compliance', 'cpa', 'cfa', 'portfolio', 'revenue', 'profit', 'balance sheet', 'cash flow', 'ledger', 'valuation', 'sap', 'quickbooks', 'treasury', 'mergers'],
      skills: ['Financial Analysis & Modeling', 'Corporate Valuation (DCF)', 'Budgeting & Forecasting', 'Taxation & Regulatory Audit', 'General Ledger & GAAP/IFRS', 'Risk Management & Hedging', 'Portfolio Management', 'Cash Flow & Liquidity Planning', 'SAP / Oracle Financials', 'Advanced MS Excel (VBA/Macros)', 'QuickBooks & Bookkeeping', 'Mergers & Acquisitions (M&A)', 'Treasury Operations', 'Internal Controls (SOX)', 'Cost Accounting'],
      softSkills: ['Attention to Detail', 'Quantitative Reasoning', 'Strategic Negotiation', 'Analytical Writing', 'Ethical Standards'],
      verbs: ['Audited', 'Forecasted', 'Reconciled', 'Analyzed', 'Maximized', 'Valued', 'Optimized', 'Negotiated', 'Formulated', 'Streamlined'],
      metrics: ['Managed investment portfolios worth $X Million', 'Reduced tax liabilities by X%', 'Cut monthly ledger reconciliation times by X days', 'Identified budget variances within X% accuracy'],
      bulletTemplates: {
        entry: [
          {
            before: "Checked company accounts and transactions.",
            after: "Reconciled 150+ monthly vendor accounts and cash transactions in QuickBooks, reducing ledger mismatch errors by 18%.",
            rationale: "Demonstrates high quantitative detail and familiarity with bookkeeping tools (QuickBooks)."
          },
          {
            before: "Helped make the yearly budget excel sheet.",
            after: "Created advanced MS Excel financial spreadsheets using lookup tables and index-match functions, cutting budget data compilation times by 20%.",
            rationale: "Highlights software expertise (Excel formulas) and operational speed increases."
          },
          {
            before: "Helped run simple audits on client finances.",
            after: "Assisted in conducting corporate financial audits for 4 mid-market clients, verifying transaction logs in compliance with GAAP guidelines.",
            rationale: "Shows understanding of critical regulatory frameworks (GAAP) applied practically."
          }
        ],
        mid: [
          {
            before: "Built financial models to forecast sales.",
            after: "Built dynamic 3-statement financial models and forecasting structures in Excel, improving monthly revenue projection accuracy to 97%.",
            rationale: "Shows advanced modeling capabilities (3-statement model) with highly accurate results."
          },
          {
            before: "Managed tax preparation and filings.",
            after: "Optimized corporate tax deductions and filings under local tax codes, cutting annual corporate tax liabilities by 14% ($32K savings).",
            rationale: "Directly shows substantial financial impact (cash savings) through tax planning expertise."
          },
          {
            before: "Helped manage investment portfolios.",
            after: "Analyzed risk factors and returns of a $1.5M regional investment portfolio, re-balancing assets to improve annualized returns by 3.2%.",
            rationale: "Shows analytical asset-management capabilities with high-value portfolio returns."
          }
        ],
        senior: [
          {
            before: "CFO/Director of finance and global budgets.",
            after: "Held executive command over a $15M corporate capital budget, directing structural financial planning that expanded free cash flow by 34%.",
            rationale: "Shows elite corporate leadership, massive capital authority ($15M), and tremendous cash-flow growth success."
          },
          {
            before: "Led major mergers and acquisition deals.",
            after: "Spearheaded financial due diligence and DCF valuation modeling for a $4.5M tech acquisition, negotiating deal terms to save $600K on the purchase price.",
            rationale: "Highlights top-level deal-making (M&A), corporate valuations, and major price-negotiations."
          },
          {
            before: "Managed corporate compliance and SOX controls.",
            after: "Restructured corporate internal controls under SOX (Sarbanes-Oxley) compliance frameworks, achieving 100% clean reports in global audits.",
            rationale: "Shows deep corporate trust, governance, and zero-defect regulatory auditing performance."
          }
        ]
      }
    },
    marketing: {
      name: 'Marketing & Growth',
      keywords: ['seo', 'sem', 'google ads', 'facebook ads', 'social media', 'content marketing', 'email marketing', 'analytics', 'campaign', 'brand strategy', 'copywriting', 'hubspot', 'mailchimp', 'conversion rate', 'lead generation', 'growth hacking', 'ppc', 'ctr', 'engagement', 'influencer', 'adwords', 'copywriter', 'pr', 'public relations'],
      skills: ['Search Engine Optimization (SEO)', 'Search Engine Marketing (SEM)', 'Pay-Per-Click (PPC) Advertising', 'Google Analytics & Tag Manager', 'Facebook & Instagram Ads', 'Content Strategy & Copywriting', 'Email Marketing (Mailchimp/Klaviyo)', 'Lead Generation Funnels', 'Social Media Analytics', 'Conversion Rate Optimization (CRO)', 'Marketing Automation (HubSpot)', 'Brand Management', 'Influencer PR & Outreach', 'A/B Test Ad Creatives', 'Public Relations (PR)'],
      softSkills: ['Creative Writing', 'Data-Driven Mindset', 'Consumer Psychology', 'Visual Aesthetics', 'Trend Identification'],
      verbs: ['Executed', 'Campaigned', 'Boosted', 'Acquired', 'Segmented', 'Optimized', 'Grew', 'Generated', 'A/B Tested', 'Streamlined'],
      metrics: ['Grew organic traffic by X%', 'Generated X+ qualified leads', 'Reduced cost-per-click (CPC) by X%', 'Raised email click-through rates (CTR) by X%'],
      bulletTemplates: {
        entry: [
          {
            before: "Wrote social media posts and put them on Facebook.",
            after: "Wrote and scheduled 30+ engaging content posts, boosting organic social media reach by 32% and engagement rates by 12%.",
            rationale: "Quantifies the output (30+ posts) and measures direct audience reaction improvements."
          },
          {
            before: "Helped run paid ad campaigns on Google.",
            after: "Managed basic search keywords for Google Ads campaigns, adjusting bids to cut cost-per-click (CPC) by 15% and save budget.",
            rationale: "Injects cost-efficiency metrics onto digital marketing paid campaigns."
          },
          {
            before: "Wrote content for the company blog.",
            after: "Published 6 SEO-optimized articles, targeting long-tail keywords to rank 3 posts on Google's page 1 within 60 days.",
            rationale: "Proves technical SEO keyword execution and tangible ranking outcomes."
          }
        ],
        mid: [
          {
            before: "Managed the SEO traffic for company site.",
            after: "Overhauled the core site technical and on-page SEO structures, growing organic search traffic by 48% and capturing 5K+ monthly visitors.",
            rationale: "Demonstrates strong search architecture knowledge and high traffic growth results."
          },
          {
            before: "Set up and managed email marketing flows.",
            after: "Designed automated email retention funnels in HubSpot, boosting click-through-rates (CTR) by 24% and generating $40K in direct email sales.",
            rationale: "Shows automation platform expertise (HubSpot) and links emails to direct sales revenue."
          },
          {
            before: "Ran lead generation campaigns for sales team.",
            after: "Executed a targeted LinkedIn B2B lead generation funnel, generating 240+ qualified leads and expanding sales pipeline by $120K.",
            rationale: "Displays high-value B2B growth methods with a massive sales pipeline dollar value."
          }
        ],
        senior: [
          {
            before: "Led marketing department and digital strategies.",
            after: "Directed a $200K annual omni-channel marketing budget, driving a 140% year-over-year growth in e-commerce revenues ($1.4M generated).",
            rationale: "Expresses large budget authority ($200K), e-commerce execution, and massive ROI."
          },
          {
            before: "Worked on brand restructuring and PR campaigns.",
            after: "Spearheaded a complete brand repositioning campaign, securing placements in 12 major media outlets and raising brand index scores by 45%.",
            rationale: "Shows top-tier PR connections, national media coverage, and brand awareness metrics."
          },
          {
            before: "Led Conversion Optimization and A/B Testing.",
            after: "Formulated dynamic landing page A/B tests and site personalization, raising average conversion rates from 1.8% to 4.2% (a 133% efficiency boost).",
            rationale: "Shows statistical CRO methodologies, drastically improving return on marketing spend."
          }
        ]
      }
    },
    general: {
      name: 'General Professional',
      keywords: ['management', 'leadership', 'organization', 'coordination', 'communication', 'administration', 'operations', 'customer service', 'support', 'planning', 'supervision', 'project', 'teamwork', 'documentation'],
      skills: ['Project Management', 'Operational Workflows', 'Task Prioritization', 'Team Collaboration', 'Process Optimization', 'Client Communications', 'Data Reporting & Metrics', 'Risk Management', 'Regulatory Compliance', 'Resource Allocation', 'Budget Management', 'Problem Solving', 'Strategic Scheduling', 'Meeting Facilitation', 'Customer Success'],
      softSkills: ['Verbal & Written Communication', 'Conflict Resolution', 'Emotional Intelligence', 'Time Management', 'Adaptability'],
      verbs: ['Spearheaded', 'Orchestrated', 'Optimized', 'Streamlined', 'Led', 'Managed', 'Facilitated', 'Negotiated', 'Implemented', 'Reformed'],
      metrics: ['Boosted efficiency of processes by X%', 'Managed team sizes of X+', 'Coordinated budgets worth $X', 'Maintained project timelines within X% variance'],
      bulletTemplates: {
        entry: [
          {
            before: "Responsible for answering client queries and handling support tickets.",
            after: "Resolved 40+ daily customer inquiries and support cases, maintaining a 96% positive customer satisfaction (CSAT) rating.",
            rationale: "Quantifies daily output and highlights a critical service KPI (CSAT score)."
          },
          {
            before: "Helped coordinate calendars and office schedules.",
            after: "Streamlined executive calendars and event coordinates using Google Workspace, cutting meeting scheduling friction and saving 5 hours weekly.",
            rationale: "Replaces passive coordinate description with standard efficiency time-savings."
          },
          {
            before: "Updated spreadsheet records and files.",
            after: "Reorganized data spreadsheet records and audit lists, eliminating 15% redundant records to speed up internal data lookups.",
            rationale: "Demonstrates accuracy and structural improvements that save company team hours."
          }
        ],
        mid: [
          {
            before: "Managed company projects and operations.",
            after: "Orchestrated 4 concurrent operational projects, aligning cross-functional teams to deliver milestones 100% on schedule and within budget.",
            rationale: "Highlights schedule precision and multi-tasking project management capabilities."
          },
          {
            before: "Improved team processes and workflows.",
            after: "Overhauled internal documentation workflows, reducing task onboarding cycles by 30% and boosting overall team productivity.",
            rationale: "Proves workflow efficiency improvements, cutting cost-per-onboard."
          },
          {
            before: "Handled vendor contracting and billing.",
            after: "Negotiated regional service agreements with 5 key office vendors, securing a 15% cost savings on supply distributions.",
            rationale: "Shows budget responsibility and proactive cost-saving negotiation skills."
          }
        ],
        senior: [
          {
            before: "Led departments and strategy programs.",
            after: "Directed a division of 15+ multidisciplinary personnel, expanding operational efficiency ratings by 24% while executing strategic changes.",
            rationale: "Exhibits leadership, department-scale oversight, and massive systemic efficiency metrics."
          },
          {
            before: "Managed regional client accounts and portfolios.",
            after: "Held full stewardship over a $1.2M commercial account portfolio, securing renewals and expanding upsells by 18% in fiscal year.",
            rationale: "Shows large-scale strategic stewardship and excellent portfolio growth values."
          },
          {
            before: "Managed office restructuring and scaling.",
            after: "Spearheaded comprehensive digital tooling migrations for regional hubs, cutting annual operating expenses by $75K while enabling modern workflows.",
            rationale: "Expresses large-scale change management and substantial corporate bottom-line improvements."
          }
        ]
      }
    }
  };

  // ========================
  // STEP 2: Domain Detection Engine
  // ========================
  let detectedFieldKey = 'general';
  let maxScore = 0;
  
  // Calculate scores for each domain by matching keywords in both Resume + JD
  const combinedContext = `${text} ${jd}`;
  for (const [fieldKey, profile] of Object.entries(domainProfiles)) {
    const matchCount = profile.keywords.filter(kw => combinedContext.includes(kw)).length;
    if (matchCount > maxScore) {
      maxScore = matchCount;
      detectedFieldKey = fieldKey;
    }
  }

  const activeProfile = domainProfiles[detectedFieldKey];
  const detectedDomain = activeProfile.name;

  // ========================
  // STEP 3: Experience Level Detection Engine
  // ========================
  let detectedExperience = 'Mid Level';
  const seniorSignals = ['senior', 'lead', 'manager', 'director', 'architect', 'head', 'principal', 'vice president', 'vp', 'executive', '10+ years', '8+ years', '9+ years', 'years of experience', 'architected', 'spearheaded', 'orchestrated'];
  const entrySignals = ['intern', 'junior', 'student', 'entry', 'fresher', 'graduate', 'co-op', 'apprentice', 'fresher', 'trainee', 'fresher', 'beginner', 'associate'];

  const seniorCount = seniorSignals.filter(sig => text.includes(sig)).length;
  const entryCount = entrySignals.filter(sig => text.includes(sig)).length;

  if (seniorCount > 2 && seniorCount > entryCount) {
    detectedExperience = 'Senior Level';
  } else if (entryCount > 1 && entryCount > seniorCount) {
    detectedExperience = 'Entry Level';
  }

  // ========================
  // STEP 4: Skills & Keyword Cross-Referencing
  // ========================
  const technicalSkillsPool = activeProfile.skills;
  const softSkillsPool = activeProfile.softSkills;
  const allSkillsPool = [...technicalSkillsPool, ...softSkillsPool];

  let matchedSkills = [];
  let missingSkills = [];
  let skillsMatchPercentage = 0;

  // Extract skills present in the resume
  const resumeSkills = allSkillsPool.filter(skill => text.includes(skill.toLowerCase()));

  if (jd && jd.trim().length > 20) {
    // Extract skills present in the JD
    const jdSkills = allSkillsPool.filter(skill => jd.includes(skill.toLowerCase()));

    if (jdSkills.length > 0) {
      matchedSkills = jdSkills.filter(skill => text.includes(skill.toLowerCase()));
      missingSkills = jdSkills.filter(skill => !text.includes(skill.toLowerCase()));
      skillsMatchPercentage = Math.round((matchedSkills.length / jdSkills.length) * 100);
    } else {
      // Fallback if JD is parsed but has no recognizable domain keywords
      matchedSkills = resumeSkills.slice(0, 8);
      missingSkills = allSkillsPool.filter(skill => !text.includes(skill.toLowerCase())).slice(0, 6);
      skillsMatchPercentage = Math.round((matchedSkills.length / (matchedSkills.length + missingSkills.length)) * 100);
    }
  } else {
    // Standard matching if no JD is provided (compare resume with standard domain expectation)
    matchedSkills = resumeSkills.slice(0, 8);
    missingSkills = allSkillsPool.filter(skill => !text.includes(skill.toLowerCase())).slice(0, 6);
    skillsMatchPercentage = Math.round((matchedSkills.length / (matchedSkills.length + Math.max(missingSkills.length, 1))) * 100);
    skillsMatchPercentage = Math.max(Math.min(skillsMatchPercentage, 85), 50); // Keep reasonable standard baseline
  }

  // Ensure formats are capitalized clean strings
  matchedSkills = matchedSkills.map(s => s.trim());
  missingSkills = missingSkills.map(s => s.trim());
  if (missingSkills.length === 0) {
    missingSkills = ['Critical gaps not detected — resume holds excellent alignment!'];
  }

  // ========================
  // STEP 5: Bullet Point Rewriting Engine (Field & Level Custom)
  // ========================
  const levelKey = detectedExperience === 'Senior Level' ? 'senior' : detectedExperience === 'Entry Level' ? 'entry' : 'mid';
  const optimizedBullets = activeProfile.bulletTemplates[levelKey] || activeProfile.bulletTemplates.mid;

  // ========================
  // STEP 6: ATS Score Calculation
  // ========================
  const hasMetrics = /\d+%|\d+\+|\$\d|increased|decreased|reduced|improved|boosted|grew|saved|generated|delivered/i.test(resumeText);
  const hasActionVerbs = new RegExp(`\\b(${activeProfile.verbs.join('|')})\\b`, 'i').test(resumeText);
  const hasContact = /\b(email|phone|linkedin|github|portfolio|@)\b/i.test(resumeText);
  const wordCount = resumeText.split(/\s+/).length;

  let score = 40; // Base score
  
  // 1. Formatting & word count (Max 15)
  if (wordCount >= 400 && wordCount <= 900) score += 15;
  else if (wordCount > 200) score += 10;
  
  // 2. Action verbs (Max 15)
  if (hasActionVerbs) score += 15;
  else score += 5;

  // 3. Concrete Metrics (Max 15)
  if (hasMetrics) score += 15;
  else score += 2;

  // 4. Contact Details (Max 10)
  if (hasContact) score += 10;
  else score += 3;

  // 5. Keyword density from dynamic match (Max 45)
  score += Math.round((skillsMatchPercentage / 100) * 45);

  score = Math.min(Math.max(score, 32), 98); // Cap between 32 and 98

  // ========================
  // STEP 7: Strengths & Weaknesses Generator
  // ========================
  const strengths = [
    `Strongly aligned with the ${detectedDomain} domain, capturing key industry terminologies.`,
    hasActionVerbs ? `Excellent implementation of impact-driven active verbs like: ${activeProfile.verbs.slice(0, 3).join(', ')}.` : `Features neat, organized project and professional experiences sections.`,
    hasMetrics ? `Successfully quantifies professional deliverables using metrics and KPI percentages.` : `Includes critical technological skills categories related to ${detectedDomain}.`
  ];

  const weaknesses = [];
  if (!hasMetrics) {
    weaknesses.push(`❗ Missing quantified results — add concrete metrics like 'boosted efficiency by 22%' or 'saved $12K annually'.`);
  }
  if (!hasActionVerbs) {
    weaknesses.push(`❗ Weak action phrasing — replace general phrases like 'responsible for' with active verbs like: ${activeProfile.verbs.slice(0, 3).join(', ')}.`);
  }
  if (wordCount < 300) {
    weaknesses.push(`❗ CV content is too brief — expand on major assignments and specific responsibilities to raise indexing depth.`);
  } else if (wordCount > 1200) {
    weaknesses.push(`⚠️ CV is excessively long — edit down fluff to maintain reader engagement and fit formatting standards.`);
  }
  if (!hasContact) {
    weaknesses.push(`❗ Missing crucial contact markers — ensure email, phone, and professional links (LinkedIn) are placed at the header.`);
  }

  if (weaknesses.length === 0) {
    weaknesses.push("No major structural flaws detected. Formatting and layout are highly polished!");
  }

  // Actionable suggestions
  const suggestions = [
    `Inject 4 or more targeted domain action verbs into bullet statements.`,
    `Aim to quantify at least 60% of your experience bullets using simulated or actual target metrics.`,
    `Organize technical proficiencies in a structured Skill Matrix to help parsers find key credentials instantly.`
  ];

  // ========================
  // STEP 8: Recruiter & Formatting Tips
  // ========================
  const formattingTips = [
    "📐 Margins: Maintain a standard 1.0-inch or 0.75-inch margin on all sides for neat printable balance.",
    "🔤 Typography: Use readable, modern sans-serif fonts such as Inter, Calibri, or Arial at 10-12pt sizes.",
    "📁 Document Format: Save and upload files as PDF to preserve layout, naming as 'FirstName_LastName_Resume.pdf'.",
    "💡 Parser Rule: Never place crucial contact details or core skills inside headers or footers, as many parsers ignore them."
  ];

  const experienceAdvice = [];
  if (detectedExperience === 'Entry Level') {
    experienceAdvice.push("🎓 Education First: Place your Education and Academic Projects sections near the top to emphasize theoretical rigor.");
    experienceAdvice.push("🛠️ Emphasize Skills: List university project assignments, describing group contributions and specialized tool usages.");
    experienceAdvice.push("🚀 Internships & Co-Ops: Showcase non-academic work history prominently to demonstrate early industry adjustment.");
  } else if (detectedExperience === 'Senior Level') {
    experienceAdvice.push("💼 Executive Presence: Lead with a strong Professional Summary outlining career leadership scales and core domains.");
    experienceAdvice.push("📊 Focus on Scale: Quantify operational team size, capital budgets managed, and P&L financial deliverables.");
    experienceAdvice.push("💡 Strategic Ownership: Highlight long-term roadmap designs, architectural direction, and change management projects.");
  } else {
    experienceAdvice.push("📈 Focus on Impact: Balance technical proficiency lists with details of actual workspace application and outcomes.");
    experienceAdvice.push("🔑 Mid-Career Shift: Transition bullet phrasing from simple execution ('responsible for') to ownership and project delivery.");
    experienceAdvice.push("🎖️ Certifications: Place professional certifications and specialized badges right after experience to boost value.");
  }

  return {
    score,
    strengths,
    weaknesses,
    skillGaps: missingSkills,
    suggestions,
    jobMatchPercentage: skillsMatchPercentage,
    // Rich Dynamic ATS elements:
    domain: detectedDomain,
    experienceLevel: detectedExperience,
    matchedSkills,
    missingSkills,
    skillsMatchPercentage,
    optimizedBullets,
    domainVerbs: activeProfile.verbs,
    domainMetrics: activeProfile.metrics,
    formattingTips,
    experienceAdvice
  };
};

/**
 * Queries Claude AI for structural JSON resume feedback, falling back to local analysis if credentials are low.
 */
const analyzeResumeWithClaude = async (resumeText, jobDescription = '') => {
  // Free Mode Check
  if (process.env.USE_MOCK_AI === 'true') {
    console.log('[claudeAI] Smart Local AI mode is ENABLED. Generating personalized field-specific analysis...');
    return smartLocalAnalyzer(resumeText, jobDescription);
  }

  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    console.warn('[claudeAI] No API key configured. Using smart local analyzer.');
    return smartLocalAnalyzer(resumeText, jobDescription);
  }

  const prompt = `You are a world-class ATS (Applicant Tracking System) optimizer and professional resume audit consultant.
Analyze the following resume and target job description, and output a detailed optimization report in strict JSON format.

Resume Text:
"""
${resumeText}
"""

Target Job Description:
"""
${jobDescription}
"""

Return ONLY a valid, parseable JSON object. Do not include any standard conversational text, intro markdown blocks, or commentary.

Expected JSON schema response:
{
  "score": 85,
  "domain": "Software / IT",
  "experienceLevel": "Mid Level",
  "strengths": [
    "Aligned with standard keywords...",
    "Quantified key engineering metrics"
  ],
  "weaknesses": [
    "Missing specific action verbs in sections...",
    "Resume length is too short"
  ],
  "skillGaps": [
    "AWS",
    "Docker"
  ],
  "suggestions": [
    "Add a dedicated Skills Matrix...",
    "Infuse 3 new metrics into project sections"
  ],
  "jobMatchPercentage": 78,
  "matchedSkills": ["React", "JavaScript", "SQL"],
  "missingSkills": ["AWS", "Docker", "CI/CD"],
  "skillsMatchPercentage": 50,
  "optimizedBullets": [
    {
      "before": "Passive weak bullet from resume",
      "after": "Optimized bullet using action verbs + metrics + JD keywords",
      "rationale": "Why this change makes it much stronger for ATS scoring"
    }
  ],
  "domainVerbs": ["Engineered", "Architected", "Optimized", "Refactored"],
  "domainMetrics": ["API Latency (X%)", "Uptime (X%)", "Cost savings ($X)"],
  "formattingTips": [
    "Maintain standard 1.0 margins...",
    "Use standard readable fonts"
  ],
  "experienceAdvice": [
    "Specific tips based on experience level..."
  ]
}
`;

  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      },
      {
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
      }
    );

    let responseText = response.data.content[0].text.trim();

    if (responseText.includes('```json')) {
      responseText = responseText.split('```json')[1].split('```')[0];
    } else if (responseText.includes('```')) {
      responseText = responseText.split('```')[1].split('```')[0];
    }

    responseText = responseText.trim();

    try {
      const parsedAnalysis = JSON.parse(responseText);
      
      // Fallbacks to guarantee type consistency
      return {
        score: typeof parsedAnalysis.score === 'number' ? parsedAnalysis.score : 70,
        domain: parsedAnalysis.domain || 'General Professional',
        experienceLevel: parsedAnalysis.experienceLevel || 'Mid Level',
        strengths: Array.isArray(parsedAnalysis.strengths) ? parsedAnalysis.strengths : [],
        weaknesses: Array.isArray(parsedAnalysis.weaknesses) ? parsedAnalysis.weaknesses : [],
        skillGaps: Array.isArray(parsedAnalysis.skillGaps) ? parsedAnalysis.skillGaps : [],
        suggestions: Array.isArray(parsedAnalysis.suggestions) ? parsedAnalysis.suggestions : [],
        jobMatchPercentage: typeof parsedAnalysis.jobMatchPercentage === 'number' ? parsedAnalysis.jobMatchPercentage : 50,
        matchedSkills: Array.isArray(parsedAnalysis.matchedSkills) ? parsedAnalysis.matchedSkills : [],
        missingSkills: Array.isArray(parsedAnalysis.missingSkills) ? parsedAnalysis.missingSkills : [],
        skillsMatchPercentage: typeof parsedAnalysis.skillsMatchPercentage === 'number' ? parsedAnalysis.skillsMatchPercentage : 50,
        optimizedBullets: Array.isArray(parsedAnalysis.optimizedBullets) ? parsedAnalysis.optimizedBullets : [],
        domainVerbs: Array.isArray(parsedAnalysis.domainVerbs) ? parsedAnalysis.domainVerbs : [],
        domainMetrics: Array.isArray(parsedAnalysis.domainMetrics) ? parsedAnalysis.domainMetrics : [],
        formattingTips: Array.isArray(parsedAnalysis.formattingTips) ? parsedAnalysis.formattingTips : [],
        experienceAdvice: Array.isArray(parsedAnalysis.experienceAdvice) ? parsedAnalysis.experienceAdvice : []
      };
    } catch (parseErr) {
      console.error('[claudeAI] Failed to parse Claude JSON response. Falling back to smart local analyzer.');
      return smartLocalAnalyzer(resumeText, jobDescription);
    }
  } catch (error) {
    console.warn('[claudeAI] Claude API call failed. Falling back to smart local analyzer. Reason:', error.message);
    return smartLocalAnalyzer(resumeText, jobDescription);
  }
};

module.exports = { analyzeResumeWithClaude };
