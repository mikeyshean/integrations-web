import Editor, { Monaco } from "@monaco-editor/react";
import { editor } from 'monaco-editor/esm/vs/editor/editor.api'
import { useRef } from "react";


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
      width="100%"
      defaultLanguage="json"
      defaultValue='{ "example_field": "example_value" }'
      theme="vs-dark"
      onMount={handleEditorDidMount}
      onChange={handleOnChange}
      onValidate={handleEditorValidation}
   />
  )
}