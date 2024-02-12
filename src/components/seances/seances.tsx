"use client";

import clsx from "clsx";
import { some, sortBy, take, uniqBy } from "lodash-es";
import { useCallback, useMemo, useState } from "react";

import { ShowtimesTheater } from "@/lib/types";
import { floatHourToString, splitIntoSubArrays } from "@/lib/util";

import { CalendrierCopy } from "../typography/typography";

export default function Seances({
  showtimes_theater,
  timesPerLine,
}: {
  showtimes_theater: ShowtimesTheater[];
  timesPerLine?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = useCallback(
    () => setIsExpanded(!isExpanded),
    [isExpanded, setIsExpanded],
  );

  const sortedTheaters = useMemo(
    () =>
      sortBy(
        uniqBy(
          showtimes_theater,
          (showtime_theater) => showtime_theater.clean_name,
        ),
        (showtime_theater) => showtime_theater.clean_name,
      ),
    [showtimes_theater],
  );

  const needsExpanding = useMemo(
    () =>
      sortedTheaters.length > 3 ||
      some(sortedTheaters, (theater) => theater.showtimes.length > 3),
    [sortedTheaters],
  );

  return (
    <div
      onClick={toggleExpanded}
      className={clsx(
        { "cursor-pointer": needsExpanding },
        "flex grow flex-col gap-10px lg:gap-5px",
      )}
    >
      {take(sortedTheaters, isExpanded ? sortedTheaters.length : 2).map(
        (theater) => (
          <SeancesTheater
            showtimesTheater={theater}
            key={theater.clean_name}
            isExpanded={isExpanded}
            timesPerLine={timesPerLine}
          />
        ),
      )}
      {needsExpanding && (
        <div className="flex justify-end">
          <CalendrierCopy className="font-semibold">
            {isExpanded ? "Moins de séances ↑" : "Plus de séances ↓"}
          </CalendrierCopy>
        </div>
      )}
    </div>
  );
}

function transformZipcode(inZip: string) {
  if (inZip.substring(inZip.length - 3) == "ème") {
    return (
      <span>
        {inZip.replace("ème", "")}
        <sup>e</sup>
      </span>
    );
  } else if (inZip.substring(inZip.length - 2) == "er") {
    return (
      <span>
        {inZip.replace("er", "")}
        <sup>er</sup>
      </span>
    );
  } else {
    return <span>{inZip}</span>;
  }
}

export function SeancesTheater({
  showtimesTheater,
  timesPerLine,
  isExpanded,
}: {
  showtimesTheater: ShowtimesTheater;
  timesPerLine?: number;
  isExpanded: boolean;
}) {
  const lineGroups = splitIntoSubArrays(
    sortBy(
      take(
        showtimesTheater.showtimes,
        isExpanded ? showtimesTheater.showtimes.length : 4,
      ),
    ),
    timesPerLine ?? 4,
  );

  return (
    <div className="flex justify-between" key={showtimesTheater.clean_name}>
      <div className="w-min grow pr-10px">
        <CalendrierCopy>
          {showtimesTheater.clean_name} (
          {transformZipcode(showtimesTheater.zipcode_clean)})
        </CalendrierCopy>
      </div>
      <div className="flex flex-col">
        {lineGroups.map((showtimes, i) => (
          <ShowtimesLine key={i} threeShowtimes={showtimes} />
        ))}
      </div>
    </div>
  );
}

function ShowtimesLine({ threeShowtimes }: { threeShowtimes: number[] }) {
  return (
    <div className="flex flex-col lg:flex-row lg:justify-end">
      {threeShowtimes.map((showtime) => (
        <div key={showtime} className="group flex justify-end">
          <CalendrierCopy>{floatHourToString(showtime)}</CalendrierCopy>
          <div className="hidden group-last:hidden lg:block">
            <CalendrierCopy>&nbsp;•&nbsp;</CalendrierCopy>
          </div>
        </div>
      ))}
    </div>
  );
}
