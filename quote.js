export class Quote{
    constructor(text, source, id, length){
        this.text = text;
        this.source = source;
        this.id = id;
        this.length = length;
    }

    set text(value){
        console.error("This property is read-only!");
    }
    set source(value){
        console.error("This property is read-only!");
    }
    set id(value){
        console.error("This property is read-only!");
    }
    set length(value){
        console.error("This property is read-only!");
    }

}