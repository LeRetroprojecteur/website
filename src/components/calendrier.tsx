"use client";

import {useClickAway} from "@uidotdev/usehooks";
import classNames from "classnames";
import {capitalize, sortBy, uniqBy} from "lodash-es";
import Image from "next/image";
import Link from "next/link";
import {useSearchParams} from "next/navigation";
import {ChangeEvent, MutableRefObject, useCallback, useEffect, useMemo, useState,} from "react";
import ReactSlider from "react-slider";

import {addDays, format, startOfDay, subDays} from "date-fns";
import {utcToZonedTime} from "date-fns-tz";
import {fr} from "date-fns/locale";

import MovieTable from "@/components/movie-table";
import {Movie} from "@/lib/types";
import {checkNotNull, floatHourToString, isTodayInParis, movie_info_containsFilteringTerm,} from "@/lib/util";

import logo_square from "../assets/logo_square.png";

async function getApiMovies(date: Date): Promise<Movie[]> {
  return (await fetch(`/api/${format(date, "y-MM-dd")}`)).json();
}

async function getAllApiMovies(date: Date): Promise<Movie[]> {
  return (
    await fetch(`/admin/tous-les-films/api/${format(date, "y-MM-dd")}`)
  ).json();
}

export default function Calendrier({ allMovies }: { allMovies: boolean }) {
  const _ = useSearchParams();

  const getMovies = useMemo(
    () => (allMovies ? getAllApiMovies : getApiMovies),
    [allMovies],
  );

  const today = useMemo(
    () => startOfDay(utcToZonedTime(new Date(), "Europe/Paris")),
    [],
  );

  const [date, setDate] = useState(today);

  const [movies, setMovies] = useState<Movie[] | undefined>(undefined);

  useEffect(() => {
    (async () => {
      setMovies(await getMovies(today));
    })();
  }, [today, getMovies]);

  const previousDate = useMemo(
    () => (isTodayInParis(date) ? undefined : subDays(date, 1)),
    [date],
  );
  const nextDate = useMemo(() => addDays(date, 1), [date]);

  const [minHour, setMinHour] = useState(0);
  const [maxHour, setMaxHour] = useState(24);

  const minHourFilteringTodaysMissedFilms = useMemo(() => {
    if (!isTodayInParis(date)) {
      return minHour;
    }

    const now = utcToZonedTime(new Date(), "Europe/Paris");
    return Math.max(minHour, now.getHours() + now.getMinutes() / 60 - 0.3);
  }, [minHour, date]);

  const onPrevious = useCallback(async () => {
    setDate(checkNotNull(previousDate));
    setMovies(await getMovies(checkNotNull(previousDate)));
    setMinHour(0);
    setMaxHour(24);
  }, [setDate, previousDate, setMinHour, setMaxHour, getMovies]);
  const onNext = useCallback(async () => {
    setDate(checkNotNull(nextDate));
    setMovies(await getMovies(nextDate));
    setMinHour(0);
    setMaxHour(24);
  }, [setDate, nextDate, setMaxHour, setMinHour, getMovies]);

  return (
    <>
      <h3>
        <input
          type="button"
          id="date-backward"
          className="button"
          value="◄"
          style={{
            color: previousDate == null ? "var(--lightgrey)" : "var(--red",
          }}
          onClick={previousDate == null ? undefined : onPrevious}
        />
        <b>
          <span id="date-of-today">
            {capitalize(format(date, "EEEE d MMMM y", { locale: fr }))}
          </span>
        </b>
        <input
          type="button"
          id="date-forward"
          className="button"
          value="►"
          style={{ color: "var(--red)" }}
          onClick={onNext}
        />
      </h3>
      <p style={{ margin: "7px" }}></p>
      <FilterableMovies
        movies={movies}
        minHour={minHour}
        minHourFilteringTodaysMissedFilms={minHourFilteringTodaysMissedFilms}
        maxHour={maxHour}
        setMinHour={setMinHour}
        setMaxHour={setMaxHour}
      />
    </>
  );
}

