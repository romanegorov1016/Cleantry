export const calculatorSteps = [
  { id: "type", label: "Тип уборки" },
  { id: "areas", label: "Зоны" },
  { id: "details", label: "Детали" },
  { id: "summary", label: "Расчёт" },
];

export const serviceTypes = {
  regular: {
    id: "regular",
    label: "Поддерживающая уборка",
    description:
      "Для регулярного поддержания чистоты в квартире или доме.",
    basePrice: 70,
    pricePerSquareMeter: 1.2,
  },
  deep: {
    id: "deep",
    label: "Генеральная уборка",
    description:
      "Глубокая уборка с вниманием к деталям и труднодоступным зонам.",
    basePrice: 120,
    pricePerSquareMeter: 1.8,
  },
  renovation: {
    id: "renovation",
    label: "Уборка после ремонта",
    description:
      "Уборка строительной пыли, следов работ и подготовка помещения к жизни.",
    basePrice: 160,
    pricePerSquareMeter: 2.3,
  },
  office: {
    id: "office",
    label: "Уборка офиса",
    description:
      "Уборка рабочих зон, переговорных, кухни, санузлов и общих пространств.",
    basePrice: 100,
    pricePerSquareMeter: 1.4,
  },
  house: {
    id: "house",
    label: "Уборка дома",
    description: "Уборка частных домов и больших пространств.",
    basePrice: 140,
    pricePerSquareMeter: 1.6,
  },
};

export const cleaningAreas = [
  {
    id: "kitchen",
    label: "Кухня",
    description: "Поверхности, пол, фасады снаружи, раковина",
    price: 25,
  },
  {
    id: "bathroom",
    label: "Санузел",
    description: "Сантехника, зеркала, поверхности, пол",
    price: 25,
  },
  {
    id: "livingRoom",
    label: "Гостиная",
    description: "Пыль, поверхности, пол, порядок в зоне отдыха",
    price: 15,
  },
  {
    id: "bedroom",
    label: "Спальня",
    description: "Пыль, поверхности, пол, аккуратный порядок",
    price: 15,
  },
  {
    id: "hallway",
    label: "Коридор",
    description: "Пол, пыль, входная зона",
    price: 10,
  },
  {
    id: "balcony",
    label: "Балкон",
    description: "Пол, поверхности, базовая уборка зоны",
    price: 20,
  },
];

export const extraServices = [
  { id: "insideFridge", label: "Холодильник внутри", price: 20 },
  { id: "insideOven", label: "Духовка внутри", price: 20 },
  { id: "insideCabinets", label: "Шкафы внутри", price: 25 },
  { id: "microwave", label: "Микроволновка внутри", price: 10 },
  { id: "windowCleaning", label: "Мытьё окон", price: 25 },
  { id: "strongDirt", label: "Сильные загрязнения", price: 40 },
  { id: "ecoProducts", label: "Эко-средства", price: 15 },
  { id: "urgentCleaning", label: "Срочная уборка", price: 45 },
  { id: "petHair", label: "Шерсть животных", price: 25 },
];

export const propertyDefaults = {
  minArea: 20,
  maxArea: 300,
  defaultArea: 65,
  rooms: ["1", "2", "3", "4", "5+"],
  bathrooms: ["1", "2", "3", "4+"],
};

export const frequencyOptions = {
  once: {
    id: "once",
    label: "Разово",
    discount: 0,
  },
  weekly: {
    id: "weekly",
    label: "Еженедельно",
    discount: 0.15,
  },
  biweekly: {
    id: "biweekly",
    label: "Раз в 2 недели",
    discount: 0.1,
  },
  monthly: {
    id: "monthly",
    label: "Ежемесячно",
    discount: 0.05,
  },
};

export const calculatorCurrency = "BYN";

export const calculatorInitialState = {
  serviceType: "regular",
  selectedAreas: ["kitchen", "bathroom", "livingRoom", "bedroom", "hallway"],
  area: 65,
  rooms: "2",
  bathrooms: "1",
  frequency: "once",
  selectedExtras: [],
  customArea: "",
  comment: "",
  contact: {
    name: "",
    phone: "",
    preferredTime: "",
  },
};
