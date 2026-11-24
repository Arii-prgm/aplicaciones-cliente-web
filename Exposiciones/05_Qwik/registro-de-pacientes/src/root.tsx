
import { component$ } from '@builder.io/qwik';
import {
  QwikCityProvider,
  RouterOutlet
} from '@builder.io/qwik-city';

import './global.css';

export default component$(() => {
  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <title>Registro de Pacientes</title>
      </head>

      <body lang="es">
        <RouterOutlet />
      </body>
    </QwikCityProvider>
  );
});
