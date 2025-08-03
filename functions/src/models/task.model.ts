export interface Task {
    id: string;
    userId: string;
    title: string;
    description?: string;
    isCompleted: boolean;
    createdAt: FirebaseFirestore.Timestamp | Date;
    updatedAt: FirebaseFirestore.Timestamp | Date;  
    isActive: boolean;
}