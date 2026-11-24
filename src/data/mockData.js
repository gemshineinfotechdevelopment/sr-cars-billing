// Mock Data for SR CARS - Luxury Automotive Service, Billing & Dealership Management

export const initialSettings = {
  dealershipName: "SR CARS",
  tagline: "Prestige Automobiles & Performance Service Center",
  companyLogo: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=200&auto=format&fit=crop&q=80",
  address: "Plot 42, Luxury Motor Boulevard, Jubilee Hills, Hyderabad - 500033, Telangana",
  phone: "+91 98490 87654",
  email: "billing@srcarsluxury.com",
  workingHours: "Mon – Sat: 9:00 AM – 8:00 PM",
  gstin: "36AABCU9603R1ZM",
  pan: "AABCU9603R",
  
  // Invoice Settings
  invoicePrefix: "SRC-2026-",
  invoiceNumberFormat: "PREFIX + 3-Digit Counter (e.g. SRC-2026-001)",
  defaultGst: 18,
  termsAndConditions: "1. Goods once sold and fitted will not be returned.\n2. All mechanical and service repairs carry a 6-month or 10,000 KM workshop warranty.\n3. Payment is strictly due upon vehicle handover unless an approved credit line is in place.\n4. Disputes subject to Hyderabad judicial jurisdiction only.",
  invoiceFooter: "Thank you for choosing SR CARS. Precision engineering, certified technicians & supreme luxury care.",
  
  // General Settings
  currency: "₹",
  dateFormat: "DD/MM/YYYY",
  notificationPreferences: {
    smsInvoiceAlerts: true,
    whatsappServiceUpdates: true,
    lowStockAlerts: true,
    dailySalesEmail: true
  },
  
  bankDetails: {
    bankName: "HDFC Bank Ltd",
    accountName: "SR CARS AUTOMOBILES PVT LTD",
    accountNumber: "50200088921473",
    ifsc: "HDFC0001234",
    branch: "Road No 36, Jubilee Hills, Hyderabad",
    upiId: "srcars@hdfcbank"
  }
};

export const initialEmployees = [
  {
    id: "EMP-001",
    name: "Vikram Singhania",
    email: "admin@srcars.com",
    role: "Super Admin",
    phone: "+91 98490 11111",
    status: "Active",
    permissions: ["Manage All", "Invoices & Billing", "Services Catalog", "Spare Parts Inventory", "Customer Management", "Reports & Analytics", "System Settings"]
  },
  {
    id: "EMP-002",
    name: "Rahul Deshmukh",
    email: "rahul.advisor@srcars.com",
    role: "Service Advisor",
    phone: "+91 98490 22222",
    status: "Active",
    permissions: ["Invoices & Billing", "Services Catalog", "Customer Management"]
  },
  {
    id: "EMP-003",
    name: "Karthik Verma",
    email: "karthik.inventory@srcars.com",
    role: "Inventory Manager",
    phone: "+91 98490 33333",
    status: "Active",
    permissions: ["Spare Parts Inventory", "Reports & Analytics"]
  },
  {
    id: "EMP-004",
    name: "Mohammed Irfan",
    email: "irfan.billing@srcars.com",
    role: "Billing Specialist",
    phone: "+91 98490 44444",
    status: "Active",
    permissions: ["Invoices & Billing", "Customer Management"]
  }
];

