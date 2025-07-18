import { Prompt } from "../app/features/prompts/prompt";
import { apoyoEscolar } from "./apoyo-escolar";
import { creatividad } from "./creatividad";
import { decisiones } from "./decisiones";
import { docentes } from "./docentes";
import { trabajo } from "./trabajo";
import { viajes } from "./viaje";
import { vidaCotidiana } from "./vida-cotidiana";
import { vinculos } from "./vinculos";

export const allPrompts: Prompt[] = [
    ...vinculos,
    ...trabajo,
    ...docentes,
    ...decisiones,
    ...creatividad,
    ...apoyoEscolar,
    ...viajes,
    ...vidaCotidiana,
] as Prompt[];

export default allPrompts;
