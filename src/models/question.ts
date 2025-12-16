export interface ISubject {
    id?: string;
    name: string;
    description?: string;
    createdAt?: number;
}

export interface ITopic {
    id?: string;
    subjectId: string;
    name: string;
    description?: string;
    level?: number;
    createdAt?: number;
}

export interface IQuestion {
    id?: string;
    topicId: string;
    subjectId: string;
    type: "practice" | "test";
    content: string;
    pdfUrl?: string;
    pdfName?: string;
    difficulty?: "easy" | "medium" | "hard";
    hints?: string[];
    solution?: string;
    createdAt?: number;
}

export interface IQuestionsBySubject {
    subject: ISubject;
    topics: {
        topic: ITopic;
        questions: IQuestion[];
    }[];
}
