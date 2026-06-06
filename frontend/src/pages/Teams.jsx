import { useState, useEffect } from "react";
import api from "../services/api";
import CreateTeamForm from "../components/CreateTeamForm";
import AddMemberForm from "../components/AddMemberForm";
import TeamCard from "../components/TeamCard";

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await api.get("/teams/");
      setTeams(res.data?.results ?? res.data ?? []);
    } catch (err) {
      console.error("Failed to fetch teams", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this team?")) return;
    try {
      await api.delete(`/teams/${id}`);
      fetchTeams();
    } catch (err) {
      console.error("Failed to delete team", err);
    }
  };

  return (
    <div className="w-full px-8 py-8 bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Teams
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your teams and members
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              setShowForm(!showForm);
              setShowAddForm(false);
            }}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg cursor-pointer border-none transition-colors duration-150 shadow-lg shadow-indigo-500/20"
          >
            + New Team
          </button>
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setShowForm(false);
            }}
            className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg cursor-pointer border-none transition-colors duration-150"
          >
            + Add Member
          </button>
        </div>
      </div>

      {showForm && (
        <CreateTeamForm
          onCreated={() => {
            setShowForm(false);
            fetchTeams();
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {showAddForm && (
        <AddMemberForm
          teams={teams}
          onAdded={() => {
            setShowAddForm(false);
            fetchTeams();
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-400 text-sm">Loading teams...</p>
        </div>
      ) : teams.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-800/50 border border-gray-700 border-dashed rounded-2xl">
          <span className="text-4xl mb-3">👥</span>
          <p className="text-gray-300 font-medium">No teams yet</p>
          <p className="text-gray-500 text-sm mt-1">
            Click "+ New Team" to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Teams;
