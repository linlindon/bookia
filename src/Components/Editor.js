import Editor from "ckeditor5-custom-build/build/ckeditor";
import { CKEditor } from "@ckeditor/ckeditor5-react";

function ContentEditor(props) {
  // const parse = require("html-react-parser");
  return (
    <div className="App">
      <CKEditor
        editor={Editor}
        // config={editorConfiguration}
        data={props.noteData ? props.noteData.content : ""}
        // onReady={(editor) => {
        //   You can store the "editor" and use when it is needed.
        //   console.log("Editor is ready to use!", editor);
        // }}
        onChange={(event, editor) => {
          const data = editor.getData();
          console.log({ data });
          props.setNoteInput(data);
          console.log({ event, editor, data });
        }}
        // onBlur={(event, editor) => {
        //   console.log("Blur.", editor);
        // }}
        // onFocus={(event, editor) => {
        //   console.log("Focus.", editor);
        // }}
      />
    </div>
  );
}

export default ContentEditor;
