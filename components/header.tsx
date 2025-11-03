import Link from "next/link";
import Image from "next/image";

export default function Header() {
    return (
        <header className="border-b ">
            {/* Main header content */}
            <div className="container mx-auto max-w-7xl px-2 py-1">
                <div className="flex items-center justify-between">
                    {/* Left: Logo and branding */}
                    <div className="flex items-center gap-2">
                        <div className="w-14 h-14 rounded-lg flex items-center justify-center">
                            <Image
                                src="/logo_agency.jpg"
                                alt="Admitaly Logo"
                                width={80}
                                height={80}
                                style={{
                                    objectFit: "cover",
                                }}
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground tracking-tight">
                                Admitaly
                            </h1>
                            <p className="text-xs text-muted-foreground font-medium">
                                University Deadlines
                            </p>
                        </div>
                    </div>

                    {/* Right: Social links and academic year */}
                    <div className="flex items-center gap-4">
                        {/* Right: Academic year */}
                        <div className="text-right border-l pl-4">
                            <p className="text-sm font-semibold text-foreground">
                                2026-2027
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Academic Year
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tagline section */}
            <div className="bg-linear-to-r from-blue-50 to-blue-50 dark:from-slate-900 dark:to-slate-900 border-t">
                <div className="container mx-auto max-w-7xl px-4 py-2">
                    <p className="text-xs text-foreground font-medium text-center">
                        Track Application Deadlines • Never Miss an Important
                        Date
                    </p>
                </div>
            </div>
        </header>
    );
}
