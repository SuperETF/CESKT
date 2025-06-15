import React from "react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-gray-100 min-h-screen pb-20">
            <div className="max-w-[960px] mx-auto w-full px-4 sm:px-8">{children}</div>
        </div>
    );
}
