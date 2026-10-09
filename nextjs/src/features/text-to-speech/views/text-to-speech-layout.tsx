import {PageHeader} from "@/components/page-header";
import React from "react";

export function TextToSpeechLayout({
                                       children,
                                   }: { children: React.ReactNode }) {
    return (
        <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
            <PageHeader title="Text to Speech"/>
            {children}
        </div>
    );
}