export const initialCustomers = [
  {
    id: "CUST-001",
    name: "Vikramaditya Reddy",
    phone: "+91 98765 43210",
    email: "vikram.reddy@hyderabadgroup.com",
    address: "Villa 14, Palm Meadows, Jubilee Hills, Hyderabad - 500033",
    gstin: "36AAECR4921K1ZN",
    createdAt: "2025-08-14",
    vehicles: [
      {
        id: "VEH-101",
        vehicleNumber: "TS 09 EA 4589",
        brand: "Mercedes-Benz",
        model: "E-Class E 220d AMG Line",
        fuelType: "Diesel",
        vehicleType: "Sedan",
        chassisNumber: "WDB2130041A987654",
        odometer: "34,500 km"
      },
      {
        id: "VEH-102",
        vehicleNumber: "TS 09 FH 0007",
        brand: "Porsche",
        model: "Macan GTS 2.9L Twin-Turbo",
        fuelType: "Petrol",
        vehicleType: "SUV",
        chassisNumber: "WP1ZZZ95ZMLA12984",
        odometer: "18,200 km"
      }
    ]
  },
  {
    id: "CUST-002",
    name: "Rajesh Sharma",
    phone: "+91 98480 12345",
    email: "rajesh.sharma@apexlogistics.in",
    address: "Flat 9B, Horizon Towers, Gachibowli, Hyderabad - 500032",
    gstin: "36AAACH7890P1ZQ",
    createdAt: "2025-09-02",
    vehicles: [
      {
        id: "VEH-103",
        vehicleNumber: "TS 07 HK 9081",
        brand: "BMW",
        model: "M340i xDrive 3.0L",
        fuelType: "Petrol",
        vehicleType: "Sedan",
        chassisNumber: "WBA5U71020FP43219",
        odometer: "26,800 km"
      }
    ]
  },
  {
    id: "CUST-003",
    name: "Sneha Rao",
    phone: "+91 99890 67890",
    email: "sneha.rao@zenithtech.io",
    address: "Plot 89, Financial District, Nanakramguda, Hyderabad - 500075",
    gstin: "",
    createdAt: "2025-10-10",
    vehicles: [
      {
        id: "VEH-104",
        vehicleNumber: "TS 08 EM 3344",
        brand: "Audi",
        model: "A6 45 TFSI Technology",
        fuelType: "Petrol",
        vehicleType: "Sedan",
        chassisNumber: "WAUZZZF27LN054321",
        odometer: "42,100 km"
      }
    ]
  },
  {
    id: "CUST-004",
    name: "Arvind Kumar",
    phone: "+91 94400 98765",
    email: "arvind.kumar@kumbuilders.com",
    address: "Road No 10, Banjara Hills, Hyderabad - 500034",
    gstin: "36ABCPK5432R1ZF",
    createdAt: "2025-11-05",
    vehicles: [
      {
        id: "VEH-105",
        vehicleNumber: "TS 10 AB 1234",
        brand: "Land Rover",
        model: "Range Rover Velar R-Dynamic",
        fuelType: "Diesel",
        vehicleType: "SUV",
        chassisNumber: "SALYA2V88LA789123",
        odometer: "51,200 km"
      },
      {
        id: "VEH-106",
        vehicleNumber: "TS 10 CD 5678",
        brand: "BMW",
        model: "530d M Sport",
        fuelType: "Diesel",
        vehicleType: "Sedan",
        chassisNumber: "WBAJC71070G891234",
        odometer: "63,800 km"
      }
    ]
  },
  {
    id: "CUST-005",
    name: "Meera Nambiar",
    phone: "+91 91234 56789",
    email: "meera.nambiar@nambiardesign.com",
    address: "402 Royal Palms, Madhapur, Hyderabad - 500081",
    gstin: "",
    createdAt: "2026-01-12",
    vehicles: [
      {
        id: "VEH-107",
        vehicleNumber: "TS 09 EQ 7788",
        brand: "Volvo",
        model: "XC60 B5 Inscription",
        fuelType: "Hybrid",
        vehicleType: "SUV",
        chassisNumber: "YV4A22PK6M1098765",
        odometer: "19,400 km"
      }
    ]
  }
];

