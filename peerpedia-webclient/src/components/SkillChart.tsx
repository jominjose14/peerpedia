import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "./ui/chart";
import type { PlottableSkill } from "../lib/types";

interface SkillChartProps {
    data: PlottableSkill[],
}

function SkillChart({ data }: SkillChartProps) {
    const chartData = [...data];
    chartData.sort((item1, item2) => item2.count - item1.count);

    let minCount = 9_999_999_999;
    let maxCount = 0;
    for (const item of chartData) {
        minCount = Math.min(minCount, item.count);
        maxCount = Math.max(maxCount, item.count);
    }

    const xMin = Math.trunc(0.975 * minCount);
    const xMax = Math.trunc(1.01 * maxCount);

    if (1 <= chartData.length) chartData[0].fill = "oklch(66% 0.214 259.815)";
    if (2 <= chartData.length) chartData[1].fill = "oklch(62% 0.214 259.815)";
    if (3 <= chartData.length) chartData[2].fill = "oklch(58% 0.214 259.815)";
    if (4 <= chartData.length) chartData[3].fill = "oklch(54% 0.214 259.815)";
    if (5 <= chartData.length) chartData[4].fill = "oklch(52% 0.214 259.815)";

    const chartConfig = {
        count: {
            label: "count",
            color: "oklch(62.3% 0.214 259.815)",
        },
    } satisfies ChartConfig;

    return (
        <ChartContainer config={chartConfig} className="min-h-[15rem] sm:min-h-[20rem] w-full sm:w-13/16 mx-auto">
            <BarChart accessibilityLayer data={chartData} layout="vertical">
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