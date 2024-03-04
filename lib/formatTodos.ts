const formatTodos = (board: Board) => {
    const todos = Array.from(board.columns.entries());
    const flatArray = todos.reduce((map, [key,value]) => {
        map[key] = value.todos;
        return map;
    }, {} as { [key in TypedColumn]: Todo[]});

    console.log("flatArray", flatArray)

    const flatArrayCounted = Object.entries(flatArray).reduce(
        (map, [key, value]) => {
            console.log("key: ", key);
            console.log("value: ", value);
            map[key as TypedColumn] = {count: value.length,
            content: value.length ? value.map((item) => item.title) : null
            };
            console.log("MAP: ", map);
            return map;
        },
        {} as { [ key in TypedColumn ]: number }
    );
    console.log("flatArrayCounted", flatArray)

    return flatArrayCounted;
}

export default formatTodos;