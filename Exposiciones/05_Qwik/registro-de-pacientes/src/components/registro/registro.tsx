
import { component$, useStyles$ } from '@builder.io/qwik';
import estilos from './registro.css?inline';
import { usePacientes } from './logica';

export default component$(() => {
  useStyles$(estilos);

  const { estado, registrar, editar, eliminar, limpiar } = usePacientes();

  const tiposSangre = [
    'A+', 'A-', 'B+', 'B-',
    'AB+', 'AB-', 'O+', 'O-'
  ];

  return (
    <div class="pagina">
      <div class="caja">
        <h1>Registro de pacientes</h1>
        <p class="descripcion">
          Complete los datos para registrar un paciente.
        </p>

        <div class="formulario">
          <input
            type="text"
            placeholder="Nombre completo"
            value={estado.nombre}
            onInput$={(_, el) => {
              estado.nombre = el.value;
            }}
          />

          <input
            type="text"
            inputMode="numeric"
            placeholder="Cédula"
            maxLength={10}
            value={estado.cedula}
            onInput$={(_, el) => {
              el.value = el.value.replace(/\D/g, '');
              estado.cedula = el.value;
            }}
          />

          <input
            type="text"
            inputMode="numeric"
            placeholder="Teléfono"
            maxLength={10}
            value={estado.telefono}
            onInput$={(_, el) => {
              el.value = el.value.replace(/\D/g, '');
              estado.telefono = el.value;
            }}
          />

          <select
            value={estado.sangre}
            onChange$={(_, el) => {
              estado.sangre = el.value;
            }}
          >
            <option value="">Tipo de sangre</option>
            {tiposSangre.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>

          <div class="botones">
            <button type="button" onClick$={registrar}>
              {estado.editando >= 0 ? 'Actualizar' : 'Registrar'}
            </button>

            {estado.editando >= 0 && (
              <button
                type="button"
                class="cancelar"
                onClick$={limpiar}
              >
                Cancelar
              </button>
            )}
          </div>

          {estado.error && (
            <p class="error">{estado.error}</p>
          )}
        </div>

        <h2>Pacientes registrados</h2>

        {estado.pacientes.length === 0 ? (
          <p class="vacio">No hay pacientes registrados.</p>
        ) : (
          <ul class="lista">
            {estado.pacientes.map((paciente, i) => (
              <li key={i}>
                <div class="datos">
                  <strong>{paciente.nombre}</strong>
                  <span>
                    Cédula: {paciente.cedula}
                  </span>
                  <span>
                    Teléfono: {paciente.telefono}
                  </span>
                  <span>
                    Sangre: {paciente.sangre}
                  </span>
                </div>

                <div class="acciones">
                  <button
                    type="button"
                    class="mini"
                    onClick$={() => editar(i)}
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    class="mini rojo"
                    onClick$={() => eliminar(i)}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
});
