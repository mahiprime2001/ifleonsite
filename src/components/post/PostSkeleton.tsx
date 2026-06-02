export const PostSkeleton = () => (
  <div className="min-h-screen bg-transparent pt-20">
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="animate-pulse">
        <div className="h-4 bg-muted rounded w-1/4 mb-8"></div>
        <div className="h-12 bg-muted rounded w-3/4 mb-6"></div>
        <div className="flex flex-wrap items-center gap-6 mb-6">
          <div className="h-5 bg-muted rounded w-1/6"></div>
          <div className="h-5 bg-muted rounded w-1/6"></div>
          <div className="h-5 bg-muted rounded w-1/12"></div>
        </div>
        <div className="surface-card rounded-2xl p-8 mb-12 space-y-4">
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-3/4"></div>
        </div>
      </div>
    </article>
  </div>
);
