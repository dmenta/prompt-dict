// import { Title } from "@angular/platform-browser";
// import { Prompt } from "../src/app/features/prompts/prompt";

// const trabajoProfesion = {
//   titlegrupo: "Trabajo y Profesión",
//   prompts: [
//     {
//       titulo: "El Reescritor de Currículums Según el Puesto",
//       descripcion: "Adapta el currículum a ofertas de trabajo específicas, resaltando lo relevante para cada empresa.",
//       autor: "Santiago Bilinkis",
//       prompt:
//         "Actuá como un experto en recursos humanos con experiencia en selección. Te voy a mostrar mi CV actual y una oferta de trabajo a la que quiero aplicar. Ayudame a reescribir mi currículum enfocándome en lo que esa empresa busca, resaltando lo más relevante y adaptando el tono si hace falta.",
//     },
//     {
//       titulo: "El Simulador de Respuestas para Entrevistas de Trabajo",
//       descripcion:
//         "Simula entrevistas laborales, proporcionando feedback para mejorar claridad, impacto y confianza en las respuestas.",
//       autor: "Santiago Bilinkis",
//       prompt:
//         "Actuá como un entrevistador exigente para un puesto de [nombre del rol]. Haceme preguntas difíciles típicas de esa entrevista y después dame feedback sobre mis respuestas. Ayudame a mejorar la claridad, el impacto y la confianza.",
//     },
//     {
//       titulo: "El Negociador que Te Ayuda a Pedir Mejor",
//       descripcion:
//         "Ayuda a estructurar propuestas convincentes para negociaciones laborales, como aumentos o cambios de horario.",
//       autor: "Santiago Bilinkis",
//       prompt:
//         "Actuá como un asesor experto en negociación. Quiero pedir [aumento / cambio de horario / presupuesto / permiso especial]. Ayudame a armar una propuesta que sea convincente, empática y difícil de rechazar. Quiero sonar firme pero razonable. Mostrame distintos enfoques según el perfil de la persona a la que se lo voy a decir.",
//     },
//     {
//       titulo: "Planificación de Clases de Biología",
//       descripcion: "Ayuda a docentes a planificar clases, incluyendo temas, actividades y evaluaciones.",
//       autor: "Patricia Ceriani",
//       prompt:
//         "Soy profesora de Biología de 1° año de Secundaria, necesito planificar mis próximas 12 clases. Cada clase consta de dos módulos de 40 minutos. En el primer módulo quiero explicar el tema y dar lugar a preguntas. En el segundo módulo realizar una actividad con los alumnos. Los temas que necesito desarrollar son los siguientes: UNIDAD 1: Seres vivos, unidad y diversidad. [...] UNIDAD 2: Los seres vivos como sistemas abiertos, intercambios de materia y energía. [...] ¿Puedes realizar la planificación teniendo en cuenta que al finalizar cada unidad debo tomar una evaluación que demanda el tiempo de dos módulos?",
//     },
//     {
//       titulo: "Generación de Presentación de Marketing",
//       descripcion:
//         "Crea el contenido para presentaciones de marketing, incluyendo texto para diapositivas y búsqueda de imágenes.",
//       autor: "Patricia Ceriani",
//       prompt:
//         "Tengo que realizar una presentación sobre la importancia de la comunicación en marketing ¿puedes escribir el texto de 10 diapositivas y el texto necesario para buscar imágenes en la web para cada una de ellas?",
//     },
//     {
//       titulo: "Análisis de Documentos y Hoja de Cálculo",
//       descripcion: "Analiza datos en hojas de cálculo, realizando cálculos, filtrados y generando gráficos.",
//       autor: "Patricia Ceriani",
//       prompt:
//         "(Ejemplo de uso de capacidades de análisis) Puedes pedir a ChatGPT-4 que: Calcule el total de ventas por producto. Determine el promedio de ventas mensuales. Cree un gráfico de barras que compare las ventas totales de cada producto. Genere un gráfico de líneas que muestre la tendencia de ventas a lo largo del tiempo.",
//     },
//     {
//       titulo: "Generación de Textos de Venta para Redes Sociales",
//       descripcion: "Escribe textos de venta para publicaciones en Instagram, adaptados a negocios específicos.",
//       autor: "Patricia Ceriani",
//     },
//     {
//       titulo: "Generación de Frases Motivacionales para Servicios",
//       descripcion: "Crea frases o preguntas para atraer clientes a servicios profesionales.",
//       autor: "Patricia Ceriani",
//       prompt:
//         "Soy abogada y me especializo en mediación de conflictos, ¿me podrías escribir 5 frases o preguntas que motiven a las personas a contratar mis servicios?",
//     },
//     {
//       titulo: "Generación de Nombres o Slogans para Eventos",
//       descripcion: "Sugiere nombres creativos para eventos o negocios.",
//       autor: "Patricia Ceriani",
//       prompt:
//         "Estoy realizando en la Ciudad de Buenos Aires un espectáculo de tango, pretendo convocar a turistas de todo el mundo a una experiencia inmersiva en el Buenos Aires del arrabal, la libertad y las emociones. ¿Podés sugerirme 5 nombres para el espectáculo?",
//     },
//     {
//       titulo: "Generación de Preguntas para Entrevistas Periodísticas",
//       descripcion: "Sugiere preguntas esenciales para entrevistas con figuras públicas.",
//       autor: "Patricia Ceriani",
//       prompt:
//         "Soy periodista y voy a entrevistar al escritor Ken Follet en su paso por la Argentina, ¿qué preguntas te parece que no deben faltar en mi entrevista?",
//     },
//     {
//       titulo: "Generación de Correspondencia/Email de Presentación",
//       descripcion: "Redacta correos electrónicos profesionales de presentación.",
//       autor: "Patricia Ceriani",
//       prompt:
//         "Tengo que enviarle un mail presentándome, mi nombre es Edgardo Barranco y soy especialista en noticias literarias, escribo una columna en el portal de noticias Infobae. Y adelantándole los temas sobre los que me gustaría que trate la entrevista. Y por supuesto agradecerle esta gran oportunidad",
//     },
//     {
//       titulo: "Planificación de Posteos en Redes Sociales para Empresas",
//       descripcion:
//         "Planifica publicaciones en redes sociales para empresas, incluyendo frases motivacionales y sugerencias de imágenes.",
//       autor: "Patricia Ceriani",
//       prompt:
//         "Podrías planificar los post de Instagram y Facebook para una semana para promocionar mi empresa de turismo de aventura. La empresa se llama Épico y necesito que incluyas frases motivacionales y sugieras fotografías.",
//     },
//     {
//       titulo: "Creación de Rúbricas",
//       descripcion: "Ayuda a diseñar rúbricas detalladas para evaluar trabajos de estudiantes.",
//       autor: "Patricia Ceriani",
//       prompt:
//         "Necesito que me ayudes a crear una evaluación de 10 preguntas sobre la fotosíntesis. La evaluación debe incluir 5 preguntas de desarrollo y 5 de opción múltiple. Los temas a cubrir son: las etapas de la fotosíntesis, los pigmentos involucrados, la ecuación química de la fotosíntesis, los factores que afectan la fotosíntesis y la importancia de la fotosíntesis para los ecosistemas. También necesito una rúbrica para evaluar las preguntas de desarrollo y una lista de cotejo para las preguntas de opción múltiple.",
//     },
//     {
//       titulo: "Creación de Listas de Cotejo",
//       descripcion: "Genera listas de cotejo para verificar el cumplimiento de criterios específicos.",
//       autor: "Patricia Ceriani",
//       prompt: "Sobre la misma evaluación puedes crear una lista de cotejo?",
//     },
//     {
//       titulo: "Creación de Listas de Apreciación",
//       descripcion: "Crea listas de apreciación para evaluar el desempeño de estudiantes en diferentes aspectos.",
//       autor: "Patricia Ceriani",
//       prompt: "Ahora crea la lista de apreciación.",
//     },
//     {
//       titulo: "Modificación de Rúbrica según Taxonomía de Bloom",
//       descripcion: "Solicita modificaciones a una rúbrica basándose en la Taxonomía de Bloom.",
//       autor: "Patricia Ceriani",
//       prompt: "Teniendo en cuenta la taxonomía de Bloom, cambiarías algo de la rúbrica?",
//     },
//     {
//       titulo: "Recomendación sobre Planificación de Clases con ChatGPT",
//       descripcion: "Solicita sugerencias adicionales para planificar clases utilizando ChatGPT y sus capacidades.",
//       autor: "Patricia Ceriani",
//       prompt: "¿Podrías sugerirme algo más sobre la planificación de clases usando ChatGPT?",
//     },
//     {
//       titulo: "Generación de Trabajo Práctico sobre Fotosíntesis",
//       descripcion:
//         "Diseña trabajos prácticos para estudiantes de secundaria, combinando preguntas de refuerzo con desafíos prácticos.",
//       autor: "Patricia Ceriani",
//       prompt:
//         "Crea un trabajo práctico sobre la fotosíntesis dirigido a estudiantes de secundaria que han comenzado a estudiar biología. Incluye preguntas que refuercen los conceptos básicos y algunos desafíos que requieran aplicar lo aprendido en situaciones prácticas.",
//     },
//     {
//       titulo: "Generación de Preguntas de Opción Múltiple para Examen de Historia",
//       descripcion: "Genera preguntas de opción múltiple para exámenes de historia.",
//       autor: "Patricia Ceriani",
//       prompt:
//         "Genera un conjunto de 10 preguntas de opción múltiple sobre la Revolución Industrial para un examen de historia de nivel secundario. Asegúrate de cubrir los principales eventos, causas y consecuencias.",
//     },
//     {
//       titulo: "Diseño de Caso de Estudio Ambiental",
//       descripcion:
//         "Crea casos de estudio que requieren soluciones a problemas ambientales, considerando impactos económicos, sociales y ecológicos.",
//       autor: "Patricia Ceriani",
//       prompt:
//         "Diseña un caso de estudio en el que los estudiantes deban proponer una solución a un problema ambiental en su comunidad. Involucra variables como el impacto económico, social y ecológico, y pide que justifiquen sus decisiones.",
//     },
//     {
//       titulo: "Creación de Trabajo Práctico de Ciencias Sociales (Redes Sociales)",
//       descripcion:
//         "Desarrolla trabajos prácticos sobre el impacto de las redes sociales en diferentes culturas, presentando múltiples perspectivas.",
//       autor: "Patricia Ceriani",
//       prompt:
//         "Crea un trabajo práctico de ciencias sociales que explore el impacto de las redes sociales en diferentes culturas. Presenta tres perspectivas distintas (por ejemplo, desde el punto de vista de un adolescente, un sociólogo y un empresario) y formula preguntas que inviten a los estudiantes a comparar y contrastar estos puntos de vista.",
//     },
//     {
//       titulo: "Generación de Texto para Excel (Tablas y Gráficos)",
//       descripcion: "Permite crear tablas comparativas, realizar cálculos y generar gráficos en documentos de Excel.",
//       autor: "Patricia Ceriani",
//       prompt:
//         "¿Puedes crear una tabla comparativa que muestre las similitudes y diferencias entre ChatGPT 4o y Bing Copilot? / ¿Podés agregar una columna más en la que hagas el cálculo para saber la densidad de población de cada país? / ¿Puedes crear un gráfico que muestre qué porcentaje del territorio ocupa cada país? / ¿Puedes crear un documento de Excel con estos datos y generar en ese documento el gráfico?",
//     },
//   ] as Prompt[],
// };

