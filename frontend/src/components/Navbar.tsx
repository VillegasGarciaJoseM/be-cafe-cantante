import { Link } from 'react-router-dom';
import { Music, Search } from 'lucide-react';

export function Navbar() {
    return (
        <nav className="bg-flamenco-red text-white shadow-lg">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2 text-2xl font-serif font-bold">
                    <Music className="w-8 h-8" />
                    <span>Café Cantante</span>
                </Link>
                <div className="hidden md:flex space-x-6 font-medium">
                    <Link to="/" className="hover:text-flamenco-gold transition-colors">Letras</Link>
                    <Link to="/artists" className="hover:text-flamenco-gold transition-colors">Autores</Link>
                    <Link to="/palos" className="hover:text-flamenco-gold transition-colors">Palos</Link>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="p-2 hover:bg-flamenco-darkRed rounded-full transition-colors">
                        <Search className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </nav>
    );
}
