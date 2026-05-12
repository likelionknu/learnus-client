import { useCallback, useState } from "react";
import { getAssignments, getAssignmentsDetail } from "../apis";
import type { AssignmentDetail } from "../utils";

interface AssignmentSummary {
  id: number;
  name: string;
}

export default function useAssignmentDetail(
  sidNumber: number | null,
  assignmentId: number | null,
) {
  const [assignment, setAssignment] = useState<AssignmentDetail | null>(null);
  const [assignmentName, setAssignmentName] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!sidNumber || !assignmentId) return;
    setIsLoading(true);
    setError(null);
    try {
      const [detailRes, assignmentsRes] = await Promise.all([
        getAssignmentsDetail({ sid: sidNumber, assignmentId }),
        getAssignments({ sid: sidNumber, page: 0, size: 8 }),
      ]);
      const detailData = detailRes.data?.data ?? detailRes.data;
      const assignmentsData = assignmentsRes.data?.data ?? assignmentsRes.data;
      const assignmentList: AssignmentSummary[] = Array.isArray(
        assignmentsData?.content,
      )
        ? assignmentsData.content
        : [];
      const matched = assignmentList.find((item) => item.id === assignmentId);
      setAssignment(detailData);
      setAssignmentName(matched?.name ?? "");
      setContent(detailData?.submissionContent ?? "");
    } catch {
      setError("과제를 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [assignmentId, sidNumber]);

  return {
    assignment,
    assignmentName,
    content,
    setContent,
    isLoading,
    error,
    fetchData,
  };
}
