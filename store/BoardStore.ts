import { ID, databases, storage } from '@/appwrite';
import { addSuggestedTodos } from '@/lib/addSuggestedTodos';
import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn';
import uploadImage from '@/lib/uploadImage';
import { create } from 'zustand'

interface BoardState {
    board: Board;
    getBoard: () => void;
    setBoardState: (board: Board) => void;
    updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;
    searchString: string;
    setSearchString: (searchString: string) => void;
    deleteTask: (taskIndex: number,  todo: Todo, id: TypedColumn) => void;
    newTaskInput: string;
    setNewTaskInput: (input: string) => void;
    newTaskType: TypedColumn;
    setNewTaskType: (columnId: TypedColumn) => void;
    image: File | null;
    setImage: (image: File | null) => void;
    addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void;
    suggestedTodos: Array<string> | [];
    setSuggestedTodos: (suggestedTodos: Array<string> | []) => void;
    addSuggestionsToBoard: () => void;
}



export const useBoardStore = create<BoardState>((set, get) => ({
  suggestedTodos: [],
  image: null,
  setImage: (image: File | null) => set({image}),
  newTaskType: "todo",
  board: {
    columns: new Map<TypedColumn, Column>()
  },
  newTaskInput: "",
  setNewTaskType: (columnId: TypedColumn) => set({ newTaskType: columnId }),
  setNewTaskInput: (input: string) => set({ newTaskInput: input }),
  searchString: "",
  setSearchString: (searchString) => set({searchString}),
  setSuggestedTodos: (suggestedTodos) => set({suggestedTodos}),
  getBoard: async () => {
    const board = await getTodosGroupedByColumn(get().suggestedTodos);
    set({ board });
  },
  addSuggestionsToBoard: () => {
    addSuggestedTodos(get().suggestedTodos, get().board);
  },
  updateTodoInDB: async (todo, columnId) => {
    await databases.updateDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
        todo.$id,
        {
            title: todo.title,
            status: columnId
        }
       
    )
  },
  
  deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
    const newColumns = new Map(get().board.columns);

    newColumns.get(id)?.todos.splice(taskIndex, 1);

    set ({board: { columns: newColumns}})

    if (todo.image) {
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId)
    }

    await databases.deleteDocument(process.env.NEXT_PUBLIC_DATABASE_ID!, process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!, todo.$id)
    
  },

  setBoardState: (board) => set({board}),
  addTask: async (todo: string, columnId: TypedColumn, image?: File | null) => {
    let file: Image | undefined;

    if (image) {
      const fileUploaded = await uploadImage(image);
      if(fileUploaded) {
        file = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id,
        }
      }
    }

    const { $id } = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        ...(file && { image: JSON.stringify(file) })
      }
    );

    set({newTaskInput: ""})
    set((state) => {
      const newColumns = new Map(state.board.columns);

      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columnId,
        ...(file && { image: file}),
      }
      const column = newColumns.get(columnId);

      if(!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        })
      } else {
        newColumns.get(columnId)?.todos.push(newTodo);
      }

      return {
        board: {
          columns: newColumns
        }
      }
    })
  }
}))