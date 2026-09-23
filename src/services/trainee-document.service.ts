import { createServerAxiosInstance } from "../config/axiosInstance";
import type {
  DocumentType,
  DocumentView,
  TraineeDocument,
  TraineeDocumentsTarget,
} from "../interfaces/trainee-document.interface";

const api = createServerAxiosInstance("");
const pathFor = (target: TraineeDocumentsTarget) =>
  target.mode === "self"
    ? "/user/me/documents"
    : `/trainee/${encodeURIComponent(target.traineeUuid)}/documents`;

const traineeDocumentService = {
  async list(target: TraineeDocumentsTarget, signal: AbortSignal) {
    return (await api.get<TraineeDocument[]>(pathFor(target), { signal })).data;
  },
  async upload(target: TraineeDocumentsTarget, type: DocumentType, file: File) {
    const body = new FormData();
    body.append("file", file);
    return (await api.put<TraineeDocument>(`${pathFor(target)}/${type}`, body))
      .data;
  },
  async view(
    target: TraineeDocumentsTarget,
    type: DocumentType,
    signal: AbortSignal,
  ) {
    return (
      await api.get<DocumentView>(`${pathFor(target)}/${type}/view`, { signal })
    ).data;
  },
  async remove(target: TraineeDocumentsTarget, type: DocumentType) {
    await api.delete(`${pathFor(target)}/${type}`);
  },
};

export default traineeDocumentService;
