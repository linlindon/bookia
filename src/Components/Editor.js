import Editor from "ckeditor5-custom-build/build/ckeditor";
import { CKEditor } from "@ckeditor/ckeditor5-react";

function ContentEditor(props) {
  return (
    <CKEditor
      editor={Editor}
      data={props.noteData ? props.noteData.content : props.inputDatas.content}
      onReady={(editor) => {
        editor.editing.view.change((writer) => {
          writer.setStyle(
            "height",
            "200px",
            editor.editing.view.document.getRoot()
          );
        });
      }}
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
  );
}

export default ContentEditor;
