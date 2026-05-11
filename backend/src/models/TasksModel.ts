export interface Task {
    id: number,
    title: string,
    description: string | "",
    status: "todo" | "done",
    createdAt: Date,
    updatedAt: Date
}