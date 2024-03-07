"use client";

import Image from "next/image";
import TrelloLogo from "@/assets/trello.png";
import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/16/solid";
import Avatar from "react-avatar";
import { useBoardStore } from "@/store/BoardStore";
import { fetchSuggestion } from "@/lib/fetchSuggestion";

function Header() {
  const [
    searchString,
    setSearchString,
    board,
    setSuggestedTodos,
    addSuggestionsToBoard,
  ] = useBoardStore((state) => [
    state.searchString,
    state.setSearchString,
    state.board,
    state.setSuggestedTodos,
    state.addSuggestionsToBoard,
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [suggestion, setSuggestion] = useState<string>("");
  useEffect(() => {
    if (board.columns.size === 0) {
      return;
    }
    setLoading(true);
    const fetchSuggestionFunc = async () => {
      const suggestion = await fetchSuggestion(board);
      const newTodos = suggestion.split("Todos#")[1];

      const newTodosArr = newTodos
        .split("|")
        .map((item) => item.replace(/[^a-zA-Z ]/g, ""));
      setSuggestedTodos(newTodosArr);
      addSuggestionsToBoard();
      setSuggestion(
        "Welcome to the Brello Todo App! Check out the AI generated suggestions for new To Dos."
      );
      setLoading(false);
    };

    fetchSuggestionFunc();
  }, [board.columns.get("todo")]);

  return (
    <header>
      <div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl">
        <div
          className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br
        from-pink-400 to-[#0055D1] filter blur-3xl opacity-50 -z-50"
        />
        {/* Brello Logo */}
        <div className="flex items-center">
          <Image
            src={TrelloLogo}
            alt="Brello Logo"
            width={300}
            height={300}
            className="w-14 md:w-20 md:pb-0 object-contain"
          />
          <div className="font-sans font-black	subpixel-antialiased text-4xl md:text-6xl	text-trello-logo tracking-wide">
            Brello
          </div>
        </div>

        <div className="flex items-center space-x-5 flex-1 justify-end w-full m-10">
          {/* Search Box */}
          <form className="flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial">
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="flex-1 outline-none p-2"
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
            />
            <button type="submit" hidden>
              Search
            </button>
          </form>

          {/* Avatar */}
          <Avatar name="Leonardo Cunha" round size="50" color="#0055D1" />
        </div>
      </div>
      <div className="flex items-center justify-center px-5 md:py-5 py-2">
        <p className="p-5 flex items-center font-light pr-5 shadow-xl rounded-xl w-fit bg-white italic max-w-3xl text-[#0055D1]">
          <UserCircleIcon
            className={`inline-block h-10 w-10 text-[#0055D1] mr-1 ${
              loading && "animate-spin"
            }`}
          />
          {suggestion && !loading
            ? suggestion
            : "GPT is summarising your tasks for the day..."}
        </p>
      </div>
    </header>
  );
}

export default Header;
