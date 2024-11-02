import React, { useState } from "react";
import KanbanBoard from "../components/KanbanBoard";

const ScreeningSchedule = () => {
  const { state } = useState();

  return (
    <div className="w-full overflow-scroll">
      <KanbanBoard state={state} />
    </div>
  );
};

export default ScreeningSchedule;
