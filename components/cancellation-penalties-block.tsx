import type { CancellationPenalties } from "@/lib/cancellation-penalties";

type Props = {
  data: CancellationPenalties;
  /** Smaller typography for cards */
  compact?: boolean;
};

function ruleLine(rule: CancellationPenalties["rules"][0]): string {
  if (rule.label) return rule.label;
  return `${rule.percent}% of the total confirmed`;
}

export function CancellationPenaltiesBlock({ data, compact }: Props) {
  const titleClass = compact
    ? "mb-2 font-[family-name:var(--font-cormorant)] text-[16px] font-medium text-obsidian"
    : "mb-3 font-[family-name:var(--font-cormorant)] text-[22px] font-medium text-obsidian";

  return (
    <div className={compact ? "text-[12px] leading-relaxed text-[#7A7060]" : "text-[14px] leading-relaxed text-[#7A7060]"}>
      <h3 className={titleClass}>{data.title}</h3>
      {data.intro ? (
        <p className={compact ? "mb-2 text-[12px]" : "mb-3"}>{data.intro}</p>
      ) : null}
      <ul className="list-disc space-y-1 pl-5">
        {data.rules.map((rule, index) => (
          <li key={`cancellation-rule-${index}`}>
            <span className="font-medium text-obsidian">{rule.daysBefore} days before departure:</span>{" "}
            {ruleLine(rule)}
          </li>
        ))}
      </ul>
      {data.footnote ? (
        <p className={compact ? "mt-2 text-[11px] text-[#B5A890]" : "mt-4 text-[13px] text-[#B5A890]"}>
          {data.footnote}
        </p>
      ) : null}
    </div>
  );
}
