import { clsx } from "clsx";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-block px-2.5 py-0.5 rounded-full text-xs font-medium",
        className ?? "bg-gray-100 text-gray-800"
      )}
    >
      {children}
    </span>
  );
}
