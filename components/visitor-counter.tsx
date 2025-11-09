import Image from "next/image";

export default function VisitorCounter() {
    return (
        <div className="flex justify-center items-center my-4 gap-2">
            <div className="text-xs font-medium text-muted-foreground">
                Total Visitors:
            </div>
            <Image
                // src="https://hitwebcounter.com/counter/counter.php?page=21455916&style=0007&nbdigits=6&type=page&initCount=0"
                src="https://hitwebcounter.com/counter/counter.php?page=21455932&style=0009&nbdigits=6&type=page&initCount=1500"
                title="Free Tools"
                alt="counters"
                className="w-28"
                width={88}
                height={15}
                unoptimized
            />
        </div>
    );
}
