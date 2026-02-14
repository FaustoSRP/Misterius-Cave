# Plan de Proyecto: El Legado del Explorador

He estructurado tu idea en 8 prompts secuenciales para desarrollar el juego paso a paso. Por favor, revisa si esto captura correctamente la esencia de lo que quieres construir.

## Prompt 1: El Comienzo y la Estructura Base
**Objetivo:** Configurar el proyecto y la escena inicial.
- Crear proyecto Web (ej. React/Next.js).
- Configurar la interfaz básica: Una pantalla principal que representa la entrada a la "Cueva Misteriosa".
- Definir la estructura de datos básica del juego (Game State).

## Prompt 2: El Explorador Inexperto
**Objetivo:** Definir al protagonista y sus limitaciones.
- Crear la entidad `Explorador` con estadísticas base muy bajas (Fuerza, Agilidad, Conocimiento y Energía).
- Mostrar visualmente que el explorador es un novato (stats en nivel 1).
- Implementar la visualización de estas estadísticas en la UI.

## Prompt 3: Obstáculos Interactivos y Simulación
**Objetivo:** Implementar desafíos que unen la decisión del jugador con las estadísticas, narrados mediante simulación.
- **Estilo de Narrativa:** Uso de logs de texto ("Simulación") para describir el progreso y los peligros, como le gustó al usuario.
- La cueva presenta obstáculos procedurales (ej. "Derrumbe", "Acertijo", "Bestia").
- **Interacción del Jugador:** El jugador debe elegir qué acción tomar (ej. "Empujar", "Esquivar", "Analizar") o realizar un minijuego/input simple.
- **Resolución:** El éxito depende de la combinación: `Decisión del Jugador + Estadística del Explorador`.
- El fallo reduce la **Energía**. Si la Energía llega a 0, la exploración termina (muerte/retirada).

## Prompt 4: El Legado (Diarios)
**Objetivo:** Mecánica de derrota constructiva.
- Cuando el explorador falla, no es un "Game Over" tradicional.
- El explorador deja un "Diario de Viaje".
- Este diario almacena "Puntos de Conocimiento" basados en el intento (aunque sea fallido).
- Reiniciar el juego para el "siguiente" explorador.

## Prompt 5: El Nuevo Aventurero
**Objetivo:** Iniciar la siguiente generación.
- Al reiniciar, aparece un nuevo explorador (stats base de nuevo).
- **Mecánica clave:** El nuevo explorador encuentra el "Diario" del anterior.
- Implementar la recolección del diario para obtener los "Puntos de Conocimiento" acumulados.

## Prompt 6: Entrenamiento y Mejora
**Objetivo:** Sistema de progresión.
- Crear un menú de "Campamento" o "Entrenamiento" antes de entrar a la cueva.
- Permitir canjear los "Puntos de Conocimiento" del diario por aumentos permanentes de estadísticas (Fuerza, Agilidad, etc.).
- Mostrar cómo suben los números gracias al sacrificio del anterior explorador.

## Prompt 7: El Ciclo de Aprendizaje (Game Loop)
**Objetivo:** Refinar la repetición y el progreso incremental.
- Ajustar el balance: Un solo diario no basta.
- El jugador debe repetir el ciclo: Explorar -> Fallar -> Dejar Diario -> Nuevo Explorador -> Mejorar -> Intentar llegar un poco más lejos.
- Agregar feedback de "Progreso": "Llegaste al 10% de la cueva", "Llegaste al 30%", etc.

## Prompt 8: La Conquista Final
**Objetivo:** Condición de victoria.
- Permitir que las estadísticas se "Maxeen" (lleguen al tope necesario).
- Cuando el explorador (posiblemente el 20º de su linaje) tiene los stats necesarios, el intento de "Entrar a la Cueva" es exitoso.
- Pantalla de Victoria: "Has atravesado la Cueva Misteriosa gracias al conocimiento de tus predecesores."
