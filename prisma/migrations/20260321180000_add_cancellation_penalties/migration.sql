-- Per-trip cancellation penalty tiers + copy (merged with data/cancellation-penalties-default.json when null)
ALTER TABLE "tours" ADD COLUMN "cancellationPenalties" JSONB;
