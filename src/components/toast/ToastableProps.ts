export type ToastableProps = {
    toastMessage: (msg: string, delay?: number) => void
    toastError: (err: Error, delay?: number) => void
}