export const initialServices = [
  {
    id: "SRV-001",
    name: "Car Water Wash",
    description: "High-pressure foam wash, underbody chassis cleaning, tyre dressing and streak-free exterior rinse.",
    category: "Washing & Cleaning",
    price: 1200,
    gstPercentage: 18,
    estimatedDuration: "45 mins",
    status: "Active"
  },
  {
    id: "SRV-002",
    name: "Interior Cleaning",
    description: "Deep steam sanitization, upholstery shampooing, dashboard UV conditioning and boot vacuuming.",
    category: "Detailing",
    price: 3500,
    gstPercentage: 18,
    estimatedDuration: "2 hours",
    status: "Active"
  },
  {
    id: "SRV-003",
    name: "Exterior Polishing",
    description: "3-stage machine cut, swirl mark removal and high-gloss polymer sealant protection.",
    category: "Detailing",
    price: 6500,
    gstPercentage: 18,
    estimatedDuration: "3.5 hours",
    status: "Active"
  },
  {
    id: "SRV-004",
    name: "Engine Oil Change",
    description: "Complete engine oil draining, filter replacement, sump washer renewal and electronic oil level calibration.",
    category: "Periodic Maintenance",
    price: 1800,
    gstPercentage: 18,
    estimatedDuration: "1 hour",
    status: "Active"
  },
  {
    id: "SRV-005",
    name: "General Service",
    description: "Comprehensive 60-point mechanical checkup, fluid top-ups, spark plug clean, brake inspection & road test.",
    category: "Periodic Maintenance",
    price: 4800,
    gstPercentage: 18,
    estimatedDuration: "4 hours",
    status: "Active"
  },
  {
    id: "SRV-006",
    name: "AC Service",
    description: "Evaporator coil cleaning, cabin filter replacement, R134a/R1234yf gas leak test and recharge.",
    category: "Electrical & AC",
    price: 3800,
    gstPercentage: 18,
    estimatedDuration: "2 hours",
    status: "Active"
  },
  {
    id: "SRV-007",
    name: "Wheel Alignment",
    description: "Computerized 3D 4-wheel laser alignment, toe/camber/caster calibration for optimal tyre longevity.",
    category: "Wheel & Tyre",
    price: 1200,
    gstPercentage: 18,
    estimatedDuration: "40 mins",
    status: "Active"
  },
  {
    id: "SRV-008",
    name: "Wheel Balancing",
    description: "High-speed computerized dynamic wheel balancing with precision zinc weights (all 4 wheels).",
    category: "Wheel & Tyre",
    price: 1400,
    gstPercentage: 18,
    estimatedDuration: "45 mins",
    status: "Active"
  },
  {
    id: "SRV-009",
    name: "Engine Repair",
    description: "Complete computerized diagnostic scanning, timing belt/chain adjustment, valve clearing & overhaul.",
    category: "Mechanical Repair",
    price: 15500,
    gstPercentage: 18,
    estimatedDuration: "8 hours",
    status: "Active"
  },
  {
    id: "SRV-010",
    name: "Denting and Painting",
    description: "High-precision paintless dent removal (PDR), paint booth baking and OEM clear coat matching per panel.",
    category: "Body Shop",
    price: 8500,
    gstPercentage: 18,
    estimatedDuration: "24 hours",
    status: "Active"
  },
  {
    id: "SRV-011",
    name: "Ceramic Coating 9H Pro",
    description: "3-layer 9H nano-matrix ceramic protection with 3 years hydrophobic paint warranty.",
    category: "Detailing",
    price: 28000,
    gstPercentage: 18,
    estimatedDuration: "12 hours",
    status: "Active"
  },
  {
    id: "SRV-012",
    name: "Brake System Overhaul",
    description: "Brake caliper sliding pin greasing, rotor skim machining, bleed & DOT4 hydraulic flush.",
    category: "Mechanical Repair",
    price: 3200,
    gstPercentage: 18,
    estimatedDuration: "2.5 hours",
    status: "Active"
  }
];

