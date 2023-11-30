"use client";

import { usePrevious } from "@uidotdev/usehooks";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";

import { closeMenu } from "@/lib/menu-store";

import logoCarre from "../../assets/logo-carre.png";
import FooterLinks from "../layout/footer-links";

export default function Menu() {
  const pathName = usePathname();
  const oldPathName = usePrevious(pathName);

  useEffect(() => {
    if (oldPathName != null && oldPathName !== pathName) {
      closeMenu();
    }
  }, [oldPathName, pathName]);

  return (
    <div className="flex grow flex-col gap-7 pb-7 lg:justify-between">
      <div className="lg:border-retro-gray flex grow flex-col lg:h-[1000px] lg:grow-0 lg:border-r lg:pr-4">
        <div className="flex justify-center pb-4 pt-10 lg:hidden">
          <div className="cursor-pointer" onClick={closeMenu}>
            <CloseIcon />
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-[245px]">
            <Image src={logoCarre} alt="logo" className="w-full" />
          </div>
        </div>
        <MenuLink>le rétro projecteur</MenuLink>
        <div className="flex flex-col">
          {[
            ["calendrier", "/"],
            ["chroniques", "/chroniques"],
            ["coups de coeur", "/coeur"],
            ["à propos", "/a-propos"],
            ["recherche", "/recherche"],
          ].map(([section, path]) => (
            <MenuLink key={section} path={path}>
              <Link href={path}>{section}</Link>
            </MenuLink>
          ))}
        </div>
      </div>
      <div className="flex lg:pr-4">
        <FooterLinks color="black" />
      </div>
    </div>
  );
}

function MenuLink({ children, path }: { children: ReactNode; path?: string }) {
  const route = usePathname();
  return (
    <div
      className={classNames(
        "border-retro-gray flex justify-center border-b py-5",
        { "bg-retro-green": path === route },
      )}
    >
      <div className="font-degular text-retro-gray grow whitespace-break-spaces text-center text-5xl font-extrabold uppercase lg:text-4xl">
        {children}
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg
      width="28"
      height="29"
      viewBox="0 0 28 29"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="1.29289"
        y1="27.2216"
        x2="27.2929"
        y2="1.2216"
        stroke="#6A6A6D"
        strokeWidth="2"
      />
      <line
        x1="27.2929"
        y1="27.7071"
        x2="1.29289"
        y2="1.70711"
        stroke="#6A6A6D"
        strokeWidth="2"
      />
    </svg>
  );
}
