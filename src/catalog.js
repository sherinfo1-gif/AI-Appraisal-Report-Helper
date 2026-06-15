export const valuationCatalog = [
  {
    code: "real_estate",
    name: "Недвижимость",
    icon: "⌂",
    description: "Земля, здания, помещения и комплексы недвижимости",
    objectTypes: [
      ["apartment", "Квартира"],
      ["house", "Жилой дом"],
      ["commercial_property", "Коммерческий объект"],
      ["land_parcel", "Земельный участок"],
      ["property_complex", "Комплекс недвижимости"]
    ],
    stages: ["engagement", "documents", "property", "inspection", "market", "approaches", "calculations", "reconciliation", "report", "compliance", "review", "release"]
  },
  {
    code: "equipment",
    name: "Оборудование",
    icon: "⚙",
    description: "Машины, технологические линии и группы оборудования",
    objectTypes: [
      ["machine", "Отдельная машина"],
      ["production_line", "Производственная линия"],
      ["technology_complex", "Технологический комплекс"],
      ["equipment_group", "Группа оборудования"],
      ["special_equipment", "Специальное оборудование"]
    ],
    stages: ["engagement", "documents", "inventory", "condition", "completeness", "market", "obsolescence", "calculations", "reconciliation", "report", "review", "release"]
  },
  {
    code: "vehicles",
    name: "Автотранспорт",
    icon: "▱",
    description: "Легковые, грузовые автомобили, автобусы и автопарки",
    objectTypes: [
      ["passenger_vehicle", "Легковой автомобиль"],
      ["truck", "Грузовой автомобиль"],
      ["bus", "Автобус"],
      ["trailer", "Прицеп или полуприцеп"],
      ["vehicle_fleet", "Автопарк"]
    ],
    stages: ["engagement", "documents", "identification", "inspection", "mileage", "market", "comparables", "depreciation", "result", "report", "review", "release"]
  },
  {
    code: "special_machinery",
    name: "Спецтехника",
    icon: "▰",
    description: "Строительные, дорожные и иные самоходные машины",
    objectTypes: [
      ["construction_machinery", "Строительная техника"],
      ["road_machinery", "Дорожная техника"],
      ["agricultural_machinery", "Сельскохозяйственная техника"],
      ["lifting_machinery", "Подъемная техника"],
      ["machinery_fleet", "Парк спецтехники"]
    ],
    stages: ["engagement", "documents", "identification", "working_equipment", "operating_hours", "condition", "market", "obsolescence", "calculations", "report", "review", "release"]
  },
  {
    code: "business",
    name: "Бизнес",
    icon: "▤",
    description: "Компания, доля участия или направление бизнеса",
    objectTypes: [
      ["company", "100% компании"],
      ["ownership_interest", "Доля участия"],
      ["operating_business", "Действующий бизнес"],
      ["company_group", "Группа компаний"],
      ["business_unit", "Бизнес-направление"]
    ],
    stages: ["engagement", "perimeter", "corporate_documents", "financials", "normalization", "industry", "forecast", "methods", "models", "reconciliation", "report", "release"]
  },
  {
    code: "intangibles",
    name: "Нематериальные активы",
    icon: "◇",
    description: "Бренды, программное обеспечение, патенты и права",
    objectTypes: [
      ["brand", "Товарный знак или бренд"],
      ["software", "Программное обеспечение"],
      ["patent", "Патент или технология"],
      ["license", "Лицензия"],
      ["customer_relationships", "Клиентские отношения"]
    ],
    stages: ["engagement", "identification", "rights", "commercial_use", "useful_life", "benefits", "methods", "calculation", "reconciliation", "report", "review", "release"]
  }
];

export const caseStatuses = {
  draft: "Черновик",
  in_progress: "В работе",
  in_review: "На проверке",
  returned: "Возвращено",
  approved: "Утверждено",
  issued: "Выпущено",
  archived: "В архиве"
};

export const releaseStrategies = {
  unified: "Один объединенный отчет",
  separate: "Отдельные отчеты и общий пакет"
};

export const defaultReportSections = [
  {
    key: "assignment",
    number: "1",
    title: "Задание на оценку",
    origin: "generated",
    content: "Раздел формируется из подтвержденных данных задания и договора. Оценщик может дополнить разрешенные шаблоном формулировки."
  },
  {
    key: "summary",
    number: "2",
    title: "Основные факты и выводы",
    origin: "manual",
    content: "Укажите ключевые характеристики объекта, цель оценки, дату оценки и итоговые выводы."
  },
  {
    key: "assumptions",
    number: "3",
    title: "Допущения и ограничительные условия",
    origin: "template",
    content: "Проверьте применимость общих допущений шаблона и дополните условия, относящиеся к конкретному оценочному делу."
  },
  {
    key: "composition",
    number: "4",
    title: "Состав и описание объекта оценки",
    origin: "generated",
    content: "Опишите состав объекта оценки, оцениваемые права, включенные и исключенные компоненты."
  },
  {
    key: "conclusion",
    number: "6",
    title: "Итоговое заключение",
    origin: "manual",
    content: "Итоговая стоимость будет связана с утвержденными снимками расчетов. До подключения расчетного модуля раздел редактируется вручную."
  },
  {
    key: "appendices",
    number: "7",
    title: "Приложения",
    origin: "template",
    content: "Перечень документов, расчетов, фотографий и рыночных доказательств, включаемых в выпуск."
  }
];

export function getDirection(code) {
  return valuationCatalog.find(direction => direction.code === code);
}

export function getObjectType(directionCode, objectTypeCode) {
  return getDirection(directionCode)?.objectTypes.find(([code]) => code === objectTypeCode);
}
