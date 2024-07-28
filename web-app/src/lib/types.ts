

export enum ChatRols {
    user = 'user',
    model = 'model',
}

export interface Message {
    role: ChatRols;
    text: string;
    date: Date;
}