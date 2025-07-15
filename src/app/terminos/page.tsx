export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Spacer for navbar */}
      <div className="h-16 md:h-20"></div>
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        <div className="prose prose-slate max-w-none">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">Términos y Condiciones de Uso</h1>
          
          <p className="text-sm text-gray-600 mb-6 md:mb-8">
            <strong>Última actualización: 9 de julio de 2025</strong>
          </p>

          <div className="space-y-6 md:space-y-8">
            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4">1. Aceptación de los Términos</h2>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                Al usar Predik aceptás estos términos. Si no estás de acuerdo, simplemente no uses la plataforma. Es así de simple.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4">2. ¿Qué es Predik?</h2>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                Predik es una plataforma de entretenimiento donde podés hacer predicciones sobre diferentes eventos usando <strong>Prediks</strong> - una moneda completamente ficticia y divertida. Los Prediks <strong>NO son dinero real</strong>, <strong>NO son criptomonedas</strong>, <strong>NO tienen valor monetario</strong> y <strong>NO se pueden cambiar por dinero real</strong>. Son solo para diversión, como los puntos de un videojuego.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Registro</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Para usar Predik necesitás:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Ser mayor de 18 años</li>
                <li>Tener una cuenta de Google</li>
                <li>Entender que esto es solo entretenimiento</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Cómo Funciona</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Recibís Prediks gratis para empezar a jugar</li>
                <li>Podés hacer predicciones en diferentes mercados</li>
                <li>Si acertás, ganás más Prediks ficticios</li>
                <li>Si no acertás, perdés algunos Prediks (pero siempre podés conseguir más)</li>
                <li>Todo es solo por diversión y entretenimiento</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Lo que NO podés hacer</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Usar la plataforma para actividades ilegales</li>
                <li>Crear múltiples cuentas para obtener ventajas</li>
                <li>Intentar hackear o romper la plataforma</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cambios</h2>
              <p className="text-gray-700 leading-relaxed">
                Podemos actualizar estos términos cuando sea necesario. Te avisaremos si hay cambios importantes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Contacto</h2>
              <p className="text-gray-700 leading-relaxed">
                Si tenés alguna pregunta, podés contactarnos a través de la plataforma.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Recordá: Predik es solo entretenimiento. Los Prediks no tienen valor real.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
