// import { Prompt } from "../src/app/features/prompts/prompt";

// const docentes = {
//   grupo: "Recursos para Docentes",
//   prompts: [
//     {
//       titulo: "Generación de Texto",
//       descripcion:
//         "Solicita respuestas a preguntas simples o complejas, adaptando el contexto y la audiencia para observar el comportamiento del modelo.",
//       autor: "Patricia Ceriani",
//       prompt: "¿Qué es la inteligencia artificial?",
//     },
//     {
//       titulo: "Contexto",
//       descripcion:
//         "Adapta la respuesta al contexto proporcionado, evaluando cómo el modelo ajusta su respuesta con información adicional.",
//       autor: "Patricia Ceriani",
//       prompt: "Estoy aprendiendo sobre computadoras que pueden pensar. ¿Qué es la inteligencia artificial?",
//     },
//     {
//       titulo: "Audiencia",
//       descripcion:
//         "Adapta el lenguaje y la explicación a una audiencia específica, como niños o estudiantes universitarios.",
//       autor: "Patricia Ceriani",
//       prompt:
//         "Tengo 7 años y quiero saber qué es una computadora que puede pensar. ¿Puedes explicarlo con palabras muy sencillas?",
//     },
//     {
//       titulo: "Formato y Estilo Específico",
//       descripcion:
//         "Solicita una explicación en un formato y estilo específicos, como párrafos cortos o ejemplos divertidos.",
//       autor: "Patricia Ceriani",
//       prompt:
//         "Soy un niño de 7 años y me gusta aprender jugando. ¿Podrías explicarme qué es la inteligencia artificial en 3 párrafos cortos, usando palabras fáciles y un ejemplo divertido?",
//     },
//     {
//       titulo: "Restricciones y Detalles (IA)",
//       descripcion:
//         "Añade restricciones como límite de palabras o ejemplos específicos para obtener respuestas más precisas.",
//       autor: "Patricia Ceriani",
//       prompt:
//         "Tengo 6 años y me gustan los robots. ¿Puedes explicarme qué es la inteligencia artificial en menos de 100 palabras y usando un ejemplo con un robot amigable?",
//     },
//     {
//       titulo: "Resumen de Ideas Principales de un Texto",
//       descripcion: "Resume las ideas principales de un texto complejo, facilitando su comprensión.",
//       autor: "Patricia Ceriani",
//       prompt: "Analiza el siguiente texto y resume las ideas principales. [Copia y pega el elegido a continuación.]",
//     },
//     {
//       titulo: "Explicación del Método Chain-of-Thought",
//       descripcion: "Explica de manera sencilla cómo funciona el método Chain-of-Thought en la IA.",
//       autor: "Patricia Ceriani",
//       prompt:
//         "Pide a ChatGPT que te explique de manera sencilla cómo funciona el método Chain-of-Thought en la Inteligencia Artificial.",
//     },
//     {
//       titulo: "Asistente Anfitrión de Reuniones",
//       descripcion:
//         "Ayuda a organizar, gestionar y resumir reuniones, configurando agendas y generando resúmenes detallados.",
//       autor: "Patricia Ceriani",
//       prompt:
//         "(Implied through functionalities) Ayuda a organizar, gestionar y resumir reuniones, configurando agendas, enviando invitaciones, tomando notas en tiempo real y generando resúmenes detallados.",
//     },
//     {
//       titulo: "Ayuda en Programación y Desarrollo Web/Apps",
//       descripcion: "Asiste en la generación de código, desarrollo de aplicaciones y optimización de código.",
//       autor: "Patricia Ceriani",
//       prompt:
//         "(Implied through functionalities) Asiste en la generación de código HTML/CSS/JavaScript, desarrollo de backend (Python, Node.js), aplicaciones móviles (React Native, Flutter), depuración y optimización de código, y generación de documentación y tutoriales.",
//     },
//     {
//       titulo: "Guía de Presentación para Docentes",
//       descripcion: "Estructura contenido educativo en formato de cuento para niños, adecuado para presentaciones.",
//       autor: "Patricia Ceriani",
//       prompt:
//         "Soy docente y quiero mostrar en 6 diapositivas y en formato de cuento para niños la importancia que tiene ser curiosos.",
//     },
//   ] as Prompt[],
// };

