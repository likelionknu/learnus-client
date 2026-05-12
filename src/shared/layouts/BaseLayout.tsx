import { Outlet } from "react-router-dom";
import { DefaultBar } from "../components/DefaultBar";

function BaseLayout() {
  return (
    <>
      <DefaultBar>
        <>
          <Outlet />
        </>
      </DefaultBar>
    </>
  );
}

export default BaseLayout;
