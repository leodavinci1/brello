import formatTodos from "./formatTodos";

export const fetchSuggestion = async (board: Board) => {
    const todos = formatTodos(board);

    const res = await fetch("/api/generateSummary", {
        method: "POST",
        headers: {
            "Content-Type": "applications/json",
        },
        body: JSON.stringify({todos}),
    })

    const GPTdata = await res.json();

    const {content} = GPTdata;

    return content;
}

export default fetchSuggestion;