export const initialSpareParts = [
  {
    id: "PRT-101",
    name: "Fully Synthetic Engine Oil 5W-40 (4L)",
    partNumber: "CAS-EDG-5W40-4L",
    brand: "Castrol",
    category: "Lubricants & Fluids",
    hsnCode: "27101980",
    purchasePrice: 2800,
    sellingPrice: 4200,
    availableQuantity: 4, // LOW STOCK (min is 10)
    minimumStockLevel: 10,
    gstPercentage: 18
  },
  {
    id: "PRT-102",
    name: "High Flow Spin-On Oil Filter",
    partNumber: "BOS-OF-8921",
    brand: "Bosch",
    category: "Filters",
    hsnCode: "84212300",
    purchasePrice: 550,
    sellingPrice: 950,
    availableQuantity: 28,
    minimumStockLevel: 8,
    gstPercentage: 18
  },
  {
    id: "PRT-103",
    name: "Front Ceramic Brake Pad Set",
    partNumber: "BRM-BP-4412",
    brand: "Brembo",
    category: "Braking System",
    hsnCode: "87083000",
    purchasePrice: 5400,
    sellingPrice: 8500,
    availableQuantity: 3, // LOW STOCK (min is 6)
    minimumStockLevel: 6,
    gstPercentage: 18
  },
  {
    id: "PRT-104",
    name: "Activated Charcoal Cabin Pollen Filter",
    partNumber: "MAN-CF-3301",
    brand: "Mann-Filter",
    category: "Filters",
    hsnCode: "84213920",
    purchasePrice: 950,
    sellingPrice: 1750,
    availableQuantity: 16,
    minimumStockLevel: 5,
    gstPercentage: 18
  },
  {
    id: "PRT-105",
    name: "Laser Iridium Spark Plug (Pack of 4)",
    partNumber: "NGK-SP-ILZKR",
    brand: "NGK",
    category: "Ignition & Electrical",
    hsnCode: "85111000",
    purchasePrice: 2400,
    sellingPrice: 3800,
    availableQuantity: 18,
    minimumStockLevel: 8,
    gstPercentage: 18
  },
  {
    id: "PRT-106",
    name: "Engine Air Intake Filter Element",
    partNumber: "BOS-AF-5520",
    brand: "Bosch",
    category: "Filters",
    hsnCode: "84213100",
    purchasePrice: 750,
    sellingPrice: 1400,
    availableQuantity: 14,
    minimumStockLevel: 6,
    gstPercentage: 18
  },
  {
    id: "PRT-107",
    name: "Synthetic DOT 4 Brake Fluid (1L)",
    partNumber: "MOB-BF-DOT4",
    brand: "Mobil 1",
    category: "Lubricants & Fluids",
    hsnCode: "38190010",
    purchasePrice: 420,
    sellingPrice: 750,
    availableQuantity: 24,
    minimumStockLevel: 6,
    gstPercentage: 18
  },
  {
    id: "PRT-108",
    name: "Aerotwin Performance Wiper Blade Pair 24/18",
    partNumber: "BOS-WB-AERO",
    brand: "Bosch",
    category: "Accessories",
    hsnCode: "85124000",
    purchasePrice: 1100,
    sellingPrice: 1950,
    availableQuantity: 15,
    minimumStockLevel: 5,
    gstPercentage: 18
  },
  {
    id: "PRT-109",
    name: "Long-Life OAT Radiator Coolant Premix (5L)",
    partNumber: "MOT-COOL-5L",
    brand: "Motul",
    category: "Lubricants & Fluids",
    hsnCode: "38200000",
    purchasePrice: 1250,
    sellingPrice: 2100,
    availableQuantity: 2, // LOW STOCK (min is 6)
    minimumStockLevel: 6,
    gstPercentage: 18
  },
  {
    id: "PRT-110",
    name: "High Carbon Front Brake Disc Rotor (Pair)",
    partNumber: "BRM-DR-7801",
    brand: "Brembo",
    category: "Braking System",
    hsnCode: "87083000",
    purchasePrice: 9200,
    sellingPrice: 14500,
    availableQuantity: 8,
    minimumStockLevel: 4,
    gstPercentage: 18
  }
];

