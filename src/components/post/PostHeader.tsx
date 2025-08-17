interface PostHeaderProps {
  title: string;
}

export const PostHeader = ({ title }: PostHeaderProps) => (
  <header className="mb-8">
    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
      {title}
    </h1>
  </header>
);
