export interface Fact {
  id: number;
  category: string;
  text: string;
}

export interface Project {
  title: string;
  category: string;
  description: string;
  factIds: number[];
  tags: string[];
}
