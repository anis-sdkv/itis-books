import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList
} from "@/components/ui/navigation-menu";
import {Link} from "react-router-dom";
import {useAuth} from "@/context/useAuth";

export default function LayoutHeader() {
    const {user} = useAuth();

    return (
        <header
            className="border-b bg-white/70 backdrop-blur-sm sticky top-0 z-10">
            <div className="container mx-auto flex items-center justify-between py-3">

                <Link to="/" className="text-2xl font-bold tracking-tight">
                    ITIS.books
                </Link>

                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuLink
                                href="/"
                                className="px-4 py-2 rounded-lg hover:bg-muted/50 transition">
                                Главная
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        {user && (
                            <>
                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        href="/my-library"
                                        className="px-4 py-2 rounded-lg hover:bg-muted/50 transition">
                                        Моя библиотека
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        href="/profile"
                                        className="px-4 py-2 rounded-lg hover:bg-muted/50 transition">
                                        Профиль
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            </>
                        )}

                        {!user && (
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    href="/auth/login"
                                    className="px-4 py-2 rounded-lg hover:bg-muted/50 transition">
                                    Войти
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        )}

                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </header>
    );
}