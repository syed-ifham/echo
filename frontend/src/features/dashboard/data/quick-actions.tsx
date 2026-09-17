export interface QuickAction {
    title: string;
    description: string;
    gradient: string;
    href: string;
};

export const quickActions: QuickAction[] = [
    {
        title: "Vox Machina Legend",
        description: "A funny and wild mercenary story",
        gradient: "from-amber-500 to-amber-100",
        href: `/text-to-speech?text=${encodeURIComponent(
            "We are Vox Machina! We make mistakes, fight hard, and somehow save the kingdom. When dragons arrive, just give us our swords and step back."
        )}`,
    },
    {
        title: "Arcane Sisters",
        description: "A story about two sisters on opposite sides",
        gradient: "from-teal-400 to-teal-100",
        href: `/text-to-speech?text=${encodeURIComponent(
            "I tried to keep you safe. But you changed, and now we are on different paths. I still remember who you used to be."
        )}`,
    },
    {
        title: "Power & Politics",
        description: "A quiet talk about control and choices",
        gradient: "from-emerald-500 to-emerald-100",
        href: `/text-to-speech?text=${encodeURIComponent(
            "People do not want long speeches. They want simple promises. Give them hope, keep your plans secret, and stay one step ahead."
        )}`,
    },
    {
        title: "Marvel Secret Wars",
        description: "Heroes fight to save the universe",
        gradient: "from-red-500 to-red-100",
        href: `/text-to-speech?text=${encodeURIComponent(
            "Worlds are bumping into each other. Only one battleground is left. The heroes must unite today or everything disappears tomorrow."
        )}`,
    },
    {
        title: "Ryan Reynolds & Green Lantern",
        description: "How Ryan left his old green suit for Deadpool",
        gradient: "from-green-400 to-green-100",
        href: `/text-to-speech?text=${encodeURIComponent(
            "The green suit was fake and the movie did not work. So Ryan made fun of it, put on the red mask, and became Deadpool instead."
        )}`,
    },
];