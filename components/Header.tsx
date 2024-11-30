import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = ({ children, className }: HeaderProps) => {
  return (
    <div className={cn("header", className)}>
      <Link href={"/"}>
        <Image
          src={"/assets/icons/logo.svg"}
          alt={"Logo"}
          width={120}
          height={32}
          className="hidden md:block"
        ></Image>
        <Image
          src={"/assets/icons/logo-icon.svg"}
          alt={"Logo"}
          width={32}
          height={32}
          className="mr-2 md:hidden"
        ></Image>
      </Link>
      {children}
    </div>
  );
};

export default Header;
