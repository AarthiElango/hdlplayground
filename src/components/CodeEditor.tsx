import Editor from "@monaco-editor/react";
import  { useRef, useState, useEffect, useImperativeHandle, forwardRef } from "react";

interface CodeEditorProps {
  value: string;
  language: string;
  onEdited: (edited: boolean) => void;
}

export interface CodeEditorRef {
  getValue: () => string;
  setValue: (newValue: string) => void;
}

const CodeEditor = forwardRef<CodeEditorRef, CodeEditorProps>(({ value, language, onEdited }, ref) => {
  const editorRef = useRef<any>(null);
  const [isEdited, setIsEdited] = useState(false);
  const originalValueRef = useRef(value);

  useEffect(() => {
    onEdited(isEdited);
  }, [isEdited]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleChange = (newValue?: string) => {
    if (newValue?.trim() && newValue !== originalValueRef.current) {
      setIsEdited(true);
    } else {
      setIsEdited(false);
    }
  };

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    getValue: () => editorRef.current?.getValue() ?? "",
    setValue: (newValue: string) => {
      if (editorRef.current) {
        editorRef.current.setValue(newValue);
        originalValueRef.current = newValue;
        setIsEdited(false);
      }
    },
  }));

  // Reset editor content when parent updates value
  useEffect(() => {
    originalValueRef.current = value;
    setIsEdited(false);
    if (editorRef.current && value !== editorRef.current.getValue()) {
      editorRef.current.setValue(value);
    }
  }, [value]);

  return (
    <div className="h-full">
      <Editor
        language={language}
        value={value}
        onMount={handleEditorDidMount}
        onChange={handleChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
        }}
      />
    </div>
  );
});

export default CodeEditor;
