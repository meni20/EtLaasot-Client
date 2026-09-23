import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  DocumentType,
  TraineeDocumentsTarget,
} from "../interfaces/trainee-document.interface";
import traineeDocumentService from "../services/trainee-document.service";

export function useTraineeDocuments(
  target: TraineeDocumentsTarget,
  actorId: string,
  sessionId: number,
) {
  const client = useQueryClient();
  const queryKey = [
    "trainee-documents",
    sessionId,
    actorId,
    target.mode,
    target.traineeUuid ?? actorId,
  ];
  const documents = useQuery({
    queryKey,
    queryFn: ({ signal }) => traineeDocumentService.list(target, signal),
    gcTime: 0,
    retry: false,
  });
  const refresh = () => client.invalidateQueries({ queryKey, exact: true });
  const upload = useMutation({
    mutationFn: ({ type, file }: { type: DocumentType; file: File }) =>
      traineeDocumentService.upload(target, type, file),
    onSuccess: refresh,
    gcTime: 0,
  });
  const remove = useMutation({
    mutationFn: (type: DocumentType) =>
      traineeDocumentService.remove(target, type),
    onSuccess: refresh,
    gcTime: 0,
  });
  return { documents, upload, remove };
}
