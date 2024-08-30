import { Button, Form, Input, message, Popover, Select } from "antd";
import React, { useEffect, useState } from "react";
import roundGroupbg from "../images/roundGroupbg.png";
import "../App.css";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Schedule from "./Schedule";
import { useForm } from "antd/es/form/Form";

const RoundGroup = () => {
  const [tables, setTables] = useState([]);
  const URL = "http://localhost:5000/api/round";
  const URL2 = "http://localhost:5000/api/round-group";
  const URL3 = "http://localhost:5000/single-team";
  const URL4 = "http://localhost:5000/api/team-group/ranked-team";
  const { id } = useParams();
  const [roundIds, setRoundIds] = useState([]);
  const [user, setUser] = useState([]);
  const [participants, setParticipants] = useState([]);
  const role = localStorage.getItem("role");
  const [matches, setMatches] = useState([]);
  const [roundId, setRoundId] = useState(null);
  const [round2Id, setRound2Id] = useState(null);
  const [open, setOpen] = useState(false);
  const [form] = useForm();
  const [groupId, setGroupId] = useState(null);
  const [brackets, setBrackets] = useState([]);
  const location = useLocation();
  const { formatType } = location.state || {};
  const { tournamentId } = location.state || {};
  const navigate = useNavigate();

  const hide = () => {
    setOpen(false);
  };
  console.log(roundId);

  const isRound2 = () =>
    Array.isArray(roundIds) &&
    roundIds.some((round) => round.roundName === "Round 2");

  const isProgress = () =>
    Array.isArray(matches) &&
    matches.some((m) => m.matchStatus === "Completed");

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const handleCreateMatch = async (groupId) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/pickleball-match/${groupId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.status === 200 || res.status === 201) {
        fetchMatch(roundId);
        message.success("Match was successfully created");
      }
    } catch (e) {
      message.error(e.response?.data?.message || "Failed to create match");
    }
  };

  const isCompleted = () => {
    return matches.every((m) => m.matchStatus === "Completed");
  };

  const fetchMatch = async (roundId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/pickleball-match/round/${roundId}`
      );
      setMatches(res.data);
    } catch (e) {
      console.error("Error fetching match:", e);
    }
  };

  useEffect(() => {
    if (roundIds.length > 0) {
      const roundId = roundIds[0].roundId;
      setRoundId(roundId);
      if (roundIds.length > 1) {
        const round2Id = roundIds[1].roundId;
        setRound2Id(round2Id);
      }
      fetchMatch(roundId);
    }
  }, [roundIds]);

  const fetchParticipants = async (roundId) => {
    try {
      const response = await axios.get(`${URL4}/${roundId}`);
      if (response.status === 200) {
        setParticipants(response.data);
      } else {
        console.error("Failed to fetch participants");
      }
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };

  useEffect(() => {
    if (roundIds.length > 0) {
      const roundId = roundIds[0].roundId;
      fetchParticipants(roundId);
    }
  }, [roundIds]);

  const handleSave = async (roundGroupId, athleteId) => {
    try {
      const response = await axios.post(`${URL3}/${roundGroupId}`, {
        athleteId,
      });
      if (response.status === 200) {
        toast.success("Round Group saved successfully");
        fetchParticipants(roundId);
      } else {
        toast.error("Failed to save Round Group");
      }
    } catch (error) {
      console.error("Error saving Round Group:", error);
    }
  };

  const getParticipantsByRoundGroupId = (roundGroupId) => {
    return participants[roundGroupId] || [];
  };

  const fetchTable = async (roundId) => {
    try {
      const response = await axios.get(`${URL2}/${roundId}`);
      if (response.status === 200) {
        setTables(response.data);
      } else {
        console.error("Failed to fetch tables");
      }
    } catch (error) {
      console.error("Error fetching tables:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/athletes/non-teams/${id}`
      );
      if (response.status === 200) {
        setUser(response.data);
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${URL}/${id}`);
      if (response.status === 200) {
        setRoundIds(response.data.data);
      } else {
        console.error("Failed to fetch rounds");
      }
    } catch (error) {
      console.error("Error fetching rounds:", error);
    }
  };

  const nextRound = async (values) => {
    const params = {
      ...values,
      tournamentId: id,
    };
    try {
      const res = await axios.post(
        "http://localhost:5000/api/round/next-rounds",
        params,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.status === 200) {
        setBrackets(res.data);
        navigate(`/roundBracket/${id}`, {
          state: {
            data: res.data,
            formatType: formatType,
            roundId: roundId,
            round2Id: round2Id,
          },
        });
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to start next round"
      );
    }
  };

  const [numberOfTeams, setNumberOfTeams] = useState([]);

  const fetchPariticipantNextRound = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/team-group/advanced-team/${roundId}`
      );
      if (res.status === 200) {
        setNumberOfTeams(res.data);
      } else {
        message.error("Failed to fetch participants for the next round.");
      }
    } catch (e) {
      message.error(e.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (roundIds.length > 0) {
      fetchTable(roundIds[0].roundId);
    }
  }, [roundIds]);

  const handleCreateTable = async () => {
    if (roundIds.length === 0 || !roundId) {
      console.error("No valid round ID available to create a new table.");
      return;
    }

    const newTable = {
      groupName: `Group ${String.fromCharCode(65 + tables.length)}`,
      teams: [],
    };

    const queryParams = {
      roundGroupName: newTable.groupName,
    };

    try {
      const response = await axios.post(
        `http://localhost:5000/api/round-group/${roundId}`,
        queryParams
      );

      if (response.status === 200 || response.status === 201) {
        setTables([...tables, newTable]);
        fetchTable(roundId);
      } else {
        console.error(
          "Failed to create round group, response status:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error creating round group:", error.message);
      if (error.response) {
        console.error("Error response status:", error.response.status);
        console.error("Error response data:", error.response.data);
      }
    }
  };

  const userOptions = user.map((u) => {
    return {
      label: u.athleteName,
      value: u.id,
    };
  });

  const handleAddRow = (roundGroupId) => {
    const updatedParticipants = { ...participants };
    const newTeam = {
      teamId: null,
      teamName: "",
      wins: 0,
      losses: 0,
      draws: 0,
      points: 0,
      setDifference: 0,
      pointsDifference: 0,
      teamStatus: null,
    };
    if (!updatedParticipants[roundGroupId]) {
      updatedParticipants[roundGroupId] = [];
    }
    updatedParticipants[roundGroupId].push(newTeam);
    setParticipants(updatedParticipants);
  };

  const handleDeleteRow = (roundGroupId, teamIndex) => {
    const updatedParticipants = { ...participants };
    if (updatedParticipants[roundGroupId]) {
      updatedParticipants[roundGroupId].splice(teamIndex, 1);
      setParticipants(updatedParticipants);
    } else {
      console.error(`Round group with ID ${roundGroupId} does not exist.`);
    }
  };

  const handleTeamNameChange = (roundGroupId, teamIndex, value) => {
    const updatedParticipants = { ...participants };
    if (updatedParticipants[roundGroupId]) {
      updatedParticipants[roundGroupId][teamIndex].teamId = value;
      setParticipants(updatedParticipants);
    } else {
      console.error(`Round group with ID ${roundGroupId} does not exist.`);
    }
  };

  const handleDeleteTable = (tableIndex) => {
    const updatedTables = [...tables];
    updatedTables.splice(tableIndex, 1);
    setTables(updatedTables);
  };

  const handleClick = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/pickleball-match/next-rounds-match/${id}`
      );
      if (res.status === 200) {
        navigate(`/roundBracket/${id}`, {
          state: {
            data: res.data,
            formatType: formatType,
            tournamentId: tournamentId,
            roundId: roundId,
            round2Id: round2Id,
          },
        });
      }
    } catch (e) {
      message.error(
        e.response?.message || "Failed to proceed to the next round."
      );
    }
  };

  return (
    <>
      <div
        className="py-[100px] px-[64px] h-full"
        style={{
          backgroundImage: `url(${roundGroupbg})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div className="flex justify-between items-center text-3xl font-semibold text-white">
          PickleBall Round Group
          <div className="flex justify-end gap-4">
            {role === "Manager" && matches.length === 0 ? (
              <Button
                className="bg-blue-700 text-lg mt-4 py-[23px] px-6 text-white"
                onClick={handleCreateTable}
              >
                Create Table
              </Button>
            ) : (
              <>
                {role === "Manager" ? (
                  <>
                    {isRound2() ? (
                      <Button
                        className="bg-blue-700 text-lg mt-4 py-[23px] px-6 text-white"
                        onClick={() => handleClick()}
                      >
                        Next Round
                      </Button>
                    ) : (
                      <Popover
                        content={
                          <Form form={form} onFinish={nextRound}>
                            <Form.Item
                              name="numberOfTeams"
                              label="Number of teams to next round"
                              labelCol={{ span: 24 }}
                            >
                              <Select
                                options={numberOfTeams.map((num) => ({
                                  label: `${num} team`,
                                  value: num,
                                }))}
                              />
                            </Form.Item>
                            <Form.Item>
                              <Button type="primary" htmlType="submit">
                                Submit
                              </Button>
                            </Form.Item>
                          </Form>
                        }
                        title="Choose number of teams to next round"
                        trigger="click"
                        placement="bottomRight"
                        open={open}
                        onOpenChange={handleOpenChange}
                      >
                        <Button
                          className="bg-blue-700 text-lg mt-4 py-[23px] px-6 text-white"
                          onClick={() => fetchPariticipantNextRound()}
                        >
                          Next Round
                        </Button>
                      </Popover>
                    )}
                  </>
                ) : (
                  <Button
                    className="bg-blue-700 text-lg mt-4 py-[23px] px-6 text-white"
                    onClick={() => handleClick()}
                  >
                    Next Round
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {tables.map((table, tableIndex) => (
            <div key={tableIndex} className="mt-[32px]">
              <table className="w-[800px] border border-collapse border-[#C6C61A] bg-gradient-to-r from-[#1244A2] to-[#062764]">
                <thead className="text-white">
                  <tr className="border border-collapse border-[#C6C61A]">
                    <th className="w-[30px] border border-collapse border-[#C6C61A]">
                      Rank
                    </th>
                    <th className="w-[372px] border border-collapse border-[#C6C61A]">
                      {table.roundGroupName}
                    </th>
                    <th className="w-[80px] border border-collapse border-[#C6C61A]">
                      W - L
                    </th>

                    {role === "Manager" &&
                      Object.values(participants).some((group) =>
                        group.some((team) => !team.teamName)
                      ) && (
                        <th className="w-[140px] border border-collapse border-[#C6C61A]">
                          Action
                        </th>
                      )}
                  </tr>
                </thead>
                <tbody>
                  {getParticipantsByRoundGroupId(table.roundGroupId).map(
                    (team, teamIndex) => (
                      <tr key={teamIndex}>
                        <td className="border border-collapse border-[#C6C61A] py-4 text-white text-center">
                          {teamIndex + 1}
                        </td>
                        <td className="border border-collapse border-[#C6C61A] py-4 text-white text-center">
                          {team.teamName ? (
                            team.teamName
                          ) : (
                            <div>
                              {role === "Manager" && (
                                <Select
                                  className="w-full text-white"
                                  placeholder={`Team ${teamIndex + 1}`}
                                  onChange={(value) =>
                                    handleTeamNameChange(
                                      table.roundGroupId,
                                      teamIndex,
                                      value
                                    )
                                  }
                                  options={userOptions}
                                />
                              )}
                            </div>
                          )}
                        </td>

                        <td className="border border-collapse border-[#C6C61A] text-white text-center">
                          {team.wins} - {team.losses}
                        </td>

                        {role === "Manager" && !team.teamName && (
                          <td className="border border-collapse border-[#C6C61A]">
                            <div>
                              <div className="flex gap-2 justify-center">
                                <button
                                  className="bg-[#FECDCA] text-red-700 font-semibold  rounded-full px-2"
                                  onClick={() =>
                                    handleDeleteRow(
                                      table.roundGroupId,
                                      teamIndex
                                    )
                                  }
                                >
                                  Delete
                                </button>
                                <button
                                  className="bg-[#ABEFC6] text-green-700 font-semibold rounded-full px-2"
                                  onClick={() =>
                                    handleSave(table.roundGroupId, team.teamId)
                                  }
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          </td>
                        )}
                      </tr>
                    )
                  )}
                </tbody>

                {role === "Manager" && matches.length === 0 && (
                  <tfoot>
                    <tr>
                      <td colSpan="5">
                        <div className="flex gap-4 my-[16px] justify-center w-full">
                          <Button
                            className="text-[#1244A2] font-semibold"
                            onClick={() => handleDeleteTable(tableIndex)}
                          >
                            Delete Table
                          </Button>
                          <Button
                            className="bg-[#C6C61A] text-[#1244A2] font-semibold border-[#C6C61A]"
                            onClick={() => handleAddRow(table.roundGroupId)}
                          >
                            Add Team
                          </Button>
                          <Button
                            className="bg-green-200 text-lg mt-4 py-[23px] px-6 text-black"
                            onClick={() =>
                              handleCreateMatch(table.roundGroupId)
                            }
                          >
                            Create Match
                          </Button>
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Schedule
          match={matches}
          onSave={() => fetchParticipants(roundId)}
          onSave2={() => fetchMatch(roundId)}
          roundId={roundId}
          isCompleted={isCompleted()}
        />
      </div>
    </>
  );
};

export default RoundGroup;