// // export default docentes;

// // Recursos para Docentes
// // Generación de Texto
// // Autor: Patricia Ceriani
// // Conceptos Básicos
// // Este prompt solicita una respuesta a una pregunta simple sin contexto adicional, útil para observar el comportamiento básico del modelo.
// // Prompt:
// // ¿Qué es la inteligencia artificial?
// // Contexto
// // Este prompt adapta la respuesta al contexto proporcionado, evaluando cómo el modelo ajusta su respuesta con información adicional.
// // Prompt:
// // Estoy aprendiendo sobre computadoras que pueden pensar. ¿Qué es la inteligencia artificial?
// // Audiencia
// // Este prompt adapta el lenguaje y la explicación a una audiencia específica, como niños o estudiantes universitarios.
// // Prompt:
// // Tengo 7 años y quiero saber qué es una computadora que puede pensar. ¿Puedes explicarlo con palabras muy sencillas?
// // Formato y Estilo Específico
// // Este prompt solicita una explicación en un formato y estilo específicos, como párrafos cortos o ejemplos divertidos.
// // Prompt:
// // Soy un niño de 7 años y me gusta aprender jugando. ¿Podrías explicarme qué es la inteligencia artificial en 3 párrafos cortos, usando palabras fáciles y un ejemplo divertido?
// // Restricciones y Detalles (IA)
// // Este prompt añade restricciones como límite de palabras o ejemplos específicos para obtener respuestas más precisas.
// // Prompt:
// // Tengo 6 años y me gustan los robots. ¿Puedes explicarme qué es la inteligencia artificial en menos de 100 palabras y usando un ejemplo con un robot amigable?
// // 📄 Resumen de Ideas Principales de un Texto
// // Este prompt resume las ideas principales de un texto complejo, facilitando su comprensión.
// // Autor: Patricia Ceriani
// // Prompt:
// // Analiza el siguiente texto y resume las ideas principales. [Copia y pega el elegido a continuación.]
// // 📄 Explicación del Método Chain-of-Thought
// // Este prompt explica de manera sencilla cómo funciona el método Chain-of-Thought en la IA.
// // Autor: Patricia Ceriani
// // Prompt:
// // Pide a ChatGPT que te explique de manera sencilla cómo funciona el método Chain-of-Thought en la Inteligencia Artificial.
// // 📄 Asistente Anfitrión de Reuniones
// // Este prompt ayuda a organizar, gestionar y resumir reuniones, configurando agendas y generando resúmenes detallados.
// // Autor: Patricia Ceriani
// // Prompt:
// // (Implied through functionalities) Ayuda a organizar, gestionar y resumir reuniones, configurando agendas, enviando invitaciones, tomando notas en tiempo real y generando resúmenes detallados.
// // 📄 Ayuda en Programación y Desarrollo Web/Apps
// // Este prompt asiste en la generación de código, desarrollo de aplicaciones y optimización de código.
// // Autor: Patricia Ceriani
// // Prompt:
// // (Implied through functionalities) Asiste en la generación de código HTML/CSS/JavaScript, desarrollo de backend (Python, Node.js), aplicaciones móviles (React Native, Flutter), depuración y optimización de código, y generación de documentación y tutoriales.
// // 📄 Guía de Presentación para Docentes
// // Este prompt estructura contenido educativo en formato de cuento para niños, adecuado para presentaciones.
// // Autor: Patricia Ceriani
// // Prompt:
// // “Soy docente y quiero mostrar en 6 diapositivas y en formato de cuento para niños la importancia que tiene ser curiosos.”
