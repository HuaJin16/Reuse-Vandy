export default function CheckboxInput({
  label,
  name,
  value,
  checked,
  onChange,
}) {
  return (
    <div>
      <label>
        <input
          type="checkbox"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
        />
        {label}
      </label>
    </div>
  );
}
