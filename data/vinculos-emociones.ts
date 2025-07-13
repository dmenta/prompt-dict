// import { Prompt } from "../src/app/features/prompts/prompt";

// const vinculosEmociones = {
//   grupo: "Vínculos, Comunicación y Emociones",
//   prompts: [
//     {
//       titulo: "Conversación con Empatía (Estrés Personal)",
//       descripcion: "Proporciona apoyo empático y un espacio seguro para reflexionar sobre situaciones de estrés.",
//       autor: "Patricia Ceriani",
//       prompt:
//         "Hola, me siento muy estresado últimamente por el trabajo y la vida personal. ¿Puedes ayudarme a sentirme mejor?",
//     },
//     {
//       titulo: "Atención al Cliente Empática",
//       descripcion: "Maneja quejas de clientes con empatía, ofreciendo soluciones rápidas.",
//       autor: "Patricia Ceriani",
//       prompt: "Recibí un producto defectuoso y estoy muy decepcionado con el servicio. ¿Qué pueden hacer al respecto?",
//     },
//     {
//       titulo: "Resolución de Conflictos (Colegas)",
//       descripcion: "Sugiere estrategias para mediar conflictos entre colegas, enfatizando la escucha activa.",
//       autor: "Patricia Ceriani",
//       prompt:
//         "Mis colegas están en desacuerdo sobre un proyecto y esto está afectando la moral del equipo. ¿Cómo puedo mediar en esta situación?",
//     },
//     {
//       titulo: "Comunicación Interpersonal Empática",
//       descripcion: "Ofrece consejos para mejorar la comunicación empática en relaciones personales.",
//       autor: "Patricia Ceriani",
//       prompt: "Quiero ser más empático en mis conversaciones con amigos y familiares. ¿Tienes algunos consejos?",
//     },
//     {
//       titulo: "El Reparador de Vínculos Rotos",
//       descripcion:
//         "Analiza relaciones deterioradas, brindando claridad emocional y ayudando a redactar mensajes genuinos.",
//       autor: "Santiago Bilinkis",
//       prompt:
//         "Actuá como un terapeuta familiar especializado en conversaciones difíciles. Te voy a contar una relación importante que se deterioró: [describí la relación y el conflicto]. Ayudame a entender qué puede estar sintiendo la otra persona, qué heridas o dinámicas están activas, y cómo podría escribirle un mensaje genuino que exprese mis emociones sin atacar. Dame opciones de mensajes posibles.",
//     },
//     {
//       titulo: "El Creador de Excusas Perfectas (pero éticas)",
//       descripcion: "Ayuda a cancelar actividades con excusas elegantes y creíbles, sin dañar vínculos.",
//       autor: "Santiago Bilinkis",
//       prompt:
//         "Actuá como un asistente creativo especializado en diplomacia. Necesito una excusa elegante, empática y creíble para cancelar [actividad] sin quedar mal. Quiero que suene honesta, que no ofenda y que incluso genere simpatía. Dame 3 opciones con distintos tonos: uno formal, uno amigable y uno con humor sutil.",
//     },
//     {
//       titulo: "El Evitador de Malos Entendidos en Mensajes Antes de Mandarlos",
//       descripcion: "Analiza mensajes para prevenir malentendidos, ajustando el tono y claridad.",
//       autor: "Santiago Bilinkis",
//       prompt:
//         "Te voy a mostrar un mensaje que estoy por mandar por WhatsApp. Quiero que me digas cómo puede interpretarlo la otra persona (tono, impacto emocional, posibles malentendidos) y si hay una forma más clara o empática de decirlo. Quiero sonar sincero, pero no cortante ni pasivo-agresivo.",
//     },
//     {
//       titulo: "El Resolutor Universal de Conflictos",
//       descripcion:
//         "Ayuda a resolver conflictos identificando perspectivas y sugiriendo estrategias de comunicación no violenta.",
//       autor: "Santiago Bilinkis",
//       prompt:
//         "Eres un mediador experto en resolución de conflictos. Tengo un problema con [persona/situación]. Te voy a contar mi versión: [tu perspectiva]. Ahora ayudame a entender posibles perspectivas de la otra parte, identifica malentendidos, sugiere formas de comunicación no violenta, y dame estrategias específicas para resolver este conflicto constructivamente. Ayudame a cambiar la dinámica y encontrar concesiones mutuamente favorables.",
//     },
//   ] as Prompt[],
// };

