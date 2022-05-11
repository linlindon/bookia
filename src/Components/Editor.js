import React, { Component } from "react";
import parse from "html-react-parser";
import { CKEditor, CKEditorContext } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

function Editor(props) {
  const parse = require("html-react-parser");
  return (
    <div className="App">
      <CKEditor
        editor={ClassicEditor}
        data={props.noteData ? props.noteData.content : ""}
        onReady={(editor) => {
          // You can store the "editor" and use when it is needed.
          console.log("Editor is ready to use!", editor);
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          console.log(data);
          // console.log(parse("<p>Hello, World!</p>"));
          props.setNoteInput(parse(data));
          console.log({ event, editor, data });
        }}
        onBlur={(event, editor) => {
          console.log("Blur.", editor);
        }}
        onFocus={(event, editor) => {
          console.log("Focus.", editor);
        }}
      />
    </div>
  );
}

export default Editor;
