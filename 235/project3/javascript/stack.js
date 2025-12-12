class Stack {
    constructor() {
        this.list = [];
    }

    // Return the top-most element of the stack
    // Returns null if the stack is empty
    Peek() {
        return this.list.length === 0 ? null : this.list[this.list.length - 1];
    };

    // Adds new data to the top of the stack
    Push(item){
        this.list.push(item);
    }

    // Removes and returns the top-most element of the stack
    // Returns null if the stack is empty
    Pop() {
        return this.list.length === 0 ? null : this.list.pop();
    }

    Empty() {
        if(this.list.length === 0) return;
        this.list.splice(0, this.list.length);
    }

    isEmpty() {
        return this.list.length === 0;
    }
}