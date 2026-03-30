/** Datos de contacto y marca (Perú). Ajusta si cambian. */

export const SITE_TAGLINE =
  "Laboratorio técnico especializado en dispositivos Apple";

export const SITE_CONTACT = {
  phoneDisplay: "917-688-459",
  /** Para enlaces tel: y WhatsApp */
  phoneDigits: "51917688459",
  email: "nekofixperu@gmail.com",
  hours: {
    title: "Atención en Nekofix",
    schedule: "Lunes a sábado",
    timeRange: "10:30 am – 8:00 pm",
    appointment: "Atención especializada previa cita",
  },
  social: [
    {
      label: "TikTok",
      href: "https://www.tiktok.com/@nekofix_peru",
    },
    {
      label: "Facebook",
      href: "https://www.facebook.com/nekofixperu",
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/nekofixperu",
    },
  ],
} as const;

export const ABOUT_COPY = {
  mission: {
    title: "Misión",
    icon: "mission" as const,
    body:
      "Diagnosticar, restaurar y certificar dispositivos Apple bajo estándares de precisión técnica, combinando ingeniería, control de calidad y comercialización de equipos verificados, para ofrecer a cada cliente una experiencia donde la confianza no se promete, se demuestra.",
  },
  vision: {
    title: "Visión",
    icon: "vision" as const,
    body:
      "Redefinir el concepto de servicio técnico en el Perú, posicionando a Nekofix como un laboratorio de referencia en reparación avanzada y comercialización de dispositivos Apple certificados, donde cada equipo que sale funciona como debe: sin dudas, sin riesgos.",
  },
  whoWeAre: {
    title: "¿Quiénes somos?",
    paragraphs: [
      "En Nekofix somos un laboratorio técnico especializado en dispositivos Apple, enfocado en la reparación avanzada y la comercialización de equipos reacondicionados y seminuevos certificados.",
      "Trabajamos bajo procesos precisos y controlados, utilizando herramientas profesionales y repuestos de alta calidad para garantizar resultados confiables en cada intervención.",
      "Nuestro compromiso va más allá de reparar o vender: buscamos que cada cliente tenga la seguridad de saber exactamente qué está recibiendo, con total transparencia y respaldo técnico.",
      "En Nekofix, cada equipo es tratado con el nivel de detalle y precisión que exige un estándar profesional.",
    ],
  },
} as const;
