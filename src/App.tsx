import './App.css';
import { Label, Note } from "./types"; // Import the Label type from the appropriate module
import { dummyNotesList } from "./constants"; // Import the dummyNotesList from the appropriate module
import { useState, useContext } from 'react';
import { LikeButtonClicked, ToggleTheme, DeleteButtonClicked } from './hooksExercise';
import { ThemeContext, themes } from "./themeContext";

function App() {
  
  const [currentTheme, setCurrentTheme] = useState(themes.light);
  const [contentBGColor, setContentBGColor] = useState('');
  const [titleBGColor, setTitleBGColor] = useState('');

  let [likeNotes, setLikeNotes] = useState<Note[]>([]); 
  const theme = useContext(ThemeContext);
  
  const [notes, setNotes] = useState(dummyNotesList); 
  const initialNote = {
   id: -1,
   title: "",
   content: "",
   label: Label.other,
  };
  const [createNote, setCreateNote] = useState(initialNote);
  const [oldTitle, setOldTitle] = useState("");

  const createNoteHandler = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("title: ", createNote.title);
    console.log("content: ", createNote.content);
    createNote.id = notes.length + 1;
    setNotes([createNote, ...notes]);
    setCreateNote(initialNote);
  };

  const [selectedNote, setSelectedNote] = useState<Note>(initialNote)

  const editTitleHandler = (event: React.FormEvent<HTMLHeadingElement>) => {
    if (event.currentTarget.innerHTML.length > 50) {
          alert("Title cannot exceed 50 characters");
          event.currentTarget.innerHTML = oldTitle;
    } 
    else {
      setOldTitle(event.currentTarget.innerHTML);
      selectedNote.title = event.currentTarget.innerHTML;
    }
  };

  const editContentHandler = (event: React.FormEvent<HTMLParagraphElement>) => {
    selectedNote.content = event.currentTarget.innerHTML;
  };

  const editLabelHandler = (event: React.FormEvent<HTMLParagraphElement>) => {
    selectedNote.label = event.currentTarget.innerHTML as Label;
  };

  const handleTitleBlur = (event: React.FormEvent<HTMLHeadingElement>) => {
    const likeIndex = likeNotes.findIndex(n => selectedNote.id === n.id);
    if (likeNotes[likeIndex] != null) {
      const tempLikeNotes = [];
      for (let i = 0; i < likeNotes.length; i++) {
        if (likeNotes[i].id !== selectedNote.id) {
          tempLikeNotes.push(likeNotes[i]);
        }
        else {
          likeNotes[i].title = event.currentTarget.innerHTML;
          tempLikeNotes.push(likeNotes[i]);
        }
      }
      setLikeNotes([...tempLikeNotes]);
    }
  }


 return (
   <div className='app-container' style={{
      background: currentTheme.background,
      color: currentTheme.foreground,
      padding: "20px",
  }}>

    <ToggleTheme currentTheme={currentTheme} setCurrentTheme={setCurrentTheme}/>
    <form className="note-form" onSubmit={createNoteHandler}
      style={{
        background: currentTheme.background,
        color: currentTheme.foreground,
      }}>
    <div>
    <input
        	placeholder="Note Title"
          style={{ backgroundColor: titleBGColor }}
          onFocus={() => setTitleBGColor('#e0f7fa')}
          onBlur={() => setTitleBGColor('')}
          onInput={(event) => {
            if (event.currentTarget.value.length > 50) {
              alert("Title cannot exceed 50 characters");
              event.currentTarget.value = oldTitle;
            } 
            else {
              setOldTitle(event.currentTarget.value);
              selectedNote.title = event.currentTarget.value;
            }
          }}
        	onChange={(event) =>
          	setCreateNote({ ...createNote, title: event.target.value })} required >
      	</input>
    	</div>

    	<div>
      	<textarea
          style={{ backgroundColor: contentBGColor }}
          onFocus={() => setContentBGColor('#e0f7fa')}
          onBlur={() => setContentBGColor('')}
        	onChange={(event) =>
          	setCreateNote({ ...createNote, content: event.target.value })}
        	required>
      	</textarea>
    	</div>

  <div>
     	<select
       	onChange={(event) =>
         	setCreateNote({ ...createNote, label: event.target.value as Label })}
       	required>
       	<option value={Label.personal}>Personal</option>
       	<option value={Label.study}>Study</option>
       	<option value={Label.work}>Work</option>
       	<option value={Label.other}>Other</option>
     	</select>
   	</div>

    	<div><button type="submit">Create Note</button></div>
  	</form>

    <div className="notes-grid"
      style={{
        background: currentTheme.background,
        color: currentTheme.foreground,
      }}>
       {notes.map((note) => (
         <div
            style={{
              background: currentTheme.background,
              color: currentTheme.foreground,
            }}
           key={note.id}
           className="note-item">
           <div className="notes-header">
             <LikeButtonClicked setLikeNotes={setLikeNotes} likeNotes={likeNotes} newNote={note} />
             <DeleteButtonClicked currentTheme={currentTheme} 
                setLikeNotes={setLikeNotes} likeNotes={likeNotes} delNote={note}
                notes={notes} setNotes={setNotes}/>
           </div>
           <h2 contentEditable="true"
              onFocus={() => {setSelectedNote(note); setOldTitle(note.title);}}
              onInput={editTitleHandler}
              onBlur={handleTitleBlur}
            > {note.title} </h2>
           <p contentEditable="true"
              onFocus={() => setSelectedNote(note)}
              onInput={editContentHandler}
            > {note.content} </p>
           <p contentEditable="true"
              onFocus={() => setSelectedNote(note)}
              onInput={editLabelHandler}
            > {note.label} </p>
         </div>
       ))}
     </div>
          <div className="notes-item"
            style={{
              background: currentTheme.background,
              color: currentTheme.foreground,
            }}>
          <h2>List of Favorites: </h2>
              <ul>
                  {likeNotes.map((note) => <li key={note.id}>{note.title}</li>)}
              </ul>
          </div>
    <br/>
   </div>

 );
}

export default App;