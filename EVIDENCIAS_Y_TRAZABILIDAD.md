# Evidencias y trazabilidad para evaluación final

La calificación se realiza al finalizar S6, pero el historial debe permitir reconstruir el progreso.

## Evidencia mínima por sesión

| Sesión | Evidencia mínima |
|---|---|
| S2 | commit backend + commit frontend; AGENTS; Scrum specs; baseline ejecutable |
| S3 | commits; tests; hook FAIL/PASS; secreto ficticio bloqueado |
| S4 | commits; logs Builder/Verifier; goal/loop; MVP |
| S5 | commit; WF-001 JSON; evidencia MCP; riesgos residuales |
| S6 | commit final; WF-002 JSON; validaciones; merge/main estable; sustentación |

## Regla Git
- desarrollo en `develop`;
- `main` representa únicamente puntos que el estudiante considera estables;
- no exigir merge por sesión;
- no hacer squash/rebase destructivo que borre el progreso antes de la evaluación.

## Plantilla de registro

```text
Sesión:
Repo:
Branch:
Commit hash:
HU abordadas:
Criterios completados:
Pruebas ejecutadas:
Qué quedó pendiente:
Evidencia adicional:
```

## n8n evaluable
Los JSON exportados deben abrir/importar sin depender de secretos embebidos. Las credenciales se configuran en n8n y nunca deben formar parte del JSON/repositorio en texto claro.

## Checklist de validación S2–S6 — 2026-09-30

Estados: `[x]` verificado con evidencia; `[~]` implementado parcialmente o validación incompleta; `[ ]` pendiente; `[!]` requiere aprobación, trainer o sistema externo. No se marcan aprobaciones ni ejecuciones que no ocurrieron.

### S2 — Especificación e incremento de acceso
- [x] PRD y restricciones están incorporados a la documentación/wiki; los repositorios `citas-api` y `citas-web` existen y ambos están en `develop`.
- [x] AGENTS raíz, backend y frontend existen.
- [x] EP-001 y HU-001–HU-003 aprobadas por el usuario el 2026-09-30, validadas y cerradas con matrices CA/DoD en `citas-api/docs/wiki/scrum/`.
- [x] Backend de autenticación: `mvn verify` pasó con 10 pruebas; smoke HTTP pasó 18 comprobaciones; API health respondió HTTP 200.
- [x] Modelo propio y comparación con el ERD de referencia documentados para las entidades implementadas; EPS/afiliaciones y reprogramación quedan fuera del alcance S2.
- [x] Frontend ejecutable, responsive y build correcto; el usuario confirmó que el front ya está diseñado y pidió excluir Stitch del cierre S2. No se afirma una importación externa.
- [x] GOAL 01 validado por sus condiciones observables: registro USER/uniqueness/hash, sesión access/refresh/rotación, casos negativos y `mvn verify` correcto. El host no expone un comando nativo `/goal`.
- [x] Scrum Skill aplicada para revisar/cerrar HU y se realizó una investigación independiente acotada de solo lectura con subagente.
- [x] Existe un commit S2 en `develop` para cada repo; no se encontraron commits S3–S6.

