import Editor, { Monaco } from "@monaco-editor/react";
import { editor } from 'monaco-editor/esm/vs/editor/editor.api'
import { useRef } from "react";
import loader from "@monaco-editor/loader";

// loader.init().then(monaco => {
//   const wrapper = document.getElementById("root");
//   if (wrapper) {
//     wrapper.style.height = "100vh";
//     const properties = {
//       value: "function hello() {\n\talert(\"Hello world!\");\n}",
//       language:  "javascript",
//     }
    
//     monaco.editor.create(wrapper,  properties);
//   }
// });


export function JSONEditor({updateJsonRef, updateIsValidJson }: {updateJsonRef: (json: string) => void, updateIsValidJson: (isValid: boolean) => void}) {
  const editorRef = useRef<editor.IStandaloneCodeEditor|null>(null);
 

  function handleEditorDidMount(editor: editor.IStandaloneCodeEditor, _monaco: Monaco) {
    editorRef.current = editor; 
  }

  function handleOnChange(value: string|undefined): void {
    updateJsonRef(value || '')
  }

  function handleEditorValidation(markers: editor.IMarker[]) {
    if (markers.length == 0) {
      updateIsValidJson(true)
    } else {
      updateIsValidJson(false)
    }
  }
  
  return (
    <Editor
      height="50vh"
      width="100vh"
      defaultLanguage="json"
      defaultValue="{}"
      theme="vs-dark"
      onMount={handleEditorDidMount}
      onChange={handleOnChange}
      onValidate={handleEditorValidation}
   />
  )
}