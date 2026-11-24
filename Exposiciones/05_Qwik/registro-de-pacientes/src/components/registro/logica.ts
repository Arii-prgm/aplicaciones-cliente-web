
import { $, useStore, useVisibleTask$ } from '@builder.io/qwik';

export interface Paciente {
  nombre: string;
  cedula: string;
  telefono: string;
  sangre: string;
}

export const usePacientes = () => {
  const estado = useStore({
    nombre: '',
    cedula: '',
    telefono: '',
    sangre: '',
    error: '',
    editando: -1,
    pacientes: [] as Paciente[],
  });

  // Recuperar los registros guardados en el navegador
  useVisibleTask$(() => {
    const guardado = localStorage.getItem('pacientes');

    if (guardado) {
      try {
        const datos = JSON.parse(guardado);

        if (Array.isArray(datos)) {
          estado.pacientes = datos;
        }
      } catch {
        estado.error = 'No se pudieron recuperar los registros.';
      }
    }
  });

  // Limpiar el formulario
  const limpiar = $(() => {
    estado.nombre = '';
    estado.cedula = '';
    estado.telefono = '';
    estado.sangre = '';
    estado.error = '';
    estado.editando = -1;
  });

  // Registrar o actualizar un paciente
  const registrar = $(() => {
    if (
      !estado.nombre.trim() ||
      !/^\d{10}$/.test(estado.cedula) ||
      !/^\d{10}$/.test(estado.telefono) ||
      !estado.sangre
    ) {
      estado.error =
        'Complete todos los campos: nombre, cédula, teléfono y tipo de sangre. La cédula y el teléfono deben tener 10 dígitos.';
      return;
    }

    const paciente: Paciente = {
      nombre: estado.nombre.trim(),
      cedula: estado.cedula,
      telefono: estado.telefono,
      sangre: estado.sangre,
    };

    if (estado.editando >= 0) {
      estado.pacientes[estado.editando] = paciente;
    } else {
      estado.pacientes.push(paciente);
    }

    localStorage.setItem(
      'pacientes',
      JSON.stringify(estado.pacientes)
    );

    estado.nombre = '';
    estado.cedula = '';
    estado.telefono = '';
    estado.sangre = '';
    estado.error = '';
    estado.editando = -1;
  });

  // Cargar los datos de un paciente para editarlos
  const editar = $((i: number) => {
    const paciente = estado.pacientes[i];

    if (!paciente) return;

    estado.nombre = paciente.nombre;
    estado.cedula = paciente.cedula;
    estado.telefono = paciente.telefono;
    estado.sangre = paciente.sangre;
    estado.error = '';
    estado.editando = i;
  });

  // Eliminar un paciente
  const eliminar = $((i: number) => {
    estado.pacientes.splice(i, 1);

    localStorage.setItem(
      'pacientes',
      JSON.stringify(estado.pacientes)
    );

    estado.nombre = '';
    estado.cedula = '';
    estado.telefono = '';
    estado.sangre = '';
    estado.error = '';
    estado.editando = -1;
  });

  return {
    estado,
    registrar,
    editar,
    eliminar,
    limpiar,
  };
};
