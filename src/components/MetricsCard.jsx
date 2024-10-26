import { IconChevronRight } from "@tabler/icons-react";
import React from "react";
const MetricsCard = ({ title, subtitle, value, icon: Icon, onClick }) => {
  return (
    <div className="flex flex-col rounded-xl border bg-white shadow-sm dark:border-neutral-800 dark:bg-[#13131a]">
      <div className="flex justify-between gap-x-3 p-4 md:p-5">
        <div>
          <p className="text-xs uppercase tracking-wide text-neutral-500">
            {title}
          </p>
          <div className="mt-1 flex items-center gap-x-2">
            <h3 className="text-xl font-medium text-neutral-200 sm:text-2xl">
              {value}
            </h3>
          </div>
        </div>
      </div>
      <div className="text-blue flex size-[46px] h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-blue-200 dark:bg-[#1c1c24]">
        <Icon size={25} className="text-green-500" />
      </div>
      <a
        className="inline-flex items-center justify-between rounded-b-xl border-t border-gray-200 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 md:px-5 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800"
        href="#"
        onClick={onClick}
      >
        {subtitle}
        <IconChevronRight />
      </a>
    </div>
  );
};

export default MetricsCard;