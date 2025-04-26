import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList
} from "@/components/ui/navigation-menu";
import {useAuth} from "@/context/AuthContext";

export default function LayoutHeader() {
    const {user} = useAuth(); // подключаем auth-контекст

    return (
        <header
            className="border-b bg-white/70 backdrop-blur-sm sticky top-0 z-10">
            <div className="container mx-auto flex items-center justify-between py-3">

                <a href="/"
                   className="text-2xl font-bold tracking-tight">
                    ITIS.books
                </a>

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
                                        href="/my-books"
                                        className="px-4 py-2 rounded-lg hover:bg-muted/50 transition">
                                        Мои книги
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
                                    href="/login"
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