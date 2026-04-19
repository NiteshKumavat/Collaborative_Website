import RequestBox from "./RequestBox.jsx";
import { useProjectStore } from "../store/useProjectStore.js";
import { useState, useEffect } from "react";

export default function ProfileRequests({ id }) {

  const { userProjects, fetchUserProjects, acceptRequest, rejectRequest } = useProjectStore();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (id) fetchUserProjects(id);
  }, [id, fetchUserProjects]);

  const acceptHandler = async(projectId, userId) => {
    await acceptRequest(projectId, userId)
    window.location.reload();
  }

  const rejectHandler = async(projectId, userId) => {
    await rejectRequest(projectId, userId)
    window.location.reload();
  }



  useEffect(() => {
    if (!userProjects || userProjects.length === 0) return;

    const extracted = userProjects.flatMap(project =>
      project.requests?.map(req => ({
        requestId: req._id,
        userId: req.userId,
        name: req.name,
        status: req.status,
        requestedAt: req.requestedAt,
        projectName: project.title,
        projectId: project._id
      })) || []
    );

    setRequests(extracted);
  }, [userProjects]);


  return (
    <div className="mt-6">
      <h2 className="font-semibold text-lg">Collaboration Requests</h2>

      <div className="bg-white/20 p-4 rounded-xl space-y-4 mt-2">

        {requests.length > 0 ? (
          requests.map((req) => (
            <RequestBox
              key={req.requestId}
              name={req.name}
              project={req.projectName}
              requestedAt={new Date(req.requestedAt).toLocaleDateString()}
              status={req.status}
              onApprove={() => acceptHandler(req.projectId, req.userId)}
              onReject={() => rejectHandler(req.projectId, req.userId)}
            />
          ))
        ) : (
          <p className="text-gray-400 text-sm">No pending collaboration requests.</p>
        )}

      </div>
    </div>
  );
}