export const initialInvoices = [
  {
    id: "inv-2026-001",
    invoiceNumber: "SRC-2026-001",
    date: "2026-11-20",
    jobCardNumber: "JC-2026-1041",
    invoiceType: "Tax Invoice",
    
    // Customer Info
    customerId: "CUST-001",
    customer: {
      name: "Vikramaditya Reddy",
      phone: "+91 98765 43210",
      email: "vikram.reddy@hyderabadgroup.com",
      address: "Villa 14, Palm Meadows, Jubilee Hills, Hyderabad - 500033",
      gstin: "36AAECR4921K1ZN"
    },
    
    // Vehicle Info
    vehicleId: "VEH-101",
    vehicle: {
      regNumber: "TS 09 EA 4589",
      brand: "Mercedes-Benz",
      model: "E-Class E 220d AMG Line",
      odometer: "34,500 km"
    },
    
    // Services Rendered
    services: [
      {
        id: "srv-row-1",
        serviceId: "SRV-005",
        name: "General Service",
        quantity: 1,
        rate: 4800,
        discount: 0,
        gst: 18,
        amount: 5664
      },
      {
        id: "srv-row-2",
        serviceId: "SRV-007",
        name: "Wheel Alignment",
        quantity: 1,
        rate: 1200,
        discount: 200,
        gst: 18,
        amount: 1180
      }
    ],
    
    // Spare Parts Supplied
    spareParts: [
      {
        id: "part-row-1",
        partId: "PRT-101",
        name: "Fully Synthetic Engine Oil 5W-40 (4L)",
        partNumber: "CAS-EDG-5W40-4L",
        quantity: 1,
        unitPrice: 4200,
        discount: 200,
        gst: 18,
        amount: 4720
      },
      {
        id: "part-row-2",
        partId: "PRT-102",
        name: "High Flow Spin-On Oil Filter",
        partNumber: "BOS-OF-8921",
        quantity: 1,
        unitPrice: 950,
        discount: 0,
        gst: 18,
        amount: 1121
      }
    ],
    
    // Summary
    serviceSubtotal: 5800,
    sparePartsSubtotal: 4950,
    grossTotal: 10750,
    discountAmount: 400,
    taxableAmount: 10750,
    cgst: 967.5,
    sgst: 967.5,
    igst: 0,
    roundOff: 0,
    grandTotal: 12685,
    totalAmount: 12685,
    
    // Payment Details
    paymentMethod: "UPI",
    amountPaid: 12685,
    balanceAmount: 0,
    status: "Paid",
    paymentStatus: "Paid",
    transactionId: "UPI/632190823410/HDFC",
    notes: "Regular 35,000 KM scheduled service completed with OEM Mercedes specifications."
  },
  {
    id: "inv-2026-002",
    invoiceNumber: "SRC-2026-002",
    date: "2026-11-21",
    jobCardNumber: "JC-2026-1042",
    invoiceType: "Tax Invoice",
    
    customerId: "CUST-002",
    customer: {
      name: "Rajesh Sharma",
      phone: "+91 98480 12345",
      email: "rajesh.sharma@apexlogistics.in",
      address: "Flat 9B, Horizon Towers, Gachibowli, Hyderabad - 500032",
      gstin: "36AAACH7890P1ZQ"
    },
    
    vehicleId: "VEH-103",
    vehicle: {
      regNumber: "TS 07 HK 9081",
      brand: "BMW",
      model: "M340i xDrive 3.0L",
      odometer: "26,800 km"
    },
    
    services: [
      {
        id: "srv-row-3",
        serviceId: "SRV-012",
        name: "Brake System Overhaul",
        quantity: 1,
        rate: 3200,
        discount: 0,
        gst: 18,
        amount: 3776
      }
    ],
    
    spareParts: [
      {
        id: "part-row-3",
        partId: "PRT-103",
        name: "Front Ceramic Brake Pad Set",
        partNumber: "BRM-BP-4412",
        quantity: 1,
        unitPrice: 8500,
        discount: 500,
        gst: 18,
        amount: 9440
      },
      {
        id: "part-row-4",
        partId: "PRT-107",
        name: "Synthetic DOT 4 Brake Fluid (1L)",
        partNumber: "MOB-BF-DOT4",
        quantity: 1,
        unitPrice: 750,
        discount: 0,
        gst: 18,
        amount: 885
      }
    ],
    
    serviceSubtotal: 3200,
    sparePartsSubtotal: 8750,
    grossTotal: 11950,
    discountAmount: 500,
    taxableAmount: 11950,
    cgst: 1075.5,
    sgst: 1075.5,
    igst: 0,
    roundOff: 0,
    grandTotal: 14101,
    totalAmount: 14101,
    
    paymentMethod: "Card",
    amountPaid: 14101,
    balanceAmount: 0,
    status: "Paid",
    paymentStatus: "Paid",
    transactionId: "POS-HDFC-991204",
    notes: "High performance Brembo ceramic brake pads installed. 500 KM bed-in required."
  },
  {
    id: "inv-2026-003",
    invoiceNumber: "SRC-2026-003",
    date: "2026-11-22",
    jobCardNumber: "JC-2026-1043",
    invoiceType: "Tax Invoice",
    
    customerId: "CUST-003",
    customer: {
      name: "Sneha Rao",
      phone: "+91 99890 67890",
      email: "sneha.rao@zenithtech.io",
      address: "Plot 89, Financial District, Nanakramguda, Hyderabad - 500075",
      gstin: ""
    },
    
    vehicleId: "VEH-104",
    vehicle: {
      regNumber: "TS 08 EM 3344",
      brand: "Audi",
      model: "A6 45 TFSI Technology",
      odometer: "42,100 km"
    },
    
    services: [
      {
        id: "srv-row-4",
        serviceId: "SRV-006",
        name: "AC Service",
        quantity: 1,
        rate: 3800,
        discount: 0,
        gst: 18,
        amount: 4484
      },
      {
        id: "srv-row-5",
        serviceId: "SRV-002",
        name: "Interior Cleaning",
        quantity: 1,
        rate: 3500,
        discount: 300,
        gst: 18,
        amount: 3776
      }
    ],
    
    spareParts: [
      {
        id: "part-row-5",
        partId: "PRT-104",
        name: "Activated Charcoal Cabin Pollen Filter",
        partNumber: "MAN-CF-3301",
        quantity: 1,
        unitPrice: 1750,
        discount: 0,
        gst: 18,
        amount: 2065
      }
    ],
    
    serviceSubtotal: 7000,
    sparePartsSubtotal: 1750,
    grossTotal: 8750,
    discountAmount: 300,
    taxableAmount: 8750,
    cgst: 787.5,
    sgst: 787.5,
    igst: 0,
    roundOff: 0,
    grandTotal: 10325,
    totalAmount: 10325,
    
    paymentMethod: "Bank Transfer",
    amountPaid: 5000,
    balanceAmount: 5325,
    status: "Partial",
    paymentStatus: "Partial",
    transactionId: "NEFT-HDFC26112290",
    notes: "Balance ₹5,325 scheduled for NEFT settlement on Monday."
  },
  {
    id: "inv-2026-004",
    invoiceNumber: "SRC-2026-004",
    date: "2026-11-23",
    jobCardNumber: "JC-2026-1044",
    invoiceType: "Tax Invoice",
    
    customerId: "CUST-004",
    customer: {
      name: "Arvind Kumar",
      phone: "+91 94400 98765",
      email: "arvind.kumar@kumbuilders.com",
      address: "Road No 10, Banjara Hills, Hyderabad - 500034",
      gstin: "36ABCPK5432R1ZF"
    },
    
    vehicleId: "VEH-105",
    vehicle: {
      regNumber: "TS 10 AB 1234",
      brand: "Land Rover",
      model: "Range Rover Velar R-Dynamic",
      odometer: "51,200 km"
    },
    
    services: [
      {
        id: "srv-row-6",
        serviceId: "SRV-010",
        name: "Denting and Painting",
        quantity: 2,
        rate: 8500,
        discount: 1000,
        gst: 18,
        amount: 18880
      },
      {
        id: "srv-row-7",
        serviceId: "SRV-003",
        name: "Exterior Polishing",
        quantity: 1,
        rate: 6500,
        discount: 500,
        gst: 18,
        amount: 7080
      }
    ],
    
    spareParts: [],
    
    serviceSubtotal: 22000,
    sparePartsSubtotal: 0,
    grossTotal: 22000,
    discountAmount: 1500,
    taxableAmount: 22000,
    cgst: 1980,
    sgst: 1980,
    igst: 0,
    roundOff: 0,
    grandTotal: 25960,
    totalAmount: 25960,
    
    paymentMethod: "Bank Transfer",
    amountPaid: 0,
    balanceAmount: 25960,
    status: "Unpaid",
    paymentStatus: "Unpaid",
    transactionId: "",
    notes: "Door panel and rear quarter dent repair and ceramic gloss buffing completed."
  },
  {
    id: "inv-2026-005",
    invoiceNumber: "SRC-2026-005",
    date: "2026-11-23",
    jobCardNumber: "JC-2026-1045",
    invoiceType: "Tax Invoice",
    
    customerId: "CUST-005",
    customer: {
      name: "Meera Nambiar",
      phone: "+91 91234 56789",
      email: "meera.nambiar@nambiardesign.com",
      address: "402 Royal Palms, Madhapur, Hyderabad - 500081",
      gstin: ""
    },
    
    vehicleId: "VEH-107",
    vehicle: {
      regNumber: "TS 09 EQ 7788",
      brand: "Volvo",
      model: "XC60 B5 Inscription",
      odometer: "19,400 km"
    },
    
    services: [
      {
        id: "srv-row-8",
        serviceId: "SRV-001",
        name: "Car Water Wash",
        quantity: 1,
        rate: 1200,
        discount: 0,
        gst: 18,
        amount: 1416
      },
      {
        id: "srv-row-9",
        serviceId: "SRV-007",
        name: "Wheel Alignment",
        quantity: 1,
        rate: 1200,
        discount: 0,
        gst: 18,
        amount: 1416
      },
      {
        id: "srv-row-10",
        serviceId: "SRV-008",
        name: "Wheel Balancing",
        quantity: 1,
        rate: 1400,
        discount: 0,
        gst: 18,
        amount: 1652
      }
    ],
    
    spareParts: [
      {
        id: "part-row-6",
        partId: "PRT-108",
        name: "Aerotwin Performance Wiper Blade Pair 24/18",
        partNumber: "BOS-WB-AERO",
        quantity: 1,
        unitPrice: 1950,
        discount: 0,
        gst: 18,
        amount: 2301
      }
    ],
    
    serviceSubtotal: 3800,
    sparePartsSubtotal: 1950,
    grossTotal: 5750,
    discountAmount: 0,
    taxableAmount: 5750,
    cgst: 517.5,
    sgst: 517.5,
    igst: 0,
    roundOff: 0,
    grandTotal: 6785,
    totalAmount: 6785,
    
    paymentMethod: "Cash",
    amountPaid: 6785,
    balanceAmount: 0,
    status: "Paid",
    paymentStatus: "Paid",
    transactionId: "CASH-REC-231105",
    notes: "Front wiper pair replacement and seasonal monsoon inspection."
  }
];

