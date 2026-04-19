export default function MemberSidebar({project}) {

  if (!project) {
    return (
      <div className="p-4 text-center text-white/60">
        <p className="font-medium text-white/80">No Project Selected</p>
        <p className="text-sm">Select a project to view team members.</p>
      </div>
    );
  }

  const members = project.team

  return (
    <div className="p-4">

      <div className="space-y-3">
        {members.map((m) => (
          <div
            key={m._id}
            className="p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10"
          >
            <p className="font-medium">{m.name}</p>
            <p className="text-sm text-white/60">{new Date(m.joinedAt).toLocaleDateString("en-IN")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
