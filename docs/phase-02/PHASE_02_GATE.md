# Gate de Fase 2

La fase se cierra únicamente si:

- `pnpm exec vitest run` termina sin fallos;
- `pnpm build` termina sin fallos;
- V-001 FSPL coincide;
- V-002 ruido 1 Hz coincide;
- V-003 ruido 100 MHz coincide;
- V-004 Shannon coincide;
- V-005 EIRP/Prx coincide;
- entradas inválidas producen error explícito;
- `linkMarginDb` es opcional cuando no hay sensibilidad;
- ninguna función declara cumplimiento 5G/IMT-2030;
- ninguna ecuación RF reside en React.
