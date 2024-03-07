"use client";

import getUrl from "@/lib/getUrl";
import { useBoardStore } from "@/store/BoardStore";
import { SparklesIcon, XCircleIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps,
} from "react-beautiful-dnd";

type Props = {
  todo: Todo;
  index: number;
  id: TypedColumn;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
};

function TodoCard({
  todo,
  index,
  id,
  innerRef,
  draggableProps,
  dragHandleProps,
}: Props) {
  const [
    deleteTask,
    addTask,
    getBoard,
    addSuggestionsToBoard,
  ] = useBoardStore((state) => [
    state.deleteTask,
    state.addTask,
    state.getBoard,
    state.addSuggestionsToBoard,
  ]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleAddSuggestion = () => {
    addTask(todo.title, "todo", null);
    getBoard();
    addSuggestionsToBoard();
  };

  const handleDeleteTask = async (index, todo, id) => {
    await deleteTask(index, todo, id);
    getBoard();
  };

  useEffect(() => {
    if (todo.image) {
      const fectchImage = async () => {
        const url = await getUrl(todo.image!);

        if (url) {
          setImageUrl(url.toString());
        }
      };

      fectchImage();
    }
  }, [todo]);

  return (
    <div
      className={` ${
        todo.isSuggestion
          ? "border-2 border-dashed border-gray-200 rounded-md hover:bg-white"
          : "bg-white rounded-md space-y-2 drop-shadow-md"
      } `}
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
    >
      <div
        className={` items-center p-5 ${
          todo.isSuggestion ? "flex justify-between" : "flex justify-between"
        } `}
      >
        <div className="flex justify-start items-center">
          {todo.isSuggestion && (
            <SparklesIcon className="text-yellow-500 min-h-8 min-w-8 h-8 w-8 mr-4 opacity-40" />
          )}
          <p className="">{todo.title}</p>
        </div>

        {!todo.isSuggestion && (
          <button
            aria-label={`Remove ${id}`}
            onClick={() => handleDeleteTask(index, todo, id)}
            className="text-red-500 hover:text-red-600"
          >
            <XCircleIcon className="ml-5 h-8 w-8" />
          </button>
        )}
        {todo.isSuggestion && (
          <button
            type="button"
            onClick={handleAddSuggestion}
            className="ml-2 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-2 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
          >
            Add
          </button>
        )}
      </div>
      {imageUrl && (
        <div className="h-full w-full rounded-b-md">
          <Image
            src={imageUrl}
            alt="Task image"
            width={400}
            height={200}
            className="w-full object-contain rounded-b-md"
          />
        </div>
      )}
    </div>
  );
}

export default TodoCard;
