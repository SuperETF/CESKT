// types/Trainer.ts

export type Trainer = {
    id: string;
    name: string;
    specialty: string[]; // Supabase에서는 text[]
    location?: string;
    image?: string;
    introduction?: string;
    experience: string;
    rating: number;
  };
  