export const initialCustomerActivities = [
  {
    id: "ACT-001",
    customerName: "Vikramaditya Reddy",
    vehicle: "Mercedes-Benz E-Class (TS 09 EA 4589)",
    serviceSummary: "General Service & Synthetic Oil Change",
    time: "35 mins ago",
    amount: 12685,
    status: "Completed",
    advisor: "Rahul Deshmukh"
  },
  {
    id: "ACT-002",
    customerName: "Rajesh Sharma",
    vehicle: "BMW M340i (TS 07 HK 9081)",
    serviceSummary: "Brembo Ceramic Front Brake Pads Replacement",
    time: "2 hours ago",
    amount: 14101,
    status: "Completed",
    advisor: "Rahul Deshmukh"
  },
  {
    id: "ACT-003",
    customerName: "Sneha Rao",
    vehicle: "Audi A6 (TS 08 EM 3344)",
    serviceSummary: "AC Sanitization & Cabin Charcoal Filter Replacement",
    time: "3.5 hours ago",
    amount: 10325,
    status: "Partial Payment",
    advisor: "Mohammed Irfan"
  },
  {
    id: "ACT-004",
    customerName: "Arvind Kumar",
    vehicle: "Range Rover Velar (TS 10 AB 1234)",
    serviceSummary: "Panel Denting, Paint Booth Curing & High-Gloss Buff",
    time: "5 hours ago",
    amount: 25960,
    status: "In Progress / Pending Payment",
    advisor: "Vikram Singhania"
  },
  {
    id: "ACT-005",
    customerName: "Meera Nambiar",
    vehicle: "Volvo XC60 (TS 09 EQ 7788)",
    serviceSummary: "Foam Wash, 3D Wheel Alignment & Wiper Replacement",
    time: "6 hours ago",
    amount: 6785,
    status: "Completed",
    advisor: "Rahul Deshmukh"
  }
];