export function FilterableMovies({
  movies,
  maxHour,
  minHour,
  minHourFilteringTodaysMissedFilms,
  setMinHour,
  setMaxHour,
}: {
  movies: Movie[] | undefined;
  maxHour: number;
  minHour: number;
  minHourFilteringTodaysMissedFilms: number;
  setMinHour: (h: number) => void;
  setMaxHour: (h: number) => void;
}) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const toggleDropdown = useCallback(
    () => setDropdownVisible(!dropdownVisible),
    [dropdownVisible, setDropdownVisible],
  );
  const listRef: MutableRefObject<HTMLDivElement> = useClickAway(() =>
    setDropdownVisible(false),
  );

  const [rg, setRg] = useState(true);
  const [rd, setRd] = useState(true);
  const [em, setEm] = useState(true);
  const onChangeRg = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setRg(e.target.checked),
    [setRg],
  );
  const onChangeRd = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setRd(e.target.checked),
    [setRd],
  );
  const onChangeEm = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setEm(e.target.checked),
    [setEm],
  );

  const [filter, setFilter] = useState("");
  const onChangeFilter = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setFilter(e.target.value),
    [setFilter],
  );

  const onSliderChange = useCallback(
    (values: [min: number, max: number]) => {
      const [min, max] = values;
      setMinHour(min);
      setMaxHour(max);
    },
    [setMinHour, setMaxHour],
  );

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <Slider minHour={minHour} maxHour={maxHour} onChange={onSliderChange} />
        <p style={{ margin: "7px" }}></p>
        <div id="wrap">
          <div
            ref={listRef}
            id="neighborhood-list"
            className={classNames("dropdown-check-list", {
              visible: dropdownVisible,
            })}
            tabIndex={100}
          >
            <span className="anchor" onClick={toggleDropdown}>
              Par quartiers
            </span>
            <ul className="items">
              <label className="checkbox">
                <input
                  className="checkbox"
                  type="checkbox"
                  id="rg"
                  checked={rg}
                  onChange={onChangeRg}
                />{" "}
                Rive gauche
                <br />
              </label>
              <label className="checkbox">
                <input
                  className="checkbox"
                  type="checkbox"
                  id="rd"
                  checked={rd}
                  onChange={onChangeRd}
                />{" "}
                Rive droite
                <br />
              </label>
              <label className="checkbox">
                <input
                  className="checkbox"
                  type="checkbox"
                  id="em"
                  checked={em}
                  onChange={onChangeEm}
                />{" "}
                Extra-muros
                <br />
              </label>
            </ul>
          </div>
          &nbsp;
          <div className="filtering">
            <label htmlFor="filtering-box"></label>
            <input
              type="text"
              className="filtering-box"
              id="filtering-box"
              placeholder="Réalisateur, pays..."
              onChange={onChangeFilter}
            />
          </div>
        </div>
      </div>
      <p style={{ margin: "7px" }}></p>
      <MovieTable>
        {movies == null ? (
          [...Array(20)].map((_, i) => (
            <tr key={i}>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
          ))
        ) : (
          <Movies
            movies={movies}
            filter={filter}
            minHour={minHourFilteringTodaysMissedFilms}
            maxHour={maxHour}
            quartiers={[
              ...(rg ? ["rg"] : []),
              ...(rd ? ["rd"] : []),
              ...(em ? ["em"] : []),
            ]}
          />
        )}
      </MovieTable>
    </>
  );
}