// // export default vinculosEmociones;

// /*

// Vínculos, Comunicación y Emociones
// 📄 Conversación con Empatía (Estrés Personal)
// Este prompt proporciona apoyo empático y un espacio seguro para reflexionar sobre situaciones de estrés.
// Autor: Patricia Ceriani
// Prompt:
// “Hola, me siento muy estresado últimamente por el trabajo y la vida personal. ¿Puedes ayudarme a sentirme mejor?”
// 📄 Atención al Cliente Empática
// Este prompt maneja quejas de clientes con empatía, ofreciendo soluciones rápidas.
// Autor: Patricia Ceriani
// Prompt:
// “Recibí un producto defectuoso y estoy muy decepcionado con el servicio. ¿Qué pueden hacer al respecto?”
// 📄 Resolución de Conflictos (Colegas)
// Este prompt sugiere estrategias para mediar conflictos entre colegas, enfatizando la escucha activa.
// Autor: Patricia Ceriani
// Prompt:
// “Mis colegas están en desacuerdo sobre un proyecto y esto está afectando la moral del equipo. ¿Cómo puedo mediar en esta situación?”
// 📄 Comunicación Interpersonal Empática
// Este prompt ofrece consejos para mejorar la comunicación empática en relaciones personales.
// Autor: Patricia Ceriani
// Prompt:
// “Quiero ser más empático en mis conversaciones con amigos y familiares. ¿Tienes algunos consejos?”
// 📄 El Reparador de Vínculos Rotos
// Este prompt analiza relaciones deterioradas, brindando claridad emocional y ayudando a redactar mensajes genuinos.
// Autor: Santiago Bilinkis
// Prompt:
// "Actuá como un terapeuta familiar especializado en conversaciones difíciles. Te voy a contar una relación importante que se deterioró: [describí la relación y el conflicto]. Ayudame a entender qué puede estar sintiendo la otra persona, qué heridas o dinámicas están activas, y cómo podría escribirle un mensaje genuino que exprese mis emociones sin atacar. Dame opciones de mensajes posibles."
// 📄 El Creador de Excusas Perfectas (pero éticas)
// Este prompt ayuda a cancelar actividades con excusas elegantes y creíbles, sin dañar vínculos.
// Autor: Santiago Bilinkis
// Prompt:
// "Actuá como un asistente creativo especializado en diplomacia. Necesito una excusa elegante, empática y creíble para cancelar [actividad] sin quedar mal. Quiero que suene honesta, que no ofenda y que incluso genere simpatía. Dame 3 opciones con distintos tonos: uno formal, uno amigable y uno con humor sutil."
// 📄 El Evitador de Malos Entendidos en Mensajes Antes de Mandarlos
// Este prompt analiza mensajes para prevenir malentendidos, ajustando el tono y claridad.
// Autor: Santiago Bilinkis
// Prompt:
// "Te voy a mostrar un mensaje que estoy por mandar por WhatsApp. Quiero que me digas cómo puede interpretarlo la otra persona (tono, impacto emocional, posibles malentendidos) y si hay una forma más clara o empática de decirlo. Quiero sonar sincero, pero no cortante ni pasivo-agresivo."
// 📄 El Resolutor Universal de Conflictos
// Este prompt ayuda a resolver conflictos identificando perspectivas y sugiriendo estrategias de comunicación no violenta.
// Autor: Santiago Bilinkis
// Prompt:
// "Eres un mediador experto en resolución de conflictos. Tengo un problema con [persona/situación]. Te voy a contar mi versión: [tu perspectiva]. Ahora ayudame a entender posibles perspectivas de la otra parte, identifica malentendidos, sugiere formas de comunicación no violenta, y dame estrategias específicas para resolver este conflicto constructivamente. Ayudame a cambiar la dinámica y encontrar concesiones mutuamente favorables.”

// *(Estos prompts están diseñados para fomentar la empatía, la comunicación efectiva y la resolución de conflictos en diversas situaciones personales y profesionales.)
// */
