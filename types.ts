/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface Project {
  id: string;
  title: string;
  category: string;
  status: 'Em Tramitação' | 'Aprovado' | 'Arquivado';
  summary: string;
  year: number;
}

export interface News {
  id: string;
  title: string;
  date: string;
  category: string;
  image: string;
  excerpt: string;
}

export interface Video {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  duration: string;
  url: string;
}

export interface Amendment {
  id: string;
  city: string;
  value: string;
  area: string;
  year: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}