export function Movies({
  movies,
  quartiers,
  filter,
  minHour,
  maxHour,
}: {
  movies: Movie[];
  quartiers: string[];
  filter: string;
  minHour: number;
  maxHour: number;
}) {
  const moviesWithFilteredShowtimes = useMemo(
    () =>
      movies
        .map((movie) => ({
          ...movie,
          showtimes_theater: movie.showtimes_theater
            .map((theater) => ({
              ...theater,
              showtimes: theater.showtimes.filter(
                (showtime) => showtime >= minHour && showtime <= maxHour,
              ),
            }))
            .filter(
              (theater) =>
                theater.showtimes.length > 0 &&
                quartiers.includes(theater.location_2),
            ),
        }))
        .filter((movie) => movie.showtimes_theater.length > 0),
    [movies, minHour, maxHour, quartiers],
  );

  const filteredMovies = useMemo(
    () =>
      moviesWithFilteredShowtimes.filter(
        (movie) =>
          filter == "" || movie_info_containsFilteringTerm(movie, filter),
      ),
    [moviesWithFilteredShowtimes, filter],
  );

  const isbefore22inparis =
    utcToZonedTime(new Date(), "Europe/Paris").getHours() < 22;
  const [lastCallTime, setLastCallTime] = useState(0);
  const callCloudFunction = () => {
    const currentTime = new Date().getTime();
    const delay = 10 * 60 * 1000; // 5 minutes in milliseconds
    if (currentTime - lastCallTime >= delay) {
      const cloudFunctionUrl =
        "https://europe-west1-website-cine.cloudfunctions.net/send_warning";
      const warning =
        "Attention, le website est vide et il n'est pas encore 22h.";
      const urlWithParams = new URL(cloudFunctionUrl);
      urlWithParams.searchParams.set("warning", warning);
      fetch(urlWithParams);
      setLastCallTime(currentTime);
    }
    return (
      "Ce site web est en cours de maintenance planifiée. Veuillez nous excuser pour la gêne occasionnée. " +
      "Notre site sera à nouveau disponible sous peu, revenez bientôt !"
    );
  };

  return (
    <>
      {filteredMovies.length > 0 ? (
        sortBy(filteredMovies, (movie) => [
          movie.year,
          movie.directors,
          movie.title,
        ]).map((movie) => (
          <tr key={movie.id}>
            <td>
              <Link
                href={`/details/${movie.id}`}
                style={{ textDecoration: "none" }}
              >
                {movie?.category === "COUP DE CŒUR" ? (
                  <div className="logo_cdc">
                    <Image
                      src={logo_square}
                      width={20}
                      height={17}
                      alt="coup-de-coeur"
                    />
                  </div>
                ) : null}
                <b>{movie.title}</b>, {movie.directors} ({movie.year})
              </Link>
            </td>
            <td>
              {sortBy(
                uniqBy(
                  movie.showtimes_theater,
                  (showtime_theater) => showtime_theater.clean_name,
                ),
                (showtime_theater) => showtime_theater.clean_name,
              ).map((showtime_theater) => (
                <div key={showtime_theater.clean_name}>
                  {showtime_theater.clean_name} (
                  {showtime_theater.zipcode_clean}
                  ):{" "}
                  {sortBy(showtime_theater.showtimes)
                    .map((showtime) => {
                      return floatHourToString(showtime);
                    })
                    .join(", ")}
                </div>
              ))}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={2}>
            <b>
              {filter.length > 0
                ? "Aucun film ne correspond à cette recherche aujourd'hui."
                : isbefore22inparis
                  ? callCloudFunction()
                  : "Aucun film n'est programmé aujourd'hui."}
            </b>
          </td>
        </tr>
      )}
    </>
  );
}

function Slider({
  minHour,
  maxHour,
  onChange,
}: {
  minHour: number;
  maxHour: number;
  onChange: (values: [min: number, max: number]) => void;
}) {
  return (
    <>
      <div>
        Séances entre{" "}
        <b style={{ color: "var(--red)", fontWeight: "bold" }}>
          {minHour}h et {maxHour}h
        </b>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <ReactSlider
          className="slider-range"
          value={[minHour, maxHour]}
          max={24}
          min={0}
          minDistance={1}
          onChange={onChange}
          thumbClassName="noUi-handle"
          trackClassName="slider-track"
        />
      </div>
    </>
  );
}
