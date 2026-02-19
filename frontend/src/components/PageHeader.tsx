interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon: string;
}

const PageHeader = ({ title, subtitle, icon }: PageHeaderProps) => {
  return (
    <div className="page-header">
      <h1 style={{ color: 'white' }}>
        <span className="material-symbols-outlined">{icon}</span>
        {title}
      </h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
};

export default PageHeader;
