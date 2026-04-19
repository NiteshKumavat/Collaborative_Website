export default function TeamSidebar({projects, setSelectedProject}) {

  return (
    <div className="p-4">



      {/* Team List */}
      <div className="space-y-2">
        {projects.map((team) => (
          <div
            key={team._id}
            className="p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10"
            onClick={() => setSelectedProject(team)}
          >
            <p className="font-medium">{team.title}</p>
            <p className="text-sm text-white/60">{team.team.length} members</p>
          </div>
        ))}
      </div>
    </div>
  );
}
