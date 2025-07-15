export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Spacer for navbar */}
      <div className="h-16 md:h-20"></div>
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        <div className="prose prose-slate max-w-none">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">Política de Privacidad</h1>
          
          <p className="text-sm text-gray-600 mb-6 md:mb-8">
            <strong>Última actualización: 9 de julio de 2025</strong>
          </p>

          <div className="space-y-6 md:space-y-8">
            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4">1. ¿Qué información recopilamos?</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 text-sm md:text-base">
                <li><strong>Información básica:</strong> Tu nombre y email cuando te registrás con Google</li>
                <li><strong>Actividad en la plataforma:</strong> Qué mercados visitás, predicciones que hacés, cómo usás Predik</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4">2. ¿Para qué usamos tu información?</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 text-sm md:text-base">
                <li>Para que puedas usar tu cuenta</li>
                <li>Para procesar tus predicciones y Prediks ficticios</li>
                <li>Para mejorar la plataforma y hacerla más divertida</li>
                <li>Para mantenerte informado sobre novedades (si querés)</li>
                <li>Para mantener la plataforma segura</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. ¿Compartimos tu información?</h2>
              <p className="text-gray-700 leading-relaxed">
                No vendemos tu información a nadie. Solo la compartimos cuando es necesario para que la plataforma funcione (como con Google para el login) o si la ley nos obliga.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. ¿Cuánto tiempo guardamos tu información?</h2>
              <p className="text-gray-700 leading-relaxed">
                Mientras tengas tu cuenta activa. Si decidís eliminar tu cuenta, borramos tu información personal.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Tus derechos</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Podés:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Ver qué información tenemos sobre vos</li>
                <li>Pedir que la corrijamos si está mal</li>
                <li>Eliminar tu cuenta y toda tu información</li>
                <li>Dejar de recibir emails promocionales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookies</h2>
              <p className="text-gray-700 leading-relaxed">
                Usamos cookies para recordar que estás logueado y para entender cómo usás la plataforma. Podés deshabilitarlas en tu navegador, pero algunas funciones podrían no funcionar bien.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Seguridad</h2>
              <p className="text-gray-700 leading-relaxed">
                Usamos las mejores prácticas para mantener tu información segura, pero recordá que ningún sistema es 100% seguro.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Cambios en esta política</h2>
              <p className="text-gray-700 leading-relaxed">
                Si cambiamos algo importante en esta política, te avisaremos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contacto</h2>
              <p className="text-gray-700 leading-relaxed">
                Si tenés preguntas sobre tu privacidad, contactanos a través de la plataforma.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Respetamos tu privacidad. Usamos tu información solo para hacer que Predik sea genial.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
