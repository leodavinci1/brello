
export const addSuggestedTodos = (suggestedTodos: Array<string>, board: Board) => {
    
    const suggestions = [
        ...suggestedTodos.map((item, idx) => ({
            $id: `suggestion-${idx}`,
            $createdAt: new Date().toISOString(),
            status: 'todo',
            title: item,
            image: null,
            isSuggestion: true,

        }))
    ]

    const todoColumn = board.columns.get("todo");

    if (todoColumn) {

        // Remove previous occurrences of todos with isSuggestion true
        todoColumn.todos = todoColumn.todos.filter(todo => !todo.isSuggestion);

        suggestions.forEach(suggestion => {
            // Ensure the suggestion is of type "todo"
            if (suggestion.status === "todo") {
                todoColumn.todos.push(suggestion);
            }
        });

        // Sort the todos array so that todos with isSuggestion true appear at the end
        todoColumn.todos.sort((a, b) => {
            if (a.isSuggestion === b.isSuggestion) {
                return 0;
            }
            return a.isSuggestion ? 1 : -1;
        });
    }

    

    const boardTransformed: Board = {
        columns: board.columns
    }


    return boardTransformed;
}