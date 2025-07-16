import Link from 'next/link'

export default function AuthCodeErrorPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Error de Autenticación
        </h1>
        <p className="text-muted-foreground mb-6">
          Ha ocurrido un error durante el proceso de autenticación. 
          Por favor, intenta nuevamente.
        </p>
        <Link 
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  )
}
