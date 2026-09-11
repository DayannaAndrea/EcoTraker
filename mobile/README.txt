

PALETA UNIFICADA: Comidas y Registrar viaje comparten exactamente los tokens de A8C148, E2D372, 3B2D2A y F7F4E4. Se eliminaron los verdes anteriores del dashboard de comidas.


FIX: se corrigieron valores rgba sin comillas en estilos para evitar ReferenceError: rgba is not defined.


FIX FINAL: todos los valores rgba() usados en estilos están correctamente entre comillas; FoodRegisterScreen deja de producir ReferenceError: rgba is not defined.

INTEGRACIÓN FRONTEND COMIDAS + VIAJES
- La pantalla Viajes ahora tiene historial propio.
- Cada viaje guardado entra al estado compartido de impacto.
- Comidas conserva su total exclusivamente alimentario.
- La gráfica diaria/semanal/mensual suma comidas y viajes.
- El estado es temporal en frontend y queda listo para sustituirse por API/BD.


FIX: se agregó el cierre JSX faltante del layout principal en TravelRegisterScreen.js que provocaba Expected corresponding JSX closing tag for <View>.


V12: los historiales de comidas y viajes ahora permiten eliminar registros individualmente. Al eliminar un registro, el total y la gráfica del dashboard se recalculan automáticamente porque usan el estado compartido.


V13: los historiales de comidas y viajes muestran ahora un botón visible 'Eliminar' por registro y eliminan el registro del estado compartido, recalculando totales y gráfica.


V14: se corrigió el error de ProfessionalChart cuando no hay registros (evitando NaN por max=0) y el warning props.pointerEvents usando style.pointerEvents.

V16: Inicio es ahora el dashboard principal con CO₂ de comidas, CO₂ de viajes, CO₂ total y gráfica Hoy/Semana/Mes basada en todos los registros. Comidas y Viajes funcionan en pantallas separadas.
