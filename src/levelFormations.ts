import { Peg } from './peg';

export interface LevelFormation {
    name: string;
    pegs: { x: number; y: number }[];
}

export const levelFormations: LevelFormation[] = [
    {
        name: "Classic Grid",
        pegs: [
            ...Array(8).fill(0).flatMap((_, i) =>
                Array(5).fill(0).map((_, j) => ({
                    x: 100 + i * 85,
                    y: 150 + j * 85
                }))
            )
        ]
    },
    {
        name: "Diamond Pattern",
        pegs: [
            { x: 400, y: 100 },
            { x: 350, y: 150 }, { x: 450, y: 150 },
            { x: 300, y: 200 }, { x: 400, y: 200 }, { x: 500, y: 200 },
            { x: 250, y: 250 }, { x: 350, y: 250 }, { x: 450, y: 250 }, { x: 550, y: 250 },
            { x: 300, y: 300 }, { x: 400, y: 300 }, { x: 500, y: 300 },
            { x: 350, y: 350 }, { x: 450, y: 350 },
            { x: 400, y: 400 },
        ]
    },
    {
        name: "Circular Pattern",
        pegs: [
            ...Array(12).fill(0).map((_, i) => ({
                x: 400 + 200 * Math.cos(i * Math.PI / 6),
                y: 300 + 200 * Math.sin(i * Math.PI / 6)
            })),
            ...Array(6).fill(0).map((_, i) => ({
                x: 400 + 100 * Math.cos(i * Math.PI / 3),
                y: 300 + 100 * Math.sin(i * Math.PI / 3)
            })),
            { x: 400, y: 300 }
        ]
    },
    {
        name: "Zigzag Pattern",
        pegs: [
            ...Array(8).fill(0).flatMap((_, i) => [
                { x: 100 + i * 85, y: 100 + (i % 2) * 85 },
                { x: 100 + i * 85, y: 270 + (i % 2) * 85 },
                { x: 100 + i * 85, y: 440 + (i % 2) * 85 }
            ])
        ]
    },
    {
        name: "Sparse Triangles",
        pegs: [
            { x: 400, y: 100 },
            { x: 350, y: 175 }, { x: 450, y: 175 },
            { x: 300, y: 250 }, { x: 400, y: 250 }, { x: 500, y: 250 },
            { x: 200, y: 400 }, { x: 300, y: 400 }, { x: 400, y: 400 }, { x: 500, y: 400 }, { x: 600, y: 400 }
        ]
    }
];

export function createPegsFromFormation(formation: LevelFormation): Peg[] {
    return formation.pegs.map(({ x, y }) => new Peg(x, y));
}