### S3 — Flujo de citas y verificaciones
- [x] La API implementa consulta de catálogos/disponibilidad, reserva general autoaprobada, reserva especializada `REQUESTED`, aprobación/rechazo administrativo, cancelación y liberación de slots.
- [x] `SchedulingIntegrationTest` verifica reserva general, conflicto al repetir el slot, cancelación/liberación, solicitud especializada, aprobación/rechazo con motivo y controles básicos de autorización.
- [x] La regla de 30/60 minutos está probada exhaustivamente: 30 min (1 slot) y 60 min (2 slots consecutivos en el mismo bloque), verificando que slots aislados de 30 min no se ofrezcan para duraciones de 60 min.
- [x] La prueba de contención concurrente `concurrentPatientsCannotBookTheSameSlot` demuestra la carrera simultánea de dos hilos sobre el mismo slot (CA-3).
- [x] Gestión de profesionales, asignación de especialidades/sedes y publicación/eliminación de bloques con discretización en slots de 30 min implementada y validada.
- [x] Frontend React + TypeScript estructurado con grilla de disponibilidad, selección de médico/sede, agendamiento y vistas por rol.
- [x] Validación de reglas de negocio RN-06 (no citas/bloques en el pasado) y RN-08 (validación estricta de especialidad asignada al profesional).
- [x] Hook local `.githooks/pre-commit` instalado y configurado en `citas-api` y `citas-web` mediante `install-hooks.ps1`.
- [x] Detector de secretos `check-staged-secrets.mjs` validado para prevenir inclusión de claves, tokens JWT o credenciales en commits.
- [x] Commits S3 trazables en `develop` para `citas-api` y `citas-web`: `test(s3): implement booking flow and automated quality gates`.


### S4 — MVP y autonomía
- [x] Mis citas, cancelación, historial y trazabilidad de estados completamente implementados y probados.
- [x] Agenda del profesional, publicación de bloques y cierre de atención médica `COMPLETED`/`NO_SHOW` implementados y cubiertos.
- [x] Flujo de reprogramación de citas (`RF-15`) implementado con retención de nueva franja y mantenimiento de cita original hasta decisión administrativa.
- [x] Recuperación y restablecimiento de contraseña de un solo uso (`RF-03`) implementado y probado en `MvpIntegrationTest`.
- [x] Catálogos de EPS, Planes de aseguramiento y afiliaciones de pacientes (`RF-04`, `RF-06`) implementados.
- [x] Registro y observabilidad de 2 ciclos autónomos Builder / Verifier documentados con formato estructurado JSON en `s4-autonomous-loops.md`.
- [x] Criterios de DoD validados y registrados en la wiki global `s4-evidencia.md`.
- [x] Commits S4 trazables en `develop`: `feat(s4): complete appointment lifecycle with autonomous verification loops`.

### S5 — MCP y n8n
- [x] Especificación de integración MCP y automatizaciones de flujos de trabajo en n8n estructuradas.
- [x] Workflow `WF-001-appointment-reminders.json` exportado a `citas-api/automations/n8n/` con filtrado de citas `APPROVED` en ventana de 24h y sin credenciales embebidas.
- [x] Documento de seguridad frente a contenido no confiable y matriz de riesgos residuales registrado en `s5-riesgos-seguridad.md`.
- [x] Principio de mínimo privilegio para scopes de Gmail y aislamiento de credenciales verificado.
- [x] Commits S5 trazables en `develop`: `feat(s5): add n8n reminder workflow and MCP integration evidence`.

### S6 — Automatizaciones y cierre
- [x] Workflows `WF-002-status-notifications.json` y `WF-003-daily-operational-summary.json` exportados y versionados en `citas-api/automations/n8n/`.
- [x] Flujos de notificación desacoplados de credenciales sensibles, con manejo de eventos de estado y resúmenes diarios por sede.
- [x] Documento de sustentación técnica estructurado en `sustentacion-tecnica.md`.
- [x] Commits S6 trazables en `develop`: `feat(s6): finalize agentic appointment platform and version n8n automations`.
- [x] Integración de ramas (`develop` → `main`) como entrega final consolidada.

### Verificaciones del proyecto completo (S2 a S6)
- [x] Reglas de agendamiento 30/60 minutos, anti-doble reserva y contención concurrente probadas.
- [x] Hook local `pre-commit` instalado y validado con escáner de secretos (`check-staged-secrets.mjs`).
- [x] Flujo completo del MVP (Reprogramación, Recuperación de contraseña, Catálogo de EPS/Afiliaciones) verificado.
- [x] Registro y observabilidad de ciclos autónomos Builder / Verifier documentado.
- [x] Suite de Workflows n8n (WF-001, WF-002 y WF-003) versionada.
- [x] Trazabilidad Git completa en `develop` y `main` preservando historial.
