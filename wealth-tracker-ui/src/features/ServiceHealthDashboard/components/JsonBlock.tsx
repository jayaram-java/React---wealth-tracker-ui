interface JsonBlockProps {
  title: string;
  value: unknown;
}

const JsonBlock = ({ title, value }: JsonBlockProps) => {
  return (
    <div className="service-health__json-block">
      <h4>{title}</h4>
      <pre>{JSON.stringify(value, null, 2)}</pre>
    </div>
  );
};

export default JsonBlock;

