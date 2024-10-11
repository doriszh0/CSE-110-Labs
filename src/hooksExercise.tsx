import React, { useState, useEffect, useContext, useRef} from 'react';
import { ThemeContext, themes } from "./themeContext";
import './App.css';
import { Label, Note } from "./types"; // Import the Label type from the appropriate module


export function LikeButtonClicked(props: { setLikeNotes: React.Dispatch<React.SetStateAction<Note[]>>; 
                                            likeNotes: Note[]; 
                                            newNote: Note}) {

    const [likeState, setLikeState] = useState("🤍");

    const toggleLike = () => {
        setLikeState(likeState === "🤍" ? "❤️" : "🤍");

        if (props.likeNotes.includes(props.newNote)) {
            const newLikeNotes = props.likeNotes.filter(aNote => aNote !== props.newNote);
            props.setLikeNotes([...newLikeNotes]);
        }
        else {
            props.setLikeNotes([...props.likeNotes, props.newNote]);
        }
    }

    return (
        <button onClick={toggleLike}>{likeState}</button>
    );
}

export function DeleteButtonClicked(props: { currentTheme: typeof themes.light
                                                setLikeNotes: React.Dispatch<React.SetStateAction<Note[]>>; 
                                                likeNotes: Note[]; 
                                                delNote: Note;
                                                notes: Note[];
                                                setNotes: React.Dispatch<React.SetStateAction<Note[]>>; 
}) {

const deleteNote = () => {
    if (props.likeNotes.includes(props.delNote)) {
        const newLikeNotes = props.likeNotes.filter(aNote => aNote !== props.delNote);
        props.setLikeNotes([...newLikeNotes]);
    }
    if (props.notes.includes(props.delNote)) {
        const newNotes = props.notes.filter(aNote => aNote !== props.delNote);
        props.setNotes([...newNotes]);
    }
}

return (
<button onClick={deleteNote} 
        style={{ color: props.currentTheme.foreground,}}
        >x</button>
);
}

export function ToggleTheme(props: {currentTheme: typeof themes.dark | typeof themes.light, setCurrentTheme: React.Dispatch<React.SetStateAction<typeof themes.dark | typeof themes.light>>}) {

    const toggleTheme = () => {
        props.setCurrentTheme(props.currentTheme === themes.light ? themes.dark : themes.light);
    };
   
    return (
      <ThemeContext.Provider value={props.currentTheme}>
        <button onClick={toggleTheme}> Toggle Theme </button>
        <br/>
      </ThemeContext.Provider>
    );
}
   


function ClickCounter() {
 const [count, setCount] = useState(0);
 const theme = useContext(ThemeContext);

 const handleClick = () => {
   setCount(count + 1);
 };

 useEffect(() => {
   document.title = `You clicked ${count} times`;
 }, [count]);

 return (
    <div
    style={{
      background: theme.background,
      color: theme.foreground,
      padding: "20px",
    }}
  >
    <p>You clicked {count} times </p>
    <button
      onClick={() => setCount(count + 1)}
      style={{ background: theme.foreground, color: theme.background }}
    >
      Click me
    </button>
  </div>

 );
}