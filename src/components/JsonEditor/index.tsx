import Editor, { Monaco } from "@monaco-editor/react";
import { editor } from 'monaco-editor/esm/vs/editor/editor.api'
import { useEffect, useRef, useState } from "react";


const sampleData = {
  "id": 12345,
  "first_name": "Mikey",
  "last_name": "Shean",
  "date_of_birth": "2022-05-22T00:00:00Z",
  "gender": "MALE",
  "is_active": true,
  "title": "Software Engineer",
  "skills": [
      {
          "id": "skills-1",
          "name": "Python"
      },
      {
          "id": "skills-2",
          "name": "TypeScript"
      }
  ],
  "address": {
      "id": "address-1",
      "street": "123 Road"
  }
}

const defaultJson = JSON.stringify(sampleData, null, 2)

export default function JSONEditor({updateJsonRef, updateIsValidJson }: {updateJsonRef: (json: string) => void, updateIsValidJson: (isValid: boolean) => void}) {
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

  useEffect(() => {
    updateJsonRef(defaultJson)
  }, [])
  
  return (
    <Editor
      height="50vh"
      width="100%"
      defaultLanguage="json"
      defaultValue={defaultJson}
      theme="vs-dark"
      onMount={handleEditorDidMount}
      onChange={handleOnChange}
      onValidate={handleEditorValidation}
   />
  )
}