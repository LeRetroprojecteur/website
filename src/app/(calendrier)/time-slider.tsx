import clsx from "clsx";
import { omit, padStart } from "lodash-es";
import ReactSlider from "react-slider";

import { CalendrierStore } from "@/lib/calendrier-store";

export default function TimeSlider({
  useCalendrierStore,
}: {
  useCalendrierStore: CalendrierStore;
}) {
  const minHour = useCalendrierStore((s) => s.minHour);
  const maxHour = useCalendrierStore((s) => s.maxHour);
  const setMinHour = useCalendrierStore((s) => s.setMinHour);
  const setMaxHour = useCalendrierStore((s) => s.setMaxHour);

  const onChange = ([newMinHour, newMaxHour]: [number, number]) => {
    setMinHour(newMinHour);
    setMaxHour(newMaxHour);
  };

  return (
    <div className="flex grow justify-between pt-3 lg:pt-7">
      <div className="border-b  pb-3 pr-4 font-medium uppercase">
        Horaires :
      </div>
      <div className="relative flex grow">
        <div className="absolute flex w-full justify-between">
          <div className="relative left-0 font-medium uppercase">{`de ${padStart(
            String(minHour),
            2,
            "0",
          )}h`}</div>
          <div className="relative right-0 font-medium uppercase">{`à ${padStart(
            String(maxHour),
            2,
            "0",
          )}h`}</div>
        </div>
        <ReactSlider
          className="grow"
          renderThumb={(props) => (
            <div
              key={props.key}
              {...omit(props, "key")}
              className="bottom-[-5.5px] outline-none"
            >
              <Thumb />
            </div>
          )}
          renderTrack={(props, state) => (
            <div
              key={props.key}
              {...omit(props, "key")}
              className={clsx("relative bottom-0 border-t ", {
                "border-dashed": state.index === 1,
                relative: state.index === 1,
              })}
            />
          )}
          value={[minHour, maxHour]}
          max={24}
          min={0}
          minDistance={1}
          onChange={onChange}
        />
      </div>
      <div className="w-2 border-b" />
    </div>
  );
}

function Thumb() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="6.5" cy="6.5" r="6.5" fill="#6A6A6D" />
    </svg>
  );
}
