import { useEffect, useRef, useState } from "react";

interface EditableInputProps {
  initInput: string;
  dataToParent: (value: string) => void;
}

const EditableInput = ({ initInput, dataToParent }: EditableInputProps) => {
  const [inputValue, setInputValue] = useState(initInput);
  const [isEditable, setIsEditable] = useState<Boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(initInput);
  }, [initInput]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    dataToParent(value);
  };

  function editField() {
    setIsEditable(true);
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }

  return (
    <input
      ref={inputRef}
      type="text"
      value={inputValue}
      readOnly={!isEditable}
      onClick={() => editField()}
      onBlur={() => setIsEditable(false)}
      onChange={handleChange}
    />
  );
};

export default EditableInput;
