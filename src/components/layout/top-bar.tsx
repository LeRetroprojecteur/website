"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";

import { useCalendrierStore } from "@/lib/calendrier-store";
import { openMenu } from "@/lib/menu-store";

import logoAnime from "../../assets/logo-anime.gif";
import BurgerIcon from "../menu/burger-icon";

export default function TopBar() {
  const onClickLogo = useCallback(() => {
    useCalendrierStore.getState().reset();
  }, []);

  return (
    <div className="flex grow items-center">
      <div
        className="flex cursor-pointer items-center justify-start"
        onClick={openMenu}
      >
        <BurgerIcon />
      </div>
      <Link href="/" onClick={onClickLogo} className="flex grow justify-center">
        <Image src={logoAnime} alt="logo" className="w-[70%] max-w-250px" />
      </Link>
    </div>
  );
}
