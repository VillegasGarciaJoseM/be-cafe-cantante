export function Home() {
    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <section className="text-center space-y-6 py-12">
                <h1 className="text-5xl md:text-7xl font-serif text-flamenco-red">
                    El Alma del Cante
                </h1>
                <p className="text-xl text-flamenco-blue max-w-2xl mx-auto font-light">
                    La mayor colección de letras flamencas, palos y autores.
                    Preservando la tradición y el arte.
                </p>
            </section>

            {/* Featured Section Placeholder */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-flamenco-gold">
                    <h3 className="text-2xl mb-4">Cante Jondo</h3>
                    <p className="text-gray-600">Explora las raíces más profundas del flamenco.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-flamenco-red">
                    <h3 className="text-2xl mb-4">Autores</h3>
                    <p className="text-gray-600">Conoce a los maestros que hicieron historia.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-flamenco-blue">
                    <h3 className="text-2xl mb-4">Palos</h3>
                    <p className="text-gray-600">Descubre la riqueza de los estilos flamencos.</p>
                </div>
            </section>
        </div>
    );
}
