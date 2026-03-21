"use client";

import { useCallback } from "react";
import type { CancellationPenalties, CancellationPenaltyRule } from "@/lib/cancellation-penalties";
import { getDefaultCancellationPenalties } from "@/lib/cancellation-penalties";
import { CancellationPenaltiesBlock } from "@/components/cancellation-penalties-block";

type Props = {
  value: CancellationPenalties;
  onChange: (next: CancellationPenalties) => void;
};

export function CancellationPenaltiesEditor({ value, onChange }: Props) {
  const setIntro = useCallback(
    (intro: string) => onChange({ ...value, intro }),
    [value, onChange]
  );
  const setTitle = useCallback(
    (title: string) => onChange({ ...value, title }),
    [value, onChange]
  );
  const setFootnote = useCallback(
    (footnote: string) => onChange({ ...value, footnote }),
    [value, onChange]
  );

  const updateRule = useCallback(
    (index: number, patch: Partial<CancellationPenaltyRule>) => {
      const rules = value.rules.map((r, i) => (i === index ? { ...r, ...patch } : r));
      onChange({ ...value, rules });
    },
    [value, onChange]
  );

  const addRule = useCallback(() => {
    onChange({
      ...value,
      rules: [...value.rules, { daysBefore: 14, percent: 100 }],
    });
  }, [value, onChange]);

  const removeRule = useCallback(
    (index: number) => {
      if (value.rules.length <= 1) return;
      onChange({ ...value, rules: value.rules.filter((_, i) => i !== index) });
    },
    [value, onChange]
  );

  const resetDefault = useCallback(() => {
    onChange(getDefaultCancellationPenalties());
  }, [onChange]);

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-zinc-900">Cancellation penalties</h2>
        <button
          type="button"
          onClick={resetDefault}
          className="rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
        >
          Reset to default policy
        </button>
      </div>
      <p className="mb-4 text-sm text-zinc-600">
        Stored as JSON per trip (see <code className="rounded bg-zinc-100 px-1 text-xs">data/cancellation-penalties-default.json</code> for
        the default). The preview matches the public trip page.
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Section title</label>
            <input
              type="text"
              value={value.title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Intro paragraph</label>
            <textarea
              rows={4}
              value={value.intro}
              onChange={(e) => setIntro(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-700">Penalty tiers</span>
              <button
                type="button"
                onClick={addRule}
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
              >
                + Add tier
              </button>
            </div>
            <div className="space-y-3">
              {value.rules.map((rule, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-3"
                >
                  <div className="mb-2 flex flex-wrap items-end gap-3">
                    <div className="min-w-[120px] flex-1">
                      <label className="mb-0.5 block text-xs text-zinc-500">Days before departure</label>
                      <input
                        type="number"
                        min={0}
                        value={rule.daysBefore}
                        onChange={(e) =>
                          updateRule(i, { daysBefore: Number(e.target.value) || 0 })
                        }
                        className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
                      />
                    </div>
                    <div className="w-24">
                      <label className="mb-0.5 block text-xs text-zinc-500">Percent</label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={rule.percent}
                        onChange={(e) =>
                          updateRule(i, { percent: Number(e.target.value) || 0 })
                        }
                        className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeRule(i)}
                      disabled={value.rules.length <= 1}
                      className="ml-auto text-sm text-red-600 hover:text-red-700 disabled:opacity-40"
                    >
                      Remove
                    </button>
                  </div>
                  <div>
                    <label className="mb-0.5 block text-xs text-zinc-500">
                      Optional custom line (overrides automatic % wording)
                    </label>
                    <input
                      type="text"
                      value={rule.label ?? ""}
                      onChange={(e) =>
                        updateRule(i, {
                          label: e.target.value.trim() ? e.target.value : undefined,
                        })
                      }
                      placeholder="e.g. 100% balance including all accessory services"
                      className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Footnote</label>
            <textarea
              rows={2}
              value={value.footnote}
              onChange={(e) => setFootnote(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-zinc-700">Preview (public)</p>
          <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-4">
            <CancellationPenaltiesBlock data={value} />
          </div>
        </div>
      </div>
    </section>
  );
}
