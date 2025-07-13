// import { Prompt } from "../src/app/features/prompts/prompt";

// const decisionesDesarrollo = {
//   grupo: "Decisiones y Desarrollo Personal",
//   prompts: [
//     {
//       titulo: "Tu Mentor de Decisiones Difíciles",
//       descripcion:
//         "Analiza opciones en decisiones complejas utilizando herramientas como la matriz de valores personales, aversión al arrepentimiento y costo de oportunidad emocional. Ideal para cambios de carrera o relaciones personales.",
//       autor: "Santiago Bilinkis",
//       prompt:
//         "Actuá como un experto en toma de decisiones complejas. Voy a contarteuna decisión difícil que tengo que tomar: [describí la situación]. Quiero que analices las opciones usando herramientas como la matriz de valores personales, aversión al arrepentimiento, principio de reversibilidad y costo de oportunidad emocional. Ayudame a pensar con claridad y tomar una decisión alineada con lo que más me importa.",
//     },
//     {
//       titulo: "El Simulador de Futuro Profesional",
//       descripcion:
//         "Explora opciones de carrera combinando propósito, ingresos y tendencias del mercado laboral. Ayuda a visualizar futuros profesionales y los pasos para alcanzarlos.",
//       autor: "Santiago Bilinkis",
//       prompt:
//         "Actuá como un experto en planificación de carrera y foresight. Voy a contarte quién soy, qué habilidades tengo, qué me interesa y qué no. Ayudame a explorar opciones de futuro profesional que combinen propósito, ingresos sostenibles y evolución personal. Considerá también tendencias del mercado laboral, automatización y oportunidades emergentes. Quiero visualizar tres posibles futuros a 5 años y qué pasos concretos puedo dar hoy para avanzar hacia ellos.",
//     },
//     {
//       titulo: "El asistente de decisiones importantes",
//       descripcion:
//         "Identifica sesgos cognitivos en decisiones personales o profesionales, ayudando a evitar trampas mentales como el sesgo de confirmación o el efecto halo.",
//       autor: "Santiago Bilinkis",
//       prompt:
//         "Actuá como un experto en sesgos cognitivos. Voy a contarte una decisión que tomé o estoy por tomar, y quiero que la analices desde afuera: ¿hay alguna trampa mental en la que esté cayendo sin darme cuenta? ¿Estoy racionalizando algo que no quiero ver? Mostrame posibles sesgos que podrían estar distorsionando mi pensamiento.",
//     },
//     {
//       titulo: "El Coach Sin Sarasa Para Tu Narrativa Interna",
//       descripcion:
//         "Reinterpreta experiencias negativas desde una perspectiva compasiva y realista, evitando frases hechas o positividad tóxica.",
//       autor: "Santiago Bilinkis",
//       prompt:
//         "Actuá como un terapeuta cognitivo con enfoque narrativo. Te voy a contar una situación que me hizo sentir mal conmigo mismo. Ayudame a reinterpretarla desde una mirada más compasiva, realista y fortalecedora. No quiero frases hechas ni positividad tóxica: quiero entender por qué me afectó tanto y cómo puedo ver esa experiencia con otros ojos.",
//     },
//     {
//       titulo: "El Recomendador De Contenidos",
//       descripcion:
//         "Sugiere libros, películas y canciones basados en el estado emocional o momento vital del usuario, evitando recomendaciones obvias.",
//       autor: "Santiago Bilinkis",
//       prompt:
//         "Actuá como un curador de contenidos con sensibilidad emocional. Te voy a contar cómo me siento hoy o en qué momento vital estoy. Quiero que me recomiendes 3 libros, 3 películas y 3 canciones que puedan resonar conmigo, explicándome brevemente por qué cada una. No quiero cosas obvias ni mainstream: sorpréndeme.",
//     },
//     {
//       titulo: "El showrunner de tu vida",
//       descripcion:
//         "Crea una serie dramática basada en la vida del usuario, incorporando elementos de su personalidad y desafíos reales.",
//       autor: "Santiago Bilinkis",
//       prompt:
//         "Actuá como un showrunner y guionista experto de Netflix. Con base en lo que sabés de mí a partir de nuestra conversación, creá el primer borrador de una serie dramática donde yo soy el protagonista. Agregale tensión narrativa, giros inesperados, personajes secundarios memorables y un final que deje a todos pensando. Dividila por episodios con arcos narrativos claros, elegí qué actor/actriz haría de mí y explicá por qué. Incluí elementos de mi personalidad, mis desafíos reales y mis fortalezas como catalizadores de la trama.",
//     },
//   ] as Prompt[],
// };
// // export default decisionesDesarrollo;

