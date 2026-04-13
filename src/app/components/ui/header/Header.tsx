'use client'
import { useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigation = [
        { name: "وبلاگ", href: "#kir" },
        { name: "درباره ما", href: "#" },
        { name: "تماس با ما", href: "#" },
        { name: "دوره ها", href: "#" },
        { name: "سامورایی شو!", href: "#" },
    ];

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.target as HTMLImageElement; // Cast to HTMLImageElement
        target.src = "https://images.unsplash.com/photo-1633409361618-c73427e4e206?ixlib=rb-4.0.3";
        target.onerror = null;
    };

    return (
        <header className="backdrop-blur-3xl shadow-lg fixed w-full top-0 z-50 ">
            <nav className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-0">
                <div className="flex items-center justify-between h-24 flex-row-reverse">
                    <div className="flex-shrink-0 transition-transform duration-300 hover:scale-105">
                        <img
                            className="h-16 w-auto rounded-lg"
                            src="/logo.png"
                            alt="Jevan Sarthi Logo"
                            onError={handleImageError}  // Use the handler here
                        />
                    </div>

                    <div className="hidden md:flex md:items-center md:space-x-8">
                        {navigation.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="text-white-700 font-bold hover:text-black-600 hover:bg-white-50 hover:text-black px-4 ps-0 py-2 rounded-full text-lg transition-all duration-300 ease-in-out relative group"
                            >
                                {item.name}
                            </a>
                        ))}
                        <a
                            href={'sa'}
                            className="text-white bg-red-900 font-bold hover:text-black-600 hover:bg-gray-800 px-4 py-2 rounded-full text-lg transition-all duration-300 ease-in-out relative group"
                        >
                            سامورایی شو!
                        </a>
                    </div>

                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-full text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none transition-all duration-300"
                        >
                            {isMenuOpen ? (
                                <AiOutlineClose className="h-6 w-6" />
                            ) : (
                                <HiMenuAlt3 className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden animate-fadeIn">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navigation.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ease-in-out transform hover:translate-x-2"
                                >
                                    {item.name}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;
