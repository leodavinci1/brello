const formatTodos = (board: Board) => {
    const todos = Array.from(board.columns.entries());
    const flatArray = todos.reduce((map, [key,value]) => {
        map[key] = value.todos;
        return map;
    }, {} as { [key in TypedColumn]: Todo[]});


    const flatArrayCounted = Object.entries(flatArray).reduce(
        (map, [key, value]) => {
            map[key as TypedColumn] = {count: value.length,
            content: value.length ? value.map((item) => item.title) : null
            };
            return map;
        },
        {} as { [ key in TypedColumn ]: any }
    );

    return flatArrayCounted;
}

export default formatTodos;