export default function SkeletonApplicationCard() {
    return (
        <div className="border border-gray-200 rounded bg-white overflow-hidden">
            <div className="animate-pulse">
                {/* Image Placeholder - Assuming an image will be here based on commented out code in ApplicationCard */}
                {/* <div className="h-[120px] bg-gray-200"></div> */}

                {/* Header Placeholder */}
                <div className="px-3 py-2 border-b border-gray-100 flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                    <div className="h-6 w-20 bg-gray-200 rounded"></div>
                </div>

                <div className="px-3 py-2 space-y-2">
                    {/* Date Section Placeholder */}
                    <div className="bg-gray-100 border border-gray-200 rounded px-2 py-1.5">
                        <div className="flex">
                            <div className="w-1/2 space-y-1.5">
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                            </div>
                            <div className="w-1/2 space-y-1.5">
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                            </div>
                        </div>
                    </div>

                    {/* Fee & Language Placeholder */}
                    <div className="grid grid-cols-2 gap-1.5 text-xs">
                        <div className="bg-gray-50 rounded px-1.5 py-1 space-y-1.5">
                            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-3.5 bg-gray-300 rounded w-1/2"></div>
                        </div>
                        <div className="bg-gray-50 rounded px-1.5 py-1 space-y-1.5">
                            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3.5 bg-gray-300 rounded w-full"></div>
                        </div>
                    </div>

                    {/* CGPA Placeholder */}
                    <div className="bg-gray-50 rounded px-1.5 py-1 text-xs space-y-1.5">
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-3.5 bg-gray-300 rounded w-1/2"></div>
                    </div>

                    {/* Others Placeholder */}
                    <div className="bg-gray-50 rounded px-1.5 py-1 text-xs space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                        <div className="space-y-1.5 pl-4">
                            <div className="h-3 bg-gray-300 rounded w-full"></div>
                            <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                        </div>
                    </div>

                    {/* Apply Button Placeholder */}
                    <div className="h-7 bg-gray-200 rounded w-full mt-1"></div>
                </div>
            </div>
        </div>
    );
}
