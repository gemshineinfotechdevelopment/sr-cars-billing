// Mock data for SR CARS - Luxury Automotive Billing & Dealership Management

export const initialSettings = {
  dealershipName: "SR CARS",
  tagline: "Prestige Automobiles & Performance Center",
  address: "Plot 42, Luxury Motor Boulevard, Jubilee Hills, Hyderabad - 500033",
  phone: "+91 98490 87654",
  email: "billing@srcarsluxury.com",
  website: "www.srcarsluxury.com",
  gstin: "36AABCU9603R1ZM",
  pan: "AABCU9603R",
  invoicePrefix: "SRC-2026-",
  currency: "₹",
  taxRate: 18, // 18% GST default in automotive
  paymentTerms: "Payment due within 7 days of invoice date.",
  bankDetails: {
    bankName: "HDFC Bank Ltd",
    accountName: "SR CARS AUTOMOBILES PVT LTD",
    accountNumber: "50200088921473",
    ifsc: "HDFC0001234",
    branch: "Jubilee Hills Road 36, Hyderabad",
    upiId: "srcars@hdfcbank"
  },
  notes: "Thank you for trusting SR CARS for your luxury automotive needs. All mechanical work carries a 6-month or 10,000 KM limited warranty."
};

export const initialProducts = [
  // Luxury Cars & Pre-Owned Exotics
  {
    id: "prod-1",
    name: "Mercedes-Benz E-Class E 220d AMG Line",
    category: "Vehicles",
    sku: "AUTO-MB-E220D",
    price: 7850000,
    cost: 7200000,
    stock: 2,
    warranty: "2 Years Comprehensive",
    compatibility: "Luxury Sedan / 2024 Model",
    description: "Obsidian Black, Burmester 3D Sound, Panoramic Sunroof, MBUX Infotainment"
  },
  {
    id: "prod-2",
    name: "BMW M340i xDrive 3.0L Turbo",
    category: "Vehicles",
    sku: "AUTO-BMW-M340I",
    price: 7490000,
    cost: 6850000,
    stock: 1,
    warranty: "3 Years BSI Plus",
    compatibility: "Performance Sedan / 2025 Model",
    description: "Dravit Grey Metallic, 382 HP Inline 6, M Sport Brakes, Carbon Mirror Caps"
  },
  {
    id: "prod-3",
    name: "Porsche Macan GTS 2.9L V6 Twin-Turbo",
    category: "Vehicles",
    sku: "AUTO-POR-MACGTS",
    price: 15400000,
    cost: 14100000,
    stock: 1,
    warranty: "2 Years Porsche Approved",
    compatibility: "Luxury SUV / 2024 Model",
    description: "Crayon Finish, Sport Chrono Package, 21-inch RS Spyder Design Wheels"
  },

  // Luxury Detailing & Protection
  {
    id: "prod-4",
    name: "Kavaca 9H Ceramic Shield Pro Coating",
    category: "Detailing",
    sku: "SRV-DET-CER9H",
    price: 45000,
    cost: 18000,
    stock: 45,
    warranty: "3 Years Warranty",
    compatibility: "All Luxury Cars",
    description: "Multi-stage paint correction, 3-layer 9H nano-ceramic matrix, hydrophobic gloss finish"
  },
  {
    id: "prod-5",
    name: "XPEL Ultimate Plus Paint Protection Film (Full Body)",
    category: "Detailing",
    sku: "SRV-DET-PPF-FULL",
    price: 185000,
    cost: 95000,
    stock: 12,
    warranty: "10 Years Manufacturer Warranty",
    compatibility: "Full Vehicle Wrap",
    description: "Self-healing thermoplastic polyurethane PPF, anti-yellowing & optical clarity"
  },
  {
    id: "prod-6",
    name: "Interior Deep Spa & Leather Nourishment",
    category: "Detailing",
    sku: "SRV-DET-LEATH",
    price: 12500,
    cost: 3500,
    stock: 60,
    warranty: "30 Days Freshness",
    compatibility: "Nappa / Merino Leather",
    description: "Swissvax steam sanitization, conditioner balm, dashboard UV anti-glare shield"
  },

  // Periodic Maintenance & Workshop Services
  {
    id: "prod-7",
    name: "Major Annual Periodic Service Package",
    category: "Services",
    sku: "SRV-MNT-MAJOR",
    price: 32000,
    cost: 14000,
    stock: 100,
    warranty: "6 Months / 10,000 KM",
    compatibility: "German & European Luxury Cars",
    description: "Motul synthetic oil replacement, oil filter, air filter, pollen filter, 64-point digital scan"
  },
  {
    id: "prod-8",
    name: "Brembo High Performance Brake Overhaul",
    category: "Services",
    sku: "SRV-BRK-OVERHAUL",
    price: 54000,
    cost: 31000,
    stock: 8,
    warranty: "1 Year / 20,000 KM",
    compatibility: "BMW / Audi / Mercedes",
    description: "Front & rear ceramic low-dust pads, sensor replacement, brake fluid flush DOT 5.1"
  },
  {
    id: "prod-9",
    name: "AC Climate Control Overhaul & Anti-Bacterial Treatment",
    category: "Services",
    sku: "SRV-AC-OVERHAUL",
    price: 16500,
    cost: 6500,
    stock: 30,
    warranty: "1 Year Cooling Warranty",
    compatibility: "Dual & Quad Zone Climate Systems",
    description: "R134a/R1234yf refrigerant evac & recharge, compressor oil, ozone cabin sterilization"
  },

  // Spare Parts & Performance
  {
    id: "prod-10",
    name: "Michelin Pilot Sport 5 (245/45 R19) Tyre",
    category: "Spare Parts",
    sku: "PRT-TYR-MICH-19",
    price: 24500,
    cost: 19500,
    stock: 16,
    warranty: "5 Years Standard",
    compatibility: "19-inch Alloy Wheels",
    description: "Ultra high performance road contact, acoustic foam damping, velvet sidewall"
  },
  {
    id: "prod-11",
    name: "Bilstein B6 Performance Shock Absorber Set",
    category: "Spare Parts",
    sku: "PRT-SUS-BILST",
    price: 88000,
    cost: 62000,
    stock: 4,
    warranty: "2 Years Unlimited Mileage",
    compatibility: "BMW G20 / G30 Chassis",
    description: "Gas pressure monotube technology for heightened driving stability and agility"
  },

  // Accessories & Electronics
  {
    id: "prod-12",
    name: "7D Diamond Quilted Custom Luxury Floor Liners",
    category: "Accessories",
    sku: "ACC-MAT-7D-LUX",
    price: 9500,
    cost: 4200,
    stock: 25,
    warranty: "1 Year Warranty",
    compatibility: "Tailored to Exact Floorpan",
    description: "Waterproof, odor-free, non-slip dual layer detachable curly mat with brass clips"
  },
  {
    id: "prod-13",
    name: "VIOFO A229 Pro 4K HDR Dual Dashcam System",
    category: "Accessories",
    sku: "ACC-ELC-DASH4K",
    price: 28500,
    cost: 19000,
    stock: 9,
    warranty: "18 Months Replacement",
    compatibility: "Universal 12V Hardwire",
    description: "Dual Sony STARVIS 2 sensors, 4K front + 2K rear, 24/7 parking impact monitor, built-in GPS"
  }
];

