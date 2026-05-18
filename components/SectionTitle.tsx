interface Props {
  title: string;
  subtitle?: string;
}

export default function SectionTitle({ title, subtitle }: Props) {
  return (
    <div className="text-center mb-12">
      <h1 className="heading-2 text-ink">
        {title}
      </h1>
      {subtitle && (
        <p className="body-md mt-3 max-w-xl mx-auto">{subtitle}</p>
      )}
      <div className="mt-5 mx-auto w-16 h-0.5 rounded-full bg-gradient-to-r from-qing to-gold" />
    </div>
  );
}
