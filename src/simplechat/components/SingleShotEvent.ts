export class SingleShotEvent<T> {
    observers: ((value: T) => void)[]

    emit(value: T) {
        this.observers.forEach(observer => {
            observer(value)
        })
    }

    observe(observer: () => void) {
        this.observers.push(observer)
    }
}
