import { useNavigate } from "react-router-dom";

//지도 클릭시 헬스장 가까운곳 5군데 보이게 하는곳
export default function NearbyGymList({ nearbyGyms, helperMessage }) {
  const navigate = useNavigate();

  return (
    <section className="nearby-gyms-section">
      <div className="nearby-gyms-header">
        <h3 className="nearby-gyms-title">근처 헬스장 5곳</h3>
        <p className="nearby-gyms-helper">{helperMessage}</p>
      </div>

      <div className="nearby-gyms-list">
        {nearbyGyms.length > 0 ? (
          nearbyGyms.map((gym) => (
            <article
              key={gym.id}
              className="nearby-gyms-item"
              onClick={() => navigate(`/gym/${gym.id}`, { state: { gym } })}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  navigate(`/gym/${gym.id}`, { state: { gym } });
                }
              }}
            >
              <div className="nearby-gyms-item-top">
                <h4 className="nearby-gyms-name">{gym.name}</h4>
                <span className="nearby-gyms-distance">{gym.distance}km</span>
              </div>
              <p className="nearby-gyms-address">{gym.address}</p>
            </article>
          ))
        ) : (
          <p className="nearby-gyms-empty">
            위치를 선택하면 주변 헬스장 5곳이 여기에 표시됩니다.
          </p>
        )}
      </div>
    </section>
  );
}
