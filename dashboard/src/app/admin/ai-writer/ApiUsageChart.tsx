"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface HourlyUsage {
  hour: string;
  requests: number;
  tokens: number;
  avgTokensPerRequest: number;
}

interface ApiUsageChartProps {
  data: HourlyUsage[];
  limits?: {
    rpm?: number; // Requests per minute limit
    tpm?: number; // Tokens per minute limit
    rpd?: number; // Requests per day limit
  };
}

export function ApiUsageChart({ data, limits }: ApiUsageChartProps) {
  if (data.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-sm text-muted">No API usage data in the last 24 hours</p>
      </div>
    );
  }

  // Calculate reference lines based on limits
  const maxRequests = Math.max(...data.map((d) => d.requests), 10);
  const maxTokens = Math.max(...data.map((d) => d.tokens), 100);

  // Convert per-minute limits to per-hour for display
  const rpmLine = limits?.rpm ? limits.rpm * 60 : undefined;
  const tpmLine = limits?.tpm ? limits.tpm * 60 : undefined;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="card p-4">
          <p className="text-xs font-medium text-muted uppercase tracking-wider">Total Requests</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">
            {data.reduce((sum, d) => sum + d.requests, 0)}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium text-muted uppercase tracking-wider">Total Tokens</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">
            {data.reduce((sum, d) => sum + d.tokens, 0).toLocaleString("en-IN")}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium text-muted uppercase tracking-wider">Avg Tokens/Request</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">
            {Math.round(
              data.reduce((sum, d) => sum + d.tokens, 0) / Math.max(data.reduce((sum, d) => sum + d.requests, 0), 1)
            ).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <div className="card p-4 overflow-hidden">
        <h3 className="mb-4 text-sm font-medium">Requests & Token Usage by Hour</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" />
            <XAxis
              dataKey="hour"
              tick={{ fontSize: 12 }}
              stroke="var(--color-muted)"
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 12 }}
              stroke="var(--color-muted)"
              label={{ value: "Requests", angle: -90, position: "insideLeft" }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }}
              stroke="var(--color-muted)"
              label={{ value: "Tokens", angle: 90, position: "insideRight" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-line)",
                borderRadius: "0.5rem",
                color: "var(--color-text)",
              }}
              formatter={(value) => {
                if (typeof value === "number") {
                  return value.toLocaleString("en-IN");
                }
                return value;
              }}
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="requests"
              fill="var(--color-accent)"
              name="Requests"
              radius={[4, 4, 0, 0]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="tokens"
              stroke="var(--color-accent-soft)"
              name="Tokens"
              strokeWidth={2}
              dot={false}
            />
            {rpmLine !== undefined && (
              <ReferenceLine
                yAxisId="left"
                y={rpmLine}
                stroke="var(--color-amber-300)"
                strokeDasharray="5 5"
                label={{ value: `RPM Limit: ${limits?.rpm}`, position: "insideTopLeft", offset: -10 }}
              />
            )}
            {tpmLine !== undefined && (
              <ReferenceLine
                yAxisId="right"
                y={tpmLine}
                stroke="var(--color-amber-300)"
                strokeDasharray="5 5"
                label={{ value: `TPM Limit: ${limits?.tpm}`, position: "insideTopRight", offset: -10 }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {limits?.rpd && (
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Daily Request Limit</p>
              <p className="mt-1 text-xs text-muted">Requests per day cap</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold tabular-nums">
                {data.reduce((sum, d) => sum + d.requests, 0)}/{limits.rpd}
              </p>
              <p className="mt-1 text-xs text-accent">
                {((data.reduce((sum, d) => sum + d.requests, 0) / limits.rpd) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
          <div className="mt-4 h-2 w-full rounded-full bg-surface-2 overflow-hidden">
            <div
              className="h-full bg-accent transition-all"
              style={{
                width: `${Math.min((data.reduce((sum, d) => sum + d.requests, 0) / limits.rpd) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
