import { getDayMovies } from "@/lib/movies";
import { getStartOfTodayInParis } from "@/lib/util";

import Calendrier from "./calendrier";

export const dynamic = "force-static";
export const revalidate = 1;

export default function CalendrierPage() {
  return <Calendrier serverMovies={getDayMovies(getStartOfTodayInParis())} />;
}
