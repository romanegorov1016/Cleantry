/**
 * Active «Почему Cleantry» content — mechanism-focused benefits.
 */
export const whyUsCopy = {
  eyebrow: "Почему Cleantry",
  title: "Спокойствие за результат — за счёт понятного процесса",
  description:
    "Мы не обещаем абстрактное качество. Вместо этого заранее согласуем объём работ, приезжаем со своим инвентарём, работаем по чек-листу и проверяем результат перед завершением.",
  ctaLabel: "Рассчитать стоимость",
  ctaHref: "#calculator",
};

export const whyUsBenefits = [
  {
    id: "scope-agreement",
    title: "Согласование списка работ",
    description:
      "До выезда проговариваем, что входит в уборку, какие зоны важны и какие задачи лучше оставить на потом.",
    icon: "clipboard",
  },
  {
    id: "own-supplies",
    title: "Собственные средства и инвентарь",
    description:
      "Привозим необходимые средства и инвентарь с собой — вам не нужно готовить всё заранее.",
    icon: "sparkles",
  },
  {
    id: "checklist",
    title: "Работа по чек-листу",
    description:
      "Идём по согласованному списку задач и уделяем внимание зонам, которые чаще всего остаются недоделанными.",
    icon: "list",
  },
  {
    id: "final-check",
    title: "Проверка результата",
    description:
      "Перед завершением проверяем ключевые зоны, чтобы результат можно было принять без лишнего напряжения.",
    icon: "check",
  },
];

/**
 * Right-side media for «Почему Cleantry».
 * Supported types: image | video | placeholder | component
 *
 * @type {{
 *   type: 'image' | 'video' | 'placeholder' | 'component',
 *   src?: string,
 *   alt?: string,
 *   poster?: string,
 *   title?: string,
 *   description?: string,
 *   component?: import('react').ReactNode,
 * }}
 */
export const whyUsMedia = {
  type: "placeholder",
  title: "Наш подход",
  description:
    "Аккуратно. Понятно. Без ощущения, что за уборкой нужно следить.",
};

/**
 * Archived content from former About + Why Us sections.
 * Kept for reuse — not rendered on the homepage.
 */
export const archivedWhyUsBenefits = [
  {
    id: "trained",
    title: "Аккуратные клинеры",
    description:
      "Команда бережно относится к мебели, поверхностям и личному пространству.",
    icon: "users",
  },
  {
    id: "pricing",
    title: "Прозрачный расчёт",
    description:
      "Объясняем, от чего зависит цена, ещё до подтверждения заказа.",
    icon: "receipt",
  },
  {
    id: "schedule",
    title: "Удобный график",
    description:
      "Разовая, регулярная, срочная уборка — утром, вечером или в выходные.",
    icon: "calendar",
  },
  {
    id: "eco",
    title: "Эко-средства",
    description:
      "По запросу используем более щадящие средства для семей, животных и чувствительных пространств.",
    icon: "leaf",
  },
  {
    id: "quality",
    title: "Контроль качества",
    description:
      "Чек-листы и финальная проверка помогают держать результат стабильным.",
    icon: "check",
  },
  {
    id: "versatile",
    title: "Для дома и бизнеса",
    description:
      "Квартиры, дома, офисы, коммерческие помещения и особые задачи.",
    icon: "building",
  },
];

export const archivedAboutContent = {
  eyebrow: "О Cleantry",
  title: "Мы убираем так, чтобы вам не приходилось всё перепроверять",
  description:
    "Cleantry — это понятная коммуникация, аккуратная работа и результат, на который можно рассчитывать. Мы заранее уточняем детали, приезжаем в согласованное время и убираем по понятному списку задач.",
  highlights: [
    {
      id: "reliability",
      title: "Надёжность",
      text: "Приезжаем в согласованное время и заранее проговариваем, что входит в уборку.",
      icon: "shield",
    },
    {
      id: "communication",
      title: "Понятная коммуникация",
      text: "Уточняем детали до уборки и заранее проговариваем важные моменты.",
      icon: "message",
    },
    {
      id: "control",
      title: "Контроль результата",
      text: "Работаем по чек-листу и обращаем внимание на зоны, которые часто пропускают.",
      icon: "check",
    },
  ],
  stats: [
    { value: "12+", label: "лет опыта" },
    { value: "100%", label: "фокус на результате" },
    { value: "Быстро", label: "отвечаем на заявки" },
  ],
  mediaQuote: {
    eyebrow: "Наш подход",
    text: "Аккуратно. Понятно. Без ощущения, что за уборкой нужно следить.",
  },
  formerWhyUsTitle: "Не просто уборка, а спокойствие за результат",
  formerWhyUsDescription:
    "Сервис построен вокруг доверия, ясности и стабильного качества — чтобы вы могли делегировать уборку и не думать о ней снова.",
};
