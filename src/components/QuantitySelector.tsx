import { Minus, Plus } from "lucide-react";
import { useLanguage } from "@/i18n";

interface Props {
  quantity: number;
  onChange: (q: number) => void;
  min?: number;
  max?: number;
}

export default function QuantitySelector({ quantity, onChange, min = 1, max = 99 }: Props) {
  const { t } = useLanguage();

  return (
    <div className="inline-flex h-12 items-center border border-border bg-background">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, quantity - 1))}
        className="flex h-full w-11 items-center justify-center text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        aria-label={t("decreaseQuantity")}
      >
        <Minus className="h-4 w-4" />
      </button>
      <input
        type="number"
        value={quantity}
        onChange={e => {
          const val = parseInt(e.target.value);
          if (!isNaN(val)) onChange(Math.min(max, Math.max(min, val)));
        }}
        className="h-full w-12 border-0 bg-transparent text-center text-sm text-foreground focus:ring-0"
        min={min}
        max={max}
        aria-label={t("quantity")}
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(max, quantity + 1))}
        className="flex h-full w-11 items-center justify-center text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        aria-label={t("increaseQuantity")}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
