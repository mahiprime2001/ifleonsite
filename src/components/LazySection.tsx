import { Suspense } from "react";

export const LazySection = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-gray-500">
          Loading…
        </div>
      }
    >
      {children}
    </Suspense>
  );
};