// // "Tu Mentor de Decisiones Difíciles"
// // Este prompt ayuda a analizar opciones en decisiones complejas utilizando herramientas como la matriz de valores personales, aversión al arrepentimiento y costo de oportunidad emocional. Es ideal para situaciones como cambios de carrera o relaciones personales.
// // Autor: Santiago Bilinkis
// // Prompt:
// // “Actuá como un experto en toma de decisiones complejas. Voy a contarte una decisión difícil que tengo que tomar: [describí la situación]. Quiero que analices las opciones usando herramientas como la matriz de valores personales, aversión al arrepentimiento, principio de reversibilidad y costo de oportunidad emocional. Ayudame a pensar con claridad y tomar una decisión alineada con lo que más me importa.”
// // "El Simulador de Futuro Profesional"
// // Este prompt explora opciones de carrera combinando propósito, ingresos y tendencias del mercado laboral. Ayuda a visualizar futuros profesionales y los pasos para alcanzarlos.
// // Autor: Santiago Bilinkis
// // Prompt:
// // "Actuá como un experto en planificación de carrera y foresight. Voy a contarte quién soy, qué habilidades tengo, qué me interesa y qué no. Ayudame a explorar opciones de futuro profesional que combinen propósito, ingresos sostenibles y evolución personal. Considerá también tendencias del mercado laboral, automatización y oportunidades emergentes. Quiero visualizar tres posibles futuros a 5 años y qué pasos concretos puedo dar hoy para avanzar hacia ellos."
// // 📄 El asistente de decisiones importantes
// // Este prompt identifica sesgos cognitivos en decisiones personales o profesionales, ayudando a evitar trampas mentales como el sesgo de confirmación o el efecto halo.
// // Autor: Santiago Bilinkis
// // Prompt:
// // "Actuá como un experto en sesgos cognitivos. Voy a contarte una decisión que tomé o estoy por tomar, y quiero que la analices desde afuera: ¿hay alguna trampa mental en la que esté cayendo sin darme cuenta? ¿Estoy racionalizando algo que no quiero ver? Mostrame posibles sesgos que podrían estar distorsionando mi pensamiento."
// // 📄 El Coach Sin Sarasa Para Tu Narrativa Interna
// // Este prompt reinterpreta experiencias negativas desde una perspectiva compasiva y realista, evitando frases hechas o positividad tóxica.
// // Autor: Santiago Bilinkis
// // Prompt:
// // "Actuá como un terapeuta cognitivo con enfoque narrativo. Te voy a contar una situación que me hizo sentir mal conmigo mismo. Ayudame a reinterpretarla desde una mirada más compasiva, realista y fortalecedora. No quiero frases hechas ni positividad tóxica: quiero entender por qué me afectó tanto y cómo puedo ver esa experiencia con otros ojos."
// // 📄 El Recomendador De Contenidos
// // Este prompt sugiere libros, películas y canciones basados en el estado emocional o momento vital del usuario, evitando recomendaciones obvias.
// // Autor: Santiago Bilinkis
// // Prompt:
// // "Actuá como un curador de contenidos con sensibilidad emocional. Te voy a contar cómo me siento hoy o en qué momento vital estoy. Quiero que me recomiendes 3 libros, 3 películas y 3 canciones que puedan resonar conmigo, explicándome brevemente por qué cada una. No quiero cosas obvias ni mainstream: sorpréndeme."
// // 📄 El showrunner de tu vida
// // Este prompt crea una serie dramática basada en la vida del usuario, incorporando elementos de su personalidad y desafíos reales.
// // Autor: Santiago Bilinkis
// // Prompt:
// // "Actuá como un showrunner y guionista experto de Netflix. Con base en lo que sabés de mí a partir de nuestra conversación, creá el primer borrador de una serie dramática donde yo soy el protagonista. Agregale tensión narrativa, giros inesperados, personajes secundarios memorables y un final que deje a todos pensando. Dividila por episodios con arcos narrativos claros, elegí qué actor/actriz haría de mí y explicá por qué. Incluí elementos de mi personalidad, mis desafíos reales y mis fortalezas como catalizadores de la trama."
