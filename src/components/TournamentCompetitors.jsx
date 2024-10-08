import "../styles/competitor.css";
import defaultImg from "../images/competitor-img.png";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import { Empty, Pagination } from "antd";
import ListRegistration from "./ListRegistration";
import ListTournamentRegis from "./ListTournamentRegist";
import ListAthlete from "./ListAthlete";
import ListAthleteTournament from "./ListAltheteTournament";

const TournamentCompetitor = ({ tournamentId, onSave, requireNumber }) => {
  const [competitors, setCompetitor] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const jwtToken = localStorage.getItem("token");

  const role = localStorage.getItem("role");
  const location = useLocation();
  const basePath = location.pathname.split("/")[1];
  console.log(basePath);
  const handlePageChange = (page, pageSize) => {
    setPageIndex(page);
    setPageSize(pageSize);
  };

  const URL = "https://nhub.site/api/athletes/tournament/paging";

  const getListCompetitor = async (pageIndex, pageSize) => {
    try {
      const res = await axios.get(`${URL}/${tournamentId}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        params: {
          pageIndex: pageIndex - 1 || 0,
          pageSize,
        },
      });

      if (res.status === 200) {
        setCompetitor(res.data.items);
        setTotalItemsCount(res.data.totalItemsCount);
      }
    } catch (error) {
      console.error("Error fetching competitors:", error);
    }
  };

  useEffect(() => {
    getListCompetitor(pageIndex, pageSize);
  }, [pageIndex, pageSize]);

  return (
    <div>
      {role === "Manager" && basePath !== "roundBracket" && (
        <div>
          <button
            className="bg-[#1244a2] rounded-lg px-2 py-4 m-4 text-white"
            onClick={() => setOpenPopup(true)}
          >
            Get List Guest Regist
          </button>
          <button
            className="bg-[#1244a2] rounded-lg px-2 py-4 m-4 text-white"
            onClick={() => setOpenPopup2(true)}
          >
            Get List Athlete
          </button>
        </div>
      )}
      <div className="grid grid-cols-auto-fit sm:grid-cols-auto-fit md:grid-cols-auto-fit lg:grid-cols-auto-fit xl:grid-cols-auto-fit gap-8 justify-items-center justify-center pb-[120px]">
        {competitors && competitors.length > 0 ? (
          competitors.map((competitor) => (
            <div className="gradient-bg" key={competitor.id}>
              <img
                className="w-[360px] h-[480px]"
                src={competitor.avatar ? competitor.avatar : defaultImg}
                alt={competitor.id}
              />
              <div className="card-bg">
                <div className="name">{competitor.athleteName}</div>
                <div className="textAndSupportingText">
                  <div className="text">
                    Rank {competitor.rank || "unknown"}
                  </div>
                  <div className="supportingText">
                    {competitor.gender || "unknown"}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <Empty />
        )}
      </div>

      <div className="flex w-full justify-center">
        <Pagination
          current={pageIndex}
          pageSize={pageSize}
          total={totalItemsCount}
          showSizeChanger
          onChange={handlePageChange}
          pageSizeOptions={[5, 10, 20, 50]}
        />
      </div>

      {openPopup && (
        <ListTournamentRegis
          openPopup={openPopup}
          handleClose={() => setOpenPopup(false)}
          competitors={competitors}
          tournamentId={tournamentId}
          onSave={getListCompetitor}
        />
      )}
      {openPopup2 && (
        <ListAthleteTournament
          openPopup={openPopup2}
          handleClose={() => setOpenPopup2(false)}
          competitors={competitors}
          tournamentId={tournamentId}
          onSave={getListCompetitor}
          onSave2={onSave}
          requireNumber={requireNumber}
        />
      )}
    </div>
  );
};

export default TournamentCompetitor;