// // export default trabajoProfesion;

// //   Herramientas para el Trabajo y la Carrera
// // 📄 El Reescritor de Currículums Según el Puesto
// // Este prompt adapta el currículum a ofertas de trabajo específicas, resaltando lo relevante para cada empresa.
// // Autor: Santiago Bilinkis
// // Prompt:
// // "Actuá como un experto en recursos humanos con experiencia en selección. Te voy a mostrar mi CV actual y una oferta de trabajo a la que quiero aplicar. Ayudame a reescribir mi currículum enfocándome en lo que esa empresa busca, resaltando lo más relevante y adaptando el tono si hace falta."
// // 📄 El Simulador de Respuestas para Entrevistas de Trabajo
// // Este prompt simula entrevistas laborales, proporcionando feedback para mejorar claridad, impacto y confianza en las respuestas.
// // Autor: Santiago Bilinkis
// // Prompt:
// // "Actuá como un entrevistador exigente para un puesto de [nombre del rol]. Haceme preguntas difíciles típicas de esa entrevista y después dame feedback sobre mis respuestas. Ayudame a mejorar la claridad, el impacto y la confianza."
// // 📄 El Negociador que Te Ayuda a Pedir Mejor
// // Este prompt ayuda a estructurar propuestas convincentes para negociaciones laborales, como aumentos o cambios de horario.
// // Autor: Santiago Bilinkis
// // Prompt:
// // "Actuá como un asesor experto en negociación. Quiero pedir [aumento / cambio de horario / presupuesto / permiso especial]. Ayudame a armar una propuesta que sea convincente, empática y difícil de rechazar. Quiero sonar firme pero razonable. Mostrame distintos enfoques según el perfil de la persona a la que se lo voy a decir."
// // 📄 Planificación de Clases de Biología
// // Este prompt ayuda a docentes a planificar clases, incluyendo temas, actividades y evaluaciones.
// // Autor: Patricia Ceriani
// // Prompt:
// // "Soy profesora de Biología de 1° año de Secundaria, necesito planificar mis próximas 12 clases. Cada clase consta de dos módulos de 40 minutos. En el primer módulo quiero explicar el tema y dar lugar a preguntas. En el segundo módulo realizar una actividad con los alumnos. Los temas que necesito desarrollar son los siguientes: UNIDAD 1: Seres vivos, unidad y diversidad. [...] UNIDAD 2: Los seres vivos como sistemas abiertos, intercambios de materia y energía. [...] ¿Puedes realizar la planificación teniendo en cuenta que al finalizar cada unidad debo tomar una evaluación que demanda el tiempo de dos módulos?"
// // 📄 Generación de Presentación de Marketing
// // Este prompt crea el contenido para presentaciones de marketing, incluyendo texto para diapositivas y búsqueda de imágenes.
// // Autor: Patricia Ceriani
// // Prompt:
// // "Tengo que realizar una presentación sobre la importancia de la comunicación en marketing ¿puedes escribir el texto de 10 diapositivas y el texto necesario para buscar imágenes en la web para cada una de ellas?
// // 📄 Análisis de Documentos y Hoja de Cálculo
// // Este prompt analiza datos en hojas de cálculo, realizando cálculos, filtrados y generando gráficos.
// // Autor: Patricia Ceriani
// // Prompt:
// // (Ejemplo de uso de capacidades de análisis) Puedes pedir a ChatGPT-4 que: Calcule el total de ventas por producto. Determine el promedio de ventas mensuales. Cree un gráfico de barras que compare las ventas totales de cada producto. Genere un gráfico de líneas que muestre la tendencia de ventas a lo largo del tiempo.
// // 📄 Generación de Textos de Venta para Redes Sociales
// // Este prompt escribe textos de venta para publicaciones en Instagram, adaptados a negocios específicos.
// // Autor: Patricia Ceriani
// // Prompt:
// // Tengo un emprendimiento de venta de macetas de barro pintadas a mano artesanalmente, escribe 5 textos de venta para post en Instagram.
// // 📄 Generación de Frases Motivacionales para Servicios
// // Este prompt crea frases o preguntas para atraer clientes a servicios profesionales.
// // Autor: Patricia Ceriani
// // Prompt:
// // Soy abogada y me especializo en mediación de conflictos, ¿me podrías escribir 5 frases o preguntas que motiven a las personas a contratar mis servicios?
// // 📄 Generación de Nombres o Slogans para Eventos
// // Este prompt sugiere nombres creativos para eventos o negocios.
// // Autor: Patricia Ceriani
// // Prompt:
// // Estoy realizando en la Ciudad de Buenos Aires un espectáculo de tango, pretendo convocar a turistas de todo el mundo a una experiencia inmersiva en el Buenos Aires del arrabal, la libertad y las emociones. ¿Podés sugerirme 5 nombres para el espectáculo?
// // 📄 Generación de Preguntas para Entrevistas Periodísticas
// // Este prompt sugiere preguntas esenciales para entrevistas con figuras públicas.
// // Autor: Patricia Ceriani
// // Prompt:
// // Soy periodista y voy a entrevistar al escritor Ken Follet en su paso por la Argentina, ¿qué preguntas te parece que no deben faltar en mi entrevista?
// // 📄 Generación de Correspondencia/Email de Presentación
// // Este prompt redacta correos electrónicos profesionales de presentación.
// // Autor: Patricia Ceriani
// // Prompt:
// // Tengo que enviarle un mail presentándome, mi nombre es Edgardo Barranco y soy especialista en noticias literarias, escribo una columna en el portal de noticias Infobae. Y adelantándole los temas sobre los que me gustaría que trate la entrevista. Y por supuesto agradecerle esta gran oportunidad
// // 📄 Planificación de Posteos en Redes Sociales para Empresas
// // Este prompt planifica publicaciones en redes sociales para empresas, incluyendo frases motivacionales y sugerencias de imágenes.
// // Autor: Patricia Ceriani
// // Prompt:
// // Podrías planificar los post de Instagram y Facebook para una semana para promocionar mi empresa de turismo de aventura. La empresa se llama Épico y necesito que incluyas frases motivacionales y sugieras fotografías.
// // 📄 Creación de Rúbricas
// // Este prompt ayuda a diseñar rúbricas detalladas para evaluar trabajos de estudiantes.
// // Autor: Patricia Ceriani
// // Prompt:
// // Necesito que me ayudes a crear una evaluación de 10 preguntas sobre la fotosíntesis. La evaluación debe incluir 5 preguntas de desarrollo y 5 de opción múltiple. Los temas a cubrir son: las etapas de la fotosíntesis, los pigmentos involucrados, la ecuación química de la fotosíntesis, los factores que afectan la fotosíntesis y la importancia de la fotosíntesis para los ecosistemas. También necesito una rúbrica para evaluar las preguntas de desarrollo y una lista de cotejo para las preguntas de opción múltiple.
// // 📄 Creación de Listas de Cotejo
// // Este prompt genera listas de cotejo para verificar el cumplimiento de criterios específicos.
// // Autor: Patricia Ceriani
// // Prompt:
// // Sobre la misma evaluación puedes crear una lista de cotejo?
// // 📄 Creación de Listas de Apreciación
// // Este prompt crea listas de apreciación para evaluar el desempeño de estudiantes en diferentes aspectos.
// // Autor: Patricia Ceriani
// // Prompt:
// // Ahora crea la lista de apreciación.
// // 📄 Modificación de Rúbrica según Taxonomía de Bloom
// // Este prompt solicita modificaciones a una rúbrica basándose en la Taxonomía de Bloom.
// // Autor: Patricia Ceriani
// // Prompt:
// // Teniendo en cuenta la taxonomía de Bloom, cambiarías algo de la rúbrica?
// // 📄 Recomendación sobre Planificación de Clases con ChatGPT
// // Este prompt solicita sugerencias adicionales para planificar clases utilizando ChatGPT.
// // Autor: Patricia Ceriani
// // Prompt:
// // ¿Podrías sugerirme algo más sobre la planificación de clases usando ChatGPT?
// // 📄 Generación de Trabajo Práctico sobre Fotosíntesis
// // Este prompt diseña trabajos prácticos para estudiantes de secundaria, combinando preguntas de refuerzo con desafíos prácticos.
// // Autor: Patricia Ceriani
// // Prompt:
// // Crea un trabajo práctico sobre la fotosíntesis dirigido a estudiantes de secundaria que han comenzado a estudiar biología. Incluye preguntas que refuercen los conceptos básicos y algunos desafíos que requieran aplicar lo aprendido en situaciones prácticas.
// // 📄 Generación de Preguntas de Opción Múltiple para Examen de Historia
// // Este prompt genera preguntas de opción múltiple para exámenes de historia.
// // Autor: Patricia Ceriani
// // Prompt:
// // Genera un conjunto de 10 preguntas de opción múltiple sobre la Revolución Industrial para un examen de historia de nivel secundario. Asegúrate de cubrir los principales eventos, causas y consecuencias.
// // 📄 Diseño de Caso de Estudio Ambiental
// // Este prompt crea casos de estudio que requieren soluciones a problemas ambientales, considerando impactos económicos, sociales y ecológicos.
// // Autor: Patricia Ceriani
// // Prompt:
// // Diseña un caso de estudio en el que los estudiantes deban proponer una solución a un problema ambiental en su comunidad. Involucra variables como el impacto económico, social y ecológico, y pide que justifiquen sus decisiones.
// // 📄 Creación de Trabajo Práctico de Ciencias Sociales (Redes Sociales)
// // Este prompt desarrolla trabajos prácticos sobre el impacto de las redes sociales en diferentes culturas, presentando múltiples perspectivas.
// // Autor: Patricia Ceriani
// // Prompt:
// // Crea un trabajo práctico de ciencias sociales que explore el impacto de las redes sociales en diferentes culturas. Presenta tres perspectivas distintas (por ejemplo, desde el punto de vista de un adolescente, un sociólogo y un empresario) y formula preguntas que inviten a los estudiantes a comparar y contrastar estos puntos de vista.
// // 📄 Generación de Texto para Excel (Tablas y Gráficos)
// // Este prompt permite crear tablas comparativas, realizar cálculos y generar gráficos en documentos de Excel.
// // Autor: Patricia Ceriani
// // Prompt:
// // ¿Puedes crear una tabla comparativa que muestre las similitudes y diferencias entre ChatGPT 4o y Bing Copilot? / ¿Podés agregar una columna más en la que hagas el cálculo para saber la densidad de población de cada país? / ¿Puedes crear un gráfico que muestre qué porcentaje del territorio ocupa cada país? / ¿Puedes crear un documento de Excel con estos datos y generar en ese documento el gráfico?
