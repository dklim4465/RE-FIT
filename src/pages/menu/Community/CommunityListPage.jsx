import { Outlet } from "react-router-dom";

export default function CommunityListPage() {
  return (
    <section className="page-placeholder">
      <h1>커뮤니티 목록</h1>
      <h3>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
        laoreet lacinia diam, in accumsan lorem. Ut nisi est, rutrum sit amet
        turpis ut, tincidunt iaculis odio. Phasellus quis commodo augue, quis
        rutrum purus. Suspendisse augue est, rutrum ac fermentum vel, iaculis in
        neque. Sed quis velit accumsan, condimentum tellus id, tincidunt ex.
        Etiam auctor vel velit sed imperdiet. Aliquam erat volutpat. Cras sapien
        ligula, fermentum vel laoreet vitae, dictum et neque.
      </h3>
      <Outlet />
    </section>
  );
}
