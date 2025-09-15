import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "./ui/chart";
import type { PlottableSkill } from "../lib/types";

interface SkillChartProps {
    data: PlottableSkill[],
}

function SkillChart({ data }: SkillChartProps) {
    let minCount = 9_999_999_999;
    let maxCount = 0;
    for (const dataPoint of data) {
        minCount = Math.min(minCount, dataPoint.count);
        maxCount = Math.max(maxCount, dataPoint.count);
    }

    const xMin = Math.trunc(0.975 * minCount);
    const xMax = Math.trunc(1.01 * maxCount);

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
        <ChartContainer config={chartConfig} className="min-h-[15rem] sm:min-h-[20rem] w-full sm:w-13/16 mx-auto">
            <BarChart accessibilityLayer data={data} layout="vertical">
                <CartesianGrid horizontal={false} />
                <XAxis
                    type="number"
                    domain={xMin !== null && xMax !== null ? [xMin, xMax] : undefined}
                    hide={true}
                />
                <YAxis
                    type="category"
                    dataKey="skill"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="count" fill="oklch(62.3% 0.214 259.815)" radius={8}>
                    <LabelList
                        position="right"
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