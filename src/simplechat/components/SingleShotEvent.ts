// TODO replace by observable
export class SingleShotEvent<T> {
    private observers: Observer<T>[] = []

    emit(value: T) {
        this.observers.forEach(observer => {
            observer(value)
        })
    }

    observe(observer: Observer<T>) {
        this.observers.push(observer)
    }
}

type Observer<T> = (value: T) => void
