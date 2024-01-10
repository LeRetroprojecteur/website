import clsx from "clsx";
import Link from "next/link";
import { ReactNode } from "react";

export default function FooterLinks({
  color,
}: {
  color: "gray" | "black";
  newsletterGreen?: boolean;
}) {
  return (
    <div className="flex grow flex-col gap-y-12px lg:gap-y-10px">
      <LinkBox color={color} bgGreen>
        <Link href="/newsletter">newsletter</Link>
      </LinkBox>
      <LinkBox color={color}>
        <a href="https://www.instagram.com/leretroprojecteur" target="_blank">
          instagram
        </a>
      </LinkBox>
      <LinkBox color={color}>
        <a href="https://twitter.com/RetroProjecteur" target="_blank">
          twitter
        </a>
      </LinkBox>
    </div>
  );
}

function LinkBox({
  children,
  color,
  bgGreen,
}: {
  children: ReactNode;
  color: "gray" | "black";
  bgGreen?: boolean;
}) {
  return (
    <div
      className={clsx("flex justify-center border py-14px lg:py-9px", {
        "bg-retro-green": bgGreen ?? false,
      })}
    >
      <div
        className={clsx("grow whitespace-break-spaces text-center", {
          "text-retro-gray": color === "gray",
          "text-retro-black": color === "black",
        })}
      >
        <div className="text-20px uppercase leading-21px lg:font-semibold">
          {children}
        </div>
      </div>
    </div>
  );
}
