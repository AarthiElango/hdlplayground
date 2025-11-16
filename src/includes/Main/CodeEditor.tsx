import { useWorkspaceStore } from "@/store/workspace";
import Editor from "@monaco-editor/react";
import { isEmpty } from "lodash";
import  { useRef, useState, useEffect, useImperativeHandle, forwardRef } from "react";

interface CodeEditorProps {
  contents: string;
  language: string;
  src:string;
  filename:string;
  refKey:string;
}

export interface CodeEditorRef {
  getValue: () => string;
  setValue: (newValue: string) => void;

}

const CodeEditor = forwardRef<CodeEditorRef, CodeEditorProps>(({ contents, language, src, filename, refKey }, ref) => {
  const editorRef = useRef<any>(null);
  const originalValueRef = useRef(contents);
  const [value, setValue] = useState(contents || "");
  const { setFileContents } = useWorkspaceStore();

  useEffect(()=>{
    setFileContents(refKey, filename, value);
  },[value]);


  useEffect(()=>{
    if(isEmpty(contents) && !isEmpty(src)){
      async function getContents(){
            const APP_URL = import.meta.env.VITE_APP_URL;

            const res = await fetch(`${APP_URL}/${src}`);
            if(res.ok){
              const contents = await res.text();
              if(contents){
                setValue(contents);
              }
            }

      }
      getContents();
    }
  },[src, contents]);



  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleChange = (newValue?: string) => {
        setFileContents(refKey, filename, newValue??'');
  };

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    getValue: () => editorRef.current?.getValue() ?? "",
    setValue: (newValue: string) => {
      if (editorRef.current) {
        editorRef.current.setValue(newValue);
        originalValueRef.current = newValue;
      }
    },
  }));


  return (
    <div className="h-full">
      <Editor
        language={language || "plaintext"}
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
