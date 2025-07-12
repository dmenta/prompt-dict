export interface Prompt {
  id: number;
  titulo: string;
  descripcion: string;
  autor: string;
  tags: string[];
  prompt: string;
  fechaCreacion?: Date;
  fechaEdicion?: Date;
  lenguaje?: string;
  ejemplo?: string;
  categoria: string;
  fuente?: string;
  referencias?: string[];
  notas?: string;
  estado?: string;
  version?: number;
  comentarios?: string[];
  uso?: string;
  feedback?: string;
  visibilidad?: string;
  licencia?: string;
}
