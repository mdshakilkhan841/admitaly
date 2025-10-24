export default function Header() {
    return (
        <header className="border-b border-border bg-white py-2">
            <div className="container mx-auto max-w-7xl px-4 ">
                <div className="flex items-center justify-center gap-3">
                    <div className="text-2xl">📚</div>
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground line-clamp-none">
                            Admitaly
                        </h1>
                    </div>
                </div>
                <p className="text-sm text-center text-muted-foreground line-clamp-none">
                    Track University Application Deadlines
                </p>
                <p className="text-center">2026-2027</p>
            </div>
            <div className="flex items-center justify-center bg-gray-100 rounded mt-2 gap-1 text-xs">
                <p>copyright</p>
                <a
                    href="https://twitter.com/iampawan"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    © Global Education Axis
                </a>
            </div>
        </header>
    );
}
