export default function Letext({
  text,
  onChange,
}: {
  text: string;
  onChange?: (text: string) => void;
}) {
  if (onChange) {
    return (
      <textarea
        style={{
          width: "100%",
          borderRadius: "0.25rem",
          borderColor: "black",
          padding: "8px",
        }}
        value={text}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  } else {
    return <p>{text}</p>;
  }
}
