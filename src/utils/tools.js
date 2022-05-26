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

    await firebase.queryNotesByTag(userId, tag).then((notes) => {
      notes.forEach((note) => {
        changeNotesArray.push(note.data());
      });
    });

    changeNotesArray.forEach((note, index) => {
      changeNotesTagArray = note.tagNames.filter((name) => {
        return name !== tag;
      });
      changeNotesArray[index].tagNames = [...changeNotesTagArray];
    });

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

    await Promise.all(
      changeBooksArray.map(async (book) => {
        await firebase.updateBookTags(userId, book.id, book.tagNames);
      })
    );
  },
  async getGoogleBooks(input) {
    const key = "AIzaSyAFgX7hNUEGGTH7nWl-nbHL7fuDH9XIHco";
    const type = "orderBy=newest";
    const type2 = "maxResults=40";
    return fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${input}&key=${key}&${type}&${type2}`
    ).then((res) => res.json());
  },
  errorMessage(error) {
    return error.code === "auth/email-already-in-use"
      ? "這個email已被註冊過"
      : error.code === "auth/internal-error"
      ? "email或密碼輸入錯誤"
      : error.code === "auth/invalid-email"
      ? "email格式不正確"
      : error.code === "auth/user-not-found"
      ? "這個帳號沒有註冊過"
      : error.code === "auth/weak-password"
      ? "密碼必須超過六位數"
      : error.code === "auth/wrong-password"
      ? "密碼不正確"
      : "";
  },
};

export default tools;
