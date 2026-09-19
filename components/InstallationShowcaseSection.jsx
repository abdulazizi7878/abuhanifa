"use client";

import InstallationShowcaseSlider from "@/components/InstallationShowcaseSlider";

export default function InstallationShowcaseSection() {
    return (
        <section className="w-full py-16 bg-(--background) overflow-hidden border-t border-(--border)">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center sm:text-left">
                <h2 className="text-2xl sm:text-4xl font-extrabold text-(--foreground) tracking-tight">
                    Installation Showcase
                </h2>
            </div>

            <InstallationShowcaseSlider />
        </section>
    );
}