export interface SessionFile {
  id: number;
  createdAt: string;
  createdBy: string;
  name: string;
}

export interface SessionFileDetail {
  data: {
    name: string;
    content: string;
  };
  error: {
    code: string | null;
    message: string | null;
  };
}

export interface SessionFilesResponse {
  data: {
    content: SessionFile[];
    empty: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
  error: {
    code: string | null;
    message: string | null;
  };
}
