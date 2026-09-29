import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import * as teamsService from '../firebase/teams';

const TeamContext = createContext();

export const TeamProvider = ({ children }) => {
  const { currentUser, userProfile } = useAuth();
  const { showToast } = useToast();

  const [teams, setTeams] = useState([]);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore saved teamId from localStorage
  const savedTeamId = typeof window !== 'undefined' ? localStorage.getItem('notestack_active_team') : null;

  // Real-time subscription to user's teams
  useEffect(() => {
    if (!currentUser) {
      setTeams([]);
      setCurrentTeam(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsub = teamsService.subscribeUserTeams(
      currentUser.uid,
      (userTeams) => {
        setTeams(userTeams);
        // If user had a previously selected team, keep it active if still a member
        if (savedTeamId) {
          const found = userTeams.find((t) => t.id === savedTeamId);
          setCurrentTeam(found || null);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error in teams subscription:', err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [currentUser, savedTeamId]);

  // Switch workspace (null = Personal, or team object)
  const switchTeam = useCallback((team) => {
    setCurrentTeam(team);
    if (team?.id) {
      localStorage.setItem('notestack_active_team', team.id);
      showToast(`Switched to "${team.name}" workspace`, 'info');
    } else {
      localStorage.removeItem('notestack_active_team');
      showToast('Switched to Personal workspace', 'info');
    }
  }, [showToast]);

  // Create team
  const createTeam = useCallback(async (teamData) => {
    if (!currentUser) return null;
    try {
      const newTeam = await teamsService.createTeam(
        currentUser.uid,
        currentUser.email,
        userProfile?.fullName || currentUser.displayName || 'Owner',
        teamData
      );
      showToast(`Team "${newTeam.name}" created!`, 'success');
      switchTeam(newTeam);
      return newTeam;
    } catch (err) {
      console.error('Failed to create team:', err);
      showToast(err.message || 'Error creating team', 'error');
      throw err;
    }
  }, [currentUser, userProfile, showToast, switchTeam]);

  // Add member
  const addMember = useCallback(async (teamId, memberData) => {
    try {
      const added = await teamsService.addTeamMember(teamId, memberData);
      showToast(`Added ${memberData.email} to team`, 'success');
      return added;
    } catch (err) {
      console.error('Failed to add member:', err);
      showToast(err.message || 'Error adding team member', 'error');
      throw err;
    }
  }, [showToast]);

  // Remove member
  const removeMember = useCallback(async (teamId, memberUid) => {
    try {
      await teamsService.removeTeamMember(teamId, memberUid);
      showToast('Member removed from team', 'info');
    } catch (err) {
      console.error('Failed to remove member:', err);
      showToast('Error removing team member', 'error');
      throw err;
    }
  }, [showToast]);

  // Update member role
  const updateMemberRole = useCallback(async (teamId, memberUid, newRole) => {
    try {
      await teamsService.updateTeamMemberRole(teamId, memberUid, newRole);
      showToast(`Member role updated to ${newRole}`, 'success');
    } catch (err) {
      console.error('Failed to update member role:', err);
      showToast(err.message || 'Error updating member role', 'error');
      throw err;
    }
  }, [showToast]);

  // Delete team
  const deleteTeam = useCallback(async (teamId) => {
    try {
      await teamsService.deleteTeam(teamId);
      if (currentTeam?.id === teamId) {
        switchTeam(null);
      }
      showToast('Team workspace deleted', 'info');
    } catch (err) {
      console.error('Failed to delete team:', err);
      showToast('Error deleting team', 'error');
      throw err;
    }
  }, [currentTeam, switchTeam, showToast]);

  return (
    <TeamContext.Provider
      value={{
        teams,
        currentTeam,
        loading,
        switchTeam,
        createTeam,
        addMember,
        removeMember,
        updateMemberRole,
        deleteTeam,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};

const defaultTeamContext = {
  teams: [],
  currentTeam: null,
  loading: false,
  switchTeam: () => {},
  createTeam: async () => {},
  addMember: async () => {},
  removeMember: async () => {},
  updateMemberRole: async () => {},
  deleteTeam: async () => {},
};

export const useTeam = () => {
  const context = useContext(TeamContext);
  return context || defaultTeamContext;
};

export default TeamContext;
