import firebase from "./firebaseTools";

const tools = {
  allTagsArray(groupData) {
    let allTags = [];
    groupData.forEach((tagBox) => {
      tagBox.tags.forEach((tag) => {
        allTags.push(tag);
      });
    });
    return allTags;
  },
  allGroupTitleArray(groupData) {
    let allTitles = [];
    groupData.forEach((tagBox) => {
      allTitles.push(tagBox.name);
    });
    return allTitles;
  },
  isNoteIncludeTag(tagsArray, noteData) {
    if (tagsArray.length === 0) {
      return false;
    } else {
      return tagsArray.every((i) => {
        return noteData.tagNames.includes(i);
      });
    }
  },
  async deleteNotesTag(userId, tag) {
    let changeNotesArray = [];
    let changeNotesTagArray = [];

    // query所有有那個標籤的筆記
    await firebase.queryNotesByTag(userId, tag).then((notes) => {
      notes.forEach((note) => {
        changeNotesArray.push(note.data());
      });
    });
    //刪除本地資料包裡面的那個標籤，得到新的tag array，再塞回去本地資料包
    changeNotesArray.forEach((note, index) => {
      changeNotesTagArray = note.tagNames.filter((name) => {
        return name !== tag;
      });
      changeNotesArray[index].tagNames = [...changeNotesTagArray];
    });
    console.log("更改好的資料包", changeNotesArray);

    // 利用id去更改firebase的資料
    await Promise.all(
      changeNotesArray.map(async (note) => {
        await firebase.updateNoteTag(userId, note.id, note.tagNames);
      })
    );
  },
  async deleteBooksTag(userId, tag) {
    let changeBooksArray = [];
    let changeBookTagArray = [];
    await firebase.queryBooksByTag(userId, tag).then((books) => {
      books.forEach((book) => {
        changeBooksArray.push(book.data());
      });
    });
    changeBooksArray.forEach((book, index) => {
      changeBookTagArray = book.tagNames.filter((name) => {
        return name !== tag;
      });
      changeBooksArray[index].tagNames = [...changeBookTagArray];
    });
    console.log("書本promise前的資料包", changeBooksArray);

    await Promise.all(
      changeBooksArray.map(async (book) => {
        await firebase.updateBookTags(userId, book.id, book.tagNames);
      })
    );
  },
};

export default tools;
