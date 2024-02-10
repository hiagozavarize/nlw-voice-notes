import { ChangeEvent, useState } from "react";
import { NewNoteCard } from "./components/New-Note-Card";
import { NoteCard } from "./components/Note-Card";

interface Note {
  id: string;
  date: Date;
  content: string;
}

export function App() {
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem("notes");
    if (notesOnStorage) return JSON.parse(notesOnStorage);
    return [];
  });

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;

    setSearch(query);
  }

  const filteredNotes =
    search !== ""
      ? notes.filter((note) =>
          note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        )
      : notes;
  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    };
    const notesArray = [newNote, ...notes];
    setNotes(notesArray);

    localStorage.setItem("notes", JSON.stringify(notesArray));
  }

  function onNoteDeleted(id: string) {
    const notesArray = notes.filter((note) => {
      return note.id != id;
    });
    setNotes(notesArray);
    localStorage.setItem("notes", JSON.stringify(notesArray));
  }
  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
      <form className="w-full">
        <input
          className="w-full text-3xl bg-transparent font-semibold outline-none tracking-tight placeholder: text-slate-500"
          type="text"
          placeholder="Busque em suas notas..."
          onChange={handleSearch}
        />
      </form>
      <div className="h-px bg-slate-700" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
        <NewNoteCard onNoteCreated={onNoteCreated} />
        {filteredNotes.map((note) => {
          return (
            <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted} />
          );
        })}
      </div>
    </div>
  );
}