export const initialInvoices = [
  {
    id: "inv-101",
    invoiceNumber: "SRC-2026-001",
    date: "2026-11-18",
    dueDate: "2026-11-25",
    status: "Paid",
    paymentMethod: "Bank Transfer (NEFT/RTGS)",
    customer: {
      name: "Vikramaditya Singhania",
      company: "Singhania Holdings & Infra",
      phone: "+91 99887 76655",
      email: "v.singhania@singhaniagroup.com",
      address: "Villa 14, Palm Meadows, Whitefield, Bengaluru - 560066",
      gstin: "29AAECS4592K1Z9"
    },
    vehicle: {
      makeModel: "Porsche Macan GTS 2.9L",
      regNumber: "KA 01 MJ 0007",
      vin: "WP1ZZZ95ZPL120894",
      year: "2024",
      odometer: "14,800 KM",
      color: "Crayon Grey"
    },
    items: [
      {
        id: "item-1",
        productId: "prod-5",
        name: "XPEL Ultimate Plus Paint Protection Film (Full Body)",
        category: "Detailing",
        qty: 1,
        unitPrice: 185000,
        taxPercent: 18,
        total: 185000
      },
      {
        id: "item-2",
        productId: "prod-6",
        name: "Interior Deep Spa & Leather Nourishment",
        category: "Detailing",
        qty: 1,
        unitPrice: 12500,
        taxPercent: 18,
        total: 12500
      },
      {
        id: "item-3",
        productId: "prod-13",
        name: "VIOFO A229 Pro 4K HDR Dual Dashcam System",
        category: "Accessories",
        qty: 1,
        unitPrice: 28500,
        taxPercent: 18,
        total: 28500
      }
    ],
    subtotal: 226000,
    discountAmount: 11000, // 5% courtesy concession
    taxableAmount: 215000,
    taxAmount: 38700, // 18% GST (CGST 19350 + SGST 19350)
    totalAmount: 253700,
    notes: "Special treatment conducted for delivery inspection. Complimentary 1-month check-up included."
  },
  {
    id: "inv-102",
    invoiceNumber: "SRC-2026-002",
    date: "2026-11-20",
    dueDate: "2026-11-27",
    status: "Paid",
    paymentMethod: "UPI Instant / IMPS",
    customer: {
      name: "Dr. Ananya Roy",
      company: "Care Diagnostics Ltd",
      phone: "+91 97654 32109",
      email: "ananya.roy@carediag.in",
      address: "Flat 9B, Horizon Towers, Gachibowli, Hyderabad - 500032",
      gstin: "36ABCPR3321L1ZN"
    },
    vehicle: {
      makeModel: "Mercedes-Benz E-Class E 220d",
      regNumber: "TS 09 EU 4499",
      vin: "WDD2130042A894102",
      year: "2023",
      odometer: "38,400 KM",
      color: "Cavansite Blue"
    },
    items: [
      {
        id: "item-1",
        productId: "prod-7",
        name: "Major Annual Periodic Service Package",
        category: "Services",
        qty: 1,
        unitPrice: 32000,
        taxPercent: 18,
        total: 32000
      },
      {
        id: "item-2",
        productId: "prod-8",
        name: "Brembo High Performance Brake Overhaul",
        category: "Services",
        qty: 1,
        unitPrice: 54000,
        taxPercent: 18,
        total: 54000
      },
      {
        id: "item-3",
        productId: "prod-9",
        name: "AC Climate Control Overhaul & Anti-Bacterial Treatment",
        category: "Services",
        qty: 1,
        unitPrice: 16500,
        taxPercent: 18,
        total: 16500
      }
    ],
    subtotal: 102500,
    discountAmount: 5000,
    taxableAmount: 97500,
    taxAmount: 17550,
    totalAmount: 115050,
    notes: "Front brake discs skimmed and bedded. 64-point scan reports clean."
  },
  {
    id: "inv-103",
    invoiceNumber: "SRC-2026-003",
    date: "2026-11-21",
    dueDate: "2026-11-28",
    status: "Pending",
    paymentMethod: "Corporate Wire",
    customer: {
      name: "Rajeshwar Rao",
      company: "Apex Tech Ventures",
      phone: "+91 98112 34567",
      email: "r.rao@apexventures.io",
      address: "Plot 89, Financial District, Nanakramguda, Hyderabad - 500075",
      gstin: "36AAQCA8832M1ZP"
    },
    vehicle: {
      makeModel: "BMW M340i xDrive",
      regNumber: "TS 07 HK 0340",
      vin: "WBA5U7102NFM39210",
      year: "2024",
      odometer: "19,200 KM",
      color: "Tanzanite Blue II"
    },
    items: [
      {
        id: "item-1",
        productId: "prod-10",
        name: "Michelin Pilot Sport 5 (245/45 R19) Tyre",
        category: "Spare Parts",
        qty: 4,
        unitPrice: 24500,
        taxPercent: 18,
        total: 98000
      },
      {
        id: "item-2",
        productId: "prod-11",
        name: "Bilstein B6 Performance Shock Absorber Set",
        category: "Spare Parts",
        qty: 1,
        unitPrice: 88000,
        taxPercent: 18,
        total: 88000
      },
      {
        id: "item-3",
        productId: "prod-4",
        name: "Kavaca 9H Ceramic Shield Pro Coating",
        category: "Detailing",
        qty: 1,
        unitPrice: 45000,
        taxPercent: 18,
        total: 45000
      }
    ],
    subtotal: 231000,
    discountAmount: 12000,
    taxableAmount: 219000,
    taxAmount: 39420,
    totalAmount: 258420,
    notes: "Dynamic wheel alignment and 3D laser road-force balancing completed. Payment expected within terms."
  },
  {
    id: "inv-104",
    invoiceNumber: "SRC-2026-004",
    date: "2026-11-22",
    dueDate: "2026-11-24",
    status: "Overdue",
    paymentMethod: "Credit Card",
    customer: {
      name: "Sanjay Reddy",
      company: "Reddy Real Estate & Infra",
      phone: "+91 90000 12345",
      email: "sanjay@reddyestates.co.in",
      address: "Road No 10, Banjara Hills, Hyderabad - 500034",
      gstin: "36AABCR1290K1ZX"
    },
    vehicle: {
      makeModel: "Range Rover Sport HSE Dynamic",
      regNumber: "TS 10 AB 9999",
      vin: "SALWR2V42KA718902",
      year: "2022",
      odometer: "42,000 KM",
      color: "Santorini Black"
    },
    items: [
      {
        id: "item-1",
        productId: "prod-7",
        name: "Major Annual Periodic Service Package",
        category: "Services",
        qty: 1,
        unitPrice: 32000,
        taxPercent: 18,
        total: 32000
      },
      {
        id: "item-2",
        productId: "prod-12",
        name: "7D Diamond Quilted Custom Luxury Floor Liners",
        category: "Accessories",
        qty: 1,
        unitPrice: 9500,
        taxPercent: 18,
        total: 9500
      }
    ],
    subtotal: 41500,
    discountAmount: 1500,
    taxableAmount: 40000,
    taxAmount: 7200,
    totalAmount: 47200,
    notes: "Payment reminder sent on Nov 22. Awaiting finance clearance."
  },
  {
    id: "inv-105",
    invoiceNumber: "SRC-2026-005",
    date: "2026-11-23",
    dueDate: "2026-11-30",
    status: "Paid",
    paymentMethod: "Online Banking",
    customer: {
      name: "Karan Johar Mehra",
      company: "Mehra Entertainment Network",
      phone: "+91 98200 45678",
      email: "karan@mehranet.com",
      address: "Bungalow 7, Bandra West, Mumbai - 400050",
      gstin: "27AABCM6743P1ZQ"
    },
    vehicle: {
      makeModel: "Mercedes-Benz E-Class E 220d AMG Line",
      regNumber: "MH 02 FJ 0001",
      vin: "WDD2130042A991204",
      year: "2024",
      odometer: "1,200 KM",
      color: "Obsidian Black"
    },
    items: [
      {
        id: "item-1",
        productId: "prod-1",
        name: "Mercedes-Benz E-Class E 220d AMG Line (Vehicle Sale)",
        category: "Vehicles",
        qty: 1,
        unitPrice: 7850000,
        taxPercent: 18,
        total: 7850000
      },
      {
        id: "item-2",
        productId: "prod-5",
        name: "XPEL Ultimate Plus Paint Protection Film (Full Body)",
        category: "Detailing",
        qty: 1,
        unitPrice: 185000,
        taxPercent: 18,
        total: 185000
      }
    ],
    subtotal: 8035000,
    discountAmount: 135000,
    taxableAmount: 7900000,
    taxAmount: 1422000,
    totalAmount: 9322000,
    notes: "Prestige Luxury Delivery with keys ceremony. Full RTO registration and 2-year warranty kit handed over."
  }
];
