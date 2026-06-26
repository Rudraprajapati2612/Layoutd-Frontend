import { ReactNode, ComponentPropsWithoutRef } from "react";

interface SectionProps extends ComponentPropsWithoutRef<"section"> {
  children: ReactNode;
  outerClassName?: string;
  innerClassName?: string;
}

export function Section({
  children,
  className,
  outerClassName,
  innerClassName,
  ...rest
}: SectionProps) {
  const outerClasses = [
    "py-24 md:py-32",
    outerClassName ?? className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={outerClasses} {...rest}>
      <div
        className={[
          "mx-auto max-w-[1120px] px-6",
          innerClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </div>
    </section>
  );
}
