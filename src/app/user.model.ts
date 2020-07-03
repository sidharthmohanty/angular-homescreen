export interface User {
  answerLabel: string;
  id: string;
  imageUrl: string;
  name: string;
  questionLabel: string;
  quoteLabel: string;
  toggleData: {
    tempAndLocation: boolean;
    quote: boolean;
    dataAndTime: boolean;
    greetings: boolean;
    question: boolean;
  };
  email: string;
  profilePhotoURL?: string;
  role: string;
  imageName: string;
}
