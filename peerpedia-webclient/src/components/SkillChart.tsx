import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "./ui/chart";
import type { PlottableSkill } from "../lib/types";

interface SkillChartProps {
    data: PlottableSkill[],
}

function SkillChart({ data }: SkillChartProps) {
    const yMin = 5 <= data.length ? Math.trunc(0.975 * data[4].count) : null;
    const yMax = 1 <= data.length ? Math.trunc(1.01 * data[0].count) : null;

    if (1 <= data.length) data[0].fill = "oklch(70% 0.214 259.815)";
    if (2 <= data.length) data[1].fill = "oklch(65% 0.214 259.815)";
    if (3 <= data.length) data[2].fill = "oklch(60% 0.214 259.815)";
    if (4 <= data.length) data[3].fill = "oklch(55% 0.214 259.815)";
    if (5 <= data.length) data[4].fill = "oklch(50% 0.214 259.815)";

    const chartConfig = {
        count: {
            label: "count",
            color: "oklch(62.3% 0.214 259.815)",
        },
    } satisfies ChartConfig;

    return (
        <ChartContainer config={chartConfig} className="min-h-[17rem] w-14/16 sm:w-12/16 mx-auto">
            <BarChart accessibilityLayer data={data}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="skill"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                />
                {yMin !== null && yMax !== null && <YAxis domain={[yMin, yMax]} hide={true} />}
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="count" fill="oklch(62.3% 0.214 259.815)" radius={8}>
                    <LabelList
                        position="top"
                        offset={12}
                        className="fill-foreground"
                        fontSize={10}
                    />
                </Bar>
            </BarChart>
        </ChartContainer>
    );
}

export default SkillChart;