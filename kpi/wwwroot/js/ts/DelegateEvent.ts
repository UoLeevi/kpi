interface IDelegateEvent<T> {
    add(handler: { (data?: T): void }): void;
    addOnce(handler: { (data?: T): void }): void;
    remove(handler: { (data?: T): void }): void;
}

class DelegateEvent<T> implements IDelegateEvent<T> {
    private handlers: { (data?: T): void; }[] = [];

    public add(handler: { (data?: T): void }): void {
        this.handlers.push(handler);
    }

    public addOnce(handler: { (data?: T): void }): void {
        let onceHandler = function (d?: T) {
            this.remove(onceHandler);
            handler(d);
        }.bind(this);
        this.add(onceHandler);
    }

    public remove(handler: { (data?: T): void }): void {
        this.handlers = this.handlers.filter(h => h !== handler);
    }

    public trigger(data?: T) {
        this.handlers.slice(0).forEach(h => h(data));
    }
}